const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const DB = 'db.json';
const load = () => fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB)) : { users: [], messages: [] };
const save = d => fs.writeFileSync(DB, JSON.stringify(d, null, 2));

app.post('/register', (req, res) => {
  const { nick, password } = req.body;
  if (!nick || !password) return res.json({ error: 'Заполни всё' });
  const d = load();
  if (d.users.find(u => u.nick === nick)) return res.json({ error: 'Ник занят' });
  d.users.push({ nick, password });
  save(d);
  res.json({ ok: true });
});

app.post('/login', (req, res) => {
  const { nick, password } = req.body;
  const d = load();
  const u = d.users.find(u => u.nick === nick && u.password === password);
  res.json(u ? { ok: true } : { error: 'Неверный ник или пароль' });
});

app.get('/messages', (req, res) => res.json(load().messages));

app.post('/messages', (req, res) => {
  const { nick, text } = req.body;
  if (!nick || !text) return res.json({ error: 'Пусто' });
  const d = load();
  d.messages.push({ nick, text, time: Date.now() });
  save(d);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Работает на порту ' + PORT));