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
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, getRedirectResult, signInWithRedirect, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/router";
import { useCreateAccount } from "@/hooks/createaccount";
import { account } from "@onflow/fcl";
import { useTransaction } from "@/contexts/TransactionContext";
import { createUser } from "@/db/firestore";
import { checkUserExists } from "@/components/controllers/authz";
import { AES } from "crypto-js";


const auth = getAuth();

const Signin = () => {
    const toast = useToast();

    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const { status, createAccount } = useCreateAccount()
    const { setDefaultAccount, mapUserData, setUserCookie, setUserObject } = useTransaction()


    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (!authUser && !loading) {
                setTimeout(() => {
                    const appParam = router.query.app;
                    if (appParam && appParam === "true") {
                        console.log(appParam);
                        console.log("opening google");
                        // Call the signInWithGoogle function
                        signInWithGoogle();
                    }
                }, 10); // Adjust the delay as needed
            }
        });
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
                        const password = window.prompt("Enter your password:");

                        if (password) {
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



    //   Listen to UnAuthStateChange
    // useEffect(() => {
    //     auth.onAuthStateChanged((authUser) => {



    //         if (authUser) {
    //             getRedirectResult(auth)
    //                 .then(async (result) => {


    //                     // This gives you a Google Access Token. You can use it to access Google APIs.
    //                     const credential: any = GoogleAuthProvider.credentialFromResult(result!);
    //                     const token = credential.accessToken;

    //                     // The signed-in user info.
    //                     const user = result!.user;
    //                     // IdP data available using getAdditionalUserInfo(result)

    //                     console.log(user)

    //                     if (result) {
    //                         const credential = GoogleAuthProvider.credentialFromResult(result);

    //                         if (credential) {
    //                             const accessToken = credential.accessToken;
    //                             const idToken = credential.idToken;
    //                             const user = result.user;
    //                             const userData = await mapUserData(user);
    //                             setUserCookie(userData);

    //                             const { keyExists, snapshot } = await checkUserExists(user.email!);

    //                             if (keyExists) {
    //                                 localStorage.setItem("caramel-user", JSON.stringify(snapshot));
    //                                 setUserObject(snapshot);
    //                                 // retrieve  keys from local storage

    //                                 // take user to home
    //                                 router.push("home");
    //                             } else {
    //                                 // Prompt user to enter password
    //                                 const password = window.prompt("Enter your password:");

    //                                 if (password) {
    //                                     const {
    //                                         account,
    //                                         creationTxId,
    //                                         publicKey,
    //                                         privateKey,
    //                                         signatureAlgorithm,
    //                                         hashAlgorithm,
    //                                     } = await createAccount();

    //                                     // Encrypt the private key using the password and private nonce
    //                                     const encryptedPrivateKey = AES.encrypt(privateKey, password).toString();


    //                                     if (account) {
    //                                         setDefaultAccount(account);
    //                                         const dbObj = {
    //                                             email: user.email,
    //                                             default: 0,
    //                                             account,
    //                                             creationTxId,
    //                                             keys: [
    //                                                 {
    //                                                     pubKey: publicKey,
    //                                                     privkey: encryptedPrivateKey,
    //                                                     signatureAlgorithm,
    //                                                     hashAlgorithm,
    //                                                 },
    //                                             ],
    //                                         };

    //                                         await createUser(user.uid!, dbObj);
    //                                         localStorage.setItem("caramel-user", JSON.stringify(dbObj));
    //                                         setUserObject(dbObj);
    //                                     }

    //                                     const signInObj: any = {
    //                                         accessToken,
    //                                         idToken,
    //                                         account,
    //                                         creationTxId,
    //                                         publicKey,
    //                                         encryptedPrivateKey,
    //                                         signatureAlgorithm,
    //                                         hashAlgorithm,
    //                                     };

    //                                     const queryString = new URLSearchParams(signInObj).toString();
    //                                     const routeUrl = `/login-success?${queryString}`;
    //                                     router.push(routeUrl);
    //                                 }
    //                             }
    //                         }
    //                     }


    //                     // ...
    //                 }).catch((error) => {
    //                     // Handle Errors here.
    //                     const errorCode = error.code;
    //                     const errorMessage = error.message;
    //                     // The email of the user's account used.
    //                     const email = error.customData.email;
    //                     // The AuthCredential type that was used.
    //                     const credential = GoogleAuthProvider.credentialFromError(error);
    //                     // ...
    //                 });
    //         }

    //     });
    // }, []);










    if (loading) {
        return (
            <Layout title={"Caramel"}>
                <Center h="100vh">
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
                    <Box
                        w="100%"
                        h="100%"
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        display={"flex"}
                    >
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
                            leftIcon={<FaGoogle />}
                            onClick={signInWithGoogle}
                        >
                            Sign in with Google
                        </Button>
                    </Box>
                </Box>
            </VStack>
        </Layout>
    );
};

export default Signin;
