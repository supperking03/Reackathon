import * as React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';
import User from "./User";
import Map from "./Map";

import {height, width} from "react-native-dimension";
import DealsListView from "./Components/DealListView";

const FirstRoute = () => <View style={[styles.container, {backgroundColor: '#ff4081'}]}/>;
const SecondRoute = () => <View style={[styles.container, {backgroundColor: '#673ab7'}]}/>;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: 'First'},
                {key: 'second', title: 'Second'},
                {key: 'third', title: 'Third'}
            ],
            About: this.props.navigation.state.params.About,
            Email: this.props.navigation.state.params.Email,
            Id: this.props.navigation.state.params.Id,
            Name: this.props.navigation.state.params.Name,
            PhoneNumber: this.props.navigation.state.params.Phone,
            Url: this.props.navigation.state.params.Url,
        };
    }

    _handleIndexChange = index => this.setState({index});

    _renderHeader = props => <TabBar {...props} style={{height: height(10)}}/>;

    _renderScene = SceneMap({
        first: ()=>{return(
            <View/>
        )},
        second: ()=>{return(
            <Map
                id={this.state.Id}
                name={this.state.Name}
                url={this.state.Url}
                phone={this.state.PhoneNumber}
                mail={this.state.Email}
                about={this.state.About}
                This={this}
            />
        )},
        third: ()=>{return(
            <User
            id={this.state.Id}
            name={this.state.Name}
            url={this.state.Url}
            phone={this.state.PhoneNumber}
            mail={this.state.Email}
            about={this.state.About}/>);},
    });

    render() {
        return (
            <TabViewAnimated
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});