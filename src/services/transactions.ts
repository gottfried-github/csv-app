import { GetManyProps } from '@/models/transactions'
import transactionsModel from '@/models/transactions'
import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify'

class Transactions {
  constructor() {
    transactionsModel.init()
  }

  async importCsv(csv: string) {
    await transactionsModel.deleteAll()

    return new Promise<void>((resolve, reject) => {
      parse(csv, { columns: true }, async (e, transactions) => {
        if (e) return reject(e)

        await transactionsModel.insertMany(transactions)

        resolve()
      })
    })
  }

  async exportCsv(config: GetManyProps) {
    const transactions = await transactionsModel.getAll(config)

    return new Promise((resolve, reject) => {
      stringify(transactions, { header: true }, (e, csv) => {
        if (e) return reject(e)

        resolve(csv)
      })
    })
  }
}

const transactions = new Transactions()

export default transactions
