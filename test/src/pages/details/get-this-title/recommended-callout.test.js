import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, screen} from '@testing-library/preact';
import {DetailsContextProvider} from '~/pages/details/context';
import RecommendedCallout from '~/pages/details/common/get-this-title-files/recommended-callout/recommended-callout';

function LangWrapRecommendedCallout({...args}) {
    return (
        <MemoryRouter initialEntries={["/details/books/college-algebra"]}>
            <DetailsContextProvider>
                <RecommendedCallout {...args} />
            </DetailsContextProvider>
        </MemoryRouter>
    );
}

test('defaults to "Recommended" and no blurb', (done) => {
    render(<LangWrapRecommendedCallout />);
    setTimeout(() => {
        expect(screen.getByText('Recommended')).toBeTruthy();
        expect(screen.getByRole('button').nextSibling).toBeNull();
        done();
    }, 0);
});
test('displays custom title', (done) => {
    render(<LangWrapRecommendedCallout title="custom title" />)
    setTimeout(() => {
        expect(screen.getByText('custom title')).toBeTruthy();
        done();
    }, 0);
});
test('displays custom blurb', () => {
    const blurbHtml = '<b>some text</b>';

    render(<LangWrapRecommendedCallout blurb={blurbHtml} />)
    setTimeout(() => {
        expect(screen.getByRole('button').nextSibling).not.toBeNull();
        expect(screen.getByText('some text')).toBeTruthy();
        done();
    }, 0);
})
