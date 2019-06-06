import componentType from '~/helpers/controller/init-mixin';
import ArticleSummary, {blurbModel} from '../article-summary/article-summary';
import css from './search-results.css';
import {fetchFromCMS} from '~/helpers/controller/cms-mixin';

const spec = {
    css,
    view: {
        classes: ['search-results']
    }
};

const resultSpec = {
    view: {
        classes: ['result']
    }
};

class Result extends ArticleSummary {

    init(...args) {
        super.init(...args);
        Object.assign(this, resultSpec);
    }

}

export default class extends componentType(spec) {

    refreshResults() {
        const searchParam = window.location.search.substr(1);
        const slug = `search/?q=${searchParam}`;

        fetchFromCMS(slug, true).then(
            (results) => {
                this.regions.self.empty();
                results.forEach((data) => {
                    data.heading = data.title;
                    this.regions.self.append(new Result({model: blurbModel(data.slug, data)}));
                });
            },
            (err) => {
                console.warn(`Failed ${slug}:`, err);
            }
        );
    }

    onLoaded() {
        this.boundRR = () => this.refreshResults();
        window.addEventListener('popstate', this.boundRR);
        this.refreshResults();
    }

    onClose() {
        window.removeEventListener('popstate', this.boundRR);
    }

}
