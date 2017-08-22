'use strict'

import Mock from 'mockjs';
import config from './config';
import queryString from 'query-string';


let request={}

//设定params json对象 {}
request.get = (url,params) =>{
    //query-string
    if(params){
        url += '?' + queryString.stringify(params)
    }

    return fetch(url).
        then((response)=> response.json())
        .then((response) => Mock.mock(response))

}


request.post = (url,body) =>{

    // let map =
    //json对象的合并   工具：lodash

    // config.map  body 合并
    // let map= _.extends(config.map,{
    //     body: JSON.stringify(body)
    // })
    let postParamater = config.map
    postParamater.body = JSON.stringify(body)

    return fetch(url,postParamater).
    then((response)=> response.json())
        .then((response) => Mock.mock(response))

}



module.exports = request