/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    AlertIOS,
    TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons'
import request from '../common/request'
import config from '../common/config'
var {width, height} = Dimensions.get('window');

export default class Edit extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            rowData : this.props.rowData,
            up : this.props.rowData.voted
        };
      }

    render() {
        let rowData = this.state.rowData;
        return (
            <View style={styles.contentView}>
                <Text>{rowData.title}</Text>
                <Image source={{uri:rowData.thumb}} style={{width:width - 20,height: 150,marginTop:10}} />
                <View style={styles.bottomTool}>
                    <TouchableOpacity onPress={this.up}>
                        <View
                            style={[styles.bottmToolItem,{borderRightWidth:1,borderRightColor:'rgb(220,220,220)'}]}
                        >
                            <Ionicons
                                style={{marginRight:10,color:'red'}}
                                name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                                size={25}
                            />
                            <Text>点赞</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.bottmToolItem}>
                        <Ionicons style={{marginRight:10}} name="ios-chatboxes" size={25}/>
                        <Text>评论</Text>
                    </View>
                </View>
            </View>
        );
    }

    up = ()=>{
        let up = !this.state.up
        let rowData = this.state.rowData;
        let url = config.api.base+ config.api.up;
        let body = {
            id:rowData._id,
            up: up ? 'yes' : 'no',
            accessToken:'www'
        }
        request.post(url,body)
            .then(
                (data)=>{
                    if(data && data.success){
                        this.setState({
                            up:up
                        });
                    }else {
                        alert('取消点赞~')
                    }
                }
            ).catch(
            (err)=>{
                alert('网络错误，请稍后重试！')
            }
        );

    }
}

const styles = StyleSheet.create({
    contentView:{
        padding:10
    },
    bottomTool:{
        flexDirection:'row',
        marginTop:10
    },
    bottmToolItem:{
        flexDirection:'row',
        width:width * 0.5,
        justifyContent:'center',
        height:40,
        alignItems:'center'
    },
});
