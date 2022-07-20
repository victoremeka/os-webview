import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AdoptionForm from '~/pages/adoption/adoption';
import {MemoryRouter} from 'react-router-dom';

beforeEach(
    async () => {
        render(
            <MemoryRouter initialEntries={["/details/books/college-algebra", "/adoption"]}>
                <AdoptionForm />
            </MemoryRouter>
        );
        await screen.findByText(/Let us know you're using/);
    }
);

test(
    'creates with role selector',
    () => expect(screen.queryAllByRole('option', {hidden: true})).toHaveLength(8)
);

test(
    'form appears when role is selected',
    async () => {
        const listBox = screen.queryByRole('listbox');

        userEvent.click(listBox);
        const options = await screen.findAllByRole('option', {hidden: true});
        const instructorOption = options.find((o) => o.textContent === 'Instructor');
        userEvent.click(instructorOption);
        await screen.findByRole('form');
    }
)
