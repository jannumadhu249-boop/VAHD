import { call, put, takeEvery, takeLatest } from "redux-saga/effects"
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes"
import { apiError, loginSuccess, logoutUserSuccess } from "./actions"
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      )
      yield put(loginSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      })
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      })
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }

    var gets = localStorage.getItem("authUser")
    var data = JSON.parse(gets)
    var Roles = data?.rolesAndPermission?.[0] ?? { accessAll: true }

    if (Roles?.Dashboardview === true || Roles?.accessAll === true) {
      history.push("/dashboard")
    } else if (
      Roles?.EmployeeRegistationsView === true ||
      Roles?.accessAll === true
    ) {
      history.push("/employee-registation")
    } else if (
      Roles?.PatientRegistrationView === true ||
      Roles?.accessAll === true
    ) {
      history.push("/case-treated")
    } else if (Roles?.FodderView === true || Roles?.accessAll === true) {
      history.push("/fodder")
    } else if (
      Roles?.GoatDewormingsView === true ||
      Roles?.accessAll === true
    ) {
      history.push("/sheep-goat-deworming")
    } else if (Roles?.AIsView === true || Roles?.accessAll === true) {
      history.push("/artifical-insemination")
    } else if (Roles?.DrugIndentsView === true || Roles?.accessAll === true) {
      history.push("/drugIndent")
    } else if (Roles?.MprSurgicalsView === true || Roles?.accessAll === true) {
      history.push("/mpr-operation")
    } else if (
      Roles?.VeterinaryInspectionsView === true ||
      Roles?.accessAll === true
    ) {
      history.push("/veterinary-inspection")
    } else if (Roles?.SettingsView === true || Roles?.accessAll === true) {
      history.push("/settings")
    } else {
      history.push("/dashboard")
    }
  } catch (error) {
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout)
      yield put(logoutUserSuccess(response))
    }
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(fireBaseBackend.socialLoginUser, data, type)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
