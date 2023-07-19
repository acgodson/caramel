
import { VStack, Box, Text, InputGroup, InputLeftElement, Input, Button, useToast, Divider, FormControl, FormLabel, Heading, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Grid, Center, HStack, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Spinner, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useRouter } from 'next/router';

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
    const walletAddresses = [
        "12345678901234",
        "23456789012345",
        "34567890123456",
        "45678901234567",
    ];

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

    useEffect(() => {
        console.log("publisher account", publisher)


    }, [publisher])



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
                                    w="100%"
                                    py={5}
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
                                                    <Text>Select Collection Address</Text>
                                                )}
                                            </MenuButton>
                                            <MenuList>
                                                {walletAddresses.map((address, index) => (
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
                                2nd

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
