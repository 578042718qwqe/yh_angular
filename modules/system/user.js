var optUser = new g_option();
optUser.columns = function () {
    return [
        {
            field: '-',
            displayName: '',
            width:30,
            cellTemplate: '<div class="ui-grid-middle">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {name: '用户编码',field:'code',enableCellEdit: false},
        {name: '用户名字',field:'name',enableCellEdit: false},
        {name: '操作',enableCellEdit: false, cellTemplate : '<span><a class="grid-edit" href="" ng-click="grid.appScope.rowEdit(row.entity);"><i class="ace-icon fa fa-pencil-square-o bigger-230" style="margin-right:4px;"></i>编辑</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.rowDelete(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>删除</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.fenpei(row.entity)"><i class="ace-icon glyphicon glyphicon-list bigger-200" style="margin-right:4px;"></i>分配角色</a></span>'}
    ];
};
optUser.init("management/sys/user/getUserList","user_dgl","#user_dg-vie","user_showItemId");
optUser.exportFunction = function ($scope,$http) {//私有方法
    $scope.rowEdit = function(row) {//编辑
        $('#user_identifier').modal('show');
        $scope.model.userId = row.id;
        $scope.dlgTitle ="编辑";
        $scope.model.userCode = row.code;
        $scope.model.userName = row.name;
        $scope.model.userPwd = row.pwd;
        $scope.dlgType = 2;
    };

    $scope.rowDelete = function(row) {//删除
        swal({
            title: "确定删除吗？",
            text: "删除无法恢复!",
            icon: "warning",
            buttons: ["取消", "确定"],
            dangerMode: true
        })
            .then(function(willDelete){
                if (willDelete) {
                    $.post('management/sys/user/sysUserDelete',{userId:row.id},function(data){
                        if(data.status == 1) {
                            swal("删除成功!", {
                                icon: "success",
                                buttons:"确定"
                            });
                        }
                        $('#user_showItemId').click();
                    })
                } else {

                }
            });
    };

    $scope.user_addkaohe = function (){//新增
        $('#user_identifier').modal('show');
        $scope.dlgType = 1;
        $scope.dlgTitle = '新增';
        $scope.model.userCode = '';
        $scope.model.userName = '';
        $scope.model.userPwd = '';
    };
    $scope.dlgSave = function() {//保存
        $('#user_identifier').modal('hide');
        if($scope.dlgType == 1) {
            $.post('management/sys/user/sysUserAdd',$scope.model,function(data){
                $('#user_showItemId').click();
            })
        } else {
            $.post('management/sys/user/sysUserUpdate',$scope.model,function(data){
                $('#user_showItemId').click();
            })
        }
    };

    $.post('management/sys/role/getRoleList',{ },function(data){
        $scope.obj_arr = data.rows;
    });

    //
    $scope.object ={};
    $scope.selected =[];
    $scope.selectedTags=[];//名称
    $scope.gridOptions.multiSelect = false;
//    $scope.gridOptions.onRegisterApi = function(gridApi){//选择行
//        $scope.gridApi = gridApi;
//        gridApi.selection.on.rowSelectionChanged($scope,function(row){
//            $scope.isSelect = row.isSelected;
//            $scope.admin = row.entity.id;
//            $scope.object.userId = $scope.admin;
//        });
//    };
//     setTimeout(function(){//获取选中行事件
//     	$scope.gridApi.selection.on.rowSelectionChanged($scope,function(row){
//             $scope.isSelect = row.isSelected;
//             $scope.admin = row.entity.id;
//             $scope.object.userId = $scope.admin;
//         });
//     },10);
    
    
    
    $scope.dlgSave2 = function () {//窗口保存提交
        $scope.object.roleIds = $scope.selected.join(',');
        $.post('management/sys/user/saveUserRoles',$scope.object,function(data){
              
            $('#user_fp').modal('hide');
        });
        console.log($scope.object);
    };
    var updateSelected = function(action,id,name){
        if(action == 'add' && $scope.selected.indexOf(id) == -1){
            $scope.selected.push(id);
            $scope.selectedTags.push(name);
        }
        if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx,1);
            $scope.selectedTags.splice(idx,1);
        }
    };
    $scope.updateSelection = function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action,id,checkbox.name);
    };
    $scope.isSelected = function(id){//选中状态
        return $scope.selected.indexOf(id)>=0;
    };
    $scope.model = {
        userCode:'',
        userName:'',
        userPwd:''
    };
    $scope.fenpei = function (row) {
        $('#user_fp').modal('show');
        $scope.admin = row.id;
        $scope.object.userId = $scope.admin;
        $scope.selected=[];
        $.post('management/sys/role/getRolesByUserId',{uid:$scope.object.userId},function(data){
            angular.forEach(data.obj,function (data) {
                $scope.selected.push(parseInt(data.id))
            });
            $scope.$digest()
        });
        $scope.title = "分配角色";
        // $('#user_fp').modal('show');
        // $scope.selected=[];
        // $.post('management/sys/role/getRolesByUserId',{uid:data.id},function(data){
        //     angular.forEach(data.obj,function (data) {
        //         $scope.selected.push(parseInt(data.id))
        //     });
        //     $scope.$digest()
        // });
        // $scope.title = "分配角色";
    }

};



//routerApp.controller('user_dgl',function($scope){
//	$scope.xxx1 = " hello xxx1"
//})










