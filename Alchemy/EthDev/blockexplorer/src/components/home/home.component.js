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

    // Setting up state
    this.state = {
      blocknumber: null,
      contractAddress: "",
      tokenID: "",
      floorAddress: "",
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

  render() {
    return (
      <div>
        <Content
          onSubmitMeta={this.onSubmitMeta}
          onSubmitFloor={this.onSubmitFloor}
          onChangeContractAddress={this.onChangeContractAddress}
          onChangeFloorAddress={this.onChangeFloorAddress}
          onChangeTokenID={this.onChangeTokenID}
          state={this.state}
        />
      </div>
    );
  }
}
