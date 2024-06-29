import path from 'path'
import { fileURLToPath } from 'url'
import sqlite3 from 'sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// TODO: move db path to env
const db = new sqlite3.Database(path.resolve(__dirname, './db.sqlite'))

export default db
