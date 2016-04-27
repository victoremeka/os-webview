import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './book.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';

@props({
    template: template,
    regions: {
        getThis: '.get-this-title-container'
    }
})
export default class Book extends BaseView {

    @on('click img')
    selectMe(event) {
        this.el.querySelector('.cta>.btn').click(event);
    }

    constructor(data, model) {
        super();

        this.templateHelpers = {
            coverUrl: data.cover_url || `https://placeholdit.imgix.net/~text?txtsize=33&txt=${data.title}&w=220&h=220`,
            slug: data.slug
        };
        this.data = data;
        this.model = model;

        this.model.on('change:selectedBook', () => this.setState());
    }

    setState() {
        this.el.classList.toggle('selected', this.model.get('selectedBook') === this.data);
    }

    onRender() {
        this.el.classList.add('cover');
        this.regions.getThis.append(new GetThisTitle(this.data));
        this.setState();

        if (this.data.webview_link === '') {
            this.el.classList.add('coming-soon');
        }
    }

    isSelected() {
        return this.model.get('selectedBook') === this.data;
    }

}
