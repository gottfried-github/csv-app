import { ChangeEvent, useState } from 'react'
import styled from '@emotion/styled'
import {
  Button,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
} from '@chakra-ui/react'

import { FlexHorizontal } from '../Transactions'

interface Props {
  handlePickColumns: (columns: string[]) => void
  handleClose: () => void
}

const ExportModal = ({ handlePickColumns, handleClose }: Props) => {
  const [columnsPicked, setColumnsPicked] = useState<string[]>([])

  const handleCheckboxChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.checked) {
      setColumnsPicked(columnsPicked.filter(column => ev.target.value !== column))
      return
    }

    setColumnsPicked([...columnsPicked, ev.target.value])
  }

  const handleExportClick = () => {
    handlePickColumns(columnsPicked)
    handleClose()
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose columns to export</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FlexVertical direction="column">
            <Checkbox value="type" onChange={handleCheckboxChange}>
              Type
            </Checkbox>
            <Checkbox value="status" onChange={handleCheckboxChange}>
              Status
            </Checkbox>
            <Checkbox value="clientName" onChange={handleCheckboxChange}>
              Client Name
            </Checkbox>
            <Checkbox value="amount" onChange={handleCheckboxChange}>
              Amount
            </Checkbox>
          </FlexVertical>
        </ModalBody>

        <ModalFooter>
          <FlexHorizontal>
            <Button colorScheme="blue" onClick={handleExportClick}>
              Export
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

export default ExportModal

const FlexVertical = styled(Flex)`
  row-gap: 8px;
`
