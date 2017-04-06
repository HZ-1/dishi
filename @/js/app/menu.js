/*menu.js做的事情：
 首先，mui.init初始化中将后退按钮屏蔽，
其次，通过qiao.h.query查询到done表中的数据并显示，
最后，监听事件，获取todo中移除的id，
通过todoid查询到移除的todo列的title和content，
将这个title和content插入到done表中，
插入成功后删除todo表中记录。
 * */


//为了app更加流畅，在list页面只移除了li元素，其他所有数据库操作都放到menu页面进行，

//包括，删除todo表中的事项，添加到done表，查询done表并显示，代码如下：


// 初始化
mui.init({
	keyEventBind : {
		//首先，mui.init初始化中将后退按钮屏蔽，
		backbutton : false
	}
});


// 所有的方法都放到这里
mui.plusReady(function(){
	initDoneList();
	
	// 添加已完成事项
	//menu页面监听
	window.addEventListener('doneItem', doneItemHandler);
});

// 初始化待办事项
function initDoneList(){
	var $ul = $('#donelist').empty();
	//其次，通过qiao.h.query查询到done表中的数据并显示，
	qiao.h.query(db, 'select * from t_plan_day_done order by id desc', function(res){
		//最后，监听事件，获取todo中移除的id，
		//通过todoid查询到移除的todo列的title和content，
		//将这个title和content插入到done表中，
		for (i = 0; i < res.rows.length; i++) {
			$ul.append(genLi(res.rows.item(i).plan_title));
		}

		showList($ul);
	});
}
function genLi(title){
	return '<li class="mui-table-view-cell">' + title + '</li>';
}
function showList(ul){
	if(ul.find('li').size() > 0 &&  ul.is(':hidden')) ul.show();
}



// 添加已完成事项
//插入成功后删除todo表中记录。
function doneItemHandler(event){
	var todoId = event.detail.todoId;

	qiao.h.query(db, 'select * from t_plan_day_todo where id=' + todoId, function(res){
		if(res.rows.length > 0){
			var data = res.rows.item(0);
			
			qiao.h.query(db, 'select max(id) mid from t_plan_day_done', function(res1){
				$('#donelist').prepend('<li class="mui-table-view-cell>test</li>').prepend(genLi(data.plan_title)).show();
				
				var id = (res1.rows.item(0).mid) ? res1.rows.item(0).mid : 0;
				qiao.h.update(db, 'insert into t_plan_day_done (id, plan_title, plan_content) values (' + (id+1) + ', "' + data.plan_title + '", "' + data.plan_content + '")');
				qiao.h.update(db, 'delete from t_plan_day_todo where id=' + todoId);
			});
		}
	});
}