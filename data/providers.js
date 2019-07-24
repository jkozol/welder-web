const providerSettings = {
  aws: {
    auth: {
      aws_access_key: {
        display_text: "AWS access key ID",
        helper_text: "",
        is_password: true
      },
      aws_secret_key: {
        display_text: "AWS secret access key",
        helper_text: "",
        is_password: true
      },
      aws_region: {
        display_text: "AWS region",
        helper_text: "",
        is_password: false
      }
    },
    settings: {
      aws_bucket: {
        display_text: "Amazon S3 bucket name",
        helper_text: "",
        is_password: false
      }
    }
  }
};

export default providerSettings;
