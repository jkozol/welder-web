import React from "react";
import {
    Form,
    FormGroup,
    Text,
    TextInput  } from "@patternfly/react-core";
import { defineMessages, formatMessage, FormattedMessage, injectIntl, intlShape } from "react-intl";

const messages = defineMessages({
    accessKeyID: {
        id: "access-key-id",
        defaultMessage: "AWS access key ID"
    },
    accessKeyIDHelp: {
        id: "access-key-id-help",
        defaultMessage: "Most of the values required to upload the image can be found in the {name}",
    },
    secretAccessKey: {
        id: "secret-access-key",
        defaultMessage: "AWS secret access key",
    },
    secretAccessKeyHelp: {
        id: "secret-access-key-help",
        defaultMessage: "AWS secret access key",
    },
    region: {
        defaultMessage: "AWS region",
    },
    bucket: {
        defaultMessage: "Amazon S3 bucket name",
    }
  });

class UploadStepsAWS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const uploadAuth = () => ({
            name: "Authentication",
            component: (
            <React.Fragment>
                <Text className="help-block cc-c-form__required-text">
                    <FormattedMessage defaultMessage="All fields are required." />
                </Text>
                <Form isHorizontal>
                    <FormGroup
                        label={formatMessage(messages.accessKeyID)}
                        fieldId="access-key-id"
                        key="access-key-id"
                    >
                        <TextInput
                        value={formatMessage(messages.accessKeyID, {
                            name: 
                        })}
                        type="password"
                        id="access-key-id-help"
                        key="access-key-id-help"
                        onChange={this.setUploadSettings}
                        isRequired
                        />
                    </FormGroup>
                    <FormGroup
                        label={formatMessage(messages.accessKeyID)}
                        fieldId="access-key-id"
                        key="access-key-id"
                    >
                        <TextInput
                        value={formatMessage(messages.accessKeyID, {
                            link: <a href="https://console.aws.amazon.com/console/home">AWS Management Console</a>
                        })}
                        type="password"
                        id="access-key-id-help"
                        key="access-key-id-help"
                        onChange={this.setUploadSettings}
                        isRequired
                        />
                    </FormGroup>
                    <FormGroup
                        label={formatMessage(messages.accessKeyID)}
                        fieldId="access-key-id"
                        key="access-key-id"
                    >
                        <TextInput
                        value={formatMessage(messages.accessKeyID, {
                            link: <a href="https://console.aws.amazon.com/console/home">AWS Management Console</a>
                        })}
                        type="password"
                        id="access-key-id-help"
                        key="access-key-id-help"
                        onChange={this.setUploadSettings}
                        isRequired
                        />
                    </FormGroup>
                </Form>
                )}
            </React.Fragment>
            )
        });

        const uploadSettings = () => ({
            name: "File upload",
            component: (
            <React.Fragment>
                <Text className="help-block cc-c-form__required-text">
                <FormattedMessage defaultMessage="All fields are required." />
                </Text>
                {providerSettings[provider] !== undefined && (
                <Form isHorizontal>
                    <FormGroup label={formatMessage({ id: "image-name", defaultMessage: "Image name" })} fieldId="image-name">
                    <TextInput
                        value={imageName}
                        type="text"
                        id="image-name"
                        aria-describedby="image-name"
                        onChange={() => this.setState({ imageName: event.target.value })}
                        isRequired
                    />
                    </FormGroup>
                    {Object.keys(providerSettings[provider].settings).map(key => (
                    <FormGroup
                        label={formatMessage({
                        id: `${provider}-settings`,
                        defaultMessage: providerSettings[provider].settings[key].displayText
                        })}
                        fieldId={key}
                        key={key}
                    >
                        <TextInput
                        value={this.state.uploadSettings[key] || ""}
                        type={providerSettings[provider].settings[key].isPassword ? "password" : "text"}
                        id={key}
                        key={key}
                        onChange={this.setUploadSettings}
                        isRequired
                        />
                    </FormGroup>
                    ))}
                </Form>
                )}
            </React.Fragment>
            )
        });

        const uploadStep = () => ({
            name: `Upload to AWS`,
            steps: [uploadAuth, uploadSettings]
        });

        return(uploadStep)
    }
}