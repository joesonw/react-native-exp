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
            let db;
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
                }
                return database.createDatabase();
            }).then(res => {
                console.log(res);
                const chatRemote = {
                    headers: {
                        Cookie: cookie.cookie_name + 
                            '=' + cookie.session_id

                    },
                    url: config.remoteUrl + '/chat'
                };
                database.replicate('chat', chatRemote, true);
                database.replicate(chatRemote, 'chat', true);
                
                return database.getChanges(); 
            }).then(res => {
                Async({
                    username: action.username,
                    seq: res.last_seq
                });
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
                .set('username', action.data.username)
                .set('seq', action.data.seq)
                .set('head', action.data.head)
        default:
            return state;
    }
});


export default UserStore;