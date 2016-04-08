import React, {
    View,
    Text,
    TextInput,
    Component,
    TouchableHighlight
} from 'react-native';
import _ from 'lodash';
import User from '../stores/User';
import {Href } from '../actions/Route';

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
            password: '',
            newPassword: ''
        }
    }

    componentDidMount() {
        this.disposeUser = User.subscribe(() => {
            if (User.getState().get('username') && this.state.loading === true) {
                this.setState({
                    loading: false
                });
                Href('contact');
            }
        });
    }

    componentWillUnmount() {
        this.disposeUser();
    }

    handleSubmit() {
    }

    render() {
        return (
            <View style={{
                flexDirection: 'column',
                alignItems:'center',
                justifyContent:'center'
            }}>
                <View style={[RowStyle, {marginTop: 30}]}>
                    <Text
                        style={{
                            fontSize: 20,
                            flex: 1
                        }}>密码</Text>
                    <TextInput
                        secureTextEntry={true}
                        placeholder='请填写密码'
                        onChangeText={(password) => this.setState({password})}
                        style={{
                            fontSize: 20,
                            marginLeft: 50,
                            flex: 4,
                            height: 20 
                        }}/>
                </View>
                <Dash/>
                <View style={RowStyle}>
                    <Text
                        style={{
                            fontSize: 20,
                            flex: 1
                        }}>新密码</Text>
                    <TextInput
                        secureTextEntry={true}
                        placeholder='请填写密码'
                        onChangeText={(newPassword) => this.setState({newPassword})}
                        style={{
                            fontSize: 20,
                            marginLeft: 50,
                            flex: 4,
                            height: 20 
                        }}/>
                </View>
                <Dash/>
                <View style={RowStyle}>
                    <TouchableHighlight 
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
                        }}>{this.state.loading ? '提交中...' : '提交'}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}