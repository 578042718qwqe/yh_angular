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

var routerApp = angular.module('routerApp', ['ui.router',"tabs", 'ui.grid', 'ui.grid.edit', 'addressFormatter','ui.grid.pagination',"win","data_path",'ngCookies']);//全局模块
routerApp.controller("dj",function ($scope,addition,$http,data) {//提示框
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
    $scope.dj = function () {
        swal("Good job!", "You clicked the button!", "success");
    };
});
routerApp.controller('dh_tab',function ($scope,$http,$rootScope,data,$log,$cookieStore,$location) {
    var admin = $cookieStore.get("admin") ;
    alert( "账号:"+admin.admin + "密码:"+admin.password );//cookies导航权限
    //设置导航
    $scope.isActive = "设置";
    $scope.arr = [];
    $scope.dh_show = function (name, url) {
        $rootScope.gaoliang = name;
        $rootScope.isActive = name;
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
        console.log($scope.arr);
    };
    $rootScope.names = $scope.arr;
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

routerApp.config(function($httpProvider) {//拦截器
    $httpProvider.interceptors.push('timestampMarker');
});
routerApp.factory('timestampMarker', function() {//拦截器
    return {
        response: function(response) {
            console.log(response);
            return response;
        }
    };
});

routerApp.controller("dh_name",function ($scope,$rootScope,$state) {//导航选项
    $scope.ss =function (event) {
        $rootScope.gaoliang = $(event.target).text().trim();
        $rootScope.isActive = $(event.target).text().trim();
    };
    $scope.dh_close = function (event) {
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
                console.log("不存在")
            }
        }
    };
});
routerApp.controller('mouseenter',function ($log,$scope) {
    $scope.mouse = function (index) {
        $log.log(index)
    };
});
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

//*--------------------------------公用表格模块------------------------------------------//
routerApp.controller('MainCtrl', ['$scope', '$http', '$timeout','data', function ($scope, $http, $timeout,data) {
    $scope.delet =function (index) {
        $scope.gridOptions.data.splice(index,1)
    };
    $scope.searchGrid = function(){
        $scope.objseach ={

        };
        $scope.objseach.objseach = $("#objseach").val();
        $scope.objseach.begintime = $("#monthCtrlStart").val();
        $scope.objseach.endtime = $("#monthCtrlEnd").val();
        console.log($scope.objseach)
    };
    $scope.gridOptions = {

    };

    $scope.storeFile = function( gridRow, gridCol, files ) {
        // ignore all but the first file, it can only select one anyway
        // set the filename into this column
        gridRow.entity.filename = files[0].name;

        // read the file and set it into a hidden column, which we may do stuff with later
        var setFile = function(fileContent){
            gridRow.entity.file = fileContent.currentTarget.result;
            // put it on scope so we can display it - you'd probably do something else with it
            $scope.lastFile = fileContent.currentTarget.result;
            $scope.$apply();
        };
        var reader = new FileReader();
        reader.onload = setFile;
        reader.readAsText( files[0] );
    };
    $scope.useExternalSorting = false;
    $scope.gridOptions.paginationPageSizes = [50, 100, 500];
    $scope.gridOptions.paginationPageSize = 30;
    $scope.gridOptions.columnDefs = [
        { name: 'name', displayName: 'Name', width: '20%' },
        { name: 'age', displayName: 'Age' , type: 'number', width: '10%' },
        { name: 'gender', displayName: 'Gender', editableCellTemplate: 'ui-grid/dropdownEditor', width: '10%',
            cellFilter: 'mapGender', editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
            { id: 1, gender: 'male' },
            { id: 2, gender: 'female' }
        ] },
        { name: 'registered', displayName: 'Registered' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '10%' },
        { name: 'address', displayName: 'Address', type: 'object', cellFilter: 'address', width: '20%' },
        { name: 'address.city', displayName: 'Address', width: '10%',
            cellEditableCondition: function($scope){
                return $scope.rowRenderIndex%2
            }
        },
        { name: 'isActive', displayName: 'Active', type: 'boolean', width: '10%' },
        { name: 'filename', displayName: 'File', width: '10%',enableCellEdit: false, cellTemplate : '<a class="delet-ng" href="" ng-click="grid.appScope.delet(row.entity);">删除</a>'}
    ];
    $scope.msg = {};
    $scope.gridOptions.onRegisterApi = function(gridApi){
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
        });
    };

    $http.get(getRequestUrl("table"))
        .success(function(data) {
            for(i = 0; i < data.length; i++){
                data[i].registered = new Date(data[i].registered);
                data[i].gender = data[i].gender==='male' ? 1 : 2;
                if (i % 2) {
                    data[i].pet = 'fish'
                    data[i].foo = {bar: [{baz: 2, options: [{value: 'fish'}, {value: 'hamster'}]}]}
                }
                else {
                    data[i].pet = 'dog'
                    data[i].foo = {bar: [{baz: 2, options: [{value: 'dog'}, {value: 'cat'}]}]}
                }
            }
            $scope.gridOptions.data = data;
            $scope.add_table = function () {
                var data_zi = {
                    "guid": "",
                    "isActive": "",
                    "balance": "",
                    "picture": "",
                    "age": "",
                    "name": "",
                    "gender": "",
                    "company": "",
                    "email": "",
                    "phone": "",
                    "address": {
                        "street": 317,
                        "city": "Blairstown",
                        "state": "Maine",
                        "zip": 390
                    },
                    "about": "",
                    "registered": "",
                    "friends": [
                        {
                            "id": 0,
                            "name": "Rosanne Barrett"
                        },
                        {
                            "id": 1,
                            "name": "Nita Chase"
                        },
                        {
                            "id": 2,
                            "name": "Briggs Stark"
                        }
                    ]
                };
                $scope.gridOptions.data.unshift(data_zi);
            }
        });
}])

    .filter('mapGender', function() {
        var genderHash = {
            1: 'male',
            2: 'female'
        };

        return function(input) {
            if (!input){
                return '';
            } else {
                return genderHash[input];
            }
        };
    })

    .filter('mapStatus', function() {
        var genderHash = {
            1: 'Bachelor',
            2: 'Nubile',
            3: 'Married'
        };

        return function(input) {
            if (!input){
                return '';
            } else {
                return genderHash[input];
            }
        };
    });
//*--------------------------------公用表格模块end------------------------------------------//