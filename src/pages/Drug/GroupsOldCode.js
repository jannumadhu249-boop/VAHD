import React, { useState, useEffect, useCallback, useMemo } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import Select from "react-select"
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
  FormGroup,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap"

const DrugIndent = () => {
  const [drugItems, setDrugItems] = useState([])
  const [formData, setFormData] = useState({
    institutionTypeId: "",
    workingPlaceId: "",
    districtId: "",
    financialYearId: "",
    schemeId: "",
    quarterId: "",
    drugCode: [
      {
        drugCodeId: "",
        drugCode: "",
        tradeName: "",
        rate: "",
        qty: "",
        gst: "",
        total: "",
      },
    ],
    grandTotal: "",
  })

  const [editFormData, setEditFormData] = useState({
    _id: "",
    institutionTypeId: "",
    workingPlaceId: "",
    districtId: "",
    financialYearId: "",
    schemeId: "",
    quarterId: "",
    drugCode: [
      {
        drugCodeId: "",
        drugCode: "",
        tradeName: "",
        rate: "",
        gst: "",
        qty: "",
        total: "",
      },
    ],
    grandTotal: "",
  })

  const [drugIndents, setDrugIndents] = useState([])
  const [employmentType, setEmploymentType] = useState([])
  const [placeOfWorking, setPlaceOfWorking] = useState([])
  const [editPlaceOfWorking, setEditPlaceOfWorking] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [district, setDistrict] = useState({})
  const [editDistrict, setEditDistrict] = useState({})
  const [budgetData, setBudgetData] = useState({
    budget: 0,
    bookedBudget: 0,
    availableBudget: 0,
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showTableView, setShowTableView] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [FreezeButton, setFreezeButton] = useState(false)
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    institutionTypeId: localStorage.getItem("institutionTypeId") || "",
    workingPlaceId: localStorage.getItem("workingPlaceId") || "",
    financialYearId: localStorage.getItem("financialYearId") || "",
    schemeId: localStorage.getItem("schemeId") || "",
    quarterId: localStorage.getItem("quarterId") || "",
  })

  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [form, setForm] = useState({})
  const [csvData, setCsvData] = useState([])
  const [detailsModal, setDetailsModal] = useState(false)
  const [selectedIndent, setSelectedIndent] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  const [schemes, setSchemes] = useState([])
  const [quarters, setQuarters] = useState([])
  const [editSchemes, setEditSchemes] = useState([])
  const [editQuarters, setEditQuarters] = useState([])

  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
  const token = authUser?.token || ""
  const userDetails = authUser?.user || {}
  const formId = localStorage.getItem("FormId") || ""
  const financialYearId = localStorage.getItem("financialYearId") || ""

  useEffect(() => {
    localStorage.setItem("institutionTypeId", filters.institutionTypeId)
    localStorage.setItem("workingPlaceId", filters.workingPlaceId)
    localStorage.setItem("schemeId", filters.schemeId)
    localStorage.setItem("quarterId", filters.quarterId)
  }, [filters])

  const formatCurrency = (num, decimals = 2) => {
    if (num === "" || num === null || num === undefined) return "₹0.00"
    const number = typeof num === "string" ? parseFloat(num) : num
    return `₹${Number.isNaN(number) ? "0.00" : number.toFixed(decimals)}`
  }

  const formatNumber = (num, decimals = 2) => {
    if (num === "" || num === null || num === undefined) return "0.00"
    const number = typeof num === "string" ? parseFloat(num) : num
    return Number.isNaN(number) ? "0.00" : number.toFixed(decimals)
  }

  const calculateTotal = (qty, rate, gst = 0) => {
    const quantity = parseInt(qty) || 0
    const unitPrice = parseFloat(rate) || 0
    const gstPercent = parseFloat(gst) || 0

    if (quantity <= 0 || unitPrice <= 0) return 0

    const baseAmount = quantity * unitPrice
    const gstAmount = (baseAmount * gstPercent) / 100
    return baseAmount + gstAmount
  }

  const fetchFinancialYears = useCallback(async () => {
    if (!token) return []

    try {
      const response = await axios.post(
        URLS.GetFinancialyear,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data?.data) {
        setFinancialYears(response.data.data)
        return response.data.data
      }
      return []
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error("Failed to fetch financial years")
      return []
    }
  }, [token])

  const fetchSchemesAndQuarters = useCallback(
    async (financialYearId, isEdit = false) => {
      if (!token || !financialYearId) {
        if (isEdit) {
          setEditSchemes([])
          setEditQuarters([])
        } else {
          setSchemes([])
          setQuarters([])
        }
        return
      }
      try {
        const response = await axios.post(
          URLS.GetScheme,
          { financialYearId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (response.data) {
          if (isEdit) {
            setEditSchemes(response.data.schemes || [])
            setEditQuarters(response.data.quarters || [])
          } else {
            setSchemes(response.data.schemes || [])
            setQuarters(response.data.quarters || [])
          }
        }
      } catch (error) {
        console.error("Error fetching Schemes and Quarters:", error)
        toast.error("Failed to load schemes and quarters")
      }
    },
    [token]
  )

  const fetchEmployeeData = useCallback(async () => {
    if (!token || !formId) {
      toast.error("Authentication token or Form ID not found")
      return
    }
    try {
      const response = await axios.post(
        URLS.GetOneAllocationForm,
        { id: formId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data) {
        setForm(response.data)
      }
    } catch (error) {
      console.error("Error fetching Form data:", error)
      toast.error("Failed to fetch Form data")
    }
  }, [token, formId])

  const fetchEmploymentType = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data?.data) {
        setEmploymentType(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching employment types:", error)
      toast.error("Failed to load employment types")
    }
  }, [token])

  const fetchDrugItems = useCallback(async () => {
    if (!token || !formId) return

    try {
      const response = await axios.post(
        `${URLS.GetFormByDrugs}${formId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data?.data) {
        setDrugItems(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching Form By Drugs:", error)
      toast.error("Failed to load drug items")
    }
  }, [token, formId])

  const fetchPlaceOfWorking = useCallback(
    async (institutionTypeId, isEdit = false, isFilter = false) => {
      if (!token || !institutionTypeId) {
        if (isEdit) {
          setEditPlaceOfWorking([])
        } else if (isFilter) {
          setFilteredPlaces([])
        } else {
          setPlaceOfWorking([])
        }
        return
      }
      try {
        const response = await axios.post(
          URLS.GetInstitutionBygetPlaceOfWorking,
          { institutionTypeId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const places = response.data?.data || []
        if (isEdit) {
          setEditPlaceOfWorking(places)
        } else if (isFilter) {
          setFilteredPlaces(places)
        } else {
          setPlaceOfWorking(places)
        }
      } catch (error) {
        console.error("Error fetching places of working:", error)
        toast.error("Failed to load places of working")
      }
    },
    [token]
  )

  const fetchDistrictData = useCallback(
    async (workingPlaceId, isEdit = false) => {
      if (!token || !workingPlaceId) {
        if (isEdit) {
          setEditDistrict({})
        } else {
          setDistrict({})
        }
        return
      }
      try {
        const response = await axios.post(
          URLS.GetPlaceOfWorkingById,
          { placeOfWorkingId: workingPlaceId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = response.data?.data
        if (data) {
          if (isEdit) {
            setEditDistrict(data.district || {})
            setEditFormData(prev => ({
              ...prev,
              districtId: data.district?._id || "",
            }))
          } else {
            setDistrict(data.district || {})
            setFormData(prev => ({
              ...prev,
              districtId: data.district?._id || "",
            }))
          }
        }
      } catch (error) {
        console.error("Failed to load district data:", error)
        toast.error("Failed to load location details")
      }
    },
    [token]
  )

  const fetchBudgetData = useCallback(
    async (workingPlaceId, financialYearId, schemeId, quarterId) => {
      if (!token || !workingPlaceId || !formId || !financialYearId) {
        setBudgetData({
          budget: 0,
          bookedBudget: 0,
          availableBudget: 0,
        })
        return
      }
      try {
        const requestData = {
          workingPlaceId,
          formType: formId,
          financialYearId,
        }
        if (schemeId) {
          requestData.schemeId = schemeId
        }
        if (quarterId) {
          requestData.quarterId = quarterId
        }
        const response = await axios.post(
          URLS.GetOneDrugFormData,
          requestData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data) {
          setBudgetData(response.data)
        }
      } catch (error) {
        console.error("Failed to load budget data:", error)
        setBudgetData({
          budget: 0,
          bookedBudget: 0,
          availableBudget: 0,
        })
      }
    },
    [token, formId]
  )

  const fetchDrugIndents = useCallback(async () => {
    if (!token || !formId) {
      toast.error("Authentication token or Form ID not found")
      return
    }

    setIsLoading(true)
    try {
      const filterParams = {}

      if (filters.institutionTypeId) {
        filterParams.institutionTypeId = filters.institutionTypeId
      }

      if (filters.workingPlaceId) {
        filterParams.workingPlaceId = filters.workingPlaceId
      }

      if (filters.financialYearId) {
        filterParams.financialYearId = filters.financialYearId
      }

      if (filters.schemeId) {
        filterParams.schemeId = filters.schemeId
      }

      if (filters.quarterId) {
        filterParams.quarterId = filters.quarterId
      }

      const response = await axios.post(
        URLS.GetAllDrugFormData,
        {
          formType: formId,
          financialYearId: financialYearId,
          ...filterParams,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data) {
        const indents = response.data.data || []
        setDrugIndents(indents)

        const formatDate = dateString => {
          if (!dateString) return "N/A"
          return new Date(dateString).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        }
        const csvData = []
        indents.forEach(indent => {
          if (indent.drugCode && Array.isArray(indent.drugCode)) {
            indent.drugCode.forEach(drugItem => {
              csvData.push({
                "Institution Type": indent.instituteTypeName || "N/A",
                "Place of Working": indent.workingPlaceName || "N/A",
                District: indent.districtName || "N/A",
                "Financial Year": indent.financialYear || "N/A",
                Scheme: indent.schemeName || "N/A",
                Quarter: indent.quarterName || "N/A",
                "Drug Code": drugItem.drugCode || "N/A",
                "Trade Name": drugItem.tradeName || "N/A",
                Quantity: drugItem.qty || 0,
                Rate: `₹${parseFloat(drugItem.rate || 0).toFixed(2)}`,
                GST: drugItem.gst ? `${drugItem.gst}%` : "0%",
                Total: `₹${parseFloat(drugItem.total || 0).toFixed(2)}`,
                "Created Date": formatDate(indent.logCreatedDate),
              })
            })
          }
        })
        setCsvData(csvData)
      }
    } catch (error) {
      console.error("Error fetching drug indents:", error)
      toast.error("Failed to fetch drug indents")
    } finally {
      setIsLoading(false)
    }
  }, [token, formId, financialYearId, filters])

  const handleFilterChange = e => {
    const { name, value } = e.target
    const updatedFilters = {
      ...filters,
      [name]: value,
    }
    setFilters(updatedFilters)

    localStorage.setItem(name, value)

    if (name === "financialYearId" && value) {
      fetchSchemesAndQuartersForFilters(value)
    }
  }

  const fetchSchemesAndQuartersForFilters = async financialYearId => {
    if (!token || !financialYearId) return

    try {
      const response = await axios.post(
        URLS.GetScheme,
        { financialYearId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data) {
        setSchemes(response.data.schemes || [])
        setQuarters(response.data.quarters || [])
      }
    } catch (error) {
      console.error("Error fetching Schemes and Quarters for filters:", error)
    }
  }

  const handleSelectFilterChange = async (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    const updatedFilters = { ...filters }

    if (name === "institutionTypeId") {
      updatedFilters.institutionTypeId = value
      updatedFilters.workingPlaceId = ""

      if (value) {
        await fetchPlaceOfWorking(value, false, true)
      } else {
        setFilteredPlaces([])
      }
    } else if (name === "financialYearId") {
      updatedFilters.financialYearId = value
      updatedFilters.schemeId = ""
      updatedFilters.quarterId = ""

      if (value) {
        fetchSchemesAndQuartersForFilters(value)
      }
    } else {
      updatedFilters[name] = value
    }

    setFilters(updatedFilters)

    localStorage.setItem(name, value)
    if (name === "institutionTypeId") {
      localStorage.setItem("workingPlaceId", "")
    }
    if (name === "financialYearId") {
      localStorage.setItem("schemeId", "")
      localStorage.setItem("quarterId", "")
    }
  }

  const handleSearch = () => {
    setPageNumber(0)
    fetchDrugIndents()
  }

  const handleReset = async () => {
    const years = await fetchFinancialYears()
    const resetFilters = {
      institutionTypeId: "",
      workingPlaceId: "",
      financialYearId: years.length > 0 ? years[0]._id : "",
      schemeId: "",
      quarterId: "",
    }

    setFilters(resetFilters)
    setFilteredPlaces([])
    setSchemes([])
    setQuarters([])
    setPageNumber(0)

    localStorage.removeItem("institutionTypeId")
    localStorage.removeItem("workingPlaceId")
    localStorage.removeItem("schemeId")
    localStorage.removeItem("quarterId")

    fetchDrugIndents()
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const showIndentDetails = indent => {
    setSelectedIndent(indent)
    setDetailsModal(true)
  }

  const csvReport = {
    filename: `Drug_Indent_Report_${
      new Date().toISOString().split("T")[0]
    }.csv`,
    data: csvData,
    headers: [
      { label: "Created Date", key: "Created Date" },
      { label: "Institution Type", key: "Institution Type" },
      { label: "Place of Working", key: "Place of Working" },
      { label: "District", key: "District" },
      { label: "Financial Year", key: "Financial Year" },
      { label: "Scheme", key: "Scheme" },
      { label: "Quarter", key: "Quarter" },
      { label: "Drug Code", key: "Drug Code" },
      { label: "Trade Name", key: "Trade Name" },
      { label: "Quantity", key: "Quantity" },
      { label: "Rate", key: "Rate" },
      { label: "GST", key: "GST" },
      { label: "Total", key: "Total" },
    ],
  }

  useEffect(() => {
    const initializeData = async () => {
      if (!formId) {
        toast.error("Form ID not found")
        return
      }

      setIsLoading(true)
      try {
        const years = await fetchFinancialYears()
        await Promise.all([
          fetchEmploymentType(),
          fetchDrugItems(),
          fetchEmployeeData(),
        ])

        if (years.length > 0) {
          const selectedYearId = years[0]._id

          setFormData(prev => ({
            ...prev,
            financialYearId: selectedYearId,
            institutionTypeId: filters.institutionTypeId,
            workingPlaceId: filters.workingPlaceId,
            schemeId: filters.schemeId,
            quarterId: filters.quarterId,
          }))

          const storedFilters = {
            institutionTypeId: localStorage.getItem("institutionTypeId") || "",
            workingPlaceId: localStorage.getItem("workingPlaceId") || "",
            financialYearId:
              localStorage.getItem("financialYearId") || selectedYearId,
            schemeId: localStorage.getItem("schemeId") || "",
            quarterId: localStorage.getItem("quarterId") || "",
          }

          setFilters(storedFilters)

          if (storedFilters.institutionTypeId) {
            await fetchPlaceOfWorking(
              storedFilters.institutionTypeId,
              false,
              true
            )
          }

          const yearId = storedFilters.financialYearId || selectedYearId
          await fetchSchemesAndQuarters(yearId, false)
          await fetchSchemesAndQuartersForFilters(yearId)
        }
        await fetchDrugIndents()
      } catch (error) {
        console.error("Error initializing data:", error)
        toast.error("Failed to initialize form data")
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [formId])

  useEffect(() => {
    if (showTableView) {
      fetchDrugIndents()
    }
  }, [showTableView, filters])

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target

    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined,
    }))

    if (index !== null) {
      setFormData(prev => {
        const updatedDrugCode = [...prev.drugCode]
        updatedDrugCode[index] = {
          ...updatedDrugCode[index],
          [name]: value,
        }

        if (name === "qty" || name === "rate" || name === "gst") {
          const qty = name === "qty" ? value : updatedDrugCode[index].qty
          const rate = name === "rate" ? value : updatedDrugCode[index].rate
          const gst = name === "gst" ? value : updatedDrugCode[index].gst
          updatedDrugCode[index].total = calculateTotal(qty, rate, gst)
        }

        const grandTotal = updatedDrugCode.reduce(
          (sum, item) => sum + (parseFloat(item.total) || 0),
          0
        )

        return {
          ...prev,
          drugCode: updatedDrugCode,
          grandTotal,
        }
      })
    } else {
      const updatedFormData = {
        ...formData,
        [name]: value,
      }

      setFormData(updatedFormData)

      if (name === "financialYearId") {
        fetchSchemesAndQuarters(value, false)
        setFormData(prev => ({
          ...prev,
          schemeId: "",
          quarterId: "",
        }))

        if (formData.workingPlaceId && value) {
          fetchBudgetData(formData.workingPlaceId, value, "", "")
        }
      } else if (name === "schemeId" || name === "quarterId") {
        if (formData.workingPlaceId && formData.financialYearId) {
          fetchBudgetData(
            formData.workingPlaceId,
            formData.financialYearId,
            name === "schemeId" ? value : formData.schemeId,
            name === "quarterId" ? value : formData.quarterId
          )
        }
      } else if (name === "workingPlaceId") {
        if (formData.financialYearId && value) {
          fetchBudgetData(
            value,
            formData.financialYearId,
            formData.schemeId,
            formData.quarterId
          )
        }
      }
    }
  }

  const handleEditInputChange = (e, index = null) => {
    const { name, value } = e.target

    if (index !== null) {
      setEditFormData(prev => {
        const updatedDrugCode = [...prev.drugCode]
        updatedDrugCode[index] = {
          ...updatedDrugCode[index],
          [name]: value,
        }

        if (name === "qty" || name === "rate" || name === "gst") {
          const qty = name === "qty" ? value : updatedDrugCode[index].qty
          const rate = name === "rate" ? value : updatedDrugCode[index].rate
          const gst = name === "gst" ? value : updatedDrugCode[index].gst
          updatedDrugCode[index].total = calculateTotal(qty, rate, gst)
        }

        const grandTotal = updatedDrugCode.reduce(
          (sum, item) => sum + (parseFloat(item.total) || 0),
          0
        )

        return {
          ...prev,
          drugCode: updatedDrugCode,
          grandTotal,
        }
      })
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value,
      }))

      if (name === "financialYearId") {
        fetchSchemesAndQuarters(value, true)
        setEditFormData(prev => ({
          ...prev,
          schemeId: "",
          quarterId: "",
        }))

        if (editFormData.workingPlaceId && value) {
          fetchBudgetData(editFormData.workingPlaceId, value, "", "")
        }
      } else if (name === "schemeId" || name === "quarterId") {
        if (editFormData.workingPlaceId && editFormData.financialYearId) {
          fetchBudgetData(
            editFormData.workingPlaceId,
            editFormData.financialYearId,
            name === "schemeId" ? value : editFormData.schemeId,
            name === "quarterId" ? value : editFormData.quarterId
          )
        }
      } else if (name === "workingPlaceId") {
        if (editFormData.financialYearId && value) {
          fetchBudgetData(
            value,
            editFormData.financialYearId,
            editFormData.schemeId,
            editFormData.quarterId
          )
        }
      }
    }
  }

  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    setFormData(prev => {
      const newData = { ...prev }

      if (name === "institutionTypeId") {
        newData.institutionTypeId = value
        newData.workingPlaceId = ""
        newData.districtId = ""
        setDistrict({})
        setPlaceOfWorking([])
        if (value) {
          fetchPlaceOfWorking(value)
        }
      } else if (name === "workingPlaceId") {
        newData.workingPlaceId = value
        fetchDistrictData(value)
        if (formData.financialYearId) {
          fetchBudgetData(
            value,
            formData.financialYearId,
            formData.schemeId,
            formData.quarterId
          )
        }
      } else if (name === "schemeId" || name === "quarterId") {
        newData[name] = value
        if (formData.workingPlaceId && formData.financialYearId) {
          fetchBudgetData(
            formData.workingPlaceId,
            formData.financialYearId,
            name === "schemeId" ? value : formData.schemeId,
            name === "quarterId" ? value : formData.quarterId
          )
        }
      }

      return newData
    })
  }

  const handleEditSelectChange = (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    setEditFormData(prev => {
      const newData = { ...prev }

      if (name === "institutionTypeId") {
        newData.institutionTypeId = value
        newData.workingPlaceId = ""
        newData.districtId = ""
        fetchPlaceOfWorking(value, true)
      } else if (name === "workingPlaceId") {
        newData.workingPlaceId = value
        fetchDistrictData(value, true)
        if (editFormData.financialYearId) {
          fetchBudgetData(
            value,
            editFormData.financialYearId,
            editFormData.schemeId,
            editFormData.quarterId
          )
        }
      } else if (name === "schemeId" || name === "quarterId") {
        newData[name] = value
        if (editFormData.workingPlaceId && editFormData.financialYearId) {
          fetchBudgetData(
            editFormData.workingPlaceId,
            editFormData.financialYearId,
            name === "schemeId" ? value : editFormData.schemeId,
            name === "quarterId" ? value : editFormData.quarterId
          )
        }
      }

      return newData
    })
  }

  const handleDrugSelectChange = (selectedOption, actionMeta, index) => {
    const drugCodeValue = selectedOption?.value || ""
    const selectedDrug = drugItems.find(drug => drug.drugCode === drugCodeValue)

    if (selectedDrug) {
      setFormData(prev => {
        const updatedDrugCode = [...prev.drugCode]
        updatedDrugCode[index] = {
          ...updatedDrugCode[index],
          drugCodeId: selectedDrug._id || "",
          drugCode: selectedDrug.drugCode,
          tradeName: selectedDrug.tradeName || "",
          rate: selectedDrug.unitPrice || "",
          gst: selectedDrug.salesTax || "0",
          qty: "",
          total: "",
        }

        return {
          ...prev,
          drugCode: updatedDrugCode,
        }
      })
    }
  }

  const handleEditDrugSelectChange = (selectedOption, actionMeta, index) => {
    const drugCodeValue = selectedOption?.value || ""
    const selectedDrug = drugItems.find(drug => drug.drugCode === drugCodeValue)

    if (selectedDrug) {
      setEditFormData(prev => {
        const updatedDrugCode = [...prev.drugCode]
        updatedDrugCode[index] = {
          ...updatedDrugCode[index],
          drugCodeId: selectedDrug._id || "",
          drugCode: selectedDrug.drugCode,
          tradeName: selectedDrug.tradeName || "",
          rate: selectedDrug.unitPrice || "",
          gst: selectedDrug.salesTax || "0",
          qty: updatedDrugCode[index].qty || "",
          total: calculateTotal(
            updatedDrugCode[index].qty || "",
            selectedDrug.unitPrice,
            selectedDrug.salesTax || 0
          ),
        }

        const grandTotal = updatedDrugCode.reduce(
          (sum, item) => sum + (parseFloat(item.total) || 0),
          0
        )

        return {
          ...prev,
          drugCode: updatedDrugCode,
          grandTotal,
        }
      })
    }
  }

  const addDrugItem = () => {
    setFormData(prev => ({
      ...prev,
      drugCode: [
        ...prev.drugCode,
        {
          drugCodeId: "",
          drugCode: "",
          tradeName: "",
          rate: "",
          gst: "",
          qty: "",
          total: "",
        },
      ],
    }))
  }

  const addEditDrugItem = () => {
    setEditFormData(prev => ({
      ...prev,
      drugCode: [
        ...prev.drugCode,
        {
          drugCodeId: "",
          drugCode: "",
          tradeName: "",
          rate: "",
          gst: "",
          qty: "",
          total: "",
        },
      ],
    }))
  }

  const removeDrugItem = index => {
    if (formData.drugCode.length <= 1) {
      toast.error("At least one drug item is required")
      return
    }

    setFormData(prev => {
      const updatedDrugCode = [...prev.drugCode]
      updatedDrugCode.splice(index, 1)

      const grandTotal = updatedDrugCode.reduce(
        (sum, item) => sum + (parseFloat(item.total) || 0),
        0
      )

      return {
        ...prev,
        drugCode: updatedDrugCode,
        grandTotal,
      }
    })
  }

  const removeEditDrugItem = index => {
    if (editFormData.drugCode.length <= 1) {
      toast.error("At least one drug item is required")
      return
    }

    setEditFormData(prev => {
      const updatedDrugCode = [...prev.drugCode]
      updatedDrugCode.splice(index, 1)

      const grandTotal = updatedDrugCode.reduce(
        (sum, item) => sum + (parseFloat(item.total) || 0),
        0
      )

      return {
        ...prev,
        drugCode: updatedDrugCode,
        grandTotal,
      }
    })
  }

  const getCurrentInstitutionType = () => {
    if (!formData.institutionTypeId) return null
    const institution = employmentType.find(
      opt => opt._id === formData.institutionTypeId
    )
    return institution
      ? {
          value: institution._id,
          label: institution.name,
        }
      : null
  }

  const getCurrentPlace = () => {
    if (!formData.workingPlaceId) return null
    const place = placeOfWorking.find(p => p._id === formData.workingPlaceId)
    return place ? { value: place._id, label: place.name } : null
  }

  const getCurrentDrug = index => {
    if (!formData.drugCode[index]?.drugCode) return null
    const drug = drugItems.find(
      d => d.drugCode === formData.drugCode[index].drugCode
    )
    return drug ? { value: drug.drugCode, label: `${drug.drugCode}` } : null
  }

  const getCurrentScheme = () => {
    if (!formData.schemeId) return null
    const scheme = schemes.find(s => s._id === formData.schemeId)
    return scheme ? { value: scheme._id, label: scheme.name } : null
  }

  const getCurrentQuarter = () => {
    if (!formData.quarterId) return null
    const quarter = quarters.find(q => q._id === formData.quarterId)
    return quarter ? { value: quarter._id, label: quarter.quarter } : null
  }

  const getEditCurrentInstitutionType = () => {
    if (!editFormData.institutionTypeId) return null
    const institution = employmentType.find(
      opt => opt._id === editFormData.institutionTypeId
    )
    return institution
      ? {
          value: institution._id,
          label: institution.name,
        }
      : null
  }

  const getEditCurrentPlace = () => {
    if (!editFormData.workingPlaceId) return null
    const place = editPlaceOfWorking.find(
      p => p._id === editFormData.workingPlaceId
    )
    return place ? { value: place._id, label: place.name } : null
  }

  const getEditCurrentDrug = index => {
    if (!editFormData.drugCode[index]?.drugCode) return null
    const drug = drugItems.find(
      d => d.drugCode === editFormData.drugCode[index].drugCode
    )
    return drug ? { value: drug.drugCode, label: `${drug.drugCode}` } : null
  }
  const getEditCurrentScheme = () => {
    if (!editFormData.schemeId) return null
    const scheme = editSchemes.find(s => s._id === editFormData.schemeId)
    return scheme ? { value: scheme._id, label: scheme.name } : null
  }

  const getEditCurrentQuarter = () => {
    if (!editFormData.quarterId) return null
    const quarter = editQuarters.find(q => q._id === editFormData.quarterId)
    return quarter ? { value: quarter._id, label: quarter.quarter } : null
  }

  const institutionTypeOptions = useMemo(
    () =>
      employmentType.map(type => ({
        value: type._id,
        label: type.name,
      })),
    [employmentType]
  )

  const placeOfWorkingOptions = useMemo(
    () =>
      placeOfWorking.map(place => ({
        value: place._id,
        label: place.name,
      })),
    [placeOfWorking]
  )

  const editPlaceOfWorkingOptions = useMemo(
    () =>
      editPlaceOfWorking.map(place => ({
        value: place._id,
        label: place.name,
      })),
    [editPlaceOfWorking]
  )

  const drugOptions = useMemo(
    () =>
      drugItems.map(drug => ({
        value: drug.drugCode,
        label: `${drug.drugCode}`,
      })),
    [drugItems]
  )

  const schemeOptions = useMemo(
    () =>
      schemes.map(scheme => ({
        value: scheme._id,
        label: scheme.name,
      })),
    [schemes]
  )

  const quarterOptions = useMemo(
    () =>
      quarters.map(quarter => ({
        value: quarter._id,
        label: quarter.quarter,
      })),
    [quarters]
  )

  const editSchemeOptions = useMemo(
    () =>
      editSchemes.map(scheme => ({
        value: scheme._id,
        label: scheme.name,
      })),
    [editSchemes]
  )

  const editQuarterOptions = useMemo(
    () =>
      editQuarters.map(quarter => ({
        value: quarter._id,
        label: quarter.quarter,
      })),
    [editQuarters]
  )

  const filterPlaceOfWorkingOptions = useMemo(
    () =>
      filteredPlaces.map(place => ({
        value: place._id,
        label: place.name,
      })),
    [filteredPlaces]
  )

  const validateForm = data => {
    const errors = {}

    if (!data.workingPlaceId) {
      errors.workingPlaceId = "Place of Working is required"
    }

    if (!data.financialYearId) {
      errors.financialYearId = "Financial Year is required"
    }

    if (!data.schemeId) {
      errors.schemeId = "Scheme is required"
    }

    if (!data.quarterId) {
      errors.quarterId = "Quarter is required"
    }

    const validDrugCode = data.drugCode.filter(
      item => item.drugCode && item.qty
    )

    if (validDrugCode.length === 0) {
      errors.drugCode = "At least one drug item is required"
    } else {
      data.drugCode.forEach((item, index) => {
        if (!item.drugCode) {
          errors[`drugCode_${index}`] = "Drug Code is required"
        }
        if (!item.qty || parseInt(item.qty) <= 0) {
          errors[`qty_${index}`] = "Valid quantity is required"
        }
      })
    }

    const grandTotal = parseFloat(data.grandTotal) || 0
    if (grandTotal > budgetData.availableBudget) {
      errors.grandTotal = "Total amount exceeds available budget"
    }

    return errors
  }

  const handleAddSubmit = async e => {
    e.preventDefault()

    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const validDrugCode = formData.drugCode.filter(
        item => item.drugCode && item.qty
      )

      const response = await axios.post(
        URLS.AddDruginGroup,
        {
          workingPlaceId: formData.workingPlaceId,
          instituteTypeId: formData.institutionTypeId,
          financialYearId: formData.financialYearId,
          schemeId: formData.schemeId,
          quarterId: formData.quarterId,
          formType: formId,
          addedBy: userDetails?._id,
          drugCode: validDrugCode.map(item => ({
            drugCodeId: item.drugCodeId,
            drugCode: item.drugCode,
            tradeName: item.tradeName,
            rate: item.rate,
            gst: item.gst,
            qty: item.qty,
            total: item.total,
          })),
          grandTotal: formData.grandTotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data) {
        toast.success("Drug indent added successfully")
        setShowAddForm(false)
        setShowTableView(true)
        resetForm()
        fetchDrugIndents()
      }
    } catch (error) {
      console.error("Error adding drug indent:", error)
      toast.error(error.response?.data?.message || "Failed to add drug indent")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async e => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      const validDrugCode = editFormData.drugCode.filter(
        item => item.drugCode && item.qty
      )

      const response = await axios.put(
        URLS.EditDrugGroup + editFormData._id,
        {
          workingPlaceId: editFormData.workingPlaceId,
          instituteTypeId: editFormData.institutionTypeId,
          financialYearId: editFormData.financialYearId,
          schemeId: editFormData.schemeId,
          quarterId: editFormData.quarterId,
          formType: formId,
          drugCode: validDrugCode.map(item => ({
            drugCodeId: item.drugCodeId,
            drugCode: item.drugCode,
            tradeName: item.tradeName,
            rate: item.rate,
            gst: item.gst,
            qty: item.qty,
            total: item.total,
          })),
          grandTotal: editFormData.grandTotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data) {
        toast.success("Drug indent updated successfully")
        setShowEditForm(false)
        setShowTableView(true)
        resetEditForm()
        fetchDrugIndents()
      }
    } catch (error) {
      console.error("Error updating drug indent:", error)
      toast.error(
        error.response?.data?.message || "Failed to update drug indent"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlefreeze = () => {
    handleSubmitfreeze()
  }

  const handleSubmitfreeze = async () => {
    try {
      const filterParams = {}

      // if (filters.institutionTypeId) {
      //   filterParams.institutionTypeId = filters.institutionTypeId
      // }

      if (filters.workingPlaceId) {
        filterParams.workingPlaceId = filters.workingPlaceId
      }

      if (filters.financialYearId) {
        filterParams.financialYearId = filters.financialYearId
      }

      if (filters.schemeId) {
        filterParams.schemeId = filters.schemeId
      }

      if (filters.quarterId) {
        filterParams.quarterId = filters.quarterId
      }

      const response = await axios.post(
        URLS.freezeGroup,
        { formType: formId, financialYearId: financialYearId, ...filterParams },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data) {
        toast.success("Freeze Updated Successfully")
        setFreezeButton(false)
        fetchDrugIndents()
      }
    } catch (error) {
      console.error("Error Freeze Updated:", error)
      toast.error("Failed to Freeze Updated")
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await axios.delete(
        URLS.DeleteDrugGroup + itemToDelete._id,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data) {
        toast.success("Drug indent deleted successfully")
        setDeleteModal(false)
        setItemToDelete(null)
        fetchDrugIndents()
      }
    } catch (error) {
      console.error("Error deleting drug indent:", error)
      toast.error("Failed to delete drug indent")
    }
  }

  const resetForm = () => {
    const firstFinancialYearId =
      financialYears.length > 0 ? financialYears[0]._id : ""

    setFormData({
      institutionTypeId: "",
      workingPlaceId: "",
      districtId: "",
      financialYearId: firstFinancialYearId,
      schemeId: "",
      quarterId: "",
      drugCode: [
        {
          drugCodeId: "",
          drugCode: "",
          tradeName: "",
          rate: "",
          gst: "",
          qty: "",
          total: "",
        },
      ],
      grandTotal: "",
    })
    setDistrict({})
    setSchemes([])
    setQuarters([])
    setBudgetData({
      budget: 0,
      bookedBudget: 0,
      availableBudget: 0,
    })
    setValidationErrors({})

    if (firstFinancialYearId) {
      fetchSchemesAndQuarters(firstFinancialYearId, false)
    }
  }

  const resetEditForm = () => {
    setEditFormData({
      _id: "",
      institutionTypeId: "",
      workingPlaceId: "",
      districtId: "",
      financialYearId: "",
      schemeId: "",
      quarterId: "",
      drugCode: [
        {
          drugCodeId: "",
          drugCode: "",
          tradeName: "",
          rate: "",
          gst: "",
          qty: "",
          total: "",
        },
      ],
      grandTotal: "",
    })
    setEditDistrict({})
    setEditPlaceOfWorking([])
    setEditSchemes([])
    setEditQuarters([])
    setValidationErrors({})
  }

  const addPopUp = () => {
    const storedInstitutionTypeId =
      localStorage.getItem("institutionTypeId") || ""
    const storedWorkingPlaceId = localStorage.getItem("workingPlaceId") || ""
    const storedSchemeId = localStorage.getItem("schemeId") || ""
    const storedQuarterId = localStorage.getItem("quarterId") || ""
    const storedFinancialYearId =
      localStorage.getItem("financialYearId") ||
      (financialYears.length > 0 ? financialYears[0]._id : "")

    setFormData(prev => ({
      ...prev,
      institutionTypeId: storedInstitutionTypeId,
      workingPlaceId: storedWorkingPlaceId,
      financialYearId: storedFinancialYearId,
      schemeId: storedSchemeId,
      quarterId: storedQuarterId,
    }))

    if (storedInstitutionTypeId) {
      fetchPlaceOfWorking(storedInstitutionTypeId)
    }

    if (storedWorkingPlaceId) {
      fetchDistrictData(storedWorkingPlaceId)
    }

    if (storedFinancialYearId) {
      fetchSchemesAndQuarters(storedFinancialYearId, false)
    }

    if (storedWorkingPlaceId && storedFinancialYearId) {
      fetchBudgetData(
        storedWorkingPlaceId,
        storedFinancialYearId,
        storedSchemeId,
        storedQuarterId
      )
    }

    setShowAddForm(true)
    setShowEditForm(false)
    setShowTableView(false)
  }

  const editPopUp = async item => {
    try {
      const editData = {
        _id: item._id,
        institutionTypeId: item.instituteTypeId || "",
        workingPlaceId: item.workingPlaceId || "",
        districtId: item.districtId || "",
        financialYearId: item.financialYearId || "",
        schemeId: item.schemeId || "",
        quarterId: item.quarterId || "",
        drugCode: item.drugCode || [
          {
            drugCodeId: "",
            drugCode: "",
            tradeName: "",
            rate: "",
            gst: "",
            qty: "",
            total: "",
          },
        ],
        grandTotal: item.grandTotal || "",
      }

      setEditFormData(editData)

      if (item.instituteTypeId) {
        await fetchPlaceOfWorking(item.instituteTypeId, true)
      }
      if (item.workingPlaceId) {
        await fetchDistrictData(item.workingPlaceId, true)
      }
      if (item.financialYearId) {
        await fetchSchemesAndQuarters(item.financialYearId, true)
      }
      if (item.workingPlaceId && item.financialYearId) {
        await fetchBudgetData(
          item.workingPlaceId,
          item.financialYearId,
          item.schemeId,
          item.quarterId
        )
      }

      setShowEditForm(true)
      setShowAddForm(false)
      setShowTableView(false)
    } catch (error) {
      console.error("Error in editPopUp:", error)
      toast.error("Failed to load edit form")
    }
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setShowTableView(true)
    resetForm()
    resetEditForm()
  }

  const calculateIndentTotal = indent => {
    if (!indent.drugCode || !Array.isArray(indent.drugCode)) {
      return parseFloat(indent.total) || 0
    }
    return indent.drugCode.reduce(
      (sum, item) => sum + (parseFloat(item.total) || 0),
      0
    )
  }

  const filteredItems = useMemo(
    () =>
      drugIndents.filter(item => {
        const matchesSearch =
          searchTerm === "" ||
          (item.drugCode && Array.isArray(item.drugCode)
            ? item.drugCode.some(
                drug =>
                  drug.drugCode
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  drug.tradeName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
            : false)

        return matchesSearch
      }),
    [drugIndents, searchTerm]
  )

  const pagesVisited = pageNumber * listPerPage
  const currentItems = useMemo(
    () => filteredItems.slice(pagesVisited, pagesVisited + listPerPage),
    [filteredItems, pagesVisited, listPerPage]
  )
  const pageCount = Math.ceil(filteredItems.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 38,
      height: 38,
      fontSize: 14,
      borderRadius: 4,
      borderColor: validationErrors[state.name]
        ? "#dc3545"
        : state.isFocused
        ? "#2684FF"
        : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(38,132,255,.25)" : "none",
      "&:hover": {
        borderColor: validationErrors[state.name] ? "#dc3545" : "#b3b7bb",
      },
    }),
    valueContainer: base => ({
      ...base,
      height: 38,
      padding: "0 8px",
    }),
    indicatorsContainer: base => ({
      ...base,
      height: 38,
    }),
    option: base => ({
      ...base,
      fontSize: 14,
      padding: "8px 12px",
    }),
    placeholder: base => ({
      ...base,
      fontSize: 14,
      color: "#6c757d",
    }),
  }

  if (isLoading && !showAddForm && !showEditForm) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">Loading drug indents...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Card className="text-center p-2">
          <h5 className=" fw-bold text-primary">
            {form.group} {form.formName || "Drug Indent Form"}
          </h5>
        </Card>
        {showAddForm && (
          <Card className="mb-4">
            <CardBody>
              <Form onSubmit={handleAddSubmit}>
                <Row className="mb-2">
                  <Col md={2}>
                    <FormGroup>
                      <Label for="financialYearId" className="fw-bold">
                        Financial Year*
                      </Label>
                      <Input
                        type="select"
                        name="financialYearId"
                        value={formData.financialYearId}
                        onChange={handleInputChange}
                        className={
                          validationErrors.financialYearId ? "is-invalid" : ""
                        }
                        required
                      >
                        <option value="">Select Financial Year</option>
                        {financialYears.map(fy => (
                          <option key={fy._id} value={fy._id}>
                            {fy.year}
                          </option>
                        ))}
                      </Input>
                      {validationErrors.financialYearId && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.financialYearId}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="schemeId" className="fw-bold">
                        Scheme*
                      </Label>
                      <Select
                        name="schemeId"
                        value={getCurrentScheme()}
                        onChange={handleSelectChange}
                        options={schemeOptions}
                        styles={selectStyles}
                        placeholder="Select"
                        isSearchable
                        required
                        isDisabled={!formData.financialYearId}
                        className={
                          validationErrors.schemeId ? "is-invalid" : ""
                        }
                      />
                      {validationErrors.schemeId && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.schemeId}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="quarterId" className="fw-bold">
                        Quarter*
                      </Label>
                      <Select
                        name="quarterId"
                        value={getCurrentQuarter()}
                        onChange={handleSelectChange}
                        options={quarterOptions}
                        styles={selectStyles}
                        placeholder="Select"
                        isSearchable
                        required
                        isDisabled={!formData.financialYearId}
                        className={
                          validationErrors.quarterId ? "is-invalid" : ""
                        }
                      />
                      {validationErrors.quarterId && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.quarterId}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="institutionTypeId" className="fw-bold">
                        Type Of Institution*
                      </Label>
                      <Select
                        name="institutionTypeId"
                        value={getCurrentInstitutionType()}
                        onChange={handleSelectChange}
                        options={institutionTypeOptions}
                        styles={selectStyles}
                        placeholder="Select"
                        isSearchable
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
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
                        isDisabled={!formData.institutionTypeId}
                        className={
                          validationErrors.workingPlaceId ? "is-invalid" : ""
                        }
                      />
                      {validationErrors.workingPlaceId && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.workingPlaceId}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>District</Label>
                      <Input
                        readOnly
                        disabled
                        type="text"
                        value={district.name || ""}
                        className="bg-light"
                        placeholder="Auto-filled"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <Card className="text-center bg-primary text-white">
                      <CardBody className="py-2">
                        <h6 className="mb-1 text-white">Budget Allotted</h6>
                        <h4 className="mb-0 text-white">
                          {formatCurrency(budgetData.budget)}
                        </h4>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-warning text-white">
                      <CardBody className="py-2">
                        <h6 className="mb-1 text-white">Budget Booked</h6>
                        <h4 className="mb-0 text-white">
                          {formatCurrency(budgetData.bookedBudget)}
                        </h4>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-success text-white">
                      <CardBody className="py-2">
                        <h6 className="mb-1 text-white">Available Budget</h6>
                        <h4 className="mb-0 text-white">
                          {formatCurrency(budgetData.availableBudget)}
                        </h4>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <div className="border-top border-bottom pt-2">
                  <div className=" mb-2">
                    <h5 className="mb-0">Drug Items</h5>
                  </div>
                  {formData.drugCode.map((item, index) => (
                    <div key={index} className="mb-2 ">
                      <Row>
                        <Col md={3}>
                          <FormGroup>
                            <Label className="fw-bold small mb-1">
                              Drug Code*
                            </Label>
                            <Select
                              name={`drugCode_${index}`}
                              value={getCurrentDrug(index)}
                              onChange={(selectedOption, actionMeta) =>
                                handleDrugSelectChange(
                                  selectedOption,
                                  actionMeta,
                                  index
                                )
                              }
                              options={drugOptions}
                              styles={selectStyles}
                              placeholder="Select Drug Code"
                              isSearchable
                              required
                            />
                            {validationErrors[`drugCode_${index}`] && (
                              <div className="invalid-feedback d-block">
                                {validationErrors[`drugCode_${index}`]}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label className="small mb-1">Trade Name</Label>
                            <Input
                              type="text"
                              value={item.tradeName}
                              readOnly
                              className="bg-light"
                              placeholder="Auto-filled"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label className="small mb-1">Rate (₹)</Label>
                            <Input
                              type="text"
                              value={item.rate ? formatNumber(item.rate) : ""}
                              readOnly
                              className="bg-light text-end"
                              placeholder="0.00"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          <FormGroup>
                            <Label className="small mb-1">GST (%)</Label>
                            <Input
                              type="text"
                              value={item.gst || ""}
                              readOnly
                              className="bg-light text-end"
                              placeholder="0"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          <FormGroup>
                            <Label className="fw-bold small mb-1">Qty*</Label>
                            <Input
                              type="number"
                              inputMode="decimal"
                              onWheel={e => e.target.blur()}
                              name="qty"
                              value={item.qty}
                              onChange={e => handleInputChange(e, index)}
                              min="1"
                              step="1"
                              placeholder="0"
                              required
                              disabled={!item.drugCode}
                              className={
                                validationErrors[`qty_${index}`]
                                  ? "is-invalid"
                                  : ""
                              }
                            />
                            {validationErrors[`qty_${index}`] && (
                              <div className="invalid-feedback d-block">
                                {validationErrors[`qty_${index}`]}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          <FormGroup>
                            <Label className="small mb-1">Total (₹)</Label>
                            <Input
                              type="text"
                              value={
                                item.total ? formatCurrency(item.total) : ""
                              }
                              readOnly
                              className="bg-light text-end fw-bold"
                              placeholder="₹0.00"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          {index === formData.drugCode.length - 1 && (
                            <Button
                              type="button"
                              color="primary"
                              size="sm"
                              onClick={addDrugItem}
                              className="w-100 mt-4 d-flex"
                            >
                              <small>
                                <i className="bx bx-plus me-1"></i>
                                Add
                              </small>
                            </Button>
                          )}
                        </Col>
                        <Col md={1}>
                          {formData.drugCode.length > 1 && (
                            <Button
                              type="button"
                              color="danger"
                              size="sm"
                              onClick={() => removeDrugItem(index)}
                              className="w-100 mt-4"
                            >
                              <i className="bx bx-trash"></i>
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
                <Row className="mt-3">
                  <Col md={{ offset: 8, size: 4 }}>
                    <div className="border-top pt-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-primary">Grand Total:</h5>
                        <h4 className="mb-0 text-primary">
                          {formData.grandTotal
                            ? formatCurrency(formData.grandTotal)
                            : "₹0.00"}
                        </h4>
                      </div>
                      {validationErrors.grandTotal && (
                        <div className="invalid-feedback d-block">
                          {validationErrors.grandTotal}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between mt-4 pt-2 border-top">
                  <Button color="secondary" onClick={cancelForm} type="button">
                    <i className="bx bx-x me-1"></i>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-check me-1"></i>
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        )}
        {showEditForm && (
          <Card className="mb-4">
            <CardBody>
              <Form onSubmit={handleEditSubmit}>
                <Row className="mb-2">
                  <Col md={2}>
                    <FormGroup>
                      <Label for="financialYearId" className="fw-bold">
                        Financial Year*
                      </Label>
                      <Input
                        type="select"
                        name="financialYearId"
                        value={editFormData.financialYearId}
                        onChange={handleEditInputChange}
                        disabled
                        required
                      >
                        <option value="">Select Financial Year</option>
                        {financialYears.map(fy => (
                          <option key={fy._id} value={fy._id}>
                            {fy.year}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="schemeId" className="fw-bold">
                        Scheme*
                      </Label>
                      <Select
                        name="schemeId"
                        value={getEditCurrentScheme()}
                        onChange={handleEditSelectChange}
                        options={editSchemeOptions}
                        styles={selectStyles}
                        placeholder="Select"
                        isSearchable
                        required
                        isDisabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="quarterId" className="fw-bold">
                        Quarter*
                      </Label>
                      <Select
                        name="quarterId"
                        value={getEditCurrentQuarter()}
                        onChange={handleEditSelectChange}
                        options={editQuarterOptions}
                        styles={selectStyles}
                        placeholder="Select"
                        isSearchable
                        required
                        isDisabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="institutionTypeId" className="fw-bold">
                        Type Of Institution*
                      </Label>
                      <Select
                        name="institutionTypeId"
                        value={getEditCurrentInstitutionType()}
                        onChange={handleEditSelectChange}
                        options={institutionTypeOptions}
                        styles={selectStyles}
                        placeholder="Select"
                        isSearchable
                        required
                        isDisabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="workingPlaceId" className="fw-bold">
                        Place of Working*
                      </Label>
                      <Select
                        name="workingPlaceId"
                        value={getEditCurrentPlace()}
                        onChange={handleEditSelectChange}
                        options={editPlaceOfWorkingOptions}
                        styles={selectStyles}
                        placeholder="Select Place"
                        isSearchable
                        required
                        isDisabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label>District</Label>
                      <Input
                        readOnly
                        disabled
                        type="text"
                        value={editDistrict.name || ""}
                        className="bg-light"
                        placeholder="Auto-filled"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4}>
                    <Card className="text-center bg-primary text-white">
                      <CardBody className="py-2">
                        <h6 className="mb-1 text-white">Budget Allotted</h6>
                        <h4 className="mb-0 text-white">
                          {formatCurrency(budgetData.budget)}
                        </h4>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-warning text-white">
                      <CardBody className="py-2">
                        <h6 className="mb-1 text-white">Budget Booked</h6>
                        <h4 className="mb-0 text-white">
                          {formatCurrency(budgetData.bookedBudget)}
                        </h4>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center bg-success text-white">
                      <CardBody className="py-2">
                        <h6 className="mb-1 text-white">Available Budget</h6>
                        <h4 className="mb-0 text-white">
                          {formatCurrency(budgetData.availableBudget)}
                        </h4>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <div className="border-top border-bottom pt-2">
                  <div className="mb-2">
                    <h5 className="mb-0">Drug Items</h5>
                  </div>
                  {editFormData.drugCode.map((item, index) => (
                    <div key={index} className="mb-1 ">
                      <Row>
                        <Col md={3}>
                          <FormGroup>
                            <Label className="fw-bold small mb-1">
                              Drug Code*
                            </Label>
                            <Select
                              name={`editDrugCode_${index}`}
                              value={getEditCurrentDrug(index)}
                              onChange={(selectedOption, actionMeta) =>
                                handleEditDrugSelectChange(
                                  selectedOption,
                                  actionMeta,
                                  index
                                )
                              }
                              options={drugOptions}
                              styles={selectStyles}
                              placeholder="Select Drug Code"
                              isSearchable
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label className="small mb-1">Trade Name</Label>
                            <Input
                              type="text"
                              value={item.tradeName}
                              readOnly
                              className="bg-light"
                              placeholder="Auto-filled"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label className="small mb-1">Rate (₹)</Label>
                            <Input
                              type="text"
                              value={item.rate ? formatNumber(item.rate) : ""}
                              readOnly
                              className="bg-light text-end"
                              placeholder="0.00"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          <FormGroup>
                            <Label className="small mb-1">GST (%)</Label>
                            <Input
                              type="text"
                              value={item.gst || ""}
                              readOnly
                              className="bg-light text-end"
                              placeholder="0"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          <FormGroup>
                            <Label className="fw-bold small mb-1">Qty*</Label>
                            <Input
                              type="number"
                              inputMode="decimal"
                              onWheel={e => e.target.blur()}
                              name="qty"
                              value={item.qty}
                              onChange={e => handleEditInputChange(e, index)}
                              min="1"
                              step="1"
                              placeholder="0"
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          <FormGroup>
                            <Label className="small mb-1">Total (₹)</Label>
                            <Input
                              type="text"
                              value={
                                item.total ? formatCurrency(item.total) : ""
                              }
                              readOnly
                              className="bg-light text-end fw-bold"
                              placeholder="₹0.00"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1}>
                          {index === editFormData.drugCode.length - 1 && (
                            <Button
                              type="button"
                              color="primary"
                              size="sm"
                              onClick={addEditDrugItem}
                              className="w-100 mt-4"
                            >
                              <small>
                                <i className="bx bx-plus me-1"></i>
                                Add
                              </small>
                            </Button>
                          )}
                        </Col>
                        <Col md={1}>
                          {editFormData.drugCode.length > 1 && (
                            <Button
                              type="button"
                              color="danger"
                              size="sm"
                              onClick={() => removeEditDrugItem(index)}
                              className="w-100 mt-4"
                            >
                              <i className="bx bx-trash"></i>
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
                <Row className="mt-3">
                  <Col md={{ offset: 8, size: 4 }}>
                    <div className="border-top pt-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-primary">Grand Total:</h5>
                        <h4 className="mb-0 text-primary">
                          {editFormData.grandTotal
                            ? formatCurrency(editFormData.grandTotal)
                            : "₹0.00"}
                        </h4>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between mt-4 pt-2 border-top">
                  <Button color="secondary" onClick={cancelForm} type="button">
                    <i className="bx bx-x me-1"></i>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-check me-1"></i>
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        )}
        {showTableView && (
          <>
            {showFilters && (
              <Card>
                <CardBody>
                  <h5 className="mb-2 text-primary">
                    <i className="fas fa-filter me-2"></i>
                    Filters
                  </h5>
                  <Row>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Financial Year</Label>
                        <Input
                          type="select"
                          name="financialYearId"
                          value={filters.financialYearId}
                          onChange={handleFilterChange}
                        >
                          <option value="">All Financial Years</option>
                          {financialYears.map(fy => (
                            <option key={fy._id} value={fy._id}>
                              {fy.year}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Scheme</Label>
                        <Input
                          type="select"
                          name="schemeId"
                          value={filters.schemeId}
                          onChange={handleFilterChange}
                          disabled={!filters.financialYearId}
                        >
                          <option value="">All Schemes</option>
                          {schemes.map(scheme => (
                            <option key={scheme._id} value={scheme._id}>
                              {scheme.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Quarter</Label>
                        <Input
                          type="select"
                          name="quarterId"
                          value={filters.quarterId}
                          onChange={handleFilterChange}
                          disabled={!filters.financialYearId}
                        >
                          <option value="">All Quarters</option>
                          {quarters.map(quarter => (
                            <option key={quarter._id} value={quarter._id}>
                              {quarter.quarter}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Institution Type</Label>
                        <Select
                          name="institutionTypeId"
                          value={institutionTypeOptions.find(
                            opt => opt.value === filters.institutionTypeId
                          )}
                          onChange={handleSelectFilterChange}
                          options={institutionTypeOptions}
                          styles={selectStyles}
                          placeholder="Institution Type"
                          isSearchable
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Place of Working</Label>
                        <Select
                          name="workingPlaceId"
                          value={filterPlaceOfWorkingOptions.find(
                            opt => opt.value === filters.workingPlaceId
                          )}
                          onChange={handleSelectFilterChange}
                          options={filterPlaceOfWorkingOptions}
                          styles={selectStyles}
                          placeholder={
                            filters.institutionTypeId
                              ? "Select Place of Working"
                              : "Institution Type First"
                          }
                          isSearchable
                          isClearable
                          isDisabled={!filters.institutionTypeId}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <Button
                        className="mt-4"
                        color="primary"
                        onClick={handleSearch}
                      >
                        <i className="bx bx-search me-1"></i>
                        Search
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
            <Card>
              <CardBody>
                <Row className="mb-2">
                  <Col md={6}>
                    {Roles?.DrugIndentAdd === true ||
                    Roles?.accessAll === true ? (
                      <>
                        <Button color="primary" onClick={addPopUp}>
                          <i className="bx bx-plus me-1"></i>
                          Create Drug Indent
                        </Button>
                      </>
                    ) : (
                      ""
                    )}
                    <Button
                      color="light"
                      onClick={toggleFilters}
                      className="ms-2"
                    >
                      <i className={`fas fa-filter me-1`}></i>
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => {
                        setFreezeButton(true)
                      }}
                      title="Freeze"
                      className="ms-2"
                    >
                      <i className={`bx bx-health me-1`}></i>
                      {"Freeze"}
                    </Button>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex justify-content-end align-items-center">
                      <CSVLink {...csvReport} className="btn btn-success me-2">
                        <i className="bx bx-file me-1"></i>
                        Export to Excel
                      </CSVLink>
                      <div style={{ width: "300px" }}>
                        <Input
                          type="search"
                          placeholder="Search drug code or trade name..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="table-responsive">
                  <Table hover bordered striped className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center"> S.No </th>
                        <th>Date / Time</th>
                        <th>Institution Type</th>
                        <th>Place of Working</th>
                        <th>District</th>
                        <th>Financial Year</th>
                        <th>Scheme</th>
                        <th>Quarter</th>
                        <th>Drug Items Count</th>
                        <th className="text-end">Total Amount</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((item, index) => {
                          const drugItemsCount =
                            item.drugCode && Array.isArray(item.drugCode)
                              ? item.drugCode.length
                              : 0
                          const indentTotal = calculateIndentTotal(item)
                          return (
                            <tr key={item._id}>
                              <td className="text-center fw-bold">
                                {pagesVisited + index + 1}
                              </td>
                              <td>
                                {item.logCreatedDate
                                  ? new Date(
                                      item.logCreatedDate
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
                              <td>{item.instituteTypeName || "N/A"}</td>
                              <td>{item.workingPlaceName || "N/A"}</td>
                              <td>{item.districtName || "N/A"}</td>
                              <td>{item.financialYear || "N/A"}</td>
                              <td>{item.schemeName || "N/A"}</td>
                              <td>{item.quarterName || "N/A"}</td>
                              <td>
                                <Button
                                  color="link"
                                  className="p-0 text-decoration-none"
                                  onClick={() => showIndentDetails(item)}
                                >
                                  {drugItemsCount} item
                                  {drugItemsCount !== 1 ? "s" : ""}
                                  <i className="bx bx-show ms-1"></i>
                                </Button>
                              </td>
                              <td className="text-end fw-bold text-primary">
                                {formatCurrency(indentTotal)}
                              </td>
                              <td className="text-center">
                                <div
                                  className="btn-group btn-group-sm"
                                  role="group"
                                >
                                  {Roles?.DrugIndentEdit === true ||
                                  Roles?.accessAll === true ? (
                                    <>
                                      <Button
                                        onClick={() => editPopUp(item)}
                                        color="primary"
                                        className="me-1"
                                        title="Edit"
                                      >
                                        <i className="bx bx-edit"></i>
                                      </Button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {Roles?.DrugIndentDelete === true ||
                                  Roles?.accessAll === true ? (
                                    <>
                                      <Button
                                        color="danger"
                                        onClick={() => {
                                          setItemToDelete(item)
                                          setDeleteModal(true)
                                        }}
                                        title="Delete"
                                      >
                                        <i className="bx bx-trash"></i>
                                      </Button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center py-5">
                            <div className="text-muted">
                              <i className="bx bx-package display-4"></i>
                              <p className="mt-3 mb-1">
                                No drug indent records found
                              </p>
                              {Object.values(filters).some(val => val) && (
                                <small className="text-muted">
                                  No results found for the applied filters.
                                  <Button
                                    color="link"
                                    size="sm"
                                    onClick={handleReset}
                                    className="p-0 ms-1"
                                  >
                                    Clear filters
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
                {filteredItems.length > listPerPage && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">
                      Showing
                      {Math.min(
                        pagesVisited + currentItems.length,
                        filteredItems.length
                      )}
                      of {filteredItems.length} records
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
                )}
              </CardBody>
            </Card>
          </>
        )}
        <Modal
          isOpen={detailsModal}
          toggle={() => setDetailsModal(false)}
          size="lg"
        >
          <ModalHeader toggle={() => setDetailsModal(false)}>
            Drug Indent Details
          </ModalHeader>
          <ModalBody>
            {selectedIndent && (
              <>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Institution Type:</strong>
                    <p className="mb-2">
                      {selectedIndent.instituteTypeName || "N/A"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <strong>Place of Working:</strong>
                    <p className="mb-2">
                      {selectedIndent.workingPlaceName || "N/A"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <strong>District:</strong>
                    <p className="mb-2">
                      {selectedIndent.districtName || "N/A"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <strong>Financial Year:</strong>
                    <p className="mb-2">
                      {selectedIndent.financialYear || "N/A"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <strong>Scheme:</strong>
                    <p className="mb-2">{selectedIndent.schemeName || "N/A"}</p>
                  </Col>
                  <Col md={6}>
                    <strong>Quarter:</strong>
                    <p className="mb-2">
                      {selectedIndent.quarterName || "N/A"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <strong>Created Date:</strong>
                    <p className="mb-2">
                      {selectedIndent.logCreatedDate
                        ? new Date(
                            selectedIndent.logCreatedDate
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
                    </p>
                  </Col>
                  <Col md={6}>
                    <strong>Total Amount:</strong>
                    <p className="mb-2 fw-bold text-primary">
                      {formatCurrency(calculateIndentTotal(selectedIndent))}
                    </p>
                  </Col>
                </Row>
                <hr />
                <h6 className="mb-2">Drug Items:</h6>
                {selectedIndent.drugCode &&
                Array.isArray(selectedIndent.drugCode) ? (
                  <div className="table-responsive">
                    <Table bordered size="sm">
                      <thead className="table-light">
                        <tr>
                          <th> S.No </th>
                          <th>Drug Code</th>
                          <th>Trade Name</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">Rate</th>
                          <th className="text-end">GST</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedIndent.drugCode.map((drugItem, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{drugItem.drugCode}</strong>
                            </td>
                            <td>{drugItem.tradeName}</td>
                            <td className="text-end">{drugItem.qty}</td>
                            <td className="text-end">
                              {formatCurrency(drugItem.rate)}
                            </td>
                            <td className="text-end">
                              {drugItem.gst ? `${drugItem.gst}%` : "0%"}
                            </td>
                            <td className="text-end fw-bold">
                              {formatCurrency(drugItem.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    No drug items found for this indent.
                  </div>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setDetailsModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={FreezeButton} toggle={() => setFreezeButton(false)}>
          <ModalHeader toggle={() => setFreezeButton(false)}>
            Confirm Freeze
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to Freeze this drug indent?</p>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Financial Year</Label>
                  <Input
                    type="select"
                    name="financialYearId"
                    value={filters.financialYearId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Financial Years</option>
                    {financialYears.map(fy => (
                      <option key={fy._id} value={fy._id}>
                        {fy.year}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Scheme</Label>
                  <Input
                    type="select"
                    name="schemeId"
                    value={filters.schemeId}
                    onChange={handleFilterChange}
                    disabled={!filters.financialYearId}
                  >
                    <option value="">All Schemes</option>
                    {schemes.map(scheme => (
                      <option key={scheme._id} value={scheme._id}>
                        {scheme.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Quarter</Label>
                  <Input
                    type="select"
                    name="quarterId"
                    value={filters.quarterId}
                    onChange={handleFilterChange}
                    disabled={!filters.financialYearId}
                  >
                    <option value="">All Quarters</option>
                    {quarters.map(quarter => (
                      <option key={quarter._id} value={quarter._id}>
                        {quarter.quarter}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              {/* <Col md={12}>
                <FormGroup>
                  <Label>Institution Type</Label>
                  <Select
                    name="institutionTypeId"
                    value={institutionTypeOptions.find(
                      opt => opt.value === filters.institutionTypeId
                    )}
                    onChange={handleSelectFilterChange}
                    options={institutionTypeOptions}
                    styles={selectStyles}
                    placeholder="Institution Type"
                    isSearchable
                    isClearable
                  />
                </FormGroup>
              </Col> */}
              <Col md={12}>
                <FormGroup>
                  <Label>Place of Working</Label>
                  <Select
                    name="workingPlaceId"
                    value={filterPlaceOfWorkingOptions.find(
                      opt => opt.value === filters.workingPlaceId
                    )}
                    onChange={handleSelectFilterChange}
                    options={filterPlaceOfWorkingOptions}
                    styles={selectStyles}
                    placeholder={
                      filters.institutionTypeId
                        ? "Select Place of Working"
                        : "Institution Type First"
                    }
                    isSearchable
                    isClearable
                    isDisabled={!filters.institutionTypeId}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <div style={{ float: "right" }}>
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={handlefreeze}
                  >
                    Submit
                  </Button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
          <ModalHeader toggle={() => setDeleteModal(false)}>
            Confirm Delete
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this drug indent?</p>
            {itemToDelete && (
              <div className="mt-3 p-3 bg-light rounded">
                <strong>Institution:</strong> {itemToDelete.instituteTypeName}
                <br />
                <strong>Place of Working:</strong>
                {itemToDelete.workingPlaceName}
                <br />
                <strong>Scheme:</strong> {itemToDelete.schemeName || "N/A"}
                <br />
                <strong>Quarter:</strong> {itemToDelete.quarterName || "N/A"}
                <br />
                <strong>Drug Items:</strong>
                {itemToDelete.drugCode && Array.isArray(itemToDelete.drugCode)
                  ? itemToDelete.drugCode.length
                  : 0}
                <br />
                <strong>Total Amount:</strong>
                {formatCurrency(calculateIndentTotal(itemToDelete))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  )
}

export default DrugIndent

{
  /* <Col xl="2" md="3" sm="4" xs="6" className="mb-4">
                <Link
                  to="/inventory-management"
                  className="text-decoration-none"
                  onClick={handleReportsClick}
                >
                  <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                    <CardBody className="p-3 text-center d-flex flex-column">
                      <div className="mb-3">
                        <div
                          className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                          style={{ width: 80, height: 80 }}
                        >
                          <i
                            className="bx bx-file text-primary"
                            style={{ fontSize: "2.5rem" }}
                          ></i>
                        </div>
                      </div>
                      <h6 className="text-dark fw-semibold mb-0">
                        Inventory Management
                      </h6>
                    </CardBody>
                  </Card>
                </Link>
              </Col> */
}
