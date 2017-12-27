angular.module('common', []).service('addition', function ($rootScope) {//自定义模块1,
    $rootScope.qq ="88";
    this.add = function (a, b) {
        return a + b;
    }
});

angular.module('tabs', []).run(function ($rootScope) {//自定义选项卡模块
    $rootScope.data = {
        current: "1" // 1代表张三，2代表李四，3代表王五
    };
    $rootScope.yy ="666";
    $rootScope.actions =
        {
            setCurrent: function (param) {
                $rootScope.data.current = param;
            }
        }
});
//自定义指令
/*angular.module('win', []).directive('helloWorld', function() {
    return {
        restrict: 'E',
        template: '<div>弹窗5</div>',
        replace: true
    };
});*/
angular.module('win', []).service('addition', function ($rootScope) {//自定义模块1,
    this.pop = function (a) {
        return  template='<div>弹窗5</div>';
    }
});

//编辑表格 模块
angular.module('addressFormatter', []).filter('address', function () {
    return function (input) {
        return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
    };
});

var routerApp = angular.module('routerApp', ['ui.router',"tabs","win","data_path",'ngCookies','ngAnimate', 'ngSanitize','ui.bootstrap','ui.sortable','table']);//全局模块
routerApp.controller("dj",function ($scope,addition,$http,data,opt1) {//提示框

    $http.jsonp("https://api.github.com?callback=JSON_CALLBACK") .success(function(data) {
        console.log(data);
        // 数据
    });
    $http({
        method: 'GET',
        url: getRequestUrl("sq")
    }).then(function successCallback(response) {
        // 成功代码
        $scope.response = response;
        console.log(response)
    });
    $scope.name = 156;//测试数据(页面传参)
    $scope.dj = function () {
        swal("Good job!", "You clicked the button!", "success");
    };
});
routerApp.controller('dh_tab',function ($scope,$http,$rootScope,data,$log,$cookieStore,$location) {
    var admin = $cookieStore.get("admin") ;
    console.log( "账号:"+admin.admin + "密码:"+admin.password );//cookies导航权限
    //设置导航
    $scope.isActive = "设置";
    $scope.arr = [];
    $rootScope.Storage=window.sessionStorage;
    $scope.dh_show = function (name, url) {//导航栏
        $(".dh_name").show();
        $rootScope.gaoliang = name;
        $rootScope.isActive = name;
        $rootScope.Storage.name = name;
        var find = false;
        for(var i = 0; i < $scope.arr.length;i++) {
            if($scope.arr[i].name == name) {
                console.log($scope.arr[i]);
                find = true;
                break;
            }
        }
        if(!find) {
            var arts_s ={
                name:name,
                url:url
            };
            $scope.arr.push(arts_s);
        }
        setTimeout(function () {
            $scope.dh_with =$(".dh_name").width();
            $scope.dh_with_ul =$(".dh_name ul").width();
            $scope.dh_with_jl = $(".gaoliang").position().left;
            $scope.dh_with_w = $(".gaoliang").width();
            if(($scope.dh_with_jl+$scope.dh_with_w+120) > $scope.dh_with){
                console.log((($scope.dh_with_jl-$scope.dh_with)+$scope.dh_with_w));
                $(".dh_name_max").animate({ left:-(($scope.dh_with_jl-$scope.dh_with)+$scope.dh_with_w+180) });
            }else {
                $(".dh_name_max").animate({ left:"90px" })
            }
        },10);
    };
    $rootScope.names = $scope.arr;
    if($location.path() != "/home/list" && $rootScope.Storage.name != undefined){//刷新获取导航
        var arr = ($location.path()).split('/');
        arr.splice(0,1);
        var url = arr.join(".");
        var name = $rootScope.Storage.name;
        var obj={
            name : name,
            url : url
        };
        $rootScope.gaoliang = name;
        $rootScope.isActive = name;
        $rootScope.names.push(obj);
    }
    //读取导航
    $http({
        method: 'GET',
        url: getRequestUrl("menuData")
    }).then(function successCallback(response) {
        // 成功代码
        $scope.shezhi= response.data;
        //$scope.objects2.a = response.data.name.module;
        //$scope.objects2.f = response.data.name.xxk;
        //$scope.objects2.h = response.data.name.sourceMap;
        //$scope.objects2.g = response.data.name.sex;
    });
});

routerApp.controller("dh_name",function ($scope,$rootScope,$state,$location) {//导航选项
    $scope.dh_name_max_l = function () {
        var dh_name_max_l = $(".dh_name_max").position().left;
        console.log(dh_name_max_l);
        if(dh_name_max_l < 90){
            $(".dh_name_max").animate({ left:"90px" })
        }
    };
    $scope.dh_name_max_r = function () {
        var dh_name_max_r = $(".dh_name_max").position().left;
        console.log(dh_name_max_r);
        if(dh_name_max_r = 90){
            $(".dh_name_max").animate({ left:"-1700px" })
        }
    };
    $scope.ss =function (event) {//导航点击
        $rootScope.gaoliang = $(event.target).text().trim();
        $rootScope.isActive = $(event.target).text().trim();
        $rootScope.Storage.name = $(event.target).text().trim()
    };
    $scope.dh_close = function (event) {//导航关闭
        var key = $(event.target).attr('data');
        $rootScope.names.splice(key,1);
        var url_go = $(event.target).parents("li").prev().attr("ui-sref");
        var url_text = $(event.target).parents("li").prev().text().trim();
        var url_text_next = $(event.target).parents("li").next().text().trim();
        if(url_go){
            $state.go(url_go);
            $rootScope.gaoliang = url_text;
            $rootScope.isActive = url_text;
        }
        if(url_go == undefined){
            if($(event.target).parents("li").next().attr("ui-sref") != undefined){
                $state.go($(event.target).parents("li").next().attr("ui-sref"));
                $rootScope.gaoliang = url_text_next;
                $rootScope.isActive = url_text_next;
            }else {
                $state.go("home.list");
                $(".dh_name").hide();
                console.log("不存在")
            }
        }
    };
});

routerApp.config(function($httpProvider) {//拦截器
    $httpProvider.interceptors.push('timestampMarker');
});
routerApp.factory('timestampMarker', function($rootScope,$location) {//拦截器
    return {
        response: function(response) {
            if( response.status == 200){
                //swal("访问正常！！！")
                $rootScope.$emit('locaton_url')
            }
            console.log(response);
            return response;
        },
        /*request :function(request) {
         return request;
         }*/
    };
});
/*routerApp.run(function($rootScope,$location) {//路由监听
    /!* 监听路由的状态变化 *!/
    $rootScope.$on('locaton_url',function(event, toState, toParams, fromState, fromParams) {
        console.log($location.path());
        return false
    });
});

routerApp.controller('mouseenter',function ($log,$scope) {
    $scope.mouse = function (index) {
        $log.log(index)
    };
});*/
/*routerApp.controller('myCtrl', function ($scope,addition) {//注入模块一
    $scope.ass = addition.add(5,6);
});*/
routerApp.controller("form",function ($scope,$http,data) {//绑定表单并提交
    $scope.objects2 = {};
    $http({
        method: 'GET',
        url: getRequestUrl("sq")
    }).then(function successCallback(response) {
        // 成功代码
        $scope.objects2.a = response.data.name.module;
        $scope.objects2.f = response.data.name.xxk;
        $scope.objects2.h = response.data.name.sourceMap;
        $scope.objects2.g = response.data.name.sex;
    });
    $scope.anniu = function () {//回传数据
        $scope.objects = $scope.objects2;
        console.log($scope.objects);
        $http({
            method: 'GET',
            url: getRequestUrl("sq")
        }).then(function successCallback(response) {
            // 成功代码
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    };
});
//