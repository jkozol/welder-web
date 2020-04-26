import React from "react";
import {
  Button,
  Form,
  Popover,
  Text,
  TextInput} from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";

const AWSUploadSettings = props => {
  return (
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
          <TextInput
            className="pf-c-form-control"
            value={props.imageName}
            type="text"
            id="image-name-input"
            onChange={props.setImageName}
          />
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
          <TextInput
            className="pf-c-form-control"
            value={props.uploadSettings["bucket"]}
            type="text"
            id="bucket-input"
            name="bucket"
            onChange={props.setUploadSettings}
          />
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
          <TextInput
            className="pf-c-form-control"
            value={props.uploadSettings["region"]}
            type="text"
            id="region-input"
            name="region"
            onChange={props.setUploadSettings}
          />
        </div>
      </Form>
    </React.Fragment>
  );
};

AWSUploadSettings.propTypes = {
  imageName: PropTypes.string,
  setImageName: PropTypes.func,
  setUploadSettings: PropTypes.func,
  uploadSettings: PropTypes.objectOf(PropTypes.string)
};

AWSUploadSettings.defaultProps = {
  imageName: "",
  setImageName: function() {},
  setUploadSettings: function() {},
  uploadSettings: {}
};

export default injectIntl(AWSUploadSettings);
