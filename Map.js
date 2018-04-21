import React, {Component} from 'react';
import {
    Button, Animated,
    Image,
    Platform, ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View, PermissionsAndroid, TextInput
} from 'react-native'

import {height, width} from "react-native-dimension";
import ActionButton from 'react-native-action-button';
import SlidingUpPanel from "rn-sliding-up-panel";
import ModalDropdown from 'react-native-modal-dropdown';
import Store from './Store'

import MapView, {AnimatedRegion, Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import CustomMarkers from "./CustomComponent/CustomMarker";
import * as axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DealDetailsMiniView from "./DealDetailsMiniView";
import {Icon} from "react-native-elements";
import DealMarker from "./Components/DealMarker";


const ASPECT_RATIO = width(100) / height(100)
const LATITUDE = 10.8105831
const LONGITUDE = 106.7091422
const LATITUDE_DELTA = 0.0922 * 0.1
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO



const mapStyle = [
    {
        "featureType": "poi.attraction",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#1dc925"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station.bus",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            filter: [],
            visible: false,
            draggable: true,
            type: 'Tất cả',
            age: 'Tất cả',
            district: 'Tất cả',
            myCoordinate:
                {
                    latitude: 0,
                    longitude: 0,
                },
            draggableMap: false,
            visibleMap: false,
            maxtop: false,
            place: "",
            showDetail: false,
            currentUser:
                {
                    id: '',
                    name: '',
                    type: "",
                    date: "",
                    time1: "",
                    time2: "",
                    url: "",
                    position: "",
                    phone: '',
                    mail: '',
                    about: '',
                },
            mapRegion:
                {
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                },
            myCoordinate:
                {
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                },
            mapDelta:
                {
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                },
            markerSize: 60,
            markers: [],
            statusBarHeight: 0,
        }
        ;

        this.LoadData();


    }

    FilterUsers = (type, age, position) => {
        var _result = [];
        var _type = (type == null) ? this.state.type : type;
        if (_type != 'Tất cả') {
            this.state.users.map(user => {
                if (user.type == _type || user.type == 'Tất cả') {

                    _result.push(user);
                }
            })
        }
        else {
            _result = this.state.users.slice();
        }
        var _result2 = _result.slice();
        var _age = (age == null) ? this.state.age : age;
        if (_age != 'Tất cả') {
            _result.map(user => {
                if (user.age != _age && user.age != 'Tất cả') {
                    _result2.pop(user);
                }
            })
        }
        var _result3 = _result2.slice();
        var _position = (position == null) ? this.state.district : position;
        if (_position != 'Tất cả') {
            _result2.map(user => {
                if (user.position != _position && user.position != 'Tất cả') {
                    _result3.pop(user);
                }
            })
        }

        this.setState({filter: _result3})
    };

    LoadData = async () => {
        return await fetch('http://71dongkhoi.esy.es/getDeal.php')
            .then((response) => response.json())
            .then((responseJson) => {
                //this.setState({users: responseJson});


                //    console.log(responseJson);
                this.setState({users: responseJson, filter: responseJson});
            })
            .catch((error) => {
                console.error(error);
            });
    };


    hasLocationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version < 26) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAnWillid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
    }


    componentWillMount() {

        const hasLocationPermission = this.hasLocationPermission();

        if (!hasLocationPermission) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
                // Create the object to update this.state.mapRegion through the onRegionChange function
                let region = {
                    latitude: lat,
                    longitude: long,
                }
                this.setState({myCoordinate: region, mapRegion: region});
            },
            (error) => {
                // See error code charts below.
            }, {enableHighAccuracy: false, timeout: 25000}
        );
    }

    componentDidMount() {
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{position: 'absolute', marginTop: this.state.statusBarHeight}}>
                    <MapView
                        ref={ref => this.mapRef = ref}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        customMapStyle={mapStyle}
                        loadingEnabled={true}
                        //mapPadding={{top:50,left:50,right:50,bottom:50}}
                        initialRegion={{
                            latitude: this.state.myCoordinate.latitude,
                            longitude: this.state.myCoordinate.longitude,
                            latitudeDelta: this.state.mapDelta.latitudeDelta,
                            longitudeDelta: this.state.mapDelta.longitudeDelta
                        }}
                        onRegionChangeComplete={region => {
                            if (region.latitudeDelta > LATITUDE_DELTA * 0.3) {
                                this.setState({
                                    mapRegion: {
                                        latitude: region.latitude,
                                        longitude: region.longitude
                                    },
                                    mapDelta: {
                                        latitudeDelta: region.latitudeDelta,
                                        longitudeDelta: region.longitudeDelta
                                    }
                                });

                                //   console.log(region.longitude);
                            }
                        }}

                    >

                        {
                            this.state.filter.map(user => (
                                    <DealMarker
                                        key={user.id}
                                        deal={user}
                                        onPressed={() => {

                                            this.setState({visibleMap: true});
                                            this.setState({
                                                currentUser: {
                                                    id: user.id,
                                                    name: user.name,
                                                    type: user.type,
                                                    date: user.date,
                                                    time1: user.time1,
                                                    time2: user.time2,
                                                    url : user.url,
                                                    position: user.position,
                                                    phone : user.phone,
                                                    email : user.email,
                                                    about: user.about,
                                                },
                                            });

                                            axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + user.latitude + ',' + user.longitude + '&key=AIzaSyC-H415RwIwooot2IeOqn9SsX1jEof8QxA') // be sure your api key is correct and has access to the geocode api
                                                .then(response => {
                                                    var address = response.data.results[0].formatted_address.toString().split(/,/);

                                                    this.setState({place: (address[0] + "," + address[1] + "," + address[2])}); // access from response.data.results[0].formatted_address
                                                }).catch((error) => { // catch is called after then
                                                //alert("Eeeeeee");
                                            });
                                        }}
                                    />
                                )
                            )
                        }
                        <Marker

                            anchor={{x: 0.5, y: 0.5}}
                            coordinate={{
                                latitude: this.state.myCoordinate.latitude,
                                longitude: this.state.myCoordinate.longitude
                            }}>
                            <View style={{
                                height: this.state.markerSize,
                                width: this.state.markerSize,
                                borderRadius: this.state.markerSize / 2,
                                borderWidth: 3,
                                borderColor: 'rgba(0,122,255,0.4)',
                                overflow: 'hidden',
                                backgroundColor: 'rgba(0,122,255,0.2)',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <View style={styles.marker}/>
                            </View>
                        </Marker>
                    </MapView>
                    <View style={{
                        backgroundColor: 'rgba(255,255,255 ,0.95)',
                        flexDirection: 'row',
                        height: height(7),
                        margin: height(2),
                        borderRadius: 5,
                        marginTop: -height(100) + height(2),

                    }}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{margin: 1, borderRightWidth: 1, borderColor: 'grey'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        return this.props.navigation.navigate('ManHinh_DealListView', {
                                            Phone: this.props.navigation.state.params.Phone,
                                            Url: this.props.navigation.state.params.Url,
                                            Name: this.props.navigation.state.params.Name,
                                            Id: this.props.navigation.state.params.Id,
                                            Email: this.props.navigation.state.params.Email,
                                            About: this.props.navigation.state.params.About,
                                        });
                                    }}>
                                    <View style={{marginRight: 5}}>
                                        <FontAwesome name="search" size={height(3)} color="#4CAF50"/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 5, justifyContent: 'center'}}>
                            <TextInput editable={false} maxLength={100} multiline={false}
                                       placeholder={""} spellcheck={false}
                                       placeholderTextColor={'#9E9E9E'} underlineColorAndroid={'transparent'}
                                       autoFocus={false}>
                                {this.state.place}
                            </TextInput>
                        </View>

                        <View style={{flex: 1}}>

                        </View>
                    </View>
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: width(6.5),
                        width: width(13),
                        height: width(13),
                        marginLeft: width(5),
                        marginTop: width(7.5),
                    }}/>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: width(6.5),
                            backgroundColor: 'white',
                            width: width(13),
                            height: width(13),
                            marginLeft: width(5) - 3,
                            marginTop: -width(13) - 1
                        }}
                        onPress={() => {
                            this.mapRef.Location
                            this.mapRef.animateToCoordinate({
                                latitude: this.state.myCoordinate.latitude,
                                longitude: this.state.myCoordinate.longitude
                            }, 500);
                        }}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <MaterialIcons name="my-location" size={width(4)} color="#4CAF50"/>
                        </View>
                    </TouchableOpacity>
                    <SlidingUpPanel
                        ref={c => this._panel = c}
                        visible={this.state.visibleMap}
                        draggableRange={{
                            top: height(40),
                            bottom: height(5)
                        }}
                        allowDragging={this.state.draggable}
                        showBackdrop={false}>

                        <View style={{
                            flex: 1,
                            borderRadius: 5,
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 3
                            },
                            shadowRadius: 5,
                            shadowOpacity: 1.0,
                            backgroundColor: 'white',
                            elevation: 1,
                        }}>

                            <View style={{height: 5, width: '100%'}}>
                                <Icon name="menu" size={20}/>
                            </View>

                            <View style={{backgroundColor: 'white', height: height(42)}}>
                                <DealDetailsMiniView
                                    MyId ={this.props.navigation.state.params.Id}
                                    TeamId={this.state.currentUser.id}
                                    name={this.state.currentUser.name}
                                    type={this.state.currentUser.type}
                                    date={this.state.currentUser.date}
                                    time1={this.state.currentUser.time1}
                                    time2={this.state.currentUser.time2}
                                    avatar={this.state.currentUser.url}
                                    position={this.state.currentUser.position}
                                    phone={this.state.currentUser.phone}
                                    This={this}
                                />
                            </View>

                        </View>
                    </SlidingUpPanel>
                </View>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: width(6.5),
                    width: width(13),
                    height: width(13),
                    marginTop: (height(10) + width(24)),
                    marginLeft: width(5)
                }}/>
                <View style={{height: height(100), marginTop: -width(13) - 1}}>
                    <ActionButton buttonColor="rgba(255,255,255,1)"
                                  buttonTextStyle={{color: 'black'}}
                                  verticalOrientation={"down"}
                                  position={'left'}
                                  size={width(13)}
                                  offsetX={width(5) - 3}
                                  offsetY={0}
                                  spacing={5}
                                  degrees={0}
                                  renderIcon={active => active == false ? (
                                      <MaterialCommunityIcons name={"menu"} size={width(5)} color="#4CAF50"/>) : (
                                      <FontAwesome name={"close"} size={width(5)} color="#4CAF50"/>)}>
                        <ActionButton.Item
                            offsetX={width(5)}
                            title={"Trang cá nhân"}
                            spaceBetween={5}
                            onPress={() => {
                                this.props.navigation.navigate('ManHinh_User', {
                                    Phone: this.props.navigation.state.params.Phone,
                                    Url: this.props.navigation.state.params.Url,
                                    Name: this.props.navigation.state.params.Name,
                                    Id: this.props.navigation.state.params.Id,
                                    Email: this.props.navigation.state.params.Email,
                                    About: this.props.navigation.state.params.About,
                                });
                            }}>
                            <View
                                style={{
                                    width : width(13),
                                    height : width(13),
                                    borderRadius : width(6.5),
                                    alignItems : 'center',
                                    justifyContent : 'center',
                                    borderColor :"#4CAF50",
                                    borderWidth : 3,
                                }}>
                                <Image
                                    style={{
                                        width: width(13) - 6,
                                        height: width(13) - 6,
                                        borderRadius: width(6.5) - 3,

                                    }}
                                    source={{
                                        uri: this.props.navigation.state.params.Url,
                                    }}/>
                            </View>
                        </ActionButton.Item>
                        <ActionButton.Item
                            offsetX={width(5)}
                            title={"Lọc"}
                            spaceBetween={5}
                            onPress={() => this.setState({visible: true})}>
                            <FontAwesome name="sliders" color="#4CAF50" size={width(5.2)}/>
                        </ActionButton.Item>
                        <ActionButton.Item
                            offsetX={width(5)}
                            title={"Tạo kèo"}
                            spaceBetween={5} onPress={() => {
                            this.props.navigation.navigate('ManHinh_Deal', {
                                Id: this.props.navigation.state.params.Id,
                                Url: this.props.navigation.state.params.Url,
                                Latitude: this.state.myCoordinate.latitude,
                                Longitude: this.state.myCoordinate.longitude
                            });

                        }}>
                            <MaterialCommunityIcons name="soccer" color="#4CAF50" size={width(5.2)}/>
                        </ActionButton.Item>

                    </ActionButton>
                </View>
                <SlidingUpPanel
                    ref={c => this._panel = c}
                    visible={this.state.visible}
                    allowDragging={this.state.draggable}
                    draggableRange={{top: height(40), bottom: height(5)}}
                    onRequestClose={() => this.setState({visible: false})}
                    showBackdrop={false}>
                    <View style={{
                        borderTopWidth: 2,
                        borderColor: '#95a5a6',
                        borderRadius: 10,
                        backgroundColor: '#f5f6fa',
                        height: height(40),
                        marginLeft: width(1),
                        marginRight: width(1)
                    }}>
                        <TouchableOpacity
                            style={{flex: 1.5}}
                            onPress={() => {
                                if (this.state.draggable == true) {
                                    this._panel.transitionTo(height(1));
                                    this.setState({visible: false});
                                }
                            }}>
                            <View style={{
                                margin: 5,
                                borderRadius: 10,
                                alignItems: 'center',
                                backgroundColor: '#f5f6fa',
                            }}>
                                <Text style={{
                                    fontSize: height(4),
                                    color: "#2c3e50",
                                    fontFamily: 'helveticaneuemedium'
                                }}>filter</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 8, backgroundColor: "#f5f6fa", borderRadius: 5, margin: 10}}>
                            <View style={{flex: 0.1}}/>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1.5,
                                margin: 7,
                                justifyContent: 'space-between'
                            }}>
                                <View style={{
                                    borderRadius: 3,
                                    marginBottom: 10,
                                    marginTop: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: (this.state.type == 'Tất cả') ? '#c0392b' : '#27ae60'
                                }}>
                                    <Text style={{
                                        margin: 5,
                                        color: '#f5f6fa',
                                        justifyContent: 'center',
                                        fontFamily: 'helveticaneuemedium'
                                    }}>Teams type:</Text>
                                </View>
                                <View style={{width: width(50)}}>
                                    <ModalDropdown

                                        dropdownStyle={{width: width(50), height: height(5) * 3, alignItems: 'stretch'}}
                                        textStyle={{color: '#EEEEEE', textAlign: 'right'}}
                                        dropdownTextStyle={{fontSize: height(3), textAlign: 'right'}}
                                        options={['Tất cả', '5', '10']}
                                        defaultIndex={0}
                                        onSelect={(idx, type) => {
                                            this.setState({type: type, draggable: true});
                                            this.FilterUsers(type, null, null);
                                        }}
                                        onDropdownWillShow={() => this.setState({draggable: false})}
                                        onDropdownWillHide={() => this.setState({draggable: true})}>
                                        <View
                                            style={{alignItems: 'flex-end', height: height(5)}}>
                                            <Text style={{fontSize: height(3)}}>{this.state.type}</Text>
                                        </View>
                                    </ModalDropdown>
                                </View>

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1.5,
                                margin: 7,
                                justifyContent: 'space-between'
                            }}>
                                <View style={{
                                    borderRadius: 3,
                                    marginBottom: 10,
                                    marginTop: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: (this.state.age == 'Tất cả') ? '#c0392b' : '#27ae60'
                                }}>
                                    <Text style={{
                                        margin: 5,
                                        color: '#f5f6fa',
                                        justifyContent: 'center',
                                        fontFamily: 'helveticaneuemedium'
                                    }}>Age
                                        : </Text>
                                </View>
                                <View style={{width: width(50)}}>
                                    <ModalDropdown
                                        dropdownStyle={{width: width(50), height: height(5) * 3, alignItems: 'stretch'}}
                                        textStyle={{color: '#EEEEEE', textAlign: 'right'}}
                                        dropdownTextStyle={{fontSize: height(3), textAlign: 'right'}}
                                        options={['Tất cả', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']}
                                        defaultIndex={0}
                                        onSelect={(idx, age) => {
                                            this.setState({age: age, draggable: true});
                                            this.FilterUsers(null, age, null);
                                        }}
                                        onDropdownWillShow={() => this.setState({draggable: false})}
                                        onDropdownWillHide={() => this.setState({draggable: true})}>
                                        <View style={{alignItems: 'flex-end', height: height(5)}}>
                                            <Text style={{fontSize: height(3)}}>{this.state.age}</Text>
                                        </View>
                                    </ModalDropdown>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1.5,
                                margin: 7,
                                justifyContent: 'space-between'
                            }}>
                                <View style={{
                                    borderRadius: 3,
                                    marginBottom: 10,
                                    marginTop: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: (this.state.district == 'Tất cả') ? '#c0392b' : '#27ae60'
                                }}>
                                    <Text style={{
                                        margin: 5,
                                        color: '#f5f6fa',
                                        justifyContent: 'center',
                                        fontFamily: 'helveticaneuemedium'
                                    }}>District:</Text>
                                </View>
                                <View style={{width: width(50)}}>
                                    <ModalDropdown
                                        dropdownStyle={{

                                            width: width(50),
                                            height: height(5) * 3,
                                            alignItems: 'stretch',
                                        }}
                                        textStyle={{color: '#EEEEEE', textAlign: 'right'}}
                                        dropdownTextStyle={{fontSize: height(3), textAlign: 'right'}}
                                        options={['Tất cả', 'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Quận Bình Tân', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Thủ Đức', 'Khác..']}
                                        defaultIndex={0}
                                        onSelect={(idx, district) => {
                                            this.setState({district: district, draggable: true})
                                            this.FilterUsers(null, null, district);
                                        }}
                                        onDropdownWillShow={() => this.setState({draggable: false})}
                                        onDropdownWillHide={() => this.setState({draggable: true})}>
                                        <View style={{alignItems: 'flex-end', height: height(5)}}>
                                            <Text style={{fontSize: height(3)}}>{this.state.district}</Text>
                                        </View>
                                    </ModalDropdown>
                                </View>

                            </View>
                        </View>
                    </View>
                </SlidingUpPanel>
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
        },
        map: {
            flex: 1,
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: width(100),
            height: height(100),
        },
        text: {
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 10,
            marginBottom: 10,
        },
        shadowStyle: {
            backgroundColor: 'rgba(255,255,255, 0.9)',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#000',
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 1,
            elevation: 4,
            alignItems: 'center',
        },
        marker:
            {
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 3,
                borderColor: 'white',
                overflow: 'hidden',
                backgroundColor: '#007AFF'
            },

    }
);