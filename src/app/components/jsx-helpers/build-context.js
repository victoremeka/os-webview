import React from 'react';

export default function buildContext({
    defaultValue={},
    useContextValue
}) {
    const Context = React.createContext(defaultValue);

    function useContext() {
        return React.useContext(Context);
    }

    function ContextProvider({children}) {
        const value = useContextValue();

        if (typeof value === 'undefined') {
            return null;
        }

        return (
            <Context.Provider value={value}>
                {children}
            </Context.Provider>
        );
    }

    return {useContext, ContextProvider};
}