import React, {useState, useEffect} from 'react';
import ErrorTypeSelector from './ErrorTypeSelector.jsx';
import ErrorSourceSelector from './ErrorSourceSelector.jsx';
import ErrorLocationSelector from './ErrorLocationSelector/ErrorLocationSelector.jsx';
import managedInvalidMessage from './InvalidMessage.jsx';
import settings from 'settings';
import shellBus from '~/components/shell/shell-bus';
import routerBus from '~/helpers/router-bus';
import BannedNotice from '../banned-notice/banned-notice';
import css from './form.css';

const sourceNames = {
    tutor: 'OpenStax Tutor'
};

function ErrorExplanationBox() {
    const inputRef = React.createRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    return [
        <div className="question" key="1">Tell us in detail about the error and your suggestion.</div>,
        <div className="subnote wide" key="2">
            Please limit to one error per submission and include a suggested
            resolution if possible. If you have several to report, please
            contact us at <a href="mailto:errata@openstax.org">errata@openstax.org</a>.
        </div>,
        <InvalidMessage key="3" />,
        <textarea maxLength="4000" name="detail" skip="true"
         ref={inputRef} onChange={updateInvalidMessage}
         required key="4"></textarea>
    ];
}

function FileButton({name, parentRef}) {

    const inputRef = React.createRef();
    const [filePath, updateFilePath] = useState('');

    function setFile(event) {
        updateFilePath(event.target.value.replace(/.*\\/, ''));
    }

    function clearFile(event) {
        updateFilePath('');
        inputRef.current.value = null;
    }

    if (settings.testingEnvironment) {
        useEffect(() => {
            console.info('Files:',
                Array.from(parentRef.current.querySelectorAll('[type="file"]'))
                .map((i) => i.value)
            );
        });
    }

    return (
        <div className="file-button">
            <label className="btn" role="button" tabIndex="0">
                {filePath ? 'Change' : 'Add file'}
                <input type="file" className="hidden" name={name} onChange={setFile} ref={inputRef} />
            </label>
            {
                filePath && <span className="file-name">{filePath}</span>
            }
            {
                filePath &&
                <button type="button" className="clear-file" aria-label="Clear file" onClick={clearFile}>
                    <span className="fa fa-times"></span>
                </button>
            }
        </div>
    );
}

function FileUploader({Slot}) {
    const thisRef = React.createRef();

    return (
        <div className="button-group" ref={thisRef}>
            <FileButton name="file_1" parentRef={thisRef} />
            <FileButton name="file_2" parentRef={thisRef} />
            <Slot />
        </div>
    );
}

function SubmitButton({
    formRef,
    updateHasBeenSubmitted,
    submitted,
    submitFailed
}) {

    function doCustomValidation(event) {
        const invalid = formRef.current.querySelector('form :invalid');

        if (invalid) {
            console.info('Stopping due to invalid fields', invalid);
            event.preventDefault();
            updateHasBeenSubmitted(true);
        }
        console.info('It should continue on to the actual submit', event);
    }

    return (
        <div>
            <input type="submit" className="btn" value="Submit" disabled={submitted} onClick={doCustomValidation} />
            {
                submitFailed &&
                <div className="invalid-message">{submitFailed}</div>
            }
        </div>
    );
}


export default function ({model}) {
    const selectedBook = (model.books.find((b) => b.title === model.selectedTitle) || {});
    const [selectedError, updateSelectedError] = useState();
    const [submitted, updateSubmitted] = useState(false);
    const [hasBeenSubmitted, updateHasBeenSubmitted] = useState(false);
    const [submitFailed, updateSubmitFailed] = useState();
    const postEndpoint = `${settings.apiOrigin}${settings.apiPrefix}/errata/`;
    const formRef = React.createRef();
    const validationMessage = (name) => {
        if (!formRef.current) {
            return 'Not yet';
        }
        const el = formRef.current.querySelector(`[name="${name}"]`);

    };
    const helpBoxVisible = () => selectedError === 'Other' ? 'visible' : 'not-visible';
    const initialSource = model.source && sourceNames[model.source.toLowerCase()];

    function onSubmit(event) {
        // Safari cannot handle empty files; Edge cannot manipulate FormData
        // so we remove the file inputs that have no values
        const formEl = event.target;
        const fileInputs = Array.from(formEl.querySelectorAll('[type="file"]'));
        const fiParents = fileInputs.map((el) => el.parentNode);

        console.info('Target?', formEl);
        console.info('File inputs?', fileInputs);
        fileInputs.forEach((el, index) => {
            console.info('Checking', el.value);
            if (el.value === '') {
                console.info('Removing', el);
                el.parentNode.removeChild(el);
            }
        });
        fileInputs.forEach((el, index) => {
            console.info('Setting name');
            el.setAttribute('name', `file_${index+1}`);
        });

        const form = new FormData(formRef.current);

        event.preventDefault();
        // Programmatically post the form
        fetch(postEndpoint, {
            method: 'POST',
            body: form
        }).then((r) => r.json()).then(
            (json) => {
                if (json.id) {
                    updateSubmitted(false);
                    routerBus.emit('navigate', `/confirmation/errata?id=${json.id}`);
                } else if (json.submitted_by_account_id) {
                    shellBus.emit('showDialog', () => ({
                        title: 'Errata submission rejected',
                        content: new BannedNotice({
                            model: {
                                text: json.submitted_by_account_id[0]
                            }
                        })
                    }));
                }
            },
            (fetchError) => {
                updateSubmitFailed(`Submit failed: ${fetchError}.`);
                updateSubmitted(false);
                // Put them back
                fileInputs.forEach((el, i) => {
                    fiParents[i].appendChild(el);
                });
            }
        );
    }

    return (
        <form className={`body-block ${hasBeenSubmitted ? '' : 'hide-errors'}`} method="post" action={postEndpoint}
             encType="multipart/form-data" ref={formRef}
             onSubmit={onSubmit}
         >
            <input type="hidden" name="submitted_by_account_id" value={model.submittedBy} />
            <input type="hidden" name="book" value={selectedBook.id} />
            <ErrorTypeSelector
                selectedError={selectedError}
                updateSelectedError={updateSelectedError}
            />
            <div className={`helpbox ${helpBoxVisible()}`}>
                <span>Need help logging in or have general questions? Contact Support at </span>
                <a href="mailto:support@openstax.org">support@openstax.org</a>.
            </div>
            <ErrorSourceSelector
                initialSource={initialSource}
            />
            <ErrorLocationSelector
                selectedBook={selectedBook}
                defaultValue={model.location}
                readOnly={model.location && model.source}
            />
            <ErrorExplanationBox />
            <div className="question">Please add a screenshot or any other file that helps explain the error.</div>
            <FileUploader
                Slot={() =>
                    <SubmitButton
                        formRef={formRef}
                        updateHasBeenSubmitted={updateHasBeenSubmitted}
                        submitted={submitted}
                    />}
            />
        </form>
    );
}