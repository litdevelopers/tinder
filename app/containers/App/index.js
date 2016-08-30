/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import Navigation from 'containers/Navigation';
import Helmet from 'react-helmet';
import styles from './styles.css';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNewNotifications } from 'containers/Messages/selectors';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.container}>
        <Helmet
          defaultTitle={this.props.newNotifications && this.props.newNotifications.length !== 0 ? 'New notification! - Tinder - Lit' : 'Tinder - Lit'}
        />
        <Navigation />
        <div className={styles.mainContainer}>
          {React.Children.toArray(this.props.children)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  newNotifications: selectNewNotifications(),
});

App.propTypes = {
  newNotifications: React.PropTypes.array,
  children: React.PropTypes.node.isRequired,
};

export default connect(mapStateToProps, null)(App);