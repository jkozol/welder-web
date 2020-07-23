const imageTypeLabels = {
  ami: "Amazon Machine Image Disk (.ami)",
  "ext4-filesystem": "Ext4 File System Image (.img)",
  "fedora-iot-commit": "Fedora IoT Commit (.tar)",
  "live-iso": "Live Bootable ISO (.iso)",
  "partitioned-disk": "Raw Partitioned Disk Image (.img)",
  qcow2: "QEMU QCOW2 Image (.qcow2)",
  openstack: "OpenStack (.qcow2)",
  "rhel-edge-commit": "RHEL for Edge Commit (.tar)",
  tar: "TAR Archive (.tar)",
  vhd: "Azure Disk Image (.vhd)",
  vmdk: "VMware Virtual Machine Disk (.vmdk)",
  alibaba: "Alibaba Machine Image (.qcow2)",
  google: "Google Compute Engine Image (.tar.gz)",
  "hyper-v": "Hyper-V Virtual Machine Disk (.vhdx)",
};

export const imageTypeToLabel = (imageType) => imageTypeLabels[imageType];

const uploadTypeLabels = {
  aws: "AWS",
  azure: "Azure",
};

export const uploadProviderToLabel = (uploadType) => uploadTypeLabels[uploadType];
