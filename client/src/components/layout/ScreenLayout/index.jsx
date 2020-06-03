import React from 'react';
import PropTypes from 'prop-types';
import { Slide, toast } from 'react-toastify';

import { Helmet } from 'react-helmet';
import { Flex, Box } from 'rebass';

import Breadcrumbs from 'components/core/Breadcrumbs';
import Toast from 'components/core/Toast';
import Navbar from 'components/layout/Navbar';
import ErrorBoundaryScreen from 'screens/ErrorBoundaryScreen';

import 'react-toastify/dist/ReactToastify.css';
import Styled from './styled';

const ScreenLayout = ({
  actions,
  breadcrumbs,
  children,
  padding = 3,
  sidebar,
  title,
}) => (
  <Styled.Container>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Styled.Header>
      <Navbar />
    </Styled.Header>
    <Styled.Main>
      <ErrorBoundaryScreen>
        <Flex height="inherit">
          {sidebar && (
            <Box flex="0 1 240px" p={padding} backgroundColor="#f4f5f7">
              {sidebar}
            </Box>
          )}
          <Box flex="1 1 auto" height="inherit">
            <Flex flexDirection="column" height="inherit">
              {breadcrumbs && (
                <Box flex="0 1 auto">
                  <Flex>
                    <Box p={3} width={1 / 2}>
                      <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </Box>
                    <Box p={3} width={1 / 2} textAlign="right">
                      {actions}
                    </Box>
                  </Flex>
                </Box>
              )}
              <Box flex="1 1 auto" p={padding} width={1} height="inherit">
                {children}
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Toast
          limit={3}
          position={toast.POSITION.BOTTOM_RIGHT}
          transition={Slide}
        />
      </ErrorBoundaryScreen>
    </Styled.Main>
    <Styled.Footer>Footer</Styled.Footer>
  </Styled.Container>
);

ScreenLayout.propTypes = {
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  breadcrumbs: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  padding: PropTypes.number,
  sidebar: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.string.isRequired,
};

export default ScreenLayout;
