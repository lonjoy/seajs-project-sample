/*! slider - v1.0.0 - 2013-05-08
* Copyright (c) 2013 曹纯; Licensed  */
define("marketing/slider/1.0.0/slider",["marketing/zepto/1.0.0/zepto","./touchSlider","./css3"],function(t){var e=t("marketing/zepto/1.0.0/zepto"),i=t("./touchSlider");return e.fn.slider=function(t){return this.each(function(e,n){n.getAttribute("l")||(n.setAttribute("l",!0),i.cache.push(new i(n,t)))})},i}),define("marketing/slider/1.0.0/touchSlider",["marketing/zepto/1.0.0/zepto","./css3"],function(t){var e=t("marketing/zepto/1.0.0/zepto"),i=t("./css3"),n=/android/gi.test(navigator.appVersion),s=i.has3d(),r=i.hasTransform(),a=s?"translate3d(":"translate(",o=s?",0)":")";return e.touchSlider=function(t,i){return t?(i?i.container=t:i="string"==typeof t?{container:t}:t,e.extend(this,{container:".slider",wrap:null,panel:null,trigger:null,activeTriggerCls:"sel",hasTrigger:!1,steps:0,left:0,visible:1,margin:0,curIndex:0,duration:300,loop:!1,play:!1,interval:5e3,useTransform:!n,lazy:".lazyimg",lazyIndex:1,callback:null,prev:null,next:null,activePnCls:"none"},i),this.findEl()&&this.init()&&this.increaseEvent(),void 0):null},e.extend(e.touchSlider.prototype,{reset:function(t){e.extend(this,t||{}),this.init()},findEl:function(){var t=this.container=e(this.container);return t.length?(this.wrap=this.wrap&&t.find(this.wrap)||t.children().first(),this.wrap.length?(this.panel=this.panel&&t.find(this.panel)||this.wrap.children().first(),this.panel.length?(this.panels=this.panel.children(),this.panels.length?(this.trigger=this.trigger&&t.find(this.trigger),this.prev=this.prev&&t.find(this.prev),this.next=this.next&&t.find(this.next),this):(this.container.hide(),null)):null):null):null},init:function(){var t=this.wrap,e=this.panel,i=this.panels,n=this.trigger,s=this.len=i.length,h=this.margin,l=0,c=this.visible,d=this.useTransform=r?this.useTransform:!1;this.steps=this.steps||t.width(),i.each(function(t,e){l+=e.offsetWidth}),h&&"number"==typeof h&&(l+=(s-1)*h,this.steps+=h),c>1&&(this.loop=!1);var u=this.left;u-=this.curIndex*this.steps,this.setCoord(e,u),d&&(t.css({"-webkit-transform":"translate3d(0,0,0)"}),e.css({"-webkit-backface-visibility":"hidden"}),i.css({"-webkit-transform":a+"0,0"+o}));var p=this._pages=Math.ceil(s/c);if(this._minpage=0,this._maxpage=this._pages-1,this.loadImg(),this.updateArrow(),1>=p)return this.getImg(i[0]),n&&n.hide(),null;if(this.loop){e.append(i[0].cloneNode(!0));var f=i[s-1].cloneNode(!0);e.append(f),this.getImg(f),f.style.cssText+="position:relative;left:"+-this.steps*(s+2)+"px;",l+=i[0].offsetWidth,l+=i[s-1].offsetWidth}if(e.css("width",l),n&&n.length){var v="",g=n.children();if(!g.length){for(var m=0;p>m;m++)v+="<span"+(m==this.curIndex?" class="+this.activeTriggerCls:"")+"></span>";n.html(v)}this.triggers=n.children(),this.triggerSel=this.triggers[this.curIndex]}else this.hasTrigger=!1;return this},increaseEvent:function(){var t=this,i=t.wrap[0],n=t.prev,s=t.next,r=t.triggers;i.addEventListener&&(i.addEventListener("touchstart",t,!1),i.addEventListener("touchmove",t,!1),i.addEventListener("touchend",t,!1),i.addEventListener("webkitTransitionEnd",t,!1),i.addEventListener("msTransitionEnd",t,!1),i.addEventListener("oTransitionEnd",t,!1),i.addEventListener("transitionend",t,!1)),t.play&&t.begin(),n&&n.length&&n.on("click",function(e){t.backward.call(t,e)}),s&&s.length&&s.on("click",function(e){t.forward.call(t,e)}),t.hasTrigger&&r&&r.each(function(i,n){e(n).on("click",function(){t.slideTo(i)})})},handleEvent:function(t){switch(t.type){case"touchstart":this.start(t);break;case"touchmove":this.move(t);break;case"touchend":case"touchcancel":this.end(t);break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"transitionend":this.transitionEnd(t)}},loadImg:function(t){t=t||0,this._minpage>t?t=this._maxpage:t>this._maxpage&&(t=this._minpage);var e=this.visible,i=this.lazyIndex-1,n=i+t;if(!(n>this._maxpage)){n+=1;var s=(t&&i+t||t)*e,r=n*e,a=this.panels;r=Math.min(a.length,r);for(var o=s;r>o;o++)this.getImg(a[o])}},getImg:function(t){if(t&&(t=e(t),!t.attr("l"))){var i=this,n=i.lazy,s="img"+n;n=n.replace(/^\.|#/g,""),t.find(s).each(function(t,i){var s=e(i);src=s.attr("data-img"),src&&s.attr("src",src).removeAttr("data-img").removeClass(n)}),t.attr("l","1")}},start:function(t){var e=t.touches[0];this._movestart=void 0,this._disX=0,this._coord={x:e.pageX,y:e.pageY}},move:function(t){if(!(t.touches.length>1||t.scale&&1!==t.scale)){var e,i=t.touches[0],n=this._disX=i.pageX-this._coord.x,s=this.left;this._movestart===void 0&&(this._movestart=!!(this._movestart||Math.abs(n)<Math.abs(i.pageY-this._coord.y))),this._movestart||(t.preventDefault(),this.stop(),this.loop||(n/=!this.curIndex&&n>0||this.curIndex==this._maxpage&&0>n?Math.abs(n)/this.steps+1:1),e=s-this.curIndex*this.steps+n,this.setCoord(this.panel,e),this._disX=n)}},end:function(t){if(!this._movestart){var e=this._disX;-10>e?(t.preventDefault(),this.forward()):e>10&&(t.preventDefault(),this.backward()),e=null}},backward:function(t){t&&t.preventDefault&&t.preventDefault();var e=this.curIndex,i=this._minpage;e-=1,i>e&&(e=this.loop?i-1:i),this.slideTo(e),this.callback&&this.callback(Math.max(e,i),-1)},forward:function(t){t&&t.preventDefault&&t.preventDefault();var e=this.curIndex,i=this._maxpage;e+=1,e>i&&(e=this.loop?i+1:i),this.slideTo(e),this.callback&&this.callback(Math.min(e,i),1)},setCoord:function(t,e){this.useTransform&&t.css("-webkit-transform",a+e+"px,0"+o)||t.css("left",e)},slideTo:function(t,e){t=t||0,this.curIndex=t;var i=this.panel,n=i[0].style,s=this.left-t*this.steps;n.webkitTransitionDuration=n.MozTransitionDuration=n.msTransitionDuration=n.OTransitionDuration=n.transitionDuration=(e||this.duration)+"ms",this.setCoord(i,s),this.loadImg(t)},transitionEnd:function(){var t=this.panel,e=t[0].style,i=this.loop,n=this.curIndex;i&&(n>this._maxpage?this.curIndex=0:this._minpage>n&&(this.curIndex=this._maxpage),this.setCoord(t,this.left-this.curIndex*this.steps)),i||n!=this._maxpage?this.begin():(this.stop(),this.play=!1),this.update(),this.updateArrow(),e.webkitTransitionDuration=e.MozTransitionDuration=e.msTransitionDuration=e.OTransitionDuration=e.transitionDuration=0},update:function(){var t=this.triggers,e=this.activeTriggerCls,i=this.curIndex;t&&t[i]&&(this.triggerSel&&(this.triggerSel.className=""),t[i].className=e,this.triggerSel=t[i])},updateArrow:function(){var t=this.prev,e=this.next;if(t&&t.length&&e&&e.length&&!this.loop){var i=this.curIndex,n=this.activePnCls;0>=i&&t.addClass(n)||t.removeClass(n),i>=this._maxpage&&e.addClass(n)||e.removeClass(n)}},begin:function(){var t=this;t.play&&!t._playTimer&&(t.stop(),t._playTimer=setInterval(function(){t.forward()},t.interval))},stop:function(){var t=this;t.play&&t._playTimer&&(clearInterval(t._playTimer),t._playTimer=null)},destroy:function(){var t=this,i=t.wrap[0],n=t.prev,s=t.next,r=t.triggers;i.removeEventListener&&(i.removeEventListener("touchstart",t,!1),i.removeEventListener("touchmove",t,!1),i.removeEventListener("touchend",t,!1),i.removeEventListener("webkitTransitionEnd",t,!1),i.removeEventListener("msTransitionEnd",t,!1),i.removeEventListener("oTransitionEnd",t,!1),i.removeEventListener("transitionend",t,!1)),n&&n.length&&n.off("click"),s&&s.length&&s.off("click"),t.hasTrigger&&r&&r.each(function(t,i){e(i).off("click")})}}),e.touchSlider.cache=[],e.touchSlider.destroy=function(){var t=e.touchSlider.cache,i=t.length;if(!(1>i)){for(var n=0;i>n;n++)t[n].destroy();e.touchSlider.cache=[]}},e.touchSlider}),define("marketing/slider/1.0.0/css3",[],function(){function t(t,e){return typeof t===e}function e(t,e){for(var i in t)if(void 0!==h[t[i]])return"pfx"==e?t[i]:!0;return!1}function i(i,n){var s=i.charAt(0).toUpperCase()+i.substr(1),r=(i+" "+o.join(s+" ")+s).split(" ");return t(n,"string")||t(n,"undefined")?e(r,n):void 0}var n={},s=document.documentElement,r="modernizr",a=function(t,e,i,n){var a,o,h,l=document.createElement("div"),c=document.body,d=c?c:document.createElement("body");if(parseInt(i,10))for(;i--;)h=document.createElement("div"),h.id=n?n[i]:r+(i+1),l.appendChild(h);return a=["&#173;",'<style id="s',r,'">',t,"</style>"].join(""),l.id=r,(c?l:d).innerHTML+=a,d.appendChild(l),c||(d.style.background="",s.appendChild(d)),o=e(l,t),c?l.parentNode.removeChild(l):d.parentNode.removeChild(d),!!o},o="Webkit Moz O ms".split(" "),h=s.style;return n.hasTransform=function(){return!!i("transform")},n.has3d=function(){var t=!!i("perspective");return t&&"webkitPerspective"in s.style&&a("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(e){t=9===e.offsetLeft&&3===e.offsetHeight}),t},n});