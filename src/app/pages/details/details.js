import BaseView from '~/helpers/backbone/view';
import PageModel from '~/models/pagemodel';
import Author from './author/author';
import Resource from './resource/resource';
import Contents from './contents/contents';
import Ally from './ally/ally';
import userModel from '~/models/usermodel';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './details.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import {template as strips} from '~/components/strips/strips.hbs';

function dataToTemplateHelper(data) {
    let quotes = data.book_quotes[0],
        result = {
            title: data.title,
            description: data.description,
            endorsement: quotes.quote_text,
            attribution: quotes.quote_author,
            attributionSchool: quotes.quote_author_school,
            topAuthors: data.book_contributing_authors.filter((entry) => entry.display_at_top),
            allAuthors: data.book_contributing_authors
        };

    result.coverUrl = data.cover_url ||
    `https://placeholdit.imgix.net/~text?txtsize=33&txt=${data.title}&w=220&h=220`;

    return result;
}

@props({
    template: template,
    regions: {
        getThisTitle: '.floating-menu .get-this-book',
        topAuthors: '#top-authors',
        allAuthors: '#all-authors',
        instructorResources: '#instructor-resources',
        studentResources: '#student-resources',
        tableOfContents: '.table-of-contents .box',
        allies: '#allies'
    }
})
export default class Details extends BaseView {
    @on('click .table-of-contents-link')
    showTableOfContents(event) {
        this.openedWith = event.target;
        this.el.querySelector('.table-of-contents').classList.toggle('hidden');
        document.body.setAttribute('style', 'overflow:hidden');
        event.preventDefault();
        event.stopPropagation();
    }

    @on('click')
    hideTOC(event) {
        if (event.target !== this.openedWith) {
            this.el.querySelector('.table-of-contents').classList.add('hidden');
            document.body.removeAttribute('style');
        }
    }

    constructor() {
        super(...arguments);
        this.templateHelpers = {strips};
    }

    toggleFixedClass() {
        let floatingMenu = document.querySelector('.floating-menu>.box');

        if (floatingMenu) {
            let footer = document.getElementById('footer');
            let footerPosition = footer.offsetTop;
            let floatingMenuHeight = floatingMenu.offsetHeight+200;
            let menuOffset = footerPosition - floatingMenuHeight;
            let menuTopPosition = Math.round((menuOffset-window.pageYOffset));


            if (window.pageYOffset > menuOffset) {
                floatingMenu.setAttribute('style', `top: ${menuTopPosition}px`);
            } else {
                floatingMenu.removeAttribute('style');
            }
        }
    }

    onRender() {
        this.toggleFixedClass();

        window.addEventListener('scroll', this.toggleFixedClass.bind(this));

        let slug = decodeURIComponent(window.location.search.substr(1)),
            pageModel = new PageModel(),
            insertResources = (resources, regionName) => {
                for (let res of resources) {
                    if (res.link_document) {
                        this.regions[regionName].append(new Resource(res));
                    }
                }
            };

        if (slug === '') {
            slug = window.location.pathname.replace(/.*\//, '');
        }

        this.el.querySelector('.go-to.errata-link').href = `https://openstaxcollege.org/textbooks/${slug}/errata`;

        let showInstructorResources = (resources) => {
                userModel.fetch().then((userData) => {
                    let userInfo = userData[0];

                    if (userInfo && (userInfo.is_staff || userInfo.is_superuser)) {
                        insertResources(resources, 'instructorResources');
                    }
                });
            },
            handbookLink = this.el.querySelector('.handbook-link'),
            setHandbookLink = (linkUrl) => {
                if (linkUrl) {
                    handbookLink.href = linkUrl;
                    handbookLink.parentNode.classList.remove('hidden');
                }
            },
            showTableOfContents = (toc) => {
                if (toc) {
                    for (let entry of toc.contents) {
                        this.regions.tableOfContents.append(new Contents(entry));
                    }
                }
            },
            handleErrataLink = (link) => {
                let tab = this.el.querySelector('.errata-tab'),
                    section = this.el.querySelector('#errata');

                if (link) {
                    section.querySelector('.errata-link').href = link;
                } else {
                    tab.parentNode.removeChild(tab);
                    section.parentNode.removeChild(section);
                }
            },
            handleBasicBookData = (data) => {
                let detailUrl = data.pages[0].meta.detail_url,
                    detailModel = new PageModel(),

                    handleDetailData = (detailData) => {
                        let th = dataToTemplateHelper(detailData);

                        for (let topAuthor of th.topAuthors) {
                            this.regions.topAuthors.append(new Author(topAuthor));
                        }
                        for (let author of th.allAuthors) {
                            this.regions.allAuthors.append(new Author(author));
                        }
                        this.el.querySelector('.book-cover').src = th.coverUrl;
                        this.el.querySelector('.book-info .title').textContent = th.title;
                        this.el.querySelector('.book-info .blurb').innerHTML = th.description;
                        document.getElementById('endorsement').innerHTML = th.endorsement;
                        document.getElementById('attribution').textContent = th.attribution;
                        document.getElementById('attribution-school').textContent = th.attributionSchool;
                        this.gtt = new GetThisTitle(detailData);
                        this.regions.getThisTitle.show(this.gtt);
                        setHandbookLink(detailData.student_handbook_url);
                        showTableOfContents(detailData.table_of_contents);
                        showInstructorResources(detailData.book_faculty_resources);
                        insertResources(detailData.book_student_resources, 'studentResources');
                        handleErrataLink(detailData.errata_link);

                        for (let ally of detailData.book_allies) {
                            let allyTemplateHelper = {
                                name: ally.ally_heading,
                                blurb: ally.ally_short_description,
                                url: ally.book_link_url,
                                linkText: ally.book_link_text,
                                logoUrl: ally.ally_logo
                            };

                            this.regions.allies.append(new Ally(allyTemplateHelper));
                        }
                    };

                detailModel.fetch({url: detailUrl}).then(handleDetailData.bind(this));
            };

        pageModel.fetch({
            data: {type: 'books.Book', slug}
        }).then(handleBasicBookData.bind(this));
    }

    onBeforeClose() {
        window.removeEventListener('scroll', this.toggleFixedClass.bind(this));
    }
}
