
import { VStack, Box, Text, InputGroup, InputLeftElement, Input, Button, useToast, Divider, FormControl, FormLabel, Heading, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Grid, Center, HStack, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Spinner, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as fcl from "@onflow/fcl";
import { useContext, useEffect, useState } from 'react';
import { FaMoneyBillWave, FaGift, FaChartLine, FaUsers, FaMoneyCheckAlt } from "react-icons/fa";
import LoadingSpinner from '@/components/LoadingSpinner';
import TransactionContext, { useTransaction } from '@/contexts/TransactionContext';
import DashboardLayout from '@/layout/dashboardLayout';
import { getAuth } from 'firebase/auth';
import MyCollection from '@/components/mycollection';
import { Layout } from 'react-grid-layout';




export default function Home() {
    const { user, publisher }: any = useTransaction()
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [walletAddresses, setWalletAddresses] = useState<any[] | null>(null)


    const handleAddressSelect = (address: string) => {
        setSelectedAddress(address);
    };

    const auth = getAuth();
    const router = useRouter();

    //   Listen to UnAuthStateChange
    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (!authUser && !publisher.addr) {
                router.push('/signin');
            }
        });
    }, []);

    async function getCollections() {
        const accountInfo = await fcl
            //@ts-ignore
            .send([fcl.getAccount("df37aa208c406ec8")])
            .then(fcl.decode);
        if (accountInfo) {
            const keys = Object.keys(accountInfo.contracts)[2]
            setWalletAddresses([keys])
        }

        return accountInfo
    }

    useEffect(() => {
        if (!walletAddresses) {
            getCollections()

        }
    },)



    return (

        <>

            {user || publisher.addr && (
                <DashboardLayout >
                    {/* main home content will fit here */}
                    <Box w="100%">

                        <TabPanels p={0}>
                            <TabPanel
                                w="100%"
                                minH="100vh" display={"flex"} flexDir={"column"} alignItems={"center"}>
                                <Box position={"fixed"}
                                    mt="-18px"
                                    w="80%"

                                    py={5}
                                    zIndex={"tooltip"}
                                    bg={"whiteAlpha.800"}
                                    backdropBlur={"10px"}
                                    display={"flex"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    <Box>
                                        <Menu>
                                            <MenuButton as={Button} colorScheme="yellow" variant="outline">
                                                {selectedAddress ? (
                                                    <Text>{selectedAddress}</Text>
                                                ) : (
                                                    <Text>Collection Contract</Text>
                                                )}
                                            </MenuButton>
                                            <MenuList>
                                                {walletAddresses && walletAddresses.map((address, index) => (
                                                    <MenuItem key={index} onClick={() => handleAddressSelect(address)}>
                                                        {address}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                </Box>

                                <Box w="100%" mt="100px" h="100vh">
                                    <MyCollection />
                                </Box>


                            </TabPanel>
                            <TabPanel minH="375px">


                            </TabPanel>
                        </TabPanels>
                    </Box>
                </DashboardLayout >
            )}

            {!user && !publisher.addr && (
                <LoadingSpinner />
            )}

        </>

    )
}
