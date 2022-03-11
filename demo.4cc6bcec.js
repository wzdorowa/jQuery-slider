parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"nxTo":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e={createElement:function(e,t){var r=document.createElement(e);return r.className=t,r}};exports.default=e;
},{}],"Lm8H":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("./utilities")),n=function(){function e(e,t){var n=this;this.handleElementFormSubmit=function(e){e.preventDefault();var t=n.getValuesFromAllInputs();n.connection.update(t)},this.connection=e.data(),this.sliderIndex=t,this.elements={panel:null,minValue:null,maxValue:null,countSliderThumbs:null,inputsSliderThumbs:null,stepSize:null,orientationButtons:null,checkboxContainer:null,checkboxInputTooltip:null,checkboxInputScaleOfValues:null,forms:null},this.connection.subscribeToModelChanges(function(e){n.render(e)}),this.connection.subscribeToThumbsChanges(function(e){n.updateThumbsValues(e)}),this.findElements(),this.bindEventListeners(),this.render(this.connection.getState())}return e.prototype.render=function(e){this.createInput(e),this.setValuesFromState(e)},e.prototype.updateThumbsValues=function(e){var t;null===(t=this.elements.inputsSliderThumbs)||void 0===t||t.forEach(function(t,n){t.value=String(e[n])})},e.prototype.findElements=function(){var e=Array.from(document.querySelectorAll(".js-configuration"));this.elements.panel=e[this.sliderIndex];var t=$(".js-field__min-max"),n=Array.from($(t[this.sliderIndex]).find(".js-input__value"));this.elements.minValue=n[0],this.elements.maxValue=n[1];var i=$(".js-configuration__field-count-thumb");this.elements.countSliderThumbs=Array.from($(i[this.sliderIndex]).find(".js-input__value"));var l=$(".js-field__thumbs-values");this.elements.inputsSliderThumbs=Array.from(l[this.sliderIndex].querySelectorAll(".js-configuration__thumb-value"));var s=$(".js-configuration__field-step-size");this.elements.stepSize=Array.from($(s[this.sliderIndex]).find(".js-input__value")),this.elements.orientationButtons=Array.from($(this.elements.panel).find(".js-radio-button__content")),this.elements.checkboxContainer=Array.from($(this.elements.panel).find(".js-checkbox-button")),this.elements.checkboxInputTooltip=Array.from($(this.elements.panel).find(".js-checkbox-button__tooltip")),this.elements.checkboxInputScaleOfValues=Array.from($(this.elements.panel).find(".js-checkbox-button__scale-of-values")),this.elements.forms=Array.from(document.querySelectorAll(".js-configuration"))},e.prototype.setValuesFromState=function(e){null!==this.elements.orientationButtons&&("horizontal"===e.orientation&&(this.elements.orientationButtons[0].checked=!0),"vertical"===e.orientation&&(this.elements.orientationButtons[1].checked=!0)),null!==this.elements.minValue&&(this.elements.minValue.value=String(e.min)),null!==this.elements.maxValue&&(this.elements.maxValue.value=String(e.max)),null!==this.elements.countSliderThumbs&&(this.elements.countSliderThumbs[0].value=String(e.thumbsCount)),null!==this.elements.stepSize&&(this.elements.stepSize[0].value=String(e.step)),null!==this.elements.checkboxInputTooltip&&(e.isTooltip?this.elements.checkboxInputTooltip[0].checked=!0:this.elements.checkboxInputTooltip[0].checked=!1),null!==this.elements.checkboxInputScaleOfValues&&(e.isScaleOfValues||(this.elements.checkboxInputScaleOfValues[0].checked=!1),e.isScaleOfValues&&(this.elements.checkboxInputScaleOfValues[0].checked=!0))},e.prototype.createInput=function(e){var n=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list"));n[this.sliderIndex].innerHTML="";var i=document.createDocumentFragment();new Array(e.thumbsCount).fill(1).forEach(function(n,l){var s=t.default.createElement("li","configuration__thumbs-item js-configuration__thumbs-item"),u=t.default.createElement("input","configuration__thumbs-value js-configuration__thumb-value");u.setAttribute("type","number"),u.setAttribute("step","any"),u.setAttribute("value",String(e.thumbsValues[l])),s.append(u),i.append(s)}),n[this.sliderIndex].append(i),this.elements.inputsSliderThumbs=Array.from(n[this.sliderIndex].querySelectorAll(".js-configuration__thumb-value")),this.listenInputsSliderThumbs()},e.prototype.bindEventListeners=function(){this.listenMinValue(),this.listenMaxValue(),this.listenThumbsCount(),this.listenStepSize(),this.listenOrientationSlider(),this.listenCheckboxContainer(),this.listenForm()},e.prototype.listenMinValue=function(){var e;null===(e=this.elements.minValue)||void 0===e||e.addEventListener("blur",this.handleElementClickOrBlur.bind(this))},e.prototype.listenMaxValue=function(){var e;null===(e=this.elements.maxValue)||void 0===e||e.addEventListener("blur",this.handleElementClickOrBlur.bind(this))},e.prototype.listenThumbsCount=function(){null!==this.elements.countSliderThumbs&&this.elements.countSliderThumbs[0].addEventListener("blur",this.handleElementClickOrBlur.bind(this))},e.prototype.listenStepSize=function(){null!==this.elements.stepSize&&this.elements.stepSize[0].addEventListener("blur",this.handleElementClickOrBlur.bind(this))},e.prototype.listenInputsSliderThumbs=function(){var e,t=this;null===(e=this.elements.inputsSliderThumbs)||void 0===e||e.forEach(function(e){e.addEventListener("blur",t.handleElementClickOrBlur.bind(t))})},e.prototype.listenOrientationSlider=function(){var e,t=this;null===(e=this.elements.orientationButtons)||void 0===e||e.forEach(function(e){e.addEventListener("click",t.handleElementClickOrBlur.bind(t))})},e.prototype.listenCheckboxContainer=function(){var e,t=this;null===(e=this.elements.checkboxContainer)||void 0===e||e.forEach(function(e){e.addEventListener("click",t.handleElementClickOrBlur.bind(t))})},e.prototype.listenForm=function(){var e=this;null!==this.elements.forms&&this.elements.forms.forEach(function(t){t.addEventListener("submit",e.handleElementFormSubmit.bind(e))})},e.prototype.handleElementClickOrBlur=function(){var e=this.getValuesFromAllInputs();this.connection.update(e)},e.prototype.getValuesFromAllInputs=function(){var e,t,n,i={min:Number(null===(e=this.elements.minValue)||void 0===e?void 0:e.value),max:Number(null===(t=this.elements.maxValue)||void 0===t?void 0:t.value),step:0,thumbsCount:0,thumbsValues:[],isScaleOfValues:!0,isTooltip:!0,orientation:"horizontal"};return null!==this.elements.stepSize&&(i.step=Number(this.elements.stepSize[0].value)),null!==this.elements.countSliderThumbs&&(i.thumbsCount=Number(this.elements.countSliderThumbs[0].value)),null===(n=this.elements.inputsSliderThumbs)||void 0===n||n.forEach(function(e,t){i.thumbsValues[t]=Number(e.value)}),null!==this.elements.checkboxInputScaleOfValues&&(this.elements.checkboxInputScaleOfValues[0].checked||(i.isScaleOfValues=!1)),null!==this.elements.checkboxInputTooltip&&(this.elements.checkboxInputTooltip[0].checked||(i.isTooltip=!1)),null!==this.elements.orientationButtons&&!0===this.elements.orientationButtons[1].checked&&(i.orientation="vertical"),i},e}();exports.default=n;
},{"./utilities":"nxTo"}],"UAn3":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e={min:0,max:100,thumbsValues:[20,32,44,60],orientation:"horizontal",thumbsCount:4,step:2,isTooltip:!0,isScaleOfValues:!0};exports.default=e;
},{}],"Hogb":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var s=t(require("./defaultState")),e=function(){function t(t){this.state={min:s.default.min,max:s.default.max,thumbsValues:s.default.thumbsValues,orientation:s.default.orientation,thumbsCount:s.default.thumbsCount,step:s.default.step,isTooltip:s.default.isTooltip,isScaleOfValues:s.default.isScaleOfValues},this.emitter=t,this.notifyStateChanged()}return t.prototype.updateState=function(t){this.state=t,this.normolizeState()},t.prototype.normolizeState=function(){var t=this;this.state.min<0&&(this.state.min=s.default.min),this.state.step<=0&&(this.state.step=1),this.state.thumbsCount<=0&&(this.state.thumbsCount=1),["horizontal","vertical"].includes(this.state.orientation)||(this.state.orientation=s.default.orientation),Number.isInteger(this.state.min)||(this.state.min-=this.state.min-Math.floor(this.state.min)),Number.isInteger(this.state.max)||(this.state.max-=this.state.max-Math.floor(this.state.max)),Number.isInteger(this.state.thumbsCount)||(this.state.thumbsCount-=this.state.thumbsCount-Math.floor(this.state.thumbsCount));var e=this.state.min+this.state.step*(this.state.thumbsCount+1);if(this.state.max<e&&(this.state.max=e),this.state.thumbsValues.length<this.state.thumbsCount){var a=this.state.thumbsCount-this.state.thumbsValues.length;new Array(a).fill(1).forEach(function(){t.state.thumbsValues[t.state.thumbsValues.length]=t.state.thumbsValues[t.state.thumbsValues.length-1]+t.state.step})}if(this.state.thumbsValues.length>this.state.thumbsCount&&this.state.thumbsCount>0){var h=this.state.thumbsValues.length-this.state.thumbsCount;new Array(h).fill(1).forEach(function(){t.state.thumbsValues.splice(-1,1)})}this.checkThumbsValues(this.state.thumbsValues),this.notifyStateChanged()},t.prototype.setNewThumbValue=function(t,s){if(this.state.thumbsValues[s]!==t){this.state.thumbsValues[s]=t;for(var e=s;e<this.state.thumbsValues.length;e+=1)this.state.thumbsValues[e]>=this.state.thumbsValues[e+1]&&(this.state.thumbsValues[e+1]=this.state.thumbsValues[e]+this.state.step);for(e=s;e>0;e-=1)this.state.thumbsValues[e]<=this.state.thumbsValues[e-1]&&(this.state.thumbsValues[e-1]=this.state.thumbsValues[e]-this.state.step);this.checkThumbsValues(this.state.thumbsValues)}},t.prototype.requestThumbValueChange=function(t,s){var e=Math.round(t);e!==this.state.thumbsValues[s]&&this.setNewThumbValue(e,s)},t.prototype.checkThumbsValues=function(t){var s=this;t.forEach(function(e,a){var h,u,i,n=Math.floor(10*e)/10,o=s.state.min+a*s.state.step,m=Math.round((s.state.max-s.state.min)%s.state.step*10)/10;if(h=m>0?a===t.length-1?s.state.max:s.state.max-(t.length-a-2)*s.state.step-m:s.state.max-(t.length-a-1)*s.state.step,n<o)n=o;else if(n>=h)n=h;else{var l=Math.round(10*(n-s.state.min))/10,r=Math.floor(l/s.state.step),b=(u=l,i=s.state.step,Math.abs(Math.round(1e4*(u-r*i))/1e4)),f=void 0;if(b>0){f=r*s.state.step+s.state.min;var p=Math.round((s.state.max-s.state.min)%s.state.step*10)/10,V=s.state.max-p;if(n>V&&n<s.state.max)f=n>V+p/2?s.state.max:V}else f=r*s.state.step+s.state.min;var d=Math.round(b/s.state.step)*s.state.step;n=Math.round(10*(d+f))/10}n!==s.state.thumbsValues[a]&&(s.state.thumbsValues[a]=n),s.notifyThumbsValuesChanged()})},t.prototype.notifyStateChanged=function(){this.emitter.emit("model:state-changed",this.state)},t.prototype.notifyThumbsValuesChanged=function(){this.emitter.emit("model:thumbsValues-changed",this.state)},t}();exports.default=e;
},{"./defaultState":"UAn3"}],"bDfq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(e,t){var r=document.createElement(e);return r.className=t,r};exports.default=e;
},{}],"G9CN":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e={calculateValue:function(e,t,r){return(e+r)/t},calculateValueForClickOnScale:function(e,t,r){var a=e/t,l=Math.floor(a/r)*r;return a=a>l+r/2?l+r:l}};exports.default=e;
},{}],"rxSt":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var i=e(require("../functions/createElement")),t=e(require("./utilities/utilities")),s=function(){function e(e,i){this.slider=e,this.emitter=i,this.divisionsElements=[],this.valuesDivisions=[],this.min=0,this.max=0}return e.prototype.renderProgressBar=function(e,i){this.adapter=i,this.step=e.step,this.thumbsValues=e.thumbsValues,this.min=e.min,this.max=e.max,this.createProgressBar(e.orientation),e.isScaleOfValues&&this.renderDivisions(e)},e.prototype.createProgressBar=function(e){var t=i.default("div","slider__progress-bar js-slider__progress-bar"),s=i.default("span","slider__active-range js-slider__active-range");"vertical"===e&&t.classList.add("slider__progress-bar_vertical"),this.progressBar=t,this.activeRange=s,t.append(s),this.slider.append(t),this.listenProgressBarClick()},e.prototype.listenProgressBarClick=function(){this.progressBar.addEventListener("click",this.handleProgressBarClick.bind(this),!0)},e.prototype.updateActiveRange=function(e,i,t){var s,a=(e[0]-i)/(t-i)*100,r=(e[e.length-1]-i)/(t-i)*100,n=0;1===e.length?s=a:e.length>1&&(n=a,s=r-a),this.activeRange.style[this.adapter.margin]=n+"%",this.activeRange.style[this.adapter.length]=s+"%"},e.prototype.renderDivisions=function(e){var t,s=e.max,a=e.min,r=e.step,n=e.orientation,l=(s-a)/r;l>10&&(l=10),t=Math.floor(r*Math.ceil(l/r)*100)/10,t=Math.ceil(t)-t>=.5?Math.floor(t)/10:Math.ceil(t)/10;var o=i.default("div","slider__scale-value-container js-slider__scale-value-container");"vertical"===n&&o.classList.add("slider__scale-value-container_vertical");var c=this.createElementsDivisions(t,e);o.append(c),this.slider.append(o),this.setDivisionsInPlaces()},e.prototype.createElementsDivisions=function(e,t){var s=this,a=t.max,r=t.min,n=t.step,l=t.orientation,o=a-r-(a-r)/n*n,c=Math.ceil((a-r)/e)+1;o>0&&(c+=1);var h=r,u=e-Math.floor(e);new Array(c).fill(1).forEach(function(i,t){if(0===t)s.valuesDivisions[t]=r,h+=e,h=Math.ceil(10*h)/10;else if(t===c-1)s.valuesDivisions[t]=a;else if(s.valuesDivisions[t]=h,h+=e,0===u)h=Math.ceil(10*h)/10;else{var n=Math.floor(100*h)/10;n=Math.ceil(n)-n>=.5?Math.floor(n)/10:Math.ceil(n)/10,h=n}});var d=document.createDocumentFragment();return this.valuesDivisions.forEach(function(e){var t=i.default("div","slider__scale-value js-slider__scale-value"),a=i.default("span","slider__scale-value-with-number js-slider__scale-value-with-number");"vertical"===l&&(t.classList.add("slider__scale-value_vertical"),a.classList.add("slider__scale-value-with-number_vertical")),a.innerHTML=String(Math.floor(10*e)/10),t.append(a),d.append(t),s.divisionsElements.push(t)}),this.listenScaleValueEvents(),d},e.prototype.setDivisionsInPlaces=function(){var e=this;this.divisionsElements.forEach(function(i,t){var s=e.progressBar[e.adapter.offsetLength]/(e.max-e.min),a=s*e.min,r=i,n=100*(t===e.divisionsElements.length-1?s*e.valuesDivisions[t]-a-1:s*e.valuesDivisions[t]-a)/e.progressBar.clientWidth;r.style[e.adapter.margin]=n+"%"})},e.prototype.listenScaleValueEvents=function(){var e=this;this.divisionsElements.forEach(function(i,t){i.addEventListener("click",e.handleSerifScaleClick.bind(e,t,e.valuesDivisions),!0)})},e.prototype.findAndSetTheNearestThumb=function(e){var i=[],t=[];this.thumbsValues.forEach(function(s){var a=s-e;i.push(Math.abs(a));var r=s+e;t.push(Math.abs(r))});var s=null,a=null,r=function(e,i){null===s&&(s=e),null===a&&(a=i),e<s&&(s=e,a=i)};i.forEach(function(e,i){r(e,i)}),t.forEach(function(e,i){r(e,i)}),null!==a&&s!==e&&this.emitter.emit("view:thumbValue-changed",{value:e,index:a})},e.prototype.handleProgressBarClick=function(e){var i,s=this.progressBar.getBoundingClientRect(),a=e.clientX-s.x,r=this.progressBar[this.adapter.offsetLength]/(this.max-this.min);i=a+r*this.min;var n=t.default.calculateValueForClickOnScale(i,r,this.step);this.findAndSetTheNearestThumb(n)},e.prototype.handleSerifScaleClick=function(e,i){this.findAndSetTheNearestThumb(i[e])},e}();exports.default=s;
},{"../functions/createElement":"bDfq","./utilities/utilities":"G9CN"}],"SQ9n":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("../functions/createElement")),i=t(require("./utilities/utilities")),s=function(){function t(t,e){this.slider=t,this.emitter=e,this.thumbs=[],this.startMoveAxis=0,this.target=null,this.indexActiveThumb=null,this.min=0,this.max=0}return t.prototype.renderThumbs=function(t,e){this.adapter=e,this.min=t.min,this.max=t.max,this.createThumbs(t.thumbsCount),this.listenThumbsEvents(),this.setValuesThumbs(t.thumbsValues,t.min,t.max)},t.prototype.createThumbs=function(t){var i=this,s=document.createDocumentFragment();new Array(t).fill(1).forEach(function(){var t=e.default("div","slider__thumb js-slider__thumb");i.thumbs.push(t),s.append(t)}),this.slider.append(s)},t.prototype.listenThumbsEvents=function(){var t=this;this.thumbs.forEach(function(e,i){e.addEventListener("mousedown",t.handleThumbStart.bind(t,i))})},t.prototype.setValuesThumbs=function(t,e,i){var s=this;this.thumbs.forEach(function(n,h){var o,u;if(void 0!==(null===(o=s.adapter)||void 0===o?void 0:o.direction)){var r=s.thumbs[h],a=(t[h]-e)/(i-e)*100;r.style[null===(u=s.adapter)||void 0===u?void 0:u.direction]="calc(("+a+"%) - (24px * "+a/100+"))"}})},t.prototype.processStart=function(t,e){var i;t.preventDefault(),this.indexActiveThumb=e,this.target=this.thumbs[e];var s=this.target[null===(i=this.adapter)||void 0===i?void 0:i.offsetDirection];this.startMoveAxis=t.pageX-s,document.addEventListener("mousemove",this.handleThumbMove.bind(this)),document.addEventListener("mouseup",this.handleThumbStop.bind(this))},t.prototype.processMove=function(t){var e;if(null!==this.indexActiveThumb&&null!==this.target){var s=t[null===(e=this.adapter)||void 0===e?void 0:e.pageAxis]-this.startMoveAxis,n=this.slider.querySelector(".slider__progress-bar");if(null!==n){var h=n[this.adapter.offsetLength]/(this.max-this.min),o=h*this.min,u=i.default.calculateValue(s,h,o);this.emitter.emit("view:thumbValue-changed",{value:u,index:this.indexActiveThumb})}}},t.prototype.processStop=function(){this.target=null,this.indexActiveThumb=null,document.removeEventListener("mousemove",this.handleThumbMove.bind(this)),document.removeEventListener("mouseup",this.handleThumbStop.bind(this))},t.prototype.handleThumbStart=function(t,e){this.processStart(e,t)},t.prototype.handleThumbMove=function(t){this.processMove(t)},t.prototype.handleThumbStop=function(){this.processStop.call(this)},t}();exports.default=s;
},{"../functions/createElement":"bDfq","./utilities/utilities":"G9CN"}],"jpfE":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("../functions/createElement")),o=function(){function t(t){this.slider=t,this.tooltipsElements=[],this.textInTooltips=[]}return t.prototype.renderTooltips=function(t){t.isTooltip&&(this.createTooltips(t.thumbsCount,t.orientation),this.setTooltipsValues(t.thumbsValues))},t.prototype.createTooltips=function(t,o){var i=this;new Array(t).fill(1).forEach(function(s,l){var r=e.default("div","slider__tooltip js-slider__tooltip"),n=e.default("span","slider__tooltip-text js-slider__tooltip-text");"vertical"===o&&n.classList.add("slider__tooltip-text_vertical"),r.append(n);var p=i.slider.querySelectorAll(".js-slider__thumb");p[p.length-(t-l)].append(r),i.tooltipsElements.push(r),i.textInTooltips.push(n)})},t.prototype.setTooltipsValues=function(t){var e=this;t.forEach(function(t,o){e.textInTooltips[o].innerHTML=String(t)})},t}();exports.default=o;
},{"../functions/createElement":"bDfq"}],"J3kX":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("./ProgressBar")),s=t(require("./Thumbs")),i=t(require("./Tooltips")),r=function(){function t(t,e){var s=this;this.slider=t,this.emitter=e,this.emitter.makeSubscribe("model:state-changed",function(t){s.initialize(t),s.render(t)}),this.emitter.makeSubscribe("model:thumbsValues-changed",function(t){s.update(t)})}return t.prototype.initialize=function(t){this.slider.innerHTML="",this.setAdapter(t.orientation),this.progressBar=new e.default(this.slider,this.emitter),this.thumbs=new s.default(this.slider,this.emitter),this.tooltips=new i.default(this.slider)},t.prototype.render=function(t){this.progressBar.renderProgressBar.call(this.progressBar,t,this.adapter),this.thumbs.renderThumbs.call(this.thumbs,t,this.adapter),this.progressBar.updateActiveRange(t.thumbsValues,t.min,t.max),this.tooltips.renderTooltips.call(this.tooltips,t)},t.prototype.update=function(t){this.thumbs.setValuesThumbs(t.thumbsValues,t.min,t.max),this.tooltips.setTooltipsValues(t.thumbsValues),this.progressBar.updateActiveRange(t.thumbsValues,t.min,t.max)},t.prototype.setAdapter=function(t){"horizontal"===t?this.adapter={offsetDirection:"offsetLeft",offsetAxis:"offsetX",offsetLength:"offsetWidth",pageAxis:"pageX",currentAxis:"currentX",direction:"left",margin:"marginLeft",length:"width"}:"vertical"===t&&(this.adapter={offsetDirection:"offsetTop",offsetAxis:"offsetY",offsetLength:"offsetHeight",pageAxis:"pageY",currentAxis:"currentY",direction:"top",margin:"marginTop",length:"height"})},t}();exports.default=r;
},{"./ProgressBar":"rxSt","./Thumbs":"SQ9n","./Tooltips":"jpfE"}],"ZLDa":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("./Model/Model")),i=e(require("./view/View")),u=function(){function e(e,u){var r=this;this.slider=e,this.slider.classList.add("slider"),new i.default(this.slider,u),this.model=new t.default(u),u.makeSubscribe("view:thumbValue-changed",function(e){r.model.requestThumbValueChange(e.value,e.index)})}return e.prototype.getState=function(){return this.model.state},e.prototype.updateState=function(e){this.model.updateState(e)},e}();exports.default=u;
},{"./Model/Model":"Hogb","./view/View":"J3kX"}],"f04h":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){function t(){this.handlersByEvent={}}return t.prototype.makeSubscribe=function(t,e){var n=this;return this.handlersByEvent[t]||(this.handlersByEvent[t]=[]),this.handlersByEvent[t].push(e),function(){n.handlersByEvent[t]=n.handlersByEvent[t].filter(function(t){return e!==t})}},t.prototype.emit=function(t,e,n){var r=this.handlersByEvent[t];r&&r.forEach(function(t){t.call(null,e,n)})},t}();exports.default=t;
},{}],"UIyJ":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("./Controller")),i=t(require("./EventEmitter")),s=function(){function t(t,s){this.slider=t,this.emitter=new i.default,this.controller=new e.default(this.slider,this.emitter),this.getStateAction=this.getState.bind(this),this.updateAction=this.update.bind(this),this.modelChangesAction=this.subscribeToModelChanges.bind(this),this.thumbsChangesAction=this.subscribeToThumbsChanges.bind(this),this.update(s)}return t.prototype.getState=function(){return this.controller.getState()},t.prototype.update=function(t){this.controller.updateState(t)},t.prototype.subscribeToModelChanges=function(t){this.emitter.makeSubscribe("model:state-changed",function(e){t(e)})},t.prototype.subscribeToThumbsChanges=function(t){this.emitter.makeSubscribe("model:thumbsValues-changed",function(e){t(e)})},t}();exports.default=s;
},{"./Controller":"ZLDa","./EventEmitter":"f04h"}],"douT":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("./Wrapper"));!function(t){var a=t;a.fn.slider=function(){var a=this[0],s=this.data(),i=t.extend(!0,{min:0,max:100,thumbsValues:[20,32,44,60],orientation:"horizontal",thumbsCount:4,step:2,isTooltip:!0,isScaleOfValues:!0},s),n=new e.default(a,i);return this.data("getState",n.getStateAction),this.data("update",n.updateAction),this.data("subscribeToModelChanges",n.modelChangesAction),this.data("subscribeToThumbsChanges",n.thumbsChangesAction),this},a.fn.extend(a.fn.slider)}(jQuery);
},{"./Wrapper":"UIyJ"}],"wE2S":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var r=e(require("../components/configuration-panel/configuration-panel"));require("../../slider/slider");var t=$(".js-slider-test");t.each(function(e,t){new r.default($(t).slider().css({backgroundColor:"#ffe9f4"}),e)});
},{"../components/configuration-panel/configuration-panel":"Lm8H","../../slider/slider":"douT"}]},{},["wE2S"], null)
//# sourceMappingURL=/jQuery-slider/demo.4cc6bcec.js.map