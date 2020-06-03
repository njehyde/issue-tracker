import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  createIssueCommentAction,
  clearIssueCommentsAction,
  clearIssueCommentsMetadataAction,
  deleteIssueCommentAction,
  getIssueCommentsAction,
  updateIssueCommentAction,
} from 'actions/issue';

import IssueSection from './IssueSection';

class IssueSectionContainer extends Component {
  static propTypes = {
    issue: PropTypes.objectOf(PropTypes.any).isRequired,
    comments: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    onUpdateIssue: PropTypes.func.isRequired,
    createIssueComment: PropTypes.func.isRequired,
    clearIssueComments: PropTypes.func.isRequired,
    clearIssueCommentsMetadata: PropTypes.func.isRequired,
    deleteIssueComment: PropTypes.func.isRequired,
    getIssueComments: PropTypes.func.isRequired,
    updateIssueComment: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      commentBeingEdited: null,
    };
  }

  componentDidMount() {
    const {
      clearIssueComments,
      clearIssueCommentsMetadata,
      getIssueComments,
      issue: { id: issueId },
    } = this.props;
    clearIssueComments();
    clearIssueCommentsMetadata();
    getIssueComments(issueId);
  }

  handleEditComment = comment => {
    this.setState({ commentBeingEdited: comment });
  };

  handleChangeComment = text => {
    const { commentBeingEdited } = this.state;
    const updatedComment = {
      ...commentBeingEdited,
      text,
    };
    this.setState({ commentBeingEdited: updatedComment });
  };

  handleSaveComment = () => {
    const { issue, createIssueComment, getIssueComments } = this.props;
    const { id: issueId } = issue || {};
    const { commentBeingEdited } = this.state;

    const callback = () => {
      getIssueComments(issueId);
    };

    createIssueComment(issue, commentBeingEdited, callback);
    this.setState({ commentBeingEdited: null });
  };

  handleUpdateComment = () => {
    const { issue, getIssueComments, updateIssueComment } = this.props;
    const { id: issueId } = issue || {};
    const { commentBeingEdited } = this.state;

    const callback = () => {
      getIssueComments(issueId);
    };

    updateIssueComment(issueId, commentBeingEdited, callback);
    this.setState({ commentBeingEdited: null });
  };

  handleDeleteComment = comment => {
    const { issue, deleteIssueComment } = this.props;
    deleteIssueComment(issue, comment);
  };

  render() {
    const { issue, comments, onUpdateIssue } = this.props;
    const { commentBeingEdited } = this.state;
    return (
      <IssueSection
        issue={issue}
        onUpdateIssue={onUpdateIssue}
        comments={comments}
        commentBeingEdited={commentBeingEdited}
        onAddComment={this.handleEditComment}
        onEditComment={this.handleEditComment}
        onChangeComment={this.handleChangeComment}
        onSaveComment={this.handleSaveComment}
        onUpdateComment={this.handleUpdateComment}
        onDeleteComment={this.handleDeleteComment}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: state.authStore.user,
  comments: state.issueStore.issueComments,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearIssueComments: clearIssueCommentsAction,
      clearIssueCommentsMetadata: clearIssueCommentsMetadataAction,
      deleteIssueComment: deleteIssueCommentAction,
      getIssueComments: getIssueCommentsAction,
      createIssueComment: createIssueCommentAction,
      updateIssueComment: updateIssueCommentAction,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IssueSectionContainer);
