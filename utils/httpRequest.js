var Q = require('q');
var request = require('request');
const util = require('util');
var querystring = require("querystring");
var loger=require("./loger");
var requestType={
    'multipart/form-data':function(arg){
        request.post({url:arg.url, formData:arg.data}, function (error, response, body) {
            util.isFunction(arg.callBack)&&arg.callBack(error, response, body);
        })
    },
    'application/x-www-form-urlencoded':function(arg){
        request.post({url:arg.url, form:arg.data}, function(error, response, body) {
            util.isFunction(arg.callBack)&&arg.callBack(error, response, body);
        })
    },
    'application/json':function(arg){
        loger.info(arg.url,JSON.stringify(arg.data));
        request({
            url:arg.url,//arg.url,
            method:arg.method, //"POST",
            //json: true,
            headers: {
                "content-type": "application/json",
                "v":arg.v||''
            },
            body:JSON.stringify(arg.data)
        }, function(error, response, body) {
            util.isFunction(arg.callBack)&&arg.callBack(error, response, body);
        });
    }
};
/**
 * @param arg
 * arg {} url
 * arg {} method "POST/GET" 默认是GET
 * arg {} data 参数
 * arg {} callBack 回调
 * arg {} contentType  application/json；multipart/form-data；application/x-www-form-urlencoded
 */
module.exports = function(arg){
    if(arg.method=='POST' || arg.method=='PUT' || arg.method=='DELETE'){
        requestType[arg.contentType](arg);
    }else{
        var params=querystring.stringify(arg.data);
        arg.url+=/\?+/.test(arg.url)?'&'+params:'?'+params;
        request({url:arg.url,headers: {
            "v":arg.v||''
        }}, function (error, response, body) {
            util.isFunction(arg.callBack)&&arg.callBack(error, response, body);
        })
    }
};