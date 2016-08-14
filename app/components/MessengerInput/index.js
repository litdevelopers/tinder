/**
*
* MessengerInput
*
*/

import React from 'react';

import styles from './styles.css';

class MessengerInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.write}>
        <input contentEditable="true" className={styles.input} type="text"/>
        <a href="javascript:;" className={styles.send}></a>
      </div>
    );
  }
}

export default MessengerInput;
