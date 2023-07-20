
import { Box, Text, Button, TabPanel, TabPanels, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as fcl from "@onflow/fcl";
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTransaction } from '@/contexts/TransactionContext';
import DashboardLayout from '@/layout/dashboardLayout';
import { getAuth } from 'firebase/auth';
import MyCollection from '@/components/mycollection';
export default function Home() {
    const { user, publisher }: any = useTransaction()
    const [selectedAddress, setSelectedAddress] = useState("");
    const [contractAddresses, setcontractAddresses] = useState<any[] | null>(null)
    const auth = getAuth();
    const router = useRouter();

    const handleAddressSelect = (address: string) => {
        setSelectedAddress(address);
    };


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
            setcontractAddresses([keys])
        }

        return accountInfo
    }

    useEffect(() => {
        if (!contractAddresses) {
            getCollections()

        }
    },)



    return (

        <>

            {user || publisher.addr && (
                <DashboardLayout >
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
                                                {contractAddresses && contractAddresses.map((address, index) => (
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
