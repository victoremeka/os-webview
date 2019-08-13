import GetThisTitle from '~/components/get-this-title/get-this-title';
import {clickElement} from '../../test-utils';
import shellBus from '~/components/shell/shell-bus';
// Biology book details
import details from '../data/details';

describe('GetThisTitle', () => {
    const p = new GetThisTitle(details);

    it('initializes', () => {
        expect(p).toBeTruthy();
    });
    it('handles Print Copy dialog', () => {
        const pcLink = p.el.querySelector('.show-print-submenu');
        const showed = new Promise((resolve) => {
            shellBus.on('showDialog', resolve);
        });

        clickElement(pcLink);
        return showed;
    });
    it('handles hiding and expanding non-preferred formats', () => {
        const expandLink = () => p.el.querySelector('.option.expander');
        const linkCount = () => Array.from(p.el.querySelectorAll('.option a')).length;

        expect(expandLink()).toBeTruthy();
        expect(linkCount()).toBe(5);
        clickElement(expandLink());
        expect(linkCount()).toBe(6);
    });
    it('respects enable_study_edge flag', () => {
        const downloadLink = (component) => component.el.querySelector('.option .show-study-edge');
        const withLinkP = new GetThisTitle(Object.assign(
            {
                enable_study_edge: true
            },
            details
        ));

        expect(downloadLink(p)).toBeFalsy();
        expect(downloadLink(withLinkP)).toBeTruthy();
    });
});
