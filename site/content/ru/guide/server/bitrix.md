---
description: Как отвечать компонентам SIMAI View из 1С-Битрикса — контроллер модуля, вызов через BX.ajax.runAction и выборка D7 с постраничной навигацией.
profile: how_to
---

# 1С-Битрикс

В Битриксе намерения удобно принимать контроллером модуля: он сам проверяет
сессию и токен, а страница вызывает его через `BX.ajax.runAction`.

## Перед началом

- Свой модуль, например `vendor.shop`, с таблицей заказов на ORM D7
  (`OrderTable`).
- Права на чтение и изменение заказов, которые модуль умеет проверять.

## Шаги

1. Создайте контроллер в модуле:

   ```php
   // /local/modules/vendor.shop/lib/Controller/Orders.php
   namespace Vendor\Shop\Controller;

   use Bitrix\Main\Engine\Controller;
   use Vendor\Shop\OrderTable;

   final class Orders extends Controller
   {
       private const SORTABLE = ['NUMBER', 'BUYER', 'CREATED_AT'];

       public function intentAction(string $intent, array $payload): array
       {
           return match ($intent) {
               'query.change' => $this->query($payload),
               default => ['answer' => 'unavailable', 'reason' => 'capability-not-provided'],
           };
       }

       private function query(array $payload): array
       {
           $query = $payload['query'];
           $perPage = min((int) $query['per_page'], 100);
           $order = [];
           foreach ($query['sort'] ?? [] as $sort) {
               $field = strtoupper($sort['key']);
               if (in_array($field, self::SORTABLE, true)) {
                   $order[$field] = $sort['direction'] === 'desc' ? 'DESC' : 'ASC';
               }
           }
           $filter = $query['search'] !== '' ? ['%BUYER' => $query['search']] : [];
           $result = OrderTable::getList([
               'filter' => $filter,
               'order' => $order ?: ['ID' => 'DESC'],
               'limit' => $perPage,
               'offset' => ((int) $query['page'] - 1) * $perPage,
               'count_total' => true,
           ]);
           $records = [];
           while ($row = $result->fetch()) {
               $records[] = [
                   'id' => (int) $row['ID'],
                   'revision' => (string) $row['VERSION'],
                   'actions' => ['view'],
                   'number' => $row['NUMBER'],
                   'buyer' => $row['BUYER'],
                   'created_at' => $row['CREATED_AT']->format(DATE_ATOM),
               ];
           }

           return ['answer' => 'applied', 'sequence' => $payload['sequence'], 'data' => [
               'columns' => [
                   ['key' => 'number', 'label' => 'Заказ', 'role' => 'title', 'sortable' => true],
                   ['key' => 'buyer', 'label' => 'Покупатель', 'sortable' => true],
                   ['key' => 'created_at', 'label' => 'Создан', 'property_type' => 'datetime', 'sortable' => true],
               ],
               'records' => $records,
               'total' => $result->getCount(),
               'echo' => [...$query, 'filters_chosen' => $query['filters'] ?? [], 'filters_rejected' => []],
           ]];
       }
   }
   ```

   Ключи колонок в ответе пишутся строчными буквами, как их видит
   страница; поля ORM — заглавными, как принято в Битриксе.

   Чтобы контроллер вызывался по короткому имени, укажите его пространство
   имён в `.settings.php` модуля:

   ```php
   return ['controllers' => ['value' => ['defaultNamespace' => '\\Vendor\\Shop\\Controller'], 'readonly' => true]];
   ```

2. На странице вызовите действие контроллера из `raise`. Битрикс
   оборачивает ответ в `{status, data}`, поэтому порт возвращает `data`:

   ```js
   raise: (intent, payload) => BX.ajax.runAction('vendor:shop.orders.intent', {data: {intent, payload}})
     .then((response) => response.data)
     .catch(() => ({answer: 'unavailable', reason: 'server-error'})),
   ```

3. Проверяйте права в контроллере перед каждой выборкой и записью и
   отвечайте `refused` с `reason: 'forbidden'`, если их нет. Ревизией
   записи удобно сделать отдельное поле `VERSION`, которое увеличивается
   при каждом изменении.

## Результат

Список заказов читается из таблицы модуля страницами по `per_page`
записей, сортируется только по разрешённым полям и ищет по покупателю.

## См. также

- [Обычный REST](../rest/)
- [Laravel и Larena](../laravel/)
