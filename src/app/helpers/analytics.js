import Backbone from 'backbone';
import settings from 'settings';
import linkHelper from '~/helpers/link';

class Analytics {

    constructor() {
        this.setupGA();
        this.setupGTM();
    }

    setupGA() {
        window.GoogleAnalyticsObject = 'ga';
        window.ga = {
            q: [['create', settings.analyticsID, 'auto']],
            l: Date.now()
        };
    }

    setupGTM() {
        (function (w, d, s, l, i) {
            // Disable ESLint rules since we're copying Google's script
            /* eslint max-params: 0 */
            /* eslint eqeqeq: 0 */
            /* eslint prefer-template: 0 */

            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });

            let f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l !== 'dataLayer' ? '&l=' + l : '';

            j.async = true;
            j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', settings.tagManagerID);
    }

    send(fragment) {
        /* eslint global-require: 0 */

        let frag = fragment || Backbone.history.fragment;

        if (!(/^\//).test(frag)) {
            frag = `/${frag}`;
        }

        System.import('~/helpers/google-analytics').then((m) => {
            let ga = m.ga;

            ga('send', 'pageview', frag);
        });
    }

    record(href) {
        if (linkHelper.isPDF(href)) {
            this.send();
        }
    }

}

let analytics = new Analytics();

export default analytics;
