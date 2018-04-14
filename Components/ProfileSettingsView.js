import React, {Component} from 'react';
import {Icon as EleIcon} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    StyleSheet, TextInput, View, Alert, Image, Text, ActivityIndicator,
    TouchableOpacity, ImageBackground, Modal, ListView, ScrollView
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import SocialIcon from "react-native-elements/src/social/SocialIcon";


export default class ProfileSettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            TextInputAbout: "With IntelliJ IDEA, you can maintain your preferable colors and fonts layout for syntax and error highlighting in the editor, search results, Debugger and consoles via font and color schemes IntelliJ IDEA comes with a number of pre-defined color schemes. You can select one of them, or create your own one, and configure its settings to your taste It is important to mention the Language Defaults settings page, which contains the settings that are common for all the supported languages. It's enough to change one of the settings there, and then inherit this setting from the defaults.",
            TextInputEmail: "ronaldo@MU.com",
            TextInputName: "Le Hoang Nam",
            TextInputId: "100004147054885",
            TextInputPhoneNumber: "01234566789",
            url: "https://lh3.googleusercontent.com/-5Np5L5brFEo/VyuZhRH1vkI/AAAAAAAAA6g/-PBgmsQXuyY/s640/Cristiano-Ronaldo-dp-profile-pics-1423.jpg",
            modalVisible: false,
            dataSource: [],
            numberOfRequest: 0,
        }

    };

    componentDidMount() {
    }

    componentWillMount() {
    }


    InsertDataToServerPressed() {
    };

    navigateBackPressed() {
    }

    pickImagePressed() {
    }

    showListRequestPressed() {
        this.setState({modalVisible: true});
    }

    hideListRequestPressed() {
        this.setState({modalVisible: false});
    }

    acceptTeamRequest() {
    }

    denyTeamRequest() {
    }

    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1}}>

                    <Spinner visible={this.state.isLoading}>
                        <ActivityIndicator style={{margin: 200, flex: 0.1, justifyContent: 'center'}} size="large"/>
                    </Spinner>


                    <Modal animationType="slide" transparent={false} visible={this.state.modalVisible} onRequestClose={() => {
                    }}>
                        <View style={{marginTop: 22, alignItems:'center', justifyContent:'center'}}>
                            <View style={{borderBottomWidth: 1, borderColor: '#bdc3c7', marginBottom:3}}>
                                <TouchableOpacity
                                    style={{width: '10%'}}
                                    onPress={this.hideListRequestPressed.bind(this)}>
                                    <Icon size={35} name="ios-arrow-down-outline" color="grey"/>
                                </TouchableOpacity>
                            </View>

                            <ListView
                                dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.dataSource)}
                                renderRow={this.renderRow.bind(this)}/>

                        </View>
                    </Modal>


                    <View style={styles.ImageContainer}>


                        <ImageBackground style={styles.ImageBackground} source={{uri: this.state.url}}>

                            <View style={styles.NavigateView}>
                                <TouchableOpacity onPress={this.navigateBackPressed.bind(this)}
                                                  style={styles.NavigateTouchable}>
                                    <EleIcon size={28} name="keyboard-backspace" color="white"/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.InsertDataToServerPressed.bind(this)}
                                                  style={styles.NavigateTouchable}>
                                    <EleIcon size={28} name="done" color="white"/>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.65)',
                                    alignItems: 'center'
                                }}>
                                <View style={{
                                    marginLeft: 50, marginRight: 50, alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <TouchableOpacity onPress={this.pickImagePressed.bind(this)}
                                                      style={styles.ImageTouchable}>
                                        <Image style={styles.Image} source={{uri: this.state.url}}/>
                                        <View style={{
                                            backgroundColor: 'transparent',
                                            width: '100%', height: '100%',
                                            position: 'absolute',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-end'
                                        }}>
                                        </View>
                                    </TouchableOpacity>


                                    <View
                                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>


                                        <SocialIcon iconSize={20} style={{width: 30, height: 30}} type='facebook'/>
                                        <SocialIcon iconSize={20} style={{width: 30, height: 30}} type='twitter'/>
                                        <SocialIcon iconSize={20}
                                                    style={{width: 30, height: 30, backgroundColor: '#D42F8A'}}
                                                    type='instagram'/>


                                        <TouchableOpacity style={{flexDirection: 'row'}}
                                                          onPress={this.showListRequestPressed.bind(this)}>
                                            <Icon color='white' size={32} name='md-person-add'/>
                                            <View style={{
                                                backgroundColor: 'red',
                                                width: 18,
                                                height: 18,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 5
                                            }}>
                                                <Text style={{color: 'white'}}>{this.state.numberOfRequest}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>


                        <View style={{flex: 1, width: '100%', alignItems: 'center', backgroundColor: 'white'}}>
                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30} name="perm-contact-calendar" color="#7f8c8d"/>
                                <TextInput
                                    placeholder="Enter Your Name"
                                    value={this.state.TextInputName}
                                    onChangeText={TextInputName => this.setState({TextInputName})}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}/>
                            </View>


                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon size={30} name="call" color="#7f8c8d"/>
                                <TextInput
                                    placeholder="Enter Phone Number"
                                    value={this.state.TextInputPhoneNumber}
                                    onChangeText={TextInputPhoneNumber => this.setState({TextInputPhoneNumber})}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}
                                />
                            </View>


                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30} name="email" color="grey"/>
                                <TextInput
                                    placeholder="Enter Your Email.."
                                    value={this.state.TextInputEmail}
                                    onChangeText={TextInputEmail => this.setState({TextInputEmail})}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}/>
                            </View>


                            <View style={{
                                width: '90%',
                                borderBottomColor: 'grey',
                                flexDirection: 'row',
                                justifyContent: 'flex-start'
                            }}>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    <EleIcon style={{}} size={30} name="chrome-reader-mode" color="#7f8c8d"/>
                                </View>
                                <TextInput
                                    placeholder="About.."
                                    multiline={true}
                                    numberOfLines={4}
                                    value={this.state.TextInputAbout}
                                    onChangeText={TextInputAbout => this.setState({TextInputAbout})}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputAboutStyle}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }


    renderRow(user) {
        return (
            <TouchableOpacity style={styles.TouchableRequestItems}>

                <Image style={{width: 70, height: 70, borderRadius: 50}}
                       source={{uri: "http://graph.facebook.com/" + user.id + "/picture?type=large"}}/>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18}}>{user.name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30,}}>
                            <TouchableOpacity style={styles.TouchableItemViewProfile}>
                                <Text style={{fontWeight: 'bold', color: '#16a085'}}>View profile</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableOpacity style={{justifyContent: 'center'}}
                                      onPress={this.acceptTeamRequest.bind(this)}>
                        <Icon size={30} name="md-checkmark-circle" color="#27ae60"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10, marginRight: 5}}
                                      onPress={this.denyTeamRequest.bind(this)}>
                        <Icon size={30} name="md-remove-circle" color="#e74c3c"/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

        )
    }


}

const styles = StyleSheet.create({
    NavigateTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    NavigateView: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingRight: 20,
        paddingLeft: 20
    },

    ImageTouchable: {
        borderRadius: 85,
        width: 150, height: 150,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#16a085',
        alignItems: 'center',
        justifyContent: 'center'
    },

    ImageBackground: {
        height: 300,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageStyle: {
        borderRadius: 100,
        width: 147.5,
        height: 147.5,
    },

    ImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,

    },
    telIcon: {
        //marginBottom:10,
        color: 'grey',
        fontSize: 30,
    },
    TextInputStyleClass: {
        backgroundColor: 'white',
        marginLeft: 20,
        textAlign: 'left',
        width: '100%',
        marginTop: 7,
        marginBottom: 7,
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#ecf0f1'
    },

    TextInputAboutStyle: {
        height: 80,
        width: '100%',
        marginLeft: 20,
        textAlignVertical: 'top',
        borderBottomWidth: 1,
        borderColor: '#ecf0f1'
    },

    TouchableRequestItems: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 2,
        borderColor: '#bdc3c7'
    },

    TouchableItemViewProfile: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#16a085',
        margin: 3,
        padding: 2,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Image: {
        borderRadius: 100,
        width: 147.5,
        height: 147.5,

    }


});