/**
*
* MessengerInput
*
*/

import React, { PropTypes } from 'react';
import styles from './styles.css';

class MessengerInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      inputField: '',
    };
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && this.state.inputField) {
      const id = this.props.sendTo;
      const message = this.state.inputField;
      this.props.sendMessage(id, message);
      this.setState({ inputField: '' });
    }
  }

  render() {
    return (
      <div className={styles.write}>
        <div className={styles.writeContainer}>
          <input value={this.state.inputField} placeholder={this.props.sendToName ? `Chat with ${this.props.sendToName}` : 'Chat with...'} onChange={(e) => { this.setState({ inputField: e.target.value }); }} onKeyPress={(e) => this.handleKeyPress(e)} contentEditable="true" className={styles.input} type="text" disabled={this.props.disabled} />
          <a className={styles.send} />
        </div>
      </div>
    );
  }
}

MessengerInput.propTypes = {
  sendTo: PropTypes.string,
  sendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  sendToName: PropTypes.string,
};

export default MessengerInput;
