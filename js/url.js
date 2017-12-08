/**
 * Created by wuzebo on 2017/12/5.
 */
routerApp.config(function($stateProvider,$urlRouterProvider) {//全局路由
    //$urlRouterProvider.otherwise('/404');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/list-1.html'
        })
        .state('home.list', {
            url: '/list',
            templateUrl: 'templates/404.html'
        })
        .state('home.prompt', {//提示
            url: '/prompt',
            templateUrl: 'templates/prompt.html'
        })
        .state('home.table', {//表格
            url: '/table',
            templateUrl: 'templates/table.html'
        })
        .state('home.chart', {//图表
            url: '/chart',
            templateUrl: 'templates/chart.html'
        })
        .state('home.button', {//按钮
            url: '/button',
            templateUrl: 'templates/button/button.html'
            /*templateUrl: 'templates/partial-home-list.html',
             controller: function($scope) {
             $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
             }*/
        })
        .state('home.label-fontIcon', {//按钮 标签/徽章/字体图标
            url: '/label-fontIcon',
            templateUrl: 'templates/label-fontIcon.html'
        })
        .state('home.treeview', {//树形试图
            url: '/treeview',
            templateUrl: 'templates/treeview.html'
        })
        .state('home.elemtents', {//通用的UI特性和基础元素
            url: '/elemtents',
            templateUrl: 'templates/elemtents.html'
        })
        .state('home.typography', {//格式
            url: '/typography',
            templateUrl: 'templates/typography.html'
        })
        .state('home.error-500', {//500
            url: '/error-500',
            templateUrl: 'templates/error-500.html'
        })
        .state('home.error-404', {//404
            url: '/error-404',
            templateUrl: 'templates/error-404.html'
        })
        .state('home.simple-dynamic', {//基础表格
            url: '/simple-dynamic',
            templateUrl: 'templates/simple-dynamic.html'
        })
        .state('home.jqgrid', {//表格插件
            url: '/jqgrid',
            templateUrl: 'templates/jqgrid.html'
        })
        .state('home.dropzone', {//上传插件
            url: '/dropzone',
            templateUrl: 'templates/dropzone.html'
        })
        .state('home.editor', {//编辑器
            url: '/editor',
            templateUrl: 'templates/editor.html'
        })
        .state('home.wizard_validation', {//向导与验证
            url: '/wizard_validation',
            templateUrl: 'templates/wizard_validation.html'
        })
        .state('home.form-elements', {//表单插件
            url: '/form-elements',
            templateUrl: 'templates/form-elements.html'
        })
        .state('404', {
            url: '/404',
            templateUrl: 'templates/404.html'
        })
        .state('index', {
            url: '/index',
            templateUrl: 'templates/404.html'
        })
});