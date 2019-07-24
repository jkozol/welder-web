export const SCHEDULE_UPLOAD = "SCHEDULE_UPLOAD";
export const scheduleUpload = (composeId, uploadSettings) => ({
  type: SCHEDULE_UPLOAD,
  payload: {
    composeId,
    uploadSettings
  }
});

export const SCHEDULE_UPLOAD_SUCCESS = "SCHEDULE_UPLOAD_SUCCESS";
export const scheduleUploadSuccess = upload => ({
  type: SCHEDULE_UPLOAD_SUCCESS,
  payload: {
    upload
  }
});

export const UPLOAD_FAILURE = "UPLOAD_FAILURE";
export const uploadFailure = error => ({
  type: UPLOAD_FAILURE,
  payload: {
    error
  }
});
