import React from 'react';
import Form from './form/form';
import FormSelect from '~/components/form-select/form-select.jsx';
import useErrataFormContext, {ErrataFormContextProvider} from './errata-form-context';
import './errata-form.scss';

function ErrataForm() {
    const {title} = useErrataFormContext();

    return (
        <React.Fragment>
            <div className="hero padded">
                <h1>{`Suggest a correction for ${title}`}</h1>
            </div>
            <div className="form-container text-content">
                <div>
                    <Form />
                </div>
            </div>
        </React.Fragment>
    );
}

function TitleSelector() {
    const {books, setTitle} = useErrataFormContext();
    const options = React.useMemo(
        () => books?.map((book) => ({label: book.title, value: book.title})),
        [books]
    );

    return (
        <div className="text-content title-selector">
            <p>
                It looks like you got referred here but they didn&apos;t tell us what
                book you were looking at.
            </p>
            <FormSelect
                selectAttributes={{
                    placeholder: 'Please select one',
                    onChange(event) {
                        setTitle(event.target.value);
                    }
                }}
                label="What book were you in, again?" options={options} />
        </div>
    );
}

function TitleSelectorOrForm() {
    const {title} = useErrataFormContext();

    return (
        <main className="errata-form page">
            {title ? <ErrataForm /> : <TitleSelector />}
        </main>
    );
}

export default function ContextWrapper() {
    return (
        <ErrataFormContextProvider>
            <TitleSelectorOrForm />
        </ErrataFormContextProvider>
    );
}
