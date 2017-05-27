/**
 *
 * 前端vux处理类
 * auth: liyangli
 * date: 17/5/19 下午1:43 .
 */

(function(layer){
    "use strict";


    var FileList = {
        template: '<div style="height:100%;">' +
        '<div class="panel panel-primary" style="height:100%;margin-bottom: 0px;">' +
        '<div class="panel-heading">' +
        '<div class="caption">程序集中管理</div>' +
        '<div class="tools">' +
        '<a class="glyphicon  glyphicon-play" v-on:click="start()"></a>' +
        '<a class="glyphicon glyphicon-stop" v-on:click="stop()"></a>' +
        '<a class="glyphicon glyphicon-plus" v-on:click="add()"></a>' +
        '<a class="glyphicon glyphicon-minus" v-on:click="del()"></a>' +
        '</div>' +
        '</div>' +
        '<div class="panel-body index-panel" id="content">' +
        '<table class="table table-bordered table-striped table-responsive" style="table-layout: fixed;">' +
        '<tr >' +
        '<th width="30px"><input type="checkbox" v-model="allBoxFlag" v-on:click="checkAll()"></th>' +
        '<th width="100px">名称</th>' +
        '<th width="200px">创建时间</th>' +
        '<th width="100px">状态</th>' +
        '<th width="100px">CPU</th>' +
        '<th width="100px">内存(Mbps)</th>' +
        '<th width="100px">BUG</th>' +
        '<th>文件名称</th>' +
        '<th width="100px">文件大小(Kbps)</th>' +
        '<th width="100px">操作</th>' +
        '</tr></table><div class="div-con"><table class="table" style="table-layout: fixed;" >' +
        '<tr v-for="sys in list">' +
        '<td width="30px"><input type="checkbox" v-model="sys.flag"></td>' +
        '<td width="100px">{{sys.name}}</td>' +
        '<td width="200px">{{sys.time}}</td>' +
        '<td width="100px">{{sys.status}}</td>' +
        '<td width="100px" v-on:click="showLine(\'cpu\',sys)">{{sys.cpu}}</td>' +
        '<td width="100px" v-on:click="showLine(\'mem\',sys)">{{memRedux(sys.mem)}}</td>' +
        '<td width="100px" >{{sys.bugNum}}</td>' +
        '<td class="filePath" v-bind:title="sys.filePath">{{sys.filePath}}</td>' +
        '<td width="100px">{{sys.fileSize}}</td>' +
        '<td width="100px" class="opear-con">' +
        '<a class="glyphicon glyphicon-play" v-show="sys.status != \'online\'" v-on:click="start(sys)"></a>' +
        '<a class="glyphicon glyphicon-stop" v-show="sys.status == \'online\'" v-on:click="stop(sys.name)"></a>' +
        // '<a class="glyphicon glyphicon-edit" v-on:click="edit(sys.name)"></a>' +
        '<a class="glyphicon glyphicon-minus" v-on:click="del(sys.name)"></a>' +
        '</td>' +
        '</tr>' +
        '</table></div>' +
        '</div> ' +
        '<div class="panel-footer text-center">BH-V0.0.1</div>' +
        '</div> ' +
        '</div>',
        data: function(){
            return {
                list: [],
                allBoxFlag: false,
                agent: new Agent(),
                lineHanlder: null
            }
        },
        created: function(){
            //一开始加载就需要从后台后去所有的数据
            var self = this;
            //首先根据对应缓存数据进行设置到页面list上进行展示
            this.agent.firstShowSys(self);
            setInterval(function(){
                self.agent.findList(self);
            },1000);
            //开始进行开启对应统计日志数据。需要进行记录对应数据;包含对应当前的读取日志文件、开始位置、结束位置;
            this.agent.logStatis();
        },
        methods: {
           add: function(){
               var self = this;
               //弹出对应也添加页面。需要进行选择具体的文件
               layer.open({
                   type: 1,
                   shade: false,
                   title: "新增",
                   content: $('#sysAdd'), //捕获的元素
                   cancel: function (index) {
                       $('#sysAdd').hide();
                       layer.close(index);
                   },
                   area: ["80%", "80%"],
                   btn: ["确定", "取消"],
                   yes: function (index, layero) {
                       //表明对应点击的确定按钮
                       //增加对应名称的验证
                       var name = $("#name").val();
                       var filePath = $("#filePath").val();

                       if(!name){
                           alert("名称不能为空");
                           $("#name").focus();
                           return;
                       }if(!filePath){
                           alert("路径必须存在");
                           $("#filePath").focus();
                           return;
                       }
                       //开始验证name是否已经存在了。如果已经存在不允许进行添加
                       if(self._validateName(name)){
                           alert("名称已经存在,请修改为其他的名字");
                           $("#name").focus();
                           return;
                       }
                       //需要验证具体文件是否存在;如果不存在。需要提示指定文件路径不存在文件;
                       self.doSave({name: name,filePath: filePath});
                       $('#sysAdd').hide();
                       layer.close(index);
                       //layero.close();
                   }
               });
               
               
               
           },

            /**
             * 验证对应名称是否存在;如果存在返回true;不存在返回false
             * @param name
             * @private
             */
            _validateName: function(name){
                return this.agent.validateHaveName(name);
            },
            /**
             * 内存转换方法
             *
             * @param mem 内存
             */
            memRedux: function(mem){
                if(!mem){
                    return "";
                }
               return (mem/1000/1000).toFixed(2);
            },
           doSave: function(obj){
             //对应进行保存操作,直接交给对应代理工具进行处理
               var self = this;
             this.agent.doSave(obj,self);
               
           },
            start: function(sys){
              //if()
                var sysArray = [];
                if(!sys){
                    //表明直接
                    var list = this.list;
                    for(var i in list){
                        var playObj = list[i];
                        if(playObj.flag){
                            //表明Wie选中状态
                            sysArray.push(playObj);
                        }
                    }
                }else{
                    sysArray.push(sys);
                }
                
                //表明对应处理完成了;需要进行开启动作
                if(sysArray.length == 0){
                    alert("没有选择对应项目,请先选择对应项目进行点击启动");
                    return;
                }

                if(confirm("确定进行开启项目?")){
                    //开始真正启动动作
                    this.agent.doStart(sysArray);
                }
            },
            stop: function(name){
                //停止执行相关进程,主要根据对应进程名称进行停止
                var nameArray = [];
                if(!name){
                    var list = this.list;
                    for(var i in list){
                        var playObj = list[i];
                        if(playObj.flag){
                            //表明Wie选中状态
                            nameArray.push(playObj.name);
                        }
                    } 
                }else{
                    nameArray.push(name);
                }
                
                if(nameArray.length == 0){
                    alert("没有选择对应项目,请先选择对应项目进行点击停止;");
                    return;
                }
                if(confirm("确定进行停止项目?")){
                    //开始真正进行停止动作
                    this.agent.doStop(nameArray);
                }
            },
            showLine: function(type,sys){
              //定时获取对应sys中相对应数据进行设定到页面上即可;
                var title = "";
                if(type == 'mem'){
                    title = "内存";
                }else if(type == 'cpu'){
                    title = "CPU";
                }
                var self = this;
                layer.open({
                    type: 1,
                    shade: false,
                    title: title + "趋势图",
                    content: $('#showLine'), //捕获的元素
                    cancel: function (index) {
                        $('#showLine').hide();
                        if(self.lineHanlder){
                            clearInterval(self.lineHanlder);
                        }
                        layer.close(index);
                    },
                    success: function(){
                        //成功加载后进行加载显示的额内容数据
                        self._showLine(title,type,sys.name);
                    },
                    area: ["80%", "80%"],
                    btn: ["关闭", "取消"],
                    yes: function (index, layero) {
                        $('#showLine').hide();
                        if(self.lineHanlder){
                            clearInterval(self.lineHanlder);
                        }
                        layer.close(index);
                    }
                });

            },

            _showLine: function(title,type,name){
                if(this.lineHanlder){
                    clearInterval(this.lineHanlder);
                }
                var option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            console.info(params);
                            params = params[0];
                            var unit = (type=='mem'?'Mbps':"");
                            return ""+params.axisValueLabel+' :</br>' + params.value[1] + unit;
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: title,
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: []
                    }]
                };
                var myChart = echarts.init($("#showLine")[0]);
                var max = 1000;//最大1千个点
                var self = this;
                self.lineHanlder = setInterval(function () {
                    //动态进行添加相关数据。追加到data中。需要针对data数据最大容量进行设定

                    var list = self.list;
                    var obj ;
                    for(var i in list){
                        var sysObj = list[i];
                        if(sysObj.name == name){
                            obj = sysObj;
                            break;
                        }
                    }
                    var seriesData = option.series[0].data;
                    if(!obj){
                        seriesData.push([new Date(),0]);
                    }else{
                        if(type== "mem"){
                            seriesData.push([new Date(),self.memRedux(obj[type])]);
                        }else{
                            seriesData.push([new Date(),obj[type]]);
                        }
                    }
                    if(seriesData.length >= max){
                        //移除相关数据;
                        seriesData.shift();
                    }

                    myChart.setOption(option);
                }, 1000);
            },

            /**
             * 删除主要分为3部分
             * 步骤:
             * 1、删除页面上展示即缓存中数据
             * 2、根据缓存数据进行同步数据文件;
             * 3、pm2管理中进行移除掉
             * @param name
             */
           del: function(name){
                if(!name){
                    var list = this.list;
                    for(var i in list){
                        var obj = list[i];
                        if(obj.flag){
                            //表明进行删除的数据;
                            //TODO 此处暂时只支持一个选择进行删除动作
                            name = obj.name;
                        }
                    }
                }

                if(!name){
                    alert("尚未选择对一个项目,请选择一个或者多个项目进行删除");
                    return;
                }
                if(window.confirm("确定要移除该程序?")){
                    //表明开始开启删除动作
                    for(var i in this.list){
                        var sysObj = this.list[i];
                        if(sysObj.name == name){
                            this.list.splice(i, 1);
                            break;
                        }
                    }
                    //删除缓存中对应数据。以及同步数据库文件
                    this.agent.delCache(name);
                    

                }

           },
            checkAll: function(){
                var allBoxFlag = this.allBoxFlag;
                for(var i in this.list){
                    var sys = this.list[i];
                    sys.flag = allBoxFlag;
                }
            }
        }
    };

    var app = new Vue({
        el: '#app',
        data: {

        },
        components: {
            'file-list': FileList
        }
    });
    
})(layer);
