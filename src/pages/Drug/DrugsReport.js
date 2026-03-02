// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
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

//   // Ref to track initial render
//   const isInitialMount = useRef(true)

//   const [filters, setFilters] = useState({
//     institutionTypeId: localStorage.getItem("institutionTypeId") || "",
//     districtId: "",
//     mandalId: "",
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
//       } catch (error) {
//         console.error("Error fetching villages:", error)
//         toast.error("Failed to load villages")
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
//           URLS.GetAllDrugsReport,
//           {
//             ...filterParams,
//             financialYearId: financialYearId,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )

//         if (response.data) {
//           const data = response?.data?.data || []
          
//           // Sort data by district name in ascending order
//           const sortedData = [...data].sort((a, b) => {
//             const districtA = (a.district || "").toLowerCase()
//             const districtB = (b.district || "").toLowerCase()
//             return districtA.localeCompare(districtB)
//           })
          
//           setDrugIndents(sortedData)

//           // Prepare CSV data with CORRECT column order
//           const csvRows = []
//           sortedData.forEach((item, index) => {
//             csvRows.push({
//               "No.": index + 1,
//               "District": item.district || "-",
//               "Mandal": item.mandalName || "-",
//               "Institution Type": item.institutionType || "-",
//               "Place of Working": item.placeOfWorking || "-",
//               "Group Name": item.groupName || "-",
//               "Drug Code": item.drugCode.slice(0, 8) || "-",
//               "Trade Name": item.tradeName || "-",
//               "Qty": item.qty || 0,
//               "Unit Price": formatNumber(item.unitPrice, 2),
//               "GST": item.gst || "-",
//               "Total": formatNumber(item.total, 2),
//               "Name Of the Firm": item.nameOfFirm || "-",
//               "Name Of the Stockiest": item.nameOfStockiest || "-",
//             })
//           })
//           setCsvData(csvRows)
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
//       }))

//       localStorage.setItem("institutionTypeId", value)
//     } else if (name === "districtId") {
//       setFilters(prev => ({
//         ...prev,
//         districtId: value,
//         mandalId: "",
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
//       }))

//       if (value) {
//         await fetchVillagesByMandal(value)
//       } else {
//         setFilteredVillages([])
//         setFilteredPlaces([])
//       }
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
//       districtId: "",
//       mandalId: "",
//       schemeId: "",
//       quarterId: "",
//     }

//     setFilters(resetFilters)
//     setFilteredMandals([])
//     setFilteredVillages([])
//     setFilteredPlaces([])
//     setDrugIndents([])
//     setCsvData([])

//     localStorage.removeItem("institutionTypeId")
//     localStorage.removeItem("schemeId")
//     localStorage.removeItem("quarterId")
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

//       // Header
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

//       // Sub-header
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

//       // Prepare table data with CORRECT column order (already sorted)
//       const tableData = drugIndents.map((item, index) => [
//         (index + 1).toString(),
//         item.district || "-",
//         item.mandalName || "-",
//         item.institutionType || "-",
//         item.placeOfWorking || "-",
//         item.groupName || "-",
//         item.drugCode || "-",
//         item.tradeName || "-",
//         item.qty?.toString() || "0",
//         formatNumber(item.unitPrice, 2),
//         item.gst || "-",
//         formatNumber(item.total, 2),
//         item.nameOfFirm || "-",
//         item.nameOfStockiest || "-",
//       ])

//       // Calculate totals for summary
//       const totalQty = drugIndents.reduce(
//         (sum, item) => sum + (parseFloat(item.qty) || 0),
//         0
//       )
//       const totalAmount = drugIndents.reduce(
//         (sum, item) => sum + (parseFloat(item.total) || 0),
//         0
//       )

//       // Create table with CORRECT header order
//       autoTable(doc, {
//         startY: startY,
//         head: [
//           [
//             {
//               content: "No.",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "District",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Mandal",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Institution Type",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Place of Working",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Group Name",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Drug Code",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Trade Name",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Qty",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Unit Price",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "GST",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Total",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Name Of the Firm",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Name Of the Stockiest",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//           ],
//         ],
//         body: tableData,
//         theme: "grid",
//         headStyles: {
//           fillColor: [41, 128, 185],
//           textColor: 255,
//           fontStyle: "bold",
//           fontSize: 9,
//           halign: "center",
//         },
//         bodyStyles: {
//           fontSize: 8,
//           cellPadding: 2,
//           overflow: "linebreak",
//         },
//         columnStyles: {
//           0: { cellWidth: "auto", halign: "center" },
//           1: { cellWidth: "auto", halign: "left" },
//           2: { cellWidth: "auto", halign: "left" },
//           3: { cellWidth: "auto", halign: "left" },
//           4: { cellWidth: "auto", halign: "left" },
//           5: { cellWidth: "auto", halign: "left" },
//           6: { cellWidth: "auto", halign: "left" },
//           7: { cellWidth: "auto", halign: "left" },
//           8: { cellWidth: "auto", halign: "right" },
//           9: { cellWidth: "auto", halign: "right" },
//           10: { cellWidth: "auto", halign: "center" },
//           11: { cellWidth: "auto", halign: "right" },
//           12: { cellWidth: "auto", halign: "left" },
//           13: { cellWidth: "auto", halign: "left" },
//         },
//         margin: { left: leftMargin, right: 15 },
//         tableWidth: "auto",
//         styles: {
//           cellPadding: 2,
//           fontSize: 8,
//           valign: "middle",
//         },
//         didDrawPage: function () {
//           doc.setFontSize(8)
//           doc.setTextColor(150, 150, 150)
//           doc.text(
//             `Page ${doc.internal.getNumberOfPages()}`,
//             pageWidth / 2,
//             pageHeight - 10,
//             { align: "center" }
//           )
//         },
//       })

//       // Add summary section
//       startY = doc.lastAutoTable.finalY + 10

//       doc.setFontSize(10)
//       doc.setFont(undefined, "bold")
//       doc.setFillColor(240, 240, 240)
//       doc.rect(leftMargin, startY, pageWidth - 30, 8, "F")

//       const summaryText = `Total Records: ${
//         drugIndents.length
//       } | Total Quantity: ${totalQty} | Total Amount: ${formatNumber(
//         totalAmount
//       )}`
//       doc.text(summaryText, leftMargin + 5, startY + 5)

//       // Save PDF
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

//   // CSV Report configuration with CORRECT header order
//   const csvReport = {
//     filename: `District_Medicines_Indent_Report_${
//       new Date().toISOString().split("T")[0]
//     }.csv`,
//     data: csvData,
//     headers: [
//       { label: "No.", key: "No." },
//       { label: "District", key: "District" },
//       { label: "Mandal", key: "Mandal" },
//       { label: "Institution Type", key: "Institution Type" },
//       { label: "Place of Working", key: "Place of Working" },
//       { label: "Group Name", key: "Group Name" },
//       { label: "Drug Code", key: "Drug Code" },
//       { label: "Trade Name", key: "Trade Name" },
//       { label: "Qty", key: "Qty" },
//       { label: "Unit Price", key: "Unit Price" },
//       { label: "GST", key: "GST" },
//       { label: "Total", key: "Total" },
//       { label: "Name Of the Firm", key: "Name Of the Firm" },
//       { label: "Name Of the Stockiest", key: "Name Of the Stockiest" },
//     ],
//   }

//   const getCurrentFinancialYearText = () => {
//     if (!selectedFinancialYearId || financialYears.length === 0) return "N/A"

//     const currentYear = financialYears.find(
//       year => year._id === selectedFinancialYearId
//     )
//     return currentYear ? currentYear.year : "N/A"
//   }

//   // Initialize form data only (no data fetching)
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true)
//       try {
//         await Promise.all([
//           fetchEmploymentType(),
//           fetchDistricts(),
//           fetchFinancialYears(),
//         ])
//       } catch (error) {
//         console.error("Error initializing data:", error)
//         toast.error("Failed to initialize form data")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     initializeData()
//   }, [fetchEmploymentType, fetchDistricts, fetchFinancialYears])

//   // Only fetch schemes and quarters when financial year changes (no drug indents)
//   useEffect(() => {
//     // Skip the initial render
//     if (isInitialMount.current) {
//       isInitialMount.current = false

//       // Only fetch schemes/quarters on initial mount, not drug indents
//       if (selectedFinancialYearId) {
//         fetchSchemesAndQuarters(selectedFinancialYearId)
//       }
//       return
//     }

//     // On subsequent changes, only fetch schemes/quarters
//     if (selectedFinancialYearId) {
//       fetchSchemesAndQuarters(selectedFinancialYearId)
//     }
//   }, [selectedFinancialYearId, fetchSchemesAndQuarters])

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
//                 STATEMENT SHOWING THE DISTRICT MEDICINES INDENT
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
//               </div>
//             </div>
//             <div className="table-responsive">
//               <React.Fragment>
//                 <div className="mb-3 p-1">
//                   <Table hover className="table table-bordered mb-4">
//                     <thead>
//                       <tr className="text-center">
//                         <th>No.</th>
//                         <th>District</th>
//                         <th>Mandal</th>
//                         <th>Institution Type</th>
//                         <th>Place of Working</th>
//                         <th>Group Name</th>
//                         <th>Drug Code</th>
//                         <th>Trade Name</th>
//                         <th>Unit Pack</th>
//                         <th>Qty</th>
//                         <th>Unit Price</th>
//                         <th>GST</th>
//                         <th>Total</th>
//                         <th>Name Of the Firm</th>
//                         <th>Name Of the Stockiest</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {drugIndents.length > 0 ? (
//                         drugIndents.map((item, index) => (
//                           <tr key={item._id || index} className="text-center">
//                             <td className="text-center fw-bold">{index + 1}</td>
//                             <td>{item.district || "-"}</td>
//                             <td>{item.mandalName || "-"}</td>
//                             <td>{item.institutionType || "-"}</td>
//                             <td>{item.placeOfWorking || "-"}</td>
//                             <td>{item.groupName || "-"}</td>
//                             <td>{item.drugCode.slice(0, 8) || "-"}</td>
//                             <td>{item.tradeName || "-"}</td>
//                             <td>{item.unitPack || "-"}</td>
//                             <td className="text-center">{item.qty || 0}</td>
//                             <td>{formatNumber(item.unitPrice, 2)}</td>
//                             <td>{item.gst || "-"}</td>
//                             <td className="text-end">
//                               {formatNumber(item.total, 2)}
//                             </td>
//                             <td>{item.nameOfFirm || "-"}</td>
//                             <td>{item.nameOfStockiest || "-"}</td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="15" className="text-center py-4">
//                             <div className="text-muted">
//                               <i className="bx bx-search-alt bx-md d-block mb-2"></i>
//                               <p className="mb-0">
//                                 No data available. Please select filters and
//                                 click Search to view results.
//                               </p>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </Table>
//                 </div>
//                 {drugIndents.length > 0 && (
//                   <div className="d-flex justify-content-between mt-4">
//                     <div>
//                       <p className="mb-0">
//                         <strong>Total Records:</strong> {drugIndents.length}
//                       </p>
//                     </div>
//                     <div className="text-end">
//                       <p className="mb-0">
//                         <strong>Total Quantity:</strong>{" "}
//                         {drugIndents.reduce(
//                           (sum, item) => sum + (parseFloat(item.qty) || 0),
//                           0
//                         )}
//                       </p>
//                       <p className="mb-0">
//                         <strong>Total Amount:</strong>{" "}
//                         {formatNumber(
//                           drugIndents.reduce(
//                             (sum, item) => sum + (parseFloat(item.total) || 0),
//                             0
//                           ),
//                           2
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </React.Fragment>
//             </div>
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
  const [reportSummary, setReportSummary] = useState({
    totalRecords: 0,
    totalQuantity: 0,
    totalAmount: 0,
  })

  // Ref to track initial mount
  const isInitialMount = useRef(true)

  const [filters, setFilters] = useState({
    institutionTypeId:   "",
    districtId: "",
    mandalId: "",
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
      } catch (error) {
        console.error("Error fetching villages:", error)
        toast.error("Failed to load villages")
      }
    },
    [token]
  )

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
          URLS.GetAllDrugsReport,
          {
            ...filterParams,
            financialYearId: financialYearId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (response.data) {
          const data = response?.data?.data || []
          
          // Sort data by district name in ascending order
          const sortedData = [...data].sort((a, b) => {
            const districtA = (a.district || "").toLowerCase()
            const districtB = (b.district || "").toLowerCase()
            return districtA.localeCompare(districtB)
          })
          
          setDrugIndents(sortedData)

          // Calculate report summary
          let totalRecords = sortedData.length
          let totalQuantity = 0
          let totalAmount = 0

          sortedData.forEach(item => {
            totalQuantity += parseFloat(item.qty || 0)
            totalAmount += parseFloat(item.total || 0)
          })

          setReportSummary({
            totalRecords,
            totalQuantity,
            totalAmount,
          })

          // Prepare CSV data with CORRECT column order
          const csvRows = []
          sortedData.forEach((item, index) => {
            csvRows.push({
              "No.": index + 1,
              "District": item.district || "-",
              "Mandal": item.mandalName || "-",
              "Institution Type": item.institutionType || "-",
              "Place of Working": item.placeOfWorking || "-",
              "Group Name": item.groupName || "-",
              "Drug Code": item.drugCode?.slice(0, 8) || "-",
              "Trade Name": item.tradeName || "-",
              "Unit Pack": item.unitPack || "-",
              "Qty": item.qty || 0,
              "Unit Price": formatNumber(item.unitPrice, 2),
              "GST": item.gst || "-",
              "Total": formatNumber(item.total, 2),
              "Name Of the Firm": item.nameOfFirm || "-",
              "Name Of the Stockiest": item.nameOfStockiest || "-",
            })
          })
          setCsvData(csvRows)
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
      }))

      localStorage.setItem("institutionTypeId", value)
    } else if (name === "districtId") {
      setFilters(prev => ({
        ...prev,
        districtId: value,
        mandalId: "",
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
      }))

      if (value) {
        await fetchVillagesByMandal(value)
      } else {
        setFilteredVillages([])
        setFilteredPlaces([])
      }
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
      districtId: "",
      mandalId: "",
      schemeId: "",
      quarterId: "",
    }

    setFilters(resetFilters)
    setFilteredMandals([])
    setFilteredVillages([])
    setFilteredPlaces([])
    setDrugIndents([])
    setCsvData([])
    setReportSummary({
      totalRecords: 0,
      totalQuantity: 0,
      totalAmount: 0,
    })

    localStorage.removeItem("institutionTypeId")
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
      doc.setTextColor(0, 0, 128)
      doc.setFont(undefined, "bold")
      doc.text(headingText, pageWidth / 2, 15, { align: "center" })

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(
        `DURING THE FINANCIAL YEAR ${financialYearText}`,
        pageWidth / 2,
        22,
        { align: "center" }
      )

      // Sub-header
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

      // Prepare table data with CORRECT column order (already sorted)
      const tableData = drugIndents.map((item, index) => [
        (index + 1).toString(),
        item.district || "-",
        item.mandalName || "-",
        item.institutionType || "-",
        item.placeOfWorking || "-",
        item.groupName || "-",
        item.drugCode || "-",
        item.tradeName || "-",
        item.unitPack || "-",
        item.qty?.toString() || "0",
        formatNumber(item.unitPrice, 2),
        item.gst || "-",
        formatNumber(item.total, 2),
        item.nameOfFirm || "-",
        item.nameOfStockiest || "-",
      ])

      // Create table with CORRECT header order
      autoTable(doc, {
        startY: startY,
        head: [
          [
            {
              content: "No.",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "District",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Mandal",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Institution Type",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Place of Working",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Group Name",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Drug Code",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Trade Name",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Unit Pack",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Qty",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Unit Price",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "GST",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Total",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Name Of the Firm",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Name Of the Stockiest",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
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
        columnStyles: {
          0: { cellWidth: "auto", halign: "center" },
          1: { cellWidth: "auto", halign: "left" },
          2: { cellWidth: "auto", halign: "left" },
          3: { cellWidth: "auto", halign: "left" },
          4: { cellWidth: "auto", halign: "left" },
          5: { cellWidth: "auto", halign: "left" },
          6: { cellWidth: "auto", halign: "left" },
          7: { cellWidth: "auto", halign: "left" },
          8: { cellWidth: "auto", halign: "left" },
          9: { cellWidth: "auto", halign: "right" },
          10: { cellWidth: "auto", halign: "right" },
          11: { cellWidth: "auto", halign: "center" },
          12: { cellWidth: "auto", halign: "right" },
          13: { cellWidth: "auto", halign: "left" },
          14: { cellWidth: "auto", halign: "left" },
        },
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

      // Add summary section
      startY = doc.lastAutoTable.finalY + 10

      doc.setFontSize(10)
      doc.setFont(undefined, "bold")
      doc.setFillColor(240, 240, 240)
      doc.rect(leftMargin, startY, pageWidth - 30, 8, "F")

      const summaryText = `Total Records: ${
        drugIndents.length
      } | Total Quantity: ${reportSummary.totalQuantity} | Total Amount: ${formatNumber(
        reportSummary.totalAmount
      )}`
      doc.text(summaryText, leftMargin + 5, startY + 5)

      // Save PDF
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

  // CSV Report configuration with CORRECT header order
  const csvReport = {
    filename: `District_Medicines_Indent_Report_${
      new Date().toISOString().split("T")[0]
    }.csv`,
    data: csvData,
    headers: [
      { label: "No.", key: "No." },
      { label: "District", key: "District" },
      { label: "Mandal", key: "Mandal" },
      { label: "Institution Type", key: "Institution Type" },
      { label: "Place of Working", key: "Place of Working" },
      { label: "Group Name", key: "Group Name" },
      { label: "Drug Code", key: "Drug Code" },
      { label: "Trade Name", key: "Trade Name" },
      { label: "Unit Pack", key: "Unit Pack" },
      { label: "Qty", key: "Qty" },
      { label: "Unit Price", key: "Unit Price" },
      { label: "GST", key: "GST" },
      { label: "Total", key: "Total" },
      { label: "Name Of the Firm", key: "Name Of the Firm" },
      { label: "Name Of the Stockiest", key: "Name Of the Stockiest" },
    ],
  }

  // Filtered drugIndents based on search term
  const filteredDrugIndents = useMemo(() => {
    if (!searchTerm) return drugIndents

    const searchLower = searchTerm.toLowerCase()
    return drugIndents.filter(item => {
      return (
        (item.district || "").toLowerCase().includes(searchLower) ||
        (item.mandalName || "").toLowerCase().includes(searchLower) ||
        (item.institutionType || "").toLowerCase().includes(searchLower) ||
        (item.tradeName || "").toLowerCase().includes(searchLower) ||
        (item.drugCode || "").toLowerCase().includes(searchLower) ||
        (item.nameOfFirm || "").toLowerCase().includes(searchLower) ||
        (item.nameOfStockiest || "").toLowerCase().includes(searchLower)
      )
    })
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
          fetchDistricts(),
          fetchFinancialYears(),
        ])
      } catch (error) {
        console.error("Error initializing data:", error)
        toast.error("Failed to initialize form data")
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [fetchEmploymentType, fetchDistricts, fetchFinancialYears])

  // Only fetch schemes and quarters when financial year changes (no drug indents)
  useEffect(() => {
    // Skip the initial render
    if (isInitialMount.current) {
      isInitialMount.current = false

      // Only fetch schemes/quarters on initial mount, not drug indents
      if (selectedFinancialYearId) {
        fetchSchemesAndQuarters(selectedFinancialYearId)
      }
      return
    }

    // On subsequent changes, only fetch schemes/quarters
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
                        placeholder="Search drug code, trade name, district..."
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
              <h3 className="text-primary mb-2">
                {getReportHeadingText()}
              </h3>
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
                    <strong>Total Amount:</strong>{" "}
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
                  <React.Fragment>
                    <div className="mb-3 p-1">
                      <Table hover className="table table-bordered mb-4">
                        <thead>
                          <tr className="text-center">
                            <th>No.</th>
                            <th>District</th>
                            <th>Mandal</th>
                            <th>Institution Type</th>
                            <th>Place of Working</th>
                            <th>Group Name</th>
                            <th>Drug Code</th>
                            <th>Trade Name</th>
                            <th>Unit Pack</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>GST</th>
                            <th>Total</th>
                            <th>Name Of the Firm</th>
                            <th>Name Of the Stockiest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDrugIndents.length > 0 ? (
                            filteredDrugIndents.map((item, index) => (
                              <tr key={item._id || index} className="text-center">
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>{item.district || "-"}</td>
                                <td>{item.mandalName || "-"}</td>
                                <td>{item.institutionType || "-"}</td>
                                <td>{item.placeOfWorking || "-"}</td>
                                <td>{item.groupName || "-"}</td>
                                <td>{item.drugCode?.slice(0, 8) || "-"}</td>
                                <td>{item.tradeName || "-"}</td>
                                <td>{item.unitPack || "-"}</td>
                                <td className="text-center">{item.qty || 0}</td>
                                <td>{formatNumber(item.unitPrice, 2)}</td>
                                <td>{item.gst || "-"}</td>
                                <td className="text-end">
                                  {formatNumber(item.total, 2)}
                                </td>
                                <td>{item.nameOfFirm || "-"}</td>
                                <td>{item.nameOfStockiest || "-"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="15" className="text-center py-4">
                                <div className="text-muted">
                                  <i className="bx bx-search-alt bx-md d-block mb-2"></i>
                                  <p className="mb-0">
                                    No data available. Please select filters and
                                    click Search to view results.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    {filteredDrugIndents.length > 0 && (
                      <div className="d-flex justify-content-between mt-4">
                        <div>
                          <p className="mb-0">
                            <strong>Total Records:</strong> {reportSummary.totalRecords}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="mb-0">
                            <strong>Total Quantity:</strong>{" "}
                            {reportSummary.totalQuantity}
                          </p>
                          <p className="mb-0">
                            <strong>Total Amount:</strong>{" "}
                            {formatNumber(reportSummary.totalAmount, 2)}
                          </p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default GroupsReport