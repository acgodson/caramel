

import { Tabs, Box, Text, TabList, Tab, TabPanels, TabPanel, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, useDisclosure, VStack, useToast, IconButton, Heading, HStack, Icon, background, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Input, Checkbox, Stack } from "@chakra-ui/react";
import Lottie from "lottie-react";
import success from "@/components/success.json"
import { FaBook, FaShareAlt, FaUsers, FaCog, FaDownload } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddIcon, ChevronDownIcon, StarIcon } from "@chakra-ui/icons";
import { ec as EC } from "elliptic";
import { mintNFT } from "@/cadence/transactions/mint_nft"
import { CreatSharePool, MintNewNFT, StoreCollection } from "@/components/mint_new"
import axios from "axios";
import { encryptECC } from "./controllers/encryption";
import { FiUploadCloud } from "react-icons/fi";
import { useTransaction } from "@/contexts/TransactionContext";
import { getUser } from "@/db/firestore";
import FlowAccount from "@/lib/flowAccount";
import * as fcl from "@onflow/fcl";
import { checkUserExists } from "./controllers/authz";



export default function SideBarTab() {
    const [showDropdown, setShowDropdown] = useState(false);
    const { defaultAccount, user }: any = useTransaction()
    const [selectedOption, setSelectedOption] = useState("");
    const [hash, setHash] = useState<string | null>(null);
    const toast = useToast();
    const [pageTitle, setPageTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)
    const [cid, setImageCID] = useState<any>("")
    const [encryptedImage, setEncryptedImage] = useState<any | null>(null)
    const [isEncrypting, setisEncryptingImage] = useState<boolean>(false)
    const [image, setImage] = useState<any | string>('');
    const [imageDataURI, setImageDataURI] = useState<any | null>(null);
    const [isDecrypting, setisDecrypting] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [receiver, setReceiver] = useState("");
    const [send, setSend] = useState(false);
    const [allowMint, setAllowMint] = useState(false)
    const { publisher } = useTransaction()

    const handleCheckboxChange = () => {
        setIsPrivate(!isPrivate);
    };

    const handleToggleDrawer = () => {
        setIsOpen(!isOpen);
        if (send) {
            setSend(false)
        }
    };


    const fileRef: any = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = fileRef.current.files[0];
        console.log(imageSrc);
        setAllowMint(true)
        setImage(imageSrc);
    }, [fileRef]);



    const tabItems = [
        { icon: FaBook, label: "Library" },
        { icon: FaDownload, label: "Shared" },
        { icon: FaUsers, label: "People" },
        { icon: FaCog, label: "Settings" },
    ];


    const handleToggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };


    const encryptImage = async () => {



        if (!defaultAccount || !publisher.addr) {
            console.log("no user signed in")
        }

        if (!image) {
            console.log('No file selected');
            return;
        }
        const formData = new FormData();
        formData.append('img', image);


        //start collection
        await StoreCollection()
        setisEncryptingImage(true)

        //let's retrieve the users public key
        // const { keys }: any = await getUser(user.id);
        console.log(publisher.addr.slice(2))

        const accountInfo = await fcl
            //@ts-ignore
            .send([fcl.getAccount(publisher.addr.slice(2))])
            .then(fcl.decode);

        console.log(accountInfo);

        const keys = accountInfo.keys[0].publicKey
        console.log("public key", keys)

        if (keys) {
            try {
                const config = {
                    headers: { 'content-type': 'multipart/form-data' },
                };
                const response: any = await axios.post('/api/uploadToBrowser', formData, config)

                if (response) {
                    const { buffer, mimeType, filename } = response.data
                    const p256 = new EC('p256');
                    const uncompressedPublicKey = "04" + keys;
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
                        console.log("imagehash: ", hash);
                        setImageCID(hash)

                        //upload metadata to IPFS
                        const metadataObj = {
                            image: hash,
                            name: "",
                            description: "",
                            tag: "",
                            mimeType: mimeType,
                            private: isPrivate
                        }

                        let bodyContent = JSON.stringify({
                            object: metadataObj,
                            name: filename,
                        });

                        let metadataResponse = await fetch("/api/uploadToIPFS", {
                            method: "POST",
                            body: bodyContent,
                            headers: headersList
                        });

                        let metadata: any = await metadataResponse.json();

                        if (metadata) {
                            const { hash } = metadata
                            console.log("metadataHash: ", hash);


                            //since we have the metadata, let's mint
                            const tx = await MintNewNFT(publisher.addr, hash);
                            console.log(tx)
                            toast({
                                title: "Mint Successful",
                                status: "success"
                            }
                            );
                        }
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



    }





    const ShareEncryptedImage = async () => {

        if (!defaultAccount || !publisher.addr) {
            console.log("no user signed in")
        }

        if (!image) {
            console.log('No file selected');
            return;
        }
        const formData = new FormData();
        formData.append('img', image);

        setisEncryptingImage(true)

        //let's retrieve the users public key
        // const { keys }: any = await getUser(user.id);
        console.log(receiver)

        const accountInfo = await fcl
            //@ts-ignore
            .send([fcl.getAccount(receiver)])
            .then(fcl.decode);

        console.log(accountInfo);

        const keys = accountInfo.keys[0].publicKey
        console.log("public key", keys)

        if (keys) {
            try {
                const config = {
                    headers: { 'content-type': 'multipart/form-data' },
                };
                const response: any = await axios.post('/api/uploadToBrowser', formData, config)

                if (response) {
                    const { buffer, mimeType, filename } = response.data
                    const p256 = new EC('p256');
                    const uncompressedPublicKey = "04" + keys;
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
                        console.log("imagehash: ", hash);
                        setImageCID(hash)

                        //upload metadata to IPFS
                        const metadataObj = {
                            image: hash,
                            name: "",
                            description: "",
                            tag: "",
                            mimeType: mimeType,
                            private: isPrivate
                        }

                        let bodyContent = JSON.stringify({
                            object: metadataObj,
                            name: filename,
                        });

                        let metadataResponse = await fetch("/api/uploadToIPFS", {
                            method: "POST",
                            body: bodyContent,
                            headers: headersList
                        });

                        let metadata: any = await metadataResponse.json();

                        if (metadata) {
                            const { hash } = metadata
                            console.log("metadataHash: ", hash);

                            //since we have the metadata, let's mint
                            const tx = await MintNewNFT(hash, accountInfo);
                            alert(tx);
                        }
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



    }












    useEffect(() => {
        console.log(allowMint)
    }, [allowMint])



    return (
        <>

            <TabList
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                w="100%"
            >


                <Box bg="black" pt={5} pb={10}>
                    <VStack spacing={4}>
                        <Button
                            h="50px"
                            color="#f38c00"
                            bg="whiteAlpha.300"
                            _hover={{
                                color: "black",
                                bg: "#f38c00",
                            }}
                            _active={{
                                color: "black",
                                bg: "#f38c00",
                            }}
                            leftIcon={<StarIcon />}
                            rightIcon={<ChevronDownIcon />}
                            onClick={handleToggleDropdown}
                        >
                            Mint NFT
                        </Button>
                        {showDropdown && (
                            <Stack
                                direction={["column", "column", "row"]}
                                bg="transparent" w="100%"
                                spacing={5}
                                justifyContent={"center"}
                                fontSize={"md"}
                                p={2}
                            >
                                <Button
                                    fontSize={"sm"}
                                    color="white"
                                    bg="#a5292a"
                                    _active={{
                                        color: "white",
                                        bg: "#a5292a",
                                    }}
                                    _hover={{
                                        color: "white",
                                        bg: "#a5292a",
                                    }}
                                    onClickCapture={() => handleToggleDrawer()}
                                >
                                    for Myself
                                </Button>
                                <Button
                                    fontSize={"sm"}
                                    onClick={() => {
                                        setSend(true)
                                        handleToggleDrawer();

                                    }}
                                >
                                    for Someone
                                </Button>
                            </Stack>
                        )}
                    </VStack>
                </Box>



                {tabItems.map((item, index) => (
                    <Tab
                        key={index}
                        py={5}
                        bg="rgba(211, 125, 40, 0.6)"
                        backdropBlur={"10px"}
                        borderBottom={"1px solid rgba(211, 125, 40, 0.6)"}
                        borderTop={"1px solid rgba(211, 125, 40, 0.6)"}
                        _selected={{ color: 'white', bg: 'brown' }}
                    >  <Box display="flex" flexDirection="column" alignItems="center">
                            <Icon as={item.icon} boxSize={6} />
                            <Text mt={2}>{item.label}</Text>
                        </Box></Tab>
                ))}







                <Button
                    h="44px"
                >Sign out</Button>







            </TabList >




            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={handleToggleDrawer}
                size="sm"

            >
                <DrawerOverlay>
                    <DrawerContent
                    // bgGradient="linear(to-r, #000000, #031031, #041041, #031871)"


                    >
                        <DrawerCloseButton mt="0" fontWeight={900} color="kBlack" />

                        <DrawerBody


                        >
                            <Divider opacity={0.2} />

                            <VStack pt={16} w="100%"
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

                                    <Box
                                        mt={12}>
                                        <Text pb={2} fontWeight={"bold"}>Holder: </Text>
                                        <Input
                                            h="50px"
                                            opacity={publisher.addr ? 1 : 0}
                                            className='hidden'
                                            type='text'
                                            value={publisher.addr}
                                            id='default-account'
                                            readOnly={true}
                                        />
                                    </Box>


                                    {send
                                        &&
                                        <Box
                                            mt={12}>
                                            <Text pb={2} fontWeight={"bold"}>Reciever: </Text>
                                            <Input
                                                h="50px"
                                                placeholder="Enter Reciever's address"
                                                opacity={publisher.addr ? 1 : 0}
                                                className='hidden'
                                                type='text'
                                                value={receiver}
                                                id='default-account'
                                                onChange={(e) => setReceiver(e.target.value)}
                                            />
                                        </Box>
                                    }




                                    <Box mt={12} w="100%">
                                        <HStack><Checkbox isChecked={isPrivate} onChange={handleCheckboxChange} colorScheme="blue" />
                                            <Text ml={2} fontWeight="bold">
                                                Private NFT <br />
                                                <span

                                                    style={{
                                                        fontSize: "12px",
                                                        display: isPrivate ? "flex" : "none"
                                                    }}
                                                >Images would be encrypted with your public</span>

                                            </Text>

                                        </HStack>

                                        <Button
                                            my={12}
                                            colorScheme="orange"
                                            h="50px"
                                            w="100%"
                                            isDisabled={!allowMint}
                                            // onClick={() => MintNewNFT("xxx")}
                                            onClick={send ? ShareEncryptedImage : encryptImage}
                                            isLoading={isEncrypting}
                                        >
                                            SUBMIT
                                        </Button>

                                    </Box>


                                </Box>

                            </VStack>

                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer >





        </>
    )
}