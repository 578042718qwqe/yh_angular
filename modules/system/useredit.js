
//userEditCtrl
routerApp.controller('userEditCtrl',function($scope,toaster){
	
	$scope.model = {
		id: '',
		userName: '',
		userPassword: ''
	};
	$scope.fetchUser = function() {
		$.post('management/sys/user/getCurrUser',{},function(data){
//			$scope.model.userName = data.obj.user.userName;
//			$scope.model.userName = data.obj.user.userName;
			console.log('data',data)
			if(data.obj && data.obj.length > 0) {
				var row = data.obj[0];
				$scope.model.userCode = row.code;
				$scope.model.userName = row.name;
				$scope.model.id = row.id;
				$scope.$digest();
			}
			
		})
	};
	$scope.save = function() {
		var params = {};
		params.id = $scope.model.id;
//		params.userCode = $scope.model.userCode;
//		params.userName = $scope.model.userName;
		params.userPassword = $scope.model.userPassword;
		
		$.post('management/sys/user/updateUserProfile',params,function(data){
            toaster.pop('error', "error", data.message);
            alert(data.message);
		})
	};
	
	$scope.fetchUser();
});









