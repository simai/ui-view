# Представление данных `sf-view`

`sf-view` собирает панель, содержимое и пагинацию в один Smart-композит.
Данные записей и разрешения приходят от приложения через
`simai.dataview-port`. В описании композиции остаются только структура, слоты и
настройки. Несколько представлений на странице не делят запросы и состояние.

## Подключение

```html
<sf-view aria-label="Документы">
  <sf-view-table slot="content" aria-label="Документы" toolbar="false"></sf-view-table>
  <sf-pagination slot="pagination" appearance="field" top="false" bottom="false"></sf-pagination>
</sf-view>
```

Слоты `toolbar`, `content`, `pagination` необязательны: у каждого есть
встроенный вариант. В `content` передайте `sf-view-table`; в `pagination` —
`sf-pagination`. Внешняя панель может вызвать `changeQuery({search, filters,
sort, page, per_page})` или отправить события таблицы. У таблицы параметр
`toolbar="false"` скрывает её собственную панель, когда панель уже находится
в отдельном слоте.

После определения элемента приложение привязывает адаптер:

```js
const view = document.querySelector('sf-view');
view.setHostPort({
  version: '1.1.0',
  capabilities: ['saved-views', 'shared-saved-views', 'row-actions'],
  raise(intent, payload, {signal}) {
    return appDataViewPort.raise(intent, payload, {signal});
  },
});
```

`raise` может вернуть ответ сразу или через Promise. Он обязан возвращать один
из `applied`, `conflict`, `refused`, `unavailable`. Приложение проверяет права,
допустимые поля, действие и ревизии до записи. Оно не должно доверять
видимости кнопки или присланному браузером количеству записей.

При `query.change` компонент передаёт `sequence` и текущий запрос. Ответ
`applied` должен содержать `records`, `columns`, `total`, `echo`; записи несут
`id`, `revision`, `actions`. Только ответ с последним `sequence` меняет экран.
Если хост посчитал записи приблизительно, он добавляет `total_exact: false`:
вид показывает число как «~N», а перед действием под фильтром сначала
запрашивает точное число (`query.count`).
Состояния `loading`, `populated`, `empty`, `error` доступны через `data-state`
и событие `sf-view-state`. При ошибке старые строки сохраняются, а
`sf-view-answer` объясняет отказ или конфликт. После удаления экземпляра
ожидающий ответ не применяется; повторное подключение запрашивает данные заново.

## Части и лист

С 1.6.0 `sf-view` не несёт в своём бандле `sf-view-table`, `sf-pagination` и
`sf-toast`: их определяет Loader из их собственных бандлов по связям правила
(`cl-view-table`, `cl-pagination`, `cl-toast` лениво), а представление просит Loader о
том, что ещё не определено, и рисует ответ заново, когда часть определена. Свой
лист представления — `data-view.css` — это его первая отрисовка (заготовка);
стили таблицы и строки страниц приходят с их листами. Страница, подключающая
`data-view.css` вручную, получает существующий лист.

## Колонки выбора и настроек

Колонку флажков и колонку настроек представление включает по своему `chrome`
(`select`, `settings`). Таблица, на которой страница сама написала
`selectable="false"` или `settings="false"`, их не получает: представление
запоминает, что было написано до него (`data-sf-host-selectable`,
`data-sf-host-settings`), как и для `row-actions`, и заготовка первой
отрисовки рисует те же колонки. Колонка настроек `sf-view-table` к тому же не
рисуется, когда открывать в ней нечего: нет настроек колонок, действий строки
и перестановки строк.

## Первая отрисовка

До первого ответа хоста представление показывает заготовку той же формы,
что и список с данными: панель, шапку и строки таблицы, на узком экране —
компактный список карточек, и строку страниц. Когда данные приходят, ничего
не сдвигается. Число строк — страница, которую запрашивает список: размер, сохранённый
человеком, иначе `page-size` строки страниц, напечатанной страницей (с ним же
уходит первый запрос), но не больше `row-cap`; без них — `row-cap`, иначе 10. Число столбцов
задаёт `expected-columns` (по умолчанию 4): это форма заготовки, а не
ограничение — столбцы приносит ответ хоста. Страница или сервер, который
выводит коллекцию, знает её столбцы и пишет их число:

```html
<sf-view aria-label="Связанные" chrome="" row-cap="5" expected-columns="2">
  <sf-view-table slot="content" aria-label="Связанные" toolbar="false"></sf-view-table>
</sf-view>
```

Если строка страниц, напечатанная страницей, называет число записей (`total`),
заготовка рисует не больше записей, чем осталось с текущей страницы: список из
10 записей при странице 12 — это 10 строк заготовки.

Как выглядит запись компактного списка на телефоне, знает хост: `list-shape` на
представлении (или на его `sf-view-table`) называет число строк каждой части
записи, начиная с названия, через пробел или запятую. `list-shape="1 1 2 1"` —
название в одну строку и три поля, третье в две строки. Заготовка рисует эту
форму, и список не сдвигается, когда приходят записи. Без подсказки заготовка
— название и `list-fields` полей по строке (109 px на 390). До 12 частей по
1–8 строк; `list-shape="resource"` — строка списка ресурсов (строка
названия и вспомогательная строка под ней, 52 px). Иное значение подсказкой не считается.

```html
<sf-view aria-label="Заказы" list-shape="1 1 2">
  <sf-view-table slot="content" aria-label="Заказы"></sf-view-table>
  <sf-pagination slot="pagination" page-size="12" total="10"></sf-pagination>
</sf-view>
```

Таблица выбирает между таблицей и карточками по ширине своего контейнера
(`list-below`, 600 px); заготовка, напечатанная сервером, выбирает по той же
ширине через container query. Свой `list-below` у таблицы заготовка не
учитывает.

Если первая страница уже есть у сервера, он печатает её вместе со страницей —
настройкой `first-answer` в острове `data-sf-settings`, в той же форме, что
ответ хоста на `query.change` (`records` с `revision` у каждой записи, `total`
или `has_next`, `echo`, `columns`). Представление рисует её сразу, без
заготовки, и список работает до подключения порта; порт затем отвечает на тот
же запрос в фоне, без состояния загрузки. Тот же ответ (та же `revision`, если её
называют оба, иначе те же строки, число и столбцы) ничего на странице не меняет;
другой принимается на месте: строки по `id`, перерисовываются только изменённые,
без заготовки и загрузки между ними. Возможности порта представление знает до
порта: из порта, объявленного в элементе (`<script type="application/json"
data-sf-port>` с `port`, `version`, `url`, `capabilities` и `first: {intent,
payload}`, стандарт §4.9), или из `capabilities` рядом с ответом в `first-answer`.
Первая отрисовка — окончательная: панель и действия строк рисуются один раз, и
порт, пришедший с теми же возможностями, ничего не перерисовывает. Перепроверяется
напечатанный запрос — `first-answer.query`, иначе `first.payload.query` объявленного
порта, — а не `echo` ответа; без напечатанного ответа первый запрос представления —
объявленный, так что ранний вызов, начатый страницей, — его собственный (один
запрос). Напечатанный запрос — только значения по умолчанию: размер страницы и
сортировка, сохранённые человеком в этом браузере, идут поверх него. Тогда
представление спрашивает своё настоящее состояние; ранний ответ берётся, только
если совпадает, иначе уходит обычный запрос, а напечатанный ответ на другой
запрос не рисуется (заготовка остаётся до ответа):

```html
<sf-view aria-label="Каталог">
  <script type="application/json" data-sf-settings>
    {"first-answer": {"records": [{"id": "1", "revision": "r1", "title": "Первая"}],
      "total": 2400, "echo": {"page": 1, "per_page": 20},
      "columns": [{"key": "title", "label": "Название"}]}}
  </script>
  <sf-view-table slot="content" aria-label="Каталог"></sf-view-table>
  <sf-pagination slot="pagination" appearance="field" page-size="20"></sf-pagination>
</sf-view>
```

## Низ списка (с версии 1.13.0)

Низ списка — одна строка: «41–60 из 240 · По 20 ▾ · ‹ [3] из 12 ›». Диапазон
и размер страницы рисует само представление, переход по страницам —
`sf-pagination` в виде `appearance="field"`. Кнопки на краях гаснут, а не
пропадают, поэтому ширина строки не меняется, пока человек листает. Размер
страницы — тихая кнопка «По 20 ▾» с меню; выбранный размер человек сохраняет,
как и сортировку. Если хост умеет считать по запросу, а число неточное или
неизвестно, после диапазона стоит «посчитать». На узком экране поле страниц
переносится на свою строку и стоит в её конце.

Строка страниц без `appearance`, которую дала страница, получает
`appearance="field"`: прежний вид без `appearance` (совместимый низ
`sf-pagination`) снимается 2027-01-01. Состояние по-прежнему хранит строка
страниц: `page-sizes`, слова (`page-size-label`, `show-count-label`) и
события `sf-pagination-change` и `sf-pagination-count` работают как раньше.

У доски и карточек (с версии 1.26.0) строки страниц нет: каждая колонка
доски и сетка карточек заканчиваются своей кнопкой «Показать ещё». Но низ
списка и у них говорит, сколько записей: «1–80 из 120» — записи на экране из
всех, что насчитал хост, теми же словами, что у таблицы (слова `range` и
`range-many` у `sf-pagination`). Размера страницы и стрелок там нет. У
пустого, упавшего или закрытого списка строки нет, как и у таблицы.

Размер страницы по умолчанию (с версии 1.26.0) — 20: если страница не задала
ни `page-size`, ни `page-sizes`, первый запрос просит `per_page: 20`, а меню
размеров — ровно «По 10 · По 20 · По 50 · По 100» (решение владельца
2026-11-20; раньше было 25 и меню 10/20/25/50/100). В виде «Показать ещё»
(`appearance="more"`) диапазон считает все записи на экране: «1–12 из 12», а
не последнюю догруженную страницу.

## Список ресурсов (с версии 1.11.0)

Представление передаёт таблице свой `layout` (раньше оно само ставило `auto`
списку страницы и `table` встроенному):
`layout="list"` у `sf-view` — список и на широком экране. Вместе с ним до
таблицы доходят `layout-switch`, `list-below`, `quick-actions` и `row-open`
(см. `sf-view-table`, «Список ресурсов»). Роли колонок в списке приходят
из порта: с `simai.dataview-port` 1.15.0 у колонки есть поле `list`
(`status`, `title`, `supporting`, `fact`, `hidden`), и представление
передаёт его таблице как есть:

```js
// ответ хоста на query.change
{columns: [
  {key: 'state', label: 'Состояние', list: 'status'},
  {key: 'name', label: 'Сайт', role: 'title', list: 'title'},
  {key: 'domain', label: 'Домен', list: 'supporting'},
  {key: 'ssl', label: 'SSL', list: 'fact'},
], records: [/* … */]}
```

`list-roles="ключ:роль,…"` — прежний способ для хоста на порте 1.14.0 и
раньше: устаревший псевдоним поля `list` до 2027-01-01, отмечается в
`SF.deprecations`. Роль, которую колонке дал хост, важнее:

```html
<sf-view aria-label="Сайты" preferences-key="sites" layout-switch quick-actions="visit,restart" row-open="row"
         list-roles="state:status,name:title,domain:supporting,kind:supporting,ssl:fact,backup:fact">
  <sf-view-table slot="content" aria-label="Сайты"></sf-view-table>
</sf-view>
```

`layout-switch` рисуется только там, где у таблицы есть панель. Выбор
«Список / Таблица» хранится у человека под `preferences-key`; первая отрисовка
сразу рисует заготовку выбранного вида. `view.save` кладёт его в
`settings.layout` рядом с фильтрами и колонками, а `view.open` возвращает.

## Действия и виды

- Поиск, фильтры, сортировка и окно меняют один `query.change`.
- `view.open` переключает вид и затем запрашивает его записи.
- `view.save` пишет личный вид. В порте 1.1.0 необязательный `level` у каждого
  вида равен `package`, `shared` или `personal`. `package` служит исходным
  уровнем, а не целью записи браузера.
- `view.save_shared` с `target: "shared"` требует отдельной возможности
  `shared-saved-views` и права на запись общего вида.
- `settings.save_personal` и `settings.save_shared` передают ревизию слоя;
  конфликт не стирает текущий ввод.
- Действия записи берутся только из `record.actions`. Для изменения
  передаётся ревизия записи; пакет выбранных записей передаёт все ревизии.
  Действие под фильтром требует подтверждённого `total` и применённых фильтров.
- Массовое действие над выбранными записями (`sf-pagination-apply` из панели
  пагинации, прежнее имя `sf-action-apply`) всегда идёт в `bulk.apply_selected`, даже если выбрана одна
  запись, и может иметь свой id (`bulk_delete`), которого нет в `actions`
  записи: право на пакет проверяет хост. Вид только проверяет, что каждая
  выбранная запись есть в текущей выдаче, и прикладывает её ревизию;
  отсутствующая запись отклоняется на месте. Действие строки
  (`sf-table-action-intent`) по-прежнему должно быть в `actions` записи и
  идёт в `record.mutate` или `record.open`.

## Выбор строк и полоса действий (с версии 1.29.0)

Пока в таблице отмечены строки, под списком стоит полоса групповых действий
SIMAI Framework `sf-bulk-actions` (решение C295; пара ui-b654460cad2a и новее):
«Выбрано N», действия кнопками (до трёх, остальные и удаление — в «⋯»),
«Выбрать все N», если хост умеет действие под фильтром, и крестик. На
телефоне полоса в одну строку: одна кнопка-значок и «⋯». Полоса прилипает к
низу окна, пока список длиннее экрана.

```html
<sf-view collection="orders">
  <sf-view-table slot="content"></sf-view-table>
  <sf-pagination slot="pagination" actions="archive:В архив|publish:Опубликовать|delete:Удалить"></sf-pagination>
</sf-view>
<script>
  // или так, со значками для кнопок полосы:
  view.bulkActions = [
    {id: 'archive', label: 'В архив', icon: 'archive'},
    {id: 'publish', label: 'Опубликовать', icon: 'public'},
    {id: 'delete', label: 'Удалить', icon: 'delete'},
  ];
</script>
```

Что приходит хосту — те же намерения порта, что и раньше:

| Человек делает | Хост получает |
|:---|:---|
| нажал действие при отмеченных строках | `bulk.apply_selected` {`action_id`, `record_ids`, `revisions`} |
| «Выбрать все N», затем действие | `bulk.apply_under_filter` {`action_id`, `filters`, `confirmed_total`} (оценку «~N» вид сначала уточняет через `query.count`) |
| крестик или Escape в списке или в полосе | ничего: вид снимает отметки сам |

Ответ хоста вид показывает в самой полосе:

- `applied` — «Готово 2 из 2» для экранного диктора, полоса уходит;
- `refused`, `conflict` или `unavailable` — «Готово 0 из 2 · 2 не удалось»,
  «Подробнее» (список строк с причиной: слова хоста, а для строк из
  `conflicts` — «Данные успели изменить…») и «Повторить для 2»; строки
  остаются отмеченными. Такой отказ не дублируется уведомлением в углу.

События вида не меняются: `sf-view-answer` по-прежнему несёт каждый ответ,
`sf-data-view-deleted` — после применённого удаления. Слова и действия — те же
настройки строки страниц (`actions`, `selected-label`, `actions-region-label`)
или `bulkActions`; значок действия берётся из `bulkActions`. Опасное действие
(`delete`, `remove`, `destroy`, `trash`) — последнее в «⋯», красное; вопрос
перед ним задаёт хост (`confirm_required`), как и раньше.

На паре без `sf-bulk-actions` остаётся прежняя полоса: список действий,
«Применить», «Для всех» и крестик.

## Шапка списка (с версии 1.17.0)

`head="list"` включает шапку списка по решениям C297, C299, C300 и C301; без
атрибута вид рисует панель таблицы, как раньше. `heading` даёт название
списка (иначе `aria-label`).

- Строка заголовка (с версии 1.25.0, C393, C394): только название; число
  записей — внизу, у страниц (C388).
- Строка действий: значок представления (`view_quilt`, первым; подсказка и
  имя «Представление: <имя>», точка `badge-dot` при несохранённых
  изменениях, цвет `--sf-primary` при открытом не основном представлении,
  `aria-expanded` и вид нажатой кнопки, пока зона открыта; значок контурный в
  обоих состояниях), «Фильтр» с закладкой сохранения, поля фильтра
  (кнопка поля и крестик, цвет при условии, число значений; условие словами
  — только в подсказке и окне), «Очистить», поиск до 20rem, «Создать»
  (единственная залитая кнопка; другие пункты — в её меню) и «⋯» (поля
  записи, права, экспорт — только при правах из `describe().permissions`).
  Шестерёнки в таблице нет.
- Зона «Представление» (с версии 1.25.0, вариант Д): под строкой действий в
  своей рамке (`--sf-outline-variant`, `--sf-radius--surface`) — имя
  открытого представления с меню по уровням (системные, для всех, мои),
  способ показа (`sf-segmented`, только способы из `describe().layouts`),
  «Настроить вид» и «Изменено» (сохранить для всех — при `shared_settings`
  и не для системного, сохранить как новое, сбросить). Открыта зона или нет —
  хранится за человеком под `preferences-key` (`SF.Preferences`, как размер
  страницы). Вид значка — `appearance="toggle"` SIMAI Framework, где он есть
  в паре; иначе тот же вид своими правилами.
- Поиск и фильтры складываются (И), значения одного поля — ИЛИ. Поиск в
  сохранённый фильтр не попадает.
- Телефон (уже 600px): в строке действий значок представления, «Фильтр»,
  поиск, «+» и «⋯»; в зоне имя представления, значок способа показа и
  «Настроить вид»; поля фильтра —
  одна строка с прокруткой; каждое окно — нижняя панель `sf-drawer`. На
  компьютере окна — `sf-popover`.
- Хост отвечает `describe()` на порте (`fields`, `layouts`, `permissions`)
  и отдаёт в данных `saved_filters`, `view_config`, `locked`.
- Намерения: `filter.save`, `filter.update`, `filter.rename`, `filter.share`,
  `filter.default`, `filter.delete`; `settings.save {layer, view, type, patch,
  base_revision}` (личное — сразу, общее — только при `shared_settings`);
  `view.create_record {item}`. Состояние шапки —
  `query`: `filters_chosen`, `filters`, `saved_filter`, `search`, `view`.
- «⋯ → Настройки полей записи» (право `permissions.record_fields`, C301)
  открывает первую запись списка в карточке сразу в режиме настройки
  (`openRecordSettings()`, C311 (1)): одна раскладка карточки на сущность
  для таблицы, доски, карточек, календаря и страницы записи (C311 (3)).
  Отдельной панели полей и запроса `entity.fields.save` больше нет (с версии
  1.20.0). Без карточки рядом со списком страница слышит `settings-open`
  `{id: "record-fields"}`.
- Меню заголовка колонки под шапкой (с версии 1.19.0): сортировка, «Закрепить»,
  «Скрыть колонку», «Все колонки…» и ширина, как у таблицы без шапки (C296);
  «Все колонки…» открывает «Настроить вид». Страница открывает его сама через
  `openCustomize()`.
- События: `sf-view-display-change` (отменяемое) и `sf-view-settings-open`.
- Окончательная форма данных придёт с `view-config/1`; до неё шапка не
  закрепляет формат.

## Доска (с версии 1.17.0)

`layout="board"` (слово Larena `kanban` читается так же) рисует
`sf-view-board`; неизвестный способ показа один раз предупреждает и рисует
таблицу. Запрос доски один (C304): `window {lanes, per_lane, totals}`, и хост
отвечает первыми карточками каждой колонки вместе с итогами всех колонок —
числом и суммами денег, которые названы в настройках доски
(`view_config.layouts.board.totals`). Второго запроса за суммами нет (с версии
1.19.0); `totals` в окне называет известные виду итоги, а в первом запросе,
пока настроек доски вид ещё не знает, — только `count`: хост отдаёт итоги по
своим настройкам.

Страница, которая поставила свою `sf-view-table` и написала
`layout="board"`, получает доску: таблица ждёт вне слотов и возвращается с
«Таблицей»; вид один раз пишет об этом в консоль.

## Смена способа показа (с версии 1.18.0)

«Таблица» и «Доска» в шапке списка меняют способ показа сразу, без
перезагрузки: `switchLayout(kind)` ставит один способ вместо другого —
таблицу, доску, карточки или календарь, — спрашивает хоста один раз запросом
нового способа (у доски — окно колонок `window {lanes, per_lane}`, у
календаря — окно дней, у карточек — своя страница `per_page`, 24 по
умолчанию) и до ответа рисует то, что уже известно. Отмеченные записи и
открытая рядом карточка остаются при каждом переходе. Таблица, которую
поставила сама страница (со своими полями фильтра и пунктами «Создать»), на
время другого способа убирается из слотов и возвращается с «Таблицей». Тот же
обмен делает атрибут `layout`, записанный после отрисовки.
`canDrawLayout(kind)` отвечает, может ли страница нарисовать этот способ:
элемент определён или его правило известно загрузчику. Способа, которого нет
на странице, в переключателе шапки нет совсем (не серая кнопка).

Поле фильтра в шапке открывает окно фильтра SIMAI Framework
(`SF.fieldRenderers.filterWindow`), если оно есть в подключённой версии;
иначе — собственное окно шапки. Пока условие задано, кнопка поля выделена,
число выбранных значений видно на ней только когда оно больше нуля, а само
условие словами — в подсказке.
Сохранённый вид, сохранённый доской, открывается доской.

## Карточка рядом со списком (с версии 1.17.0)

`record-card="<id>"` называет панель `sf-view-properties` на странице.
Запись, открытая из таблицы, списка или доски (`sf-view-open`, если его не
отменили), открывается в этой карточке рядом со списком: с 64rem — колонкой
без затемнения (вид помечает себя `data-sf-drawer-dock-host`, если страница
ничего не пометила), строка отмечена текущей. Alt+↓ / Alt+↑ в карточке идут
по порядку вида (`recordBeside(id, direction)`; у доски — по колонкам слева
направо), из списка — так же, пока карточка открыта (с версии 1.19.0).
Закрытие (× или Escape) закрывает карточку — вид ставит ей `open="false"` — и
возвращает фокус строке; открытая запись видна в таблице заливкой primary
12 % (в тёмной теме 24 %). Без `record-card` вид, как раньше, передаёт хосту
`record.open`. Когда хост закрывает свою панель записи (событие
`sf-view-properties-close`, × или Escape) и фокус падает на страницу, вид
возвращает его строке записи (с версии 1.26.0); если хост сам поставил фокус
куда-то, вид его не трогает.

Таблица внутри вида знает число записей под фильтром (с версии 1.19.0): вид
пишет ей `total` и `row-offset`, у сетки `aria-rowcount` — число записей и
строка заголовка, у строк второй и дальше страниц `aria-rowindex` — их место в
списке.

## Port 1.5.0: a write answered with its record, and a view that remembers its fields

Port 1.16.0 (from sf-view 1.26.0; simai/ui-source feat/view-port-levels, rides
group build 15) is accepted beside 1.0.0..1.15.0; the contract the view declares as
current stays 1.15.0 until the pinned pair carries 1.16.0. Two things, both additive:

- **Levels of saved views.** `saved_views[].level` is `system`, `shared` or
  `personal`; the list head's views menu groups them so. `package`, the 1.15.0 name
  of `system`, is read as `system` until 2027-01-01. A system view is never written:
  its change is saved as a new view.
- **The person's layer.** A host that announces `personal-preferences` (a signed-in
  person) sends `data.preferences` `{revision, page_size?, view_zone?, view?}` with
  its first answer. The view takes the page size from it (asking once more if the
  first query had another one) and opens or closes the view zone by it; a change of
  the page size or of the zone raises `preferences.save` with only the changed
  fields against the layer's revision, and goes once more against the
  `current_revision` of a conflict. Without the capability (a guest, any earlier
  port) both stay in the browser (SF.Preferences under `preferences-key`), as before.
  The browser keeps a copy either way for the first paint.
- **The view opened last** (from sf-view 1.27.0). `data.preferences.view` names the
  saved view the person opened last. On the layer's first answer the view opens it
  by itself, as the views menu does, unless the list already shows it (the page's
  own query or the default view), and that query carries the layer's page size.
  Opening another view raises `preferences.save {view}`, so the next visit opens it.

Port [1.5.0](../../core/contracts/ports/simai.dataview-port/1.5.0/port.json) adds two things, both additive. The 24 cases
of the [1.4.0 kit](../../core/contracts/ports/simai.dataview-port/1.4.0/kit/manifest.json) are byte for byte the first 24
of the [1.5.0 kit](../../core/contracts/ports/simai.dataview-port/1.5.0/kit/manifest.json), so a host that passed 1.4.0
has two cases to run.

**A write may answer with the record it changed.** An `applied` answer to
`record.mutate` that carries `records` and nothing else — no `echo`, no `total`,
no `columns` — is a patch of exactly those rows:

```js
async raise(intent, payload) {
  if (intent === 'record.mutate') {
    const record = await this.publish(payload.record_ids[0]);
    return {answer: 'applied', data: {records: [record]}};  // one row is rewritten
  }
}
```

The view writes those rows and leaves the page, the scroll and the selection as
they are. A host that answers with nothing still has the page read again, which
is what every host did before this version. A record the page does not hold
cannot be patched into it, so the view falls back to a query.

The page can do the same itself, whatever port version the host declares:

```js
view.updateRecord('17', {status: 'published', revision: 'r2'});
```

**A saved view carries the filter fields it was showing.** `view.save` sends
`settings.filter_fields` — the keys of the filter fields, in order — and the
host stores `settings` as it is given. When that view is opened, the component
puts those fields back from `saved_views[].settings.filter_fields`.

With the list head (`head="list"`, from 1.26.0) the view's fields are the head's
filter fields: opening a view puts its `settings.filter_fields` on the head row
(with the field of every condition it sets) whether or not the host echoes
`filters_chosen`, and the default view's fields are on the row from the first
answer. A view that keeps none starts with the fields its conditions name, never
the fields the person had on the view they left. Adding or removing a field of a
view that keeps its fields (a system or shared one; a personal view saves at
once) marks it changed («Изменено»), as a changed condition does.

## Nothing found, and what went wrong

An empty result is shown by the table, in its own body. The view announces it to
a screen reader through its status region, which has no box of its own, so a
search that finds nothing moves nothing on the page.

A refusal, a conflict or an unreachable host is a notice over the top of the
card — an `sf-alert` the view puts in its own `notice` slot — which shifts
nothing. Its text is a sentence: a host that sends `message` is quoted as it is,
a reason the component knows is translated, and the reason code itself goes on a
second line for whoever reads codes. `notify(text, {kind, code})` shows one, and
`notify("")` takes it away; the next good answer clears it too.

A list the host refused or could not give says the host's own sentence when the
answer to `query.change` carries a non-empty `message`: it is the title of the
table's empty state (no access) or error state (could not load) and the line the
status region announces, drawn as text, never markup. An `unavailable` list with
a message raises no error notice — the state already says why, e.g. «Список
готовится…» while a large storage's list is built. Without a message the view
keeps its own words («Данные временно недоступны») and the notice.

A refused list is «no access» only when it was refused for access: the reason is
missing, `forbidden`, `access_denied`, `scope_denied`, or a host's own name ending
in `_access_denied` or `_scope_denied`. Then the rows go, and so do the toolbar,
the selection and «Создать». Any other reason is about the query — `query_invalid`
for a search longer than the host takes, a filter it does not allow: the list
shows the error state with the host's `message` as text, or «Запрос не выполнен»
without one, and the toolbar, the search the person typed and the filters stay,
so the query can be corrected in place. No notice is raised over it.

## Port 1.2.0: the column that leads a record

Port [1.2.0](../../core/contracts/ports/simai.dataview-port/1.2.0/port.json) adds one optional column property, `role`,
whose only value is `title`. It marks the column that leads the record. The view
pins that column beside the box and the row menu while the rows scroll
sideways, and a reader names a row by it.

The step is additive: the twenty cases of the [1.2.0
kit](../../core/contracts/ports/simai.dataview-port/1.2.0/kit/manifest.json) are the nineteen of 1.1.0, byte for byte,
plus one case for the role, so a host that passed 1.1.0 has only the new case to
run. `sf-view` still accepts a host declaring 1.0.0 or 1.1.0; such a host
simply never sends the role, and then only the box and the row menu are pinned.
At most one column carries it — a second one is a host defect, and the view pins
the first it finds.

Pinning does not replace the person's own column settings: a column pinned by
hand through `sticky` keeps working exactly as before, independently of the role.

Порт [1.1.0](../../core/contracts/ports/simai.dataview-port/1.1.0/port.json) и его [kit](../../core/contracts/ports/simai.dataview-port/1.1.0/kit/manifest.json)
содержат точные требования. В 1.1.0 сохранены байты всех 18 исходных случаев
1.0.0; добавлен отдельный случай для разрешения общей записи. [Манифест
компонента](smart.manifest.json) объявляет точный хеш порта и пару версий.
`smart.view-table` остаётся прежним ID таблицы; новый композит имеет ID
`smart.view` и тег `sf-view`.

## Former tag

Until 2027-01-01 the former tag `sf-data-view` is a dated alias of `sf-view`
(rename plan R2, 2026-11-03): markup with the old tag upgrades as this element,
the Loader forwards the former rule name `cl-data-view` to `cl-view`, and each
use is noted once in `SF.deprecations`. Write the new tag in new markup.

Every event keeps its former name beside the new one, with the same detail:
`sf-data-view-open`, `sf-data-view-deleted`, `sf-data-view-answer`, `sf-data-view-state`, `sf-data-view-tree`, `sf-data-view-files-drop`, `sf-data-view-saved-view-intent`, `sf-data-view-list-open`.

A page asks the view to save a shared saved view with `save` on the view
itself (vocabulary 1.1.5 §9, sf-view 1.12.0):

```js
view.dispatchEvent(new CustomEvent('sf-view-save', {detail: {kind: 'view', key: 'team', label: 'Команда'}}));
```

The view raises `view.save_shared`; a detail of another `kind` is left alone.
The former name `sf-view-saved-view-intent` (and `sf-data-view-saved-view-intent`)
is still heard until 2027-01-01, its detail read as a view, and each use is
noted in `SF.deprecations`. The new name sent without `kind` is read as a view
too and is not noted.

The public CSS variables (`--sf-data-view-*`) and the class names keep the former name.
