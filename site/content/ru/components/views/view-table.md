---
description: Умная таблица sf-view-table — типизированные ячейки, колонки, сортировка, выбор строк, действия, компактный список на узком экране.
profile: reference
---

# Умная таблица sf-view-table

`sf-view-table` показывает записи таблицей или компактным списком. Каждая
колонка называет тип своих значений, и таблица сама рисует подходящую
ячейку: ссылку на запись, выбор цветной меткой, файл, цвет. Настройка
колонок, выбор строк, меню строки и колонки встроены.

Таблицу можно наполнить напрямую — `setColumns()` и `setRows()`, — или
поставить внутрь представления данных [`sf-view`](../view/), которое берёт
записи у приложения и само передаёт их таблице. Таблица, наполненная
напрямую, не переставляет и не отбирает строки сама: о поиске и сортировке
она сообщает событиями `sf-view-table-search-change` и
`sf-view-table-sort-change`, а строки в нужном порядке отдаёт страница
(см. [Быстрый старт](/ru/guide/quick-start/)).

## Таблица с типизированными ячейками

:::example {id="components/view-table-overview" label="Договоры: ссылка на клиента, состояние, сумма, дата и файл"}
:::

## Компактный список

`layout="list"` рисует запись строкой: название и поля с наибольшим
приоритетом (`priority`), их число задаёт `list-fields`. При
`layout="auto"` таблица сама становится списком, когда её контейнер уже
`list-below` (600 px).

:::example {id="components/view-table-list" label="Задачи списком с двумя полями"}
:::

## Размеры и переменные

`size="1/2"` — плотная ступень для административных экранов. Публичные
CSS-переменные меняют фон шапки, отступ ячейки и другое.

:::example {id="guide/sizes" label="Размеры 1 и 1/2, свои переменные"}
:::

## Состояния данных

`data-state` — `auto`, `loading`, `populated`, `empty` или `error`; слова
состояний задают `empty-text`, `error-text` и `retry-text`.

:::example {id="guide/states" label="Поставки: четыре состояния"}
:::

## Прежний тег

До 2027-01-01 прежний тег `sf-table` работает как `sf-view-table`: старая
разметка не ломается, а каждое использование отмечается в
`SF.deprecations`.

:::example {id="components/view-table-former-tag" label="Таблица под прежним тегом sf-table"}
:::

## Параметры

Справочник собран из манифеста компонента в выпуске набора `view-9c963d217188` и обновляется вместе с выпуском. Каждому атрибуту соответствует свойство элемента с тем же именем в camelCase: `search-placeholder` — `searchPlaceholder`.

| | |
|:---|:---|
| Тег | `<sf-view-table>` |
| Назначение | Полное представление коллекции с серверными данными: поиск, фильтры, настройки таблицы, действия над строками и массовые действия, пагинация. |
| Контракт | `smart.view-table`, версия `1.14.0` |
| Жизненный цикл | экспериментальный: API может меняться между выпусками |

### Атрибуты

- `template` — `string`, по умолчанию `default`. Имя варианта шаблона для внешних шаблонов SfBaseElement.
- `root-class` — `string`, по умолчанию пусто. Классы, которые добавляются корневому элементу, который рисует компонент.
- `root-style` — `string`, по умолчанию пусто. Встроенные стили корневого элемента, который рисует компонент, включая пользовательские свойства.
- `selectable` — `boolean`, по умолчанию `true`.
- `settings` — `boolean`, по умолчанию `true`.
- `actions` — `boolean`, по умолчанию `true`.
- `row-actions` — `boolean`, по умолчанию `true`.
- `creatable` — `boolean`, по умолчанию `true`. Кнопка создания и её меню видов записи среди действий. Представление данных выключает её для хоста на порте 1.10.0, который не объявил create-record.
- `filter-templates` — `boolean`, по умолчанию `true`. Кнопка, которая сохраняет фильтр как шаблон. Представление данных выключает её, если хост не хранит сохранённые представления.
- `settings-menu` — `boolean`, по умолчанию `true`. Шестерёнка в заголовке колонки настроек, которая открывает настройки колонок. Без неё колонка по-прежнему несёт меню каждой строки. Представление данных выключает её для хоста на порте 1.10.0, который не объявил personal-column-settings.
- `pagin` — `boolean`, по умолчанию `false`.
- `filter-text` — `string`.
- `clear-text` — `string`.
- `search-placeholder` — `string`.
- `create-text` — `string`.
- `pagination-total` — `integer`, по умолчанию `10`.
- `pagination-page-size` — `integer`, по умолчанию `10`.
- `page-sizes` — `string`, по умолчанию `10,20,30,40`.
- `context-menu-columns` — `integer`, по умолчанию `1`. На сколько столбцов меню настроек делит свои пункты. Один, пока хост не запросит больше: на протяжении всего существования этого входа значение читалось напрямую, поэтому ни объявленное значение по умолчанию, ни значение, переданное хостом, до меню не доходили.
- `remember-widths` — `boolean`, по умолчанию `false`. Запоминать ширины колонок как персональный вид (SF.Preferences, под ключом preferences-key или table-settings-key) для таблицы, настройки которой хост не хранит; двойной щелчок по краю колонки забывает её ширину.
- `table-settings-key` — `string`, по умолчанию пусто. Какие сохранённые настройки использует таблица. Пустое значение означает id элемента, а при его отсутствии — id экземпляра, поэтому каждая таблица на странице хранит свои настройки. Реальное значение по умолчанию заставило бы все таблицы использовать один ключ и перезаписывать друг друга.
- `data-state` — `string`, по умолчанию `auto`, значения: `auto`, `loading`, `ready`, `populated`, `empty`, `error`.
- `loading-text` — `string`.
- `empty-text` — `string`.
- `empty-description` — `string`, по умолчанию пусто.
- `error-text` — `string`.
- `retry-text` — `string`.
- `toolbar` — `boolean`, по умолчанию `true`. Показывает встроенную панель инструментов; составной компонент может передать свою панель через слот.
- `pin-column-label` — `string`. Доступное имя и подсказка элемента управления, закрепляющего столбец.
- `unpin-column-label` — `string`. Доступное имя и подсказка элемента управления, открепляющего столбец.
- `column-move-label` — `string`. Доступное имя маркера, перемещающего столбец в списке настроек; к нему добавляется подпись столбца.
- `column-search-placeholder` — `string`. Placeholder и доступное имя поля поиска над списком настроек столбцов.
- `column-search-empty-text` — `string`. Выводится вместо списка настроек столбцов, когда поиск не нашёл ни одного поля.
- `vertical-scroll` — `string`, по умолчанию `self`, значения: `self`, `page`. Прокручивается ли таблица внутри себя или прокручивается страница. Объявлено как строка с двумя значениями.
- `filter-apply-text` — `string`. Подпись кнопки подтверждения в окне фильтра; пока есть черновик, к ней добавляется число условий, которые изменит нажатие.
- `layout` — `string`, по умолчанию `table`, значения: `auto`, `table`, `list`. Как рисуются записи: таблицей, компактным списком или `auto` — таблицей, пока контейнер таблицы не уже `list-below` пикселей, и списком ниже. `sf-view` просит `auto` для списка страницы.
- `list-below` — `number`, по умолчанию `600`. Ширина контейнера в пикселях, уже которой режим auto рисует компактный список.
- `list-fields` — `number`, по умолчанию `3`. Сколько полей запись показывает под заголовком в компактном списке; поля выбираются по приоритету колонок.
- `size` — `string`, по умолчанию `1`, значения: `1/2`, `1`. Ступень лестницы размеров для элементов управления и строк таблицы: 1 или плотная 1/2 — элементы управления высотой 32 px, текст 14/20, строки высотой ступени. Размер 1, записанный на элементе, который рисует таблица, становится размером таблицы.
- `preferences-key` — `string`, по умолчанию пусто. Ключ, под которым раскладка таблицы — порядок, видимость, закрепление, ширины — хранится как персональный вид (SF.Preferences, `sf-table/<key>`); представление данных передаёт свой. Без него используется table-settings-key, а без обоих ничего не хранится.
- `row-actions-visible` — `string`, по умолчанию `hover`, значения: `hover`, `always`. Где видны кнопки действий строки: в строке под указателем, в фокусе или текущей (hover, по умолчанию) или во всех строках (always).
- `drag-rows` — `boolean`, по умолчанию `false`. Строки можно перетащить из списка как записи (application/x-sf-records+json): запись строки или все выбранные записи, если строка среди них.
- `row-reorder` — `boolean`, по умолчанию `false`. Строки можно переставить, перетаскивая их внутри списка; отпускание отправляет sf-table-rows-reorder {ids, before, order}. Представление данных ставит атрибут, когда хост предлагает возможность row-reorder.
- `inline-edit` — `boolean`, по умолчанию `false`. Логическая ячейка, поле которой запись называет в `editable`, становится флажком; нажатие отправляет sf-table-cell-set {id, key, value, revision}, и ячейка ждёт ответа хоста. Представление данных ставит атрибут, когда хост предлагает возможность inline-edit.
- `current` — `string`, по умолчанию пусто. `id` строки, открытой на странице: строка получает `aria-current` и `data-current`. Запись атрибута отмечает строку, но не переводит на неё фокус и не отправляет событий.
- `aria-label` — `string`, по умолчанию `Data table`. Доступное имя таблицы. Читайте его из контекста props, а не из элемента: `aria-label` отражается платформой, поэтому element.ariaLabel возвращает null без заданного атрибута и перекрывает значение, которое вычисляет компонент.
- `active-filter-fields` — `array`.
- `bulk-actions` — `array`.
- `columns` — `array`.
- `create-items` — `array`.
- `filter-fields` — `array`.
- `rows` — `array`.
- `table-data` — `object`.
- `table-settings` — `object`.
- `templates` — `array`.
- `toolbar-actions` — `array`.
- `sort` — `array`.
- `selection` — `array`, по умолчанию `[]`. `id` отмеченных строк в порядке строк.

## События

События приходят на сам элемент и всплывают.

- `sf-view-table-select` — `detail`: `{ ids: array }`. Отмеченные строки изменились, `select {ids}`: один раз на каждое изменение выбора, включая снятие. Прежнее имя `sf-port-output` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-apply` — `detail`: `{ action: string, scope, ids: array, revisions?: object }`. Действие над строкой или над отмеченными, `apply {action, scope: entry | selection, ids, revisions}`. Решает хост; событие не означает успеха. Прежнее имя `sf-table-action-intent` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-save` — `detail`: `{ kind, reason: string, columnSettings: object, tableSettingsKey: string }`. Настройки колонок человека, `save {kind: columns, reason, columnSettings, tableSettingsKey}`. Прежнее имя `sf-table-column-settings-change` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-column-settings-reset` — `detail`: `{ target, tableSettingsKey: string|null }`. Человек попросил вернуть колонки по умолчанию. Таблица убирает свою сохранённую раскладку и значений по умолчанию не называет: личный слой сбрасывает хост (или представление данных) и отвечает своими значениями.
- `sf-view-table-create` — `detail`: `{ item?: string|null }`. Кнопка «Создать» или один из её видов, `create {item}`. Прежнее имя `sf-table-create-intent` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-filter-change` — `detail`: `{ templateKey: string, templateLabel: string, values: object, tags: object }`. Просит запрос у хоста после изменения фильтра: «Применить» в окне фильтра, снятая метка или очищенный фильтр. Представление данных превращает его в `query.change` с фильтрами из значений. `detail` — результат `getFilterPayload()` таблицы: сначала поля данных выбранного шаблона, затем эти четыре.
- `sf-view-table-query` — `detail`: `{ reason: string, context: object, sequence: integer }`. Запрос контекста входного порта композиции, `query {reason, context, sequence}`. Прежнее имя `sf-table-query-intent` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-refresh` — `detail` не описан. Кнопка повтора у списка, который не загрузился, `refresh`. Прежнее имя `sf-table-retry` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-search-change` — `detail`: `{ search: string }`. Запрашивает у хоста выборку после изменения значения поиска (с задержкой debounce).
- `sf-view-table-sort-change` — `detail`: `{ key: string, direction }`. Пользователь активировал сортируемый заголовок. Направление циклически меняется: asc, desc, null (без сортировки). Только намерение: таблица отмечает заголовок, но не переупорядочивает строки; переупорядочивает или перезагружает их хост.
- `sf-view-table-template-delete` — `detail`: `{ key: string }`. Пользователь удалил сохранённые шаблоны на вкладке «Шаблоны» и нажал «Применить». Только намерение: хост удаляет сохранённое представление. Одно событие на каждый удалённый шаблон.
- `sf-view-table-template-save` — `detail` не описан. Запрашивает сохранение одного или нескольких шаблонов фильтра (порядок, закрепление, удаление, флаги по умолчанию и выбора или данные). О загрузке сохранённого представления сообщает событие sf-table-template-select.
- `sf-view-table-template-select` — `detail`: `{ key: string }`. Пользователь применил другой сохранённый шаблон на вкладке «Шаблоны». Только намерение: хост загружает это сохранённое представление.
- `sf-view-table-toolbar-action` — `detail`: `{ action: string, href?: string|null }`. Пользователь выбрал одно из собственных действий представления в меню панели инструментов. Только намерение, событие можно отменить: компонент переходит по href пункта на том же сайте, если хост не перехватит переход через preventDefault.
- `sf-view-table-reference-open` — `detail`: `{ field: string, value: object, href: string }`. Открыта ссылка на запись (`reference-open`).
- `sf-view-table-expand` — `detail`: `{ id, expanded?: boolean }`. Строка дерева раскрыта или свёрнута, `expand {id, expanded}`. Прежнее имя `sf-table-tree-toggle` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-load-more` — `detail`: `{ direction, parent, cursor: string|null }`. Следующая страница уровня дерева, `load-more {direction: after, parent, cursor}`. Прежнее имя `sf-table-tree-more` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-rows-drag` — `detail`: `{ ids: array, source: string|null }`. Строки с drag-rows начали перетаскивать из списка к цели вроде дерева; те же {ids, source} лежат в данных перетаскивания как application/x-sf-records+json.
- `sf-view-table-move` — `detail`: `{ ids: array, before, order: array }`. Строки переставлены, `move {ids, before, order}`. Прежнее имя `sf-table-rows-reorder` приходит следом с прежним `detail` до 2026-12-01.
- `sf-view-table-cell-set` — `detail`: `{ id: object, key: string, value: object, revision: object }`. Нажат флажок в ячейке: запись, поле, новое значение и ревизия записи.
- `sf-view-table-view-change` — `detail`: `{ view: object, everywhere: boolean }`. Сменился вид таблицы (`view-change`).
- `sf-view-table-window` — `detail`: `{ first: integer, last: integer }`. Изменилось окно нарисованных строк длинного списка: `{first, last}` — номера строк в списке.

Прежние имена событий приходят следом с тем же `detail` и отмечаются в `SF.deprecations`:

`sf-port-output` → `sf-view-table-select`, `sf-table-action-intent` → `sf-view-table-apply`, `sf-table-column-settings-change` → `sf-view-table-save`, `sf-table-create-intent` → `sf-view-table-create`, `sf-table-query-intent` → `sf-view-table-query`, `sf-table-retry` → `sf-view-table-refresh`, `sf-table-tree-toggle` → `sf-view-table-expand`, `sf-table-tree-more` → `sf-view-table-load-more`, `sf-table-rows-reorder` → `sf-view-table-move`, `sf-table:column-settings-change` → `sf-view-table-save`, `onColumnSettingsChange` → `sf-view-table-save`, `onSearchEnd` → `sf-view-table-search-change`, `onTemplateSave` → `sf-view-table-template-save`, `onFilterUpdate` → `sf-view-table-filter-change`, `sf-table-select` → `sf-view-table-select`, `sf-table-apply` → `sf-view-table-apply`, `sf-table-save` → `sf-view-table-save`, `sf-table-column-settings-reset` → `sf-view-table-column-settings-reset`, `sf-table-create` → `sf-view-table-create`, `sf-table-filter-change` → `sf-view-table-filter-change`, `sf-table-query` → `sf-view-table-query`, `sf-table-refresh` → `sf-view-table-refresh`, `sf-table-search-change` → `sf-view-table-search-change`, `sf-table-sort-change` → `sf-view-table-sort-change`, `sf-table-template-delete` → `sf-view-table-template-delete`, `sf-table-template-save` → `sf-view-table-template-save`, `sf-table-template-select` → `sf-view-table-template-select`, `sf-table-toolbar-action` → `sf-view-table-toolbar-action`, `sf-table-reference-open` → `sf-view-table-reference-open`, `sf-table-expand` → `sf-view-table-expand`, `sf-table-load-more` → `sf-view-table-load-more`, `sf-table-rows-drag` → `sf-view-table-rows-drag`, `sf-table-move` → `sf-view-table-move`, `sf-table-cell-set` → `sf-view-table-cell-set`, `sf-table-view-change` → `sf-view-table-view-change`, `sf-table-window` → `sf-view-table-window`.

## Методы

- `addRows(rows: array)` — возвращает `object`. Добавляет ещё одну страницу с бэкенда в режиме «показать ещё».
- `applyQueryResult(sequence: integer, rows: array)` — возвращает `boolean`. Применяет строки, отвечающие на последний ожидающий запрос контекста. Для устаревшей, повторной или неизвестной последовательности возвращает `false` и ничего не меняет.
- `clearSelection()` — возвращает `object`. Сбрасывает явное выделение этого экземпляра; при изменении один раз отправляет порт выделения.
- `requestActionIntent(actionId: string, recordIds: array)` — возвращает `object`. Отправляет типизированный запрос действия над строкой или пакетного действия; выполнение и авторизация на стороне хоста. При недопустимых аргументах до отправки выбрасывается `TypeError`.
- `requestCreateIntent(itemId: string|null)` — возвращает `object`. Отправляет `sf-table-create-intent` для основной кнопки (`null`) или объявленного id пункта создания.
- `requestRetry()` — возвращает `object`. Отправляет намерение повтора после неудачного запроса данных.
- `setSort(key: string|null, direction: any)` — возвращает `object`. Показывает в заголовках текущую сортировку хоста без отправки события; (null, null) сбрасывает её.
- `toggleTreeRow(row: object)` — возвращает `object`. Сообщает, что строку дерева открыли или закрыли (sf-table-tree-toggle).
- `requestTreeMore(row: object)` — возвращает `object`. Запрашивает следующую страницу уровня дерева (sf-table-tree-more).
- `focusRow(id: any)` — возвращает `object`.
- `getActiveFilterFieldKeys()` — возвращает `array`. Какие поля фильтра отображаются, в порядке полей хоста.
- `getColumnSettings()` — возвращает `object`. Читает текущее изменение настроек столбцов.
- `getFilterPayload()` — возвращает `object`. Читает текущий черновик фильтра для проверки запроса на стороне хоста.
- `getInstanceId()` — возвращает `string`. Идентификатор экземпляра: `id` автора, если он есть, иначе собственный счётчик. От него выводятся id, запасной ключ настроек и портал.
- `getQueryContext()` — возвращает `object` | `null`. Читает неизменяемый контекст, последним полученный через входной порт контекста, или `null`.
- `getSelectedRecordIds()` — возвращает `array`. Читает типизированные идентификаторы записей, выбранных в этом результате таблицы, без разбора DOM.
- `getSort()` — возвращает `object`. Читает сортировку, отображаемую в заголовках.
- `getToolbarActions()` — возвращает `array`. Действия панели инструментов в объявленном виде, копия.
- `requestContextQuery(sequence: integer)` — возвращает `object`. Внутренний метод порта контекста: отправляет `sf-table-query-intent` для текущего контекста с новой ожидающей последовательностью.
- `setActiveFilterFields(keys: array)` — возвращает `object`. Показывает в выбранном шаблоне фильтра ровно эти поля фильтра. Используется при открытии сохранённого представления: settings.filter_fields перечисляет поля, которые в нём были показаны.
- `setBulkActions(actions: array)` — возвращает `object`. Регистрирует подписанные непрозрачные действия для текущего выделения. При пустом выделении их элементы управления отключены.
- `setColumns(columns: array)` — возвращает `object`. Заменяет канонические столбцы, полученные от бэкенда.
- `setCreateItems(items: array)` — возвращает `object`. Задаёт пункты меню кнопки создания с разделённым действием (только {id, name}). Без пунктов у кнопки создания нет стрелки.
- `setDataState(state: string)` — возвращает `object`. Переключает состояние отображения: автоматическое, загрузка, заполнено, пусто и ошибка.
- `setFilterFields(fields: array)` — возвращает `object`. Регистрирует поля и элементы управления фильтра из разрешённого бэкендом списка.
- `setRows(rows: array)` — возвращает `object`. Заменяет текущие строки результата бэкенда.
- `setTableData(patch: object)` — возвращает `object`. Обновляет столбцы, строки или связанное состояние таблицы, переданные хостом.
- `setTableSettings(settings: object)` — возвращает `object`. Применяет изменение настроек столбцов без запроса на сохранение.
- `setTemplates(templates: array)` — возвращает `object`. Применяет сохранённые шаблоны фильтров и представлений.
- `setToolbarActions(items: array)` — возвращает `object`. Объявляет собственные действия представления для меню панели инструментов: `{id, label, icon?, href?}`. `href` должен указывать на этот же сайт. Без действий элемент управления не отрисовывается.
- `sfPortInput(port: any, value: array, meta: object)` — возвращает `null`. Входной порт композиции, используемый `sf-composition-scope`. Принимает только объявленный порт контекста с `record-ids.v1`; при недопустимых портах или значениях до изменения состояния выбрасывается `TypeError`.
- `isTree()` — возвращает `boolean`. Являются ли строки деревом: у какой-то строки есть __tree, которое представление данных пишет по уровням хоста.
- `treeColumnKey(columns?: array)` — возвращает `string` | `null`. Колонка, от которой растёт дерево: колонка заголовка или первая колонка данных.

## CSS-переменные

Задаются на элементе или на любом предке. Имена сохранили прежнее имя компонента.

| Переменная | Тип | Что задаёт |
|:---|:---|:---|
| `--sf-table-row-block-size-1/2` | `length` | высота строки в одну строку текста, размер 1/2 (публикуется на `:root`) |
| `--sf-table-row-block-size-1` | `length` | высота строки в одну строку текста, размер 1 (публикуется на `:root`) |
| `--sf-table-row-2-lines-block-size-1/2` | `length` | высота строки, где текст в две строки, размер 1/2 (публикуется на `:root`) |
| `--sf-table-row-2-lines-block-size-1` | `length` | высота строки, где текст в две строки, размер 1 (публикуется на `:root`) |
| `--sf-table-head-block-size-1/2` | `length` | высота строки заголовков, размер 1/2 (публикуется на `:root`) |
| `--sf-table-head-block-size-1` | `length` | высота строки заголовков, размер 1 (публикуется на `:root`) |
| `--sf-table-toolbar-block-size-1/2` | `length` | высота панели в одну строку, размер 1/2 (публикуется на `:root`) |
| `--sf-table-toolbar-block-size-1` | `length` | высота панели в одну строку, размер 1 (публикуется на `:root`) |
| `--sf-table-toolbar-gap` | `length` | зазор между панелью и заголовками (публикуется на `:root`) |
| `--sf-table-head--background-color` | `color` | фон строки заголовков |
| `--sf-table-row--background-color` | `color` | фон строки |
| `--sf-table--cell-spacing` | `length` | отступ ячейки |
| `--sf-table-cell--line-clamp` | `number` | сколько строк текста показывает ячейка |
| `--sf-table-context-menu--z-index` | `number` | слой меню строки и колонки |
| `--sf-table-context-menu--max-width` | `length` | наибольшая ширина меню строки и колонки |

## Доступность

- Роль: `grid`.
- Доступное имя: обязательно.
- Клавиши: `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, стрелки, `ArrowLeft` и `ArrowRight` меняют ширину колонки в фокусе, если её можно менять.
- Фокус: У каждого действия только с иконкой и каждой контекстной поверхности есть доступное имя. Оверлеи экземпляра остаются в пределах визуального окна просмотра, закрываются по Escape и возвращают фокус на свой триггер. При изменении ширины столбца фокус остаётся на его нативной кнопке.

## Источник

- `simai/ui-view@9c963d217188:package/src/smart/view-table`

## См. также

- [Представление данных sf-view](../view/)
- [Карточка записи sf-view-properties](../view-properties/)
- [Данные](/ru/guide/concepts/data/)
- [Внешний вид](/ru/guide/appearance/)
