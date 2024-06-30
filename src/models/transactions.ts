import { Transaction } from '@/types/transactions'
import { Filter } from '@/types/filters'
import db from '@/utils/db'

export type GetManyProps = {
  columns?: string[]
  filters?: Filter[]
  searchQuery?: string
  sort?: {
    column: string
    asc: boolean
  }
  page?: number
}

const PAGE_SIZE = 15

const FILTERS_NAMES: Record<string, string> = {
  type: 'Type',
  status: 'Status',
}

const COLUMNS_NAMES: Record<string, string> = {
  id: 'TransactionId',
  status: 'Status',
  type: 'Type',
  clientName: 'ClientName',
  amount: 'Amount',
}

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
      `CREATE TABLE IF NOT EXISTS ${this.tableName}
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

  async deleteById(id: string) {
    return db.run(`DELETE FROM ${this.tableName} WHERE TransactionId = ?`, [id])
  }

  async updateStatusById(id: string, status: string) {
    return db.run(`UPDATE ${this.tableName} SET Status = ? WHERE TransactionId = ?`, [status, id])
  }

  async getMany({
    columns,
    filters,
    searchQuery,
    sort = { column: 'name', asc: true },
    page = 0,
  }: GetManyProps) {
    /* Construct the SQL query */

    /* column names */
    let columnsQuery = ''

    columns?.forEach(column => {
      if (!COLUMNS_NAMES[column]) return

      columnsQuery += `${columnsQuery ? ', ' : ''}${COLUMNS_NAMES[column]}`
    })

    columnsQuery = columnsQuery ? columnsQuery : '*'

    /* filters */
    let filtersQuery = ''

    filters?.forEach((filter, i) => {
      if (!FILTERS_NAMES[filter.name]) return

      const filterQuery = `${filtersQuery ? ' AND ' : ''}${FILTERS_NAMES[filter.name]} = $filter_${
        filter.name
      }`

      filtersQuery += filterQuery
    })

    const searchQueryExpression = searchQuery
      ? `${filtersQuery ? ' AND ' : ''}ClientName LIKE $searchQuery`
      : ''

    filtersQuery += searchQueryExpression

    /* sort and pagination */
    const sortQuery = `ORDER BY ${COLUMNS_NAMES[sort.column] || COLUMNS_NAMES.name} ${
      sort.asc ? 'ASC' : 'DESC'
    }`
    const paginationQuery = `LIMIT ${PAGE_SIZE}${page > 0 ? ' OFFSET $offset' : ''}`

    /* the whole query */
    const query = `SELECT ${columnsQuery} FROM ${this.tableName}${
      filtersQuery ? ` WHERE ${filtersQuery}` : ''
    } ${sortQuery} ${paginationQuery}`

    /* Construct substitution parameters */
    const params: Record<string, string | number> = {}

    filters?.forEach(filter => {
      if (!FILTERS_NAMES[filter.name]) return

      params[`$filter_${filter.name}`] = filter.value
    })

    if (searchQuery) params.$searchQuery = `%${searchQuery}%`
    if (page > 0) params.$offset = page * PAGE_SIZE

    /* Make the query */
    return db.all<Transaction[]>(query, params)
  }
}

const transactions = new Transactions()

export default transactions
