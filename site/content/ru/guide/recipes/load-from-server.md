---
description: Как показать записи с сервера в SIMAI View — представление sf-view, порт и ответ на query.change — по шагам.
profile: how_to
---

# Загрузка данных с сервера

Записи живут на сервере, их сотни или тысячи. Представление `sf-view`
спрашивает у приложения одну страницу за раз, а таблица внутри него рисует
ответ.

## Перед началом

- Набор подключён к странице ([Подключение](../../connection/)).
- На сервере есть адрес, который принимает запрос и отвечает JSON, — здесь
  это `POST /api/orders/intent`.

## Шаги

1. Поставьте на страницу представление с таблицей и строкой страниц:

   ```html
   <sf-view id="orders" aria-label="Заказы" preferences-key="shop.orders">
     <sf-view-table slot="content" aria-label="Заказы" layout="auto"></sf-view-table>
     <sf-pagination slot="pagination" page-sizes="10,25,50"></sf-pagination>
   </sf-view>
   ```

2. Когда элемент готов, отдайте ему порт. Функция `raise` пересылает
   намерение на сервер и возвращает его ответ:

   ```js
   await customElements.whenDefined('sf-view');
   document.querySelector('#orders').setHostPort({
     version: '1.12.0',
     capabilities: [],
     async raise(intent, payload) {
       const response = await fetch('/api/orders/intent', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({intent, payload}),
       });
       if (!response.ok) return {answer: 'unavailable', reason: 'server-error'};
       return response.json();
     },
   });
   ```

3. На сервере ответьте на `query.change`. В `payload` приходят номер
   запроса `sequence` и запрос `query`: `search`, `filters`, `sort`, `page`,
   `per_page`. Ответ — страница записей, колонки, общее число и `echo` —
   запрос, который сервер действительно применил:

   ```json
   {
     "answer": "applied",
     "sequence": 3,
     "data": {
       "columns": [
         {"key": "number", "label": "Заказ", "role": "title", "sortable": true},
         {"key": "status", "label": "Состояние", "property_type": "choice",
          "options": [{"value": "new", "label": "Новый", "scheme": "primary"}]}
       ],
       "records": [
         {"id": 10468, "revision": "1", "actions": ["view"], "number": "№ 10468", "status": "new"}
       ],
       "total": 48,
       "echo": {"search": "", "filters": {}, "filters_chosen": {}, "filters_rejected": [],
                "sort": [], "page": 1, "per_page": 25}
     }
   }
   ```

4. Откройте страницу. Представление сразу отправит первый `query.change`;
   пока ответа нет, на месте списка стоит заготовка той же формы.

## Результат

Список показывает первую страницу записей с сервера. Поиск, сортировка и
переход по страницам отправляют новый `query.change`, и представление
применяет только ответ на последний запрос. Так устроен экран
«Склад» на [главной странице](/ru/): 640 позиций, по одной странице за
запрос.

:::example {id="components/view-application" label="Представление и приложение"}
:::

## См. также

- [Запросы и ответы](../../concepts/intents/)
- [Связь с сервером](../../server/)
- [Страницы](../paging/)
