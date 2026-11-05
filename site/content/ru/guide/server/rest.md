---
description: Как подключить SIMAI View к обычному REST API — порт на странице, разбор намерений на сервере и ответы — на примере Node.js.
profile: how_to
---

# Обычный REST

Если у сервера уже есть REST API — `GET /orders?page=2&q=…`,
`POST /orders/{id}/ship`, — не обязательно заводить новый адрес. Порт на
странице может сам переводить намерения в существующие запросы.

## Перед началом

- API умеет отдавать страницу записей с поиском и сортировкой и общее
  число записей.
- У записи есть поле, которое меняется при каждом изменении (`updated_at`
  или номер версии), — его можно отдавать как `revision`.

## Шаги

1. Переведите `query.change` в запрос к списку:

   ```js
   const toQueryString = ({search, sort, page, per_page}) => new URLSearchParams({
     q: search,
     page: String(page),
     per_page: String(per_page),
     ...(sort[0] ? {sort: `${sort[0].direction === 'desc' ? '-' : ''}${sort[0].key}`} : {}),
   });
   ```

2. Соберите ответ из ответа API. Каждой записи добавьте `revision` и
   `actions`:

   ```js
   async raise(intent, payload) {
     if (intent === 'query.change') {
       const response = await fetch(`/api/orders?${toQueryString(payload.query)}`);
       if (!response.ok) return {answer: response.status === 403 ? 'refused' : 'unavailable', reason: String(response.status)};
       const body = await response.json();
       return {answer: 'applied', sequence: payload.sequence, data: {
         columns: ORDER_COLUMNS,
         records: body.items.map((order) => ({...order, revision: order.updated_at, actions: order.can_ship ? ['view', 'ship'] : ['view']})),
         total: body.total,
         echo: {...payload.query, filters_chosen: payload.query.filters, filters_rejected: []},
       }};
     }
     if (intent === 'record.mutate' && payload.action_id === 'ship') {
       const id = payload.record_ids[0];
       const response = await fetch(`/api/orders/${id}/ship`, {
         method: 'POST',
         headers: {'Content-Type': 'application/json', 'If-Match': payload.revisions?.[id] ?? ''},
       });
       if (response.status === 412) return {answer: 'conflict'};
       if (!response.ok) return {answer: 'refused', reason: String(response.status)};
       const order = await response.json();
       return {answer: 'applied', data: {records: [{...order, revision: order.updated_at, actions: ['view']}]}};
     }
     return {answer: 'unavailable', reason: 'capability-not-provided'};
   }
   ```

3. Если сервер ваш, проще принять сам конверт: один `POST` на список,
   внутри — `switch` по `intent`. Пример на Node.js без библиотек:

   ```js
   import {createServer} from 'node:http';

   createServer(async (request, response) => {
     if (request.method !== 'POST' || request.url !== '/api/orders/intent') return response.writeHead(404).end();
     let body = '';
     for await (const chunk of request) body += chunk;
     const {intent, payload} = JSON.parse(body);
     const answer = intent === 'query.change'
       ? {answer: 'applied', sequence: payload.sequence, data: await readOrders(payload.query)}
       : {answer: 'unavailable', reason: 'capability-not-provided'};
     response.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify(answer));
   }).listen(8080);
   ```

   `readOrders` — ваша функция, которая читает базу и возвращает `columns`,
   `records`, `total` и `echo`.

## Результат

Список работает поверх существующего API: поиск, сортировка и страницы
идут в `GET`, действие строки — в `POST` с проверкой ревизии через
`If-Match`.

## См. также

- [Laravel и Larena](../laravel/)
- [1С-Битрикс](../bitrix/)
