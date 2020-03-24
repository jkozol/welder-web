import React from "react";
import {
    Form,
    FormGroup,
    Text,
    TextInput  } from "@patternfly/react-core";
import { defineMessages, FormattedMessage, injectIntl, intlShape } from "react-intl";

const messages = defineMessages({
    accessKeyID: {
        defaultMessage: "AWS access key ID"
    },
    accessKeyIDHelp: {
        defaultMessage: "Most of the values required to upload the image can be found in the <a>AWS Management Console</a>.",
        values: {{
            a: (...chunks) => (
                <a className="external_link" href='https://www.patternfly.org/' target='_blank'>
                  {chunks}
                </a>
            )
        }}
    },
    secretAccessKey: {
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
                        label={formatMessage({
                            id: `accessKeyID`,
                            defaultMessage: accessKeyID
                        })}
                        fieldId={"accessKeyID"}
                        key={"accessKeyID"}
                    >
                        <TextInput
                        value={formatMessage({
                            id: `accessKeyID`,
                            defaultMessage: accessKeyID
                        })}
                        type={providerSettings[provider].auth[key].isPassword ? "password" : "text"}
                        id={key}
                        key={key}
                        onChange={this.setUploadSettings}
                        isRequired
                        />
                    </FormGroup>



                    <FormGroup
                        label={formatMessage({
                        id: `aws-auth`,
                        defaultMessage: providerSettings[provider].auth[key].displayText
                        })}
                        fieldId={key}
                        key={key}
                    >
                        <TextInput
                        value={this.state.uploadSettings[key] || ""}
                        type={providerSettings[provider].auth[key].isPassword ? "password" : "text"}
                        id={key}
                        key={key}
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