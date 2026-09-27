// Add or update apps here. An app without a `url` renders as a "Coming soon" card.
const APPS = [
  { name: 'Intelligence Dashboard', type: 'Web app', url: 'https://we-intelligence-dashboard.vercel.app/' },
  { name: 'Ops Dashboard', type: 'Web app', url: 'https://we-ops-dashboard.vercel.app/' },
  {
    name: 'Media Monitoring',
    type: 'Google Sheet',
    url: 'https://docs.google.com/spreadsheets/d/17mG714Fnt_GHt0AmiRw3_OOiDfb0zHvoj8vepvEpw-U/edit?usp=sharing',
    host: 'docs.google.com/spreadsheets',
  },
  { name: 'SG Dashboard', type: 'Web app', url: 'https://we-sg-dashboard.vercel.app/' },
  { name: 'AI Dashboard', type: 'Web app', url: 'https://we-ai-dashboard.vercel.app/' },
  { name: 'BD Dashboard' },
];

// Live apps first, so keys 1–9 map to the numbers shown on the cards.
const live = APPS.filter((app) => app.url);
const soon = APPS.filter((app) => !app.url);

const pad = (n) => String(n).padStart(2, '0');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function liveCard(app, index) {
  const card = el('a', 'card');
  card.href = app.url;
  card.target = '_blank';
  card.rel = 'noopener';
  if (index < 9) card.setAttribute('aria-keyshortcuts', String(index + 1));

  const meta = el('div', 'card__meta label');
  meta.append(el('span', null, `${pad(index + 1)} · ${app.type}`));
  const open = el('span', null, 'Open ↗');
  open.setAttribute('aria-hidden', 'true');
  meta.append(open);

  const body = el('div', 'card__body');
  body.append(el('h3', 'card__name', app.name));
  body.append(el('div', 'card__host', app.host || new URL(app.url).host));
  body.append(el('span', 'visually-hidden', '(opens in a new tab)'));

  card.append(meta, body);
  return card;
}

function soonCard(app, index) {
  const card = el('div', 'card card--soon');

  const meta = el('div', 'card__meta label');
  meta.append(el('span', null, `${pad(index + 1)} · In the works`));
  meta.append(el('span', 'card__status', 'Coming soon'));

  const body = el('div', 'card__body');
  body.append(el('h3', 'card__name', app.name));
  body.append(el('div', 'card__note', 'not yet — soon.'));

  card.append(meta, body);
  return card;
}

function render() {
  const list = document.getElementById('apps');
  live.forEach((app, i) => {
    const li = el('li');
    li.append(liveCard(app, i));
    list.append(li);
  });
  soon.forEach((app, i) => {
    const li = el('li');
    li.append(soonCard(app, live.length + i));
    list.append(li);
  });

  const now = new Date();
  const today = document.getElementById('today');
  today.dateTime = now.toISOString().slice(0, 10);
  today.textContent = now.toLocaleDateString('en-SG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  document.getElementById('year').textContent = now.getFullYear();
}

// Number keys open the matching live app in a new tab.
window.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  if (e.target.isContentEditable || /^(input|textarea|select)$/i.test(e.target.tagName)) return;
  const app = live[parseInt(e.key, 10) - 1];
  if (app) window.open(app.url, '_blank', 'noopener');
});

render();
