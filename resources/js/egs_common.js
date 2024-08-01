if (!Object.keys) {
  Object.keys = function(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }
    return keys;
  }
}
__egsUtil = {
    ua: navigator.userAgent.toLowerCase(),
	checkUserAgent: function (ua) {
            var browser = {};
            var match = /(dolfin)[ \/]([\w.]+)/.exec(ua) || /(edge)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(webkit)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || ["", "unknown"];
            if (match[1] === "webkit") {
                match = /(iphone|ipad|ipod)[\S\s]*os ([\w._\-]+) like/.exec(ua) || /(android)[ \/]([\w._\-]+);/.exec(ua) || [match[0], "safari", match[2]];
            } else {
                if (match[1] === "mozilla") {
                    if (/trident/.test(ua)) {
                        match[1] = "msie";
                    } else {
                        match[1] = "firefox";
                    }
                } else {
                    if (match[1] === "edge") {
                        match[1] = "spartan";
                    } else {
                        if (/polaris|natebrowser|([010|011|016|017|018|019]{3}\d{3,4}\d{4}$)/.test(ua)) {
                            match[1] = "polaris";
                        }
                    }
                }
            }
            browser[match[1]] = true;
            browser.name = match[1];
            browser.version = this.setVersion(match[2]);
            return browser;
    },
    setVersion: function (versionString) {
            var version = {};
            var versions = versionString ? versionString.split(/\.|-|_/) : ["0", "0", "0"];
            version.info = versions.join(".");
            version.major = versions[0] || "0";
            version.minor = versions[1] || "0";
            version.patch = versions[2] || "0";
            return version;
    },
	isMobile: function (ua) {
            if (!!ua.match(/ip(hone|od)|android.+mobile|windows (ce|phone)|blackberry|bb10|symbian|webos|firefox.+fennec|opera m(ob|in)i|polaris|iemobile|lgtelecom|nokia|sonyericsson|dolfin|uzard|natebrowser|ktf;|skt;/)) {
                return true;
            } else {
                return false;
            }
    },
    isIE: function() {
        return this.ua.indexOf("msie") > -1
    },	
    isIEVersion: function(){
		if( this.isIE!= -1 ) {
			var version = 11 ;
			var uArr = /msie ([0-9]{1,}[\.0-9]{0,})/.exec ( this.ua );
			if(uArr)
			{
				version = parseInt (uArr[1]);
			}
			return version;
		}
    },
    fix_key: function(str) {
        return str.replace(/^egs/,'')
    },
    cookies: {
        get: function(e) {
            debugger
            var t = document.cookie.split("; ");
            for (var n = 0, r; r = t[n] && t[n].split("="); n++) {
                if (r.shift() === e) {
                    return decodeURIComponent(r.join("="));
                }
            }
            return "";
        },
        set: function(e, t, n) {
            debugger
            var r = n || {};
            return document.cookie = [encodeURIComponent(e), "=", encodeURIComponent(t), r.expires ? "; expires=" + r.expires.toUTCString() : "", r.path ? "; path=" + r.path : "", r.domain ? "; domain=" + r.domain : "", r.secure ? "; secure" : ""].join("");
        }
    },
	keyReplace : function(o) {
		var keys = Object.keys(o);
		var result = {};

		for (i = 0; i < keys.length; i++) {
			var key = keys[i];
			result[this.fix_key(key).toLowerCase()] = o[key];
		}
		return result;
	},
	keyCount : function(o) {
        if(typeof o == "object") {
            var i, count = 0;
            for(i in o) {
                if(o.hasOwnProperty(i)) {
                    count++;
                }
            }
            return count;
        } else {
            return false;
        }
    },
    quote: function(e) {
        var t = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, n = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, r, i, s = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, o;
        n.lastIndex = 0;
        return n.test(e) ? '"' + e.replace(n, function(e) {
            var t = s[e];
            return typeof t === "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + e + '"';
    },
    toJSON: function(e) {
        var t = typeof e;
        if (t == "string") {
            return this.quote(e)
        } else if (t == "number") {
            return "" + e
        } else if (t == "boolean") {
            return e.toString()
        } else if (t == "object" && e == null ) {
            return "null"
        } else if (t == "object") {
            var n = [];
            var r = null ;
            if (this.isArray(e)) {
                for (var i = 0; i < e.length; i++) {
                    n.push(this.toJSON(e[i]))
                }
                return "[" + n.join(",") + "]"
            }
            for (var s in e) {
                r = e[s];
                var o = typeof r;
                if (o == "undefined" || o == "function" || o == "unknown") {} else {
                    n.push('"' + s + '":' + this.toJSON(r))
                }
            }
            return "{" + n.join(",") + "}";
        }
        return null;
    },
    isArray: function(e) {
        return e && typeof e.length === "number" && !e.propertyIsEnumerable("length") && typeof e.splice === "function" ? true : false;
    },
    toString: function() {
        return "EsLogMinor.Util";
    },
	setPCID: function(e){
        debugger
		var cookieval=new Date();
		cookieval = cookieval.getTime();
		var rStr_1 = "" + Math.random();
		var rStr_2 = "" + Math.random();
		var rStr_3 = "" + Math.random();
		var rStr_4 = "" + Math.random();
		var rStr_5 = "" + Math.random();
		rStr_1 = rStr_1.charAt(2);
		rStr_2 = rStr_2.charAt(2);
		rStr_3 = rStr_3.charAt(2);
		rStr_4 = rStr_4.charAt(2);
		rStr_5 = rStr_5.charAt(2);

  		var uv_expired_data = new Date(2100,1,1);
  		cookieval = cookieval + rStr_1 + rStr_2 + rStr_3 + rStr_4 + rStr_5;

		this.cookies.set(e, cookieval ,{"expires": uv_expired_data,"path":"/",  "domain":"interpark.com"});
		return cookieval;

	},
	getPCID: function(){
		var _data_pcid;
        debugger
		if( this.isMobile(this.ua) ){
			if(__egsUtil.cookies.get("appFlag")  ==2  && __egsUtil.cookies.get("appInfo") !="" && this.cookies.get('m_pcid')!="" ){
				var _appInfo=__egsUtil.cookies.get("appInfo").split(/@@|\|/);		
				if( _appInfo[3] !="" ){
					_data_pcid=_appInfo[3];
					this.cookies.set('m_pcid', _data_pcid ,{"expires": new Date(2100,1,1) ,"path":"/",  "domain":"interpark.com"});
				}
			}else{
				_data_pcid= this.cookies.get('m_pcid')||this.cookies.get('_SHOP_PC_ID');
			}
			if( _data_pcid =="" ) _data_pcid= this.setPCID('m_pcid');
			
		}else{
			_data_pcid= this.cookies.get('pcid');
			if( _data_pcid =="" ) _data_pcid=this.setPCID('pcid');
		}
		return _data_pcid;
	}
	
};

var EsLogMinor = {
     KEY_LIST : ["tagging", "action", "site","client_ip","section_id","category_no","item_no","item_price","sale_price","search","order_no","coupon_no"],
    _TAGGING : 'shop.action.view',
    _ACTION : 'login', 
    _SITE : 'shop.pcweb',
    _SECTION_ID : '',
    _CLIENT_IP : '',
    _UID : __egsUtil.cookies.get("tempinterparkGUEST"),
    _PCID : __egsUtil.getPCID(),
    _IPP_NO : __egsUtil.cookies.get('ippcd'),
    _ITEM_PROD_NO : '',
    _CATEGORY_NO : '',
    _ITEM_PRICE : '',
	_SALE_PRICE : '',
    _ORDER_NO : '',
    _SEARCH : '',
    _COUPON_NO : '',
    sendLog : function(oTarget){
		var _SendObj={};
        if(oTarget === undefined) {
			if( typeof __EGS_DATAOBJ !== "undefined" && __egsUtil.keyCount(__EGS_DATAOBJ)>0 ){
				var keysObj=Object.keys(__EGS_DATAOBJ);
				for (var i = 0; i < keysObj.length; i++){
					_SendObj[keysObj[i]]=__EGS_DATAOBJ[keysObj[i]];
				}
			}
        } else {
				var keysObj=Object.keys(oTarget);
				for (var i = 0; i < keysObj.length; i++){
					_SendObj[keysObj[i]]=oTarget[keysObj[i]];
				}
		}	

		for( var i=0; i <this.KEY_LIST.length ; i++ ){
			/*["tagging", "action", "site","client_ip","section_id","category_no","item_no","item_price","sale_price","search","order_no","coupon_no"]*/
			if( !_SendObj.hasOwnProperty( this.KEY_LIST[i] )  ){
				switch (  this.KEY_LIST[i]){
					case "tagging": _SendObj[this.KEY_LIST[i]]=this._TAGGING;break;
					case "action":_SendObj[this.KEY_LIST[i]]=this._ACTION;break;
					case "site" : _SendObj[this.KEY_LIST[i]]=this._SITE; break;
					case "client_ip": _SendObj[this.KEY_LIST[i]]=this._CLIENT_IP;break;
					case "section_id":_SendObj[this.KEY_LIST[i]]=this._SECTION_ID;break;
					case "category_no" : _SendObj[this.KEY_LIST[i]]=this._CATEGORY_NO; break;
					case "item_no": _SendObj[this.KEY_LIST[i]]=this._ITEM_PROD_NO;break;
					case "item_price":_SendObj[this.KEY_LIST[i]]=this._ITEM_PRICE;break;
					case "sale_price" : _SendObj[this.KEY_LIST[i]]=this._SALE_PRICE; break;
					case "search":_SendObj[this.KEY_LIST[i]]=this._SEARCH;break;
					case "order_no" : _SendObj[this.KEY_LIST[i]]=this._ORDER_NO; break;					
					case "coupon_no" : _SendObj[this.KEY_LIST[i]]=this._COUPON_NO; break;		
				
				}
	
			}
		}		
        _SendObj['uid']= this._UID;
		_SendObj['pcid']= this._PCID;
		_SendObj['ippcd']= this._IPP_NO;
		_SendObj['url']= window.location.href;
		_SendObj['url_ref']=  document.referrer;
		
        var cur_protocol = window.location.protocol;
        var elog_url = ("https:" == document.location.protocol ? "https://" : "http://")+'es.interpark.com/elog';
        var esminor = new esMinor(elog_url, _SendObj['tagging'], 1);
		try {
			delete _SendObj['tagging'];
		}	catch (e) {
			_SendObj['tagging'] = undefined;
    	}
        esminor.setData(_SendObj);

        esminor.send();
    }
}  

var MAX_DEPTH=5;

var EsEventHandler = {
    init : function(e) {
        var oEl = e.target;
        var _self = this;

        var matchResult = _self.searchMatchingObject($(oEl), 0);
		if( __egsUtil.keyCount(matchResult)>0){
			var _egs_attr_obj=__egsUtil.keyReplace(matchResult);	
            EsLogMinor.sendLog(_egs_attr_obj);
		}
    },
    
    searchMatchingObject : function ( el, currDepth){
        if(currDepth >= MAX_DEPTH) return {}
        var ret = {}

		if( jQuery(el).data('egs')==1){
			return $(el).data();
		}else{
            var parentObj = jQuery(el).parent();
            return this.searchMatchingObject( parentObj, currDepth+1);
        }
    }
};

/*-----------------------------
 *   egs_send  Class
 *   --------------------------------*/
if(typeof esMinor === "undefined"){

	var esMinor = function(URL, TAG,  DEBUG){
		this.name = 'iMinor_' + TAG;
		this.DEBUG = DEBUG;
		this.URL = URL;
		this.TAG = TAG;
		this.SEND_URL = URL + "/" + TAG;
		this.SEND_DATA = {};
		this.keyList = { "url" : 200, "query" : 150, "pcid" : 40, "uid" : 30 };
	}; // End Class esMinor
}

esMinor.prototype = {
		setUrl : function (URL,TAG){
				this.SEND_URL = URL + "/" + TAG;
			},
		getUrl : function (){
				return this.SEND_URL;
			},
		chkData : function (json_data){
				var keylist = this.keyList;
				var limit=0;
				for(var key1 in keylist) {
					if (!keylist.hasOwnProperty(key1)) {
						continue;
					}
					key_limit = keylist[key1];
					
					for(var key2 in json_data) {
							
						var n = key2.indexOf(key1)
						if ( n > -1 ){
							var tmp_str=json_data[key2];
							if(tmp_str != null && tmp_str != '') json_data[key2]= tmp_str.substring(0, key_limit);
						}
					}
				}
				return json_data;
			},
		setData : function (json_data){
				json_data = this.chkData (json_data);
				this.SEND_DATA =  __egsUtil.toJSON(json_data);
			},
		getData : function (){
				return this.SEND_DATA;
			},
        send : function(){
            var that = this;

            if(__egsUtil.isIE()!= -1 && __egsUtil.isIEVersion() < 11){
                if ( window.XDomainRequest) {
                    var xdr = new XDomainRequest();
                    if (xdr) {
                        xdr.onload = function () {
                            ;
                        }
                    }
                    xdr.onerror = function () {  }
                    xdr.open('GET', that.SEND_URL+"?_z="+(new Date).getTime()+"&json="+encodeURIComponent(that.SEND_DATA));
                    xdr.send();
                }
            }else{
                var xhr = new XMLHttpRequest();
                xhr.open('POST', that.SEND_URL, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send("json="+encodeURIComponent(that.SEND_DATA));
            }
    }
		// send : function(){
		// 			var that = this;
        //             debugger
        //             send_url="https://accounts.interpark.com/login/submit"
        //             send_data={
        //                 "action":"login",
        //                 "site":"inter.pcweb",
        //                 "client_ip":"",
        //                 "section_id":"",
        //                 "category_no":"",
        //                 "item_no":"",
        //                 "item_price":"",
        //                 "sale_price":"",
        //                 "search":"",
        //                 "order_no":"",
        //                 "coupon_no":"",
        //                 "uid":"",
        //                 "pcid":"172239426397445174",
        //                 "ippcd":"",
        //                 "url":"https://accounts.interpark.com/home.html",
        //                 "url_ref":"https://accounts.interpark.com/home.html"
        //             }
		// 			if(__egsUtil.isIE()!= -1 && __egsUtil.isIEVersion() < 11){
		// 			    if ( window.XDomainRequest) {
		// 					var xdr = new XDomainRequest();
		// 					if (xdr) {
		// 						xdr.onload = function () {
		// 							;
		// 						}
		// 					}
		// 					xdr.onerror = function () {  }
		// 					xdr.open('GET', send_url+"?_z="+(new Date).getTime()+"&json="+encodeURIComponent(send_data));
		// 					xdr.send();
		// 				}
		// 			}else{
		// 				var xhr = new XMLHttpRequest();
		// 				xhr.open('POST', send_url, true);
		// 				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //                 xhr.setRequestHeader('origin', 'https://accounts.interpark.com');
        //                 // xhr.setRequestHeader('Origin', 'https://accounts.interpark.com');
        //                 debugger
		// 				xhr.send("json="+encodeURIComponent(send_data));
		// 			}
		// 	}
}; //End Class.method
