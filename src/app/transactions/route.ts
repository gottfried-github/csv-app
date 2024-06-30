import { Filter } from '@/types/filters'
import transactionsModel, { GetManyProps } from '@/models/transactions'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  /* Parse search params */
  const config: GetManyProps = {}
  const filters: Filter[] = []

  if (searchParams.get('columns')) {
    config.columns = searchParams.get('columns')?.split(',')
  }

  if (searchParams.get('type'))
    filters.push({ name: 'type', value: searchParams.get('type') as string })

  if (searchParams.get('status'))
    filters.push({ name: 'status', value: searchParams.get('status') as string })

  if (filters.length) config.filters = filters

  if (searchParams.get('search')) config.searchQuery = searchParams.get('search') as string
  if (searchParams.get('sort')) config.sortAsc = searchParams.get('sort') === 'asc'
  if (searchParams.get('page')) config.page = parseInt(searchParams.get('page') as string, 10)

  try {
    const data = await transactionsModel.getMany(config)

    return Response.json({ data }, { status: 200 })
  } catch (e) {
    console.log('GET /transactions, e:', e)

    return Response.json({ message: 'something went wrong' }, { status: 500 })
  }
}
