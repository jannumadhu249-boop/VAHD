import React, { useEffect, useState, useCallback, useMemo } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
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
  FormGroup,
} from "reactstrap"
import Select from "react-select"

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const CaseTreated = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = GetAuth ? JSON.parse(GetAuth) : null
  const TokenData = TokenJson?.token
  const UserDetails = TokenJson?.user
  const token = TokenData

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDataTable, setShowDataTable] = useState(true)
  const [data, setData] = useState([])
  const [placeOfWorking, setPlaceOfWorking] = useState([])
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [mandal, setMandal] = useState({})
  const [district, setDistrict] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [grampanchayath, setGrampanchayath] = useState([])
  const [selectedVillage, setSelectedVillage] = useState(null)
  const [selectedVillageEdit, setSelectedVillageEdit] = useState(null)
  const [inputValue, setInputValue] = useState("")
  const [inputValueEdit, setInputValueEdit] = useState("")
  const [drug, setDrug] = useState([])

  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const initialFormState = {
    visitDate: getCurrentDate(),
    districtId: "",
    mandalId: "",
    Village: "",
    dose: "",
    farmerName: "",
    phoneNumber: "",
    aadharNumber: "",
    noOfSheepAvailableM: "",
    noOfGoatAvailableM: "",
    noOfSheepAvailableF: "",
    noOfGoatAvailableF: "",
    noOfSheepDewormedMale: "",
    noOfGoatDewormedMale: "",
    noOfSheepDewormedFemale: "",
    noOfGoatDewormedFemale: "",
    drugSuppliedName: "",
    batchNumber: "",
    workingPlaceId: "",
    search: "",
    caste: "",
  }

  const [form, setForm] = useState(initialFormState)
  const [editForm, setEditForm] = useState(initialFormState)

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

  const fetchDrugs = useCallback(async () => {
    try {
      const allocationResponse = await axios.post(
        URLS.GetAllocationForm,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (allocationResponse.data?.data) {
        const allocationFormId =
          allocationResponse.data.data._id ||
          allocationResponse.data.data[0]?._id

        if (allocationFormId) {
          const drugsResponse = await axios.post(
            `${URLS.GetFormByDrugs}${allocationFormId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )

          if (drugsResponse.data?.data) {
            const drugData = Array.isArray(drugsResponse.data.data)
              ? drugsResponse.data.data
              : [drugsResponse.data.data]
            setDrug(drugData)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching drugs:", error)
      toast.error("Failed to load drugs")
    }
  }, [token])

  const fetchPlaceOfWorking = useCallback(async () => {
    try {
      const response = await axios.post(
        URLS.GetPlaceOfWorking,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPlaceOfWorking(response.data.data || [])
    } catch (error) {
      console.error("Error fetching place of working:", error)
      toast.error("Failed to load Place Of Working")
    }
  }, [token])

  const getCaseTreated = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(
        URLS.GetDeworming,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setData(response.data.data || [])
    } catch (error) {
      console.error("Error fetching CaseTreated:", error)
      toast.error("Failed to load Sheep & Goat Deworming data")
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const getGrampanchayath = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetGrampanchayath, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setGrampanchayath(response.data.data || [])
    } catch (error) {
      console.error("Error fetching Grampanchayath:", error)
      toast.error("Failed to load Grampanchayath")
    }
  }, [token])

  const searchGrampanchayath = useCallback(
    async searchValue => {
      try {
        const response = await axios.get(
          `${URLS.GetGrampanchayathSearch}${searchValue}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (response.status === 200) {
          setGrampanchayath(response.data.data || [])
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message)
        }
        setGrampanchayath([])
      }
    },
    [token]
  )

  const debouncedSearch = useMemo(
    () =>
      debounce(searchValue => {
        if (searchValue.trim()) {
          searchGrampanchayath(searchValue)
        } else {
          getGrampanchayath()
        }
      }, 500),
    [getGrampanchayath, searchGrampanchayath]
  )

  useEffect(() => {
    fetchPlaceOfWorking()
    getCaseTreated()
    getGrampanchayath()
    fetchDrugs()
  }, [fetchPlaceOfWorking, getCaseTreated, getGrampanchayath, fetchDrugs])

  const searchData = useCallback(
    async value => {
      if (value.trim() === "") {
        getCaseTreated()
        return
      }
      try {
        setIsLoading(true)
        const response = await axios.post(
          `${URLS.GetDewormingSearch}${value}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (response.status === 200) {
          setData(response.data.data || [])
          setPageNumber(0)
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Search failed")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [token, getCaseTreated]
  )

  const handleSearchChange = e => {
    const value = e.target.value
    setForm(prev => ({ ...prev, search: value }))

    const timeoutId = setTimeout(() => {
      searchData(value)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(data.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const showAddPopup = () => {
    setShowAddForm(true)
    setShowEditForm(false)
    setShowDataTable(false)
    setForm({
      ...initialFormState,
      visitDate: getCurrentDate(),
    })
    setMandal({})
    setDistrict({})
    setSelectedVillage(null)
    setInputValue("")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const fetchSubCategories = async workingPlaceId => {
    try {
      const response = await axios.post(
        URLS.GetPlaceOfWorkingById,
        { placeOfWorkingId: workingPlaceId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = response.data.data
      setMandal(data.mandal || {})
      setDistrict(data.district || {})

      setForm(prev => ({
        ...prev,
        districtId: data.district?._id || "",
        mandalId: data.mandal?._id || "",
      }))
    } catch (error) {
      console.error("Failed to load subcategories:", error)
      toast.error("Failed to load location details")
    }
  }

  const handleAddSubmit = e => {
    e.preventDefault()
    addData()
  }

  const addData = async () => {
    const missingFields = []
    if (!form.workingPlaceId) missingFields.push("Working Place")
    if (!form.visitDate) missingFields.push("Visit Date")

    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }

    const dataArray = {
      visitDate: form.visitDate,
      districtId: form.districtId,
      mandalId: form.mandalId,
      Village: selectedVillage?.value || "",
      dose: form.dose,
      farmerName: form.farmerName,
      phoneNumber: form.phoneNumber,
      aadharNumber: form.aadharNumber,
      noOfSheepAvailableM: parseInt(form.noOfSheepAvailableM) || 0,
      noOfGoatAvailableM: parseInt(form.noOfGoatAvailableM) || 0,
      noOfSheepAvailableF: parseInt(form.noOfSheepAvailableF) || 0,
      noOfGoatAvailableF: parseInt(form.noOfGoatAvailableF) || 0,
      noOfSheepDewormedMale: parseInt(form.noOfSheepDewormedMale) || 0,
      noOfGoatDewormedMale: parseInt(form.noOfGoatDewormedMale) || 0,
      noOfSheepDewormedFemale: parseInt(form.noOfSheepDewormedFemale) || 0,
      noOfGoatDewormedFemale: parseInt(form.noOfGoatDewormedFemale) || 0,
      drugSuppliedName: form.drugSuppliedName,
      batchNumber: form.batchNumber,
      workingPlaceId: form.workingPlaceId,
      addedByEmp: UserDetails._id,
      caste: form.caste,
    }

    try {
      setIsLoading(true)
      const response = await axios.post(URLS.AddDeworming, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success(response.data.message)
        setShowAddForm(false)
        setShowDataTable(true)
        setForm(initialFormState)
        setSelectedVillage(null)
        setInputValue("")
        getCaseTreated()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to add Sheep & Goat Deworming record")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditChange = e => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const showEditPopup = data => {
    setEditForm({
      ...data,
      visitDate: data.visitDate || getCurrentDate(),
    })

    if (data.Village) {
      const villageOption = {
        value: data.Village,
        label: data.Village,
      }
      setSelectedVillageEdit(villageOption)
    } else {
      setSelectedVillageEdit(null)
    }

    setInputValueEdit("")

    if (data.workingPlaceId) {
      fetchSubCategoriesForEdit(data.workingPlaceId)
    }
    setShowAddForm(false)
    setShowEditForm(true)
    setShowDataTable(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const fetchSubCategoriesForEdit = async workingPlaceId => {
    try {
      const response = await axios.post(
        URLS.GetPlaceOfWorkingById,
        { placeOfWorkingId: workingPlaceId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = response.data.data
      setMandal(data.mandal || {})
      setDistrict(data.district || {})

      setEditForm(prev => ({
        ...prev,
        districtId: data.district?._id || "",
        mandalId: data.mandal?._id || "",
      }))
    } catch (error) {
      console.error("Failed to load subcategories for edit:", error)
      toast.error("Failed to load location details")
    }
  }

  const handleEditSubmit = e => {
    e.preventDefault()
    updateData()
  }

  const updateData = async () => {
    const missingFields = []

    if (!editForm.workingPlaceId) missingFields.push("Working Place")
    if (!editForm.visitDate) missingFields.push("Visit Date")

    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }

    const dataArray = {
      visitDate: editForm.visitDate,
      districtId: editForm.districtId,
      mandalId: editForm.mandalId,
      Village: selectedVillageEdit?.value || "",
      dose: editForm.dose,
      farmerName: editForm.farmerName,
      phoneNumber: editForm.phoneNumber,
      aadharNumber: editForm.aadharNumber,
      noOfSheepAvailableM: parseInt(editForm.noOfSheepAvailableM) || 0,
      noOfGoatAvailableM: parseInt(editForm.noOfGoatAvailableM) || 0,
      noOfSheepAvailableF: parseInt(editForm.noOfSheepAvailableF) || 0,
      noOfGoatAvailableF: parseInt(editForm.noOfGoatAvailableF) || 0,
      noOfSheepDewormedMale: parseInt(editForm.noOfSheepDewormedMale) || 0,
      noOfGoatDewormedMale: parseInt(editForm.noOfGoatDewormedMale) || 0,
      noOfSheepDewormedFemale: parseInt(editForm.noOfSheepDewormedFemale) || 0,
      noOfGoatDewormedFemale: parseInt(editForm.noOfGoatDewormedFemale) || 0,
      drugSuppliedName: editForm.drugSuppliedName,
      batchNumber: editForm.batchNumber,
      workingPlaceId: editForm.workingPlaceId,
      addedByEmp: UserDetails._id,
      caste: editForm.caste,
    }

    try {
      setIsLoading(true)
      const response = await axios.put(
        `${URLS.EditDeworming}${editForm._id}`,
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        setShowEditForm(false)
        setShowDataTable(true)
        setSelectedVillageEdit(null)
        setInputValueEdit("")
        getCaseTreated()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to update Sheep & Goat Deworming record")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteData = data => {
    const confirmBox = window.confirm(
      "Do you really want to delete this record?"
    )
    if (confirmBox === true) {
      deleteRecord(data)
    }
  }

  const deleteRecord = async data => {
    const recordId = data._id

    try {
      setIsLoading(true)
      const response = await axios.delete(
        `${URLS.DeleteDeworming}${recordId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        getCaseTreated()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to delete Sheep & Goat Deworming record")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setShowDataTable(true)
    setForm(initialFormState)
    setEditForm(initialFormState)
    setSelectedVillage(null)
    setSelectedVillageEdit(null)
    setInputValue("")
    setInputValueEdit("")
  }

  const getCurrentPlace = () => {
    if (!form.workingPlaceId) return null
    const place = placeOfWorking.find(p => p._id === form.workingPlaceId)
    return place ? { value: place._id, label: place.name } : null
  }

  const getCurrentEditPlace = () => {
    if (!editForm.workingPlaceId) return null
    const place = placeOfWorking.find(p => p._id === editForm.workingPlaceId)
    return place ? { value: place._id, label: place.name } : null
  }

  const placeOfWorkingOptions = placeOfWorking.map(place => ({
    value: place._id,
    label: place.name,
  }))

  const drugOptions = useMemo(() => {
    return drug.map(item => ({
      value: item.drugCode,
      label: item.drugCode,
    }))
  }, [drug])

  const getCurrentDrug = () => {
    if (!form.drugSuppliedName) return null
    const selectedDrug = drugOptions.find(
      option => option.value === form.drugSuppliedName
    )
    return selectedDrug || null
  }

  const getCurrentEditDrug = () => {
    if (!editForm.drugSuppliedName) return null
    const selectedDrug = drugOptions.find(
      option => option.value === editForm.drugSuppliedName
    )
    return selectedDrug || null
  }

  const handleDrugChange = (selectedOption, { name }) => {
    if (name === "drugSuppliedName") {
      setForm(prev => ({
        ...prev,
        drugSuppliedName: selectedOption?.value || "",
      }))
    }
  }

  const handleEditDrugChange = (selectedOption, { name }) => {
    if (name === "drugSuppliedName") {
      setEditForm(prev => ({
        ...prev,
        drugSuppliedName: selectedOption?.value || "",
      }))
    }
  }

  const villageOptions = useMemo(
    () =>
      grampanchayath.map(g => ({
        value: g.Village,
        label: g.Village,
      })),
    [grampanchayath]
  )

  const getCurrentVillage = () => {
    return selectedVillage
  }

  const getCurrentVillageEdit = () => {
    return selectedVillageEdit
  }

  const handleVillageSearch = inputValue => {
    setInputValue(inputValue)
    debouncedSearch(inputValue)
  }

  const handleVillageSearchEdit = inputValue => {
    setInputValueEdit(inputValue)
    debouncedSearch(inputValue)
  }

  const handleSelectChange = (selectedOption, { name }) => {
    if (name === "Village") {
      setSelectedVillage(selectedOption)
    }
    if (name === "workingPlaceId") {
      setForm(prev => ({
        ...prev,
        workingPlaceId: selectedOption?.value || "",
      }))
      if (selectedOption) {
        fetchSubCategories(selectedOption.value)
      } else {
        setMandal({})
        setDistrict({})
        setForm(prev => ({
          ...prev,
          districtId: "",
          mandalId: "",
        }))
      }
    }
  }

  const handleEditSelectChange = (selectedOption, { name }) => {
    if (name === "workingPlaceId") {
      setEditForm(prev => ({
        ...prev,
        workingPlaceId: selectedOption?.value || "",
      }))
      if (selectedOption) {
        fetchSubCategoriesForEdit(selectedOption.value)
      } else {
        setMandal({})
        setDistrict({})
        setEditForm(prev => ({
          ...prev,
          districtId: "",
          mandalId: "",
        }))
      }
    }
  }

  const handleSelectChange1 = (selectedOption, { name }) => {
    if (name === "Village") {
      setSelectedVillageEdit(selectedOption)
    }
  }

  const userRoles = useMemo(() => {
    const authData = localStorage.getItem("authUser")
    if (!authData) return { accessAll: false }
    const parsedData = JSON.parse(authData)
    return parsedData?.rolesAndPermission?.[0] ?? { accessAll: false }
  }, [])

  const casteOptions = [
    { value: "General", label: "General" },
    { value: "BC-A", label: "BC-A" },
    { value: "BC-B", label: "BC-B" },
    { value: "BC-C", label: "BC-C" },
    { value: "BC-D", label: "BC-D" },
    { value: "BC-E", label: "BC-E" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
  ]

  const getCurrentCaste = () => {
    return casteOptions.find(opt => opt.value === form.caste) || null
  }

  const getCurrentCaste1 = () => {
    return casteOptions.find(opt => opt.value === editForm.caste) || null
  }

  const handleCasteChange = (selectedOption, { name }) => {
    if (name === "caste") {
      setForm(prev => ({
        ...prev,
        caste: selectedOption?.value || "",
      }))
    }
  }

  const handleEditCasteChange = (selectedOption, { name }) => {
    if (name === "caste") {
      setEditForm(prev => ({
        ...prev,
        caste: selectedOption?.value || "",
      }))
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="VAHD ADMIN"
            breadcrumbItem="Sheep and Goat Deworming Record"
          />

          {showAddForm && (
            <Row>
              <Col md={12}>
                <Card className="mb-3">
                  <CardBody>
                    <Form onSubmit={handleAddSubmit}>
                      <div className="form-section">
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="visitDate" className="fw-bold">
                                Date*
                              </Label>
                              <Input
                                size="sm"
                                type="date"
                                name="visitDate"
                                id="visitDate"
                                value={form.visitDate}
                                onChange={handleChange}
                                max={new Date().toISOString().split("T")[0]}
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="workingPlaceId" className="fw-bold">
                                Place of Working*
                              </Label>
                              <Select
                                name="workingPlaceId"
                                value={getCurrentPlace()}
                                onChange={handleSelectChange}
                                options={placeOfWorkingOptions}
                                styles={selectStyles}
                                placeholder="Select Place"
                                isSearchable
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <div className="text-end pt-3">
                              <h6 className="text-primary">
                                <i className="bx bx-user me-2"></i>
                                Employee: {UserDetails?.name || "N/A"}
                              </h6>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col md={4}>
                          <FormGroup className="mb-2">
                            <Label>District</Label>
                            <Input
                              readOnly
                              disabled
                              size="sm"
                              type="text"
                              name="districtId"
                              value={district.name || ""}
                              className="form-control bg-light"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className="mb-2">
                            <Label>Mandal</Label>
                            <Input
                              readOnly
                              disabled
                              size="sm"
                              type="text"
                              name="mandalId"
                              value={mandal.name || ""}
                              className="form-control bg-light"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for="Village">Village</Label>
                            <Select
                              name="Village"
                              value={getCurrentVillage()}
                              inputValue={inputValue}
                              onChange={handleSelectChange}
                              onInputChange={handleVillageSearch}
                              options={villageOptions}
                              styles={selectStyles}
                              placeholder="Search and select village..."
                              isSearchable
                              filterOption={() => true}
                              noOptionsMessage={() =>
                                inputValue
                                  ? "No villages found"
                                  : "Type to search villages..."
                              }
                              loadingMessage={() => "Searching..."}
                              isClearable
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="form-section mt-2">
                        <h6 className="section-title text-primary mb-2">
                          Deworming Medicine Used
                        </h6>
                        <hr />
                        <Row className="mb-2">
                          <Col md={4}>
                            <FormGroup>
                              <Label for="drugSuppliedName" className="fw-bold">
                                Name of the Drug*
                              </Label>
                              <Select
                                name="drugSuppliedName"
                                value={getCurrentDrug()}
                                onChange={handleDrugChange}
                                options={drugOptions}
                                styles={selectStyles}
                                placeholder="Select Drug"
                                isSearchable
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="batchNumber" className="fw-bold">
                                Batch Number
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="batchNumber"
                                id="batchNumber"
                                value={form.batchNumber}
                                onChange={handleChange}
                                placeholder="Batch number"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="dose" className="fw-bold">
                                Dose
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="dose"
                                id="dose"
                                value={form.dose}
                                onChange={handleChange}
                                placeholder="Enter Dose"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <h6 className="section-title text-primary mb-2">
                          Beneficiary Information
                        </h6>
                        <hr />
                        <Row className="mb-2">
                          <Col md={3}>
                            <FormGroup>
                              <Label for="farmerName" className="fw-bold">
                                Name of the Beneficiary
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="farmerName"
                                id="farmerName"
                                value={form.farmerName}
                                onChange={handleChange}
                                placeholder="Enter Name of the Beneficiary"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="phoneNumber" className="fw-bold">
                                Phone Number
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="aadharNumber" className="fw-bold">
                                Aadhar Card Number
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="aadharNumber"
                                id="aadharNumber"
                                value={form.aadharNumber}
                                onChange={handleChange}
                                placeholder="Enter Aadhar Card Number"
                                maxLength="12"
                                minLength="12"
                                pattern="[0-9]{12}"
                                onKeyPress={e => {
                                  const charCode = e.which ? e.which : e.keyCode
                                  if (charCode < 48 || charCode > 57) {
                                    e.preventDefault()
                                  }
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="caste">Caste</Label>
                              <Select
                                name="caste"
                                value={getCurrentCaste()}
                                onChange={handleCasteChange}
                                options={casteOptions}
                                styles={selectStyles}
                                placeholder="Select Caste"
                                isSearchable
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <h6 className="section-title text-primary mb-2">
                          Animal Details
                        </h6>
                        <hr />
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepAvailableM"
                                className="fw-bold"
                              >
                                Sheep Available (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepAvailableM"
                                id="noOfSheepAvailableM"
                                value={form.noOfSheepAvailableM}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepAvailableF"
                                className="fw-bold"
                              >
                                Sheep Available (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepAvailableF"
                                id="noOfSheepAvailableF"
                                value={form.noOfSheepAvailableF}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatAvailableM"
                                className="fw-bold"
                              >
                                Goat Available (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatAvailableM"
                                id="noOfGoatAvailableM"
                                value={form.noOfGoatAvailableM}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatAvailableF"
                                className="fw-bold"
                              >
                                Goat Available (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatAvailableF"
                                id="noOfGoatAvailableF"
                                value={form.noOfGoatAvailableF}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepDewormedMale"
                                className="fw-bold"
                              >
                                Sheep Dewormed (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepDewormedMale"
                                id="noOfSheepDewormedMale"
                                value={form.noOfSheepDewormedMale}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepDewormedFemale"
                                className="fw-bold"
                              >
                                Sheep Dewormed (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepDewormedFemale"
                                id="noOfSheepDewormedFemale"
                                value={form.noOfSheepDewormedFemale}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatDewormedMale"
                                className="fw-bold"
                              >
                                Goat Dewormed (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatDewormedMale"
                                id="noOfGoatDewormedMale"
                                value={form.noOfGoatDewormedMale}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatDewormedFemale"
                                className="fw-bold"
                              >
                                Goat Dewormed (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatDewormedFemale"
                                id="noOfGoatDewormedFemale"
                                value={form.noOfGoatDewormedFemale}
                                onChange={handleChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <div className="d-flex justify-content-between mt-2 pt-3 border-top">
                        <Button
                          color="secondary"
                          onClick={cancelForm}
                          type="button"
                          disabled={isLoading}
                        >
                          <i className="bx bx-x me-1"></i>
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          type="submit"
                          disabled={isLoading}
                        >
                          <i className="bx bx-check me-1"></i>
                          {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {showEditForm && (
            <Row>
              <Col md={12}>
                <Card className="mb-3">
                  <CardBody>
                    <Form onSubmit={handleEditSubmit}>
                      <div className="form-section">
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="visitDate" className="fw-bold">
                                Date*
                              </Label>
                              <Input
                                size="sm"
                                type="date"
                                name="visitDate"
                                id="visitDate"
                                value={editForm.visitDate}
                                onChange={handleEditChange}
                                max={new Date().toISOString().split("T")[0]}
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="workingPlaceId" className="fw-bold">
                                Place of Working*
                              </Label>
                              <Select
                                name="workingPlaceId"
                                value={getCurrentEditPlace()}
                                onChange={handleEditSelectChange}
                                options={placeOfWorkingOptions}
                                styles={selectStyles}
                                placeholder="Select Place"
                                isSearchable
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <div className="text-end pt-3">
                              <h6 className="text-primary">
                                <i className="bx bx-user me-2"></i>
                                Employee: {UserDetails?.name || "N/A"}
                              </h6>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col md={4}>
                          <FormGroup className="mb-2">
                            <Label>District</Label>
                            <Input
                              readOnly
                              disabled
                              size="sm"
                              type="text"
                              name="districtId"
                              value={district.name || ""}
                              className="form-control bg-light"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className="mb-2">
                            <Label>Mandal</Label>
                            <Input
                              readOnly
                              disabled
                              size="sm"
                              type="text"
                              name="mandalId"
                              value={mandal.name || ""}
                              className="form-control bg-light"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for="Village">Village</Label>
                            <Select
                              name="Village"
                              value={getCurrentVillageEdit()}
                              inputValue={inputValueEdit}
                              onChange={handleSelectChange1}
                              onInputChange={handleVillageSearchEdit}
                              options={villageOptions}
                              styles={selectStyles}
                              placeholder="Search and select village..."
                              isSearchable
                              filterOption={() => true}
                              noOptionsMessage={() =>
                                inputValueEdit
                                  ? "No villages found"
                                  : "Type to search villages..."
                              }
                              loadingMessage={() => "Searching..."}
                              isClearable
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="form-section mt-2">
                        <h6 className="section-title text-primary mb-2">
                          Deworming Medicine Used
                        </h6>
                        <hr />
                        <Row className="mb-2">
                          <Col md={4}>
                            <FormGroup>
                              <Label for="drugSuppliedName" className="fw-bold">
                                Name of the Drug*
                              </Label>
                              <Select
                                name="drugSuppliedName"
                                value={getCurrentEditDrug()}
                                onChange={handleEditDrugChange}
                                options={drugOptions}
                                styles={selectStyles}
                                placeholder="Select Drug"
                                isSearchable
                                required
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="batchNumber" className="fw-bold">
                                Batch Number
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="batchNumber"
                                id="batchNumber"
                                value={editForm.batchNumber}
                                onChange={handleEditChange}
                                placeholder="Batch number"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="dose" className="fw-bold">
                                Dose
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="dose"
                                id="dose"
                                value={editForm.dose}
                                onChange={handleEditChange}
                                placeholder="Enter Dose"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <h6 className="section-title text-primary mb-2">
                          Beneficiary Information
                        </h6>
                        <hr />
                        <Row className="mb-2">
                          <Col md={3}>
                            <FormGroup>
                              <Label for="farmerName" className="fw-bold">
                                Name of the Beneficiary
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="farmerName"
                                id="farmerName"
                                value={editForm.farmerName}
                                onChange={handleEditChange}
                                placeholder="Enter Name of the Beneficiary"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="phoneNumber" className="fw-bold">
                                Phone Number
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={editForm.phoneNumber}
                                onChange={handleEditChange}
                                placeholder="Enter Phone Number"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="aadharNumber" className="fw-bold">
                                Aadhar Card Number
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="aadharNumber"
                                id="aadharNumber"
                                value={editForm.aadharNumber}
                                onChange={handleEditChange}
                                placeholder="Enter Aadhar Card Number"
                                maxLength="12"
                                minLength="12"
                                pattern="[0-9]{12}"
                                onKeyPress={e => {
                                  const charCode = e.which ? e.which : e.keyCode
                                  if (charCode < 48 || charCode > 57) {
                                    e.preventDefault()
                                  }
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="caste">Caste</Label>
                              <Select
                                name="caste"
                                value={getCurrentCaste1()}
                                onChange={handleEditCasteChange}
                                options={casteOptions}
                                styles={selectStyles}
                                placeholder="Select Caste"
                                isSearchable
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <h6 className="section-title text-primary mb-2">
                          Animal Details
                        </h6>
                        <hr />
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepAvailableM"
                                className="fw-bold"
                              >
                                Sheep Available (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepAvailableM"
                                id="noOfSheepAvailableM"
                                value={editForm.noOfSheepAvailableM}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepAvailableF"
                                className="fw-bold"
                              >
                                Sheep Available (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepAvailableF"
                                id="noOfSheepAvailableF"
                                value={editForm.noOfSheepAvailableF}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatAvailableM"
                                className="fw-bold"
                              >
                                Goat Available (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatAvailableM"
                                id="noOfGoatAvailableM"
                                value={editForm.noOfGoatAvailableM}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatAvailableF"
                                className="fw-bold"
                              >
                                Goat Available (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatAvailableF"
                                id="noOfGoatAvailableF"
                                value={editForm.noOfGoatAvailableF}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepDewormedMale"
                                className="fw-bold"
                              >
                                Sheep Dewormed (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepDewormedMale"
                                id="noOfSheepDewormedMale"
                                value={editForm.noOfSheepDewormedMale}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfSheepDewormedFemale"
                                className="fw-bold"
                              >
                                Sheep Dewormed (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfSheepDewormedFemale"
                                id="noOfSheepDewormedFemale"
                                value={editForm.noOfSheepDewormedFemale}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatDewormedMale"
                                className="fw-bold"
                              >
                                Goat Dewormed (Male)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatDewormedMale"
                                id="noOfGoatDewormedMale"
                                value={editForm.noOfGoatDewormedMale}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label
                                for="noOfGoatDewormedFemale"
                                className="fw-bold"
                              >
                                Goat Dewormed (Female)
                              </Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                name="noOfGoatDewormedFemale"
                                id="noOfGoatDewormedFemale"
                                value={editForm.noOfGoatDewormedFemale}
                                onChange={handleEditChange}
                                placeholder="Enter count"
                                min="0"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <div className="d-flex justify-content-between mt-2 pt-3 border-top">
                        <Button
                          color="secondary"
                          onClick={cancelForm}
                          type="button"
                          disabled={isLoading}
                        >
                          <i className="bx bx-x me-1"></i>
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          type="submit"
                          disabled={isLoading}
                        >
                          <i className="bx bx-check me-1"></i>
                          {isLoading ? "Updating..." : "Update"}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          {showDataTable && (
            <Row>
              <Col md={12}>
                <Card>
                  <CardBody>
                    <Row className="mb-2">
                      <Col md={6}>
                        {(userRoles?.GoatDewormingAdd === true ||
                          userRoles?.accessAll === true) && (
                          <Button
                            color="primary"
                            onClick={showAddPopup}
                            disabled={isLoading}
                          >
                            <i className="bx bx-plus me-1"></i>
                            Add Sheep and Goat Deworming
                          </Button>
                        )}
                      </Col>
                      <Col md={6}>
                        <div className="d-flex justify-content-end">
                          <div style={{ maxWidth: "300px" }}>
                            <Input
                              name="search"
                              value={form.search}
                              onChange={handleSearchChange}
                              type="search"
                              placeholder="Search by farmer name or phone..."
                              className="form-control"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="table-rep-plugin mt-2 table-responsive">
                      <Table hover className="table table-bordered mb-3 ">
                        <thead>
                          <tr>
                            <th> S.No </th>
                            <th>Date / Time</th>
                            <th>Beneficiary Details</th>
                            <th>Animal Details</th>
                            <th>Visit Details</th>
                            <th>Deworming Details</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.length > 0 ? (
                            lists.map((data, index) => (
                              <tr key={data._id}>
                                <td className="text-center fw-bold">
                                  {pagesVisited + index + 1}
                                </td>
                                <td className="text-center fw-bold">
                                  {data.logCreatedDate
                                    ? new Date(
                                        data.logCreatedDate
                                      ).toLocaleString("en-IN", {
                                        timeZone: "Asia/Kolkata",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "N/A"}
                                </td>
                                <td>
                                  <div>
                                    <strong className="text-primary">
                                      {data.farmerName}
                                    </strong>
                                    <br />
                                    <small>
                                      <strong>Name of the Beneficiary:</strong>{" "}
                                      {data.farmerName}
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                      <i className="bx bx-phone me-1"></i>
                                      {data.phoneNumber}
                                    </small>
                                    <br />
                                    <small>
                                      <strong>Aadhar:</strong>
                                      {data.aadharNumber}
                                    </small>
                                    <br />
                                    <small>
                                      <strong>Caste:</strong>
                                      {data.caste}
                                    </small>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>Sheep Available (M/F):</strong>
                                    {data.noOfSheepAvailableM || 0} /{" "}
                                    {data.noOfSheepAvailableF || 0}
                                    <br />
                                    <strong>Goat Available (M/F):</strong>
                                    {data.noOfGoatAvailableM || 0} /{" "}
                                    {data.noOfGoatAvailableF || 0}
                                    <br />
                                    <strong>Sheep Dewormed (M/F):</strong>
                                    {data.noOfSheepDewormedMale || 0} /{" "}
                                    {data.noOfSheepDewormedFemale || 0}
                                    <br />
                                    <strong>Goat Dewormed (M/F):</strong>
                                    {data.noOfGoatDewormedMale || 0} /{" "}
                                    {data.noOfGoatDewormedFemale || 0}
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>Date:</strong> {data.visitDate}
                                    <br />
                                    <strong>Place:</strong>
                                    {data.workingPlaceName || "N/A"}
                                    <br />
                                    <strong>Location:</strong>
                                    {data.districtName || "N/A"},
                                    {data.mandalName || "N/A"},
                                    {data.Village || "N/A"}
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>Drug:</strong>
                                    {data.drugSuppliedName}
                                    <br />
                                    <strong>Batch No:</strong>
                                    {data.batchNumber}
                                    <br />
                                    <strong>Dose:</strong>
                                    {data.dose}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="btn-group" role="group">
                                    {(userRoles?.GoatDewormingEdit === true ||
                                      userRoles?.accessAll === true) && (
                                      <Button
                                        onClick={() => showEditPopup(data)}
                                        size="sm"
                                        color="primary"
                                        className="me-1"
                                        title="Edit"
                                      >
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                    )}
                                    {(userRoles?.GoatDewormingDelete === true ||
                                      userRoles?.accessAll === true) && (
                                      <Button
                                        size="sm"
                                        color="danger"
                                        onClick={() => deleteData(data)}
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
                              <td colSpan="7" className="text-center py-4">
                                <div className="text-muted">
                                  <i className="bx bx-inbox display-4"></i>
                                  <p className="mt-2 mb-0">
                                    No Sheep & Goat Deworming records found
                                  </p>
                                  {form.search && (
                                    <small>
                                      No results found for "{form.search}".
                                      <Button
                                        color="link"
                                        size="sm"
                                        onClick={() => {
                                          setForm(prev => ({
                                            ...prev,
                                            search: "",
                                          }))
                                          getCaseTreated()
                                        }}
                                        className="p-0 ms-1"
                                      >
                                        Clear search
                                      </Button>
                                    </small>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">
                        Showing {lists.length} of {data.length} records
                      </div>
                      <ReactPaginate
                        previousLabel={<i className="bx bx-chevron-left"></i>}
                        nextLabel={<i className="bx bx-chevron-right"></i>}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={"pagination pagination-sm mb-0"}
                        previousLinkClassName={"page-link"}
                        nextLinkClassName={"page-link"}
                        disabledClassName={"disabled"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default CaseTreated
  