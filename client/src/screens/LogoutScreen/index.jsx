import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { paths } from 'constants/routes';
import { logoutAction } from 'actions/auth';

class LogoutScreen extends Component {
  static propTypes = {
    history: PropTypes.objectOf(PropTypes.any),
    logout: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { history, logout } = this.props;
    logout();
    history.push(paths.LOGIN);
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logout: logoutAction,
    },
    dispatch,
  );

export default withRouter(connect(null, mapDispatchToProps)(LogoutScreen));
