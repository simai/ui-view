---
description: Как показать данные записи или попросить заполнить несколько полей прямо в чате или ленте — sf-list-feed и sf-view-property-block по шагам.
profile: how_to
---

# Данные в потоке (чат)

В чате с ассистентом, в ленте событий или в комментариях данные идут прямо
в потоке: под сообщением — поля найденной записи или короткая форма. Для
этого есть блок свойств `sf-view-property-block`: он во всю ширину потока и
после ответа остаётся в нём записью того, что отправлено.

## Перед началом

- Поток сообщений — `sf-list-feed` из SIMAI Framework или своя разметка:
  блоку всё равно, где стоять.
- Набор `view` подключён к странице (см. [Подключение](/ru/guide/connection/)).

## Шаги

1. Нарисуйте сообщение и поставьте в него блок. Поля описываются так же,
   как в карточке записи:

   ```js
   const block = document.createElement('sf-view-property-block');
   block.setAttribute('mode', 'edit');          // без mode — только показать
   block.setAttribute('heading', 'Встреча');
   block.setAttribute('block-id', 'meeting-1');
   block.fields = [
     {key: 'topic', label: 'Тема', propertyType: 'string', width: 'full', required: true},
     {key: 'day', label: 'День', propertyType: 'date', width: 'half', required: true},
   ];
   message.append(block);
   ```

2. Слушайте ответ. Событие всплывает, поэтому один слушатель на весь поток
   принимает ответы всех блоков; `block-id` говорит, чей это ответ:

   ```js
   chat.addEventListener('sf-view-property-block-answer', async (event) => {
     const block = event.target;
     const {id, accepted, values} = event.detail;
     ...
   });
   ```

3. Проверьте ответ на сервере и закройте блок методом `settle()`. Принятый
   ответ — `{answer: 'applied'}`: блок покажет отправленное только для
   чтения. Отказ — `{answer: 'refused', errors: {поле: 'сообщение'}}`: блок
   снова откроется, сообщение встанет под полем.

   ```js
   const result = await server.createMeeting(values);
   block.settle(result.ok ? {answer: 'applied'} : {answer: 'refused', errors: result.errors});
   ```

4. Ответьте сообщением в поток: что сделано или почему нет.

## Результат

Нажмите «Отправить» с пустыми полями — блок отметит обязательные. Выберите
прошедший день — приложение откажет с сообщением у поля. Заполните верно —
блок останется в чате тем, что отправлено, а ассистент ответит.

:::example {id="guide/flow-chat" label="Чат с формой"}
:::

Тот же приём на [главной странице](/ru/), вкладка «В потоке»: найденная
заявка показана блоком, а командировка оформляется формой в чате.

## См. также

- [Блок свойств sf-view-property-block](/ru/components/views/view-property-block/)
- [Правка записей](../editing/)
- [Поля](/ru/fields/)
