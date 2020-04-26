/* eslint-disable no-unused-vars */
import React from "react";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Checkbox,
  Popover,
  TextContent,
  Text,
  TextInput,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Title,
  Wizard,
  WizardContextConsumer,
  WizardFooter
} from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { defineMessages, FormattedMessage, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NotificationsApi from "../../data/NotificationsApi";
import BlueprintApi from "../../data/BlueprintApi";
import { setBlueprint } from "../../core/actions/blueprints";
import { fetchingQueue, clearQueue, startCompose, fetchingComposeTypes } from "../../core/actions/composes";
import { fetchingUploadProviders } from "../../core/actions/uploads";

class AWSUploadSteps extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        const awsUploadAuth = {
            name: "Authentication",
            component: (
              <React.Fragment>
                <Text className="help-block cc-c-form__required-text">
                  <FormattedMessage defaultMessage="All fields are required." />
                </Text>
                <Form isHorizontal>
                  <div className="pf-c-form__group">
                    <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-m-justify-content-flex-start">
                      <label htmlFor="access-key-id-input" className="pf-l-flex__item">
                        <span className="pf-c-form__label-text">
                          <FormattedMessage defaultMessage="Access key ID" />
                        </span>
                        <span className="pf-c-form__label-required" aria-hidden="true">
                          &#42;
                        </span>
                      </label>
                      <Popover
                        id="popover-help"
                        bodyContent={
                          <React.Fragment>
                            <FormattedMessage defaultMessage="Most of the values required to upload the image can be found in the" />
                            <strong> Identity and Access Management (IAM) </strong>
                            <FormattedMessage defaultMessage="page in the AWS console." />
                          </React.Fragment>
                        }
                        aria-label="access key id help"
                      >
                        <Button variant="plain" aria-label="access key id help">
                          <OutlinedQuestionCircleIcon id="popover-icon" />
                        </Button>
                      </Popover>
                    </div>
                    {/* <TextInput
                      className="pf-c-form-control"
                      value={this.state.uploadSettings["accessKeyID"]}
                      type="password"
                      id="access-key-id-input"
                      name="accessKeyID"
                      onChange={this.setUploadSettings}
                    /> */}
                  </div>
                  <div className="pf-c-form__group">
                    <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-m-justify-content-flex-start">
                      <label htmlFor="secret-access-key-input" className="pf-l-flex__item">
                        <span className="pf-c-form__label-text">
                          <FormattedMessage defaultMessage="Secret access key" />
                        </span>
                        <span className="pf-c-form__label-required" aria-hidden="true">
                          &#42;
                        </span>
                      </label>
                      <Popover
                        id="popover-help"
                        bodyContent={
                          <React.Fragment>
                            <FormattedMessage defaultMessage="You can view the Secret access key only when you create a new Access key ID on the" />
                            <strong> Identity and Access Management (IAM) </strong>
                            <FormattedMessage defaultMessage="page in the AWS console." />
                          </React.Fragment>
                        }
                        aria-label="secret access key help"
                      >
                        <Button variant="plain" aria-label="secret access key help">
                          <OutlinedQuestionCircleIcon id="popover-icon" />
                        </Button>
                      </Popover>
                    </div>
                    {/* <TextInput
                      className="pf-c-form-control"
                      value={this.state.uploadSettings["secretAccessKey"]}
                      type="password"
                      id="secret-access-key-input"
                      name="secretAccessKey"
                      onChange={this.setUploadSettings}
                    /> */}
                  </div>
                </Form>
              </React.Fragment>
            )
          };
      
          const awsUploadSettings = {
            name: "File upload",
            component: (
              <React.Fragment>
                <Text className="help-block cc-c-form__required-text">
                  <FormattedMessage defaultMessage="All fields are required." />
                </Text>
                <Form isHorizontal>
                  <div className="pf-c-form__group">
                    <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-m-justify-content-flex-start">
                      <label htmlFor="image-name-input" className="pf-l-flex__item">
                        <span className="pf-c-form__label-text">
                          <FormattedMessage defaultMessage="Image name" />
                        </span>
                        <span className="pf-c-form__label-required" aria-hidden="true">
                          &#42;
                        </span>
                      </label>
                      <Popover
                        id="popover-help"
                        bodyContent={
                          <React.Fragment>
                            <FormattedMessage defaultMessage="Provide a file name to be used for the image file that will be uploaded." />
                          </React.Fragment>
                        }
                        aria-label="image name help"
                      >
                        <Button variant="plain" aria-label="image name help">
                          <OutlinedQuestionCircleIcon id="popover-icon" />
                        </Button>
                      </Popover>
                    </div>
                    {/* <TextInput
                      className="pf-c-form-control"
                      value={imageName}
                      type="text"
                      id="image-name-input"
                      onChange={this.setImageName}
                    /> */}
                  </div>
                  <div className="pf-c-form__group">
                    <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-m-justify-content-flex-start">
                      <label htmlFor="bucket-input" className="pf-l-flex__item">
                        <span className="pf-c-form__label-text">
                          <FormattedMessage defaultMessage="Amazon S3 bucket" />
                        </span>
                        <span className="pf-c-form__label-required" aria-hidden="true">
                          &#42;
                        </span>
                      </label>
                      <Popover
                        id="bucket-popover"
                        bodyContent={
                          <React.Fragment>
                            <FormattedMessage
                              defaultMessage="
                            Provide the S3 bucket name to which the image file will be uploaded before being imported into EC2. 
                            The bucket must already exist in the Region where you want to import your image. You can find a list of buckets on the"
                            />
                            <strong> S3 buckets </strong>
                            <FormattedMessage defaultMessage="page in the Amazon S3 storage service in the AWS console." />
                          </React.Fragment>
                        }
                        aria-label="bucket help"
                      >
                        <Button variant="plain" aria-label="bucket help">
                          <OutlinedQuestionCircleIcon id="popover-icon" />
                        </Button>
                      </Popover>
                    </div>
                    {/* <TextInput
                      className="pf-c-form-control"
                      value={this.state.uploadSettings["bucket"]}
                      type="text"
                      id="bucket-input"
                      name="bucket"
                      onChange={this.setUploadSettings}
                    /> */}
                  </div>
                  <div className="pf-c-form__group">
                    <div className="pf-c-form__label pf-m-no-padding-top pf-l-flex pf-m-justify-content-flex-start">
                      <label htmlFor="region-input" className="pf-l-flex__item">
                        <span className="pf-c-form__label-text">
                          <FormattedMessage defaultMessage="AWS region" />
                        </span>
                        <span className="pf-c-form__label-required" aria-hidden="true">
                          &#42;
                        </span>
                      </label>
                      <Popover
                        id="region-popover"
                        bodyContent={
                          <FormattedMessage defaultMessage="Provide the AWS Region where you want to import your image. This must be the same region where the S3 bucket exists." />
                        }
                        aria-label="region help"
                      >
                        <Button variant="plain" aria-label="region help">
                          <OutlinedQuestionCircleIcon id="popover-icon" />
                        </Button>
                      </Popover>
                    </div>
                    {/* <TextInput
                      className="pf-c-form-control"
                      value={this.state.uploadSettings["region"]}
                      type="text"
                      id="region-input"
                      name="region"
                      onChange={this.setUploadSettings}
                    /> */}
                  </div>
                </Form>
              </React.Fragment>
            )
          };
      
          const uploadStep = {
            steps: [awsUploadAuth, awsUploadSettings]
          };

          return [awsUploadAuth, awsUploadSettings];
    }
};


export default injectIntl(AWSUploadSteps);