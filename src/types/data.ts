import { Transaction } from './transactions'

export type GetMany = {
  count: number
  filters: {
    type: string[]
    status: string[]
  }
  transactions: Transaction[]
}
