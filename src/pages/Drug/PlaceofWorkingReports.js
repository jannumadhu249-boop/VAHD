// import React, { useState, useEffect, useCallback, useMemo } from "react"
// import "react-toastify/dist/ReactToastify.css"
// import { toast } from "react-toastify"
// import autoTable from "jspdf-autotable"
// import { CSVLink } from "react-csv"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import jsPDF from "jspdf"
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

//   const [filters, setFilters] = useState({
//     institutionTypeId: localStorage.getItem("institutionTypeId") || "",
//     districtId: "",
//     mandalId: "",
//     townId: "",
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
//           townId: "",
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
//         }))
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

//   const prepareExportData = useCallback(data => {
//     const exportRows = []

//     data.forEach((group, groupIndex) => {
//       exportRows.push({
//         "No.": "",
//         District: group.groupName || "",
//         Mandal: group.formName || "",
//         Village: "",
//         "Place of Working": "",
//         Budget: "",
//         "Booked Budget": "",
//         "Available Budget": "",
//         "Utilization Percentage": "",
//       })

//       group.places?.forEach((item, index) => {
//         exportRows.push({
//           "No.": index + 1,
//           District: item.districtName || "-",
//           Mandal: item.mandalName || "-",
//           Village: item.townName || "-",
//           "Place of Working": item.workingPlaceName || "-",
//           Budget: formatNumber(item.budget, 2),
//           "Booked Budget": formatNumber(item.bookedBudget, 2),
//           "Available Budget": formatNumber(item.availableBudget, 2),
//           "Utilization Percentage": item.utilizationPercentage
//             ? `${item.utilizationPercentage}%`
//             : "-",
//         })
//       })

//       exportRows.push({
//         "No.": "",
//         District: "TOTAL",
//         Mandal: "",
//         Village: "",
//         "Place of Working": "",
//         Budget: formatNumber(group.formBudget?.budget, 2),
//         "Booked Budget": formatNumber(group.formBudget?.bookedBudget, 2),
//         "Available Budget": formatNumber(group.formBudget?.availableBudget, 2),
//         "Utilization Percentage": group.formBudget?.budgetPercentage
//           ? `${group.formBudget?.budgetPercentage}%`
//           : "-",
//       })

//       if (groupIndex < data.length - 1) {
//         exportRows.push({
//           "No.": "",
//           District: "",
//           Mandal: "",
//           Village: "",
//           "Place of Working": "",
//           Budget: "",
//           "Booked Budget": "",
//           "Available Budget": "",
//           "Utilization Percentage": "",
//         })
//       }
//     })

//     return exportRows
//   }, [])

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
//           URLS.GetPlaceofWorkingReports,
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
//           setDrugIndents(data)

//           const exportData = prepareExportData(data)
//           setCsvData(exportData)
//         }
//       } catch (error) {
//         console.error("Error fetching drug indents:", error)
//         toast.error("Failed to fetch drug indents")
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [token, filters, selectedFinancialYearId, prepareExportData]
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
//         townId: "",
//       }))

//       if (value) {
//         await fetchMandalsByDistrict(value)
//       } else {
//         setFilteredMandals([])
//         setFilteredVillages([])
//       }
//     } else if (name === "mandalId") {
//       setFilters(prev => ({
//         ...prev,
//         mandalId: value,
//         townId: "",
//       }))

//       if (value) {
//         await fetchVillagesByMandal(value)
//       } else {
//         setFilteredVillages([])
//       }
//     } else if (name === "townId") {
//       setFilters(prev => ({
//         ...prev,
//         townId: value,
//       }))
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
//       districtId: "",
//       mandalId: "",
//       townId: "",
//       schemeId: "",
//       quarterId: "",
//     }

//     setFilters(resetFilters)
//     setFilteredMandals([])
//     setFilteredVillages([])

//     localStorage.removeItem("institutionTypeId")
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
//         "PLACE OF WORKING BUDGET UTILIZATION REPORT",
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

//         const groupTitle = `${group.groupName || ""} ${group.formName || ""}`
//         doc.text(groupTitle, pageWidth / 2, startY + 5, { align: "center" })

//         startY += 12

//         const tableData = []

//         group.places?.forEach((item, index) => {
//           tableData.push([
//             (index + 1).toString(),
//             item.districtName || "-",
//             item.mandalName || "-",
//             item.townName || "-",
//             item.workingPlaceName || "-",
//             formatNumber(item.budget, 2),
//             formatNumber(item.bookedBudget, 2),
//             formatNumber(item.availableBudget, 2),
//             item.utilizationPercentage ? `${item.utilizationPercentage}%` : "-",
//           ])
//         })

//         autoTable(doc, {
//           startY: startY,
//           head: [
//             [
//               "No.",
//               "District",
//               "Mandal",
//               "Village",
//               "Place of Working",
//               "Budget",
//               "Booked Budget",
//               "Available Budget",
//               "Utilization Percentage",
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
//           },
//           columnStyles: {
//             0: { halign: "center", cellWidth: 20 },
//             1: { cellWidth: 40 },
//             2: { cellWidth: 40 },
//             3: { cellWidth: 40 },
//             4: { cellWidth: 50 },
//             5: { halign: "right", cellWidth: 30 },
//             6: { halign: "right", cellWidth: 30 },
//             7: { halign: "right", cellWidth: 30 },
//             8: { halign: "center", cellWidth: 30 },
//           },
//           margin: { left: leftMargin, right: 15 },
//           didDrawCell: function (data) {
//             if (data.row.index === tableData.length - 1) {
//               doc.setFillColor(248, 249, 250)
//               doc.rect(
//                 data.cell.x,
//                 data.cell.y,
//                 data.cell.width,
//                 data.cell.height,
//                 "F"
//               )
//               doc.setTextColor(0, 0, 0)
//               doc.setFont(undefined, "bold")
//             }
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

//         if (groupIndex < drugIndents.length - 1) {
//           doc.setDrawColor(200, 200, 200)
//           doc.setLineWidth(0.5)
//           doc.line(leftMargin, startY, rightMargin, startY)
//           startY += 15
//         }
//       })

//       const fileName = `Place_of_Working_Report_${financialYearText.replace(
//         /\s+/g,
//         "_"
//       )}_${new Date().toISOString().split("T")[0]}.pdf`
//       doc.save(fileName)

//       toast.success("PDF generated successfully!")
//     } catch (error) {
//       console.error("Error generating PDF:", error)
//       toast.error("Failed to generate PDF")
//     }
//   }

//   const csvReport = {
//     filename: `Place_of_Working_Report_${
//       new Date().toISOString().split("T")[0]
//     }.csv`,
//     data: csvData,
//     headers: [
//       { label: "No.", key: "No." },
//       { label: "District", key: "District" },
//       { label: "Mandal", key: "Mandal" },
//       { label: "Village", key: "Village" },
//       { label: "Place of Working", key: "Place of Working" },
//       { label: "Budget", key: "Budget" },
//       { label: "Booked Budget", key: "Booked Budget" },
//       { label: "Available Budget", key: "Available Budget" },
//       { label: "Utilization Percentage", key: "Utilization Percentage" },
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
//                       placeholder="Search place of working..."
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
//                 PLACE OF WORKING BUDGET UTILIZATION REPORT
//               </h2>
//               <h4 className="text-muted">
//                 DURING THE FINANCIAL YEAR {getCurrentFinancialYearText()}
//               </h4>
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
//                       <div
//                         className="p-3 mb-1 border rounded"
//                         style={{
//                           background: "#fbfbfbff",
//                         }}
//                       >
//                         <div className="text-center">
//                           <h5 className="mb-1">
//                             {group.groupName} {group.formName}
//                           </h5>
//                         </div>
//                       </div>
//                       <Table hover className="table table-bordered mb-4">
//                         <thead>
//                           <tr className="text-center">
//                             <th>No.</th>
//                             <th>District</th>
//                             <th>Mandal</th>
//                             <th>Village</th>
//                             <th>Place of Working</th>
//                             <th>Budget</th>
//                             <th>Booked Budget</th>
//                             <th>Available Budget</th>
//                             <th>Utilization Percentage</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {group.places?.map((item, index) => (
//                             <tr key={item._id} className="text-center">
//                               <td className="text-center fw-bold">
//                                 {index + 1}
//                               </td>
//                               <td>{item.districtName || "-"}</td>
//                               <td>{item.mandalName || "-"}</td>
//                               <td>{item.townName || "-"}</td>
//                               <td>{item.workingPlaceName || "-"}</td>
//                               <td>{formatNumber(item.budget, 2)}</td>
//                               <td>{formatNumber(item.bookedBudget, 2)}</td>
//                               <td>{formatNumber(item.availableBudget, 2)}</td>
//                               <td>
//                                 {item.utilizationPercentage
//                                   ? `${item.utilizationPercentage}%`
//                                   : "-"}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                     <hr />
//                   </React.Fragment>
//                 ))
//               )}
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default GroupsReport

// import React, { useState, useEffect, useCallback, useMemo } from "react"
// import "react-toastify/dist/ReactToastify.css"
// import { toast } from "react-toastify"
// import autoTable from "jspdf-autotable"
// import { CSVLink } from "react-csv"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import jsPDF from "jspdf"
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

//   const prepareExportData = useCallback(data => {
//     const exportRows = []
//     data.forEach((item, index) => {
//       exportRows.push({
//         "No.": index + 1,
//         District: item.districtName || "-",
//         Mandal: item.mandalName || "-",
//         Village: item.townName || "-",
//         "Place of Working": item.workingPlaceName || "-",
//         Budget: formatNumber(item.totalBudget, 2),
//         "Booked Budget": formatNumber(item.totalBooked, 2),
//         "Available Budget": formatNumber(item.totalAvailable, 2),
//         "Utilization Percentage": `${item.utilizationPercentage}%`,
//       })
//     })

//     return exportRows
//   }, [])

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
//           URLS.GetPlaceofWorkingWiseReports,
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
//           setDrugIndents(data)

//           const exportData = prepareExportData(data)
//           setCsvData(exportData)
//         }
//       } catch (error) {
//         console.error("Error fetching drug indents:", error)
//         toast.error("Failed to fetch drug indents")
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [token, filters, selectedFinancialYearId, prepareExportData]
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
//       }
//     } else if (name === "mandalId") {
//       setFilters(prev => ({
//         ...prev,
//         mandalId: value,
//       }))
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
//       districtId: "",
//       mandalId: "",
//       schemeId: "",
//       quarterId: "",
//     }

//     setFilters(resetFilters)
//     setFilteredMandals([])

//     localStorage.removeItem("institutionTypeId")
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
//         "PLACE OF WORKING BUDGET UTILIZATION REPORT",
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
//       const generatedText = `Generated On: ${currentDate}`
//       const textWidth = doc.getTextWidth(generatedText)
//       doc.text(generatedText, rightMargin - textWidth, 30)

//       let startY = 40

//       const tableData = drugIndents.map((item, index) => [
//         (index + 1).toString(),
//         item.districtName || "-",
//         item.mandalName || "-",
//         item.townName || "-",
//         item.workingPlaceName || "-",
//         formatNumber(item.totalBudget, 2),
//         formatNumber(item.totalBooked, 2),
//         formatNumber(item.totalAvailable, 2),
//         `${item.utilizationPercentage}%`,
//       ])

//       autoTable(doc, {
//         startY: startY,
//         head: [
//           [
//             "No.",
//             "District",
//             "Mandal",
//             "Village",
//             "Place of Working",
//             "Budget",
//             "Booked Budget",
//             "Available Budget",
//             "Utilization Percentage",
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
//         },
//         columnStyles: {
//           0: { halign: "center", cellWidth: 20 },
//           1: { cellWidth: 40 },
//           2: { cellWidth: 40 },
//           3: { cellWidth: 40 },
//           4: { cellWidth: 50 },
//           5: { halign: "right", cellWidth: 30 },
//           6: { halign: "right", cellWidth: 30 },
//           7: { halign: "right", cellWidth: 30 },
//           8: { halign: "center", cellWidth: 30 },
//         },
//         margin: { left: leftMargin, right: 15 },
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

//       const fileName = `Place_of_Working_Report_${financialYearText.replace(
//         /\s+/g,
//         "_"
//       )}_${new Date().toISOString().split("T")[0]}.pdf`
//       doc.save(fileName)

//       toast.success("PDF generated successfully!")
//     } catch (error) {
//       console.error("Error generating PDF:", error)
//       toast.error("Failed to generate PDF")
//     }
//   }

//   const csvReport = {
//     filename: `Place_of_Working_Report_${
//       new Date().toISOString().split("T")[0]
//     }.csv`,
//     data: csvData,
//     headers: [
//       { label: "No.", key: "No." },
//       { label: "District", key: "District" },
//       { label: "Mandal", key: "Mandal" },
//       { label: "Village", key: "Village" },
//       { label: "Place of Working", key: "Place of Working" },
//       { label: "Budget", key: "Budget" },
//       { label: "Booked Budget", key: "Booked Budget" },
//       { label: "Available Budget", key: "Available Budget" },
//       { label: "Utilization Percentage", key: "Utilization Percentage" },
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

//   const filteredData = useMemo(() => {
//     if (!searchTerm) return drugIndents

//     return drugIndents.filter(
//       item =>
//         item.workingPlaceName
//           ?.toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         item.districtName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.mandalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.townName?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   }, [drugIndents, searchTerm])

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
//                     disabled={filteredData.length === 0}
//                   >
//                     <i className="bx bxs-file-pdf me-1"></i>
//                     Export to PDF
//                   </Button>
//                   <CSVLink
//                     {...csvReport}
//                     className="btn btn-success me-2"
//                     disabled={filteredData.length === 0}
//                   >
//                     <i className="bx bx-file me-1"></i>
//                     Export to Excel
//                   </CSVLink>
//                   <div style={{ maxWidth: "300px" }}>
//                     <Input
//                       type="search"
//                       placeholder="Search place of working..."
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
//                 PLACE OF WORKING BUDGET UTILIZATION REPORT
//               </h2>
//               <h4 className="text-muted">
//                 DURING THE FINANCIAL YEAR {getCurrentFinancialYearText()}
//               </h4>
//             </div>
//             <div className="table-responsive">
//               {filteredData.length === 0 ? (
//                 <div className="text-center py-5">
//                   <p className="text-muted">No data found</p>
//                 </div>
//               ) : (
//                 <Table hover className="table table-bordered mb-0">
//                   <thead className="table-light">
//                     <tr className="text-center">
//                       <th>No.</th>
//                       <th>District</th>
//                       <th>Mandal</th>
//                       <th>Village</th>
//                       <th>Place of Working</th>
//                       <th>Budget</th>
//                       <th>Booked Budget</th>
//                       <th>Available Budget</th>
//                       <th>Utilization Percentage</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.map((item, index) => (
//                       <tr key={item._id || index} className="text-center">
//                         <td className="text-center fw-bold">{index + 1}</td>
//                         <td>{item.districtName || "-"}</td>
//                         <td>{item.mandalName || "-"}</td>
//                         <td>{item.townName || "-"}</td>
//                         <td>{item.workingPlaceName || "-"}</td>
//                         <td className="text-end">
//                           {formatNumber(item.totalBudget, 2)}
//                         </td>
//                         <td className="text-end">
//                           {formatNumber(item.totalBooked, 2)}
//                         </td>
//                         <td className="text-end">
//                           {formatNumber(item.totalAvailable, 2)}
//                         </td>
//                         <td>{`${item.utilizationPercentage}%`}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               )}
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
import autoTable from "jspdf-autotable"
import { CSVLink } from "react-csv"
import Select from "react-select"
import { URLS } from "../../Url"
import jsPDF from "jspdf"
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

const GroupsReport = () => {
  const [drugIndents, setDrugIndents] = useState([])
  const [employmentType, setEmploymentType] = useState([])
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

  const [filters, setFilters] = useState({
    institutionTypeId: "",
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

  // Ref to track initial mount
  const isInitialMount = useRef(true)

  const formatNumber = (num, decimals = 2) => {
    const number = parseFloat(num || 0)
    return isNaN(number) ? "0.00" : number.toFixed(decimals)
  }

  // Calculate totals from filteredData
  const calculateTotals = useCallback((data) => {
    return data.reduce(
      (acc, item) => {
        return {
          totalBudget: acc.totalBudget + (parseFloat(item.totalBudget) || 0),
          totalBooked: acc.totalBooked + (parseFloat(item.totalBooked) || 0),
          totalAvailable: acc.totalAvailable + (parseFloat(item.totalAvailable) || 0),
        }
      },
      { totalBudget: 0, totalBooked: 0, totalAvailable: 0 }
    )
  }, [])

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

  const prepareExportData = useCallback(data => {
    const exportRows = []
    
    // Add data rows
    data.forEach((item, index) => {
      exportRows.push({
        "No.": index + 1,
        District: item.districtName || "-",
        Mandal: item.mandalName || "-",
        Village: item.townName || "-",
        "Place of Working": item.workingPlaceName || "-",
        Budget: formatNumber(item.totalBudget, 2),
        "Booked Budget": formatNumber(item.totalBooked, 2),
        "Available Budget": formatNumber(item.totalAvailable, 2),
        "Utilization Percentage": `${item.utilizationPercentage}%`,
      })
    })

    // Calculate totals for export
    const totals = data.reduce(
      (acc, item) => {
        return {
          totalBudget: acc.totalBudget + (parseFloat(item.totalBudget) || 0),
          totalBooked: acc.totalBooked + (parseFloat(item.totalBooked) || 0),
          totalAvailable: acc.totalAvailable + (parseFloat(item.totalAvailable) || 0),
        }
      },
      { totalBudget: 0, totalBooked: 0, totalAvailable: 0 }
    )

    // Add total row
    if (data.length > 0) {
      exportRows.push({
        "No.": "",
        District: "TOTAL",
        Mandal: "",
        Village: "",
        "Place of Working": "",
        Budget: formatNumber(totals.totalBudget, 2),
        "Booked Budget": formatNumber(totals.totalBooked, 2),
        "Available Budget": formatNumber(totals.totalAvailable, 2),
        "Utilization Percentage": totals.totalBudget > 0 
          ? `${((totals.totalBooked / totals.totalBudget) * 100).toFixed(2)}%`
          : "-",
      })
    }

    return exportRows
  }, [])

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
          URLS.GetPlaceofWorkingWiseReports,
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
          setDrugIndents(data)

          const exportData = prepareExportData(data)
          setCsvData(exportData)
        }
      } catch (error) {
        console.error("Error fetching drug indents:", error)
        toast.error("Failed to fetch drug indents")
      } finally {
        setIsDataLoading(false)
      }
    },
    [token, filters, selectedFinancialYearId, prepareExportData]
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
      }
    } else if (name === "mandalId") {
      setFilters(prev => ({
        ...prev,
        mandalId: value,
      }))
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
    setDrugIndents([])
    setCsvData([])

    localStorage.removeItem("institutionTypeId")
    localStorage.removeItem("schemeId")
    localStorage.removeItem("quarterId")
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

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

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 128)
      doc.setFont(undefined, "bold")
      doc.text(
        "PLACE OF WORKING BUDGET UTILIZATION REPORT",
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
      const generatedText = `Generated On: ${currentDate}`
      const textWidth = doc.getTextWidth(generatedText)
      doc.text(generatedText, rightMargin - textWidth, 30)

      let startY = 40

      const tableData = drugIndents.map((item, index) => [
        (index + 1).toString(),
        item.districtName || "-",
        item.mandalName || "-",
        item.townName || "-",
        item.workingPlaceName || "-",
        formatNumber(item.totalBudget, 2),
        formatNumber(item.totalBooked, 2),
        formatNumber(item.totalAvailable, 2),
        `${item.utilizationPercentage}%`,
      ])

      // Calculate totals for PDF
      const totals = calculateTotals(drugIndents)
      
      // Add total row to table data
      const totalRow = [
        "",
        "TOTAL",
        "",
        "",
        "",
        formatNumber(totals.totalBudget, 2),
        formatNumber(totals.totalBooked, 2),
        formatNumber(totals.totalAvailable, 2),
        totals.totalBudget > 0 
          ? `${((totals.totalBooked / totals.totalBudget) * 100).toFixed(2)}%`
          : "-",
      ]

      const allTableData = [...tableData, totalRow]

      autoTable(doc, {
        startY: startY,
        head: [
          [
            "No.",
            "District",
            "Mandal",
            "Village",
            "Place of Working",
            "Budget",
            "Booked Budget",
            "Available Budget",
            "Utilization Percentage",
          ],
        ],
        body: allTableData,
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
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 20 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
          4: { cellWidth: 50 },
          5: { halign: "right", cellWidth: 30 },
          6: { halign: "right", cellWidth: 30 },
          7: { halign: "right", cellWidth: 30 },
          8: { halign: "center", cellWidth: 30 },
        },
        margin: { left: leftMargin, right: 15 },
        didDrawCell: function (data) {
          // Style the total row
          if (data.row.index === allTableData.length - 1) {
            doc.setFillColor(248, 249, 250)
            doc.rect(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              "F"
            )
            doc.setTextColor(0, 0, 0)
            doc.setFont(undefined, "bold")
          }
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

      const fileName = `Place_of_Working_Report_${financialYearText.replace(
        /\s+/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)

      toast.success("PDF generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
    }
  }

  const csvReport = {
    filename: `Place_of_Working_Report_${
      new Date().toISOString().split("T")[0]
    }.csv`,
    data: csvData,
    headers: [
      { label: "No.", key: "No." },
      { label: "District", key: "District" },
      { label: "Mandal", key: "Mandal" },
      { label: "Village", key: "Village" },
      { label: "Place of Working", key: "Place of Working" },
      { label: "Budget", key: "Budget" },
      { label: "Booked Budget", key: "Booked Budget" },
      { label: "Available Budget", key: "Available Budget" },
      { label: "Utilization Percentage", key: "Utilization Percentage" },
    ],
  }

  const getCurrentFinancialYearText = () => {
    if (!selectedFinancialYearId || financialYears.length === 0) return "N/A"

    const currentYear = financialYears.find(
      year => year._id === selectedFinancialYearId
    )
    return currentYear ? currentYear.year : "N/A"
  }

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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      // Only fetch schemes and quarters on initial mount if financial year is selected
      if (selectedFinancialYearId) {
        fetchSchemesAndQuarters(selectedFinancialYearId)
      }
      return
    }

    if (selectedFinancialYearId) {
      fetchSchemesAndQuarters(selectedFinancialYearId)
    }
  }, [selectedFinancialYearId, fetchSchemesAndQuarters])

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

  const filteredData = useMemo(() => {
    if (!searchTerm) return drugIndents

    return drugIndents.filter(
      item =>
        item.workingPlaceName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.districtName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mandalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.townName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [drugIndents, searchTerm])

  // Calculate totals for the table
  const totals = useMemo(() => {
    return calculateTotals(filteredData)
  }, [filteredData, calculateTotals])

  // Calculate total utilization percentage
  const totalUtilizationPercentage = useMemo(() => {
    if (totals.totalBudget > 0) {
      return ((totals.totalBooked / totals.totalBudget) * 100).toFixed(2)
    }
    return "0.00"
  }, [totals])

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

  return (
    <div className="page-content">
      <div className="container-fluid">
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
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md={12}>
                <div className="d-flex justify-content-end align-items-center">
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
                      pointerEvents: drugIndents.length === 0 ? "none" : "auto",
                      opacity: drugIndents.length === 0 ? 0.65 : 1,
                      textDecoration: "none",
                    }}
                  >
                    <i className="bx bx-file me-1"></i>
                    Export to Excel
                  </CSVLink>
                  <div style={{ maxWidth: "300px" }}>
                    <Input
                      type="search"
                      placeholder="Search place of working..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="form-control"
                      disabled={isDataLoading}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Loading State for Data */}
            {isDataLoading ? (
              <div className="text-center py-5">
                <Spinner
                  color="primary"
                  style={{ width: "3rem", height: "3rem" }}
                />
                <p className="mt-3">Loading report data...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-2">
                  <h2 className="text-primary mb-2">
                    PLACE OF WORKING BUDGET UTILIZATION REPORT
                  </h2>
                  <h4 className="text-muted">
                    DURING THE FINANCIAL YEAR {getCurrentFinancialYearText()}
                  </h4>
                </div>
                <div className="table-responsive">
                  {filteredData.length === 0 ? (
                    <div className="text-center py-5">
                      {drugIndents.length === 0 ? (
                        <>
                          <i
                            className="bx bx-search-alt bx-lg d-block mb-3"
                            style={{
                              fontSize: "4rem",
                              color: "#6c757d",
                            }}
                          ></i>
                          <h5>No Data Available</h5>
                          <p className="text-muted">
                            Please select filters and click "Search" to generate the report
                          </p>
                        </>
                      ) : (
                        <p className="text-muted">No matching records found</p>
                      )}
                    </div>
                  ) : (
                    <Table hover className="table table-bordered mb-0">
                      <thead className="table-light">
                        <tr className="text-center">
                          <th>No.</th>
                          <th>District</th>
                          <th>Mandal</th>
                          <th>Village</th>
                          <th>Place of Working</th>
                          <th>Budget</th>
                          <th>Booked Budget</th>
                          <th>Available Budget</th>
                          <th>Utilization Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={item._id || index} className="text-center">
                            <td className="text-center fw-bold">{index + 1}</td>
                            <td>{item.districtName || "-"}</td>
                            <td>{item.mandalName || "-"}</td>
                            <td>{item.townName || "-"}</td>
                            <td>{item.workingPlaceName || "-"}</td>
                            <td className="text-end">
                              {formatNumber(item.totalBudget, 2)}
                            </td>
                            <td className="text-end">
                              {formatNumber(item.totalBooked, 2)}
                            </td>
                            <td className="text-end">
                              {formatNumber(item.totalAvailable, 2)}
                            </td>
                            <td>{`${item.utilizationPercentage}%`}</td>
                          </tr>
                        ))}
                        
                        {/* Total Row */}
                        {filteredData.length > 0 && (
                          <tr className="text-center bg-light fw-bold">
                            <td colSpan="5" className="text-end">
                              TOTAL
                            </td>
                            <td className="text-end">
                              {formatNumber(totals.totalBudget, 2)}
                            </td>
                            <td className="text-end">
                              {formatNumber(totals.totalBooked, 2)}
                            </td>
                            <td className="text-end">
                              {formatNumber(totals.totalAvailable, 2)}
                            </td>
                            <td>{`${totalUtilizationPercentage}%`}</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
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