import React, { Component } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Content from "./transactionContent.component";

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

export default class Transaction extends Component {
  constructor(props) {
    super(props);

    // Setting up state
    this.state = {
      transaction: null,
      receipt: {},
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    this.setState(
      {
        transaction: params.transactionid,
      },
      () => {
        alchemy.core
          .getTransactionReceipt(this.state.transaction)
          .then((res3) => {
            this.setState({
              receipt: res3,
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
