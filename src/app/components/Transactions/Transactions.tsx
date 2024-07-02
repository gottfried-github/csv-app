'use client'

import { useState, useEffect, useMemo, ChangeEvent } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import styled from '@emotion/styled'
import {
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TableContainer,
  Flex,
  Center,
} from '@chakra-ui/react'

import { Transaction } from '@/types/transactions'
import { throttle } from '@/utils/utils'
import Edit from './components/Edit'
import DeleteDialog from './components/DeleteDialog'

const PAGE_SIZE = 15

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortName, setSortName] = useState('clientName')
  const [sortAsc, setSortAsc] = useState(true)
  const [pageCurrent, setPageCurrent] = useState(0)
  const [transactionCurrent, setTransactionCurrent] = useState<Transaction | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: dataInitial } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await axios.get(`/transactions`)

      return data.data
    },
  })

  const queryKey = useMemo(
    () => ['transactions', searchQuery, filterType, filterStatus, sortName, sortAsc, pageCurrent],
    [searchQuery, filterType, filterStatus, sortName, sortAsc, pageCurrent]
  )

  const {
    data: dataDynamic,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filterType) {
        params.append('type', filterType)
      }

      if (filterStatus) {
        params.append('status', filterStatus)
      }

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      params.append('page', pageCurrent.toString())
      params.append('sortName', sortName)
      params.append('sortDir', sortAsc ? 'asc' : 'desc')

      const paramsStr = params.toString()

      const { data } = await axios.get(`/transactions${paramsStr ? `?${paramsStr}` : ''}`)

      return data.data
    },
  })

  const data = useMemo(
    () => (isLoading ? dataInitial : dataDynamic),
    [dataInitial, dataDynamic, isLoading]
  )

  const pageCount = useMemo(() => Math.ceil(data.count / PAGE_SIZE), [data.count])

  const handleSearchInput = useMemo(
    () =>
      throttle((ev: InputEvent) => {
        setSearchQuery((ev.target as HTMLInputElement).value)
      }, 150),
    []
  )

  const handleTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    setFilterType(ev.target.value)
    setPageCurrent(0)
  }

  const handleStatusChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(ev.target.value)
    setPageCurrent(0)
  }

  const handleSortNameChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    setSortName(ev.target.value || 'clientName')
  }

  const handleSortAscChange = () => {
    setSortAsc(!sortAsc)
  }

  const handlePreviousClick = () => {
    if (pageCurrent === 0) return

    setPageCurrent(pageCurrent - 1)
  }

  const handleNextClick = () => {
    if (pageCurrent >= pageCount - 1) return

    setPageCurrent(pageCurrent + 1)
  }

  const handleEditClick = (transaction: Transaction) => {
    setTransactionCurrent(transaction)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionCurrent(transaction)
    setIsDeleteOpen(true)
  }

  const handleEditClose = () => {
    setIsEditOpen(false)
    setTransactionCurrent(null)
  }

  const handleDeleteClose = () => {
    setIsDeleteOpen(false)
    setTransactionCurrent(null)
  }

  return (
    <>
      {data ? (
        <Container direction="column">
          <Input onInput={handleSearchInput} />
          <Flex justify="space-between">
            <FlexHorizontal>
              <Select placeholder="All types" onChange={handleTypeChange}>
                {data.filters.type.map((type: string) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              <Select placeholder="All statuses" onChange={handleStatusChange}>
                {data.filters.status.map((status: string) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <Select placeholder="Sort By" onChange={handleSortNameChange}>
                <option value="status">Status</option>
                <option value="type">Type</option>
                <option value="clientName">Client Name</option>
                <option value="amount">Amount</option>
              </Select>
              <Button onClick={handleSortAscChange}>{sortAsc ? 'DESC' : 'ASC'}</Button>
            </FlexHorizontal>
            <FlexHorizontal>
              <Button>Import</Button>
              <Button>Export</Button>
            </FlexHorizontal>
          </Flex>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Status</Th>
                  <Th>Type</Th>
                  <Th>Client Name</Th>
                  <Th>Amount</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.transactions.map((transaction: Transaction) => (
                  <Tr key={transaction.TransactionId}>
                    <Td>{transaction.TransactionId}</Td>
                    <Td>{transaction.Status}</Td>
                    <Td>{transaction.Type}</Td>
                    <Td>{transaction.ClientName}</Td>
                    <Td>{transaction.Amount}</Td>
                    <Td>
                      <FlexHorizontal>
                        <Button
                          onClick={() => {
                            handleEditClick(transaction)
                          }}
                        >
                          Edit Status
                        </Button>
                        <Button
                          color="red"
                          onClick={() => {
                            handleDeleteClick(transaction)
                          }}
                        >
                          Delete
                        </Button>
                      </FlexHorizontal>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Center>
            <FlexHorizontal>
              <Button isDisabled={pageCurrent === 0} onClick={handlePreviousClick}>
                Previous
              </Button>
              <Button isDisabled={pageCurrent >= pageCount - 1} onClick={handleNextClick}>
                Next
              </Button>
            </FlexHorizontal>
          </Center>
          {transactionCurrent ? (
            <>
              {isEditOpen ? (
                <Edit
                  transaction={transactionCurrent}
                  statuses={data.filters.status}
                  queryKey={queryKey}
                  handleClose={handleEditClose}
                />
              ) : isDeleteOpen ? (
                <DeleteDialog
                  transaction={transactionCurrent}
                  queryKey={queryKey}
                  handleClose={handleDeleteClose}
                />
              ) : null}
            </>
          ) : null}
        </Container>
      ) : null}
    </>
  )
}

export default Transactions

const Container = styled(Flex)`
  row-gap: 16px;
`

export const FlexHorizontal = styled(Flex)`
  column-gap: 6px;
`
