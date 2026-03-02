import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
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
} from "reactstrap"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
jsPDF.API.autoTable = autoTable

const DetailedDrugReport = () => {
  // State Management
  const [drugIndents, setDrugIndents] = useState([])
  const [employmentType, setEmploymentType] = useState([])
  const [drugItems, setDrugItems] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [schemes, setSchemes] = useState([])
  const [quarters, setQuarters] = useState([])
  const [csvData, setCsvData] = useState([])
  const [districts, setDistricts] = useState([])
  const [filteredMandals, setFilteredMandals] = useState([])
  const [filteredVillages, setFilteredVillages] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [grandTotal, setGrandTotal] = useState({})
  const [reportSummary, setReportSummary] = useState({
    totalRecords: 0,
    totalQuantity: 0,
    totalAmount: 0,
  })

  // Ref to track initial mount
  const isInitialMount = useRef(true)

  const [filters, setFilters] = useState({
    institutionTypeId:   "",
    workingPlaceId:   "",
    districtId: "",
    mandalId: "",
    townId: "",
    drugCode: "",
    schemeId: localStorage.getItem("schemeId") || "",
    quarterId: localStorage.getItem("quarterId") || "",
  })

  const [selectedFinancialYearId, setSelectedFinancialYearId] = useState(
    localStorage.getItem("financialYearId") || ""
  )

  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
  const token = authUser?.token

  // Utility Functions
  const formatNumber = (num, decimals = 2) => {
    const number = parseFloat(num || 0)
    return isNaN(number) ? "0.00" : number.toFixed(decimals)
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  // Helper to get current quarter name
  const getCurrentQuarterName = () => {
    if (!filters.quarterId || quarters.length === 0) return ""
    const currentQuarter = quarters.find(q => q._id === filters.quarterId)
    return currentQuarter ? currentQuarter.quarter : ""
  }

  // Helper to get current district name
  const getCurrentDistrictName = () => {
    if (!filters.districtId || districts.length === 0) return ""
    const currentDistrict = districts.find(d => d._id === filters.districtId)
    return currentDistrict ? currentDistrict.name : ""
  }

  // Build dynamic heading text
  const getReportHeadingText = () => {
    const districtName = getCurrentDistrictName() || " "
    const quarterName = getCurrentQuarterName()
    let quarterPart = ""

    // If quarter name is like "Q2" or "2nd Quarter", use it; else default to "2ND QUARTER"
    if (quarterName) {
      quarterPart = `${quarterName.toUpperCase()}`
    }  

    return `STATEMENT SHOWING THE ${districtName.toUpperCase()} DISTRICT MEDICINES INDENT FOR THE ${quarterPart} QUARTER`
  }

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
    if (!token) return

    try {
      const response = await axios.get(`${URLS.GetDrug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data?.data) {
        setDrugItems(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching drug items:", error)
      toast.error("Failed to load drug items")
    }
  }, [token])

  const fetchDistricts = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.get(URLS.GetDistrict, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data?.data) {
        setDistricts(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching districts:", error)
      toast.error("Failed to load districts")
    }
  }, [token])

  const fetchFinancialYears = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.post(
        URLS.GetFinancialyear,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data?.data && response.data.data.length > 0) {
        setFinancialYears(response.data.data)

        const storedFinancialYearId = localStorage.getItem("financialYearId")
        const isValidStoredId =
          storedFinancialYearId &&
          response.data.data.some(year => year._id === storedFinancialYearId)

        if (isValidStoredId) {
          setSelectedFinancialYearId(storedFinancialYearId)
        } else {
          const defaultFinancialYear = response.data.data[0]
          setSelectedFinancialYearId(defaultFinancialYear._id)
          localStorage.setItem("financialYearId", defaultFinancialYear._id)
        }

        return response.data.data
      }
      return []
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error("Failed to fetch financial years")
      return []
    }
  }, [token])

  const fetchMandalsByDistrict = useCallback(
    async districtId => {
      if (!token || !districtId) {
        setFilteredMandals([])
        return
      }

      try {
        const response = await axios.post(
          URLS.GetDistrictIdbyMandals,
          { districtId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const mandals = response.data?.mandals || []
        setFilteredMandals(mandals)

        setFilters(prev => ({
          ...prev,
          mandalId: "",
          townId: "",
          workingPlaceId: "",
        }))
      } catch (error) {
        console.error("Error fetching mandals:", error)
        toast.error("Failed to load mandals")
      }
    },
    [token]
  )

  const fetchVillagesByMandal = useCallback(
    async mandalId => {
      if (!token || !mandalId) {
        setFilteredVillages([])
        return
      }

      try {
        const response = await axios.post(
          URLS.GetMandalIdByVillageTown,
          { mandalId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const villages = response.data?.towns || []
        setFilteredVillages(villages)

        setFilters(prev => ({
          ...prev,
          townId: "",
          workingPlaceId: "",
        }))
      } catch (error) {
        console.error("Error fetching villages:", error)
        toast.error("Failed to load villages")
      }
    },
    [token]
  )

  const fetchPlaceOfWorking = useCallback(
    async (townId, institutionTypeId) => {
      if (!token || (!townId && !institutionTypeId)) {
        setFilteredPlaces([])
        return
      }

      try {
        let response
        if (townId) {
          response = await axios.post(
            URLS.GetVillageTownPlaceOfWorkingId,
            { townId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } else if (institutionTypeId) {
          response = await axios.post(
            URLS.GetInstitutionBygetPlaceOfWorking,
            { institutionTypeId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        }

        const places = response?.data?.data || []
        setFilteredPlaces(places)
      } catch (error) {
        console.error("Error fetching places of working:", error)
        toast.error("Failed to load places of working")
      }
    },
    [token]
  )

  const fetchSchemesAndQuarters = useCallback(
    async financialYearId => {
      if (!token || !financialYearId) {
        setSchemes([])
        setQuarters([])
        return
      }

      setIsLoading(true)

      try {
        // Use Promise.allSettled to handle partial failures
        const [quartersResult, schemesResult] = await Promise.allSettled([
          axios.post(URLS.GetQuarter, {}, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }),
          axios.post(URLS.GetScheme, { financialYearId }, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }),
        ])

        // Process quarters
        let quartersData = []
        if (quartersResult.status === "fulfilled") {
          quartersData = quartersResult.value.data?.data || []
          setQuarters(quartersData)
        } else {
          console.error("Error fetching quarters:", quartersResult.reason)
          toast.error("Failed to load quarters")
          setQuarters([])
        }

        // Process schemes
        let schemesData = []
        if (schemesResult.status === "fulfilled") {
          schemesData = schemesResult.value.data?.schemes || []
          setSchemes(schemesData)
        } else {
          console.error("Error fetching schemes:", schemesResult.reason)
          toast.error("Failed to load schemes")
          setSchemes([])
        }

        // Update filters with available data
        const storedSchemeId = localStorage.getItem("schemeId")
        const storedQuarterId = localStorage.getItem("quarterId")

        const defaultSchemeId =
          storedSchemeId && schemesData.some(s => s._id === storedSchemeId)
            ? storedSchemeId
            : schemesData[0]?._id || ""

        const defaultQuarterId =
          storedQuarterId && quartersData.some(q => q._id === storedQuarterId)
            ? storedQuarterId
            : quartersData[0]?._id || ""

        setFilters(prev => ({
          ...prev,
          schemeId: defaultSchemeId,
          quarterId: defaultQuarterId,
        }))
      } catch (error) {
        console.error("Unexpected error:", error)
        toast.error("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [token]
  )

  const fetchDrugIndents = useCallback(
    async (customFilters = null, customFinancialYearId = null) => {
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const filterParams = customFilters || filters
      const financialYearId = customFinancialYearId || selectedFinancialYearId

      if (!financialYearId) {
        toast.error("Please select a financial year")
        return
      }

      try {
        setIsDataLoading(true)

        const response = await axios.post(
          URLS.GetAllGroupsReport,
          {
            ...filterParams,
            financialYearId: financialYearId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (response.data) {
          const data =
            response?.data?.data ||
            response?.data?.groups ||
            response?.data?.items ||
            []
          const grandTotalData =
            response?.data?.grand_total ||
            response?.data?.grandTotal ||
            response?.data?.summary ||
            {}

          setDrugIndents(data)
          setGrandTotal(grandTotalData)

          let totalRecords = 0
          let totalQuantity = 0
          let totalAmount = 0

          data.forEach(group => {
            if (group.data && Array.isArray(group.data)) {
              totalRecords += group.data.length
              group.data.forEach(item => {
                totalQuantity += parseFloat(item.qty || item.quantity || 0)
                totalAmount += parseFloat(
                  item.total || item.amount || item.totalAmount || 0
                )
              })
            }
          })

          setReportSummary({
            totalRecords,
            totalQuantity,
            totalAmount,
          })

          const csvDataArray = []

          data.forEach(group => {
            csvDataArray.push({
              "No.": "",
              Group: `GROUP: ${group.group || group.groupName || ""}`,
              "Form Type": group.formTypeName || group.formType || "",
              "Drug Code": "",
              "Trade Name": "",
              Composition: "",
              Specifications: "",
              "Unit Pack": "",
              Qty: "",
              "Unit Price": "",
              GST: "",
              Total: "",
            })

            if (group.data && Array.isArray(group.data)) {
              group.data.forEach((item, index) => {
                csvDataArray.push({
                  "No.": index + 1,
                  Group: "",
                  "Form Type": "",
                  "Drug Code": item.drugCode || "-",
                  "Trade Name": item.tradeName || item.name || "-",
                  Composition:
                    item.compositionAndStrength ||
                    item.composition ||
                    "-",
                  Specifications:
                    item.packingSpecification ||
                    item.specification ||
                    "-",
                  "Unit Pack": item.unitPack || item.unit || "-",
                  Qty: item.qty || item.quantity || 0,
                  "Unit Price": formatNumber(
                    item.rate || item.unitPrice || item.price,
                    2
                  ),
                  GST: item.gst || item.tax || "-",
                  Total: formatNumber(
                    item.total || item.amount || item.totalAmount,
                    2
                  ),
                })
              })
            }

            csvDataArray.push({
              "No.": "",
              Group: "",
              "Form Type": "",
              "Drug Code": "",
              "Trade Name": "",
              Composition: "",
              Specifications: "",
              "Unit Pack": "",
              Qty: "",
              "Unit Price": "TOTAL:",
              GST: "",
              Total: formatNumber(
                group.totalFieldSum || group.total || group.groupTotal,
                2
              ),
            })

            const budget = group.formBudget || group.budget || {}
            csvDataArray.push({
              "No.": "",
              Group: `ABSTRACT: [${
                budget.budgetPercentage || budget.percentage || 0
              }%]`,
              "Form Type": "",
               
              "Drug Code": "",
              "Trade Name": "",
              Composition: "",
              Specifications: "",
              "Unit Pack": "",
              Qty: "",
              "Unit Price": "",
              GST: "",
              Total: "",
            })
            csvDataArray.push({})
          })

          if (data.length > 0) {
            csvDataArray.push({
              "No.": "",
              Group: "GRAND TOTAL:",
              "Form Type": "",
               
              "Drug Code": "",
              "Trade Name": "",
              Composition: "",
              Specifications: "",
              "Unit Pack": "",
              Qty: "",
              "Unit Price": "",
              GST: "",
              Total: "",
            })
          }

          setCsvData(csvDataArray)
        }
      } catch (error) {
        console.error("Error fetching drug indents:", error)
        toast.error("Failed to fetch detailed drug report")
      } finally {
        setIsDataLoading(false)
      }
    },
    [token, filters, selectedFinancialYearId]
  )

  // Memoized Options
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

  const institutionTypeOptions = useMemo(
    () =>
      employmentType.map(type => ({
        value: type._id,
        label: type.name,
      })),
    [employmentType]
  )

  const districtOptions = useMemo(
    () =>
      districts.map(district => ({
        value: district._id,
        label: district.name,
      })),
    [districts]
  )

  const mandalOptions = useMemo(
    () =>
      filteredMandals.map(mandal => ({
        value: mandal._id,
        label: mandal.name,
      })),
    [filteredMandals]
  )

  const villageOptions = useMemo(
    () =>
      filteredVillages.map(village => ({
        value: village._id,
        label: village.name,
      })),
    [filteredVillages]
  )

  const placeOfWorkingOptions = useMemo(
    () =>
      filteredPlaces.map(place => ({
        value: place._id,
        label: place.name,
      })),
    [filteredPlaces]
  )

  const financialYearOptions = useMemo(
    () =>
      financialYears.map(year => ({
        value: year._id,
        label: year.year,
      })),
    [financialYears]
  )

  // Event Handlers
  const handleFilterChange = e => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectFilterChange = async (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    if (name === "institutionTypeId") {
      setFilters(prev => ({
        ...prev,
        institutionTypeId: value,
        workingPlaceId: "",
      }))

      localStorage.setItem("institutionTypeId", value)

      if (value) {
        await fetchPlaceOfWorking(null, value)
      } else {
        setFilteredPlaces([])
      }
    } else if (name === "districtId") {
      setFilters(prev => ({
        ...prev,
        districtId: value,
        mandalId: "",
        townId: "",
        workingPlaceId: "",
      }))

      if (value) {
        await fetchMandalsByDistrict(value)
      } else {
        setFilteredMandals([])
        setFilteredVillages([])
        setFilteredPlaces([])
      }
    } else if (name === "mandalId") {
      setFilters(prev => ({
        ...prev,
        mandalId: value,
        townId: "",
        workingPlaceId: "",
      }))

      if (value) {
        await fetchVillagesByMandal(value)
      } else {
        setFilteredVillages([])
        setFilteredPlaces([])
      }
    } else if (name === "townId") {
      setFilters(prev => ({
        ...prev,
        townId: value,
        workingPlaceId: "",
      }))

      if (value) {
        await fetchPlaceOfWorking(value, null)
      } else {
        setFilteredPlaces([])
      }
    } else if (name === "workingPlaceId") {
      setFilters(prev => ({
        ...prev,
        workingPlaceId: value,
      }))
      localStorage.setItem("workingPlaceId", value)
    } else if (name === "schemeId") {
      setFilters(prev => ({
        ...prev,
        schemeId: value,
      }))
      localStorage.setItem("schemeId", value)
    } else if (name === "quarterId") {
      setFilters(prev => ({
        ...prev,
        quarterId: value,
      }))
      localStorage.setItem("quarterId", value)
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFinancialYearChange = selectedOption => {
    const value = selectedOption?.value || ""

    setSelectedFinancialYearId(value)
    localStorage.setItem("financialYearId", value)

    if (value) {
      fetchSchemesAndQuarters(value)
    }
  }

  const handleSearch = () => {
    if (!selectedFinancialYearId) {
      toast.error("Please select a financial year")
      return
    }
    fetchDrugIndents(filters, selectedFinancialYearId)
  }

  const handleReset = async () => {
    const resetFilters = {
      institutionTypeId: "",
      workingPlaceId: "",
      drugCode: "",
      districtId: "",
      mandalId: "",
      townId: "",
      schemeId: "",
      quarterId: "",
    }

    setFilters(resetFilters)
    setFilteredMandals([])
    setFilteredVillages([])
    setFilteredPlaces([])
    setDrugIndents([])
    setCsvData([])
    setGrandTotal({})
    setReportSummary({
      totalRecords: 0,
      totalQuantity: 0,
      totalAmount: 0,
    })

    localStorage.removeItem("institutionTypeId")
    localStorage.removeItem("workingPlaceId")
    localStorage.removeItem("schemeId")
    localStorage.removeItem("quarterId")
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const getCurrentFinancialYearText = () => {
    if (!selectedFinancialYearId || financialYears.length === 0) return "N/A"

    const currentYear = financialYears.find(
      year => year._id === selectedFinancialYearId
    )
    return currentYear ? currentYear.year : "N/A"
  }

  // PDF Generation
  const generatePDF = () => {
    if (drugIndents.length === 0) {
      toast.warning("No data to export to PDF")
      return
    }

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a3",
      })

      const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })

      const financialYearText = getCurrentFinancialYearText()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const leftMargin = 15
      const rightMargin = pageWidth - 15

      const headingText = getReportHeadingText()

      // Header
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, "bold")
      doc.text(headingText, pageWidth / 2, 15, { align: "center" })

      doc.setFontSize(12)
      doc.text(
        `DURING THE FINANCIAL YEAR ${financialYearText}`,
        pageWidth / 2,
        22,
        { align: "center" }
      )

      doc.setFontSize(10)
      doc.setFont(undefined, "normal")

      doc.text(
        "Head of Account: 2403-00-101-25-04-210/212-Drugs and Medicines",
        leftMargin,
        30
      )

      const generatedText = `Generated On: ${currentDate}`
      const textWidth = doc.getTextWidth(generatedText)
      doc.text(generatedText, rightMargin - textWidth, 30)

      let startY = 40

      drugIndents.forEach((group, groupIndex) => {
        if (startY > 170) {
          doc.addPage()
          startY = 20
        }

        doc.setFontSize(12)
        doc.setFont(undefined, "bold")

        const groupTitle = `${group.group || group.groupName || ""} - ${
          group.formTypeName || group.formType || ""
        }`
        doc.text(groupTitle, leftMargin, startY)

        startY += 8

        const tableData = []

        if (group.data && Array.isArray(group.data)) {
          group.data.forEach((item, index) => {
            tableData.push([
              { content: (index + 1).toString(), styles: { halign: "center" } },
              item.instituteTypeName || item.institutionType || "-",
              item.districtName || item.district || "-",
              item.mandalName || item.mandal || "-",
              item.townName || item.village || item.town || "-",
              item.workingPlaceName || item.placeOfWorking || "-",
              item.drugCode?.slice(0, 15) || "-",
              item.tradeName || item.name || "-",
              item.compositionAndStrength || item.composition || "-",
              item.packingSpecification?.slice(0, 15) ||
                item.specification ||
                "-",
              item.unitPack || item.unit || "-",
              {
                content: (item.qty || item.quantity || 0).toString(),
                styles: { halign: "center" },
              },
              {
                content: formatNumber(
                  item.rate || item.unitPrice || item.price,
                  2
                ),
                styles: { halign: "right" },
              },
              {
                content: `${item.gst || item.tax || item.salesTax || 12}%`,
                styles: { halign: "center" },
              },
              {
                content: formatNumber(
                  item.total || item.amount || item.totalAmount,
                  2
                ),
                styles: { halign: "right" },
              },
            ])
          })
        }

        autoTable(doc, {
          startY: startY,
          head: [
            [
              { content: "No.", styles: { halign: "center" } },
              { content: "Drug Code", styles: { halign: "center" } },
              { content: "Trade Name", styles: { halign: "center" } },
              { content: "Composition", styles: { halign: "center" } },
              { content: "Specifications", styles: { halign: "center" } },
              { content: "Unit Pack", styles: { halign: "center" } },
              { content: "Qty", styles: { halign: "center" } },
              { content: "Unit Price", styles: { halign: "center" } },
              { content: "GST", styles: { halign: "center" } },
              { content: "Total", styles: { halign: "center" } },
            ],
          ],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: "linebreak",
            textColor: [0, 0, 0],
          },
          margin: { left: leftMargin, right: 15 },
          tableWidth: "auto",
          styles: {
            cellPadding: 2,
            fontSize: 8,
            valign: "middle",
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
          },
          didDrawPage: function () {
            doc.setFontSize(8)
            doc.setTextColor(0, 0, 0)
            doc.text(
              `Page ${doc.internal.getNumberOfPages()}`,
              pageWidth / 2,
              pageHeight - 10,
              { align: "center" }
            )
          },
        })

        startY = doc.lastAutoTable.finalY + 8

        const budget = group.formBudget || group.budget || {}
        const budgetAvailable =
          budget.budget || budget.available || budget.totalBudget || 0
        const budgetBooked =
          budget.bookedBudget || budget.booked || budget.usedBudget || 0
        const balanceBudget =
          budget.availableBudget ||
          budget.balance ||
          budget.remainingBudget ||
          0
        const percentageBooked =
          budget.budgetPercentage || budget.percentage || 0

        doc.setFontSize(10)
        doc.setFont(undefined, "bold")
        doc.setTextColor(0, 0, 0)

        const abstractText = `ABSTRACT: [${percentageBooked}%]`
        doc.text(abstractText, leftMargin, startY)

        const budgetAvailableText = `Budget Available: ${formatNumber(
          budgetAvailable
        )}`
        doc.text(budgetAvailableText, leftMargin + 80, startY)

        const budgetBookedText = `Budget Booked: ${formatNumber(
          budgetBooked
        )}`
        doc.text(budgetBookedText, leftMargin + 160, startY)

        const balanceBudgetText = `Balance Budget: ${formatNumber(
          balanceBudget
        )}`
        doc.text(balanceBudgetText, leftMargin + 240, startY)

        startY += 10

        if (groupIndex < drugIndents.length - 1) {
          doc.setDrawColor(0, 0, 0)
          doc.setLineWidth(0.5)
          doc.line(leftMargin, startY, rightMargin, startY)
          startY += 15
        }
      })

      if (drugIndents.length > 0) {
        const totalBudgetReleased =
          grandTotal.total_budget_released ||
          grandTotal.totalBudgetReleased ||
          grandTotal.released ||
          0
        const totalBudgetBooked =
          grandTotal.total_budget_booked ||
          grandTotal.totalBudgetBooked ||
          grandTotal.booked ||
          0
        const totalBalanceBudget =
          grandTotal.total_budget_balance ||
          grandTotal.totalBudgetBalance ||
          grandTotal.balance ||
          0

        startY += 10

        doc.setFontSize(11)
        doc.setFont(undefined, "bold")
        doc.text("GRAND TOTAL SUMMARY", leftMargin, startY)

        startY += 8

        const totalReleasedText = `Total Budget Released: ${formatNumber(
          totalBudgetReleased
        )}`
        doc.text(totalReleasedText, leftMargin, startY)

        const totalBookedText = `Total Budget Booked: ${formatNumber(
          totalBudgetBooked
        )}`
        doc.text(totalBookedText, leftMargin + 100, startY)

        const totalBalanceText = `Total Balance Budget: ${formatNumber(
          totalBalanceBudget
        )}`
        doc.text(totalBalanceText, leftMargin + 200, startY)
      }

      const districtName = getCurrentDistrictName() || "District"
      const quarterName = getCurrentQuarterName() || "2nd_Quarter"

      const fileName = `${districtName.replace(
        /\s+/g,
        "_"
      )}_${quarterName}_${financialYearText}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
      doc.save(fileName)

      toast.success("PDF generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
    }
  }

  // CSV Report Configuration
  const csvReport = {
    filename: `Detailed_Drug_Report_${
      new Date().toISOString().split("T")[0]
    }.csv`,
    data: csvData,
    headers: [
      { label: "No.", key: "No." },
      { label: "Group", key: "Group" },
      { label: "Form Type", key: "Form Type" },
       
      { label: "Drug Code", key: "Drug Code" },
      { label: "Trade Name", key: "Trade Name" },
      { label: "Composition", key: "Composition" },
      { label: "Specifications", key: "Specifications" },
      { label: "Unit Pack", key: "Unit Pack" },
      { label: "Qty", key: "Qty" },
      { label: "Unit Price", key: "Unit Price" },
      { label: "GST", key: "GST" },
      { label: "Total", key: "Total" },
    ],
  }

  // Filtered drugIndents based on search term
  const filteredDrugIndents = useMemo(() => {
    if (!searchTerm) return drugIndents

    return drugIndents
      .map(group => {
        if (!group.data) return group

        const filteredData = group.data.filter(item => {
          const searchLower = searchTerm.toLowerCase()
          return (
            (item.drugCode || "").toLowerCase().includes(searchLower) ||
            (item.tradeName || item.name || "")
              .toLowerCase()
              .includes(searchLower) ||
            (item.districtName || item.district || "")
              .toLowerCase()
              .includes(searchLower) ||
            (item.mandalName || item.mandal || "")
              .toLowerCase()
              .includes(searchLower) ||
            (item.instituteTypeName || item.institutionType || "")
              .toLowerCase()
              .includes(searchLower)
          )
        })

        return {
          ...group,
          data: filteredData,
        }
      })
      .filter(group => group.data && group.data.length > 0)
  }, [drugIndents, searchTerm])

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          fetchEmploymentType(),
          fetchDrugItems(),
          fetchDistricts(),
          fetchFinancialYears(),
        ])

        const storedInstitutionTypeId =
          localStorage.getItem("institutionTypeId")
        if (storedInstitutionTypeId) {
          await fetchPlaceOfWorking(null, storedInstitutionTypeId)
        }
      } catch (error) {
        console.error("Error initializing data:", error)
        toast.error("Failed to initialize form data")
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [
    fetchEmploymentType,
    fetchDrugItems,
    fetchDistricts,
    fetchFinancialYears,
    fetchPlaceOfWorking,
  ])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false

      if (selectedFinancialYearId) {
        fetchSchemesAndQuarters(selectedFinancialYearId)
      }
      return
    }

    if (selectedFinancialYearId) {
      fetchSchemesAndQuarters(selectedFinancialYearId)
    }
  }, [selectedFinancialYearId, fetchSchemesAndQuarters])

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 34,
      height: 34,
      paddingLeft: 2,
      fontSize: 14,
      borderRadius: 4,
      borderColor: state.isFocused ? "#000000" : "#cccccc",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#000000",
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
    option: (base, state) => ({
      ...base,
      fontSize: 14,
      padding: "8px 12px",
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "#000000",
    }),
    placeholder: base => ({
      ...base,
      fontSize: 14,
      color: "#666666",
    }),
    singleValue: base => ({
      ...base,
      color: "#000000",
    }),
  }

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="text-center">
              <Spinner color="dark" style={{ width: "3rem", height: "3rem" }} />
              <p className="mt-3" style={{ color: "#000000" }}>
                Loading form data...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Render
  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Filters Section */}
        {showFilters && (
          <Card className="mb-3">
            <CardBody>
              <h5 className="mb-3 text-primary"  >
                <i className="fas fa-filter me-2"></i>
                Filters
              </h5>
              <Row>
                <Col md={2}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Financial Year
                    </Label>
                    <Select
                      name="financialYearId"
                      value={financialYearOptions.find(
                        opt => opt.value === selectedFinancialYearId
                      )}
                      onChange={handleFinancialYearChange}
                      options={financialYearOptions}
                      styles={selectStyles}
                      placeholder="Select Financial Year"
                      isSearchable
                      isClearable
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Scheme
                    </Label>
                    <Select
                      name="schemeId"
                      value={schemeOptions.find(
                        opt => opt.value === filters.schemeId
                      )}
                      onChange={handleSelectFilterChange}
                      options={schemeOptions}
                      styles={selectStyles}
                      placeholder="Select Scheme"
                      isSearchable
                      isClearable
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Quarter
                    </Label>
                    <Select
                      name="quarterId"
                      value={quarterOptions.find(
                        opt => opt.value === filters.quarterId
                      )}
                      onChange={handleSelectFilterChange}
                      options={quarterOptions}
                      styles={selectStyles}
                      placeholder="Select Quarter"
                      isSearchable
                      isClearable
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Institution Type
                    </Label>
                    <Select
                      name="institutionTypeId"
                      value={institutionTypeOptions.find(
                        opt => opt.value === filters.institutionTypeId
                      )}
                      onChange={handleSelectFilterChange}
                      options={institutionTypeOptions}
                      styles={selectStyles}
                      placeholder="Select Institution Type"
                      isSearchable
                      isClearable
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      District
                    </Label>
                    <Select
                      name="districtId"
                      value={districtOptions.find(
                        opt => opt.value === filters.districtId
                      )}
                      onChange={handleSelectFilterChange}
                      options={districtOptions}
                      styles={selectStyles}
                      placeholder="Select District"
                      isSearchable
                      isClearable
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Mandal
                    </Label>
                    <Select
                      name="mandalId"
                      value={mandalOptions.find(
                        opt => opt.value === filters.mandalId
                      )}
                      onChange={handleSelectFilterChange}
                      options={mandalOptions}
                      styles={selectStyles}
                      placeholder={
                        filters.districtId
                          ? "Select Mandal"
                          : "Select District First"
                      }
                      isSearchable
                      isClearable
                      isDisabled={!filters.districtId}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Village/Town
                    </Label>
                    <Select
                      name="townId"
                      value={villageOptions.find(
                        opt => opt.value === filters.townId
                      )}
                      onChange={handleSelectFilterChange}
                      options={villageOptions}
                      styles={selectStyles}
                      placeholder={
                        filters.mandalId
                          ? "Select Village/Town"
                          : "Select Mandal First"
                      }
                      isSearchable
                      isClearable
                      isDisabled={!filters.mandalId}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Place of Working
                    </Label>
                    <Select
                      name="workingPlaceId"
                      value={placeOfWorkingOptions.find(
                        opt => opt.value === filters.workingPlaceId
                      )}
                      onChange={handleSelectFilterChange}
                      options={placeOfWorkingOptions}
                      styles={selectStyles}
                      placeholder={
                        filters.townId || filters.institutionTypeId
                          ? "Select Place of Working"
                          : "Select Village or Institution Type First"
                      }
                      isSearchable
                      isClearable
                      isDisabled={!filters.townId && !filters.institutionTypeId}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label style={{ color: "#000000", fontWeight: "500" }}>
                      Drug Code
                    </Label>
                    <Input
                      type="select"
                      name="drugCode"
                      value={filters.drugCode}
                      onChange={handleFilterChange}
                      className="form-select"
                      style={{
                        color: "#000000",
                        height: "34px",
                        fontSize: "14px",
                      }}
                    >
                      <option value="">All Drugs</option>
                      {drugItems.map(drug => (
                        <option key={drug._id} value={drug._id}>
                          {drug.drugCode?.slice(0, 25) || "N/A"}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3 pt-2 border-top">
                <Button
                  color="secondary"
                  outline
                  onClick={handleReset}
                  className="me-2"
                  disabled={isDataLoading}
                  style={{ color: "#000000", borderColor: "#000000" }}
                >
                  <i className="bx bx-reset me-1"></i>
                  Reset Filters
                </Button>
                <Button
                  color="primary"
                  onClick={handleSearch}
                  disabled={isDataLoading}
                >
                  {isDataLoading ? (
                    <>
                      <Spinner size="sm" className="me-1" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-search me-1"></i>
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Main Content Card */}
        <Card>
          <CardBody>
            {/* Action Buttons Row */}
            <Row className="mb-3">
              <Col md={12}>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <span style={{ color: "#000000", fontSize: "14px" }}>
                      Total Records: <strong>{reportSummary.totalRecords}</strong>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Button
                      color="light"
                      onClick={toggleFilters}
                      className="d-flex align-items-center"
                      size="md"
                      style={{ color: "#000000", borderColor: "#cccccc" }}
                    >
                      <i
                        className={`fas ${
                          showFilters ? "fa-eye-slash" : "fa-filter"
                        } me-2`}
                      ></i>
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                    <Button
                      color="danger"
                      onClick={generatePDF}
                      className="me-2"
                      disabled={drugIndents.length === 0}
                    >
                      <i className="bx bxs-file-pdf me-1"></i>
                      Export PDF
                    </Button>
                    <CSVLink
                      {...csvReport}
                      className="btn btn-success me-2"
                      style={{
                        pointerEvents:
                          drugIndents.length === 0 || isDataLoading
                            ? "none"
                            : "auto",
                        opacity:
                          drugIndents.length === 0 || isDataLoading ? 0.65 : 1,
                        textDecoration: "none",
                      }}
                    >
                      <i className="bx bx-file me-1"></i>
                      Export Excel
                    </CSVLink>
                    <div style={{ maxWidth: "250px" }}>
                      <Input
                        type="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-control form-control-sm"
                        disabled={isDataLoading}
                        style={{ color: "#000000" }}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Report Header */}
            <div className="text-center mb-4 border-bottom pb-3">
              <h3 className="text-primary mb-2">
                {getReportHeadingText()}
              </h3>
              <h5 style={{ color: "#000000" }}>
                FINANCIAL YEAR: {getCurrentFinancialYearText()}
              </h5>
              <div className="d-flex justify-content-between align-items-center px-3 mt-3">
                <div className="text-start">
                  <p
                    className="mb-0 medium"
                    style={{ color: "#000000" }}
                  >
                    <strong>Head of Account:</strong>{" "}
                    2403-00-101-25-04-210/212-Drugs and Medicines
                  </p>
                </div>
                <div className="text-end">
                  <p
                    className="mb-0 medium"
                    style={{ color: "#000000" }}
                  >
                    <strong>Total Amount:</strong>{" "}
                    {formatCurrency(reportSummary.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isDataLoading ? (
              <div className="text-center py-5">
                <Spinner
                  color="dark"
                  style={{ width: "3rem", height: "3rem" }}
                />
                <p className="mt-3" style={{ color: "#000000" }}>
                  Loading detailed report data...
                </p>
              </div>
            ) : (
              <>
                {/* Report Content */}
                <div className="table-responsive">
                  {filteredDrugIndents.length === 0 ? (
                    <div className="text-center py-5">
                      <i
                        className="bx bx-search-alt bx-lg d-block mb-3"
                        style={{
                          fontSize: "4rem",
                          color: "#000000",
                        }}
                      ></i>
                      <h5 style={{ color: "#000000" }}>
                        No Data Available
                      </h5>
                      <p style={{ color: "#000000" }}>
                        Please select filters and click "Search" to generate
                        the report
                      </p>
                    </div>
                  ) : (
                    filteredDrugIndents.map((group, groupIndex) => (
                      <React.Fragment key={group._id || groupIndex}>
                        <div className="mb-4">
                          {/* Group Header */}
                          <div className="border-bottom pb-2 mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5
                                style={{
                                  color: "#000000",
                                  fontWeight: "bold",
                                }}
                              >
                                <i className="bx bx-folder-open me-2"></i>
                                {group.group || group.groupName || ""} -{" "}
                                {group.formTypeName || group.formType || ""}
                              </h5>
                              <span style={{ color: "#000000" }}>
                                {group.data?.length || 0} Items
                              </span>
                            </div>
                          </div>

                          {/* Group Table */}
                          <Table bordered hover className="mb-3">
                            <thead
                              style={{
                                backgroundColor: "#ffffff",
                                color: "#000000",
                              }}
                            >
                              <tr className="text-center">
                                <th
                                  style={{
                                    width: "40px",
                                    color: "#000000",
                                  }}
                                >
                                  No.
                                </th> 
                                <th style={{ color: "#000000" }}>
                                  Drug Code
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Trade Name
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Composition
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Specifications
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Name of the Firm
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Name of the Stockiest
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Unit Pack
                                </th>
                                <th
                                  style={{
                                    width: "70px",
                                    color: "#000000",
                                  }}
                                >
                                  Qty
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Unit Price
                                </th>
                                <th style={{ color: "#000000" }}>
                                  GST
                                </th>
                                <th style={{ color: "#000000" }}>
                                  Total
                                </th>
                                
                              </tr>
                            </thead>
                            <tbody>
                              {group.data &&
                                group.data.map((item, index) => (
                                  <tr
                                    key={item._id || index}
                                    style={{ color: "#000000" }}
                                  >
                                    <td
                                      className="text-center"
                                      style={{
                                        color: "#000000",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {index + 1}
                                    </td>
                                     
                                    <td
                                      style={{
                                        color: "#000000",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {item.drugCode?.slice(0, 10) || "-"}
                                    </td>
                                    <td style={{ color: "#000000" }}>
                                      {item.tradeName ||
                                        item.name ||
                                        "-"}
                                    </td>
                                    <td
                                      style={{
                                        color: "#000000",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {item.compositionAndStrength ||
                                        item.composition ||
                                        "-"}
                                    </td>
                                    <td
                                      style={{
                                        color: "#000000",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {item.packingSpecification?.slice(
                                        0,
                                        25
                                      ) ||
                                        item.specification ||
                                        "-"}
                                    </td>
                                    <td
                                      className="text-end"
                                      style={{
                                        color: "#000000",
                                      }}
                                    >
                                      {item.nameOfFirm}
                                    </td>
                                    <td
                                      className="text-end"
                                      style={{
                                        color: "#000000",
                                      }}
                                    >
                                      {item.nameOfStockiest}
                                    </td>
                                    <td
                                      className="text-center"
                                      style={{ color: "#000000" }}
                                    >
                                      {item.unitPack || item.unit || "-"}
                                    </td>
                                    <td
                                      className="text-center"
                                      style={{
                                        color: "#000000",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {item.qty || item.quantity || 0}
                                    </td>
                                    <td
                                      className="text-end"
                                      style={{ color: "#000000" }}
                                    >
                                      {formatNumber(
                                        item.rate ||
                                          item.unitPrice ||
                                          item.price,
                                        2
                                      )}
                                    </td>
                                    <td
                                      className="text-center"
                                      style={{ color: "#000000" }}
                                    >
                                      {item.gst ||
                                        item.tax ||
                                        item.salesTax ||
                                        12}
                                      %
                                    </td>
                                    <td
                                      className="text-end"
                                      style={{
                                        color: "#000000",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formatNumber(
                                        item.total ||
                                          item.amount ||
                                          item.totalAmount,
                                        2
                                      )}
                                    </td>
                                    
                                  </tr>
                                ))}
                              <tr style={{ backgroundColor: "#f8f9fa" }}>
                                <td
                                  colSpan="11"
                                  className="text-end"
                                  style={{
                                    color: "#000000",
                                    fontWeight: "bold",
                                  }}
                                >
                                  GROUP TOTAL 
                                </td>
                                <td className="text-end fw-bold">
                                  {formatNumber(
                                    group.totalFieldSum ||
                                      group.total ||
                                      group.groupTotal,
                                    2
                                  )}
                                </td>
                                 
                              </tr>
                              {/* <tr className="table-active">
                                <td colSpan="10" className="text-end fw-bold">
                                  TOTAL
                                </td>
                                <td className="text-end fw-bold">
                                  {formatNumber(group?.totalFieldSum, 2)}
                                </td>
                              </tr> */}
                            </tbody>
                          </Table>

                          {/* Budget Summary */}
                          <div
                            className="p-3 border"
                            style={{ backgroundColor: "#ffffff" }}
                          >
                            <Row className="align-items-center">
                              <Col md={3} className="border-end">
                                <div style={{ color: "#000000" }}>
                                  <span style={{ fontSize: "12px" }}>
                                    BUDGET UTILIZATION:{" "}
                                  </span>
                                  <strong
                                    style={{ fontSize: "16px" }}
                                  >
                                    {(group.formBudget || group.budget || {})
                                      .budgetPercentage ||
                                      (group.formBudget || group.budget || {})
                                        .percentage ||
                                      0}
                                    %
                                  </strong>
                                </div>
                              </Col>
                              <Col md={3} className="border-end">
                                <div style={{ color: "#000000" }}>
                                  <span>Budget Released: </span>
                                  <strong>
                                    {formatNumber(
                                      (group.formBudget || group.budget || {})
                                        .budget ||
                                        (group.formBudget ||
                                          group.budget ||
                                          {}).available ||
                                        (group.formBudget ||
                                          group.budget ||
                                          {}).totalBudget,
                                      2
                                    )}
                                  </strong>
                                </div>
                              </Col>
                              <Col md={3} className="border-end">
                                <div style={{ color: "#000000" }}>
                                  <span>Budget Booked: </span>
                                  <strong>
                                    {formatNumber(
                                      (group.formBudget || group.budget || {})
                                        .bookedBudget ||
                                        (group.formBudget ||
                                          group.budget ||
                                          {}).booked ||
                                        (group.formBudget ||
                                          group.budget ||
                                          {}).usedBudget,
                                      2
                                    )}
                                  </strong>
                                </div>
                              </Col>
                              <Col md={3}>
                                <div style={{ color: "#000000" }}>
                                  <span>Balance: </span>
                                  <strong>
                                    {formatNumber(
                                      (group.formBudget || group.budget || {})
                                        .availableBudget ||
                                        (group.formBudget ||
                                          group.budget ||
                                          {}).balance ||
                                        (group.formBudget ||
                                          group.budget ||
                                          {}).remainingBudget,
                                      2
                                    )}
                                  </strong>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>

                        {groupIndex < filteredDrugIndents.length - 1 && (
                          <hr className="my-4" />
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>

                {/* Grand Total Summary */}
                {filteredDrugIndents.length > 0 && (
                  <div className="mt-4">
                    <Card className="border">
                      <CardBody
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <h5
                          style={{
                            color: "#000000",
                            fontWeight: "bold",
                          }}
                          className="mb-3"
                        >
                          <i className="bx bx-calculator me-2"></i>
                          GRAND TOTAL SUMMARY
                        </h5>
                        <Row>
                          <Col md={4} className="border-end">
                            <div
                              className="mb-2"
                              style={{ color: "#000000" }}
                            >
                              <span
                                style={{ fontWeight: "500" }}
                              >
                                Total Budget Released:
                              </span>
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(
                                  grandTotal.total_budget_released ||
                                    grandTotal.totalBudgetReleased ||
                                    grandTotal.released,
                                  2
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col md={4} className="border-end">
                            <div
                              className="mb-2"
                              style={{ color: "#000000" }}
                            >
                              <span
                                style={{ fontWeight: "500" }}
                              >
                                Total Budget Booked:
                              </span>
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(
                                  grandTotal.total_budget_booked ||
                                    grandTotal.totalBudgetBooked ||
                                    grandTotal.booked,
                                  2
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div
                              className="mb-2"
                              style={{ color: "#000000" }}
                            >
                              <span
                                style={{ fontWeight: "500" }}
                              >
                                Total Balance Budget:
                              </span>
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(
                                  grandTotal.total_budget_balance ||
                                    grandTotal.totalBudgetBalance ||
                                    grandTotal.balance,
                                  2
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default DetailedDrugReport
