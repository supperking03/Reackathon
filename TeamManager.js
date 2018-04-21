import React, {Component} from 'react'
import {Text, View, TouchableOpacity, ListView, Image, StyleSheet,TextInput} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Icon as MatIcon} from 'react-native-elements'
import Accordion from 'react-native-collapsible/Accordion';
import {height, width} from "react-native-dimension";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import ModalDropdown from 'react-native-modal-dropdown';

export default class TeamManager extends Component {

    constructor(props) {
        super(props);



        this.state = {
            myTeam:{
                id:'',//'1591945644237963',
                name :'',
                url:'',
                about:'',
            },
            teamFollow :[],
            isHaveTeam : false,
        };

        this.LoadData();
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
                let array = responseJson;
                var index = -1;
                array.map((team,idx)=>
                {
                    if(team.id === this.state.myTeam.id)
                    {
                        index = idx;
                    };
                });

                if(index != -1)
                {
                    this.setState({myTeam:array[index]});
                    this.setState({isHaveTeam : true});
                    console.log(array.length);
                    array.splice(index, 1);
                    console.log(array.length);
                }
                this.setState({teamFollow:array.concat(array)});
            })
            .catch((error) => {
                console.error(error);
            });
    };
    renderRow(team) {
        return (
            <View style={{
                width: '100%',
                height: height(15),
                flexDirection: 'row',
                padding: 20,
                borderTopWidth: 1,
                borderColor: '#bdc3c7'
            }}>
                <Image style={{width: 90, height: 90, alignSelf: 'center'}}
                       source={{uri: team.url}}/>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <View style={{marginLeft: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{team.name}</Text>
                            <Text style={{fontSize: 15}}>{team.about}</Text>
                        </View>
                    </View>

                </View>
            </View>


        )
    };

    render() {
        return (
            <View style={{flex: 1,position: 'absolute',width:width(100),height:height(100)}}>
                <View style={{
                    backgroundColor: 'rgba(255,255,255 ,0.95)',
                    flexDirection: 'row',
                    height: height(7),
                    margin: height(2),
                    borderRadius: 5,
                    flex : 0.7,
                    marginBottom: height(1),

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
                <View style ={{flex : 2.3,justifyContent :'center' }}>
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
                    {
                        (this.state.myTeam === true)?
                        <View style={{
                            width: '100%',
                            height: height(15),
                            flexDirection: 'row',
                            borderTopWidth: 1,
                            borderColor: '#bdc3c7',
                            marginLeft : 20
                        }}>
                            <Image style={{width: 90, height: 90, alignSelf: 'center'}}
                                   source={{uri: this.state.myTeam.url}}/>
                            <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <View style={{marginLeft: 10}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{this.state.myTeam.name}</Text>
                                        <Text style={{fontSize: 15}}>{this.state.myTeam.about}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                            :
                            <View style={{
                                width: '100%',
                                height: height(15),
                                flexDirection: 'row',
                                borderTopWidth: 1,
                                borderColor: '#bdc3c7',
                                marginLeft : 20
                            }}>
                                <TouchableOpacity
                                    onPress={()=>alert("tạo đội")}
                                    style={{flexDirection : 'row',alignItems : 'center'}}
                                >
                                    <Ionicons name="ios-add-circle-outline" size={height(7)} color="#4CAF50"/>
                                    <Text style={{fontSize : height(3),color:"#4CAF50" , marginLeft :5}} >Tạo đội của bạn</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
                <View style={{flex :7}}>
                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 2,
                        marginBottom: 2
                    }}>
                        <Text>{"Đội bạn tham gia : "}</Text>
                    </View>
                    <ListView
                        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.teamFollow)}
                        renderRow={this.renderRow.bind(this)}/>

                </View>


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


