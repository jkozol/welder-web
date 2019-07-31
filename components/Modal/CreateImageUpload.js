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
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NotificationsApi from "../../data/NotificationsApi";
import BlueprintApi from "../../data/BlueprintApi";
import { setBlueprint } from "../../core/actions/blueprints";
import { fetchingQueue, clearQueue, startCompose, fetchingComposeTypes } from "../../core/actions/composes";

class CreateImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      imageType: ""
    };
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.onChange = value => {
      this.setState({ value });
    };
    this.handleTextInputChange1 = value1 => {
      this.setState({ value1 });
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
    this.toggleOpen();
  }

  handleChange(event) {
    this.setState({ imageType: event.target.value });
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

  render() {
    const { value1 } = this.state;
    const warningUnsaved =
      this.props.blueprint.workspacePendingChanges.length > 0 || this.props.blueprint.localPendingChanges.length > 0;

    const createImageStep = (
      <Form isHorizontal>
        <FormGroup label="Blueprint" isRequired fieldId="horizontal-form-name">
          <Text>{this.props.blueprint.name}</Text>
        </FormGroup>
        <FormGroup label="Your title" fieldId="horizontal-form-title">
          <FormSelect
            value={this.state.value}
            onChange={this.onChange}
            id="horzontal-form-title"
            name="horizontal-form-title"
          >
            {this.props.imageTypes.map(type => (
              <FormSelectOption isDisabled={!type.enabled} key={type.name} value={type.name} label={type.label} />
            ))}
          </FormSelect>
        </FormGroup>
      </Form>
    );

    const createImageUploadFooter = (
      <WizardFooter>
        <WizardContextConsumer>
          {({ activeStep, goToStepByName, goToStepById, onNext, onBack, onClose }) => {
            return (
              <>
                <Button
                  variant="secondary"
                  onClick={() => this.getPreviousStep(activeStep, onBack)}
                  className={activeStep.name === "Get Started" ? "pf-m-disabled" : ""}
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

    const { isOpen } = this.state;

    const steps = [
      { name: "Step 1", component: createImageStep },
      { name: "Step 2", component: <p>Step 2</p> },
      { name: "Step 3", component: <p>Step 3</p> },
      { name: "Step 4", component: <p>Step 4</p> },
      { name: "Review", component: <p>Review Step</p>, nextButtonText: "Finish" }
    ];

    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.toggleOpen}>
          Show Wizard
        </Button>
        {isOpen && (
          <Wizard
            isOpen={isOpen}
            isCompactNav
            onClose={this.toggleOpen}
            title="Simple Wizard"
            description="Simple Wizard Description"
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
  // intl: intlShape.isRequired,
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
