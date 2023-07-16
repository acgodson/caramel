import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Title from "./Title";

const Layout = ({ children, title }: any) => {
  return (
    <Box w="100%" display={"flex"} justifyContent={"center"}>

      <Box
        w={"100%"}
        minH={"100vh"}
        bg={"#fff3de"}
        // color={styles.fgColor}
        overflowX="hidden"
        overflowY="scroll"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      // maxW="600px"
      >
        <Flex direction="column"
          alignItems={"center"}
          w="100%" h="100%" p="20px">
          <Flex direction="row">
            {/* <GoBack shouldShow={withGoBack} /> */}
            <Box flex="1">
              <Title align="left">{title}</Title>
            </Box>
          </Flex>
          <Box h="20px" />
          {children}
        </Flex>
      </Box>
    </Box>
  );
};

export default Layout;
