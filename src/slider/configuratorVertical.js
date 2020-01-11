export const configuratorVertical = {
    setWidthHeightSliderContainer(slider) {
        slider.classList.remove('width-horizontal-slider-container');
        slider.classList.add('height-vertical-slider-container');
    },
    createSliderTooltipText(createElement) {
        return createElement('span', 'slider-tooltip-text-for-verticalView');
    },
    createSliderLine(createElement) {
        return createElement('div', 'slider-line-for-verticalView');
    },
    createSliderLineSpan(createElement) {
        return createElement('span', 'slider-line-span-for-verticalView');
    },
    
    calculateCoefficientPoint(elementSliderLine, max, min) {
        return (elementSliderLine.offsetHeight / (max - min));
    },
    calculateValueSliderTouch(elements, getCoefficientPoint, modelState, elementSliderLineSpan) {
        for(let i = 0; i < elements.length; i++) {
            elements[i].style.left = "";
            elements[i].style.top = (Math.ceil(getCoefficientPoint(modelState) * modelState.touchsValues[i])) + 'px';
        }
        elementSliderLineSpan.style.marginLeft = "";
        elementSliderLineSpan.style.width = "";

        elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        elementSliderLineSpan.style.height = (elements[elements.length - 1].offsetTop - elements[0].offsetTop) + 'px';
    },
    calculateNewValueSliderTouch(elements, currentTouchIndex, coefficientPoint, modelState, shiftToMinValue, elementSliderLineSpan) {
        for(let i = 0; i < elements.length && i != currentTouchIndex; i++) {
            elements[i].style.left = "";
            elements[i].style.top = (Math.ceil(coefficientPoint * modelState.touchsValues[i]) - shiftToMinValue) + 'px';
        }
        elementSliderLineSpan.style.marginLeft = "";
        elementSliderLineSpan.style.width = "";

        elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        elementSliderLineSpan.style.height = (elements[elements.length - 1].offsetTop - elements[0].offsetTop) + 'px';
    },
    setCurrentXorYtoOnStart(target) {
        return target.offsetTop;
    },
    setStartXorYtoOnStart(eventTouch, currentXorY) {
        return eventTouch.pageY - currentXorY;
    },
    setMaxXorYtoOnStart(elementSliderLine) {
        return elementSliderLine.offsetHeight;
    },
    setCurrentXorYtoOnMove(eventTouch, startXorY) {
        return eventTouch.pageY - startXorY;
    },
    setIndentForTarget(target, currentXorY) {
        target.style.top = currentXorY + 'px';
    },
    setIndentForTargetToOnStop(target, coefficientPoint, currentValue, shiftToMinValue) {
        target.style.top = Math.ceil(coefficientPoint * currentValue) - shiftToMinValue  + 'px';
    },
    updateLineSpan(elementSliderLineSpan, elements) {
        elementSliderLineSpan.style.marginTop = elements[0].offsetTop + 'px';
        elementSliderLineSpan.style.height = (elements[elements.length -1].offsetTop - elements[0].offsetTop) + 'px';
    },
};