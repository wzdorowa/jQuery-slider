parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"jhmN":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),$(function(){$(".js-slider-test").slider(),Array.from($(".js-slider-test")).forEach(function(e,t){var r=!1,n=function(e,t){var r=document.createElement(e);return r.className=t,r},u=function(e){var u=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),a=document.createDocumentFragment();new Array(e.thumbsCount).fill(1).forEach(function(t,r){var u=n("li","configuration__thumbs-item js-configuration__thumbs-item"),i=n("input","configuration__thumbs-value js-configuration__thumbs-value");i.setAttribute("type","text"),i.setAttribute("value",String(e.thumbsValues[r])),u.append(i),a.append(u)}),u[t].append(a),r||(r=!0)},a=function(e){var r=Array.from(document.querySelectorAll(".js-configuration"));Array.from($(r[t]).find(".js-input-step-size__value"))[0].value=String(e.step)},i=function(e){var r=Array.from(document.querySelectorAll(".js-configuration"));Array.from($(r[t]).find(".js-input-min-max__value"))[0].value=String(e.min)},o=function(e){var r=Array.from(document.querySelectorAll(".js-configuration"));Array.from($(r[t]).find(".js-input-min-max__value"))[1].value=String(e.max)},l=e.getState();u(l),a(l),i(l),o(l);e.subscribeToStateModel(u,r,function(){var e=Array.from(document.querySelectorAll(".js-configuration"));return Array.from($(e[t]).find(".js-configuration__thumbs-value"))},function(e){var r=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),u=Array.from($(r[t]).find(".js-configuration__thumbs-item"));if(u.length<e.thumbsCount){var a=e.thumbsCount-u.length,i=document.createDocumentFragment();new Array(a).fill(1).forEach(function(u,a){Array.from($(r[t]).find(".js-configuration__thumbs-item"));var o=n("li","configuration__thumbs-item js-configuration__thumbs-item"),l=n("input","configuration__thumbs-value js-configuration__thumbs-value");l.setAttribute("type","text"),l.setAttribute("value",String(e.thumbsValues[a])),o.append(l),i.append(o),function(e){var r=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),n=Array.from($(r[t]).find(".js-configuration__thumbs-value")),u=n.length-1;n[u].value=String(e.thumbsValues[u])}(e)}),r[t].append(i)}if(u.length>e.thumbsCount){var o=u.length-e.thumbsCount,l=Array.from($(r[t]).find(".js-configuration__thumbs-item"));new Array(o).fill(1).forEach(function(){l[l.length-1].remove(),l.splice(-1,1)})}},function(e){var r=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),n=Array.from($(r[t]).find(".js-configuration__thumbs-value"));new Array(e.thumbsValues.length).fill(1).forEach(function(t,r){n[r].value=String(e.thumbsValues[r])})},a,i,o);var c=Array.from(document.querySelectorAll(".js-configuration")),s=Array.from($(c[t]).find(".js-input-min-max__value")),f=s[0],m=s[1];f.addEventListener("blur",function(){var t=Number(f.value);e.setNewValueMin(t)}),m.addEventListener("blur",function(){var t=Number(m.value);e.setNewValueMax(t)});var v=Array.from($(c[t]).find(".js-input-count-thumb__value"));v[0].addEventListener("blur",function(){var t=Number(v[0].value);e.setNewValueCount(t)});var d=function(){return Array.from($(c[t]).find(".js-configuration__thumbs-value"))},b=d();new Array(b.length).fill(1).forEach(function(t,r){b[r].addEventListener("blur",function(){var t=Number(b[r].value);e.setNewValueThumbsValues(t,r)})});var h=Array.from($(c[t]).find(".js-input-step-size__value"));h[0].addEventListener("blur",function(){var t=Number(h[0].value);e.setNewValueStep(t)});var _=Array.from($(c[t]).find(".js-radio-button"));new Array(_.length).fill(1).forEach(function(t,r){_[r].addEventListener("click",function(){var t="";0===r&&(t="horizontal"),1===r&&(t="vertical"),e.setNewValueOrientation(t)})});var A=Array.from($(c[t]).find(".js-checkbox-button")),y=Array.from($(c[t]).find(".js-checkbox-button__tooltip")),g=Array.from($(c[t]).find(".js-checkbox-button__scale-of-values"));A[0].addEventListener("click",function(){var t=!0;y[0].checked&&(t=!0),y[0].checked||(t=!1),e.setNewValueTooltip(t)}),A[1].addEventListener("click",function(){var t=!0;g[0].checked&&(t=!0),g[0].checked||(t=!1),e.setNewValueScaleOfValues(t)});var j=Array.from(document.querySelectorAll(".js-configuration")),p=function(t){t.preventDefault();var r=Number(f.value);e.setNewValueMin(r);var n=Number(m.value);e.setNewValueMax(n);var u,a=Number(v[0].value);e.setNewValueCount(a),u=d(),new Array(u.length).fill(1).forEach(function(t,r){var n=Number(u[r].value);e.setNewValueThumbsValues(n,r)});var i=Number(h[0].value);e.setNewValueStep(i)};j.forEach(function(e){e.addEventListener("submit",p)})})});
},{}]},{},["jhmN"], null)
//# sourceMappingURL=/jQuery-slider/demo.57b44d73.js.map