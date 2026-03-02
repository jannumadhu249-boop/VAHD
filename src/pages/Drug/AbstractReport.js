// import React, { useState, useEffect, useCallback, useMemo } from "react"
// import "react-toastify/dist/ReactToastify.css"
// import { toast } from "react-toastify"
// import { CSVLink } from "react-csv"
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
//   Spinner,
// } from "reactstrap"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"

// const AbstractReport = () => {
//   const [abstractData, setAbstractData] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [csvData, setCsvData] = useState([])

//   const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//   const token = authUser?.token

//   // Format number utility functions
//   const formatNumber = (num, decimals = 0) => {
//     const number = parseFloat(num)
//     if (isNaN(number)) return "0"
//     if (decimals === 0) return Math.round(number).toString()
//     return number.toFixed(decimals)
//   }

//   const formatPercentage = (num, decimals = 2) => {
//     const number = parseFloat(num)
//     return isNaN(number) ? "0.00" : number.toFixed(decimals)
//   }

//   // Calculate overall percentage
//   const calculateOverallPercentage = useCallback(() => {
//     if (abstractData.length === 0) return "0.00"

//     const totalIndents = abstractData.reduce(
//       (sum, item) => sum + (parseFloat(item.indentPlaced) || 0),
//       0
//     )

//     const totalInstitutions = abstractData.reduce(
//       (sum, item) => sum + (parseFloat(item.totalInstitutions) || 0),
//       0
//     )

//     if (totalInstitutions === 0) return "0.00"

//     const percentage = (totalIndents / totalInstitutions) * 100
//     return formatPercentage(percentage)
//   }, [abstractData])

//   // Get current financial year
//   const getCurrentFinancialYearText = () => {
//     const currentDate = new Date()
//     const currentYear = currentDate.getFullYear()
//     const currentMonth = currentDate.getMonth() + 1

//     if (currentMonth >= 4) {
//       return `${currentYear}-${(currentYear + 1).toString().slice(2)}`
//     } else {
//       return `${currentYear - 1}-${currentYear.toString().slice(2)}`
//     }
//   }

//   // Fetch abstract report data
//   const fetchAbstractReport = useCallback(async () => {
//     try {
//       setIsLoading(true)

//       const response = await axios.post(
//         URLS.GetAbstractReport,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )

//       if (response.data && response.data.success !== false) {
//         const data = response?.data?.data || []

//         // Transform data to match your table structure
//         const transformedData = data.map((item, index) => ({
//           ...item,
//           id: item._id || `row-${index}`,
//           SSVH: item.SSVH || item.ssvh || 0,
//           DVH: item.DVH || item.dvh || 0,
//           AVH: item.AVH || item.avh || 0,
//           PVC: item.PVC || item.pvc || 0,
//           SCAH: item.SCAH || item.scah || 0,
//           totalInstitutions: item.totalInstitutions || item.total || 0,
//           iSSVH: item.iSSVH || item.totalIndents?.ssvh || 0,
//           iDVH: item.iDVH || item.totalIndents?.dvh || 0,
//           iAVH: item.iAVH || item.totalIndents?.avh || 0,
//           iPVC: item.iPVC || item.totalIndents?.pvc || 0,
//           iSCAH: item.iSCAH || item.totalIndents?.scah || 0,
//           indentPlaced: item.indentPlaced || item.totalIndents?.total || 0,
//           budget: item.budget || 0,
//           booked: item.booked || 0,
//           availableBudget: item.availableBudget || 0,
//           percentIndents: item.percentIndents || item.percentage || 0,
//           district: item.district || "-",
//         }))

//         setAbstractData(transformedData)

//         // Prepare CSV data
//         const csvRows = transformedData.map((item, index) => ({
//           "SI. No": index + 1,
//           District: item.district || "-",
//           "SSVH Institutions": formatNumber(item.SSVH),
//           "DVH Institutions": formatNumber(item.DVH),
//           "AVH Institutions": formatNumber(item.AVH),
//           "PVC Institutions": formatNumber(item.PVC),
//           "SC(AH) Institutions": formatNumber(item.SCAH),
//           "Total Institutions": formatNumber(item.totalInstitutions),
//           "SSVH Indents": formatNumber(item.iSSVH),
//           "DVH Indents": formatNumber(item.iDVH),
//           "AVH Indents": formatNumber(item.iAVH),
//           "PVC Indents": formatNumber(item.iPVC),
//           "SC(AH) Indents": formatNumber(item.iSCAH),
//           "Total Indents": formatNumber(item.indentPlaced),
//           Budget: formatNumber(item.budget, 2),
//           Booked: formatNumber(item.booked, 2),
//           "Available Budget": formatNumber(item.availableBudget, 2),
//           "% of Indents": `${formatPercentage(item.percentIndents)}%`,
//         }))

//         setCsvData(csvRows)
//       } else {
//         throw new Error(response.data?.message || "Failed to fetch data")
//       }
//     } catch (error) {
//       console.error("Error fetching abstract report:", error)
//       toast.error(error.message || "Failed to fetch abstract report")
//       setAbstractData([])
//       setCsvData([])
//     } finally {
//       setIsLoading(false)
//     }
//   }, [token])

//   // Generate PDF
//   const generatePDF = useCallback(() => {
//     if (abstractData.length === 0) {
//       toast.warning("No data to export to PDF")
//       return
//     }

//     try {
//       const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a4",
//       })

//       const currentDate = new Date()
//       const formattedDate = currentDate.toLocaleDateString("en-IN", {
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
//       doc.setFont("helvetica", "bold")
//       doc.text(
//         "ABSTRACT SHOWING DRUG INDENT DONE IN DNS SOFTWARE",
//         pageWidth / 2,
//         15,
//         { align: "center" }
//       )

//       doc.setFontSize(12)
//       doc.setTextColor(0, 0, 0)
//       doc.text(`AS ON ${formattedDate.toUpperCase()}`, pageWidth / 2, 22, {
//         align: "center",
//       })

//       // Sub-header
//       doc.setFontSize(10)
//       doc.setFont("helvetica", "normal")
//       const generatedText = `Generated On: ${formattedDate}`
//       const textWidth = doc.getTextWidth(generatedText)
//       doc.text(generatedText, rightMargin - textWidth, 30)

//       let startY = 40

//       // Prepare table data
//       const tableData = abstractData.map((item, index) => [
//         (index + 1).toString(),
//         item.district || "-",
//         formatNumber(item.SSVH),
//         formatNumber(item.DVH),
//         formatNumber(item.AVH),
//         formatNumber(item.PVC),
//         formatNumber(item.SCAH),
//         formatNumber(item.totalInstitutions),
//         formatNumber(item.iSSVH),
//         formatNumber(item.iDVH),
//         formatNumber(item.iAVH),
//         formatNumber(item.iPVC),
//         formatNumber(item.iSCAH),
//         formatNumber(item.indentPlaced),
//         formatNumber(item.budget, 2),
//         formatNumber(item.booked, 2),
//         formatNumber(item.availableBudget, 2),
//         `${formatPercentage(item.percentIndents)}%`,
//       ])

//       // Create table with complex header
//       autoTable(doc, {
//         startY: startY,
//         head: [
//           [
//             {
//               content: "SI. No",
//               rowSpan: 2,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "District",
//               rowSpan: 2,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Total No of Institutions",
//               colSpan: 6,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Total No of Institutions indents",
//               colSpan: 6,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Budget",
//               rowSpan: 2,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Booked",
//               rowSpan: 2,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Available",
//               rowSpan: 2,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "% of Indents",
//               rowSpan: 2,
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//           ],
//           [
//             // Sub-headers for Total No of Institutions
//             {
//               content: "SSVH",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "DVH",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "AVH",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "PVC",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "SC(AH)",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "Total",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             // Sub-headers for Total No of Institutions indents
//             {
//               content: "SSVH",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "DVH",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "AVH",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "PVC",
//               styles: { halign: "center", fillColor: [41, 128, 185] },
//             },
//             {
//               content: "SC(AH)",
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
//           fontSize: 8,
//           halign: "center",
//         },
//         bodyStyles: {
//           fontSize: 7,
//           cellPadding: 2,
//           overflow: "linebreak",
//         },
//         columnStyles: {
//           0: { cellWidth: 12, halign: "center" }, // SI. No
//           1: { cellWidth: 25, halign: "left" }, // District
//           2: { cellWidth: 12, halign: "center" }, // SSVH Institutions
//           3: { cellWidth: 12, halign: "center" }, // DVH Institutions
//           4: { cellWidth: 12, halign: "center" }, // AVH Institutions
//           5: { cellWidth: 12, halign: "center" }, // PVC Institutions
//           6: { cellWidth: 15, halign: "center" }, // SC(AH) Institutions
//           7: { cellWidth: 12, halign: "center" }, // Total Institutions
//           8: { cellWidth: 12, halign: "center" }, // SSVH Indents
//           9: { cellWidth: 12, halign: "center" }, // DVH Indents
//           10: { cellWidth: 12, halign: "center" }, // AVH Indents
//           11: { cellWidth: 12, halign: "center" }, // PVC Indents
//           12: { cellWidth: 15, halign: "center" }, // SC(AH) Indents
//           13: { cellWidth: 12, halign: "center" }, // Total Indents
//           14: { cellWidth: 20, halign: "center" }, // Budget
//           15: { cellWidth: 20, halign: "center" }, // Booked
//           16: { cellWidth: 20, halign: "center" }, // Available
//           17: { cellWidth: 15, halign: "center" }, // % of Indents
//         },
//         margin: { left: leftMargin, right: 15 },
//         didDrawPage: function (data) {
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

//       // Save PDF
//       const fileName = `Abstract_Report_${financialYearText}_${
//         currentDate.toISOString().split("T")[0]
//       }.pdf`
//       doc.save(fileName)

//       toast.success("PDF generated successfully!")
//     } catch (error) {
//       console.error("Error generating PDF:", error)
//       toast.error("Failed to generate PDF")
//     }
//   }, [abstractData])

//   // CSV report configuration
//   const csvReport = useMemo(
//     () => ({
//       filename: `Abstract_Report_${new Date().toISOString().split("T")[0]}.csv`,
//       data: csvData,
//       headers: [
//         { label: "SI. No", key: "SI. No" },
//         { label: "District", key: "District" },
//         { label: "SSVH Institutions", key: "SSVH Institutions" },
//         { label: "DVH Institutions", key: "DVH Institutions" },
//         { label: "AVH Institutions", key: "AVH Institutions" },
//         { label: "PVC Institutions", key: "PVC Institutions" },
//         { label: "SC(AH) Institutions", key: "SC(AH) Institutions" },
//         { label: "Total Institutions", key: "Total Institutions" },
//         { label: "SSVH Indents", key: "SSVH Indents" },
//         { label: "DVH Indents", key: "DVH Indents" },
//         { label: "AVH Indents", key: "AVH Indents" },
//         { label: "PVC Indents", key: "PVC Indents" },
//         { label: "SC(AH) Indents", key: "SC(AH) Indents" },
//         { label: "Total Indents", key: "Total Indents" },
//         { label: "Budget", key: "Budget" },
//         { label: "Booked", key: "Booked" },
//         { label: "Available Budget", key: "Available Budget" },
//         { label: "% of Indents", key: "% of Indents" },
//       ],
//     }),
//     [csvData]
//   )

//   // Filter data based on search term
//   const filteredData = useMemo(() => {
//     if (!searchTerm) return abstractData
//     const term = searchTerm.toLowerCase()
//     return abstractData.filter(item =>
//       item.district?.toLowerCase().includes(term)
//     )
//   }, [abstractData, searchTerm])

//   // Fetch data on component mount
//   useEffect(() => {
//     if (token) {
//       fetchAbstractReport()
//     } else {
//       toast.error("Authentication token not found")
//     }
//   }, [fetchAbstractReport, token])

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
//               <p className="mt-2">Loading abstract report data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <Card>
//           <CardBody>
//             <Row className="mb-3">
//               <Col md={12}>
//                 <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
//                   <Button
//                     color="danger"
//                     onClick={generatePDF}
//                     className="me-2"
//                     disabled={abstractData.length === 0}
//                   >
//                     <i className="bx bxs-file-pdf me-1"></i>
//                     Export to PDF
//                   </Button>
//                   <CSVLink
//                     {...csvReport}
//                     className="btn btn-success me-2"
//                     disabled={abstractData.length === 0}
//                   >
//                     <i className="bx bx-file me-1"></i>
//                     Export to Excel
//                   </CSVLink>
//                   <div style={{ minWidth: "250px" }}>
//                     <Input
//                       type="search"
//                       placeholder="Search district..."
//                       value={searchTerm}
//                       onChange={e => setSearchTerm(e.target.value)}
//                       className="form-control"
//                     />
//                   </div>
//                 </div>
//               </Col>
//             </Row>

//             <div className="text-center mb-3">
//               <h2 className="text-primary mb-2">
//                 ABSTRACT SHOWING DRUG INDENT DONE IN DNS SOFTWARE
//               </h2>
//               <h4 className="text-muted">
//                 AS ON{" "}
//                 {new Date()
//                   .toLocaleDateString("en-IN", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })
//                   .toUpperCase()}
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
//                 <div className="text-end">
//                   <p className="mb-1">
//                     <strong>Overall Percentage:</strong>{" "}
//                     {calculateOverallPercentage()}%
//                   </p>
//                   <p className="mb-0">
//                     <strong>Total Records:</strong> {abstractData.length}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="table-responsive">
//               <Table hover className="table-bordered mb-4">
//                 <thead>
//                   <tr className="text-center table-primary">
//                     <th rowSpan="2">SI. No</th>
//                     <th rowSpan="2">District</th>
//                     <th colSpan="6">Total No of Institutions</th>
//                     <th colSpan="6">Total No of Institutions indents</th>
//                     <th rowSpan="2">Budget</th>
//                     <th rowSpan="2">Booked</th>
//                     <th rowSpan="2">Available</th>
//                     <th rowSpan="2">% of Indents</th>
//                   </tr>
//                   <tr className="text-center table-primary">
//                     <th>SSVH</th>
//                     <th>DVH</th>
//                     <th>AVH</th>
//                     <th>PVC</th>
//                     <th>SC(AH)</th>
//                     <th>Total</th>
//                     <th>SSVH</th>
//                     <th>DVH</th>
//                     <th>AVH</th>
//                     <th>PVC</th>
//                     <th>SC(AH)</th>
//                     <th>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr key={item.id || index} className="text-center">
//                         <td className="text-center fw-bold">{index + 1}</td>
//                         <td className="text-start">{item.district || "-"}</td>
//                         <td>{formatNumber(item.SSVH)}</td>
//                         <td>{formatNumber(item.DVH)}</td>
//                         <td>{formatNumber(item.AVH)}</td>
//                         <td>{formatNumber(item.PVC)}</td>
//                         <td>{formatNumber(item.SCAH)}</td>
//                         <td className="fw-bold">
//                           {formatNumber(item.totalInstitutions)}
//                         </td>
//                         <td>{formatNumber(item.iSSVH)}</td>
//                         <td>{formatNumber(item.iDVH)}</td>
//                         <td>{formatNumber(item.iAVH)}</td>
//                         <td>{formatNumber(item.iPVC)}</td>
//                         <td>{formatNumber(item.iSCAH)}</td>
//                         <td className="fw-bold">
//                           {formatNumber(item.indentPlaced)}
//                         </td>
//                         <td className="fw-bold">
//                           {formatNumber(item.budget, 2)}
//                         </td>
//                         <td className="fw-bold">
//                           {formatNumber(item.booked, 2)}
//                         </td>
//                         <td className="fw-bold">
//                           {formatNumber(item.availableBudget, 2)}
//                         </td>
//                         <td className="fw-bold">
//                           {formatPercentage(item.percentIndents)}%
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="18" className="text-center py-4">
//                         {searchTerm
//                           ? "No matching districts found"
//                           : "No data available"}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default AbstractReport



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
  Spinner,
  FormGroup,
  Label,
} from "reactstrap"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const AbstractReport = () => {
  const [abstractData, setAbstractData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false) // For search operation loading
  const [searchTerm, setSearchTerm] = useState("")
  const [csvData, setCsvData] = useState([])
  const [showFilters, setShowFilters] = useState(true) // Show filters by default

  // Filter States - ALL INITIALLY EMPTY
  const [financialYears, setFinancialYears] = useState([])
  const [selectedFinancialYearId, setSelectedFinancialYearId] = useState("") // EMPTY
  const [schemes, setSchemes] = useState([])
  const [quarters, setQuarters] = useState([])
  const [isFiltersLoading, setIsFiltersLoading] = useState(false)
  
  const [filters, setFilters] = useState({
    schemeId: "", // EMPTY
    quarterId: "", // EMPTY
  })

  // Ref to track initial mount
  const isInitialMount = useRef(true)

  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
  const token = authUser?.token

  // Format number utility functions
  const formatNumber = (num, decimals = 0) => {
    const number = parseFloat(num)
    if (isNaN(number)) return "0"
    if (decimals === 0) return Math.round(number).toString()
    return number.toFixed(decimals)
  }

  const formatPercentage = (num, decimals = 2) => {
    const number = parseFloat(num)
    return isNaN(number) ? "0.00" : number.toFixed(decimals)
  }

  // API Functions for Filters
  const fetchFinancialYears = useCallback(async () => {
    if (!token) return

    try {
      setIsLoading(true)
      const response = await axios.post(
        URLS.GetFinancialyear,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.data?.data && response.data.data.length > 0) {
        setFinancialYears(response.data.data)
      }
      return []
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error("Failed to fetch financial years")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const fetchSchemesAndQuarters = useCallback(
    async financialYearId => {
      if (!token || !financialYearId) {
        setSchemes([])
        setQuarters([])
        return
      }

      setIsFiltersLoading(true)

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
      } catch (error) {
        console.error("Unexpected error:", error)
        toast.error("An unexpected error occurred")
      } finally {
        setIsFiltersLoading(false)
      }
    },
    [token]
  )

  // Calculate overall percentage
  const calculateOverallPercentage = useCallback(() => {
    if (abstractData.length === 0) return "0.00"

    const totalIndents = abstractData.reduce(
      (sum, item) => sum + (parseFloat(item.indentPlaced) || 0),
      0
    )

    const totalInstitutions = abstractData.reduce(
      (sum, item) => sum + (parseFloat(item.totalInstitutions) || 0),
      0
    )

    if (totalInstitutions === 0) return "0.00"

    const percentage = (totalIndents / totalInstitutions) * 100
    return formatPercentage(percentage)
  }, [abstractData])

  // Get current financial year
  const getCurrentFinancialYearText = () => {
    if (!selectedFinancialYearId || financialYears.length === 0) return "N/A"
    
    const currentYear = financialYears.find(
      year => year._id === selectedFinancialYearId
    )
    return currentYear ? currentYear.year : "N/A"
  }

  // Fetch abstract report data with filters
  const fetchAbstractReport = useCallback(async (customFilters = null, customFinancialYearId = null) => {
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    const filterParams = customFilters || filters
    const financialYearId = customFinancialYearId || selectedFinancialYearId

    if (!financialYearId) {
      toast.error("Please select a financial year")
      return
    }

    if (!filterParams.schemeId) {
      toast.error("Please select a scheme")
      return
    }

    if (!filterParams.quarterId) {
      toast.error("Please select a quarter")
      return
    }

    try {
      setIsDataLoading(true)

      const response = await axios.post(
        URLS.GetAbstractReport,
        {
          ...filterParams,
          financialYearId: financialYearId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data && response.data.success !== false) {
        const data = response?.data?.data || []

        // Transform data to match your table structure
        const transformedData = data.map((item, index) => ({
          ...item,
          id: item._id || `row-${index}`,
          SSVH: item.SSVH || item.ssvh || 0,
          DVH: item.DVH || item.dvh || 0,
          AVH: item.AVH || item.avh || 0,
          PVC: item.PVC || item.pvc || 0,
          SCAH: item.SCAH || item.scah || 0,
          totalInstitutions: item.totalInstitutions || item.total || 0,
          iSSVH: item.iSSVH || item.totalIndents?.ssvh || 0,
          iDVH: item.iDVH || item.totalIndents?.dvh || 0,
          iAVH: item.iAVH || item.totalIndents?.avh || 0,
          iPVC: item.iPVC || item.totalIndents?.pvc || 0,
          iSCAH: item.iSCAH || item.totalIndents?.scah || 0,
          indentPlaced: item.indentPlaced || item.totalIndents?.total || 0,
          budget: item.budget || 0,
          booked: item.booked || 0,
          availableBudget: item.availableBudget || 0,
          percentIndents: item.percentIndents || item.percentage || 0,
          district: item.district || "-",
        }))

        setAbstractData(transformedData)

        // Prepare CSV data
        const csvRows = transformedData.map((item, index) => ({
          "SI. No": index + 1,
          District: item.district || "-",
          "SSVH Institutions": formatNumber(item.SSVH),
          "DVH Institutions": formatNumber(item.DVH),
          "AVH Institutions": formatNumber(item.AVH),
          "PVC Institutions": formatNumber(item.PVC),
          "SC(AH) Institutions": formatNumber(item.SCAH),
          "Total Institutions": formatNumber(item.totalInstitutions),
          "SSVH Indents": formatNumber(item.iSSVH),
          "DVH Indents": formatNumber(item.iDVH),
          "AVH Indents": formatNumber(item.iAVH),
          "PVC Indents": formatNumber(item.iPVC),
          "SC(AH) Indents": formatNumber(item.iSCAH),
          "Total Indents": formatNumber(item.indentPlaced),
          Budget: formatNumber(item.budget, 2),
          Booked: formatNumber(item.booked, 2),
          "Available Budget": formatNumber(item.availableBudget, 2),
          "% of Indents": `${formatPercentage(item.percentIndents)}%`,
        }))

        setCsvData(csvRows)
      } else {
        throw new Error(response.data?.message || "Failed to fetch data")
      }
    } catch (error) {
      console.error("Error fetching abstract report:", error)
      toast.error(error.message || "Failed to fetch abstract report")
      setAbstractData([])
      setCsvData([])
    } finally {
      setIsDataLoading(false)
    }
  }, [token, filters, selectedFinancialYearId])

  // Generate PDF
  const generatePDF = useCallback(() => {
    if (abstractData.length === 0) {
      toast.warning("No data to export to PDF")
      return
    }

    try {
      setIsDataLoading(true) // Show loading while generating PDF
      
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })

      const financialYearText = getCurrentFinancialYearText()
      const quarterName = getCurrentQuarterName()
      const schemeName = getCurrentSchemeName()
      
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const leftMargin = 15
      const rightMargin = pageWidth - 15

      // Header
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 128)
      doc.setFont("helvetica", "bold")
      doc.text(
        "ABSTRACT SHOWING DRUG INDENT DONE IN DNS SOFTWARE",
        pageWidth / 2,
        15,
        { align: "center" }
      )

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      
      let subHeaderText = `AS ON ${formattedDate.toUpperCase()}`
      if (financialYearText !== "N/A") subHeaderText += ` | Financial Year: ${financialYearText}`
      if (quarterName) subHeaderText += ` | Quarter: ${quarterName}`
      if (schemeName) subHeaderText += ` | Scheme: ${schemeName}`
      
      doc.text(subHeaderText, pageWidth / 2, 22, {
        align: "center",
      })

      // Sub-header
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const generatedText = `Generated On: ${formattedDate}`
      const textWidth = doc.getTextWidth(generatedText)
      doc.text(generatedText, rightMargin - textWidth, 30)

      let startY = 40

      // Prepare table data
      const tableData = abstractData.map((item, index) => [
        (index + 1).toString(),
        item.district || "-",
        formatNumber(item.SSVH),
        formatNumber(item.DVH),
        formatNumber(item.AVH),
        formatNumber(item.PVC),
        formatNumber(item.SCAH),
        formatNumber(item.totalInstitutions),
        formatNumber(item.iSSVH),
        formatNumber(item.iDVH),
        formatNumber(item.iAVH),
        formatNumber(item.iPVC),
        formatNumber(item.iSCAH),
        formatNumber(item.indentPlaced),
        formatNumber(item.budget, 2),
        formatNumber(item.booked, 2),
        formatNumber(item.availableBudget, 2),
        `${formatPercentage(item.percentIndents)}%`,
      ])

      // Create table with complex header
      autoTable(doc, {
        startY: startY,
        head: [
          [
            {
              content: "SI. No",
              rowSpan: 2,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "District",
              rowSpan: 2,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Total No of Institutions",
              colSpan: 6,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Total No of Institutions indents",
              colSpan: 6,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Budget",
              rowSpan: 2,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Booked",
              rowSpan: 2,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Available",
              rowSpan: 2,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "% of Indents",
              rowSpan: 2,
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
          ],
          [
            // Sub-headers for Total No of Institutions
            {
              content: "SSVH",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "DVH",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "AVH",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "PVC",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "SC(AH)",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Total",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            // Sub-headers for Total No of Institutions indents
            {
              content: "SSVH",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "DVH",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "AVH",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "PVC",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "SC(AH)",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "Total",
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
          fontSize: 8,
          halign: "center",
        },
        bodyStyles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" }, // SI. No
          1: { cellWidth: 25, halign: "left" }, // District
          2: { cellWidth: 12, halign: "center" }, // SSVH Institutions
          3: { cellWidth: 12, halign: "center" }, // DVH Institutions
          4: { cellWidth: 12, halign: "center" }, // AVH Institutions
          5: { cellWidth: 12, halign: "center" }, // PVC Institutions
          6: { cellWidth: 15, halign: "center" }, // SC(AH) Institutions
          7: { cellWidth: 12, halign: "center" }, // Total Institutions
          8: { cellWidth: 12, halign: "center" }, // SSVH Indents
          9: { cellWidth: 12, halign: "center" }, // DVH Indents
          10: { cellWidth: 12, halign: "center" }, // AVH Indents
          11: { cellWidth: 12, halign: "center" }, // PVC Indents
          12: { cellWidth: 15, halign: "center" }, // SC(AH) Indents
          13: { cellWidth: 12, halign: "center" }, // Total Indents
          14: { cellWidth: 20, halign: "center" }, // Budget
          15: { cellWidth: 20, halign: "center" }, // Booked
          16: { cellWidth: 20, halign: "center" }, // Available
          17: { cellWidth: 15, halign: "center" }, // % of Indents
        },
        margin: { left: leftMargin, right: 15 },
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

      // Save PDF
      const fileName = `Abstract_Report_${financialYearText}_${
        currentDate.toISOString().split("T")[0]
      }.pdf`
      
      // Small delay to ensure PDF is fully generated
      setTimeout(() => {
        doc.save(fileName)
        toast.success("PDF generated successfully!")
        setIsDataLoading(false)
      }, 500)

    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
      setIsDataLoading(false)
    }
  }, [abstractData])

  // CSV report configuration
  const csvReport = useMemo(
    () => ({
      filename: `Abstract_Report_${new Date().toISOString().split("T")[0]}.csv`,
      data: csvData,
      headers: [
        { label: "SI. No", key: "SI. No" },
        { label: "District", key: "District" },
        { label: "SSVH Institutions", key: "SSVH Institutions" },
        { label: "DVH Institutions", key: "DVH Institutions" },
        { label: "AVH Institutions", key: "AVH Institutions" },
        { label: "PVC Institutions", key: "PVC Institutions" },
        { label: "SC(AH) Institutions", key: "SC(AH) Institutions" },
        { label: "Total Institutions", key: "Total Institutions" },
        { label: "SSVH Indents", key: "SSVH Indents" },
        { label: "DVH Indents", key: "DVH Indents" },
        { label: "AVH Indents", key: "AVH Indents" },
        { label: "PVC Indents", key: "PVC Indents" },
        { label: "SC(AH) Indents", key: "SC(AH) Indents" },
        { label: "Total Indents", key: "Total Indents" },
        { label: "Budget", key: "Budget" },
        { label: "Booked", key: "Booked" },
        { label: "Available Budget", key: "Available Budget" },
        { label: "% of Indents", key: "% of Indents" },
      ],
    }),
    [csvData]
  )

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return abstractData
    const term = searchTerm.toLowerCase()
    return abstractData.filter(item =>
      item.district?.toLowerCase().includes(term)
    )
  }, [abstractData, searchTerm])

  // Handler Functions
  const handleFinancialYearChange = selectedOption => {
    const value = selectedOption?.value || ""

    setSelectedFinancialYearId(value)
    
    // Clear dependent filters
    setFilters({
      schemeId: "",
      quarterId: "",
    })
    
    // Clear schemes and quarters
    setSchemes([])
    setQuarters([])
    
    // Clear data
    setAbstractData([])
    setCsvData([])

    if (value) {
      fetchSchemesAndQuarters(value)
    }
  }

  const handleSelectFilterChange = (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    if (name === "schemeId") {
      setFilters(prev => ({
        ...prev,
        schemeId: value,
      }))
    } else if (name === "quarterId") {
      setFilters(prev => ({
        ...prev,
        quarterId: value,
      }))
    }
    
    // Clear data when filters change
    setAbstractData([])
    setCsvData([])
  }

  const handleSearch = () => {
    if (!selectedFinancialYearId) {
      toast.error("Please select a financial year")
      return
    }
    
    if (!filters.schemeId) {
      toast.error("Please select a scheme")
      return
    }
    
    if (!filters.quarterId) {
      toast.error("Please select a quarter")
      return
    }
    
    fetchAbstractReport(filters, selectedFinancialYearId)
  }

  const handleReset = () => {
    // Reset filters to empty
    setSelectedFinancialYearId("")
    setFilters({
      schemeId: "",
      quarterId: "",
    })
    
    // Clear schemes and quarters
    setSchemes([])
    setQuarters([])
    
    // Clear data
    setAbstractData([])
    setCsvData([])
    
    // Clear search term
    setSearchTerm("")
    
    toast.info("All filters have been reset")
  }

  // Helper functions
  const getCurrentQuarterName = () => {
    if (!filters.quarterId || quarters.length === 0) return ""
    const currentQuarter = quarters.find(q => q._id === filters.quarterId)
    return currentQuarter ? currentQuarter.quarter : ""
  }

  const getCurrentSchemeName = () => {
    if (!filters.schemeId || schemes.length === 0) return ""
    const currentScheme = schemes.find(s => s._id === filters.schemeId)
    return currentScheme ? currentScheme.name : ""
  }

  // Memoized Options for Select Components
  const financialYearOptions = useMemo(
    () =>
      financialYears.map(year => ({
        value: year._id,
        label: year.year,
      })),
    [financialYears]
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

  // Select Styles
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

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchFinancialYears()
      } catch (error) {
        console.error("Error initializing financial years:", error)
        toast.error("Failed to initialize financial years")
      }
    }

    initializeData()
  }, [fetchFinancialYears])

  // Main render loading state
  if (isLoading) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="text-center">
              <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
              <p className="mt-2">Loading financial years...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Filters Section - Always visible as requested */}
        <Card className="mb-3">
          <CardBody>
            <h5 className="mb-3 text-primary">
              <i className="fas fa-filter me-2"></i>
              Filters
            </h5>
            <Row className="align-items-end">
              {/* Financial Year - Takes full width on mobile, 1/3 on desktop */}
              <Col md={3} className="mb-2 mb-md-0">
                <FormGroup className="mb-0">
                  <Label className="form-label fw-medium mb-1">Financial Year</Label>
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
              
              {/* Scheme - Takes full width on mobile, 1/3 on desktop */}
              <Col md={3} className="mb-2 mb-md-0">
                <FormGroup className="mb-0">
                  <Label className="form-label fw-medium mb-1">Scheme</Label>
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
                    isDisabled={!selectedFinancialYearId || isFiltersLoading}
                  />
                </FormGroup>
              </Col>
              
              {/* Quarter - Takes full width on mobile, 1/3 on desktop */}
              <Col md={3} className="mb-2 mb-md-0">
                <FormGroup className="mb-0">
                  <Label className="form-label fw-medium mb-1">Quarter</Label>
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
                    isDisabled={!selectedFinancialYearId || isFiltersLoading}
                  />
                </FormGroup>
              </Col>
              
              {/* Action Buttons - Takes full width on mobile, 1/3 on desktop */}
              <Col md={3} className="mb-2 mb-md-0">
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    color="secondary"
                    onClick={handleReset}
                    disabled={isDataLoading}
                    className="flex-grow-1"
                    style={{ minWidth: "100px" }}
                  >
                    <i className="bx bx-reset me-1"></i>
                    Reset
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleSearch}
                    disabled={isDataLoading || !selectedFinancialYearId || !filters.schemeId || !filters.quarterId}
                    className="flex-grow-1"
                    style={{ minWidth: "100px" }}
                  >
                    {isDataLoading ? (
                      <>
                        <Spinner size="sm" className="me-1" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-search me-1"></i>
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="mt-2 text-muted">
              <small>
                <i className="bx bx-info-circle me-1"></i>
                Please select Financial Year, Scheme, and Quarter to view the report
              </small>
            </div>
          </CardBody>
        </Card>

        {/* Loading State for Report Data */}
        {isDataLoading && (
          <Card className="mb-3">
            <CardBody>
              <div className="text-center py-5">
                <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
                <p className="mt-3">Loading report data...</p>
                <p className="text-muted">Please wait while we fetch the data for your selected filters</p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Main Report Card - Only show when not loading data */}
        {!isDataLoading && abstractData.length > 0 ? (
          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={12}>
                  <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
                    <Button
                      color="danger"
                      onClick={generatePDF}
                      className="me-2"
                      disabled={abstractData.length === 0 || isDataLoading}
                    >
                      <i className="bx bxs-file-pdf me-1"></i>
                      Export to PDF
                    </Button>
                    <CSVLink
                      {...csvReport}
                      className="btn btn-success me-2"
                      style={{
                        pointerEvents: abstractData.length === 0 || isDataLoading ? "none" : "auto",
                        opacity: abstractData.length === 0 || isDataLoading ? 0.65 : 1,
                        textDecoration: "none",
                      }}
                    >
                      <i className="bx bx-file me-1"></i>
                      Export to Excel
                    </CSVLink>
                    <div style={{ minWidth: "250px" }}>
                      <Input
                        type="search"
                        placeholder="Search district..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-control"
                        disabled={isDataLoading}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="text-center mb-3">
                <h2 className="text-primary mb-2">
                  ABSTRACT SHOWING DRUG INDENT DONE IN DNS SOFTWARE
                </h2>
                <h4 className="text-muted">
                  AS ON{" "}
                  {new Date()
                    .toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    .toUpperCase()}
                  {selectedFinancialYearId && (
                    <>
                      {" | "} Financial Year: {getCurrentFinancialYearText()}
                      {getCurrentQuarterName() && ` | Quarter: ${getCurrentQuarterName()}`}
                      {getCurrentSchemeName() && ` | Scheme: ${getCurrentSchemeName()}`}
                    </>
                  )}
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
                  <div className="text-end">
                    <p className="mb-1">
                      <strong>Overall Percentage:</strong>{" "}
                      {calculateOverallPercentage()}%
                    </p>
                    <p className="mb-0">
                      <strong>Total Records:</strong> {abstractData.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <Table hover className="table-bordered mb-4">
                  <thead>
                    <tr className="text-center table-primary">
                      <th rowSpan="2">SI. No</th>
                      <th rowSpan="2">District</th>
                      <th colSpan="6">Total No of Institutions</th>
                      <th colSpan="6">Total No of Institutions indents</th>
                      <th rowSpan="2">Budget</th>
                      <th rowSpan="2">Booked</th>
                      <th rowSpan="2">Available</th>
                      <th rowSpan="2">% of Indents</th>
                    </tr>
                    <tr className="text-center table-primary">
                      <th>SSVH</th>
                      <th>DVH</th>
                      <th>AVH</th>
                      <th>PVC</th>
                      <th>SC(AH)</th>
                      <th>Total</th>
                      <th>SSVH</th>
                      <th>DVH</th>
                      <th>AVH</th>
                      <th>PVC</th>
                      <th>SC(AH)</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr key={item.id || index} className="text-center">
                          <td className="text-center fw-bold">
                            {item.district?.toLowerCase() === "total" ? "" : index + 1}
                          </td>
                          <td className="text-start">{item.district || "-"}</td>
                          <td>{formatNumber(item.SSVH)}</td>
                          <td>{formatNumber(item.DVH)}</td>
                          <td>{formatNumber(item.AVH)}</td>
                          <td>{formatNumber(item.PVC)}</td>
                          <td>{formatNumber(item.SCAH)}</td>
                          <td className="fw-bold">
                            {formatNumber(item.totalInstitutions)}
                          </td>
                          <td>{formatNumber(item.iSSVH)}</td>
                          <td>{formatNumber(item.iDVH)}</td>
                          <td>{formatNumber(item.iAVH)}</td>
                          <td>{formatNumber(item.iPVC)}</td>
                          <td>{formatNumber(item.iSCAH)}</td>
                          <td className="fw-bold">
                            {formatNumber(item.indentPlaced)}
                          </td>
                          <td className="fw-bold">
                            {formatNumber(item.budget, 2)}
                          </td>
                          <td className="fw-bold">
                            {formatNumber(item.booked, 2)}
                          </td>
                          <td className="fw-bold">
                            {formatNumber(item.availableBudget, 2)}
                          </td>
                          <td className="fw-bold">
                            {formatPercentage(item.percentIndents)}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="18" className="text-center py-4">
                          {searchTerm
                            ? "No matching districts found"
                            : "No data available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        ) : (
          // Empty State - Show only when no data and not loading
          !isDataLoading && (
            <Card>
              <CardBody>
                <div className="text-center py-5">
                  <div className="avatar-lg mx-auto mb-4">
                    <div className="avatar-title bg-soft-primary text-primary rounded-circle">
                      <i className="bx bx-bar-chart-alt-2 display-4"></i>
                    </div>
                  </div>
                  <h4 className="text-primary">No Report Data</h4>
                  <p className="text-muted mb-4">
                    {selectedFinancialYearId && filters.schemeId && filters.quarterId
                      ? "No data found for the selected filters. Try different filter combinations."
                      : "Please select Financial Year, Scheme, and Quarter above, then click 'Search' to generate the report."}
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <Button 
                      color="primary" 
                      onClick={handleSearch}
                      disabled={!selectedFinancialYearId || !filters.schemeId || !filters.quarterId || isDataLoading}
                    >
                      <i className="bx bx-search me-1"></i>
                      Search Report
                    </Button>
                    <Button color="light" onClick={handleReset} disabled={isDataLoading}>
                      <i className="bx bx-reset me-1"></i>
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        )}
      </div>
    </div>
  )
}

export default AbstractReport


