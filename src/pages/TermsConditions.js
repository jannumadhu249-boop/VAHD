import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { URLS } from "../Url"
import axios from "axios"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
} from "reactstrap"

const TermsAndConditions = () => {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTermsAndConditions()
  }, [])

  const getTermsAndConditions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(URLS.GetTermsAndConditions, {}, {})

      if (response.data && response.data.data) {
        setText(response.data.data.termsAndConditions || "")
      }
    } catch (error) {
      console.error("Error fetching terms and conditions:", error)
      const errorMsg =
        error.response?.data?.message || "Failed to load terms and conditions"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <div className="container mt-4">
        <Row className="justify-content-center">
          <Col lg={12} xl={12}>
            <Card>
              <CardHeader className=" text-white bg-primary">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm me-3">
                    <div className="avatar-title rounded-circle bg-white bg-opacity-25 text-white ">
                      <i className="bx bx-file-blank"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-white fw-bold">
                      Terms & Conditions
                    </h4>
                    <p className="mb-0 text-white-50 small">
                      <i className="bx bx-time-five me-1"></i>
                      Last updated:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {loading ? (
                  <div className="text-center py-5 my-5">
                    <Spinner
                      color="primary"
                      style={{ width: "3rem", height: "3rem" }}
                    />
                    <p className="text-muted mt-4 mb-0 fw-medium">
                      Loading content...
                    </p>
                  </div>
                ) : error ? (
                  <div className="p-5">
                    <Alert color="danger" className="border-0 shadow-sm">
                      <div className="d-flex align-items-center">
                        <i className="bx bx-error-circle fs-3 me-3"></i>
                        <div>
                          <h5 className="alert-heading mb-1">
                            Error Loading Content
                          </h5>
                          <p className="mb-0">{error}</p>
                        </div>
                      </div>
                    </Alert>
                  </div>
                ) : text ? (
                  <div className="terms-content-wrapper">
                    <div
                      className="terms-content p-5"
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-5 my-5">
                    <div className="mb-4">
                      <i
                        className="bx bx-file text-muted"
                        style={{ fontSize: "5rem", opacity: 0.3 }}
                      ></i>
                    </div>
                    <h5 className="text-muted">No content available</h5>
                    <p className="text-muted small">
                      Terms and conditions have not been set yet.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default TermsAndConditions
