import React, {useState, useRef, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function RadioButton({item, isSelected, updateSelected}) {
    const onClick = () => {
        updateSelected(item.value);
    };
    const onKeyDown = (event) => {
        if ([' ', 'Enter'].includes(event.key)) {
            onClick();
        }
    };

    return (
        <div className="filter-button" tabIndex="0"
            role="button" aria-pressed={isSelected(item.value)}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {
                isSelected(item.value) &&
                    <span className="on-mobile filter-by">
                        Filter by:
                    </span>
            }
            <span dangerouslySetInnerHTML={{__html: item.html}} />
            {
                isSelected(item.value) &&
                    <span className="on-mobile">
                        <FontAwesomeIcon icon="chevron-down" />
                    </span>
            }
        </div>
    );
}

export default function ({items, selectedValue, updateSelected}) {
    const isSelected = (val) => {
        return val === selectedValue;
    };

    return (
        <React.Fragment>
            {
                items && items.map((item) => (
                    <RadioButton key={item.value}
                        item={item} isSelected={isSelected} updateSelected={updateSelected} />
                ))
            }
        </React.Fragment>
    );
}