import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import transactionsModel from '@/models/transactions'
import Transactions from './components/Transactions/Transactions'

import classes from './page.module.css'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['transactions'],
    queryFn: () => {
      return transactionsModel.getMany({})
    },
  })

  return (
    <main className={classes.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Transactions />
      </HydrationBoundary>
    </main>
  )
}
