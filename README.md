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

### Controller
Реализует интерфейс IHTMLElement, чтобы на элементе слайдера можно было вызывать методы для взаимодействия с моделью + он же создает экземпляры view, model и eventEmitter.

### EventEmitter
Управляет событиями и реализует возможность любым элементам "подписаться" на них и быть вкурсе происходящего.

Предоставляет доступ к методам:

`subscribe(eventName: string, fn: Function): Function` - этот метод принимает в качестве аргументов название события в строковом виде (например, 'event:name-changed') и функцию, которая будет вызываться, когда будет инициироваться транслируемое событие;

`emit(eventName: string, data: object): void` - этот метод принимает имя события в строковом виде, которое мы хотим всем транслировать, и данные, которые будут отправляться в момент этого события. Если в экземпляре класса сохранены какие-то подписанные на него события, мы проходимся по каждому из них и вызываем каждое, передавая ему данные, которые хотим транслировать;

### Model
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

### View
Создает экземпляры Scale, Thumbs, Tooltips. Использует EventEmitter для корректного реагирования на изменения в модели. При измененияя состояния модели, регулирует работу созданных экземпляров scale, thumbs, tooltips. Использует интерфейс IModelState для передачи текущего состояния в методы созданных экзкмпляров scale, thumbs, tooltips по необходимости. Использует интерфейс IConfigurator для возможности использовать модули configuratorHorizontal и configuratorVertical. Использует модули configuratorHorizontal и configuratorVertical для корректного реагирования на свойство "orientation" текущего состояния модели и для передачи этих модулей в методы экземпляров scale, thumbs, tooltips.

### Scale
Отвечает за отрисовку основной шкалы слайдера и за отрисовку шкалы активного интервала значений. Использует интерфейсы IModelState и IConfigurator для типизации параметров методов использующих значения реализуемые данные интерфейсы.

Предоставляет доступ к публичным свойствам:

`slider: HTMLElement` - хранит в себе элемент слайдера;

`scale!: HTMLElement` - хранит в себе элемент шкалы;

`activeRange!: HTMLElement` - хранит в себе элемент активной линии шкалы;

Предоставляет доступ к публичным методам:

`createScale(configurator: IConfigurator): void` - добавляет элементы шкалы в основную html-структуру слайдера;

`changeOrientation(setThumbToNewPosition: (event: MouseEvent, modelState: IModelState, configurator: IConfigurator) => void, modelState: IModelState, configurator: IConfigurator): void` - перерисовывает элементы шкалы в случае смены ориентации слайдера;

`listenScaleEvents(setThumbToNewPosition: (event: MouseEvent, modelState: IModelState, configurator: IConfigurator) => void, modelState: IModelState, configurator: IConfigurator): void` - навешивает обработчик события 'click' на элемент шкалы. Если событие происходит, запускает функцию `setThumbToNewPosition`, которая устанавливает ближайший бегунок на место клика;

### Tooltips
Отвечает за отрисовку или скрытие тултипов. Использует интерфейсы IModelState и IConfigurator для типизации параметров методов использующих значения реализуемые данные интерфейсы.

Предоставляет доступ к публичным свойствам:

`tooltipsElements: HTMLElement[]` - хранит в себе элементы тултипов;

`textInTooltips!: HTMLElement[]` - хранит в себе элементы для текстового содержимого тултипов;

Предоставляет доступ к публичным методам:

`createTooltips(amount: number, sliders: HTMLElement[], configurator: IConfigurator): void` - добавляет элементы тултипов в основную html-структуру слайдера;

`setTooltipsValues(modelState: IModelState): void` - устанавливает значения бегунков по-умолчанию в соответствующие им тултипы;

`changeAmountTooltips(sliders: HTMLElement[], configurator: IConfigurator, modelState: IModelState): void` - изменяет количество отрисованных тултипов;

`changeOrientation(configurator: IConfigurator): void` - перерисовывает тултипы при смене ориентации;

`setCurrentTooltipValue(modelState: IModelState, i: number): void` - метод устанавливает текущее значение в тултип ползунка при его движении;

`hideTooltip(): void` - метод скрывает туллтипы ползунков;

`showTooltip(): void` - метод показывает тултипы ползунков;

### Thumbs
Реализует интерфейс IThumbsState. Отвечает за отрисовку бегунков слайдера их корректную расстановку на шкале и перемещение. Использует EventEmitter для оповещения об изменении текущего значения перемещаемого бегунка или о значении бегунка перемещенного в место клика по шкале. Использует интерфейсы IModelState и IConfigurator для типизации параметров методов использующих значения реализуемые данные интерфейсы.

### ConfiguratorHorizontal
Реализует интерфейс IConfigurator. Используется для обработки операций связанных с работой горизонтального вида.

### ConfiguratorVertical
Реализует интерфейс IConfigurator. Используется для обработки операций связанных с работой вертикального вида.

### IConfigurator 
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

`getCurrentValueAxisToOnStart(target: HTMLElement): number` - принимает на вход активный элемент бегунка и возвращает его необходимую координату;

`getStartValueAxisToOnStart(eventThumb: MouseEvent, currentXorY: number): number` - вычисляет и возвращает координату начала движения бегунка;

`getMaxValueAxisToOnStart(elementSliderLine: HTMLElement): number` - вычисляет и возвращает максимально возможную координату для движения бегунка;

`getCurrentValueAxisToOnMove(eventThumb: MouseEvent, startXorY: number): number` - вычисляет и возвращает текущее значение координаты для активного бегунка;

`setIndentForTarget(target: HTMLElement, currentXorY: number): void` - устанавливает необходимый отступ для активного ползунка в стили элемента при его движении;

`getTargetWidth(target: HTMLElement): number` - вычисляет и возвращает ширину полученного на вход элемена;

`setIndentForTargetToOnStop(target: HTMLElement, coefficientPoint: number, currentValue: number, shiftToMinValue: number): void` - устанавливает необходимый отступ для активного ползунка в стили элемента при его остановке;

`updateActiveRange(elementSliderLineSpan: HTMLElement, elements: HTMLElement[]): void` - обновляет ширину активной линии слайдера;

`calculateClickLocation(event: MouseEvent, target: HTMLElement): number` - высчитывает и возвращает координату клика, если клик произошел на активной линии шкалы;

`getOffsetFromClick(event: MouseEvent): number` - - высчитывает и возвращает координату клика, если клик произошел на основной линии шкалы;