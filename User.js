import React, {Component} from 'react';
import {Icon as EleIcon} from 'react-native-elements';
import {firebaseApp} from "./Components/FirebaseConfig";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    StyleSheet, TextInput, View, Alert, Image, Text, ActivityIndicator,
    TouchableOpacity, ImageBackground, Modal, ListView, ScrollView
} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Share, {ShareSheet, Button} from 'react-native-share';
import Spinner from 'react-native-loading-spinner-overlay';
import SocialIcon from "react-native-elements/src/social/SocialIcon";

import RNFetchBlob from 'react-native-fetch-blob';

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

let shareOptions = {
    title: "React Native",
    message: "Join with us",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link", //  for email
    social: "facebook",
};

let shareOptions2 = {
    title: "React Native",
    message: "Join with us",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link", //  for email
    social: "twitter",
};


export default class User extends Component {
    constructor(props) {
        super(props);

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
            modalVisibleTeam: false,
            modalVisibleDeal: false,
            dataSourceTeam: [],
            dataSourceDeal: [],
            numberTeam: 0,
            numberDeal: 0,
        };


    };

    componentDidMount() {
        return fetch('http://71dongkhoi.esy.es/getTeamRequest.php?id=' + this.state.TextInputId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                this.setState({
                    numberTeam: responseJson.length,
                });
                if(responseJson === "not found")
                {
                    this.setState({
                        dataSourceTeam: [],
                        numberTeam: 0
                    });
                }
                fetch('http://71dongkhoi.esy.es/getDealRequest.php?id=' + this.state.TextInputId)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson.length + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                        this.setState({
                            numberDeal: responseJson.length,
                        });
                        if(responseJson === "not found")
                        {
                            this.setState({
                                dataSourceDeal: [],
                                numberDeal: 0
                            });
                            return;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
            .catch((error) => {
                console.error(error);
            })
    }

    componentWillMount() {
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

    navigateBackPressed = () => {
        this.props.navigation.navigate('ManHinh_Map', {
            Phone: this.state.TextInputPhoneNumber,
            Url: this.state.url,
            Name: this.state.TextInputName,
            Id: this.state.TextInputId,
            Email: this.state.TextInputEmail,
            About: this.state.TextInputAbout,
        });
    };

    pickImagePressed = () => {
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
    };

    showListRequestPressed = () => {
        this.setState({modalVisibleTeam: true});

        if (this.state.numberTeam === 0) {
            this.setState({dataSourceTeam: []});
            return;
        }

        fetch('http://71dongkhoi.esy.es/getTeamRequest.php?id=' + this.state.TextInputId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson === "not found")
                {
                    this.setState({
                        dataSourceTeam: [],
                        numberTeam: 0
                    });
                    return;
                }

                this.setState({
                    dataSourceTeam: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    hideListRequestPressed = () => {
        this.setState({modalVisibleTeam: false});
    };

    acceptTeamRequest = (user) => {
        this.setState({modalVisibleTeam: true});

        if (this.state.numberTeam === 0) {
            this.setState({dataSourceTeam: []});
            return;
        }
        fetch('http://71dongkhoi.esy.es/acceptTeamRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                id: this.state.TextInputId,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.showListRequestPressed();
                this.setState({
                    isLoading: false,
                });
                console.log(user.id + " aaa " + this.state.TextInputId);


// Showing response message coming from server after inserting records.
                Alert.alert(responseJson);

            }).catch((error) => {
            console.error(error);

        })
    };

    denyTeamRequest = (user) => {
        if (this.state.numberTeam === 1) {
            this.setState({dataSourceTeam: [], numberTeam: 0});
            // this.setState({
            //     modalVisibleTeam:false
            // })
        }
        fetch('http://71dongkhoi.esy.es/deleteTeamRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                id: this.state.TextInputId,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.showListRequestPressed();
                this.setState({
                    isLoading: false,
                });
                console.log(user.id + " aaa " + this.state.TextInputId);


// Showing response message coming from server after inserting records.
                Alert.alert(responseJson);

            }).catch((error) => {
            console.error(error);

        })
    };


    showListDealRequestPressed() {
        this.setState({modalVisibleDeal: true});

        if (this.state.numberDeal === 0) {
            this.setState({dataSourceDeal: []});
            return;
        }

        fetch('http://71dongkhoi.esy.es/getDealRequest.php?id=' + this.state.TextInputId)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson === "not found")
                {
                    this.setState({
                        dataSourceDeal: [],
                        numberDeal: 0
                    });
                    return;
                }
                this.setState({
                    dataSourceDeal: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    hideListDealRequestPressed() {
        this.setState({modalVisibleDeal: false});
    }

    acceptDealRequest =(user) => {
        this.setState({modalVisibleDeal: true});

        if (this.state.numberDeal === 0) {
            this.setState({dataSourceDeal: []});
            return;
        }
        fetch('http://71dongkhoi.esy.es/acceptDealRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                id: this.state.TextInputId,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.showListRequestPressed();
                this.setState({
                    isLoading: false,
                });
                console.log(user.id + " aaa " + this.state.TextInputId);


// Showing response message coming from server after inserting records.

            }).catch((error) => {
            console.error(error);

        });
    }

    denyDealRequest = (user) =>{
        if (this.state.numberDeal === 1) {
            this.setState({dataSourceDeal: [], numberDeal: 0});
            // this.setState({
            //     modalVisibleTeam:false
            // })
        }
        fetch('http://71dongkhoi.esy.es/deleteDealRequest.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                id: this.state.TextInputId,

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                });
                console.log(user.id + " aaa " + this.state.TextInputId);


// Showing response message coming from server after inserting records.
            }).catch((error) => {
            console.error(error);

        })
    }

    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1}}>

                    <Spinner visible={this.state.isLoading}>
                        <ActivityIndicator style={{margin: 200, flex: 0.1, justifyContent: 'center'}} size="large"/>
                    </Spinner>


                    <Modal animationType="slide" transparent={false} visible={this.state.modalVisibleTeam}
                           onRequestClose={() => {
                           }}>
                        <View style={{marginTop: 22, justifyContent: 'center'}}>
                            <View style={{borderBottomWidth: 1, borderColor: '#bdc3c7', marginBottom: 3}}>
                                <TouchableOpacity
                                    style={{alignSelf: 'center'}}
                                    onPress={this.hideListRequestPressed}>
                                    <Icon size={35} name="ios-arrow-down-outline" color="grey"/>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.numberTeam === 0 ?
                                    <View style={{
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{fontSize: 15, alignSelf: 'center'}}>No request</Text>
                                    </View> :
                                    <ListView
                                        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.dataSourceTeam)}
                                        renderRow={this.renderRow}/>
                            }

                        </View>
                    </Modal>

                    <Modal animationType="slide" transparent={false} visible={this.state.modalVisibleDeal}
                           onRequestClose={() => {
                           }}>
                        <View style={{marginTop: 22, justifyContent: 'center'}}>
                            <View style={{borderBottomWidth: 1, borderColor: '#bdc3c7', marginBottom: 3}}>
                                <TouchableOpacity
                                    style={{alignSelf: 'center'}}
                                    onPress={this.hideListDealRequestPressed.bind(this)}>
                                    <Icon size={35} name="ios-arrow-down-outline" color="grey"/>
                                </TouchableOpacity>
                            </View>

                            <ListView
                                dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.dataSourceDeal)}
                                renderRow={this.renderRowDeal.bind(this)}/>

                        </View>
                    </Modal>

                    <View style={styles.ImageContainer}>


                        <ImageBackground style={styles.ImageBackground} source={{uri: this.state.url}}>

                            <View style={styles.NavigateView}>
                                <TouchableOpacity onPress={this.navigateBackPressed.bind(this)}
                                                  style={styles.NavigateTouchable}>
                                    <EleIcon size={28} name="keyboard-backspace" color="white"/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.InsertDataToServer.bind(this)}
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
                                    <TouchableOpacity onPress={() => {
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
                                    }}
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
                                    <TouchableOpacity onPress={() => {
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
                                    }}
                                                      style={{
                                                          marginTop: 10, alignItems: 'center',
                                                          flexDirection: 'row',
                                                          justifyContent: 'center'
                                                      }}>
                                        <EleIcon style={{}} size={20} name="create" color="#ecf0f1"/>
                                        <Text style={{color: 'white', fontSize: 15}}>Cập nhật ảnh đại diện</Text>
                                    </TouchableOpacity>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>


                                        <TouchableOpacity onPress={()=>{
                                            Share.shareSingle(shareOptions);
                                        }}>
                                            <SocialIcon iconSize={20} style={{width: 30, height: 30, marginRight: 3}}
                                                        type='facebook'/>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=>{
                                            Share.shareSingle(shareOptions2);
                                        }}>
                                            <SocialIcon iconSize={20} style={{width: 30, height: 30, marginRight: 10}}
                                                        type='twitter'/>
                                        </TouchableOpacity>

                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <TouchableOpacity style={{flexDirection: 'row', width: 40}}
                                                              onPress={this.showListDealRequestPressed.bind(this)}>
                                                <FontAwesome color='white' size={30} name='globe'/>
                                                {
                                                    this.state.numberDeal === 0 ? <View/> :
                                                        <View style={{
                                                            backgroundColor: 'red',
                                                            width: 18,
                                                            height: 18,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: 5,
                                                            marginLeft: -8
                                                        }}>

                                                            <Text
                                                                style={{color: 'white'}}>{this.state.numberDeal}</Text>

                                                        </View>
                                                }
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{flexDirection: 'row', width: 40}}
                                                              onPress={this.showListRequestPressed.bind(this)}>
                                                <Icon color='white' size={30} name='md-person-add'/>
                                                {
                                                    this.state.numberTeam === 0 ? <View/> :
                                                        <View style={{
                                                            backgroundColor: 'red',
                                                            width: 18,
                                                            height: 18,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: 5,
                                                            marginLeft: -8
                                                        }}>

                                                            <Text
                                                                style={{color: 'white'}}>{this.state.numberTeam}</Text>

                                                        </View>
                                                }
                                            </TouchableOpacity>
                                        </View>
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
        onPress={() => {
            this.acceptTeamRequest(user)
        }}>
        <Icon size={30} name="md-checkmark-circle" color="#27ae60"/>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10, marginRight: 5}}
        onPress={() => {
            this.denyTeamRequest(user);
        }}>
        <Icon size={30} name="md-remove-circle" color="#e74c3c"/>
        </TouchableOpacity>
        </View>
        </TouchableOpacity>

        )
    }
    renderRowDeal(user) {
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
        onPress={()=>{this.acceptDealRequest(user)}}>
        <Icon size={30} name="md-checkmark-circle" color="#27ae60"/>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10, marginRight: 5}}
        onPress={() => {
            this.denyDealRequest(user);
        }}>
        <Icon size={30} name="md-remove-circle" color="#e74c3c"/>
        </TouchableOpacity>
        </View>
        </TouchableOpacity>

        )
    }


    }

    const
    styles = StyleSheet.create({
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