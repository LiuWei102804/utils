(function () {
    "use strict"
    // Reflect.defineProperty( String.prototype , "link" , {
    //     value( link = "" ) {
    //         return `<a href='${link}' target='_blank'>${ this }</a>`;
    //     }
    // });

    window.isPhone = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) !== null;



    //数组去重 深度去重(对象值相同去除) 参数bol 为true深度去重
    Array.prototype.purify = Array.prototype.purify || function ( bol ) {
        var o = Object.create( null );
        this.forEach(function (v , k) {
            var type = Object.prototype.toString.call( v );
            if( bol ) {
                if( type === "[object Object]" ) {
                    o[JSON.stringify( v )] = v;
                } else {
                    if( !o[v] ) {
                        o[v] = v;
                    }
                }
            } else {
                if( type === "[object Object]" ) {
                    o[v + "" + k] = v;
                } else {
                    if( !o[v] ) {
                        o[v] = v;
                    }
                }
            }
        });
        return o.toArray();
    };
    //Array转Object
    Object.defineProperty( Array.prototype , "toObject" , {
        value : function () {
            var item = new Object();
            this.forEach(function ( v , k ) {
                item[k] = v;
            });
            return item;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //数据交叉组合 Array.across([1,2],["a","b"]) => 1_a,1_b,2_a,2_b
    Array.across = Array.across || function () {
        var heads = arguments[0];
        for( var i = 1, len = arguments.length; i < len; i++ ){
            if( arguments[i].length ){
                var result = [];
                for( var j = 0, len2 = heads.length; j < len2; j ++ ) {
                    for( var k = 0, len3 = arguments[i].length; k < len3; k ++ ) {
                        result.push( heads[j] + "_" + arguments[i][k] );
                    }
                }
                heads = result;
            }
        };
        return heads;
    };
    //Object转Array
    //参数类型 string  1:key 以key为值转数组 2:val  以val为值转数组 默认2
    Object.defineProperty( Object.prototype ,"toArray",{
        value : function ( t ) {
            var itemArr = [];
            for( var a in this ) {
                itemArr.push( t == "key" ? a : this[a] );
            }
            return itemArr;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //连接属性值 常用于url a=10&b=20  参数t 为连接符 默认&
    Object.defineProperty( Object.prototype ,"connect",{
        value : function ( t ) {
            var str = "";
            for( var o in this ) {
                str += o +"=" + this[o] + "" + ( t || "&" );
            }
            return str.substring( 0 , str.length - 1 );
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });

    //返回对象是否为空 自身没有任何属性
    Object.defineProperty( Object.prototype ,"isEmpty",{
        value : function () {
            return Object.keys( this ).length == 0;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //返回是否对象
    Object.isObject = Object.isObject || function ( obj ) {
        return obj instanceof this;
    };
    //支持es6的浏览器直接调用es6的方法  否则重写  返回对象属性名集合
    Object.keys = Object.keys || function ( obj ) {
        return Object.getOwnPropertyNames( obj );
    };

    //支持es6的浏览器直接调用es6的方法  否则重写  返回合并后的对象
    Object.assgin = Object.assgin || function () {
        var origin = arguments[0];
        for( var i = 1, len = arguments.length; i < len; i ++ ) {
            if( Object.isObject( arguments[i] ) && !Object.isEmpty( arguments[i] ) ) {
                for( var o in arguments[i] ) {
                    origin[o] = arguments[i][o];
                }
            }
        }
        return origin;
    };
    //深度复制
    Object.copy = Object.copy || function ( obj ) {
        if( !Object.isObject( obj ) ) return null;
        return JSON.parse( JSON.stringify( obj ) );
    };
    //内置对象拓展 DATE
    Date.prototype.format = Date.prototype.format || function ( fmt ) {
        var o = {
            "M+": this.getMonth() + 1,                      //month
            "d+": this.getDate(),                           //day
            "h+": this.getHours(),                          //hour
            "m+": this.getMinutes(),                        //minute
            "s+": this.getSeconds(),                        //second
            "q+": Math.floor((this.getMonth() + 3) / 3),   //quarter
            "S": this.getMilliseconds()                     //millisecond
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for ( var k in o )
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length ) );
        return fmt;
    };
    //返回limit天后的一个时间戳 fmt 格式化时间
    Date.prototype.limitDate = Date.prototype.limitDate || function ( limit , fmt ) {
        var now = this.getTime(),
            after = now + limit * 86400000;

        return fmt ? new Date( after ).format( fmt ) : after;
    };
    //返回从start天到limit天之间的时间戳 bol 返回计算差值对象
    Date.diffValue = Date.diffValue || function ( start , limit , bol ) {
        var _start = Date.parse( start ) || new Date().getTime();
        var _limit = Date.parse( limit ) || new Date().getTime() + 30 * 86400000;
        var diff = _limit - _start;

        return bol ? Date.getFutureDate( diff ) : diff;
    };
    //静态方法
    //返回具体时间
    Date.getFutureDate = Date.getFutureDate || function ( ms ) {
        var day = Math.floor( ms / 1000 / (60 * 60 * 24)),
            hour = Math.floor(ms / 1000 / (60 * 60)) - (day * 24),
            minute = Math.floor(ms / 1000 / 60) - (day * 24 * 60) - (hour * 60) ,
            second = Math.floor(ms / 1000) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

        return { day : day , hour : hour , minute : minute , second : second }
    };
    //转换成银行卡号 参数t为连接符号 默认空格
    Object.defineProperty( String.prototype , "tsToBankNumber" ,{
        value : function ( t ) {
            return this.transform( 4 , t );
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //转换成金额数字 参数t为连接符号 默认 , 如76,789,900
    Object.defineProperty( String.prototype , "tsToMoney" ,{
        value : function ( t ) {
            return this.transform( 3 , ( t || "," ) );
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //转换数字
    /*
        参数 end 截取字符最多出现次数
            t为连接符
            循环匹配
            默认换成银行卡号 8888 8888 8888 8888
     */
    Object.defineProperty( String.prototype , "transform" ,{
        value : function ( end , t ) {
            var idx = this.length % ( end || 4 );
            var reg = new RegExp(".{1,"+ ( end || 4 ) +"}","g");
            var str = "";
            this.substring( idx , this.length ).replace( reg , function ( $1 ) {
                str += $1 + ( t || " " );
            });
            return idx == 0 ? str.substring(0,str.length - ( t ? t.length : 1 )) : this.substring(0,idx) + ( t || " " ) + str.substring(0,str.length - ( t ? t.length : 1 ));
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //字符窜倒序
    Object.defineProperty( String.prototype , "reverse" ,{
        value : function () {
            return this.split("").reverse().join("");
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    // 解析Object.connect拼接的字符窜 参数t为解析的连接符 默认&
    Object.defineProperty( String.prototype , "release" ,{
        value : function ( t ) {
            var item = new Object();
            this.split( ( t || "&" ) ).forEach(function ( v , k ) {
                var key = v.split("=")[0];
                var val = v.split("=")[1];
                item[key] = val;
            });
            return item;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //字符窜函数转函数
    Object.defineProperty( String.prototype , "toFunction" ,{
        value : function () {
            var isES6Fn = this.indexOf("=>") > -1;
            var start,end,args;
            if( isES6Fn ) {                                     //箭头函数
                if( this.indexOf("(") > -1 ) {
                    args = this.substring( this.indexOf("(") + 1  , this.indexOf(")"));
                } else {
                    args = this.substring( 0  , this.indexOf("=>"));
                }
                start = this.indexOf("{") > -1 ? this.indexOf("{") + 1 : this.indexOf("=>") + 2;
                end = this.lastIndexOf("}") > -1 ? this.lastIndexOf("}") : this.length;
            } else {                                           //es5函数
                start = this.indexOf("{") + 1;
                end = this.lastIndexOf("}");
                args = this.substring( this.indexOf("(") + 1  , this.indexOf(")"));
            }
            var fn = new Function( args , this.substring( start , end ) );
            return fn;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });

    //tap事件
    Object.defineProperty( HTMLElement.prototype , "tap" , {
        value : function ( fn , bol ) {
            if( this.addEventListener ) {
                var d,x,y,ori;
                this.addEventListener("touchstart",function ( e ) {
                    var evt = e || event;
                    d = Date.now();
                    x = evt.changedTouches[0].pageX;
                    y = evt.changedTouches[0].pageY;
                    ori = evt.target;

                    if( bol != undefined ) {
                        evt.stopPropagation ? evt.stopPropagation() : evt.cancelable = true;
                    }
                },{ passive : true });
                this.addEventListener("touchend",function ( e ) {
                    var diff = Date.now() - d;
                    var evt = e || event;

                    if( bol != undefined ) {
                        evt.stopPropagation ? evt.stopPropagation() : evt.cancelable = true;
                    }
                    //x轴移动小于5px  y轴移动小于5px  对比时间小于200ms  同一个目标对象
                    if( evt.changedTouches[0].pageX - x < 5 && evt.changedTouches[0].pageY - y < 5  && diff < 200 && evt.target == ori ) {
                        fn.call( this , evt );
                    }
                },{ passive : true });
            }
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //左滑事件
    Object.defineProperty( HTMLElement.prototype , "slideLeft" , {
        value : function ( fn ) {
            var evtStart = "",
                 evtEnd = "",
                 startPos = 0,
                 endPos = 0,
                 ori = null;
            if( isPhone ) {
                evtStart = "touchstart";
                evtEnd = "touchend";
            } else {
                evtStart = "mousedown";
                evtEnd = "mouseup";
            }
            this.addEventListener( evtStart , function ( e ) {
                var evt = e || event;
                startPos = isPhone ? evt.changedTouches[0].pageX : evt.clientX;
                ori = evt.target;
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
            this.addEventListener( evtEnd , function ( e ) {
                var evt = e || event;
                endPos = isPhone ? evt.changedTouches[0].pageX : evt.clientX;
                if( endPos - startPos < -10 && evt.target == ori ) {
                    typeof fn === "function" && fn.call( this , evt );
                }
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //右滑事件
    Object.defineProperty( HTMLElement.prototype , "slideRight" , {
        value : function ( fn ) {
            var evtStart = "",
                evtEnd = "",
                startPos = 0,
                endPos = 0,
                ori = null;
            if( isPhone ) {
                evtStart = "touchstart";
                evtEnd = "touchend";
            } else {
                evtStart = "mousedown";
                evtEnd = "mouseup";
            }
            this.addEventListener( evtStart , function ( e ) {
                var evt = e || event;
                startPos = isPhone ? evt.changedTouches[0].pageX : evt.clientX;
                ori = evt.target;
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
            this.addEventListener( evtEnd , function ( e ) {
                var evt = e || event;
                endPos = isPhone ? evt.changedTouches[0].pageX : evt.clientX;
                if( endPos - startPos > 10 && evt.target == ori ) {
                    typeof fn === "function" && fn.call( this , evt );
                }
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //上滑事件
    Object.defineProperty( HTMLElement.prototype , "slideUp" , {
        value : function ( fn ) {
            var evtStart = "",
                evtEnd = "",
                startPos = 0,
                endPos = 0,
                ori = null;
            if( isPhone ) {
                evtStart = "touchstart";
                evtEnd = "touchend";
            } else {
                evtStart = "mousedown";
                evtEnd = "mouseup";
            }
            this.addEventListener( evtStart , function ( e ) {
                var evt = e || event;
                startPos = isPhone ? evt.changedTouches[0].pageY : evt.clientY;
                ori = evt.target;
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
            this.addEventListener( evtEnd , function ( e ) {
                var evt = e || event;
                endPos = isPhone ? evt.changedTouches[0].pageY : evt.clientY;
                if( endPos - startPos < -10 && evt.target == ori ) {
                    typeof fn === "function" && fn.call( this , evt );
                }
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //下滑事件
    Object.defineProperty( HTMLElement.prototype , "slideDown" , {
        value : function ( fn ) {
            var evtStart = "",
                evtEnd = "",
                startPos = 0,
                endPos = 0,
                ori = null;
            if( isPhone ) {
                evtStart = "touchstart";
                evtEnd = "touchend";
            } else {
                evtStart = "mousedown";
                evtEnd = "mouseup";
            }
            this.addEventListener( evtStart , function ( e ) {
                var evt = e || event;
                startPos = isPhone ? evt.changedTouches[0].pageY : evt.clientY;
                ori = evt.target;
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
            this.addEventListener( evtEnd , function ( e ) {
                var evt = e || event;
                endPos = isPhone ? evt.changedTouches[0].pageY : evt.clientY;
                if( endPos - startPos > 10 && evt.target == ori ) {
                    typeof fn === "function" && fn.call( this , evt );
                }
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            },{ passive : false });
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //锚点方法 , 要到达的元素调用
    Object.defineProperty( HTMLElement.prototype , "to" , {
        value : function ( opts , container ) {
            var con = container || ( document.body.scrollTop ? document.body : document.documentElement );
            var x = opts && opts.x || 0,y = opts && opts.y || 0;
            var scrollTop = this.offsetTop + y;
            var maxHeight = con.clientHeight;

            if( isPhone ) {
                con.addEventListener("touchstart",clearTimer,{ passive : false });
            } else {
                con.addEventListener("mousedown",clearTimer,{ passive : false });
                document.body.addEventListener("mousewheel",clearTimer,{ passive : false });
            }
            clearTimer();
            con.t = setInterval(function () {
                var maxScroll = getScrollTop();
                var speed = ( scrollTop - maxScroll ) / 8;
                speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
                maxScroll += speed;
                if( container ) {
                    container.scrollTop = maxScroll;
                } else {
                    document.body.scrollTop = maxScroll;
                    document.documentElement.scrollTop = maxScroll;
                }
                if( parseInt( maxScroll ) == scrollTop || con.scrollHeight == parseInt( maxScroll + maxHeight ) ) {
                    clearInterval( con.t );
                    con.t && delete con.t;
                }
            },30);

            function getScrollTop() {
                return container ? container.scrollTop : ( document.body.scrollTop || document.documentElement.scrollTop );
            }

            function clearTimer() {
                clearInterval( con.t );
            }
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLElement.prototype , "siblings" , {
        value : function () {
            var parent = this.parentNode,
                children = [],
                i = 0;
            for( ; i < parent.children.length; i ++ ) {
                if( parent.children[i] === this ) { continue };
                children.push( parent.children[i] );
            }
            return children;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLElement.prototype , "prev" , {
        value : function () {
            return this.previousElementSibling; //this.previousSibling;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLElement.prototype , "next" , {
        value : function () {
            return this.nextElementSibling;   //this.nextSibling;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLElement.prototype , "text" , {
        value : function ( str ) {
            if( str !== undefined && !HTMLElement.is( str ) ) {
                try{
                    this.textContent = str;
                } catch ( e ) {
                    this.innerText = str;
                }
            } else {
                return this.textContent || this.innerText;
            }
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //伪数组转数组
    Object.defineProperty( HTMLCollection.prototype , "toArray" , {
        value : function () {
            return Array.prototype.slice.call( this );
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLElement.prototype , "addClass" , {
        value : function ( clsName ) {
            var classList = null;
            if( "classList" in this ) {
                classList = this.classList;
                if( typeof ( clsName ) == "string" && !classList.contains( clsName ) ) {
                    classList.add( clsName );
                }
                if( clsName instanceof Array ) {
                    clsName.filter(function (item) {
                        if( typeof item === "string" && !classList.contains( clsName ) ) {
                            classList.add( item );
                        }
                    })
                }
            } else {
                classList = this.className.match( new RegExp("\\S+","g") ) || [];
                if( typeof ( clsName ) == "string" && classList.indexOf( clsName ) == -1 ) {
                    classList.push( clsName );
                }
                if( clsName instanceof Array ) {
                    clsName.filter(function (item) {
                        if( typeof item === "string" && classList.indexOf( item ) == -1 ) {
                            classList.push( item );
                        }
                    })
                }
                this.className = classList.join(" ");
            }
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLElement.prototype , "removeClass" , {
        value : function ( clsName ) {
            var classList = null;
            if( "classList" in this ) {
                classList = this.classList;
                if( typeof ( clsName ) == "string" && classList.contains( clsName ) ) {
                    classList.remove( clsName );
                }
                if( clsName instanceof Array ) {
                    clsName.filter(function (item) {
                        if( typeof item === "string" && classList.contains( clsName ) ) {
                            classList.remove( item );
                        }
                    })
                }
            } else {
                classList = this.className.match( new RegExp("\\S+","g") ) || [];
                if( typeof ( clsName ) == "string" && classList.indexOf( clsName ) != -1 ) {
                    classList.splice( classList.indexOf( clsName ) , 1 );
                }
                if( clsName instanceof Array ) {
                    clsName.filter(function (item,index) {
                        if( typeof item === "string" && classList.indexOf( item ) != -1 ) {
                            classList.splice( classList.indexOf( item ) , 1 );
                        }
                    })
                }
                this.className = classList.join(" ");
            }
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLElement.prototype , "toggleClass" , {
        value : function ( clsName ) {
            var classList = null;
            if( "classList" in this ) {
                classList = this.classList;
                if( typeof ( clsName ) == "string" ) {
                    classList.toggle( clsName );
                }
                if( clsName instanceof Array ) {
                    clsName.filter(function (item) {
                        if( typeof item === "string" ) {
                            classList.toggle( item );
                        }
                    })
                }
            } else {
                classList = this.className.match( new RegExp("\\S+","g") ) || [];
                if( typeof ( clsName ) == "string" ) {
                    if( classList.indexOf( clsName ) != -1 ) {
                        classList.splice( classList.indexOf( clsName ) , 1 );
                    } else {
                        classList.push( clsName  );
                    }
                }
                if( clsName instanceof Array ) {
                    clsName.filter(function (item,index) {
                        if( classList.indexOf( item ) != -1 ) {
                            classList.splice( classList.indexOf( item ) , 1 );
                        } else {
                            classList.push( item  );
                        }
                    })
                }
                this.className = classList.join(" ");
            }
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //表单验证
    Object.defineProperty( HTMLInputElement.prototype , "tip" , {
        value : function ( cfg ) {
            this.check = false;
            var opts = {
                invalid : cfg.invalid || false ,
                msg : cfg.msg || "该项必填" ,
                adopt : cfg.adopt
            };
            var val = this.value;
            if( opts.invalid && !opts.invalid.test( val ) && val != "" ) {
                setBorder.call( this );
                setTip.call( this );
            };

            if( "onpropertychange" in this ) {
                this.onpropertychange = function ( evt ) {
                    var e = evt || event;
                    if( e.propertyName.toLowerCase() == "value" ) {
                        if( this.value != "" && opts.invalid != false && !opts.invalid.test( this.value ) ) {
                            if( !Boolean( this.b ) ) { setBorder.call( this ) };
                            if( this.i == null ) { setTip.call( this ); }
                        } else {
                            if( this.value != "" && opts.adopt != undefined && opts.invalid.test( this.value ) ) { opts.adopt.call( this ); }
                            if( this.i != null  ) { adopt.call( this ); };
                        }
                    }
                };
                //这是IE9的bug  回退键无法监听
                if( navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g,"")=="MSIE9.0" ) {
                    this.onkeyup = function ( evt ) {
                        var e = evt || event;
                        //回退键
                        if( e.keyCode == 8 ) {
                            if( this.value != "" && opts.invalid != false && !opts.invalid.test( this.value ) ) {
                                if( !Boolean( this.b ) ) { setBorder.call( this ) };
                                if( this.i == null ) { setTip.call( this ); }
                            } else {
                                if( this.value != "" && opts.adopt != undefined && opts.invalid.test( this.value ) ) { opts.adopt.call( this ); }
                                if( this.i != null  ) { adopt.call( this ); };
                            }
                        }
                    }
                }
            } else {
                this.oninput = function () {
                    if( this.value != "" && opts.invalid && !opts.invalid.test( this.value ) ) {
                        setBorder.call( this );
                        if( !this.i ) { setTip.call( this ); }
                    } else {
                        if( this.value != "" && opts.adopt != undefined && opts.invalid.test( this.value ) ) { opts.adopt.call( this ); }
                        if( this.i != null  ) { adopt.call( this ); };
                    }
                }
            };


            function setTip() {
                this.i = document.createElement("i");
                this.i.style.cssText = "max-width:"+ this.offsetWidth +"px;position: absolute; left: "+ this.offsetLeft +"px; height: 14px; line-height: 14px; font-size: 12px; font-style: normal; color: red; ";
                this.i.innerHTML = opts.msg;
                document.body.appendChild( this.i );
                this.i.style.setProperty("top" , this.offsetTop + this.offsetHeight + 3 + "px");
            };
            function setBorder() {
                this.b = true;
                this.style.setProperty("border-color","red");
                this.style.setProperty("box-shadow","0px 0px 2px 0px red");
                this.style.setProperty("-webkit-box-shadow","0px 0px 2px 0px red");
            };
            function adopt() {
                this.style.removeProperty("border-color","red");
                this.style.removeProperty("box-shadow","0px 0px 2px 0px red");
                this.style.removeProperty("-webkit-box-shadow","0px 0px 2px 0px red");
                document.body.removeChild( this.i );
                this.i = null;
                this.b = null;
                this.check = true;
            };
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    //兼容IE9的bug     placeholder不存在
    Object.defineProperty( HTMLInputElement.prototype , "plac" , {
        value : function () {
            if( !( "placeholder" in this ) ){
                var isChange = false;
                var defVal = this.value;
                var pload = this.getAttribute("placeholder") || "";
                var classList = this.className.match( new RegExp("\\S+","g") ) || [];

                if( !Boolean( defVal ) ) {
                    this.value = pload;
                    isChange = false;
                    classList.push( "placeholder" );
                    this.className = classList.join(" ");
                } else {
                    isChange = true;
                };
                this.addEventListener("focus",function () {
                    if( this.value === pload && !isChange ) {
                        this.value = "";
                        classList.splice( classList.indexOf( "placeholder" ) , 1 );
                        this.className = classList.join(" ");
                    }
                },false);
                this.addEventListener("change",function () {
                    isChange = true;
                },false);
                this.addEventListener("blur",function () {
                    if(  !Boolean( this.value ) ) {
                        this.value = pload;
                        classList.push( "placeholder" );
                        this.className = classList.join(" ");
                        isChange = false;
                    }
                },false);
            }
            return true;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });
    Object.defineProperty( HTMLTextAreaElement.prototype , "plac" , {
        value : function () {
            if( !( "placeholder" in this ) ){
                var isChange = false;
                var defVal = this.value;
                var pload = this.getAttribute("placeholder") || "";
                var classList = this.className.match( new RegExp("\\S+","g") ) || [];

                if( !Boolean( defVal ) ) {
                    this.value = pload;
                    isChange = false;
                    classList.push( "placeholder" );
                    this.className = classList.join(" ");
                } else {
                    isChange = true;
                };
                this.addEventListener("focus",function () {
                    if( this.value === pload && !isChange ) {
                        this.value = "";
                        classList.splice( classList.indexOf( "placeholder" ) , 1 );
                        this.className = classList.join(" ");
                    }
                },false);
                this.addEventListener("change",function () {
                    isChange = true;
                },false);
                this.addEventListener("blur",function () {
                    if(  !Boolean( this.value ) ) {
                        this.value = pload;
                        classList.push( "placeholder" );
                        this.className = classList.join(" ");
                        isChange = false;
                    }
                },false);
            }
            return true;
        } ,
        enumerable : false ,
        writable : false ,
        configurable : false
    });

    HTMLElement.is = HTMLElement.is || function ( el ) {
        try{
            return Boolean( el.nodeType ) && el.nodeType == 1;
        } catch ( e ) {
            return false;
        }
    };
})();



