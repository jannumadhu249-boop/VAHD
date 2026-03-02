import PropTypes from "prop-types"
import React, { useState } from "react"
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import profile from "assets/images/profile-img.png"
import { loginUser } from "../../store/actions"
import logo from "assets/images/fav.png"
import { useFormik } from "formik"
import LoginNav from "./LoginNav"
import * as Yup from "yup"

const Login = props => {
  const dispatch = useDispatch()

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "" || "",
      password: "" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: values => {
      dispatch(loginUser(values, props.history))
    },
  })

  const { error } = useSelector(state => ({
    error: state.Login.error.message,
  }))

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text")
      return
    }
    setPasswordType("password")
  }

  const [passwordType, setPasswordType] = useState("password")

  return (
    <React.Fragment>
      <div className="full-screen-white">
        <div className="account-pages">
          <Container className="pt-3">
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Row>
                  <Col>
                    <img
                      src={
                        "https://vahd.telangana.gov.in/Assets/Site/images/logo.png"
                      }
                      alt=""
                      style={{ height: "100px", width: "100px" }}
                    />
                  </Col>
                  <Col>
                    <img
                      src={
                        "https://vahd.telangana.gov.in/Assets/Site/images/logo2.png"
                      }
                      alt=""
                      style={{ height: "100px", width: "100px" }}
                    />
                  </Col>
                  <Col>
                    <img
                      src={
                        "https://vahd.telangana.gov.in/Assets/images/TeRa.jpeg"
                      }
                      alt=""
                      style={{ height: "100px", width: "100px" }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={3}>
                <div
                  className="card mt-5"
                  style={{
                    boxShadow: "none",
                  }}
                >
                  <div className="card-body text-center">
                    <img
                      src="https://vahd.telangana.gov.in/Assets/Site/images/cm.png"
                      alt="John"
                    />
                    <br></br>
                    <span>
                      <font color="#da0f32">
                        <b>Sri Anumula Revanth Reddy</b>
                      </font>
                    </span>
                    <p className="title">Hon'ble Chief Minister</p>
                  </div>
                </div>
              </Col>
              <Col md={8} lg={6} xl={5}>
                <LoginNav />
                <Card
                  className="overflow-hidden mt-0"
                  style={{ borderRadius: "0px" }}
                >
                  <div className="bg-primary bg-soft">
                    <Row className="p-3">
                      <Col xs={12}>
                        <div className="text-primary p-4">
                          <h5 className="text-primary"> VAHD ADMIN Login</h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <Link to="/" className="auth-logo-light">
                        <div className="avatar-md profile-user-wid pb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={logo}
                              alt=""
                              className="rounded-circle"
                              height="50px"
                              width="50px"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      <Form
                        className="form-horizontal"
                        onSubmit={e => {
                          e.preventDefault()
                          validation.handleSubmit()
                          return false
                        }}
                      >
                        {error ? (
                          <Alert color="danger">
                            {
                              "Please provide a valid email address or phone number"
                            }
                          </Alert>
                        ) : null}

                        <div className="pb-3">
                          <Label className="form-label">
                            Email / Employee ID / Mobile Number
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter Email / Employee ID / Mobile Number"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                                validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                            validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="pb-3">
                          <Label className="form-label">Password</Label>
                          <div className="pb-3 input-group">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              // type="password"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                  validation.errors.password
                                  ? true
                                  : false
                              }
                              type={passwordType}
                            />
                            <div className="input-group-btn">
                              <button
                                type="button"
                                className="btn btn-outline-light"
                                onClick={() => {
                                  togglePassword()
                                }}
                                style={{ boxShadow: "none" }}
                              >
                                {passwordType === "password" ? (
                                  <i
                                    className="fa fa-eye-slash"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <i className="fa fa-eye" aria-hidden="true" />
                                )}
                              </button>
                            </div>
                            {validation.touched.password &&
                              validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-end mb-3">
                          <Link to="/forgot-password" className="text-muted forgot-password-link">
                            Forgot password?
                          </Link>
                        </div>

                        <div className="pt-3 d-grid">
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Log In
                          </button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className=" text-center">
                  <p>© {new Date().getFullYear()} VAHD ADMIN</p>
                </div>
              </Col>
              <Col md={3}>
                <div
                  className="card  mt-5"
                  style={{
                    boxShadow: "none",
                  }}
                >
                  <div className="card-body text-center">
                    <img
                      src="https://vahd.telangana.gov.in/Assets/Site/images/Minister.png"
                      alt="Minister Image"
                    />
                    <br></br>
                    <span>
                      <font color="#da0f32">
                        <b>Sri. Vakiti Srihari</b>
                      </font>
                    </span>
                    <p className="title">
                      Hon'ble Minister for Animal Husbandry, Dairy Development
                      and Fisheries, Sports and Youth Services
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
