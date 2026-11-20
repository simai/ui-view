---
description: SIMAI View — таблицы, списки и карточки записей для SIMAI Framework, подключаются одной строкой; живые примеры, руководство и справочник.
profile: landing
---

:::hero {layout=centered padding=2xl effect=heat-mosaic}
# SIMAI View

Таблицы, списки и карточки записей для SIMAI Framework: приложение отдаёт данные, а компоненты сами ищут, сортируют, листают и показывают запись.

[Начать](/ru/guide/)

[Компоненты](/ru/components/)
:::

## Примеры

Виды представления данных из одного набора: таблица; один список, который
переключается между таблицей, доской, карточками и календарём; карточка
записи; таблица с карточкой открытой строки и записи в ленте сообщений.
Данные отвечает небольшое «приложение» на JavaScript — настоящая страница
отвечает тем же со своего сервера.

:::example {id="home/showcase" label="Живые примеры" fullscreen=false wrap=false}
:::

[Код примера](/ru/guide/showcase/)

## Подключение

Набор подключается одной строкой рядом с SIMAI Framework — Loader сам
загрузит нужные компоненты:

<!-- release:cdn -->
```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261118.1205/distr/core/js/core.min.js" data-sf-sets="view"></script>
```
<!-- /release:cdn -->

Другие способы, версии и лицензия — в разделе [Подключение](/ru/guide/connection/).

## Почему SIMAI View

:::features
- :icon[bolt]{size=2 container=square variant=tonal scheme=primary} **Одна строка.** `data-sf-sets="view"` рядом с SIMAI Framework — и компоненты набора готовы на странице.
- :icon[dns]{size=2 container=square variant=tonal scheme=primary} **Данные остаются у вас.** Компонент просит, сервер отвечает: права, фильтры и запись решает приложение.
- :icon[speed]{size=2 container=square variant=tonal scheme=primary} **Большие объёмы.** Страницы с сервера, окно из видимых строк, приблизительный счёт для миллионов записей.
- :icon[devices]{size=2 container=square variant=tonal scheme=primary} **Любой экран.** Таблица на широком экране, компактный список на телефоне — без отдельной вёрстки.
- :icon[tune]{size=2 container=square variant=tonal scheme=primary} **Человек настраивает сам.** Колонки, сортировка и размер страницы запоминаются для каждого.
- :icon[accessibility_new]{size=2 container=square variant=tonal scheme=primary} **Клавиатура и диктор.** Стрелки, Home и End, доступные имена и объявления состояний.
:::

:::::surface {width=full tone=muted padding=lg}
<!-- release:footer -->
::::grid {columns=3 gap=4}
:::card {variant=plain}
### Версия
SIMAI View 1.9.0 от 19 ноября 2026 года. [История изменений](/ru/guide/changes/)
:::
:::card {variant=plain}
### Совместимость
Собран и проверен над выпуском SIMAI Framework `ui-dc9fc39aeb26`; работает с Core `core.runtime` 1.51.0 или новее. [Подключение](/ru/guide/connection/)
:::
:::card {variant=plain}
### Лицензия
Бесплатно для малого бизнеса и некоммерческого использования, остальным — коммерческая лицензия SIMAI. [Условия лицензии](/ru/guide/connection/#лицензия)
:::
::::

[Руководство](/ru/guide/) · [Компоненты](/ru/components/) · [Рецепты](/ru/recipes/) · [Свойства](/ru/properties/) · [npm](https://www.npmjs.com/package/@simai-studio/view) · [SIMAI Framework](https://ui.simai.io/)
<!-- /release:footer -->
:::::
