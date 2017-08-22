/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    Text,
    View,
    AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import Dimensions from 'Dimensions';
import * as Progress from 'react-native-progress';
import Button from 'react-native-button'

const {width, height} = Dimensions.get('window');

let pickPhotoOptions = {
    title: '选择头像',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'从相册...',

    quality:0.8,
    allowsEditing:true,
    noData:true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logined: false,
            user: null,
            avatarProgress: 0,
            avatarUploading: false,
        };

        this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
        this._pickPhoto = this._pickPhoto.bind(this);
        this._uploadToCloud = this._uploadToCloud.bind(this);

    }

    static navigationOptions = ({ navigation }) => ({
        title: '我的',
        headerRight :
            <Button style={{color:'white',fontSize:14,padding:10,paddingLeft:20}}
                    onPress={()=>{ navigation.navigate('EditInfo'); }} >编辑</Button>
        });

    render() {

        let user = this.state.user;

        if (!user) {
            return <View />
        }

        //图床   国外 配置简单 国内  7牛

        //国外的:http://cloudinary.com/
        //7牛：https://portal.qiniu.com/signup?code=3lld4je7hakb6

        return (
            <View style={styles.container}>
                {/*如果有用户的头像则显示用户的头像，如果没有则现在添加用户头像的图标*/}

                {user.avatar ?
                    <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>

                        <Image style={styles.avatarContainer}
                               source={{uri: user.avatar}}
                        >
                            <View style={styles.avatarBox}>

                                {/*如果是正在上传的话就显示饼状的进度条，反之就显示image*/}
                                {this.state.avatarUploading ?

                                    <Progress.Circle
                                        size={75}
                                        showsText={true}
                                        color={'#ee735d'}
                                        progress={this.state.avatarProgress}
                                    />

                                    :
                                    <Image
                                        style={styles.avatar}
                                        source={{uri: user.avatar}}
                                    >

                                    </Image>
                                }
                            </View>

                            <Text style={styles.avatarText}>点击这里更换头像</Text>


                        </Image>

                    </TouchableOpacity>
                    :

                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>添加用户头像</Text>

                        <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarBox}>


                            {/*如果是正在上传的话就显示饼状的进度条，反之就显示icon*/}
                            {this.state.avatarUploading ?

                                <Progress.Circle
                                    size={75}
                                    showsText={true}
                                    color={'#ee735d'}
                                    progress={this.state.avatarProgress}
                                />

                                :
                                <Icon
                                    name='md-add'
                                    size={45}
                                    style={styles.plusIcon}/>
                            }


                        </TouchableOpacity>

                    </View>
                }


            </View>
        );
    }

    _pickPhoto() {

        ImagePicker.showImagePicker(pickPhotoOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                let user = this.state.user;
                let avatarUri='';

                // You can display the image using either data...
                // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                //第一种方案
                //当我们需要上传图片的时候 图片的base64
                //avatarUri = 'data:image/jpeg;base64,' + response.data;


                //第二种方案
                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                    // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                    avatarUri = response.uri.replace('file://', '');
                } else {
                    // const source = {uri: response.uri, isStatic: true};
                    avatarUri = response.uri;
                }
                let file;
                if(Platform.OS === 'android'){
                    file = response.uri
                }else {
                    file = response.uri.replace('file://', '')
                }

                user.avatar = avatarUri;

                this.setState({
                    user:user
                });

                this._uploadToCloud(avatarUri);
            }
        });

    }

    _uploadToCloud2(imageData){

        let formData = new FormData();
        let file = {uri: imageData, type: 'image/png', name: 'a.jpg'};
        formData.append("file",file);

        fetch('http://api.jiazhuang.com/public/uploadImgPer',{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData,
        })
            .then((response) => response.text() )
            .then((responseData)=>{
                let responseObj = JSON.parse(responseData);
                let fullUrl = 'http://www.jiazhuang.com' + responseObj.data.img;
                let user2 = {};
                user2.avatar = fullUrl;
                user2.accessToken = '123456';
                user2.nickname = 'jack';
                AsyncStorage.setItem('user', JSON.stringify(user2))
                    .then(
                        ()=> {
                            console.log('保存到沙盒');
                        }
                    )
                    .catch((err)=> {
                        alert(err);
                    });
            })
            .catch((error)=>{console.error('error',error)});
    }

    _uploadToCloud(imageData){

        this.setState({
            avatarUploading: true,
            avatarProgress: 0,
        });

        let formData = new FormData();
        let file = {uri: imageData, type: 'image/png', name: 'a.jpg'};
        formData.append("file",file);

        let uploadRequest =  new XMLHttpRequest();
        let url = 'http://api.jiazhuang.com/public/uploadImgPer';
        uploadRequest.open('POST',url);
        uploadRequest.send(formData);

        uploadRequest.onload=()=>{
            if(uploadRequest.status!==200){
                return alert('请求失败：'+uploadRequest.responseText);
            }
            if(!uploadRequest.responseText){
                return alert('返回了一个空的消息体');
            }
            let response;
            let responseText;
            try{
                responseText = uploadRequest.responseText;
                response = JSON.parse(responseText)
                let fullUrl = 'http://www.jiazhuang.com' + response.data.img;
                let user2 = {};
                user2.avatar = fullUrl;
                user2.accessToken = '123456';
                user2.nickname = 'jack';
                AsyncStorage.setItem('user', JSON.stringify(user2))
                    .then(
                        ()=> {
                            console.log('保存到沙盒');
                        }
                    )
                    .catch((err)=> {
                        alert(err);
                    });

                this.setState({
                    avatarUploading: false,
                    avatarProgress: 0,
                });

            }catch (e){
                console.log(e);
            }
        }

        //得到上传图片的进度数据
        if (uploadRequest.upload) {
            uploadRequest.upload.onprogress = (event)=> {
                if (event.lengthComputable) {

                    let percent = Number((event.loaded / event.total).toFixed(2));

                    this.setState({
                        avatarProgress: percent,
                    });
                }

            }
        }
    }

    componentDidMount() {
        this._asyncGetAppStatus();
    }

    _asyncGetAppStatus() {
        AsyncStorage.getItem('user')
            .then(
                (data)=> {
                    let user;
                    let newState = {};
                    if (data) {

                        user = JSON.parse(data);
                    }

                    if (user && user.accessToken) {
                        newState.logined = true;
                        newState.user = user;
                    } else {
                        newState.logined = false;
                    }

                    this.setState(newState);
                }
            )
            .catch((err)=> {
                alert(err);
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

    toolBar: {
        flexDirection: 'row',
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735d',
    },
    toolBarText: {
        fontSize: 16,
        flex: 1,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },

    avatarContainer: {
        width: width,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#666',

    },
    avatarText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: 'transparent'
    },
    avatar: {
        marginBottom: 10,
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
        borderWidth: 1,
        borderColor: 'red',
        resizeMode: 'cover',
    },

    avatarBox: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',


    },
    plusIcon: {

        padding: 20,
        paddingLeft: 25,
        paddingRight: 25,
        color: '#666',
        backgroundColor: '#fff',
        borderRadius: 10,


    },

    editButton : {
        backgroundColor:'white'
    },


});

