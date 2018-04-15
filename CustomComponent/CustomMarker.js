import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import React, { Component } from 'react';
class CustomMarkers extends Component {


    constructor(props) {
        super(props);

    }

    render = () => {
        return (
            <View
                style={
                    {
                        width: 60,
                        height: 60,
                    }
                }>
                {
                    console.log("Avatar : " + this.props.avatar)
                }
                <Image
                    style={
                        {
                            width: 35,
                            height: 32,
                            marginTop : 10,
                            marginLeft : 8
                        }
                    }
                    source={{uri:this.props.avatar}}
                />

                <Image
                    style={
                        {
                            width: 60,
                            height: 60,
                            marginTop: -35,
                            marginLeft : - 4,
                        }
                    }
                    source={require('../assets/marker.png')}
                />

            </View>
        );
    }
}
const styles = StyleSheet.create({
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default CustomMarkers;