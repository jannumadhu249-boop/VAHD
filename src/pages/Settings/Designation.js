import React, { useState, useEffect } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { Link, useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"
import {
  CardBody,
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Input,
} from "reactstrap"

function City() {
  const [Data, setDate] = useState([])
  const history = useHistory()

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    GetData()
    datass()
  }, [])

  const [form, setform] = useState({
    search: "",
  })

  const GetData = () => {
    var token = datas
    axios
      .get(URLS.GetDesignation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setDate(res.data.data)
      })
  }

  const SearchData = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
    var token = datas
    axios
      .get(URLS.GetDesignationSearch + `${e.target.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            setDate(res.data.data)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = Data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Data.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const datass = () => {
    const location = sessionStorage.getItem("tost")
    if (location != "") {
      toast(location)
      sessionStorage.clear()
    } else {
      sessionStorage.clear()
    }
  }

  const manageDelete = data => {
    const confirmBox = window.confirm("Do you really want to InActive?")
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = data => {
    var token = datas
    var remid = data._id
    axios
      .post(URLS.DeleteDesignation + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            GetData()
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
  var data = JSON.parse(gets)

  const RoleId = data => {
    sessionStorage.setItem("Roleid", data._id)
    history.push("/edit-designation")
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Designation" />
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      {Roles?.DesignationAdd === true ||
                      Roles?.accessAll === true ? (
                        <>
                          <Link to="/add-designation">
                            <Button color="primary">
                              Add Designation
                              <i className="bx bx-plus-circle"></i>
                            </Button>
                          </Link>
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
                          placeholder="Search..."
                        />
                      </div>
                    </Col>
                  </Row>
                  <div>
                    <div className="table-responsive">
                      <Table className="table table-bordered mb-2 mt-3">
                        <thead>
                          <tr className="text-center">
                            <th>S No</th>
                            <th>Designations Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.map((data, key) => (
                            <tr key={key} className="text-center">
                              <td>{pagesVisited + key + 1}</td>
                              <td>{data.designation}</td>
                              <td>
                                {Roles?.DesignationEdit === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        RoleId(data)
                                      }}
                                      className="m-1 btn-md"
                                      color="info"
                                    >
                                      <i className="bx bx-edit "></i>
                                    </Button>
                                  </>
                                ) : (
                                  ""
                                )}
                                {Roles?.DesignationDelete === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        manageDelete(data)
                                      }}
                                      className="m-1 btn-md"
                                      color="danger"
                                    >
                                      <i className="bx bx-trash"></i>
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
                      <div className="mt-3" style={{ float: "right" }}>
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
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default City
