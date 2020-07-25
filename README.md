# Slider - plugin for jQuery
Плагин для jQuery, который реализовывает функционал «бегунка» (также называемого слайдером) — специальный контрол, который позволяет перетягиванием задавать какое-то числовое значение.

## Клонирование
`git clone https://github.com/wzdorowa/jQuery-slider`

## Установка пакетов
`npm install`

## Команды
Сборка проекта: `npm run dev`

Запуск тестов: `npm run test`

## Использование
Для подключения слайдера на страницу необходимо вызвать функцию `slider()` на html-элементе:

`$('.js-slider-test').slider();`

Изменение параметров слайдера извне или получение данных об актуальном состоянии слайдера достигается путем вызова определенных методов на элементе слайдера для передачи данных.

Под `element` в примерах ниже подразумевается html-блок на котором отрисовывается слайдер.

`element.getState()` - получить актуальное состояние слайдера;

`element.setNewValueMin(value)` - передать данные для установки нового минимального значения слайдера;

`element.setNewValueMax(value)` - передать данные для установки нового максимального значения слайдера;

`element.setNewValueAmount(value)` - передать данные для установки нового количества бегунков;

`element.setNewValueThumbsValues(value, index)` - передать данные для установки нового значения бегунка. Аргумент index в данном случает означает порядковый номер бегунка. (Нумерация бегунков начинается с нуля, то есть если новое значение нужно установить для третьего бегунка, то его index будет равен двум).

`element.setNewValueStep(value)` - передать данные для установки нового значения размера шага;

`element.setNewValueOrientation(value)` - передать данные для установки ориентации слайдера. Возможные варианты значений: 'horizontal' или 'vertical';

`element.setNewValueTooltip(value)` - передать данные для установки видимости тултипов. Возможные варианты значений: `true` или `false`;

`element.subscribeToStateModel(createInput, isCreatedInput, amountInputs, changeAmountInputs,
            setValueToInputFromModelState, setValueToStepFromModelState, setValueToMinInputFromModelState,
            setValueMaxInputFromModelState)` - подписаться на изменения состояния слайдера, для получения актуальных значений (например, при движении бегунка);

# Архитектура приложения
![UML-diagram](architectureDiagram.svg)

## Controller
Реализует интерфейс IHTMLElement, чтобы на элементе слайдера можно было вызывать методы для взаимодействия с моделью + он же создает экземпляры view, model и eventEmitter.

## EventEmitter
Управляет событиями и реализует возможность любым элементам "подписаться" на них и быть вкурсе происходящего.

Предоставляет доступ к методам:

`subscribe(eventName: string, fn: Function): Function` - этот метод принимает в качестве аргументов название события в строковом виде (например, 'event:name-changed') и функцию, которая будет вызываться, когда будет инициироваться транслируемое событие;

`emit(eventName: string, data: object): void` - этот метод принимает имя события в строковом виде, которое мы хотим всем транслировать, и данные, которые будут отправляться в момент этого события. Если в экземпляре класса сохранены какие-то подписанные на него события, мы проходимся по каждому из них и вызываем каждое, передавая ему данные, которые хотим транслировать;

## Model
Реализует интерфейс IModelState, который описывает стуктуру данных, находящихся в публичном поле модели state. Хранит в себе текущее состояние слайдера и логику для изменения этого состояния. Использует EventEmitter для корректного реагирования на события, происходящие в других модулях, а также для извещения других модулей об изменении текущего состояния слайдера. Предоставляет доступ к данным:
* min - минимальное значение слайдера
* max - максимальное значение слайдера
* thumbsValues - массив значений бегунков слайдера
* orientation - ориентация слайдера
* amount - количество бегунков слайдера
* step - размер шага слайдера
* tooltip - наличие тултипов слайдера

Предоставляет доступ к методам:

`setNewValueMin(min: number): void` - принимает на вход число и устанавливает его в state.min модели;

`setNewValueMax(max: number): void` - принимает на вход число и устанавливает его в state.max модели;

`setNewValueAmount(amount: number): void` - принимает на вход число и устанавливает его в state.amount модели;

`setNewValueThumbsValues(thumbValue: number, index: number): void` - принимает на вход численное значение для бегунка и его индекс и устанавливает его значение по индексу в state.thumbsValues модели;

`setNewValueStep(step: number): void` - принимает на вход число и устанавливает его в state.step модели;

`setNewValueTooltip(value: boolean): void` - принимает на вход boolean-значение и устанавливает его в state.tooltip модели;

`setNewValueOrientation(value: string): void` - принимает на вход строковое значение и устанавливает его в state.orientation модели;

## View
Создает экземпляры Scale, Thumbs, Tooltips. Использует EventEmitter для корректного реагирования на изменения в модели. При измененияя состояния модели, регулирует работу созданных экземпляров scale, thumbs, tooltips. Использует интерфейс IModelState для передачи текущего состояния в методы созданных экзкмпляров scale, thumbs, tooltips по необходимости. Использует интерфейс IConfigurator для возможности использовать модули configuratorHorizontal и configuratorVertical. Использует модули configuratorHorizontal и configuratorVertical для корректного реагирования на свойство "orientation" текущего состояния модели и для передачи этих модулей в методы экземпляров scale, thumbs, tooltips.

## Scale
Отвечает за отрисовку основной шкалы слайдера и за отрисовку шкалы активного интервала значений. Использует интерфейсы IModelState и IConfigurator для типизации параметров методов использующих значения реализуемые данные интерфейсы.

Предоставляет доступ к публичным свойствам:

`slider: HTMLElement` - хранит в себе элемент слайдера;

`scale!: HTMLElement` - хранит в себе элемент шкалы;

`activeRange!: HTMLElement` - хранит в себе элемент активной линии шкалы;

Предоставляет доступ к публичным методам:

`createScale(driver: IDriver): void` - добавляет элементы шкалы в основную html-структуру слайдера;

`changeOrientation(setThumbToNewPosition: (event: MouseEvent, modelState: IModelState, driver: IDriver) => void, modelState: IModelState, driver: IDriver): void` - перерисовывает элементы шкалы в случае смены ориентации слайдера;

`listenScaleEvents(setThumbToNewPosition: (event: MouseEvent, modelState: IModelState, driver: IDriver) => void, modelState: IModelState, driver: IDriver): void` - навешивает обработчик события 'click' на элемент шкалы. Если событие происходит, запускает функцию `setThumbToNewPosition`, которая устанавливает ближайший бегунок на место клика;

## Tooltips
Отвечает за отрисовку или скрытие тултипов. Использует интерфейсы IModelState и IConfigurator для типизации параметров методов использующих значения реализуемые данные интерфейсы.

Предоставляет доступ к публичным свойствам:

`tooltipsElements: HTMLElement[]` - хранит в себе элементы тултипов;

`textInTooltips!: HTMLElement[]` - хранит в себе элементы для текстового содержимого тултипов;

Предоставляет доступ к публичным методам:

`createTooltips(amount: number, sliders: HTMLElement[], driver: IDriver): void` - добавляет элементы тултипов в основную html-структуру слайдера;

`setTooltipsValues(modelState: IModelState): void` - устанавливает значения бегунков по-умолчанию в соответствующие им тултипы;

`changeAmountTooltips(sliders: HTMLElement[], driver: IDriver, modelState: IModelState): void` - изменяет количество отрисованных тултипов;

`changeOrientation(driver: IDriver): void` - перерисовывает тултипы при смене ориентации;

`setCurrentTooltipValue(modelState: IModelState, i: number): void` - метод устанавливает текущее значение в тултип ползунка при его движении;

`hideTooltip(): void` - метод скрывает туллтипы ползунков;

`showTooltip(): void` - метод показывает тултипы ползунков;

## Thumbs
Реализует интерфейс IThumbsState. Отвечает за отрисовку бегунков слайдера их корректную расстановку на шкале и перемещение. Использует EventEmitter для оповещения об изменении текущего значения перемещаемого бегунка или о значении бегунка перемещенного в место клика по шкале. Использует интерфейсы IModelState и IConfigurator для типизации параметров методов использующих значения реализуемые данные интерфейсы.

Предоставляет доступ к публичным свойствам:

`state: IThumbsState` - хранит в себе полученное текущее состояние модели;

`driver: IDriver | null` - хранит в себе корректный конфигуратор в зависомости от данных об ориентации из стейта модели;

Предоставляет доступ к публичным методам:

`createThumbs(amount: number): void` - добавляет бегунки в родительский элемент слайдера;

`changeAmountThumbs(modelState: IModelState, driver: IDriver, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void` - изменяет количество отрисованных на шкале бегунков;

`listenThumbsEventsWhenChangingOrientation(modelState: IModelState, driver: IDriver, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void` - перенавешивает обработчик событий 'mousedown' на каждый бегунок при смене ориентации слайдера;

`listenThumbsEvents(modelState: IModelState, driver: IDriver, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void` - навешивает обработчик событий 'mousedown' на каждый созданный бегунок;

`listenNewThumbsEvents(amount: number, modelState: IModelState, driver: IDriver, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void` - навешивает обработчик событий 'mousedown' на каждый добавленный бегунок;

`listenSizeWindow(scale: HTMLElement, activeRange: HTMLElement, modelState: IModelState, driver: IDriver): void` - слушает событие 'resize' на странице со слайдером;

`listenSizeWindowWhenChangingOrientation(modelState: IModelState, driver: IDriver, scale: HTMLElement, activeRange: HTMLElement): void` - перенавешивает обработчик события при смене ориентации;

`setValueToNewThumb(amount: number, modelState: IModelState): void` - устанавливает значение для каждого добавленного бегунка;

`setValuesThumbs(modelState: IModelState, activeRange: HTMLElement, scale: HTMLElement, driver: IDriver): void` - расставляет бегунки по слайдеру в зависимости от полученных по-умолчанию значений;

`setNewValuesForThumbs(scale: HTMLElement, activeRange: HTMLElement, modelState: IModelState, driver: IDriver): void` - расставляет бегунки по слайдеру в зависимости от полученных новых значений;

`calculateValue(modelState: IModelState, currentValueAxis: number): number` - рассчитывает текущее значение бегунка;

`calculateValueOfPlaceOnScale(modelState: IModelState, i: number): void` - рассчитывает значение места бегунка на шкале;

`calculateValueOfPlaceClickOnScale(modelState: IModelState, currentValueAxis: number): number` - рассчитывает потенциальное значение бегунка на месте клика на шкале;

`setThumbToNewPosition(event: MouseEvent, modelState: IModelState, driver: IDriver): [number, number | null]` - метод для установки ближайшего ползунка на место клика по шкале слайдера;

`processStart(modelState: IModelState, event: MouseEvent, i: number, scale: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void` - метод для обработки данных бегунка при срабатывании на нем события 'mousedown';

`processMove(modelState: IModelState, event: MouseEvent, i: number, target: HTMLElement, activeRange: HTMLElement, setCurrentTooltipValue: (modelState: IModelState, i: number) => void): void` - метод для обработки данных бегунка при срабатывании на нем события 'mousemove';

`processStop(handleMove: (event: MouseEvent) => void, handleStop: (event: MouseEvent) => void, _event: MouseEvent, i: number, target: HTMLElement, modelState: IModelState, setCurrentTooltipValue:  (modelState: IModelState, i: number) => void): void` - метод для обработки данных бегунка при срабатывании на нем события 'mouseup';

## driverHorizontal
Реализует интерфейс IDriver. Используется для обработки операций связанных с работой горизонтального вида.

## driverVertical
Реализует интерфейс IDriver. Используется для обработки операций связанных с работой вертикального вида.

## IDriver 
Описывает интерфейс для обработки операций связанных с работой горизонтального или вертикального видов. Описывает доступные для реализации методы:

`getElementOffset(element: HTMLElement): number` - принимает на вход html-элемент и возвращает координату его начала на странице; 

`createElementTooltipText(): HTMLElement` - создает и возвращает html-элемент `span` для корректной отрисовки тултипов;

`createElementScale(): HTMLElement` - создает и возвращает html-элемент `div` для корректной отрисовки шкалы слайдера;

`createElementActivRange(): HTMLElement` - создает и возвращает html-элемент `span` для корректной отрисовки активной линии шкалы слайдера;

`searchElementsTooltipText(slider: HTMLElement): HTMLElement[]` - принимает на вход элемент слайдера и ищет в нем, а затем возвращает массив найденных элементов для текстового содержимого тултипа;

`calculateCoefficientPoint(elementSliderLine: HTMLElement, max: number, min: number): number` - прнимает на вход элемент шкалы, минимальное и максимальное значения слайдера и высчитывает, а затем возвращает коэффициент одного деления шкалы слайдера;

`searchElementScaleToDelete(slider: HTMLElement): JQuery<HTMLElement>` - принимает на вход элемент слайдера и ищет в нем, а затем возвращает найденный необходимый элемент для для удаления из разметки;

`searchElementActivRangeToDelete(slider: HTMLElement): JQuery<HTMLElement>` - принимает на вход элемент слайдера и ищет в нем, а затем возвращает найденный необходимый элемент для для удаления из разметки;

`setInPlaceThumb(elements: HTMLElement[], modelState: IModelState, elementSliderLineSpan: HTMLElement, elementSliderLine: HTMLElement): void` - высчитывает место на шкале и устанавлевает на него бегунок в соответствии с его значением, а так же меняет ширину активной линии шкалы; 

`setInPlaceNewThumb(elements: HTMLElement[], currentThumbIndex: number | null, coefficientPoint: number, modelState: IModelState, shiftToMinValue: number, elementSliderLineSpan: HTMLElement): void` - высчитывает место на шкале и устанавлевает на него добавленный бегунок в соответствии с его значением, а так же меняет ширину активной линии шкалы;

`getCurrentValueAxisToProcessStart(target: HTMLElement): number` - принимает на вход активный элемент бегунка и возвращает его необходимую координату;

`getStartValueAxisToProcessStart(eventThumb: MouseEvent, currentXorY: number): number` - вычисляет и возвращает координату начала движения бегунка;

`getMaxValueAxisToProcessStart(elementSliderLine: HTMLElement): number` - вычисляет и возвращает максимально возможную координату для движения бегунка;

`getCurrentValueAxisToProcessMove(eventThumb: MouseEvent, startXorY: number): number` - вычисляет и возвращает текущее значение координаты для активного бегунка;

`setIndentForTarget(target: HTMLElement, currentXorY: number): void` - устанавливает необходимый отступ для активного ползунка в стили элемента при его движении;

`getTargetWidth(target: HTMLElement): number` - вычисляет и возвращает ширину полученного на вход элемена;

`setIndentForTargetToProcessStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void` - устанавливает необходимый отступ для активного ползунка в стили элемента при его остановке;

`updateActiveRange(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void` - обновляет ширину активной линии слайдера;

`calculateClickLocation(event: MouseEvent, target: HTMLElement): number` - высчитывает и возвращает координату клика, если клик произошел на активной линии шкалы;

`getOffsetFromClick(event: MouseEvent): number` - - высчитывает и возвращает координату клика, если клик произошел на основной линии шкалы;

## Обмен данными между слоями

Обмен данными между слоями в большей степени осуществляется по средствам ивент эмиттера:

1. Вид подписан на изменения в модели. Как только в модели произошли изменения, вид по подписке получает новый стей и определенным образом на него реагирует.

2. Контроллер подписывается, например, на изменение значения бегунка, которое регулирует вид. Вид оповещает об изменении значения бегунка. Контроллер получает данные об изменении значения бегунка, передает эти данные в модель, после чего модель определенным образом обрабатывает полученные данные и оповещает об изменении своего состояния. Затем повторяется шаг 1.

# Сторонние библиотеки
В проекте используются следующие библиотеки:

## "parcel-bundler": "^1.12.4"
это сборщик веб-приложений;

## "pug": "^2.0.4"
Pug — это шаблонизатор Html, написанный на языке JavaScript для Node.js. После интерпретации сервером синтаксис Pug превращается в Нtml код. Старое название Pug — Jade.

## "sass": "^1.26.10"
Sass — это метаязык на основе CSS, предназначенный для увеличения уровня абстракции CSS-кода и упрощения файлов каскадных таблиц стилей.

## "jquery": "3.4.1"
jQuery - набор функций JavaScript, фокусирующийся на взаимодействии JavaScript и HTML. Библиотека jQuery помогает легко получать доступ к любому элементу DOM, обращаться к атрибутам и содержимому элементов DOM, манипулировать ими. Также библиотека jQuery предоставляет удобный API для работы с AJAX.

## "typescript": "^3.9.7"
TypeScript — язык программирования, представленный Microsoft в 2012 году и позиционируемый как средство разработки веб-приложений, расширяющее возможности JavaScript.

## "jest": "^25.5.4"
Jest - это среда тестирования JavaScript, поддерживаемая Facebook, Inc. с упором на простоту.

## "ts-jest": "^25.5.1"
ts-jest - это препроцессор TypeScript с поддержкой исходной карты для Jest, который позволяет использовать Jest для тестирования проектов, написанных на TypeScript.

## "jsdom": "16.2.2"
jsdom - это реализация многих веб-стандартов на чистом JavaScript, в частности, WHATWG DOM и HTML Standards, для использования с Node.js. В целом, цель проекта состоит в том, чтобы эмулировать достаточно подмножества веб-браузера, чтобы его можно было использовать для тестирования и анализа реальных веб-приложений.

## "puppeteer": "^2.1.1"
Puppeteer - это библиотека узлов, которая предоставляет API высокого уровня для управления Chrome или Chromium по протоколу DevTools. В данном проекте используется для интергационного тестирования.

## "sinon": "^9.0.2"
Sinon.JS - Автономный и тестовый фреймворк, независимый от JavaScript, использует для своих целей spies, stubs and mocks.