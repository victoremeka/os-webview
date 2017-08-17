import GetThisTitle from '~/components/get-this-title/get-this-title';
import {clickElement} from '../../test-utils';
// Biology book details
import details from '../data/details';

describe('GetThisTitle', () => {
    const p = new GetThisTitle(details);

    it('initializes', () => {
        expect(p).toBeTruthy();
    });

    it('hides bulk orders', () => {
        const boLink = p.el.querySelector('a[href^="/bulk-order"]');

        expect(boLink).toBeNull();
    });

    it('shows links', () => {
        for (const url of [details.bookstore_link, details.webview_link, details.ibook_link]) {
            const link = p.el.querySelector(`[href="${url}"]`);

            expect(link).toBeTruthy();
        }
    });
    it('handles PDF click', () => {
        const pdfLink = p.el.querySelector('.show-pdf-submenu');

        clickElement(pdfLink);
        expect(p.model.submenu).toBe('pdf');
    });
    it('handles Print Copy click', () => {
        const pcLink = p.el.querySelector('.show-print-submenu');

        clickElement(pcLink);
        expect(p.model.submenu).toBe('print');
    });
});
