/**
 *
 * 代理类。主要为了方便进行对应切换到不同方式进行展示处理
 * auth: liyangli
 * date: 17/5/19 下午5:12 .
 */
"use strict";

const EventEmmit = require('events');
const God = require('./back/god.js');
var Agent = function(){
    //对应执行的方式;


    this.ev = new EventEmmit();
    this.god = new  God(this.ev);
    /*try {

    } catch (e) {
        //表明不存在。进行通过异步方式进行获取相关数据;主要可以针对http方式继续处理;
        throw e;
    }*/

};
Agent.prototype = {


    /**
     * 首次加载时直接通过文件读取展示
     * @param vm
     */
    firstShowSys: function(vm){

       this.god.firstLoadFile();
       const self = this;
        let attr = "firstLoadFileFinish";
       this.ev.on(attr,(result)=>{
           self.ev.removeAllListeners(attr);
           vm.list = result;
       });
    },
    /**
     * 查询所有的设定好的数据
     * @param vm vue对应组件对象
     */
    findList: function(vm){
        this.god.findList();
        const self = this;
        this.ev.on("findListFinish",function(err,result){
            self.ev.removeAllListeners("findListFinish");
            if(err){
                console.error(err);
                return;
            }

            //需要进行遍历其中的数据。进行动态设定上去。主要是防止设定选中状态而被取消掉了。。
            var list = vm.list;

            for(var k in list){
                var oldObj = list[k];
                var flag = false;
                for(var i in result){
                    var newObj = result[i];
                    if(oldObj.name == newObj.name){
                        oldObj.status = newObj.status;
                        oldObj.cpu = newObj.cpu;
                        oldObj.mem = newObj.mem;
                        flag = true;
                        break;
                    }
                }

                if(!flag){
                    //表明给移除掉了;
                    oldObj.status = "尚未监测";
                    oldObj.cpu = "";
                    oldObj.mem = "";
                }
            }


            if(!list || list.length == 0){
                vm.list = result;
            }else{
                vm.list = JSON.parse(JSON.stringify(vm.list));
            }
        });
    },
    /**
     * 添加或者修改对应数据
     * @param vm
     */
    addOrModify: function(vm){
        
    },

    /**
     * 日期开启对应统计动作
     */
    logStatis: function(){
        this.god.logStatis();
    },
    /**
     * 开启对应保存动作。
     * 操作步骤为:
     * 1、进行对应文件操作
     * 2、直接调用god类进行操作
     * 
     * 返回promise对象
     * @param obj
     */
    doSave: function(obj,vm){
        this.god.doSave(obj);
        var self = this;
        this.ev.on("doSaveFinish",function(err,result){
            self.ev.removeAllListeners("doSaveFinish");
            if(!err){
                //表明能够正常保存了。需要进行同步进行处理了
                self.findList(vm);
                alert("保存成功!");
            }else{
                throw err;
            }
        });
    },

    /**
     * 进行启动对应项目
     * @param sysArray
     */
    doStart(sysArray){
        this.god.doStart(sysArray);
        var self = this;
        this.ev.on('doStartFinish',function(err,result){
            self.ev.removeAllListeners("doStartFinish");
           if(err){
              alert("启动失败,对应错误信息为:"+err.toString());
               return;
           }

            alert("启动成功");

        });

    },

    /**
     * 进行根据名称进行停止具体进程
     * @param nameArray name数组
     */
    doStop(nameArray){
        this.god.doStop(nameArray);
        var self = this;
        this.ev.on("doStopFinish",function(err,result){
            self.ev.removeAllListeners("doStopFinish");
           if(err){
               alert("停止失败,对应错误信息为:"+err.toString());
               return;
           } 
            alert("停止成功");
        });
    },
    /**
     * 验证名称是否存在;主要进行验证对应缓存中是否存在相关数据
     * @param name 进程名称
     * @returns {boolean} true 已经存在;false 不存在
     */
    validateHaveName: function(name){
        var sysCache = this.god.sysCache;
        var flag = false;
        for(var i in sysCache){
            var cache = sysCache[i];
            if(cache.name == name){
                flag = true;
                break;
            }
        }
        return flag;
    },
    /**
     * 删除对应缓存数据
     * @param name
     */
    delCache: function(name){
        const self =this;
        this.god.delCache(name);
        this.ev.on("delCacheFinish",(err,result)=>{
            self.ev.removeAllListeners("delCacheFinish");
           if(err){
               alert(err);
               return;
           }else{
               alert("删除成功");
           }

    })
    }
};

