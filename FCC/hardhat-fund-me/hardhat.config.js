require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.8",
    // networks: {
    //     goerli: {
    //         url: GOERLI_RPC_URL,
    //         accounts: [PRIVATE_KEY],
    //         chainId: 5,
    //     },
    //     localhost: {
    //         url: "http://127.0.0.1:8545/",
    //         //accounts: "Thanks hardhat"
    //         chainId: 31337,
    //     },
    // },
    // solidity: "0.8.7",
    // etherscan: {
    //     apiKey: ETHERSCAN_API_KEY,
    // },
    // gasReporter: {
    //     enabled: false,
    //     outputFile: "gas-report.txt",
    //     noColors: true,
    //     currency: "USD",
    //     coinmarketcap: COINMARKETCAP_API_KEY,
    //     token: "BNB",
    // },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}
