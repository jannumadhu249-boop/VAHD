import React, { useEffect, useState, useCallback } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Employee from "../../assets/images/workingplace.xlsx"
import PlacesAutocomplete from "react-places-autocomplete"
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
} from "reactstrap"
import Select from "react-select"

const PlaceOfWorking = () => {
  var GetAuth = localStorage.getItem("authUser")
  var TokenJson = JSON.parse(GetAuth)
  var TokenData = TokenJson.token

  const [show, setshow] = useState(false)
  const [show1, setshow1] = useState(false)
  const [bulkUploadModal, setBulkUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [csvData, setCsvData] = useState([])

  const [EmploymentType, setEmploymentType] = useState([])
  const [districtOptions, setDistrictOptions] = useState([])

  const [filteredMandals, setFilteredMandals] = useState([])
  const [filteredVillages, setFilteredVillages] = useState([])
  const [filteredMandals1, setFilteredMandals1] = useState([])
  const [filteredVillages1, setFilteredVillages1] = useState([])

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(10)

  const [Data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const changePage = ({ selected }) => {
    setCurrentPage(selected)
  }

  const [form, setform] = useState({
    name: "",
    mandalId: "",
    districtId: "",
    townId: "",
    latitude: "",
    longitude: "",
    institutionTypeId: "",
    address: "",
    department: "",
    buildingName: "",
  })

  const [form1, setform1] = useState({
    _id: "",
    name: "",
    mandalId: "",
    districtId: "",
    townId: "",
    latitude: "",
    longitude: "",
    institutionTypeId: "",
    department: "",
    buildingName: "",
    address: "",
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

  const prepareCSVData = (places) => {
    const csvRows = places.map((item, index) => ({
      "S.No": currentPage * pageSize + index + 1,
      "Place Name": item.name || "",
      "Institution Type": item.institutionType || "",
      "District": item.districtName || "",
      "Mandal": item.mandalName || "",
      "Village/Town": item.townName || "",
      "Building Name": item.buildingName || "",
      "Department": item.department || "",
      "Latitude": item.latitude || "",
      "Longitude": item.longitude || "",
      "Address": item.address || "",
      "Created At": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
      "Updated At": item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "",
    }))
    setCsvData(csvRows)
  }

  useEffect(() => {
    Get()
    GetEmploymentType()
    GetDistricts()
  }, [currentPage])

  const Get = () => {
    var token = TokenData
    axios
      .post(
        URLS.GetAllPlaceOfWorkingPaginated,
        {
          page: currentPage + 1,
          limit: pageSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        const placesData = res.data.data || []
        setData(placesData)
        prepareCSVData(placesData)
        setTotalPages(res.data.totalPages || 0)
        setCurrentPage((res.data.page || 1) - 1)
        setTotalCount(res.data.totalCount || 0)
      })
      .catch(error => {
        console.error("Error fetching place of working:", error)
        toast.error("Failed to load data")
        setData([])
        setCsvData([])
        setTotalPages(0)
        setTotalCount(0)
      })
  }

  const SearchData = e => {
    const searchValue = e.target.value
    setSearchTerm(searchValue)

    if (!searchValue.trim()) {
      setCurrentPage(0)
      Get()
      return
    }

    const token = TokenData
    axios
      .post(
        URLS.GetAllPlaceOfWorkingPaginated + `${searchValue}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          const placesData = res.data.data || []
          setData(placesData)
          prepareCSVData(placesData)
          setTotalPages(1)
          setTotalCount(placesData.length || 0)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
        setData([])
        setCsvData([])
        setTotalPages(0)
        setTotalCount(0)
      })
  }

  const GetEmploymentType = () => {
    var token = TokenData
    axios
      .get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const options = res.data.data.map(type => ({
          value: type._id,
          label: type.name,
        }))
        setEmploymentType(options)
      })
      .catch(error => {
        console.error("Error fetching employment types:", error)
      })
  }

  const GetDistricts = () => {
    var token = TokenData
    axios
      .get(URLS.GetDistrict, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const options = res.data.data.map(district => ({
          value: district._id,
          label: district.name,
        }))
        setDistrictOptions(options)
      })
      .catch(error => {
        console.error("Error fetching districts:", error)
      })
  }

  const fetchMandalsByDistrict = useCallback(
    async districtId => {
      try {
        const token = TokenData
        const dataArray = { districtId }
        const response = await axios.post(
          URLS.GetDistrictIdbyMandals,
          dataArray,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const options = response.data.mandals.map(mandal => ({
          value: mandal._id,
          label: mandal.name,
          districtId: mandal.districtId,
        }))
        return options
      } catch (error) {
        console.error("Error fetching mandals by district:", error)
        return []
      }
    },
    [TokenData]
  )

  const fetchVillagesByMandal = useCallback(
    async mandalId => {
      try {
        const token = TokenData
        const response = await axios.post(
          URLS.GetMandalIdByVillageTown,
          { mandalId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const options = response.data.towns.map(town => ({
          value: town._id,
          label: town.name,
          mandalId: town.mandalId,
        }))
        return options
      } catch (error) {
        console.error("Error fetching villages:", error)
        return []
      }
    },
    [TokenData]
  )

  const handleSelectChange = async (selectedOption, { name }) => {
    if (name === "districtId") {
      const districtId = selectedOption ? selectedOption.value : ""
      setform(prev => ({
        ...prev,
        districtId,
        mandalId: "",
        townId: "",
      }))

      if (selectedOption) {
        const mandals = await fetchMandalsByDistrict(districtId)
        setFilteredMandals(mandals)
        setFilteredVillages([])
      } else {
        setFilteredMandals([])
        setFilteredVillages([])
      }
    } else if (name === "mandalId") {
      const mandalId = selectedOption ? selectedOption.value : ""
      setform(prev => ({
        ...prev,
        mandalId,
        townId: "",
      }))

      if (selectedOption) {
        const villages = await fetchVillagesByMandal(mandalId)
        setFilteredVillages(villages)
      } else {
        setFilteredVillages([])
      }
    } else if (name === "townId") {
      setform(prev => ({
        ...prev,
        townId: selectedOption ? selectedOption.value : "",
      }))
    } else if (name === "institutionTypeId") {
      setform(prev => ({
        ...prev,
        institutionTypeId: selectedOption ? selectedOption.value : "",
      }))
    }
  }

  const handleSelectChange1 = async (selectedOption, { name }) => {
    if (name === "districtId") {
      const districtId = selectedOption ? selectedOption.value : ""
      setform1(prev => ({
        ...prev,
        districtId,
        mandalId: "",
        townId: "",
      }))

      if (selectedOption) {
        const mandals = await fetchMandalsByDistrict(districtId)
        setFilteredMandals1(mandals)
        setFilteredVillages1([])
      } else {
        setFilteredMandals1([])
        setFilteredVillages1([])
      }
    } else if (name === "mandalId") {
      const mandalId = selectedOption ? selectedOption.value : ""
      setform1(prev => ({
        ...prev,
        mandalId,
        townId: "",
      }))

      if (selectedOption) {
        const villages = await fetchVillagesByMandal(mandalId)
        setFilteredVillages1(villages)
      } else {
        setFilteredVillages1([])
      }
    } else if (name === "townId") {
      setform1(prev => ({
        ...prev,
        townId: selectedOption ? selectedOption.value : "",
      }))
    } else if (name === "institutionTypeId") {
      setform1(prev => ({
        ...prev,
        institutionTypeId: selectedOption ? selectedOption.value : "",
      }))
    }
  }

  const handleChange = e => {
    setform(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleChange1 = e => {
    setform1(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelect = async address => {
    setform(prev => ({
      ...prev,
      address: address,
    }))

    try {
      const results = await getLatLngFromAddress(address)
      setform(prev => ({
        ...prev,
        latitude: results.lat.toString(),
        longitude: results.lng.toString(),
      }))
    } catch (error) {
      console.error("Error getting coordinates:", error)
      toast.error("Failed to get coordinates for the selected address")
    }
  }

  const handleSelect1 = async address => {
    setform1(prev => ({
      ...prev,
      address: address,
    }))

    try {
      const results = await getLatLngFromAddress(address)
      setform1(prev => ({
        ...prev,
        latitude: results.lat.toString(),
        longitude: results.lng.toString(),
      }))
    } catch (error) {
      console.error("Error getting coordinates:", error)
      toast.error("Failed to get coordinates for the selected address")
    }
  }

  const getLatLngFromAddress = address => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          })
        } else {
          reject(new Error("Geocoding failed: " + status))
        }
      })
    })
  }

  const getCurrentDistrict = () => {
    return districtOptions.find(opt => opt.value === form.districtId) || null
  }

  const getCurrentMandal = () => {
    return filteredMandals.find(opt => opt.value === form.mandalId) || null
  }

  const getCurrentVillage = () => {
    return filteredVillages.find(opt => opt.value === form.townId) || null
  }

  const getCurrentEmploymentType = () => {
    return (
      EmploymentType.find(opt => opt.value === form.institutionTypeId) || null
    )
  }

  const getCurrentDistrict1 = () => {
    return districtOptions.find(opt => opt.value === form1.districtId) || null
  }

  const getCurrentMandal1 = () => {
    return filteredMandals1.find(opt => opt.value === form1.mandalId) || null
  }

  const getCurrentVillage1 = () => {
    return filteredVillages1.find(opt => opt.value === form1.townId) || null
  }

  const getCurrentEmploymentType1 = () => {
    return (
      EmploymentType.find(opt => opt.value === form1.institutionTypeId) || null
    )
  }

  const AddPopUp = () => {
    setshow(!show)
    setshow1(false)
    setform({
      name: "",
      mandalId: "",
      districtId: "",
      townId: "",
      latitude: "",
      longitude: "",
      institutionTypeId: "",
      address: "",
      buildingName: "",
      department: "",
    })
    setFilteredMandals([])
    setFilteredVillages([])
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const UpdatePopUp = async data => {
    // Set basic data
    setform1({
      _id: data._id,
      name: data.name,
      mandalId: data.mandalId,
      districtId: data.districtId,
      townId: data.townId,
      latitude: data.latitude || "",
      longitude: data.longitude || "",
      institutionTypeId: data.institutionTypeId || "",
      buildingName: data.buildingName || "",
      department: data.department || "",
      address: data.address || "",
    })

    if (data.districtId) {
      const mandals = await fetchMandalsByDistrict(data.districtId)
      setFilteredMandals1(mandals)

      if (data.mandalId) {
        const villages = await fetchVillagesByMandal(data.mandalId)
        setFilteredVillages1(villages)
      }
    }

    setshow(false)
    setshow1(true)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const FormAddSubmit = e => {
    e.preventDefault()
    AddData()
  }

  const FormEditSubmit = e => {
    e.preventDefault()
    UpdateData()
  }

  const AddData = () => {
    var token = TokenData
    const dataArray = {
      name: form.name,
      districtId: form.districtId,
      mandalId: form.mandalId,
      townId: form.townId,
      latitude: form.latitude,
      longitude: form.longitude,
      institutionTypeId: form.institutionTypeId,
      buildingName: form.buildingName,
      department: form.department,
    }
    axios
      .post(URLS.AddPlaceOfWorking, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setshow(false)
            setshow1(false)
            Get()
            setform({
              name: "",
              mandalId: "",
              districtId: "",
              townId: "",
              latitude: "",
              longitude: "",
              institutionTypeId: "",
              address: "",
              buildingName: "",
              department: "",
            })
            setFilteredMandals([])
            setFilteredVillages([])
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  const UpdateData = () => {
    var token = TokenData
    const dataArray = {
      name: form1.name,
      districtId: form1.districtId,
      mandalId: form1.mandalId,
      townId: form1.townId,
      latitude: form1.latitude,
      longitude: form1.longitude,
      institutionTypeId: form1.institutionTypeId,
      buildingName: form1.buildingName,
      department: form1.department,
    }
    axios
      .put(URLS.EditPlaceOfWorking + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setshow(false)
            setshow1(false)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
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
      .delete(URLS.DeletePlaceOfWorking + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
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
      .post(URLS.BulkUploadPlaceOfWorking, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        setUploadLoading(false)
        toggleBulkUploadModal()
        toast.success(
          res.data.message || "Place Of Working uploaded successfully!"
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
      "Do you really want to delete ALL Place Of Working? This action cannot be undone."
    )
    if (confirmBox === true) {
      const token = TokenData
      axios
        .delete(URLS.BulkPlaceOfWorkingDelete, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          if (res.status === 200) {
            toast.success(
              res.data.message || "All Place Of Working deleted successfully!"
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

  const csvReport = {
    filename: `Place_of_Working_${new Date().toISOString().split("T")[0]}.csv`,
    data: csvData,
    headers: [
      { label: "S.No", key: "S.No" },
      { label: "Place Name", key: "Place Name" },
      { label: "Institution Type", key: "Institution Type" },
      { label: "District", key: "District" },
      { label: "Mandal", key: "Mandal" },
      { label: "Village/Town", key: "Village/Town" },
      { label: "Building Name", key: "Building Name" },
      { label: "Department", key: "Department" },
      { label: "Latitude", key: "Latitude" },
      { label: "Longitude", key: "Longitude" },
      { label: "Address", key: "Address" },
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
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Place Of Working" />

          <Row>
            <Col md={12}>
              {show && (
                <Card className="p-4">
                  <Form onSubmit={FormAddSubmit}>
                    <h5 className="mb-3">Create Place Of Working</h5>
                    <Row>
                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            District Name<span className="text-danger">*</span>
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

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Mandal Name<span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="mandalId"
                            value={getCurrentMandal()}
                            onChange={handleSelectChange}
                            options={filteredMandals}
                            styles={selectStyles}
                            placeholder="Select Mandal"
                            isSearchable
                            required
                            isDisabled={!form.districtId}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Village/Town Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="townId"
                            value={getCurrentVillage()}
                            onChange={handleSelectChange}
                            options={filteredVillages}
                            styles={selectStyles}
                            placeholder="Select Village/Town"
                            isSearchable
                            required
                            isDisabled={!form.mandalId}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Type Of Institution
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="institutionTypeId"
                            value={getCurrentEmploymentType()}
                            onChange={handleSelectChange}
                            options={EmploymentType}
                            styles={selectStyles}
                            placeholder="Select Type"
                            isSearchable
                            required
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Name<span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={handleChange}
                            name="name"
                            value={form.name}
                            required
                            type="text"
                            placeholder="Enter Name"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Building Name<span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={handleChange}
                            name="buildingName"
                            value={form.buildingName}
                            required
                            type="text"
                            placeholder="Enter  Building Name"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Department<span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={handleChange}
                            name="department"
                            value={form.department}
                            required
                            type="text"
                            placeholder="Enter Department"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">Search Location</Label>
                          <PlacesAutocomplete
                            value={form.address || ""}
                            onChange={address =>
                              setform(prev => ({ ...prev, address }))
                            }
                            onSelect={handleSelect}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div>
                                <input
                                  {...getInputProps({
                                    placeholder: "Search places...",
                                    className: "form-control",
                                  })}
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && (
                                    <div className="p-2">Loading...</div>
                                  )}
                                  {suggestions.map((suggestion, index) => {
                                    const className = suggestion.active
                                      ? "suggestion-item--active"
                                      : "suggestion-item"
                                    const style = suggestion.active
                                      ? {
                                          backgroundColor: "#fafafa",
                                          cursor: "pointer",
                                          padding: "8px",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          cursor: "pointer",
                                          padding: "8px",
                                        }
                                    return (
                                      <div
                                        key={index}
                                        {...getSuggestionItemProps(suggestion, {
                                          className: `border-bottom ${className}`,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">Latitude</Label>
                          <Input
                            onChange={handleChange}
                            name="latitude"
                            value={form.latitude}
                            type="text"
                            placeholder="Auto-filled"
                            readOnly
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">Longitude</Label>
                          <Input
                            onChange={handleChange}
                            name="longitude"
                            value={form.longitude}
                            type="text"
                            placeholder="Auto-filled"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setshow(false)}
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
                    <h5 className="mb-3">Edit Place Of Working</h5>
                    <Row>
                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            District Name<span className="text-danger">*</span>
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

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Mandal Name<span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="mandalId"
                            value={getCurrentMandal1()}
                            onChange={handleSelectChange1}
                            options={filteredMandals1}
                            styles={selectStyles}
                            placeholder="Select Mandal"
                            isSearchable
                            required
                            isDisabled={!form1.districtId}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Village/Town Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="townId"
                            value={getCurrentVillage1()}
                            onChange={handleSelectChange1}
                            options={filteredVillages1}
                            styles={selectStyles}
                            placeholder="Select Village/Town"
                            isSearchable
                            required
                            isDisabled={!form1.mandalId}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Type Of Institution
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="institutionTypeId"
                            value={getCurrentEmploymentType1()}
                            onChange={handleSelectChange1}
                            options={EmploymentType}
                            styles={selectStyles}
                            placeholder="Select Type"
                            isSearchable
                            required
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Name<span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={handleChange1}
                            name="name"
                            value={form1.name}
                            required
                            type="text"
                            placeholder="Enter Name"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Building Name<span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={handleChange1}
                            name="buildingName"
                            value={form1.buildingName}
                            required
                            type="text"
                            placeholder="Enter  Building Name"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">
                            Department<span className="text-danger">*</span>
                          </Label>
                          <Input
                            onChange={handleChange1}
                            name="department"
                            value={form1.department}
                            required
                            type="text"
                            placeholder="Enter Department"
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">Search Location</Label>
                          <PlacesAutocomplete
                            value={form1.address || ""}
                            onChange={address =>
                              setform1(prev => ({ ...prev, address }))
                            }
                            onSelect={handleSelect1}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div>
                                <input
                                  {...getInputProps({
                                    placeholder: "Search places...",
                                    className: "form-control",
                                  })}
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && (
                                    <div className="p-2">Loading...</div>
                                  )}
                                  {suggestions.map((suggestion, index) => {
                                    const className = suggestion.active
                                      ? "suggestion-item--active"
                                      : "suggestion-item"
                                    const style = suggestion.active
                                      ? {
                                          backgroundColor: "#fafafa",
                                          cursor: "pointer",
                                          padding: "8px",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          cursor: "pointer",
                                          padding: "8px",
                                        }
                                    return (
                                      <div
                                        key={index}
                                        {...getSuggestionItemProps(suggestion, {
                                          className: `border-bottom ${className}`,
                                          style,
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">Latitude</Label>
                          <Input
                            onChange={handleChange1}
                            name="latitude"
                            value={form1.latitude}
                            type="text"
                            placeholder="Auto-filled"
                            readOnly
                          />
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup>
                          <Label className="fw-bold">Longitude</Label>
                          <Input
                            onChange={handleChange1}
                            name="longitude"
                            value={form1.longitude}
                            type="text"
                            placeholder="Auto-filled"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setshow1(false)}
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
                      {Roles?.PlaceOfWorkingAdd === true ||
                      Roles?.accessAll === true ? (
                        <>
                          <Button color="primary text-white" onClick={AddPopUp}>
                            Create Place Of Working{" "}
                            <i className="bx bx-plus-circle"></i>
                          </Button>{" "}
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="d-flex gap-2 justify-content-end align-items-center">
                        {Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="warning"
                              className="text-white"
                              onClick={toggleBulkUploadModal}
                            >
                              <i className="bx bx-upload me-2"></i>
                              Bulk Upload
                            </Button>{" "}
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="danger"
                              className="text-white"
                              onClick={handleBulkDelete}
                            >
                              <i className="bx bx-trash me-2"></i>
                              Bulk Delete
                            </Button>{" "}
                          </>
                        ) : (
                          ""
                        )}
                        <div className="position-relative">
                          <Input
                            name="search"
                            value={searchTerm}
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
                          disabled={Data.length === 0}
                        >
                          <i className="bx bx-download me-1"></i>
                          Download CSV
                        </CSVLink>
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4">
                      <thead>
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Institution Type</th>
                          <th>District</th>
                          <th>Mandal</th>
                          <th>Village/Town</th>
                          <th>Building Name</th>
                          <th>Department</th>
                          <th>Latitude</th>
                          <th>Longitude</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Data.length > 0 ? (
                          Data.map((data, key) => (
                            <tr key={key} className="text-center">
                              <td>{currentPage * pageSize + key + 1}</td>
                              <td>{data.name || "N/A"}</td>
                              <td>{data.institutionType || "N/A"}</td>
                              <td>{data.districtName || "N/A"}</td>
                              <td>{data.mandalName || "N/A"}</td>
                              <td>{data.townName || "N/A"}</td>
                              <td>{data.buildingName || "N/A"}</td>
                              <td>{data.department || "N/A"}</td>
                              <td>{data.latitude || "N/A"}</td>
                              <td>{data.longitude || "N/A"}</td>
                              <td>
                                {Roles?.PlaceOfWorkingEdit === true ||
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

                                {Roles?.PlaceOfWorkingDelete === true ||
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
                            <td colSpan="11" className="text-center">
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {totalPages > 1 && (
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <div>
                          Showing {Data.length} of {totalCount} entries
                        </div>
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={totalPages}
                          onPageChange={changePage}
                          forcePage={currentPage}
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

      <Modal isOpen={bulkUploadModal} toggle={toggleBulkUploadModal}>
        <ModalHeader toggle={toggleBulkUploadModal}>
          Bulk Place Of Working
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <h6 className="mb-3">Download Sample Files:</h6>
            <div className="d-flex gap-2">
              <Button color="outline-success" size="sm">
                <a
                  href={Employee}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <i className="bx bx-download me-1"></i>
                  Download XLSX Template
                </a>
              </Button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="fileUpload" className="form-label">
              Upload Place Of Working File (XLSX or CSV)
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

export default PlaceOfWorking