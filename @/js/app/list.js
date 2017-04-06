// 初始化
//由于系统菜单按钮和后退按钮都在index页面监听了，所以其他页面的这两个按钮监听就都禁用了。
mui.init({
	keyEventBind : {
		backbutton : false,
		menubutton : false,
		
	},
	gestureConfig : {
		longtap:true
	}
});

var tapId = null;
// 所有的方法都放到这里
mui.plusReady(function(){
	// 获取列表
	initHelp();
	
	// 右滑菜单
	window.addEventListener('swiperight', function(){
		//页面件传值和操作，比较常用的一种方法就是先获取页面对象然后调用evaljs即可。
		qiao.h.indexPage().evalJS("opMenu();");
	});
	
	// 查看详情
	//这里采用了fire方式，简单的说就是，
    //list页面对menu页面发起一个事件，即fire，
	//然后menu页面监听list页面的这个事件。
	//这里可以看到，只是将mui.fire封装了下，只需要传入页面id，将自动获取该id对应的页面
	//话说mui两种页面间传值的方法，一是evalJs，但是不做推荐，为啥不做推荐，请百度之，
	//然后就是fire的方式了，方便传值，还是比较好的。
	//这里是list页面对menu页面fire了。
	
	
	qiao.on('#todolist li', 'tap', function(){
		//在list页面添加点击事件，然后fire到detail页面
		qiao.h.fire('detail', 'detailItem', {id:$(this).data('id')});
	});
	
	// 完成
	//第一部分是获取该待办事项Li的id，然后移除Li，
	//第二部分是将获取的id通过fire的方式传到menu页面

	qiao.on('.doneBtn', 'tap', function(){
		var $li = $(this).parent().parent();
		var id = $li.data('id');
		$li.remove();
		showList($('#todolist'));
		
		qiao.h.fire('menu', 'doneItem', {todoId:id});
		return false;
	});
	
	// 长按
	qiao.on('#todolist li', 'longtap', function(){
		tapId = $(this).data('id');
		qiao.h.pop();
	});
	
	// 删除
	//监听点击删除的事件，并执行删除操作，最后重新加载该页面。
	qiao.on('.delli', 'tap', delItem);
	// 删除事项
	function delItem(){
	if(tapId){
		qiao.h.update(db, 'delete from t_plan_day_todo where id=' + tapId);
		qiao.h.pop();
		initList();
	}
}
	
	// 添加
	window.addEventListener('addItem', addItemHandler);
});


function initHelp(){
	var help = qiao.h.getItem('help');
	if(help == null){
		qiao.h.update(db, 'create table if not exists t_plan_day_todo (id unique, plan_title, plan_content)');
		qiao.h.update(db, 'create table if not exists t_plan_day_done (id unique, plan_title, plan_content)');
		
		var content = '1.右上角添加事项<br/>2.点击事项查看详情<br/>3.长按事项删除<br/>4.右滑事项完成<br/>5.左滑显示完成事项';
		var sql = 'insert into t_plan_day_todo (id, plan_title, plan_content) values (1, "功能介绍", "' + content + '")';
		qiao.h.update(db, sql);
		
		qiao.h.insertItem('help','notfirst');
	}
	
	initList();
}

// 初始化待办事项
function initList(){
	qmask.show();
	
	var $ul = $('#todolist').empty();
	qiao.h.query(db, 'select * from t_plan_day_todo order by id desc', function(res){
		for (i = 0; i < res.rows.length; i++) {
			$ul.append(genLi(res.rows.item(i)));
		}

		showList($ul);
	});
	
	qmask.hide();
}
function genLi(data){
	var id = data.id;
	var title = data.plan_title;
	var content = data.plan_content;
	
	var li = 
		'<li class="mui-table-view-cell" id="todoli_' + id + '" data-id="' + id + '">' +
			'<div class="mui-slider-right mui-disabled">' + 
				'<a class="mui-btn mui-btn-red doneBtn">完成</a>' +
			'</div>' + 
			'<div class="mui-slider-handle">' + 
				'<div class="mui-media-body">' + 
					title + 
					'<p class="mui-ellipsis">'+content+'</p>' + 
				'</div>' + 
			'</div>' +
		'</li>';
		
	return li;
}
function showList(ul){
	if(ul.find('li').size() > 0 &&  ul.is(':hidden')) ul.show();	
}

// 添加待办事项
//首先修改按钮，
//其次操作数据库，基本都是上节讲的内容，
//这里没有将列表重新加载了一遍，而只是将添加想prepend到了list页面，也是为了流畅。

function addItemHandler(event){
	// 主界面按钮修改
	qiao.h.indexPage().evalJS("hideBackBtn();");
	
	var title = event.detail.title;
	var content = event.detail.content ? event.detail.content : '暂无内容！';
	
	qiao.h.query(db, 'select max(id) mid from t_plan_day_todo', function(res){
		var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
		qiao.h.update(db, 'insert into t_plan_day_todo (id, plan_title, plan_content) values (' + (id+1) + ', "' + title + '", "' + content + '")');
		
		$('#todolist').prepend(genLi({id:id+1, 'plan_title':title, 'plan_content':content})).show();
		/*添加页从底部进入效果
添加页的显示不是简单的显示出来，而是用了一个从底部进入的效果，
所有的webview调用show方法的时候都可以 添加效果，*/
	});
}

