import React, { useEffect, useState } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import Employee from "../../assets/images/villages.xlsx"
import ReactPaginate from "react-paginate"
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"

const Grampanchayath = () => {
  var GetAuth = localStorage.getItem("authUser")
  var TokenJson = JSON.parse(GetAuth)
  var TokenData = TokenJson.token

  const [listPerPage, setListPerPage] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [bulkUploadModal, setBulkUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  const [show1, setshow1] = useState(false)
  const [Data, setData] = useState([])

  useEffect(() => {
    Get()
  }, [])

  const Get = (page = 1) => {
    var token = TokenData
    axios
      .post(
        URLS.GetGrampanchayathPage,
        { page },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setData(res.data.data)
        setListPerPage(res.data.totalPages)
        setPageNumber(res.data.page)
        setTotalCount(res.data.totalCount)
      })
  }

  const changePage = ({ selected }) => {
    const newPage = selected + 1
    Get(newPage)
  }

  const SearchData = e => {
    const myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
    const token = TokenData
    axios
      .post(
        URLS.GetGrampanchayathPageSearch + `${e.target.value}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            setData(res.data.data)
            setListPerPage(res.data.totalPages)
            setPageNumber(res.data.page)
            setTotalCount(res.data.totalCount)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  const [form, setform] = useState({
    Village: "",
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
      Village: form.Village,
    }
    axios
      .post(URLS.AddGrampanchayath, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            setshow1(false)
            Get()
            setform({
              Village: "",
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

  const [form1, setform1] = useState([])

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const UpdatePopUp = data => {
    setform1(data)
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
      Village: form1.Village,
    }
    axios
      .put(URLS.EditGrampanchayath + form1._id, dataArray, {
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

  const DeleteData = data => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = data => {
    var token = TokenData
    var remid = data._id
    axios
      .delete(URLS.DeleteGrampanchayath + remid, {
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
      .post(URLS.BulkUploadGrampanchayath, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        setUploadLoading(false)
        toggleBulkUploadModal()
        toast.success(
          res.data.message || "Grampanchayath uploaded successfully!"
        )
        Get()
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
      "Do you really want to delete ALL Grampanchayath? This action cannot be undone."
    )

    if (confirmBox === true) {
      const token = TokenData

      axios
        .delete(
          URLS.BulkGrampanchayathDelete,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(res => {
          if (res.status === 200) {
            toast.success(
              res.data.message || "All Grampanchayath deleted successfully!"
            )
            Get()
          }
        })
        .catch(error => {
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
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Grampanchayath" />
          <Row>
            <Col md={12}>
              {show1 == true ? (
                <Card className="p-4">
                  <Form
                    onSubmit={e => {
                      FormEditSubmit(e)
                    }}
                  >
                    <h5 className="mb-3">Edit Grampanchayath</h5>
                    <Row>
                      <Col md="6">
                        <Label>Name</Label>
                        <span className="text-danger">*</span>
                        <Input
                          required
                          name="Village"
                          type="text"
                          value={form1.Village}
                          placeholder="Enter Village Name"
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
            {Roles?.GrampanchayathAdd === true || Roles?.accessAll === true ? (
              <>
                <Col md={4}>
                  <Card className="p-4">
                    <Form
                      onSubmit={e => {
                        FormAddSubmit(e)
                      }}
                    >
                      <h5 className="mb-3">Add Grampanchayath </h5>
                      <Row>
                        <Col md="12">
                          <Label>Name</Label>
                          <span className="text-danger">*</span>
                          <Input
                            onChange={e => {
                              handleChange(e)
                            }}
                            name="Village"
                            value={form.Village}
                            required
                            type="text"
                            placeholder="Enter Village Name"
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

            <Col md={Roles?.GrampanchayathAdd || Roles?.accessAll ? 8 : 12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md={4}>
                      <h5 className="mb-3"> Grampanchayath List</h5>
                    </Col>
                    <Col md={8}>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          color="warning"
                          className="text-white"
                          onClick={toggleBulkUploadModal}
                        >
                          <i className="bx bx-upload me-2"></i>
                          Bulk Upload
                        </Button>
                        <Button
                          color="danger"
                          className="text-white"
                          onClick={handleBulkDelete}
                        >
                          <i className="bx bx-trash me-2"></i>
                          Bulk Delete
                        </Button>
                        <Input
                          name="search"
                          value={form.search}
                          onChange={SearchData}
                          type="search"
                          placeholder="Search..."
                          style={{ width: "200px" }}
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
                        {Data.map((data, key) => (
                          <tr key={key} className="text-center">
                            <td>{(pageNumber - 1) * 10 + key + 1}</td>
                            <td>{data.Village}</td>
                            <td>
                              {Roles?.GrampanchayathEdit === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      UpdatePopUp(data)
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
                              {Roles?.GrampanchayathDelete === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Button
                                    size="md"
                                    className="m-1"
                                    color="danger"
                                    onClick={() => {
                                      DeleteData(data)
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
                    {listPerPage > 1 && (
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
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>
      <Modal isOpen={bulkUploadModal} toggle={toggleBulkUploadModal}>
        <ModalHeader toggle={toggleBulkUploadModal}>
          Bulk Grampanchayath
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
              Upload Grampanchayath File (XLSX or CSV)
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
    </React.Fragment>
  )
}

export default Grampanchayath
