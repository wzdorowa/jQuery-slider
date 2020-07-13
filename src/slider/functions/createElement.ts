/* функция CreateElement создает необходимый элемент с заданным классом */
const createElement = (teg: string, className: string): HTMLElement => {
  const element: HTMLElement = document.createElement(teg);
  element.className = className;
  return element;
};
export default { createElement };
