import React, { useEffect, useState } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import { URLS } from "../../Url"
import axios from "axios"
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

const District = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson?.token

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [data, setData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [form, setForm] = useState({
    name: "",
    search: "",
  })
  const [form1, setForm1] = useState({
    _id: "",
    name: "",
  })

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    Get()
  }, [])

  const Get = () => {
    const token = TokenData
    axios
      .get(URLS.GetDistrict, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setData(res.data.data || [])
        prepareCSVData(res.data.data || [])
      })
      .catch(error => {
        console.error("Error fetching districts:", error)
        toast.error("Failed to fetch districts")
      })
  }

  const prepareCSVData = (districts) => {
    const csvRows = districts.map((district, index) => ({
      "S.No": index + 1,
      "District Name": district.name || "",
      "Created At": district.createdAt ? new Date(district.createdAt).toLocaleDateString() : "",
      "Updated At": district.updatedAt ? new Date(district.updatedAt).toLocaleDateString() : "",
    }))
    setCsvData(csvRows)
  }

  const SearchData = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (!value.trim()) {
      Get()
      return
    }

    const token = TokenData
    axios
      .get(URLS.GetDistrictSearch + value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setData(res.data.data || [])
          prepareCSVData(res.data.data || [])
          setPageNumber(0)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const pageCount = Math.ceil(data.length / listPerPage)
  const currentItems = data.slice(pagesVisited, pagesVisited + listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const AddPopUp = () => {
    setShow(!show)
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
    AddData()
  }

  const AddData = () => {
    const token = TokenData
    const dataArray = {
      name: form.name,
    }

    axios
      .post(URLS.AddDistrict, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShow(false)
          setForm({
            name: "",
            search: form.search,
          })
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const handleChange1 = e => {
    const { name, value } = e.target
    setForm1(prev => ({ ...prev, [name]: value }))
  }

  const UpdatePopUp = data => {
    setForm1(data)
    setShow(false)
    setShow1(true)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const FormEditSubmit = e => {
    e.preventDefault()
    UpdateData()
  }

  const UpdateData = () => {
    const token = TokenData
    const dataArray = {
      name: form1.name,
    }

    axios
      .put(URLS.EditDistrict + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShow1(false)
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const DeleteData = data => {
    const confirmBox = window.confirm(
      "Do you really want to delete this district?"
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
        URLS.DeleteDistrict + remid,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const csvReport = {
    filename: `Districts_${new Date().toISOString().split("T")[0]}.csv`,
    data: csvData,
    headers: [
      { label: "S.No", key: "S.No" },
      { label: "District Name", key: "District Name" },
      { label: "Created At", key: "Created At" },
      { label: "Updated At", key: "Updated At" },
    ],
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="District" />
          <Row>
            <Col md={12}>
              {show && (
                <Card className="p-4">
                  <Form onSubmit={FormAddSubmit}>
                    <h5 className="mb-3">Create District</h5>
                    <Row>
                      <Col md="4">
                        <Label>
                          Name <span className="text-danger">*</span>
                        </Label>
                        <Input
                          onChange={handleChange}
                          name="name"
                          value={form.name}
                          required
                          type="text"
                          placeholder="Enter District Name"
                        />
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
                    <h5 className="mb-3">Edit District</h5>
                    <Row>
                      <Col md="4">
                        <Label>
                          Name <span className="text-danger">*</span>
                        </Label>
                        <Input
                          required
                          name="name"
                          type="text"
                          value={form1.name}
                          placeholder="Enter District Name"
                          onChange={handleChange1}
                        />
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
                  <Row className="mb-3">
                    <Col md={6}>
                      {Roles?.DistrictAdd === true ||
                      Roles?.accessAll === true ? (
                        <>
                          <Button color="primary text-white" onClick={AddPopUp}>
                            Create District{" "}
                            <i className="bx bx-plus-circle"></i>
                          </Button>
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="float-end d-flex align-items-center gap-2">
                        <div className="position-relative">
                          <Input
                            name="search"
                            value={form.search}
                            onChange={SearchData}
                            type="search"
                            placeholder="Search..."
                            className="form-control"
                            style={{ minWidth: "200px" }}
                          />
                          <i className="bx bx-search position-absolute top-50 end-0 translate-middle-y me-2"></i>
                        </div>
                        <CSVLink
                          {...csvReport}
                          className="btn btn-success"
                          disabled={data.length === 0}
                        >
                          <i className="bx bx-download me-1"></i>
                          Download CSV
                        </CSVLink>
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4 ">
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length > 0 ? (
                          currentItems.map((data, index) => (
                            <tr key={data._id} className="text-center">
                              <td>{pagesVisited + index + 1}</td>
                              <td>{data.name}</td>
                              <td>
                                {Roles?.DistrictEdit === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => UpdatePopUp(data)}
                                      size="md"
                                      className="m-1"
                                      color="info"
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                  </>
                                ) : (
                                  ""
                                )}
                                {Roles?.DistrictDelete === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      size="md"
                                      className="m-1"
                                      color="danger"
                                      onClick={() => DeleteData(data)}
                                    >
                                      <i className="bx bx-trash"></i>
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
                            <td colSpan="3" className="text-center">
                              No districts found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {pageCount > 1 && (
                      <div className="d-flex justify-content-end mt-3">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          containerClassName={"pagination"}
                          previousLinkClassName={"page-link"}
                          nextLinkClassName={"page-link"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default District