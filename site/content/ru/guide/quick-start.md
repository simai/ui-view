---
description: Рабочая таблица SIMAI View на своей странице за пять минут — от пустого файла до поиска и сортировки.
profile: tutorial
---

# Быстрый старт

За пять минут вы соберёте страницу с умной таблицей: колонки, записи,
поиск и сортировка. Понадобится только текстовый редактор и браузер —
ни npm, ни сборка не нужны.

## Перед началом

- Браузер последних версий: Chrome, Edge, Firefox или Safari.
- Доступ в интернет: SIMAI Framework и набор загружаются с jsDelivr.

## Шаги

1. Создайте файл `index.html` и подключите SIMAI Framework с набором `view`
   одной строкой. Атрибут `data-sf-sets="view"` говорит Loader, что
   странице нужен набор SIMAI View:

   ```html
   <!doctype html>
   <html lang="ru">
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>Клиенты</title>
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261105.1447/distr/core/css/core.min.css">
   </head>
   <body class="p-4">
     <script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261105.1447/distr/core/js/core.min.js" data-sf-sets="view"></script>
   </body>
   </html>
   ```

2. Поставьте таблицу в `<body>`, перед строкой со скриптом. Таблице нужно
   доступное имя — его читает экранный диктор:

   ```html
   <sf-view-table id="clients" aria-label="Клиенты" search-placeholder="Найти клиента"></sf-view-table>
   ```

3. Дайте таблице колонки и записи. Компонент загружается сам, поэтому
   сначала дождитесь его готовности — `customElements.whenDefined`:

   ```html
   <script>
     customElements.whenDefined('sf-view-table').then(() => {
       const table = document.querySelector('#clients');
       const clients = [
         {id: 1, name: 'ООО «Северный ветер»', city: 'Мурманск', manager: 'Анна Белова', since: '2021-03-15'},
         {id: 2, name: 'АО «Волга-Логистик»', city: 'Самара', manager: 'Илья Орлов', since: '2019-11-02'},
         {id: 3, name: 'ИП Соколова Ю. А.', city: 'Казань', manager: 'Анна Белова', since: '2024-06-20'},
       ];
       table.setColumns([
         {key: 'name', label: 'Клиент', role: 'title', sortable: true},
         {key: 'city', label: 'Город', sortable: true},
         {key: 'manager', label: 'Менеджер'},
         {key: 'since', label: 'Клиент с', propertyType: 'date', sortable: true},
       ]);
       table.setRows(clients);
     });
   </script>
   ```

   У каждой записи есть `id`, а значения лежат под ключами колонок.
   `role: 'title'` отмечает главную колонку: по ней называют строку, и она
   остаётся на месте, когда таблицу прокручивают вбок. `propertyType: 'date'`
   говорит, что в колонке даты. Формат показа набор за приложение не
   выбирает: здесь даты видны как записаны, а как их оформить, рассказано
   в разделе [Данные](../concepts/data/#формат-дат-и-чисел).

4. Научите таблицу искать и сортировать. Таблица не переставляет строки
   сама: она сообщает, что человек набрал в поиске
   (`sf-view-table-search-change`) или какую колонку выбрал для сортировки
   (`sf-view-table-sort-change`), а страница отдаёт ей строки в нужном
   порядке. Замените строку `table.setRows(clients);` на:

   ```js
   let search = '';
   let sort = null;
   const show = () => {
     let rows = clients.filter((client) => `${client.name} ${client.city} ${client.manager}`.toLowerCase().includes(search));
     if (sort?.direction) {
       const sign = sort.direction === 'desc' ? -1 : 1;
       rows = [...rows].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), 'ru') * sign);
     }
     table.setRows(rows);
   };
   table.addEventListener('sf-view-table-search-change', (event) => { search = event.detail.search.trim().toLowerCase(); show(); });
   table.addEventListener('sf-view-table-sort-change', (event) => { sort = event.detail; show(); });
   show();
   ```

5. Откройте `index.html` в браузере. Наберите в поиске «Самара», нажмите
   заголовок «Город» — строки встанут по алфавиту, нажмите ещё раз — в
   обратном порядке, третий раз снимает сортировку.

## Результат

Так выглядит страница из этих шагов (здесь пять записей):

:::example {id="guide/quick-start" label="Клиенты"}
:::

Так таблицу наполняют, когда записей десятки и все они уже на странице.
Когда записей тысячи и они живут на сервере, поставьте таблицу внутрь
[`sf-view`](/ru/components/views/view/): тогда представление само
собирает поиск, сортировку и страницу в один запрос `query.change`, сервер
отвечает одной страницей записей, а компонент рисует ответ.
Как это устроено — в разделе [Основные понятия](../concepts/).

## См. также

- [Подключение](../connection/) — версии, npm и своя копия набора.
- [Загрузка данных с сервера](../recipes/load-from-server/)
- [Умная таблица sf-view-table](/ru/components/views/view-table/)
