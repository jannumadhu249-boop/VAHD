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

// const DrugWiseReport = () => {
//   const [drugConsumptions, setDrugConsumptions] = useState([])
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
//   const [count, setCount] = useState(0)
//   const [grandTotal, setGrandTotal] = useState(0)
//   const [Data, setData] = useState(0)

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

//   const fetchDrugConsumptions = useCallback(
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
//           URLS.DrugWiseReports,
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
//           setData(response?.data)
//           setDrugConsumptions(data)
//           setCount(response.data.count || 0)
//           setGrandTotal(response.data.grandTotal || 0)

//           // Prepare CSV data matching table structure
//           const csvRows = []
//           data.forEach((item, index) => {
//             csvRows.push({
//               "No.": index + 1,
//               "Drug Code": item.drugCode || "-",
//               "Trade Name": item.tradeName || "-",
//               "Name of Firm": item.nameOfFirm || "-",
//               "Unit Price": formatNumber(item.unitPrice, 2),
//               GST: item.gst || "-",
//               Qty: item.qty || 0,
//               Total: formatNumber(item.total, 2),
//             })
//           })
//           setCsvData(csvRows)
//         }
//       } catch (error) {
//         console.error("Error fetching drug consumption report:", error)
//         toast.error("Failed to fetch drug consumption report")
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
//       fetchDrugConsumptions(filters, value)
//     }
//   }

//   const handleSearch = () => {
//     if (!selectedFinancialYearId) {
//       toast.error("Please select a financial year")
//       return
//     }
//     fetchDrugConsumptions(filters, selectedFinancialYearId)
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
//       fetchDrugConsumptions(resetFilters, selectedFinancialYearId)
//     }
//   }

//   const toggleFilters = () => {
//     setShowFilters(!showFilters)
//   }

//   const generatePDF = () => {
//     if (drugConsumptions.length === 0) {
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
//       doc.text("DRUG CONSUMPTION REPORT", pageWidth / 2, 15, {
//         align: "center",
//       })

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
//       const generatedText = `Generated On: ${currentDate}`
//       const textWidth = doc.getTextWidth(generatedText)
//       doc.text(generatedText, rightMargin - textWidth, 30)

//       let startY = 40

//       // Prepare table data
//       const tableData = drugConsumptions.map((item, index) => [
//         (index + 1).toString(),
//         item.drugCode || "-",
//         item.tradeName || "-",
//         item.nameOfFirm || "-",
//         formatNumber(item.unitPrice, 2),
//         item.gst || "-",
//         item.qty?.toString() || "0",
//         formatNumber(item.total, 2),
//       ])

//       // Calculate totals for summary
//       const totalQty = drugConsumptions.reduce(
//         (sum, item) => sum + (parseFloat(item.qty) || 0),
//         0
//       )

//       // Create table
//       autoTable(doc, {
//         startY: startY,
//         head: [
//           [
//             {
//               content: "No.",
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
//               content: "Name of Firm",
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
//               content: "Qty",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Total",
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
//           0: { cellWidth: "auto", halign: "center" }, // No.
//           1: { cellWidth: "auto", halign: "left" }, // Drug Code
//           2: { cellWidth: "auto", halign: "left" }, // Trade Name
//           3: { cellWidth: "auto", halign: "left" }, // Name of Firm
//           4: { cellWidth: "auto", halign: "right" }, // Unit Price
//           5: { cellWidth: "auto", halign: "center" }, // GST
//           6: { cellWidth: "auto", halign: "center" }, // Qty
//           7: { cellWidth: "auto", halign: "right" }, // Total
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

//       const summaryText = `Total Records: ${count} | Total Quantity: ${totalQty} | Grand Total: ${formatNumber(
//         grandTotal
//       )}`
//       doc.text(summaryText, leftMargin + 5, startY + 5)

//       // Save PDF
//       const fileName = `Drug_Consumption_Report_${financialYearText}_${
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
//     filename: `Drug_Consumption_Report_${
//       new Date().toISOString().split("T")[0]
//     }.csv`,
//     data: csvData,
//     headers: [
//       { label: "No.", key: "No." },
//       { label: "Drug Code", key: "Drug Code" },
//       { label: "Trade Name", key: "Trade Name" },
//       { label: "Name of Firm", key: "Name of Firm" },
//       { label: "Unit Price", key: "Unit Price" },
//       { label: "GST", key: "GST" },
//       { label: "Qty", key: "Qty" },
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
//       fetchDrugConsumptions(filters, selectedFinancialYearId)
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

//   if (isLoading && !showFilters) {
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
//                     disabled={drugConsumptions.length === 0}
//                   >
//                     <i className="bx bxs-file-pdf me-1"></i>
//                     Export to PDF
//                   </Button>
//                   <CSVLink
//                     {...csvReport}
//                     className="btn btn-success me-2"
//                     disabled={drugConsumptions.length === 0}
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
//               <h2 className="text-primary mb-2">DRUG CONSUMPTION REPORT</h2>
//               <h4 className="text-muted">
//                 DURING THE FINANCIAL YEAR {getCurrentFinancialYearText()}
//               </h4>
//               <div className="d-flex justify-content-between mt-3">
//                 <div className="text-start">
//                   <p className="mb-1">
//                     <strong>Generated On:</strong>{" "}
//                     {new Date().toLocaleDateString("en-IN", {
//                       day: "numeric",
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </p>
//                 </div>
//                 <div className="text-start">
//                   <p className="mb-1">
//                     <strong>District Name :</strong> {Data.districtname}
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
//                         <th>Drug Code</th>
//                         <th>Trade Name</th>
//                         <th>Unit Pack</th>
//                         <th>Qty</th>
//                         <th>Base Price</th>
//                         <th>GST</th>
//                         <th>Total Price</th>
//                         <th>Name of Firm</th>
//                         <th>Name of Stockiest</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {drugConsumptions.length > 0 ? (
//                         drugConsumptions.map((item, index) => (
//                           <tr key={item._id || index} className="text-center">
//                             <td className="text-center fw-bold">{index + 1}</td>
//                             <td>{item.drugCode.slice(0,7) || "-"}</td>
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
//                           <td colSpan="8" className="text-center py-4">
//                             No data found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </Table>
//                 </div>
//                 {drugConsumptions.length > 0 && (
//                   <div className="d-flex justify-content-between mt-4">
//                     <div>
//                       <p className="mb-0">
//                         <strong>Total Records:</strong> {count}
//                       </p>
//                     </div>
//                     <div className="text-end">
//                       <p className="mb-0">
//                         <strong>Total Quantity:</strong> {Data.count}
//                       </p>
//                       <p className="mb-0">
//                         <strong>Grand Total:</strong> {Data.grandTotal}
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

// export default DrugWiseReport




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

const DrugWiseReport = () => {
  const [drugConsumptions, setDrugConsumptions] = useState([])
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
  const [count, setCount] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [Data, setData] = useState({})

  // Ref to track initial mount
  const isInitialMount = useRef(true)

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

  const fetchDrugConsumptions = useCallback(
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
          URLS.DrugWiseReports,
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
          setData(response?.data || {})
          setDrugConsumptions(data)
          setCount(response.data.count || 0)
          setGrandTotal(response.data.grandTotal || 0)

          // Prepare CSV data matching table structure
          const csvRows = []
          data.forEach((item, index) => {
            csvRows.push({
              "No.": index + 1,
              "Drug Code": item.drugCode || "-",
              "Trade Name": item.tradeName || "-",
              "Name of Firm": item.nameOfFirm || "-",
              "Unit Pack": item.unitPack || "-",
              "Qty": item.qty || 0,
              "Unit Price": formatNumber(item.unitPrice, 2),
              "GST": item.gst || "-",
              "Total Price": formatNumber(item.total, 2),
              "Name of Stockiest": item.nameOfStockiest || "-",
            })
          })
          setCsvData(csvRows)
        }
      } catch (error) {
        console.error("Error fetching drug consumption report:", error)
        toast.error("Failed to fetch drug consumption report")
      } finally {
        setIsDataLoading(false)
      }
    },
    [token, filters, selectedFinancialYearId]
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
    fetchDrugConsumptions(filters, selectedFinancialYearId)
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
    setDrugConsumptions([])
    setCsvData([])
    setData({})
    setCount(0)
    setGrandTotal(0)

    localStorage.removeItem("institutionTypeId")
    localStorage.removeItem("schemeId")
    localStorage.removeItem("quarterId")
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const generatePDF = () => {
    if (drugConsumptions.length === 0) {
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
      const marginLeft = 12
      const marginRight = 12
      const headingText = getReportHeadingText()

      // Calculate available width for table
      const availableWidth = pageWidth - marginLeft - marginRight

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
      const generatedText = `Generated On: ${currentDate}`
      const textWidth = doc.getTextWidth(generatedText)
      doc.text(generatedText, pageWidth - marginRight - textWidth, 30)

      let startY = 40

      // Prepare table data
      const tableData = drugConsumptions.map((item, index) => [
        (index + 1).toString(),
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

      // Define column width percentages (must add up to 100)
      const columnPercentages = [5, 18, 13, 8, 6, 8, 5, 9, 14, 14]
      const columnWidths = columnPercentages.map(
        pct => (availableWidth * pct) / 100
      )

      // Create table with proportional column widths
      autoTable(doc, {
        startY: startY,
        head: [
          [
            {
              content: "No.",
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
              content: "Total Price",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Name of Firm",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Name of Stockiest",
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
          0: { cellWidth: columnWidths[0], halign: "center" },
          1: { cellWidth: columnWidths[1], halign: "left" },
          2: { cellWidth: columnWidths[2], halign: "left" },
          3: { cellWidth: columnWidths[3], halign: "center" },
          4: { cellWidth: columnWidths[4], halign: "center" },
          5: { cellWidth: columnWidths[5], halign: "right" },
          6: { cellWidth: columnWidths[6], halign: "center" },
          7: { cellWidth: columnWidths[7], halign: "right" },
          8: { cellWidth: columnWidths[8], halign: "left" },
          9: { cellWidth: columnWidths[9], halign: "left" },
        },
        margin: { left: marginLeft, right: marginRight },
        tableWidth: "wrap",
        styles: {
          cellPadding: 2,
          fontSize: 8,
          valign: "middle",
          overflow: "linebreak",
        },
        didDrawPage: function (data) {
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
      doc.rect(marginLeft, startY, availableWidth, 8, "F")

      const summaryText = `Total Records: ${count} | Grand Total: ${formatNumber(
        grandTotal
      )}`
      doc.text(summaryText, marginLeft + 5, startY + 5)

      // Save PDF
      const fileName = `Drug_Consumption_Report_${financialYearText}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
      doc.save(fileName)

      toast.success("PDF generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
    }
  }

  const csvReport = {
    filename: `Drug_Consumption_Report_${
      new Date().toISOString().split("T")[0]
    }.csv`,
    data: csvData,
    headers: [
      { label: "No.", key: "No." },
      { label: "Drug Code", key: "Drug Code" },
      { label: "Trade Name", key: "Trade Name" },
      { label: "Name of Firm", key: "Name of Firm" },
      { label: "Unit Pack", key: "Unit Pack" },
      { label: "Qty", key: "Qty" },
      { label: "Unit Price", key: "Unit Price" },
      { label: "GST", key: "GST" },
      { label: "Total Price", key: "Total Price" },
      { label: "Name of Stockiest", key: "Name of Stockiest" },
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

  // Filtered data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return drugConsumptions

    return drugConsumptions.filter(
      item =>
        (item.drugCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tradeName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.nameOfFirm || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.nameOfStockiest || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
  }, [drugConsumptions, searchTerm])

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
                    disabled={drugConsumptions.length === 0}
                  >
                    <i className="bx bxs-file-pdf me-1"></i>
                    Export to PDF
                  </Button>
                  <CSVLink
                    {...csvReport}
                    className="btn btn-success me-2"
                    style={{
                      pointerEvents:
                        drugConsumptions.length === 0 ? "none" : "auto",
                      opacity: drugConsumptions.length === 0 ? 0.65 : 1,
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
              </Col>
            </Row>

            {/* Loading State for Data */}
            {isDataLoading ? (
              <div className="text-center py-5">
                <Spinner
                  color="primary"
                  style={{ width: "3rem", height: "3rem" }}
                />
                <p className="mt-3">Loading drug consumption data...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-2">
                  <h3 className="text-primary mb-2">{getReportHeadingText()}</h3>
                  <h4 className="text-muted">
                    DURING THE FINANCIAL YEAR {getCurrentFinancialYearText()}
                  </h4>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="text-start">
                      <p className="mb-1">
                        <strong>Generated On:</strong>{" "}
                        {new Date().toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-start">
                      <p className="mb-1">
                        <strong>District Name:</strong>{" "}
                        {Data.districtname || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <React.Fragment>
                    <div className="mb-3 p-1">
                      <Table hover className="table table-bordered mb-4">
                        <thead>
                          <tr className="text-center">
                            <th>No.</th>
                            <th>Drug Code</th>
                            <th>Trade Name</th>
                            <th>Unit Pack</th>
                            <th>Qty</th>
                            <th>Base Price</th>
                            <th>GST</th>
                            <th>Total Price</th>
                            <th>Name of Firm</th>
                            <th>Name of Stockiest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                              <tr key={item._id || index} className="text-center">
                                <td className="text-center fw-bold">
                                  {index + 1}
                                </td>
                                <td>{(item.drugCode || "-").slice(0, 7)}</td>
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
                              <td colSpan="10" className="text-center py-4">
                                {drugConsumptions.length === 0 ? (
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
                                      Please select filters and click "Search" to
                                      generate the report
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-muted">
                                    No matching records found
                                  </p>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    {filteredData.length > 0 && (
                      <div className="d-flex justify-content-between mt-4">
                        <div>
                          <p className="mb-0">
                            <strong>Total Records:</strong> {count}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="mb-0">
                            <strong>Grand Total:</strong>{" "}
                            {formatNumber(grandTotal)}
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

export default DrugWiseReport
