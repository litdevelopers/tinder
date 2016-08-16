import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentError } from 'containers/Notification/selectors';

import styles from './styles.css';
import Text from 'components/Text';

class Dropdown extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.renderDropdown = this.renderDropdown.bind(this);
  }

  renderDropdown(currentError) {
    const errorString = currentError.toString().match(/400|network|trouble/i) ? currentError.toString() : currentError.response.data;
    return (
      <div className={styles.errorDropdown}>
        <div className={styles.dropdownContainer}>
          <Text type="dropdownText">{typeof (currentError) === 'string' ? currentError : errorString}</Text>
        </div>
      </div>
      );
  }

  render() {
    return this.props.currentError ? this.renderDropdown(this.props.currentError) : null;
  }
}

Dropdown.propTypes = {
  currentError: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
};

const mapStateToProps = createStructuredSelector({
  currentError: selectCurrentError(),
});


export default connect(mapStateToProps, null)(Dropdown);
