import React, { useEffect, useState, useCallback, useMemo } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import Select from "react-select"
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
  FormGroup,
} from "reactstrap"

const VillageTown = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])
  const [mandalOptions, setMandalOptions] = useState([])
  const [filteredMandalOptions, setFilteredMandalOptions] = useState([])

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const [form, setForm] = useState({
    name: "",
    mandalId: "",
    districtId: "",
  })

  const [editForm, setEditForm] = useState({
    _id: "",
    name: "",
    mandalId: "",
    districtId: "",
  })

  const getAuthToken = () => {
    try {
      const authUser = localStorage.getItem("authUser")
      if (!authUser) return null
      const tokenJson = JSON.parse(authUser)
      return tokenJson?.token || null
    } catch (error) {
      console.error("Error parsing auth token:", error)
      return null
    }
  }

  const token = getAuthToken()

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

  const pagesVisited = pageNumber * listPerPage
  const pageCount = Math.ceil(data.length / listPerPage)

  const displayedData = useMemo(() => {
    return data.slice(pagesVisited, pagesVisited + listPerPage)
  }, [data, pagesVisited, listPerPage])

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const prepareCSVData = (villages) => {
    const csvRows = villages.map((item, index) => ({
      "S.No": index + 1,
      "Village/Town Name": item.name || "",
      "Mandal Name": item.mandalName || "",
      "District Name": item.districtName || "",
      "Created At": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
      "Updated At": item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "",
    }))
    setCsvData(csvRows)
  }

  const fetchData = useCallback(async () => {
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        URLS.GetVillageTown,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const townsData = response.data.towns || []
      setData(townsData)
      prepareCSVData(townsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to fetch data")
      setData([])
      setCsvData([])
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchDistricts = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.get(URLS.GetDistrict, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const options = (response.data.data || []).map(dist => ({
        value: dist._id,
        label: dist.name,
      }))
      setDistrictOptions(options)
    } catch (error) {
      console.error("Error fetching districts:", error)
      toast.error("Failed to load districts")
    }
  }, [token])

  const fetchMandals = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.post(
        URLS.GetMandal,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const options = (response.data.mandals || []).map(mandal => ({
        value: mandal._id,
        label: mandal.name,
        districtId: mandal.districtId,
      }))
      setMandalOptions(options)
    } catch (error) {
      console.error("Error fetching mandals:", error)
    }
  }, [token])

  const fetchMandalsByDistrict = useCallback(
    async districtId => {
      if (!token || !districtId) return []

      try {
        const response = await axios.post(
          URLS.GetDistrictIdbyMandals,
          { districtId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        return response.data.mandals || []
      } catch (error) {
        console.error("Error fetching mandals by district:", error)
        return []
      }
    },
    [token]
  )

  const handleSearch = useCallback(
    async e => {
      const query = e.target.value
      setSearchQuery(query)

      if (!query.trim()) {
        fetchData()
        return
      }

      if (!token) return

      try {
        const response = await axios.post(
          `${URLS.GetVillageTownSearch}${query}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const townsData = response.data.towns || []
        setData(townsData)
        prepareCSVData(townsData)
        setPageNumber(0)
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message)
        } else {
          console.error("Search error:", error)
        }
      }
    },
    [token, fetchData]
  )

  const handleInputChange = useCallback((e, formType = "add") => {
    const { name, value } = e.target
    if (formType === "add") {
      setForm(prev => ({ ...prev, [name]: value }))
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }))
    }
  }, [])

  const handleDistrictChange = useCallback(
    async (selectedOption, formType = "add") => {
      const districtId = selectedOption?.value || ""

      if (formType === "add") {
        setForm(prev => ({
          ...prev,
          districtId,
          mandalId: "",
        }))
      } else {
        setEditForm(prev => ({
          ...prev,
          districtId,
          mandalId: "",
        }))
      }

      if (selectedOption) {
        const mandals = await fetchMandalsByDistrict(districtId)
        const options = mandals.map(mandal => ({
          value: mandal._id,
          label: mandal.name,
          districtId: mandal.districtId,
        }))

        if (formType === "add") {
          setFilteredMandalOptions(options)
        }
      } else {
        if (formType === "add") {
          setFilteredMandalOptions([])
        }
      }
    },
    [fetchMandalsByDistrict]
  )

  const handleMandalChange = useCallback((selectedOption, formType = "add") => {
    const mandalId = selectedOption?.value || ""
    if (formType === "add") {
      setForm(prev => ({ ...prev, mandalId }))
    } else {
      setEditForm(prev => ({ ...prev, mandalId }))
    }
  }, [])

  const handleAddSubmit = async e => {
    e.preventDefault()

    if (!token) {
      toast.error("Authentication required")
      return
    }

    try {
      const response = await axios.post(URLS.AddVillageTown, form, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(response.data.message)
      setShowAddForm(false)
      resetAddForm()
      fetchData()
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to add village/town")
      }
    }
  }

  const handleEditSubmit = async e => {
    e.preventDefault()

    if (!token || !editForm._id) return

    try {
      const response = await axios.put(
        `${URLS.EditVillageTown}${editForm._id}`,
        {
          name: editForm.name,
          districtId: editForm.districtId,
          mandalId: editForm.mandalId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success(response.data.message)
      setShowEditForm(false)
      fetchData()
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to update village/town")
      }
    }
  }

  const handleDelete = useCallback(
    async item => {
      if (!token) return

      const confirmDelete = window.confirm(
        "Do you really want to delete this item?"
      )
      if (!confirmDelete) return

      try {
        const response = await axios.delete(
          `${URLS.DeleteVillageTown}${item._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        toast.success(response.data.message)
        fetchData()
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to delete village/town")
        }
      }
    },
    [token, fetchData]
  )

  const resetAddForm = () => {
    setForm({
      name: "",
      mandalId: "",
      districtId: "",
    })
    setFilteredMandalOptions([])
  }

  const openAddForm = () => {
    resetAddForm()
    setShowAddForm(true)
    setShowEditForm(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openEditForm = async item => {
    setEditForm({
      _id: item._id,
      name: item.name,
      mandalId: item.mandalId,
      districtId: item.districtId,
    })

    setShowEditForm(true)
    setShowAddForm(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getSelectedDistrict = useCallback(
    (formType = "add") => {
      const districtId =
        formType === "add" ? form.districtId : editForm.districtId
      return districtOptions.find(opt => opt.value === districtId) || null
    },
    [form.districtId, editForm.districtId, districtOptions]
  )

  const getSelectedMandal = useCallback(
    (formType = "add") => {
      const mandalId = formType === "add" ? form.mandalId : editForm.mandalId
      const options = formType === "add" ? filteredMandalOptions : []

      const found = options.find(opt => opt.value === mandalId)
      if (found) return found

      if (mandalId) {
        const fromAllOptions = mandalOptions.find(opt => opt.value === mandalId)
        if (fromAllOptions) return fromAllOptions

        return {
          value: mandalId,
          label: "Loading...",
        }
      }

      return null
    },
    [form.mandalId, editForm.mandalId, filteredMandalOptions, mandalOptions]
  )

  const getUserRoles = () => {
    try {
      const authUser = localStorage.getItem("authUser")
      if (!authUser) return { accessAll: false }
      const userData = JSON.parse(authUser)
      return userData?.rolesAndPermission?.[0] ?? { accessAll: false }
    } catch (error) {
      console.error("Error parsing user roles:", error)
      return { accessAll: false }
    }
  }

  const userRoles = getUserRoles()
  const canAdd = userRoles?.TownAdd === true || userRoles?.accessAll === true
  const canEdit = userRoles?.TownEdit === true || userRoles?.accessAll === true
  const canDelete =
    userRoles?.TownDelete === true || userRoles?.accessAll === true

  const csvReport = {
    filename: `Villages_Towns_${new Date().toISOString().split("T")[0]}.csv`,
    data: csvData,
    headers: [
      { label: "S.No", key: "S.No" },
      { label: "Village/Town Name", key: "Village/Town Name" },
      { label: "Mandal Name", key: "Mandal Name" },
      { label: "District Name", key: "District Name" },
      { label: "Created At", key: "Created At" },
      { label: "Updated At", key: "Updated At" },
    ],
  }

  useEffect(() => {
    if (token) {
      fetchData()
      fetchDistricts()
      fetchMandals()
    }
  }, [token, fetchData, fetchDistricts, fetchMandals])

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Village/Town" />
          <Row>
            <Col md={12}>
              {showAddForm && (
                <Card className="p-4 mb-4">
                  <Form onSubmit={handleAddSubmit}>
                    <h5 className="mb-3">Create Village/Town</h5>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            District Name<span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="districtId"
                            value={getSelectedDistrict("add")}
                            onChange={option =>
                              handleDistrictChange(option, "add")
                            }
                            options={districtOptions}
                            styles={selectStyles}
                            placeholder="Select District"
                            isSearchable
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            Mandal Name<span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="mandalId"
                            value={getSelectedMandal("add")}
                            onChange={option =>
                              handleMandalChange(option, "add")
                            }
                            options={filteredMandalOptions}
                            styles={selectStyles}
                            placeholder="Select Mandal"
                            isSearchable
                            required
                            isDisabled={!form.districtId}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            Village/Town Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={e => handleInputChange(e, "add")}
                            name="name"
                            value={form.name}
                            required
                            type="text"
                            placeholder="Enter Name"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setShowAddForm(false)}
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
          </Row>
          <Row>
            <Col md={12}>
              {showEditForm && (
                <Card className="p-4 mb-4">
                  <Form onSubmit={handleEditSubmit}>
                    <h5 className="mb-3">Edit Village/Town</h5>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            District Name<span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="districtId"
                            value={getSelectedDistrict("edit")}
                            onChange={option =>
                              handleDistrictChange(option, "edit")
                            }
                            options={districtOptions}
                            styles={selectStyles}
                            placeholder="Select District"
                            isSearchable
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            Mandal Name<span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="mandalId"
                            value={getSelectedMandal("edit")}
                            onChange={option =>
                              handleMandalChange(option, "edit")
                            }
                            options={mandalOptions.filter(
                              opt => opt.districtId === editForm.districtId
                            )}
                            styles={selectStyles}
                            placeholder="Select Mandal"
                            isSearchable
                            required
                            isDisabled={!editForm.districtId}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label className="fw-bold">
                            Village/Town Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={e => handleInputChange(e, "edit")}
                            name="name"
                            value={editForm.name}
                            required
                            type="text"
                            placeholder="Enter Name"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setShowEditForm(false)}
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
          </Row>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={6}>
                      {canAdd && (
                        <Button
                          color="primary text-white"
                          onClick={openAddForm}
                        >
                          Create Village/Town{" "}
                          <i className="bx bx-plus-circle"></i>
                        </Button>
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        <div className="position-relative">
                          <Input
                            name="search"
                            value={searchQuery}
                            onChange={handleSearch}
                            type="search"
                            placeholder="Search by name..."
                            className="form-control"
                            style={{ minWidth: "250px" }}
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
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table hover className="table table-bordered mb-4 ">
                          <thead className="table-light">
                            <tr className="text-center">
                              <th>S.No</th>
                              <th>Name</th>
                              <th>Mandal</th>
                              <th>District</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedData.length > 0 ? (
                              displayedData.map((item, index) => (
                                <tr key={item._id} className="text-center">
                                  <td>{pagesVisited + index + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{item.mandalName}</td>
                                  <td>{item.districtName}</td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      {canEdit && (
                                        <Button
                                          onClick={() => openEditForm(item)}
                                          size="sm"
                                          className="me-2"
                                          color="info"
                                          title="Edit"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>
                                      )}
                                      {canDelete && (
                                        <Button
                                          onClick={() => handleDelete(item)}
                                          size="sm"
                                          color="danger"
                                          title="Delete"
                                        >
                                          <i className="bx bx-trash"></i>
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-4">
                                  No data found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      {pageCount > 1 && (
                        <div className="d-flex justify-content-end mt-3">
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={"pagination pagination-sm"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                            disabledClassName={"disabled"}
                            forcePage={pageNumber}
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default VillageTown