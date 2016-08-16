/**
*
* MessengerInput
*
*/

import React from 'react';
import styles from './styles.css';

function MessengerInput() {
  return (
    <div className={styles.write}>
      <input contentEditable="true" className={styles.input} type="text" />
      <a className={styles.send} />
    </div>
  );
}

export default MessengerInput;
