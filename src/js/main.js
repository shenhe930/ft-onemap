(function() {
    // var BMapLib = window.BMapLib = BMapLib || {};

    var map = new BMap.Map("map");          // 创建地图实例
    var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
    map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    //添加地图控件
    var navigation = new BMap.NavigationControl(
        {
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        });
    map.addControl(navigation);

    var leftPanel=new BMapLib.LeftPanelControl();
    map.addControl(leftPanel);

    var toolbox=new BMapLib.ToolBoxControl();
    map.addControl(toolbox);


    $(toolbox).bind("gridSelected",function (e,data) {
        console.log(e);
        console.log(data);
        leftPanel.showGridSearchResult(data);
    });

    $(toolbox).bind("removeGrid",function () {
        leftPanel.clearSearchResult();
    });

    $(toolbox).bind("buildingClicked",function (e,id) {
        console.log(e);
        console.log(id);
        leftPanel.showBuildingInfo(id);
    });



}());
