(function ( global ) {
    "use strict"
    var AnimatePlatform = typeof global.Animate === "undefined";
    if( AnimatePlatform ) {
        var Animate = {
            run : function ( el , json , _times , _type , callback ) {
                var type = _type,times = _times;
                if( typeof _times === "undefined" ) {
                    times = 400;
                    type = "easeIn";
                }
                if( typeof _times === "string" ) {
                    times = 400;
                    type = _times;
                }
                if( typeof _times === "function" ) {
                    times = 400;
                    type = "easeIn";
                    callback = _times;
                }
                if( typeof _type === "number" ) {
                    times = _type;
                }
                if( typeof _type === "function" ) {
                    type = "easeIn";
                    callback = _type;
                }
                var _el = typeof el === "string" ? document.getElementById( el.replace(/#*/,"") ) : el;
                if( !_el ) throw TypeError("指定元素不存在");
                var tns = ["o","webkit","moz","ms",""];

                var curr = {};
                var fx = Animate.getAnimateType( type );
                for( var attr in json ){
                    curr[attr] = 0;
                    switch( attr ) {
                        case "opacity" :
                            curr[attr] = Math.round( Animate.getStyle( _el , attr ) * 100 );
                            break;
                        case "translate" :
                        case "scale" :
                        case "rotate" :
                        case "skew" :
                            curr[attr] = Animate.getTransform( _el )[attr];
                            break;
                        default :
                            curr[attr] = parseInt( Animate.getStyle( _el , attr ) );
                    }
                }
                var startTime = new Date().getTime();
                if( global.requestAnimationFrame ) {
                    //requestAnimationFrame

                    var step = function ( timestamp ) {
                        var nextTime = new Date().getTime();
                        var t = times - Math.max( 0 ,startTime - nextTime + times );  //0到2000

                        if( t == times ){
                            Animate.stop( el.AnimateId );
                            typeof callback === "function" && callback.call( _el );
                        } else {
                            _el.AnimateId = global.requestAnimationFrame( step )
                        }
                        for( var attr in json ) {
                            var value;

                            switch( attr ) {
                                case "opacity" :
                                    value = fx( t ,curr[attr] , json[attr] - curr[attr], times );

                                    _el.style[attr] = value / 100;
                                    _el.style.filter = "alpha(opacity="+ value + ")";
                                    break;
                                case "translate" :
                                case "scale" :
                                case "rotate" :
                                case "skew" :
                                    json["translate"] = Animate.setDefaultTransform( _el , "translate" , json );
                                    json["scale"] = Animate.setDefaultTransform( _el , "scale" , json );
                                    json["rotate"] = Animate.setDefaultTransform( _el , "rotate" , json );
                                    json["skew"] = Animate.setDefaultTransform( _el , "skew" , json );
                                    curr["translate"] = Animate.setDefaultTransform( _el , "translate" , curr );
                                    curr["scale"] = Animate.setDefaultTransform( _el , "scale" , curr );
                                    curr["rotate"] = Animate.setDefaultTransform( _el , "rotate" , curr );
                                    curr["skew"] = Animate.setDefaultTransform( _el , "skew" , curr );

                                    var r = fx( t , curr["rotate"][0] , json["rotate"][0] - curr["rotate"][0] , times );
                                    var cosVal = Math.cos( r * Math.PI / 180 ),
                                        sinVal = Math.sin( r * Math.PI / 180 ) ,
                                        a = fx( t , curr["scale"][0] , json["scale"][0] - curr["scale"][0] , times ) - 1,
                                        b = fx( t , curr["skew"][0] , json["skew"][0] - curr["skew"][0] , times ) ,
                                        c = fx( t , curr["skew"][1] , json["skew"][1] - curr["skew"][1] , times ) ,
                                        d = fx( t , curr["scale"][1] , json["scale"][1] - curr["scale"][1] , times ) - 1 ,
                                        e = fx( t , curr["translate"][0] , json["translate"][0] - curr["translate"][0] , times ),
                                        f = fx( t , curr["translate"][1] , json["translate"][1] - curr["translate"][1] , times );

                                    var tanX = parseFloat( Math.tan( b * Math.PI / 180 ).toFixed(6) ),
                                        tanY = parseFloat( Math.tan( c * Math.PI / 180 ).toFixed(6) );

                                    tns.forEach(function ( v , k ) {
                                        _el.style[ v + "transform"] = "matrix("+ ( cosVal + a ) +","+ ( sinVal + tanY ) +","+ ( -1 * sinVal + tanX ) + ","+ ( cosVal + d ) +","+ e +"," + f + ")";
                                    });
                                    break;
                                default :
                                    value = fx( t ,curr[attr] , json[attr] - curr[attr], times );
                                    _el.style[attr] = value + 'px';
                            }
                        }
                    }
                    _el.AnimateId = global.requestAnimationFrame( step );
                } else {
                    //使用定时器
                    clearInterval( _el.AnimateId );
                    _el.AnimateId = setInterval(function(){
                        var changeTime = new Date().getTime();
                        var t = times - Math.max( 0,startTime - changeTime + times );  //0到2000
                        for( var attr in json ){
                            var value = Animate.getAnimateType( type )( t , curr[attr] , json[attr] - curr[attr] , times );

                            switch( attr ) {
                                case "opacity" :
                                    _el.style[attr] = value / 100;
                                    _el.style.filter = "alpha(opacity="+ value + ")";
                                    break;
                                case "scale" :
                                case "rotate" :
                                    json["scale"] = Animate.setDefaultTransform( _el , "scale" , json );
                                    json["rotate"] = Animate.setDefaultTransform( _el , "rotate" , json );
                                    curr["scale"] = Animate.setDefaultTransform( _el , "scale" , curr );
                                    curr["rotate"] = Animate.setDefaultTransform( _el , "rotate" , curr );

                                    var r = fx( t , curr["rotate"][0] , json["rotate"][0] - curr["rotate"][0] , times );
                                    var cosVal = Math.cos( r * Math.PI / 180 ),
                                        sinVal = Math.sin( r * Math.PI / 180 ) ,
                                        a = fx( t , curr["scale"][0] , json["scale"][0] - curr["scale"][0] , times ),
                                        //b = fx( t , curr["skew"][0] , json["skew"][0] - curr["skew"][0] , times ) ,
                                        //c = fx( t , curr["skew"][1] , json["skew"][1] - curr["skew"][1] , times ) ,
                                        d = fx( t , curr["scale"][1] , json["scale"][1] - curr["scale"][1] , times );
                                        //e = fx( t , curr["translate"][0] , json["translate"][0] - curr["translate"][0] , times ),
                                        //f = fx( t , curr["translate"][1] , json["translate"][1] - curr["translate"][1] , times );
                                    
                                    _el.style["filter"] = "progid:DXImageTransform.Microsoft.Matrix(M11="+ ( cosVal * a ) +",M12="+ -( sinVal * a ) +",M21="+ ( sinVal * a ) +",M22="+ ( cosVal * a ) +",SizingMethod='auto expand')}";

                                    break;
                                default :
                                    _el.style[attr] = value + 'px';
                            }
                        }
                        if( t == times ){
                            clearInterval( _el.AnimateId );
                            typeof callback === "function" && callback.call(obj);
                        }
                    },13);
                }
                return _el.AnimateId;
            } ,
            stop : function ( id ) {
                global.cancelAnimationFrame( id );
            } ,
            getStyle : function ( obj , attr ) {
                return global.getComputedStyle ? global.getComputedStyle( obj , false )[attr] : obj.currentStyle[attr];
            } ,
            getTransform : function ( obj ) {
                var val = this.getStyle( obj , "transform");
                val = val ? val.replace(/matrix\(|\)/g,"").split(/,\s*/g) : [1,0,0,1,0,0];

                var a = parseFloat( val[0] ),
                    b = parseFloat( Math.atan( parseFloat( val[1]) ) / ( Math.PI / 180 ).toFixed(6) ),
                    c = parseFloat( Math.atan( parseFloat( val[2]) ) / ( Math.PI / 180 ).toFixed(6) ),
                    d = parseFloat( val[3] );
                var angle = Math.round( Math.atan2( parseFloat( val[1] ) , a ) * (180 / Math.PI));

                return {
                    translate : [parseFloat( val[4] ),parseFloat( val[5] )] ,
                    scale  : [parseFloat( val[0] ), parseFloat( val[3] )] ,
                    rotate : [ angle ] ,
                    skew : [ c,b ]
                }
            } ,
            setDefaultTransform : function ( obj , attr , val ) {
                var transform = Animate.getTransform( obj );
                if( val[attr] &&  val[attr].length > 0 ) {
                    if( !val[attr][1] && attr !== "rotate" ) {
                        val[attr].push(transform[ attr][1] );
                    }
                } else {
                    val[attr] = transform[attr];
                }
                return val[attr];
            } ,
            getAnimateType : function ( type ) {
                var Tween = {
                    linear: function (t, b, c, d){  //匀速
                        return c*t/d + b;
                    },
                    easeIn: function(t, b, c, d){  //加速曲线
                        return c*(t/=d)*t + b;
                    },
                    easeOut: function(t, b, c, d){  //减速曲线
                        return -c *(t/=d)*(t-2) + b;
                    },
                    easeBoth: function(t, b, c, d){  //加速减速曲线
                        if ((t/=d/2) < 1) {
                            return c/2*t*t + b;
                        }
                        return -c/2 * ((--t)*(t-2) - 1) + b;
                    },
                    easeInStrong: function(t, b, c, d){  //加加速曲线
                        return c*(t/=d)*t*t*t + b;
                    },
                    easeOutStrong: function(t, b, c, d){  //减减速曲线
                        return -c * ((t=t/d-1)*t*t*t - 1) + b;
                    },
                    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
                        if ((t/=d/2) < 1) {
                            return c/2*t*t*t*t + b;
                        }
                        return -c/2 * ((t-=2)*t*t*t - 2) + b;
                    },
                    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
                        if ( t === 0 ) {
                            return b;
                        }
                        if ( (t /= d) == 1 ) {
                            return b+c;
                        }
                        if (!p) {
                            p=d*0.3;
                        }
                        if (!a || a < Math.abs(c)) {
                            a = c;
                            var s = p/4;
                        } else {
                            var s = p/(2*Math.PI) * Math.asin (c/a);
                        }
                        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    },
                    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
                        if (t === 0) {
                            return b;
                        }
                        if ( (t /= d) == 1 ) {
                            return b+c;
                        }
                        if (!p) {
                            p=d*0.3;
                        }
                        if (!a || a < Math.abs(c)) {
                            a = c;
                            var s = p / 4;
                        } else {
                            var s = p/(2*Math.PI) * Math.asin (c/a);
                        }
                        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                    },
                    elasticBoth: function(t, b, c, d, a, p){
                        if (t === 0) {
                            return b;
                        }
                        if ( (t /= d/2) == 2 ) {
                            return b+c;
                        }
                        if (!p) {
                            p = d*(0.3*1.5);
                        }
                        if ( !a || a < Math.abs(c) ) {
                            a = c;
                            var s = p/4;
                        }
                        else {
                            var s = p/(2*Math.PI) * Math.asin (c/a);
                        }
                        if (t < 1) {
                            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                        }
                        return a*Math.pow(2,-10*(t-=1)) *
                            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
                    },
                    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
                        if (typeof s == 'undefined') {
                            s = 1.70158;
                        }
                        return c*(t/=d)*t*((s+1)*t - s) + b;
                    },
                    backOut: function(t, b, c, d, s){
                        if (typeof s == 'undefined') {
                            s = 3.70158;  //回缩的距离
                        }
                        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                    },
                    backBoth: function(t, b, c, d, s){
                        if (typeof s == 'undefined') {
                            s = 1.70158;
                        }
                        if ((t /= d/2 ) < 1) {
                            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                        }
                        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                    },
                    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
                        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
                    },
                    bounceOut: function(t, b, c, d){
                        if ((t/=d) < (1/2.75)) {
                            return c*(7.5625*t*t) + b;
                        } else if (t < (2/2.75)) {
                            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
                        } else if (t < (2.5/2.75)) {
                            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
                        }
                        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
                    },
                    bounceBoth: function(t, b, c, d){
                        if (t < d/2) {
                            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
                        }
                        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
                    }
                };
                return type ? Tween[type] : null;
            }
        };
        global.Animate = Animate;
    } else {
        console.error("Animate 命名冲突，请检查");
    }
})( window );