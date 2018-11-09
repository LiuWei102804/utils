class Clip{
    constructor( el , data ){
        this.el = el;
        this.image = new Image();
        this.canvas = null;

        if( Boolean( data.nodeName ) ) {
            this.image.src = data.getAttribute("src");
        } else {
            if( document.getElementById( data.replace(/#*/,"") ) === null ) {
                this.image.src = data;
            } else {
                this.image.src = document.getElementById( data.replace(/#*/,"") ).getAttribute("src");
            }
        }
        this.init();
    };
    init(){
        let elems = [
            "<div style=' width: 100%; height: 100%; position: absolute; top:0; left: 0; background: rgba(0,0,0,0.7); '></div>" ,
            "<div class='viewClip' style='width: 200px; height: 200px; position: absolute; top:100px; left: 100px; background: #fff; border:1px solid #000; cursor:all-scroll;'>" ,
            "<i data-drop='0' style='position: absolute; top:-3px; left:-3px; cursor: nw-resize;  width: 6px; height: 6px; background: #fff;'></i>",
            "<i data-drop='1' style='position: absolute; top:-3px; left: 50%; margin-left:-3px; cursor: n-resize;  width: 6px; height: 6px; background: #fff;'></i>" ,
            "<i data-drop='2' style='position: absolute; top:-3px; right: -3px; cursor: ne-resize;  width: 6px; height: 6px; background: #fff;'></i>" ,
            "<i data-drop='3' style='position: absolute; top:50%; margin-top: -3px; right: -3px; cursor: e-resize; width: 6px; height: 6px; background: #fff;'></i>" ,
            "<i data-drop='4' style='position: absolute; bottom:-3px; right: -3px; cursor: nw-resize; width: 6px; height: 6px; background: #fff;'></i>" ,
            "<i data-drop='5' style='position: absolute; left:50%; margin-left: -3px; bottom:-3px; cursor: n-resize; width: 6px; height: 6px; background: #fff; '></i>" ,
            "<i data-drop='6' style='position: absolute; left:-3px; bottom:-3px;cursor: ne-resize; width: 6px; height: 6px; background: #fff;'></i>" ,
            "<i data-drop='7' style='position: absolute; left:-3px; top:50%; margin-top: -3px;  cursor: e-resize;  width: 6px; height: 6px; background: #fff;'></i>" ,
            "</div>"
        ];

        var box = document.createElement("div");
        box.style = "left:0; top:0; width:100%; height:100%; position:absolute;";
        box.innerHTML = elems.join("");
        this.el.appendChild( box );

        var viewClip = this.el.querySelector(".viewClip");
        this.canvas = document.createElement("canvas");

        viewClip.appendChild( this.canvas );
        this.image.onload = () => {
            this.draw( viewClip.offsetWidth - 2 , viewClip.offsetHeight -2 ,-viewClip.offsetLeft , -viewClip.offsetTop );
        }

        this.drop( viewClip );
        this.scale( viewClip );
    };
    draw( w , h , x ,y ){
        var maxW = parseInt( this.getStyle( this.el , "width" ) ),
            maxH = parseInt( this.getStyle( this.el , "height" ) );
        this.canvas.width = w;
        this.canvas.height = h;


        var ctx = this.canvas.getContext("2d");
        ctx.clearRect( 0 , 0 , this.canvas.width , this.canvas.height );
        ctx.drawImage( this.image , x , y , maxW , maxH );
    };
    drop( el ){
        if( typeof el === "undefined" ) {
            console.error( el , "参数错误,el 未定义");
            return;
        }
        var that = this;
        var h = this.el.offsetHeight,w = this.el.offsetWidth;
        el.onmousedown = function ( e ) {
            var e = e || event;
            var x = e.clientX - this.offsetLeft;
            var y = e.clientY - this.offsetTop;

            document.onmousemove = function (e) {
                var e = e || event;
                var l = e.clientX - x;
                var t = e.clientY - y;
                if (l <= 0) l = 0;
                if (t <= 0) t = 0;
                if (l >= w - el.offsetWidth) l = w - el.offsetWidth;
                if (t >= h - el.offsetHeight) t = h - el.offsetHeight;

                el.style.left = l + "px";
                el.style.top = t + "px";

                that.draw(el.offsetWidth - 2, el.offsetHeight - 2, -el.offsetLeft, -el.offsetTop);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    };
    scale( el ){
        if( typeof el === "undefined" ) {
            console.error( el , "参数错误,el 未定义");
            return;
        }
        var that = this;
        var IElem = Array.prototype.slice.call( el.querySelectorAll("i") );
        var maxWidth = parseInt( this.getStyle( this.el , "width" ) ),
            maxHeight = parseInt( this.getStyle( this.el , "height" ) );

        IElem.forEach(function ( v , k ) {
            v.onmousedown = function( e ) {
                var e = e || event;
                var t = parseInt( that.getStyle( el , "top" ) ),
                    l = parseInt( that.getStyle( el , "left" ) ),
                    w = parseInt( that.getStyle( el , "width" ) ) - 2 ,
                    h = parseInt( that.getStyle( el , "height" ) ) - 2;

                v.l = e.clientX - parseInt( that.getStyle( v , "left" ) ) + 3;
                v.t = e.clientY - parseInt( that.getStyle( v , "top" ) ) + 3;

                var dir = v.getAttribute("data-drop");
                document.onmousemove = function ( e ) {
                    var e = e || event;
                    switch ( parseInt( dir ) ) {
                        case 0 :                        //左上角，左上，左下
                            var top = ( e.clientY - v.t ) + t;
                            var left = ( e.clientX - v.l ) + l;
                            if( top <= 0 ) {
                                return;
                            }
                            if( top >= t + h - 20 ) {
                                return;
                            }

                            if( left <= 0 ) {
                                return;
                            }
                            if( left >= l + w - 20 ) {
                                return;
                            }

                            el.style.top = top + "px";
                            el.style.height = ( -( e.clientY - v.t ) + h ) + "px";
                            el.style.left = left + "px";
                            el.style.width = ( -( e.clientX - v.l ) + w ) + "px";
                            break;
                        case 1 :                        //上方上下
                            var top = ( e.clientY - v.t ) + t;
                            if( top <= 0 ) {
                                return;
                            }
                            if( top >= t + h - 20 ) {
                                return;
                            }

                            el.style.top = top + "px";
                            el.style.height = ( -( e.clientY - v.t ) + h ) + "px";
                            break;
                        case 2 :                        //右上角 右上，右下
                            var top = ( e.clientY - v.t ) + t;
                            var width = ( e.clientX - v.l );
                            if( top <= 0 ) {
                                return;
                            }
                            if( top >= t + h - 20 ) {
                                return;
                            }
                            if( width <= 20 ) {
                                return;
                            }
                            if( width + l >= maxWidth ) {
                                return;
                            }
                            el.style.top = top + "px";
                            el.style.height = ( -( e.clientY - v.t ) + h ) + "px";
                            el.style.width = width + "px";
                            break;
                        case 3 :                        //右方 左右
                            var width = ( e.clientX - v.l );
                            if( width <= 20 ) {
                                return;
                            }
                            if( width + l >= maxWidth ) {
                                return;
                            }
                            el.style.width = width + "px";
                            break;
                        case 4 :                        //右下角
                            var height = ( e.clientY - v.t );
                            var width = ( e.clientX - v.l );
                            if( height <= 20 ) {
                                return;
                            }
                            if( height + t >= maxHeight ) {
                                return;
                            }
                            if( width <= 20 ) {
                                return;
                            }
                            if( width + l >= maxWidth ) {
                                return;
                            }
                            el.style.width = width + "px";
                            el.style.height = height + "px";
                            break;
                        case 5 :                        //下方上下
                            var height = ( e.clientY - v.t );
                            if( height <= 20 ) {
                                return;
                            }
                            if( height + t >= maxHeight ) {
                                return;
                            }
                            el.style.height = height + "px";
                            break;
                        case 6 :                        //左下角
                            var left = ( e.clientX - v.l ) + l;
                            var height = ( e.clientY - v.t );
                            if( left <= 0 ) {
                                return;
                            }
                            if( left >= l + w - 20 ) {
                                return;
                            }
                            if( height <= 20 ) {
                                return;
                            }
                            if( height + t >= maxHeight ) {
                                return;
                            }
                            el.style.height = height + "px";
                            el.style.left = left + "px";
                            el.style.width = ( -( e.clientX - v.l ) + w ) + "px";
                            break;
                        default :                       //左方，左右
                            var left = ( e.clientX - v.l ) + l;
                            if( left <= 0 ) {
                                return;
                            }
                            if( left >= l + w - 20 ) {
                                return;
                            }
                            el.style.left = ( ( e.clientX - v.l ) + l ) + "px";
                            el.style.width = ( -( e.clientX - v.l ) + w ) + "px";
                    }
                    that.draw( el.offsetWidth - 2 , el.offsetHeight -2 ,-el.offsetLeft , -el.offsetTop );
                }
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
                e.stopPropagation ? e.stopPropagation() : e.cancelable = true;
                return false;
            }
        })
    };
    //重绘
    render( url ){
        var viewClip = this.el.querySelector(".viewClip");
        var data;
        if( url instanceof HTMLElement && url.nodeType == 1 && url.nodeName.toLowerCase() === "img" ) {
            data = url.getAttribute("src");
        } else {
            data = url;
        };
        this.image.src = data;
        this.image.onload = () => {
            this.draw( viewClip.offsetWidth - 2 , viewClip.offsetHeight -2 ,-viewClip.offsetLeft , -viewClip.offsetTop );
        }
    };
    getStyle( obj , attr ){
        return window.getComputedStyle ? window.getComputedStyle( obj , false )[attr] : obj.currentStyle[attr];
    };
    full(){
        var p = this.canvas.parentNode;
        var w = this.el.offsetWidth,h = this.el.offsetHeight;

        p.style.width = w + "px";
        p.style.height = h + "px";
        p.style.left = 0;
        p.style.top = 0;

        this.draw( p.offsetWidth -2 , p.offsetHeight - 2 , 0, 0 );
    };
    getImageData(){
        var p = this.canvas.parentNode;
        var data = {
            url : this.canvas.toDataURL("image/png") ,
            x : parseInt( this.getStyle( p , "left" ) ) ,
            y : parseInt( this.getStyle( p , "top" ) ) ,
            w : parseInt( this.getStyle( p , "width" ) ) ,
            h : parseInt( this.getStyle( p , "height" ) )
        }
        return data;
    }
};

export default Clip;