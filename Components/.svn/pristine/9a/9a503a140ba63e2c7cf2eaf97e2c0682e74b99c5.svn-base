/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import config from '../common/config';
import request from '../common/request';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',
            verifyCode: '',
            codeAlreadySend: false,
            seconds:6,

        };

        this._login = this._login.bind(this);
        this._getVerifyCode = this._getVerifyCode.bind(this);
        this._showVerifyCode = this._showVerifyCode.bind(this);


    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.signupBox}>

                    <Text style={styles.title}>快速登录</Text>

                    <TextInput
                        placeholder='输入手机号'
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'phone-pad'}
                        style={styles.inputField}
                        onChangeText={(text)=> {
                            this.setState({
                                phoneNumber: text
                            });
                        }}

                    />


                    {this.state.codeAlreadySend ?
                        <View style={styles.verifyCodeBox}>
                            <TextInput
                                placeholder='输入验证码'
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                keyboardType={'phone-pad'}
                                style={styles.codeField}
                                onChangeText={(text)=> {
                                    this.setState({
                                        verifyCode: text
                                    });
                                }}

                            />


                            {this.state.seconds === 0 ?
                                <View style={styles.countDownBox}>
                                    <Text style={styles.countDownText} onPress={this._getVerifyCode}>重新获取</Text>

                                </View>
                                :

                                <View style={styles.countDownBox}>
                                    <Text style={styles.countDownText}>剩余{this.state.seconds}秒</Text>

                                </View>
                            }



                        </View>

                        : null
                    }


                    {this.state.codeAlreadySend ?
                        <View style={styles.btn}>
                            <Text style={styles.btnText} onPress={this._login}>登录</Text>
                        </View>
                        :
                        <View style={styles.btn}>
                            <Text style={styles.btnText} onPress={this._getVerifyCode}>获取验证码</Text>
                        </View>

                    }


                </View>


            </View>
        );
    }


    _login() {

        //去服务器验证手机号码与验证码是否匹配
        //正则匹配的
        let phoneNumber = this.state.phoneNumber;
        let verifyCode = this.state.verifyCode;
        if (!phoneNumber || !verifyCode) {
            alert('手机号码或者验证码不能为空');
            return ;
        }

        let body = {
            phoneNumber: phoneNumber,
            code:verifyCode
        };
        let url = config.api.base + config.api.verify;
        request.post(url, body)
            .then(
                (data)=> {
                    if (data && data.success) {
                        console.log('验证成功了，可以登陆，页面可以跳转了');
                        console.log(data);
                        this.props.finishLoginHandler(data.data);

                    } else {
                        alert('获取验证码失败了,请检查一下你的手机号');
                    }
                }
            )
            .catch((err)=> {
                alert('错误：' + err);
            });

    }


    _showVerifyCode() {

        console.log('开始显示验证码的输入框与开始倒计时');

        this.setState({
            codeAlreadySend:true,
            seconds:60,
        });

        this._interval = setInterval(()=>{

            if(this.state.seconds === 0){
                return clearInterval(this._interval);

            }

            this.setState({
                seconds:this.state.seconds - 1
            });
        },1000);

    }

    componentWillUnmount(){
        console.log('组件即将卸载');
        this._interval && clearInterval(this._interval);
    }

    _getVerifyCode() {

        //去服务器获取验证码了
        //正则匹配的
        let phoneNumber = this.state.phoneNumber;
        if (!phoneNumber) {
            alert('手机号码不能为空');
            return ;
        }

        let body = {
            phoneNumber: phoneNumber
        };
        let url = config.api.base + config.api.signup;
        request.post(url, body)
            .then(
                (data)=> {
                    if (data && data.success) {
                        // console.log(data);
                        this._showVerifyCode();

                    } else {
                        alert('获取验证码失败了,请检查一下你的手机号');
                    }
                }
            )
            .catch((err)=> {
                alert('错误：' + err);
            });


    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

    signupBox: {
        marginTop: 30,
        padding: 10,
    },

    title: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#555'
    },

    inputField: {
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        borderColor:'#ee735d'

    },
    codeField: {

        flex: 1,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        borderColor:'#ee735d'

    },

    verifyCodeBox:{

        height:40,
        marginBottom: 5,
        flexDirection:'row',
        justifyContent:'space-between',
    },

    countDownBox:{
        width:100,
        height:40,
        borderWidth:1,
        borderRadius:4,
        backgroundColor:'#ee735d',
        borderColor:'#ee735d',
        marginLeft:5,
        marginBottom:5,
        justifyContent:'center',
        alignItems:'center',

    },

    countDownText:{
        fontSize:16,
        color:'#fff',
        fontWeight:'600'
    },

    btn: {
        height: 40,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ee735d',
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ee735d'
    },


});

