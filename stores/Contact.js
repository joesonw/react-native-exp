import {createStore } from 'redux';
import {List, Map } from 'immutable';
import {Async } from '../actions/Contact';

const defaultState = List();

const ContactStore = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'Refresh':
            setTimeout(() => {
                Async([
                    {
                        head: 'https://cdn.tutsplus.com/net/uploads/2013/08/github-collab-retina-preview.gif',
                        time: new Date(),
                        name: 'Hello',
                        content: '内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容, 内容',
                        id: '0',
                        history: List([{
                            direction: 'from',
                            content: '测试',
                            date: new Date(),
                        },{
                            direction: 'to',
                            content: '测试',
                            date: new Date()
                        }])
                    }
                ]);
            },500);
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