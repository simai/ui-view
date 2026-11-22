---
description: Как подключить SIMAI View одной строкой, из npm или из своей копии; версии, совместимость с SIMAI Framework и лицензия.
profile: article
---

# Подключение

Страница подключает SIMAI Framework и называет наборы, которые использует.
Loader сам находит набор, загружает его правила и подгружает только те
компоненты, которые есть на странице.

## Одна строка

<!-- release:cdn -->
```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261120.1816/distr/core/js/core.min.js" data-sf-sets="view"></script>
```
<!-- /release:cdn -->

Атрибут `data-sf-sets` перечисляет наборы через пробел. Конкретную версию
набора задают через `@`: `data-sf-sets="view@<версия>"`. Без версии Loader
выбирает по общему индексу совместимости самый новый выпуск набора, который
подходит к подключённому Core.

Набор опубликован в npm как `@simai-studio/view`; Loader берёт его с
jsDelivr.

<!-- release:compat -->
Версия 1.11.0 (выпуск `view-2cc3a6afbc95`) собрана над выпуском SIMAI Framework `ui-b654460cad2a` (npm `@simai-studio/ui@5.20261120.1816`) и работает с `core.runtime` 1.51.0 или новее.
<!-- /release:compat -->

Ссылка на выпуск закрепляет Core и набор вместе:

<!-- release:cdn-pinned -->
```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261120.1816/distr/core/js/core.min.js" data-sf-sets="view@1.11.0"></script>
```
<!-- /release:cdn-pinned -->

## Из своей копии

Если страница раздаёт сборку набора сама — со своего сервера или из своей
сборки сайта, — она указывает адрес до запуска Core:

<!-- release:boot -->
```html
<script>
  window.SF_BOOT_CONFIG = {
    packages: {
      view: {base: '/assets/ui-view/smart', version: '1.11.0'}
    }
  };
</script>
<script src="/assets/ui/distr/core/js/core.min.js"></script>
```
<!-- /release:boot -->

`base` — папка `smart/` сборки набора: в ней лежат `rule.js` и папки
компонентов. Этот сайт подключает набор именно так, из своей сборки.

## Компоненты на странице

После подключения компоненты набора пишут обычной разметкой:

```html
<sf-view-table aria-label="Договоры"></sf-view-table>
```

Данные передают методами компонента (`setColumns`, `setRows`) или через порт
приложения (`setHostPort`) — см. [Основные понятия](../concepts/) и
страницы [компонентов](/ru/components/).

## Из npm

Набор опубликован в npm как `@simai-studio/view`. Пакет нужен, когда
страница раздаёт файлы со своего сервера или собирает их своей сборкой:

<!-- release:npm -->
```bash
npm install @simai-studio/view@1.11.0 @simai-studio/ui@5.20261120.1816
```
<!-- /release:npm -->

Готовая сборка набора лежит в `node_modules/@simai-studio/view/dist/`:
паспорт `set.json` и папка `smart/` с `rule.js` и папками компонентов.
Скопируйте `dist/smart/` к себе и укажите её в `SF_BOOT_CONFIG`, как в
разделе [Из своей копии](#из-своей-копии).

## Версии и совместимость

Версия набора — версия его npm-пакета. Каждый выпуск собран и проверен
ровно над одним выпуском SIMAI Framework и называет наименьший Core, с
которым работает.

<!-- release:versions -->
| Набор | Выпуск | Собран над SIMAI Framework | Нужен Core |
|:---|:---|:---|:---|
| 1.11.0 | `view-2cc3a6afbc95` | `ui-b654460cad2a` | `core.runtime` 1.51.0 или новее |
| 1.10.1 | `view-3dc9ad31d0f4` | `ui-b654460cad2a` | `core.runtime` 1.51.0 или новее |
| 1.10.0 | `view-705a90193256` | `ui-b654460cad2a` | `core.runtime` 1.51.0 или новее |
| 1.9.0 | `view-acd69c85b6aa` | `ui-dc9fc39aeb26` | `core.runtime` 1.51.0 или новее |
| 1.8.3 | `view-0bd7d7284c5a` | `ui-141822273efe` | `core.runtime` 1.51.0 или новее |
| 1.8.2 | `view-054588ce236c` | `ui-141822273efe` | `core.runtime` 1.51.0 или новее |
| 1.8.1 | `view-69a213f6773f` | `ui-141822273efe` | `core.runtime` 1.51.0 или новее |
| 1.8.0 | `view-80e24b1bd7cc` | `ui-141822273efe` | `core.runtime` 1.51.0 или новее |
| 1.7.1 | `view-9eff67bbf11f` | `ui-7fb26d395af2` | `core.runtime` 1.51.0 или новее |
| 1.7.0 | `view-0e589597e2d9` | `ui-2bd5a3ab478a` | `core.runtime` 1.51.0 или новее |
| 1.6.0 | `view-23ed2acf30d7` | `ui-a0370c0c99fb` | `core.runtime` 1.43.0 или новее |
| 1.5.1 | `view-aea031ba718b` | `ui-b4a77681f0a7` | `core.runtime` 1.43.0 или новее |
| 1.5.0 | `view-99763f547560` | `ui-cb287da78ab1` | `core.runtime` 1.43.0 или новее |
| 1.4.0 | `view-99c8dd1585fd` | `ui-0c23f6a0af12` | `core.runtime` 1.25.0 или новее |
| 1.3.0 | `view-cd0d82aeb756` | `ui-1e5ec795a1ce` | `core.runtime` 1.25.0 или новее |
| 1.2.0 | `view-f529c2354b0d` | `ui-1e5ec795a1ce` | `core.runtime` 1.25.0 или новее |
| 1.1.0 | `view-4d7070623fe1` | `ui-62b1d9b6dc8d` | `core.runtime` 1.25.0 или новее |
| 1.0.0 | `view-9c963d217188` | `ui-62b1d9b6dc8d` | `core.runtime` 1.25.0 или новее |
<!-- /release:versions -->

Строка без версии (`data-sf-sets="view"`) берёт самый новый выпуск набора,
который подходит к подключённому Core. Для рабочего сайта закрепите версию
(`data-sf-sets="view@<версия>"`): обновление станет вашим решением, а не
случайностью. Как переходить на новую версию — в разделе
[Обновление версий](../upgrading/).

Наборы не зависят друг от друга: SIMAI View не требует других наборов.

## Лицензия

SIMAI View распространяется по лицензии SIMAI Pro, общей для платных
наборов:

- бесплатно для малого бизнеса — PolyForm Small Business 1.0.0;
- бесплатно для некоммерческого использования — PolyForm Noncommercial 1.0.0;
- остальным — коммерческая лицензия SIMAI по запросу.

Автор и правообладатель — Рим Забаров. Сам SIMAI Framework распространяется
по лицензии Apache-2.0.

## Прежние теги

До 2027-01-01 работают прежние теги: `sf-data-view` (теперь `sf-view`),
`sf-table` (теперь `sf-view-table`) и `sf-property-view` (теперь
`sf-view-properties`). Каждое их использование отмечается в
`SF.deprecations`. Подробнее — в разделе [Обновление версий](../upgrading/).

## См. также

- [Быстрый старт](../quick-start/)
- [История изменений](../changes/)
- [Компоненты](/ru/components/)
