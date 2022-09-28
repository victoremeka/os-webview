import React from 'react';
import useSpecificSubjectContext from './context';
import {useToggle} from '~/helpers/data';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons/faCaretUp';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import {FormattedMessage, useIntl} from 'react-intl';
import useAmazonAssociatesLink from '~/pages/details/common/get-this-title-files//amazon-associates-link';
import {usePrintCopyDialog} from '~/pages/details/common/get-this-title-files/options';
import useActiveElementContext, {ActiveElementContextProvider} from '~/contexts/active-element';
import './book-viewer.scss';

function PrintOption({bookInfo}) {
    const {onClick, PCDialog} = usePrintCopyDialog();
    const amazonDataLink = useAmazonAssociatesLink(bookInfo.slug);
    const {formatMessage} = useIntl();
    const text = formatMessage({id: 'getit.print', defaultMessage: 'Order a print copy'});

    return (
        <a role="menuitem" href="open a dialog" onClick={onClick}>
            {text}
            <PCDialog text={text} amazonDataLink={amazonDataLink} />
        </a>
    );
}

function GetTheBookDropdown({bookInfo}) {
    const [isOpen, toggle] = useToggle();
    const activeElement = useActiveElementContext();
    const ref = React.useRef();
    const {slug} = bookInfo;
    const buttonId = `${slug}-ddb`;
    const menuId = `${slug}-ddm`;
    const webviewLink = bookInfo.webviewRexLink || bookInfo.webviewLink;
    const pdfLink = (bookInfo.highResolutionPdfUrl || bookInfo.lowResolutionPdfUrl);

    React.useLayoutEffect(
        () => {
            if (isOpen && !ref.current.contains(activeElement)) {
                toggle();
            }
        },
        [activeElement, isOpen, toggle]
    );

    return (
        <div className="navmenu" ref={ref}>
            <button
                id={buttonId} type="button" aria-haspopup="true" aria-controls={menuId}
                aria-expanded={isOpen} onClick={() => toggle()}
            >
                <FormattedMessage id="getTheBook" defaultMessage="Get the book" />
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
            </button>
            <div id={menuId} role="menu" aria-labelledby={buttonId}>
                <a role="menuitem" href={webviewLink}>
                    <FormattedMessage id="getit.webview.link" defaultMessage="View online" />
                </a>
                <a role="menuitem" href={pdfLink}>
                    <FormattedMessage id="getit.pdf.download" defaultMessage="Download a PDF" />
                </a>
                <PrintOption bookInfo={bookInfo} />
                <hr />
                <a role="menuitem" href={`/details/${slug}?Instructor resources`}>
                    <FormattedMessage id="tabs.instructorResources" defaultMessage="Instructor resources" />
                </a>
                <a role="menuitem" href={`/details/${slug}?Student resources`}>
                    <FormattedMessage id="tabs.studentResources" defaultMessage="Student resources" />
                </a>
            </div>
        </div>
    );
}

function Book({book: [book]}) {
    const {coverUrl, title, slug} = book;

    return (
        <div className="book-tile">
            <img src={coverUrl} role="presentation" />
            <div className="text-block">
                <a href={`/details/${slug}`}>{title}</a>
            </div>
            <GetTheBookDropdown bookInfo={book} />
        </div>
    );
}

function Category({category: [heading, categoryData]}) {
    const booksObj = categoryData.books;
    const books = Object.values(booksObj);
    const text = categoryData.categoryDescription;

    return (
        <div id={heading} className="category">
            <h2>{heading}</h2>
            <div>{text}</div>
            <div className="books">
                {books.map((b) => <Book key={b.id} book={b} />)}
            </div>
        </div>
    );
}

export default function BookViewer() {
    const {subjects, title} = useSpecificSubjectContext();
    const cats = Object.entries(subjects[title].categories);

    return (
        <ActiveElementContextProvider>
            <section className="book-viewer">
                <div className="content">
                    {cats.map((c) => <Category key={c[0]} category={c} />)}
                </div>
            </section>
        </ActiveElementContextProvider>
    );
}
