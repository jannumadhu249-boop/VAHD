import React, { useState, useEffect, useRef } from "react"
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
import { Link, useHistory } from "react-router-dom"
import profile from "../../assets/images/profile-img.png"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import { URLS } from "../../Url"
import logo from "assets/images/fav.png"

const Compareotp = () => {
  const [otp, setOtp] = useState(["", "", "", ""])
  const inputRefs = useRef([])
  const history = useHistory()

  const handleChange = (e, index) => {
    const value = e.target.value

    if (/^\d?$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = e => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6)

    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)

      const focusIndex = Math.min(pastedData.length, 6) - 1
      if (focusIndex >= 0) inputRefs.current[focusIndex]?.focus()
    }
  }

  const CompareOtp = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 4-digit OTP")
      return
    }

    const data = {
      userId: sessionStorage.getItem("phone"),
      mobileOtp: otpValue,
    }

    try {
      const res = await axios.post(URLS.OTP, data)
      if (res.status === 200) {
        toast.success(res.data.message)
        setOtp(["", "", "", ""])
        localStorage.setItem("tost", "OTP has been verified successfully.")
        history.push("/Resetpsw")
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  const formsubmit = e => {
    e.preventDefault()
    CompareOtp()
  }

  useEffect(() => {
    const locationMsg = localStorage.getItem("tost")
    if (locationMsg) {
      toast.success(locationMsg)
      localStorage.removeItem("tost")
    }

    inputRefs.current[0]?.focus()
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
                    <Col xs={12}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary"> VAHD ADMIN Verify Otp</h5>
                      </div>
                    </Col>
                    {/* <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col> */}
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
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
                  </div>
                  <div className="p-2">
                    <Form className="form-horizontal" onSubmit={formsubmit}>
                      <div className="mb-3">
                        <Label className="form-label">Enter 4-digit OTP</Label>
                        <div className="d-flex justify-content-between mb-3">
                          {otp.map((digit, index) => (
                            <Input
                              key={index}
                              innerRef={el => (inputRefs.current[index] = el)}
                              className="text-center me-1"
                              style={{ width: "50px", height: "50px" }}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength="1"
                              value={digit}
                              onChange={e => handleChange(e, index)}
                              onKeyDown={e => handleKeyDown(e, index)}
                              onPaste={handlePaste}
                              required
                            />
                          ))}
                        </div>
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md"
                            type="submit"
                          >
                            Verify OTP
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
                  <Link to="/login" className="font-weight-medium text-primary">
                    Login
                  </Link>
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

export default Compareotp
