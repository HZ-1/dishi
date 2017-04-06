
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
	$(document).off('tap', '.addItemBtn').on('tap', '.addItemBtn', addItem);
});






// 重置页面
function resetPage(){
	$('#addContent').val('');
	$('#addTitle').val('');
}

function alertF(options, ok){
	var modaloptions={
		title 	: 'title',
		abtn	: '确定',
		cbtn	: ['确定','取消'],
		content	: 'content'
	}
	var opt = $.extend({}, modaloptions);

	opt.title = '提示';
	if(typeof options == 'string'){
		opt.content = options;
	}else{
		$.extend(opt, options);
	}

	plus.nativeUI.alert(opt.content, function(e){
		if(ok) ok();
	}, opt.title, opt.abtn);
};

function getPage(id){
	return id ? plus.webview.getWebviewById(id) : null;
};

// 添加待办事项
function addItem(){
	var title = $.trim($('#addTitle').val()); //trim 去掉字符串首尾空格
	var content = $.trim($('#addContent').val()).replace(/\n/g, '<br/>');
	
	//默认的提示框
	if(!title){
		//当没有填写待办事项标题的时候，你会看到一个提示框，调用的qiao.h.alert('请填写待办事项标题！'); 
		alertF('请填写待办事项标题！');	//是稍作封装，底层是调用的nativeUI的alert方法

	}else{
		getPage('add').hide();
		resetPage();
		mui.fire(getPage('list'), 'addItem', {title:title, content:content});
	}
}
