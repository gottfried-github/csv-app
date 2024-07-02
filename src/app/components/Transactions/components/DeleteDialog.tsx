import { useRef } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'

import { Transaction } from '@/types/transactions'

interface Props {
  transaction: Transaction
  queryKey: (string | number | boolean)[]
  // isOpen: boolean
  handleClose: () => void
}

const DeleteDialog = ({ transaction, queryKey, handleClose }: Props) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`/transactions/${id}`)
    },
    onSuccess: (data, id) => {
      console.log('DeleteDialog, mutation.onSuccess, id:', id)

      queryClient.invalidateQueries({
        queryKey,
      })
    },
  })

  const handleDeleteClick = () => {
    if (!transaction.TransactionId) return

    mutation.mutate(transaction.TransactionId)
    handleClose()
  }

  const cancelRef = useRef(null)

  return (
    <AlertDialog isOpen={true} leastDestructiveRef={cancelRef} onClose={handleClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Transaction
          </AlertDialogHeader>

          <AlertDialogBody>Are you sure? You cannot undo this action afterwards.</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteClick} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DeleteDialog
