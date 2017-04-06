/*
 index.js：
在这里只做了两件事情，
一件是mui.init中初始化了子页面list.html，
一件是mui.plusready中初始化数据库
 * */

// 初始化
mui.init({
	
	//通过mui.init加载list.html子页面
	subpages : [qiao.h.normalPage('list')]
});

var main = null;
var showMenu = false;
var menu = null;
var add = null;
var detail = null;

// 所有方法都放到这里
mui.plusReady(function(){
	setColor("#f7f7f7");
	
	// 侧滑菜单
	main = qiao.h.indexPage();
	var menuoptions = qiao.h.page('menu', {
		styles : {
			left:0,
			width:'70%',
			zindex:-1
		}
	});
	
	menu = mui.preload(menuoptions);
	qiao.on('.mui-icon-bars', 'tap', opMenu);
	main.addEventListener('maskClick', opMenu);
	mui.menu = opMenu;
	
	// 打开添加页的js，要实现：比较简单，就是当进入添加页后将左上角修改为后退按钮，右上角的添加按钮隐藏掉，
	//退出添加页的方法正好相反，都做提供。
	
	//第一行是预加载添加页面，这个之前说过了，normalPage只是对style做了封装，
	add = mui.preload(qiao.h.normalPage('add', {popGesture:'none'}));
	//第二行是监听左上角的按钮点击事件
	qiao.on('.adda', 'tap', showAdd);
	//第三行是监听右上角的后退按钮（进入添加页后右上角变为后退按钮）
	qiao.on('.mui-icon-back', 'tap', hideAdd);
	
	// 详情
	//点击待办事项，我跳转到详情页，可以看到事项的详情
	//在index中选哟将detail页面预加载进来。
	detail = mui.preload(qiao.h.normalPage('detail', {popGesture:'none'}));
	
	// 退出
	mui.back = function(){
		if($('.adda').is(':hidden')){
			hideAdd();	
		}else if(showMenu){
			closeMenu();
		}else{
			qiao.h.exit();
		}
	};
});

// menu
function opMenu(){
	if(showMenu){
		closeMenu();
	}else{
		openMenu();
	}
}
function openMenu(){
	if($('.adda').is(':visible')){
		setColor("#333333");
		menu.show('none', 0, function() {
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
function closeMenu(){
	setColor("#f7f7f7");
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

// showAdd
function showAdd(){
	showBackBtn();
	qiao.h.show('add', 'slide-in-bottom', 300);
}
function hideAdd(){
	hideBackBtn();
	qiao.h.getPage('add').hide();
	qiao.h.getPage('detail').hide();
}
function showBackBtn(){
	$('.menua').removeClass('mui-icon-bars').addClass('mui-icon-back');
	$('.adda').hide();
}
function hideBackBtn(){
	$('.menua').removeClass('mui-icon-back').addClass('mui-icon-bars');
	$('.adda').show();
}

// set color
function setColor(color){
	if(mui.os.ios && color) plus.navigator.setStatusBarBackground(color);
}