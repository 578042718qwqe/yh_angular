/**
 * Created by wuzebo on 2017/12/5.
 */
var SERVER_URLS= [
    {name:'海南', path:'test/data/'},//测试数据
    {name:'青岛', path:'test/data2/'}//测试数据
];
function getRequestUrl(url) {
    return SERVER_URLS[0].path+url
}
angular.module('data_path', ['ngCookies']).factory('data', function () {
    if($.cookie('region')== undefined){
        window.location="login.html"
    }
    if($.cookie('region') == "海南"){
        return{
            getRequestUrl: function(url){
                return SERVER_URLS[0].path+url
            }
        };
    }else {
        alert("其他省份")
    }
});
/**
 * 获取完整服务请求url<br>
 * 为了使测试、联调工作顺利完成而不需要过多修改开发界面代码，在获取请求路径时统一使用getRequestUrl方法
 */
/*
 1、$http.get(url字符串，config可选的配置-对象类型) 返回HttpPromise对象
 2、$http.delete(url字符串，config可选的配置-对象类型) 返回HttpPromise对象
 3、$http.head(url字符串，config可选的配置-对象类型) 返回HttpPromise对象
 4、$http.jsonp(url字符串，config可选的配置-对象类型) 返回HttpPromise对象
 5、$http.post(url字符串，data对象或字符串，config可选的配置-对象类型) 返回HttpPromise对象
 6、$http.put(url字符串，data对象或字符串，config可选的配置-对象类型) 返回HttpPromise对象
 */