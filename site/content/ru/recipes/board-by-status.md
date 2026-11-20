---
description: Как показать заказы доской по состоянию в SIMAI View — разметка, ответ сервера на окно колонок, перенос карточки и отказ — по шагам.
profile: how_to
---

# Доска по состоянию

Задача: показать заказы колонками по состоянию — «Новый», «Ждёт оплаты»,
«Оплачен», «Отправлен», — чтобы менеджер переносил карточку из колонки в
колонку, а сервер сохранял новое состояние и мог отказать с причиной.

## Перед началом

- Список уже загружается с сервера через `sf-view`
  ([Загрузка данных с сервера](../load-from-server/)).
- У записи есть поле выбора с вариантами (здесь `status`) — его значения и
  станут колонками.

## Шаги

1. Поставьте представление со способом `board`:

   ```html
   <sf-view aria-label="Заказы" layout="board" preferences-key="shop.orders.board"></sf-view>
   ```

   Чтобы человек сам переключал таблицу и доску, вместо `layout` включите
   шапку списка `head="list"` и назовите способы в `describe().layouts`
   ([Способы показа](/ru/guide/concepts/layouts/)).

2. На запрос доски ответьте колонками. Запрос — тот же `query.change`, в
   его `window` — поле колонок и сколько карточек в колонке:

   ```js
   async raise(intent, payload) {
     if (intent === 'query.change' && payload.query.window?.lanes) {
       const {lanes: field, per_lane: perLane} = payload.query.window;
       const found = await findOrders(payload.query);          // поиск и фильтры как у таблицы
       return {answer: 'applied', sequence: payload.sequence, data: {
         columns: COLUMNS, records: [], total: found.length,
         lanes: STATUS.map((lane) => {
           const all = found.filter((order) => order[field] === lane.value);
           return {value: lane.value, total: all.length, records: all.slice(0, perLane), cursor: all.length > perLane ? `${lane.value}:${perLane}` : null};
         }),
         view_config: {layouts: {board: {lane_field: 'status', card_fields: ['client', 'amount'], totals: ['count', {sum: 'amount'}]}}},
       }};
     }
   }
   ```

3. Сохраните перенос. Карточка, перенесённая в другую колонку, приходит
   намерением `record.set` с полем, новым значением и ревизией:

   ```js
   if (intent === 'record.set') {
     const saved = await saveField(payload.record_id, payload.key, payload.value, payload.revision);
     if (!saved.ok) return {answer: 'refused', reason: 'conflict', message: 'Заказ уже изменил другой менеджер'};
     return {answer: 'applied', data: {records: [saved.record]}};
   }
   ```

4. Если в колонку можно не из любой, скажите это доске заранее — правило
   проверится до сервера, а колонка, куда нельзя, побледнеет с причиной:

   ```js
   view.querySelector('sf-view-board').moves = {sent: {from: ['paid'], reason: 'В «Отправлен» — только из «Оплачен»'}};
   ```

## Результат

Заказы стоят колонками с числом записей и суммой в шапке. Перенос мышью
или клавишами (Пробел — отметить, Enter — взять, стрелки — нести)
сохраняет новое состояние; отказ сервера возвращает карточку на место с
его сообщением. «Показать ещё» в колонке просит следующие карточки той же
колонки с её `cursor`.

:::example {id="components/view-board" label="Заказы по состояниям"}
:::

## См. также

- [Доска](/ru/components/views/view-board/) — все настройки и события.
- [Способы показа](/ru/guide/concepts/layouts/)
- [Записи в календаре](../calendar/)
