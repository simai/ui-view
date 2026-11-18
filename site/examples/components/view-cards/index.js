// Cards over an application's port. The "application" is a few lines of
// JavaScript with an array of products; on a real page raise() sends the same
// intents to the server and returns its answer in the same envelope.
//
// It answers the cards' window {page, per_page: 24} with the records of that
// page, the total and the cards' settings (view-config/1 layouts.cards), and
// a record.open when a card is pressed.
const CATEGORIES = [
  {value: 'kitchen', label: 'Кухня', scheme: 'warning'},
  {value: 'garden', label: 'Сад', scheme: 'success'},
  {value: 'home', label: 'Дом', scheme: 'primary'},
  {value: 'tools', label: 'Инструмент', scheme: 'neutral'},
];
const COLUMNS = [
  {key: 'title', label: 'Название', role: 'title'},
  {key: 'photo', label: 'Фото', property_type: 'file', variant: 'image'},
  {key: 'sku', label: 'Артикул'},
  {key: 'category', label: 'Категория', property_type: 'choice', options: CATEGORIES},
  {key: 'price', label: 'Цена', property_type: 'money', currency: 'RUB'},
  {key: 'stock', label: 'Остаток', property_type: 'integer'},
];
// Vases and mugs: the two product pictures of the site's illustration set.
const NAMES = [['Ваза «Север»', 'Кружка «Утро»'], ['Ваза «Лето»', 'Кружка «Вечер»'], ['Ваза настольная', 'Кружка дорожная'], ['Ваза высокая', 'Кружка с крышкой'], ['Ваза «Купол»', 'Кружка «Полдень»']];
const TOTAL = 40;
// The cards' settings: the cover, the title, up to four fields, the size.
const CARDS = {
  cover_field: 'photo',
  cover: {fit: 'cover', ratio: '4:3'},
  title_field: 'title',
  card_fields: ['sku', 'category', 'price', 'stock'],
  card_labels: false,
  size: 'm',
  density: 'default',
  more: 'button',
};
// A picture of the product from the site's illustration set (copied beside
// the example): a vase or a mug, both 4:3.
const PICTURES = ['product-01-4x3.svg', 'product-02-4x3.svg'];
const picture = (index) => ({label: PICTURES[index % 2], mime: 'image/svg+xml', href: `assets/${PICTURES[index % 2]}`, width: 1200, height: 900});

// The example shows when the first answer has drawn and its height holds, so
// nothing moves under the reader's eyes while the parts draw (frame CLS).
const frame = () => new Promise((done) => requestAnimationFrame(() => done()));
const reveal = async (root, answered) => {
  const limit = Date.now() + 4000;
  await Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((done) => setTimeout(done, 1500))]);
  let last = -1; let still = 0;
  while (still < 5 && Date.now() < limit) {
    await frame();
    const height = root.getBoundingClientRect().height;
    still = height === last && answered() ? still + 1 : 0;
    last = height;
  }
  root.style.removeProperty('visibility');
};

const initializeCards = async () => {
  const root = document.querySelector('[data-cards-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await customElements.whenDefined('sf-view');
  root.dataset.exampleReady = 'true';
  const view = root.querySelector('sf-view');
  const log = root.querySelector('[data-cards-log]');
  const products = Array.from({length: TOTAL}, (_, index) => ({
    id: `p${101 + index}`, revision: '1', title: NAMES[Math.floor(index / 2) % NAMES.length][index % 2],
    // Every seventh product has no picture: the card says so in its frame.
    photo: index % 7 === 4 ? null : picture(index),
    sku: `SM-${10230 + index * 7}`, category: CATEGORIES[index % CATEGORIES.length].value,
    price: String(490 + index * 150), stock: (index * 13) % 60, actions: ['view'],
  }));
  view.bulkActions = [{id: 'archive', label: 'В архив'}];

  let first = false;
  view.setHostPort({
    version: '1.12.0',
    capabilities: ['row-actions', 'bulk-actions'],
    async raise(intent, payload) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (intent === 'query.change') {
        // The cards' window: a page of 24 (the «Показать ещё» asks the next).
        const window = payload.query?.window ?? {page: 1, per_page: 24};
        const from = (window.page - 1) * window.per_page;
        first = true;
        return {answer: 'applied', sequence: payload.sequence, data: {
          columns: COLUMNS, total: TOTAL,
          records: products.slice(from, from + window.per_page),
          view_config: {layouts: {cards: CARDS}},
        }};
      }
      if (intent === 'record.open') {
        log.textContent = `Открыть ${payload.record_ids.join(', ')}: запись открывает приложение (или карточка записи рядом со списком).`;
        return {answer: 'applied'};
      }
      if (intent === 'bulk.apply' || intent === 'record.action') {
        log.textContent = `«В архив» для ${(payload.record_ids ?? []).join(', ')}: действие выполняет приложение.`;
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
  });
  reveal(root, () => first);
};

initializeCards();
