import React, { Component } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Content from "./homeContent.component";

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

export default class Home extends Component {
  constructor(props) {
    super(props);

    // Setting up state
    this.state = {
      blocknumber: null,
    };

    alchemy.core.getBlockNumber().then((res) => {
      this.setState({
        blocknumber: res,
      });
    });
  }

  render() {
    return (
      <div>
        <Content state={this.state} />
      </div>
    );
  }
}
