var optModule = new g_option();
    optModule.columns = function () {
	  return [
          {
              field: '-',
              displayName: '',
              width:30,
              cellTemplate: '<div class="ui-grid-middle">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
          },
		{name: '模块id',field:'id',enableCellEdit: true},
	    {name: '模块名称',field:'name',enableCellEdit: true},
//	    {name: '模块等级',field:'grade',enableCellEdit: true},
	    {name: '父模块',field:'father',enableCellEdit: true},
	    {name: '模块URL',field:'url',enableCellEdit: true},
	    {name: '操作',enableCellEdit: false, cellTemplate : '<span><a class="grid-edit" href="" ng-click="grid.appScope.rowEdit(row.entity);"><i class="ace-icon fa fa-pencil-square-o bigger-230" style="margin-right:4px;"></i>编辑</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.rowDelete(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>删除</a></span>'}
	  ];
	};

optModule.init("management/sys/module/getModuleList","module_dgl","#module_dg-vie","module_showItemId");
optModule.exportFunction = function ($scope,$http) {//私有方法

	$scope.rowEdit = function(row) {
		$('#module_identifier').modal('show');
		$scope.model.moduleId = row.id;
		$scope.model.moduleName = row.name;
		$scope.model.moduleGrade = row.grade;
		$scope.model.moduleUrl = row.url;
		$scope.model.moduleFather = row.father;
		$scope.dlgType = 2;
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
                    $.post('management/sys/module/del',{moduleId:row.id},function(data){
                        if(data.status == 1) {
                            swal("删除成功!", {
                                icon: "success",
                                buttons:"确定"
                            });
                        }
                        $('#module_showItemId').click();
                    });
                } else {
                    //swal("删除!");
                }
            });
	};
	
    $scope.module_addkaohe=function () {
        $('#module_identifier').modal('show');
        $scope.dlgType = 1;
        $scope.dlgTitle = '新增';
        $scope.model.moduleName = '';
        $scope.model.moduleGrade = '';
        $scope.model.moduleUrl = '';
        $scope.model.moduleFather = '';
        console.log('new---')
    };
    $scope.dlgSave = function() {
    	$('#module_identifier').modal('hide');
    	if($scope.dlgType == 1) {
    		$.post('management/sys/module/save',$scope.model,function(data){
    			$('#module_showItemId').click();
        	})
    	} else {
    		$.post('management/sys/module/update',$scope.model,function(data){
    			$('#module_showItemId').click();
        	})
    	}
    	
    	
    }
    $scope.model = {
    	moduleName:'',
    	moduleGrade:'',
    	moduleUrl:'',
    	moduleFather:'',
    }
	  
};
