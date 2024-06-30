import transactionsService from '@/services/transactions'

export const POST = async (req: Request) => {
  const formData = await req.formData()

  const fileContents = await (formData.get('file') as File)?.text()

  try {
    await transactionsService.importCsv(fileContents)

    return Response.json({ message: 'sucessfully imported data' }, { status: 201 })
  } catch (e) {
    console.log('POST /csv, e:', e)
    return Response.json({ message: 'something went wrong' }, { status: 500 })
  }
}

export const GET = async () => {
  try {
    const csv = await transactionsService.exportCsv()

    return Response.json({ message: 'exported data succesfully', data: csv }, { status: 200 })
  } catch (e) {
    console.log('GET /csv, e:', e)
    return Response.json({ message: 'something went wrong' }, { status: 500 })
  }
}
