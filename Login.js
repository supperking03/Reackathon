import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, ImageBackground} from "react-native"
import SplashScreen from "./SplashScreen";
import {height, width} from "react-native-dimension";


var {FBLogin, FBLoginManager} = require('react-native-facebook-login');

export default class Login extends Component {
    getUser = (data) => {
        return fetch('http://71dongkhoi.esy.es/getUser.php')
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson[0].name);
                this.props.navigation.navigate('ManHinh_DealListView', {
                    Phone: _this.state.phone,
                    Url: _this.state.url,
                    Name: _this.state.name,
                    Id: data.credentials.userId,
                    Email: _this.state.email,
                    About: _this.state.about,
                });
                this.setState({
                    name: responseJson[0].name,
                    phone: responseJson[0].phone,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            url: "https://facebook.github.io/react-native/docs/assets/favicon.png",
            phone: "",
            email: "",
            about: ""
        };


    }


    render() {
        var _this = this;
        // _this.getUser();
        // console.log(_this.state.name);
        return (
            <View style={{flex: 1}}>
                <SplashScreen style={{position: 'absolute', width: '100%', height: '100%'}}>
                </SplashScreen>

                <View style={{
                    marginTop:500,
                    position:'absolute',
                    width: 150,
                    height: 50,
                    alignSelf:'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'transparent'
                }}>
                    <FBLogin style={{ width: 150,height: 50}}
                             ref={(fbLogin) => {
                                 this.fbLogin = fbLogin
                             }}
                             permissions={["email", "user_friends"]}
                             loginBehavior={FBLoginManager.LoginBehaviors.Native}
                             onLogin={function (data) {
                                 return fetch('http://71dongkhoi.esy.es/getUser.php?id=' + data.credentials.userId)
                                     .then((response) => response.json())
                                     .then((responseJson) => {
                                         //_this.setState({ user : data.credentials });
                                         _this.setState({
                                             url: data.profile.picture.data.url,
                                             name: data.profile.name
                                         });

                                         //name
                                         if (_this.state.name != responseJson[0].name) {
                                             _this.setState({
                                                 name: responseJson[0].name,
                                                 phone: responseJson[0].phone,
                                                 email: responseJson[0].email,
                                                 about: responseJson[0].about,
                                             });
                                         }
                                         else {
                                             _this.setState({
                                                 phone: responseJson[0].phone,
                                                 email: responseJson[0].email,
                                                 about: responseJson[0].about,
                                             });
                                         }
                                         // url
                                         if (_this.state.url != responseJson[0].url) {
                                             _this.setState({
                                                 url: responseJson[0].url
                                             });
                                         }

                                         if (responseJson[0].url === undefined) {
                                             _this.setState({
                                                 url: "http://graph.facebook.com/" + data.credentials.userId + "/picture?type=large",
                                             });
                                         }

                                         if (responseJson[0].name === undefined) {
                                             _this.setState({
                                                 name: data.profile.name,
                                             });
                                         }
                                         _this.props.navigation.navigate('ManHinh_DealListView', {
                                             Phone: _this.state.phone,
                                             Url: _this.state.url,
                                             Name: _this.state.name,
                                             Id: data.credentials.userId,
                                             Email: _this.state.email,
                                             About: _this.state.about,
                                         });
                                     })


                                 // _this.props.navigation.navigate('ManHinh_User',{Url : _this.state.url, Name: _this.state.name, Id: data.credentials.userId });

                             }}
                             onLogout={function () {
                                 console.log("Logged out.");
                                 _this.setState({user: null});
                                 _this.setState({
                                     url: "https://facebook.github.io/react-native/docs/assets/favicon.png",
                                     name: "user"
                                 })
                             }}
                             onLoginFound={function (data) {
                                 console.log("Existing login found.");

                                 return fetch('http://71dongkhoi.esy.es/getUser.php?id=' + data.credentials.userId)
                                     .then((response) => response.json())
                                     .then((responseJson) => {
                                         console.log(responseJson[0].name);
                                         //_this.setState({ user : data.credentials });
                                         _this.setState({
                                             name: responseJson[0].name,
                                             phone: responseJson[0].phone,
                                             url: responseJson[0].url,
                                             email: responseJson[0].email,
                                             about: responseJson[0].about,
                                         });

                                         _this.props.navigation.navigate('ManHinh_DealListView', {
                                             Phone: _this.state.phone,
                                             Url: _this.state.url,
                                             Name: _this.state.name,
                                             Id: data.credentials.userId,
                                             Email: _this.state.email,
                                             About: _this.state.about,
                                         });
                                     })
                                     .catch((error) => {
                                         console.error(error);
                                     });


                                 //_this.setState({ user : data.credentials });
                             }}
                             onLoginNotFoundX={function () {
                                 console.log("No user logged in.");
                                 _this.setState({user: null});
                             }}
                             onError={function (data) {
                                 console.log("ERROR");
                                 console.log(data);
                             }}
                             onCancel={function () {
                                 console.log("User cancelled.");
                             }}
                             onPermissionsMissing={function (data) {
                                 console.log("Check permissions!");
                                 console.log(data);
                             }}
                    />

                    {/*<ImageBackground style={{*/}
                    {/*marginTop:*/}

                    {/*}}*/}
                    {/*source={{uri: 'https://st2.depositphotos.com/3703765/8619/i/950/depositphotos_86194374-stock-photo-ful-background-of-football-field.jpg'}}>*/}
                    {/*<View style={{backgroundColor: 'rgba(52,52,52,0.5)', flex: 1, alignItems: 'center',*/}
                    {/*justifyContent: 'center', }}>*/}
                    {/*</View>*/}
                    {/*</ImageBackground>*/}

                </View>
            </View>
        );
    }

};