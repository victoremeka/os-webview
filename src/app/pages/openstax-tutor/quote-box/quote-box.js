import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './quote-box.scss';

export default function QuoteBox({model: {quote}}) {
    return (
        <section className="quote-box-section">
            <div className="boxed">
                <RawHTML className="quote-box" html={quote} />
            </div>
        </section>
    );
}
