export interface IAdapter {
  offsetDirection: 'offsetLeft' | 'offsetTop';
  offsetAxis: 'offsetX' | 'offsetY';
  offsetLength: 'offsetWidth' | 'offsetHeight';
  pageAxis: 'pageX' | 'pageY';
  currentAxis: 'currentX' | 'currentY';
  direction: 'left' | 'top';
  position: 'left' | 'top';
  length: 'width' | 'height';
}
