import {createStore } from 'redux';
import {List, Map } from 'immutable';
import {Async } from '../actions/Contact';
import database from '../database';

const defaultState = List();

function poll(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.timeout =  30 * 60 * 1000;
    //xhr.responseType = 'blob';
    xhr.onload = (res) => {
        console.log(xhr);
    };
    xhr.onreadystatechange = (e) => {
        console.log(xhr);
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
            poll('http://admin:pass@localhost:5984/chat/_changes?since=21&feed=continuous');
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
            for (let contact of action.contacts) {
                state = state.push(Map(contact));
            }
            return state;
        default:
            return state;
    }
});

export default ContactStore;