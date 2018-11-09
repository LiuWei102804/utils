class Ruler {
    constructor( el , options = { label : [0,100] , fill : true } ){
        this.el = el;

        this.events = {
            change : []
        }
        if( options.label.length < 2 ) {
            options.label[1] = options.label[0] + 100;
        }
        options.fillColor = options.fillColor || "burlywood";
        this.options = options;
        this.init();
    };
    init(){
        this.el.style.setProperty("position","relative");

        this.label();
        if( this.options.fill ) {
            this.fill();
        }
    };
    //
    label(){
        var div = document.createElement("div");
        let h = Number.parseFloat( this.getStyle( this.el , "height" ) );
        let styles = {
            'height' : h + 6 + "px" ,
            'width' : h + 6 + "px" ,
            'border-radius' : ( h + 6 ) / 2 + "px" ,
            'position' : "absolute" ,
            'top' : "-3px" ,
            'left' : -( ( h + 6 ) / 2 ) + "px",
            'background' : "burlywood" ,
            'z-index' : 9999 ,
            'cursor' : 'pointer'
        };
        let iconH = 4;
        div.innerHTML = `<i style='position: absolute; width: 0px; height: 0px; border: ${iconH}px solid burlywood; border-bottom-color: transparent; border-left-color: transparent; border-right-color: transparent; left: 50%; margin-left: -4px; bottom:-${iconH * 2 - 1}px; '></i>`;

        this.el.appendChild( div );
        this.setStyle( div , styles );
        this.tagging();
        this.drag( div );
    };
    tagging(){
        var label = this.options.label;
        var target = new Array(),maxRange = label[label.length - 1] - label[0];
        if( typeof label === "number" ) {
            for( let i = 1; i < label; i ++ ) {
                target.push( ( 100 / ( label - 1 ) ) * i );
            }
            target.unshift( 0 );
        } else {
            target = label;
        }
        let maxWidth = Number.parseFloat( this.getStyle( this.el , "width" ) );
        let maxHeight = Number.parseFloat(this.getStyle( this.el , "height" ));
        target.forEach((v,k) => {
            let tarEl = document.createElement("div");
            let text = document.createElement("span");
            this.el.appendChild( tarEl );
            this.el.appendChild( text );

            let left = k == 0 ? 0 : ( k == target.length - 1 ? maxWidth - 2 : maxWidth * ( ( label[k] - label[0] ) / maxRange ) );
            var styles = {
                width : "2px" ,
                height: ( maxHeight / 2 ) + "px" ,
                background:"red" ,
                position: "absolute" ,
                top : maxHeight + "px"  ,
                left : left + "px"
            };
            text.textContent = Number.parseFloat( label[k] );
            this.setStyle( text , { 'font-size' : '12px' } );
            var textStyle = {
                "position"                                          : "absolute" ,
                "height"                                             : '14px' ,
                "top"                                                : "-19px"  ,
                "left"                                               : left - ( text.offsetWidth / 2 ) + "px" ,
                "color"                                              : 'red'
            };
            this.setStyle( tarEl , styles );
            this.setStyle( text , textStyle );

            tarEl.setAttribute("target-label" , left );
            text.setAttribute("target-number" , left - ( text.offsetWidth / 2 ) );
        });
    };
    drag( el ){
        const maxWidth = Number.parseFloat( this.getStyle(this.el , "width") );
        const label = this.options.label;
        let line = Array.prototype.slice.call( this.el.querySelectorAll("[target-label]") );
        let num = Array.prototype.slice.call( this.el.querySelectorAll("[target-number]") );

        el.addEventListener("touchstart" , evt => {
            let e = evt || event;
            let touch = e.changedTouches[0];
            el.dragStart = touch.pageX - ( el.dragMove || 0 );
        },false);
        el.addEventListener("touchmove" , evt => {
            let e = evt || event;
            let touch = e.changedTouches[0];
            el.dragMove = touch.pageX - el.dragStart;

            if( el.dragMove <= 0 )
                el.dragMove = 0;
            if( el.dragMove >= maxWidth )
                el.dragMove = maxWidth;


            if( this.options.fill ) {
                let fill = this.el.querySelector(".ruler-fill");
                this.setStyle( fill , { width : el.dragMove + "px" });

                line.forEach((v,k) => {
                    let max = v.getAttribute("target-label");
                    if( el.dragMove > max ) {
                        this.setStyle( v , { background : this.options.fillColor });
                        this.setStyle( num[k] , { color : this.options.fillColor });
                    } else {
                        this.setStyle( v , { background : "red" });
                        this.setStyle( num[k] , { color : "red" });
                    }
                })
            }

            this.setTransform( el , el.dragMove );
            let data = label[0] + ( el.dragMove / maxWidth ) * ( label[label.length - 1] - label[0] );

            this.fire("change" , data );
        },false);
    };
    //途径元素
    fill(){
        let div = document.createElement("div");
        div.setAttribute("class" , "ruler-fill");
        const styles = {
            "position"                                       : "absolute" ,
            "left"                                            : 0 ,
            "top"                                             : 0 ,
            "width"                                           : "0%" ,
            "height"                                          : "100%" ,
            "border-top-left-radius"                        : "5px" ,
            "border-top-right-radius"                       : "5px" ,
            "background"                                      : this.options.fillColor
        };
        this.setStyle( div , styles );
        this.el.appendChild( div );
    };
    getStyle( obj , attr ){
        return window.getComputedStyle ? window.getComputedStyle( obj , false )[attr] : obj.currentStyle[attr];
    };
    setStyle( obj , attrs ){
        let style = obj.style;
        for( let attr in attrs ) {
            style.setProperty( attr , attrs[attr] );
        }
    };
    setTransform( el , target ){
        el.style.transform = "translateX("+ target +"px)";
        el.style.WebkitTransform = "translateX("+ target +"px)";
        el.style.MozTransform = "translateX("+ target +"px)";
        el.style.OTransform = "translateX("+ target +"px)";
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


};
// Object.defineProperty( Ruler.prototype , "label" , {
//     val(){
//         console.log(111)
//     },
//     get(){
//         return null;
//     } ,
//     set(){
//
//     }
// });
export default Ruler;
