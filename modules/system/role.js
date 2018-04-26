var optRole = new g_option();
optRole.columns = function () {
    return [
        {
            field: '-',
            displayName: '',
            width:30,
            cellTemplate: '<div class="ui-grid-middle">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {name: '角色编码',field:'code',enableCellEdit: true},
        {name: '角色名字',field:'name',enableCellEdit: true},
        {name: '角色级别',field:'grade',enableCellEdit: true},
        {name: '编辑',enableCellEdit: false, cellTemplate : '<span><a class="grid-edit" href="" ng-click="grid.appScope.rowEdit(row.entity);"><i class="ace-icon fa fa-pencil-square-o bigger-230" style="margin-right:4px;"></i>编辑</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.rowDelete(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>删除</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.quanxian(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>分配权限</a></span>'}
    ];
};
optRole.init("management/sys/role/getRoleList","role_dgl","#role_dg-vie","role_showItemId");
optRole.exportFunction = function ($scope,$http,$q) {//私有方法

    $scope.nodes = {};
    $scope.rowEdit = function(row) {
        $('#role_identifier').modal('show');
        $scope.model.roleId = row.id;
        $scope.model.roleCode = row.code;
        $scope.model.roleName = row.name;

    }

    $scope.rowDelete = function(row) {
        swal({
            title: "确定删除吗？",
            text: "删除无法恢复!",
            icon: "warning",
            buttons: ["取消", "确定"],
            dangerMode: true
        })
            .then(function(willDelete){
                if (willDelete) {
                    $.post('management/sys/role/sysRoleDelete',{roleId:row.id},function(data){
                        if(data.status == 1) {
                            swal("删除成功!", {
                                icon: "success",
                                buttons:"确定"
                            });
                        }
                        $('#role_showItemId').click();
                    });
                } else {
                    //swal("删除!");
                }
            });
    };

    $scope.role_addkaohe = function (){
        $('#role_identifier').modal('show');
        $scope.dlgType = 1;
        $scope.dlgTitle = '新增';
        $scope.model.roleCode = '';
        $scope.model.roleName = '';
        console.log('new---')
    };
    $scope.role = {};
    $scope.dlgSave = function() {
        $('#role_identifier').modal('hide');
        if($scope.dlgType == 1) {
            $.post('management/sys/role/sysRoleAdd',$scope.model,function(data){
//        		console.log(data)
                $('#role_showItemId').click();
            })
        } else {
            $.post('management/sys/role/sysRoleUpdate',$scope.model,function(data){
//        		console.log(data)
                $('#role_showItemId').click();
            })

        }
    };
    $scope.Save2=function(){
        $('#role_qx').modal('hide');

        var changeNodes = $scope.zTree.getChangeCheckedNodes();

        $scope.role.roleId =$scope.column;
        $scope.role.moduleIds ='';
        $scope.role.moduleIds2 ='';
        for(var idx in changeNodes) {
//        	$scope.role.moduleIds.push(idx);
//        	$scope.role.moduleIds2.push($scope.node[idx]);
            var item = changeNodes[idx];
            $scope.role.moduleIds += ',' + item.id;
            var val = item.checked ? 1 : 0;
            $scope.role.moduleIds2 += ',' + val;

        }
        if($scope.role.moduleIds.length > 0) {
            $scope.role.moduleIds = $scope.role.moduleIds.substring(1);
        }
        if($scope.role.moduleIds2.length > 0) {
            $scope.role.moduleIds2 = $scope.role.moduleIds2.substring(1);
        }
        $.post('management/sys/role/saveSysRoleModules',$scope.role,function(data){
            console.log(data.data)
        })
    }
    $scope.model = {
        roleCode:'',
        roleName:''
    };
    $scope.gridOptions.multiSelect = false;
//    $scope.gridOptions.onRegisterApi = function(gridApi){//选择行
//        $scope.gridApi = gridApi;
//        gridApi.selection.on.rowSelectionChanged($scope,function(row){
//            $scope.isSelect = row.isSelected;
//            $scope.column = row.entity.id;
//        });
//    };

    // setTimeout(function(){
    //
    //     $scope.gridApi.selection.on.rowSelectionChanged($scope,function(row){
    //         $scope.isSelect = row.isSelected;
    //         $scope.column = row.entity.id;
    //     });
    //
    // },10);

    $scope.zNodes= [];
    $scope.roleMapping = [];
    $scope.quanxian = function (row) {
        $scope.nodes = {};
        $('#role_qx').modal('show');
        $scope.column = row.id;
        tree_zi();
        $scope.qxTitle ="分配权限";
    };

    function getRoleMapping() {
        var der = $q.defer();
        var rid = $scope.column;
        $.post('management/sys/module/getChildModuleByRoleId',{roleId:rid},function(data){
            $scope.roleMapping = data.obj;
            der.resolve()
        });
        return der.promise
    }

    $scope.currNode = null;
    function getTreeRoot() {
        var der = $q.defer();
        $.post('management/sys/module/getParentModule',{pid:""},function(data){

            angular.forEach(data.obj,function (data) {
                data.isParent = data.open;
                data.open = false;

            });

            $scope.currNode = data.obj;
            der.resolve();
        });
        return der.promise;
    }

    function getTreeNode(treeNode) {
        var der = $q.defer();
        $.post('management/sys/module/getChildModules',{mid:treeNode.id},function(data){

            angular.forEach(data.obj,function (data) {
                data.isParent = data.open;
                data.open = false;
            });

            $scope.currNode = data.obj;
            der.resolve();

        });
        return der.promise;
    }


    function treeCheck(dataItem) {
        var find = false;
        for(var idx in $scope.roleMapping) {
            var item = $scope.roleMapping[idx]
            if(dataItem.id == item.id) {
                find = true;
            }
        }

        if(find) {
            dataItem.checked = true;
        } else {
            dataItem.checked = false;
        }
    }
    function tree_zi() {

        $q.all([getTreeRoot(),getRoleMapping()]).then(function () {
            angular.forEach($scope.currNode,function (item) {
                treeCheck(item);
            });
            console.log($scope.currNode,$scope.roleMapping,122);
            $scope.zTree = $.fn.zTree.init($("#treeDemo"), setting,$scope.currNode);
        })
    }

    function ajaxGetNodes(treeNode, reloadType) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        if (reloadType == "refresh") {
            treeNode.icon = "../../../css/zTreeStyle/img/loading.gif";
            zTree.updateNode(treeNode);
        }
        zTree.reAsyncChildNodes(treeNode, reloadType, true);
//        $scope.zTree = zTree;
    }
    function beforeExpand(treeId, treeNode) {

        console.log(treeNode,11122)
        if(treeNode.isParent && (!treeNode.children || treeNode.children.length == 0)) {
            $q.all([getTreeNode(treeNode),getRoleMapping()]).then(function () {
                angular.forEach($scope.currNode,function (item) {
                    treeCheck(item);
                });
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.addNodes(treeNode,$scope.currNode);
                console.log($scope.currNode,$scope.roleMapping,122);

            });
        } else {


        }






    }
    function onAsyncSuccess(event, treeId, treeNode, msg) {
    }
    //-------------------------------------树-------------------------------------
    var setting = {
        async: {
            enable: false
            //url: getUrl
        },
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        edit: {
            enable: true
        },
        callback: {
            onCheck: zTreeOnCheck,
            beforeExpand: beforeExpand,
            onAsyncSuccess: onAsyncSuccess,
            //onAsyncError: onAsyncError
        }
    };


    var newCount = 1;
    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_"+treeNode.tId);
        if (btn) btn.bind("click", function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
            return false;
        });
    };
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_"+treeNode.tId).unbind().remove();
    };

    function zTreeOnCheck(event, treeId, treeNode) {//选择复选框读取数据
//        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
//        var nodes = treeObj.getCheckedNodes(true);
//        var arr_id =[];
//        for(var i=0; i<nodes.length; i++){
//            arr_id.push(nodes[i].id)
//        }
//        var split_id = arr_id.join(',');
//        $scope.nodes = split_id;
//        console.log(treeNode);
//    	
//    	$scope.nodes[treeNode.id] = treeNode.check ? 1 : 0;


    };

};












