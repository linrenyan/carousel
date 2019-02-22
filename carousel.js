// 实现3D轮播功能

(function($){
    var nowIndex = 0;   //当前显示的图标下标
    var flag = true;    //加锁控制动画没完不能点击
    var timer;  //定时器
    // 入口函数
    function init(dom,args){
        var oImg = dom.find("img");
        var btn = dom.find(".btn");
        var len = oImg.length;
        if(args.curDisplay < len && args.curDisplay >= 0){
            show(dom,args,oImg,len);
            bindEvent(dom,args,oImg,len,btn);
            timer = setInterval(function () {
                play(dom,args,oImg,len);
            }, 3000)
        }else{
            console.log("请输入正确的curDisplay值")
        }
    };
    // 展示图片
    function show(dom,args,oImg,len) {
        var midLen = Math.floor(len / 2);
        var lNum, rNum;
        for (var i = 0; i < midLen; i++) {
            lNum = args.curDisplay - i - 1;
            if(args.controlRotate){
                oImg.eq(lNum).css({
                    'transform': 'translateX(' + (-150 * (i + 1)) + 'px) translateZ(' + (200 - i * 100) + 'px) rotateY(30deg)',
                    "z-index":5
                })
                
                rNum = args.curDisplay + i + 1;
                if (rNum > len - 1) {
                    rNum -= len;
                }
                oImg.eq(rNum).css({
                    'transform': 'translateX(' + (150 * (i + 1)) + 'px) translateZ(' + (200 - i * 100) + 'px) rotateY(-30deg)',
                    "z-index":5
                })
                // z-index 兼容IE显示优先级问题
                if(i == 1 ){
                    oImg.eq(lNum).css({
                        "z-index":1
                    })
                    oImg.eq(rNum).css({
                        "z-index":1
                    })
                }
                
            }else{
                oImg.eq(lNum).css({
                    transform: 'translateX(' + (-150 * (i + 1)) + 'px) translateZ(' + (200 - i * 100) + 'px)',
                    "z-index":5
                })
                rNum = args.curDisplay + i + 1;
                if (rNum > len - 1) {
                    rNum -= len;
                }
                oImg.eq(rNum).css({
                    transform: 'translateX(' + (150 * (i + 1)) + 'px) translateZ(' + (200 - i * 100) + 'px)',
                    "z-index":5
                })
                // z-index 兼容IE显示优先级问题
                if(i == 1 ){
                    oImg.eq(lNum).css({
                        "z-index":1
                    })
                    oImg.eq(rNum).css({
                        "z-index":1
                    })
                }
            }
            
        }
        oImg.eq(args.curDisplay).css({
            'transform': 'translateZ(300px)',
            "z-index":9
        })
        dom.on('transitionend', function () {
            flag = true;
        })
    }
    // 点击事件
    function bindEvent(dom,args,oImg,len,btn) {
        oImg.on('click', function () {
            if (flag) {
                if( $(this).index() == args.curDisplay){
                    // 判断当点击中间显示不触发
                    return;
                }else{
                    flag = false;
                    nowIndex = $(this).index();
                    // 控制运动
                    moving(nowIndex,dom,args,oImg,len);
                }
                
            }
        }).hover(function () {
            clearInterval(timer);
        }, function () {
            timer = setInterval(function () {
                play(dom,args,oImg,len);
            }, 3000)
        });
        btn.on('click', function () {
            if (flag) {
                flag = false;
                var dir = $(this).attr('id');
                if (dir == 'left') {
                    nowIndex = args.curDisplay - 1;
                } else {
                    nowIndex = args.curDisplay + 1;
                }
                moving(nowIndex,dom,args,oImg,len);
            }

        }).hover(function () {
            clearInterval(timer);
        }, function () {
            timer = setInterval(function () {
                play(dom,args,oImg,len);
            }, 3000)
        });
    }
    // 移动
    function moving(index,dom,args,oImg,len) {
        index = index < 0 ? len - 1 : index;
        index = index > len - 1 ? 0 : index;
        args.curDisplay = index;
        nowIndex = index;
        show(dom,args,oImg,len);
    }
    //自动轮播
    function play(dom,args,oImg,len) {
        if(args.auto){
            if (nowIndex == len - 1) {
                nowIndex = 0;
            } else {
                nowIndex++;
            }
            moving(nowIndex,dom,args,oImg,len);
        }
    }
    //  扩展组件
    $.fn.extend({
        carousel:function(options){
            // 设置默认的配置，如果options没传值，则使用下面的配置
            var args = $.extend({
                curDisplay: 0, // 设置第几张图片为第一张
                auto: true, //是否自动轮播
                controlRotate: true,    //是否旋转显示
                backFn: function () {}
            },options);
            init(this,args);
        }
    })
})(jQuery)