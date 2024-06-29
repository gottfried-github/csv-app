import { Transaction } from '@/types/transactions'
import db from '@/utils/db'

class Transactions {
  tableName: string

  constructor() {
    this.tableName = 'transactions'
  }

  async init() {
    return this.createTable()
  }

  async createTable() {
    const res = await db.run(
      `CREATE TABLE ${this.tableName} IF NOT EXISTS
      ( 
        TransactionId TEXT NOT NULL, 
        Status TEXT NOT NULL, 
        Type TEXT NOT NULL,
        ClientName TEXT NOT NULL,
        Amount TEXT NOT NULL
      )`
    )
  }

  async insertMany(transactions: Transaction[]) {
    for (const transaction of transactions) {
      await db.run(
        `INSERT INTO ${this.tableName} 
          ( TransactionId, Status, Type, ClientName, Amount )
          VALUES 
          (?, ?, ?, ?, ?)
        `,
        [
          transaction.TransactionId,
          transaction.Status,
          transaction.Type,
          transaction.ClientName,
          transaction.Amount,
        ]
      )
    }
  }

  async deleteAll() {
    return db.run(`DELETE FROM ${this.tableName}`)
  }

  async getMany() {
    return db.all<Transaction[]>(`SELECT * FROM ${this.tableName}`)
  }
}

const transactions = new Transactions()

export default transactions
