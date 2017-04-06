
/*添加页从底部进入效果
添加页的显示不是简单的显示出来，而是用了一个从底部进入的效果，

所有的webview调用show方法的时候都可以 添加效果，*/

// 初始化
//初始化，将不需要的按钮事件屏蔽，
mui.init({
	keyEventBind : {
		backbutton : false,
		menubutton : false
	}
});

/*下面为：
监听添加按钮事件，然后将标题和内容通过fire的方式传到list页面，
在list页面操作是为了add页面的添加效果流畅。*/

// 所有方法都放到这里
mui.plusReady(function(){
	resetPage();
	qiao.on('.addItemBtn', 'tap', addItem);
});

// 重置页面
function resetPage(){
	$('#addContent').val('');
	$('#addTitle').val('');
}

// 添加待办事项
function addItem(){
	var title = $.trim($('#addTitle').val());
	var content = $.trim($('#addContent').val()).replace(/\n/g, '<br/>');
	
	//默认的提示框
	if(!title){
		//当没有填写待办事项标题的时候，你会看到一个提示框，调用的qiao.h.alert('请填写待办事项标题！'); 
		qiao.h.alert('请填写待办事项标题！');	//是稍作封装，底层是调用的nativeUI的alert方法	
	}else{
		qiao.h.getPage('add').hide();
		resetPage();
		qiao.h.fire('list', 'addItem', {title:title, content:content});
	}
}

//在plusready中监听add页的fire事件：
//window.addEventListener('addItem', addItemHandler);
/*可在list.js中看，这里复制过来为了阅读
 // 添加待办事项
function addItemHandler(event){
    // 主界面按钮修改
    qiao.h.indexPage().evalJS("hideBackBtn();");
     
    var db = qiao.h.db();
    var title = event.detail.title;
    var content = event.detail.content ? event.detail.content : '暂无内容！';
     
    qiao.h.query(db, 'select max(id) mid from t_plan_day_todo', function(res){
        var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
        qiao.h.update(db, 'insert into t_plan_day_todo (id, plan_title, plan_content) values (' + (id+1) + ', "' + title + '", "' + content + '")');
         
        $('#todolist').prepend(genLi({id:id+1, 'plan_title':title, 'plan_content':content})).show();
    });
}
 * 
 * */