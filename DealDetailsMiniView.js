import React, {Component} from 'react';
import {
    Button,
    Image,
    Platform,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import {width, height, totalSize} from 'react-native-dimension';

import {Icon} from 'react-native-elements'



export default class DealDetailsMiniView extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex:2, justifyContent:'center'}}>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{flex: 1}}>
                            <View style={{alignItems: 'center'}}>
                                <Image source={{uri: this.props.avatar}}
                                       style={{width: 50, height: 50, margin: 15}}/>
                                <Text style={{fontSize: 15, color: '#2c3e50', fontWeight: 'bold',}}>
                                    {this.props.name}</Text>
                            </View>
                        </View>

                        <View style={{flex: 2}}>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 17, color: '#2c3e50', fontWeight: 'bold', marginTop: 10,}}>
                                    {"Team's type :" + this.props.type}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Icon name="location-on" size={20} color="#2c3e50"/>
                                    <Text style={{fontSize: 17, color: '#2c3e50', marginTop: 10,}}>
                                        {this.props.position}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Icon name="date-range" size={20} color="#2c3e50"/>
                                    <Text style={{fontSize: 17, color: '#2c3e50', marginTop: 10,}}>
                                        {" " + this.props.date}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon name="access-time" size={20} color="#2c3e50"/>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                        {"  " + this.props.time1}</Text>
                                    <Text style={{fontSize: 15, color: '#2c3e50', marginTop: 10,}}>
                                        {"  " + this.props.time2}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row', flex: 1, marginTop: 10, justifyContent:'center'}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon size={28} name="call" color="#16a085"/>
                        <Text style={{color: '#16a085', flex: 1}}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon size={28} name="person-add" color="#16a085"/>
                        <Text style={{color: '#16a085', flex: 1}}>Join Team</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            //marginTop:-20
        },
        button1: {
            height: 8,
            alignItems: 'center',
            width: width(50),
            borderWidth: 2,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderColor: '#0078D7',

        },
        button2: {
            height: 8,
            alignItems: 'center',
            width: width(50),
            borderWidth: 2,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderColor: '#0078D7',
        }


    }
);