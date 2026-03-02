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

const TypeSeeds = () => {
  var GetAuth = localStorage.getItem("authUser")
  var TokenJson = JSON.parse(GetAuth)
  var TokenData = TokenJson.token

  const [show1, setshow1] = useState(false)
  const [Data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState("") 

  useEffect(() => {
    Get()
  }, [])

  // Fixed: use POST to fetch all seeds (as per backend)
  const Get = () => {
    var token = TokenData
    axios
      .post(
        URLS.GetAllTypeSeeds,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setData(res.data.seeds)
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast(error.response.data.message)
        }
      })
  }

  // Client-side search filter
  const filteredData = Data.filter(item =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = e => {
    setSearchTerm(e.target.value)
    setPageNumber(0) 
  }

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const pagesVisited = pageNumber * listPerPage
  const lists = filteredData.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(filteredData.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const [form, setform] = useState({
    name: "",
  })

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const FormAddSubmit = e => {
    e.preventDefault()
    AddData()
  }

  const AddData = () => {
    var token = TokenData
    const dataArray = {
      Name: form.name,
    }
    axios
      .post(URLS.AddTypeSeeds, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow1(false)
            Get()
            setform({ name: "" })
            setSearchTerm("")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const [form1, setform1] = useState({})

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const UpdatePopUp = data => {
    setform1({
      _id: data._id,
      name: data.Name, 
    })
    setshow1(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const FormEditSubmit = e => {
    e.preventDefault()
    UpdateData()
  }

  const UpdateData = () => {
    var token = TokenData
    const dataArray = {
      Name: form1.name,
    }
    axios
      .put(URLS.EditTypeSeeds + '/' + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow1(false)
            Get()
            setSearchTerm("")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const DeleteData = seed => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(seed)
    }
  }

  const Delete = seed => {
    var token = TokenData
    var remid = seed._id
    axios
      .delete(URLS.DeleteTypeSeeds + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            Get()
            setSearchTerm("")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Type of Seeds" />
          <Row>
            <Col md={12}>
              {show1 === true ? (
                <Card className="p-4">
                  <Form onSubmit={FormEditSubmit}>
                    <h5 className="mb-3">Edit Type of Seeds</h5>
                    <Row>
                      <Col md="6">
                        <Label>Name</Label>
                        <span className="text-danger">*</span>
                        <Input
                          required
                          name="name"
                          type="text"
                          value={form1.name || ""}
                          placeholder="Enter Name"
                          onChange={handleChange1}
                        />
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setshow1(!show1)}
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
              ) : null}
            </Col>
          </Row>
          <Row>
            {Roles?.SurgicalTypesAdd === true || Roles?.accessAll === true ? (
              <Col md={4}>
                <Card className="p-4">
                  <Form onSubmit={FormAddSubmit}>
                    <h5 className="mb-3">Add Type Seeds</h5>
                    <Row>
                      <Col md="12">
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
                      <Button type="submit" color="primary text-white m-1">
                        Submit <i className="bx bx-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>
            ) : null}

            <Col md={Roles?.SurgicalTypesAdd || Roles?.accessAll ? 8 : 12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <h5 className="mb-3">Type Seeds List</h5>
                    </Col>
                    <Col>
                      <div style={{ float: "right" }}>
                        <Input
                          name="search"
                          value={searchTerm}
                          onChange={handleSearch}
                          type="search"
                          placeholder="Search..."
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover bordered responsive>
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((seeds, key) => (
                          <tr key={key} className="text-center">
                            <th scope="row">{pagesVisited + key + 1}</th>
                            <td>{seeds.Name}</td>
                            <td>
                              {Roles?.SurgicalTypesEdit === true ||
                              Roles?.accessAll === true ? (
                                <Button
                                  onClick={() => UpdatePopUp(seeds)}
                                  size="md"
                                  className="m-1"
                                  color="info"
                                >
                                  <div className="d-flex">
                                    <i className="bx bx-edit"></i>
                                  </div>
                                </Button>
                              ) : null}
                              {Roles?.SurgicalTypesDelete === true ||
                              Roles?.accessAll === true ? (
                                <Button
                                  size="md"
                                  className="m-1"
                                  color="danger"
                                  onClick={() => DeleteData(seeds)}
                                >
                                  <div className="d-flex">
                                    <i className="bx bx-trash"></i>
                                  </div>
                                </Button>
                              ) : null}
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
                          total={lists.length}
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

export default TypeSeeds