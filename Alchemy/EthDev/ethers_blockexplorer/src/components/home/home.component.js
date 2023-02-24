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

    this.onChangeContractAddress = this.onChangeContractAddress.bind(this);
    this.onChangeTokenID = this.onChangeTokenID.bind(this);
    this.onSubmitMeta = this.onSubmitMeta.bind(this);

    this.onChangeFloorAddress = this.onChangeFloorAddress.bind(this);
    this.onSubmitFloor = this.onSubmitFloor.bind(this);
    this.onChangeTransferAddress = this.onChangeTransferAddress.bind(this);
    this.onSubmitTransfers = this.onSubmitTransfers.bind(this);

    // Setting up state
    this.state = {
      blocknumber: null,
      contractAddress: "",
      tokenID: "",
      floorAddress: "",
      toAddress: "",
    };

    alchemy.core.getBlockNumber().then((res) => {
      this.setState({
        blocknumber: res,
      });
    });
  }

  onChangeContractAddress(e) {
    this.setState({ contractAddress: e.target.value });
  }

  onChangeTokenID(e) {
    this.setState({ tokenID: e.target.value });
  }

  onChangeFloorAddress(e) {
    this.setState({ floorAddress: e.target.value });
  }

  onChangeTransferAddress(e) {
    this.setState({ toAddress: e.target.value });
  }

  onSubmitMeta(e) {
    e.preventDefault();
    const { contractAddress, tokenID } = this.state;

    alchemy.nft.getNftMetadata(contractAddress, tokenID).then(console.log);
    // const { signinStudent: signin } = this.props;
    // const studentObject = {
    //   email,
    //   password,
    // };
    // signin(studentObject);
    // axios.post('http://localhost:4000/students/login', studentObject)
    // .then(res => {
    //     if(res.data.isStudent){
    //       window.location.href = "/student/landing";
    //     } else {
    //       alert(res.data);
    //     }
    //   }
    // );
  }

  onSubmitFloor(e) {
    e.preventDefault();
    const { floorAddress } = this.state;
    alchemy.nft.getFloorPrice(floorAddress).then(console.log);
  }

  onSubmitTransfers(e) {
    e.preventDefault();
    const { toAddress } = this.state;
    alchemy.core
      .getAssetTransfers({
        toAddress: toAddress,
        withMetadata: true,
        category: ["external"],
      })
      .then((res) => {
        // console.log("res: ", res);
        var transfers = res["transfers"];
        // console.log("t type: ", typeof transfers);
        var filteredTransfers = transfers.filter(function (t) {
          return (
            new Date(t["metadata"]["blockTimestamp"]).getFullYear() ==
            new Date().getFullYear()
          );
        });

        console.log("Transfers to this address this year: ", filteredTransfers);
      });
  }

  render() {
    return (
      <div>
        <Content
          onSubmitMeta={this.onSubmitMeta}
          onSubmitFloor={this.onSubmitFloor}
          onChangeContractAddress={this.onChangeContractAddress}
          onChangeFloorAddress={this.onChangeFloorAddress}
          onChangeTransferAddress={this.onChangeTransferAddress}
          onChangeTokenID={this.onChangeTokenID}
          onSubmitTransfers={this.onSubmitTransfers}
          state={this.state}
        />
      </div>
    );
  }
}
