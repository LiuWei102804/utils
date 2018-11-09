/*
* 手风琴效果  适用于 菜单
* */
class Accordion {
    constructor( el = "" , config = {} ){
        this.el = el;
        this.config = config;
        this.events = {
            open : [] ,
            close : []
        }
        this.init();
    };
    init(){
        let children = Array.prototype.slice.call( this.el.children );

        children.forEach(( v , k ) => {
            var menuElem = v.children[1];
            v.setAttribute("min" , v.children[0].offsetHeight );
            v.setAttribute("max" , v.children[0].offsetHeight + this.getRealHeight( menuElem ) );
            v.setAttribute("open" , false );
            v.onclick = () => this.closeMenu( children , v );
        });
        children[0].setAttribute("open" , true );
    };
    //更新状态
    closeMenu( els , el ){
        var isOpen = el.getAttribute("open");
        if( this.config.closeAll ) {
            for( let i = 0, len = els.length; i < len; i ++ ) {
                if( els[i] === el ) continue;
                els[i].setAttribute("open" , false );
                this.run( els[i] , { height : el.getAttribute("min")});
            }
        }

        if( isOpen === "true" ) {
            el.setAttribute("open" , false );
            this.run( el , { height : el.getAttribute("min") });
            this.fire("close" , el );
        } else {
            el.setAttribute("open" , true );
            this.run( el , { height : el.getAttribute("max")});
            this.fire("open" , el );
        };
    };
    //计算高度
    getRealHeight( el ){
        var children = Array.prototype.slice.call( el.children );
        var count = 0;

        children.forEach(( v , k ) => {
            count += v.offsetHeight;
        });
        return count;
    };
    on( evt , cb ){
        if ( !this.events[evt] ) {
            this.events[evt] = [];
        };
        this.events[evt].push( cb );
    };
    fire( evt , data ){
        var _ = this;
        if( this.events[evt] instanceof Array ){
            var handlers = this.events[evt];
            handlers.forEach(function ( v , k ){
                v.call( _ , data );
            })
        }
    };
    getStyle ( obj , attr ) {
        return global.getComputedStyle ? global.getComputedStyle( obj , false )[attr] : obj.currentStyle[attr];
    } ;
    run( _el , json , cb ) {
        var times = 400;
        var startTime = new Date().getTime();
        clearInterval( _el.AnimateId );

        var curr = {};
        for( var attr in json ){
            curr[attr] = 0;
            switch( attr ) {
                case "opacity" :
                    curr[attr] = Math.round( this.getStyle( _el , attr ) * 100 );
                    break;
                default :
                    curr[attr] = parseInt( this.getStyle( _el , attr ) );
            }
        }
        var _ = this;
        _el.AnimateId = setInterval(function(){
            var changeTime = new Date().getTime();
            var t = times - Math.max( 0 , startTime - changeTime + times );  //0到2000

            for( var attr in json ) {
                var value;
                switch( attr ) {
                    case "opacity" :
                        value = f( t ,curr[attr] , json[attr] - curr[attr], times );

                        _el.style[attr] = value / 100;
                        _el.style.filter = "alpha(opacity="+ value + ")";
                        break;
                    default :
                        value = f( t ,curr[attr] , json[attr] - curr[attr], times );
                        _el.style[attr] = value + 'px';
                }
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
}

export default Accordion;