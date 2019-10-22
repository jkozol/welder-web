const providerSettings = {
  aws: {
    auth: {
      aws_access_key: "AWS access key",
      aws_secret_key: "AWS secret key"
    },
    settings: {
      aws_region: "AWS region",
      aws_bucket: "AWS bucket"
    }
  },
  openstack: {
    auth: {
      username: "Username",
      password: "Password",
      auth_url: "Authentication url"
    },
    settings: {
      project_domain_name: "Project domain name",
      project_name: "Project name",
      user_domain_name: "User domain name",
      is_public: "Allow public access"
    }
  },
  vsphere: {
    auth: {
      username: "Username",
      password: "Password"
    },
    settings: {
      datacenter: "Datacenter",
      datastore: "Datastore",
      folder: "Folder",
      host: "Host"
    }
  }
};

export default providerSettings;
