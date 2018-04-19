import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import React, { Component } from 'react';
class CustomMarkers extends Component {


    constructor(props) {
        super(props);
        this.state={
            _this : this.props._this
        }

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
                <Image
                    style={
                        {
                            width: 35,
                            height: 32,
                            marginTop : 10,
                            marginLeft : 8,
                            zIndex : 3
                        }
                    }
                    source={{uri:this.props.avatar , width : 35, height : 32}}
                />

                <Image
                    style={
                        {
                            width: 60,
                            height: 60,
                            marginTop: -35,
                            marginLeft : - 4,
                            zIndex : 4,
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