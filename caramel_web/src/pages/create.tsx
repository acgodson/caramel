import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Button,
    Flex,
    useToast,
    VStack,
    Text,
    HStack,
    Grid,
    GridItem,
    Box,
    Input
} from "@chakra-ui/react";
import { ec as EC } from "elliptic";
import * as styles from "../styles";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
// import sss from "shamirs-secret-sharing";
const p256 = new EC("p256");
import { encryptECC, decryptECC } from "@/components/controllers/encryption";
import axios from "axios";
import { FiUploadCloud } from 'react-icons/fi';
import { bufferToDataURI } from "@/components/controllers/helpers";


const CreateAccount = () => {
    const toast = useToast();
    const [accountAddress, setAccountAddress] = useState<string>("");
    const [privKey, setPrivKey] = useState<string>("");
    const [publicKey, setPubliceKey] = useState<string>("")
    const [pageTitle, setPageTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)
    const [cid, setImageCID] = useState<any>("")
    const [encryptedImage, setEncryptedImage] = useState<any | null>(null)
    const [isEncrypting, setisEncryptingImage] = useState<boolean>(false)
    const [image, setImage] = useState<any | string>('');
    const [imageDataURI, setImageDataURI] = useState<any | null>(null);
    const [isDecrypting, setisDecrypting] = useState(false)

    const fileRef: any = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = fileRef.current.files[0];
        console.log(imageSrc);
        setImage(imageSrc);
    }, [fileRef]);


    const createKeys = async () => {
        setLoading(true)
        const key = p256.genKeyPair();
        const pubKey = key.getPublic("hex").slice(2);
        const privateKey = key.getPrivate("hex");
        setPrivKey(privateKey)
        setPubliceKey(pubKey)
        setAccountAddress("")
        setEncryptedImage("")
        setLoading(false)
    }



    const createAccount = async () => {
        let account;
        if (publicKey.length < 3) {
            console.log("invalid public key length")
        }

        setLoading(true)
        const data = {
            publicKey: publicKey,
            signatureAlgorithm: "ECDSA_P256",
            hashAlgorithm: "SHA3_256",
        };
        const url =
            "https://hardware-wallet-api-testnet.staging.onflow.org/accounts";

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            account = await response.json();
            console.log(account)
            // await validateFlowAccountInfo(account.address, privKey, keyID);
            // const accountInfo = await fcl
            // .send([fcl.getAccount(account.address)])
            // .then(fcl.decode);



            // const keys = accountInfo.keys;
            // console.log("keys", keys)
            // const selectedKey = keys[keyID];
            // console.log("selected key", selectedKey)

            const object = {
                account: account.address,
                publicKey: publicKey,
                privateKey: privKey,
                signatureAlgorithm: "ECDSA_P256",
                hashAlgorithm: "SHA3_256"
            }
            localStorage.setItem("caramel-keys", JSON.stringify(object))
            setLoading(false)

        } catch (e: any) {
            setLoading(false)
            toast({
                description: e.toString(),
                status: "error",
                duration: styles.toastDuration,
                isClosable: true,
            });
            return;
        }
        setAccountAddress(account.address)
    };


    const encryptImage = async () => {

        if (!image) {
            console.log('No file selected');
            return;
        }
        const formData = new FormData();
        formData.append('img', image);

        setisEncryptingImage(true)
        try {
            const config = {
                headers: { 'content-type': 'multipart/form-data' },
            };
            const response: any = await axios.post('/api/uploadToBrowser', formData, config)

            if (response) {
                const { buffer, mimeType, filename } = response.data
                const uncompressedPublicKey = "04" + publicKey;
                // Convert modifiedHexPublicKey back to elliptic curve point
                const pubKey = p256.keyFromPublic(uncompressedPublicKey, "hex").getPublic();
                const encryptedMsg = encryptECC(buffer, pubKey);
                const { ciphertext, iv, authTag, ciphertextPubKey, hex } = encryptedMsg
                // console.log("cipherKey", ciphertextPubKey)
                const cipherObj = {
                    ciphertext, iv, authTag, hex: hex
                }

                //upload to ipds

                let headersList = {
                    "Content-Type": "application/json"
                }

                let bodyContent = JSON.stringify({
                    object: cipherObj,
                    name: filename,
                    mimeType: mimeType
                });

                let pinataResponse = await fetch("/api/uploadToIPFS", {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList
                });

                let data: any = await pinataResponse.json();

                if (data) {
                    const { hash } = data;
                    setImageCID(hash)
                }
                setEncryptedImage(encryptedMsg);
                setisEncryptingImage(false)
            }


        } catch (error) {
            setisEncryptingImage(false)
            console.log("Error uploading image file:", error);
            // Handle error uploading image file
        }
    }


    const decryptImage = async () => {
        setisDecrypting(false)
        if (cid.length < 1) {
            console.log("cid too short")
        }

        // const url = `https://caramel01.infura-ipfs.io/ipfs/${cid}`;
        // const url = `https://ipfs.io/ipfs/${cid}`;
        const url = `https://scarlet-warm-anaconda-739.mypinata.cloud/ipfs/${cid}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch data from IPFS gateway');
            }

            const data: any = await response.text();

            if (data && data.length > 3) {
                const value = JSON.parse(data);
                const newData = JSON.parse(value.data);

                // Assuming the elliptic curve used is secp256k1
                const curve = new EC('p256');
                const publicKeyPoint = curve.keyFromPublic(newData.hex, 'hex').getPublic();
                const newEncrytionObject = {
                    ciphertext: new Uint8Array(newData.ciphertext.data),
                    iv: new Uint8Array(newData.iv.data),
                    authTag: new Uint8Array(newData.authTag.data),
                    ciphertextPubKey: publicKeyPoint
                }
                const decryptedMsg = decryptECC(newEncrytionObject, privKey);
                //encrypt buffer
                const bufferData = Buffer.from(decryptedMsg.toString(), 'base64');
                const _data: any = bufferToDataURI(bufferData);

                if (_data) {
                    setImageDataURI(_data);
                    setisDecrypting(false)
                }
            }

        } catch (e) {
            console.log(e)
            setisDecrypting(false)
        }
    }


    useEffect(() => {
        const localST = localStorage.getItem("caramel-keys");
        if (localST) {
            const obj = JSON.parse(localST);
            setPrivKey(obj.privateKey)
            setAccountAddress(obj.account)
            setPubliceKey(obj.publicKey)
        }
    }, [])


    return (
        <Layout
            title={pageTitle}
        >

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem
                    borderRadius={"15px"}
                    border={"3px solid #333"}
                    p={6}
                    colSpan={1}>
                    <VStack spacing={5}>
                        <Button
                            onClick={createKeys}
                        >
                            Generate New Keys
                        </Button>

                        <Button
                            onClick={createAccount}
                            isLoading={loading}
                        >
                            Create Account
                        </Button>


                        <Button
                            onClick={encryptImage}
                            isLoading={isEncrypting}
                        >
                            Encrypt & Image
                        </Button>
                        <Button
                            onClick={decryptImage}
                            isLoading={isDecrypting}
                        >
                            Decrypt Image
                        </Button>

                    </VStack>
                </GridItem>
                <GridItem
                    borderRadius={"15px"}
                    border={"3px solid #333"}
                    p={6}
                    maxW="450px"
                >

                    <Flex w="100%"
                        flexDir={"column"}
                    >
                        <Text
                            fontSize={"xs"}
                            fontWeight={"bold"}
                            color="blue.500"
                        >Public key:
                            <br />
                            <span style={{
                                color: "gray"
                            }}>
                                {publicKey}
                            </span>
                        </Text>
                        <Text
                            fontSize={"xs"}
                            fontWeight={"bold"}
                            color="blue.500"
                        >Private key: <br />

                            <span style={{
                                color: "gray"
                            }}>
                                {privKey}
                            </span>
                        </Text>
                        <Text>Account Address: {accountAddress}</Text>
                    </Flex>
                </GridItem>
                <GridItem
                    borderRadius={"15px"}
                    border={"3px solid #333"}
                    p={6}
                    maxW="450px"
                >

                    <Flex w="100%"
                        flexDir={"column"}
                    >

                        <Box w='100%' cursor={'pointer'} py={3}>
                            <Box
                                bg={'blackAlpha.300'}
                                w='100%'
                                display={'flex'}
                                justifyContent='center'
                                alignItems='center'
                                flexDirection={'column'}
                                textAlign={'center'}
                            >
                                {!image && (
                                    <>
                                        <FiUploadCloud fontSize={'40px'} />
                                        <Text fontSize={'sm'} py={0.5}>
                                            Upload Image
                                        </Text>
                                    </>
                                )}

                                <Box position={'absolute'} px={5}>
                                    {cid.length < 3 &&
                                        <Input
                                            opacity={image ? 1 : 0}
                                            className='hidden'
                                            type='file'
                                            id='file-input'
                                            accept='.jpeg,.jpg,.png,,image/*'
                                            ref={fileRef}
                                            onChange={(e) => capture()}
                                        />
                                    }

                                    {cid.length > 3 &&
                                        <Input
                                            className='hidden'
                                            readOnly={true}
                                            value={cid}
                                            type='name'
                                            id='file-input'
                                        />

                                    }
                                </Box>

                            </Box>
                        </Box>
                        <br />

                        <br />

                        <Text
                            fontSize={"xs"}
                            fontWeight={"bold"}
                            color="blue.500"
                        >Encryped Image: <br />

                            <span style={{
                                color: "gray"
                            }}>
                                {encryptedImage && encryptedImage.ciphertext.toString("hex").substring(0, 40) + "..."}
                            </span>
                        </Text>
                        <Text
                            fontSize={"xs"}
                            fontWeight={"bold"}
                            color="blue.500"
                        >Decrypted Image: <br />
                        </Text>

                        {imageDataURI &&

                            <Box
                                as="img"
                                alt="Image"
                                src={imageDataURI}
                                w="120px"
                                h="auto"
                            />

                        }


                    </Flex>
                </GridItem>
                <GridItem
                    borderRadius={"15px"}
                    border={"3px solid #333"}
                    p={6}
                    maxW="450px"
                >
                    <Button
                        onClick={decryptImage}
                        isLoading={isDecrypting}
                    >
                        Mint NFT
                    </Button>
                </GridItem>
            </Grid>




        </Layout>
    );
};

export default CreateAccount;