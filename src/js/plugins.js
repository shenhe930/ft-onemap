// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



(function () {
    /* 百度地图自定义 Left Panel 控件
     * Author：
     * ================================= */
    if(!window.BMapLib){
        window.BMapLib={};
    }
    var BMapLib = window.BMapLib;

    laydate.skin('molv');

    var self;
    var searchResultPoint=[];//查询结果点

    var autocompleteUrl="json/autocomplete.json";//搜索框自动完成请求url
    var searchUrl="json/searchresult.json";//搜索框搜索请求url
    var buildingInfoUrl="json/buildingInfo.json";//楼宇信息请求url
    var floorUrl="json/floorInfo.json";//查询楼层信息

    var LeftPanelControl =BMapLib.LeftPanelControl = function (/*options*/) {
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(10, 10);
    };

    LeftPanelControl.prototype = new BMap.Control();


    /**
     * 隐藏所有card
     */
    function hideAllCard(){
        self.cardList.find(".card").addClass("hidden");
    }

    function generateFloorDetailHtml(floor,rooms) {
        var roomsHtml = "";
        if(rooms){
            for (var i = rooms.length - 1; i >= 0; i--) {
                roomsHtml += '<div class="room-cube text-center"><strong>房间号：</strong><br>' + (rooms[i].name!==undefined?rooms[i].name:"") + '</div>';
            }
        }

        var floorHtml ="";
        if(floor){
            floorHtml =
                '<div id="floor-Info" class="card-box" style="height: 200px">' +
                '<img src=files/' + floor.url + '>' +
                '</div>' +
                '<div class="card-box floor-box" style="height: 200px">' +
                roomsHtml +
                '</div>';
        }

        return floorHtml;
    }

    /**
     * 显示公司信息
     */
    function showCompanyInfoWindow(){
        $.getJSON("json/companyInfo.json",function(data){
            var companyInfoWindowHtml=
                '<div class="company-info" >' +
                    '<img class="company-img" src="' + data.companyImage + '">' +
                    '<div class="company-content">' +
                        '<p class="text-muted"><strong>公司名称：</strong>' + data.name + '</p>' +
                        '<p class="text-muted"><strong>生产经营地：</strong>' + data.address + '</p>' +
                    '</div>'+
                    '<div class="tabs-container">' +
                        '<ul class="nav nav-tabs">' +
                            '<li class="active"><a data-toggle="tab" href="#">基本信息</a></li>' +
                            // '<li class=""><a data-toggle="tab" href="#" >企业服务</a></li>' +
                            // '<li class=""><a data-toggle="tab" href="#" >党建信息</a></li>' +
                        '</ul>' +
                        '<div class="tab-content">' +
                            '<div id="tab-1" class="tab-pane active" style="height: 240px">' +
                                '<p class="text-muted"><strong>是否三证合一：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>社会统一信用代码：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>注册登记号：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>企业名称：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>注册资金：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>注册地址：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>办公地址：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>组织结构代码证：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>税务登记号：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>地税所在区县（所）：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>国税所在区县（所）：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>统计登记号：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>主营业务：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>企业性质：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>联系人：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>电话：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>法人：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>注册时期：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>分支机构：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>职工总数：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>其中：非京少数民族：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>民主党派：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>本科以上：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>硕士：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>博士：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>归国留学人员：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>高级职称：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>是否中关村高新：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>证书号：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>是否国高新：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>证书号：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>备注：</strong>' + '' + '</p>' +
                                '<p class="text-muted"><strong>其他：</strong>' + '' + '</p>' +
                            '</div>' +
                            '<div id="tab-2" class="tab-pane" style="height: 240px">' +
                            '</div>' +
                            '<div id="tab-3" class="tab-pane" style="height: 240px">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            layer.open({
                type: 1,
                shift: 0,
                // shade:0,
                title: '公司信息',
                maxmin: true,
                shadeClose: true, //开启遮罩关闭
                content: companyInfoWindowHtml
            });
        });

    }

    /**
     * 显示楼宇信息
     */
    function showBuildingInfo(id) {
        $.getJSON(buildingInfoUrl,
            {
                method:"queryBuildingInfoById",
                b_id:id,
                buildingaddress:""
            },
            function (data) {
                hideAllCard();
                var floors = data.floorList;
                var paginationHtml = "";
                for (var i = 0; i < floors.length; i++) {
                    if (i === 0)
                        paginationHtml += '<li class="active"><a href="#" data-fid="'+floors[i].f_id+'">' + floors[i].name + '</a></li>';
                    else
                        paginationHtml += '<li><a href="#" data-fid="'+floors[i].f_id+'">' + floors[i].name + '</a></li>';
                }

                var buildingDetailCardHtml =
                    '<button class="closeBtn btn btn-link glyphicon glyphicon-remove"></button>' +
                    '<div class="card-content">' +
                    '<ul class="nav nav-pills nav-justified">' +
                    '<li  class="active" data-toggle="tab"><a href="#detail-building">楼宇信息</a></li>' +
                    '<li  class="" data-toggle="tab"><a href="#detail-floor">楼层信息</a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    '<div role="tabpanel" class="tab-pane fade  in active" id="detail-building">' +
                    '<div class="card-box" style="height: 200px">' +
                    '<img src="files/' + data.building.url1 + '">' +
                    '</div>' +
                    '<div class="card-box building-info" style="height: 220px">' +
                    '<p class="text-muted"><strong>楼宇名称：</strong>' + data.building.name + '</p>' +
                    '<p class="text-muted"><strong>地址：</strong>' + data.building.address + '</p>' +
                    '<p class="text-muted"><strong>开发商：</strong>' + data.building.dev + '</p>' +
                    '<p class="text-muted"><strong>开工日期：</strong>' + data.building.start_date + '</p>' +
                    '<p class="text-muted"><strong>竣工日期：</strong>' + data.building.end_date + '</p>' +
                    '<p class="text-muted"><strong>建筑面积：</strong>' + data.building.area + '</p>' +
                    '<p class="text-muted"><strong>建筑楼层：</strong>' + data.building.f + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div role="tabpanel" class="tab-pane fade" id="detail-floor">' +
                    '<nav>' +

                    '<ul id="pagination" class="pagination">' +
                    '<li id="pagination-prev">' +
                    '<a href="#" >' +
                    '<span>&laquo;</span>' +
                    '</a>' +
                    '</li>' +
                    paginationHtml +
                    '<li id="pagination-next">' +
                    '<a href="#" >' +
                    '<span>&raquo;</span>' +
                    '</a>' +
                    '</li>' +
                    '</ul>' +
                    '</nav>' +
                    '<div id="floor-detail">' +
                    generateFloorDetailHtml(floors[0],data.roomList) +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                self.buildingDetailCard.html(buildingDetailCardHtml);

                self.backCard.removeClass("hidden");
                self.buildingDetailCard.removeClass("hidden");

                self.buildingDetailCard.find(".closeBtn").click(function () {
                    self.buildingDetailCard.addClass("hidden");
                    //self.clearSearchResult();
                    self.backCard.addClass("hidden");
                });

                self.buildingDetailCard.find('.nav-pills a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                });

                self.buildingDetailCard.find('.pagination a[data-fid]').click(function () {
                    if(!$(this).parent().hasClass("active")){
                        self.buildingDetailCard.find('.pagination a[data-fid]').parent().removeClass("active");
                        $(this).parent().addClass("active");
                        $.getJSON(
                            floorUrl,
                            {
                                method:"queryFloorInfoById",
                                f_id:$(this).data("fid")
                            },
                            function(result){
                                self.buildingDetailCard.find('#floor-detail').html(generateFloorDetailHtml(result.floor,result.roomList));
                                self.buildingDetailCard.find(".room-cube").click(function () {
                                    showCompanyInfoWindow();
                                });

                            });
                    }

                });

                self.buildingDetailCard.find(".room-cube").click(function () {
                    showCompanyInfoWindow();
                });


        });

    }

    LeftPanelControl.prototype.clearSearchResult=function(){
        var list=self.searchResultCard.find(".list-group");
        list.empty();

        $.each(searchResultPoint,function(i){
            self._map.removeOverlay(searchResultPoint[i]);
        });
        searchResultPoint=[];

        self.searchResultCard.addClass("hidden");
    };

    LeftPanelControl.prototype.showSearchResult=function(result){
        var map=self._map;
        hideAllCard();
        self.searchResultCard.removeClass("hidden");

        var list=self.searchResultCard.find(".list-group");
        list.empty();

        $.each(searchResultPoint,function(i){
            map.removeOverlay(searchResultPoint[i]);
        });
        searchResultPoint=[];

        $.each(result.data, function(i){
            var item=$(
                '<a class="list-group-item" data-bid="'+result.data[i].b_id+'">' +
                '<strong>'+result.data[i].name+'</strong><br><small>'+result.data[i].address+'</small>'+
                '</a>'
            );
            list.append(item);

            var point=new BMap.Point(result.data[i].x, result.data[i].y);
            var marker = new BMap.Marker(point);
            marker.bid=result.data[i].b_id;
            var opts = {
                width : 160,     // 信息窗口宽度
                height: 60,     // 信息窗口高度
                title : result.data[i].name  // 信息窗口标题
            };
            var infoWindow = new BMap.InfoWindow("地址："+result.data[i].address, opts);  // 创建信息窗口对象
            marker.addEventListener("click", function(e){
                map.openInfoWindow(infoWindow,point); //开启信息窗口
                showBuildingInfo(e.target.bid);
            });
            map.addOverlay(marker);
            searchResultPoint.push(marker);

            item.click(function () {
                self.searchResultCard.addClass("hidden");

                var bid=$(this).data("bid");
                showBuildingInfo(bid);
                $.each(searchResultPoint,function(i){
                    if(bid===searchResultPoint[i].bid)
                        map.centerAndZoom(searchResultPoint[i].getPosition(),18);
                });
            });
        });
    };



    function searchBoxDom(me,container){
        var searchBox=
            $('<div class="searchbox">' +
                '<div class="input-group ">' +
                    '<input type="text" class="form-control" placeholder="搜索楼宇">' +
                    '<span class="input-group-btn">' +
                        '<button class="clear-btn hidden btn btn-white" type="button"><span class="glyphicon glyphicon-remove-circle"></span></button>' +
                        '<button class="state-btn btn btn-white" type="button"><span class="glyphicon glyphicon-plus"></span></button>' +
                        '<button class="searchbox-btn btn btn-primary" type="button"><span class="glyphicon glyphicon-search"></span></button>' +
                    '</span>' +
                '</div>' +
             '</div>');
        var searchInput=searchBox.find('input');
        var searchBtn=searchBox.find('.searchbox-btn');
        var clearBtn=searchBox.find('.clear-btn');

        searchInput.autocomplete({
            source:function(query,process){
                $.getJSON(
                    autocompleteUrl,
                    {
                        method:"queryBuilding2",
                        buildingname:searchInput.val(),
                        buildingaddress:""
                    },
                    function(result){
                    process(result.data);
                });
            },
            formatItem:function(item){
                return item.name;
            },
            setValue:function(item){
                return {'data-value':item.name,'real-value':item.b_id};
            }
        });

        searchInput.on("input",function () {
            if($(this).val()!==""){
                clearBtn.removeClass("hidden");
            }else{
                clearBtn.addClass("hidden");
            }
        });

        clearBtn.click(function () {
            searchInput.val('');
            searchInput.attr("real-value","");
            clearBtn.addClass("hidden");
        });

        container.append(searchBox);

        me.searchInput=searchInput;
        me.searchBtn=searchBtn;
        me.stateBtn=searchBox.find('.state-btn');

    }

    function conditionCardDom(me,container) {

        var conditionCard=
            $('<div class="card hidden animated fadeInUp">' +
                '<button class="closeBtn btn btn-link glyphicon glyphicon-remove"></button>'+
                '<div class="card-content">' +
                    '<ul class="nav nav-tabs nav-justified">'+
                        '<li class="active" data-toggle="tab"><a href="#total">企业总数</a></li>'+
                        '<li data-toggle="tab"><a href="new" >新增企业数</a></li>'+
                    '</ul>'+
                    '<div class="tab-content">'+
                        '<div class="tab-pane fade in active" id="total">'+
                            '<div class="">' +
                                '<i class="building-icon fa fa-building fa-2x pull-left"></i>'+
                                '<form class="form">' +
                                    '<div class="form-group">' +
                '<input type="text" placeholder="开始时间" class="input-date form-control" onclick="laydate()">' +
                '<input type="text" placeholder="结束时间" class="input-date form-control" onclick="laydate()">' +
                                    '</div>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                        '<div class="tab-pane fade" id="new">'+
                            '<div class="">' +
                                '<i class="building-icon fa fa-building fa-2x pull-left"></i>'+
                                '<form class="form">' +
                                    '<div class="form-group">' +
                '<input type="text" placeholder="开始时间" class="input-date form-control" onclick="laydate()">' +
                '<input type="text" placeholder="结束时间" class="input-date form-control" onclick="laydate()">' +
                                    '</div>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
             '</div>');
        container.append(conditionCard);

        conditionCard.find(".closeBtn").click(function () {
            conditionCard.addClass("hidden");
        });

        me.stateBtn.click(function () {
            conditionCard.removeClass("hidden");
        });
    }

    function searchResultCardDom(me,container){
        var searchResultCard=me.searchResultCard=
            $('<div class="card hidden animated fadeInUp">' +
                '<button class="closeBtn btn btn-link glyphicon glyphicon-remove"></button>'+
                '<div class="card-content">' +
                    '<ul class="list-group">' +
                    '</ul>'+
                '</div>' +
             '</div>');

        searchResultCard.find(".closeBtn").click(function () {
            searchResultCard.addClass("hidden");
            me.clearSearchResult();
        });

        me.searchBtn.click(function () {
            $.getJSON(
                searchUrl,
                {
                    method:"queryBuilding2",
                    buildingname:me.searchInput.val(),
                    buildingaddress:""
                },
                function(result){
                    me.showSearchResult(result);
            });
        });

        container.append(searchResultCard);
    }

    function backToResultCardDom(me,container){
        var backCard=
            $('<div class="card hidden animated fadeInUp">' +
                    '<div class="card-content">' +
                        '<p style="padding: 6px;margin: 0;cursor:pointer"><span class="glyphicon glyphicon-chevron-left"></span>返回搜索结果</p>'+
                    '</div>'+
            '</div>');

        backCard.click(function () {
            hideAllCard();
            me.searchResultCard.removeClass("hidden");
        });
        me.backCard=backCard;
        container.append(backCard);
    }

    function buildingDetailCardDom(me,container){
        var buildingDetailCard = $('<div class="building-detail card hidden animated fadeInUp"></div>');
        container.append(buildingDetailCard);
        me.buildingDetailCard = buildingDetailCard;
    }

    /**
     * 实现父类的initialize方法
     * @ignore
     * @param {Map} map Baidu map的实例对象

     * @example <b>参考示例：</b><br />
     * var leftPanel=new BMapLib.LeftPanelControl();
     */
    LeftPanelControl.prototype.initialize = function (map) {
        self=this;
        this._map = map;

        var container=$("<div class='left-panel'></div>");

        searchBoxDom(this,container);

        var cardList=this.cardList= $('<div class="cardlist"></div>');

        conditionCardDom(this,cardList);

        searchResultCardDom(this,cardList);

        backToResultCardDom(this,cardList);

        buildingDetailCardDom(this,cardList);

        container.append(cardList);

        map.getContainer().appendChild(container.get(0));

        // this.buildingDetailCard.find('#pagination').carouFredSel({
        //     items: 12,
        //     height: 40,
        //     next: "pagiantion-next",
        //     prev: "pagiantion-prev",
        //     scroll: {
        //         items: 1,
        //         easing: "elastic",
        //         duration: 1000
        //     }
        // });

        //将创建的dom元素返回
        return container.get(0);


    };


}());

(function () {
    /* 百度地图自定义 Tool Box 控件
     * Author：
     * ================================= */


    var ToolBoxControl = BMapLib.ToolBoxControl = function () {
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
    };

    // 继承Control
    ToolBoxControl.prototype = new BMap.Control();

    var self;
    var grids=[];//网格
    var currentGrid;//当前选中网格
    var gridUrl="json/buildingByGrid.json";

    /**
     * 添加网格到地图
     */
    function addGrid(){
        var polygon = new BMap.Polygon([
            new BMap.Point(116.286448,39.839826),
            new BMap.Point(116.291047,39.840131),
            new BMap.Point(116.292395,39.836654),
            new BMap.Point(116.293365,39.835048),
            new BMap.Point(116.291927,39.834535),
            new BMap.Point(116.287059,39.833538),
            new BMap.Point(116.286232,39.836433)
        ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:1,fillOpacity:0.1});  //创建多边形
        self._map.addOverlay(polygon);
        self._map.setViewport(polygon.getPath());
        grids.push(polygon);

        polygon.gid="1";
        polygon.addEventListener("click",function (e) {
            if(currentGrid)
                currentGrid.getFillOpacity(0);
            e.target.setFillColor("blue");
            e.target.getFillOpacity(0.3);
            currentGrid=e.target;

            $.getJSON(
                gridUrl,
                {
                    method:"queryBuildingByGrid",
                    g_id:e.target.gid
                },
                function (result) {
                    $(self).trigger("gridSelected",result);
                }
            );
        });
    }

    function  removeGrid() {
        $.each(grids,function(i){
            self._map.removeOverlay(grids[i]);
        });
        grids=[];
        $(self).trigger("removeGrid");
    }

    /**
     * 实现父类的initialize方法
     * @ignore
     * @param {Map} map Baidu map的实例对象

     * @example <b>参考示例：</b><br />
     * var toolbox = new BMapLib.ToolBoxControl();
     */
    ToolBoxControl.prototype.initialize = function (map) {
        self=this;
        this._map = map;
        var toolboxContainer=$("<div class='toolbox-container'></div>");

        var toolbar=
            $('<div class="toolbar btn-group btn-group-sm">' +
                '<button class="btn btn-white" id="info-tool" type="button"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;信息</button>' +
                '<button class="btn btn-white" id="grid-tool" type="button"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;网格</button>' +
                '<div class="btn-group btn-group-sm">' +
                '<button data-toggle="dropdown" class="btn btn-white dropdown-toggle"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;专题图 <span class="caret"></span></button>' +
                '<ul class="dropdown-menu">' +
                '<li><a href="#"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;注册资本</a></li>' +
                '<li><a href="#"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;企业分类</a></li>' +
                '<li><a href="#"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;院士工作站</a></li>' +
                '<li><a href="#"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;楼宇党建</a></li>' +
                '<li><a href="#"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;非公党建</a></li>' +
                '</ul>' +
                '</div>' +
                    '<div class="btn-group btn-group-sm">'+
                        '<button data-toggle="dropdown" class="btn btn-white dropdown-toggle"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;企业分布 <span class="caret"></span></button>'+
                        '<ul class="dropdown-menu">'+
                            '<li><a href="#">一张图功能</a></li>'+
                            '<li><a href="#">热力图</a></li>'+
                    '    </ul>'+
                     '</div>'+
                    '<button class="btn btn-white" type="button"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;测距</button>'+
            '</div>');
        toolboxContainer.append(toolbar);

        var messageBtn= $('<button class="message-btn btn btn-white" type="button"><i class="fa fa-map-marker"></i></button>');
        toolboxContainer.append(messageBtn);

        var userBtn=$('<button class="user-btn btn btn-circle btn-lg btn-white" type="button"><i class="fa fa-map-marker"></i></button>');
        toolboxContainer.append(userBtn);

        var  buildingInfo=
            $('<div class="building-info-box card hidden animated flipInY " >' +
                '<div class="company well well-sm bg-warning">' +
                    '<h4><i class="fa fa-info-circle"></i>&nbsp;&nbsp;企业数</h4>'+
                    '<p class="text-center">1234个</p>'+
                '</div>'+
                '<div class="company-new well well-sm bg-info">' +
                    '<h4><i class="fa fa-info-circle"></i>&nbsp;&nbsp;新入驻企业</h4>'+
                    '<ul class="list-unstyled">' +
                        '<li>XXXXXXXXX公司</li>'+
                        '<li>XXXXXXXXX公司</li>'+
                        '<li>XXXXXXXXX公司</li>'+
                        '<li>XXXXXXXXX公司</li>'+
                        '<li>XXXXXXXXX公司</li>'+
                        '<li>XXXXXXXXX公司</li>'+
                    '</ul>'+
                '</div>'+
            '</div>');

        toolbar.find('#info-tool').click(function () {
            $(this).toggleClass('active');
            buildingInfo.toggleClass('hidden');
        });

        toolbar.find('#grid-tool').click(function () {
            $(this).toggleClass('active');
            if($(this).hasClass("active")){
                addGrid();
            }else{
                removeGrid();
            }
        });

        toolboxContainer.append(buildingInfo);

        map.getContainer().appendChild(toolboxContainer.get(0));
        this._map = map;

        return toolboxContainer.get(0);
    };
}());

