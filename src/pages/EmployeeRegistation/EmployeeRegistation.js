import React, { useState, useEffect } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Employee from "../../assets/images/EmployeeSheet.xlsx"
import { ToastContainer, toast } from "react-toastify"
import { Link, useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
} from "reactstrap"

function EmployeeRegistation() {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token

  const [listPerPage, setListPerPage] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [EmployeeRegistation, setEmployeeRegistation] = useState([])
  const [loading, setLoading] = useState(true)
  const [bulkUploadModal, setBulkUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [form, setform] = useState({})

  const [resetPasswordModal, setResetPasswordModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [resetForm, setResetForm] = useState({
    newpassword: "",
    confirmpassword: "",
  })
  const [resetLoading, setResetLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {
    GetEmployeeRegistation()
    Pop_up()
  }, [])

  const GetEmployeeRegistation = (page = 1) => {
    const token = TokenData
    setLoading(true)
    axios
      .post(
        URLS.GetEmployeeRegistation,
        { page },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setEmployeeRegistation(res?.data.staffs || [])
        setListPerPage(res.data.totalPages)
        setPageNumber(res.data.page)
        setTotalCount(res.data.totalCount)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const SearchData = e => {
    const token = TokenData
    axios
      .post(
        URLS.GetEmployeeRegistationSearch + e.target.value,
        { page: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setEmployeeRegistation(res?.data.staffs || [])
          setListPerPage(res.data.totalPages)
          setPageNumber(res.data.page)
          setTotalCount(res.data.totalCount)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          console.error(error.response.data.message)
        }
      })
  }

  const changePage = ({ selected }) => {
    const newPage = selected + 1
    GetEmployeeRegistation(newPage)
  }

  const EditEmployeeRegistation = data => {
    sessionStorage.setItem("EmployeeRegistationid", data._id)
    history.push("/edit-employee-registation")
    // history.push("/edit-employee-registations")
  }

  const Pop_up = () => {
    const location = sessionStorage.getItem("tost")
    if (location !== "") {
      toast(location)
      sessionStorage.clear()
    } else {
      sessionStorage.clear()
    }
  }

  const DeleteData = data => {
    const confirmBox = window.confirm(
      `Do you really want to delete ${data.name}?`
    )
    if (confirmBox === true) {
      DeleteEmployeeRegistationData(data)
    }
  }

  const DeleteEmployeeRegistationData = data => {
    const token = TokenData
    const remid = data._id
    axios
      .delete(URLS.DeleteEmployeeRegistation + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          GetEmployeeRegistation()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const openResetPasswordModal = employee => {
    setSelectedEmployee(employee)
    setResetForm({
      newpassword: "",
      confirmpassword: "",
    })
    setResetPasswordModal(true)
  }

  const closeResetPasswordModal = () => {
    setResetPasswordModal(false)
    setSelectedEmployee(null)
    setResetForm({
      newpassword: "",
      confirmpassword: "",
    })
  }

  const handleResetFormChange = e => {
    const { name, value } = e.target
    setResetForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const CompareOtp = () => {
    if (!selectedEmployee) {
      toast.error("No employee selected")
      return
    }

    if (resetForm.newpassword !== resetForm.confirmpassword) {
      toast.error("Passwords do not match")
      return
    }

    if (resetForm.newpassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    const dataArray = {
      userId: selectedEmployee._id,
      newpassword: resetForm.newpassword,
      confirmpassword: resetForm.confirmpassword,
    }

    setResetLoading(true)
    const token = TokenData

    axios
      .post(URLS.Resetpassword, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setResetForm({ newpassword: "", confirmpassword: "" })
            closeResetPasswordModal()
          }
          setResetLoading(false)
        },
        error => {
          setResetLoading(false)
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("An error occurred. Please try again.")
          }
        }
      )
  }

  const toggleBulkUploadModal = () => {
    setBulkUploadModal(!bulkUploadModal)
    setSelectedFile(null)
  }

  const handleFileSelect = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleBulkUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    setUploadLoading(true)
    const token = TokenData

    axios
      .post(URLS.BluckUploadEmployeeRegistation, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        if (res.status === 200) {
          setUploadLoading(false)
          toggleBulkUploadModal()
          GetEmployeeRegistation()
          toast.success(res.data.message || "Employees uploaded successfully!")
        }
      })
      .catch(error => {
        setUploadLoading(false)
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Upload failed. Please try again.")
        }
      })
  }

  const handleBulkDelete = () => {
    const confirmBox = window.confirm(
      "Do you really want to delete ALL employees? This action cannot be undone."
    )

    if (confirmBox === true) {
      setLoading(true)
      const token = TokenData

      axios
        .post(
          URLS.BluckEmployeeDelete,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(res => {
          setLoading(false)
          if (res.status === 200) {
            toast.success(
              res.data.message || "All employees deleted successfully!"
            )
            GetEmployeeRegistation()
          }
        })
        .catch(error => {
          setLoading(false)
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Bulk delete failed. Please try again.")
          }
        })
    }
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="VAHD ADMIN"
            breadcrumbItem="Employee List"
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={12} className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="warning"
                              className="text-white"
                              onClick={toggleBulkUploadModal}
                            >
                              <i className="bx bx-upload me-2"></i>
                              Bulk Upload
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="danger"
                              className="text-white"
                              onClick={handleBulkDelete}
                              disabled={
                                EmployeeRegistation.length === 0 || loading
                              }
                            >
                              <i className="bx bx-trash me-2"></i>
                              Bulk Delete
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.EmployeeRegistationAdd === true ||
                          Roles?.accessAll === true ? (
                          <>
                            <Link to="/add-employee-registation">
                              <Button color="primary" className="text-white">
                                <i className="bx bx-plus-circle me-2"></i>
                                Add Employee
                              </Button>
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        <Input
                          name="search"
                          value={form.search}
                          onChange={SearchData}
                          type="text"
                          placeholder="Search..."
                          style={{ width: "200px" }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4 ">
                      <thead className="table-light">
                        <tr>
                          <th> S.No </th>
                          <th>Employee ID</th>
                          <th>Employee</th>
                          <th>Contact</th>
                          <th>Designation</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="text-center">
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
                        ) : EmployeeRegistation.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No employee records found
                            </td>
                          </tr>
                        ) : (
                          EmployeeRegistation.map((data, key) => (
                            <tr key={key}>
                              <td>{(pageNumber - 1) * 10 + key + 1}</td>
                              <td>{data.employeeId}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {data.image && (
                                    <img
                                      src={`${URLS.Base}${data.image}`}
                                      alt={data.name}
                                      className="rounded-circle me-3"
                                      width="40"
                                      height="40"
                                    />
                                  )}
                                  <div>
                                    <h5 className="mb-0">{data.name}</h5>
                                  </div>
                                </div>
                              </td>
                              <td>{data.phone}</td>
                              <td>
                                {data.designationName}
                                <small className="d-block text-muted">
                                  {data.institutionType}
                                </small>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  {Roles?.EmployeeRegistationEdit === true ||
                                    Roles?.accessAll === true ? (
                                    <>
                                      <Button
                                        onClick={() =>
                                          EditEmployeeRegistation(data)
                                        }
                                        color="success"
                                        size="sm"
                                        className="btn-icon"
                                        title="Edit"
                                      >
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {Roles?.accessAll === true ? (
                                    <>
                                      <Button
                                        onClick={() =>
                                          openResetPasswordModal(data)
                                        }
                                        color="info"
                                        size="sm"
                                        className="btn-icon"
                                        title="Reset Password"
                                      >
                                        <i className="bx bx-key"></i>
                                      </Button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {Roles?.EmployeeRegistationDelete === true ||
                                    Roles?.accessAll === true ? (
                                    <>
                                      <Button
                                        onClick={() => DeleteData(data)}
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
                    <div className="mt-3 d-flex justify-content-end">
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={listPerPage}
                        onPageChange={changePage}
                        containerClassName={"pagination"}
                        previousLinkClassName={"page-link"}
                        nextLinkClassName={"page-link"}
                        disabledClassName={"disabled"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        total={totalCount}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
      <Modal isOpen={bulkUploadModal} toggle={toggleBulkUploadModal}>
        <ModalHeader toggle={toggleBulkUploadModal}>
          Bulk Upload Employees
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <h6 className="mb-3">Download Sample Files:</h6>
            <div className="d-flex gap-2">
              <Button color="outline-success" size="sm">
                <a href={Employee}>
                  <i className="bx bx-download me-1"></i>
                  Download XLSX Template
                </a>
              </Button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="fileUpload" className="form-label">
              Upload Employee File (XLSX or CSV)
            </label>
            <input
              type="file"
              className="form-control"
              id="fileUpload"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
            />
            <div className="form-text">
              Supported formats: XLSX, XLS, CSV. Maximum file size: 10MB
            </div>
          </div>
          {selectedFile && (
            <div className="alert alert-info">
              <i className="bx bx-info-circle me-2"></i>
              Selected file: <strong>{selectedFile.name}</strong>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={toggleBulkUploadModal}
            disabled={uploadLoading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleBulkUpload}
            disabled={!selectedFile || uploadLoading}
          >
            {uploadLoading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Uploading...
              </>
            ) : (
              <>
                <i className="bx bx-upload me-2"></i>
                Upload File
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={resetPasswordModal} toggle={closeResetPasswordModal}>
        <ModalHeader toggle={closeResetPasswordModal}>
          Reset Password for {selectedEmployee?.name}
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <p>
              Resetting password for: <strong>{selectedEmployee?.name}</strong>
            </p>
            <p className="text-muted">
              Employee ID: {selectedEmployee?.employeeId}
            </p>
          </div>
          <FormGroup>
            <Label for="newpassword">New Password</Label>
            <Input
              type="text"
              name="newpassword"
              id="newpassword"
              value={resetForm.newpassword}
              onChange={handleResetFormChange}
              placeholder="Enter new password"
            />
          </FormGroup>
          <FormGroup>
            <Label for="confirmpassword">Confirm Password</Label>
            <Input
              type="text"
              name="confirmpassword"
              id="confirmpassword"
              value={resetForm.confirmpassword}
              onChange={handleResetFormChange}
              placeholder="Confirm new password"
            />
          </FormGroup>
          {resetForm.newpassword && resetForm.confirmpassword && (
            <div
              className={`alert ${resetForm.newpassword === resetForm.confirmpassword
                  ? "alert-success"
                  : "alert-danger"
                }`}
            >
              <i
                className={`bx ${resetForm.newpassword === resetForm.confirmpassword
                    ? "bx-check"
                    : "bx-x"
                  } me-2`}
              ></i>
              {resetForm.newpassword === resetForm.confirmpassword
                ? "Passwords match"
                : "Passwords do not match"}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={closeResetPasswordModal}
            disabled={resetLoading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={CompareOtp}
            disabled={
              resetLoading ||
              !resetForm.newpassword ||
              !resetForm.confirmpassword ||
              resetForm.newpassword !== resetForm.confirmpassword
            }
          >
            {resetLoading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Resetting...
              </>
            ) : (
              <>
                <i className="bx bx-key me-2"></i>
                Reset Password
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default EmployeeRegistation
