import { useTransaction } from "@/contexts/TransactionContext";
import { useEffect, useState } from "react";
import PhotoAlbum from "react-photo-album";
import * as fcl from "@onflow/fcl";
//@ts-ignore
import * as t from "@onflow/types";
import { ec as EC } from "elliptic";
import { get_userNFTs } from "@/cadence/scripts/get_files";
import { config } from "@onflow/fcl";
import { getLength } from "@/cadence/scripts/get_length";
import { SimpleGrid, Text, Box, Tooltip, useToast, Avatar } from "@chakra-ui/react";
import { decryptECC } from "./controllers/encryption";
import { bufferToDataURI } from "./controllers/helpers";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const photos = [
  { src: "https://via.placeholder.com/300/CCCCCC/FFFFFF?", width: 800, height: 600 },
  { src: "https://via.placeholder.com/500/CCCCCC/FFFFFF?", width: 1600, height: 900 },
  { src: "https://via.placeholder.com/400/CCCCCC/FFFFFF?", width: 1600, height: 900 },
  { src: "https://via.placeholder.com/500/CCCCCC/FFFFFF?", width: 1600, height: 900 },
];



export default function MyCollection() {
  const { publisher } = useTransaction();
  const [NFTs, setNFTs] = useState<any | null>("")
  const [count, setCount] = useState(0)
  const [images, setImages] = useState<any[] | null>(null)
  const [privTKey, setprivTKey] = useState<null | any>(null)
  const [reveal, setReveal] = useState(false)


  const toast = useToast()
  useEffect(() => {
    if (publisher.addr.length > 2 && !NFTs) {
      getuserNFTs()
    }
  },)


  const handleReveal = async () => {
    if (!images) {
      setReveal(!reveal)
      retrieveMeta();
    } else {
      hideImages()
      setReveal(!reveal)
    }

  }

  const getuserNFTs = async () => {
    if (!publisher) {
      return
    }
    console.log(publisher)
    const length = await fcl.send([
      fcl.script(get_userNFTs),
      fcl.args([
        fcl.arg(publisher.addr, t.Address)
      ]),
    ]).then((fcl.decode))

    if (length) {
      console.log(length)
      setCount(length)
      setNFTs(length)
    } else {
      setNFTs(0);
    }
  }


  const getRandomOrientation = () => {
    const orientations = ["landscape", "portrait"];
    return orientations[Math.floor(Math.random() * orientations.length)];
  };



  const ratios = [16 / 9, 3 / 4]


  const hideImages = () => {
    setImages(null)
  }

  const MetadataContent = async (userInput: string) => {
    if (!userInput) {
      console.log("no private key found for decryption")
    }
    for (let i = 0; i < NFTs.length; i++) {

      const url = `https://scarlet-warm-anaconda-739.mypinata.cloud/ipfs/${NFTs[i].collectionExternalURL}`;
      let imgs = [];
      if (url) {
        // const metadata = JSON.parse(url)
        // console.log(url)
        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error('Failed to fetch data from IPFS gateway');
          }
          const data: any = await response.text();
          if (data && data.length > 3) {
            const value = JSON.parse(data);
            const imageHash = JSON.parse(value.data).image;
            //let's fetch the image hash itself
            const url = `https://scarlet-warm-anaconda-739.mypinata.cloud/ipfs/${imageHash}`;
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Failed to fetch data from IPFS gateway');
            }
            const imageData: any = await response.text();
            const encryptData = JSON.parse(imageData).data;
            const encryptionData = JSON.parse(encryptData)
            const curve = new EC('p256');
            const publicKeyPoint = curve.keyFromPublic(encryptionData.hex, 'hex').getPublic();
            const newEncrytionObject = {
              ciphertext: new Uint8Array(encryptionData.ciphertext.data),
              iv: new Uint8Array(encryptionData.iv.data),
              authTag: new Uint8Array(encryptionData.authTag.data),
              ciphertextPubKey: publicKeyPoint
            }
            console.log(newEncrytionObject)

            const decryptedMsg = decryptECC(newEncrytionObject, privTKey);
            const bufferData = Buffer.from(decryptedMsg.toString(), 'base64');
            const _data: any = bufferToDataURI(bufferData);
            imgs.push(_data)
          }

          setImages(imgs)

        } catch (e) {
          console.log(e)
        }
      }

    }

  }

  const retrieveMeta = async () => {
    //return all metadata from ipfs from the project
    if (!privTKey) {
      const userInput = window.prompt("Paste private Key");
      if (!userInput) {
        setReveal(false)
        toast({
          title: "decryption failed",
          description: "no private key found",
          status: "error"
        });

        return;
      }
      setprivTKey(userInput);
    } else {
      await MetadataContent(privTKey)
    }
  }


  useEffect(() => {
    if (NFTs.length > 0 && privTKey) {
      // retrieveMeta()
    }
  }, [NFTs])

  useEffect(() => {

    if (privTKey && !images) {
      retrieveMeta()
    }
  }, [privTKey])




  return (
    <>
      {NFTs.length < 1 && (
        <PhotoAlbum
          spacing={10}
          layout="rows" photos={photos} />
      )}


      <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
        {NFTs && NFTs.length > 0 && NFTs.map((photo: any, i: number) => {
          const orientation = getRandomOrientation();
          const boxAspectRatio = orientation === "landscape" ? ratios[0] : 1 / ratios[1];

          return (
            <Box key={photo.id} position="relative" pb={`${(1 / boxAspectRatio) * 100}%`}>
              <Tooltip key={photo.id}

                label={
                  <Box fontSize={"xs"}>
                    <Box fontWeight="bold">title: {photo.name}</Box>
                    <Box>desc: {photo.description}</Box>
                    <Box>cc:  {photo.collectionName}</Box>
                  </Box>
                }

              >
                <Box
                  as="img"
                  src={privTKey && images && images.length > 0 ? images[i] : photo.thumbnail}
                  alt={photo.alt}
                  position="absolute"
                  top="0"
                  left="0"
                  backgroundPosition={"center"}
                  width="100%"
                  height="200px"
                  objectFit="cover"
                /></Tooltip>

              <Box position={"fixed"}
                right={0}
                pr={4} onClick={handleReveal}
              >
                <Avatar
                  cursor={"pointer"}
                  boxShadow={"lg"}
                  bg={reveal ? "red.700" : "gray"}
                  icon={
                    reveal ?
                      <FaEye /> : <FaEyeSlash />
                  }
                  mb={2}
                />
                <Text
                  fontSize={"xs"}
                  fontWeight={"bold"}
                  textAlign={"center"}
                  lineHeight={"13px"}
                  color="black">click to<br /> {reveal ? "hide" : "show"}</Text>
              </Box>
            </Box>

          );
        })}
      </SimpleGrid>
    </>

  );
}