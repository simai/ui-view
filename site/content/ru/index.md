---
description: SIMAI View — таблицы, доски, карточки, календарь и карточка записи для SIMAI Framework, подключаются одной строкой; живые примеры, руководство и справочник.
profile: landing
---

:::hero {layout=split padding=2xl media=none effect=data-flow}
# SIMAI View

Таблицы, доски, карточки и календарь для SIMAI Framework: приложение отдаёт данные, а компоненты сами ищут, сортируют, листают и показывают запись.

[Начать](/ru/guide/)

[Компоненты](/ru/components/)
:::

## Один список в разных видах

Это живой список заказов. Зона представления над ним открыта: переключите
«Таблица», «Доска», «Карточки» и «Календарь» — фильтр и поиск остаются, а
приложение отвечает теми же данными в форме нужного вида. Откройте заказ —
карточка записи встанет рядом со списком.

:::example {id="home/list" label="Список заказов" fullscreen=false wrap=false}
:::

[Код этого примера и другие примеры](/ru/guide/showcase/)

## Что в наборе

Каждый компонент нарисован сам собой на нескольких записях. Название ведёт
на его страницу.

:::::grid {columns=2 gap=4}
::::card {variant=plain}
### [Умная таблица](/ru/components/views/view-table/)

Записи строками: колонки по типам, сортировка, выбор, меню строки.

:::example {id="home/set-table" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Шапка списка](/ru/components/views/view-head/)

Название, представления, фильтр, поиск и «Создать» над списком.

:::example {id="home/set-head" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Доска](/ru/components/views/view-board/)

Записи колонками по значению поля; перенос карточки меняет поле.

:::example {id="home/set-board" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Карточки](/ru/components/views/view-cards/)

Записи сеткой карточек: название и до четырёх полей.

:::example {id="home/set-cards" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Календарь](/ru/components/views/view-calendar/)

Записи на днях их даты: месяц, неделя, день или список.

:::example {id="home/set-calendar" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Карточка записи](/ru/components/views/view-properties/)

Одна запись по разделам и группам: просмотр и правка.

:::example {id="home/set-card" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Блок в потоке](/ru/components/views/view-flow/)

Запись или короткая форма внутри ленты сообщений.

:::example {id="home/set-flow" fullscreen=false wrap=false}
:::
::::
:::::

## Подключение

Набор подключается одной строкой рядом с SIMAI Framework — Loader сам
загрузит нужные компоненты:

<!-- release:cdn -->
```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261120.1816/distr/core/js/core.min.js" data-sf-sets="view"></script>
```
<!-- /release:cdn -->

Другие способы, версии и лицензия — в разделе [Подключение](/ru/guide/connection/).

## Почему SIMAI View

:::features
- :icon[bolt]{size=2 container=square variant=tonal scheme=primary} **Одна строка.** `data-sf-sets="view"` рядом с SIMAI Framework — и компоненты набора готовы на странице.
- :icon[dns]{size=2 container=square variant=tonal scheme=primary} **Данные остаются у вас.** Компонент просит, сервер отвечает: права, фильтры и запись решает приложение.
- :icon[speed]{size=2 container=square variant=tonal scheme=primary} **Большие объёмы.** Страницы с сервера, окно из видимых строк, приблизительный счёт для миллионов записей.
- :icon[devices]{size=2 container=square variant=tonal scheme=primary} **Любой экран.** Таблица на широком экране, компактный список на телефоне — без отдельной вёрстки.
- :icon[tune]{size=2 container=square variant=tonal scheme=primary} **Человек настраивает сам.** Представления, колонки, сортировка и размер страницы запоминаются для каждого.
- :icon[accessibility_new]{size=2 container=square variant=tonal scheme=primary} **Клавиатура и диктор.** Стрелки, Home и End, доступные имена и объявления состояний.
:::

:::::surface {width=full tone=muted padding=lg}
<!-- release:footer -->
::::grid {columns=3 gap=4}
:::card {variant=plain}
### Версия
SIMAI View 1.10.1 от 21 ноября 2026 года. [История изменений](/ru/guide/changes/)
:::
:::card {variant=plain}
### Совместимость
Собран и проверен над выпуском SIMAI Framework `ui-b654460cad2a`; работает с Core `core.runtime` 1.51.0 или новее. [Подключение](/ru/guide/connection/)
:::
:::card {variant=plain}
### Лицензия
Бесплатно для малого бизнеса и некоммерческого использования, остальным — коммерческая лицензия SIMAI. [Условия лицензии](/ru/guide/connection/#лицензия)
:::
::::

[Руководство](/ru/guide/) · [Компоненты](/ru/components/) · [Рецепты](/ru/recipes/) · [Свойства](/ru/properties/) · [npm](https://www.npmjs.com/package/@simai-studio/view) · [SIMAI Framework](https://ui.simai.io/)
<!-- /release:footer -->
:::::
