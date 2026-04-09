const express = require('express');
const router = express.Router();
const db = require('../db');
const { nanoid } = require('nanoid');

const INITIAL_GAP = 65536;
const REBALANCE_THRESHOLD = 1.0;

function rebalanceStatus(status) {
  const rows = db.prepare('SELECT id FROM articles WHERE status = ? ORDER BY position ASC').all(status);
  const update = db.prepare('UPDATE articles SET position = ? WHERE id = ?');
  db.exec('BEGIN');
  try {
    rows.forEach((row, i) => update.run((i + 1) * INITIAL_GAP, row.id));
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

// GET /api/articles
router.get('/', (req, res) => {
  const result = {};
  for (const status of ['idea', 'draft', 'published']) {
    result[status] = db.prepare('SELECT * FROM articles WHERE status = ? ORDER BY position ASC').all(status);
  }
  res.json(result);
});

// GET /api/articles/archive
router.get('/archive', (req, res) => {
  const rows = db.prepare("SELECT * FROM articles WHERE status = 'archived' ORDER BY updated_at DESC").all();
  res.json(rows);
});

// POST /api/articles
router.post('/', (req, res) => {
  const { title = '', body_html = '', status = 'idea', position } = req.body;
  const id = nanoid();
  let pos = position;
  if (pos === undefined) {
    const last = db.prepare('SELECT MAX(position) as m FROM articles WHERE status = ?').get(status);
    pos = (last.m || 0) + INITIAL_GAP;
  }
  db.prepare('INSERT INTO articles (id, title, body_html, status, position) VALUES (?, ?, ?, ?, ?)')
    .run(id, title, body_html, status, pos);
  res.status(201).json(db.prepare('SELECT * FROM articles WHERE id = ?').get(id));
});

// PATCH /api/articles/:id
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  if (!article) return res.status(404).json({ error: 'Not found' });

  const allowed = ['title', 'body_html', 'status', 'position'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (Object.keys(updates).length === 0) return res.json(article);

  const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE articles SET ${setClauses} WHERE id = ?`).run(...Object.values(updates), id);

  if (updates.position !== undefined) {
    const targetStatus = updates.status || article.status;
    const rows = db.prepare('SELECT position FROM articles WHERE status = ? ORDER BY position ASC').all(targetStatus);
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].position - rows[i - 1].position < REBALANCE_THRESHOLD) {
        rebalanceStatus(targetStatus);
        break;
      }
    }
  }

  res.json(db.prepare('SELECT * FROM articles WHERE id = ?').get(id));
});

// DELETE /api/articles/:id
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// POST /api/articles/:id/restore
router.post('/:id/restore', (req, res) => {
  const { id } = req.params;
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  const last = db.prepare("SELECT MAX(position) as m FROM articles WHERE status = 'idea'").get();
  const pos = (last.m || 0) + INITIAL_GAP;
  db.prepare("UPDATE articles SET status = 'idea', position = ? WHERE id = ?").run(pos, id);
  res.json(db.prepare('SELECT * FROM articles WHERE id = ?').get(id));
});

module.exports = router;
