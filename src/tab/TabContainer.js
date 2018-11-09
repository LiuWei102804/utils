class TabContainer {
    constructor( el = "" , config = {} ){
        this.el = el;
        this.config = config;
        this.currTab = 0;
        this.events = {
            change : []
        }

        this.init();
    };
    init(){
        let nav = this.config.nav;
        let contentBox = this.config.contentBox;
        let currClass = this.config.currClass || "";
        let p = contentBox[this.currTab].parentNode;

        for( let i = 0, len = contentBox.length; i < len; i ++ ) {
            contentBox[i].style.setProperty("float","left");
        }
        nav[this.currTab].classList.add( currClass );
        p.style.setProperty("position","relative");

        p.innerHTML = `<div style="width:${ contentBox[0].offsetWidth * contentBox.length }px; overflow: hidden; position: absolute; top:0; left: 0;">${ contentBox[this.currTab].parentNode.innerHTML }</div>`;

        this._target_ = p.children[0];

        this.tabChange( nav );
    };
    tabChange( elems ){
        var isPhone = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test( navigator.userAgent );
        var _ = this;
        for( let i = 0, len = elems.length; i < len; i ++ ) {
            if( isPhone ) {
                this.tap( elems[i] , () => _.tabTo( i) );
            } else {
                elems[i].onclick = () => _.tabTo( i );
            }
        }
    };
    //tap 事件
    tap( el , cb ){
        var x = 0,y = 0,now;
        el.addEventListener("touchstart", e => {
            var e = e || event;
            let touch = e.changedTouches[0];
            now = Date.now();
            x = touch.pageX;
            y = touch.pageY;
        },false);
        el.addEventListener("touchend",e => {
            var e = e || event;
            let touch = e.changedTouches[0];

            //手机移动距离小于5px 并且从按下到抬起时间不高于150ms
            if( Math.abs( touch.pageX - x ) < 5 && Math.abs( touch.pageY - y ) < 5 && Date.now() - now < 150 ) {
                cb( e );
            }
        },false)
    };
    //切换至 index 选项
    tabTo( item ) {
        var p = this._target_;
        try{
            this.config.nav[this.currTab].classList.remove( this.config.currClass );
            this.config.nav[item].classList.add( this.config.currClass );
            this.run( p , { left : -item * p.parentNode.offsetWidth } );
            this.currTab = item;

            this.fire("change");
        } catch ( e) {}
    };
    on( evt , cb ){
        if ( !this.events[evt] ) {
            this.events[evt] = [];
        };
        this.events[evt].push( cb );
    };
    fire( evt ){
        var _ = this;
        if( this.events[evt] instanceof Array ){
            var handlers = this.events[evt];
            handlers.forEach(function ( v , k ){
                v.call( _ , _.currTab );
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
};

export default TabContainer;