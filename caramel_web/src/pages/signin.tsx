import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, VStack, Center, Text, Button, HStack, Spinner, Divider } from "@chakra-ui/react";
import { FaDownload, FaExclamationTriangle, FaGithub, FaRocket } from "react-icons/fa";
import Layout from "@/components/Layout";
import { useCreateAccount } from "@/hooks/createaccount";
import { useSignInReciever } from "@/hooks/signin_reciever";



const Signin = () => {
    const router = useRouter()
    const { isLoading, createPublisher } = useCreateAccount()
    const { signWithCredential, loading } = useSignInReciever()


    useEffect(() => {
        setTimeout(() => {
            const appParam: any = router.query._user;
            if (appParam && !loading) {
                const { _user, password }: any = router.query;
                signWithCredential(_user, password);
            }
        }, 10);
    },);




    if (loading) {
        return (
            <Layout title={"Caramel"}>
                <Center h="100vh">
                    <Spinner />
                    <br />
                    <Text>Authenticating User...</Text>
                </Center>
            </Layout>
        );
    }

    return (
        <Layout title={"Caramel"}>
            <VStack
                h="100%"
                w="100%"
                pt={12}
                justifyContent={"flex-start"}
                alignContent={"center"}
            >
                <Box
                    minH="400px"
                    minW="400px"
                    bg="white"
                    px={3}
                    borderRadius={"18px"}
                    pt={0}
                    pb={3}
                    textAlign={"center"}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <VStack
                        w="100%"
                        h="100%"
                        alignItems={"center"}
                        justifyContent={"center"}
                    >


                        <br />
                        <Center>
                            <Text
                                fontSize={"semibold"}
                                color={"gray"}
                                fontStyle={"italic"}
                            >Mint Private NFTs on Flow Blockchain...</Text>
                        </Center>

                        <HStack fontWeight={"bold"}>
                            <FaExclamationTriangle color="red" />
                            <Text color={"red"}>      Testnet Demo</Text>
                        </HStack>

                        <VStack textAlign={"left"} w="100%">
                            <ol style={{
                                fontSize: "10px"
                            }}>
                                <li>
                                    <Text fontSize={"xs"}>Choose and install Flipper extension. </Text>
                                </li>
                                <li>
                                    <Text fontSize={"xs"}>Fund your account before proceeding. Get Faucets <span style={{
                                        color: "blue",
                                        cursor: "pointer"
                                    }}
                                        onClick={() => window.location.href = "https://testnet-faucet.onflow.org/fund-account"}
                                    >
                                        here
                                    </span></Text>

                                </li>
                            </ol>
                        </VStack>

                        Make sure you account is funded with testnet faucets bofore clicking on publish

                        <br />

                        <Button
                            h="50px"
                            color="#f38c00"
                            bg="black"
                            isLoading={isLoading}
                            _hover={{
                                color: "black",
                                bg: "#f38c00",
                            }}
                            _active={{
                                color: "black",
                                bg: "#f38c00",
                            }}
                            leftIcon={<FaRocket />}
                            onClick={createPublisher}

                        >
                            Publish in Collection
                        </Button>


                        <Divider py={5} />
                        <br />

                        <Center>
                            <Text
                                fontSize={"semibold"}
                                color={"gray"}
                                fontStyle={"italic"}
                            >Receive Private NFTs on Flow Blockchain...</Text>
                        </Center>


                        <Button
                            h="50px"
                            color="black"
                            bg="#f38c00"
                            _hover={{
                                color: "black",
                                bg: "#f38c00",
                            }}
                            _active={{
                                color: "black",
                                bg: "#f38c00",
                            }}
                            onClick={() => window.location.href = "https://github.com/acgodson/caramel"}
                            leftIcon={<FaDownload />}
                        >
                            Get Desktop App
                        </Button>

                        <HStack
                            py={4}
                            textStyle={"underline"}
                            as="a"
                            href="https://github.com/acgodson/caramel"
                            target="_blank"
                        >   <FaGithub /> <Text>Github</Text></HStack>
                        <Box />
                    </VStack>
                </Box>
            </VStack>
        </Layout>
    );
};

export default Signin;
