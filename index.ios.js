/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import App from './App';
import NavigationBar from './components/common/NavigationBar';
import BottomBar from './components/common/BottomBar';

import Route, {configure as configureRoute} from './stores/Route';
import {Href, Back } from './actions/Route';
import Dimensions from 'Dimensions';

import ContactIcon from './assets/contact.png';
import ContactActiveIcon from './assets/contact.active.png';
import SettingsIcon from './assets/settings.png';
import SettingsActiveIcon from './assets/settings.active.png';

import Login from './views/Login';
import Contact from './views/Contact';
import Chat from './views/Chat';
import Settings from './views/Settings';
import ChangePassword from './views/ChangePassword';


configureRoute([{
    name: 'chat',
    title: '聊天',
    component: Chat,
    shortcut: false,
    leftTab: <TouchableHighlight
        style={{
            width: 90
        }}
        onPress={() => {
            Back();
        }}>
        <Text style={{
                color: '#fff',
                fontSize: 15,
                padding: 10
            }}>返回</Text>
    </TouchableHighlight>
}, {
    name: 'contact',
    title: '联系人' ,
    component: Contact,
    shortcut: true,
    icon: ContactIcon,
    iconActive: ContactActiveIcon
}, {
    name: 'settings',
    title: '个人资料',
    component: Settings,
    icon: SettingsIcon,
    iconActive: SettingsActiveIcon,
    shortcut: true
}, {
    name: 'changePassword',
    title: '修改密码',
    component: ChangePassword,
    leftTab: <TouchableHighlight
        style={{
            width: 90
        }}
        onPress={() => {
            Back();
        }}>
        <Text style={{
                color: '#fff',
                fontSize: 15,
                padding: 10
            }}>返回</Text>
    </TouchableHighlight>
}]);

class ReactNativeExp extends Component {
    constructor(props) {
        super(props);
        const routes = Route.getState().get('routes');
        this.state = {
            route: routes.get(routes.size - 1)
        }
    }

    componentDidMount() {
        this.unsubscribeRoute = Route.subscribe(() => {
            const routes = Route.getState().get('routes');
            console.log(routes);
            this.setState({
                route: routes.get(routes.size - 1)
            })
        });
    }

    componentWillUnmount() {
        this.unsubscribeRoute();
    }

    render() {
        let body = <Login/>;
        let placeholder = <View style={{
            height: 20,
        }}/>
        let style = {
            flex: 1,
            alignSelf: 'stretch',
            height: Dimensions.get('window').height - 60
        };
        let bottom = <View/>;
        if (this.state.route) {
            const X = this.state.route.get('component');
            if (this.state.route.get('shortcut') === true) {
                style.height -= 60;
                bottom = <BottomBar/>;
            }
            body = X;
        }
        return (
            <View>
                <NavigationBar/>
                <View style={style}>
                    {body}
                </View>
                {bottom}
            </View>
        );
    }
}

AppRegistry.registerComponent('ReactNativeExp', () => ReactNativeExp);
