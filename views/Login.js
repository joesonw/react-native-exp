import React, {
    View,
    Text,
    TextInput,
    Component,
    TouchableHighlight
} from 'react-native';
import _ from 'lodash';
import {Login } from '../actions/User';
import User from '../stores/User';
import {Replace } from '../actions/Route';
import {Refresh } from '../actions/Contact';

const RowStyle = {
    flexDirection: 'row',
    alignSelf: 'stretch',
    margin: 10,
    flex: 1
};

const Dash = () => {
    return <View style={[RowStyle,
       {
            marginBottom: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#efefef' 
        }
    ]}>
    </View>
}


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            username: 'user0',
            password: '123456'
        }
    }

    componentDidMount() {
        this.disposeUser = User.subscribe(() => {
            if (User.getState().get('username') && this.state.loading === true) {
                this.setState({
                    loading: false
                });
                Refresh();
                Replace('contact');
            }
        });
    }

    componentWillUnmount() {
        this.disposeUser();
    }

    handleSubmitLogin() {
        this.setState({
            loading: true
        });
        const {username, password} = this.state;
        Login(username, password);
    }

    render() {
        return (
            <View style={{
                flexDirection: 'column',
                alignItems:'center',
                justifyContent:'center'
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <Text
                        style={{
                            fontSize: 30,
                            marginTop: 20,
                            marginBottom: 40
                        }}>使用帐号和密码登陆</Text>
                </View>
                <View style={RowStyle}>
                    <Text
                        style={{
                            fontSize: 20,
                            flex: 1
                        }}>帐号</Text>
                    <TextInput
                        placeholder='用户名'
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                        style={{
                            fontSize: 20,
                            marginLeft: 50,
                            flex: 6,
                            height: 20 
                        }}/>
                </View>
                <Dash/>
                <View style={RowStyle}>
                    <Text
                        style={{
                            fontSize: 20,
                            flex: 1
                        }}>密码</Text>
                    <TextInput
                        secureTextEntry={true}
                        value={this.state.password}
                        placeholder='请填写密码'
                        onChangeText={(password) => this.setState({password})}
                        style={{
                            fontSize: 20,
                            marginLeft: 50,
                            flex: 6,
                            height: 20 
                        }}/>
                </View>
                <Dash/>
                <View style={RowStyle}>
                    <TouchableHighlight 
                        onPress={this.handleSubmitLogin.bind(this)}
                        style={{
                            flex: 1,
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor: '#6AD968',
                            paddingBottom: 10,
                            paddingTop: 10,
                            borderRadius: 5
                        }}>
                        <Text style={{
                            color: this.state.loading ? '#97E496' : '#fefefe',
                            fontSize: 20
                        }}>{this.state.loading ? '登陆中...' : '登陆'}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}