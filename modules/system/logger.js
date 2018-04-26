
var optLogger = new g_option();
optLogger.columns = function () {
  return [
      {
          field: '-',
          displayName: '',
          width:30,
          cellTemplate: '<div class="ui-grid-middle">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
      },
    {name: '组',field:'groups',enableCellEdit: true},
    {name: '用户id',field:'name',enableCellEdit: true},
    {name: 'ip',field:'host',enableCellEdit: true},
    {name: '内容',field:'message',enableCellEdit: true},
    {name: '日志时间',field:'createDate',enableCellEdit: true,cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getTimeText(row.entity)}}</div>'}
  ];
};


function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
 
  var uuid = s.join("");
  return uuid;
}

optLogger.init("management/sys/logger/getSysLoggerList","logger_dgl","#logger_dg-vie","logger_showItemId");
optLogger.exportFunction = function ($scope,$http) {//私有方法

	
//	$scope.gridOptions.data.splice(index,1);
	
	$scope.gen = function() {
		$scope.model.loggerCode = uuid();
	}
	
	$scope.getTimeText = function(value) {
//		console.log(row.createDate)
		var mo = moment(value);
//		return mo.format('YYYY-MM-DD h:mm:ss')
		return mo.format('YYYY-MM-DD')
	}
	
    $scope.model = {
    	loggerCode:'',
    	loggerName:''
    }
	
};










