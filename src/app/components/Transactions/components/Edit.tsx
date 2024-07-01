import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
import { FlexHorizontal } from '../Transactions'

interface Props {
  transaction: Transaction
  statuses: string[]
  queryKey: (string | number | boolean)[]
  isOpen: boolean
  handleClose: () => void
}

const Edit = ({ transaction, statuses, queryKey, isOpen, handleClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Status</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl>
            <Select>
              {statuses.map(status =>
                transaction.Status === status ? (
                  <option selected value={status}>
                    {status}
                  </option>
                ) : (
                  <option value={status}>{status}</option>
                )
              )}
            </Select>
            <FormErrorMessage>Status is invalid</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <FlexHorizontal>
            <Button colorScheme="blue">Update Status</Button>
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
