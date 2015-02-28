/**
 * @name //懒加载 未完成
 * @author WangHongxin (QQ:2262118088)
 * @date 2014-12-29 01:46
 */

M('dom','type',function(m){
	var $=m.$,
		toArray=m.toArray,
		css=m.css,
		attr=m.attr,
		container=$('.wrapper')[0],
		all_slides=toArray($('.sld')),
		load=function(el,prop){
			var url=el.getAttribute(prop),
				all_el=toArray(el.children);
			css(el,{'backgroundImage':'url('+url+')'});
			el.removeAttribute(prop);
			all_el.forEach(function(el){
				if(!attr(el)){
					load(el,prop);
				}
			});
		};
	all_slides.forEach(function(item){
		load(item,'data-url');
	});
	if(window.screen.width>1000){
		css(container,{'width':document.body.clientHeight*0.6+'px','margin':'0 auto',height:document.body.clientHeight+'px'})
		all_slides.forEach(function(el){
			css(el,{width:document.body.clientHeight*0.6+'px'});
		});
	}
});
