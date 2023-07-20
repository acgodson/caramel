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
    </>
  );

}
