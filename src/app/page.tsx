import Transactions from './components/Transactions/Transactions'

import classes from './page.module.css'

export default function Home() {
  return (
    <main className={classes.main}>
      <Transactions />
    </main>
  )
}
