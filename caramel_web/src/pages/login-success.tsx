import React, { useEffect, useState } from "react";
import { useToast, Box, VStack, Center, Text, Flex, Icon, Button, HStack, Link } from "@chakra-ui/react";
import Layout from "../components/Layout";
import Lottie from "lottie-react";
import success from "@/components/success.json";
import { FiExternalLink } from "react-icons/fi";
import { useRouter } from "next/router";

const LoginSuccess = () => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<any>("");
    const [idToken, setIdToken] = useState<any>("");
    const [account, setAccount] = useState<any>("");
    const [creationTxId, setCreationTxId] = useState<any>("");
    const [publicKey, setPublicKey] = useState<any>("");
    const [privateKey, setPrivateKey] = useState<any>("");
    const [signatureAlgorithm, setSignatureAlgorithm] = useState<any>("");
    const [hashAlgorithm, setHashAlgorithm] = useState<any>("");


    useEffect(() => {
        const { accessToken, idToken, account, creationTxId, publicKey, privateKey, signatureAlgorithm, hashAlgorithm, } = router.query;
        setAccessToken(accessToken || "");
        setIdToken(idToken || "");
        setAccount(account || "");
        setCreationTxId(creationTxId || "");
        setPublicKey(publicKey || "");
        setPrivateKey(privateKey || "");
        setSignatureAlgorithm(signatureAlgorithm || "");
        setHashAlgorithm(hashAlgorithm || "");
    }, []);

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
                    <Box w="100%" flexDirection={"column"} alignItems={"center"} justifyContent={"space-between"} display={"flex"}>
                        <Box h="120px" w="120px">
                            <Lottie animationData={success} loop={false} />
                        </Box>
                        <Text fontWeight={"bold"}> Account Created</Text>
                        <Flex align="center" bg="gray.100" p={2} mt={1} fontWeight={"semibold"} color="#00dab9">
                            <Text flex={1} mr={2}>Address: {account}</Text>
                            <Box as="a" href="#" target="_blank" rel="noopener noreferrer">
                                <Link href={`https://testnet.flowscan.org/transaction/${creationTxId}`}  >    <Icon as={FiExternalLink} boxSize={6} />
                                </Link>
                            </Box>
                        </Flex>
                    </Box>
                    <Box w="100%" px={5}>
                        <HStack justifyContent={"space-between"}>
                            <Button
                                h="50px"
                                color="#f38c00"
                                bg="black"
                                _hover={{
                                    color: "black",
                                    bg: "#f38c00",
                                }}
                                _active={{
                                    color: "black",
                                    bg: "#f38c00",
                                }}
                            >
                                Add Faucets
                            </Button>
                            <Button
                                h="50px"
                                fontWeight={"bold"}
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
                                onClick={() => {
                                    //TODO: remeber to save url parameters in native app
                                    router.push("/home")
                                }
                                }
                            >
                                Continue
                            </Button>
                        </HStack>
                    </Box>
                </Box>
            </VStack>
        </Layout>
    );
};

export default LoginSuccess;
