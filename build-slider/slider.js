parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"wrzZ":[function(require,module,exports) {

},{}],"RL3T":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){return function(t){var e=this;this.getState=function(){return e.controller.getState()},this.update=function(t){e.controller.updateState(t)},this.subscribeToStateChanges=function(t){e.controller.emitter.makeSubscribe("model:state-changed",function(e){t(e)})},this.subscribeToThumbsChanges=function(t){e.controller.emitter.makeSubscribe("model:thumbsValues-changed",function(e){t(e)})},this.controller=t}}();exports.default=t;
},{}],"MOw5":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e={min:0,max:100,thumbsValues:[20,32,44,60],orientation:"horizontal",step:2,hasTooltips:!0,hasScaleValues:!0};exports.default=e;
},{}],"Gsx4":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.normalizeState=exports.checkThumbsValuesIntersection=exports.normalizeThumbValue=void 0;var t=e(require("./defaultState")),r=function(e,t,r,a){var n=Math.round((r-t)%a*10)/10,u=r-n,o=Math.round(100*e)/100;return o=n>0&&o>u+n/2?Math.round((o-t)/a)*a+t+n:Math.round((o-t)/a)*a+t,(o=Math.round(100*o)/100)<t?o=t:o>=r&&(o=r),o};exports.normalizeThumbValue=r;var a=function(e,t,a,n,u){var o=e;null===o&&(o=0);for(var i=t,s=o;s<i.length;s+=1)i[s]=r(i[s],a,n,u),i[s]>i[s+1]&&(i[s+1]=i[s]);for(s=o;s>0;s-=1)i[s]=r(i[s],a,n,u),i[s]<i[s-1]&&(i[s-1]=i[s]);return i};exports.checkThumbsValuesIntersection=a;var n=function(e){var r=e;r.step<=0&&(r.step=1),0===r.thumbsValues.length&&(r.thumbsValues[0]=r.min),["horizontal","vertical"].includes(r.orientation)||(r.orientation=t.default.orientation),Number.isInteger(r.min)||(r.min=Math.floor(r.min)),Number.isInteger(r.max)||(r.max=Math.floor(r.max));var n=r.min+r.step;return r.max<n&&(r.max=n),r.thumbsValues=a(null,r.thumbsValues,r.min,r.max,r.step),r};exports.normalizeState=n;
},{"./defaultState":"MOw5"}],"Yb5G":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("./defaultState")),s=require("./helpers"),a=function(){function t(t){this.state={min:e.default.min,max:e.default.max,thumbsValues:e.default.thumbsValues,orientation:e.default.orientation,step:e.default.step,hasTooltips:e.default.hasTooltips,hasScaleValues:e.default.hasScaleValues},this.emitter=t}return t.prototype.updateState=function(t){this.state=s.normalizeState(t),this.notifyStateChanged()},t.prototype.requestThumbValueChange=function(t,e){var s=Math.round(100*t)/100,a=Math.round((this.state.max-this.state.min)%this.state.step*10)/10,u=this.state.max-a,i=s>u+a/2||s<u+a/2&&s>=u,h=s<this.state.thumbsValues[e]-this.state.step/2||s>this.state.thumbsValues[e]+this.state.step/2;a>0&&i?this.setNewThumbValue(s,e):h&&this.setNewThumbValue(s,e)},t.prototype.setNewThumbValue=function(t,e){this.state.thumbsValues[e]=t,this.state.thumbsValues=s.checkThumbsValuesIntersection(e,this.state.thumbsValues,this.state.min,this.state.max,this.state.step),this.notifyThumbsValuesChanged()},t.prototype.notifyStateChanged=function(){this.emitter.emit("model:state-changed",this.state)},t.prototype.notifyThumbsValuesChanged=function(){this.emitter.emit("model:thumbsValues-changed",this.state.thumbsValues)},t}();exports.default=a;
},{"./defaultState":"MOw5","./helpers":"Gsx4"}],"ExRo":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(e,t){var r=document.createElement(e);return r.className=t,r};exports.default=e;
},{}],"hdrT":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=function(n,u){var l=[],a=[];u.forEach(function(u){var r=u-n;l.push(Math.abs(r));var t=u+n;a.push(Math.abs(t))});var r=null,t=null,e=function(n,u){null===r&&(r=n),null===t&&(t=u),n<r&&(r=n,t=u)};return l.forEach(function(n,u){e(n,u)}),a.forEach(function(n,u){e(n,u)}),null!==t?{value:n,index:t}:null};exports.default=n;
},{}],"HXfS":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var i=e(require("../functions/createElement")),s=e(require("../functions/findNearestThumb")),t=function(){function e(e,i,s){this.slider=e,this.emitter=i,this.adapter=s,this.divisionsElements=[],this.valuesDivisions=[]}return e.prototype.renderDivisions=function(e){var s=e.max,t=e.min,n=e.step,a=e.orientation,l=Math.round((s-t)/n),r=(s-t)/l;l>5&&(r=(s-t)/5);var o=Math.round(r/n)*n,u=i.default("div","slider__scale-value-container js-slider__scale-value-container");"vertical"===a&&u.classList.add("slider__scale-value-container_vertical");var c=this.createElementsDivisions(o,e);u.append(c),this.slider.append(u),this.setDivisionsInPlaces(t,s)},e.prototype.createElementsDivisions=function(e,s){var t=this,n=s.max,a=s.min,l=s.step,r=s.orientation,o=document.createDocumentFragment(),u=n-a-(n-a)/l*l,c=Math.ceil((n-a)/e)+1;u>0&&(c+=1);var v=a;return new Array(c).fill(1).forEach(function(i,s){0===s?(t.valuesDivisions[s]=a,v+=e):s===c-1?t.valuesDivisions[s]=n:(t.valuesDivisions[s]=v,v=Math.round(100*(v+e))/100)}),this.valuesDivisions.forEach(function(e){var s=i.default("div","slider__scale-value js-slider__scale-value"),n=i.default("span","slider__scale-value-with-number js-slider__scale-value-with-number");"vertical"===r&&(s.classList.add("slider__scale-value_vertical"),n.classList.add("slider__scale-value-with-number_vertical")),n.innerHTML=String(e),s.append(n),o.append(s),t.divisionsElements.push(s)}),this.listenScaleValueEvents(),o},e.prototype.setDivisionsInPlaces=function(e,i){var s=this;this.divisionsElements.forEach(function(t,n){var a=(s.valuesDivisions[n]-e)/(i-e)*100;t.style[s.adapter.position]=a+"%"})},e.prototype.listenScaleValueEvents=function(){var e=this;this.divisionsElements.forEach(function(i,s){i.addEventListener("click",e.handleSerifScaleClick.bind(e,s,e.valuesDivisions),!0)})},e.prototype.handleSerifScaleClick=function(e,i){var t=s.default(i[e],this.thumbsValues);null!==t&&this.emitter.emit("view:thumbPosition-changed",t)},e}();exports.default=t;
},{"../functions/createElement":"ExRo","../functions/findNearestThumb":"hdrT"}],"jhIm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(e,r,t,l){var s=e.querySelector(".slider__progress-bar");return null!==s?s[r.offsetLength]/(l-t):null};exports.default=e;
},{}],"EiiW":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("../functions/createElement")),i=e(require("../functions/findNearestThumb")),s=e(require("./Scale")),r=e(require("../functions/getPointSize")),a=function(){function e(e,t){var s=this;this.handleProgressBarClick=function(e){var t=s.progressBar.getBoundingClientRect(),a=e[s.adapter.clientAxis]-t[s.adapter.clientRect],n=r.default(s.slider,s.adapter,s.min,s.max);if(null!==n){var l=(a+n*s.min)/n,o=Math.floor(l/s.step)*s.step,h=o+s.step/2,d=Math.round((s.max-s.min)%s.step*10)/10;l=l>s.max-d/2?o+d:l>h?o+s.step:o;var u=i.default(l,s.thumbsValues);null!==u&&s.emitter.emit("view:thumbPosition-changed",u)}},this.slider=e,this.emitter=t,this.min=0,this.max=0}return e.prototype.renderProgressBar=function(e){var t=e.state,i=e.adapter;(this.adapter=i,this.step=t.step,this.thumbsValues=t.thumbsValues,this.min=t.min,this.max=t.max,this.createProgressBar(t.orientation),t.hasScaleValues)&&new s.default(this.slider,this.emitter,this.adapter).renderDivisions(t)},e.prototype.updateActiveRange=function(e){var t,i=e[0],s=e[e.length-1],r=(i-this.min)/(this.max-this.min)*100,a=(s-this.min)/(this.max-this.min)*100,n=0;1===e.length?t=r:e.length>1&&(n=r,t=a-r),this.activeRange.style[this.adapter.position]=n+"%",this.activeRange.style[this.adapter.length]=t+"%"},e.prototype.createProgressBar=function(e){var i=t.default("div","slider__progress-bar js-slider__progress-bar"),s=t.default("span","slider__active-range js-slider__active-range");"vertical"===e&&i.classList.add("slider__progress-bar_vertical"),this.progressBar=i,this.activeRange=s,i.append(s),this.slider.append(i),this.listenProgressBarClick()},e.prototype.listenProgressBarClick=function(){this.progressBar.addEventListener("click",this.handleProgressBarClick,!0)},e}();exports.default=a;
},{"../functions/createElement":"ExRo","../functions/findNearestThumb":"hdrT","./Scale":"HXfS","../functions/getPointSize":"jhIm"}],"PgIQ":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("../functions/createElement")),i=function(){function t(){this.textInTooltip=null}return t.prototype.setTooltipValue=function(t){null!==this.textInTooltip&&(this.textInTooltip.innerHTML=String(t))},t.prototype.createTooltip=function(t,i){var o=e.default("div","slider__tooltip js-slider__tooltip"),l=e.default("span","slider__tooltip-text js-slider__tooltip-text");"vertical"===i&&(o.classList.add("slider__tooltip_vertical"),l.classList.add("slider__tooltip-text_vertical")),o.append(l),t.append(o),this.textInTooltip=l},t}();exports.default=i;
},{"../functions/createElement":"ExRo"}],"ePeF":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("../functions/createElement")),i=t(require("./Tooltip")),s=t(require("../functions/getPointSize")),o=function(){function t(t,e,i){var s=this;this.handleThumbMove=function(t){s.processMove(t)},this.handleThumbStop=function(){s.processStop()},this.slider=t,this.emitter=e,this.thumb=null,this.tooltip=null,this.startMoveAxis=0,this.min=0,this.max=0,this.index=i}return t.prototype.renderThumb=function(t,e){this.adapter=e,this.min=t.min,this.max=t.max,this.createThumb(),t.hasTooltips&&null!==this.thumb&&(this.tooltip=new i.default,this.tooltip.createTooltip(this.thumb,t.orientation)),this.setValueThumb(t.thumbsValues[this.index])},t.prototype.setValueThumb=function(t){var e,i=this.thumb,s=(t-this.min)/(this.max-this.min)*100;null!==i&&(i.style[null===(e=this.adapter)||void 0===e?void 0:e.direction]="calc(("+s+"%) - (24px * "+s/100+"))"),null!==this.tooltip&&this.tooltip.setTooltipValue(t)},t.prototype.createThumb=function(){var t=e.default("div","slider__thumb js-slider__thumb");this.thumb=t,this.slider.append(t),this.listenThumbsEvents(t)},t.prototype.listenThumbsEvents=function(t){t.addEventListener("pointerdown",this.handleThumbStart.bind(this))},t.prototype.processStart=function(t){var e,i;if(t.preventDefault(),null!==this.thumb){var s=this.thumb[null===(e=this.adapter)||void 0===e?void 0:e.offsetDirection];this.startMoveAxis=t[null===(i=this.adapter)||void 0===i?void 0:i.pageAxis]-s,document.addEventListener("pointermove",this.handleThumbMove),document.addEventListener("pointerup",this.handleThumbStop)}},t.prototype.processMove=function(t){var e,i=t[null===(e=this.adapter)||void 0===e?void 0:e.pageAxis]-this.startMoveAxis,o=s.default(this.slider,this.adapter,this.min,this.max);if(null!==o){var n=(i+o*this.min)/o;this.emitter.emit("view:thumbPosition-changed",{value:n,index:this.index})}},t.prototype.processStop=function(){document.removeEventListener("pointermove",this.handleThumbMove),document.removeEventListener("pointerup",this.handleThumbStop)},t.prototype.handleThumbStart=function(t){this.processStart(t)},t}();exports.default=o;
},{"../functions/createElement":"ExRo","./Tooltip":"PgIQ","../functions/getPointSize":"jhIm"}],"JUoB":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("./ProgressBar")),i=t(require("./Thumb")),r=function(){function t(t,e){this.slider=t,this.emitter=e,this.thumbs=[]}return t.prototype.initialize=function(t){var r=this;this.slider.innerHTML="",this.thumbs=[],this.setAdapter(t.orientation),this.progressBar=new e.default(this.slider,this.emitter),t.thumbsValues.forEach(function(t,e){r.thumbs.push(new i.default(r.slider,r.emitter,e))})},t.prototype.render=function(t){var e=this;this.progressBar.renderProgressBar({state:t,adapter:this.adapter}),this.thumbs.forEach(function(i){i.renderThumb(t,e.adapter)}),this.progressBar.updateActiveRange(t.thumbsValues)},t.prototype.update=function(t){this.thumbs.forEach(function(e,i){e.setValueThumb(t[i])}),this.progressBar.updateActiveRange(t)},t.prototype.setAdapter=function(t){"horizontal"===t?this.adapter={offsetDirection:"offsetLeft",offsetAxis:"offsetX",offsetLength:"offsetWidth",pageAxis:"pageX",clientAxis:"clientX",currentAxis:"currentX",clientRect:"x",direction:"left",position:"left",length:"width"}:"vertical"===t&&(this.adapter={offsetDirection:"offsetTop",offsetAxis:"offsetY",offsetLength:"offsetHeight",pageAxis:"pageY",clientAxis:"clientY",currentAxis:"currentY",clientRect:"y",direction:"top",position:"top",length:"height"})},t}();exports.default=r;
},{"./ProgressBar":"EiiW","./Thumb":"ePeF"}],"yQaM":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){function t(){this.handlersByEvent={}}return t.prototype.makeSubscribe=function(t,e){var n=this;return this.handlersByEvent[t]||(this.handlersByEvent[t]=[]),this.handlersByEvent[t].push(e),function(){n.handlersByEvent[t]=n.handlersByEvent[t].filter(function(t){return e!==t})}},t.prototype.emit=function(t,e){var n=this.handlersByEvent[t];n&&n.forEach(function(t){t(e)})},t}();exports.default=t;
},{}],"rngF":[function(require,module,exports) {
"use strict";function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o})(t)}Object.defineProperty(exports,"__esModule",{value:!0});var t=function(t,e){var a=e;if(a.thumbsValues=Array.from(e.thumbsValues),"object"===o(t)&&null!==t){var r=t;void 0!==r.min&&"number"==typeof r.min&&(a.min=r.min),void 0!==r.max&&"number"==typeof r.max&&(a.max=r.max),void 0!==r.thumbsValues&&Array.isArray(r.thumbsValues)&&(a.thumbsValues=Array.from(r.thumbsValues)),void 0!==r.orientation&&"string"==typeof r.orientation&&("horizontal"!==r.orientation&&"vertical"!==r.orientation||(a.orientation=r.orientation)),void 0!==r.step&&"number"==typeof r.step&&(a.step=r.step),void 0!==r.hasTooltips&&"boolean"==typeof r.hasTooltips&&(a.hasTooltips=r.hasTooltips),void 0!==r.hasScaleValues&&"boolean"==typeof r.hasScaleValues&&(a.hasScaleValues=r.hasScaleValues)}return a};exports.default=t;
},{}],"DeWO":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("./Model/Model")),i=e(require("./view/View")),s=e(require("./EventEmitter")),r=e(require("./functions/validateState")),u=function(){function e(e,r){this.slider=e,this.slider.classList.add("slider"),this.emitter=new s.default,this.view=new i.default(this.slider,this.emitter),this.model=new t.default(this.emitter),this.subscribeToEvents(),this.updateState(r)}return e.prototype.getState=function(){return this.model.state},e.prototype.updateState=function(e){var t=r.default(e,this.model.state);this.model.updateState(t)},e.prototype.subscribeToEvents=function(){var e=this;this.emitter.makeSubscribe("model:state-changed",function(t){e.view.initialize(t),e.view.render(t)}),this.emitter.makeSubscribe("model:thumbsValues-changed",function(t){e.view.update(t)}),this.emitter.makeSubscribe("view:thumbPosition-changed",function(t){e.model.requestThumbValueChange(t.value,t.index)})},e}();exports.default=u;
},{"./Model/Model":"Yb5G","./view/View":"JUoB","./EventEmitter":"yQaM","./functions/validateState":"rngF"}],"QLcG":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),require("./styles/slider.scss");var t=e(require("./Wrapper")),s=e(require("./Controller"));!function(e){var r=e;r.fn.slider=function(){var e=this[0],r=this.data(),a=new s.default(e,r),i=new t.default(a);return this.data("getState",i.getState),this.data("update",i.update),this.data("subscribeToStateChanges",i.subscribeToStateChanges),this.data("subscribeToThumbsChanges",i.subscribeToThumbsChanges),this},r.fn.extend(r.fn.slider)}(jQuery);
},{"./styles/slider.scss":"wrzZ","./Wrapper":"RL3T","./Controller":"DeWO"}]},{},["QLcG"], null)