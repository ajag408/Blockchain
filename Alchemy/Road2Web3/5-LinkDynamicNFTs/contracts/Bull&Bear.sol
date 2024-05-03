// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Chainlink Imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// This import includes functions from both ./KeeperBase.sol and
// ./interfaces/KeeperCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";

import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";


// Dev imports. This only works on a local dev network
// and will not work on any test or main livenets.
import "hardhat/console.sol";

contract BullBear is ERC721, ERC721Enumerable, ERC721URIStorage, KeeperCompatibleInterface, VRFConsumerBaseV2Plus {
    
    error OwnableUnauthorizedAccount(address account);

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    AggregatorV3Interface public pricefeed;

    // address public owner;

    uint public interval;
    uint public lastTimeStamp;

    int256 public currentPrice;
    // IPFS URIs for the dynamic nft graphics/metadata.
    // NOTE: These connect to my IPFS Companion node.
    // You should upload the contents of the /ipfs folder to your own node for development.
    string[] bullUrisIpfs = [
        "https://ipfs.io/ipfs/QmRXyfi3oNZCubDxiVFre3kLZ8XeGt6pQsnAQRZ7akhSNs?filename=gamer_bull.json",
        "https://ipfs.io/ipfs/QmRJVFeMrtYS2CUVUM2cHJpBV5aX2xurpnsfZxLTTQbiD3?filename=party_bull.json",
        "https://ipfs.io/ipfs/QmdcURmN1kEEtKgnbkVJJ8hrmsSWHpZvLkRgsKKoiWvW9g?filename=simple_bull.json"
    ];
    string[] bearUrisIpfs = [
        "https://ipfs.io/ipfs/Qmdx9Hx7FCDZGExyjLR6vYcnutUR8KhBZBnZfAPHiUommN?filename=beanie_bear.json",
        "https://ipfs.io/ipfs/QmTVLyTSuiKGUEmb88BgXG3qNC8YgpHZiFbjHrXKH3QHEu?filename=coolio_bear.json",
        "https://ipfs.io/ipfs/QmbKhBXVWmwrYsTPFYfroR2N7NAekAMxHUVg2CWks7i9qj?filename=simple_bear.json"
    ];

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }


    IVRFCoordinatorV2Plus public COORDINATOR;

    // Your subscription ID.
    uint256 public s_subscriptionId;


    uint256[] public s_randomWords;
    uint256 public s_requestId;

        // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 500000;

    enum MarketTrend{BULL, BEAR} // Create Enum
    MarketTrend public currentMarketTrend = MarketTrend.BULL; 

    event TokensUpdated(string marketTrend);


    constructor(uint updateInterval, address _priceFeed, address _coordinator) 
    
        ERC721("Bull&Bear", "BBTK") 
        VRFConsumerBaseV2Plus(_coordinator)
        // ConfirmedOwner(msg.sender)
    {
        // owner = msg.sender;

        interval = updateInterval;
        lastTimeStamp = block.timestamp;

        pricefeed = AggregatorV3Interface(_priceFeed);

        currentPrice = getLatestPrice();

        COORDINATOR = IVRFCoordinatorV2Plus(
            _coordinator
        );
    
    }

    // modifier onlyOwner() override{
    //     if(owner != msg.sender){
    //         revert OwnableUnauthorizedAccount(msg.sender);
    //     }
    //     _;
    // }

    function safeMint(address to) public {
        // Current counter value will be the minted token's token ID.
        uint256 tokenId = _tokenIdCounter.current();

        // Increment it so next time it's correct when we call .current()
        _tokenIdCounter.increment();

        // Mint the token
        _safeMint(to, tokenId);

        // Default to a bull NFT
        string memory defaultUri = bullUrisIpfs[0];
        _setTokenURI(tokenId, defaultUri);

        console.log(
            "DONE!!! minted token ",
            tokenId,
            " and assigned token url: ",
            defaultUri
        );
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /*performData */) {
         upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata /* performData */ ) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval ) {
            lastTimeStamp = block.timestamp;         
            int latestPrice =  getLatestPrice();
        
            if (latestPrice == currentPrice) {
                console.log("NO CHANGE -> returning!");
                return;
            }

            if (latestPrice < currentPrice) {
                // bear
                console.log("ITS BEAR TIME");
                currentMarketTrend = MarketTrend.BEAR;

            } else {
                // bull
                console.log("ITS BULL TIME");
                currentMarketTrend = MarketTrend.BULL;
            }
            // Initiate the VRF calls to get a random number (word)
            // that will then be used to to choose one of the URIs 
            // that gets applied to all minted tokens.
            requestRandomnessForNFTUris();

            // update currentPrice
            currentPrice = latestPrice;
        } else {
            console.log(
                " INTERVAL NOT UP!"
            );
            return;
        }

       
    }

    function requestRandomnessForNFTUris() internal {
        require(s_subscriptionId != 0, "Subscription ID not set"); 

        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
            // keyHash,
            // s_subscriptionId, // See https://vrf.chain.link/
            // 3, //minimum confirmations before response
            // callbackGasLimit,
            // 1 // `numWords` : number of random values we want. Max number for rinkeby is 500 (https://docs.chain.link/docs/vrf-contracts/#rinkeby-testnet)
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: 3,
                callbackGasLimit: callbackGasLimit,
                numWords: 1,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        console.log("Request ID: ", s_requestId);

        // requestId looks like uint256: 80023009725525451140349768621743705773526822376835636211719588211198618496446
    }

    // // Assumes the subscription is funded sufficiently.
    // function requestRandomWords()
    //     internal
    //     onlyOwner
    //     returns (uint256 requestId)
    // {
    //     // Will revert if subscription is not set and funded.
    //     requestId = COORDINATOR.requestRandomWords(
    //         keyHash,
    //         s_subscriptionId,
    //         requestConfirmations,
    //         callbackGasLimit,
    //         numWords
    //     );
    //     s_requests[requestId] = RequestStatus({
    //         randomWords: new uint256[](0),
    //         exists: true,
    //         fulfilled: false
    //     });
    //     requestIds.push(requestId);
    //     lastRequestId = requestId;
    //     emit RequestSent(requestId, numWords);
    //     return requestId;
    // }

    // This is the callback that the VRF coordinator sends the 
    // random values to.
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
        // randomWords looks like this uint256: 68187645017388103597074813724954069904348581739269924188458647203960383435815

        console.log("...Fulfilling random Words");
        
        string[] memory urisForTrend = currentMarketTrend == MarketTrend.BULL ? bullUrisIpfs : bearUrisIpfs;
        uint256 idx = randomWords[0] % urisForTrend.length; // use modulo to choose a random index.


        for (uint i = 0; i < _tokenIdCounter.current() ; i++) {
            _setTokenURI(i, urisForTrend[idx]);
        } 

        string memory trend = currentMarketTrend == MarketTrend.BULL ? "bullish" : "bearish";
        
        emit TokensUpdated(trend);
    }


    //Helpers
    function getLatestPrice() public view returns (int256) {
         (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = pricefeed.latestRoundData();

        return price; //  example price returned 3034715771688
    }

    function updateAllTokenUris(string memory trend) internal {

        
        // if (compareStrings("bear", trend)) {
        //     console.log(" UPDATING TOKEN URIS WITH ", "bear", trend);
        //     for (uint i = 0; i < _tokenIdCounter.current() ; i++) {
        //         _setTokenURI(i, bearUrisIpfs[0]);
        //     } 
            
        // } else {     
        //     console.log(" UPDATING TOKEN URIS WITH ", "bull", trend);

        //     for (uint i = 0; i < _tokenIdCounter.current() ; i++) {
        //         _setTokenURI(i, bullUrisIpfs[0]);
        //     }  
        // }   
        // emit TokensUpdated(trend);
    }

    function setPriceFeed(address newFeed) public onlyOwner {
        pricefeed = AggregatorV3Interface(newFeed);
    }
    function setInterval(uint256 newInterval) public onlyOwner {
        interval = newInterval;
    }
    
    // For VRF Subscription Manager
    function setSubscriptionId(uint256 _id) public onlyOwner {
        s_subscriptionId = _id;
    }


    function setCallbackGasLimit(uint32 maxGas) public onlyOwner {
        callbackGasLimit = maxGas;
    }

    function setVrfCoodinator(address _address) public onlyOwner {
        COORDINATOR = IVRFCoordinatorV2Plus(
            _address
        );
    }
    
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    // The following functions are overrides required by Solidity.
    function _increaseBalance(address account, uint128 value) internal virtual override (ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override (ERC721, ERC721Enumerable) returns (address){
        super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view  virtual override (ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool){
        super.supportsInterface(interfaceId);
    }
    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 firstTokenId,
    //     uint256 batchSize
    // ) internal virtual override (ERC721, ERC721Enumerable, ERC721Pausable) {
    //     super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    // }

    // function _burn(uint256 tokenId)
    //     internal 
    //     override(ERC721, ERC721URIStorage)
    // {
    //     super._burn(tokenId);
    // }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}