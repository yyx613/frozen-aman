import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const useAppState = () => {
    const [appState, setAppState] = useState(true);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            handleAppStateChange,
        );

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextState) => {
        if (nextState !== 'active') {
            setAppState(false);
        }

        if (nextState === 'active') {
            setAppState(true);
        }
    };
    return appState;
};

export default useAppState;