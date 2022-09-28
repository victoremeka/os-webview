import {useEffect} from 'react';
import usePageData from '~/helpers/use-page-data';
import buildContext from '~/components/jsx-helpers/build-context';
import {setPageTitleAndDescriptionFromBookData} from '~/helpers/use-document-head';

const preserveWrapping = false;

function useContextValue(slug) {
    const data = usePageData(`pages/${slug}?type=pages.Subject`, preserveWrapping);

    useEffect(
        () => {
            if (data) {
                setPageTitleAndDescriptionFromBookData(data);
            }
        },
        [data]
    );

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};
