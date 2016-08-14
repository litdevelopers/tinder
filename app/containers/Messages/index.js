/*
 *
 * Messages
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectPersonSelector, selectMatchesSelector } from './selectors';
import styles from './styles.css';
import { selectDashboardHistory } from 'containers/Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { selectPersonAction } from './actions';

import MatchMessengerBlock from 'components/MatchMessengerBlock';
import DetailView from 'components/DetailView';

export class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
  mapMatches() {
    return this.props.selectMatches && this.props.selectMatches.map((each) => <MatchMessengerBlock onClick={this.props.selectPerson} key={each._id} data={each} />);
  }

  render() {
    return (
      <div className={styles.messagesContainer}>
        <div className={styles.messagePanel}>
          <div className={styles.messagePanelContainenr}>
            {this.props.userHistory.matches && this.mapMatches()}
          </div>
        </div>
        <div className={styles.messengerPanel}>
          <div className={styles.messengerPanelContainer}>
            <div className={styles.horizontalMessengerPanel}>
              <div className={styles.messagesPanel} >
                <h1>This is messages</h1>
              </div>
              <div className={styles.profileBioPanel} >
                <h1>This is profile bio</h1>
              </div>
            </div>
            <div className={styles.chatBoxPanel} >
              <h1>This is chatBoxPanel</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectPerson: (id) => dispatch(selectPersonAction(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  userHistory: selectDashboardHistory(),
  currentPerson: selectPersonSelector(),
  selectMatches: selectMatchesSelector(),
});

Messages.propTypes = {
  userHistory: PropTypes.object,
  currentPerson: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
