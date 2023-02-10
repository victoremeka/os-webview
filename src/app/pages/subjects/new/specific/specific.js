import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useSpecificSubjectContext, {SpecificSubjectContextProvider} from './context';
import JITLoad from '~/helpers/jit-load';
import Navigator from './navigator';
import {NavigatorContextProvider} from './navigator-context';
import {WindowContextProvider} from '~/contexts/window';
import TranslationSelector from './translation-selector';
import SubjectIntro from './subject-intro';
import BookViewer from './book-viewer';
import {TutorAdThatTakesData} from '../tutor-ad';
import LazyLoad from 'react-lazyload';
import AboutOpenStax from '../about-openstax';
import {InfoBoxes} from '../info-boxes';
import usePageData from '~/helpers/use-page-data';
import useLanguageContext from '~/contexts/language';
import cn from 'classnames';
import './specific.scss';

const importPhilanthropicSupport = () => import('../philanthropic-support.js');
const importLearnMore = () => import('./learn-more.js');
const importWebinars = () => import('./webinars.js');
const importBlogPosts = () => import('./blog-posts.js');

// Had to make this layer to use the context
function Translations() {
    const {translations: [translations]} = useSpecificSubjectContext();

    return (
        <TranslationSelector translations={translations} />
    );
}

function TutorAd() {
    const {tutorAd} = useSpecificSubjectContext();

    if (!tutorAd.content) {
        return null;
    }
    const {
        content: {image, heading, adHtml: html, linkHref: ctaLink, linkText: ctaText}
    } = tutorAd;

    return (
        <TutorAdThatTakesData {...{heading, image, html, ctaLink, ctaText}} />
    );
}

function SpecificSubjectAboutOpenStax() {
    const {aboutOs} = useSpecificSubjectContext();

    return (
        <AboutOpenStax
            aboutOs={aboutOs.content}
        />
    );
}

function SpecificSubjectInfoBoxes() {
    const {infoBoxes} = useSpecificSubjectContext();

    return (
        <InfoBoxes infoBoxes={infoBoxes[0]} />
    );
}

function SubjectInContext({subject}) {
    return (
        <SpecificSubjectContextProvider contextValueParameters={subject.value}>
            <WindowContextProvider>
                <NavigatorContextProvider>
                    <div className="subject-specific">
                        <div className="content">
                            <Navigator subject={subject} />
                            <div className={cn('targets', `${subject?.color}-stripe`)}>
                                <Translations />
                                <SubjectIntro subjectName={subject.html} />
                                <BookViewer />
                                <LazyLoad once offset={100} height={400}>
                                    <TutorAd />
                                </LazyLoad>
                                <section id="blog-posts" className="blog-posts">
                                    <LazyLoad once offset={100} height={400} className="content">
                                        <JITLoad importFn={importBlogPosts} />
                                    </LazyLoad>
                                </section>
                                <section id="webinars" className="webinars">
                                    <LazyLoad once offset={100} height={400} className="content">
                                        <JITLoad importFn={importWebinars} />
                                    </LazyLoad>
                                </section>
                                <section id="learn" className="learn-more">
                                    <LazyLoad once offset={100} height={400} className="content">
                                        <JITLoad importFn={importLearnMore} />
                                    </LazyLoad>
                                </section>
                                <LazyLoad once offset={100} height={400}>
                                    <SpecificSubjectAboutOpenStax />
                                </LazyLoad>
                                <LazyLoad once offset={100} height={400}>
                                    <SpecificSubjectInfoBoxes />
                                </LazyLoad>
                                <LazyLoad once offset={100} height={400}>
                                    <JITLoad importFn={importPhilanthropicSupport} />
                                </LazyLoad>
                            </div>
                        </div>
                    </div>
                </NavigatorContextProvider>
            </WindowContextProvider>
        </SpecificSubjectContextProvider>
    );
}

function useFoundSubject() {
    const {subject} = useParams();
    const categories = useSubjectCategoryContext();
    const foundSubject = React.useMemo(
        () => categories.find((c) => c.value === subject),
        [subject, categories]
    );

    return foundSubject;
}

function useConsistentLanguage(subject, foundSubject) {
    const pageData = usePageData(`pages/${subject}`);
    const {setLanguage} = useLanguageContext();

    React.useEffect(
        () => {
            if (!foundSubject && pageData?.meta?.locale) {
                setLanguage(pageData.meta.locale);
            }
        },
        [foundSubject, pageData, setLanguage]
    );
}

export default function LoadSubject() {
    const {subject} = useParams();
    const foundSubject = useFoundSubject();
    const navigate = useNavigate();

    useConsistentLanguage(subject, foundSubject);

    if (!foundSubject) {
        navigate('/subjects');
        return null;
    }

    return (
        <SubjectInContext subject={foundSubject} />
    );
}
