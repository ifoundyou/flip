/**
 * @name MT
 * @author WangHongxin (QQ:2262118088)
 * @date 2014-12-29 01:33
 */
//工具库
var M=function(){
	var counter=1,//沙箱唯一标示
		MT=function(){//全局构造函数
	 	var args=Array.prototype.slice.call(arguments),
	 		callback=args.pop(),
	 		i,
	 		l,
	 		hasOwn=Object.prototype.hasOwnProperty,
	 		modules=typeof args[0]==='string'?args:args[0];

	 	if(!(this instanceof MT)){
	 		return new MT(modules,callback);
	 	}
	 	this.counter=counter++;
	 	if(!modules||modules[0]==='*'){
	 		modules=[];
	 		for(i in MT.modules){
	 			if(hasOwn.call(MT.modules,i)){
	 				modules.push(i);
	 			}
	 		}
	 	}

	 	for(i=0,l=modules.length;i<l;i+=1){
	 		MT.modules[modules[i]](this);
	 	}
	 	callback(this);
	}

	MT.prototype={
	 	constructor:MT,
	 	name:'MT',
	 	version:'0.0.4'
	};
	MT.modules={//公共模块
		dom:function(m){//dom模块
			m.$=function(selector,context){
				context=context||document;
				return Array.prototype.slice.call(context.querySelectorAll(selector));
			};
			m.css=function(el,css){
				for(var i in css){
					el.style[i]=css[i];
				}
			},
			m.attr=function(el,prop){
				return el.getAttribute(prop);
			}
		},
		type:function(m){//类型模块
			m.toArray=function(likeArray){
				return Array.prototype.slice.call(likeArray);
			}
		},
		ajax:function(m){//ajax模块
			m.ajax=function(){
				console.log('ajax');
			}
		},
		object:function(m){//继承模块
			var object=Object.create?Object.create.bind(Object):0;
			m.object=object;
		},
		inherit:function(m){//继承模块
			m.inherit=function(){
				var M=function(){};
				return function(C,P){
					M.prototype=P.prototype
					C.prototype=new M();
					C.uber=P.prototype;
					C.prototype.constructor=C;
				};
			}();
		},
		Flip:function(m){//滑动模块
		    m.Flip=function(){
			    var 
			    	step=20,
			    	target=null,
			        touch={},
			        hasDefault,
			        supportTouch='ontouchstart' in window,
			        S=supportTouch?'touchstart':'mousedown',
			        M=supportTouch?'touchmove':'mousemove',
			        E=supportTouch?'touchend':'mouseup',
			        cb={
			          start:null,
			          move:null,
			          end:null,
			          left:null,
			          right:null,
			          up:null,
			          down:null
			        },
			        _dir=[];
			    function swipeDirection(x1,x2,y1,y2,sensitivity) {
			        var 
			        	_x=Math.abs(x1-x2),
			            _y=Math.abs(y1-y2),
			            dir=_x>=_y?(x1-x2>0?'left':'right'):(y1-y2>0?'up':'down');
			        if(sensitivity){
			            if(dir=='left'||dir=='right'){
			                if((_y/_x)>sensitivity){dir='';}
			            }else if(dir=='up'||dir=='down'){
			                if((_x/_y)>sensitivity){dir='';}
			            }
			        }

			        return dir;
			    }
			    function _start(e){
			        var pos=(e.touches&&e.touches[0])||e;
			        touch.x1=pos.pageX;
			        touch.y1=pos.pageY;
			        e.x=touch.x1;
			        e.y=touch.y1;
			        typeof cb.start==='function'&&cb.start(e);
			        document.addEventListener(M,_move,false);
			        document.addEventListener(E,_end,false);
			    }
			    function _move(e){
			        var pos=(e.touches&&e.touches[0])||e;
			        touch.x2=pos.pageX;
			        touch.y2 = pos.pageY;
			        e.x=touch.x2;
			        e.y=touch.y2;
			        e._x=e.x-touch.x1;
			        e._y=e.y-touch.y1;
			        if(!hasDefault){e.preventDefault();}
			        typeof cb.move==='function'&&cb.move(e);
			    }
			    function _end(e){
			        e.x=touch.x2;
			        e.y=touch.y2;
			        e._x=e.x-touch.x1;
			        e._y=e.y-touch.y1;
			        if((touch.x2&&Math.abs(touch.x1-touch.x2)>step)||(touch.y2&&Math.abs(touch.y1-touch.y2)>step)){
			            var dir_=swipeDirection(touch.x1,touch.x2,touch.y1,touch.y2,sensitivity);
			            typeof cb[dir_] === 'function'&&cb[dir_](e);
			        }
			        typeof cb.end==='function'&&cb.end(e);
			        document.removeEventListener(M,_move,false);
			        document.removeEventListener(E,_end,false);
			    }
			    function flip(el,hasDefault, sensitivity) {
			        if(!el)return;
			        el.addEventListener(S,_start,false);
			    }
			    function flipRevoke(el) {
			        if(!el){return;}
			        el.removeEventListener(S,_start,false);
			        el.removeEventListener(M,_move,false);
			        el.removeEventListener(E,_end,false);
			    }


			    function render(target,hasDefault,sensitivity){
			        flip(target,hasDefault,sensitivity);
			    }

			    return {
			      target:null,//目标元素
			      conf:{},//数据
			      init:function(opts){
			              this.target=target=opts.target;
			              step=opts.step||step;
			              sensitivity=opts.sensitivity;
			              var dir=['up','down','left','right','start','move','end'],l=dir.length;
			              while(l--){
			                if(opts[dir[l]]){
			                  cb[dir[l]]=opts[dir[l]];
			                  _dir.push(dir[l]);
			                }
			              }
			              render(target,opts.hasDefault,sensitivity);
			      },//初始化
			      kill:function(){
			          flipRevoke(target);
			      }//结束
			    }
		    }
		}
	};
	!function support(){//修补古董浏览器的残疾部分
		if(!Function.prototype.bind){//摘抄自mozilla
			Function.prototype.bind = function (oThis) {
			    if (typeof this !== "function") {
			      	throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			    }

			    var 
			    	aArgs = Array.prototype.slice.call(arguments, 1), 
			        fToBind = this, 
			        fNOP = function () {},
			        fBound = function () {
			          return fToBind.apply(this instanceof fNOP && oThis
			                                 ? this
			                                 : oThis,
			                               aArgs.concat(Array.prototype.slice.call(arguments)));
			        };

			    fNOP.prototype = this.prototype;
			    fBound.prototype = new fNOP();
			    return fBound;
			};
		}
		if(!Array.prototype.filter){
		  	Array.prototype.filter=function(fn){
		  		var re=[];
		  		this.forEach(function(el){
		  			if(fn(el)){
		  				re.push(el);
		  			}
		  		});
		  		return re;
		  	};
		}
		if(!Array.prototype.forEach){
			Array.prototype.each=function(fn){
				for(var i=0,l=this.length;i<l;i++){
					fn(this[i]);
				}
			}
		}
		if(!Array.prototype.map){}
		if(!Array.prototype.reduce){}
		if(!Array.prototype.indexOf){}	
	}();
	MT.fn={};
	return MT;
}();


