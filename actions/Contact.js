import Contact from '../stores/Contact';

export const Refresh = () => Contact.dispatch({
    type: 'Refresh'
});

export const Async = (contacts) => Contact.dispatch({
    type: 'Async',
    contacts
});