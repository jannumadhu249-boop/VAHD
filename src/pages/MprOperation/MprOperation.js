import React, { useState, useEffect } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from "reactstrap"
import {
  FiTrash2,
  FiPlusCircle,
  FiMapPin,
  FiCalendar,
  FiClock,
} from "react-icons/fi"

function MprOperation() {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token

  const [mprOperations, setMprOperations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    fetchMprOperations()
    checkPopupMessage()
  }, [])

  const fetchMprOperations = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        URLS.GetMprOperation,
        {},
        {
          headers: { Authorization: `Bearer ${TokenData}` },
        }
      )
      setMprOperations(response?.data?.data || [])
      setError(null)
    } catch (err) {
      setError("Failed to fetchProgress  Report s. Please try again.")
      console.error("Error fetchingProgress  Report s:", err)
    } finally {
      setLoading(false)
    }
  }

  const checkPopupMessage = () => {
    const message = sessionStorage.getItem("tost")
    if (message) {
      toast.success(message)
      sessionStorage.removeItem("tost")
    }
  }

  const handleDelete = async operation => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this Progress  Report record?`
    )

    if (!isConfirmed) return

    try {
      const response = await axios.delete(
        `${URLS.DeleteMprOperation}${operation._id}`,
        {
          headers: { Authorization: `Bearer ${TokenData}` },
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        fetchMprOperations()
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete operation"
      toast.error(errorMsg)
    }
  }

  const pagesVisited = pageNumber * listPerPage
  const displayedOperations = mprOperations.slice(
    pagesVisited,
    pagesVisited + listPerPage
  )

  const pageCount = Math.ceil(mprOperations.length / listPerPage)
  const changePage = ({ selected }) => setPageNumber(selected)

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs
          title="VAHD ADMIN"
          breadcrumbItem="Progress Report Management"
        />

        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">Progress  Report Records</h4>

                  {Roles?.MprSurgicalAdd === true ||
                  Roles?.accessAll === true ? (
                    <>
                      <Link to="/add-Mpr-operation">
                        <Button
                          color="primary"
                          className="d-flex align-items-center"
                        >
                          <FiPlusCircle className="me-2" size={16} />
                          Add Progress  Report
                        </Button>
                      </Link>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                {error && (
                  <Alert color="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <div className="table-rep-plugin mt-4 table-responsive">
                  <Table hover className="table-bordered">
                    <thead>
                      <tr>
                        <th> S.No </th>
                        <th>Place of Working </th>
                        <th>Date & Time</th>
                        <th>Operations</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <Spinner color="primary" />
                            <p className="mt-2 mb-0">Loading operations...</p>
                          </td>
                        </tr>
                      ) : mprOperations.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">
                              No Progress  Report records found
                            </div>
                            <Link
                              to="/add-Mpr-operation"
                              className="btn btn-link mt-2"
                            >
                              Create your first operation
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        displayedOperations.map((operation, index) => (
                          <tr key={operation._id}>
                            <td>{pagesVisited + index + 1}</td>
                            <td style={{ width: "20%" }}>
                              <div>
                                <FiMapPin className="me-2 text-muted" />
                                <span>
                                  {operation.workingPlaceName || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <div className="d-flex align-items-center">
                                  <FiCalendar className="me-2 text-muted" />
                                  <span>{operation.date}</span>
                                </div>
                                <div className="d-flex align-items-center mt-1">
                                  <FiClock className="me-2 text-muted" />
                                  <span>{operation.time}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {operation.mprOperation?.length > 0 ? (
                                <div className="table-rep-plugin mt-4 table-responsive">
                                  <Table size="sm" className="mb-0">
                                    <thead>
                                      <tr>
                                        <th>Item Name</th>
                                        <th>Gender</th>
                                        <th>Count</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {operation.mprOperation.map(
                                        (op, opIndex) => (
                                          <tr key={opIndex}>
                                            <td>{op.itemName || "N/A"}</td>
                                            <td>{op.gender || "N/A"}</td>
                                            <td>{op.count || 0}</td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                              ) : (
                                <Badge color="secondary">No operations</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {Roles?.MprSurgicalDelete === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => handleDelete(operation)}
                                      color="outline-danger"
                                      size="sm"
                                      title="Delete"
                                    >
                                      <FiTrash2 size={14} />
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
                </div>
                {mprOperations.length > listPerPage && (
                  <div className="mt-4 d-flex justify-content-end">
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
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  )
}

export default MprOperation
