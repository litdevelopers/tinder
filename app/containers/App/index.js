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

import styles from './styles.css';

export default class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.container}>
        <Navigation />
        <div className={styles.mainContainer}>
          {React.Children.toArray(this.props.children)}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node.isRequired,
};

