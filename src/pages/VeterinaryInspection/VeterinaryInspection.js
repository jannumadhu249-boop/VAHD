import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Button, Table, Badge } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"

function VeterinaryInspection() {
  var GetAuth = localStorage.getItem("authUser")
  var TokenJson = JSON.parse(GetAuth)
  var TokenData = TokenJson.token

  const [inspections, setInspections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVeterinaryInspections()
  }, [])

  const getVeterinaryInspections = () => {
    var token = TokenData
    setLoading(true)
    axios
      .post(
        URLS.GetVeterinaryinspection,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setInspections(res?.data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  const pagesVisited = pageNumber * listPerPage
  const lists = inspections.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(inspections.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const deleteInspection = data => {
    const confirmBox = window.confirm(
      `Do you really want to delete this inspection record?`
    )
    if (confirmBox === true) {
      deleteInspectionData(data)
    }
  }

  const deleteInspectionData = data => {
    var token = TokenData
    var remid = data._id
    axios
      .delete(URLS.DeleteVeterinaryinspection + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            getVeterinaryInspections()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  const getStatusBadge = status => {
    return status ? "success" : "danger"
  }

  const getRegisterBadge = (name, status) => {
    return (
      <Badge color={status ? "success" : "danger"} className="me-1">
        {name}: {status ? "Yes" : "No"}
      </Badge>
    )
  }

  const getProgress = (target, achievement) => {
    if (!target) return null
    const percent = achievement ? Math.round((achievement / target) * 100) : 0
    return (
      <div className="progress mt-1" style={{ height: "5px" }}>
        <div
          className={`progress-bar ${
            percent >= 100 ? "bg-success" : "bg-warning"
          }`}
          role="progressbar"
          style={{ width: `${percent}%` }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    )
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Inspections" />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={6}>
                      <h4 className="card-title">Inspections</h4>
                      <p className="card-title-desc">
                        Manage all Inspection records
                      </p>
                    </Col>
                    <Col md={6} className="text-end">
                      {Roles?.VeterinaryInspectionAdd === true ||
                      Roles?.accessAll === true ? (
                        <>
                          <Link to="/add-veterinary-inspection">
                            <Button color="primary" className="text-white">
                              <i className="bx bx-plus-circle me-2"></i>
                              Add New Inspection
                            </Button>
                          </Link>
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th> S.No </th>
                          <th>Date & Time</th>
                          <th>Staff</th>
                          <th>Registrations</th>
                          <th>Activities</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : lists.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              No inspection records found
                            </td>
                          </tr>
                        ) : (
                          lists.map((data, key) => (
                            <tr key={key}>
                              <td>{pagesVisited + key + 1}</td>
                              <td>
                                <div>
                                  <strong>Date:</strong>{" "}
                                  {new Date(data.dateTime).toLocaleDateString()}
                                  <br />
                                  <strong>Time:</strong>{" "}
                                  {new Date(data.dateTime).toLocaleTimeString()}
                                </div>
                              </td>
                              <td>
                                <div>
                                  {data.staff.map((staff, i) => (
                                    <Badge
                                      key={i}
                                      color={getStatusBadge(
                                        staff.staffAttendance
                                      )}
                                      className="me-1 mb-1"
                                    >
                                      {staff.name}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div>
                                  {getRegisterBadge(
                                    "Patient",
                                    data.patient_register
                                  )}
                                  {getRegisterBadge("AI", data.ai_register)}
                                  {getRegisterBadge(
                                    "Calves",
                                    data.claves_born_register
                                  )}
                                  {getRegisterBadge(
                                    "Fodder",
                                    data.fodder_seed_register
                                  )}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <small className="text-muted d-block">
                                    Cases Treated:{" "}
                                    {data.cases_treated?.achivement || 0}/
                                    {data.cases_treated?.target || 0}
                                    {getProgress(
                                      data.cases_treated?.target,
                                      data.cases_treated?.achivement
                                    )}
                                  </small>
                                  <small className="text-muted d-block">
                                    Castrations:{" "}
                                    {data.castrations?.achivement || 0}/
                                    {data.castrations?.target || 0}
                                    {getProgress(
                                      data.castrations?.target,
                                      data.castrations?.achivement
                                    )}
                                  </small>
                                  <small className="text-muted d-block">
                                    Vaccinations:{" "}
                                    {data.vaccinations?.achivement || 0}/
                                    {data.vaccinations?.target || 0}
                                    {getProgress(
                                      data.vaccinations?.target,
                                      data.vaccinations?.achivement
                                    )}
                                  </small>
                                  <small className="text-muted d-block">
                                    AI Done: {data.ai_done?.achivement || 0}/
                                    {data.ai_done?.target || 0}
                                    {getProgress(
                                      data.ai_done?.target,
                                      data.ai_done?.achivement
                                    )}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  {Roles?.VeterinaryInspectionDelete === true ||
                                  Roles?.accessAll === true ? (
                                    <>
                                      <Button
                                        onClick={() => deleteInspection(data)}
                                        color="danger"
                                        size="sm"
                                        className="btn-icon"
                                        title="Delete"
                                      >
                                        <i className="bx bx-trash "></i>
                                      </Button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                    <Col sm="12">
                      <div
                        className="d-flex mt-3 mb-1"
                        style={{ float: "right" }}
                      >
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          containerClassName={"pagination"}
                          previousLinkClassName={"previousBttn"}
                          nextLinkClassName={"nextBttn"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                        />
                      </div>
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default VeterinaryInspection
