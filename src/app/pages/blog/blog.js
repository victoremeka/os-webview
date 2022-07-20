import React, {useEffect} from 'react';
import useBlogContext, {BlogContextProvider} from './blog-context';
import {Switch, Route, useLocation, useParams} from 'react-router-dom';
import {WindowContextProvider} from '~/contexts/window';
import PinnedArticle from './pinned-article/pinned-article';
import DisqusForm from './disqus-form/disqus-form';
import MoreStories from './more-stories/more-stories';
import SearchBar, {HeadingAndSearchBar} from './search-bar/search-bar';
import SearchResults from './search-results/search-results';
import LatestBlogPosts from './latest-blog-posts/latest-blog-posts';
import {ArticleFromSlug} from './article/article';
import GatedContentDialog from './gated-content-dialog/gated-content-dialog';
import timers from './timers';
import './blog.scss';

function Document({title}) {
    useEffect(
        () => {document.title = title;},
        [title]
    );

    return null;
}

export function SearchResultsPage() {
    return (
        <React.Fragment>
            <Document title="OpenStax Blog Search" />
            <div className="boxed left">
                <SearchBar />
            </div>
            <SearchResults />
        </React.Fragment>
    );
}

// Exported so it can be tested
export function MainBlogPage() {
    const {pinnedStory} = useBlogContext();

    return (
        <WindowContextProvider>
            <Document title="OpenStax News" />
            <div className="boxed">
                <HeadingAndSearchBar>
                    <h1>OpenStax Blog</h1>
                </HeadingAndSearchBar>
                <PinnedArticle />
                <MoreStories exceptSlug={pinnedStory && pinnedStory.meta.slug} />
            </div>
        </WindowContextProvider>
    );
}

// Export so it can be tested
export function ArticlePage() {
    const {slug} = useParams();
    const [articleData, setArticleData] = React.useState();

    useEffect(
        () => window.scrollTo(0, 0),
        [slug]
    );

    return (
        <WindowContextProvider>
            <ArticleFromSlug slug={`news/${slug}`} onLoad={setArticleData} />
            <DisqusForm />
            <div className="boxed">
                <MoreStories exceptSlug={slug} />
            </div>
            <GatedContentDialog articleData={articleData} />
        </WindowContextProvider>
    );
}

export default function LoadBlog() {
    const location = useLocation();

    useEffect(() => {
        timers.start();

        return () => timers.clear();
    }, [location]);

    return (
        <main className="blog page">
            <BlogContextProvider>
                <Switch>
                    <Route exact path="/blog">
                        {
                            location.search ? <SearchResultsPage /> : <MainBlogPage />
                        }
                    </Route>
                    <Route path="/blog/latest">
                        <LatestBlogPosts />
                    </Route>
                    <Route path="/blog/:slug">
                        <ArticlePage />
                    </Route>
                </Switch>
            </BlogContextProvider>
        </main>
    );
}
