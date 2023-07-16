import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react";
import TransactionProvider from "../contexts/TransactionContext";

export default function App({ Component, pageProps }: AppProps) {
  return (

    <ChakraProvider>
      <TransactionProvider>

        <Component {...pageProps} />
      </TransactionProvider>
    </ChakraProvider>

  );
}
