/**
 * Created by wuzebo on 2017/12/21.
 */
angular.module('table',[]).factory('opt1', function () {
    return {
        init:function () {
            return alert("111")
        }
    }
});
/*
angular.module('table', []).directive('opt1', function() {
     return {
         restrict: 'E',
         template: '<div>弹窗5</div>',
         replace: true
     };
 });*/
