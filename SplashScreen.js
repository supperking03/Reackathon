import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Animated, Image, Easing} from 'react-native';
export default class SplashScreen extends Component{
    constructor(){
        super();
        this.spinValue = new Animated.Value(0);
        this.springValue = new Animated.Value(0.3);
    }
    componentDidMount(){
        this.animate();
    }
    animate(){
        this.spring().start(this.spin());
    }
    spring(){
        this.springValue.setValue(0.3);
        return Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        )
    }
    spin() {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1000,
                easing: Easing.linears
            }
        ).start(() => this.spin())
    }

    render(){
        const spin = this.spinValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['-9deg', '9deg', '-9deg']
        });
        console.log(JSON.stringify(spin));
        return (
            <View style = {styles.container}>
                <Animated.Image
                    style={{
                        width: 200,
                        height: 100,
                        resizeMode: 'contain',
                        transform: [
                            {
                                rotate: spin
                            },
                            {scale: this.springValue}
                        ]}}
                    source={{uri: "https://i.imgur.com/RzeKU6X.png"}}
                />
                <Text  style={{textAlign:'center', marginTop: 20, fontSize: 30,color: "#ffffff", fontFamily:'akrobat_black'}} >FIFA onlife</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#36c6c4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
