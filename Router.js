import React from 'react';
import {StackNavigator} from 'react-navigation';
import Login from './Login';
import User from './User';

export const HomeStack = StackNavigator({
    ManHinh_Login:{
        screen: Login,
        navigationOptions:{
            title: '                    Cáp kèo bóng đá',
            header: null

        }
    },
    ManHinh_User:{
        screen: User,
        navigationOptions:{
            title: 'Thong Tin',
            header:null
        }
    },
});