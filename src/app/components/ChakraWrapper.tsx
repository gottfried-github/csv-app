'use client'

import { ChakraProvider } from '@chakra-ui/react'

const ChakraWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>
}

export default ChakraWrapper
