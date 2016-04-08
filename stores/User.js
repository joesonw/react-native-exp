import {createStore } from 'redux';
import {Map, List } from 'immutable';
import {Async }  from '../actions/User';
import {Clear } from '../actions/Route';

const defaultState = Map({
});

const UserStore = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'Login':
            setTimeout(() => {
                Async({
                    username: 'JoesonW',
                    version: '0.0.1',
                    head: 'https://cdn.tutsplus.com/net/uploads/2013/08/github-collab-retina-preview.gif'
                });
            }, 500);
            return state;
        case 'ChangePassword':
            setTimeout(() => {

            }, 500);
        case 'Logout':
            Clear();
            return defaultState;
        case 'Async':
            return state
                .set('username', action.data.username)
                .set('version', action.data.version)
                .set('head', action.data.head)
        default:
            return state;
    }
});


export default UserStore;