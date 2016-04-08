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
import Contact from '../stores/Contact';
import transformDate from '../utils/transformDate';
import Dimensions from 'Dimensions'
import {Href } from '../actions/Route';
import {Set } from '../actions/Global';
import Global from '../stores/Global';

const RowStyle = {
    flexDirection: 'row',
    alignSelf: 'stretch',
    flex: 1,
    padding:10
};

const ColorGrey = '#aaa';

const Divider = () => {
    return <View
            style={_.extend({
                borderBottomColor: ColorGrey,
                borderBottomWidth: 1,
                marginLeft: 10,
                marginRight: 10,
                marginTop: -20
            }, RowStyle)}/>

}

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: Contact.getState(),
            position: Global.getState().get('ContactListScrollPosition')
        }
    }

    componentDidMount() {
        this.unsubscribeContact = Contact.subscribe(() => {
            this.setState({
                contacts: Contact.getState()
            });
        });
        this.refs.list.scrollTo({y: this.state.position, animated: false});
    }

    componentWillUnmount() {
        this.unsubscribeContact();
        Set('ContactListScrollPosition', this.state.position);
    }

    handleContactPress(key, e) {
        Href('chat', {
            id: key
        });
    }

    handleContactListScroll(e) {
        this.setState({
            position: e.nativeEvent.contentOffset.y
        });
    }

    render() {
        let messages = this.state.contacts.toArray().map((contact, i) => {
            return (
                <TouchableHighlight
                    key={i * 2}
                    onPress={this.handleContactPress.bind(this, contact.get('id'))}
                    style={RowStyle}>
                    <View style={RowStyle}>
                        <Image 
                            style={{
                                margin: 5,
                                width: 40,
                                height: 40
                            }}
                            resizeMode={Image.resizeMode.stretch}
                            source={{uri: contact.get('head')}}/>
                        <View
                            style={{
                                flex: 11,
                                marginLeft: 10,
                                flexDirection: 'column'
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                <Text
                                    style={{
                                        flex: 5,
                                        fontSize: 20
                                    }}>{contact.get('name')}</Text>
                                <Text
                                    style={{
                                        alignSelf: 'flex-end',
                                        width: 50,
                                        fontSize: 15,
                                        color: ColorGrey 
                                    }}>{transformDate(contact.get('time'))}</Text>
                            </View>
                            <Text 
                                numberOfLines={1}
                                style={{
                                    fontSize: 15,
                                    color: ColorGrey,
                                    flex: 1
                                }}>
                                {contact.get('content')}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        });
        const length = messages.length - 1;
        for (let i = 0; i < length; i++ ) {
            messages.splice(i * 2 + 1, 0, <Divider key={i * 2 + 1}/>);
        }
        return (
            <View style={{
                flexDirection: 'column',
                flex: 1,
                alignItems: 'center',
                justifyContent:'center'
            }}>
                <View style={[RowStyle, {
                    flex: null,
                    height: 50,
                    alignSelf: 'stretch',
                    backgroundColor: '#EFEFF4'
                }]}>
                    <TextInput
                        placeholder='搜索'
                        style={{
                            fontSize: 20,
                            height: 30,
                            padding: 5,
                            flex: 1,
                            borderRadius: 3,
                            backgroundColor: '#fff'
                        }}/>
                </View>
                <ScrollView
                    ref='list'
                    style={{
                        flex: 1,
                        alignSelf: 'stretch'
                    }}
                    automaticallyAdjustContentInsets={true}
                    onScroll={this.handleContactListScroll.bind(this)}
                    scrollEventThrottle={100}
                    >
                    <View/>
                    {messages}    
                </ScrollView> 
            </View>
        );
    }
}