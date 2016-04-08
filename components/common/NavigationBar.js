import React, {
    View,
    Text,
    Component
} from 'react-native';
import Route from '../../stores/Route';

export default class extends Component {
    constructor(props) {
        super(props);
        const routes = Route.getState().get('routes');
        this.state = {
            route: routes.get(routes.size - 1),
            title: Route.getState().get('title'),
        }
    }
    componentDidMount() {
        this.unsubscribeRoute = Route.subscribe(() => {
            const routes = Route.getState().get('routes');
            const route = routes.get(routes.size - 1);
            if (route) {
                this.setState({
                    route,
                    title: Route.getState().get('title'),
                    leftTab: route.get('leftTab'),
                    rightTab: route.get('rightTab'),
                });
            }
        });
    }
    componentWillUnmount() {
        this.unsubscribeRoute();
    }
    render() {
        if (!this.state.route) {
            return <View/>;
        }
        return (
            <View style={{
                backgroundColor: '#38373C',
                flexDirection: 'row',
                alignItems:'center',
                justifyContent:'center',
                paddingTop: 15
            }}>
                <View 
                    style={{
                        flex: 1
                    }}>
                    {this.state.leftTab}
                </View>
                <Text style={{
                    paddingBottom: 10,
                    paddingTop: 10,
                    fontSize: 20,
                        color: '#fff'
                }}>{this.state.title}</Text>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end'
                    }}>
                    {this.state.rightTab}
                </View>
            </View>
        );
    }
}