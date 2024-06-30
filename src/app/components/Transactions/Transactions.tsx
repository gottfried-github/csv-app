'use client'

import styled from '@emotion/styled'
import {
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Center,
} from '@chakra-ui/react'

const Transactions = () => {
  return (
    <Container direction="column">
      <Input />
      <Flex justify="space-between">
        <FlexHorizontal>
          <Select></Select>
          <Select></Select>
          <Select></Select>
          <Button>ASC</Button>
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
            {/* <Tr>
        <Td>inches</Td>
        <Td>millimetres (mm)</Td>
        <Td isNumeric>25.4</Td>
      </Tr> */}
          </Tbody>
        </Table>
      </TableContainer>
      <Center>
        <FlexHorizontal>
          <Button>Previous</Button>
          <Button>Next</Button>
        </FlexHorizontal>
      </Center>
    </Container>
  )
}

export default Transactions

const Container = styled(Flex)`
  row-gap: 16px;
`

const FlexHorizontal = styled(Flex)`
  column-gap: 6px;
`
