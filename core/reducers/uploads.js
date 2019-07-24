import { SCHEDULE_UPLOAD_SUCCESS } from "../actions/uploads";

function removeUpload(array, uploadId) {
  return array.filter(upload => upload.id !== uploadId);
}

const uploads = (state = [], action) => {
  switch (action.type) {
    case SCHEDULE_UPLOAD_SUCCESS:
      return Object.assign({}, state, {
        uploadList: removeUpload(state.uploadList, action.payload.upload.uuid).concat(action.payload.upload)
      });
    default:
      return state;
  }
};

export default uploads;
