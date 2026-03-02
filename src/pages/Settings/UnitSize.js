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

const UnitSize = () => {
  var GetAuth = localStorage.getItem("authUser")
  var TokenJson = JSON.parse(GetAuth)
  var TokenData = TokenJson.token

  const [show1, setshow1] = useState(false)
  const [Data, setData] = useState([])

  useEffect(() => {
    Get()
  }, [])

  const Get = () => {
    var token = TokenData
    axios
      .post(
        URLS.GetAllUnitSize,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setData(res.data.unitSize)
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast(error.response.data.message)
        }
      })
  }

  const SearchData = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
    const token = TokenData
    axios
      .post(URLS.GetUnitSizeSearch + `${e.target.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            setData(res.data.unitSize)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const pagesVisited = pageNumber * listPerPage
  const lists = Data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Data.length / listPerPage)
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
      Name: form.name,   // API expects "Name"
    }
    axios
      .post(URLS.AddUnitSize, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow1(false)
            Get()
            setform({
              name: "",
            })
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  // ✅ Fix: initialize as object, not array
  const [form1, setform1] = useState({})

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  // ✅ Fix: map API's "Name" to local "name"
  const UpdatePopUp = data => {
    setform1({
      _id: data._id,
      name: data.Name,   // store as 'name' for input binding
    })
    setshow1(true)
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
    var token = TokenData
    const dataArray = {
      Name: form1.name,   // send back as "Name"
    }
    axios
      .put(URLS.EditUnitSize + '/' + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow1(false)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const DeleteData = unitSize => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(unitSize)
    }
  }

  const Delete = unitSize => {
    var token = TokenData
    var remid = unitSize._id
    axios
      .delete(URLS.DeleteUnitSize + '/' + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            Get()
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
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Unit Size" />
          <Row>
            <Col md={12}>
              {show1 == true ? (
                <Card className="p-4">
                  <Form
                    onSubmit={e => {
                      FormEditSubmit(e)
                    }}
                  >
                    <h5 className="mb-3">Edit Unit Size</h5>
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
                          onChange={e => {
                            handleChange1(e)
                          }}
                        />
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setshow1(!show1)
                        }}
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
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Row>
            {Roles?.SurgicalTypesAdd === true || Roles?.accessAll === true ? (
              <>
                <Col md={4}>
                  <Card className="p-4">
                    <Form
                      onSubmit={e => {
                        FormAddSubmit(e)
                      }}
                    >
                      <h5 className="mb-3">Add Unit Size</h5>
                      <Row>
                        <Col md="12">
                          <Label>Name</Label>
                          <span className="text-danger">*</span>
                          <Input
                            onChange={e => {
                              handleChange(e)
                            }}
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
              </>
            ) : (
              ""
            )}

            <Col md={Roles?.SurgicalTypesAdd || Roles?.accessAll ? 8 : 12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <h5 className="mb-3">Unit Size List</h5>
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
                    <Table hover bordered responsive>
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Name </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.map((unitSize, key) => (
                          <tr key={key} className="text-center">
                            <th scope="row">
                              {pagesVisited + key + 1}
                            </th>
                            <td>{unitSize.Name}</td>  {/* Display API field */}
                            <td>
                              {Roles?.SurgicalTypesEdit === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      UpdatePopUp(unitSize)
                                    }}
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

                              {Roles?.SurgicalTypesDelete === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Button
                                    size="md"
                                    className="m-1"
                                    color="danger"
                                    onClick={() => {
                                      DeleteData(unitSize)
                                    }}
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

export default UnitSize