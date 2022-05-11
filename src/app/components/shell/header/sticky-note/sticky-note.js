import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePutAway} from '../../shared.jsx';
import './sticky-note.scss';

export default function StickyNote({stickyData}) {
    const [closed, PutAway] = usePutAway();

    if (!stickyData || closed || stickyData.mode !== 'emergency') {
        return null;
    }

    return (
        <div className="sticky-note">
            <div className="text-content" role="alert">
                <PutAway />
                <RawHTML className="html-content" html={stickyData.emergency_content} />
            </div>
        </div>
    );
}
