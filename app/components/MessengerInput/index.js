/**
*
* MessengerInput
*
*/

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCurrentMessage,
} from 'containers/Messages/selectors';
import styles from './styles.css';

class MessengerInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  handleKeyPress(e) {
    if (e.key === 'Enter' && this.props.currentMessage) {
      const id = this.props.sendTo;
      const message = this.props.currentMessage;
      this.props.sendMessage(id, message);
    }
  }

  render() {
    return (
      <div className={styles.write}>
        <input value={this.props.currentMessage} onChange={this.props.onChange} onKeyPress={(e) => this.handleKeyPress(e)} contentEditable="true" className={styles.input} type="text" />
        <a className={styles.send} />
      </div>
    );
  }
}

MessengerInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  sendTo: PropTypes.string,
  currentMessage: PropTypes.string,
  sendMessage: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentMessage: selectCurrentMessage(),
});

export default connect(mapStateToProps, null)(MessengerInput);
