parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Lm8H":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(e,t){var n=this;this.handleElementFormSubmit=function(e){if(e.preventDefault(),null!==n.elements.minValue){var t=Number(n.elements.minValue.value);n.slider.setNewValueMin(t)}if(null!==n.elements.maxValue){var i=Number(n.elements.maxValue.value);n.slider.setNewValueMax(i)}if(null!==n.elements.countSliderThumbs){var l=Number(n.elements.countSliderThumbs[0].value);n.slider.setNewValueCount(l)}if(n.setValueOfInputsSliderThumbs(),null!==n.elements.stepSize){var s=Number(n.elements.stepSize[0].value);n.slider.setNewValueStep(s)}},this.slider=e[0],this.isCreatedInput=!1,this.sliderIndex=t,this.elements={panel:null,minValue:null,maxValue:null,countSliderThumbs:null,inputsSliderThumbs:null,stepSize:null,orientationSlider:null,checkboxContainer:null,checkboxInputTooltip:null,checkboxInputScaleOfValues:null,forms:null},this.state=this.slider.getState(),this.initialize(),this.listenMinValue(),this.listenMaxValue(),this.listenThumbsCount(),this.listenStepSize(),this.listenInputsSliderThumbs(),this.listenOrientationSlider(),this.listenCheckboxContainer(),this.listenForm(),this.slider.subscribeToStateModel(this.createInput,this.isCreatedInput,this.getCountInputs.bind(this),this.changeCountInputs.bind(this),this.setValueToInputFromModelState.bind(this),this.setValueToStepFromModelState.bind(this),this.setValueToMinInputFromModelState.bind(this),this.setValueMaxInputFromModelState.bind(this))}return e.prototype.initialize=function(){this.getState(),this.createInput(this.state),this.setValueToOrientationFromModelState(this.state),this.setValueToStepFromModelState(this.state),this.setValueToMinInputFromModelState(this.state),this.setValueMaxInputFromModelState(this.state),this.setValueToCheckboxTooltipFromModelState(this.state),this.setValueToCheckboxScaleOfValuesFromModelState(this.state),this.findElements()},e.prototype.getState=function(){this.state=this.slider.getState()},e.prototype.createElement=function(e,t){var n=document.createElement(e);return n.className=t,n},e.prototype.createInput=function(e){var t=this,n=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),i=document.createDocumentFragment();new Array(e.thumbsCount).fill(1).forEach(function(n,l){var s=t.createElement("li","configuration__thumbs-item js-configuration__thumbs-item"),r=t.createElement("input","configuration__thumbs-value js-configuration__thumbs-value");r.setAttribute("type","number"),r.setAttribute("value",String(e.thumbsValues[l])),s.append(r),i.append(s)}),n[this.sliderIndex].append(i),this.isCreatedInput||(this.isCreatedInput=!0)},e.prototype.setNewValueToNewInputs=function(e){var t=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),n=Array.from($(t[this.sliderIndex]).find(".js-configuration__thumbs-value")),i=n.length-1;n[i].value=String(e.thumbsValues[i])},e.prototype.changeCountInputs=function(e){var t=this,n=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),i=Array.from($(n[this.sliderIndex]).find(".js-configuration__thumbs-item"));if(i.length<e.thumbsCount){var l=e.thumbsCount-i.length,s=document.createDocumentFragment();new Array(l).fill(1).forEach(function(n,i){var l=t.createElement("li","configuration__thumbs-item js-configuration__thumbs-item"),r=t.createElement("input","configuration__thumbs-value js-configuration__thumbs-value");r.setAttribute("type","number"),r.setAttribute("value",String(e.thumbsValues[i])),l.append(r),s.append(l),t.setNewValueToNewInputs(e)}),n[this.sliderIndex].append(s)}if(i.length>e.thumbsCount){var r=i.length-e.thumbsCount,u=Array.from($(n[this.sliderIndex]).find(".js-configuration__thumbs-item"));new Array(r).fill(1).forEach(function(){u[u.length-1].remove(),u.splice(-1,1)})}},e.prototype.setValueToOrientationFromModelState=function(e){var t=Array.from(document.querySelectorAll(".js-configuration")),n=Array.from($(t[this.sliderIndex]).find(".js-radio-button__content"));"horizontal"===e.orientation&&(n[0].checked=!0),"vertical"===e.orientation&&(n[1].checked=!0)},e.prototype.setValueToMinInputFromModelState=function(e){var t=Array.from(document.querySelectorAll(".js-field__min-max"));Array.from($(t[this.sliderIndex]).find(".js-input__value"))[0].value=String(e.min)},e.prototype.setValueMaxInputFromModelState=function(e){var t=Array.from(document.querySelectorAll(".js-field__min-max"));Array.from($(t[this.sliderIndex]).find(".js-input__value"))[1].value=String(e.max)},e.prototype.setValueToInputFromModelState=function(e){var t=Array.from(document.querySelectorAll(".js-configuration__thumbs-current-value-list")),n=Array.from($(t[this.sliderIndex]).find(".js-configuration__thumbs-value"));new Array(e.thumbsValues.length).fill(1).forEach(function(t,i){n[i].value=String(e.thumbsValues[i])})},e.prototype.setValueToStepFromModelState=function(e){var t=Array.from(document.querySelectorAll(".js-configuration__field-step-size"));Array.from($(t[this.sliderIndex]).find(".js-input__value"))[0].value=String(e.step)},e.prototype.setValueToCheckboxTooltipFromModelState=function(e){var t=Array.from(document.querySelectorAll(".js-configuration")),n=Array.from($(t[this.sliderIndex]).find(".js-checkbox-button__tooltip"));e.isTooltip||(n[0].checked=!1),e.isTooltip&&(n[0].checked=!0)},e.prototype.setValueToCheckboxScaleOfValuesFromModelState=function(e){var t=Array.from(document.querySelectorAll(".js-configuration")),n=Array.from($(t[this.sliderIndex]).find(".js-checkbox-button__scale-of-values"));e.isScaleOfValues||(n[0].checked=!1),e.isScaleOfValues&&(n[0].checked=!0)},e.prototype.getCountInputs=function(){var e=Array.from(document.querySelectorAll(".js-configuration"));return Array.from($(e[this.sliderIndex]).find(".js-configuration__thumbs-value"))},e.prototype.findElements=function(){var e=Array.from(document.querySelectorAll(".js-configuration"));this.elements.panel=e[this.sliderIndex];var t=$(".js-field__min-max"),n=Array.from($(t[this.sliderIndex]).find(".js-input__value"));this.elements.minValue=n[0],this.elements.maxValue=n[1];var i=$(".js-configuration__field-count-thumb");this.elements.countSliderThumbs=Array.from($(i[this.sliderIndex]).find(".js-input__value"));var l=$(".js-field__thumbs-value");this.elements.inputsSliderThumbs=Array.from($(l[this.sliderIndex]).find(".js-configuration__thumbs-value"));var s=$(".js-configuration__field-step-size");this.elements.stepSize=Array.from($(s[this.sliderIndex]).find(".js-input__value")),this.elements.orientationSlider=Array.from($(this.elements.panel).find(".js-radio-button")),this.elements.checkboxContainer=Array.from($(this.elements.panel).find(".js-checkbox-button")),this.elements.checkboxInputTooltip=Array.from($(this.elements.panel).find(".js-checkbox-button__tooltip")),this.elements.checkboxInputScaleOfValues=Array.from($(this.elements.panel).find(".js-checkbox-button__scale-of-values")),this.elements.forms=Array.from(document.querySelectorAll(".js-configuration"))},e.prototype.setValueOfInputsSliderThumbs=function(){var e=this;this.findElements(),null!==this.elements.inputsSliderThumbs&&new Array(this.elements.inputsSliderThumbs.length).fill(1).forEach(function(t,n){if(null!==e.elements.inputsSliderThumbs){var i=Number(e.elements.inputsSliderThumbs[n].value);e.slider.setNewValueThumbsValues(i,n)}})},e.prototype.listenMinValue=function(){null!==this.elements.minValue&&this.elements.minValue.addEventListener("blur",this.handleMinValueBlur.bind(this))},e.prototype.listenMaxValue=function(){null!==this.elements.maxValue&&this.elements.maxValue.addEventListener("blur",this.handleMaxValueBlur.bind(this))},e.prototype.listenThumbsCount=function(){null!==this.elements.countSliderThumbs&&this.elements.countSliderThumbs[0].addEventListener("blur",this.handleCountSliderThumbsBlur.bind(this))},e.prototype.listenStepSize=function(){null!==this.elements.stepSize&&this.elements.stepSize[0].addEventListener("blur",this.handleStepSizeBlur.bind(this))},e.prototype.listenInputsSliderThumbs=function(){var e=this;null!==this.elements.inputsSliderThumbs&&new Array(this.elements.inputsSliderThumbs.length).fill(1).forEach(function(t,n){if(null!==e.elements.inputsSliderThumbs){e.elements.inputsSliderThumbs[n].addEventListener("blur",function(){if(null!==e.elements.inputsSliderThumbs){var t=Number(e.elements.inputsSliderThumbs[n].value);e.slider.setNewValueThumbsValues(t,n)}}.bind(e))}})},e.prototype.listenOrientationSlider=function(){var e=this;null!==this.elements.orientationSlider&&new Array(this.elements.orientationSlider.length).fill(1).forEach(function(t,n){null!==e.elements.orientationSlider&&e.elements.orientationSlider[n].addEventListener("click",function(){var t="";0===n&&(t="horizontal"),1===n&&(t="vertical"),e.slider.setNewValueOrientation(t)}.bind(e))})},e.prototype.listenCheckboxContainer=function(){null!==this.elements.checkboxContainer&&(this.elements.checkboxContainer[0].addEventListener("click",this.handleCheckboxTooltipClick.bind(this)),this.elements.checkboxContainer[1].addEventListener("click",this.handleCheckboxScaleOfValuesClick.bind(this)))},e.prototype.listenForm=function(){var e=this;null!==this.elements.forms&&this.elements.forms.forEach(function(t){t.addEventListener("submit",e.handleElementFormSubmit.bind(e))})},e.prototype.handleMinValueBlur=function(){if(null!==this.elements.minValue){var e=Number(this.elements.minValue.value);this.slider.setNewValueMin(e)}},e.prototype.handleMaxValueBlur=function(){if(null!==this.elements.maxValue){var e=Number(this.elements.maxValue.value);this.slider.setNewValueMax(e)}},e.prototype.handleCountSliderThumbsBlur=function(){if(null!==this.elements.countSliderThumbs){var e=Number(this.elements.countSliderThumbs[0].value);this.slider.setNewValueCount(e)}},e.prototype.handleStepSizeBlur=function(){if(null!==this.elements.stepSize){var e=Number(this.elements.stepSize[0].value);this.slider.setNewValueStep(e)}},e.prototype.handleCheckboxTooltipClick=function(){if(null!==this.elements.checkboxInputTooltip){var e=!0;this.elements.checkboxInputTooltip[0].checked&&(e=!0),this.elements.checkboxInputTooltip[0].checked||(e=!1),this.slider.setNewValueTooltip(e)}},e.prototype.handleCheckboxScaleOfValuesClick=function(){if(null!==this.elements.checkboxInputScaleOfValues){var e=!0;this.elements.checkboxInputScaleOfValues[0].checked&&(e=!0),this.elements.checkboxInputScaleOfValues[0].checked||(e=!1),this.slider.setNewValueScaleOfValues(e)}},e}();exports.default=e;
},{}]},{},["Lm8H"], null)
//# sourceMappingURL=/jQuery-slider/configuration-panel.40a14a22.js.map