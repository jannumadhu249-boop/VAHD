import React, { useEffect, useState, useRef } from "react"
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
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { URLS } from "../../Url"
import axios from "axios"

const AllocationForm = () => {
  const [token, setToken] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [data, setData] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => {
    const authUser = localStorage.getItem("authUser")
    if (authUser) {
      try {
        const tokenJson = JSON.parse(authUser)
        if (tokenJson && tokenJson.token) {
          setToken(tokenJson.token)
        } else {
          toast.error("Authentication token not found")
        }
      } catch (error) {
        console.error("Error parsing auth token:", error)
        toast.error("Error loading authentication data")
      }
    }
  }, [])

  useEffect(() => {
    if (token) {
      Get()
    }
  }, [token])

  const Get = async () => {
    if (!token) {
      toast.error("Authentication token is missing")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        URLS.GetAllocationForm,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data && response.data.data) {
        setData(response.data.data)
      } else {
        toast.error("No data received from server")
        setData([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error(error.response?.data?.message || "Failed to load data")
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const [editForm, setEditForm] = useState({
    _id: "",
    formName: "",
    itemCode: "",
    group: "",
    image: "",
  })

  const handleChange = e => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, GIF, WEBP)")
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const openEditModal = item => {
    setEditForm({
      _id: item._id || "",
      formName: item.formName || "",
      itemCode: item.itemCode || "",
      group: item.group || "",
      image: item.image || "",
    })

    if (item.image) {
      if (item.image.startsWith("http")) {
        setImagePreview(item.image)
      } else {
        setImagePreview(URLS.Base ? `${URLS.Base}${item.image}` : item.image)
      }
    } else {
      setImagePreview("")
    }

    setImageFile(null)
    setShowEditModal(true)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditForm({
      _id: "",
      formName: "",
      itemCode: "",
      group: "",
      image: "",
    })
    setImagePreview("")
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleEditSubmit = async e => {
    e.preventDefault()

    setIsUpdating(true)

    try {
      const formData = new FormData()
      formData.append("formName", editForm.formName)
      formData.append("itemCode", editForm.itemCode)
      formData.append("group", editForm.group)

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await axios.put(
        `${URLS.EditAllocationForm}${editForm._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully")
        closeEditModal()
        Get()
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message || "Bad request")
        } else if (error.response.status === 401) {
          toast.error("Unauthorized. Please login again.")
        } else if (error.response.status === 404) {
          toast.error("Item not found")
        } else {
          toast.error(error.response.data.message || "Update failed")
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.")
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setEditForm(prev => ({
      ...prev,
      image: "",
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getImageUrl = imagePath => {
    if (!imagePath) return ""
    if (imagePath.startsWith("http")) return imagePath
    return URLS.Base ? `${URLS.Base}${imagePath}` : imagePath
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Allocation Form" />
          <Modal isOpen={showEditModal} toggle={closeEditModal} size="lg">
            <ModalHeader toggle={closeEditModal}>
              Edit Allocation Form
            </ModalHeader>
            <Form onSubmit={handleEditSubmit}>
              <ModalBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>
                        Group Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        required
                        name="group"
                        type="text"
                        value={editForm.group}
                        placeholder="Enter Group Name"
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>
                        Item Code <span className="text-danger">*</span>
                      </Label>
                      <Input
                        required
                        name="itemCode"
                        type="text"
                        value={editForm.itemCode}
                        placeholder="Enter Item Code"
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>
                        Form Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        required
                        name="formName"
                        type="text"
                        value={editForm.formName}
                        placeholder="Enter Form Name"
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Form Image</Label>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Input
                          innerRef={fileInputRef}
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isUpdating}
                        />
                        {(imagePreview || editForm.image) && (
                          <Button
                            type="button"
                            color="danger"
                            size="sm"
                            onClick={removeImage}
                            disabled={isUpdating}
                          >
                            <i className="bx bx-trash"></i>
                          </Button>
                        )}
                      </div>
                      <small className="text-muted">
                        Supported formats: JPG, PNG, GIF, WEBP. Max size: 5MB
                      </small>
                    </FormGroup>
                    {(imagePreview || editForm.image) && (
                      <div className="mt-3">
                        <Label>Image Preview</Label>
                        <div
                          className="border rounded p-2"
                          style={{ maxWidth: "300px" }}
                        >
                          <img
                            src={imagePreview || getImageUrl(editForm.image)}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{
                              maxHeight: "150px",
                              width: "auto",
                              display: "block",
                              margin: "0 auto",
                            }}
                            onError={e => {
                              e.target.onerror = null
                              e.target.src =
                                "https://via.placeholder.com/150?text=No+Image"
                            }}
                          />
                          <div className="text-center mt-2">
                            <small className="text-muted">
                              {imageFile
                                ? "New image selected"
                                : "Current image"}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="secondary"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col>
                      <h5 className="mb-0">Allocation Form List</h5>
                      <p className="text-muted mb-0">
                        Manage your allocation forms
                      </p>
                    </Col>
                    <Col className="text-end">
                      <Button
                        color="primary"
                        onClick={Get}
                        disabled={loading || !token}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-refresh me-2"></i>
                            Refresh
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2">Loading allocation forms...</p>
                    </div>
                  ) : data.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bx bx-package display-4 text-muted"></i>
                      <p className="mt-2">No allocation forms found</p>
                      <Button color="primary" onClick={Get} className="mt-2">
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover bordered>
                        <thead className="table-light">
                          <tr className="text-center">
                            <th> S.No </th>
                            <th>Image</th>
                            <th>Group Name</th>
                            <th>Item Code</th>
                            <th>Form Name</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => (
                            <tr
                              key={item._id || index}
                              className="text-center align-middle"
                            >
                              <td>{index + 1}</td>
                              <td>
                                {item.image ? (
                                  <div
                                    className="d-flex justify-content-center mx-auto"
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      window.open(
                                        getImageUrl(item.image),
                                        "_blank"
                                      )
                                    }
                                  >
                                    <img
                                      src={getImageUrl(item.image)}
                                      alt={item.formName}
                                      className="img-thumbnail"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      onError={e => {
                                        e.target.onerror = null
                                        e.target.src =
                                          "https://via.placeholder.com/60?text=No+Img"
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className="bg-light d-flex align-items-center justify-content-center rounded mx-auto"
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                    }}
                                  >
                                    <i
                                      className="bx bx-image text-muted"
                                      style={{ fontSize: "24px" }}
                                    ></i>
                                  </div>
                                )}
                              </td>
                              <td>{item.group || "-"}</td>
                              <td>{item.itemCode || "-"}</td>
                              <td>{item.formName || "-"}</td>
                              <td>
                                {Roles?.AllocationFormEdit === true ||
                                Roles?.accessAll === true ? (
                                  <>
                                    <Button
                                      onClick={() => openEditModal(item)}
                                      size="sm"
                                      color="info"
                                      className="me-1"
                                    >
                                      <i className="bx bx-edit me-1"></i> Edit
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
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </React.Fragment>
  )
}

export default AllocationForm
