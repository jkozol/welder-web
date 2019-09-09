import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  DropdownItem,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListToggle,
  DataListContent,
  DataListItemCells
} from "@patternfly/react-core";
import { BuilderImageIcon, ServiceIcon } from "@patternfly/react-icons";
import { deletingCompose, cancellingCompose } from "../../core/actions/composes";
import {
  setModalStopBuildVisible,
  setModalStopBuildState,
  setModalDeleteImageVisible,
  setModalDeleteImageState
} from "../../core/actions/modals";
import ImagesDataList from "./ImagesDataList";
import ActionsDropdown from "../Dropdown/ActionsDropdown";
import * as composer from "../../core/composer";

class ImagesDataListItem extends React.Component {
  constructor() {
    super();
    this.state = { composeLogExpanded: false, uploadsExpanded: false };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleShowModalStop = this.handleShowModalStop.bind(this);
    this.handleShowModalDeleteImage = this.handleShowModalDeleteImage.bind(this);
    this.handleShowComposelog = this.handleShowComposelog.bind(this);
    this.handleShowUploadLog = this.handleShowUploadLog.bind(this);
    this.handleShowUploads = this.handleShowUploads.bind(this);
  }

  // maps to Remove button for FAILED
  handleDelete() {
    this.props.deletingCompose(this.props.compose.id);
  }

  // maps to Stop button for WAITING
  handleCancel() {
    this.props.cancellingCompose(this.props.compose.id);
  }

  // maps to Stop button for RUNNING
  handleShowModalStop() {
    this.props.setModalStopBuildState(this.props.compose.id, this.props.blueprint);
    this.props.setModalStopBuildVisible(true);
  }

  // maps to Delete button for FINISHED
  handleShowModalDeleteImage(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.setModalDeleteImageState(this.props.compose.id, this.props.blueprint);
    this.props.setModalDeleteImageVisible(true);
  }

  handleShowComposelog() {
    this.setState({ uploadsExpanded: false });
    this.setState(prevState => ({
      composeLogExpanded: !prevState.composeLogExpanded,
      uploadLogExpanded: false,
      fetchinglog: !prevState.composeLogExpanded
    }));
    if (this.state.fetchinglog === true) {
      composer.getComposeLog(this.props.compose.id).then(
        log => {
          this.setState({ logContent: log, fetchinglog: false });
        },
        () => {
          this.setState({
            logContent: <FormattedMessage defaultMessage="No log available" />,
            fetchinglog: false
          });
        }
      );
    }
  }

  handleShowUploadLog() {
    this.setState(prevState => ({
      composeLogExpanded: false,
      uploadLogExpanded: !prevState.uploadLogExpanded,
      fetchinglog: !prevState.uploadLogExpanded
    }));
    if (this.state.fetchinglog === true) {
      composer.getComposeLog(this.props.compose.id).then(
        log => {
          this.setState({ logContent: log, fetchinglog: false });
        },
        () => {
          this.setState({
            logContent: <FormattedMessage defaultMessage="No log available" />,
            fetchinglog: false
          });
        }
      );
    }
  }

  handleShowUploads() {
    this.setState({ uploadLogExpanded: false, composeLogExpanded: false });
    this.setState(prevState => ({ uploadsExpanded: !prevState.uploadsExpanded }));
  }

  render() {
    const { compose } = this.props;
    const timestamp = new Date(compose.job_created * 1000);
    const formattedTime = timestamp.toDateString();

    const composeStatus = () => {
      switch (compose.queue_status) {
        case "WAITING":
          return (
            <React.Fragment>
              <span className="pficon pficon-pending" aria-hidden="true" />
              {` `}
              <FormattedMessage defaultMessage="Image build pending" />
            </React.Fragment>
          );
        case "RUNNING":
          return (
            <React.Fragment>
              <span className="pficon pficon-in-progress" aria-hidden="true" />
              {` `}
              <FormattedMessage defaultMessage="Image build in progress" />
            </React.Fragment>
          );
        case "FINISHED":
          return (
            <React.Fragment>
              <span className="pficon pficon-ok" aria-hidden="true" />
              {` `}
              <FormattedMessage defaultMessage="Image build complete" />
            </React.Fragment>
          );
        case "FAILED":
          return (
            <React.Fragment>
              <span className="pficon pficon-error-circle-o" aria-hidden="true" />
              {` `}
              <FormattedMessage defaultMessage="Image build failed" />
            </React.Fragment>
          );
        default:
          return <p>other status</p>;
      }
    };

    let logSection;
    if (this.state.uploadLogExpanded || this.state.composeLogExpanded) {
      if (this.state.fetchinglog) {
        logSection = (
          <div>
            <div className="spinner spinner-sm pull-left" aria-hidden="true" />
            <FormattedMessage defaultMessage="Loading log messages" />
          </div>
        );
      } else logSection = <pre className="pf-u-m-0">{this.state.logContent}</pre>;
    }

    const actions = () => {
      switch (this.props.compose.queue_status) {
        case "FINISHED":
          return [
            <li key="download">
              <a href={this.props.downloadUrl} download>
                <FormattedMessage defaultMessage="Download" />
              </a>
            </li>,
            <li key="delete">
              <button type="button" onClick={e => this.handleShowModalDeleteImage(e)}>
                <FormattedMessage defaultMessage="Delete" />
              </button>
            </li>
          ];
        case "RUNNING":
          return [
            <li key="stop">
              <a>
                <FormattedMessage defaultMessage="Stop" />
              </a>
            </li>
          ];
        case "FAILED":
          return [
            <DropdownItem key="retry">
              <a>
                <FormattedMessage defaultMessage="retry" />
              </a>
            </DropdownItem>
          ];
        default:
          break;
      }
    };

    return (
      <DataListItem aria-labelledby="Uploads" isExpanded={this.state.uploadsExpanded}>
        <DataListItemRow>
          <DataListToggle
            onClick={this.handleShowUploads}
            isExpanded={this.state.uploadsExpanded}
            id="uploads-toggle"
            aria-controls="ex-expand1"
          />
          <div className="cc-c-data-list__item-icon">
            <BuilderImageIcon />
          </div>
          <DataListItemCells
            dataListCells={[
              <DataListCell key="blueprint">
                <strong id="compose-name">
                  {this.props.blueprint}-{compose.version}-{compose.compose_type}
                </strong>
              </DataListCell>,
              <DataListCell key="type">
                <span>Type</span> <strong>{compose.compose_type}</strong>
              </DataListCell>,
              <DataListCell key="date">
                <span>Created</span> <strong>{formattedTime}</strong>
              </DataListCell>
            ]}
          />
          <div className="cc-c-data-list__item-status">{composeStatus()}</div>
          <div className="pf-c-data-list__item-action">
            <ActionsDropdown dropdownItems={actions} />
          </div>
          <div
            aria-hidden={!this.props.compose.queue_status === "WAITING"}
            className={`pf-c-data-list__item-action ${
              this.props.compose.queue_status === "WAITING" ? "cc-u-not-visible" : ""
            }`}
          >
            <Button
              variant={`${this.state.composeLogExpanded ? "primary" : "secondary"}`}
              onClick={this.handleShowComposelog}
            >
              <FormattedMessage defaultMessage="Log" />
            </Button>
          </div>
        </DataListItemRow>
        <DataListContent aria-label="Uploads" id="uploads-expanded" isHidden={!this.state.uploadsExpanded} noPadding>
          <ImagesDataList listLevel={2} fullWidth>
            <DataListItem aria-labelledby="Log">
              <DataListItemRow>
                <div className="cc-c-data-list__item-icon">
                  <ServiceIcon />
                </div>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="blueprint">
                      <strong id="upload-type">Type of upload</strong>
                    </DataListCell>,
                    <DataListCell key="date">
                      <span>Started</span> <strong>{formattedTime}</strong>
                    </DataListCell>
                  ]}
                />
                <div className="cc-c-data-list__item-status">
                  <span className="pficon pficon-ok" aria-hidden="true" />
                  {` `}
                  <FormattedMessage defaultMessage="Upload action complete" />
                </div>
                <div
                  aria-hidden={!this.props.compose.queue_status === "WAITING"}
                  className={`pf-c-data-list__item-action ${
                    this.props.compose.queue_status === "WAITING" ? "cc-u-not-visible" : ""
                  }`}
                >
                  <Button
                    variant={`${this.state.uploadLogExpanded ? "primary" : "secondary"}`}
                    onClick={this.handleShowUploadLog}
                  >
                    <FormattedMessage defaultMessage="Log" />
                  </Button>
                </div>
              </DataListItemRow>
              <DataListContent
                aria-label="Log"
                id="uploads-log-expanded"
                isHidden={!this.state.uploadLogExpanded}
                noPadding
              >
                {logSection}
              </DataListContent>
            </DataListItem>
          </ImagesDataList>
        </DataListContent>
        <DataListContent aria-label="log" id="compose-log-expanded" isHidden={!this.state.composeLogExpanded} noPadding>
          {logSection}
        </DataListContent>
      </DataListItem>
    );
  }
}

ImagesDataListItem.propTypes = {
  compose: PropTypes.shape({
    blueprint: PropTypes.string,
    compose_type: PropTypes.string,
    id: PropTypes.string,
    image_size: PropTypes.number,
    job_created: PropTypes.number,
    job_finished: PropTypes.number,
    job_started: PropTypes.number,
    queue_status: PropTypes.string,
    version: PropTypes.string
  }),
  blueprint: PropTypes.string,
  deletingCompose: PropTypes.func,
  cancellingCompose: PropTypes.func,
  setModalStopBuildState: PropTypes.func,
  setModalStopBuildVisible: PropTypes.func,
  setModalDeleteImageState: PropTypes.func,
  setModalDeleteImageVisible: PropTypes.func,
  downloadUrl: PropTypes.string
};

ImagesDataListItem.defaultProps = {
  compose: {},
  blueprint: "",
  deletingCompose: function() {},
  cancellingCompose: function() {},
  setModalStopBuildState: function() {},
  setModalStopBuildVisible: function() {},
  setModalDeleteImageState: function() {},
  setModalDeleteImageVisible: function() {},
  downloadUrl: ""
};

const mapDispatchToProps = dispatch => ({
  deletingCompose: compose => {
    dispatch(deletingCompose(compose));
  },
  cancellingCompose: compose => {
    dispatch(cancellingCompose(compose));
  },
  setModalStopBuildState: (composeId, blueprintName) => {
    dispatch(setModalStopBuildState(composeId, blueprintName));
  },
  setModalStopBuildVisible: visible => {
    dispatch(setModalStopBuildVisible(visible));
  },
  setModalDeleteImageState: (composeId, blueprintName) => {
    dispatch(setModalDeleteImageState(composeId, blueprintName));
  },
  setModalDeleteImageVisible: visible => {
    dispatch(setModalDeleteImageVisible(visible));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(ImagesDataListItem);
