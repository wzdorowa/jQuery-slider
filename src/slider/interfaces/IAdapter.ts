export interface IAdapter {
  offsetDirection: 'offsetLeft' | 'offsetTop';
  offsetAxis: 'offsetX' | 'offsetY';
  offsetLength: 'offsetWidth' | 'offsetHeight';
  pageAxis: 'pageX' | 'pageY';
  clientAxis: 'clientX' | 'clientY';
  clientRect: 'x' | 'y';
  currentAxis: 'currentX' | 'currentY';
  direction: 'left' | 'top';
  position: 'left' | 'top';
  length: 'width' | 'height';
}
