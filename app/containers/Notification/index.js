import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectGlobalErrors } from 'containers/Dashboard/selectors';

import styles from './styles.css';
import Text from 'components/Text';

class Dropdown extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.renderDropdown = this.renderDropdown.bind(this);
  }

  renderDropdown() {
    return (
      <div className={styles.errorDropdown}>
        <div className={styles.dropdownContainer}>
          <Text type="dropdownText">Nah.</Text>
        </div>
      </div>
      );
  }

  render() {
    return this.renderDropdown();
  }
}

Dropdown.propTypes = {
  text: React.PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  globalErrors: selectGlobalErrors(),
});


export default connect(mapStateToProps, null)(Dropdown);
