import { Center, Spinner, VStack } from "@chakra-ui/react";
import React from "react";


export default function LoadingSpinner() {
  return (
    <VStack
      justifyContent={"center"}
      alignItems={"center"}
      color="blue.200"
      h="100vh" w="100%" zIndex={"tooltip"} position={"fixed"} bg="black">
      <Center h="100%">
        <Spinner />
      </Center>

    </VStack>
  );
}
