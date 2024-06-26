import React from "react";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = (theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  //   content: {
  //     marginTop: theme.spacing(2),
  //   },
  //   icon: {
  //     marginRight: theme.spacing(1),
  //     color: theme.palette.text.secondary,
  //   },
  //   inner: {
  //     minWidth: 1050,
  //   },
  //   input: {
  //     flexGrow: 1,
  //     fontSize: '14px',
  //     lineHeight: '16px',
  //     letterSpacing: '-0.05px',
  //     width: '60%',

  //   },
  //   details: {
  //     display: 'flex',
  //   },
  //   avatar: {
  //     marginLeft: 'auto',
  //     height: 110,
  //     width: 100,
  //     flexShrink: 0,
  //     flexGrow: 0,
  //   },
  //   progress: {
  //     marginTop: theme.spacing(2),
  //   },
  //   uploadButton: {
  //     marginRight: theme.spacing(2),
  //   },
  //   paper: {
  //     maxWidth: '80%',
  //     margin: 'auto',
  //     marginLeft: '15%',
  //     marginRight: '5%',
  //     overflow: 'hidden',
  //   },
  //   contentWrapper: {
  //     margin: '40px 16px',
  //   },
});

function Content(props) {
  const { classes, state } = props;
  const { blocknumber, blockinfo, transactions } = state;

  return (
    <div>
      <div>
        <b>Blockinfo for block {blocknumber}</b>

        <p>hash: {blockinfo.hash}</p>
      </div>

      <br></br>
      <br></br>

      <div>
        <b>Transactions:</b>
        {/* {state.transactions.length} */}
        {transactions.map((transaction, i) => (
          <p>
            <a href={`/transaction/${transaction.hash}`}>{transaction.hash}</a>
          </p>
        ))}
      </div>
    </div>
  );
}

Content.propTypes = {
  classes: PropTypes.node.isRequired,
  state: PropTypes.node.isRequired,
};

export default withStyles(styles)(Content);
