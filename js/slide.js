/**
 * @name slide
 * @author WangHongxin (QQ:2262118088)
 * @date 2014-12-29 01:35
 */
M(function(m){//沙箱
	function Slide(){
		var $=m.$,
			toArray=m.toArray,
			Flip=m.Flip,
			css=m.css;
		var width=document.body.clientWidth,
			height=document.body.clientHeight,
			dir,
			now,
			slides,
			me,
			render=function(opts){
				var loop=opts.loop,
					boudary=opts.boudary*height,
					container=$(opts.container)[0],	
					last=loop?container.lastElementChild:null,	
					first=loop?container.firstElementChild:null,
					cur=first;

				slides=toArray($('.sld',container));
				now=slides[0];
				//监听
				slides.forEach(function(item){
					var ev=function(){
						return {
							start:function(e){
								var prev=item.previousElementSibling||last;
								var next=item.nextElementSibling||first;
								if(next){
									next.classList.add('show');
									css(next,{top:height+'px'});
								}
								if(prev){
									prev.classList.add('show');
									css(prev,{top:-height+'px'});
								}
								opts.start&&opts.start(e);
							},
							move:function(e){
								transform(item,e._y);
								opts.move&&opts.move(e);
							},
							end:function(e){
								var prev=item.previousElementSibling||last;
								var next=item.nextElementSibling||first;
								if(e._y<-boudary){
									next.classList.add('animate');
									next.addEventListener('webkitTransitionEnd',endEv,false);
									css(next,{'webkitTransform':'translate3d(0,'+(-height)+'px,0)'});
									now=next;
								}else if(e._y>boudary){
									prev.classList.add('animate');
									prev.addEventListener('webkitTransitionEnd',endEv,false);
									css(prev,{'webkitTransform':'translate3d(0,'+(height)+'px,0)'});
									now=prev;
								}else if(isNaN(e._y)){
									next.classList.remove('show');
									prev.classList.remove('show');
									only=[];
								}else if(Math.abs(e._y)<=boudary){
									restore(item,e._y);
								}
								opts.end&&opts.end(e);
							}
						}
					}();

					var flip=new Flip();
					flip.init({
						target:item,
						start:ev.start,
						move:ev.move,
						end:ev.end
					});
				});

				//拖动
				var	transform=function(el,y){
						var prev=el.previousElementSibling||last,
							next=el.nextElementSibling||first,
							scale=1-Math.abs(y/height)/3,
							shift=height*(y/height/2);

						if(y<0){
							prev.classList.contains('show')&&prev.classList.remove('show');
							!next.classList.contains('show')&&next.classList.add('show');
							css(next,{
								'webkitTransform':'translate3d(0,'+(y)+'px,0)'
							});
							css(el,{
								'webkitTransform':'scale('+scale+') translate3d(0,'+shift+'px,0)'
							});
						}else if(y>0){
							next.classList.contains('show')&&next.classList.remove('show');
							!prev.classList.contains('show')&&prev.classList.add('show');
							css(prev,{
								'webkitTransform':'translate3d(0,'+y+'px,0)'
							});
							css(el,{
								'webkitTransform':'scale('+scale+')  translate3d(0,'+shift+'px,0)'
							});
						}
					},

					//重构
					rebuild=function(item){
						slides.forEach(function(el){
							el.classList.remove('animate');
							el.classList.remove('show');
							el.classList.remove('hide');
							css(el,{'webkitTransform':'',top:''})
							if(el!=item){el.classList.remove('active');}
						});

					},
					//恢复
					restore=function(item,_y){
						var 
							prev=item.previousElementSibling||last,
							next=item.nextElementSibling||first;

						item.addEventListener('webkitTransitionEnd',function(){
							rebuild(this);
						},false);

						if(_y<0){
							next.classList.add('animate');
							item.classList.add('animate');
							css(next,{'webkitTransform':'translate3d(0,0,0)'});
							css(item,{'webkitTransform':'scale(1) translate3d(0,0,0)'});
						}else if(_y>0){
							prev.classList.add('animate');
							item.classList.add('animate');
							css(prev,{'webkitTransform':'translate3d(0,0,0)'});
							css(item,{'webkitTransform':'scale(1) translate3d(0,0,0)'});
						}
					},

					//结束
					endEv=function(){
						this.classList.remove('animate');
						this.classList.remove('show');
						this.classList.add('active');
						css(this,{top:'','webkitTransform':'',scale:''})
						rebuild(this);
						opts.new&&opts.new();
						this.removeEventListener('webkitTransitionEnd',endEv,false);
					};
			};
			
			return{
				init:function(opts){

					render(opts);
				},
				now:function(){
					return now;
				},
				index:function(){
					for(var i=0,l=slides.length;i<l;i++){
						if(slides[i]==now){
							return i;
						}
					}
				}
			}
	}

	var sld=new Slide();
	sld.init({
		container:'.wrapper',//特效容器
		loop:true,//开启循环
		boudary:0.3,//拖动系数
		start:function(e){
			// console.log('这里写滑动开始事件');
		},
		move:function(e){
			// console.log('这里写滑动事件');
		},
		end:function(e){
			// console.log('这里写滑动结束事件');
		},
		new:function(e){
			// console.log('这里是切换成功事件');
			// sld.now()是当前页面元素
			// sld.index()是当前页面元素下标
		}
	});
});