import React, {Component} from 'react'
import {Text, View, TouchableOpacity, ListView, Image, StyleSheet,TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import {Icon as MatIcon} from 'react-native-elements'
import Accordion from 'react-native-collapsible/Accordion';
import {height, width} from "react-native-dimension";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import ModalDropdown from 'react-native-modal-dropdown';
import Store from "../Store";

export default class DealsListView extends Component {

    constructor(props) {
        super(props);



        this.state = {
            dataSource:[],
            filterData:[],

            selectedItems: [],
            selectedAmountFilter: 'All',
            selectedAgeFilter: 'All',
            selectedDistrictFilter: 'All'
        };

        var store = Store.getInstance();
        this.LoadData();
        store.setUsers(this.state.dataSource);

        this._renderHeader = this._renderHeader.bind(this);
        this._renderContent = this._renderContent.bind(this);

        this._renderFilterHeader = this._renderFilterHeader.bind(this);
        this._renderFilterContent = this._renderFilterContent.bind(this);


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
                this.setState({dataSource:responseJson,filterData:responseJson});
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

    _renderContent = (section, i, isActive, sections) => {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                height: 35,
                justifyContent: 'center'
            }}>


                <TouchableOpacity style={{
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#16a085',
                    margin: 3,
                    padding: 2,
                    width: 150,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{fontWeight: 'bold', color: '#16a085'}}>View profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#16a085',
                    margin: 3,
                    padding: 2,
                    width: 150,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{fontWeight: 'bold', color: '#16a085'}}>Follow</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    borderRadius: 10,
                    backgroundColor: '#16a085',
                    margin: 3,
                    padding: 2,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>Call</Text>
                </TouchableOpacity>

            </View>
        );
    };

    _renderFilterHeader = (section) => {
        {
            if (section === false)
                return (
                    <View/>
                );
            return (
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 2,
                    paddingBottom: 2
                }}>
                    <Text>{"About " + this.state.dataSource.length + " results"}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text>FILTER</Text>
                        <MatIcon name="filter-list" size={25}/>
                    </View>
                </View>
            )
        }
    };

    _renderFilterContent = (section) => {
        if (section === false)
            return (
                <View/>
            );
        return (
            <View style={{width: '100%', height: 50, flexDirection: 'row'}}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                        marginLeft: 20,
                        marginRight: 20
                    }}>
                        <ModalDropdown options={filterType.amount}
                                       style={styles.modal}
                                       dropdownStyle={styles.dropdownstyle}
                                       onSelect={(idx, value) => this._selectAmount(idx, value)}>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{color: '#16a085'}}>Team type: </Text>
                                <Text style={{color: '#16a085'}}>{this.state.selectedAmountFilter}</Text>
                                <MatIcon name="keyboard-arrow-down"/>
                            </View>
                        </ModalDropdown>

                        <ModalDropdown options={filterType.age} style={styles.modal}
                                       dropdownStyle={styles.dropdownstyle}
                                       onSelect={(idx, value) => this._selectAge(idx, value)}>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{color: '#16a085'}}>Age: </Text>
                                <Text style={{color: '#16a085'}}>{this.state.selectedAgeFilter}</Text>
                                <MatIcon name="keyboard-arrow-down"/>
                            </View>
                        </ModalDropdown>


                        <TouchableOpacity style={{
                            backgroundColor: '#16a085',
                            borderRadius: 3,
                            justifyContent: 'center',
                            height: 20,
                            alignItems: 'center',
                        }} onPress={() => this._applyFilter()}>
                            <Text style={{color: 'white'}}>Apply filter</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                        marginLeft: 20,
                        marginRight: 20
                    }}>
                        <ModalDropdown options={filterType.district} style={styles.modal}
                                       dropdownStyle={styles.dropdownstyle}
                                       onSelect={(idx, value) => this._selectDistrict(idx, value)}>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                {
                                    this.state.selectedDistrictFilter.includes("District") ? <View/> :
                                        <Text style={{color: '#16a085'}}>District: </Text>
                                }
                                <Text style={{color: '#16a085'}}>{this.state.selectedDistrictFilter}</Text>
                                <MatIcon name="keyboard-arrow-down"/>
                            </View>
                        </ModalDropdown>
                    </View>
                </View>
            </View>
        )
    };


    render() {
        const {selectedItems} = this.state.selectedItems;
        return (
            <View style={{flex: 1}}>
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
                                    return this.props.navigation.navigate('ManHinh_Map', {
                                        Phone: this.props.navigation.state.params.Phone,
                                        Url: this.props.navigation.state.params.Url,
                                        Name: this.props.navigation.state.params.Name,
                                        Id:this.props.navigation.state.params.Id,
                                        Email: this.props.navigation.state.params.Email,
                                        About: this.props.navigation.state.params.About,
                                    });
                                }}>
                                <View style={{marginRight: 5}}>
                                    <FontAwesome name="location-arrow" size={height(3)} color="#4CAF50"/>
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
                <Accordion sections={[true, false]}
                           renderHeader={this._renderFilterHeader}
                           renderContent={this._renderFilterContent}
                           initiallyActiveSection={1}
                />


                <Accordion
                    sections={this.state.filterData}
                    renderHeader={this._renderHeader.bind(this)}
                    renderContent={this._renderContent.bind(this)}
                    initiallyActiveSection={0}
                />
            </View>
        )
    }


    _selectAmount(idx, value) {
        this.setState({selectedAmountFilter: value})

    }

    _selectAge(idx, value) {
        this.setState({selectedAgeFilter: value})
    }

    _selectDistrict(idx, value) {
        this.setState({selectedDistrictFilter: value})
    };


    _applyFilter = () => {
        let ditrict = this.state.selectedDistrictFilter;
        let age = this.state.selectedAgeFilter;
        let type = this.state.selectedAmountFilter;

        // console.log(this.state.dataSource[0].position+"asa");
        let newArray = this.state.dataSource.filter(function (item, index, array) {
            return (item.position === ditrict);
        });

        newArray = newArray.filter(function (item, index, array) {
            return (item.position === age);
        });

        newArray = newArray.filter(function (item, index, array) {
            return (item.position === type);
        });


        this.setState({filterData: newArray});


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


const filterType = {
    district: ['All', 'District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 6', 'District 7', 'District 8', 'District 9', 'District 10', 'District 11', 'District 12', 'Bình Tân District', 'Bình Thạnh District', 'Gò Vấp District', 'Phú Nhuận District', 'Tân Bình District', 'Tân Phú District', 'Thủ Đức District'],
    amount: ['All', '5', '10'],
    age: ['All', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
};