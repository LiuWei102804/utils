class ScrollContainer {
    constructor( el , options = { scrollBar : false , backBoune : false } ){
        this.el = el;
        this.options = options;
        this.events = {
            start : [] ,
            scroll : [] ,
            end : []
        };
        var firstChild = this.el.children[0];
        if( firstChild !== undefined ) {
            this.el.style.setProperty("position","relative");
            this.init();
        } else {
            console.error( _el + "需要一个滚动容器");
        }
    };
    init(){

        var child = this.el.children[0];
        child.speed = child.speed || 0;
        child.prevY = child.prevY || 0;

        var isUp = false,begin;
        var diffY = this.el.offsetHeight - child.offsetHeight;

        this.edata = this.edata || {
            startX : 0 ,
            startY : 0 ,
            moveX : 0 ,
            moveY : 0 ,
            maxScrollY : diffY ,
            maxScrollX : 0
        };

        if( this.options.scrollBar ) {
            this.identification( child  );

            var t = ( this.edata.moveY / this.edata.maxScrollY ) * ( this.el.offsetHeight - this.scrollBarEl.offsetHeight );
            this.scrollBarEl.t = t;
            this.setTransform( this.scrollBarEl , { y : t });
        };


        this.el.addEventListener("touchstart",(e) => {
            clearInterval( this.el.timer );
            var e = e || event;
            //_.edata.startX = e.changedTouches[0].pageX - _.edata.moveX;
            this.edata.startY = e.changedTouches[0].pageY - this.edata.moveY;
            begin = child.prevY = e.changedTouches[0].pageY;
            this.fire("start");
        },false);
        this.el.addEventListener("touchmove", e => {
            var e = e || event;
            //_.edata.moveX = e.changedTouches[0].pageX - _.edata.startX;
            this.edata.moveY = e.changedTouches[0].pageY - this.edata.startY;

            isUp = e.changedTouches[0].pageY - begin > 0 ? true : false;
            if( this.edata.moveY > 0 ) {
                if( this.options.backBoune )
                    this.edata.moveY *= 0.085;
                else
                    this.edata.moveY = 0;
            }
            if( this.edata.moveY < this.edata.maxScrollY ) {
                //_.update();
                var t = this.edata.maxScrollY - this.edata.moveY;
                if( this.options.backBoune ) {
                    this.edata.moveY = this.edata.maxScrollY + -( t * 0.085 );
                } else {
                    this.edata.moveY = this.edata.maxScrollY;
                }
            }
            this.setTransform( child , { y : this.edata.moveY });
            if( this.options.scrollBar ) {
                var t = ( this.edata.moveY / this.edata.maxScrollY ) * ( this.el.offsetHeight - this.scrollBarEl.offsetHeight );
                this.setTransform( this.scrollBarEl , { y : t });
            }

            child.speed = e.changedTouches[0].pageY - child.prevY;
            child.prevY = e.changedTouches[0].pageY;

            //阻止冒泡
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            this.fire("scroll");
            return false;
        },false)
        this.el.addEventListener("touchend",() => {
            clearInterval( this.el.timer );
            this.el.timer = setInterval(() => {
                child.speed = isUp ? child.speed + -1 : child.speed + 1;
                child.speed *= 0.99995;
                this.edata.moveY += child.speed;

                this.fire("scroll");
                if( child.speed >= 0 && !isUp ) {
                    clearInterval( this.el.timer );
                    child.speed = 0;
                    this.fire("end");
                }
                if( child.speed <= 0 && isUp ) {
                    clearInterval( this.el.timer );
                    child.speed = 0;
                    this.fire("end");
                }

                if( this.edata.moveY > 0 ) {
                    clearInterval( this.el.timer );
                    if( this.options.backBoune ) {
                        this.run( child , { y : 0 } , { y : this.edata.moveY } );
                        if( this.options.scrollBar )
                            this.run( this.scrollBarEl , { y : 0 } , { y : this.scrollBarEl.t } );
                    } else {
                        this.edata.moveY = 0;
                    }
                }
                if( this.edata.moveY < this.edata.maxScrollY ) {
                    clearInterval( this.el.timer );
                    if( this.options.backBoune ) {
                        this.run( child , { y : this.edata.maxScrollY } , { y : this.edata.moveY } );
                        if( this.options.scrollBar )
                            this.run( this.scrollBarEl , { y : this.el.offsetHeight - this.scrollBarEl.offsetHeight } , { y : this.scrollBarEl.t } );
                    } else {
                        this.edata.moveY = this.edata.maxScrollY;
                    }
                }

                this.setTransform( child , { y : this.edata.moveY } );
                if( this.options.scrollBar ) {
                    var t = ( this.edata.moveY / this.edata.maxScrollY ) * ( this.el.offsetHeight - this.scrollBarEl.offsetHeight );
                    this.setTransform( this.scrollBarEl , { y : t });
                    this.scrollBarEl.t = t;
                }
            },15);
        },false);
    };

    identification( scrollBox ){
        var div;

        if( this.el.querySelector(".my-scroll-bar") == null ) {
            div = document.createElement("div");
            var styles = "position:absolute; width:20px; background:#fff; border-radius:15px; top:0; right:10px; cursor: pointer;";
            div.style = styles;
            div.className = "my-scroll-bar";
            this.el.appendChild( div );
        } else {
            div = this.el.querySelector(".my-scroll-bar");
        }
        this.setStyle( div ,{ height : Math.max( 50 , this.el.offsetHeight * 0.25 ) + "px" });
        this.scrollBarEl = div;
        this.scrollBarEl.t = 0;

        var _ = this;
        this.bind( div , "touchstart" , _start_ );
        this.bind( div , "touchmove" , _move_ );

        div.moveY = 0;
        function _start_( e ) {
            clearInterval( _.el.timer );
            var e = e || event;
            this.startY = e.changedTouches[0].pageY - this.t;

            _.fire("start");
        };
        function _move_( e ) {
            var e = e || event,maxHeight = _.edata.maxScrollY;
            this.t = e.changedTouches[0].pageY - this.startY;

            if( this.t <= 0 ) this.t = 0;
            if( this.t >= _.el.offsetHeight - this.offsetHeight ) this.t = _.el.offsetHeight - this.offsetHeight;

            var scale = this.t / ( _.el.offsetHeight - this.offsetHeight );

            _.edata.moveY = scale * maxHeight;

            _.setTransform( div , { y : this.t });
            _.setTransform( scrollBox , { y : _.edata.moveY })
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            _.fire("scroll");
        };
    };
    setStyle( el , json ){
        for( var attr in json ) {
            el.style.setProperty( attr, json[attr] );
        }
    };
    bind( el , event , cb ){
        if( !el[event] ) {
            if( el.addEventListener ) {
                el.addEventListener( event , cb , false );
            } else {
                el.attachEvent( "on" + event , cb );
            }
            el[event] = true;
        }
    };
    isPhone() {
        var isPhone = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test( navigator.userAgent );
        return isPhone;
    };
    setTransform( el , json ){
        el.style.WebkitTransform = "translate3d("+ ( json.x || 0 ) +"px,"+ ( json.y || 0 ) +"px,0)";
        el.style.MozTransform = "translate3d("+ ( json.x || 0 ) +"px,"+ ( json.y || 0 ) +"px,0)";
        el.style.OTransform = "translate3d("+ ( json.x || 0 ) +"px,"+ ( json.y || 0 ) +"px,0)";
        el.style.MsTransform = "translate3d("+ ( json.x || 0 ) +"px,"+ ( json.y || 0 ) +"px,0)";
        el.style.transform = "translate3d("+ ( json.x || 0 ) +"px,"+ ( json.y || 0 ) +"px,0)";
    };
    fire( evt , data  ){
        if( this.events[evt] instanceof Array ){
            var handlers = this.events[evt];
            handlers.forEach(( v , k ) => {
                v.call( this  , data );
            })
        }
    };
    on( evt , cb ){
        if ( !this.events[evt] ) {
            this.events[evt] = [];
        };
        this.events[evt].push( cb );
    };
    run( _el , json , from , cb ){
        var times = 400;
        var startTime = new Date().getTime();
        clearInterval( _el.AnimateId );

        var _ = this;
        _el.AnimateId = setInterval(function(){
            var changeTime = new Date().getTime();
            var t = times - Math.max( 0,startTime - changeTime + times );  //0到2000

            var x = f( t , from.x , ( json.x || 0 ) - from.x , times );
            var y = f( t , from.y , ( json.y || 0 ) - from.y , times );

            if( _.isPhone() ) {
                _.setTransform( _el , { x : x , y : y } );
            } else {
                _.setStyle( _el , { left : x + "px" , top : y + "px" } );
            }
            if( t == times ){
                clearInterval( _el.AnimateId );
                cb && cb();
            }
        },13);
        function f(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        }
    };
    refresh(){
        var diffY = this.el.offsetHeight - this.el.children[0].offsetHeight;
        this.edata.maxScrollY = diffY;
        this.init();
    };
    scrollTo( x, y ) {
        this.run( this.el.children[0] , { x : x , y : y } , { x : this.edata.moveX , y : this.edata.moveY } );
        if( this.options.scrollBar ) {
            var diffY = this.edata.maxScrollY;
            var t = ( y / diffY ) * ( this.el.offsetHeight - this.scrollBarEl.offsetHeight );
            this.run( this.scrollBarEl , { y : t } , { y : this.scrollBarEl.t } );
            this.scrollBarEl.t = t;
        }
        this.edata.moveX = x;
        this.edata.moveY = y;
    };
}

export default ScrollContainer;

