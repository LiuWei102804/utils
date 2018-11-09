(function ( global ) {
    if( typeof global.Vue === "undefined" ) {
        console.error("未发现Vue引用文件");
    } else {
        Vue.component("datePicker",{
            props: ["default","onchange"] ,
            data : function () {
                return {
                    currYear : "" ,
                    currMonth : "" ,
                    currDay : "" ,
                    weekData : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"] ,
                    days : []
                }
            } ,
            mounted : function () {
                this.init();
            } ,
            methods : {
                init : function () {
                    var d;
                    if( Boolean( this.default ) ) {
                        d = new Date( this.default );
                    } else {
                        d = new Date();
                    }

                    this.currYear = d.getFullYear();
                    this.currMonth = d.getMonth() + 1;
                    this.currDay = d.getDate();

                    this.render( this.currYear , this.currMonth );
                } ,
                //
                render : function ( y , m ) {
                    var d = new Date( y + "-" + m );
                    d.setDate( 1 );
                    var weekDay = d.getDay();

                    var days = this.getDays( y , m );
                    var prevDays,nextDays;

                    this.days.length = 0;
                    if( m - 1 == 0 ) {
                        prevDays = this.getDays( y - 1 , "12" );
                    } else {
                        prevDays = this.getDays( y , m - 1 );
                    }
                    if(  m + 1 > 12 ) {
                        nextDays = this.getDays( y + 1 , "1" );
                    } else {
                        nextDays = this.getDays( y , m + 1 );
                    }

                    for( var i = 0, k = ( prevDays - weekDay ) + 1; i < weekDay; i ++ ,  k ++ ) {
                        var Y = m - 1 == 0 ? y - 1 : y;
                        var M = m - 1 == 0 ? 12 : m - 1;
                        var o = {
                            year : Y,
                            month : M ,
                            day :  k ,
                            otherDay : true ,
                            currDay : false ,
                            ms : new Date( Y + "-" + m + "-" + k ).getTime()
                        }
                        this.days.push ( o );
                    }
                    var d2 = new Date();
                    for( var i = 1; i <= days; i ++ ) {
                        var o = {
                            year : y,
                            month : m ,
                            day :  i ,
                            otherDay : false ,
                            currDay : i == d2.getDate() && y == d2.getFullYear() && m == d2.getMonth() + 1 ,
                            ms : new Date( y + "-" + m + "-" + i ).getTime()
                        }
                        this.days.push ( o );
                    }
                    for( var i = 1; i <= 42 - ( weekDay + days ); i ++ ) {
                        var Y = m + 1 > 12 ? y + 1 : y;
                        var M = m + 1 > 12 ? 1 : m + 1;
                        var o = {
                            year : Y,
                            month : M ,
                            day :  i ,
                            otherDay : true ,
                            currDay : false ,
                            ms : new Date( Y + "-" + m + "-" + i ).getTime()
                        }
                        this.days.push ( o );
                    }
                } ,
                //获取月份天数
                getDays : function ( year , month ) {
                    switch( Number( month ) ) {
                        case 1 :
                        case 3 :
                        case 5 :
                        case 7 :
                        case 8 :
                        case 10 :
                        case 12 :
                            return 31;
                        case 4 :
                        case 6 :
                        case 9 :
                        case 11 :
                            return 30;
                        default :
                            if( this.isLeapYear( year ) ) {
                                return 29;
                            } else {
                                return 28;
                            }
                    }
                } ,
                //格式化
                // format : function( fmt ) {
                //     var o = {
                //         "M+" : this.getMonth()+1,                 //月份
                //         "d+" : this.getDate(),                    //日
                //         "h+" : this.getHours(),                   //小时
                //         "m+" : this.getMinutes(),                 //分
                //         "s+" : this.getSeconds(),                 //秒
                //         "q+" : Math.floor((this.getMonth()+3)/3), //季度
                //         "S"  : this.getMilliseconds()             //毫秒
                //     };
                //     if(/(y+)/.test(fmt)) {
                //         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                //     }
                //     for(var k in o) {
                //         if(new RegExp("("+ k +")").test(fmt)){
                //             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                //         }
                //     }
                //     return fmt;
                // } ,
                //是否闰年
                isLeapYear : function ( year ) {
                    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
                } ,
                //上一年
                prevYear : function () {
                    this.currYear = this.currYear - 1 < 1970 ? 1970 : this.currYear - 1;
                    this.render( this.currYear , this.currMonth );
                } ,
                //下一年
                nextYear : function () {
                    this.currYear = this.currYear + 1 > 9999 ? 9999 : this.currYear + 1;
                    this.render( this.currYear , this.currMonth );
                } ,
                //上月
                prevMonth : function () {
                    this.currYear = this.currMonth - 1 == 0 ? this.currYear - 1 : this.currYear;
                    this.currMonth = this.currMonth - 1 == 0 ? 12 : this.currMonth - 1;
                    this.render( this.currYear , this.currMonth );
                } ,
                //上月
                nextMonth : function () {
                    this.currYear = this.currMonth + 1 > 12 ? this.currYear + 1 : this.currYear;
                    this.currMonth = this.currMonth + 1 > 12 ? 1 : this.currMonth + 1;
                    this.render( this.currYear , this.currMonth );
                } ,
                //选中当前日期
                selected : function ( evt , data ) {
                    this.days.forEach(function ( item ,index ) {
                        item.currDay = false;
                    })
                    data.currDay = true;

                    this.onchange && this.onchange( evt , data );
                } ,
                //回到今天
                backToday : function () {
                    var d = new Date();
                    this.currYear = d.getFullYear();
                    this.currMonth = d.getMonth() + 1;
                    this.currDay = d.getDate();
                    this.render(this.currYear,this.currMonth);
                }
            } ,
            template : "<div class=\"date-picker\">\n" +
                        "    <div class=\"date-header borderBox\">\n" +
                        "        <div class=\"date-header-item\">\n" +
                        "            <i class=\"arrow-left\" @click='prevYear'></i>" +
                        "            <span>{{ currYear }}</span>\n" +
                        "            <i class=\"arrow-right\" @click='nextYear'></i>" +
                        "        </div>\n" +
                        "        <div class=\"date-header-item\">\n" +
                        "            <i class=\"arrow-left\" @click='prevMonth'></i>" +
                        "            <span>{{ currMonth }}</span>\n" +
                        "            <i class=\"arrow-right\" @click='nextMonth'></i>" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "    <ul class=\"date-week-item\">\n" +
                        "        <li v-for='(w,i) in weekData' :class=\"{ 'last-week' : i == 0 || i == 6 }\">{{ w }}</li>\n" +
                        "    </ul>\n" +
                        "    <ol class=\"date-days\">\n" +
                        "        <li v-for='(d,i) in days' :class=\"{ 'currDay' : d.currDay , 'last-week-day' : ( i + 1 ) % 7 == 0 || ( i + 1 ) % 7 == 1 , 'otherDay' : d.otherDay }\" @click='selected( $event, d )'>{{ d.day }}</li>\n" +
                        "    </ol>\n" +
                        "    <div class=\"botm borderBox\">\n" +
                        "        <span class=\"today-btn\" @click='backToday'>今天</span>\n" +
                        "    </div>\n" +
                        "</div>"
        })
    }
})(window)
