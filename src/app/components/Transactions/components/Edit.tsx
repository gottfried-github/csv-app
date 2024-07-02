import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  Select,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

import { Transaction } from '@/types/transactions'
import { GetMany } from '@/types/data'
import { FlexHorizontal } from '../Transactions'
import React, { ReactNode } from 'react'

type FormValues = {
  status?: string
}

interface Props {
  transaction: Transaction
  statuses: string[]
  queryKey: (string | number | boolean)[]
  handleClose: () => void
}

const Edit = ({ transaction, statuses, queryKey, handleClose }: Props) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return axios.patch(`/transactions/${id}`, { status })
    },
    onSuccess: (data, { id, status }) => {
      queryClient.setQueryData(queryKey, (data: GetMany) => {
        return {
          ...data,
          transactions: data.transactions.map(transaction => {
            if (transaction.TransactionId !== id) return transaction

            return {
              ...transaction,
              Status: status,
            }
          }),
        }
      })
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      status: transaction.Status,
    },
    resolver: values => {
      const errors: { status?: string } = {}

      if (!values.status) {
        errors.status = 'Status is required'

        return {
          values,
          errors,
        }
      }

      if (!statuses.includes(values.status)) {
        errors.status = 'Invalid status'
      }

      return {
        values,
        errors,
      }
    },
  })

  const handleSubmitInner = (values: FormValues) => {
    if (!values.status || !transaction.TransactionId) return

    mutation.mutate({ id: transaction.TransactionId, status: values.status })
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Status</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl isInvalid={!!errors.status}>
            <Select {...register('status')}>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{(errors.status as ReactNode) || ''}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <FlexHorizontal>
            <Button colorScheme="blue" onClick={handleSubmit(handleSubmitInner)}>
              Update Status
            </Button>
            <Button mr={3} onClick={handleClose}>
              Close
            </Button>
          </FlexHorizontal>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Edit
