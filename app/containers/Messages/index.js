/*
 *
 * Messages
 *
 */

import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { connect } from 'react-redux';
import {
  selectPersonSelector,
  selectMatches,
  selectMatchDetailImages,
  selectMatchMessages,
  selectOptimisticUI,
  selectIsAllFetched,
  selectIsFetching,
  selectNewNotifications,
} from './selectors';

import {
  selectTargetGender,
} from 'containers/Dashboard/selectors';

import { createStructuredSelector } from 'reselect';

import {
  selectPersonAction,
  sendMessage,
  fetchMatchData,
  fetchMatchDataLocally,
  dumpAllInit,
} from './actions';

import MessengerCard from 'components/MessengerCard';
import DetailView from 'components/DetailView';
import Panel from 'components/Panel';
import MessageBubble from 'components/MessageBubble';
import MessengerInput from 'components/MessengerInput';
import Text from 'components/Text';
import Infinite from 'react-infinite';
import styles from './styles.css';


export class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.fetchHistoryLocally();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    this.props.dumpAll();
  }

  mapMatches() {
    return this.props.selectMatches && this.props.selectMatches.map((each) => <MessengerCard onClick={this.props.selectPerson} key={each._id} data={each} isNew={each.person && each.person._id && this.props.newMatches.indexOf(each.person._id) !== -1} />);
  }

  mapMessages() {
    return this.props.matchMessages.map((each) => {
      return (<MessageBubble key={each.payload._id} from={each.from} date={each.payload.sent_date}>{each.payload.message}</MessageBubble>);
    })
    .concat(this.props.selectOptimistic.map((each) => {
      if (each.id === this.props.currentPerson.id) {
        return <MessageBubble key={each.message} from="you">{each.message}</MessageBubble>;
      }
    }));
  }

  render() {
    return (
      <div className={styles.messagesContainer}>
        <div className={styles.messagePanel}>
          <Infinite
            className={styles.messagePanelContainer}
            containerHeight={800}
            elementHeight={100}
            itemsPerRow={1}
          >
          {this.props.selectMatches && this.mapMatches()}
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
                    {this.props.currentPerson && this.props.matchMessages ?
                      this.mapMessages() :
                      <Text
                        type="matchName"
                        style={{ justifyContent: 'center' }}
                      >
                          {this.props.selectMatches ? 'Pick a match to start a conversation!' : 'Find some new matches!'}
                      </Text>}
                </Infinite>
                <div className={styles.chatBoxPanel}>
                  <MessengerInput
                    sendTo={this.props.currentPerson && this.props.currentPerson._id}
                    sendMessage={this.props.onSendMessage}
                    disabled={!this.props.currentPerson}
                  />
                </div>
              </div>
              <div className={styles.profileBioPanel} >
                {this.props.currentPerson && this.props.matchDetailImages ?
                  <DetailView
                    data={this.props.currentPerson.person}
                    imageData={this.props.matchDetailImages}
                  /> :
                  <Panel hasMatches targetGender={this.props.targetGender} />}
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
    onSendMessage: (id, message) => dispatch(sendMessage(id, message)),
    fetchHistory: () => dispatch(fetchMatchData()),
    fetchHistoryLocally: () => dispatch(fetchMatchDataLocally()),
    dumpAll: () => dispatch(dumpAllInit()),
  };
}

const mapStateToProps = createStructuredSelector({
  currentPerson: selectPersonSelector(),
  selectMatches: selectMatches(),
  matchDetailImages: selectMatchDetailImages(),
  matchMessages: selectMatchMessages(),
  selectOptimistic: selectOptimisticUI(),
  isAllDataFetched: selectIsAllFetched(),
  isDataFetching: selectIsFetching(),
  newMatches: selectNewNotifications(),
  targetGender: selectTargetGender(),
});

Messages.propTypes = {
  selectMatches: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  selectPerson: PropTypes.func,
  currentPerson: PropTypes.object,
  matchMessages: PropTypes.array,
  matchDetailImages: PropTypes.array,
  onSendMessage: PropTypes.func,
  fetchHistory: PropTypes.func,
  selectOptimisticUI: PropTypes.func,
  selectOptimistic: PropTypes.array,
  isAllDataFetched: PropTypes.bool,
  isDataFetching: PropTypes.bool,
  fetchHistoryLocally: PropTypes.func,
  dumpAll: PropTypes.func,
  newMatches: PropTypes.array,
  targetGender: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
