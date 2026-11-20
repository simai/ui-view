---
description: Как показать записи с датой в календаре SIMAI View — разметка, ответ сервера на дни на экране, записи без даты и перенос на другой день — по шагам.
profile: how_to
---

# Записи в календаре

Задача: показать доставки на месяц, неделю или день, чтобы диспетчер видел
загрузку дней, переносил доставку на другую дату, а сервер сохранял её и
отказывал, если дата не подходит.

## Перед началом

- Список уже загружается с сервера через `sf-view`
  ([Загрузка данных с сервера](../load-from-server/)).
- У записи есть поле даты (`date`) или даты и времени (`datetime`); для
  событий длиной в несколько дней — ещё поле окончания.

## Шаги

1. Поставьте представление со способом `calendar` и календарь в его слот:

   ```html
   <sf-view aria-label="Доставки" layout="calendar">
     <sf-view-calendar slot="content" aria-label="Доставки" time-zone="Europe/Moscow"
       options='{"date_field":"start","end_field":"end","color_field":"status","event_fields":["client"]}'></sf-view-calendar>
   </sf-view>
   ```

   Настройки можно отдать и с сервера — в `view_config.layouts.calendar`
   ответа.

2. На запрос календаря ответьте записями дней на экране. В `window.range`
   — первый день и день после последнего, в `context` — часовой пояс и
   первый день недели человека:

   ```js
   if (intent === 'query.change') {
     const {window = {}, context} = payload.query;
     if (window.undated) {                                    // записи без даты — отдельный список
       const undated = await findOrders({...payload.query, without: window.undated});
       return {answer: 'applied', sequence: payload.sequence, data: {columns: FIELDS, records: undated, total: undated.length}};
     }
     const [from, to] = window.range;
     const shown = await findOrders({...payload.query, from, to, timeZone: context.timeZone});
     return {answer: 'applied', sequence: payload.sequence, data: {columns: FIELDS, records: shown, total: shown.length}};
   }
   ```

3. Сохраните перенос. Событие, перенесённое на другой день, приходит
   намерением `record.set` с изменёнными полями даты в `patch`:

   ```js
   if (intent === 'record.set') {
     const record = await moveDelivery(payload.record_id, payload.patch);
     if (!record) return {answer: 'refused', reason: 'validation', message: 'Склад не успевает собрать заказ к этой дате'};
     return {answer: 'applied', data: {records: [record]}};
   }
   ```

4. Запретите неподходящие дни заранее — правила приходят с данными
   (`rules`), а запись, которую нельзя двигать, говорит это сама
   (`can: {update: false, reason}`).

## Результат

Календарь показывает доставки по дням с цветом по состоянию; переключатель
вверху меняет месяц, неделю, день и список. Перенос сохраняется на
сервере, отказ возвращает событие на прежний день с причиной. Кнопка «Без
даты» открывает записи без даты: их можно поставить на день.

:::example {id="components/view-calendar" label="Доставки"}
:::

## См. также

- [Календарь](/ru/components/view-calendar/) — все настройки и события.
- [Способы показа](/ru/guide/concepts/layouts/)
- [Доска по состоянию](../board-by-status/)
