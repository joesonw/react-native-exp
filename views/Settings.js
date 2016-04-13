import React, {
    View,
    Text,
    TextInput,
    Component,
    TouchableHighlight,
    Image
} from 'react-native';
import Dimensions from 'Dimensions';
import User from '../stores/User';
import {Logout } from '../actions/User';
import {Href } from '../actions/Route';

const RowStyle = {
    flexDirection: 'row',
    alignSelf: 'stretch'
};

const Dash = (props) => {
    return <View style={[{
            alignSelf: 'stretch', 
            borderBottomWidth: 1,
            borderBottomColor: '#efefef' 
        }, props.style]}/>
}

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: User.getState()
        } 
    }

    componentDidMount() {
        this._disposeUser = User.subscribe(() => {
            this.setState({
                user: User.getState()
            })
        });
    }

    componentWillUnmount() {
        this._disposeUser();
    }

    render() {
        const user = this.state.user;
        return (

            <View style={{
                flexDirection: 'column',
                flex: 1,
                alignItems: 'flex-start',
            }}>
                <View
                    style={[RowStyle, {
                        alignItems: 'flex-start',
                        height: 80
                    }]}>
                    <Image 
                        style={{
                            width: 60,
                            height: 60,
                            margin: 10
                        }}
                        resizeMode={Image.resizeMode.stretch}
                        source={{uri: user.get('head')}}/>
                    <Text
                     style={{
                        marginTop: 30
                     }}>{user.get('username')}</Text>
                </View>
                <Dash/>
                <View
                    style={[RowStyle, {}]}>
                    <TouchableHighlight
                        style={{
                            flex: 1,
                            padding: 10,
                            paddingVertical: 15
                        }}
                        onPress={() => Href('changePassword')}>
                        <Text>修改密码</Text>
                    </TouchableHighlight>
                </View>
                <Dash/>
                <View
                    style={[RowStyle, {height: 40, padding: 10}]}>
                    <Text>版本号 :  {user.get('version')}</Text>
                </View>
                <Dash/>
                <View 
                    style={[RowStyle, {
                        flex: 1,
                        flexWrap: 'nowrap', 
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-end',
                        margin: 0
                    }]}>
                    <Dash style={{flex: null}}/>
                    <TouchableHighlight
                        onPress={Logout}
                        style={{
                            margin: 15,
                            alignItems: 'center'
                        }}>
                        <Text
                            style={{
                            }}>退出登陆</Text>
                    </TouchableHighlight>
                    <Dash style={{flex: null}}/>
                </View>
            </View>
        );
    }
}