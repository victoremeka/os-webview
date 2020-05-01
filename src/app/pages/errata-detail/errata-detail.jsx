import React, {useState, useEffect} from 'react';
import {ProgressBar} from './progress-bar/progress-bar.jsx';
import {Detail} from './detail/detail.jsx';
import cmsFetch from '~/models/cmsFetch';
import {getDisplayStatus, getDetailModel} from '~/helpers/errata';
import './errata-detail.css';

async function getPageData(slug) {
    console.log('Before fetch');
    const detail = await cmsFetch(slug);

    console.log('Fetched', detail);
    if (detail.created) {
        const detailModel = await getDetailModel(detail);
        const {status, barStatus} = getDisplayStatus(detail);

        return {
            detailModel,
            status,
            barStatus
        };
    }
    window.location = '/404';
    return null;
}

export default function ({slug}) {
    const [pageData, updatePageData] = useState();

    useEffect(() => {
        getPageData(slug).then(updatePageData);
    }, []);

    return (
        <React.Fragment>
            <div class="hero padded"><h1>Errata Submission Details</h1></div>
            <div class="boxed">
                {
                    pageData &&
                    <React.Fragment>
                        <div className="progress-bar-container body-block">
                            <ProgressBar status={pageData.status} barStatus={pageData.barStatus} />
                        </div>
                        <div className="errata-detail-block">
                            <Detail detail={pageData.detailModel.detail}
                                showDecisionDetails={pageData.detailModel.showDecisionDetails} />
                        </div>
                    </React.Fragment>
                }
            </div>
        </React.Fragment>
    );
}