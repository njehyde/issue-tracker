import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import { Heading } from 'components/styled';

import ColumnHeaders from './ColumnHeaders';
import Columns from './Columns';
import Styled from './styled';

const KanbanBoard = ({
  columns,
  issues,
  name,
  otherSprints,
  setIssueBeingEdited,
  sprintId,
  onSendIssueToBottomOfBacklog,
  onSendIssueToSprint,
  onSendIssueToTopOfBacklog,
  onUpdateIssueOrdinals,
  onUpdateIssues,
}) => {
  const [height, setHeight] = useState(0);
  const poolRef = useRef();

  useEffect(() => {
    if (poolRef.current) {
      setHeight(poolRef.current.offsetHeight);
    }
  });

  return (
    <Flex flexDirection="column" mb="2rem">
      <Box flex="0 1 auto" mb="1rem">
        <Heading.H5>{name}</Heading.H5>
      </Box>
      <Box flex="1 1 auto" height={height}>
        <Styled.Pool ref={poolRef}>
          <ColumnHeaders columns={columns} />
          <Columns
            columns={columns}
            issues={issues}
            sprintId={sprintId}
            otherSprints={otherSprints}
            onClickIssue={setIssueBeingEdited}
            onSendIssueToBottomOfBacklog={onSendIssueToBottomOfBacklog}
            onSendIssueToTopOfBacklog={onSendIssueToTopOfBacklog}
            onSendIssueToSprint={onSendIssueToSprint}
            onUpdateIssues={onUpdateIssues}
            onUpdateIssueOrdinals={onUpdateIssueOrdinals}
          />
        </Styled.Pool>
      </Box>
    </Flex>
  );
};

KanbanBoard.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  name: PropTypes.string,
  otherSprints: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  sprintId: PropTypes.string,
  onSendIssueToBottomOfBacklog: PropTypes.func.isRequired,
  onSendIssueToSprint: PropTypes.func.isRequired,
  onSendIssueToTopOfBacklog: PropTypes.func.isRequired,
  onUpdateIssueOrdinals: PropTypes.func.isRequired,
  onUpdateIssues: PropTypes.func.isRequired,
  setIssueBeingEdited: PropTypes.func.isRequired,
};

export default KanbanBoard;
