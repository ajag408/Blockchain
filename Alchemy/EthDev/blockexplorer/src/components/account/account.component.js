import React, { Component } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Content from "./accountContent.component";
import { ethers } from "ethers";
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
// const ethers = require("ethers");

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.onChangeSearch = this.onChangeSearch.bind(this);

    // Setting up state
    this.state = {
      search: null,
      balance: null,
    };
  }

  onChangeSearch(e) {
    this.setState({ search: e.target.value }, () => {
      // console.log(this.state.search);
      const { search } = this.state;
      if (search.length > 0) {
        alchemy.core
          .getBalance(search)
          .then((res) => {
            console.log("hello");
            console.log("res: ", Number(res));
            console.log("ethVal: ", ethers.formatEther(Number(res)));
            this.setState({
              balance: Number(res),
            });
          })
          .catch((error) => {
            this.setState({
              balance: null,
            });
          });
      } else {
        this.setState({
          balance: null,
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Content state={this.state} onChangeSearch={this.onChangeSearch} />
      </div>
    );
  }
}
