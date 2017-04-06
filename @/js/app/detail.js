// 初始化
function creatDb(name, size){
	var db_name = name ? name : 'db_test';
	var db_size = size ? size : 2;
	//openDatabase方法打开一个已经存在的数据库，如果数据库不存在，它还可以创建数据库
	return openDatabase(db_name, '1.0', 'db_test', db_size * 1024 * 1024);
};

//创建或打开db数据库
var db = creatDb();

//detail中禁用无关按钮事件，然后监听从list页面fire过来的todoid，最后显示待办事项详情。
mui.init({
	keyEventBind : {
		backbutton : false,
		menubutton : false
	}
});

// 所有方法都放到这里
mui.plusReady(function(){
	window.addEventListener('detailItem', detailItemHandler);

	function query(db, sql, func){
		if(db && sql){
			db.transaction(function(tx){
				tx.executeSql(sql, [], function(tx, results) {
					func(results);
				}, null);
			});
		}
	};
// 展示待办事项
	function detailItemHandler(event){
		console.error(555555555225555555)
		plus.webview.getWebviewById(plus.runtime.appid).evalJS("showBackBtn();");

		var detailId = event.detail.id;
		var sql = 'select * from t_plan_day_todo where id=' + detailId;
		query(db, sql, function(res){
			if(res.rows.length > 0){
				var data = res.rows.item(0);
				$('#detailTitle').text(data.plan_title);
				$('#detailContent').html(data.plan_content);

				plus.webview.show('detail', 'slide-in-right', 300);
			}
		});
	}



});

