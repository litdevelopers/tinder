/*
 *
 * Messages
 *
 */

import React, { PropTypes } from 'react';
import ReactDom from 'react-dom';
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
import conversationPlaceholder from 'static/conversation.png';
import styles from './styles.css';

function parseMessageLength(messageLength) {
  return ((Math.ceil(messageLength / 63)) * 50) + 8 + (messageLength % 63 === 0 ? 50 : 0);
}

export class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      reRender: true,
    };
  }

  componentWillMount() {
    this.props.fetchHistoryLocally();
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

  renderPlaceholderMessage() {
    if (this.props.isDataFetching) {
      return "Hold on, we're syncing your matches.";
    }
    if (this.props.selectMatches) {
      return 'Select a person to start chatting!';
    }
    return 'Visit your recommendations to find a new match.';
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
              <div className={styles.columnMessengerPanel} id="messengerPanelContainer">
                {this.props.currentPerson && this.props.matchMessages ?
                  <Infinite
                    className={styles.messagesPanel}
                    containerHeight={700}
                    elementHeight={(this.props.currentPerson && this.props.matchMessages.map((each) => parseMessageLength(each.payload.message.length))
                      .concat(this.props.selectOptimistic.map((each) => parseMessageLength(each.message.length))))}
                    itemsPerRow={1}
                    displayBottomUpwards
                  >
                    {this.mapMessages()}
                  </Infinite> :
                  <div className={styles.messagesPanel} style={{ justifyContent: 'flex-end' }}>
                    <Text
                      type="matchName"
                      style={{ justifyContent: 'center', flexDirection: 'column' }}
                    >
                      <img src={conversationPlaceholder} className={styles.conversationPlaceholderImage} role="presentation" />
                      {this.renderPlaceholderMessage()}
                    </Text>
                  </div>
                }
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
