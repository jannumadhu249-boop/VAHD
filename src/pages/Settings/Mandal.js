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
  FormGroup,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import Select from "react-select"
import { CSVLink } from "react-csv"
import { URLS } from "../../Url"
import axios from "axios"

const Mandal = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [data, setData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [district, setDistrict] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  const [form, setForm] = useState({
    name: "",
    districtId: "",
    search: "",
  })

  const [form1, setForm1] = useState({
    _id: "",
    name: "",
    districtId: "",
    districtName: "",
  })

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 34,
      height: 34,
      paddingLeft: 2,
      fontSize: 14,
      borderRadius: 8,
      borderColor: state.isFocused ? "#2563eb" : "#d0d7e2",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
      transition: "0.25s",
      "&:hover": {
        borderColor: "#b8c2d3",
      },
    }),
    valueContainer: base => ({
      ...base,
      padding: "0 8px",
    }),
    indicatorsContainer: base => ({
      ...base,
      height: 34,
    }),
    option: base => ({
      ...base,
      fontSize: 14,
      padding: "8px 12px",
    }),
    placeholder: base => ({
      ...base,
      fontSize: 14,
      color: "#94a3b8",
    }),
  }

  useEffect(() => {
    Get()
    GetDistrict()
  }, [])

  useEffect(() => {
    // Transform district data to react-select options
    const options = district.map(dist => ({
      value: dist._id,
      label: dist.name,
    }))
    setDistrictOptions(options)
  }, [district])

  const prepareCSVData = (mandals) => {
    const csvRows = mandals.map((mandal, index) => ({
      "S.No": index + 1,
      "Mandal Name": mandal.name || "",
      "District Name": mandal.districtName || "",
      "Created At": mandal.createdAt ? new Date(mandal.createdAt).toLocaleDateString() : "",
      "Updated At": mandal.updatedAt ? new Date(mandal.updatedAt).toLocaleDateString() : "",
    }))
    setCsvData(csvRows)
  }

  const Get = () => {
    const token = TokenData
    axios
      .post(
        URLS.GetMandal,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setData(res.data.mandals)
        prepareCSVData(res.data.mandals)
      })
      .catch(error => {
        console.error("Error fetching mandals:", error)
      })
  }

  const GetDistrict = () => {
    const token = TokenData
    axios
      .get(URLS.GetDistrict, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setDistrict(res.data.data)
      })
      .catch(error => {
        console.error("Error fetching districts:", error)
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
        URLS.GetMandalSearch + value,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setData(res.data.mandals)
          prepareCSVData(res.data.mandals)
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

  const handleSelectChange = (selectedOption, { name }) => {
    if (name === "districtId") {
      setForm(prev => ({
        ...prev,
        districtId: selectedOption ? selectedOption.value : "",
      }))
    }
  }

  const handleSelectChange1 = (selectedOption, { name }) => {
    if (name === "districtId") {
      setForm1(prev => ({
        ...prev,
        districtId: selectedOption ? selectedOption.value : "",
      }))
    }
  }

  const FormAddSubmit = e => {
    e.preventDefault()
    AddData()
  }

  const AddData = () => {
    const token = TokenData
    const dataArray = {
      name: form.name,
      districtId: form.districtId,
    }

    axios
      .post(URLS.AddMandal, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShow(false)
          setForm({
            name: "",
            districtId: "",
            search: "",
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
    // Find the district option for pre-selecting in react-select
    const selectedDistrict = districtOptions.find(
      opt => opt.value === data.districtId
    )

    setForm1({
      ...data,
      districtId: selectedDistrict ? selectedDistrict.value : "",
    })
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
      districtId: form1.districtId,
    }

    axios
      .put(URLS.EditMandal + form1._id, dataArray, {
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
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = data => {
    const token = TokenData
    const remid = data._id

    axios
      .delete(URLS.DeleteMandal + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
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

  // Get current selected district for forms
  const getCurrentDistrict = () => {
    return districtOptions.find(opt => opt.value === form.districtId) || null
  }

  const getCurrentDistrict1 = () => {
    return districtOptions.find(opt => opt.value === form1.districtId) || null
  }

  const csvReport = {
    filename: `Mandals_${new Date().toISOString().split("T")[0]}.csv`,
    data: csvData,
    headers: [
      { label: "S.No", key: "S.No" },
      { label: "Mandal Name", key: "Mandal Name" },
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
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Mandal" />
          <Row>
            <Col md={12}>
              {show && (
                <Card className="p-4">
                  <Form onSubmit={FormAddSubmit}>
                    <h5 className="mb-3">Create</h5>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            District Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="districtId"
                            value={getCurrentDistrict()}
                            onChange={handleSelectChange}
                            options={districtOptions}
                            styles={selectStyles}
                            placeholder="Select District"
                            isSearchable
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <Label>Name</Label>
                        <span className="text-danger">*</span>
                        <Input
                          onChange={handleChange}
                          name="name"
                          value={form.name}
                          required
                          type="text"
                          placeholder="Enter Name"
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
                    <h5 className="mb-3">Edit</h5>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            District Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="districtId"
                            value={getCurrentDistrict1()}
                            onChange={handleSelectChange1}
                            options={districtOptions}
                            styles={selectStyles}
                            placeholder="Select District"
                            isSearchable
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <Label>Name</Label>
                        <span className="text-danger">*</span>
                        <Input
                          required
                          name="name"
                          type="text"
                          value={form1.name}
                          placeholder="Enter Name"
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
                        Submit <i className="bx bx-check-circle"></i>
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
                      {Roles?.MandalAdd === true ||
                      Roles?.accessAll === true ? (
                        <>
                          <Button color="primary text-white" onClick={AddPopUp}>
                            Create Mandal <i className="bx bx-plus-circle"></i>
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
                          <th>District Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.length > 0 ? (
                          lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <th scope="row">{pagesVisited + key + 1}</th>
                              <td>{data.name}</td>
                              <td>{data.districtName}</td>
                              <td>
                                {Roles?.MandalEdit === true ||
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

                                {Roles?.MandalDelete === true ||
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
                            <td colSpan="4" className="text-center">
                              No mandals found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {pageCount > 1 && (
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
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Mandal