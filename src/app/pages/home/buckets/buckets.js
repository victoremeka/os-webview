import React from 'react';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './buckets.scss';

function Bucket({bucketClass, image, hasImage, heading, content, link, cta}) {
    const classList = ['bucket', bucketClass, image.alignment].join(' ');

    return (
        <div className={classList}>
            {
                hasImage &&
                    <div
                        className="image"
                        role="img" aria-label={image.alt_text || 'need alt text'}
                        style={`background-image: url('${image.image}')`}
                    />
            }
            <div className="quote">
                <div>
                    <span className="title">{heading}</span>
                    <RawHTML className="blurb" html={content} />
                </div>
                <LinkWithChevron href={link} children={cta} />
            </div>
        </div>
    );
}

export default function ({bucketModels}) {
    return (
        <div className="buckets-section">
            {
                bucketModels.map((model) =>
                    <Bucket {...model} key={model.content} />
                )
            }
        </div>
    );
}
