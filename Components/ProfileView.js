import React, {Component} from 'react'
import {Text, View, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView} from 'react-native'
import {Icon as ElementIcon} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import call from "react-native-phone-call";


export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: this.props.navigation.state.params.Name,
                image: this.props.navigation.state.params.Url,
                birthday: '',
                address:'123 XLHN',
                team:'Wolf team',
                gender: 'Nam',
                mail: this.props.navigation.state.params.Email,
                phone: this.props.navigation.state.params.Phone,
                about: this.props.navigation.state.params.About,

            },
            follow: true,

        }

    }

    _navigateBackPressed() {

    }

    _settingProfilePressed() {

    }

    _followPressed() {
    }

    _callPressed(number) {
        call({number: number,prompt: false}).catch(console.error)
    }


    render() {
        const {goBack} = this.props.navigation;
        return (
            <View style={{flex: 1}}>

                <View>
                    <View style={profileStyles.navigateBar}>
                        <TouchableOpacity onPress={()=>{goBack()}}>
                            <ElementIcon name="keyboard-backspace" color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._settingProfilePressed()}>
                            <ElementIcon name="settings" color="white"/>
                        </TouchableOpacity>
                    </View>

                    <View style={profileStyles.header}>
                        <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#27ae60'}}>
                            <View style={profileStyles.headerSubContent}>
                                <Icon name={this.state.user.gender === "Nam" ? "md-male" : "md-female"}
                                      size={30} color="#ecf0f1"/>
                                <Text style={profileStyles.name}>{this.state.user.name}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                            <View style={profileStyles.headerSubContent}>
                                <TouchableOpacity style={profileStyles.followButton} onPress={this._followPressed()}>
                                    <Text style={{fontWeight: 'bold', fontSize: 18, color: '#27ae60'}}>
                                        {this.state.follow === true ? "Following" : "Unfollow"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={profileStyles.callButton} onPress={()=>{this._callPressed(this.state.user.phone)}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>Call</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Image style={profileStyles.avatar} source={{uri: this.state.user.image}}/>
                    </View>

                </View>

                <View style={{flex: 1, backgroundColor: 'white'}}>

                    <View style={profileStyles.infoView}>
                        <Icon name="md-people" size={30} color="#16a085"/>
                        <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                            <Text style={profileStyles.infoText}>{this.state.user.team}</Text>
                        </View>
                    </View>

                    <View style={profileStyles.infoView}>
                        <Icon name="md-call" size={30} color="#16a085"/>
                        <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                            <Text style={profileStyles.infoText}>{this.state.user.phone}</Text>
                        </View>
                    </View>

                    <View style={profileStyles.infoView}>
                        <Icon name="md-mail" size={30} color="#16a085"/>
                        <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                            <Text style={profileStyles.infoText}>{this.state.user.mail}</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        //alignItems: 'center',
                        marginLeft: 20,
                        marginRight: 20,
                        flex: 1
                    }}>
                        <View style={{justifyContent: 'flex-start', marginTop:10}}>
                            <Icon name="md-clipboard" size={30} color="#16a085"/>
                        </View>
                        <View style={{borderBottomWidth: 1, borderColor: '#ecf0f1', padding: 10, flex: 1}}>
                            <ScrollView style={{flex: 1}}>
                                <Text style={profileStyles.infoText}>{this.state.user.about}</Text>
                            </ScrollView>


                        </View>
                    </View>


                </View>

            </View>
        );
    }
    ;


}

const profileStyles = StyleSheet.create(
    {
        navigateBar: {
            flexDirection: 'row',
            width: '100%',
            height: 50,
            justifyContent: 'space-between',
            backgroundColor: '#27ae60',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20
        },
        header: {
            width: '100%', height: 200, justifyContent: 'center'
        },
        headerSubContent: {
            marginLeft: 140,
            flexDirection: 'row',
            alignContent: 'center',
            marginBottom: 8,
            marginTop: 8,
            justifyContent: 'center'
        },
        avatar: {
            marginLeft: 20,
            width: 120,
            height: 120,
            borderRadius: 100,
            position: 'absolute',
            borderWidth: 3,
            borderColor: 'white'
        },
        name: {
            fontWeight: 'bold', fontSize: 20, color: 'white', marginLeft: 5
        },
        callButton: {
            backgroundColor: '#27ae60',
            width: 100,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
        },
        followButton: {
            backgroundColor: 'white',
            width: 100,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#27ae60'
        },
        infoView: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
        },
        infoText: {
            marginLeft: 10,
            color: '#34495e',
            fontSize: 20,
        }


    }
);