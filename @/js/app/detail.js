// 初始化

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
});

// 展示待办事项
function detailItemHandler(event){
	qiao.h.indexPage().evalJS("showBackBtn();");

	var detailId = event.detail.id;
	var sql = 'select * from t_plan_day_todo where id=' + detailId;
	qiao.h.query(db, sql, function(res){
		if(res.rows.length > 0){
			var data = res.rows.item(0);
			$('#detailTitle').text(data.plan_title);
			$('#detailContent').html(data.plan_content);
			
			qiao.h.show('detail', 'slide-in-right', 300);
		}
	});
}