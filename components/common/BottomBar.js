import React, {
    View,
    Text,
    Component,
    TouchableHighlight,
    Image
} from 'react-native';
import Route, {getRoutes } from '../../stores/Route';
import {Replace } from '../../actions/Route';

export default class extends Component {
    unsubscribeRoute = null
    constructor(props) {
        super(props);
    }
    render() {
        const history = Route.getState().get('routes');
        const currentRoute = history.get(history.size - 1);

        const routes = getRoutes().toArray();
        const controls = [];
        for (let route of routes) {
            if (route.shortcut === true) {
                let Icon = route.icon;
                if (currentRoute.get('name') === route.name) {
                    Icon = route.iconActive;
                }
                controls.push(
                    <TouchableHighlight 
                        key={route.name}
                        onPress={() => {Replace(route.name)}}
                        style={{
                            flex: 1,
                            alignItems: 'center'
                        }}>
                            <View style={{
                                alignItems: 'center'
                            }}>
                                <Image 
                                    resizeMode={Image.resizeMode.stretch}
                                    style={{
                                        height: 30,
                                        width: 30,
                                        marginBottom: 5
                                    }}
                                    source={Icon}/>
                                <Text>{route.name}</Text>
                            </View>
                        </TouchableHighlight>
                    );
                }
        }

        return (
            <View style={{
                flexDirection: 'row',
                alignItems:'center',
                justifyContent:'center',
                borderTopWidth: 1,
                borderTopColor: '#efefef',
                paddingTop: 15,
                height: 60
            }}>
                {controls}                 
            </View>
        );
    }
}