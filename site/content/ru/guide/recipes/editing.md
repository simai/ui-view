---
description: Как менять записи в SIMAI View — действие в меню строки с record.mutate и правка группы полей в карточке с group.save — по шагам.
profile: how_to
---

# Правка записей

Запись меняют двумя способами: **действием над строкой** — одна кнопка в
меню строки, например «Отгрузить», — или **в карточке** `sf-view-properties`,
где человек открывает группу полей, правит значения и сохраняет.

## Перед началом

- Список загружается через `sf-view`; у записей есть `revision`.
- Для действий в строке приложение объявляет возможность `row-actions`.

## Шаги

1. Опишите действия приложения в ответе на `query.change` — `row_actions`
   с подписью и иконкой — и разрешите их записям в `actions`:

   ```json
   {"row_actions": [{"id": "ship", "label": "Отгрузить", "icon": "local_shipping"}],
    "records": [{"id": "o-10468", "revision": "2", "actions": ["view", "ship"], "number": "№ 10468"}]}
   ```

   Меню строки предлагает только действия из `actions` этой записи.

2. Ответьте на `record.mutate`. В нём код действия, запись и её ревизия.
   Верните только изменённые записи — представление перерисует эти строки
   и не тронет страницу, прокрутку и отметки:

   ```js
   if (intent === 'record.mutate' && payload.action_id === 'ship') {
     const order = await shipOrder(payload.record_ids[0], payload.revisions);
     return {answer: 'applied', data: {records: [order]}};
   }
   ```

3. Для правки полей поставьте карточку и дайте ей порт. Карточка просит
   запись намерением `record.load` и сохраняет группу намерением
   `group.save`:

   ```js
   card.setHostPort({
     version: '1.7.0',
     capabilities: [],
     async raise(intent, payload) {
       if (intent === 'record.load') return {answer: 'applied', record: await readClient(payload.record_id)};
       if (intent === 'group.save') return saveClient(payload);
       return {answer: 'unavailable', reason: 'unknown-intent'};
     },
   });
   ```

4. В `group.save` приходят только изменённые поля группы и ревизия, которую
   видел человек. Если запись успела измениться, ответьте `conflict` —
   карточка сохранит то, что человек набрал, и перечитает запись. Иначе
   сохраните и верните запись с новой ревизией.

## Результат

Нажмите «Изменить» у группы, поменяйте значение и сохраните: приложение
примера запомнит его и ответит следующей ревизией.

:::example {id="components/view-properties-card" label="Карточка клиента"}
:::

Список и карточка вместе — экран «Заказы» на [главной странице](/ru/):
откройте заказ, отгрузите его из меню строки, и состояние сменится и в
строке, и в карточке.

## См. также

- [Выбор строк и действия над ними](../selection-and-bulk-actions/)
- [Карточка записи sf-view-properties](/ru/components/views/view-properties/)
