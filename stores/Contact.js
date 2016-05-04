import {createStore } from 'redux';
import {List, Map } from 'immutable';
import {Async, Refresh } from '../actions/Contact';
import database from '../database';
import config from '../config';
import UserStore from './User';
import * as User from '../actions/User';
import _ from 'lodash'

const defaultState = List();

function poll(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.timeout =  30 * 60 * 1000;
    xhr.responseType = 'blob';
    xhr.onload = (res, e) => {
        console.log(xhr, res, e)
    };
    xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
            const user = UserStore.getState();
            User.Async({
                username: user.get('username'),
                seq: user.get('seq') + 1
            })
            Refresh();
        }
    }
    xhr.ontimeout = () => {
        console.log('timeout')
        poll(url);
    }
    xhr.open('GET', url, true);
    xhr.send();
    console.log('start polling')
}

const ContactStore = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'Refresh':
            const seq = UserStore.getState().get('seq');
            const username = UserStore.getState().get('username').toLowerCase();
            poll(config.localUrl + '/chat/_changes?since=' + seq + '&feed=longpoll');
            database.getAllDocuments()
            .then(res => {
                let head = '';
                const result = res.rows.map(o => {
                    let ret = {};
                    let doc = o.doc;
                    let otherUser = _.reject(doc.participants_detail, {name : username})[0]
                    head = _.filter(doc.participants_detail, {name : username});
                    let message = doc.message[doc.message.length - 1];
                    return {
                        head: otherUser.head,
                        name: otherUser.name,
                        content: message.message,
                        time: new Date(message.timestamp),
                        id: doc._id,
                        history: doc.message.map(m => ({
                            direction: m.from === username ? 'to' : 'from',
                            content: m.message,
                            date: new Date(m.timestamp)
                        })),
                        doc: doc
                    }
                });
                head = head[0].head;
                User.Async({
                    username,
                    seq,
                    head
                });
                Async(result);
            })
            /*setTimeout(() => {
                let ret = [];
                for (let i = 0; i < 1000; i++) {
                    ret.push({
                        head: `https://randomuser.me/api/portraits/thumb/men/${i % 100}.jpg`,
                        time: new Date(),
                        name: 'Hello',
                        content: '内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容',
                        id: i,
                        history: List([{
                            direction: 'from',
                            content: '测试',
                            date: new Date(),
                        },{
                            direction: 'to',
                            content: '测试',
                            date: new Date()
                        }])
                    });
                }
                Async(ret);
            },500);
            */
            return state
        case 'Async':
            console.log('received', action.contacts[0].history.length);
            state = List(); 
            for (let contact of action.contacts) {
                state = state.push(Map(contact));
            }
            return state;
        case 'Send': {
            console.log(action);
            let doc = action.contact.doc;
            doc.message.push({
                timestamp: new Date().toString(),
                from: UserStore.getState().get('username').toLowerCase(),
                message: action.message
            });
            database.modifyDocuments([doc]).then(res => {
                console.log('sent');
            });
        }
            return state;
        default:
            return state;
    }
});

export default ContactStore;