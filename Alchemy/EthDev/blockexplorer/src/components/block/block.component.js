import React, { Component } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Content from "./blockContent.component";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

export default class Block extends Component {
  constructor(props) {
    super(props);

    // Setting up state
    this.state = {
      blocknumber: null,
      blockinfo: {},
      transactions: [],
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    this.setState(
      {
        blocknumber: parseInt(params.blockid),
      },
      () => {
        alchemy.core
          .getBlockWithTransactions(this.state.blocknumber)
          .then((res2) => {
            console.log("thash:", typeof res2.transactions[0].hash);
            this.setState({
              blockinfo: res2,
              transactions: res2.transactions.slice(0, 10),
            });
          });
      }
    );
  }

  render() {
    return (
      <div>
        <Content state={this.state} />
      </div>
    );
  }
}
