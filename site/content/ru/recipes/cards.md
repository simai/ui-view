---
description: Как показать товары сеткой карточек с обложкой в SIMAI View — разметка, ответ сервера на страницу карточек и «Показать ещё» — по шагам.
profile: how_to
---

# Карточки с обложкой

Задача: показать каталог товаров сеткой карточек — фото, название и
несколько полей, — чтобы покупатель или менеджер узнавал запись по
картинке, а следующие карточки приходили по «Показать ещё».

## Перед началом

- Список уже загружается с сервера через `sf-view`
  ([Загрузка данных с сервера](../load-from-server/)).
- У записи есть поле-файл с картинкой для обложки; без него карточки
  рисуются без фото.

## Шаги

1. Поставьте представление со способом `cards`:

   ```html
   <sf-view aria-label="Товары" layout="cards" preferences-key="shop.products.cards"></sf-view>
   ```

2. На запрос карточек ответьте страницей. Карточки просят свою страницу
   в `window` (по умолчанию 24 карточки):

   ```js
   if (intent === 'query.change') {
     const {page = 1, per_page: perPage = 24} = payload.query.window ?? {};
     const found = await findProducts(payload.query);
     return {answer: 'applied', sequence: payload.sequence, data: {
       columns: COLUMNS, total: found.length,
       records: found.slice((page - 1) * perPage, page * perPage),
       view_config: {layouts: {cards: {cover_field: 'photo', cover: {fit: 'cover', ratio: '4:3'},
         title_field: 'title', card_fields: ['sku', 'price', 'stock'], size: 'm'}}},
     }};
   }
   ```

3. Если считать все записи дорого, вместо `total` присылайте
   `has_next: true`, пока есть следующая страница.

## Результат

Каталог стоит сеткой: колонок столько, сколько вмещает ширина. Под сеткой
кнопка «Показать ещё 24» добавляет следующую страницу, а строка внизу
говорит, сколько показано: «1–24 из 40». Нажатие на карточку или Enter
открывает запись (`record.open`); стрелки ходят по сетке, Пробел отмечает
карточку.

:::example {id="components/view-cards" label="Товары"}
:::

## См. также

- [Карточки](/ru/components/views/view-cards/) — все настройки и события.
- [Способы показа](/ru/guide/concepts/layouts/)
- [Доска по состоянию](../board-by-status/)
