
	
var optHosp = new g_option();
optHosp.columns = function () {
  return [
      {
          field: '-',
          displayName: '',
          width:30,
          cellTemplate: '<div class="ui-grid-middle">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
      },
    {name: '医院名称',field:'name',enableCellEdit: true},
    {name: '地址',field:'addr',enableCellEdit: true},
    {name: '级别',field:'grade',enableCellEdit: true},
    {name: '电话',field:'tel',enableCellEdit: true},
    {name: '类型',field:'type',enableCellEdit: true,cellTemplate:'<div style="line-height: 30px;">{{grid.appScope.getOrgTypeText(row.entity)}}</div>'},
    {name: '编辑',enableCellEdit: false, cellTemplate : '<span><a class="grid-edit" href="" ng-click="grid.appScope.rowEdit(row.entity);"><i class="ace-icon fa fa-pencil-square-o bigger-230" style="margin-right:4px;"></i>编辑</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.rowDelete(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>删除</a></span>'}
  ];
};
optHosp.init("management/sys/hosp/getHospList","hosp_dgl","#hosp_dg-vie","hosp_showItemId");
optHosp.exportFunction = function ($scope,$http) {//私有方法

//	医院类型：1，卫生院；6，卫生室；7，社区医院；8，农场医院；10，普通医院。11、合管站，12、私立医院
	$scope.orgTypes = [
		{value: 1,text:'卫生院'},
		{value: 6,text:'卫生室'},
		{value: 7,text:'社区医院'},
		{value: 8,text:'农场医院'},
		{value: 10,text:'普通医院'},
		{value: 11,text:'合管站'},
		{value: 12,text:'私立医院' }
	]
	$scope.rowEdit = function(row) {
		$scope.model.orgType = 2;
		$('#hosp_identifier').modal('show');
		$scope.model.hospitalId = row.id;
		$scope.model.hospitalName = row.name;
		$scope.model.hospitalAddress = row.addr;
		$scope.model.hospitalClass = row.grade;
		$scope.model.hospitalTelephone = row.tel;
		$scope.model.orgType = row.type;
	};
	
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
                    $.post('management/sys/hosp/sysHospDelete',{hospId:row.id},function(data){
                        if(data.status == 1) {
                            swal("删除成功!", {
                                icon: "success",
                                buttons:"确定"
                            });
                        }
                        $('#hosp_showItemId').click();
                    })
                } else {
                    //swal("删除!");
                }
            });
	};
	
	$scope.getOrgTypeText = function(row) {
		
//		$scope.orgTypes
		for(var idx in $scope.orgTypes) {
			if(row.type == $scope.orgTypes[idx].value) {
				return $scope.orgTypes[idx].text;
			}
		}
		return row.orgType;
	}
	
    $("#hosp_addkaohe").click(function () {
        $('#hosp_identifier').modal('show');
        $scope.dlgType = 1;
        $scope.dlgTitle = '新增';
        $scope.model.hospitalName = '';
		$scope.model.hospitalAddress = '';
		$scope.model.hospitalClass = '';
		$scope.model.hospitalTelephone = '';
		$scope.model.orgType = 1;
        console.log('new---');
        $scope.$digest();
    });
    $scope.dlgSave = function() {
    	$('#hosp_identifier').modal('hide');
    	if($scope.dlgType == 1) {
    		$.post('management/sys/hosp/sysHospAdd',$scope.model,function(data){
    			$('#hosp_showItemId').click();
        	})
    	} else {
    		$.post('management/sys/hosp/sysHospUpdate',$scope.model,function(data){
    			$('#hosp_showItemId').click();
        	})
    	}
    	
    	
    }
    $scope.model = {
		hospitalName:'',
		hospitalAddress:'',
		hospitalClass:'',
		hospitalTelephone:'',
		orgType:''
    }
	  
};











