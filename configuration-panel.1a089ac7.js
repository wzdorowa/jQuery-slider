parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"nxTo":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e={createElement:function(e,t){var r=document.createElement(e);return r.className=t,r}};exports.default=e;
},{}],"Lm8H":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("./utilities")),n=function(){function e(e,t){var n=this;this.handleElementClickOrBlur=function(){var e=n.getValuesFromAllInputs();n.connection.update(e)},this.handleElementFormSubmit=function(e){e.preventDefault();var t=n.getValuesFromAllInputs();n.connection.update(t)},this.connection=e.data(),this.sliderIndex=t,this.elements=this.findElements(),this.connection.subscribeToStateChanges(function(e){n.render(e)}),this.connection.subscribeToThumbsChanges(function(e){n.updateThumbsValues(e)}),this.bindEventListeners(),this.render(this.connection.getState())}return e.prototype.render=function(e){this.createInput(e),this.setValuesFromState(e)},e.prototype.updateThumbsValues=function(e){var t;null===(t=this.elements.inputsSliderThumbs)||void 0===t||t.forEach(function(t,n){t.value=String(e[n])})},e.prototype.findElements=function(){var e=Array.from(document.querySelectorAll(".js-configuration"))[this.sliderIndex],t=$(".js-field__min-max"),n=Array.from($(t[this.sliderIndex]).find(".js-input__value")),i=n[0],s=n[1],l=$(".js-configuration__field-count-thumb"),u=Array.from($(l[this.sliderIndex]).find(".js-input__value")),r=$(".js-field__thumbs-values"),o=Array.from(r[this.sliderIndex].querySelectorAll(".js-configuration__thumb-value")),a=$(".js-configuration__field-step-size");return{panel:e,minValue:i,maxValue:s,countSliderThumbs:u,inputsSliderThumbs:o,stepSize:Array.from($(a[this.sliderIndex]).find(".js-input__value")),orientationButtons:Array.from($(e).find(".js-radio-button__content")),checkboxContainer:Array.from($(e).find(".js-checkbox-button")),checkboxInputTooltip:$(e).find('[name = "tooltip"]'),checkboxInputScaleOfValues:$(e).find('[name = "scale-of-values"]'),forms:Array.from(document.querySelectorAll(".js-configuration"))}},e.prototype.setValuesFromState=function(e){"horizontal"===e.orientation&&(this.elements.orientationButtons[0].checked=!0),"vertical"===e.orientation&&(this.elements.orientationButtons[1].checked=!0),this.elements.minValue.value=String(e.min),this.elements.maxValue.value=String(e.max),this.elements.countSliderThumbs[0].value=String(e.thumbsValues.length),this.elements.stepSize[0].value=String(e.step),this.elements.checkboxInputTooltip[0].checked=e.hasTooltips,this.elements.checkboxInputScaleOfValues[0].checked=e.hasScaleValues},e.prototype.createInput=function(e){var n=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list"));n[this.sliderIndex].innerHTML="";var i=document.createDocumentFragment();e.thumbsValues.forEach(function(n,s){var l=t.default.createElement("li","configuration__thumbs-item js-configuration__thumbs-item"),u=t.default.createElement("input","configuration__thumbs-value js-configuration__thumb-value");u.setAttribute("type","number"),u.setAttribute("step","any"),u.setAttribute("value",String(e.thumbsValues[s])),l.append(u),i.append(l)}),n[this.sliderIndex].append(i),this.elements.inputsSliderThumbs=Array.from(n[this.sliderIndex].querySelectorAll(".js-configuration__thumb-value")),this.listenInputsSliderThumbs()},e.prototype.bindEventListeners=function(){this.listenMinValue(),this.listenMaxValue(),this.listenThumbsCount(),this.listenStepSize(),this.listenOrientationSlider(),this.listenCheckboxContainer(),this.listenForm()},e.prototype.listenMinValue=function(){this.elements.minValue.addEventListener("blur",this.handleElementClickOrBlur)},e.prototype.listenMaxValue=function(){this.elements.maxValue.addEventListener("blur",this.handleElementClickOrBlur)},e.prototype.listenThumbsCount=function(){this.elements.countSliderThumbs[0].addEventListener("blur",this.handleElementClickOrBlur)},e.prototype.listenStepSize=function(){this.elements.stepSize[0].addEventListener("blur",this.handleElementClickOrBlur)},e.prototype.listenInputsSliderThumbs=function(){var e=this;this.elements.inputsSliderThumbs.forEach(function(t){t.addEventListener("blur",e.handleElementClickOrBlur)})},e.prototype.listenOrientationSlider=function(){var e=this;this.elements.orientationButtons.forEach(function(t){t.addEventListener("click",e.handleElementClickOrBlur)})},e.prototype.listenCheckboxContainer=function(){var e=this;this.elements.checkboxContainer.forEach(function(t){t.addEventListener("click",e.handleElementClickOrBlur)})},e.prototype.listenForm=function(){var e=this;this.elements.forms.forEach(function(t){t.addEventListener("submit",e.handleElementFormSubmit)})},e.prototype.getValuesFromAllInputs=function(){var e,t,n,i={min:Number(null===(e=this.elements.minValue)||void 0===e?void 0:e.value),max:Number(null===(t=this.elements.maxValue)||void 0===t?void 0:t.value),step:0,thumbsValues:[],hasScaleValues:!0,hasTooltips:!0,orientation:"horizontal"};i.step=Number(this.elements.stepSize[0].value),null===(n=this.elements.inputsSliderThumbs)||void 0===n||n.forEach(function(e,t){i.thumbsValues[t]=Number(e.value)});var s=Number(this.elements.countSliderThumbs[0].value);if(s>i.thumbsValues.length){var l=s-i.thumbsValues.length;new Array(l).fill(1).forEach(function(){var e=i.thumbsValues.length-1,t=i.thumbsValues.length;i.thumbsValues[t]=i.thumbsValues[e]+i.step})}if(s<i.thumbsValues.length){var u=i.thumbsValues.length-s,r=i.thumbsValues.length-u;i.thumbsValues.splice(r,u)}return this.elements.checkboxInputScaleOfValues[0].checked||(i.hasScaleValues=!1),this.elements.checkboxInputTooltip[0].checked||(i.hasTooltips=!1),!0===this.elements.orientationButtons[1].checked&&(i.orientation="vertical"),i},e}();exports.default=n;
},{"./utilities":"nxTo"}]},{},["Lm8H"], null)