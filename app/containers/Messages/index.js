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
} from './selectors';
import styles from './styles.css';
import { createStructuredSelector } from 'reselect';
import { selectPersonAction, changeMessage, sendMessage, fetchMatchData, fetchMatchDataLocally, dumpAllInit } from './actions';

import MessengerCard from 'components/MessengerCard';
import DetailView from 'components/DetailView';
import MessageBubble from 'components/MessageBubble';
import MessengerInput from 'components/MessengerInput';
import Infinite from 'react-infinite';

export class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.fetchHistoryLocally();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    // this.props.dumpAll();
    // No need anymore, we dump when we get it.
  }

  mapMatches() {
    return this.props.selectMatches && this.props.selectMatches.map((each) => <MessengerCard onClick={this.props.selectPerson} key={each._id} data={each} />);
  }

  mapMessages() {
    return this.props.matchMessages && this.props.matchMessages.map((each, index, messages) => <MessageBubble key={each.payload._id} from={each.from}>{each.payload.message}</MessageBubble>)
    .concat(this.props.selectOptimistic.map((every) => {
      if (every.id === this.props.currentPerson.id) {
        return <MessageBubble key={every.message} from="you">{every.message}</MessageBubble>;
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
                    {this.props.currentPerson && this.props.matchMessages ? this.mapMessages() : <h1>test</h1>}
                </Infinite>
                <div className={styles.chatBoxPanel} >
                  {this.props.currentPerson ?
                    <MessengerInput
                      sendTo={this.props.currentPerson && this.props.currentPerson.id}
                      sendMessage={this.props.onSendMessage}
                      onChange={this.props.onChangeMessage}
                    /> :
                    <h1>Test</h1>}
                </div>
              </div>
              <div className={styles.profileBioPanel} >
                {this.props.currentPerson && this.props.matchDetailImages ?
                  <DetailView
                    data={this.props.currentPerson.person}
                    imageData={this.props.matchDetailImages}
                  /> :
                  <h1>Test</h1>}
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
  onChangeMessage: PropTypes.func,
  fetchHistory: PropTypes.func,
  selectOptimisticUI: PropTypes.func,
  selectOptimistic: PropTypes.array,
  isAllDataFetched: PropTypes.bool,
  isDataFetching: PropTypes.bool,
  fetchHistoryLocally: PropTypes.func,
  dumpAll: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
