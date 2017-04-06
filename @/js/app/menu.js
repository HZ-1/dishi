function creatDb(name, size){
	var db_name = name ? name : 'db_test';
	var db_size = size ? size : 2;
	//openDatabase方法打开一个已经存在的数据库，如果数据库不存在，它还可以创建数据库
	return openDatabase(db_name, '1.0', 'db_test', db_size * 1024 * 1024);
};

//创建或打开db数据库
var db = creatDb();


// 所有的方法都放到这里
mui.plusReady(function(){
	initDoneList();

	// 添加已完成事项
	//menu页面监听
	window.addEventListener('doneItem', doneItemHandler);

	// 初始化待办事项
	function initDoneList(){
		var $ul = $('#donelist').empty();
		//其次，通过qiao.h.query查询到done表中的数据并显示，
		query(db, 'select * from t_plan_day_done order by id desc', function(res){
			//最后，监听事件，获取todo中移除的id，
			//通过todoid查询到移除的todo列的title和content，
			//将这个title和content插入到done表中，
			for (i = 0; i < res.rows.length; i++) {
				$ul.append(genLi(res.rows.item(i).plan_title));
			}
			//为什么要用这个方法，因为$ul在html中我们是将它的display写为none的
			showList($ul);
		});
	}

	function showList(ul){
		if(ul.find('li').size() > 0 &&  ul.is(':hidden')) ul.show();
	}

	function query(db, sql, func){
		if(db && sql){
			db.transaction(function(tx){
				tx.executeSql(sql, [], function(tx, results) {
					func(results);
				}, null);
			});
		}
	};

	function genLi(title){
		return '<li class="mui-table-view-cell">' + title + '</li>';
	}

	// 添加已完成事项
//插入成功后删除todo表中记录。
	function doneItemHandler(event){
		var todoId = event.detail.todoId;

		query(db, 'select * from t_plan_day_todo where id=' + todoId, function(res){
			if(res.rows.length > 0){
				var data = res.rows.item(0);

				query(db, 'select max(id) mid from t_plan_day_done', function(res1){
					$('#donelist').prepend('<li class="mui-table-view-cell>test</li>').prepend(genLi(data.plan_title)).show();

					var id = (res1.rows.item(0).mid) ? res1.rows.item(0).mid : 0;

					var doneSql = 'insert into t_plan_day_done (id, plan_title, plan_content) values (' + (id+1) + ', "' + data.plan_title + '", "' + data.plan_content + '")';
					var deleteSql = 'delete from t_plan_day_todo where id=' + todoId;
					if(db &&doneSql){
						db.transaction(function(tx){tx.executeSql(doneSql);});
					}
					if(db &&deleteSql){
						db.transaction(function(tx){tx.executeSql(deleteSql);});
					}
				});
			}
		});
	}

});