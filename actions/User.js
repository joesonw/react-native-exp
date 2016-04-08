import User from '../stores/User';
export const Async = (data) => User.dispatch({type: 'Async', data});
export const Login = (username, password) => User.dispatch({type: 'Login', username, password});
export const Logout = () => User.dispatch({type: 'Logout'});
export const ChangePassword = (password, newPassword) => User.dispatch({
    type: 'ChangePassword',
    password,
    newPassword
});