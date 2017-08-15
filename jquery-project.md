### 通用的工具函数

#### 页面组件基类
```
(function(){

	var widget = function(attribute){

		this.name = '';

		this.data = {};

		this.tplname = null;

		this.methods = {};

		this.create = function(){};

		this.mounted = function(){};

		this.destory = function(){};

		this._init = function(option){

			for(var key in option){

				this[key] = option[key];
			}

			var self = this;

			for(var fname in self.methods){

				if(self[fname]){

					console.error('[widget] : ' + self.name + ' 方法定义重复！');

				}else{

					self[fname] = bind(self.methods[fname],self);

					self.methods[fname] = self[fname];
				}
			}
		};

		this._event = function(){

			var self = this;

			this.$dom.find('[v-click]').each(function(idx,dom){

				dom = $(dom);

				var fun_name = dom.attr('v-click');

				$(dom).on('click',self.methods[fun_name]);
			});

			this.$dom.find('[v-mode]').each(function(idx,dom){

				dom = $(dom);

				var mode_name = dom.attr('v-mode');
				
				$(dom).on('input propertychange',function(){

					self.data[mode_name] = this.value;
				});
			});
		};

		this._render = function(){

			var self = this;
			
			if(document.readyState!='complete'){

				$(document).ready(function(){

					self.$dom = $('[v-templete='+self.tplname+']');
                     
					self._event();

					self.mounted();
				});

			}else{

				self.$dom = $('[v-templete='+self.tplname+']');

				this._event();

				this.mounted();
			}
		}

		this._init(attribute);

		this.create();

		this._render();
	}

	var widgetbuilder = function(option){

		return new widget(option);
	}

	window.widget = widgetbuilder;
})();

```

#### ajax的封装

```
(function(cfg) {
   var _ajax= {};

   _ajax.init= function() {

   }

   _ajax.send= function(url, method, data, callback) {
       var option= {
          data: null,
          dataType: 'json',
          contentType: 'application/json'
        }
        
        if(data && typeof data == 'object' && (data.dataType||data.contentType||data.data) ){

            for(var key in data){

                option[key] = data[key];
            }

        }else{

            option.data = data;
        }

        var cmd = url.split('?')[0];

		var api = Interface[cmd]||null , apiKey;

		if(data && data.apiKey){

			apiKey = data.apiKey;

		}else{

			if(api && api.operation && api.operation[0]){

				apiKey = api.operation[0];

			}else{

				apiKey = null;
			}
		}

        $.ajax({
            type:method,
            url:cfg.baseurl+url,
            contentType:option.contentType,
            dataType:option.dataType,
            data:option.data,
            beforeSend: function(request) {

                request.setRequestHeader('X-Access-Token', token);
                
                if(apiKey && operations[apiKey]){

                    request.setRequestHeader('X-Operation-Token',apiKey+':'+operations[apiKey]);

                }else{

                    request.setRequestHeader('X-Operation-Token','');
                }
                
            },
            success:function(data){
                
                if(typeof callback == 'function'){

                    callback(null,data);
                }
            },
            error:function(err){
                
                var errinfo = null;

                if(err.status == 401){

                    window.location.href = "login.html";

                    return;
                }

                if(err.responseText){

                    errinfo = JSON.parse(err.responseText);

                    console.error('接口请求错误 : '+errinfo.path);

                    console.error('接口错误信息 : '+errinfo.message);

                    if(typeof callback == 'function'){

                        if(window.RunEnv == 'dev' && typeof showMessage == 'function'){

                            showMessage({'type':'error','message':'接口请求错误:'+errinfo.path+' 【<font color="red">state:'+err.status+'</font>】'});
                        }

                        //callback(errinfo||err,null);
                    }
                }
            }
    });


   }

   _ajax.init();

	var Ajax = {},_methods = ['get','post','put','del'];

	for(var i=0;i<_methods.length;i++){

		Ajax[_methods[i]] = (function(method){
            if(method == 'del') {
				method= 'delete';
			} 
			return function(url,data,callback){

				_ajax.send(url,method,data,callback);
			}

		})(_methods[i]);
	}

	Ajax.call = function(alias,method,data,callback){

		var api = null , url;

		for(url in Interface){

			if(Interface[url]['alias'] == alias){

				api = Interface[url];

				break;
			}
		}

		_ajax.send(url,method,data,callback);
	}

	window.Ajax = Ajax;
})(cfg)
```

### 下拉加载组件的封装
>扩展$.fn,在方法内部new一个实例，用面向对象的写法在当前dom上绑定scroll事件，来触发下拉加载

```
(function($) {

	var ScrollLoading = function(dom,options){

		var self = this;

		this.$dom = $(dom);

		this.no_more = false;

		this.loading_lock = false;

		this.cfg = $.extend({
			'fireDistence':10,
			'callback':function(){}
		},options);

		this.$dom.on('scroll',function(evt){
			
			if(!self.loading_lock && !self.no_more){
				// console.log(self.$dom.get(0).scrollHeight , self.$dom.get(0).scrollTop , self.$dom.height());
				if(self.$dom.get(0).scrollHeight-self.$dom.get(0).scrollTop-self.$dom.height()<=self.cfg.fireDistence){

					self.loading_lock = true;

					self.cfg.callback();
				}
			}
		});

		this.lock = function () {
			self.loading_lock = true;
		}

		this.unLock = function(){

			self.loading_lock = false;
		}

		this.noMore = function(){

			self.no_more = true;
		}

		this.reset = function(){

			self.no_more = false;

			self.loading_lock = false;
		}
		this.destory = function(){

			var sl = self.$dom.data('scrollloading');

			sl = null;

			self.$dom.data('scrollloading',null);

			self.$dom.unbind('scroll');
		}
	}

  	return $.fn.scrollLoading = function(options) {

  		if(this.data('scrollloading')){

  			var scrollloading = this.data('scrollloading');

  			if(options){

  				scrollloading.cfg = $.extend(scrollloading.cfg,options);
  			}

  			return scrollloading;
  		}

    	var hashsl = new ScrollLoading(this, options);

    	this.data('scrollloading',hashsl);

    	return hashsl;
  	};
})(jQuery);
```
