
routerApp.controller('baseRegionCtrl',function(toaster,$scope,$http,$q,i18nService){
	
	var _this = this;
	//列定义
	$scope.columns = [
        {
            field: '-',
            displayName: '',
            width:30,
            cellTemplate: '<div class="ui-grid-middle">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
		{name: '父地区',field:'parentId'},
        {name: '地区编码',field:'code'},
        {name: '地区名称',field:'name'},
        {name: '地区级别',field:'hierarchy'},
        {name: '状态',field:'flag',cellTemplate:'<span class="data_maintenance_state">{{grid.appScope.getFlagText(row.entity)}}</span>'},
        {name: '编辑', cellTemplate : '<span><a class="grid-edit" href="" ng-click="grid.appScope.rowEdit(row.entity);"><i class="ace-icon fa fa-pencil-square-o bigger-230" style="margin-right:4px;"></i>编辑</a></span><span><a class="grid-delet" href="" ng-click="grid.appScope.rowDelete(row.entity);"><i class="ace-icon fa fa-trash-o bigger-200" style="margin-right:4px;"></i>删除</a></span>'}
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
	}
	$scope.regionFilter = {lastId:''};
	$scope.regionFilter1 = {lastId:''};
	$scope.model = {};
	$scope.getListUrl = 'management/maintenance/basicRegion/getList';
	$scope.updateUrl = 'management/maintenance/basicRegion/addOrUpdate';
	$scope.removeUrl = 'management/maintenance/basicRegion/delete';
	$scope.regions = [];
	$scope.flags = [{value:'1',text:'正常'},{value:'2',text:'禁用'}];
	
	$scope.getRegionList = function() {
		$http.post($scope.getListUrl,{pageIndex:1,pageSize:1000}).success(function(data){
			
			var rows = data.rows;
			$scope.regions.splice(0,$scope.regions.length);
			for(var idx in rows) {
				var item = rows[idx];
				$scope.regions.push({value:item.id,text:item.name})
			}
		})
	}
	$scope.getRegionList();
	
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
		
		$scope.filter.parentId = $scope.regionFilter.lastId;
		$http.post($scope.getListUrl,$scope.filter).success(function(data){
			$scope.gridOptions.data = data.rows;
            $scope.gridOptions.totalItems = data.total;
		})
//		$scope.getRegionList();
	}
	
	$scope.rowEdit = function(row) {
		console.log(row);
		angular.copy(row,$scope.model);
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
			flag: '1'
		};
	};
    $scope.pop = function(){
        toaster.pop('success', "success", "text");
        toaster.pop('error', "error", "text");
        toaster.pop('warning', "warning", "text");
        toaster.pop('note', "note", "text");
    };
	$scope.save = function() {
		
		if($scope.regionFilter1.lastId) {
			$scope.model.parentId = $scope.regionFilter1.lastId
		} else {
			$scope.model.parentId = 0;
		}
//		if(!$scope.model.parentId) {
//			$scope.model.parentId = 0;
//		}
		
		var params = {
			basicRegion: JSON.stringify($scope.model)
		}
		
		$.ajax({
			type:'POST',
			url:$scope.updateUrl,
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify($scope.model),
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
	
})















