(function ( global ) {
    "use strict"
    var UtilPlatform = typeof global.Util === "undefined";
    if( UtilPlatform ) {
        var Util = {
            //获取cookie
            getCookie : function ( key ) {
                var reg = new RegExp("(^| )"+ key + "=([^;]*)(;|$)"),
                    arr = document.cookie.match( reg );
                return arr ? atob( arr[2] ) : null;
            } ,
            //设置cookie
            setCookie : function ( key , val , limit ) {
                if( val instanceof Object ) val = JSON.stringify( val );

                val = Object.prototype.toString.call( val ) === "[object String]" ? val : String( val );
                var Days = limit || 30;
                var exp = new Date();
                exp.setTime( exp.getTime() + Days * 86400000 );
                document.cookie = key + "="+ btoa( val ) + ";expires=" + exp.toGMTString();
            } ,
            //删除cookie
            remCookie : function ( key ) {
                var exp = new Date();
                exp.setTime( exp.getTime() - 1);
                var cval = this.getCookie( key );
                if( cval != null )
                    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
            } ,
            //获取URL参数
            getHashCode : function ( key ) {
                if( !Boolean( key ) ) return null;
                var search = location.search.replace(/\?*/,"");
                var start = search.indexOf( key ),
                    str = search.substring( start , search.indexOf("&",start) == -1 ? search.length : search.indexOf("&",start) );

                return start < 0 ? null : str.replace( new RegExp( key + "="), "" );
            } ,
            //将base64转换为文件
            dataURLtoFile : function (dataurl, filename) {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length,
                    u8arr = new Uint8Array( n );
                while( n-- ){
                    u8arr[n] = bstr.charCodeAt( n );
                }
                return new File([u8arr], filename, {type:mime});
            } ,
            //转换图片至base64
            dataToBase64 : function ( url ) {
                var data = typeof url === "string" ? url : url.getAttribute("src");
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                var img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = data;
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage( img , 0 , 0 );
                    var dataURL = canvas.toDataURL('image/png');
                    canvas = null;img = null;
                    return dataURL;
                };
            } ,
            //复制文本
            copyText : function ( text ) {
                var _text = typeof text === "string" ? text : "";
                var input = document.createElement("input");
                input.setAttribute("value" , _text );
                input.style.setProperty("position" , "absolute");
                input.style.setProperty("left" , "-99999px");
                document.body.appendChild( input );

                input.select();
                document.execCommand("copy");
                document.body.removeChild( input );
            } ,
            //移动端检测
            isPhone : function () {
                return (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
            } ,
            //安卓检测
            isAndroid : function () {
                return navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Adr") > -1;
            } ,
            //ios检测
            isIos : function () {
                return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            }
        }
        global.Util = Util;
    } else {
        console.error("Util 命名冲突，请检查");
    }
})( window );