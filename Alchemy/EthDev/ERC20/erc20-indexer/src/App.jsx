import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';

const APIKEY = import.meta.env.REACT_APP_ETH_API;

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);

  async function getTokenBalance() {
    setIsLoading(true);
    setHasQueried(false);
    const config = {
      apiKey: APIKEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);

    try {
      const data = await alchemy.core.getTokenBalances(userAddress);

      setResults(data);

      const tokenDataPromises = [];

      for (let i = 0; i < data.tokenBalances.length; i++) {
        const tokenData = alchemy.core.getTokenMetadata(
          data.tokenBalances[i].contractAddress
        );
        tokenDataPromises.push(tokenData);
      }

      setTokenDataObjects(await Promise.all(tokenDataPromises));
      setIsLoading(false);
      setHasQueried(true);
    } catch(e){
      alert("Address invalid!");
      setUserAddress("")
    }
  }

  async function connectWallet() {
    if(window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.log('Error connecting...');
      }

    } else {
      alert('Wallet extension not detected');
    }
  }

  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => {setUserAddress(e.target.value); setWalletConnected(false)}}
          value = {userAddress}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />

        <Heading mt={42}>
          Or
        </Heading>

        {walletConnected ? 
          (
            <>
            <Button fontSize={20} mt={36} bgColor="green">
                  Connected with {userAddress}
              </Button>
              <Button fontSize={20} onClick = {() => {setWalletConnected(false)}} mt={36} bgColor="red">
                Disconnect Wallet
              </Button>
            </>
          ) 
        : (  <Button fontSize={20} onClick = {connectWallet} mt={36} bgColor="blue">
              Connect Wallet
            </Button>) 
        }



        <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {isLoading ? (
         <Spinner />
        ) : ("")}

        {hasQueried ? (
          <SimpleGrid w={'90vw'} columns={4} spacing={24}>
            {results.tokenBalances.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  bg="blue"
                  w={'20vw'}
                  key={e.id}
                >
                  <Box>
                    <b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
                  </Box>
                  <Box isTruncated>
                    <b>Balance:</b>&nbsp;
                    {Utils.formatUnits(
                      e.tokenBalance,
                      tokenDataObjects[i].decimals
                    )}
                  </Box>
                  <Image src={tokenDataObjects[i].logo} />
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : ("")}
      </Flex>
    </Box>
  );
}

export default App;
