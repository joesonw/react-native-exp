import {createStore } from 'redux';
import {Map, List } from 'immutable';
import {Async }  from '../actions/User';
import {Clear } from '../actions/Route';
import config from '../config';
import database from '../database'

const defaultState = Map({
});

const UserStore = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'Login':
            let cookie;
            fetch(config.authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: action.username,
                    password: action.password
                })
            }).then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            }).then(res => {
                if (res) {
                    cookie = res;
                    return database.createDatabase();
                }
            }).then(res => {
                if (res) {
                    const chatRemote = {
                        headers: {
                            Cookie: cookie.chat.cookie_name + '=' + cookie.chat.session_id
                        },
                        url: config.chatUrl
                    };
                    database.replicate('chat', chatRemote, true);
                    database.replicate(chatRemote, 'chat', true);
                    Async({
                        username: action.username
                    });
                }
            })
            return state;
        case 'ChangePassword':
            setTimeout(() => {

            }, 500);
        case 'Logout':
            Clear();
            return defaultState;
        case 'Async':
            return state
                .set('username', action.data.username);
        default:
            return state;
    }
});


export default UserStore;