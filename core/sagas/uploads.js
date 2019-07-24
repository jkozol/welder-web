import { call, put, takeEvery } from "redux-saga/effects";
import * as composer from "../composer";

import { SCHEDULE_UPLOAD, scheduleUploadSuccess, uploadFailure } from "../actions/uploads";

function* scheduleUpload(action) {
  try {
    const { composeId, uploadSettings } = action.payload;
    const response = yield call(composer.scheduleUpload, composeId, uploadSettings);
    console.log(response);
    console.log(response.upload_uuid);
    const statusResponse = yield call(composer.getUploadInfo, response.upload_uuid);
    console.log(statusResponse);
    yield put(scheduleUploadSuccess(statusResponse.upload));
  } catch (error) {
    console.log("scheduleUploadError", error);
    yield put(uploadFailure(error));
  }
}

export default function*() {
  yield takeEvery(SCHEDULE_UPLOAD, scheduleUpload);
}
