---
description: SIMAI View — таблицы, списки и карточки записей для SIMAI Framework, подключаются одной строкой; живые примеры, руководство и справочник.
profile: landing
---

:::hero {layout=centered padding=xl media=none}
# SIMAI View

Таблицы, списки и карточки записей для SIMAI Framework: приложение отдаёт данные, а компоненты сами ищут, сортируют, листают и показывают запись.

[Начать](/ru/guide/)

[Компоненты](/ru/components/)
:::

## Примеры

Четыре вида представления данных из одного набора: таблица, карточка
записи, таблица с карточкой открытой строки и карточки в ленте сообщений.
Данные отвечает небольшое «приложение» на JavaScript — настоящая страница
отвечает тем же со своего сервера.

:::example {id="home/showcase" label="Живые примеры" fullscreen=false wrap=false}
:::

[Код примера](/ru/guide/showcase/)

## Подключение

Набор подключается одной строкой рядом с SIMAI Framework — Loader сам
загрузит нужные компоненты:

```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261105.1447/distr/core/js/core.min.js" data-sf-sets="view"></script>
```

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
::::grid {columns=4 gap=2}
:::card {variant=plain}
### Версия
SIMAI View 1.1.0 от 5 ноября 2026 года. [История изменений](/ru/guide/changes/)
:::
:::card {variant=plain}
### Совместимость
Собран и проверен над выпуском SIMAI Framework `ui-62b1d9b6dc8d`; работает с Core `core.runtime` 1.25.0 или новее. [Подключение](/ru/guide/connection/)
:::
:::card {variant=plain}
### Лицензия
Бесплатно для малого бизнеса и некоммерческого использования, остальным — коммерческая лицензия SIMAI. [Условия лицензии](/ru/guide/connection/#лицензия)
:::
:::card {variant=plain}
### Ссылки
[Руководство](/ru/guide/) · [Компоненты](/ru/components/) · [npm](https://www.npmjs.com/package/@simai-studio/view) · [SIMAI Framework](https://ui.simai.io/)
:::
::::
:::::
