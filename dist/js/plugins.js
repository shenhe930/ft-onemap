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
    var companyUrl="json/companyInfo.json";//查询楼层信息

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
                roomsHtml += '<div class="room-cube text-center" data-rid="'+rooms[i].r_id+'"><strong>房间号：</strong><br>' + (rooms[i].name!==undefined?rooms[i].name:"") + '</div>';
            }
        }

        var floorHtml ="";
        if(floor){
            floorHtml =
                '<div id="floor-Info" class="card-box" style="height: 200px">' +
                '<img  src="files/' + floor.url + '" onerror="this.src=\'img/wellcm3.png\'">' +
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
    function showCompanyInfoWindow(rid){
        $.getJSON(companyUrl,
            {
                r_id:rid,
                method:"queryCompanyByRoom"
            },
            function(data){
                if(data.length===0){
                    alert("未查询到结果");
                    return;
                }

                function nullToEmpty(str){
                    if(str===null)
                        return"";
                    else
                        return str;
                }
                var companyInfoWindowHtml=
                    '<div class="company-info" >' +
                    '<img class="company-img" src="' +"files/"+ nullToEmpty(data[0].url1) + '" onerror="this.src=\'img/wellcm3.png\'">' +
                        '<div class="company-content">' +
                            '<p class="text-muted"><strong>公司名称：</strong>' + nullToEmpty(data[0].cmp_name) + '</p>' +
                            '<p class="text-muted"><strong>生产经营地：</strong>' + nullToEmpty(data[0].bg_adr) + '</p>' +
                        '</div>'+
                        '<div class="tabs-container">' +
                            '<ul class="nav nav-tabs">' +
                                '<li class="active"><a data-toggle="tab" href="#company-tab1">基本信息</a></li>' +
                                '<li class=""><a data-toggle="tab" href="#company-tab2" >企服信息</a></li>' +
                                '<li class=""><a data-toggle="tab" href="#company-tab3" >党建信息</a></li>' +
                            '</ul>' +
                            '<div class="tab-content">' +
                                '<div id="company-tab1" class="tab-pane active" style="height: 320px">' +
                                    '<p class="text-muted"><strong>是否三证合一：</strong>' + nullToEmpty(data[0].ck_sanz) + '</p>' +
                                    '<p class="text-muted"><strong>社会统一信用代码：</strong>' + nullToEmpty(data[0].uni_code) + '</p>' +
                                    '<p class="text-muted"><strong>注册登记号：</strong>' + nullToEmpty(data[0].zhuce_nums)+ '</p>' +
                                    '<p class="text-muted"><strong>企业名称：</strong>' + nullToEmpty(data[0].cmp_name) + '</p>' +
                                    '<p class="text-muted"><strong>注册资金：</strong>' + nullToEmpty(data[0].zhuce_price) + '</p>' +
                                    '<p class="text-muted"><strong>注册地址：</strong>' + nullToEmpty(data[0].zc_address) + '</p>' +
                                    '<p class="text-muted"><strong>办公地址：</strong>' + nullToEmpty(data[0].bg_adr) + '</p>' +
                                    '<p class="text-muted"><strong>组织结构代码证：</strong>' + nullToEmpty(data[0].zzjg_daima) + '</p>' +
                                    '<p class="text-muted"><strong>税务登记号：</strong>' + nullToEmpty(data[0].swdj_nums) + '</p>' +
                                    '<p class="text-muted"><strong>地税所在区县（所）：</strong>' + nullToEmpty(data[0].dishui_x) + '</p>' +
                                    '<p class="text-muted"><strong>国税所在区县（所）：</strong>' + nullToEmpty(data[0].guishui_x) + '</p>' +
                                    '<p class="text-muted"><strong>统计登记号：</strong>' + nullToEmpty(data[0].tjdj_nums) + '</p>' +
                                    '<p class="text-muted"><strong>主营业务：</strong>' + nullToEmpty(data[0].zhuyingyw) + '</p>' +
                                    '<p class="text-muted"><strong>企业性质：</strong>' + nullToEmpty(data[0].qiyexingzhi) + '</p>' +
                                    '<p class="text-muted"><strong>联系人：</strong>' + nullToEmpty(data[0].lx_people) + '</p>' +
                                    '<p class="text-muted"><strong>电话：</strong>' + nullToEmpty(data[0].phone_num) + '</p>' +
                                    '<p class="text-muted"><strong>法人：</strong>' + nullToEmpty(data[0].faren_man) + '</p>' +
                                    '<p class="text-muted"><strong>注册时期：</strong>' + nullToEmpty(data[0].zhuce_date) + '</p>' +
                                    '<p class="text-muted"><strong>分支机构：</strong>' + nullToEmpty(data[0].fenzhi_jg) + '</p>' +
                                    '<p class="text-muted"><strong>职工总数：</strong>' + nullToEmpty(data[0].zhigong_nums) + '</p>' +
                                    '<p class="text-muted"><strong>其中：非京少数民族：</strong>' + nullToEmpty(data[0].fenjing_sm) + '</p>' +
                                    '<p class="text-muted"><strong>民主党派：</strong>' + nullToEmpty(data[0].mngzhu_nums) + '</p>' +
                                    '<p class="text-muted"><strong>本科以上：</strong>' + nullToEmpty(data[0].benke_nums) + '</p>' +
                                    '<p class="text-muted"><strong>硕士：</strong>' + nullToEmpty(data[0].shuoshi_nums) + '</p>' +
                                    '<p class="text-muted"><strong>博士：</strong>' + nullToEmpty(data[0].boshi_nums) + '</p>' +
                                    '<p class="text-muted"><strong>归国留学人员：</strong>' + nullToEmpty(data[0].haigui_nums) + '</p>' +
                                    '<p class="text-muted"><strong>高级职称：</strong>' + nullToEmpty(data[0].gaoji_nums) + '</p>' +
                                    '<p class="text-muted"><strong>是否中关村高新：</strong>' + nullToEmpty(data[0].sfgx_zgc) + '</p>' +
                                    '<p class="text-muted"><strong>证书号：</strong>' + nullToEmpty(data[0].shunum1) + '</p>' +
                                    '<p class="text-muted"><strong>是否国高新：</strong>' + nullToEmpty(data[0].sfgg_guo) + '</p>' +
                                    '<p class="text-muted"><strong>证书号：</strong>' + nullToEmpty(data[0].shunum2) + '</p>' +
                                    '<p class="text-muted"><strong>备注：</strong>' + nullToEmpty(data[0].remarks) + '</p>' +
                                    '<p class="text-muted"><strong>其他：</strong>' + nullToEmpty(data[0].othermk) + '</p>' +
                                    '<p class="text-muted"><strong>是否同址办公：</strong>' + nullToEmpty(data[0].isbeyond) + '</p>' +
                                '</div>' +
                                '<div id="company-tab2" class="tab-pane" style="height: 320px">' +
                                    '<p class="text-muted"><strong>是否建立院士工作站：</strong>' + nullToEmpty(data[0].isaca) + '</p>' +
                                    '<p class="text-muted"><strong>进站院士：</strong>' + nullToEmpty(data[0].aca_name) + '</p>' +
                                    '<p class="text-muted"><strong>合作项目：</strong>' + nullToEmpty(data[0].aca_project) + '</p>' +
                                '</div>' +
                                '<div id="company-tab3" class="tab-pane" style="height: 320px">' +
                                    '<p class="text-muted"><strong>是否建立党组织：</strong>' +nullToEmpty(data[0].isp) + '</p>' +
                                    '<p class="text-muted"><strong>组建年月：</strong>' + nullToEmpty(data[0].start_date_p) + '</p>' +
                                    '<p class="text-muted"><strong>组织类型：</strong>' + nullToEmpty(data[0].type_p) + '</p>' +
                                    '<p class="text-muted"><strong>隶属关系：</strong>' + nullToEmpty(data[0].sub) + '</p>' +
                                    '<p class="text-muted"><strong>所属上级党组织名称：</strong>' + nullToEmpty(data[0].sub_sub) + '</p>' +
                                    '<p class="text-muted"><strong>类别：</strong>' + nullToEmpty(data[0].category) + '</p>' +
                                    '<p class="text-muted"><strong>是否楼宇企业：</strong>' + nullToEmpty(data[0].isbc) + '</p>' +
                                    '<p class="text-muted"><strong>是否规模以上：</strong>' + nullToEmpty(data[0].isas) + '</p>' +
                                    '<p class="text-muted"><strong>是否建立群团组织：</strong>' + nullToEmpty(data[0].isyoung) + '</p>' +
                                    '<p class="text-muted"><strong>工会建立时间：</strong>' + nullToEmpty(data[0].start_date_lu) + '</p>' +
                                    '<p class="text-muted"><strong>共青团建立时间：</strong>' + nullToEmpty(data[0].start_date_cyl) + '</p>' +
                                    '<p class="text-muted"><strong>妇联建立时间：</strong>' + nullToEmpty(data[0].start_date_wf) + '</p>' +
                                    '<p class="text-muted"><strong>是否配备党建工作指导员：</strong>' + nullToEmpty(data[0].ispc) + '</p>' +
                                    '<p class="text-muted"><strong>党建工作指导员姓名：</strong>' + nullToEmpty(data[0].name_pc) + '</p>' +
                                    '<p class="text-muted"><strong>党建工作指导员联系电话：</strong>' + nullToEmpty(data[0].phone_pc) + '</p>' +
                                    '<p class="text-muted"><strong>员工数：</strong>' + nullToEmpty(data[0].staff) + '</p>' +
                                    '<p class="text-muted"><strong>入党积极分子：</strong>' + nullToEmpty(data[0].active) + '</p>' +
                                    '<p class="text-muted"><strong>党员数：</strong>' + nullToEmpty(data[0].member) + '</p>' +
                                    '<p class="text-muted"><strong>关系在本企业人数：</strong>' + nullToEmpty(data[0].atcompany) + '</p>' +
                                    '<p class="text-muted"><strong>关系在人才职介人数：</strong>' + nullToEmpty(data[0].atmarket) + '</p>' +
                                    '<p class="text-muted"><strong>关系在原单位或街道社区人数：</strong>' + nullToEmpty(data[0].atstreet) + '</p>' +
                                    '<p class="text-muted"><strong>临时组织关系人数：</strong>' + nullToEmpty(data[0].attemp) + '</p>' +
                                    '<p class="text-muted"><strong>其他亮身份的人数：</strong>' + nullToEmpty(data[0].atother) + '</p>' +
                                    '<p class="text-muted"><strong>法定代表人是否为党员：</strong>' + nullToEmpty(data[0].ismember_lr) + '</p>' +
                                    '<p class="text-muted"><strong>党组织书记姓名：</strong>' + nullToEmpty(data[0].name_pbs) + '</p>' +
                                    '<p class="text-muted"><strong>党组织数据在企业中的身份：</strong>' + nullToEmpty(data[0].identity_pbs) + '</p>' +
                                    '<p class="text-muted"><strong>企业当组织书记联系电话：</strong>' + nullToEmpty(data[0].phone_pbs) + '</p>' +
                                    '<p class="text-muted"><strong>企业党组织工作和活动经费保障情况：</strong>' + nullToEmpty(data[0].finance) + '</p>' +
                                    '<p class="text-muted"><strong>企业党组织办公和活动场所保障情况：</strong>' + nullToEmpty(data[0].place) + '</p>' +
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
                    '<img src="files/' + data.building.url1 + '" onerror="this.src=\'img/wellcm3.png\'">' +
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
                                    showCompanyInfoWindow($(this).data('rid'));
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
        var list1=self.searchResultCard.find(".list-group");
        list1.empty();

        var list2=self.gridSearchResultCard.find(".list-group");
        list2.empty();

        $.each(searchResultPoint,function(i){
            self._map.removeOverlay(searchResultPoint[i]);
        });
        searchResultPoint=[];

        self.searchResultCard.addClass("hidden");
        self.gridSearchResultCard.addClass("hidden");
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

    LeftPanelControl.prototype.showGridSearchResult=function(result){
        var map=self._map;
        hideAllCard();
        self.gridSearchResultCard.removeClass("hidden");

        var gridImg=self.gridSearchResultCard.find("#gridImg");
        gridImg.attr("src","files/"+result.grid.imgurl);

        var list=self.gridSearchResultCard.find(".list-group");
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
                self.gridSearchResultCard.addClass("hidden");

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

    function gridSearchResultCardDom(me,container){
        var gridSearchResultCard=me.gridSearchResultCard=
            $('<div class="card hidden animated fadeInUp">' +
                '<button class="closeBtn btn btn-link glyphicon glyphicon-remove"></button>'+
                '<div class="card-content">' +
                    '<img id="gridImg" onerror="this.src=\'img/wellcm3.png\'">'+
                    '<ul class="list-group">' +
                    '</ul>'+
                '</div>' +
                '</div>');

        gridSearchResultCard.find(".closeBtn").click(function () {
            gridSearchResultCard.addClass("hidden");
            me.clearSearchResult();
        });

        container.append(gridSearchResultCard);
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

        gridSearchResultCardDom(this,cardList);

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
    var GPS = {
        PI : 3.14159265358979324,
        x_pi : 3.14159265358979324 * 3000.0 / 180.0,
        delta : function (lat, lon) {
            // Krasovsky 1940
            //
            // a = 6378245.0, 1/f = 298.3
            // b = a * (1 - f)
            // ee = (a^2 - b^2) / a^2;
            var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
            var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
            var dLat = this.transformLat(lon - 105.0, lat - 35.0);
            var dLon = this.transformLon(lon - 105.0, lat - 35.0);
            var radLat = lat / 180.0 * this.PI;
            var magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
            dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
            return {'lat': dLat, 'lon': dLon};
        },

        //WGS-84 to GCJ-02
        gcj_encrypt : function (wgsLat, wgsLon) {
            if (this.outOfChina(wgsLat, wgsLon))
                return {'lat': wgsLat, 'lon': wgsLon};

            var d = this.delta(wgsLat, wgsLon);
            return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
        },
        //GCJ-02 to WGS-84
        gcj_decrypt : function (gcjLat, gcjLon) {
            if (this.outOfChina(gcjLat, gcjLon))
                return {'lat': gcjLat, 'lon': gcjLon};

            var d = this.delta(gcjLat, gcjLon);
            return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
        },
        //GCJ-02 to WGS-84 exactly
        gcj_decrypt_exact : function (gcjLat, gcjLon) {
            var initDelta = 0.01;
            var threshold = 0.000000001;
            var dLat = initDelta, dLon = initDelta;
            var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
            var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
            var wgsLat, wgsLon, i = 0;
            while (1) {
                wgsLat = (mLat + pLat) / 2;
                wgsLon = (mLon + pLon) / 2;
                var tmp = this.gcj_encrypt(wgsLat, wgsLon);
                dLat = tmp.lat - gcjLat;
                dLon = tmp.lon - gcjLon;
                if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                    break;

                if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
                if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

                if (++i > 10000) break;
            }
            //console.log(i);
            return {'lat': wgsLat, 'lon': wgsLon};
        },
        //GCJ-02 to BD-09
        bd_encrypt : function (gcjLat, gcjLon) {
            var x = gcjLon, y = gcjLat;
            var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
            var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
            var bdLon = z * Math.cos(theta) + 0.0065;
            var bdLat = z * Math.sin(theta) + 0.006;
            return {'lat' : bdLat,'lon' : bdLon};
        },
        //BD-09 to GCJ-02
        bd_decrypt : function (bdLat, bdLon) {
            var x = bdLon - 0.0065, y = bdLat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
            var gcjLon = z * Math.cos(theta);
            var gcjLat = z * Math.sin(theta);
            return {'lat' : gcjLat, 'lon' : gcjLon};
        },
        //WGS-84 to Web mercator
        //mercatorLat -> y mercatorLon -> x
        mercator_encrypt : function(wgsLat, wgsLon) {
            var x = wgsLon * 20037508.34 / 180.00;
            var y = Math.log(Math.tan((90.00 + wgsLat) * this.PI / 360.00)) / (this.PI / 180.00);
            y = y * 20037508.34 / 180.00;
            return {'lat' : y, 'lon' : x};
            /*
             if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
             return null;
             var x = 6378137.0 * wgsLon * 0.017453292519943295;
             var a = wgsLat * 0.017453292519943295;
             var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
             return {'lat' : y, 'lon' : x};
             //*/
        },
        // Web mercator to WGS-84
        // mercatorLat -> y mercatorLon -> x
        mercator_decrypt : function(mercatorLat, mercatorLon) {
            var x = mercatorLon / 20037508.34 * 180.00;
            var y = mercatorLat / 20037508.34 * 180.00;
            y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.00)) - this.PI / 2);
            return {'lat' : y, 'lon' : x};
            /*
             if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
             return null;
             if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
             return null;
             var a = mercatorLon / 6378137.0 * 57.295779513082323;
             var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
             var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
             return {'lat' : y, 'lon' : x};
             //*/
        },
        // two point's distance
        distance : function (latA, lonA, latB, lonB) {
            var earthR = 6371000.00;
            var x = Math.cos(latA * this.PI / 180.00) * Math.cos(latB * this.PI / 180.00) * Math.cos((lonA - lonB) * this.PI / 180);
            var y = Math.sin(latA * this.PI / 180.00) * Math.sin(latB * this.PI / 180.00);
            var s = x + y;
            if (s > 1) s = 1;
            if (s < -1) s = -1;
            var alpha = Math.acos(s);
            var distance = alpha * earthR;
            return distance;
        },
        outOfChina : function (lat, lon) {
            if (lon < 72.004 || lon > 137.8347)
                return true;
            if (lat < 0.8293 || lat > 55.8271)
                return true;
            return false;
        },
        transformLat : function (x, y) {
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
            return ret;
        },
        transformLon : function (x, y) {
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
            return ret;
        }
    };

    var ToolBoxControl = BMapLib.ToolBoxControl = function () {
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
    };

    // 继承Control
    ToolBoxControl.prototype = new BMap.Control();

    var self;
    var grids=[];//网格
    var zrGrids=[];//责任网格
    var currentGrid;//当前选中网格
    var gridUrl="json/buildingByGrid.json";

    /***
     * 网格点击事件
     * @param e
     */
    function gridClickHandler(e){
        if(currentGrid&&currentGrid!==e.target){
            // self._map.removeOverlay(currentGrid);
            // currentGrid.setFillOpacity(0);
            // currentGrid.setFillColor("");
            // currentGrid.addEventListener("click",gridClickHandler);
            // self._map.addOverlay(currentGrid);
        }
        // e.target.setFillColor("blue");
        // e.target.setFillOpacity(0.4);
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
    }
    /**
     * 添加网格到地图
     */
    function addGrid(grid,isZR){
        var view=[];
        for (var i = 0; i < grid.features.length; i++) {
            var rings=grid.features[i].geometry.rings;
            for (var j = 0; j < rings.length; j++) {
                var points=[];
                for (var k = 0; k < rings[j].length; k++) {
                    var bdPoint=GPS.bd_encrypt(rings[j][k][1],rings[j][k][0]);
                    points.push(new BMap.Point(bdPoint.lon,bdPoint.lat));
                    view.push(new BMap.Point(bdPoint.lon,bdPoint.lat));
                }

                var strokeColor=isZR?"#673ab7":"#5677fc";
                var polygon = new BMap.Polygon(points, {strokeColor:strokeColor, strokeWeight:2, strokeOpacity:1,fillOpacity:0.1});  //创建多边形
                self._map.addOverlay(polygon);

                grids.push(polygon);
                if(isZR){
                    zrGrids.push(polygon);
                    polygon.gid=grid.features[i].attributes.gid;
                    polygon.addEventListener("click",gridClickHandler);
                }

            }


        }
        // self._map.setViewport(view);
        // console.log(view);
        // console.log(grids);

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
                '<button class="btn btn-white" id="info-tool" type="button"><i class="fa fa-map-marker"></i>&nbsp;&nbsp;迁徙图</button>' +
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
                $.when(
                    $.ajax("json/grid.json"),
                    $.ajax("json/ZRGrid.json")
                ).then(function(grid,ZRGrid){
                    if(grid[1]==="success")
                        addGrid(grid[0]);
                    if(ZRGrid[1]==="success")
                        addGrid(ZRGrid[0],true);
                });
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

