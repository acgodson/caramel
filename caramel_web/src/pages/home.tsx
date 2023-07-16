
import { VStack, Box, Text, InputGroup, InputLeftElement, Input, Button, useToast, Divider, FormControl, FormLabel, Heading, Select, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Grid, Center, HStack, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { useContext, useEffect, useState } from 'react';
import { FaMoneyBillWave, FaGift, FaChartLine, FaUsers, FaMoneyCheckAlt } from "react-icons/fa";
import LoadingSpinner from '@/components/LoadingSpinner';
import TransactionContext, { useTransaction } from '@/contexts/TransactionContext';
import DashboardLayout from '@/layout/dashboardLayout';
import { getAuth } from 'firebase/auth';




export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const { user }: any = useTransaction()

    const auth = getAuth();
    const router = useRouter();

    //   Listen to UnAuthStateChange
    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (!authUser) {
                router.push('/signin');
            }
        });
    }, []);


    return (

        <>

            {user && (
                <DashboardLayout >
                    {/* main home content will fit here */}
                    <Box>

                        <TabPanels p={0}>
                            <TabPanel minH="375px" display={"flex"} flexDir={"column"} alignItems={"center"}>
                                1st
                            </TabPanel>
                            <TabPanel minH="375px">
                                2nd

                            </TabPanel>
                        </TabPanels>
                    </Box>
                </DashboardLayout >
            )}

            {!user && (
                <LoadingSpinner />
            )}

        </>

    )
}
