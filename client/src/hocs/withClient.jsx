import React from 'react';
import defaultClient from 'services/defaultClient';

const withClient = WrappedComponent => props => (
  <WrappedComponent client={defaultClient} {...props} />
);

export default withClient;
