import React, { useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  Form,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

const Quarter = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [data, setData] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    quarter: "",
    financialYearId: "",
    search: "",
  })

  const [form1, setForm1] = useState({
    _id: "",
    startDate: "",
    endDate: "",
    quarter: "",
    financialYearId: "",
    financialYear: "",
  })

  useEffect(() => {
    Get()
    GetFinancialyear()
  }, [])

  const Get = () => {
    const token = TokenData
    axios
      .post(
        URLS.GetQuarter,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setData(res.data.data)
      })
      .catch(error => {
        console.error("Error fetching Quarter:", error)
        toast.error("Failed to load data")
      })
  }

  const GetFinancialyear = () => {
    const token = TokenData
    axios
      .post(
        URLS.GetFinancialyear,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setFinancialYears(res.data.data)
      })
      .catch(error => {
        console.error("Error fetching Financial Years:", error)
        toast.error("Failed to load financial years")
      })
  }

  const SearchData = e => {
    const value = e.target.value
    setForm(prev => ({ ...prev, search: value }))

    if (value.trim() === "") {
      Get()
      return
    }

    const token = TokenData
    axios
      .post(
        URLS.GetQuarterSearch + value,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setData(res.data.data)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(data.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const AddPopUp = () => {
    setShow(true)
    setShow1(false)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const FormAddSubmit = e => {
    e.preventDefault()

    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error("Start date cannot be after end date")
      return
    }

    AddData()
  }

  const AddData = () => {
    const token = TokenData
    const dataArray = {
      startDate: form.startDate,
      endDate: form.endDate,
      quarter: form.quarter,
      financialYearId: form.financialYearId,
    }

    axios
      .post(URLS.AddQuarter, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message || "Quarter added successfully")
          setShow(false)
          setForm({
            startDate: "",
            endDate: "",
            quarter: "",
            financialYearId: "",
            search: "",
          })
          Get()
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message || "Validation error")
          } else if (error.response.status === 409) {
            toast.error("Quarter already exists for this period")
          } else {
            toast.error("Failed to add quarter")
          }
        } else {
          toast.error("Network error. Please try again.")
        }
      })
  }

  const handleChange1 = e => {
    const { name, value } = e.target
    setForm1(prev => ({ ...prev, [name]: value }))
  }

  const UpdatePopUp = data => {
    const formattedData = {
      ...data,
      startDate: data.startDate ? data.startDate.split("T")[0] : "",
      endDate: data.endDate ? data.endDate.split("T")[0] : "",
    }

    setForm1(formattedData)
    setShow(false)
    setShow1(true)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const FormEditSubmit = e => {
    e.preventDefault()

    if (new Date(form1.startDate) > new Date(form1.endDate)) {
      toast.error("Start date cannot be after end date")
      return
    }

    UpdateData()
  }

  const UpdateData = () => {
    const token = TokenData
    const dataArray = {
      startDate: form1.startDate,
      endDate: form1.endDate,
      quarter: form1.quarter,
      financialYearId: form1.financialYearId,
    }

    axios
      .post(URLS.EditQuarter + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message || "Quarter updated successfully")
          setShow1(false)
          Get()
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message || "Validation error")
          } else if (error.response.status === 404) {
            toast.error("Quarter not found")
          } else if (error.response.status === 409) {
            toast.error("Quarter already exists for this period")
          } else {
            toast.error("Failed to update quarter")
          }
        } else {
          toast.error("Network error. Please try again.")
        }
      })
  }

  const DeleteData = data => {
    const confirmBox = window.confirm(
      "Do you really want to delete this quarter?"
    )
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = data => {
    const token = TokenData
    const remid = data._id

    axios
      .post(
        URLS.DeleteQuarter + remid,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200 || res.status === 204) {
          toast.success(res.data.message || "Quarter deleted successfully")
          Get()
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            toast.error("Quarter not found")
          } else if (error.response.status === 400) {
            toast.error(error.response.data.message || "Cannot delete quarter")
          } else {
            toast.error("Failed to delete quarter")
          }
        } else {
          toast.error("Network error. Please try again.")
        }
      })
  }

  const formatDate = dateString => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Quarter" />
          <Row>
            <Col md={12}>
              {show && (
                <Card className="p-4">
                  <Form onSubmit={FormAddSubmit}>
                    <h5 className="mb-3">Create Quarter</h5>
                    <Row>
                      <Col md="4">
                        <div className="mb-3">
                          <Label>Financial Year</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form.financialYearId}
                            name="financialYearId"
                            required
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="">Select Financial Year</option>
                            {financialYears.map((data, key) => (
                              <option key={key} value={data._id}>
                                {data.year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col md="2">
                        <div className="mb-3">
                          <Label>Quarter Number</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form.quarter}
                            name="quarter"
                            required
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                          </select>
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Start Date</Label>
                          <span className="text-danger">*</span>
                          <Input
                            onChange={handleChange}
                            name="startDate"
                            value={form.startDate}
                            required
                            type="date"
                            placeholder="Start Date"
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>End Date</Label>
                          <span className="text-danger">*</span>
                          <Input
                            onChange={handleChange}
                            name="endDate"
                            value={form.endDate}
                            required
                            type="date"
                            placeholder="End Date"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setShow(false)}
                        color="danger m-1"
                      >
                        Cancel <i className="bx bx-x-circle"></i>
                      </Button>
                      <Button type="submit" color="primary text-white m-1">
                        Submit <i className="bx bx-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              )}
            </Col>
            <Col md={12}>
              {show1 && (
                <Card className="p-4">
                  <Form onSubmit={FormEditSubmit}>
                    <h5 className="mb-3">Edit Quarter</h5>
                    <Row>
                      <Col md="4">
                        <div className="mb-3">
                          <Label>Financial Year</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form1.financialYearId}
                            name="financialYearId"
                            required
                            onChange={handleChange1}
                            className="form-select"
                          >
                            <option value="">Select Financial Year</option>
                            {financialYears.map((data, key) => (
                              <option key={key} value={data._id}>
                                {data.year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col md="2">
                        <div className="mb-3">
                          <Label>Quarter Number</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form1.quarter}
                            name="quarter"
                            required
                            onChange={handleChange1}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                          </select>
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>Start Date</Label>
                          <span className="text-danger">*</span>
                          <Input
                            onChange={handleChange1}
                            name="startDate"
                            value={form1.startDate}
                            required
                            type="date"
                            placeholder="Start Date"
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label>End Date</Label>
                          <span className="text-danger">*</span>
                          <Input
                            onChange={handleChange1}
                            name="endDate"
                            value={form1.endDate}
                            required
                            type="date"
                            placeholder="End Date"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setShow1(false)}
                        color="danger m-1"
                      >
                        Cancel <i className="bx bx-x-circle"></i>
                      </Button>
                      <Button type="submit" color="primary text-white m-1">
                        Update <i className="bx bx-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              )}
            </Col>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      {Roles?.QuarterAdd === true ||
                      Roles?.accessAll === true ? (
                        <>
                          <Button color="primary text-white" onClick={AddPopUp}>
                            Create Quarter <i className="bx bx-plus-circle"></i>
                          </Button>{" "}
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          name="search"
                          value={form.search}
                          onChange={SearchData}
                          type="search"
                          placeholder="Search by quarter or year..."
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4">
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Quarter</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Financial Year</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.length > 0 ? (
                          lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <th scope="row">{pagesVisited + key + 1}</th>
                              <td>{data.quarter}</td>
                              <td>{formatDate(data.startDate)}</td>
                              <td>{formatDate(data.endDate)}</td>
                              <td>{data.financialYear || "N/A"}</td>
                              <td>
                                {Roles?.QuarterEdit === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => UpdatePopUp(data)}
                                      size="md"
                                      className="m-1"
                                      color="info"
                                    >
                                      <div className="d-flex">
                                        <i className="bx bx-edit"></i>
                                      </div>
                                    </Button>
                                  </>
                                ) : (
                                  ""
                                )}

                                {Roles?.QuarterDelete === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      size="md"
                                      className="m-1"
                                      color="danger"
                                      onClick={() => DeleteData(data)}
                                    >
                                      <div className="d-flex">
                                        <i className="bx bx-trash"></i>
                                      </div>
                                    </Button>
                                  </>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {data.length > listPerPage && (
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
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </React.Fragment>
  )
}

export default Quarter
