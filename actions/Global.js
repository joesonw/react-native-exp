import Global from '../stores/Global';

export const Set = (key, value) => Global.dispatch({type: 'Set', key, value});