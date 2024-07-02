import transactionsModel from '@/models/transactions'

type Context = {
  params: { id: string }
}

export const PATCH = async (req: Request, { params }: Context) => {
  const body = await req.json()

  try {
    await transactionsModel.updateStatusById(params.id, body.status)

    return Response.json({ message: 'updated successfully' }, { status: 200 })
  } catch (e) {
    console.log('PATCH /transactions, e:', e)

    return Response.json({ message: 'something went wrong' }, { status: 500 })
  }
}

export const DELETE = async (req: Request, { params }: Context) => {
  try {
    await transactionsModel.deleteById(params.id)

    return Response.json({ message: 'updated successfully' }, { status: 200 })
  } catch (e) {
    console.log('PATCH /transactions, e:', e)

    return Response.json({ message: 'something went wrong' }, { status: 500 })
  }
}
