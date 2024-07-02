import { NextRequest } from 'next/server'
import { Filter } from '@/types/filters'
import { parseSearchParams } from '@/utils/utils'
import transactionsModel, { GetManyProps } from '@/models/transactions'

export const GET = async (req: NextRequest) => {
  /* Parse search params */
  const config = parseSearchParams(req.nextUrl.searchParams)

  try {
    const data = await transactionsModel.getMany(config)

    return Response.json({ data }, { status: 200 })
  } catch (e) {
    console.log('GET /transactions, e:', e)

    return Response.json({ message: 'something went wrong' }, { status: 500 })
  }
}
