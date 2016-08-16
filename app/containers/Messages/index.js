/*
 *
 * Messages
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  selectPersonSelector,
  selectMatchesSelector,
  selectMatchDetailImages,
  selectMatchMessages,
  selectOptimisticUI,
} from './selectors';
import styles from './styles.css';
import { selectDashboardHistory } from 'containers/Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { selectPersonAction, changeMessage, sendMessage } from './actions';

import MessengerCard from 'components/MessengerCard';
import DetailView from 'components/DetailView';
import MessageBubble from 'components/MessageBubble';
import MessengerInput from 'components/MessengerInput';
import Infinite from 'react-infinite';

export class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
  mapMatches() {
    return this.props.selectMatches && this.props.selectMatches.map((each) => <MessengerCard onClick={this.props.selectPerson} key={each._id} data={each} />);
  }

  mapMessages() {
    return this.props.matchMessages && this.props.matchMessages.map((each) => <MessageBubble key={each.payload._id} from={each.from}>{each.payload.message}</MessageBubble>)
      .concat(this.props.selectOptimistic.map((every) => <MessageBubble key={every} from="me">{every}</MessageBubble>));
  }

  render() {
    return (
      <div className={styles.messagesContainer}>
        <div className={styles.messagePanel}>
          <Infinite
            className={styles.messagePanelContainer}
            containerHeight={600}
            elementHeight={100}
            itemsPerRow={1}
          >
            {this.props.userHistory.matches && this.mapMatches()}
          </Infinite>
        </div>
        <div className={styles.messengerPanel}>
          <div className={styles.messengerPanelContainer}>
            <div className={styles.horizontalMessengerPanel}>
              <div className={styles.columnMessengerPanel}>
                <Infinite
                  displayBottomUpwards
                  className={styles.messagesPanel}
                  containerHeight={700}
                  elementHeight={50}
                  itemsPerRow={1}
                >
                    {this.props.currentPerson && this.props.matchMessages ? this.mapMessages() : <h1>test</h1>}
                </Infinite>
                <div className={styles.chatBoxPanel} >
                  <MessengerInput sendTo={this.props.currentPerson && this.props.currentPerson.id} sendMessage={this.props.onSendMessage} onChange={this.props.onChangeMessage}/>
                </div>
              </div>
              <div className={styles.profileBioPanel} >
                {this.props.currentPerson && this.props.matchDetailImages ?
                  <DetailView
                    data={this.props.currentPerson.person}
                    imageData={this.props.matchDetailImages}
                  /> : <h1>Test</h1>}
              </div>
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
    onChangeMessage: (event) => dispatch(changeMessage(event.target.value)),
    onSendMessage: (id, message) => dispatch(sendMessage(id, message)),
  };
}

const mapStateToProps = createStructuredSelector({
  userHistory: selectDashboardHistory(),
  currentPerson: selectPersonSelector(),
  selectMatches: selectMatchesSelector(),
  matchDetailImages: selectMatchDetailImages(),
  matchMessages: selectMatchMessages(),
  selectOptimistic: selectOptimisticUI(),
});

Messages.propTypes = {
  matchMessages: PropTypes.array,
  userHistory: PropTypes.object,
  selectPerson: PropTypes.func,
  currentPerson: PropTypes.object,
  selectMatches: PropTypes.array,
  matchDetailImages: PropTypes.array,
  onSendMessage: PropTypes.func,
  onChangeMessage: PropTypes.func,
  selectOptimisticUI: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
