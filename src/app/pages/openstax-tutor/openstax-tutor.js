import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './openstax-tutor.html';

export default class Tutor extends CMSPageController {

    // TODO Update description
    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        const availableUrl = '/images/openstax-tutor/available-flag.svg';
        const unavailableUrl = '/images/openstax-tutor/unavailable-flag.svg';
        const availableImageData = {url: availableUrl, description: 'available'};
        const unavailableImageData = {url: unavailableUrl, description: 'not available'};

        this.template = template;
        this.view = {
            classes: ['openstax-tutor-page', 'page']
        };
        this.css = '/app/pages/openstax-tutor/openstax-tutor.css';
        this.model = {
            footerStarted: {
                url: '#',
                text: 'Get Started',
                description: 'Try OpenStax Tutor today.'
            },
            footerSignUp: {
                url: '#',
                text: 'Sign Up',
                description: 'Join an OpenStax Tutor webinar to answer all your questions'
            },
            frontier: false,
            howItWorks: {
                blurbs: [
                    {
                        iconDescription: 'Learning icon',
                        headline: 'Personalized learning',
                        description: 'based on each student’s understanding of the text',
                        imageUrl: '/images/openstax-tutor/personalized.svg'
                    },
                    {
                        iconDescription: 'Feedback icon',
                        headline: 'Algorithms provide feedback',
                        description: 'meaning the student gets the right help, right now',
                        imageUrl: '/images/openstax-tutor/two-step.svg'
                    },
                    {
                        iconDescription: 'People icon',
                        headline: 'Personalized questions',
                        description: 'focus on the topics each student needs the most help with',
                        imageUrl: '/images/openstax-tutor/personalized.svg'
                    },
                    {
                        iconDescription: '$10 icon',
                        headline: '$10',
                        description: 'per student per semester. Yes, really.',
                        imageUrl: '/images/openstax-tutor/ten-dollar-bill.svg'
                    }
                ]
            },
            whatStudentsGet: {
                currentImageDescription: 'some image description',
                currentImageCaption: 'Learning algorithms show where students struggle, then' +
                ' refocus efforts accordingly',
                images: [
                    {description: 'first image', url: '#', caption: 'some text below'},
                    {description: 'second image', url: '#', caption: 'some text below 2'},
                    {description: 'third image', url: '#', caption: 'some text below 3'},
                    {description: 'fourth image', url: '#', caption: 'some text below 4'}
                ]

            },
            featureMatrix: {
                availableIcon: availableUrl,
                unavailableIcon: unavailableUrl,
                featurePairs: [
                    [{text: 'Integrated digital textbook', image: availableImageData},
                     {text: 'Student Performance Forecast', image: availableImageData}],
                    [{text: 'Video', image: availableImageData},
                     {text: 'Full LMS Integration', value: 'Nope but we may have this in the future'}],
                    [{text: 'Assignable Questions', image: availableImageData},
                     {text: 'Conditional Release of Assignments', image: unavailableImageData}],
                    [{text: 'Spaced Practice', image: availableImageData},
                     {text: 'Sig/Fig Tolerance Adjustments', image: unavailableImageData}],
                    [{text: 'Personalized Questions', image: availableImageData},
                        {
                            text: 'Ability to Add Own Questions',
                            value: 'Sort of. You can add external assignments in the form of X.'
                        }],
                    [{text: 'Student Performance Analytics', image: availableImageData},
                     {text: 'Ability to Delete Questions', image: availableImageData}],
                    [{text: 'Easy to Build Assignments', image: availableImageData},
                     {text: 'Open Ended Responses', image: availableImageData}],
                    [{text: 'Print Function', image: availableImageData},
                     {text: 'Cost', value: '$10'}],
                    [{text: 'Permanent Access to Textbook Content', image: availableImageData},
                     {}]
                ],
                availableBooks: [
                    {description: 'College Physics cover', url: '#'},
                    {description: 'Biology cover', url: '#'},
                    {description: 'Sociology 2e cover', url: '#'}
                ]
            },
            whereMoneyGoes: {
                items: [
                    {amount: 5, description: 'Pays for our engineers and researchers'},
                    {amount: 3, description: 'Pays for authors to keep content current'},
                    {amount: 1, description: 'Pays for our customer service posse'},
                    {amount: 1, description: 'Pays for, well, this'}
                ]
            },
            faq: {
                headline: 'Ask your questions now, you won’t have any later! '
            },
            learnMore: {
                buttons: []
            }
        };
        this.slug = 'pages/tutor-marketing';
    }

    onDataLoaded() {
        const data = this.pageData;

        document.title = `${data.title} - OpenStax`;
        Object.assign(this.model, data);
        this.model.footerHeight = 'collapsed';
        this.update();
        this.model.frontier = {
            headline: data.section_1_heading,
            subhead: data.section_1_subheading,
            description: data.section_1_paragraph,
            learnMore: {
                href: data.section_1_cta_link,
                text: data.section_1_cta_text
            }
        };
        Object.assign(this.model.howItWorks, {
            headline: data.section_2_heading,
            subhead: data.section_2_subheading,
            description: data.section_2_paragraph
        });
        Object.assign(this.model.whatStudentsGet, {
            headline: data.section_3_heading,
            description: data.section_3_paragraph,
            videos: data.marketing_videos.map((v) => ({
                description: v.video_blurb,
                url: v.video_url
            })),
            selectedVideoIndex: 0
        });
        Object.assign(this.model.featureMatrix, {
            headline: data.section_4_heading,
            availability: data.section_4_book_heading,
            availableBooks: data.marketing_books.map((b) => ({
                description: b.title,
                url: b.cover_url
            }))
        });
        Object.assign(this.model.whereMoneyGoes, {
            headline: data.section_5_heading,
            description: data.section_5_paragraph
        });
        Object.assign(this.model.faq, {
            items: data.faqs
        });
        Object.assign(this.model.learnMore, {
            headline: data.section_7_heading,
            subhead: data.section_7_subheading,
            buttons: [
                {
                    text: data.section_7_cta_text_1,
                    description: data.section_7_cta_blurb_1,
                    url: data.section_7_cta_link_1
                },
                {
                    text: data.section_7_cta_text_2,
                    description: data.section_7_cta_blurb_2,
                    url: data.section_7_cta_link_2
                }
            ].filter((obj) => obj.text) // only keep the ones with text values
        });

        this.update();
        $.insertHtml(this.el, this.model);

        let lastYOffset = 0;

        this.handleScroll = (event) => {
            const newYOffset = window.pageYOffset;

            if (lastYOffset < 100 && newYOffset >= 100) {
                this.model.footerHeight = null;
                this.update();
            }
            if (lastYOffset >= 100 && newYOffset < 100) {
                this.model.footerHeight = 'collapsed';
                this.update();
            }
            lastYOffset = newYOffset;
        };

        window.addEventListener('scroll', this.handleScroll);
    }

    onClose() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    @on('click .toggled-item[aria-role="button"]')
    toggleItem(event) {
        const index = event.delegateTarget.dataset.index;
        const item = this.model.faq.items[index];

        item.isOpen = !item.isOpen;
        this.update();
    }

    @on('click .viewer [role="button"][data-decrement]')
    decrementVideoIndex() {
        if (this.model.whatStudentsGet.selectedVideoIndex > 0) {
            --this.model.whatStudentsGet.selectedVideoIndex;
            this.update();
        }
    }

    @on('click .viewer [role="button"][data-increment]')
    incrementVideoIndex() {
        const wsg = this.model.whatStudentsGet;

        if (wsg.selectedVideoIndex < wsg.videos.length - 1) {
            ++wsg.selectedVideoIndex;
            this.update();
        }
    }

}
