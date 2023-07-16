import { Box, Spinner } from '@chakra-ui/react';
import Home from './home'
import { useEffect, useState } from 'react';



export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <>

      {isLoading && (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
            background: '#f5f5f5',
          }}
        >
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Box>
      )}


      {!isLoading && (

        <Home />
      )}






      {/* <Box
        bg="blackAlpha.900"
        w="100%"
        top={0}
        zIndex="tooltip"
        position={"fixed"}
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent={"center"}
        h={"100vh"}>
        <Box
          h="auto"
          w="300px"
        >
          <Lottie animationData={pause} loop={true} />
        </Box>

      </Box> */}

    </>
  );

}
