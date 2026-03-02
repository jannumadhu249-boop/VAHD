import React, { useState } from "react"
import { withRouter, Link, useHistory } from "react-router-dom"
import profile from "../assets/images/profile-img.png"
import { ToastContainer, toast } from "react-toastify"
import logo from "assets/images/fav.png"
import { URLS } from "../Url"
import axios from "axios"
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Input,
  Label,
  Form,
} from "reactstrap"

const DeleteAccount = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    reason: "",
    feedback: "",
    confirmEmail: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  let history = useHistory()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleDeleteAccount = () => {
    const deleteData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      reason: form.reason,
      feedback: form.feedback,
    }

    axios.post(URLS.DeleteAccount, deleteData).then(
      res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          // Clear form and logout
          setForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            reason: "",
            feedback: "",
            confirmEmail: "",
          })

          // Redirect to login page after successful deletion
          setTimeout(() => {
            history.push("/login")
          }, 2000)
        }
      },
      error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else if (error.response && error.response.status === 401) {
          toast.error("Invalid credentials. Please check your password.")
        } else if (error.response && error.response.status === 422) {
          toast.error("Emails do not match.")
        }
      }
    )
  }

  const formsubmit = e => {
    e.preventDefault()

    // Validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Please enter your first and last name.")
      return
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (form.email !== form.confirmEmail) {
      toast.error("Email addresses do not match.")
      return
    }

    if (!form.password) {
      toast.error("Please enter your password.")
      return
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }

    if (!form.reason) {
      toast.error("Please select a reason for deleting your account.")
      return
    }

    if (!confirmDelete) {
      toast.error("Please confirm that you want to delete your account.")
      return
    }

    handleDeleteAccount()
  }

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 ">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={6}>
              <Card className="overflow-hidden">
                <div className="bg-danger bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-danger p-4">
                        <h5 className="text-danger">Delete Account</h5>
                        <p className="mb-0">We're sorry to see you go!</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="#">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Warning:</strong> Deleting your account is permanent
                    and cannot be undone. All your data will be permanently
                    removed.
                  </div>
                  <div className="p-2">
                    <Form className="form-horizontal" onSubmit={formsubmit}>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label">First Name</Label>
                            <Input
                              name="firstName"
                              className="form-control"
                              placeholder="Enter first name"
                              type="text"
                              required
                              onChange={handleChange}
                              value={form.firstName}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label">Last Name</Label>
                            <Input
                              name="lastName"
                              className="form-control"
                              placeholder="Enter last name"
                              type="text"
                              required
                              onChange={handleChange}
                              value={form.lastName}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label">Email Address</Label>
                            <Input
                              name="email"
                              className="form-control"
                              placeholder="Enter your email"
                              type="email"
                              required
                              onChange={handleChange}
                              value={form.email}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label">Confirm Email</Label>
                            <Input
                              name="confirmEmail"
                              className="form-control"
                              placeholder="Confirm email address"
                              type="email"
                              required
                              onChange={handleChange}
                              value={form.confirmEmail}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label">Phone Number</Label>
                            <Input
                              name="phone"
                              className="form-control"
                              placeholder="Enter phone number"
                              type="tel"
                              onChange={handleChange}
                              value={form.phone}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3 position-relative">
                            <Label className="form-label">Password</Label>
                            <Input
                              name="password"
                              className="form-control"
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              required
                              onChange={handleChange}
                              value={form.password}
                            />
                            <span
                              className="position-absolute"
                              style={{
                                right: "10px",
                                top: "38px",
                                cursor: "pointer",
                              }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <i className="fa fa-eye" aria-hidden="true" />
                              ) : (
                                <i
                                  className="fa fa-eye-slash"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <div className="mb-3">
                            <Label className="form-label">
                              Reason for Leaving
                            </Label>
                            <Input
                              name="reason"
                              type="select"
                              className="form-select"
                              required
                              onChange={handleChange}
                              value={form.reason}
                            >
                              <option value="">Select a reason</option>
                              <option value="privacy-concerns">
                                Privacy Concerns
                              </option>
                              <option value="found-alternative">
                                Found Alternative Service
                              </option>
                              <option value="too-expensive">
                                Too Expensive
                              </option>
                              <option value="poor-customer-service">
                                Poor Customer Service
                              </option>
                              <option value="difficult-to-use">
                                Difficult to Use
                              </option>
                              <option value="not-useful">
                                Not Useful Anymore
                              </option>
                              <option value="security-concerns">
                                Security Concerns
                              </option>
                              <option value="too-many-emails">
                                Too Many Emails
                              </option>
                              <option value="other">Other</option>
                            </Input>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <div className="mb-3">
                            <Label className="form-label">
                              Feedback (Optional)
                              <small className="text-muted ms-1">
                                {" "}
                                - What could we have done better?
                              </small>
                            </Label>
                            <Input
                              name="feedback"
                              type="textarea"
                              rows="3"
                              className="form-control"
                              placeholder="Share your feedback to help us improve..."
                              onChange={handleChange}
                              value={form.feedback}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={12} className="text-end">
                          <Link to="/" className="btn btn-secondary me-2">
                            <i className="fas fa-arrow-left me-1"></i>
                            Back to Login
                          </Link>
                          <button
                            className="btn btn-danger"
                            type="submit"
                            disabled={!confirmDelete}
                          >
                            <i className="fas fa-trash-alt me-1"></i>
                            Permanently Delete Account
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p className="text-muted small">
                  <p>
                    © {new Date().getFullYear()} VAHD ADMIN. All rights
                    reserved.
                  </p>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(DeleteAccount)
