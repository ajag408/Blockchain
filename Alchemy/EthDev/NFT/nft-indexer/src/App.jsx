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
import { Alchemy, Network } from 'alchemy-sdk';
import { useState } from 'react';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);

  async function getNFTsForOwner() {
    setIsLoading(true);
    setHasQueried(false);
    const config = {
      apiKey: import.meta.env.REACT_APP_ETH_API,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);

    try{
      const data = await alchemy.nft.getNftsForOwner(userAddress);
      // console.log("data: ", data);
      setResults(data);


      //old way with serial metadata requests

        // const tokenDataPromises = [];

        // for (let i = 0; i < data.ownedNfts.length; i++) {
        //   const tokenData = alchemy.nft.getNftMetadata(
        //     data.ownedNfts[i].contract.address,
        //     data.ownedNfts[i].tokenId
        //   );
        //   tokenDataPromises.push(tokenData);
        // }

          // // console.log("tokenDataObjects: ", tokenDataObjects.length)
          // await Promise.all(tokenDataPromises).then((values) => {
          //   setTokenDataObjects(values);
          //   // console.log("WWWWWTTTTTTTFFFFFF")
          //   // for(var i = 0; i<values.length; i++){
          //   //   console.log('name: ', values[i].title)
          //   //   console.log('raw meta: ', values[i].rawMetadata)
          //   // }
          //   setIsLoading(false);
          //   setHasQueried(true);
          // });

      const tokens = [];

      for (let i = 0; i < data.ownedNfts.length; i++) {
        const tokenData = {
          contractAddress: data.ownedNfts[i].contract.address,
          tokenId: data.ownedNfts[i].tokenId
        };
        tokens.push(tokenData);
      }

      let nfts = await alchemy.nft.getNftMetadataBatch(tokens);

      setTokenDataObjects(nfts);
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
            NFT Indexer 🖼
          </Heading>
          <Text>
            Plug in an address and this website will return all of its NFTs!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
        <Input
          onChange={(e) => {setUserAddress(e.target.value); setWalletConnected(false)}}
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

        <Button fontSize={20} onClick={getNFTsForOwner} mt={36} bgColor="blue">
          Fetch NFTs
        </Button>

        <Heading my={36}>Here are your NFTs:</Heading>

        {isLoading ? (
         <Spinner />
        ) : ("")}

        {hasQueried ? (
          <SimpleGrid w={'90vw'} columns={4} spacing={24}>
            {results.ownedNfts.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  bg="blue"
                  w={'20vw'}
                  key={e.id}
                >
                  <Box>
                    <b>Name:</b>{' '}
                    {tokenDataObjects[i].title?.length === 0
                      ? 'No Name'
                      : tokenDataObjects[i].title}
                  </Box>
                  <Image
                    src={
                      tokenDataObjects[i].rawMetadata?.image ??
                      'https://via.placeholder.com/200'
                    }
                    fallbackSrc = 'https://via.placeholder.com/200'
                    alt={'No Image'}
                  />
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          ''
        )}
      </Flex>
    </Box>
  );
}

export default App;
