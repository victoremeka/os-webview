import React from 'react';
import {useToggle} from '~/helpers/data';
import userModel from '~/models/usermodel';
import {
    TocOption, WebviewOption, StudyEdgeOption, PdfOption, PrintOption, BookshareOption,
    IbooksOption, KindleOption, CheggOption, OptionExpander
} from './get-this-title-files/options';
import './get-this-title-files/get-this-title.scss';
import linkhelper from '~/helpers/link';

let userInfo;

userModel.load().then((i) => {
    userInfo = i;
});

function AdditionalOptions({model}) {
    return (
        <React.Fragment>
            <BookshareOption model={model} />
            <IbooksOption model={model} />
            <KindleOption model={model} />
        </React.Fragment>
    );
}

export default function GetThisTitle({model}) {
    const additionalOptions = [
        'bookshareLink', 'ibookLink', 'kindleLink'
    ].filter((key) => model[key]).length;
    const [expanded, toggleExpanded] = useToggle(additionalOptions < 1);
    const interceptLinkClicks = React.useCallback(
        (event) => {
            const el = linkhelper.validUrlClick(event);

            if (!el) {
                return;
            }
            const trackThis = userInfo?.accounts_id && el.dataset.track;

            if (trackThis) {
                /* eslint-disable camelcase */
                event.trackingInfo = {
                    book: model.id,
                    account_uuid: userInfo.uuid,
                    book_format: el.dataset.track,
                    contact_id: userInfo.salesforce_contact_id
                };
                /* eslint-enable camelcase */
            }
        },
        [model.id]
    );

    return (
        <div className="get-the-book">
            <div className="get-this-title">
                <div className="options" onClick={interceptLinkClicks} data-analytics-nav="Get the book">
                    <TocOption model={model} />
                    <WebviewOption model={model} />
                    <StudyEdgeOption model={model} />
                    <PdfOption model={model} />
                    <PrintOption model={model} />
                    <CheggOption model={model} />
                    {
                        expanded &&
                            <AdditionalOptions model={model} />
                    }
                    <OptionExpander {...{expanded, additionalOptions}} toggle={toggleExpanded} />
                </div>
            </div>
        </div>
    );
}
