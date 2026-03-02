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

const Mandal = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [data, setData] = useState([])
  const [designation, setDesignation] = useState([])
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  const [form, setForm] = useState({
    name: "",
    designationId: "",
    search: "",
  })

  const [form1, setForm1] = useState({
    _id: "",
    name: "",
    designationId: "",
    designationName: "",
  })

  useEffect(() => {
    Get()
    GetDesignation()
  }, [])

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
      })
      .catch(error => {
        console.error("Error fetching mandals:", error)
      })
  }

  const GetDesignation = () => {
    const token = TokenData
    axios
      .get(URLS.GetDesignation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setDesignation(res.data.data)
      })
      .catch(error => {
        console.error("Error fetching designations:", error)
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
    AddData()
  }

  const AddData = () => {
    const token = TokenData
    const dataArray = {
      name: form.name,
      designationId: form.designationId,
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
            designationId: "",
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
      designationId: form1.designationId,
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

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Sub Designation" />
          <Row>
            {/* Add Form */}
            <Col md={12}>
              {show && (
                <Card className="p-4">
                  <Form onSubmit={FormAddSubmit}>
                    <h5 className="mb-3">Create</h5>
                    <Row>
                      <Col md="4">
                        <div className="mb-3">
                          <Label>Designation</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form.designationId}
                            name="designationId"
                            required
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {designation.map((data, key) => (
                              <option key={key} value={data._id}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                        </div>
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

            {/* Edit Form */}
            <Col md={12}>
              {show1 && (
                <Card className="p-4">
                  <Form onSubmit={FormEditSubmit}>
                    <h5 className="mb-3">Edit</h5>
                    <Row>
                      <Col md="4">
                        <div className="mb-3">
                          <Label>Designation</Label>
                          <span className="text-danger">*</span>
                          <select
                            value={form1.designationId}
                            name="designationId"
                            required
                            onChange={handleChange1}
                            className="form-select"
                          >
                            <option value="">Select</option>
                            {designation.map((data, key) => (
                              <option key={key} value={data._id}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                        </div>
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

            {/* Data Table */}
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <Button color="primary text-white" onClick={AddPopUp}>
                        Create Mandal <i className="bx bx-plus-circle"></i>
                      </Button>
                    </Col>

                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          name="search"
                          value={form.search}
                          onChange={SearchData}
                          type="search"
                          placeholder="Search..."
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4 ">
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((data, key) => (
                          <tr key={key} className="text-center">
                            <th scope="row">{pagesVisited + key + 1}</th>
                            <td>{data.name}</td>
                            <td>{data.designationName}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
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
        </div>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default Mandal
