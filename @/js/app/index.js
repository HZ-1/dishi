/**
 * Created by Administrator on 2017/4/5.
 */
mui.init({
	//通过mui.init加载list.html子页面
	subpages : [{
		id:'list',
		url:'list.html',
		styles:{
			top:'45px',
			bottom:0
		}
	}]
});
var menu = null;
var main = null;
var menuoptions = null;
var modaloptions = null;
var showMenu=false;

//主页面mui.preload预加载添加、详情、侧滑菜单页面

// 通过mui.preload(detailOptions)初始化的页面，已经可以通过plus.webview.getWebviewById('detail')获取到webview；

//只是这样的初始化出来的webview它不显示，需要用代码show()如下，本app中add与Detail显示出来的方式是一样的
//menu = mui.preload(menuoptions);  menu.show()
/*var options ={
 styles : opt,
 id : 'add',
 url : 'add.html'
 };
 var add = mui.preload(options);
plus.webview.show('add')*/

//侧滑菜单的一个效果，通过在主页面预加载mui.preload(menu.html),然后在它show的回调中给主页面蒙版，并侧移70%，
// mui.preload(menu.html).show(function(){
// plus.webview.getWebviewById(plus.runtime.appid).setStyle({
// 														mask: 'rgba(0,0,0,0.4)',
// 														left: '70%'
// 														});
// 										})

//plus.webview.getWebviewById(plus.runtime.appid);这个方法是获取入口页面的webview（id为hbuilder）；什么是入口页面呢，也就是在
// manifest.json中定义的入口页面，系统会自动给该页面webview的id赋值为hbuilder；

mui.plusReady(function () {

	//第一行是预加载添加页面，这个之前说过了，normalPage只是对style做了封装，
	var opt = $.extend({}, {popGesture:'none'}, {top:'45px',bottom:0});
	var options ={
		styles : opt,
		id : 'add',
		url : 'add.html'
	};
	var add = mui.preload(options);
	if(add) $(document).off('tap', '.adda').on('tap', '.adda', showAdd);

	var detailOptions ={
		styles : opt,
		id : 'detail',
		url : 'detail.html'
	};
	var detail = mui.preload(detailOptions);

	//完成页面
	$(document).off('tap', '.mui-icon-bars').on('tap', '.mui-icon-bars', opMenu);
	menuoptions = {
		id : 'menu',
		url : 'menu.html',
		styles : {
			left:0,
			width:'70%',
			zindex:-1
		}
	};
	modaloptions = {
		title 	: 'title',
		abtn	: '确定',
		cbtn	: ['确定','取消'],
		content	: 'content'
	};
	menu = mui.preload(menuoptions);
	main = plus.webview.getWebviewById(plus.runtime.appid);

	// maskClick是侧滑菜单出来时，点击遮罩事件
	main.addEventListener('maskClick', closeMenu);

	mui.menu = closeMenu;//mui.menu是对菜单键的封装，当点击菜单键的时候，执行closeMenu关闭menu；
	// 退出
	mui.back = function(){
		if(showMenu){
			closeMenu();
		}else if($('.adda').is(':hidden')){
			hideAdd();
		}else{
			confirm('确定要退出吗？', function(){
				plus.runtime.quit();
			});
		}
	};
	$('.mui-icon-back').on('tap',hideAdd)
})

function opMenu(){
	openMenu();
}

function confirm(options, ok, cancel){
	var opt = $.extend({}, modaloptions);

	opt.title = '确认操作';
	if(typeof options == 'string'){
		opt.content = options;
	}else{
		$.extend(opt, options);
	}

	plus.nativeUI.confirm(opt.content, function(e){
		var i = e.index;
		if(i == 0 && ok) ok();
		if(i == 1 && cancel) cancel();
	}, opt.title, opt.cbtn);
};

function hideAdd(){
	hideBackBtn();
	plus.webview.getWebviewById('add').hide();
	plus.webview.getWebviewById('detail').hide();
}

// showAdd
function showAdd(){
	showBackBtn();
	plus.webview.show('add', 'slide-in-bottom', 300);
}

function showBackBtn(){
	$('.menua').removeClass('mui-icon-bars').addClass('mui-icon-back');
	$('.adda').hide();
	$(document).off('tap', '.mui-icon-back').on('tap', '.mui-icon-back', hideAdd);
}

function hideBackBtn(){
	$('.menua').removeClass('mui-icon-back').addClass('mui-icon-bars');

	$('.adda').show();
}


function closeMenu(){
	if(mui.os.ios && "#333333") plus.navigator.setStatusBarBackground("#f7f7f7");
	main.setStyle({
		mask: 'none',
		left: '0',
		transition: {
			duration: 100
		}
	});

	showMenu = false;
	setTimeout(function() {
		menu.hide();
	}, 300);
}

function openMenu(){

	if($('.adda').is(':visible')){
		if(mui.os.ios && "#333333") plus.navigator.setStatusBarBackground("#333333");
		menu.show('none', 0, function(){
			main.setStyle({
				mask: 'rgba(0,0,0,0.4)',
				left: '70%',
				transition: {
					duration: 150
				}
			});

			showMenu = true;
		});
	}
}

