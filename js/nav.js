/**
 * Created by zw on 2017/9/3.
 */

    //导航选项卡切换
$(function(){
    //点击主页
    $(".backhome").click(function(){
        $(".main-block").show();
    });
    $(".J_menuItem").click(function(){
        $(".main-block").hide();
    })

    setInterval('homePagesStatus()',100);//标签页没有时显示主页

    $(".nav-box ul li").on('mouseover', function () {
        $(this).find('.submenu-nav-box').show();
    })
    $(".nav-box ul li").on('mouseout', function () {
        $(this).find('.submenu-nav-box').hide();
    })

    $(".nav-set").on('mouseover', function () {
        $(this).find('.submenu-box').show();
    })
    $(".nav-set").on('mouseout', function () {
        $(this).find('.submenu-box').hide();
    })

    $("#submenuBox .tab-nav-tit span:first-child").addClass("cur");
    $("#submenuBox .tab-nav-box").find(".tab-nav:not(:nth-child(1))").hide();
    $("#submenuBox .tab-nav-tit").find("span").each(function(i){
        $("#submenuBox .tab-nav-tit").find("span").eq(i).on('mouseover',function(){
            $(this).addClass("cur").siblings("span").removeClass("cur");
            $("#submenuBox").find(".tab-nav").eq(i).show().siblings(".tab-nav").hide();
        });
    });
});
//标签页没有时显示主页-S
function homePagesStatus(){
    var tabsUL = $(".J_menuTabs").find("a").length;
    if(tabsUL == 0){
        $(".main-block").show();
    }
}
//标签页没有时显示主页-E