import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Label,
  Form,
  FormFeedback,
  Input,
  Spinner,
  Alert,
  FormGroup,
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "assets/images/fav.png";
import { useFormik } from "formik";
import { URLS } from "../../Url";
import * as Yup from "yup";
import axios from "axios";

const ForgetPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Generate OTP, 2: Verify OTP, 3: Reset Password
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [verificationMethod, setVerificationMethod] = useState(""); // 'mobile', 'email', or 'employeeId'
  const [verificationValue, setVerificationValue] = useState(""); // The actual value entered by user

  // Step 1: Generate OTP Form
  const generateOtpValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      verificationId: "",
      inputType: "mobile", // default to mobile
    },
    validationSchema: Yup.object({
      verificationId: Yup.string()
        .test('valid-input', 'Please enter a valid value', function (value) {
          const { inputType } = this.parent;

          if (!value) return false;

          switch (inputType) {
            case 'mobile':
              return /^\d{10}$/.test(value);
            case 'email':
              return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
            case 'employeeId':
              return /^[A-Za-z0-9]+$/.test(value) && value.length >= 3;
            default:
              return false;
          }
        })
        .required("This field is required"),
      inputType: Yup.string()
        .oneOf(['mobile', 'email', 'employeeId'], 'Invalid input type')
        .required("Input type is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setVerificationMethod(values.inputType);
      setVerificationValue(values.verificationId);

      try {
        const response = await axios.post(URLS.ForgotPassword, {
          key: values.verificationId,
        });

        if (response.data.success) {
          // Extract userId from response - adjust based on actual response structure
          const responseUserId = response.data.userId ||
            response.data.data?.userId ||
            response.data.data?._id ||
            response.data.user?._id;

          setUserId(responseUserId);

          // Display success message with appropriate wording
          const methodName = values.inputType === 'mobile' ? 'phone' :
            values.inputType === 'email' ? 'email' :
              'Employee ID';

          toast.success(`OTP sent successfully to your ${methodName}`);
          setStep(2); // Move to OTP verification step
        } else {
          toast.error(response.data.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error("Generate OTP error:", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Step 2: Verify OTP Form
  const verifyOtpValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^\d{4,6}$/, "OTP must be 4-6 digits")
        .required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await axios.post(URLS.VerifyForgotPasswordOTP, {
          userId: userId,
          otp: values.otp,
        });

        if (response.data.success) {
          toast.success("OTP verified successfully");
          setStep(3); // Move to reset password step
        } else {
          toast.error(response.data.message || "OTP verification failed");
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to verify OTP. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Step 3: Reset Password Form
  const resetPasswordValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await axios.post(URLS.ResetForgotPassword, {
          userId: userId,
          newpassword: values.newPassword,
          confirmpassword: values.confirmPassword,
        });

        if (response.data.success) {
          toast.success("Password reset successfully!");

          // Clear form and reset to step 1 after successful reset
          setTimeout(() => {
            generateOtpValidation.resetForm();
            verifyOtpValidation.resetForm();
            resetPasswordValidation.resetForm();
            setStep(1);
            setUserId("");
            setVerificationMethod("");
            setVerificationValue("");
          }, 2000);
        } else {
          toast.error(response.data.message || "Password reset failed");
        }
      } catch (error) {
        console.error("Reset password error:", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Helper to format display text for verification method
  const getVerificationDisplayText = () => {
    switch (verificationMethod) {
      case 'mobile':
        return `phone number ${verificationValue}`;
      case 'email':
        return `email ${verificationValue}`;
      case 'employeeId':
        return `Employee ID ${verificationValue}`;
      default:
        return verificationValue;
    }
  };

  // Helper to get input type specific attributes
  const getInputAttributes = () => {
    const inputType = generateOtpValidation.values.inputType;

    switch (inputType) {
      case 'mobile':
        return {
          placeholder: "Enter 10-digit mobile number",
          maxLength: 10,
          pattern: "[0-9]*",
          onKeyPress: (e) => {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode < 48 || charCode > 57) {
              e.preventDefault();
            }
          }
        };
      case 'email':
        return {
          placeholder: "Enter your email address",
          type: "email",
          autoComplete: "email"
        };
      case 'employeeId':
        return {
          placeholder: "Enter your Employee ID",
          maxLength: 20,
          pattern: "[A-Za-z0-9]*",
          onKeyPress: (e) => {
            const charCode = e.which ? e.which : e.keyCode;
            // Allow alphanumeric characters
            if (!(charCode >= 48 && charCode <= 57) && // numbers
              !(charCode >= 65 && charCode <= 90) && // uppercase
              !(charCode >= 97 && charCode <= 122)) { // lowercase
              e.preventDefault();
            }
          }
        };
      default:
        return {};
    }
  };

  // Render current step form
  const renderCurrentStep = () => {
    switch (step) {
      case 1: // Generate OTP
        return (
          <Form
            className="form-horizontal"
            onSubmit={generateOtpValidation.handleSubmit}
          >
            <div className="mb-3">
              <Label className="form-label">Select Verification Method</Label>
              <FormGroup>
                <div className="d-flex gap-2 mb-3">
                  {['mobile', 'email', 'employeeId'].map((type) => (
                    <Label key={type} check className="flex-fill">
                      <Input
                        type="radio"
                        name="inputType"
                        value={type}
                        checked={generateOtpValidation.values.inputType === type}
                        onChange={generateOtpValidation.handleChange}
                        onBlur={generateOtpValidation.handleBlur}
                        className="me-2"
                      />
                      {type === 'mobile' && 'Mobile Number'}
                      {type === 'email' && 'Email Address'}
                      {type === 'employeeId' && 'Employee ID'}
                    </Label>
                  ))}
                </div>
                {generateOtpValidation.touched.inputType &&
                  generateOtpValidation.errors.inputType ? (
                  <div className="text-danger small">
                    {generateOtpValidation.errors.inputType}
                  </div>
                ) : null}
              </FormGroup>
            </div>

            <div className="mb-3">
              <Label className="form-label">
                {generateOtpValidation.values.inputType === 'mobile' && 'Mobile Number'}
                {generateOtpValidation.values.inputType === 'email' && 'Email Address'}
                {generateOtpValidation.values.inputType === 'employeeId' && 'Employee ID'}
              </Label>
              <Input
                name="verificationId"
                className="form-control"
                {...getInputAttributes()}
                onChange={generateOtpValidation.handleChange}
                onBlur={generateOtpValidation.handleBlur}
                value={generateOtpValidation.values.verificationId || ""}
                invalid={
                  generateOtpValidation.touched.verificationId &&
                  Boolean(generateOtpValidation.errors.verificationId)
                }
                autoFocus
              />
              {generateOtpValidation.touched.verificationId &&
                generateOtpValidation.errors.verificationId ? (
                <FormFeedback type="invalid">
                  {generateOtpValidation.values.inputType === 'mobile' &&
                    'Please enter a valid 10-digit mobile number'}
                  {generateOtpValidation.values.inputType === 'email' &&
                    'Please enter a valid email address'}
                  {generateOtpValidation.values.inputType === 'employeeId' &&
                    'Please enter a valid Employee ID (alphanumeric, min 3 characters)'}
                </FormFeedback>
              ) : null}
              <div className="form-text text-muted small mt-1">
                {generateOtpValidation.values.inputType === 'mobile' &&
                  'Enter your 10-digit mobile number without country code'}
                {generateOtpValidation.values.inputType === 'email' &&
                  'Enter the email address associated with your account'}
                {generateOtpValidation.values.inputType === 'employeeId' &&
                  'Enter your alphanumeric Employee ID'}
              </div>
            </div>

            <Row className="mb-3">
              <Col className="text-end">
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </Col>
            </Row>
          </Form>
        );

      case 2: // Verify OTP
        return (
          <>
            <Alert color="info" className="mb-3">
              <small>
                OTP has been sent to your <strong>{getVerificationDisplayText()}</strong>.
                Enter the verification code below.
              </small>
            </Alert>

            <Form
              className="form-horizontal"
              onSubmit={verifyOtpValidation.handleSubmit}
            >
              <div className="mb-3">
                <Label className="form-label">Verification Code</Label>
                <Input
                  name="otp"
                  className="form-control"
                  placeholder="Enter OTP"
                  type="text"
                  onChange={verifyOtpValidation.handleChange}
                  onBlur={verifyOtpValidation.handleBlur}
                  value={verifyOtpValidation.values.otp || ""}
                  invalid={
                    verifyOtpValidation.touched.otp &&
                    Boolean(verifyOtpValidation.errors.otp)
                  }
                  onKeyPress={(e) => {
                    const charCode = e.which ? e.which : e.keyCode;
                    if (charCode < 48 || charCode > 57) {
                      e.preventDefault();
                    }
                  }}
                  maxLength="6"
                  autoComplete="off"
                  autoFocus
                />
                {verifyOtpValidation.touched.otp &&
                  verifyOtpValidation.errors.otp ? (
                  <FormFeedback type="invalid">
                    {verifyOtpValidation.errors.otp}
                  </FormFeedback>
                ) : null}
                <div className="form-text text-muted small mt-1">
                  Enter the 4-6 digit OTP sent to your {verificationMethod === 'mobile' ? 'mobile' :
                    verificationMethod === 'email' ? 'email' : 'account'}
                </div>
              </div>

              <div className="mb-3 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => {
                    setStep(1);
                  }}
                  disabled={loading}
                >
                  ← Use different method
                </button>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => {
                    // Resend OTP
                    generateOtpValidation.handleSubmit();
                  }}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>

              <Row className="mb-3">
                <Col xs={6}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </button>
                </Col>
                <Col xs={6}>
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </Col>
              </Row>
            </Form>
          </>
        );

      case 3: // Reset Password
        return (
          <Form
            className="form-horizontal"
            onSubmit={resetPasswordValidation.handleSubmit}
          >
            <Alert color="success" className="mb-3">
              <small>
                OTP verified successfully. Now set your new password.
              </small>
            </Alert>

            <div className="mb-3">
              <Label className="form-label">New Password</Label>
              <Input
                name="newPassword"
                className="form-control"
                placeholder="Enter new password (minimum 6 characters)"
                type="password"
                onChange={resetPasswordValidation.handleChange}
                onBlur={resetPasswordValidation.handleBlur}
                value={resetPasswordValidation.values.newPassword || ""}
                invalid={
                  resetPasswordValidation.touched.newPassword &&
                  Boolean(resetPasswordValidation.errors.newPassword)
                }
                autoFocus
              />
              {resetPasswordValidation.touched.newPassword &&
                resetPasswordValidation.errors.newPassword ? (
                <FormFeedback type="invalid">
                  {resetPasswordValidation.errors.newPassword}
                </FormFeedback>
              ) : null}
              <div className="form-text text-muted small mt-1">
                Password must be at least 6 characters long
              </div>
            </div>

            <div className="mb-3">
              <Label className="form-label">Confirm Password</Label>
              <Input
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm new password"
                type="password"
                onChange={resetPasswordValidation.handleChange}
                onBlur={resetPasswordValidation.handleBlur}
                value={resetPasswordValidation.values.confirmPassword || ""}
                invalid={
                  resetPasswordValidation.touched.confirmPassword &&
                  Boolean(resetPasswordValidation.errors.confirmPassword)
                }
              />
              {resetPasswordValidation.touched.confirmPassword &&
                resetPasswordValidation.errors.confirmPassword ? (
                <FormFeedback type="invalid">
                  {resetPasswordValidation.errors.confirmPassword}
                </FormFeedback>
              ) : null}
            </div>

            <Row className="mb-3">
              <Col xs={6}>
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setStep(2)}
                  disabled={loading}
                >
                  Back
                </button>
              </Col>
              <Col xs={6}>
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </Col>
            </Row>
          </Form>
        );

      default:
        return null;
    }
  };

  // Render step title
  const renderStepTitle = () => {
    const titles = {
      1: "Forgot Password",
      2: "Verify OTP",
      3: "Reset Password",
    };
    return titles[step] || "Forgot Password";
  };

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="#" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card
                className="overflow-hidden"
                style={{ borderRadius: "0px" }}
              >
                <div className="bg-primary bg-soft">
                  <Row className="p-3">
                    <Col xs={12}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">
                          VAHD ADMIN {renderStepTitle()}
                        </h5>
                      </div>
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

                  <div className="p-2">
                    {renderCurrentStep()}
                  </div>
                </CardBody>
              </Card>

              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link
                    to="login"
                    className="font-weight-medium text-primary"
                  >
                    Login
                  </Link>
                </p>
                <p>© {new Date().getFullYear()} VAHD ADMIN</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default withRouter(ForgetPasswordPage);