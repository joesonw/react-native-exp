import Route from '../stores/Route';

export const Href = (name, props, title) => Route.dispatch({
    type: 'Href',
    name,
    props,
    title
});

export const Replace = (name, props, title) => Route.dispatch({
    type: 'Replace',
    name,
    props,
    title
});

export const SetTitle = (title) => Route.dispatch({
    type: 'SetTitle',
    title
});

export const Back = () => Route.dispatch({
    type: 'Back'
});

export const Forward = () => Route.dispatch({
    type: 'Forward'
});

export const Clear = () => Route.dispatch({
    type: 'Clear'
});