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

import Route, {configure as configureRoute, getRoutes} from './stores/Route';
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
        const Routes = getRoutes().toArray();
        const shortcutRoutes = {};
        for (let route of Routes) {
            if (route.shortcut === true) {
                const X = route.component;
                shortcutRoutes[route.name] = <X/>;
            }
        }
        this.state = {
            route: routes.get(routes.size - 1),
            shortcutRoutes
        }

    }

    componentDidMount() {
        this.unsubscribeRoute = Route.subscribe(() => {
            const routes = Route.getState().get('routes');
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
        const route = this.state.route;
        const keys = Object.keys(this.state.shortcutRoutes);
        let index = keys.length;
        if (route) {
            const X = route.get('component');
            if (route.get('shortcut') === true) {
                style.height -= 60;
                bottom = <BottomBar/>;
            }
            index = keys.indexOf(route.get('name'));
            if (index === -1) {
                index = keys.length;
            }
            body = X || <View/>;
        }
        return (
            <View>
                <NavigationBar/>
                <View style={style}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: index * -1 * Dimensions.get('window').width,
                            width: (keys.length + 1) * Dimensions.get('window').width
                        }}>
                        {keys.map((key,i) => {
                            return <View
                                key={i}
                                style={[style, {
                                    width: Dimensions.get('window').width,
                                }]}>
                                {this.state.shortcutRoutes[key]}
                            </View>
                        })}
                        <View
                            style={{
                                    width: Dimensions.get('window').width
                            }}>
                            {body}
                        </View>
                    </View>
                </View>
                {bottom}
            </View>
        );
    }
}

AppRegistry.registerComponent('ReactNativeExp', () => ReactNativeExp);
//AppRegistry.registerComponent('UntitledTodoApp', () => ReactNativeExp);
