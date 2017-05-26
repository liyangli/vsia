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
        '<th width="100px">内存</th>' +
        '<th>文件名称</th>' +
        '<th width="100px">文件大小</th>' +
        '<th width="100px">操作</th>' +
        '</tr></table><div class="div-con"><table class="table" style="table-layout: fixed;" >' +
        '<tr v-for="sys in list">' +
        '<td width="30px"><input type="checkbox" v-model="sys.flag"></td>' +
        '<td width="100px">{{sys.name}}</td>' +
        '<td width="200px">{{sys.time}}</td>' +
        '<td width="100px">{{sys.status}}</td>' +
        '<td width="100px" v-on:click="showLine(\'cpu\',sys)">{{sys.cpu}}</td>' +
        '<td width="100px" v-on:click="showLine(\'mem\',sys)">{{sys.mem}}</td>' +
        '<td class="filePath" v-bind:title="sys.filePath">{{sys.filePath}}</td>' +
        '<td width="100px">{{sys.fileSize}}</td>' +
        '<td width="100px" class="opear-con">' +
        '<a class="glyphicon glyphicon-play" v-show="sys.status != \'online\'" v-on:click="start(sys)"></a>' +
        '<a class="glyphicon glyphicon-stop" v-show="sys.status == \'online\'" v-on:click="stop(sys.name)"></a>' +
        '<a class="glyphicon glyphicon-edit" v-on:click="edit(sys.name)"></a>' +
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
                agent: new Agent()
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
           doSave: function(obj){
             //对应进行保存操作,直接交给对应代理工具进行处理
               var self = this;
             this.agent.doSave(obj,self);
               
           },
            start: function(sys){
              //if()
                var sysArray = [];
                if(sys)
                if(!sys){
                    //表明直接
                    var list = this.list;
                    var flag = false;
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
                
                //开始真正启动动作
                this.agent.doStart(sysArray);
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
                        layer.close(index);
                    }
                });

            },

            _showLine: function(title,type,name){
                //组装对应data;
                var data = {
                   name: title,
                   data: []//{时间,val}
                };
                var option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            params = params[0];
                            var date = new Date(params.name);
                            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
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
                        name: type,
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: data
                    }]
                };
                var myChart = echarts.init($("#showLine")[0]);
                var max = 1000;//最大1千个点
                var self = this;
                setInterval(function () {
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
                    if(!obj){
                        data.data.push([new Date().getTime(),0]);
                    }else{
                        data.data.push([new Date().getTime(),obj[type]]);
                    }
                    if(data.data.length >= max){
                        //移除相关数据;
                        data.data.shift();
                    }

                    myChart.setOption({
                        series: [{
                            data: data
                        }]
                    });
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
