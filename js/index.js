/**
 * Created by wuzebo on 2018/4/23.
 */
routerApp.filter('reverse', function () { //过滤器
  return function (text) {
    return text.substring(text.indexOf('.') + 1, text.length)
  }
});
routerApp.controller('management', function ($scope, $http, $rootScope, $location) {
  $rootScope.names = [];
  $rootScope.Storage = window.sessionStorage;
  //首页菜单
  $scope.menu_state = 0;
  $scope.model = {
    tabs: 1000
  };
  $scope.menu = function (index) {
    $scope.menu_state = index
  };
  //刷新获取导航栏
  var session_name = $rootScope.Storage.name;
  var obj = {
    name: session_name,
    url: $rootScope.Storage.url
  };
  if(obj.name != undefined && obj.url != undefined){
      $rootScope.names.push(obj);
  }
  //导航栏信息获取 左边
  $http({
    method: 'GET',
    url: getRequestUrl("menuData")
  }).success(function successCallback(response) {
    $scope.options = response;
  }).error(function () {
    console.log("错误");
  });
  $scope.tabsSetup = function (index) {
    $scope.model.tabs = index;
  };
  //导航栏信息获取 右边
  $http({
    method: 'GET',
    url: getRequestUrl("menuData2")
  }).success(function successCallback(response) {
    $scope.guanli = response;
  }).error(function () {
    console.log("错误");
  });
  //菜单栏点击事件
    $scope.color =
    $scope.updata_dh = function (name, url,index) {
      $scope.color = index;
      $rootScope.Storage.name = name;
      $rootScope.Storage.url = url;
      var find = false;
      for (var i = 0; i < $rootScope.names.length; i++) {
        if ($rootScope.names[i].name == name) {
          find = true;
          break;
        }
      }
      if (!find) {
        var arts_s = {
          name: name,
          url: url
        };
        $rootScope.names.push(arts_s);
      }
  };
});
routerApp.controller('dh_name', function ($scope, $http, $rootScope, $state) {//导航栏点击关闭事件
  $scope.dh_name = true;
  $scope.updata_dh2 = function (name, url) {
    $rootScope.Storage.name = name;
    $rootScope.Storage.url = url;
    var find = false;
    for (var i = 0; i < $rootScope.names.length; i++) {
      if ($rootScope.names[i].name == name) {
        find = true;
        break;
      }
    }
    if (!find) {
      var arts_s = {
        name: name,
        url: url
      };
      $rootScope.names.push(arts_s);
    }
  };
  $scope.dh_close = function (data) {//导航栏关闭事件
    $scope.key = data;
    $rootScope.names.splice($scope.key, 1);
    if ($rootScope.names.length == 0) {
             $state.go('welcome');
    } else {
        if (($scope.key - 1) < 0) {
             $state.go($rootScope.names[$scope.key].url);
        } else {
             $state.go($rootScope.names[$scope.key - 1].url);
        }
    }
  }
});
