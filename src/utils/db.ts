import db from '@/db'

const dbUtils = {
  run: (statement: string, params?: string[]) => {
    return new Promise<void>((resolve, reject) => {
      db.run(statement, params || [], e => {
        if (e) return reject(e)

        resolve()
      })
    })
  },
  all: <T>(statement: string, params?: string[]): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      db.all(statement, params || [], (e, transactions: T[]) => {
        if (e) return reject(e)

        resolve(transactions)
      })
    })
  },
}

export default dbUtils
