import {createStore } from 'redux';
import {Map } from 'immutable';

const defaultState = Map({
    ContactListScrollPosition: 0
});

const GlobalStore = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'Set':
            return state.set(action.key, action.value);
        default:
            return state;
    }
});

export default GlobalStore;