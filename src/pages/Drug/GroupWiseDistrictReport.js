// import React, { useState, useEffect, useCallback, useMemo } from "react"
// import "react-toastify/dist/ReactToastify.css"
// import { toast } from "react-toastify"
// import { CSVLink } from "react-csv"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import axios from "axios"
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Input,
//   Button,
//   Table,
//   Label,
//   FormGroup,
//   Spinner,
// } from "reactstrap"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
// jsPDF.API.autoTable = autoTable

// const GroupsReport = () => {
//   const [drugIndents, setDrugIndents] = useState([])
//   const [employmentType, setEmploymentType] = useState([])
//   const [drugItems, setDrugItems] = useState([])
//   const [financialYears, setFinancialYears] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [showFilters, setShowFilters] = useState(false)
//   const [schemes, setSchemes] = useState([])
//   const [quarters, setQuarters] = useState([])
//   const [csvData, setCsvData] = useState([])
//   const [districts, setDistricts] = useState([])
//   const [filteredMandals, setFilteredMandals] = useState([])
//   const [filteredVillages, setFilteredVillages] = useState([])
//   const [filteredPlaces, setFilteredPlaces] = useState([])
//   const [grand_total, setgrand_total] = useState([])

//   const [filters, setFilters] = useState({
//     institutionTypeId: localStorage.getItem("institutionTypeId") || "",
//     workingPlaceId: localStorage.getItem("workingPlaceId") || "",
//     districtId: "",
//     mandalId: "",
//     townId: "",
//     drugCode: "",
//     schemeId: localStorage.getItem("schemeId") || "",
//     quarterId: localStorage.getItem("quarterId") || "",
//   })

//   const [selectedFinancialYearId, setSelectedFinancialYearId] = useState(
//     localStorage.getItem("financialYearId") || ""
//   )

//   const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//   const token = authUser?.token

//   const formatNumber = (num, decimals = 2) => {
//     const number = parseFloat(num || 0)
//     return isNaN(number) ? "0.00" : number.toFixed(decimals)
//   }

//   const fetchEmploymentType = useCallback(async () => {
//     if (!token) return

//     try {
//       const response = await axios.get(URLS.GetEmploymentType, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (response.data?.data) {
//         setEmploymentType(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error fetching employment types:", error)
//       toast.error("Failed to load employment types")
//     }
//   }, [token])

//   const fetchDrugItems = useCallback(async () => {
//     if (!token) return

//     try {
//       const response = await axios.get(`${URLS.GetDrug}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (response.data?.data) {
//         setDrugItems(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error fetching Form By Drugs:", error)
//       toast.error("Failed to load drug items")
//     }
//   }, [token])

//   const fetchDistricts = useCallback(async () => {
//     if (!token) return

//     try {
//       const response = await axios.get(URLS.GetDistrict, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (response.data?.data) {
//         setDistricts(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error fetching districts:", error)
//       toast.error("Failed to load districts")
//     }
//   }, [token])

//   const fetchFinancialYears = useCallback(async () => {
//     if (!token) return

//     try {
//       const response = await axios.post(
//         URLS.GetFinancialyear,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       if (response.data?.data && response.data.data.length > 0) {
//         setFinancialYears(response.data.data)

//         const storedFinancialYearId = localStorage.getItem("financialYearId")
//         const isValidStoredId =
//           storedFinancialYearId &&
//           response.data.data.some(year => year._id === storedFinancialYearId)

//         if (isValidStoredId) {
//           setSelectedFinancialYearId(storedFinancialYearId)
//         } else {
//           const defaultFinancialYear = response.data.data[0]
//           setSelectedFinancialYearId(defaultFinancialYear._id)
//           localStorage.setItem("financialYearId", defaultFinancialYear._id)
//         }

//         return response.data.data
//       }
//       return []
//     } catch (error) {
//       console.error("Error fetching financial years:", error)
//       toast.error("Failed to fetch financial years")
//       return []
//     }
//   }, [token])

//   const fetchMandalsByDistrict = useCallback(
//     async districtId => {
//       if (!token || !districtId) {
//         setFilteredMandals([])
//         return
//       }

//       try {
//         const response = await axios.post(
//           URLS.GetDistrictIdbyMandals,
//           { districtId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         const mandals = response.data?.mandals || []
//         setFilteredMandals(mandals)

//         setFilters(prev => ({
//           ...prev,
//           mandalId: "",
//           townId: "",
//           workingPlaceId: "",
//         }))
//       } catch (error) {
//         console.error("Error fetching mandals:", error)
//         toast.error("Failed to load mandals")
//       }
//     },
//     [token]
//   )

//   const fetchVillagesByMandal = useCallback(
//     async mandalId => {
//       if (!token || !mandalId) {
//         setFilteredVillages([])
//         return
//       }

//       try {
//         const response = await axios.post(
//           URLS.GetMandalIdByVillageTown,
//           { mandalId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         const villages = response.data?.towns || []
//         setFilteredVillages(villages)

//         setFilters(prev => ({
//           ...prev,
//           townId: "",
//           workingPlaceId: "",
//         }))
//       } catch (error) {
//         console.error("Error fetching villages:", error)
//         toast.error("Failed to load villages")
//       }
//     },
//     [token]
//   )

//   const fetchPlaceOfWorking = useCallback(
//     async (townId, institutionTypeId) => {
//       if (!token || (!townId && !institutionTypeId)) {
//         setFilteredPlaces([])
//         return
//       }

//       try {
//         let response
//         if (townId) {
//           response = await axios.post(
//             URLS.GetVillageTownPlaceOfWorkingId,
//             { townId },
//             { headers: { Authorization: `Bearer ${token}` } }
//           )
//         } else if (institutionTypeId) {
//           response = await axios.post(
//             URLS.GetInstitutionBygetPlaceOfWorking,
//             { institutionTypeId },
//             { headers: { Authorization: `Bearer ${token}` } }
//           )
//         }

//         const places = response?.data?.data || []
//         setFilteredPlaces(places)
//       } catch (error) {
//         console.error("Error fetching places of working:", error)
//         toast.error("Failed to load places of working")
//       }
//     },
//     [token]
//   )

//   const fetchSchemesAndQuarters = useCallback(
//     async financialYearId => {
//       if (!token || !financialYearId) {
//         setSchemes([])
//         setQuarters([])
//         return
//       }

//       setIsLoading(true)

//       try {
//         const response = await axios.post(
//           URLS.GetScheme,
//           { financialYearId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             timeout: 15000,
//           }
//         )

//         if (response.data) {
//           const schemesData = response.data.schemes || []
//           const quartersData = response.data.quarters || []

//           setSchemes(schemesData)
//           setQuarters(quartersData)

//           const storedSchemeId = localStorage.getItem("schemeId")
//           const storedQuarterId = localStorage.getItem("quarterId")

//           const defaultSchemeId =
//             storedSchemeId && schemesData.some(s => s._id === storedSchemeId)
//               ? storedSchemeId
//               : schemesData[0]?._id || ""

//           const defaultQuarterId =
//             storedQuarterId && quartersData.some(q => q._id === storedQuarterId)
//               ? storedQuarterId
//               : quartersData[0]?._id || ""

//           setFilters(prev => ({
//             ...prev,
//             schemeId: defaultSchemeId,
//             quarterId: defaultQuarterId,
//           }))
//         }
//       } catch (error) {
//         console.error("Error fetching schemes and quarters:", error)
//         toast.error("Failed to load schemes and quarters")
//         setSchemes([])
//         setQuarters([])
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [token]
//   )

//   const schemeOptions = useMemo(
//     () =>
//       schemes.map(scheme => ({
//         value: scheme._id,
//         label: scheme.name,
//       })),
//     [schemes]
//   )

//   const quarterOptions = useMemo(
//     () =>
//       quarters.map(quarter => ({
//         value: quarter._id,
//         label: quarter.quarter,
//       })),
//     [quarters]
//   )

//   const fetchDrugIndents = useCallback(
//     async (customFilters = null, customFinancialYearId = null) => {
//       if (!token) {
//         toast.error("Authentication required")
//         return
//       }

//       const filterParams = customFilters || filters
//       const financialYearId = customFinancialYearId || selectedFinancialYearId

//       if (!financialYearId) {
//         toast.error("Please select a financial year")
//         return
//       }

//       try {
//         setIsLoading(true)

//         const response = await axios.post(
//           URLS.GetAllGroupsReport,
//           {
//             ...filterParams,
//             financialYearId: financialYearId,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )

//         if (response.data) {
//           setDrugIndents(response?.data?.data || [])
//           setgrand_total(response?.data?.grand_total || [])

//           const csvData = []
//           const groups = response?.data?.data || []
//           groups.forEach(group => {
//             csvData.push({
//               "No.": "",
//               "Institution Type": `GROUP: ${group.group || ""}`,
//               District: group.formTypeName || "",
//               Mandal: "",
//               Village: "",
//               "Place of Working": "",
//               "Drug Code": "",
//               "Trade Name": "",
//               "Composition and Strength": "",
//               Specifications: "",
//               "Unit Pack": "",
//               Qty: "",
//               "Unit Price": "",
//               GST: "",
//               Total: "",
//             })

//             if (group.data && Array.isArray(group.data)) {
//               group.data.forEach((item, index) => {
//                 csvData.push({
//                   "No.": index + 1,
//                   "Institution Type": item.instituteTypeName || "-",
//                   District: item.districtName || "-",
//                   Mandal: item.mandalName || "-",
//                   Village: item.townName || "-",
//                   "Place of Working": item.workingPlaceName || "-",
//                   "Drug Code": item.drugCode || "-",
//                   "Trade Name": item.tradeName || "-",
//                   "Composition and Strength":
//                     item.compositionAndStrength || "-",
//                   Specifications: item.packingSpecification || "-",
//                   "Unit Pack": item.unitPack || "-",
//                   Qty: item.qty || 0,
//                   "Unit Price": formatNumber(item.rate, 2),
//                   GST: item.gst ? `${item.gst}%` : "-",
//                   Total: formatNumber(item.total, 2),
//                 })
//               })
//             }

//             csvData.push({
//               "No.": "",
//               "Institution Type": "",
//               District: "",
//               Mandal: "",
//               Village: "",
//               "Place of Working": "",
//               "Drug Code": "",
//               "Trade Name": "",
//               "Composition and Strength": "",
//               Specifications: "",
//               "Unit Pack": "",
//               Qty: "",
//               "Unit Price": "",
//               GST: "",
//               Total: formatNumber(group.totalFieldSum, 2),
//             })

//             const budget = group.formBudget || {}
//             csvData.push({
//               "No.": "",
//               "Institution Type": `ABSTRACT: [${
//                 budget.budgetPercentage || 0
//               }%]`,
//               District: `Budget Available: ${formatNumber(budget.budget, 2)}`,
//               Mandal: `Budget Booked: ${formatNumber(budget.bookedBudget, 2)}`,
//               Village: `Balance Budget: ${formatNumber(
//                 budget.availableBudget,
//                 2
//               )}`,
//               "Place of Working": "",
//               "Drug Code": "",
//               "Trade Name": "",
//               "Composition and Strength": "",
//               Specifications: "",
//               "Unit Pack": "",
//               Qty: "",
//               "Unit Price": "",
//               GST: "",
//               Total: "",
//             })
//             csvData.push({})
//           })

//           if (groups.length > 0) {
//             const grandTotalBudget = grand_total.total_budget_released

//             const grandTotalBooked = grand_total.total_budget_booked

//             const grandTotalBalance = grand_total.total_budget_balance

//             csvData.push({
//               "No.": "",
//               "Institution Type": "Grand Total:",
//               District: `Total Budget Released: ${formatNumber(
//                 grandTotalBudget,
//                 2
//               )}`,
//               Mandal: `Total Budget Booked: ${formatNumber(
//                 grandTotalBooked,
//                 2
//               )}`,
//               Village: `Total Balance Budget: ${formatNumber(
//                 grandTotalBalance,
//                 2
//               )}`,
//               "Place of Working": "",
//               "Drug Code": "",
//               "Trade Name": "",
//               "Composition and Strength": "",
//               Specifications: "",
//               "Unit Pack": "",
//               Qty: "",
//               "Unit Price": "",
//               GST: "",
//               Total: "",
//             })
//           }

//           setCsvData(csvData)
//         }
//       } catch (error) {
//         console.error("Error fetching drug indents:", error)
//         toast.error("Failed to fetch drug indents")
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [token, filters, selectedFinancialYearId]
//   )

//   const handleFilterChange = e => {
//     const { name, value } = e.target
//     setFilters(prev => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSelectFilterChange = async (selectedOption, { name }) => {
//     const value = selectedOption?.value || ""

//     if (name === "institutionTypeId") {
//       setFilters(prev => ({
//         ...prev,
//         institutionTypeId: value,
//         workingPlaceId: "",
//       }))

//       localStorage.setItem("institutionTypeId", value)

//       if (value) {
//         await fetchPlaceOfWorking(null, value)
//       } else {
//         setFilteredPlaces([])
//       }
//     } else if (name === "districtId") {
//       setFilters(prev => ({
//         ...prev,
//         districtId: value,
//         mandalId: "",
//         townId: "",
//         workingPlaceId: "",
//       }))

//       if (value) {
//         await fetchMandalsByDistrict(value)
//       } else {
//         setFilteredMandals([])
//         setFilteredVillages([])
//         setFilteredPlaces([])
//       }
//     } else if (name === "mandalId") {
//       setFilters(prev => ({
//         ...prev,
//         mandalId: value,
//         townId: "",
//         workingPlaceId: "",
//       }))

//       if (value) {
//         await fetchVillagesByMandal(value)
//       } else {
//         setFilteredVillages([])
//         setFilteredPlaces([])
//       }
//     } else if (name === "townId") {
//       setFilters(prev => ({
//         ...prev,
//         townId: value,
//         workingPlaceId: "",
//       }))

//       if (value) {
//         await fetchPlaceOfWorking(value, null)
//       } else {
//         setFilteredPlaces([])
//       }
//     } else if (name === "workingPlaceId") {
//       setFilters(prev => ({
//         ...prev,
//         workingPlaceId: value,
//       }))
//       localStorage.setItem("workingPlaceId", value)
//     } else if (name === "schemeId") {
//       setFilters(prev => ({
//         ...prev,
//         schemeId: value,
//       }))
//       localStorage.setItem("schemeId", value)
//     } else if (name === "quarterId") {
//       setFilters(prev => ({
//         ...prev,
//         quarterId: value,
//       }))
//       localStorage.setItem("quarterId", value)
//     } else {
//       setFilters(prev => ({
//         ...prev,
//         [name]: value,
//       }))
//     }
//   }

//   const handleFinancialYearChange = selectedOption => {
//     const value = selectedOption?.value || ""

//     setSelectedFinancialYearId(value)
//     localStorage.setItem("financialYearId", value)

//     if (value) {
//       fetchSchemesAndQuarters(value)
//       fetchDrugIndents(filters, value)
//     }
//   }

//   const handleSearch = () => {
//     if (!selectedFinancialYearId) {
//       toast.error("Please select a financial year")
//       return
//     }
//     fetchDrugIndents(filters, selectedFinancialYearId)
//   }

//   const handleReset = async () => {
//     const resetFilters = {
//       institutionTypeId: "",
//       workingPlaceId: "",
//       drugCode: "",
//       districtId: "",
//       mandalId: "",
//       townId: "",
//       schemeId: "",
//       quarterId: "",
//     }

//     setFilters(resetFilters)
//     setFilteredMandals([])
//     setFilteredVillages([])
//     setFilteredPlaces([])

//     localStorage.removeItem("institutionTypeId")
//     localStorage.removeItem("workingPlaceId")
//     localStorage.removeItem("schemeId")
//     localStorage.removeItem("quarterId")

//     if (selectedFinancialYearId) {
//       fetchDrugIndents(resetFilters, selectedFinancialYearId)
//     }
//   }

//   const toggleFilters = () => {
//     setShowFilters(!showFilters)
//   }

//   const generatePDF = () => {
//     if (drugIndents.length === 0) {
//       toast.warning("No data to export to PDF")
//       return
//     }

//     try {
//       const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a3",
//       })

//       const currentDate = new Date().toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       })

//       const financialYearText = getCurrentFinancialYearText()
//       const pageWidth = doc.internal.pageSize.width
//       const pageHeight = doc.internal.pageSize.height
//       const leftMargin = 15
//       const rightMargin = pageWidth - 15

//       doc.setFontSize(16)
//       doc.setTextColor(0, 0, 128)
//       doc.setFont(undefined, "bold")
//       doc.text(
//         "STATEMENT SHOWING THE DISTRICT MEDICINES INDENT",
//         pageWidth / 2,
//         15,
//         { align: "center" }
//       )

//       doc.setFontSize(12)
//       doc.setTextColor(0, 0, 0)
//       doc.text(
//         `DURING THE FINANCIAL YEAR ${financialYearText}`,
//         pageWidth / 2,
//         22,
//         { align: "center" }
//       )

//       doc.setFontSize(10)
//       doc.setFont(undefined, "normal")

//       doc.text(
//         "Head of Account: 2403-00-101-25-04-210/212-Drugs and Medicines",
//         leftMargin,
//         30
//       )

//       const generatedText = `Generated On: ${currentDate}`
//       const textWidth = doc.getTextWidth(generatedText)
//       doc.text(generatedText, rightMargin - textWidth, 30)

//       let startY = 40

//       drugIndents.forEach((group, groupIndex) => {
//         if (startY > 170) {
//           doc.addPage()
//           startY = 20
//         }

//         doc.setFontSize(12)
//         doc.setFillColor(240, 240, 240)
//         doc.rect(leftMargin, startY, pageWidth - 30, 8, "F")
//         doc.setTextColor(0, 0, 0)
//         doc.setFont(undefined, "bold")

//         const groupTitle = `${group.group} ${group.formTypeName}`
//         doc.text(groupTitle, pageWidth / 2, startY + 5, { align: "center" })

//         startY += 12

//         const tableData = []

//         group.data.forEach((item, index) => {
//           const total = parseFloat(item.total || 0)

//           tableData.push([
//             { content: (index + 1).toString(), styles: { halign: "center" } },
//             item.instituteTypeName || "-",
//             item.districtName || "-",
//             item.mandalName || "-",
//             item.townName || "-",
//             item.workingPlaceName || "-",
//             item.drugCode?.slice(0, 20) || "-",
//             item.tradeName || "-",
//             item.compositionAndStrength || "-",
//             item.packingSpecification?.slice(0, 20) || "-",
//             item.unitPack || "-",
//             {
//               content: item.qty?.toString() || "0",
//               styles: { halign: "center" },
//             },
//             {
//               content: formatNumber(item.rate, 2),
//               styles: { halign: "right" },
//             },
//             {
//               content: `${item.salesTax || 12}%`,
//               styles: { halign: "center" },
//             },
//             {
//               content: formatNumber(total, 2),
//               styles: { halign: "right" },
//             },
//           ])
//         })

//         autoTable(doc, {
//           startY: startY,
//           head: [
//             [
//               { content: "No.", styles: { halign: "center" } },
//               { content: "Institution Type", styles: { halign: "center" } },
//               { content: "District", styles: { halign: "center" } },
//               { content: "Mandal", styles: { halign: "center" } },
//               { content: "Village", styles: { halign: "center" } },
//               { content: "Place of Working", styles: { halign: "center" } },
//               { content: "Drug Code", styles: { halign: "center" } },
//               { content: "Trade Name", styles: { halign: "center" } },
//               {
//                 content: "Composition & Strength",
//                 styles: { halign: "center" },
//               },
//               { content: "Specifications", styles: { halign: "center" } },
//               { content: "Unit Pack", styles: { halign: "center" } },
//               { content: "Qty", styles: { halign: "center" } },
//               { content: "Unit Price", styles: { halign: "center" } },
//               { content: "GST", styles: { halign: "center" } },
//               { content: "Total", styles: { halign: "center" } },
//             ],
//           ],
//           body: tableData,
//           theme: "grid",
//           headStyles: {
//             fillColor: [41, 128, 185],
//             textColor: 255,
//             fontStyle: "bold",
//             fontSize: 9,
//             halign: "center",
//           },
//           bodyStyles: {
//             fontSize: 8,
//             cellPadding: 2,
//             overflow: "linebreak",
//           },
//           columnStyles: {},
//           margin: { left: leftMargin, right: 15 },
//           tableWidth: "auto",
//           styles: {
//             cellPadding: 2,
//             fontSize: 8,
//             valign: "middle",
//           },
//           didDrawPage: function () {
//             doc.setFontSize(8)
//             doc.setTextColor(150, 150, 150)
//             doc.text(
//               `Page ${doc.internal.getNumberOfPages()}`,
//               pageWidth / 2,
//               pageHeight - 10,
//               { align: "center" }
//             )
//           },
//         })

//         startY = doc.lastAutoTable.finalY + 10

//         const budgetAvailable = group.formBudget?.budget || 0
//         const budgetBooked = group.formBudget?.bookedBudget || 0
//         const balanceBudget = group.formBudget?.availableBudget || 0
//         const percentageBooked = group.formBudget?.budgetPercentage || 0

//         doc.setFontSize(10)
//         doc.setFont(undefined, "bold")
//         doc.setTextColor(0, 0, 0)

//         const abstractText = `ABSTRACT: [${percentageBooked}%]`
//         doc.text(abstractText, leftMargin, startY)

//         const budgetAvailableText = `Budget Available: ${formatNumber(
//           budgetAvailable
//         )}`
//         doc.text(budgetAvailableText, leftMargin + 80, startY)

//         const budgetBookedText = `Budget Booked: ${formatNumber(budgetBooked)}`
//         doc.text(budgetBookedText, leftMargin + 160, startY)

//         const balanceBudgetText = `Balance Budget: ${formatNumber(
//           balanceBudget
//         )}`
//         doc.text(balanceBudgetText, leftMargin + 240, startY)

//         startY += 10

//         if (groupIndex < drugIndents.length - 1) {
//           doc.setDrawColor(200, 200, 200)
//           doc.setLineWidth(0.5)
//           doc.line(leftMargin, startY, rightMargin, startY)
//           startY += 15
//         }
//       })

//       if (drugIndents.length > 0) {
//         const totalBudgetReleased = grand_total.total_budget_released

//         const totalBudgetBooked = grand_total.total_budget_booked

//         const totalBalanceBudget = grand_total.total_budget_balance

//         startY += 10

//         doc.setFontSize(11)
//         doc.setFillColor(220, 230, 241)
//         doc.rect(leftMargin, startY, pageWidth - 30, 12, "F")
//         doc.setFont(undefined, "bold")
//         doc.text("GRAND TOTAL SUMMARY", leftMargin + 5, startY + 7)

//         const totalReleasedText = `Total Budget Released: ${formatNumber(
//           totalBudgetReleased
//         )}`
//         const releasedWidth = doc.getTextWidth(totalReleasedText)
//         doc.text(
//           totalReleasedText,
//           leftMargin + 120 - releasedWidth,
//           startY + 7
//         )

//         const totalBookedText = `Total Budget Booked: ${formatNumber(
//           totalBudgetBooked
//         )}`
//         const bookedWidth = doc.getTextWidth(totalBookedText)
//         doc.text(totalBookedText, leftMargin + 220 - bookedWidth, startY + 7)

//         const totalBalanceText = `Total Balance Budget: ${formatNumber(
//           totalBalanceBudget
//         )}`
//         const balanceWidth = doc.getTextWidth(totalBalanceText)
//         doc.text(totalBalanceText, leftMargin + 320 - balanceWidth, startY + 7)
//       }

//       const fileName = `District_Medicines_Indent_Report_${financialYearText}_${
//         new Date().toISOString().split("T")[0]
//       }.pdf`
//       doc.save(fileName)

//       toast.success("PDF generated successfully!")
//     } catch (error) {
//       console.error("Error generating PDF:", error)
//       toast.error("Failed to generate PDF")
//     }
//   }

//   const csvReport = {
//     filename: `District_Medicines_Indent_Report_${
//       new Date().toISOString().split("T")[0]
//     }.csv`,
//     data: csvData,
//     headers: [
//       { label: "No.", key: "No." },
//       { label: "Institution Type", key: "Institution Type" },
//       { label: "District", key: "District" },
//       { label: "Mandal", key: "Mandal" },
//       { label: "Village", key: "Village" },
//       { label: "Place of Working", key: "Place of Working" },
//       { label: "Drug Code", key: "Drug Code" },
//       { label: "Trade Name", key: "Trade Name" },
//       { label: "Composition and Strength", key: "Composition and Strength" },
//       { label: "Specifications", key: "Specifications" },
//       { label: "Unit Pack", key: "Unit Pack" },
//       { label: "Qty", key: "Qty" },
//       { label: "Unit Price", key: "Unit Price" },
//       { label: "GST", key: "GST" },
//       { label: "Total", key: "Total" },
//     ],
//   }

//   const getCurrentFinancialYearText = () => {
//     if (!selectedFinancialYearId || financialYears.length === 0) return "N/A"

//     const currentYear = financialYears.find(
//       year => year._id === selectedFinancialYearId
//     )
//     return currentYear ? currentYear.year : "N/A"
//   }
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true)
//       try {
//         await Promise.all([
//           fetchEmploymentType(),
//           fetchDrugItems(),
//           fetchDistricts(),
//           fetchFinancialYears(),
//         ])

//         const storedInstitutionTypeId =
//           localStorage.getItem("institutionTypeId")
//         if (storedInstitutionTypeId) {
//           await fetchPlaceOfWorking(null, storedInstitutionTypeId)
//         }
//       } catch (error) {
//         console.error("Error initializing data:", error)
//         toast.error("Failed to initialize form data")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     initializeData()
//   }, [
//     fetchEmploymentType,
//     fetchDrugItems,
//     fetchDistricts,
//     fetchFinancialYears,
//     fetchPlaceOfWorking,
//   ])

//   useEffect(() => {
//     if (selectedFinancialYearId) {
//       fetchSchemesAndQuarters(selectedFinancialYearId)
//       fetchDrugIndents(filters, selectedFinancialYearId)
//     }
//   }, [selectedFinancialYearId])

//   const institutionTypeOptions = employmentType.map(type => ({
//     value: type._id,
//     label: type.name,
//   }))

//   const districtOptions = districts.map(district => ({
//     value: district._id,
//     label: district.name,
//   }))

//   const mandalOptions = filteredMandals.map(mandal => ({
//     value: mandal._id,
//     label: mandal.name,
//   }))

//   const villageOptions = filteredVillages.map(village => ({
//     value: village._id,
//     label: village.name,
//   }))

//   const filterPlaceOfWorkingOptions = filteredPlaces.map(place => ({
//     value: place._id,
//     label: place.name,
//   }))

//   const financialYearOptions = financialYears.map(year => ({
//     value: year._id,
//     label: year.year,
//   }))

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: 34,
//       height: 34,
//       paddingLeft: 2,
//       fontSize: 14,
//       borderRadius: 8,
//       borderColor: state.isFocused ? "#2563eb" : "#d0d7e2",
//       boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
//       transition: "0.25s",
//       "&:hover": {
//         borderColor: "#b8c2d3",
//       },
//     }),
//     valueContainer: base => ({
//       ...base,
//       padding: "0 8px",
//     }),
//     indicatorsContainer: base => ({
//       ...base,
//       height: 34,
//     }),
//     option: base => ({
//       ...base,
//       fontSize: 14,
//       padding: "8px 12px",
//     }),
//     placeholder: base => ({
//       ...base,
//       fontSize: 14,
//       color: "#94a3b8",
//     }),
//   }

//   if (isLoading) {
//     return (
//       <div className="page-content">
//         <div className="container-fluid">
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{ height: "400px" }}
//           >
//             <div className="text-center">
//               <Spinner color="primary" />
//               <p className="mt-2">Loading form data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         {showFilters && (
//           <Card className="mb-3">
//             <CardBody>
//               <h5 className="mb-3 text-primary">
//                 <i className="fas fa-filter me-2"></i>
//                 Filters
//               </h5>
//               <Row>
//                 <Col md={2}>
//                   <FormGroup>
//                     <Label>Financial Year</Label>
//                     <Select
//                       name="financialYearId"
//                       value={financialYearOptions.find(
//                         opt => opt.value === selectedFinancialYearId
//                       )}
//                       onChange={handleFinancialYearChange}
//                       options={financialYearOptions}
//                       styles={selectStyles}
//                       placeholder="Select Financial Year"
//                       isSearchable
//                       isClearable
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={2}>
//                   <FormGroup className="mb-0">
//                     <Label className="form-label-sm fw-medium mb-1">
//                       Scheme
//                     </Label>
//                     <Select
//                       name="schemeId"
//                       value={schemeOptions.find(
//                         opt => opt.value === filters.schemeId
//                       )}
//                       onChange={handleSelectFilterChange}
//                       options={schemeOptions}
//                       styles={selectStyles}
//                       placeholder="Select Scheme"
//                       isSearchable
//                       isClearable
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={2}>
//                   <FormGroup className="mb-0">
//                     <Label className="form-label-sm fw-medium mb-1">
//                       Quarter
//                     </Label>
//                     <Select
//                       name="quarterId"
//                       value={quarterOptions.find(
//                         opt => opt.value === filters.quarterId
//                       )}
//                       onChange={handleSelectFilterChange}
//                       options={quarterOptions}
//                       styles={selectStyles}
//                       placeholder="Select Quarter"
//                       isSearchable
//                       isClearable
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={2}>
//                   <FormGroup>
//                     <Label>Institution Type</Label>
//                     <Select
//                       name="institutionTypeId"
//                       value={institutionTypeOptions.find(
//                         opt => opt.value === filters.institutionTypeId
//                       )}
//                       onChange={handleSelectFilterChange}
//                       options={institutionTypeOptions}
//                       styles={selectStyles}
//                       placeholder="Select Institution Type"
//                       isSearchable
//                       isClearable
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={2}>
//                   <FormGroup>
//                     <Label>District</Label>
//                     <Select
//                       name="districtId"
//                       value={districtOptions.find(
//                         opt => opt.value === filters.districtId
//                       )}
//                       onChange={handleSelectFilterChange}
//                       options={districtOptions}
//                       styles={selectStyles}
//                       placeholder="Select District"
//                       isSearchable
//                       isClearable
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={2}>
//                   <FormGroup>
//                     <Label>Mandal</Label>
//                     <Select
//                       name="mandalId"
//                       value={mandalOptions.find(
//                         opt => opt.value === filters.mandalId
//                       )}
//                       onChange={handleSelectFilterChange}
//                       options={mandalOptions}
//                       styles={selectStyles}
//                       placeholder={
//                         filters.districtId
//                           ? "Select Mandal"
//                           : "Select District First"
//                       }
//                       isSearchable
//                       isClearable
//                       isDisabled={!filters.districtId}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={3}>
//                   <FormGroup>
//                     <Label>Village/Town</Label>
//                     <Select
//                       name="townId"
//                       value={villageOptions.find(
//                         opt => opt.value === filters.townId
//                       )}
//                       onChange={handleSelectFilterChange}
//                       options={villageOptions}
//                       styles={selectStyles}
//                       placeholder={
//                         filters.mandalId
//                           ? "Select Village/Town"
//                           : "Select Mandal First"
//                       }
//                       isSearchable
//                       isClearable
//                       isDisabled={!filters.mandalId}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={3}>
//                   <FormGroup>
//                     <Label>Place of Working</Label>
//                     <Select
//                       name="workingPlaceId"
//                       value={filterPlaceOfWorkingOptions.find(
//                         opt => opt.value === filters.workingPlaceId
//                       )}
//                       onChange={handleSelectFilterChange}
//                       options={filterPlaceOfWorkingOptions}
//                       styles={selectStyles}
//                       placeholder={
//                         filters.townId || filters.institutionTypeId
//                           ? "Select Place of Working"
//                           : "Select Village or Institution Type First"
//                       }
//                       isSearchable
//                       isClearable
//                       isDisabled={!filters.townId && !filters.institutionTypeId}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md={3}>
//                   <FormGroup>
//                     <Label>Drug Code</Label>
//                     <Input
//                       type="select"
//                       name="drugCode"
//                       value={filters.drugCode}
//                       onChange={handleFilterChange}
//                     >
//                       <option value="">All Drugs</option>
//                       {drugItems.map(drug => (
//                         <option key={drug._id} value={drug._id}>
//                           {drug.drugCode?.slice(0, 20) || "N/A"}
//                         </option>
//                       ))}
//                     </Input>
//                   </FormGroup>
//                 </Col>
//               </Row>
//               <div className="d-flex justify-content-end mt-3 pt-2 border-top">
//                 <Button
//                   color="secondary"
//                   onClick={handleReset}
//                   className="me-2"
//                 >
//                   <i className="bx bx-reset me-1"></i>
//                   Reset Filters
//                 </Button>
//                 <Button color="primary" onClick={handleSearch}>
//                   <i className="bx bx-search me-1"></i>
//                   Search
//                 </Button>
//               </div>
//             </CardBody>
//           </Card>
//         )}
//         <Card>
//           <CardBody>
//             <Row className="mb-3">
//               <Col md={12}>
//                 <div className="d-flex justify-content-end align-items-center">
//                   <Button
//                     color="light"
//                     onClick={toggleFilters}
//                     className="d-flex align-items-center me-2"
//                   >
//                     <i
//                       className={`fas ${
//                         showFilters ? "fa-eye-slash" : "fa-filter"
//                       } me-2`}
//                     ></i>
//                     {showFilters ? "Hide Filters" : "Show Filters"}
//                   </Button>
//                   <Button
//                     color="danger"
//                     onClick={generatePDF}
//                     className="me-2"
//                     disabled={drugIndents.length === 0}
//                   >
//                     <i className="bx bxs-file-pdf me-1"></i>
//                     Export to PDF
//                   </Button>
//                   <CSVLink
//                     {...csvReport}
//                     className="btn btn-success me-2"
//                     disabled={drugIndents.length === 0}
//                   >
//                     <i className="bx bx-file me-1"></i>
//                     Export to Excel
//                   </CSVLink>
//                   <div style={{ maxWidth: "300px" }}>
//                     <Input
//                       type="search"
//                       placeholder="Search drug code or trade name..."
//                       value={searchTerm}
//                       onChange={e => setSearchTerm(e.target.value)}
//                       className="form-control"
//                     />
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//             <div className="text-center mb-2">
//               <h2 className="text-primary mb-2">
//                 STATEMENT SHOWING THE ADILABAD DISTRICT MEDICINES INDENT FOR THE
//                 2ND QUARTER
//               </h2>
//               <h4 className="text-muted">
//                 DURING THE FINANCIAL YEAR {getCurrentFinancialYearText()}
//               </h4>
//               <div className="d-flex justify-content-between mt-3">
//                 <div className="text-start">
//                   <p className="mb-1">
//                     <strong>Head of Account:</strong>{" "}
//                     2403-00-101-25-04-210/212-Drugs and Medicines
//                   </p>
//                 </div>
//                 <div className="text-end">
//                   <p className="mb-1">
//                     <strong> Total Budget Available Now:</strong>{" "}
//                     {grand_total.total_budget_balance}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="table-responsive">
//               {drugIndents.length === 0 ? (
//                 <div className="text-center py-5">
//                   <h5 className="text-muted">No data found</h5>
//                   <p className="text-muted">
//                     Try adjusting your filters or search criteria
//                   </p>
//                 </div>
//               ) : (
//                 drugIndents.map(group => (
//                   <React.Fragment key={group._id}>
//                     <div className="mb-3 p-1">
//                       <Table hover className="table table-bordered mb-4">
//                         <thead>
//                           <tr className="text-center">
//                             <th>No.</th>
//                             <th>Drug Code</th>
//                             <th>Trade Name</th>
//                             <th>Composition and Strength</th>
//                             <th>Specifications</th>
//                             <th>Unit Pack</th>
//                             <th> Name of the Stockist</th>
//                             <th>Qty</th>
//                             <th>Unit Price</th>
//                             <th>Total</th>
//                             <th>GST</th>
//                             <th>Grand Total</th>
//                           </tr>
//                         </thead>

//                         <tbody>
//                           <tr className="text-center bg-light">
//                             <td colSpan="12">
//                               <h5 className="mb-1"> {group.group} {group.formTypeName}</h5>
//                             </td>
//                           </tr>
//                         </tbody>

//                         <tbody>
//                           {group.data.map((item, index) => {
//                             return (
//                               <tr key={item._id} className="text-center">
//                                 <td className="text-center fw-bold">
//                                   {index + 1}
//                                 </td>
//                                 <td>{item.drugCode?.slice(0, 8) || "-"}</td>
//                                 <td>{item.tradeName || "-"}</td>
//                                 <td>{item.compositionAndStrength || "-"}</td>
//                                 <td>
//                                   {item.packingSpecification?.slice(0, 20) ||
//                                     "-"}
//                                 </td>
//                                 <td>{item.unitPack || "-"}</td>
//                                 <td>{item.nameOfStockiest || "-"}</td>
//                                 <td className="text-center">{item.qty || 0}</td>
//                                 <td className="text-end">
//                                   {formatNumber(item.rate, 2)}
//                                 </td>
//                                 <td className="text-center">
//                                   {formatNumber(item?.total, 2) || "-"}
//                                 </td>
//                                 <td className="text-end">
//                                   {item.gst + "%" || "-"}
//                                 </td>
//                                 <td className="text-end">
//                                   {item.grandTotal || "-"}
//                                 </td>
//                               </tr>
//                             )
//                           })}
//                           <tr className="table-active">
//                             <td colSpan="11" className="text-end fw-bold">
//                               TOTAL
//                             </td>
//                             <td className="text-end fw-bold">
//                               {formatNumber(group?.totalFieldSum, 2)}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </Table>
//                          <div className="p-3 border rounded">
//                         <div className="row">
//                           <div
//                             className="col-md-3"
//                             style={{ borderRight: "1px solid #eff2f7" }}
//                           >
//                             <div className="mt-2">
//                               <small className="text-muted">
//                                 ABSTRACT: [
//                                 {group.formBudget?.budgetPercentage || 0}
//                                 %]
//                               </small>
//                             </div>
//                           </div>
//                           <div
//                             className="col-md-3"
//                             style={{ borderRight: "1px solid #eff2f7" }}
//                           >
//                             <div className="d-flex justify-content-between mb-1">
//                               <span className="fw-bold">Budget Available:</span>
//                               <span>
//                                 {formatNumber(group.formBudget?.budget, 2)}
//                               </span>
//                             </div>
//                           </div>
//                           <div
//                             className="col-md-3"
//                             style={{ borderRight: "1px solid #eff2f7" }}
//                           >
//                             <div className="d-flex justify-content-between mb-1">
//                               <span className="fw-bold">Budget Booked:</span>
//                               <span>
//                                 {formatNumber(
//                                   group.formBudget?.bookedBudget,
//                                   2
//                                 )}
//                               </span>
//                             </div>
//                           </div>
//                           <div
//                             className="col-md-3"
//                             style={{ borderLeft: "1px solid #eff2f7" }}
//                           >
//                             <div className="d-flex justify-content-between mb-1">
//                               <span className="fw-bold">Balance Budget:</span>
//                               <span>
//                                 {formatNumber(
//                                   group.formBudget?.availableBudget,
//                                   2
//                                 )}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <hr />
//                   </React.Fragment>
//                 ))
//               )}
//             </div>
//             {drugIndents.length > 0 && (
//               <div className="p-2 rounded">
//                 <div className="row">
//                   <div
//                     className="col-md-3"
//                     style={{ borderRight: "1px solid #eff2f7" }}
//                   >
//                     <div className="d-flex justify-content-between mb-1">
//                       <span className="fw-bold">
//                         {" "}
//                         GRAND TOTAL OF DVAHO ADILABAD:
//                       </span>

//                       <span className="fw-bold">
//                         {grand_total.total_budget_released}
//                       </span>
//                     </div>
//                   </div>
//                   <div
//                     className="col-md-3"
//                     style={{ borderRight: "1px solid #eff2f7" }}
//                   >
//                     <div className="d-flex justify-content-between mb-1">
//                       <span className="fw-bold">Total Budget Released :</span>

//                       <span className="fw-bold">
//                         {grand_total.total_budget_booked}
//                       </span>
//                     </div>
//                   </div>
//                   <div
//                     className="col-md-3"
//                     style={{ borderLeft: "1px solid #eff2f7" }}
//                   >
//                     <div className="d-flex justify-content-between mb-1">
//                       <span className="fw-bold">Budget Booked :</span>

//                       <span className="fw-bold">
//                         {grand_total.total_budget_balance}
//                       </span>
//                     </div>
//                   </div>
//                   <div
//                     className="col-md-3"
//                     style={{ borderLeft: "1px solid #eff2f7" }}
//                   >
//                     <div className="d-flex justify-content-between mb-1">
//                       <span className="fw-bold"> Balance Budget :</span>

//                       <span className="fw-bold">
//                         {grand_total.total_budget_balance}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default GroupsReport



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

const GroupsReport = () => {
  // State Management
  const [drugIndents, setDrugIndents] = useState([])
  const [employmentType, setEmploymentType] = useState([])
  const [drugItems, setDrugItems] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false) // For search operation loading
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [schemes, setSchemes] = useState([])
  const [quarters, setQuarters] = useState([])
  const [csvData, setCsvData] = useState([])
  const [districts, setDistricts] = useState([])
  const [filteredMandals, setFilteredMandals] = useState([])
  const [filteredVillages, setFilteredVillages] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [grand_total, setgrand_total] = useState({})
  const [reportSummary, setReportSummary] = useState({
    totalRecords: 0,
    totalQuantity: 0,
    totalAmount: 0,
  })

  // Ref to track initial mount
  const isInitialMount = useRef(true)

  const [filters, setFilters] = useState({
    institutionTypeId:   "",
    workingPlaceId:  "",
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
    if (!filters.quarterId || quarters.length === 0) return "2ND"
    const currentQuarter = quarters.find(q => q._id === filters.quarterId)
    return currentQuarter ? currentQuarter.quarter : "2ND"
  }

  // Helper to get current district name
  const getCurrentDistrictName = () => {
    if (!filters.districtId || districts.length === 0) return ""
    const currentDistrict = districts.find(d => d._id === filters.districtId)
    return currentDistrict ? currentDistrict.name : ""
  }

  // Build dynamic heading text
  const getReportHeadingText = () => {
    const districtName = getCurrentDistrictName()
    const quarterName = getCurrentQuarterName()
    return `STATEMENT SHOWING THE ${districtName.toUpperCase()} DISTRICT MEDICINES INDENT FOR THE ${quarterName} QUARTER`
  }

  // API Functions
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
      console.error("Error fetching Form By Drugs:", error)
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
          setDrugIndents(response?.data?.data || [])
          setgrand_total(response?.data?.grand_total || {})

          // Calculate report summary
          let totalRecords = 0
          let totalQuantity = 0
          let totalAmount = 0

          const groups = response?.data?.data || []
          groups.forEach(group => {
            if (group.data && Array.isArray(group.data)) {
              totalRecords += group.data.length
              group.data.forEach(item => {
                totalQuantity += parseFloat(item.qty || item.quantity || 0)
                totalAmount += parseFloat(item.total || item.amount || item.grandTotal || 0)
              })
            }
          })

          setReportSummary({
            totalRecords,
            totalQuantity,
            totalAmount,
          })

          // Prepare CSV data
          const csvDataArray = []
          groups.forEach(group => {
            csvDataArray.push({
              "No.": "",
              "Institution Type": `GROUP: ${group.group || ""}`,
              District: group.formTypeName || "",
              Mandal: "",
              Village: "",
              "Place of Working": "",
              "Drug Code": "",
              "Trade Name": "",
              "Composition and Strength": "",
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
                  "Institution Type": item.instituteTypeName || "-",
                  District: item.districtName || "-",
                  Mandal: item.mandalName || "-",
                  Village: item.townName || "-",
                  "Place of Working": item.workingPlaceName || "-",
                  "Drug Code": item.drugCode || "-",
                  "Trade Name": item.tradeName || "-",
                  "Composition and Strength":
                    item.compositionAndStrength || "-",
                  Specifications: item.packingSpecification || "-",
                  "Unit Pack": item.unitPack || "-",
                  Qty: item.qty || 0,
                  "Unit Price": formatNumber(item.rate, 2),
                  GST: item.gst ? `${item.gst}%` : "-",
                  Total: formatNumber(item.total, 2),
                })
              })
            }

            csvDataArray.push({
              "No.": "",
              "Institution Type": "",
              District: "",
              Mandal: "",
              Village: "",
              "Place of Working": "",
              "Drug Code": "",
              "Trade Name": "",
              "Composition and Strength": "",
              Specifications: "",
              "Unit Pack": "",
              Qty: "",
              "Unit Price": "",
              GST: "",
              Total: formatNumber(group.totalFieldSum, 2),
            })

            const budget = group.formBudget || {}
            csvDataArray.push({
              "No.": "",
              "Institution Type": `ABSTRACT: [${budget.budgetPercentage || 0}%]`,
              District: `Budget Available: ${formatNumber(budget.budget, 2)}`,
              Mandal: `Budget Booked: ${formatNumber(budget.bookedBudget, 2)}`,
              Village: `Balance Budget: ${formatNumber(budget.availableBudget, 2)}`,
              "Place of Working": "",
              "Drug Code": "",
              "Trade Name": "",
              "Composition and Strength": "",
              Specifications: "",
              "Unit Pack": "",
              Qty: "",
              "Unit Price": "",
              GST: "",
              Total: "",
            })
            csvDataArray.push({})
          })

          if (groups.length > 0) {
            const grandTotalBudget = grand_total.total_budget_released || 0
            const grandTotalBooked = grand_total.total_budget_booked || 0
            const grandTotalBalance = grand_total.total_budget_balance || 0

            csvDataArray.push({
              "No.": "",
              "Institution Type": "Grand Total:",
              District: `Total Budget Released: ${formatNumber(grandTotalBudget, 2)}`,
              Mandal: `Total Budget Booked: ${formatNumber(grandTotalBooked, 2)}`,
              Village: `Total Balance Budget: ${formatNumber(grandTotalBalance, 2)}`,
              "Place of Working": "",
              "Drug Code": "",
              "Trade Name": "",
              "Composition and Strength": "",
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
        toast.error("Failed to fetch drug indents")
      } finally {
        setIsDataLoading(false)
      }
    },
    [token, filters, selectedFinancialYearId]
  )

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
    setgrand_total({})
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

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 128)
      doc.setFont(undefined, "bold")
      doc.text(
        headingText,
        pageWidth / 2,
        15,
        { align: "center" }
      )

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
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
        doc.setFillColor(240, 240, 240)
        doc.rect(leftMargin, startY, pageWidth - 30, 8, "F")
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, "bold")

        const groupTitle = `${group.group} ${group.formTypeName}`
        doc.text(groupTitle, pageWidth / 2, startY + 5, { align: "center" })

        startY += 12

        const tableData = []

        if (group.data && Array.isArray(group.data)) {
          group.data.forEach((item, index) => {
            const total = parseFloat(item.total || 0)

            tableData.push([
              { content: (index + 1).toString(), styles: { halign: "center" } },
              item.instituteTypeName || "-",
              item.districtName || "-",
              item.mandalName || "-",
              item.townName || "-",
              item.workingPlaceName || "-",
              item.drugCode?.slice(0, 20) || "-",
              item.tradeName || "-",
              item.compositionAndStrength || "-",
              item.packingSpecification?.slice(0, 20) || "-",
              item.unitPack || "-",
              {
                content: item.qty?.toString() || "0",
                styles: { halign: "center" },
              },
              {
                content: formatNumber(item.rate, 2),
                styles: { halign: "right" },
              },
              {
                content: `${item.salesTax || 12}%`,
                styles: { halign: "center" },
              },
              {
                content: formatNumber(total, 2),
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
              { content: "Institution Type", styles: { halign: "center" } },
              { content: "District", styles: { halign: "center" } },
              { content: "Mandal", styles: { halign: "center" } },
              { content: "Village", styles: { halign: "center" } },
              { content: "Place of Working", styles: { halign: "center" } },
              { content: "Drug Code", styles: { halign: "center" } },
              { content: "Trade Name", styles: { halign: "center" } },
              {
                content: "Composition & Strength",
                styles: { halign: "center" },
              },
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
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: "linebreak",
          },
          columnStyles: {},
          margin: { left: leftMargin, right: 15 },
          tableWidth: "auto",
          styles: {
            cellPadding: 2,
            fontSize: 8,
            valign: "middle",
          },
          didDrawPage: function () {
            doc.setFontSize(8)
            doc.setTextColor(150, 150, 150)
            doc.text(
              `Page ${doc.internal.getNumberOfPages()}`,
              pageWidth / 2,
              pageHeight - 10,
              { align: "center" }
            )
          },
        })

        startY = doc.lastAutoTable.finalY + 10

        const budgetAvailable = group.formBudget?.budget || 0
        const budgetBooked = group.formBudget?.bookedBudget || 0
        const balanceBudget = group.formBudget?.availableBudget || 0
        const percentageBooked = group.formBudget?.budgetPercentage || 0

        doc.setFontSize(10)
        doc.setFont(undefined, "bold")
        doc.setTextColor(0, 0, 0)

        const abstractText = `ABSTRACT: [${percentageBooked}%]`
        doc.text(abstractText, leftMargin, startY)

        const budgetAvailableText = `Budget Available: ${formatNumber(budgetAvailable)}`
        doc.text(budgetAvailableText, leftMargin + 80, startY)

        const budgetBookedText = `Budget Booked: ${formatNumber(budgetBooked)}`
        doc.text(budgetBookedText, leftMargin + 160, startY)

        const balanceBudgetText = `Balance Budget: ${formatNumber(balanceBudget)}`
        doc.text(balanceBudgetText, leftMargin + 240, startY)

        startY += 10

        if (groupIndex < drugIndents.length - 1) {
          doc.setDrawColor(200, 200, 200)
          doc.setLineWidth(0.5)
          doc.line(leftMargin, startY, rightMargin, startY)
          startY += 15
        }
      })

      if (drugIndents.length > 0) {
        const totalBudgetReleased = grand_total.total_budget_released || 0
        const totalBudgetBooked = grand_total.total_budget_booked || 0
        const totalBalanceBudget = grand_total.total_budget_balance || 0

        startY += 10

        doc.setFontSize(11)
        doc.setFillColor(220, 230, 241)
        doc.rect(leftMargin, startY, pageWidth - 30, 12, "F")
        doc.setFont(undefined, "bold")
        doc.text("GRAND TOTAL SUMMARY", leftMargin + 5, startY + 7)

        const totalReleasedText = `Total Budget Released: ${formatNumber(totalBudgetReleased)}`
        const releasedWidth = doc.getTextWidth(totalReleasedText)
        doc.text(
          totalReleasedText,
          leftMargin + 120 - releasedWidth,
          startY + 7
        )

        const totalBookedText = `Total Budget Booked: ${formatNumber(totalBudgetBooked)}`
        const bookedWidth = doc.getTextWidth(totalBookedText)
        doc.text(totalBookedText, leftMargin + 220 - bookedWidth, startY + 7)

        const totalBalanceText = `Total Balance Budget: ${formatNumber(totalBalanceBudget)}`
        const balanceWidth = doc.getTextWidth(totalBalanceText)
        doc.text(totalBalanceText, leftMargin + 320 - balanceWidth, startY + 7)
      }

      const fileName = `District_Medicines_Indent_Report_${financialYearText}_${
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
    filename: `District_Medicines_Indent_Report_${
      new Date().toISOString().split("T")[0]
    }.csv`,
    data: csvData,
    headers: [
      { label: "No.", key: "No." },
      { label: "Institution Type", key: "Institution Type" },
      { label: "District", key: "District" },
      { label: "Mandal", key: "Mandal" },
      { label: "Village", key: "Village" },
      { label: "Place of Working", key: "Place of Working" },
      { label: "Drug Code", key: "Drug Code" },
      { label: "Trade Name", key: "Trade Name" },
      { label: "Composition and Strength", key: "Composition and Strength" },
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
            (item.tradeName || "").toLowerCase().includes(searchLower) ||
            (item.compositionAndStrength || "").toLowerCase().includes(searchLower) ||
            (item.districtName || "").toLowerCase().includes(searchLower) ||
            (item.instituteTypeName || "").toLowerCase().includes(searchLower)
          )
        })

        return {
          ...group,
          data: filteredData,
        }
      })
      .filter(group => group.data && group.data.length > 0)
  }, [drugIndents, searchTerm])

  // Memoized Options
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

        const storedInstitutionTypeId = localStorage.getItem("institutionTypeId")
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

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">Loading form data...</p>
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
              <h5 className="mb-3 text-primary">
                <i className="fas fa-filter me-2"></i>
                Filters
              </h5>
              <Row>
                <Col md={2}>
                  <FormGroup>
                    <Label>Financial Year</Label>
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
                  <FormGroup className="mb-0">
                    <Label className="form-label-sm fw-medium mb-1">
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
                  <FormGroup className="mb-0">
                    <Label className="form-label-sm fw-medium mb-1">
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
                    <Label>Institution Type</Label>
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
                    <Label>District</Label>
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
                    <Label>Mandal</Label>
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
                    <Label>Village/Town</Label>
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
                    <Label>Place of Working</Label>
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
                    <Label>Drug Code</Label>
                    <Input
                      type="select"
                      name="drugCode"
                      value={filters.drugCode}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Drugs</option>
                      {drugItems.map(drug => (
                        <option key={drug._id} value={drug._id}>
                          {drug.drugCode?.slice(0, 20) || "N/A"}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3 pt-2 border-top">
                <Button
                  color="secondary"
                  onClick={handleReset}
                  className="me-2"
                  disabled={isDataLoading}
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
                      className="d-flex align-items-center me-2"
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
                      Export to PDF
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
                      Export to Excel
                    </CSVLink>
                    <div style={{ maxWidth: "300px" }}>
                      <Input
                        type="search"
                        placeholder="Search drug code or trade name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-control"
                        disabled={isDataLoading}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Report Header */}
            <div className="text-center mb-2">
              <h2 className="text-primary mb-2">
                {getReportHeadingText()}
              </h2>
              <h4 className="text-muted">
                DURING THE FINANCIAL YEAR {getCurrentFinancialYearText()}
              </h4>
              <div className="d-flex justify-content-between mt-3">
                <div className="text-start">
                  <p className="mb-1">
                    <strong>Head of Account:</strong>{" "}
                    2403-00-101-25-04-210/212-Drugs and Medicines
                  </p>
                </div>
                <div className="text-end">
                  <p className="mb-1">
                    <strong> Total Amount:</strong>{" "}
                    {formatCurrency(reportSummary.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State for Report Data */}
            {isDataLoading ? (
              <div className="text-center py-5">
                <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
                <p className="mt-3">Loading report data...</p>
              </div>
            ) : (
              <>
                {/* Report Content */}
                <div className="table-responsive">
                  {filteredDrugIndents.length === 0 ? (
                    <div className="text-center py-5">
                      <h5 className="text-muted">No data found</h5>
                      <p className="text-muted">
                        Please select filters and click "Search" to generate the report
                      </p>
                    </div>
                  ) : (
                    filteredDrugIndents.map((group, groupIndex) => (
                      <React.Fragment key={group._id || groupIndex}>
                        <div className="mb-3 p-1">
                          <Table hover className="table table-bordered mb-4">
                            <thead>
                              <tr className="text-center">
                                <th>No.</th>
                                <th>Drug Code</th>
                                <th>Trade Name</th>
                                <th>Composition and Strength</th>
                                <th>Specifications</th>
                                <th>Unit Pack</th>
                                <th>Name of the Stockist</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>GST</th>
                                <th>Total</th>
                                {/* <th>Grand Total</th> */}
                              </tr>
                            </thead>

                            <tbody>
                              <tr className="text-center bg-light">
                                <td colSpan="12">
                                  <h5 className="mb-1"> {group.group} {group.formTypeName}</h5>
                                </td>
                              </tr>
                            </tbody>

                            <tbody>
                              {group.data && Array.isArray(group.data) && group.data.map((item, index) => (
                                <tr key={item._id || index} className="text-center">
                                  <td className="text-center fw-bold">{index + 1}</td>
                                  <td>{item.drugCode?.slice(0, 8) || "-"}</td>
                                  <td>{item.tradeName || "-"}</td>
                                  <td>{item.compositionAndStrength || "-"}</td>
                                  <td>
                                    {item.packingSpecification?.slice(0, 20) || "-"}
                                  </td>
                                  <td>{item.unitPack || "-"}</td>
                                  <td>{item.nameOfStockiest || "-"}</td>
                                  <td className="text-center">{item.qty || 0}</td>
                                  <td className="text-end">
                                    {formatNumber(item.unitPrice, 2)}
                                  </td>
                                  <td className="text-end">
                                    {item.gst + "%" || "-"}
                                  </td>
                                  <td className="text-center">
                                    {formatNumber(item?.total, 2) || "-"}
                                  </td>
                                  {/* <td className="text-end">
                                    {item.grandTotal || "-"}
                                  </td> */}
                                </tr>
                              ))}
                              <tr className="table-active">
                                <td colSpan="10" className="text-end fw-bold">
                                  TOTAL
                                </td>
                                <td className="text-end fw-bold">
                                  {formatNumber(group?.totalFieldSum, 2)}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                          <div className="p-3 border rounded">
                            <div className="row">
                              <div
                                className="col-md-3"
                                style={{ borderRight: "1px solid #eff2f7" }}
                              >
                                <div className="mt-2">
                                  <small className="text-muted">
                                    ABSTRACT: [
                                    {group.formBudget?.budgetPercentage || 0}
                                    %]
                                  </small>
                                </div>
                              </div>
                              <div
                                className="col-md-3"
                                style={{ borderRight: "1px solid #eff2f7" }}
                              >
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="fw-bold">Budget Available:</span>
                                  <span>
                                    {formatNumber(group.formBudget?.budget, 2)}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="col-md-3"
                                style={{ borderRight: "1px solid #eff2f7" }}
                              >
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="fw-bold">Budget Booked:</span>
                                  <span>
                                    {formatNumber(group.formBudget?.bookedBudget, 2)}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="col-md-3"
                                style={{ borderLeft: "1px solid #eff2f7" }}
                              >
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="fw-bold">Balance Budget:</span>
                                  <span>
                                    {formatNumber(group.formBudget?.availableBudget, 2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {groupIndex < filteredDrugIndents.length - 1 && <hr />}
                      </React.Fragment>
                    ))
                  )}
                </div>

                {/* Grand Total Summary */}
                {filteredDrugIndents.length > 0 && (
                  <div className="p-2 rounded mt-4">
                    <div className="row">
                      <div
                        className="col-md-3"
                        style={{ borderRight: "1px solid #eff2f7" }}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold">
                            GRAND TOTAL :
                          </span>
                          <span className="fw-bold">
                            {grand_total.total_budget_released || "0"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="col-md-3"
                        style={{ borderRight: "1px solid #eff2f7" }}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold">Total Budget Released:</span>
                          <span className="fw-bold">
                            {grand_total.total_budget_booked || "0"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="col-md-3"
                        style={{ borderLeft: "1px solid #eff2f7" }}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold">Budget Booked:</span>
                          <span className="fw-bold">
                            {grand_total.total_budget_balance || "0"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="col-md-3"
                        style={{ borderLeft: "1px solid #eff2f7" }}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold">Balance Budget:</span>
                          <span className="fw-bold">
                            {grand_total.total_budget_balance || "0"}
                          </span>
                        </div>
                      </div>
                    </div>
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

export default GroupsReport 
