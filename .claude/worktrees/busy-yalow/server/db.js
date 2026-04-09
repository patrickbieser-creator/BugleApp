const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'bugle.db'));

db.exec('PRAGMA journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL DEFAULT '',
    body_html   TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'idea'
                  CHECK(status IN ('idea','draft','published','archived')),
    position    REAL NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_status_pos ON articles(status, position);

  CREATE TRIGGER IF NOT EXISTS articles_updated_at
    AFTER UPDATE ON articles FOR EACH ROW
  BEGIN
    UPDATE articles SET updated_at = datetime('now') WHERE id = OLD.id;
  END;
`);

module.exports = db;
