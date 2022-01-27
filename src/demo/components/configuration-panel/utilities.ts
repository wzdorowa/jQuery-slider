import { IHTMLElement } from '../../../slider/interfaces/iHTMLElement';

const utilities = {
  createElement(tag: string, className: string): IHTMLElement {
    const htmlElement: IHTMLElement = document.createElement(
      tag,
    ) as IHTMLElement;
    htmlElement.className = className;
    return htmlElement;
  },
};

export default utilities;
