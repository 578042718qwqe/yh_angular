/**
 * Created by wuzebo on 2018/4/21.
 */
routerApp.run(function($state, $rootScope) {
  $rootScope.$state = $state;
});
routerApp.config(function($stateProvider, $stickyStateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/welcome");
  $stateProvider
    .state('home', {//首页
    url: '/',
    templateUrl: 'modules/home.html'
    })
    .state('home.useredit', {//
    url: 'useredit',
    sticky: true,
    dsr: true,
    views: {
      'useredit': {
        templateUrl: 'modules/system/useredit.html',
        controller: function ($stateParams) {
          console.log($stateParams.id)
        }
      }
    }
  })
  .state('home.user', {//
    url: 'user',
    sticky:true,
    dsr:true,
    views: {
      'user': {
        templateUrl:'modules/system/user.html'
      }
    }
  })
  .state('home.role', {//
    url: 'role',
    sticky:true,
    dsr:true,
    views: {
      'role': {
        templateUrl:'modules/system/role.html'
      }
    }
  })
  .state('welcome', {//欢迎页面
    url: '/welcome',
    templateUrl: 'modules/welcome.html'
  });
  $stickyStateProvider.enableDebug(true);
});
