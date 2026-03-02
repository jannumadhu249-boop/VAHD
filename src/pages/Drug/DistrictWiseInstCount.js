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
//                     <th> DVAHO</th>
//                     <th>AVH</th>
//                     <th>DVH</th>
//                     <th>PVC</th>
//                     <th>SC(AH)</th>
//                     <th>SSVH</th>
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
//                           {formatPercentage(item.percentIndents)}
//                         </td>
//                         <td className="fw-bold">
//                           {formatPercentage(item.percentIndents)}
//                         </td>
//                         <td className="fw-bold">
//                           {formatPercentage(item.percentIndents)}
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


import React, { useState, useEffect, useCallback, useMemo } from "react"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
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
  Spinner,
} from "reactstrap"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const AbstractReport = () => {
  const [districtData, setDistrictData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [csvData, setCsvData] = useState([])

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

  // Get current financial year (keeping this utility as it might be useful for PDF export)
  const getCurrentFinancialYearText = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    if (currentMonth >= 4) {
      return `${currentYear}-${(currentYear + 1).toString().slice(2)}`
    } else {
      return `${currentYear - 1}-${currentYear.toString().slice(2)}`
    }
  }

  // Fetch district institution count data
  const fetchDistrictInstitutionCount = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await axios.post(
        URLS.GetDistrictWiseInstitutionsCount,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data) {
        const data = response?.data?.data || []
        const reportDate = response?.data?.reportDate || new Date().toISOString()
        const count = response?.data?.count || data.length

        // Transform data to match table structure
        const transformedData = data.map((item, index) => ({
          id: item.district || `district-${index}`,
          district: item.district || "-",
          DVAHO: item.DVAHO || 0,
          SSVH: item.SSVH || 0,
          DVH: item.DVH || 0,
          AVH: item.AVH || 0,
          PVC: item.PVC || 0,
          "SC(AH)": item["SC(AH)"] || item.SCAH || 0,
          total: item.total || 0,
          // For backward compatibility with existing code structure
          totalInstitutions: item.total || 0,
          reportDate: reportDate,
        }))

        setDistrictData(transformedData)

        // Prepare CSV data
        const csvRows = transformedData.map((item, index) => ({
          "SI. No": index + 1,
          District: item.district || "-",
          DVAHO: formatNumber(item.DVAHO),
          SSVH: formatNumber(item.SSVH),
          DVH: formatNumber(item.DVH),
          AVH: formatNumber(item.AVH),
          PVC: formatNumber(item.PVC),
          "SC(AH)": formatNumber(item["SC(AH)"]),
          Total: formatNumber(item.total),
        }))

        setCsvData(csvRows)
      } else {
        throw new Error("Failed to fetch data")
      }
    } catch (error) {
      console.error("Error fetching district institution count:", error)
      toast.error(error.message || "Failed to fetch district institution data")
      setDistrictData([])
      setCsvData([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Generate PDF
  const generatePDF = useCallback(() => {
    if (districtData.length === 0) {
      toast.warning("No data to export to PDF")
      return
    }

    try {
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

      // Get report date from first data item if available
      const reportDate = districtData[0]?.reportDate 
        ? new Date(districtData[0].reportDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : formattedDate

      const financialYearText = getCurrentFinancialYearText()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const leftMargin = 15
      const rightMargin = pageWidth - 15

      // Header
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 128)
      doc.setFont("helvetica", "bold")
      doc.text(
        "DISTRICT WISE INSTITUTION COUNT",
        pageWidth / 2,
        15,
        { align: "center" }
      )

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`AS ON ${reportDate.toUpperCase()}`, pageWidth / 2, 22, {
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
      const tableData = districtData.map((item, index) => [
        (index + 1).toString(),
        item.district || "-",
        formatNumber(item.DVAHO),
        formatNumber(item.SSVH),
        formatNumber(item.DVH),
        formatNumber(item.AVH),
        formatNumber(item.PVC),
        formatNumber(item["SC(AH)"]),
        formatNumber(item.total),
      ])

      // Create table
      autoTable(doc, {
        startY: startY,
        head: [
          [
            {
              content: "SI. No",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "District",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
            {
              content: "DVAHO",
              styles: { halign: "center", fillColor: [41, 128, 185] },
            },
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
          1: { cellWidth: 35, halign: "left" }, // District
          2: { cellWidth: 20, halign: "center" }, // DVAHO
          3: { cellWidth: 20, halign: "center" }, // SSVH
          4: { cellWidth: 20, halign: "center" }, // DVH
          5: { cellWidth: 20, halign: "center" }, // AVH
          6: { cellWidth: 20, halign: "center" }, // PVC
          7: { cellWidth: 25, halign: "center" }, // SC(AH)
          8: { cellWidth: 20, halign: "center" }, // Total
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
      const fileName = `District_Institution_Count_${
        currentDate.toISOString().split("T")[0]
      }.pdf`
      doc.save(fileName)

      toast.success("PDF generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
    }
  }, [districtData])

  // CSV report configuration
  const csvReport = useMemo(
    () => ({
      filename: `District_Institution_Count_${new Date().toISOString().split("T")[0]}.csv`,
      data: csvData,
      headers: [
        { label: "SI. No", key: "SI. No" },
        { label: "District", key: "District" },
        { label: "DVAHO", key: "DVAHO" },
        { label: "SSVH", key: "SSVH" },
        { label: "DVH", key: "DVH" },
        { label: "AVH", key: "AVH" },
        { label: "PVC", key: "PVC" },
        { label: "SC(AH)", key: "SC(AH)" },
        { label: "Total", key: "Total" },
      ],
    }),
    [csvData]
  )

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return districtData
    const term = searchTerm.toLowerCase()
    return districtData.filter(item =>
      item.district?.toLowerCase().includes(term)
    )
  }, [districtData, searchTerm])

  // Calculate totals from data (excluding the last "Total" row if present)
  const calculatedTotals = useMemo(() => {
    const dataWithoutTotalRow = districtData.filter(item => item.district !== "Total")
    
    return {
      DVAHO: dataWithoutTotalRow.reduce((sum, item) => sum + (parseFloat(item.DVAHO) || 0), 0),
      SSVH: dataWithoutTotalRow.reduce((sum, item) => sum + (parseFloat(item.SSVH) || 0), 0),
      DVH: dataWithoutTotalRow.reduce((sum, item) => sum + (parseFloat(item.DVH) || 0), 0),
      AVH: dataWithoutTotalRow.reduce((sum, item) => sum + (parseFloat(item.AVH) || 0), 0),
      PVC: dataWithoutTotalRow.reduce((sum, item) => sum + (parseFloat(item.PVC) || 0), 0),
      "SC(AH)": dataWithoutTotalRow.reduce((sum, item) => sum + (parseFloat(item["SC(AH)"]) || 0), 0),
      total: dataWithoutTotalRow.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0),
    }
  }, [districtData])

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchDistrictInstitutionCount()
    } else {
      toast.error("Authentication token not found")
    }
  }, [fetchDistrictInstitutionCount, token])

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
              <p className="mt-2">Loading district institution data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md={12}>
                <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
                  <Button
                    color="danger"
                    onClick={generatePDF}
                    className="me-2"
                    disabled={districtData.length === 0}
                  >
                    <i className="bx bxs-file-pdf me-1"></i>
                    Export to PDF
                  </Button>
                  <CSVLink
                    {...csvReport}
                    className="btn btn-success me-2"
                    disabled={districtData.length === 0}
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
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <div className="text-center mb-3">
              <h2 className="text-primary mb-2">
                DISTRICT WISE INSTITUTION COUNT
              </h2>
              <h4 className="text-muted">
                TOTAL DISTRICTS: {districtData.filter(item => item.district !== "Total").length}
              </h4>
            </div>

            <div className="table-responsive">
              <Table hover className="table-bordered mb-4">
                <thead>
                  <tr className="text-center table-primary">
                    <th>SI. No</th>
                    <th>District</th>
                    <th>DVAHO</th>
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
                    <>
                      {filteredData.map((item, index) => (
                        <tr 
                          key={item.id || index} 
                          className={`text-center ${item.district === "Total" ? "table-success fw-bold" : ""}`}
                        >
                          <td className="fw-bold">{index + 1}</td>
                          <td className="text-start fw-bold">
                            {item.district || "-"}
                          </td>
                          <td>{formatNumber(item.DVAHO)}</td>
                          <td>{formatNumber(item.SSVH)}</td>
                          <td>{formatNumber(item.DVH)}</td>
                          <td>{formatNumber(item.AVH)}</td>
                          <td>{formatNumber(item.PVC)}</td>
                          <td>{formatNumber(item["SC(AH)"])}</td>
                          <td className="fw-bold">{formatNumber(item.total)}</td>
                        </tr>
                      ))}
                      
                      {/* Display calculated totals if API doesn't provide a Total row */}
                      {!districtData.some(item => item.district === "Total") && (
                        <tr className="table-success fw-bold text-center">
                          <td colSpan="2" className="text-end">Total</td>
                          <td>{formatNumber(calculatedTotals.DVAHO)}</td>
                          <td>{formatNumber(calculatedTotals.SSVH)}</td>
                          <td>{formatNumber(calculatedTotals.DVH)}</td>
                          <td>{formatNumber(calculatedTotals.AVH)}</td>
                          <td>{formatNumber(calculatedTotals.PVC)}</td>
                          <td>{formatNumber(calculatedTotals["SC(AH)"])}</td>
                          <td>{formatNumber(calculatedTotals.total)}</td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
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
      </div>
    </div>
  )
}

export default AbstractReport