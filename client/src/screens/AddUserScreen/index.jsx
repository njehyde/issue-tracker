import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addUserAction } from 'actions/auth';

import AddUserScreen from './AddUserScreen';

class AddUserScreenContainer extends Component {
  static propTypes = {
    addUser: PropTypes.func.isRequired,
  };

  handleSubmit = user => {
    const { addUser } = this.props;
    addUser(user);
  };

  render() {
    return <AddUserScreen onSubmit={this.handleSubmit} />;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addUser: addUserAction,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(AddUserScreenContainer);
