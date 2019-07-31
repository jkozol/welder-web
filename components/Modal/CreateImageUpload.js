/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Text,
  TextContent,
  TextInput,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Wizard,
  WizardContextConsumer,
  WizardFooter
} from "@patternfly/react-core";
import { defineMessages, FormattedMessage, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NotificationsApi from "../../data/NotificationsApi";
import BlueprintApi from "../../data/BlueprintApi";
import { setBlueprint } from "../../core/actions/blueprints";
import { fetchingQueue, clearQueue, startCompose, fetchingComposeTypes } from "../../core/actions/composes";

const messages = defineMessages({
  infotip: {
    defaultMessage: "This process can take a while. " + "Images are built in the order they are started."
  },
  warningUnsaved: {
    defaultMessage:
      "This blueprint has changes that are not committed. " +
      "These changes will be committed before the image is created."
  },
  selectOne: {
    defaultMessage: "Select one"
  }
});

class CreateImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      imageType: "",
      imageName: "",
      showUploadAWSStep: false,
      showReviewStep: false,
      uploadTo: ["aws"]
    };
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.isPendingChange = this.isPendingChange.bind(this);
    this.onChange = imageType => {
      this.setState({ imageType: imageType });
    };
    this.handleImageName = imageName => {
      this.setState({ imageName });
    };
  }

  componentWillMount() {
    if (this.props.imageTypes.length === 0) {
      this.props.fetchingComposeTypes();
    }
    if (this.props.composeQueueFetched === false) {
      this.props.fetchingQueue();
    }
  }

  componentWillUnmount() {
    this.props.clearQueue();
  }

  setNotifications() {
    this.props.layout.setNotifications();
  }

  toggleOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  handleStartCompose(blueprintName, composeType) {
    this.props.startCompose(blueprintName, composeType);
  }

  handleCreateImage() {
    NotificationsApi.displayNotification(this.props.blueprint.name, "imageWaiting");
    if (this.setNotifications) this.setNotifications();
    if (this.handleStartCompose) this.handleStartCompose(this.props.blueprint.name, this.state.imageType);
  }

  handleChange(event) {
    this.setState({ imageType: event.target.value });
  }

  handleNextStep(activeStep, callback) {
    if (activeStep.name === "Image Type") {
      if (this.state.uploadTo.length === 0) {
        if (this.isPendingChange()) {
          this.handleCommit();
        } else {
          this.handleCreateImage();
        }
      } else {
        this.setState(
          {
            showUploadAWSStep: true,
            showReviewStep: false
          },
          () => {
            callback();
          }
        );
      }
    } else {
      this.setState(
        {
          showUploadAWSStep: true,
          showReviewStep: true
        },
        () => {
          callback();
        }
      );
    }
  }

  handleCommit() {
    // clear existing notifications
    NotificationsApi.closeNotification(undefined, "committed");
    NotificationsApi.closeNotification(undefined, "committing");
    // display the committing notification
    NotificationsApi.displayNotification(this.props.blueprint.name, "committing");
    this.setNotifications();
    // post blueprint (includes 'committed' notification)
    Promise.all([BlueprintApi.handleCommitBlueprint(this.props.blueprint)])
      .then(() => {
        // then after blueprint is posted, reload blueprint details
        // to get details that were updated during commit (i.e. version)
        // and call create image
        Promise.all([BlueprintApi.reloadBlueprintDetails(this.props.blueprint)])
          .then(data => {
            const blueprintToSet = Object.assign({}, this.props.blueprint, {
              version: data[0].version
            });
            this.props.setBlueprint(blueprintToSet);
            this.handleCreateImage();
          })
          .catch(e => console.log(`Error in reload blueprint details: ${e}`));
      })
      .catch(e => console.log(`Error in blueprint commit: ${e}`));
  }

  isPendingChange() {
    return (
      this.props.blueprint.workspacePendingChanges.length > 0 || this.props.blueprint.localPendingChanges.length > 0
    );
  }
  render() {
    const { formatMessage } = this.props.intl;
    const { showUploadAWSStep, showReviewStep, imageName, imageType, isOpen, uploadTo } = this.state;

    const imageStep = {
      name: "Image Type",
      component: (
        <Form isHorizontal>
          <FormGroup label="Blueprint" isRequired fieldId="horizontal-form-name">
            <Text>{this.props.blueprint.name}</Text>
          </FormGroup>
          <FormGroup
            label="Image"
            isRequired
            fieldId="horizontal-form-name"
            helperText="Please provide your image name"
          >
            <TextInput
              value={imageName}
              isRequired
              type="text"
              id="horizontal-form-name"
              aria-describedby="horizontal-form-name-helper"
              name="horizontal-form-name"
              onChange={this.handleImageName}
            />
          </FormGroup>
          <FormGroup label="Type" fieldId="horizontal-form-title">
            <FormSelect
              value={imageType}
              onChange={this.onChange}
              id="horzontal-form-title"
              name="horizontal-form-title"
            >
              <FormSelectOption isDisabled key="default" value="" label={formatMessage(messages.selectOne)} />
              {this.props.imageTypes.map(type => (
                <FormSelectOption isDisabled={!type.enabled} key={type.name} value={type.name} label={type.label} />
              ))}
            </FormSelect>
          </FormGroup>
        </Form>
      )
    };

    const uploadAWSStep = {
      name: "Upload to Amazon S3",
      component: <Text>{this.props.blueprint.name}</Text>
    };

    const reviewStep = {
      name: "Review",
      component: <Text>{this.props.blueprint.name}</Text>
    };

    const createImageUploadFooter = (
      <WizardFooter>
        <WizardContextConsumer>
          {({ activeStep, goToStepByName, goToStepById, onNext, onBack, onClose }) => {
            return (
              <>
                <Button
                  variant="primary"
                  isDisabled={imageType === ""}
                  onClick={() => this.handleNextStep(activeStep, onNext)}
                >
                  {activeStep.name === "Image Type" ? (
                    uploadTo.length > 0 ? (
                      this.isPendingChange() ? (
                        <FormattedMessage defaultMessage="Commit and Next" />
                      ) : (
                        <FormattedMessage defaultMessage="Next" />
                      )
                    ) : this.isPendingChange() ? (
                      <FormattedMessage defaultMessage="Commit and Create" />
                    ) : (
                      <FormattedMessage defaultMessage="Create" />
                    )
                  ) : activeStep.name === "Review" ? (
                    <FormattedMessage defaultMessage="Create" />
                  ) : (
                    <FormattedMessage defaultMessage="Next" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => this.getPreviousStep(activeStep, onBack)}
                  isDisabled={activeStep.name === "Image Type"}
                >
                  Back
                </Button>
                <Button variant="danger" onClick={onClose}>
                  Cancel
                </Button>
              </>
            );
          }}
        </WizardContextConsumer>
      </WizardFooter>
    );

    const steps = [imageStep, ...(showUploadAWSStep ? [uploadAWSStep] : []), ...(showReviewStep ? [reviewStep] : [])];

    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.toggleOpen}>
          Create Image
        </Button>
        {isOpen && (
          <Wizard
            isOpen={isOpen}
            isCompactNav
            onClose={this.toggleOpen}
            footer={createImageUploadFooter}
            title="Create and Upload Image"
            steps={steps}
          />
        )}
      </React.Fragment>
    );
  }
}

CreateImageUpload.propTypes = {
  blueprint: PropTypes.shape({
    changed: PropTypes.bool,
    description: PropTypes.string,
    groups: PropTypes.array,
    id: PropTypes.string,
    localPendingChanges: PropTypes.array,
    modules: PropTypes.array,
    name: PropTypes.string,
    packages: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string,
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object)
  }),
  // composeQueue: PropTypes.arrayOf(PropTypes.object),
  composeQueueFetched: PropTypes.bool,
  fetchingQueue: PropTypes.func,
  clearQueue: PropTypes.func,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  fetchingComposeTypes: PropTypes.func,
  setBlueprint: PropTypes.func,
  intl: intlShape.isRequired,
  startCompose: PropTypes.func,
  layout: PropTypes.shape({
    setNotifications: PropTypes.func
  })
};

CreateImageUpload.defaultProps = {
  blueprint: {},
  // composeQueue: [],
  composeQueueFetched: true,
  fetchingQueue: function() {},
  clearQueue: function() {},
  imageTypes: [],
  fetchingComposeTypes: function() {},
  setBlueprint: function() {},
  startCompose: function() {},
  layout: {}
};

const mapStateToProps = state => ({
  composeQueue: state.composes.queue,
  composeQueueFetched: state.composes.queueFetched,
  imageTypes: state.composes.composeTypes
});

const mapDispatchToProps = dispatch => ({
  setBlueprint: blueprint => {
    dispatch(setBlueprint(blueprint));
  },
  fetchingComposeTypes: () => {
    dispatch(fetchingComposeTypes());
  },
  fetchingQueue: () => {
    dispatch(fetchingQueue());
  },
  clearQueue: () => {
    dispatch(clearQueue());
  },
  startCompose: (blueprintName, composeType) => {
    dispatch(startCompose(blueprintName, composeType));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CreateImageUpload));

{
  /* {warningUnsaved ? (
            this.state.imageType !== "" ? (
              this.state.uploadToAWS ? (
                <CreateImageUpload buttonMsg="Commit and Next" closeModal={this.props.close} isDisabled={false} />
              ) : (
                <button type="button" className="btn btn-primary" onClick={this.handleCommit}>
                  <FormattedMessage defaultMessage="Commit and Create" />
                </button>
              )
            ) : this.state.uploadToAWS ? (
              <CreateImageUpload buttonMsg="Commit and Next" closeModal={this.props.close} isDisabled />
            ) : (
              <button type="button" className="btn btn-primary" disabled>
                <FormattedMessage defaultMessage="Commit and Create" />
              </button>
            )
          ) : this.state.imageType !== "" ? (
            this.state.uploadToAWS ? (
              <CreateImageUpload buttonMsg="Next" closeModal={this.props.close} isDisabled={false} />
            ) : (
              <button type="button" className="btn btn-primary" onClick={this.handleCommit}>
                <FormattedMessage defaultMessage="Create" />
              </button>
            )
          ) : this.state.uploadToAWS ? (
            <CreateImageUpload buttonMsg="Next" closeModal={this.props.close} isDisabled />
          ) : (
            <button type="button" className="btn btn-primary" disabled>
              <FormattedMessage defaultMessage="Create" />
            </button>
          )} */
}
