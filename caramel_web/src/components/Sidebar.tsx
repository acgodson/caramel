import { Tabs, Box, Text, TabList, Tab, TabPanels, TabPanel, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, useDisclosure, VStack, useToast, IconButton, Heading, HStack, Icon, background } from "@chakra-ui/react";

import Lottie from "lottie-react";
import success from "@/components/success.json"
import { FaBook, FaShareAlt, FaUsers, FaCog, FaDownload } from "react-icons/fa";




export default function SideBarTab() {

    const tabItems = [
        { icon: FaBook, label: "Library" },
        { icon: FaDownload, label: "Shared" },
        { icon: FaUsers, label: "People" },
        { icon: FaCog, label: "Settings" },
    ];



    return (
        <>

            <TabList
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                w="100%"
            >
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

            </TabList>





        </>
    )
}