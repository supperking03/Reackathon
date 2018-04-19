import React from 'react';
import {StackNavigator} from 'react-navigation';
import Login from './Login';
import User from './User';
import Map from './Map';
import Deal from './Deal';
import ProfileView from "./Components/ProfileView";
import DealsListView from "./Components/DealListView";
import Home from "./Home";

export const HomeStack = StackNavigator({
    ManHinh_Login:{
        screen: Login,
        navigationOptions:{
            header: null

        }
    },
    ManHinh_User:{
        screen: User,
        navigationOptions:{
            header:null
        }
    },
    ManHinh_Map:{
        screen: Map,
        navigationOptions:{
            header:null
        }
    },
    ManHinh_Deal:{
        screen: Deal,
        navigationOptions:{
            header:null
        }
    },

    ManHinh_ProfileView:
        {
            screen : ProfileView,
            navigationOptions:
                {
                    header : null
                }
        },
    ManHinh_DealListView:
        {
            screen : DealsListView,
            navigationOptions:
                {
                    header : null
                }
        },

    ManHinh_Home:
        {
            screen : Home,
            navigationOptions:
                {
                    header : null
                }
        }
});