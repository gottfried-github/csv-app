import { Filter } from '@/types/filters'
import { GetManyProps } from '@/models/transactions'

export const throttle = (cb: any, interval: number) => {
  let isRunning = false

  return (...args: any[]) => {
    if (!isRunning) {
      isRunning = true

      cb(...args)

      setTimeout(() => {
        isRunning = false
      }, interval)
    }
  }
}

export const parseSearchParams = (params: URLSearchParams) => {
  /* Parse search params */
  const config: GetManyProps = {}
  const filters: Filter[] = []
  let sortDir = null
  let sortName = null

  if (params.get('columns')) {
    config.columns = params.get('columns')?.split(',')
  }

  if (params.get('type')) filters.push({ name: 'type', value: params.get('type') as string })

  if (params.get('status')) filters.push({ name: 'status', value: params.get('status') as string })

  if (filters.length) config.filters = filters

  if (params.get('search')) config.searchQuery = params.get('search') as string
  if (params.get('sortDir')) sortDir = params.get('sortDir') === 'asc'
  if (params.get('sortName')) sortName = params.get('sortName') as string

  if (sortDir !== null && sortName) {
    config.sort = { asc: sortDir, column: sortName }
  }

  if (params.get('page')) config.page = parseInt(params.get('page') as string, 10)

  return config
}
