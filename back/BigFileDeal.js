/**
 *
 * 验证对应大文件的读取。如果指定大小下文件非常小情况怎么处理?
 *
 * auth: liyangli
 * date: 17/5/27 上午10:22 .
 */
"use strict";

const fs = require('fs');

class BigFileDeal{

    /**
     * 开始进行读取相关文件;
     */
    read(){
        
       const stream = fs.createReadStream("/Users/liyangli/opt/demo.js",{
           start: 0 ,end:1000
       });
        stream.on('readable',()=>{

            const array = [];
            let chunk;
            while(null !== (chunk = stream.read())){
                //把相关数据进行组装放到数组中;进行查看和对应文件中是否正常
                array.push(chunk);
            }
            const content = chunk.join().toString();
            content.match(/Error:/);
        });
    }

}


// module.exports=BigFileDeal;
var bigFileDeal = new BigFileDeal();
bigFileDeal.read();