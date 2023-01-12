import LoaderPage from '~/components/jsx-helpers/loader-page';
import React from 'react';
import LazyLoad from 'react-lazyload';
import '~/pages/research/research.scss';
import {Banner, Header} from '~/pages/research/components/header';
import {ResearchSection} from '~/pages/research/components/research-areas';
import {Funders} from '~/pages/research/components/funders';
import {ContactUs} from '~/pages/research/components/contact-us';
import {Publications} from '~/pages/research/components/publications';
import {MembersSection} from '~/pages/research/components/members';

function ResearchPage({data}) {
    return (
        <React.Fragment>
            <Header data={data} />
            <Banner data={data} />
            <ResearchSection data={data} />
            <LazyLoad>
                <Publications data={data} />
            </LazyLoad>
            <LazyLoad>
                <MembersSection data={data} />
            </LazyLoad>
            <LazyLoad>
                <Funders />
                <ContactUs />
            </LazyLoad>
        </React.Fragment>
    );
}

export default function ResearchLoader() {
    return (
        <main className="research page">
            <LoaderPage slug="pages/research" Child={ResearchPage} doDocumentSetup />
        </main>
    );
}
