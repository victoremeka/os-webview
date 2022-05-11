import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import cookie from '~/helpers/cookie';
import { createStoreon } from 'storeon';
import { StoreContext } from 'storeon/preact';
import user from '~/pages/my-openstax/store/user';
import useAccount from '~/pages/my-openstax/store/use-account';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useHistory} from 'react-router-dom';
import './welcome.scss';

function WalkthroughButtons({welcomeDone}) {
    const history = useHistory();

    function goToMyOpenStax() {
        welcomeDone();
        window.setTimeout(() => {
            history.push('/');
        }, 100);
    }

    function skipWalkthrough() {
        cookie.setKey('walkthroughDone');
        goToMyOpenStax();
    }

    function showWalkthrough() {
        window.localStorage.showMyOpenStaxWalkthrough = true;
        goToMyOpenStax();
    }

    return (
        <div className="button-row">
            <button onClick={skipWalkthrough}>Skip walkthrough</button>
            <button className="primary" onClick={showWalkthrough}>Show me around</button>
        </div>
    );
}

function CloseButton({welcomeDone}) {
    return (
        <div className="button-row">
            <button className="primary" onClick={welcomeDone}>Close</button>
        </div>
    );
}

const HOUR_IN_MS = 3600000;

function dialogData(isNew, isFaculty, firstName) {
    if (isNew) {
        return isFaculty ?
            {
                title: `Welcome to OpenStax, ${firstName}!`,
                body: `<p>Your books, additional resources, and profile information are
                saved here.</p>
                <p>To get a quick walkthrough of My OpenStax, click “Show me around” –
                or skip the tour and explore on your own.</p>`,
                walkthrough: true
            } :
            {
                title: `Thanks, ${firstName}!`,
                body: `You’re just clicks away from accessing free textbooks and
                resources. Take full advantage of your OpenStax account by using
                features like highlighting and notetaking in our digital reading
                experience.`,
                walkthrough: false
            };
    }
    return isFaculty ?
        {
            title: `Welcome back, ${firstName}!`,
            body: `<p>Your account has been upgraded to <b>My OpenStax</b>, a new, personalized
            dashboard to help you navigate our website.</p>
            <p>Take a quick walkthrough of My OpenStax, or skip this and explore on your own.</p>`,
            walkthrough: true
        } : null;
}

function CustomDialog({data, welcomeDone}) {
    const [Dialog] = useDialog(true);

    return (
        <Dialog className="welcome-dialog" title={data.title} afterClose={welcomeDone}>
            <RawHTML html={data.body} />
            {data.walkthrough ?
                <WalkthroughButtons welcomeDone={welcomeDone} /> :
                <CloseButton welcomeDone={welcomeDone} />}
        </Dialog>
    );
}

function Welcome() {
    const [showWelcome, welcomeDone] = React.useReducer(
        () => cookie.setKey('hasBeenWelcomed'),
        !cookie.hash.hasBeenWelcomed
    );
    const {createdAt, firstName, role} = useAccount();

    if (!showWelcome || !firstName) {
        return null;
    }

    const elapsedHours = (Date.now() - new Date(createdAt)) / HOUR_IN_MS;
    const isNew = elapsedHours < 1000; // *** CHANGE THIS TO LIKE 24
    const isFaculty = role === 'Faculty';
    const data = dialogData(isNew, isFaculty, firstName);

    return (
        <CustomDialog data={data} welcomeDone={welcomeDone} />
    );
}

export default function WelcomeStoreWrapper() {
    const store = createStoreon([user]);

    return (
        <StoreContext.Provider value={store}>
            <Welcome />
        </StoreContext.Provider>
    );
}
