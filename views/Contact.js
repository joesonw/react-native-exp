import React, {
    View,
    Text,
    TextInput,
    Component,
    TouchableHighlight,
    Image,
    ListView,
    RecyclerViewBackedScrollView
} from 'react-native';
import _ from 'lodash';
import Contact from '../stores/Contact';
import transformDate from '../utils/transformDate';
import Dimensions from 'Dimensions'
import {Href } from '../actions/Route';
import {Set } from '../actions/Global';
import {autobind } from 'core-decorators';
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
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.get('id') !== r2.get('id')
        });
        this.state = {
            contacts: ds.cloneWithRows(Contact.getState().toArray()),
            position: Global.getState().get('ContactListScrollPosition'),
            searchText: ''
        }
    }

    componentDidMount() {
        this.unsubscribeContact = Contact.subscribe(() => {
            this.setState({
                contacts: this.state.contacts.cloneWithRows(Contact.getState().toArray())
            });
        });
        //this.refs.list.scrollTo({y: this.state.position, animated: false});
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

    _rowRenderer(contact, sectionId, rowId) {
        return (
            <TouchableHighlight
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
    }

    filter(searchText) {
        searchText = searchText.toLowerCase();
        const contacts = this.state.contacts.cloneWithRows(_.filter(Contact.getState().toArray(), d => {
            return d.get('name').indexOf(searchText) !== -1;
        }));
        this.setState({
            searchText,
            contacts
        });
    }
    render() {
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
                        value={this.state.searchText}
                        onChangeText={this.filter.bind(this)}
                        style={{
                            fontSize: 20,
                            height: 30,
                            padding: 5,
                            flex: 1,
                            borderRadius: 3,
                            backgroundColor: '#fff'
                        }}/>
                </View>
                <ListView
                    dataSource={this.state.contacts}
                    style={{flex: 1, alignSelf: 'stretch'}}
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} style={{flex: 1, alignSelf: 'stretch'}} />}
                    renderSeparator={(sectionID, rowID) => <Divider key={`${sectionID}-${rowID}`}/>}
                    renderRow = {this._rowRenderer.bind(this)}/>
            </View>
        );
    }
}