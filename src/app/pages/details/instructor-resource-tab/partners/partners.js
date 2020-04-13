import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './partners.html';
import css from './partners.css';
import {on} from '~/helpers/controller/decorators';
import routerBus from '~/helpers/router-bus';
import shuffle from 'lodash/shuffle';
import {tooltipText} from '~/models/salesforce-partners';
import addCallout from '~/components/get-this-title/recommended-callout/recommended-callout';

const spec = {
    template,
    css,
    view: {
        classes: ['partners']
    }
};

class Partners extends componentType(spec) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if ((history.state || {}).partnerTooltip) {
            const callout = addCallout(
                this.el.querySelector('.callout'),
                'Book resources',
                'See technology resources for this book!'
            );
        }
    }

    @on('click a')
    saveBookInHistoryState(event) {
        const destUrl = event.delegateTarget.getAttribute('href');

        routerBus.emit('navigate', destUrl, {
            book: this.bookAbbreviation
        }, true);
    }

}

export default function ({dataPromise, targetEl, bookAbbreviation, title, seeMoreText}) {
    dataPromise.then((pd) => {
        function toBlurb(partner) {
            return {
                image: partner.partner_logo,
                name: partner.partner_name,
                description: partner.short_partner_description,
                cost: partner.affordability_cost,
                type: partner.partner_type,
                url: `/partners?${partner.partner_name}`,
                verifiedFeatures: partner.verified_by_instructor ? tooltipText : false
            };
        }

        const p = new Partners({
            el: targetEl,
            bookAbbreviation,
            model: {
                title,
                seeMoreText,
                blurbs: shuffle(pd).map(toBlurb),
                badgeImage: '/images/partners/verified-badge.svg'
            }
        });
    });
}
