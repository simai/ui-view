---
description: Как отвечать компонентам SIMAI View из Laravel — маршрут, контроллер с разбором намерений и пагинацией Eloquent — и что берёт на себя Larena.
profile: how_to
---

# Laravel и Larena

В Laravel намерения принимает один маршрут и один контроллер на список.
Поиск, сортировку и страницы делает построитель запросов Eloquent.

## Перед началом

- Модель `Order` с полями `number`, `buyer`, `status`, `created_at` и
  `updated_at`.
- Политика доступа (`OrderPolicy`) с правами `viewAny` и `ship`.

## Шаги

1. Заведите маршрут:

   ```php
   // routes/web.php
   Route::post('/orders/intent', OrderIntentController::class)->middleware('auth');
   ```

2. Напишите контроллер. Он проверяет права, принимает только известные
   колонки сортировки и отвечает в форме порта:

   ```php
   final class OrderIntentController
   {
       private const SORTABLE = ['number', 'created_at', 'buyer'];

       public function __invoke(Request $request): JsonResponse
       {
           $intent = $request->string('intent')->toString();
           $payload = $request->input('payload', []);

           return response()->json(match ($intent) {
               'query.change' => $this->query($payload),
               'record.mutate' => $this->mutate($payload),
               default => ['answer' => 'unavailable', 'reason' => 'capability-not-provided'],
           });
       }

       private function query(array $payload): array
       {
           if (Gate::denies('viewAny', Order::class)) {
               return ['answer' => 'refused', 'reason' => 'forbidden', 'sequence' => $payload['sequence'] ?? 0];
           }
           $query = $payload['query'];
           $orders = Order::query()
               ->when($query['search'] ?? '', fn ($q, $search) => $q->where('number', 'like', "%{$search}%")
                   ->orWhere('buyer', 'like', "%{$search}%"));
           foreach ($query['sort'] ?? [] as $order) {
               if (in_array($order['key'], self::SORTABLE, true)) {
                   $orders->orderBy($order['key'], $order['direction'] === 'desc' ? 'desc' : 'asc');
               }
           }
           $page = $orders->paginate(perPage: min((int) $query['per_page'], 100), page: (int) $query['page']);

           return ['answer' => 'applied', 'sequence' => $payload['sequence'], 'data' => [
               'columns' => [
                   ['key' => 'number', 'label' => 'Заказ', 'role' => 'title', 'sortable' => true],
                   ['key' => 'buyer', 'label' => 'Покупатель', 'sortable' => true],
                   ['key' => 'created_at', 'label' => 'Создан', 'property_type' => 'datetime', 'sortable' => true],
               ],
               'records' => $page->getCollection()->map(fn (Order $order) => [
                   'id' => $order->id,
                   'revision' => $order->updated_at->toJSON(),
                   'actions' => Gate::allows('ship', $order) ? ['view', 'ship'] : ['view'],
                   'number' => $order->number,
                   'buyer' => $order->buyer,
                   'created_at' => $order->created_at->toJSON(),
               ])->all(),
               'total' => $page->total(),
               'echo' => [...$query, 'filters_chosen' => $query['filters'] ?? [], 'filters_rejected' => []],
           ]];
       }

       private function mutate(array $payload): array
       {
           $order = Order::findOrFail($payload['record_ids'][0]);
           if (Gate::denies('ship', $order)) {
               return ['answer' => 'refused', 'reason' => 'forbidden'];
           }
           $seen = $payload['revisions'][$order->id] ?? null;
           if ($seen !== $order->updated_at->toJSON()) {
               return ['answer' => 'conflict', 'current_revision' => $order->updated_at->toJSON()];
           }
           $order->update(['status' => 'shipped']);

           return ['answer' => 'applied', 'data' => ['records' => [[
               'id' => $order->id,
               'revision' => $order->updated_at->toJSON(),
               'actions' => ['view'],
               'number' => $order->number,
               'buyer' => $order->buyer,
               'created_at' => $order->created_at->toJSON(),
           ]]]];
       }
   }
   ```

3. На странице передайте CSRF-токен Laravel в заголовке запроса:

   ```js
   raise: (intent, payload) => fetch('/orders/intent', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
     },
     body: JSON.stringify({intent, payload}),
   }).then((response) => response.json()),
   ```

## Результат

Список заказов читает базу страницами, сортирует только по разрешённым
колонкам, а действие «Отгрузить» проверяет право и ревизию на сервере.

### Larena

В Larena — системе управления сайтом на Laravel — порт
`simai.dataview-port` со стороны сервера обслуживает пакет Larena
`dataview` (адаптер `larena:ui.dataview`): он принимает намерения,
проверяет их и отвечает выборкой с учётом прав. Списки её
административного интерфейса построены на тех же компонентах. Как описать
свою коллекцию, рассказывает документация Larena.

## См. также

- [Обычный REST](../rest/)
- [Запомненные предпочтения](../../concepts/preferences/) — как хранить
  выбор человека на сервере.
