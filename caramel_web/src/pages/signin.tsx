import React, { useEffect, useState } from "react";
import {
    useToast,
    Box,
    VStack,
    Center,
    Text,
    Flex,
    Icon,
    Button,
    HStack,
    Spinner,
    Divider,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import { EmailAuthProvider, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getAuth, signInWithPopup, } from "firebase/auth";
import { FaDownload, FaExclamationTriangle, FaGithub, FaGoogle, FaRocket } from "react-icons/fa";
import { useRouter } from "next/router";
import { useCreateAccount } from "@/hooks/createaccount";
import { account } from "@onflow/fcl";
import { useTransaction } from "@/contexts/TransactionContext";
import { createUser } from "@/db/firestore";
import { checkUserExists } from "@/components/controllers/authz";
import { AES } from "crypto-js";
import { MyUserCredential } from "@/components/controllers/helpers";




const auth = getAuth();

const Signin = () => {
    const toast = useToast();
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const { status, isLoading, createAccount, createPublisher } = useCreateAccount()
    const { setDefaultAccount, mapUserData, setUserCookie, setUserObject } = useTransaction();

    useEffect(() => {
        setTimeout(() => {
            const appParam: any = router.query._user;
            if (appParam && !loading) {
                const { _user, password } = router.query;
                //@ts-ignore
                signWithCredential(_user, password);
            }
        }, 10); // Adjust the delay as needed
    },);


    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            signInWithPopup(auth, provider).then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);

                if (credential) {
                    const accessToken = credential.accessToken;
                    const idToken = credential.idToken;
                    const user = result.user;
                    const userData = await mapUserData(user);
                    setUserCookie(userData);

                    const { keyExists, snapshot } = await checkUserExists(user.email!);

                    if (keyExists) {
                        localStorage.setItem("caramel-user", JSON.stringify(snapshot));
                        setUserObject(snapshot);
                        // retrieve  keys from local storage

                        // take user to home
                        router.push("home");
                    } else {
                        // Prompt user to enter password
                        const password = window.prompt("Enter Chosen password:");

                        if (password) {

                            const {
                                account,
                                creationTxId,
                                publicKey,
                                privateKey,
                                signatureAlgorithm,
                                hashAlgorithm,
                            } = await createAccount();

                            console.log(privateKey)

                            // Encrypt the private key using the password and private nonce
                            const encryptedPrivateKey = AES.encrypt(privateKey, password).toString();


                            if (account) {
                                setDefaultAccount(account);
                                const dbObj = {
                                    email: user.email,
                                    default: 0,
                                    account,
                                    creationTxId,
                                    keys: [
                                        {
                                            pubKey: publicKey,
                                            privkey: encryptedPrivateKey,
                                            signatureAlgorithm,
                                            hashAlgorithm,
                                        },
                                    ],
                                };

                                await createUser(user.uid!, dbObj);
                                localStorage.setItem("caramel-user", JSON.stringify(dbObj));
                                setUserObject(dbObj);
                            }

                            const signInObj: any = {
                                accessToken,
                                idToken,
                                account,
                                creationTxId,
                                publicKey,
                                encryptedPrivateKey,
                                signatureAlgorithm,
                                hashAlgorithm,
                            };

                            const queryString = new URLSearchParams(signInObj).toString();
                            const routeUrl = `/login-success?${queryString}`;
                            router.push(routeUrl);
                        }
                    }
                }



                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
        } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false);
            toast({
                title: errorMessage,
                status: "error",
            });
        }
    };

    const signWithCredential = async (_user: any, password: string) => {
        setLoading(true)
        //signing in with user credental
        const auth = getAuth();

        console.log(_user.email,)
        // Extract the necessary properties from the string
        const regex = /(\w+):\s?([^),]+)/g;
        let match;
        const userData: any = {};
        while ((match = regex.exec(_user))) {
            const key = match[1];
            const value = match[2];

            userData[key] = value;
        }
        const userJSON = JSON.stringify(userData);
        const myUserCredential: any = MyUserCredential.fromJSON(JSON.parse(userJSON));
        const Authcredential = EmailAuthProvider.credential(
            myUserCredential.user.email,
            password
        )
        const credential: any = await signInWithCredential(auth, Authcredential);
        console.log("user from credentials;", credential);

        if (credential) {
            const accessToken = credential.user.accessToken;
            const idToken = credential.user.idToken;
            const user = credential.user;
            const userData = await mapUserData(user);
            setUserCookie(userData);

            const { keyExists, snapshot } = await checkUserExists(user.email!);

            if (keyExists) {
                localStorage.setItem("caramel-user", JSON.stringify(snapshot));
                setUserObject(snapshot);
                // retrieve  keys from local storage

                // take user to home
                router.push("home");
            } else {
                // Prompt user to enter password
                // const password = window.prompt("Enter your password:");


                const {
                    account,
                    creationTxId,
                    publicKey,
                    privateKey,
                    signatureAlgorithm,
                    hashAlgorithm,
                } = await createAccount();

                // Encrypt the private key using the password and private nonce
                const encryptedPrivateKey = AES.encrypt(privateKey, password).toString();


                if (account) {
                    setDefaultAccount(account);
                    const dbObj = {
                        email: user.email,
                        default: 0,
                        account,
                        creationTxId,
                        keys: [
                            {
                                pubKey: publicKey,
                                privkey: encryptedPrivateKey,
                                signatureAlgorithm,
                                hashAlgorithm,
                            },
                        ],
                    };

                    await createUser(user.uid!, dbObj);
                    localStorage.setItem("caramel-user", JSON.stringify(dbObj));
                    setUserObject(dbObj);
                }

                const signInObj: any = {
                    accessToken,
                    idToken,
                    account,
                    creationTxId,
                    publicKey,
                    encryptedPrivateKey,
                    signatureAlgorithm,
                    hashAlgorithm,
                };

                const queryString = new URLSearchParams(signInObj).toString();
                const routeUrl = `/login-success?${queryString}`;
                router.push(routeUrl);

            }
        }



    };


    const signInWihDiscovery = () => {
    }


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
                            isLoading={isLoading}
                            _hover={{
                                color: "black",
                                bg: "#f38c00",
                            }}
                            _active={{
                                color: "black",
                                bg: "#f38c00",
                            }}
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
                        >                 <FaGithub /> <Text>Github</Text></HStack>
                        <Box />




                    </VStack>
                </Box>
            </VStack>
        </Layout>
    );
};

export default Signin;
