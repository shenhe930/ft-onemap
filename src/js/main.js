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
        // console.log(e);
        // console.log(data);
        leftPanel.showGridSearchResult(data);
    });

    $(toolbox).bind("removeGrid",function () {
        leftPanel.clearSearchResult();
    });

    function getBoundary(){
        var bdary = new BMap.Boundary();
        bdary.get("北京市丰台区", function(rs){       //获取行政区域
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return ;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 4, strokeColor: "#ff0000",fillOpacity:0.1}); //建立多边形覆盖物
                map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            map.setViewport(pointArray);    //调整视野
        });
    }

    setTimeout(function(){
        getBoundary();
    }, 2000);

}());
