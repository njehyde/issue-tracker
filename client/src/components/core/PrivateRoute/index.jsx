import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import WSTest from 'components/WSTest';

const PrivateRoute = ({ user, component: RouteComponent, ...rest }) => (
  <Route
    {...rest}
    render={routeProps =>
      user !== null ? (
        <>
          <RouteComponent {...routeProps} />
          <WSTest />
        </>
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  component: PropTypes.node,
};

const mapStateToProps = state => ({
  user: state.authStore.user,
});

export default connect(mapStateToProps)(PrivateRoute);
