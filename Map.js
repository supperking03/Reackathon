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

import MapView, {AnimatedRegion, Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import CustomMarkers from "./CustomComponent/CustomMarker";
import * as axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


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
            type: "Tất cả",
            age: "Tất cả",
            district: "Tất cả",
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
        }
        ;


    }

    FilterUsers = (type, age, position) => {
        var _result = [];
        var _type = (type == null) ? this.state.type : type;
        if (_type != "Tất cả") {
            this.state.users.map(user => {
                if (user.type == _type || user.type == "Tất cả") {

                    _result.push(user);
                }
            })
        }
        else {
            _result = this.state.users.slice();
        }
        var _result2 = _result.slice();
        var _age = (age == null) ? this.state.age : age;
        if (_age != "Tất cả") {
            _result.map(user => {
                if (user.age != _age && user.age != "Tất cả") {
                    _result2.pop(user);
                }
            })
        }
        var _result3 = _result2.slice();
        var _position = (position == null) ? this.state.district : position;
        if (_position != "Tất cả") {
            _result2.map(user => {
                if (user.position != _position && user.position != "Tất cả") {
                    _result3.pop(user);
                }
            })
        }

        this.setState({filter: _result3})
    }

    LoadData = async () => {
        return await fetch('http://71dongkhoi.esy.es/getDeal.php')
            .then((response) => response.json())
            .then((responseJson) => {
                //this.setState({users: responseJson});
                console.log(responseJson);
                this.setState({users: responseJson, filter: responseJson});
            })
            .catch((error) => {
                console.error(error);
            });
    }


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
                alert(error.message);
            }, {enableHighAccuracy: false, timeout: 25000}
        );
    }

    componentDidMount() {
        this.LoadData();
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={{position: 'absolute', paddingTop: this.state.statusBarHeight}}>
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

                                console.log(region.longitude);
                            }
                        }}

                    >

                        {
                            this.state.filter.map(user => (
                                    <Marker
                                        key={user.id}
                                        title={user.name}
                                        onPress={() => {
                                            this.setState({visibleMap: true});
                                            this.setState({
                                                currentUser: {
                                                    id: user.id,
                                                    name: user.name,
                                                    type: user.type,
                                                    date: user.date,
                                                    time1: user.time1,
                                                    time2: user.time2,
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
                                        coordinate={
                                            {
                                                latitude: parseFloat(user.latitude),
                                                longitude: parseFloat(user.longitude),
                                            }
                                        }>
                                        <CustomMarkers
                                            avatar={user.url}>
                                        </CustomMarkers>
                                    </Marker>
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
                                <TouchableOpacity>
                                    <View style={{marginRight: 5}}>
                                        <FontAwesome name="search" size={height(3)} color="#4CAF50"/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 5, justifyContent: 'center'}}>
                            <TextInput editable={false} maxLength={100} multiline={false}
                                       placeholder={"Tìm kiếm vị trí"} spellcheck={false}
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
                        borderRadius: width(5),
                        width: width(10),
                        height: width(10),
                        marginLeft: width(5),
                        marginTop: width(7.5),
                    }}/>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: width(5),
                            backgroundColor: 'white',
                            width: width(10),
                            height: width(10),
                            marginLeft: width(5) - 3,
                            marginTop: -width(10) - 1
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
                        ref={c => this._panelMap = c}
                        visible={this.state.visibleMap}
                        style={{width: width(100)}}
                        draggableRange={{
                            top: (this.state.maxtop == false ? height(18) : height(42)),
                            bottom: height(17.5)
                        }}
                        onRequestClose={() => {
                            this.setState({maxtop: false, showDetail: false});
                        }}
                        allowDragging={true}
                        showBackdrop={false}>
                        <View
                            style={{
                                width: width(100),
                                height: (this.state.showDetail == false ? height(17) : height(42))
                            }}>
                            {
                                <TouchableOpacity
                                    onPress={() => {
                                        // this.setState({maxtop: true, showDetail: true});
                                        // this._panelMap.transitionTo(height(42));
                                    }}>
                                    <View style={styles.shadowStyle}>
                                        <View style={{
                                            backgroundColor: 'black',
                                            width: width(30),
                                            height: height(1),
                                            borderRadius: 2
                                        }}/>
                                        <View style={{
                                            height: height(16),
                                            width: width(95),
                                            borderRadius: 10
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                marginTop: 10,
                                                height: height(8)
                                            }}>
                                                <Text
                                                    alignment='center'
                                                    style={{
                                                        fontSize: 17,
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                        flex: 3,
                                                    }}>{"Tìm đội " + this.state.currentUser.type}</Text>
                                                <View style={{flex: 4, flexDirection: 'row'}}>
                                                    <MaterialIcons name="location-on" size={20}/>
                                                    <Text numberOfLines={1}
                                                          ellipsizeMode='tail'
                                                          alignment='left'
                                                          style={{
                                                              fontSize: 15,
                                                              color: 'black',
                                                          }}>{}</Text>
                                                </View>
                                            </View>
                                            <View style={{flex: 1, flexDirection: 'row', height: height(8)}}>
                                                <MaterialIcons name="access-time" size={20} style={{marginLeft : 20}}/>
                                                <Text
                                                    alignment='left'
                                                    style={{
                                                        fontSize: 15,
                                                        color: 'black',
                                                    }}>{("   " + this.state.currentUser.date)}</Text>
                                                <Text
                                                    alignment='left'
                                                    style={{
                                                        fontSize: 15,
                                                        color: 'blue',
                                                    }}>{"   " + this.state.currentUser.time1 + "-" + this.state.currentUser.time2}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }

                        </View>
                    </SlidingUpPanel>
                </View>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: width(5),
                    width: width(10),
                    height: width(10),
                    marginTop: (height(10) + width(21.5)),
                    marginLeft: width(5)
                }}/>
                <View style={{height: height(100), marginTop: -width(10) - 1}}>
                    <ActionButton buttonColor="rgba(255,255,255,1)"
                                  buttonTextStyle={{color: 'black'}}
                                  verticalOrientation={"down"}
                                  position={'left'}
                                  size={width(10)}
                                  offsetX={width(5) - 3}
                                  offsetY={0}
                                  spacing={5}
                                  degrees={0}
                                  renderIcon={active => active == false ? (
                                      <MaterialCommunityIcons name={"menu"} size={width(5)} color="#4CAF50"/>) : (
                                      <FontAwesome name={"close"} size={width(5)} color="#4CAF50"/>)}>
                        <ActionButton.Item
                            offsetX={width(5)}
                            title={"Lọc thông tin"}
                            spaceBetween={5}
                            onPress={() => this.setState({visible: true})}>
                            <FontAwesome name="sliders" color="#4CAF50" size={width(4)}/>
                        </ActionButton.Item>
                        <ActionButton.Item
                            offsetX={width(5)}
                            title={"Đặt kèo"}
                            spaceBetween={5} onPress={() => {

                        }}>
                            <MaterialCommunityIcons name="soccer" color="#4CAF50" size={width(4)}/>
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
                        backgroundColor: 'white',
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
                                alignItems: 'center',
                                backgroundColor: '#AED581',
                                borderColor: '#9CCC65',
                                borderWidth: 1,
                            }}>
                                <Text style={{fontSize: height(4)}}>Lọc thông tin</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 0.1}}/>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1.5,
                            margin: 7,
                            borderBottomColor: 'blue',
                            borderBottomWidth: 1
                        }}>
                            <Text style={{marginLeft: 5, flex: 7, fontSize: height(3), fontWeight: 'bold'}}>Số người đá : </Text>
                            <View style={{flex: 4}}>
                                <ModalDropdown
                                    dropdownStyle={{width: width(40), height: height(5) * 3, alignItems: 'stretch'}}
                                    textStyle={{color: '#EEEEEE'}}
                                    dropdownTextStyle={{fontSize: height(3), textAlign: 'right'}}
                                    options={['Tất cả', '5', '10']}
                                    defaultIndex={0}
                                    onSelect={(idx, type) => {
                                        this.setState({type: type, draggable: true});
                                        this.FilterUsers(type, null,null);
                                    }}
                                    onDropdownWillShow={() => this.setState({draggable: false})}
                                    onDropdownWillHide={() => this.setState({draggable: true})}>
                                    <View
                                        style={{width: width(48), alignItems: 'center', height: height(5)}}>
                                        <Text style={{fontSize: height(3)}}>{this.state.type}</Text>
                                    </View>
                                </ModalDropdown>
                            </View>
                            <View style={{flex: 1,}}/>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1.5,
                            margin: 7,
                            borderBottomColor: 'blue',
                            borderBottomWidth: 1
                        }}>
                            <Text style={{marginLeft: 5, flex: 7, fontSize: height(3), fontWeight: 'bold'}}>Độ tuổi
                                : </Text>
                            <View style={{flex: 4}}>
                                <ModalDropdown
                                    dropdownStyle={{width: width(40), height: height(5) * 3, alignItems: 'stretch'}}
                                    textStyle={{color: '#EEEEEE'}}
                                    dropdownTextStyle={{fontSize: height(3), textAlign: 'right'}}
                                    options={['Tất cả', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']}
                                    defaultIndex={0}
                                    onSelect={(idx, age) => {
                                        this.setState({age: age, draggable: true});
                                        this.FilterUsers(null, age , null);
                                    }}
                                    onDropdownWillShow={() => this.setState({draggable: false})}
                                    onDropdownWillHide={() => this.setState({draggable: true})}>
                                    <View style={{width: width(48), alignItems: 'center', height: height(5)}}>
                                        <Text style={{fontSize: height(3)}}>{this.state.age}</Text>
                                    </View>
                                </ModalDropdown>
                            </View>
                            <View style={{flex: 1,}}/>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1.5,
                            margin: 7,
                            borderBottomColor: 'blue',
                            borderBottomWidth: 1
                        }}>
                            <Text style={{marginLeft: 5, flex: 7, fontSize: height(3), fontWeight: 'bold'}}>Khu vực
                                : </Text>
                            <View style={{flex: 4}}>
                                <ModalDropdown
                                    dropdownStyle={{
                                        width: width(40),
                                        height: height(5) * 3,
                                        alignItems: 'stretch',
                                    }}
                                    textStyle={{color: '#EEEEEE'}}
                                    dropdownTextStyle={{fontSize: height(3), textAlign: 'right'}}
                                    options={['Tất cả', 'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Quận Bình Tân', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Thủ Đức', 'Khác..']}
                                    defaultIndex={0}
                                    onSelect={(idx, district) => {
                                        this.setState({district: district, draggable: true})
                                        this.FilterUsers(null,null,district);
                                    }}
                                    onDropdownWillShow={() => this.setState({draggable: false})}
                                    onDropdownWillHide={() => this.setState({draggable: true})}>
                                    <View style={{width: width(48), alignItems: 'center', height: height(5)}}>
                                        <Text style={{fontSize: height(3)}}>{this.state.district}</Text>
                                    </View>
                                </ModalDropdown>
                            </View>
                            <View style={{flex: 1,}}/>
                        </View>
                        <View style={{flex: 1}}/>
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