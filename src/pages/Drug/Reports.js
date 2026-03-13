import React from "react"
import { Link } from "react-router-dom"
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap"

const Reports = () => {
  // Get roles from localStorage
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = {
    ...(data?.rolesAndPermission?.[0] ?? {}),
    accessAll: data?.accessAll ?? data?.rolesAndPermission?.[0]?.accessAll ?? false,
  }
  // If no permissions found at all, give access to all
  if (!data?.rolesAndPermission?.[0] || Object.keys(Roles).length <= 1) {
    Roles = { accessAll: true }
  }

  // Function to save filters to localStorage when clicking on reports
  const handleReportsClick = () => {
    const filters = {
      institutionTypeId: localStorage.getItem("saved_institutionTypeId") || "",
      workingPlaceId: localStorage.getItem("saved_workingPlaceId") || "",
      financialYearId: localStorage.getItem("saved_financialYearId") || "",
      schemeId: localStorage.getItem("saved_schemeId") || "",
      quarterId: localStorage.getItem("saved_quarterId") || "",
    }

    // Save filters to appropriate localStorage keys for report pages
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value)
      } else {
        localStorage.removeItem(key)
      }
    })
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-0">
              {/* <i className="bx bx-bar-chart-alt me-2"></i> */}
              <i className='bx bx-user-check'></i>
              Attendance Reports
            </h4>
          </div>
        </div>

        <>
        <CardBody>
          <Row>
              {(Roles?.CompleteAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/attendance-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Attendance Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DetailEmployeeAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/detail-employee-attendance-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Detail Employee Attendance Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/detail-attendance-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Detail Attendance Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/district-wise-attendance-count"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          District Wise Attendance
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/detail-attendance-report-time"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Detail Attendance Report With Time
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/district-wise-attendance-count-time"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          District Wise Attendace Abstract With Time 
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}
          </Row>
        </CardBody>
        </>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-0">
              <i className="bx bx-bar-chart-alt me-2"></i>
              Group Reports
            </h4>
          </div>
        </div>

        < >
          <CardBody>
            <Row>
              {(Roles?.InstitutionReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/groups-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Institution Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DistrictWiseDVAHOReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/district-wise-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          District Wise DVAHO Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.GroupWiseDistrictReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/group-wise-district-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Group Wise District Indent Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DistrictWiseAbstractReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/district-wise-abstract"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          District Wise Abstract Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DistrictWiseInstCountReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/district-wise-inst-count"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          District Wise Institution Count Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.InstitutionDrugReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/drugs-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Institution-wise Drug Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.InstitutionProgressReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/placeofworking-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Institution Progress Reports
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DrugReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/drug-wise-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          District Wise Drug Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.InstitutionProgressAbstractView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/abstract-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Institution Progress Abstract
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.InventoryManagementView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/inventory-management"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Inventory Management
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DetailedDrugReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/detailed-drug-report"
                    className="text-decoration-none"
                    onClick={handleReportsClick}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-file text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Detailed Drug Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.DocumentManagementView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/documents"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Document Management
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}
              {/* {(Roles?.CompleteAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/attendance-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Attendance Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}
              {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/detail-attendance-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Detail Attendance Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}
              {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/district-wise-attendance-count"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          District Wise Attendance
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )} */}
              {(Roles?.CaseTreatedReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/case-treated-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-folder text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Case Treated Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.ArtificialInseminationReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/artificial-insemination-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-dna text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Artificial Insemination Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.FodderReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/fodder-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="fas fa-seedling text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Fodder Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}

              {(Roles?.FarmersReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/farmers-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-user text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Farmers Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}


              {(Roles?.FarmersAbstractReportView === true || Roles?.accessAll === true) && (
                <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
                  <Link
                    to="/farmers-abstract-report"
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{ width: 70, height: 70 }}
                          >
                            <i
                              className="bx bx-user text-primary"
                              style={{ fontSize: "2rem" }}
                            ></i>
                          </div>
                        </div>
                        <h6 className="text-dark fw-semibold mb-0">
                          Farmers Abstract Report
                        </h6>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )}


            </Row>


          </CardBody>
        </>
      </div>
    </div>
  )
}

export default Reports