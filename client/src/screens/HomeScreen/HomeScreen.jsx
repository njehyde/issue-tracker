import React from 'react';
import { Flex, Box, Button } from 'rebass';

import ScreenLayout from 'components/layout/ScreenLayout';

const HomeScreen = () => (
  <ScreenLayout title="Home">
    <div>Home</div>
    <Flex width={1}>
      <Box p={1} width={1 / 2} color="white" bg="blue">
        Flex
      </Box>
      <Box p={1} width={1 / 2} color="white" bg="purple">
        Box
        <Button variant="primary" mr={2}>
          Primary
        </Button>
        <Button variant="secondary" mr={2}>
          Secondary
        </Button>
        <Button variant="outline" mr={2}>
          Outline
        </Button>
      </Box>
    </Flex>
  </ScreenLayout>
);

export default HomeScreen;
