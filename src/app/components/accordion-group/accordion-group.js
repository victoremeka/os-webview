import React, {useState, useRef} from 'react';
import $ from '~/helpers/$';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel
} from 'react-accessible-accordion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import './accordion-group.scss';

function useChevronDirection(forwardOnChange, preExpanded) {
    const [openTabs, updateOpenTabs] = useState([...preExpanded]);

    function chevronDirection(uuid) {
        return openTabs.includes(uuid) ? 'up' : 'down';
    }

    function onChange(newOpenTabs) {
        if (forwardOnChange) {
            forwardOnChange(newOpenTabs);
        }
        updateOpenTabs(newOpenTabs);
    }

    return [chevronDirection, onChange];
}

function TitleBar({title, titleTag, chevronDirection}) {
    const icon = ({
        down: faChevronDown,
        up: faChevronUp
    })[chevronDirection];

    return (
        <AccordionItemHeading aria-level="2">
            <AccordionItemButton className="accordion-button">
                <div className="label">
                    {title}
                    {
                        titleTag &&
                            <span className="title-tag">{titleTag}</span>
                    }
                </div>
                <div className="chevron">
                    <FontAwesomeIcon icon={icon} />
                </div>
            </AccordionItemButton>
        </AccordionItemHeading>
    );
}

function toUuid(name) {
    return name.replace(/\W+/g, '_');
}

function Item({title, titleTag, checkChevronDirection, contentComponent}) {
    const uuid = toUuid(title);
    const chevronDirection = checkChevronDirection(uuid);

    return (
        <AccordionItem uuid={uuid} className="accordion-item">
            <TitleBar {...{title, titleTag, chevronDirection}} />
            <AccordionItemPanel className="content-pane">
                {contentComponent}
            </AccordionItemPanel>
        </AccordionItem>
    );
}

export default function AccordionGroup({
    items,
    accordionProps={allowZeroExpanded: true},
    noScroll=false,
    forwardOnChange,
    preExpanded=[]
}) {
    const root = useRef();
    const preExpandedUuids = preExpanded.map(toUuid);
    const [chevronDirection, onChange] = useChevronDirection(forwardOnChange, preExpandedUuids);
    const scrollAndChangeChevronPlus = React.useCallback(
        (...args) => {
            if (!noScroll) {
                window.setTimeout(
                    () => {
                        const openItem = root.current?.querySelector('[aria-expanded="true"]');

                        $.scrollTo(openItem);
                    },
                    20
                );
            }
            onChange(...args);
        },
        [onChange, noScroll]
    );

    return (
        <div ref={root}>
            <Accordion
                {...accordionProps}
                onChange={scrollAndChangeChevronPlus}
                className="accordion-group"
                preExpanded={preExpandedUuids}
            >
                {
                    items.map((item) =>
                        item.inline ||
                            <Item key={item.title} {...item} checkChevronDirection={chevronDirection} />
                    )
                }
            </Accordion>
        </div>
    );
}
