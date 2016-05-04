import Contact from '../stores/Contact';

export const Refresh = () => Contact.dispatch({
    type: 'Refresh'
});

export const Async = (contacts) => Contact.dispatch({
    type: 'Async',
    contacts
});

export const Send = (contact, message) => Contact.dispatch({
    type: 'Send',
    contact,
    message
})