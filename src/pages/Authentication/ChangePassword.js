import React, { useState, useEffect } from "react"
import Breadcrumb from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import pback from "../../assets/images/pback.jpg"
import "react-toastify/dist/ReactToastify.css"
import { withRouter } from "react-router-dom"
import { useSelector } from "react-redux"
import { URLS } from "../../Url"
import axios from "axios"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  FormGroup,
  Input,
  Form,
} from "reactstrap"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const UserProfile = () => {
  // State management
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [passwordVisibility, setPasswordVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [adminInfo, setAdminInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Get auth data from localStorage
  const authData = JSON.parse(localStorage.getItem("authUser"))
  const token = authData?.token

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(
        URLS.getProfile,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setAdminInfo(response.data.profile)
    } catch (error) {
      toast.error("Failed to fetch profile data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Handle form input changes
  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Toggle password visibility
  const togglePasswordVisibility = field => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Handle password change submission
  const handleSubmit = async e => {
    e.preventDefault()

    if (form.new_password !== form.confirm_password) {
      toast.error("New password and confirm password don't match")
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("password", form.old_password)
      formData.append("newpassword", form.new_password)
      formData.append("confirmpassword", form.confirm_password)

      const response = await axios.post(URLS.ChangePass, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success(response.data.message)
        setForm({
          old_password: "",
          new_password: "",
          confirm_password: "",
        })
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Password change failed")
      } else {
        toast.error("Network error. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }))

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="VAHD ADMIN Super Admin"
          breadcrumbItem="Change Password"
        />

        <Row>
          <Col lg="12">
            {/* Error/Success Alerts */}
            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{success}</Alert>}

            <Card>
              <CardBody>
                {/* Profile Header with Background */}
                <div className="profile-header">
                  <img
                    src={pback}
                    alt="Profile background"
                    className="profile-background img-fluid"
                  />
                </div>

                {/* Profile Info Section */}
                <div className="profile-info mt-3">
                  <Row className="align-items-center">
                    <Col md={2} className="text-center">
                      <div className="profile-avatar-container">
                        <img
                          src={
                            adminInfo.image
                              ? `${URLS.Base}${adminInfo.image}`
                              : "https://via.placeholder.com/150"
                          }
                          className="profile-avatar rounded-circle img-thumbnail"
                          alt="Profile"
                          onError={e => {
                            e.target.src = "https://via.placeholder.com/150"
                          }}
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="profile-details">
                        <h4 className="profile-name">
                          {adminInfo.name || "User Name"}
                        </h4>
                        <p className="profile-email text-muted">
                          <i className="mdi mdi-email mr-2"></i>
                          {adminInfo.email || "user@example.com"}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

                <hr className="my-4" />

                {/* Password Change Form */}
                <div className="password-change-section">
                  <h5 className="mb-4">Change Password</h5>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* Current Password */}
                      <Col md={4}>
                        <FormGroup>
                          <Label for="old_password">
                            Current Password{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <div className="input-group">
                            <Input
                              type={
                                passwordVisibility.old ? "text" : "password"
                              }
                              name="old_password"
                              id="old_password"
                              placeholder="Current Password"
                              value={form.old_password}
                              onChange={handleChange}
                              required
                            />
                            <div className="input-group-append">
                              <Button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => togglePasswordVisibility("old")}
                              >
                                {passwordVisibility.old ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </Button>
                            </div>
                          </div>
                        </FormGroup>
                      </Col>

                      {/* New Password */}
                      <Col md={4}>
                        <FormGroup>
                          <Label for="new_password">
                            New Password <span className="text-danger">*</span>
                          </Label>
                          <div className="input-group">
                            <Input
                              type={
                                passwordVisibility.new ? "text" : "password"
                              }
                              name="new_password"
                              id="new_password"
                              placeholder="New Password"
                              value={form.new_password}
                              onChange={handleChange}
                              required
                            />
                            <div className="input-group-append">
                              <Button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => togglePasswordVisibility("new")}
                              >
                                {passwordVisibility.new ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </Button>
                            </div>
                          </div>
                        </FormGroup>
                      </Col>

                      {/* Confirm Password */}
                      <Col md={4}>
                        <FormGroup>
                          <Label for="confirm_password">
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <div className="input-group">
                            <Input
                              type={
                                passwordVisibility.confirm ? "text" : "password"
                              }
                              name="confirm_password"
                              id="confirm_password"
                              placeholder="Confirm Password"
                              value={form.confirm_password}
                              onChange={handleChange}
                              required
                            />
                            <div className="input-group-append">
                              <Button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  togglePasswordVisibility("confirm")
                                }
                              >
                                {passwordVisibility.confirm ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </Button>
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="text-right mt-3">
                      <Button
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer position="top-right" autoClose={5000} />
      </Container>
    </div>
  )
}

export default withRouter(UserProfile)
