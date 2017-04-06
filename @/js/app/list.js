
mui.init({
    gestureConfig : {
        longtap:true
    }
});

//注意 plus.webview.getWebviewById(plus.runtime.appid).evalJS("opMenu();");的使用

//list主要做 从数据库中拿取最新的数据渲染待办事项列表、完成、删除、监听添加页面添加过来的事项并渲染、右滑显示完成事项菜单这五个功能
//这里比较难的是完成功能：
// 完成功能难在这样效果的实现：
// 这种效果在正常时，是显示左侧的，右侧的完成是不显示的，只有当向左滑动时，才显示完成；
var db,tapId;

mui.plusReady(function () {

    //创建或打开db数据库
    db = creatDb();
    tapId =null;
    initHelp();

    // 长按
    $(document).off('longtap', '#todolist li').on('longtap', '#todolist li', function(){
        tapId = $(this).data('id');
        //如果弹框没有出现，调用mui('.mui-popover').popover('toggle')，则会出现弹框，如果弹框原先出现了，调用此句代码，则会隐藏弹框
        mui('.mui-popover').popover('toggle'); //传入toggle参数，用户也无需关心当前是显示还是隐藏状态，mui会自动识别处理；点击如上定义的按钮，即可显示弹出菜单，再次点击弹出菜单之外的其他区域，均可关闭弹出菜单；这种使用方式最为简洁
    });

    // 删除
    //监听点击删除的事件，并执行删除操作，最后重新加载该页面。
    $(document).off('tap', '.delli').on('tap', '.delli', delItem);

    // 添加
    window.addEventListener('addItem', addItemHandler);

    //详情
    $(document).off('tap', '#todolist li').on('tap', '#todolist li', function(){
        //在list页面添加点击事件，然后fire到detail页面
        var detailpage =plus.webview.getWebviewById('detail');
        mui.fire(detailpage, 'detailItem', {id:$(this).data('id')});
    });

    //完成
    $(document).off('tap', '.doneBtn').on('tap', '.doneBtn', function(){
        var $li = $(this).parent().parent();
        var id = $li.data('id');
        $li.remove();
        // showList($('#todolist'));
        var menupage =plus.webview.getWebviewById('menu');
        mui.fire(menupage, 'doneItem', {todoId:id});
        return false;
    });

    // 右滑菜单
    window.addEventListener('swiperight', function(){
        //页面件传值和操作，比较常用的一种方法就是先获取页面对象然后调用evaljs即可。
        plus.webview.getWebviewById(plus.runtime.appid).evalJS("opMenu();");
    });

})

// 删除事项
function delItem(){
    if(tapId){
        if(db &&'delete from t_plan_day_todo where id=' + tapId){
            db.transaction(function(tx){tx.executeSql('delete from t_plan_day_todo where id=' + tapId);});
        }
        //如果弹框没有出现，调用mui('.mui-popover').popover('toggle')，则会出现弹框，如果弹框原先出现了，调用此句代码，则会隐藏弹框
        mui('.mui-popover').popover('toggle'); //传入toggle参数，用户也无需关心当前是显示还是隐藏状态，mui会自动识别处理；点击如上定义的按钮，即可显示弹出菜单，再次点击弹出菜单之外的其他区域，均可关闭弹出菜单；这种使用方式最为简洁
        initList();
    }
}

function creatDb(name, size){
    var db_name = name ? name : 'db_test';
    var db_size = size ? size : 2;
    //openDatabase方法打开一个已经存在的数据库，如果数据库不存在，它还可以创建数据库
    return openDatabase(db_name, '1.0', 'db_test', db_size * 1024 * 1024);
};

function getHelp(key){
    if(key){
        for(var i=0; i<plus.storage.getLength(); i++) { //获取应用存储区中保存的键值对的个数
            if(key == plus.storage.key(i)){
                return plus.storage.getItem(key);
            }
        };
    }
    return null;
};

function query(db, sql, func){
    if(db && sql){
        db.transaction(function(tx){
            tx.executeSql(sql, [], function(tx, results) {
                func(results);
            }, null);
        });
    }
};

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

// 初始化待办事项
function initList(){
    /*
     * 这里的qmask-3.0.js插件，主要用来渲染一个加载页面时，加载等待的效果，如图：
     使用qmask.show();会出现下面的等待；
     使用qmask.hide();就会结束下面等待加载效果；
     * */
    qmask.show();
    var $ul = $('#todolist').empty();
    query(db, 'select * from t_plan_day_todo order by id desc', function(res){
        for (i = 0; i < res.rows.length; i++) {
            $ul.append(genLi(res.rows.item(i)));
        }
        showList($ul);
    });
    qmask.hide();
}

function initHelp(){
    var help = getHelp('help');
    if(help == null){
        db.transaction(function(tx){
            tx.executeSql('create table if not exists t_plan_day_todo (id unique, plan_title, plan_content)');
        });
        db.transaction(function(tx){
            tx.executeSql('create table if not exists t_plan_day_done (id unique, plan_title, plan_content)');
        });
        var content = '1.11右上角添加事项<br/>2.点击事项查看详情<br/>3.长按事项删除<br/>4.右滑事项完成<br/>5.左滑显示完成事项';
        var sql = 'insert into t_plan_day_todo (id, plan_title, plan_content) values (1, "功能介绍", "' + content + '")';
        db.transaction(function(tx){
            tx.executeSql(sql);
        });
        plus.storage.setItem('help','notfirst');
    }
    initList();
}

function update(db, sql){
    if(db &&sql){
        db.transaction(function(tx){tx.executeSql(sql);});
    }
};

// 添加待办事项
//首先修改按钮，
//其次操作数据库，基本都是上节讲的内容，
//这里没有将列表重新加载了一遍，而只是将添加想prepend到了list页面，也是为了流畅。

function addItemHandler(event){
    // 主界面按钮修改
    plus.webview.getWebviewById(plus.runtime.appid).evalJS("hideBackBtn();");
    var title = event.detail.title;
    var content = event.detail.content ? event.detail.content : '暂无内容！';
    query(db, 'select max(id) mid from t_plan_day_todo', function(res){ //select max(id) mid 在t_plan_day_todo中选择最大的id
        var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
        update(db, 'insert into t_plan_day_todo (id, plan_title, plan_content) values (' + (id+1) + ', "' + title + '", "' + content + '")');
        $('#todolist').prepend(genLi({id:id+1, 'plan_title':title, 'plan_content':content})).show();
        /*添加页从底部进入效果
         添加页的显示不是简单的显示出来，而是用了一个从底部进入的效果，
         所有的webview调用show方法的时候都可以 添加效果，*/
    });
}
