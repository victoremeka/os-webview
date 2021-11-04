import {useEffect, useMemo} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {useUserModel} from '~/models/usermodel';
import debounce from 'lodash/debounce';

const debouncedDebug = debounce((...args) => console.debug(...args), 100);

function checkUserForProblems(user) {
    if (!user || Reflect.ownKeys(user).length === 0) {
        debouncedDebug('No user info retrieved');
    } else if (!('pending_verification' in user)) {
        debouncedDebug('No pending_verification flag set in user info', user);
    } else {
        debouncedDebug('User info:', {
            email: user.email,
            pendingVerification: user.pending_verification,
            groups: user.groups
        });
    }
}

// eslint-disable-next-line complexity
function getUserStatus(user={}) {
    const isInstructor = user.username && 'groups' in user && user.groups.includes('Faculty');
    const isStudent = user.username && !isInstructor;

    checkUserForProblems();
    return {
        isInstructor,
        isStudent,
        pendingVerification: user.pending_verification,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        userInfo: user
    };
}

function useContextValue() {
    const model = useUserModel();
    const userStatus = getUserStatus(model);
    const value = useMemo(
        () => model?.last_name ?
            {
                accountId: model.id,
                userName: `${model.first_name} ${model.last_name.substr(0, 1)}.`,
                userModel: model,
                uuid: model.uuid,
                userStatus
            } : {userStatus},
        [model, userStatus]
    );

    useEffect(() => {
        if (model && model.id) {
            pi('identify_client', model.id);
        }
    }, [model]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as UserContextProvider
};