import React, {
    View,
    Text,
    TextInput,
    Component,
    TouchableHighlight,
    Image,
    ScrollView
} from 'react-native';
import _ from 'lodash';
import Dimensions from 'Dimensions';
import {SetTitle } from '../actions/Route';
import Contact from '../stores/Contact';
import User from '../stores/User';

const RowStyle = {
    flexDirection: 'row',
    alignSelf: 'stretch',
    margin: 10,
    flex: 1
};

const Triangle = (props) => {
    const size = props.size || 10;
    return <View style={[{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: size,
        borderRightWidth: size,
        borderBottomWidth: size * 2,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        transform: [{
            rotate: props.rotate || '0deg'
        }],
        borderBottomColor: props.color || 'red'}, props.style]}/>
}

const FromMessage = (props) => {
    const backgroundColor = '#fefefe';
    return (
        <View
            style={{
                flexDirection: 'row',
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                margin: 5,
                flex: 1
            }}>
            <Image 
                style={{
                    width: 40,
                    height: 40
                }}
                resizeMode={Image.resizeMode.stretch}
                source={{uri: props.head}}/>
            <View 
                style={{
                    flexDirection: 'row',
                    marginLeft: 5,
                    flex: 1,
                    justifyContent: 'flex-start'
                }}>
                <View 
                    style={{
                        flex: 1,
                        backgroundColor,
                        borderWidth: 1,
                        borderColor: '#B7BEC2',
                        borderRadius: 5,
                        marginTop: 2,
                        padding: 10,
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                        marginRight: 40
                    }}>
                    <Text style={{
                        justifyContent: 'flex-start',
                        }}>{props.content}</Text>
                </View>
            </View>
        </View> 
    );
}

const ToMessage = (props) => {
    const backgroundColor = '#6BBB44'
    return (
        <View
            style={{
                flexDirection: 'row',
                alignSelf: 'stretch',
                justifyContent: 'flex-end',
                margin: 5,
                flex: 1
            }}>
            <View 
                style={{
                    flexDirection: 'row',
                    marginLeft: 5,
                    flex: 1,
                    justifyContent: 'flex-end'
                }}>
                
                <View 
                    style={{
                        flex: 1,
                        backgroundColor,
                        borderWidth: 1,
                        borderColor: '#B7BEC2',
                        borderRadius: 5,
                        marginTop: 2,
                        padding: 10,
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                        marginLeft: 40
                    }}>
                    <Text style={{
                        justifyContent: 'flex-start',
                        }}>{props.content}</Text>
                </View>
            </View>
            <Image 
                style={{
                    width: 40,
                    height: 40
                }}
                resizeMode={Image.resizeMode.stretch}
                source={{uri: props.head}}/>
        </View> 
    );
}


export default class extends Component {
    constructor(props) {
        super(props);
        let user;
        for (let u of Contact.getState().values()) {
            if (u.get('id') == props.id) {
                user = u;
                break;
            }
        }
        this.state = {
            id: props.id,
            user,
            history: []
        };
        if (user) {
            this.state.history = user.get('history');
        }
    }
    componentDidMount() {
        if (this.state.user) {
            SetTitle(this.state.user.get('name'));
        }
        this.disposeContact = Contact.subscribe(() => {
            let user;
            for (let u of Contact.getState().values()) {
                if (u.get('id') == this.state.id) {
                    user = u;
                    break; 
                }
            }
            if (user) {
                SetTitle(this.state.user.get('name'));
                this.setState({
                    user,
                    history: user.get('history')
                })
            }
        })
    }
    componentWillUnmount() {
        this.disposeContact();
    }
    componentWillReceiveProps(props) {
        this.setState({
            id: props.id
        });
    }
    render() {
        const contact = this.state.user;
        const user = User.getState();

        const messages = this.state.history.toArray().reduce((m, h) => {
            if (h.direction === 'from') {
                return m.concat(<FromMessage key={m.length} head={contact.get('head')} content={h.content}/>);
            } else if (h.direction === 'to') {
                return m.concat(<ToMessage key={m.length} head={user.get('head')} content={h.content}/>);
            }
            return m;
        },[]);
        return (
            <View style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent:'flex-start'
            }}>
                <ScrollView
                    style={{
                        flex: 1,
                        height: Dimensions.get('window').height - 105
                    }}>
                    <View/>
                    {messages}
                </ScrollView>
                <View style={{
                        height: 50,
                        backgroundColor: '#efeff4',
                        flexDirection: 'row'
                    }}>
                    <TextInput
                        style={{
                            flex: 12,
                            height:40,
                            backgroundColor: '#fff',
                            borderRadius: 2,
                            borderWidth: 1,
                            borderColor: '#DDDDDD',
                            margin: 5,
                            padding: 5
                        }}/>
                    <TouchableHighlight 
                        style={{
                            borderRadius: 2,
                            borderWidth: 1,
                            borderColor: '#DDDDDD',
                            backgroundColor: '#fafafa',
                            margin: 5
                        }}>
                        <Text style={{
                                padding: 10,
                                fontSize: 14
                            }}>发送</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}