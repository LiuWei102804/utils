(function ( global ) {
    "use strict"
    var PatternPlatform = typeof global.Pattern === "undefined";
    if( PatternPlatform ) {
        var Pattern ={
            //手机号验证
            isPhone : function ( val ) {
                return /^1[3|4|5|7|8|6|9][0-9]{9}$/.test( val );
            },
            //email验证
            isEmail : function ( val ) {
                return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test( val );
            },
            //数字验证
            // if n 最少 n 位
            // if m n - m 位
            isNumber : function ( val , n , m ) {
                return new RegExp("^\\d{" + ( n || "0" ) + ","+ ( m || "" ) +"}$").test( val );
            },
            //(正负数)带有小数验证
            // if n 最少 n 位
            // if m n - m 位
            isDecimal : function ( val , n , m  ) {
                return new RegExp("^(\\-)?\\d+(\\.\\d{"+ ( n || 1 ) +","+ ( m || "" ) +"})$").test( val )
            } ,
            //汉字验证
            isChinese : function ( val ) {
                return /^[\u4e00-\u9fa5]{0,}$/.test( val );
            } ,
            //英文和数字（一般用于密码）
            // if n 最少 n 位
            // if m n - m 位
            isEnglishAndNumber : function ( val , n , m ) {
                return new RegExp("^[A-Za-z0-9]{"+ ( n || "0" ) + "," + ( m || "" ) +"}$").test( val );
            } ,
            //身份证验证
            isIdCardNo : function ( val ) {
                return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test( val );
            } ,
            //前后空格验证( bol 清除空格 )
            isSpace : function ( val , bol ) {
                if( Boolean( bol ) ) return val.replace(/^\s|\s$/g,"");
                return /^\s|\s$/.test( val );
            } ,
            //url验证( http | https ) 支持携带参数#|?
            isUrl : function ( val ) {
                return /^(http|https):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]{1,})*(\.[a-zA-Z]{2,})|(\.[a-zA-Z]{2,}\?|#.)$/.test( val );
            } ,
            //时间格式验证 ( yyyy-MM-dd yyyy/MM/dd | yyyy-MM-dd hh:mm:ss yyyy/MM/dd hh:mm:ss )
            isDate : function ( val ) {
                return /^(\d{4})(-|\/)(\d{2})(-|\/)(\d{2}(\s\d{2}:\d{2}:\d{2})*)$/.test( val );
            } ,
            //html验证
            isHtml : function ( val ) {
                var _val = typeof val === "string" ? val.replace(/\s/g,"") : "";
                return /^<[a-zA-Z]+.*(>|\/>)*([\s\n\t\r]*.)*(>|\/>)$/.test( _val );
            } ,
            //纯字母验证 不区分大小写
            // if n 最少 n 位
            // if m n - m 位
            isEnglish : function ( val , n , m ) {
                var _val = typeof val === "string" ? val : "";
                return new RegExp("^[a-zA-Z]{"+ ( n || 1 ) +","+ ( m || "" ) +"}$").test( _val );
            } ,
            //座机号码验证 ( 021-88888888 , 0574-6757897 )
            isSeatMachine : function ( val ) {
                return /^(02[0-9]-\d{8})|(0\d{3}-\d{7,8})$/.test( val );
            }
        };
        global.Pattern = Pattern;
    } else {
        console.error("Pattern 命名冲突，请检查");
    }
})(window)