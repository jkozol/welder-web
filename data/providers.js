const providerSettings = {
  azure: {
    auth: {
      client_id: "Client id",
      subscription_id: "Subscription id",
      secret: "Secret",
      tenant: "Tenant",
      resource_group: "Resource group",
      storage_account_name: "Storage account name"
    },
    settings: {
      location: "Location",
      storage_container: "Storage container"
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
