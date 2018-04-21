import React, {Component} from 'react';
import {firebaseApp} from "./Components/FirebaseConfig";
import {Icon as EleIcon} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Icon  from 'react-native-vector-icons/Ionicons'
import {
    StyleSheet, TextInput, View, Alert, Image, Text, ActivityIndicator,
    TouchableOpacity, ImageBackground, Modal, ListView,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import RNFetchBlob from 'react-native-fetch-blob';
import SocialIcon from "react-native-elements/src/social/SocialIcon";

const storage = firebaseApp.storage();
const fs = RNFetchBlob.fs;

const rq = window.XMLHttpRequest;
const bl = window.Blob;

const Blob = RNFetchBlob.polyfill.Blob;

var ImagePicker = require('react-native-image-picker');

var options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


const uploadImage = (id, uri, mime = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
        const uploadUri = uri;
        const sessionId = id;
        let uploadBlob = null;
        const imageRef = storage.ref('images').child(`${sessionId}`);

        fs.readFile(uploadUri, 'base64')
            .then((data) => {
                window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
                window.Blob = Blob;
                return Blob.build(data, {type: `${mime};BASE64`})

            })
            .then((blob) => {
                uploadBlob = blob;
                return imageRef.put(blob, {contentType: mime})
            })
            .then(() => {
                uploadBlob.close();
                return imageRef.getDownloadURL()
            })
            .then((url) => {
                resolve(url)
                window.XMLHttpRequest = rq;
                window.Blob = bl;
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export default class User extends Component {

    renderRow(user) {

        return (
            <TouchableOpacity style={{
                width: '100%',
                height: 100,
                flexDirection: 'row',
                padding: 20,
                borderBottomWidth: 2,
                borderColor: '#bdc3c7'
            }}>
                <Image style={{width: 70, height: 70, borderRadius: 50}}
                       source={{uri: "http://graph.facebook.com/" + user.id + "/picture?type=large"}}/>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5}}>
                            <Icon name={user.gender === "Nam" ? "md-man" : "md-woman"} size={20}
                                  color={user.gender === "Nam" ? "#2980b9" : "#8e44ad"}/>
                            <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 18}}>{user.name}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 30,
                        }}>
                            <TouchableOpacity style={{
                                borderRadius: 50,
                                borderWidth: 2,
                                borderColor: '#16a085',
                                margin: 3,
                                padding: 2,
                                width: 150,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{fontWeight: 'bold', color: '#16a085'}}>Xem trang cá nhân</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableOpacity style={{justifyContent: 'center'}}>
                        <Icon size={30} name="md-checkmark-circle" color="#27ae60"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{justifyContent: 'center', marginLeft:10, marginRight:5}}>
                        <Icon size={30} name="md-remove-circle" color="#e74c3c"/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

        )
    }

    pickImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    isLoading: true,
                });
                uploadImage(this.state.TextInputId, response.uri)
                    .then(URL => this.setState({url: URL}))
                    .then(() => {
                        this.InsertDataToServer();
                    })
                    .catch(error => console.log(error))
            }
        });
    }

    componentDidMount(){
        return fetch('http://71dongkhoi.esy.es/getTeamRequest.php?id=' + this.state.TextInputId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.length + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                this.setState({
                    number:responseJson.length,
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }


    constructor(props) {

        super(props)

        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            isLoading: false,
            TextInputAbout: this.props.navigation.state.params.About,
            TextInputEmail: this.props.navigation.state.params.Email,
            TextInputName: this.props.navigation.state.params.Name,
            TextInputId: this.props.navigation.state.params.Id,
            TextInputPhoneNumber: this.props.navigation.state.params.Phone,
            url: this.props.navigation.state.params.Url,
            starCount: 4.5,
            modalVisible: false,
            dataSource: [],
            number: 0,
        }

    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    InsertDataToServer = () => {
        const {TextInputAbout} = this.state;
        const {TextInputEmail} = this.state;
        const {TextInputName} = this.state;
        const {TextInputId} = this.state;
        const {TextInputPhoneNumber} = this.state;
        this.setState({
            isLoading: true,
        });


        fetch('http://71dongkhoi.esy.es/submit_user_info.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                name: TextInputName,

                id: TextInputId,

                phone: TextInputPhoneNumber,

                url: this.state.url,

                email: TextInputEmail,

                about: TextInputAbout

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                });

// Showing response message coming from server after inserting records.
                Alert.alert(responseJson);

            }).catch((error) => {
            console.error(error);
        });


    }
    ShowDeal = () => {
        this.setState({
            isLoading: true,
        });
        return fetch('http://71dongkhoi.esy.es/getDeal.php')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                });
                console.log(responseJson);
                var count = Object.keys(responseJson).length;
                console.log(count);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    render() {
        goBack = () => {
            this.props.navigation.navigate('ManHinh_Map');
        }

        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1}}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            alert('Modal has been closed.');
                        }}>
                        <View style={{marginTop: 22}}>
                            <View>
                                <View style={{borderBottomWidth: 2,
                                    borderColor: '#bdc3c7'}}>
                                    <TouchableOpacity
                                        style={{width:'10%'}}
                                        onPress={() => {
                                            this.setState({modalVisible: false});
                                        }}>
                                        <Icon size={35} name="ios-arrow-dropdown-circle" color="grey"/>
                                    </TouchableOpacity>
                                </View>
                                <ListView dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.dataSource)}
                                          renderRow={this.renderRow.bind(this)}/>

                            </View>
                        </View>
                    </Modal>
                    <View style={styles.ImageContainer}>
                        <Spinner visible={this.state.isLoading}>
                            <ActivityIndicator style={{
                                margin: 200,
                                flex: 0.1,
                                justifyContent: 'center',
                            }} size="large"/>
                        </Spinner>
                        <ImageBackground style={{
                            height: 300,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }} source={{uri: this.state.url}}>
                            <View style={{
                                flexDirection: 'row',
                                height: 50,
                                width: '100%',
                                justifyContent: 'space-between',
                                backgroundColor: 'rgba(0,0,0,0.65)',
                                paddingRight: 20,
                                paddingLeft: 20
                            }}>
                                <TouchableOpacity onPress={goBack} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <EleIcon size={28} name="keyboard-backspace" color="white"/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.InsertDataToServer()} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
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
                                    <TouchableOpacity onPress={this.pickImage} style={{
                                        borderRadius: 85,
                                        width: 150, height: 150,
                                        backgroundColor: 'transparent',
                                        borderWidth: 2,
                                        borderColor: '#16a085',
                                        alignItems: 'center',
                                        justifyContent: 'center'

                                    }}>

                                        <Image
                                            style={{
                                                borderRadius: 100,
                                                width: 147.5, height: 147.5,
                                            }}
                                            //source={{uri: this.props.navigation.state.params.Url}}
                                            source={{uri: this.state.url}}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.pickImage} style={{
                                        marginTop: 10,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center'
                                    }}>
                                        <EleIcon style={{}} size={20} name="create" color="#ecf0f1"/>
                                        <Text style={{color: 'white', fontSize: 15}}>Cập nhật ảnh đại diện</Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <SocialIcon
                                            iconSize={20}
                                            style={{width: 30, height: 30}}
                                            type='facebook'
                                        />
                                        <SocialIcon
                                            iconSize={20}
                                            style={{width: 30, height: 30}}
                                            type='twitter'
                                        />
                                        <SocialIcon

                                            iconSize={20}
                                            style={{width: 30, height: 30, backgroundColor: '#D42F8A'}}
                                            type='instagram'
                                        />
                                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {
                                            this.setState({modalVisible: true});
                                            fetch('http://71dongkhoi.esy.es/getTeamRequest.php?id=' + this.state.TextInputId)
                                                .then((response) => response.json())
                                                .then((responseJson) => {
                                                    console.log(responseJson);
                                                    this.setState({
                                                        dataSource:responseJson
                                                    });
                                                })
                                                .catch((error) => {
                                                    console.error(error);
                                                });
                                        }}>
                                            <Icon color='white' size={32} name='md-person-add'/>
                                            <View style={{backgroundColor: 'red', width: 18, height:18, alignItems:'center', justifyContent:'center', borderRadius:5}}>
                                                <Text style={{color:'white'}}>{this.state.number}</Text>
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
                                    // Adding hint in Text Input using Place holder.
                                    placeholder="Enter Your Name"

                                    value={this.state.TextInputName}
                                    onChangeText={TextInputName => this.setState({TextInputName})}

                                    // Making the Under line Transparent.
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}
                                />
                            </View>
                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30} name="call" color="#7f8c8d"/>

                                <TextInput
                                    value={this.state.TextInputPhoneNumber}
                                    // Adding hint in Text Input using Place holder.
                                    placeholder="Enter Phone Number"

                                    onChangeText={TextInputPhoneNumber => this.setState({TextInputPhoneNumber})}

                                    // Making the Under line Transparent.
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}
                                />
                            </View>
                            <View style={{width: '90%', borderBottomColor: 'grey', flexDirection: 'row',}}>
                                <EleIcon style={{}} size={30} name="email" color="grey"/>
                                <TextInput
                                    // Adding hint in Text Input using Place holder.
                                    placeholder="Enter Your Email.."

                                    value={this.state.TextInputEmail}
                                    onChangeText={TextInputEmail => this.setState({TextInputEmail})}

                                    // Making the Under line Transparent.
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={styles.TextInputStyleClass}
                                />
                            </View>
                            <View style={{
                                width: '90%',
                                borderBottomColor: 'grey',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{height: 40, justifyContent: 'center'}}>
                                    <EleIcon style={{}} size={30} name="chrome-reader-mode" color="#7f8c8d"/>
                                </View>
                                <TextInput
                                    // Adding hint in Text Input using Place holder.
                                    placeholder="About.."
                                    multiline={true}
                                    numberOfLines={4}

                                    value={this.state.TextInputAbout}
                                    onChangeText={TextInputAbout => this.setState({TextInputAbout})}

                                    // Making the Under line Transparent.
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='#bdc3c7'
                                    style={{
                                        height: 80,
                                        width: '100%',
                                        marginLeft: 20,
                                        textAlignVertical: 'top',
                                        borderBottomWidth: 1,
                                        borderColor: '#ecf0f1'
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({

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
// Set border Hex Color Code Here.

// Set border Radius.
        //borderRadius: 10 ,
    }

});