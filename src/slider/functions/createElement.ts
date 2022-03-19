/* функция CreateElement создает необходимый элемент с заданным классом */
const createElement = (tag: string, className: string): HTMLElement => {
  const element: HTMLElement = document.createElement(tag);
  element.className = className;
  return element;
};
export default createElement;
