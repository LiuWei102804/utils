class Carousel {
    constructor( el , options = {} ){
        this.el = el;
        this.carouselBox = this.el.children[0];
        this.options = {
            interval : options.interval || 3000 ,
            autoPlay : options.autoPlay || true ,
            index : options.index || true
        };
        this.curr = 0;


        this.carouselBox.innerHTML += this.carouselBox.innerHTML;


        this.init();
    };
    init(){
        const w = Number.parseFloat( this.getStyle( this.el , "width" ) );
        const h = Number.parseFloat( this.getStyle( this.el , "height" ) );
        const children = Array.prototype.slice.call( this.carouselBox.children );
        const opts = this.options;

        children.forEach(item => {
            this.setStyle( item , {
                "float" : "left" ,
                "width" : w + "px" ,
                "height" : h + "px" ,
                "position" : "relavite" ,
                "transform" : "translateZ(0px)" ,
                "-webkit-transform" : "translateZ(0px)" ,
            });
        });
        this.setStyle( this.carouselBox , {
            "width" : w * children.length + "px" ,
            "position" : "absolute" ,
            "left" : 0 ,
            "top" : 0 ,
            "overflow" : "hidden" ,
            "transform" : "translate(0px,0px)" ,
            "-webkit-transform" : "translate(0px,0px)"
        });

        opts.autoPlay && this.autoRun();
        opts.index && this.createIndex();

        const _ = this;

        this.carouselBox.start = 0;
        this.carouselBox.move = 0;
        this.carouselBox.startPageX = 0;

        this.bind( this.carouselBox , "touchstart" , __start__ );
        this.bind( this.carouselBox , "touchmove" , __move__ );
        this.bind( this.carouselBox , "touchend" , __end__ );

        const isRequest = "requestAnimationFrame" in window;
        function __start__( e ) {
            var evt = e || event;
            const touch = evt.changedTouches[0];
            clearInterval( _.timer );
            isRequest ? cancelAnimationFrame( _.requestId ) : clearInterval( _.requestId );

            if( _.curr <= 0 ) {
                _.curr += children.length / 2;
                this.move = -_.curr * w;
                _.setStyle(this,{
                    "transform" : `translate(${ this.move }px,0px)` ,
                    "-webkit-transform" : `translate(${ this.move }px,0px)`
                })
            }

            this.startPageX = touch.pageX;
            this.start = this.move;
        };

        function __move__( e ) {
            var evt = e || event;
            const touch = evt.changedTouches[0];
            this.move = this.start + ( touch.pageX - this.startPageX );

            _.setStyle( _.carouselBox , {
                "transform" : `translate(${ this.move }px,0px)` ,
                "-webkit-transform" : `translate(${ this.move }px,0px)`
            });
        };

        function __end__( e ) {
            var evt = e || event;
            const touch = evt.changedTouches[0];
            var dis = touch.pageX - this.startPageX;
            var num = Math.round( dis / w );
            _.curr -= num;

            this.move = -_.curr * w;
            if( _.curr >= children.length / 2 ) {
                _.setTransform( this ,this.move , () => {
                    _.curr = _.curr % ( children.length / 2 );
                    this.move = -_.curr * w;
                    _.setStyle( this , {
                        "transform" : `translate(${ this.move }px,0px)` ,
                        "-webkit-transform" : `translate(${ this.move }px,0px)`
                    });
                });
            } else {
                _.setTransform( this , this.move );
            };

            _.setIndex( _.curr % ( children.length / 2 ) );

            let t = setTimeout( () => {
                _.autoRun();
                clearTimeout( t );
            },3000);
        }
    };
    createIndex() {
        const w = Number.parseFloat( this.getStyle( this.el , "width" ) );
        this.el.indexLine = document.createElement("div");
        const len = this.carouselBox.children.length / 2;
        let i = 0;
        for(; i < len; i ++ ) {
            let round = document.createElement("span");
            this.setStyle( round , {
                "float" : "left" ,
                "background" : "rgba(100,240,60,0.6)" ,
                "width" : "10px" ,
                "height" : "10px" ,
                "border-radius" : "5px" ,
                "margin-right" : i == len - 1 ? 0 : "5px"
            });
            this.el.indexLine.appendChild( round );
        }
        this.setStyle( this.el.indexLine , {
            "position" : "absolute" ,
            "bottom" : "20px" ,
            "height" : "10px" ,
            "overflow" : "hidden" ,
            "width" : len * 15 - 5 + "px" ,
            "left" : ( w - len * 15 - 5 ) / 2 + "px"
        });
        this.el.appendChild( this.el.indexLine );
        this.setIndex( this.curr );
    };
    setIndex( idx ) {
        let rounds = Array.prototype.slice.call( this.el.indexLine.children );
        rounds.forEach((item,index) => {
            this.setStyle( item , {
                "background-color" : "rgba(100,240,60,0.6)"
            })
            if( index == idx ) {
                this.setStyle( item , {
                    "background-color" : "rgba(100,240,60,0.9)"
                })
            }
        })
    };
    autoRun() {
        const w = Number.parseFloat( this.getStyle( this.el , "width" ) );
        this.timer = setInterval( () => this.run( w ) , this.options.interval );
    };
    run( w ){
        this.curr += 1;
        this.carouselBox.move = -this.curr * w;
        this.setTransform( this.carouselBox , this.carouselBox.move ,() => {
            if( this.curr >= this.carouselBox.children.length / 2 ) {
                this.setStyle( this.carouselBox , {
                    "transform" : "translate(0px,0px)" ,
                    "-webkit-transform" : "translate(0px,0px)"
                });
                this.curr = this.curr % ( this.carouselBox.children.length / 2 );
            }
        });
        this.setIndex( this.curr % ( this.carouselBox.children.length / 2 ) );
    }
    getStyle( obj , attr ){
        return window.getComputedStyle ? window.getComputedStyle( obj , false )[attr] : obj.currentStyle[attr];
    };
    setStyle( obj , attrs ){
        let style = obj.style;
        for( let attr in attrs ) {
            style.setProperty( attr , attrs[attr] );
        }
    };
    getTransform( obj , transform ) {
        let style = obj.style.transform.match(/-*\d+/g);
        let x = style[0],
            y = style[1];
        let dir = transform || "x";

        return dir.toLowerCase() == "x" ? Number.parseFloat( x ) : Number.parseFloat( y );
    };
    setTransform( obj , target , cb ){
        let currX = this.getTransform( obj );

        var isRequest = "requestAnimationFrame" in window;
        if( isRequest ) {
            this.requestId = requestAnimationFrame( run );
        } else {
            this.requestId = setInterval( run , 30 );
        };
        const _ = this;
        function run() {
            let speedX = ( target - currX ) / 8;
            speedX = speedX > 0 ? Math.ceil( speedX ) : Math.floor( speedX );

            currX += speedX;
            obj.style.WebkitTransform = `translate(${currX}px,0px)`;
            obj.style.MzoTransform = `translate(${currX}px,0px)`;
            obj.style.OTransform = `translate(${currX}px,0px)`;
            obj.style.transform = `translate(${currX}px,0px)`;
            if( currX == target ) {
                if( isRequest ) {
                    cancelAnimationFrame( _.requestId );
                    cb && cb();
                } else {
                    clearInterval( _.requestId );
                    cb && cb();
                }
            } else {
                if( isRequest ) {
                    _.requestId = requestAnimationFrame( run )
                }
            }
        }
    };
    bind( obj , evt , cb ){
        if( obj.addEventListener ) {
            obj.addEventListener( evt , cb , { passive : true });
        } else {
            obj.attachEvent( "on" + evt , cb );
        }
    };
    unbind( obj , evt , cb ){
        if( obj.removeEventListener ) {
            obj.removeEventListener( evt , cb , { passive : true });
        } else {
            obj.detachEvent( "on" + evt , cb );
        }
    }
}

export default Carousel;