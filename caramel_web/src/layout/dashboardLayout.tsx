
import SideBarTab from '@/components/Sidebar';
import { Box, Stack, TabIndicator, Tabs, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';


export default function DashboardLayout({ children }: ReactNode | any) {
    return (
        <Box
        // position={"fixed"}
        >
            <Tabs w="100%" m={0} p={0}

                isFitted
                variant="unstyled"


            >



                <Box w="100%"
                    overflowY={"auto"}
                    css={{
                        "&::-webkit-scrollbar": {
                            width: "5px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#4F81FF",
                            borderRadius: "5px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: "#4F81FF",
                        },
                    }}>
                    <VStack

                        w="100%"
                        right={0}
                        pt={["420px", "130px", 0]}
                        h="100vh"
                    >
                        <VStack
                            position={"absolute"}
                            w={["100%", "100%", "80%"]}
                            right={0}
                            borderLeft="2px solid red"
                        >
                            <Stack
                                minH="100vh"
                                direction={["column", "column", "row"]}
                                w="100%"
                                h="100vh"
                                px={[3, 3, 6]}
                                justifyContent="center"

                            >
                                {children}

                            </Stack>

                        </VStack>

                        <VStack
                            bgGradient="linear(to-r, #FFBF00, #FF8C00)"
                            h="100%"
                            display={["none", "none", "flex"]}
                            // py={24}
                            // px={3}
                            w="20%"
                            left={0}
                            position="fixed"
                        >
                            <Box
                                position={"absolute"}
                                bg="whiteAlpha.600"
                                w="100%"
                                h="100%"
                                sx={{
                                    backdropBlur: "10px"
                                }}
                            />

                            <Box zIndex={"tooltip"} w="100%">
                                <SideBarTab />
                            </Box>

                        </VStack>

                    </VStack>

                </Box>
            </Tabs>

        </Box >
    );
}

