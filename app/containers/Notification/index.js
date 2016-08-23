import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentError } from 'containers/Notification/selectors';
import { dismissNotification } from './actions';

import styles from './styles.css';
import Button from 'components/Button';
import Text from 'components/Text';

const dropdownStyleMapping = {
  error: {
    backgroundColor: '#e95f5c',
  },
  match: {
    backgroundColor: '#5cc3e8',
  },
};

class Dropdown extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.renderDropdown = this.renderDropdown.bind(this);
  }

  renderDropdown(currentNotification) {
    let notificationString;
    let type;
    if (currentNotification.toString().match(/400|network|trouble|timeout/i)) {
      notificationString = "We're having some trouble connecting to the server.";
      type = 'error';
    } else if (currentNotification.toString().match(/match/i)) {
      notificationString = currentNotification.toString();
      type = 'match';
    }
    return (
      <div className={styles.errorDropdown} style={dropdownStyleMapping[type]}>
        <div className={styles.dropdownContainer}>
          <Text type="dropdownText">{notificationString}</Text><Button onClick={this.props.dismissNotification}><Text type="dismiss">DISMISS</Text></Button>
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
  dismissNotification: React.PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  currentError: selectCurrentError(),
});

function mapDispatchToProps(dispatch) {
  return {
    dismissNotification: () => dispatch(dismissNotification()),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
