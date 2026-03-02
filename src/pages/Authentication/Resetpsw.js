import React, { useState, useEffect } from "react"
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
import { withRouter, Link, useHistory } from "react-router-dom"
import profile from "../../assets/images/profile-img.png"
import { ToastContainer, toast } from "react-toastify"
import logo from "assets/images/fav.png"
import { URLS } from "../../Url"
import axios from "axios"

const Resetpsw = () => {
  const [form, setForm] = useState({ newpassword: "", confirmpassword: "" })
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  let history = useHistory()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const Phone = sessionStorage.getItem("phone")

  const CompareOtp = () => {
    const dataArray = {
      userId: Phone,
      newpassword: form.newpassword,
      confirmpassword: form.confirmpassword,
    }

    axios.post(URLS.Resetpass, dataArray).then(
      res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setForm({ newpassword: "", confirmpassword: "" })
          history.push(
            "/login",
            localStorage.setItem(
              "tost",
              "The password has been reset successfully. Please login with your new password."
            )
          )
        }
      },
      error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      }
    )
  }

  const formsubmit = e => {
    e.preventDefault()

    if (form.newpassword.length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }
    if (form.newpassword !== form.confirmpassword) {
      toast.error("Passwords do not match.")
      return
    }

    CompareOtp()
  }

  const datass = () => {
    const location = localStorage.getItem("tost")
    if (location !== "") {
      toast(location)
      localStorage.clear()
    } else {
      localStorage.clear()
    }
  }

  useEffect(() => {
    datass()
  }, [])

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row className="p-3">
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">
                          VAHD ADMIN Set Password
                        </h5>
                      </div>
                    </Col>
                    {/* <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col> */}
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
                  <div className="p-2">
                    <Form className="form-horizontal" onSubmit={formsubmit}>
                      {/* New Password */}
                      <div className="mb-3 position-relative">
                        <Label className="form-label">New Password</Label>
                        <Input
                          name="newpassword"
                          className="form-control"
                          placeholder="Enter New Password"
                          type={showNewPass ? "text" : "password"}
                          required
                          onChange={handleChange}
                          value={form.newpassword}
                        />
                        <span
                          className="position-absolute"
                          style={{
                            right: "10px",
                            top: "38px",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowNewPass(!showNewPass)}
                        >
                          {showNewPass ? (
                            <i className="fa fa-eye" aria-hidden="true" />
                          ) : (
                            <i className="fa fa-eye-slash" aria-hidden="true" />
                          )}
                        </span>
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-3 position-relative">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmpassword"
                          className="form-control"
                          placeholder="Enter Confirm Password"
                          type={showConfirmPass ? "text" : "password"}
                          required
                          onChange={handleChange}
                          value={form.confirmpassword}
                        />
                        <span
                          className="position-absolute"
                          style={{
                            right: "10px",
                            top: "38px",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                        >
                          {showConfirmPass ? (
                            <i className="fa fa-eye" aria-hidden="true" />
                          ) : (
                            <i className="fa fa-eye-slash" aria-hidden="true" />
                          )}
                        </span>
                      </div>

                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md"
                            type="submit"
                          >
                            Submit
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                <p>
                  <p>© {new Date().getFullYear()} VAHD ADMIN</p>
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

export default withRouter(Resetpsw)
