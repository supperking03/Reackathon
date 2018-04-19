import React, {Component} from 'react'
import {Text, View, TouchableOpacity, ListView, Image, StyleSheet,TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import {Icon as MatIcon} from 'react-native-elements'
import Accordion from 'react-native-collapsible/Accordion';
import {height, width} from "react-native-dimension";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import ModalDropdown from 'react-native-modal-dropdown';

export default class TeamManager extends Component {

    constructor(props) {
        super(props);



        this.state = {
            myTeam:{},
            teamFollow :[],

        };

        this.LoadData();
        this._renderHeader = this._renderHeader.bind(this);
        this._renderFilterHeader = this._renderFilterHeader.bind(this);


    }


    generateIconByAge(age) {
        if (age > 40)
            return "human-child";
        if (age < 10)
            return "baby";
        return "human";
    }


    LoadData = async () => {
        return await fetch('http://71dongkhoi.esy.es/getDeal.php')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({teamFollow:responseJson});
            })
            .catch((error) => {
                console.error(error);
            });
    };


    _renderHeader = (section, index, isActive, sections) => {
        return (
            <View style={{
                width: '100%',
                height: 120,
                flexDirection: 'row',
                padding: 20,
                borderTopWidth: 1,
                borderColor: '#bdc3c7'
            }}>
                <Image style={{width: 90, height: 90, alignSelf: 'center'}}
                       source={{uri: section.url}}/>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <View style={{marginLeft: 10}}>

                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{section.name}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 15}}>{section.type} people</Text>
                            </View>
                            <Text style={{fontSize: 15}}>{section.position}</Text>
                            <Text style={{fontSize: 15}}>{section.age} year olds average</Text>
                            <Text style={{fontSize: 15}}>Date: {section.date}</Text>
                            <Text style={{fontSize: 15}}>{section.time1 + " - " + section.time2}</Text>
                        </View>

                    </View>

                </View>
            </View>

        )
    };


    _renderFilterHeader = () => {
        {
            return (
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 2,
                    paddingBottom: 2
                }}>
                    <Text>{"Đội của bạn : "}</Text>
                </View>
            )
        }
    };



    render() {
        return (
            <View style={{flex: 1,position: 'absolute'}}>
                <View style={{
                    backgroundColor: 'rgba(255,255,255 ,0.95)',
                    flexDirection: 'row',
                    height: height(7),
                    margin: height(2),
                    borderRadius: 5,

                }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{margin: 1, borderRightWidth: 1, borderColor: 'grey'}}>
                            <TouchableOpacity
                                onPress={() => {
                                //     return this.props.navigation.navigate('ManHinh_Map', {
                                //         Phone: this.props.navigation.state.params.Phone,
                                //         Url: this.props.navigation.state.params.Url,
                                //         Name: this.props.navigation.state.params.Name,
                                //         Id:this.props.navigation.state.params.Id,
                                //         Email: this.props.navigation.state.params.Email,
                                //         About: this.props.navigation.state.params.About,
                                //     });
                                 }}>
                                <View style={{marginRight: 5}}>
                                    <FontAwesome name="search" size={height(3)} color="#4CAF50"/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 5, justifyContent: 'center'}}>
                        <TextInput editable={false} maxLength={100} multiline={false}
                                   placeholder={"Search location"} spellcheck={false}
                                   placeholderTextColor={'#9E9E9E'} underlineColorAndroid={'transparent'}
                                   autoFocus={false}>
                            {this.state.place}
                        </TextInput>
                    </View>

                    <View style={{flex: 1}}>

                    </View>
                </View>
                {this._renderFilterHeader}


                <Accordion
                    sections={this.state.teamFollow}
                    renderHeader={this._renderHeader.bind(this)}
                    initiallyActiveSection={0}
                    renderContent={()=>{return(<View/>)}}/>

            </View>
        )
    }

}


const styles = StyleSheet.create({
    modal: {
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: 30,
        width: width(33),
        // borderWidth:2,
        // borderColor:'#16a085'
    },

    modalbtnText: {},
    dropdownstyle: {
        width: width(30),
        backgroundColor: 'white',
        alignSelf: 'flex-end'
    }
});


