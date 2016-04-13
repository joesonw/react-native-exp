import {createStore } from 'redux';
import {Map, List } from 'immutable';
import React, {View } from 'react-native';

let Routes = List();
const defaultState = Map({
    routes: List(),
    title: ''
});

function getRoute(action) {
    for (let r of Routes.values()) {
        if (r.name == action.name) {
            const X = r.component;
            const props = action.props;
            let component;
            if (!r.shortcut) {
                component = <X {...props}/>;
            }
            return Map({
                title: r.title,
                component,
                leftTab: r.leftTab,
                rightTab: r.rightTab,
                shortcut: !!r.shortcut,
                name: r.name
            });
        }
    }
}

const RouteStore = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'Href':
            {
                const routes = state.get('routes');
                const route = getRoute(action);
                if (route) {
                    return state
                        .set('routes', routes.push(route))
                        .set('title', action.title || route.get('title'));
                } else {
                    return state;
                }
            }
        case 'Back':
            {
                const routes = state.get('routes');
                if (routes.size <= 0) {
                    return state;
                }
                const route = routes.get(routes.size - 1);
                return state
                    .set('routes', routes.pop())
                    .set('title', route.get('title'));
            }
        case 'Replace':
            {
                const routes = state.get('routes');
                const route = getRoute(action);
                if (route) {
                    let result = state
                    if (routes.size > 0) {
                        routes = routes.pop();
                    }
                    routes = routes.push(route);
                    return state
                        .set('routes', routes)
                        .set('title', action.title || route.get('title'));
                } else {
                    return state;
                }
            }
        case 'Clear':
            return defaultState;
        case 'SetTitle':
            return state.set('title', action.title);
            break;
        default:
            return state;
    }
});

function configure(routes = []) {
    Routes = List(routes);
}
function getRoutes() {
    return Routes;
}

export {configure };
export {getRoutes}
export default RouteStore;