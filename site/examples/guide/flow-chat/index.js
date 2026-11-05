// Data in a chat: messages in sf-list-feed, and under some of them a block of
// properties, sf-view-property-block. The assistant asks for a few fields; the
// page receives the answer as an event, checks it as a server would and settles
// the block. Settled, the block stays in the chat as what was sent.
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
const meeting = [
  {key: 'topic', label: 'Тема', propertyType: 'string', width: 'full', required: true, placeholder: 'О чём встреча'},
  {key: 'day', label: 'День', propertyType: 'date', width: 'half', required: true},
  {key: 'room', label: 'Переговорная', propertyType: 'choice', width: 'half', value: 'small',
    options: [{value: 'small', label: 'Малая'}, {value: 'big', label: 'Большая'}]},
];

const initializeChat = async () => {
  // Only the feed: the blocks are not in the page until a message carries
  // one, and the Loader fetches their code when they arrive (a value set on a
  // block before that is taken when it is defined).
  await customElements.whenDefined('sf-list-feed');
  const chat = document.querySelector('#chat');
  if (!chat || chat.dataset.exampleReady === 'true') return;
  chat.dataset.exampleReady = 'true';
  const drawn = new Map();
  chat.renderItem = (entry, {own}) => {
    if (drawn.has(entry.id)) return drawn.get(entry.id);
    const message = document.createElement('article');
    message.className = 'sf-list-feed__entry';
    message.setAttribute('aria-label', own ? 'Вы' : 'Ассистент');
    const text = document.createElement('p');
    text.className = 'sf-list-feed__text';
    text.textContent = entry.text;
    message.append(text);
    if (entry.block) {
      const block = document.createElement('sf-view-property-block');
      block.setAttribute('mode', 'edit');
      block.setAttribute('heading', 'Встреча');
      block.setAttribute('block-id', entry.id);
      block.fields = entry.block;
      message.append(block);
    }
    drawn.set(entry.id, message);
    return message;
  };
  chat.addEventListener('sf-view-property-block-answer', async (event) => {
    const block = event.target;
    const {accepted, values} = event.detail;
    await pause(300);
    if (!accepted) {
      block.settle({answer: 'applied'});
      chat.upsert({id: 'a-2', author: 'bot', text: 'Хорошо, встречу не назначаю.'});
      return;
    }
    if (values.day && values.day < new Date().toISOString().slice(0, 10)) {
      block.settle({answer: 'refused', errors: {day: 'Этот день уже прошёл.'}});
      return;
    }
    block.settle({answer: 'applied'});
    chat.upsert({id: 'a-2', author: 'bot', text: `Готово: «${values.topic}» в календаре.`});
  });
  chat.setItems([
    {id: 'q-1', author: 'me', own: true, text: 'Назначь встречу с отделом продаж.'},
    {id: 'a-1', author: 'bot', text: 'Уточните тему и день:', block: meeting},
  ]);
};

initializeChat();
