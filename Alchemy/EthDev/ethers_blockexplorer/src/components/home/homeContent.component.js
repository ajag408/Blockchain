import React from "react";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { Input } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Button from "react-bootstrap/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Form from "react-bootstrap/Form";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  inner: {
    minWidth: 1050,
  },
  input: {
    flexGrow: 1,
    fontSize: "14px",
    lineHeight: "16px",
    letterSpacing: "-0.05px",
    width: "60%",
  },
  details: {
    display: "flex",
  },
  avatar: {
    marginLeft: "auto",
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  progress: {
    marginTop: theme.spacing(2),
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
  paper: {
    maxWidth: "80%",
    margin: "auto",
    marginLeft: "15%",
    marginRight: "5%",
    overflow: "hidden",
  },
  contentWrapper: {
    margin: "40px 16px",
  },
});

function Content(props) {
  const {
    classes,
    state,
    onSubmitMeta,
    onChangeContractAddress,
    onChangeTokenID,
    onChangeFloorAddress,
    onSubmitFloor,
    onChangeTransferAddress,
    onSubmitTransfers,
  } = props;
  const { blocknumber, contractAddress, tokenID, floorAddress, toAddress } =
    state;

  return (
    <div>
      <div className={classes.root}>
        Block Number: <a href={`/block/${blocknumber}`}>{blocknumber}</a>
      </div>
      <br></br>
      <br></br>

      <a href={`/account`}>Lookup an account balance</a>

      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div>
        <div className="form-wrapper">
          <h1>Look Up NFT Metadata</h1>
          <Form onSubmit={onSubmitMeta}>
            <Form.Group controlId="contractAddress">
              <Form.Label>Contract Address</Form.Label>
              <Form.Control
                required
                type="text"
                value={contractAddress}
                onChange={onChangeContractAddress}
              />
            </Form.Group>

            <Form.Group controlId="tokenID">
              <Form.Label>Token ID</Form.Label>
              <Form.Control
                required
                type="text"
                value={tokenID}
                onChange={onChangeTokenID}
              />
            </Form.Group>

            <Button variant="danger" size="lg" block="block" type="submit">
              Look Up
            </Button>
          </Form>
        </div>
      </div>

      <br></br>
      <br></br>

      <div>
        <div className="form-wrapper">
          <h1>NFT Floor Price</h1>
          <Form onSubmit={onSubmitFloor}>
            <Form.Group controlId="floorAddress">
              <Form.Label>Contract Address</Form.Label>
              <Form.Control
                required
                type="text"
                value={floorAddress}
                onChange={onChangeFloorAddress}
              />
            </Form.Group>
            <Button variant="danger" size="lg" block="block" type="submit">
              Look Up
            </Button>
          </Form>

          <br></br>
        </div>
      </div>

      <div>
        <div className="form-wrapper">
          <h1>2023 Transfers</h1>
          <Form onSubmit={onSubmitTransfers}>
            <Form.Group controlId="toAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                required
                type="text"
                value={toAddress}
                onChange={onChangeTransferAddress}
              />
            </Form.Group>
            <Button variant="danger" size="lg" block="block" type="submit">
              Look Up
            </Button>
          </Form>

          <br></br>
        </div>
      </div>
    </div>
  );
}

Content.propTypes = {
  classes: PropTypes.node.isRequired,
  state: PropTypes.node.isRequired,
  onSubmitMeta: PropTypes.node.isRequired,
  onSubmitFloor: PropTypes.node.isRequired,
  onChangeContractAddress: PropTypes.node.isRequired,
  onChangeTokenID: PropTypes.node.isRequired,
  onChangeFloorAddress: PropTypes.node.isRequired,
  onChangeTransferAddress: PropTypes.node.isRequired,
  onSubmitTransfers: PropTypes.node.isRequired,
};

export default withStyles(styles)(Content);
