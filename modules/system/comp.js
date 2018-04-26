

routerApp.controller('compCtrl',function(toaster,$scope,$http,$q,i18nService){
	var _this = this;
	//列定义
	$scope.columns = [
        {
            field: '-',
            displayName: '',
            width:30,
            cellTemplate: '<div class="ui-grid-middle">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {name: '编码',field:'code',width:380},
        {name: '名称',field:'name'},
        {name: '备注',field:'remark'},
        {name: '编辑', width:150, cellTemplate : '<span><a class="grid-edit" href="" ng-click="grid.appScope.rowEdit(row.entity);"><i class="ace-icon fa fa-pencil-square-o bigger-230" style="margin-right:4px;"></i>编辑</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.rowDelete(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>删除</a></span>'}
    ];
    i18nService.setCurrentLang('zh-cn');
	//查询框
	$scope.filter = {
		pageIndex: 1,
		pageSize: 10,
		sort:'',//sort field
		order:'',//asc desc
		name: '',
		parentId: 0
	};
	//management/sys/comp/getComponentList
	$scope.model = {};
	$scope.getListUrl = 'management/sys/comp/getComponentVOList';
	$scope.updateUrl = 'management/sys/comp/addOrUpdate';
	$scope.removeUrl = 'management/sys/comp/sysComponentDelete';
	$scope.flags = [{value:'0',text:'隐藏'},{value:'1',text:'显示'}];
	$scope.roles = [];
	
	$scope.getFlagText = function(val) {
//		console.log(val)
		if( val.flag == "2") {
			return '禁用';
		}
		return '正常';
	}

	
	$scope.gridOptions = {
        columnDefs:$scope.columns,
        paginationPageSizes:[10,20, 50,100],
        enableColumnResizing : true,//表格宽度拖动
        enableGridMenu: false,
        enableSelectAll: true,//选择行
        enableRowSelection: true,//选择行
        multiSelect : true,//选择行
        selectionRowHeaderWidth: 35,
        useExternalPagination: true,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
        	$scope.gridApi = gridApi;
        	
        	$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        		
        		console.log(sortColumns)
                if (sortColumns.length == 0) {
                	$scope.filter.sort = '';
                	$scope.filter.order = '';
                } else {
                	$scope.filter.sort = sortColumns[0].field;
                	$scope.filter.order = sortColumns[0].sort.direction;
                }
//                $scope.getPage();
            });
        	
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                $scope.filter.pageIndex = newPage;
                $scope.filter.pageSize = pageSize;
                $scope.query();
            });
        }
    };
	
	
	$scope.query = function() {
		
		$http.post($scope.getListUrl,$scope.filter).success(function(data){
			$scope.gridOptions.data = data.rows;
            $scope.gridOptions.totalItems = data.total;
		})
//		$scope.getRegionList();
	}
	
	$scope.rowEdit = function(row) {
		$scope.getRoleList();
		angular.copy(row,$scope.model);
//		if(row.grade) {
//			$scope.model.grade = parseInt(row.grade);
//		}
//		for(var idx in $scope.flags) {
//			var item = $scope.flags[idx];
//			if(item.value == $scope.model.flag) {
//				$scope.model.flag = item.value;
//				break;
//			}
//		}
//		$scope.model.flag = '2';
//		$scope.$digest(); 
//		$scope.model.flag = $scope.flags[0].value;
//		console.log($scope.model);
//		$scope.$digest();
		
	}

	$scope.add = function() {
		$scope.model = {
		};
		$scope.getRoleList();
	};
    $scope.pop = function(){
        toaster.pop('success', "success", "text");
        toaster.pop('error', "error", "text");
        toaster.pop('warning', "warning", "text");
        toaster.pop('note', "note", "text");
    };
	$scope.save = function() {
		
//		var params = {
//			basicRegion: JSON.stringify($scope.model)
//		}
		
		var params = {
		  "cRemarks": "",
		  "code": $scope.model.code,
		  "flags": "",
		  "id": $scope.model.id ? $scope.model.id : undefined,
		  "name": $scope.model.name,
		  "remark": $scope.model.remark,
		  "roleIds": ""
		}
		
		var cRemarks = "";
		var flags = "";
		var roleIds = "";
		for(var idx in $scope.roles) {
			var item = $scope.roles[idx];
			if(item.check) {
				cRemarks += "`~" + item.remark;
				flags += "`~" + item.flag;
				roleIds += "`~" + item.id;
			}
		}
		
		if(cRemarks.length > 0) {
			cRemarks = cRemarks.substring(2);
		}
		if(flags.length > 0) {
			flags = flags.substring(2);
		}
		if(roleIds.length > 0) {
			roleIds = roleIds.substring(2);
		}
		
		params.cRemarks = cRemarks;
		params.flags = flags;
		params.roleIds = roleIds;
		
		$.ajax({
			type:'POST',
			url:$scope.updateUrl,
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify(params),
			success:function(data){
				$scope.query();
			}
		});
//		$http.post($scope.updateUrl,params).success(function(data){
//           // toaster.pop('error', "error", data.message);
//			console.log(data.message);
//			$scope.query();
//		});
	}
	
	$scope.rowDelete = function(row) {
        swal({
            title: "确定删除吗？",
            text: "删除无法恢复!",
            icon: "warning",
            confirmButtonColor: "#DD6B55",
            buttons: ["取消", "确定"],
            dangerMode: true
        })
        .then(function(willDelete){
            if (willDelete) {
                
                $http.post($scope.removeUrl,{id:row.id}).success(function(data){
                	
                	if(data.status == 1) {
                		swal("删除成功!", {
                            icon: "success",
                            buttons:"确定"
                        });
                	}
//            		console.log(data.message);
            		$scope.query();
            	});
            } else {
                //swal("删除!");
            }
		});
		// var r = window.confirm('确认删除?');
		// if(r) {
		// 	$http.post($scope.removeUrl,{id:row.id}).success(function(data){
		// 		console.log(data.message);
		// 		$scope.query();
		// 	});
		// }
		
	}
	
	$scope.gen = function() {
		$scope.model.code = uuid();
	}
	
	$scope.getRoleList = function() {
		$http.post('management/sys/role/getRoleList',{}).success(function(data){
			//{id: 100, father: 0, code: "sys_admin", name: "系统管理员", grade: 0, createDate: null, updateDate: null}
			$scope.roles = data.rows;
		});
	}
	
	$scope.roleItemInit = function(role) {
		
		var cRemarks = $scope.model.cRemarks;
		var flags = $scope.model.flags;
		var roleIds = $scope.model.roleIds;
		
		if(roleIds && roleIds.length > 0) {
			
			var cRemarks1 = cRemarks.split('`~');
			var flags1 = flags.split('`~');
			var roleIds1 = roleIds.split('`~');
			
			for(var idx in roleIds1) {
				var roleId = roleIds1[idx];
				if(roleId == role.id) {
					role.check = true;
					role.flag = flags1[idx];
					role.remark = cRemarks1[idx];
				}
			}
			
			
		}
		
		console.log(role);
		
	}
	
	
})
















	
//var optComp = new g_option();
//optComp.columns = function () {
//  return [
//    {name: '组件编码',field:'code',enableCellEdit: true},
//    {name: '组件名字',field:'name',enableCellEdit: true},
//    {name: '操作',enableCellEdit: false, cellTemplate : '<span><a class="grid-edit" href="" ng-click="grid.appScope.rowEdit(row.entity);"><i class="ace-icon fa fa-pencil-square-o bigger-230" style="margin-right:4px;"></i>编辑</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.rowDelete(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>删除</a></span>'}
//  ];
//};
///*opt1.init("base/baseRegion/regionParent/","dgl","#dg-vie","showItemId");*/
//
//function uuid() {
//  var s = [];
//  var hexDigits = "0123456789abcdef";
//  for (var i = 0; i < 36; i++) {
//    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//  }
//  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
//  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
//  s[8] = s[13] = s[18] = s[23] = "-";
// 
//  var uuid = s.join("");
//  return uuid;
//}
//
//optComp.init("management/sys/comp/getComponentList","comp_dgl","#comp_dg-vie","comp_showItemId");
//optComp.exportFunction = function ($scope,$http) {//私有方法
//
//	
////	$scope.gridOptions.data.splice(index,1);
//	
//	$scope.gen = function() {
//		$scope.model.compCode = uuid();
//	}
//	
//	
//	$scope.rowEdit = function(row) {
//		$('#comp_identifier').modal('show');
//		$scope.model.compId = row.id;
//		$scope.model.compCode = row.code;
//		$scope.model.compName = row.name;
//		$scope.dlgType = 2;
//		
//	}
//	
//	$scope.rowDelete = function(row) {
//        swal({
//            title: "确定删除吗？",
//            text: "删除无法恢复!",
//            icon: "warning",
//            buttons: ["取消", "确定"],
//            dangerMode: true
//        })
//            .then(function(willDelete){
//                if (willDelete) {
//                    $.post('management/sys/comp/sysComponentDelete',{compId:row.id},function(data){
//                        if(data.status == 1) {
//                            swal("删除成功!", {
//                                icon: "success",
//                                buttons:"确定"
//                            });
//                        }
//                        $('#comp_showItemId').click();
//                    });
//                } else {
//                    //swal("删除!");
//                }
//            });
//	};
//	$scope.comp_addkaohe = function () {
//        $('#comp_identifier').modal('show');
//        $scope.dlgType = 1;
//        $scope.dlgTitle = '新增';
//        $scope.model.compCode = '';
//        $scope.model.compName = '';
//        console.log('new---')
//    };
//    $scope.dlgSave = function() {
//    	$('#comp_identifier').modal('hide');
//    	if($scope.dlgType == 1) {
//    		$.post('management/sys/comp/sysComponentAdd',$scope.model,function(data){
////        		console.log(data);
//    			$('#comp_showItemId').click();
//        	})
//    	} else {
//    		$.post('management/sys/comp/sysComponentUpdate',$scope.model,function(data){
////        		console.log(data)
//    			$('#comp_showItemId').click();
//        	})
//    	}
//    	
//    	
//    }
//    $scope.model = {
//    	compCode:'',
//    	compName:''
//    }
//	
//};



//routerApp.controller('comp_dgl',function($scope){
//	$scope.xxx1 = " hello xxx1"
//})










