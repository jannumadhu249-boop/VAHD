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
//                 DISTRICT WISE RELEASE AND EXPENDITURE DETAILS
//               </h2>
//               <h4 className="text-muted">(ADMINISTRATIVE SANCTIONS)</h4>
//             </div>

//             <div className="table-responsive">
//               <Table hover className="table-bordered mb-4">
//                 <thead>
//                   <tr className="text-center table-primary">
//                     <th>SI. No</th>
//                     <th>District</th>
//                     <th> Budget Released</th>
//                     <th>Expenditure (Inc.Tax)</th>
//                     <th>Balance</th>
//                     <th> % of Expenditure</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     filteredData.map((item, index) => (
//                       <tr key={item.id || index} className="text-center">
//                         <td className="text-center fw-bold">{index + 1}</td>
//                         <td className="text-start">
//                           {item.district || "-"}[1]
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
//   const [budgetData, setBudgetData] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [csvData, setCsvData] = useState([])
//   const [totals, setTotals] = useState({
//     budgetReleased: 0,
//     expenditure: 0,
//     balance: 0,
//   })

//   const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//   const token = authUser?.token

//   // Format number utility function
//   const formatNumber = (num, decimals = 2) => {
//     const number = parseFloat(num)
//     if (isNaN(number)) return decimals === 0 ? "0" : "0.00"
//     return number.toLocaleString("en-IN", {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     })
//   }

//   // Format currency with Indian numbering system
//   const formatCurrency = (amount) => {
//     const num = parseFloat(amount)
//     if (isNaN(num)) return "₹0.00"
    
//     if (num >= 10000000) {
//       return `₹${(num / 10000000).toFixed(2)} Cr`
//     } else if (num >= 100000) {
//       return `₹${(num / 100000).toFixed(2)} L`
//     } else {
//       return `₹${formatNumber(num, 2)}`
//     }
//   }

//   // Get current date and time for report
//   const getCurrentDateTime = () => {
//     const now = new Date()
//     return now.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     })
//   }

//   // Fetch budget utilization data
//   const fetchBudgetUtilization = useCallback(async () => {
//     if (!token) {
//       toast.error("Authentication token not found")
//       return
//     }

//     try {
//       setIsLoading(true)

//       const response = await axios.post(
//         URLS.DistrictWiseBudgetUtilization,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )

//       if (response.data && response.data.success !== false) {
//         const data = response.data.data || []
        
//         // Separate regular districts and total row
//         const districts = data.filter(item => item.slNo !== "")
//         const totalRow = data.find(item => item.slNo === "")
        
//         setBudgetData(districts)
        
//         // Calculate totals from total row or sum individual districts
//         if (totalRow) {
//           setTotals({
//             budgetReleased: totalRow.budgetReleased || 0,
//             expenditure: totalRow.expenditure || 0,
//             balance: totalRow.balance || 0,
//           })
//         } else {
//           // Calculate totals manually if no total row provided
//           const calculatedTotals = districts.reduce(
//             (acc, district) => ({
//               budgetReleased: acc.budgetReleased + (parseFloat(district.budgetReleased) || 0),
//               expenditure: acc.expenditure + (parseFloat(district.expenditure) || 0),
//               balance: acc.balance + (parseFloat(district.balance) || 0),
//             }),
//             { budgetReleased: 0, expenditure: 0, balance: 0 }
//           )
//           setTotals(calculatedTotals)
//         }

//         // Prepare CSV data
//         const csvRows = districts.map(district => ({
//           "SI. No": district.slNo,
//           District: district.district,
//           "Budget Released (₹)": formatNumber(district.budgetReleased, 2),
//           "Expenditure (₹)": formatNumber(district.expenditure, 2),
//           "Balance (₹)": formatNumber(district.balance, 2),
//           "% of Expenditure": district.expenditurePercent,
//         }))

//         // Add total row to CSV
//         if (totalRow) {
//           csvRows.push({
//             "SI. No": "",
//             District: "GRAND TOTAL",
//             "Budget Released (₹)": formatNumber(totalRow.budgetReleased, 2),
//             "Expenditure (₹)": formatNumber(totalRow.expenditure, 2),
//             "Balance (₹)": formatNumber(totalRow.balance, 2),
//             "% of Expenditure": totalRow.expenditurePercent,
//           })
//         }

//         setCsvData(csvRows)
//       } else {
//         throw new Error(response.data?.message || "Failed to fetch data")
//       }
//     } catch (error) {
//       console.error("Error fetching budget utilization data:", error)
//       toast.error(error.message || "Failed to fetch budget utilization data")
//       setBudgetData([])
//       setCsvData([])
//       setTotals({ budgetReleased: 0, expenditure: 0, balance: 0 })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [token])

//   // Generate PDF report
//   const generatePDF = useCallback(() => {
//     if (budgetData.length === 0) {
//       toast.warning("No data to export to PDF")
//       return
//     }

//     try {
//       const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a4",
//       })

//       const currentDateTime = getCurrentDateTime()
//       const pageWidth = doc.internal.pageSize.width
//       const pageHeight = doc.internal.pageSize.height
//       const leftMargin = 10
//       const rightMargin = pageWidth - 10

//       // Report Header
//       doc.setFontSize(16)
//       doc.setTextColor(0, 0, 128)
//       doc.setFont("helvetica", "bold")
//       doc.text(
//         "DISTRICT WISE BUDGET RELEASE AND EXPENDITURE DETAILS",
//         pageWidth / 2,
//         15,
//         { align: "center" }
//       )

//       // Sub Header
//       doc.setFontSize(12)
//       doc.setTextColor(0, 0, 0)
//       doc.text("(ADMINISTRATIVE SANCTIONS)", pageWidth / 2, 22, {
//         align: "center",
//       })

//       // Report Information
//       doc.setFontSize(9)
//       doc.setFont("helvetica", "normal")
//       const generatedText = `Generated On: ${currentDateTime}`
//       const textWidth = doc.getTextWidth(generatedText)
//       doc.text(generatedText, rightMargin - textWidth, 30)

//       // Prepare table data
//       const tableData = budgetData.map(district => [
//         district.slNo.toString(),
//         district.district,
//         `₹${formatNumber(district.budgetReleased, 2)}`,
//         `₹${formatNumber(district.expenditure, 2)}`,
//         `₹${formatNumber(district.balance, 2)}`,
//         district.expenditurePercent,
//       ])

//       // Add total row
//       tableData.push([
//         "",
//         "GRAND TOTAL",
//         `₹${formatNumber(totals.budgetReleased, 2)}`,
//         `₹${formatNumber(totals.expenditure, 2)}`,
//         `₹${formatNumber(totals.balance, 2)}`,
//         `${((totals.expenditure / totals.budgetReleased) * 100).toFixed(2)}%`,
//       ])

//       // Create table
//       autoTable(doc, {
//         startY: 40,
//         head: [
//           [
//             { content: "SI. No", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "District", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "Budget Released (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "Expenditure (Inc.Tax) (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "Balance (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "% of Expenditure", styles: { halign: "center", fillColor: [41, 128, 185] } },
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
//           cellPadding: 3,
//           overflow: "linebreak",
//         },
//         columnStyles: {
//           0: { cellWidth: 20, halign: "center" }, // SI. No
//           1: { cellWidth: 40, halign: "left" },   // District
//           2: { cellWidth: 35, halign: "right" },  // Budget Released
//           3: { cellWidth: 35, halign: "right" },  // Expenditure
//           4: { cellWidth: 35, halign: "right" },  // Balance
//           5: { cellWidth: 30, halign: "center" }, // % of Expenditure
//         },
//         margin: { left: leftMargin, right: 10 },
//         styles: {
//           cellPadding: 2,
//           fontSize: 8,
//           valign: "middle",
//         },
//         didDrawPage: function (data) {
//           // Footer with page number
//           doc.setFontSize(8)
//           doc.setTextColor(150, 150, 150)
//           doc.text(
//             `Page ${doc.internal.getNumberOfPages()}`,
//             pageWidth / 2,
//             pageHeight - 10,
//             { align: "center" }
//           )
//         },
//         willDrawCell: function (data) {
//           // Highlight total row
//           if (data.row.index === tableData.length - 1) {
//             doc.setFillColor(220, 230, 241)
//             data.cell.styles.fillColor = [220, 230, 241]
//             data.cell.styles.fontStyle = "bold"
//             data.cell.styles.textColor = [0, 0, 0]
//           }
//         },
//       })

//       // Save PDF
//       const fileName = `District_Budget_Utilization_Report_${
//         new Date().toISOString().split("T")[0]
//       }.pdf`
//       doc.save(fileName)

//       toast.success("PDF report generated successfully!")
//     } catch (error) {
//       console.error("Error generating PDF:", error)
//       toast.error("Failed to generate PDF report")
//     }
//   }, [budgetData, totals])

//   // CSV report configuration
//   const csvReport = useMemo(
//     () => ({
//       filename: `District_Budget_Utilization_${new Date().toISOString().split("T")[0]}.csv`,
//       data: csvData,
//       headers: [
//         { label: "SI. No", key: "SI. No" },
//         { label: "District", key: "District" },
//         { label: "Budget Released (₹)", key: "Budget Released (₹)" },
//         { label: "Expenditure (₹)", key: "Expenditure (₹)" },
//         { label: "Balance (₹)", key: "Balance (₹)" },
//         { label: "% of Expenditure", key: "% of Expenditure" },
//       ],
//     }),
//     [csvData]
//   )

//   // Filter data based on search term
//   const filteredData = useMemo(() => {
//     if (!searchTerm) return budgetData
//     const term = searchTerm.toLowerCase()
//     return budgetData.filter(item =>
//       item.district?.toLowerCase().includes(term)
//     )
//   }, [budgetData, searchTerm])

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchBudgetUtilization()
//   }, [fetchBudgetUtilization])

//   // Calculate overall expenditure percentage
//   const overallExpenditurePercent = useMemo(() => {
//     if (totals.budgetReleased === 0) return "0.00%"
//     const percentage = (totals.expenditure / totals.budgetReleased) * 100
//     return `${percentage.toFixed(2)}%`
//   }, [totals])

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
//               <p className="mt-2">Loading budget utilization report...</p>
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
//             {/* Header and Controls */}
//             <Row className="mb-3">
//               <Col md={6}>
//                 <div className="d-flex align-items-center">
//                   <h4 className="mb-0 text-primary">
//                     <i className="bx bx-bar-chart-alt-2 me-2"></i>
//                     District Wise Budget Utilization Report
//                   </h4>
//                 </div>
//                 <p className="text-muted mb-0">
//                   As on {getCurrentDateTime()}
//                 </p>
//               </Col>
//               <Col md={6}>
//                 <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
//                   <div style={{ minWidth: "250px" }}>
//                     <Input
//                       type="search"
//                       placeholder="Search district..."
//                       value={searchTerm}
//                       onChange={e => setSearchTerm(e.target.value)}
//                       className="form-control"
//                     />
//                   </div>
//                   <Button
//                     color="danger"
//                     onClick={generatePDF}
//                     className="me-2"
//                     disabled={budgetData.length === 0}
//                   >
//                     <i className="bx bxs-file-pdf me-1"></i>
//                     Export to PDF
//                   </Button>
//                   <CSVLink
//                     {...csvReport}
//                     className="btn btn-success"
//                     disabled={budgetData.length === 0}
//                   >
//                     <i className="bx bx-file me-1"></i>
//                     Export to Excel
//                   </CSVLink>
//                 </div>
//               </Col>
//             </Row>

//             {/* Summary Cards */}
//             <Row className="mb-4">
//               <Col md={4}>
//                 <Card className="border-primary border-top-3">
//                   <CardBody className="py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="text-muted mb-1">Total Budget Released</h6>
//                         <h4 className="mb-0 text-primary">
//                           {formatCurrency(totals.budgetReleased)}
//                         </h4>
//                       </div>
//                       <div className="avatar-sm">
//                         <span className="avatar-title bg-primary rounded-circle">
//                           <i className="bx bx-rupee"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//               <Col md={4}>
//                 <Card className="border-success border-top-3">
//                   <CardBody className="py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="text-muted mb-1">Total Expenditure</h6>
//                         <h4 className="mb-0 text-success">
//                           {formatCurrency(totals.expenditure)}
//                         </h4>
//                       </div>
//                       <div className="avatar-sm">
//                         <span className="avatar-title bg-success rounded-circle">
//                           <i className="bx bx-money"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//               <Col md={4}>
//                 <Card className="border-info border-top-3">
//                   <CardBody className="py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="text-muted mb-1">Overall Expenditure %</h6>
//                         <h4 className="mb-0 text-info">{overallExpenditurePercent}</h4>
//                       </div>
//                       <div className="avatar-sm">
//                         <span className="avatar-title bg-info rounded-circle">
//                           <i className="bx bx-pie-chart-alt"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Data Table */}
//             <div className="table-responsive">
//               <Table hover className="table-bordered mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th className="text-center" style={{ width: "5%" }}>SI. No</th>
//                     <th className="text-start" style={{ width: "25%" }}>District</th>
//                     <th className="text-end" style={{ width: "20%" }}>Budget Released (₹)</th>
//                     <th className="text-end" style={{ width: "20%" }}>Expenditure (Inc.Tax) (₹)</th>
//                     <th className="text-end" style={{ width: "20%" }}>Balance (₹)</th>
//                     <th className="text-center" style={{ width: "10%" }}>% of Expenditure</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     <>
//                       {filteredData.map((district) => (
//                         <tr key={`${district.slNo}-${district.district}`}>
//                           <td className="text-center fw-semibold">{district.slNo}</td>
//                           <td className="text-start">{district.district}</td>
//                           <td className="text-end fw-semibold">
//                             {formatNumber(district.budgetReleased, 2)}
//                           </td>
//                           <td className="text-end fw-semibold">
//                             {formatNumber(district.expenditure, 2)}
//                           </td>
//                           <td className="text-end fw-semibold">
//                             {formatNumber(district.balance, 2)}
//                           </td>
//                           <td className="text-center">
//                             <span className={`badge ${
//                               parseFloat(district.expenditurePercent) >= 100 
//                                 ? "bg-danger" 
//                                 : parseFloat(district.expenditurePercent) >= 95 
//                                 ? "bg-success" 
//                                 : parseFloat(district.expenditurePercent) >= 80 
//                                 ? "bg-warning" 
//                                 : "bg-secondary"
//                             }`}>
//                               {district.expenditurePercent}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
                      
//                       {/* Grand Total Row */}
//                       <tr className="table-active">
//                         <td className="text-center fw-bold"></td>
//                         <td className="text-start fw-bold">GRAND TOTAL</td>
//                         <td className="text-end fw-bold">
//                           {formatNumber(totals.budgetReleased, 2)}
//                         </td>
//                         <td className="text-end fw-bold">
//                           {formatNumber(totals.expenditure, 2)}
//                         </td>
//                         <td className="text-end fw-bold">
//                           {formatNumber(totals.balance, 2)}
//                         </td>
//                         <td className="text-center fw-bold">
//                           <span className="badge bg-primary">
//                             {overallExpenditurePercent}
//                           </span>
//                         </td>
//                       </tr>
//                     </>
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center py-4">
//                         {searchTerm
//                           ? "No matching districts found"
//                           : "No budget utilization data available"}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>

//             {/* Legend */}
//             {/* <div className="mt-3">
//               <small className="text-muted">
//                 <strong>Legend:</strong>{" "}
//                 <span className="badge bg-success me-2">≥ 95%</span> Excellent Utilization •{" "}
//                 <span className="badge bg-warning me-2">80-94%</span> Good Utilization •{" "}
//                 <span className="badge bg-danger me-2">≥ 100%</span> Exceeded Budget •{" "}
//                 <span className="badge bg-secondary me-2">&lt; 80%</span> Low Utilization
//               </small>
//             </div> */}
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default AbstractReport



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
//   const [budgetData, setBudgetData] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [csvData, setCsvData] = useState([])
//   const [totals, setTotals] = useState({
//     budgetReleased: 0,
//     expenditure: 0,
//     gstexpenditure: 0,
//     balance: 0,
//   })

//   const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//   const token = authUser?.token

//   // Format number utility function
//   const formatNumber = (num, decimals = 2) => {
//     const number = parseFloat(num)
//     if (isNaN(number)) return decimals === 0 ? "0" : "0.00"
//     return number.toLocaleString("en-IN", {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     })
//   }

//   // Format currency with Indian numbering system
//   const formatCurrency = (amount) => {
//     const num = parseFloat(amount)
//     if (isNaN(num)) return "₹0.00"
    
//     if (num >= 10000000) {
//       return `₹${(num / 10000000).toFixed(2)} Cr`
//     } else if (num >= 100000) {
//       return `₹${(num / 100000).toFixed(2)} L`
//     } else {
//       return `₹${formatNumber(num, 2)}`
//     }
//   }

//   // Get current date and time for report
//   const getCurrentDateTime = () => {
//     const now = new Date()
//     return now.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     })
//   }

//   // Fetch budget utilization data
//   const fetchBudgetUtilization = useCallback(async () => {
//     if (!token) {
//       toast.error("Authentication token not found")
//       return
//     }

//     try {
//       setIsLoading(true)

//       const response = await axios.post(
//         URLS.DistrictWiseBudgetUtilization,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )

//       if (response.data && response.data.success !== false) {
//         const data = response.data.data || []
        
//         // Separate regular districts and total row
//         const districts = data.filter(item => item.slNo !== "")
//         const totalRow = data.find(item => item.slNo === "")
        
//         setBudgetData(districts)
        
//         // Calculate totals from total row or sum individual districts
//         if (totalRow) {
//           setTotals({
//             budgetReleased: totalRow.budgetReleased || 0,
//             expenditure: totalRow.expenditure || 0,
//             gstexpenditure: totalRow.gstexpenditure || 0,
//             balance: totalRow.balance || 0,
//           })
//         } else {
//           // Calculate totals manually if no total row provided
//           const calculatedTotals = districts.reduce(
//             (acc, district) => ({
//               budgetReleased: acc.budgetReleased + (parseFloat(district.budgetReleased) || 0),
//               expenditure: acc.expenditure + (parseFloat(district.expenditure) || 0),
//               gstexpenditure: acc.gstexpenditure + (parseFloat(district.gstexpenditure) || 0),
//               balance: acc.balance + (parseFloat(district.balance) || 0),
//             }),
//             { budgetReleased: 0, expenditure: 0, gstexpenditure: 0, balance: 0 }
//           )
//           setTotals(calculatedTotals)
//         }

//         // Prepare CSV data
//         const csvRows = districts.map(district => ({
//           "SI. No": district.slNo,
//           District: district.district,
//           "Budget Released (₹)": formatNumber(district.budgetReleased, 2),
//           "Expenditure (Exc.Tax) (₹)": formatNumber(district.gstexpenditure, 2),
//           "Expenditure (Inc.GST) (₹)": formatNumber(district.expenditure, 2),
//           "Balance (₹)": formatNumber(district.balance, 2),
//           "% of Expenditure": district.expenditurePercent,
//         }))

//         // Add total row to CSV
//         if (totalRow) {
//           csvRows.push({
//             "SI. No": "",
//             District: "GRAND TOTAL",
//             "Budget Released (₹)": formatNumber(totalRow.budgetReleased, 2),
//             "Expenditure (Exc.Tax) (₹)": formatNumber(totalRow.gstexpenditure, 2),
//             "Expenditure (Inc.GST) (₹)": formatNumber(totalRow.expenditure, 2),
//             "Balance (₹)": formatNumber(totalRow.balance, 2),
//             "% of Expenditure": totalRow.expenditurePercent,
//           })
//         }

//         setCsvData(csvRows)
//       } else {
//         throw new Error(response.data?.message || "Failed to fetch data")
//       }
//     } catch (error) {
//       console.error("Error fetching budget utilization data:", error)
//       toast.error(error.message || "Failed to fetch budget utilization data")
//       setBudgetData([])
//       setCsvData([])
//       setTotals({ budgetReleased: 0, expenditure: 0, gstexpenditure: 0, balance: 0 })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [token])

//   // Generate PDF report
//   const generatePDF = useCallback(() => {
//     if (budgetData.length === 0) {
//       toast.warning("No data to export to PDF")
//       return
//     }

//     try {
//       const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a4",
//       })

//       const currentDateTime = getCurrentDateTime()
//       const pageWidth = doc.internal.pageSize.width
//       const pageHeight = doc.internal.pageSize.height
//       const leftMargin = 10
//       const rightMargin = pageWidth - 10

//       // Report Header
//       doc.setFontSize(16)
//       doc.setTextColor(0, 0, 128)
//       doc.setFont("helvetica", "bold")
//       doc.text(
//         "DISTRICT WISE BUDGET RELEASE AND EXPENDITURE DETAILS",
//         pageWidth / 2,
//         15,
//         { align: "center" }
//       )

//       // Sub Header
//       doc.setFontSize(12)
//       doc.setTextColor(0, 0, 0)
//       doc.text("(ADMINISTRATIVE SANCTIONS)", pageWidth / 2, 22, {
//         align: "center",
//       })

//       // Report Information
//       doc.setFontSize(9)
//       doc.setFont("helvetica", "normal")
//       const generatedText = `Generated On: ${currentDateTime}`
//       const textWidth = doc.getTextWidth(generatedText)
//       doc.text(generatedText, rightMargin - textWidth, 30)

//       // Prepare table data
//       const tableData = budgetData.map(district => [
//         district.slNo.toString(),
//         district.district,
//         `₹${formatNumber(district.budgetReleased, 2)}`,
//         `₹${formatNumber(district.expenditure, 2)}`,
//         `₹${formatNumber(district.gstexpenditure, 2)}`,
//         `₹${formatNumber(district.balance, 2)}`,
//         district.expenditurePercent,
//       ])

//       // Add total row
//       tableData.push([
//         "",
//         "GRAND TOTAL",
//         `₹${formatNumber(totals.budgetReleased, 2)}`,
//         `₹${formatNumber(totals.expenditure, 2)}`,
//         `₹${formatNumber(totals.gstexpenditure, 2)}`,
//         `₹${formatNumber(totals.balance, 2)}`,
//         `${((totals.expenditure / totals.budgetReleased) * 100).toFixed(2)}%`,
//       ])

//       // Create table
//       autoTable(doc, {
//         startY: 40,
//         head: [
//           [
//             { content: "SI. No", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "District", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "Budget Released (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "Expenditure (Exc.Tax) (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "Expenditure (Inc.GST) (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "Balance (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
//             { content: "% of Expenditure", styles: { halign: "center", fillColor: [41, 128, 185] } },
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
//           cellPadding: 3,
//           overflow: "linebreak",
//         },
//         columnStyles: {
//           0: { cellWidth: 15, halign: "center" }, // SI. No
//           1: { cellWidth: 30, halign: "left" },   // District
//           2: { cellWidth: 30, halign: "right" },  // Budget Released
//           3: { cellWidth: 30, halign: "right" },  // Expenditure (Inc.GST)
//           4: { cellWidth: 30, halign: "right" },  // Expenditure (Exc.Tax)
//           5: { cellWidth: 30, halign: "right" },  // Balance
//           6: { cellWidth: 25, halign: "center" }, // % of Expenditure
//         },
//         margin: { left: leftMargin, right: 10 },
//         styles: {
//           cellPadding: 2,
//           fontSize: 8,
//           valign: "middle",
//         },
//         didDrawPage: function (data) {
//           // Footer with page number
//           doc.setFontSize(8)
//           doc.setTextColor(150, 150, 150)
//           doc.text(
//             `Page ${doc.internal.getNumberOfPages()}`,
//             pageWidth / 2,
//             pageHeight - 10,
//             { align: "center" }
//           )
//         },
//         willDrawCell: function (data) {
//           // Highlight total row
//           if (data.row.index === tableData.length - 1) {
//             doc.setFillColor(220, 230, 241)
//             data.cell.styles.fillColor = [220, 230, 241]
//             data.cell.styles.fontStyle = "bold"
//             data.cell.styles.textColor = [0, 0, 0]
//           }
//         },
//       })

//       // Save PDF
//       const fileName = `District_Budget_Utilization_Report_${
//         new Date().toISOString().split("T")[0]
//       }.pdf`
//       doc.save(fileName)

//       toast.success("PDF report generated successfully!")
//     } catch (error) {
//       console.error("Error generating PDF:", error)
//       toast.error("Failed to generate PDF report")
//     }
//   }, [budgetData, totals])

//   // CSV report configuration
//   const csvReport = useMemo(
//     () => ({
//       filename: `District_Budget_Utilization_${new Date().toISOString().split("T")[0]}.csv`,
//       data: csvData,
//       headers: [
//         { label: "SI. No", key: "SI. No" },
//         { label: "District", key: "District" },
//         { label: "Budget Released (₹)", key: "Budget Released (₹)" },
//         { label: "Expenditure (Exc.Tax) (₹)", key: "Expenditure (Exc.Tax) (₹)" },
//         { label: "Expenditure (Inc.GST) (₹)", key: "Expenditure (Inc.GST) (₹)" },
//         { label: "Balance (₹)", key: "Balance (₹)" },
//         { label: "% of Expenditure", key: "% of Expenditure" },
//       ],
//     }),
//     [csvData]
//   )

//   // Filter data based on search term
//   const filteredData = useMemo(() => {
//     if (!searchTerm) return budgetData
//     const term = searchTerm.toLowerCase()
//     return budgetData.filter(item =>
//       item.district?.toLowerCase().includes(term)
//     )
//   }, [budgetData, searchTerm])

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchBudgetUtilization()
//   }, [fetchBudgetUtilization])

//   // Calculate overall expenditure percentage
//   const overallExpenditurePercent = useMemo(() => {
//     if (totals.budgetReleased === 0) return "0.00%"
//     const percentage = (totals.expenditure / totals.budgetReleased) * 100
//     return `${percentage.toFixed(2)}%`
//   }, [totals])

//   // Calculate GST amount (difference between expenditure with GST and without GST)
//   const totalGST = useMemo(() => {
//     return totals.expenditure - totals.gstexpenditure
//   }, [totals])

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
//               <p className="mt-2">Loading budget utilization report...</p>
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
//             {/* Header and Controls */}
//             <Row className="mb-3">
//               <Col md={6}>
//                 <div className="d-flex align-items-center">
//                   <h4 className="mb-0 text-primary">
//                     <i className="bx bx-bar-chart-alt-2 me-2"></i>
//                     District Wise Budget Utilization Report
//                   </h4>
//                 </div>
//                 <p className="text-muted mb-0">
//                   As on {getCurrentDateTime()}
//                 </p>
//               </Col>
//               <Col md={6}>
//                 <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
//                   <div style={{ minWidth: "250px" }}>
//                     <Input
//                       type="search"
//                       placeholder="Search district..."
//                       value={searchTerm}
//                       onChange={e => setSearchTerm(e.target.value)}
//                       className="form-control"
//                     />
//                   </div>
//                   <Button
//                     color="danger"
//                     onClick={generatePDF}
//                     className="me-2"
//                     disabled={budgetData.length === 0}
//                   >
//                     <i className="bx bxs-file-pdf me-1"></i>
//                     Export to PDF
//                   </Button>
//                   <CSVLink
//                     {...csvReport}
//                     className="btn btn-success"
//                     disabled={budgetData.length === 0}
//                   >
//                     <i className="bx bx-file me-1"></i>
//                     Export to Excel
//                   </CSVLink>
//                 </div>
//               </Col>
//             </Row>

//             {/* Summary Cards */}
//             <Row className="mb-4">
//               <Col md={3}>
//                 <Card className="border-primary border-top-3">
//                   <CardBody className="py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="text-muted mb-1">Total Budget Released</h6>
//                         <h4 className="mb-0 text-primary">
//                           {formatCurrency(totals.budgetReleased)}
//                         </h4>
//                       </div>
//                       <div className="avatar-sm">
//                         <span className="avatar-title bg-primary rounded-circle">
//                           <i className="bx bx-rupee"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card className="border-success border-top-3">
//                   <CardBody className="py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="text-muted mb-1">Total Expenditure (Inc.GST)</h6>
//                         <h4 className="mb-0 text-success">
//                           {formatCurrency(totals.expenditure)}
//                         </h4>
//                       </div>
//                       <div className="avatar-sm">
//                         <span className="avatar-title bg-success rounded-circle">
//                           <i className="bx bx-money"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card className="border-warning border-top-3">
//                   <CardBody className="py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="text-muted mb-1">Total Expenditure (Exc.Tax)</h6>
//                         <h4 className="mb-0 text-warning">
//                           {formatCurrency(totals.gstexpenditure)}
//                         </h4>
//                       </div>
//                       <div className="avatar-sm">
//                         <span className="avatar-title bg-warning rounded-circle">
//                           <i className="bx bx-money"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//               <Col md={3}>
//                 <Card className="border-info border-top-3">
//                   <CardBody className="py-2">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="text-muted mb-1">Overall Expenditure %</h6>
//                         <h4 className="mb-0 text-info">{overallExpenditurePercent}</h4>
//                       </div>
//                       <div className="avatar-sm">
//                         <span className="avatar-title bg-info rounded-circle">
//                           <i className="bx bx-pie-chart-alt"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Data Table */}
//             <div className="table-responsive">
//               <Table hover className="table-bordered mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th className="text-center" style={{ width: "5%" }}>SI. No</th>
//                     <th className="text-start" style={{ width: "20%" }}>District</th>
//                     <th className="text-end" style={{ width: "15%" }}>Budget Released (₹)</th>
//                     <th className="text-end" style={{ width: "15%" }}>Expenditure (Exc.Tax) (₹)</th>
//                     <th className="text-end" style={{ width: "15%" }}>Expenditure (Inc.GST) (₹)</th>
//                     <th className="text-end" style={{ width: "15%" }}>Balance (₹)</th>
//                     <th className="text-center" style={{ width: "10%" }}>% of Expenditure</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.length > 0 ? (
//                     <>
//                       {filteredData.map((district) => (
//                         <tr key={`${district.slNo}-${district.district}`}>
//                           <td className="text-center fw-semibold">{district.slNo}</td>
//                           <td className="text-start">{district.district}</td>
//                           <td className="text-end fw-semibold">
//                             {formatNumber(district.budgetReleased, 2)}
//                           </td>
//                           <td className="text-end fw-semibold">
//                             {formatNumber(district.gstexpenditure, 2)}
//                           </td>
//                           <td className="text-end fw-semibold">
//                             {formatNumber(district.expenditure, 2)}
//                           </td>
//                           <td className="text-end fw-semibold">
//                             {formatNumber(district.balance, 2)}
//                           </td>
//                           <td className="text-center">
//                             <span className={`badge ${
//                               parseFloat(district.expenditurePercent) >= 100 
//                                 ? "bg-danger" 
//                                 : parseFloat(district.expenditurePercent) >= 95 
//                                 ? "bg-success" 
//                                 : parseFloat(district.expenditurePercent) >= 80 
//                                 ? "bg-warning" 
//                                 : "bg-secondary"
//                             }`}>
//                               {district.expenditurePercent}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
                      
//                       {/* Grand Total Row */}
//                       <tr className="table-active">
//                         <td className="text-center fw-bold"></td>
//                         <td className="text-start fw-bold">GRAND TOTAL</td>
//                         <td className="text-end fw-bold">
//                           {formatNumber(totals.budgetReleased, 2)}
//                         </td>
//                         <td className="text-end fw-bold">
//                           {formatNumber(totals.expenditure, 2)}
//                         </td>
//                         <td className="text-end fw-bold">
//                           {formatNumber(totals.gstexpenditure, 2)}
//                         </td>
//                         <td className="text-end fw-bold">
//                           {formatNumber(totals.balance, 2)}
//                         </td>
//                         <td className="text-center fw-bold">
//                           <span className="badge bg-primary">
//                             {overallExpenditurePercent}
//                           </span>
//                         </td>
//                       </tr>
//                     </>
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center py-4">
//                         {searchTerm
//                           ? "No matching districts found"
//                           : "No budget utilization data available"}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>

//             {/* Additional Information */}
//             <Row className="mt-3">
//               <Col md={12}>
//                 <div className="alert alert-info mb-0 p-2">
//                   <div className="d-flex align-items-center">
//                     <i className="bx bx-info-circle me-2 fs-5"></i>
//                     <div>
//                       <small className="d-block">
//                         <strong>Note:</strong> Expenditure (Inc.GST) includes Goods and Services Tax, 
//                         while Expenditure (Exc.Tax) shows the net amount before tax.
//                       </small>
//                       <small className="d-block mt-1">
//                         <strong>Total GST Amount:</strong> ₹{formatNumber(totalGST, 2)}
//                       </small>
//                     </div>
//                   </div>
//                 </div>
//               </Col>
//             </Row>
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
  // State Management
  const [budgetData, setBudgetData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false) // For search operation loading
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(true) // Show filters by default
  const [csvData, setCsvData] = useState([])
  
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

  const [totals, setTotals] = useState({
    budgetReleased: 0,
    expenditure: 0,
    gstexpenditure: 0,
    balance: 0,
  })

  // Ref to track initial mount
  const isInitialMount = useRef(true)

  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
  const token = authUser?.token

  // Format number utility function
  const formatNumber = (num, decimals = 2) => {
    const number = parseFloat(num)
    if (isNaN(number)) return decimals === 0 ? "0" : "0.00"
    return number.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  // Format currency with Indian numbering system
  const formatCurrency = (amount) => {
    const num = parseFloat(amount)
    if (isNaN(num)) return "₹0.00"
    
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`
    } else {
      return `₹${formatNumber(num, 2)}`
    }
  }

  // Get current date and time for report
  const getCurrentDateTime = () => {
    const now = new Date()
    return now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // API Functions for Filters
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
      }
      return []
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error("Failed to fetch financial years")
      return []
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

  // Fetch budget utilization data
  const fetchBudgetUtilization = useCallback(async (customFilters = null, customFinancialYearId = null) => {
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
        URLS.DistrictWiseBudgetUtilization,
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
        const data = response.data.data || []
        
        // Separate regular districts and total row
        const districts = data.filter(item => item.slNo !== "")
        const totalRow = data.find(item => item.slNo === "")
        
        setBudgetData(districts)
        
        // Calculate totals from total row or sum individual districts
        if (totalRow) {
          setTotals({
            budgetReleased: totalRow.budgetReleased || 0,
            expenditure: totalRow.expenditure || 0,
            gstexpenditure: totalRow.gstexpenditure || 0,
            balance: totalRow.balance || 0,
          })
        } else {
          // Calculate totals manually if no total row provided
          const calculatedTotals = districts.reduce(
            (acc, district) => ({
              budgetReleased: acc.budgetReleased + (parseFloat(district.budgetReleased) || 0),
              expenditure: acc.expenditure + (parseFloat(district.expenditure) || 0),
              gstexpenditure: acc.gstexpenditure + (parseFloat(district.gstexpenditure) || 0),
              balance: acc.balance + (parseFloat(district.balance) || 0),
            }),
            { budgetReleased: 0, expenditure: 0, gstexpenditure: 0, balance: 0 }
          )
          setTotals(calculatedTotals)
        }

        // Prepare CSV data
        const csvRows = districts.map(district => ({
          "SI. No": district.slNo,
          District: district.district,
          "Budget Released (₹)": formatNumber(district.budgetReleased, 2),
          "Expenditure (Exc.Tax) (₹)": formatNumber(district.gstexpenditure, 2),
          "Expenditure (Inc.GST) (₹)": formatNumber(district.expenditure, 2),
          "Balance (₹)": formatNumber(district.balance, 2),
          "% of Expenditure": district.expenditurePercent,
        }))

        // Add total row to CSV
        if (totalRow) {
          csvRows.push({
            "SI. No": "",
            District: "GRAND TOTAL",
            "Budget Released (₹)": formatNumber(totalRow.budgetReleased, 2),
            "Expenditure (Exc.Tax) (₹)": formatNumber(totalRow.gstexpenditure, 2),
            "Expenditure (Inc.GST) (₹)": formatNumber(totalRow.expenditure, 2),
            "Balance (₹)": formatNumber(totalRow.balance, 2),
            "% of Expenditure": totalRow.expenditurePercent,
          })
        }

        setCsvData(csvRows)
      } else {
        throw new Error(response.data?.message || "Failed to fetch data")
      }
    } catch (error) {
      console.error("Error fetching budget utilization data:", error)
      toast.error(error.message || "Failed to fetch budget utilization data")
      setBudgetData([])
      setCsvData([])
      setTotals({ budgetReleased: 0, expenditure: 0, gstexpenditure: 0, balance: 0 })
    } finally {
      setIsDataLoading(false)
    }
  }, [token, filters, selectedFinancialYearId])

  // Generate PDF report
  const generatePDF = useCallback(() => {
    if (budgetData.length === 0) {
      toast.warning("No data to export to PDF")
      return
    }

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const currentDateTime = getCurrentDateTime()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const leftMargin = 10
      const rightMargin = pageWidth - 10

      // Get current financial year text
      const financialYearText = getCurrentFinancialYearText()
      const quarterName = getCurrentQuarterName()
      const schemeName = getCurrentSchemeName()

      // Report Header
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 128)
      doc.setFont("helvetica", "bold")
      doc.text(
        "DISTRICT WISE BUDGET RELEASE AND EXPENDITURE DETAILS",
        pageWidth / 2,
        15,
        { align: "center" }
      )

      // Sub Header with filter details
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      
      let subHeaderText = "Financial Year: " + financialYearText
      if (quarterName) subHeaderText += " | Quarter: " + quarterName
      if (schemeName) subHeaderText += " | Scheme: " + schemeName
      
      doc.text(subHeaderText, pageWidth / 2, 22, { align: "center" })

      // Report Information
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      const generatedText = `Generated On: ${currentDateTime}`
      const textWidth = doc.getTextWidth(generatedText)
      doc.text(generatedText, rightMargin - textWidth, 30)

      // Prepare table data
      const tableData = budgetData.map(district => [
        district.slNo.toString(),
        district.district,
        `₹${formatNumber(district.budgetReleased, 2)}`,
        `₹${formatNumber(district.expenditure, 2)}`,
        `₹${formatNumber(district.gstexpenditure, 2)}`,
        `₹${formatNumber(district.balance, 2)}`,
        district.expenditurePercent,
      ])

      // Add total row
      tableData.push([
        "",
        "GRAND TOTAL",
        `₹${formatNumber(totals.budgetReleased, 2)}`,
        `₹${formatNumber(totals.expenditure, 2)}`,
        `₹${formatNumber(totals.gstexpenditure, 2)}`,
        `₹${formatNumber(totals.balance, 2)}`,
        `${((totals.expenditure / totals.budgetReleased) * 100).toFixed(2)}%`,
      ])

      // Create table
      autoTable(doc, {
        startY: 40,
        head: [
          [
            { content: "SI. No", styles: { halign: "center", fillColor: [41, 128, 185] } },
            { content: "District", styles: { halign: "center", fillColor: [41, 128, 185] } },
            { content: "Budget Released (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
            { content: "Expenditure (Exc.Tax) (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
            { content: "Expenditure (Inc.GST) (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
            { content: "Balance (₹)", styles: { halign: "center", fillColor: [41, 128, 185] } },
            { content: "% of Expenditure", styles: { halign: "center", fillColor: [41, 128, 185] } },
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
          cellPadding: 3,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" }, // SI. No
          1: { cellWidth: 30, halign: "left" },   // District
          2: { cellWidth: 30, halign: "right" },  // Budget Released
          3: { cellWidth: 30, halign: "right" },  // Expenditure (Inc.GST)
          4: { cellWidth: 30, halign: "right" },  // Expenditure (Exc.Tax)
          5: { cellWidth: 30, halign: "right" },  // Balance
          6: { cellWidth: 25, halign: "center" }, // % of Expenditure
        },
        margin: { left: leftMargin, right: 10 },
        styles: {
          cellPadding: 2,
          fontSize: 8,
          valign: "middle",
        },
        didDrawPage: function (data) {
          // Footer with page number
          doc.setFontSize(8)
          doc.setTextColor(150, 150, 150)
          doc.text(
            `Page ${doc.internal.getNumberOfPages()}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
          )
        },
        willDrawCell: function (data) {
          // Highlight total row
          if (data.row.index === tableData.length - 1) {
            doc.setFillColor(220, 230, 241)
            data.cell.styles.fillColor = [220, 230, 241]
            data.cell.styles.fontStyle = "bold"
            data.cell.styles.textColor = [0, 0, 0]
          }
        },
      })

      // Save PDF
      const fileName = `District_Budget_Utilization_Report_${financialYearText}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
      doc.save(fileName)

      toast.success("PDF report generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF report")
    }
  }, [budgetData, totals])

  // CSV report configuration
  const csvReport = useMemo(
    () => ({
      filename: `District_Budget_Utilization_${new Date().toISOString().split("T")[0]}.csv`,
      data: csvData,
      headers: [
        { label: "SI. No", key: "SI. No" },
        { label: "District", key: "District" },
        { label: "Budget Released (₹)", key: "Budget Released (₹)" },
        { label: "Expenditure (Exc.Tax) (₹)", key: "Expenditure (Exc.Tax) (₹)" },
        { label: "Expenditure (Inc.GST) (₹)", key: "Expenditure (Inc.GST) (₹)" },
        { label: "Balance (₹)", key: "Balance (₹)" },
        { label: "% of Expenditure", key: "% of Expenditure" },
      ],
    }),
    [csvData]
  )

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return budgetData
    const term = searchTerm.toLowerCase()
    return budgetData.filter(item =>
      item.district?.toLowerCase().includes(term)
    )
  }, [budgetData, searchTerm])

  // Calculate overall expenditure percentage
  const overallExpenditurePercent = useMemo(() => {
    if (totals.budgetReleased === 0) return "0.00%"
    const percentage = (totals.expenditure / totals.budgetReleased) * 100
    return `${percentage.toFixed(2)}%`
  }, [totals])

  // Calculate GST amount (difference between expenditure with GST and without GST)
  const totalGST = useMemo(() => {
    return totals.expenditure - totals.gstexpenditure
  }, [totals])

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
    setBudgetData([])
    setCsvData([])
    setTotals({ budgetReleased: 0, expenditure: 0, gstexpenditure: 0, balance: 0 })

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
    setBudgetData([])
    setCsvData([])
    setTotals({ budgetReleased: 0, expenditure: 0, gstexpenditure: 0, balance: 0 })
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
    
    fetchBudgetUtilization(filters, selectedFinancialYearId)
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
    setBudgetData([])
    setCsvData([])
    setTotals({ budgetReleased: 0, expenditure: 0, gstexpenditure: 0, balance: 0 })
    
    // Clear search term
    setSearchTerm("")
    
    toast.info("All filters have been reset")
  }

  // Helper functions
  const getCurrentFinancialYearText = () => {
    if (!selectedFinancialYearId || financialYears.length === 0) return "N/A"
    
    const currentYear = financialYears.find(
      year => year._id === selectedFinancialYearId
    )
    return currentYear ? currentYear.year : "N/A"
  }

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

  // Select Styles (same as GroupsReport)
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
      setIsLoading(true)
      try {
        await fetchFinancialYears()
      } catch (error) {
        console.error("Error initializing financial years:", error)
        toast.error("Failed to initialize financial years")
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [fetchFinancialYears])

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

        {/* Main Report Card */}
        {budgetData.length > 0 ? (
          <Card>
            <CardBody>
              {/* Header and Controls */}
              <Row className="mb-3">
                <Col md={6}>
                  <div className="d-flex align-items-center">
                    <h4 className="mb-0 text-primary">
                      <i className="bx bx-bar-chart-alt-2 me-2"></i>
                      District Wise Budget Utilization Report
                    </h4>
                  </div>
                  <p className="text-muted mb-0">
                    {selectedFinancialYearId && (
                      <>
                        Financial Year: {getCurrentFinancialYearText()} | 
                        Quarter: {getCurrentQuarterName()} | 
                        Scheme: {getCurrentSchemeName()} |
                      </>
                    )}
                    Generated on: {getCurrentDateTime()}
                  </p>
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
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
                    <Button
                      color="danger"
                      onClick={generatePDF}
                      className="me-2"
                      disabled={budgetData.length === 0}
                    >
                      <i className="bx bxs-file-pdf me-1"></i>
                      Export to PDF
                    </Button>
                    <CSVLink
                      {...csvReport}
                      className="btn btn-success"
                      style={{
                        pointerEvents: budgetData.length === 0 ? "none" : "auto",
                        opacity: budgetData.length === 0 ? 0.65 : 1,
                        textDecoration: "none",
                      }}
                    >
                      <i className="bx bx-file me-1"></i>
                      Export to Excel
                    </CSVLink>
                  </div>
                </Col>
              </Row>

              {/* Summary Cards */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="border-primary border-top-3">
                    <CardBody className="py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1">Total Budget Released</h6>
                          <h4 className="mb-0 text-primary">
                            {formatCurrency(totals.budgetReleased)}
                          </h4>
                        </div>
                        <div className="avatar-sm">
                          <span className="avatar-title bg-primary rounded-circle">
                            <i className="bx bx-rupee"></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="border-success border-top-3">
                    <CardBody className="py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1">Total Expenditure (Inc.GST)</h6>
                          <h4 className="mb-0 text-success">
                            {formatCurrency(totals.expenditure)}
                          </h4>
                        </div>
                        <div className="avatar-sm">
                          <span className="avatar-title bg-success rounded-circle">
                            <i className="bx bx-money"></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="border-warning border-top-3">
                    <CardBody className="py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1">Total Expenditure (Exc.Tax)</h6>
                          <h4 className="mb-0 text-warning">
                            {formatCurrency(totals.gstexpenditure)}
                          </h4>
                        </div>
                        <div className="avatar-sm">
                          <span className="avatar-title bg-warning rounded-circle">
                            <i className="bx bx-money"></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="border-info border-top-3">
                    <CardBody className="py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1">Overall Expenditure %</h6>
                          <h4 className="mb-0 text-info">{overallExpenditurePercent}</h4>
                        </div>
                        <div className="avatar-sm">
                          <span className="avatar-title bg-info rounded-circle">
                            <i className="bx bx-pie-chart-alt"></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Data Table */}
              <div className="table-responsive">
                <Table hover className="table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center" style={{ width: "5%" }}>SI. No</th>
                      <th className="text-start" style={{ width: "20%" }}>District</th>
                      <th className="text-end" style={{ width: "15%" }}>Budget Released (₹)</th>
                      <th className="text-end" style={{ width: "15%" }}>Expenditure (Exc.Tax) (₹)</th>
                      <th className="text-end" style={{ width: "15%" }}>Expenditure (Inc.GST) (₹)</th>
                      <th className="text-end" style={{ width: "15%" }}>Balance (₹)</th>
                      <th className="text-center" style={{ width: "10%" }}>% of Expenditure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      <>
                        {filteredData.map((district) => (
                          <tr key={`${district.slNo}-${district.district}`}>
                            <td className="text-center fw-semibold">{district.slNo}</td>
                            <td className="text-start">{district.district}</td>
                            <td className="text-end fw-semibold">
                              {formatNumber(district.budgetReleased, 2)}
                            </td>
                            <td className="text-end fw-semibold">
                              {formatNumber(district.gstexpenditure, 2)}
                            </td>
                            <td className="text-end fw-semibold">
                              {formatNumber(district.expenditure, 2)}
                            </td>
                            <td className="text-end fw-semibold">
                              {formatNumber(district.balance, 2)}
                            </td>
                            <td className="text-center">
                              <span className={`badge ${
                                parseFloat(district.expenditurePercent) >= 100 
                                  ? "bg-danger" 
                                  : parseFloat(district.expenditurePercent) >= 95 
                                  ? "bg-success" 
                                  : parseFloat(district.expenditurePercent) >= 80 
                                  ? "bg-warning" 
                                  : "bg-secondary"
                              }`}>
                                {district.expenditurePercent}
                              </span>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Grand Total Row */}
                        <tr className="table-active">
                          <td className="text-center fw-bold"></td>
                          <td className="text-start fw-bold">GRAND TOTAL</td>
                          <td className="text-end fw-bold">
                            {formatNumber(totals.budgetReleased, 2)}
                          </td>
                          <td className="text-end fw-bold">
                            {formatNumber(totals.expenditure, 2)}
                          </td>
                          <td className="text-end fw-bold">
                            {formatNumber(totals.gstexpenditure, 2)}
                          </td>
                          <td className="text-end fw-bold">
                            {formatNumber(totals.balance, 2)}
                          </td>
                          <td className="text-center fw-bold">
                            <span className="badge bg-primary">
                              {overallExpenditurePercent}
                            </span>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          {searchTerm
                            ? "No matching districts found"
                            : "No budget utilization data available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Additional Information */}
              <Row className="mt-3">
                <Col md={12}>
                  <div className="alert alert-info mb-0 p-2">
                    <div className="d-flex align-items-center">
                      <i className="bx bx-info-circle me-2 fs-5"></i>
                      <div>
                        <small className="d-block">
                          <strong>Note:</strong> Expenditure (Inc.GST) includes Goods and Services Tax, 
                          while Expenditure (Exc.Tax) shows the net amount before tax.
                        </small>
                        <small className="d-block mt-1">
                          <strong>Total GST Amount:</strong> ₹{formatNumber(totalGST, 2)}
                        </small>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        ) : (
          // Empty State - Show only when no data
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
                    disabled={!selectedFinancialYearId || !filters.schemeId || !filters.quarterId}
                  >
                    <i className="bx bx-search me-1"></i>
                    Search Report
                  </Button>
                  <Button color="light" onClick={handleReset}>
                    <i className="bx bx-reset me-1"></i>
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AbstractReport