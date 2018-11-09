(function ( global ) {
    "use strict"
    var PromisePlatform = typeof Promise === "undefined";
    if( PromisePlatform ) {
        var PENDING = 'pending';
        var RESOLVED = 'resolved';
        var REJECTED = 'rejected';
        var UNDEFINED = void 0;

        function CallbackItem(promise, onResolved, onRejected) {
            this.promise = promise;
            this.onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
                return v };
            this.onRejected = typeof onRejected === 'function' ? onRejected : function(v) {
                throw v };
        }
        CallbackItem.prototype.resolve = function(value) {
            executeCallbackAsync.bind(this.promise)(this.onResolved, value);
        }
        CallbackItem.prototype.reject = function(value) {
            executeCallbackAsync.bind(this.promise)(this.onRejected, value);
        }

        function getThen(obj) {
            var then = obj && obj.then;
            if (obj && typeof obj === 'object' && typeof then === 'function') {
                return function appyThen() {
                    then.apply(obj, arguments);
                };
            }
        }

        function executeCallback(type, x) {
            var isResolve = type === 'resolve',
                thenable;

            if (isResolve && (typeof x === 'object' || typeof x === 'function')) {
                try {
                    thenable = getThen(x);
                } catch (e) {
                    return executeCallback.bind(this)('reject', e);
                }
            }
            if (isResolve && thenable) {
                executeResolver.bind(this)(thenable);
            } else {
                this.state = isResolve ? RESOLVED : REJECTED;
                this.data = x;
                this.callbackQueue.forEach(function ( v ) {
                    v[type](x)
                });
            }
            return this;
        }

        function executeResolver(resolver) {
            var called = false,
                _this = this;

            function onError(y) {
                if (called) {
                    return; }
                called = true;
                executeCallback.bind(_this)('reject', y);
            }

            function onSuccess(r) {
                if (called) {
                    return; }
                called = true;
                executeCallback.bind(_this)('resolve', r);
            }

            try {
                resolver(onSuccess, onError);
            } catch (e) {
                onError(e);
            }
        }

        function executeCallbackAsync(callback, value) {
            var _this = this;
            setTimeout(function() {
                var res;
                try {
                    res = callback(value);
                } catch (e) {
                    return executeCallback.bind(_this)('reject', e);
                }

                if (res !== _this) {
                    return executeCallback.bind(_this)('resolve', res);
                } else {
                    return executeCallback.bind(_this)('reject', new TypeError('Cannot resolve promise with itself'));
                }
            }, 4)
        }

        function Promise(resolver) {
            if (resolver && typeof resolver !== 'function') {
                throw new Error('Promise resolver is not a function') }
            this.state = PENDING;
            this.data = UNDEFINED;
            this.callbackQueue = [];

            if (resolver) executeResolver.call(this, resolver);
        }
        Promise.prototype.then = function(onResolved, onRejected) {
            if (typeof onResolved !== 'function' && this.state === RESOLVED ||
                typeof onRejected !== 'function' && this.state === REJECTED) {
                return this;
            }

            var promise = new this.constructor();

            if (this.state !== PENDING) {
                var callback = this.state === RESOLVED ? onResolved : onRejected;
                executeCallbackAsync.bind(promise)(callback, this.data);
            } else {
                this.callbackQueue.push(new CallbackItem(promise, onResolved, onRejected))
            }

            return promise;
        }
        Promise.prototype['catch'] = function(onRejected) {
            return this.then(null, onRejected);
        }

        Promise.prototype.wait = function(ms) {
            var P = this.constructor;
            return this.then(function(v) {
                return new P(function(resolve, reject) {
                    setTimeout(function() { resolve(v); }, ~~ms)
                })
            }, function(r) {
                return new P(function(resolve, reject) {
                    setTimeout(function() { reject(r); }, ~~ms)
                })
            })
        }
        Promise.prototype.always = function(fn) {
            return this.then(function(v) {
                return fn(v), v;
            }, function(r) {
                throw fn(r), r;
            })
        }
        Promise.prototype.done = function(onResolved, onRejected) {
            this.then(onResolved, onRejected).catch(function(error) {
                setTimeout(function() {
                    throw error;
                }, 0);
            });
        }

        Promise.resolve = function(value) {
            if (value instanceof this) return value;
            return executeCallback.bind(new this())('resolve', value);
        }
        Promise.reject = function(value) {
            if (value instanceof this) return value;
            return executeCallback.bind(new this())('reject', value);
        }
        Promise.all = function(iterable) {
            var _this = this;
            return new this(function(resolve, reject) {
                if (!iterable || !Array.isArray(iterable)) return reject(new TypeError('must be an array'));
                var len = iterable.length;
                if (!len) return resolve([]);

                var res = Array(len),
                    counter = 0,
                    called = false;

                iterable.forEach(function(v, i) {
                    (function(i) {
                        _this.resolve(v).then(function(value) {
                            res[i] = value;
                            if (++counter === len && !called) {
                                called = true;
                                return resolve(res)
                            }
                        }, function(err) {
                            if (!called) {
                                called = true;
                                return reject(err);
                            }
                        })
                    })(i)
                })
            })
        }
        Promise.race = function(iterable) {
            var _this = this;
            return new this(function(resolve, reject) {
                if (!iterable || !Array.isArray(iterable)) return reject(new TypeError('must be an array'));
                var len = iterable.length;
                if (!len) return resolve([]);

                var called = false;
                iterable.forEach(function(v, i) {
                    _this.resolve(v).then(function(res) {
                        if (!called) {
                            called = true;
                            return resolve(res);
                        }
                    }, function(err) {
                        if (!called) {
                            called = true;
                            return reject(err);
                        }
                    })
                })
            })
        }
        Promise.stop = function() { return new this(); }
        Promise.deferred = Promise.defer = function() {
            var dfd = {};
            dfd.promise = new Promise(function(resolve, reject) {
                dfd.resolve = resolve;
                dfd.reject = reject;
            })
            return dfd
        }
        Promise.timeout = function(promise, ms) {
            return this.race([promise, this.reject(new TimeoutError('Operation timed out after ' + ms + ' ms')).wait(ms)]);
        }
        Promise.sequence = function(tasks) {
            return tasks.reduce(function(prev, next) {
                return prev.then(next).then(function(res) {
                    return res });
            }, this.resolve());
        }


        function TimeoutError(message) {
            this.message = message || '';
            this.stack = (new Error()).stack;
        }
        TimeoutError.prototype = Object.create(Error.prototype);
        TimeoutError.prototype.constructor = TimeoutError;
        if(!global.TimeoutError) global.TimeoutError = TimeoutError;

        global.Promise = Promise;
    }



    var Request;
    var gFetch = typeof global.fetch === "undefined";

    var stringJSON = function ( obj ) {
        var str = "";
        for( var attr in obj ) {
            str += attr + "=" + obj[attr] + "&";
        }
        return str.length > 0 ? str.substring(0,str.length - 1) : str;
    } ;
    if( gFetch ) {
        var promise = new Promise(function ( resolve, reject ) {
            var xml = new XMLHttpRequest();
            Request = function ( url , method , option ) {
                if( !navigator.onLine ) {
                    reject({ code : 401 , msg : "您的网络已断开，请检查网络连接。" });
                }
                var hashStr = "";
                var type = Object.prototype.toString.call( option );
                if( type === "[object Object]" ) {
                    if( option instanceof FormData )
                        hashStr = option;
                    else
                        hashStr += stringJSON( option );
                } else if( type === "[object String]" ) {
                    hashStr += option;
                } else if( type === "[object Array]" ){

                } else {                                //null , undefined , boolean , number

                }
                if( method.toLowerCase() == "get" ) {
                    url = hashStr.length > 0 ? url + "?" + hashStr : url;
                    xml.open( method , url , true );
                    xml.timeout = 30000;
                    xml.setRequestHeader("If-Modified-Since","0");
                    xml.send();
                } else {
                    xml.open( method , url , true );
                    xml.timeout = 30000;
                    if( !( hashStr instanceof FormData ) )
                        xml.setRequestHeader( "Content-type" , "application/x-www-form-urlencoded" );
                    xml.send( hashStr );
                }
                xml.onload = function () {
                    try{
                        resolve( JSON.parse( xml.responseText ) );
                    } catch ( e ) {
                        reject( { code : 404 , msg : "指定资源不存在或者请求类型错误"} );
                    }
                }
                xml.ontimeout = function () {
                    reject( { code : xml.status  , msg : "请求超时，请重试" } );
                }
                xml.onerror = function () {
                    reject( { code : xml.status  , msg : "请求出错，请重试" } );
                }
                xml.onabort = function () {
                    reject( { code : xml.status  , msg : "请求被取消" } );
                }
                return promise;
            };
        })
    } else {
        var timeoutPromise = function ( promise, ms ) {
            var timeoutAction = null;
            var timerPromise = new Promise(function (resolve, reject) {
                timeoutAction = function () {
                    reject({ code : 504  , msg : "请求超时"  });
                }
            })
            var t = setTimeout(function () {
                timeoutAction();
                clearTimeout( t );
            }, ms )
            return Promise.race( [promise, timerPromise] );
        };
        var checkStatus = function( response ) {
            if ( response.status >= 200 && response.status < 300 ) {
                return response;
            }
            return { code : 100000 , msg : "十万个为什么" }
        };
        var parseJSON = function ( response ) {
            if( typeof response.json === "function" ) {
                return response.json();
            }
            return { code : 100000 , msg : "十万个为什么" }
        };
        Request = function ( url, options ) {
            console.log( url , options )
            // if( !navigator.onLine ) {
            //     return { code : 401 , msg : "您的网络已断开，请检查网络连接。" };
            // }
            return timeoutPromise( fetch( url , options ) , 30000 )
                .then( checkStatus )
                .then( parseJSON )
                .then(function ( data ) {
                    return data;
                })
                .catch(function ( err ) {
                    return err;
                });
        };
    }

    /* =====  GET  ====*/
    if( typeof global.Get === "undefined" ) {
        if( gFetch ) {
            global.Get = function ( url , data ) {
                return Request( url , "Get" , data );
            }
        } else {
            global.Get = function ( url , data ) {
                url = stringJSON( data ).length > 0 ? url + "?" + stringJSON( data ) : url;
                var opt = {
                    method : "GET" ,
                    credentials : "include" ,
                    headers: {
                        "Content-Type" : "application/x-www-form-urlencoded"
                    }
                };
                return Request( url , opt );
            }
        };
    } else {
        console.error( "Get命名冲突,请检查" )
    }

    /* ====    POST   ==== */
    if( typeof global.Post === "undefined" ) {
        if( gFetch ) {
            global.Post = function ( url , data ) {
                return Request( url , "Post" , data );
            }
        } else {
            global.Post = function ( url , data ) {
                var header = data instanceof FormData ?
                    {} :
                    { "Content-Type" : "application/x-www-form-urlencoded" };
                var opt = {
                    body : data instanceof FormData ? data : stringJSON( data ),
                    method : "POST" ,
                    credentials : "include" ,
                    headers: header
                };
                return Request( url , opt );
            }
        };
    } else {
        console.error( "Post命名冲突,请检查" )
    }

    /* ====  JSONP  ==== */
    global.Jsonp = global.Jsonp || function ( url , data , callback ) {
        var promise = new Promise(function ( resolve, reject ) {
            var fn = ( "cb" + Math.random() * 1000000 ).replace(/\./g,"");

            global[fn] = function ( res ) {
                console.log( res )
                if( Boolean( res ) ) {
                    resolve( res );
                } else {
                    reject( { code : 404 , msg : "指定资源不存在或者请求类型错误"} );
                }
                global[fn] && delete global[fn];
            };

            if( typeof data !== "undefined" ) {
                var hashStr = "";
                var type = Object.prototype.toString.call( data );
                if( type === "[object Object]" ) {
                    hashStr += stringJSON( data );
                }
                if( type === "[object String]" ) {
                    hashStr += data;
                }
                url = hashStr.length > 0 ? url + "?" + hashStr + "&" + callback + "=" + fn : url + "?" + callback + "=" + fn;
            }
            var head = global.document.head;
            var sc = document.createElement("script");
                sc.type = "text/javascript";
                sc.src = url;

            head.appendChild( sc );
            sc.onload = sc.onerror = function () {
                head.removeChild( sc );
            }

        })
        return promise;
    }

    /* ====  上传文件  ==== */
    global.Upload = global.Upload || function ( el , url , filter ) {
        //var isEl = typeof el === "string" ?
        el.onchange = function () {
            var files = Array.prototype.slice.call( this.files );
            var fd = new FormData();
            files.forEach(function ( v , k ) {
                fd.append( "file" + k , v )
            })
            global.Post( url , fd ).then(function ( res ) {
                console.log( res )
            },function ( err ) {
                console.log(err  )
            });
        }
    }
})( window );

