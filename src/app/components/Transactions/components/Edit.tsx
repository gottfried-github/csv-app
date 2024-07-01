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
import React, { ReactNode } from 'react'

interface Props {
  transaction: Transaction
  statuses: string[]
  queryKey: (string | number | boolean)[]
  isOpen: boolean
  handleClose: () => void
}

const Edit = ({ transaction, statuses, queryKey, isOpen, handleClose }: Props) => {
  // const mutation = useMutation({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    control,
  } = useForm({
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

      console.log('resolver, values, errors:', values, errors)

      return {
        values,
        errors,
      }
    },
  })

  // const handleSubmitInner = values => {}

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
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
