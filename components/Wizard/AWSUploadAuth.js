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

const AWSUploadAuth = props => {
  return (
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
          <TextInput
            className="pf-c-form-control"
            value={props.uploadSettings["accessKeyID"]}
            type="password"
            id="access-key-id-input"
            name="accessKeyID"
            onChange={props.setUploadSettings}
          />
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
          <TextInput
              className="pf-c-form-control"
              value={props.uploadSettings["secretAccessKey"]}
              type="password"
              id="secret-access-key-input"
              name="secretAccessKey"
              onChange={props.setUploadSettings}
            />
        </div>
      </Form>
    </React.Fragment>
  );
};

AWSUploadAuth.propTypes = {
  setUploadSettings: PropTypes.func,
  uploadSettings: PropTypes.objectOf(PropTypes.string)
};

AWSUploadAuth.defaultProps = {
  setUploadSettings: function() {},
  uploadSettings: {}
};

export default injectIntl(AWSUploadAuth);
