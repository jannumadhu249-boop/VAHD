import React, { useState, useEffect, useCallback, useMemo } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import { toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"
import Select from "react-select"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    Label,
    Button,
    Badge,
    Spinner,
} from "reactstrap"

function AttendanceReport() {
    const GetAuth = localStorage.getItem("authUser")
    const TokenJson = JSON.parse(GetAuth)
    const TokenData = TokenJson.token

    // State Management
    const [attendanceData, setAttendanceData] = useState([])
    const [csvData, setCsvData] = useState([])
    const [loading, setLoading] = useState(false)
    const [exportLoading, setExportLoading] = useState(false)
    const [viewMode, setViewMode] = useState("report") // 'report' | 'abstract'
    const [abstractData, setAbstractData] = useState([])

    // Filters State
    const [districts, setDistricts] = useState([])
    const [institutions, setInstitutions] = useState([])
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        districtid: "",
        institutionId: "",
        fromDate: "",
        toDate: "",
        sortType: "",
    })

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(100)
    const [totalItems, setTotalItems] = useState(0)

    // Modal State
    const [modal, setModal] = useState(false)
    const [selectedAttendance, setSelectedAttendance] = useState(null)

    // Fetch Districts
    const fetchDistricts = useCallback(async () => {
        try {
            const response = await axios.get(URLS.GetDistrict, {
                headers: { Authorization: `Bearer ${TokenData}` },
            })
            setDistricts(response.data.data || [])
        } catch (error) {
            console.error("Failed to load districts:", error)
            toast.error("Failed to load Districts")
        }
    }, [TokenData])

    // Fetch Institutions based on District
    const fetchInstitutions = useCallback(async (districtId = "") => {
        try {
            const payload = districtId ? { districtId } : {}
            const response = await axios.post(
                URLS.GetAllPlaceOfWorking || URLS.GetPlaceOfWorking,
                payload,
                { headers: { Authorization: `Bearer ${TokenData}` } }
            )
            setInstitutions(response.data.data || [])
        } catch (error) {
            console.error("Failed to load Institutions:", error)
            toast.error("Failed to load Institutions")
        }
    }, [TokenData])

    // Format date from DD-MM-YYYY to YYYY-MM-DD for input fields
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return ""
        const [day, month, year] = dateStr.split("-")
        return `${year}-${month}-${day}`
    }

    // Format date from YYYY-MM-DD to DD-MM-YYYY for API
    const formatDateForAPI = (dateStr) => {
        if (!dateStr) return ""
        const [year, month, day] = dateStr.split("-")
        return `${day}-${month}-${year}`
    }

    // Format date for display
    const formatDateForDisplay = (dateStr) => {
        if (!dateStr) return "N/A"
        const [year, month, day] = dateStr.split("-")
        return `${day}/${month}/${year}`
    }

    // Get current month range (1st to current date) as default
    const getCurrentMonthRange = () => {
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

        const formatForInput = (date) => {
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return `${year}-${month}-${day}`
        }

        return {
            fromDate: formatForInput(firstDay),
            toDate: formatForInput(today)
        }
    }

    // Fetch Attendance Report (existing API)
    const fetchAttendanceReport = useCallback(async () => {
        if (!filters.fromDate || !filters.toDate) {
            toast.error("Please select both From Date and To Date")
            return
        }

        setLoading(true)
        try {
            const payload = {
                districtid: filters.districtid || "",
                institutionId: filters.institutionId || "",
                fromDate: formatDateForAPI(filters.fromDate),
                toDate: formatDateForAPI(filters.toDate),
                sortType: filters.sortType || ""
            }

            const response = await axios.post(
                URLS.AttendanceReport,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${TokenData}`,
                        'Content-Type': 'application/json'
                    },
                }
            )

            if (response.data.status) {
                const data = response.data.data || []
                setAttendanceData(data)
                setTotalItems(data.length)

                // Prepare CSV data
                const csvExportData = data.map(item => ({
                    "S.No": item.sNo,
                    "Employee ID": item.employeeId,
                    "Name": item.name,
                    "District": item.district,
                    "Place of Working": item.placeOfWorking,
                    "Present Days": item.present,
                    "Absent Days": item.absent,
                    "Leave Days": item.leaves,
                    "Total Days": item.total,
                    "Attendance Rate": `${item.total > 0 ? Math.round((item.present / item.total) * 100) : 0}%`
                }))
                setCsvData(csvExportData)
            } else {
                toast.error("Failed to load attendance data")
                setAttendanceData([])
                setCsvData([])
            }
        } catch (error) {
            console.error("Error fetching attendance report:", error)
            toast.error(error.response?.data?.message || "Failed to load attendance data")
            setAttendanceData([])
            setCsvData([])
        } finally {
            setLoading(false)
        }
    }, [TokenData, filters])

    // Get Dates in Range Helper (returns YYYY-MM-DD)
    const getDatesInRange = (startDate, endDate) => {
        const date = new Date(startDate)
        const end = new Date(endDate)
        const dates = []
        while (date <= end) {
            dates.push(new Date(date).toISOString().split('T')[0])
            date.setDate(date.getDate() + 1)
        }
        return dates
    }

    // Fetch Abstract Report – uses the two new APIs
    const fetchAbstractReport = useCallback(async () => {
        if (!filters.fromDate || !filters.toDate) {
            toast.error("Please select both From Date and To Date")
            return
        }
        setLoading(true)
        setAbstractData([]) // Clear previous data

        try {
            const isSingleDay = filters.fromDate === filters.toDate
            const url = isSingleDay ? URLS.GetSingleDayAbstract : URLS.GetMultipleDaysAbstract
            const payload = {
                fromDate: filters.fromDate, // already YYYY-MM-DD
                toDate: filters.toDate,
            }

            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${TokenData}`,
                    'Content-Type': 'application/json'
                },
            })

            if (response.data.status) {
                let data = response.data.data || []

                // Filter out null or unknown districts for single day abstract
                data = data.filter(item => item.district && item.district.toLowerCase() !== 'unknown')

                setAbstractData(data)
            } else {
                toast.error(response.data.message || "Failed to load abstract data")
                setAbstractData([])
            }
        } catch (error) {
            console.error("Error fetching abstract report:", error)
            toast.error(error.response?.data?.message || "Failed to load abstract data")
            setAbstractData([])
        } finally {
            setLoading(false)
        }
    }, [TokenData, filters.fromDate, filters.toDate])

    // Export to Excel for Report view
    const handleReportExportToExcel = async () => {
        setExportLoading(true)
        try {
            setTimeout(() => {
                document.querySelector('.csv-download-link')?.click()
                setExportLoading(false)
            }, 500)
        } catch (error) {
            console.error("Export error:", error)
            setExportLoading(false)
        }
    }

    // Prepare CSV data for Abstract view
    const getAbstractCsvData = useCallback(() => {
        if (!abstractData.length) return []
        const isSingleDay = filters.fromDate === filters.toDate

        if (isSingleDay) {
            return abstractData.map(row => ({
                District: row.district || "Unknown",
                "Present IN": row.presentIn || 0,
                "Present OUT": row.presentOut || 0,
                "Present Total": (row.presentIn || 0) + (row.presentOut || 0)
            }))
        } else {
            const dates = getDatesInRange(filters.fromDate, filters.toDate)
            return abstractData.map(row => {
                const obj = { District: row.district || "Unknown" }
                dates.forEach(date => {
                    obj[formatDateForDisplay(date)] = row[date] || 0
                })
                return obj
            })
        }
    }, [abstractData, filters.fromDate, filters.toDate])

    // Export to Excel for Abstract view
    const handleAbstractExportToExcel = () => {
        if (!abstractData.length) {
            toast.error("No data to export")
            return
        }
        setExportLoading(true)
        try {
            const csvData = getAbstractCsvData()
            const headers = Object.keys(csvData[0] || {}).map(key => ({ label: key, key }))
            const filename = `Attendance_Abstract_${filters.fromDate}_to_${filters.toDate}.csv`
            // We'll use a hidden CSVLink
            // Since we can't use CSVLink directly in a handler, we'll create a blob and trigger download
            const csvContent = [
                headers.map(h => h.label).join(','),
                ...csvData.map(row => headers.map(h => row[h.key]).join(','))
            ].join('\n')
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error("Export error:", error)
            toast.error("Failed to export Excel")
        } finally {
            setExportLoading(false)
        }
    }

    // PDF Export for Report view
    const handleReportPdfExport = () => {
        if (!attendanceData.length) {
            toast.error("No data to export")
            return
        }
        try {
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
            const pageWidth = doc.internal.pageSize.width
            const pageHeight = doc.internal.pageSize.height
            const marginLeft = 14
            const marginRight = 14

            // Title
            doc.setFontSize(16)
            doc.setTextColor(0, 0, 128)
            doc.setFont(undefined, "bold")
            doc.text("ATTENDANCE REPORT", pageWidth / 2, 15, { align: "center" })

            // Date range
            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont(undefined, "normal")
            if (filters.fromDate && filters.toDate) {
                doc.text(`Period: ${formatDateForDisplay(filters.fromDate)} - ${formatDateForDisplay(filters.toDate)}`, pageWidth / 2, 22, { align: "center" })
            }

            const generatedText = `Generated On: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
            doc.text(generatedText, pageWidth - marginRight, 30, { align: "right" })

            // Table headers
            const headers = ["S.No", "Employee ID", "Name", "District", "Place of Working", "Present", "Absent", "Leave", "Total", "Attendance %"]

            // Table data
            const tableRows = attendanceData.map((data, index) => [
                (data.sNo || index + 1).toString(),
                data.employeeId || "N/A",
                data.name || "N/A",
                data.district || "N/A",
                data.placeOfWorking || "N/A",
                (data.present || 0).toString(),
                (data.absent || 0).toString(),
                (data.leaves || 0).toString(),
                (data.total || 0).toString(),
                `${data.total > 0 ? Math.round((data.present / data.total) * 100) : 0}%`,
            ])

            autoTable(doc, {
                startY: 35,
                head: [headers],
                body: tableRows,
                theme: "grid",
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold", fontSize: 9, halign: "center" },
                bodyStyles: { fontSize: 8, cellPadding: 2 },
                styles: { valign: "middle", overflow: "linebreak" },
                margin: { left: marginLeft, right: marginRight },
                didDrawPage: function () {
                    doc.setFontSize(8)
                    doc.setTextColor(150, 150, 150)
                    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: "center" })
                },
            })

            // Summary
            const finalY = doc.lastAutoTable.finalY + 10
            doc.setFontSize(10)
            doc.setFont(undefined, "bold")
            doc.setTextColor(0, 0, 0)
            doc.text(`Total Records: ${attendanceData.length}`, marginLeft, finalY)

            const fileName = `Attendance_Report_${filters.fromDate}_to_${filters.toDate}.pdf`
            doc.save(fileName)
            toast.success("PDF exported successfully!")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error("Failed to generate PDF")
        }
    }

    // PDF Export for Abstract view
    const handleAbstractPdfExport = () => {
        if (!abstractData.length) {
            toast.error("No data to export")
            return
        }
        try {
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
            const pageWidth = doc.internal.pageSize.width
            const pageHeight = doc.internal.pageSize.height
            const marginLeft = 14
            const marginRight = 14
            const isSingleDay = filters.fromDate === filters.toDate

            // Title
            doc.setFontSize(16)
            doc.setTextColor(0, 0, 128)
            doc.setFont(undefined, "bold")
            doc.text("ATTENDANCE ABSTRACT", pageWidth / 2, 15, { align: "center" })

            // Date range
            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont(undefined, "normal")
            if (filters.fromDate && filters.toDate) {
                doc.text(`Period: ${formatDateForDisplay(filters.fromDate)} - ${formatDateForDisplay(filters.toDate)}`, pageWidth / 2, 22, { align: "center" })
            }

            const generatedText = `Generated On: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
            doc.text(generatedText, pageWidth - marginRight, 30, { align: "right" })

            // Prepare headers and data
            let headers, rows
            if (isSingleDay) {
                headers = ["District", "Present IN", "Present OUT", "Present Total"]
                rows = abstractData.map(row => [
                    row.district || "Unknown",
                    (row.presentIn || 0).toString(),
                    (row.presentOut || 0).toString(),
                    ((row.presentIn || 0) + (row.presentOut || 0)).toString()
                ])
                // Add grand total row
                const totalIn = abstractData.reduce((sum, r) => sum + (r.presentIn || 0), 0)
                const totalOut = abstractData.reduce((sum, r) => sum + (r.presentOut || 0), 0)
                rows.push([
                    "Grand Total",
                    totalIn.toString(),
                    totalOut.toString(),
                    (totalIn + totalOut).toString()
                ])
            } else {
                const dates = getDatesInRange(filters.fromDate, filters.toDate)
                headers = ["District", ...dates.map(d => formatDateForDisplay(d))]
                rows = abstractData.map(row => [
                    row.district || "Unknown",
                    ...dates.map(date => (row[date] || 0).toString())
                ])
                // Add grand total row
                const totals = dates.map(date =>
                    abstractData.reduce((sum, row) => sum + (row[date] || 0), 0)
                )
                rows.push(["Grand Total", ...totals.map(t => t.toString())])
            }

            autoTable(doc, {
                startY: 35,
                head: [headers],
                body: rows,
                theme: "grid",
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold", fontSize: 9, halign: "center" },
                bodyStyles: { fontSize: 8, cellPadding: 2 },
                styles: { valign: "middle", overflow: "linebreak" },
                margin: { left: marginLeft, right: marginRight },
                didDrawPage: function () {
                    doc.setFontSize(8)
                    doc.setTextColor(150, 150, 150)
                    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: "center" })
                },
            })

            const fileName = `Attendance_Abstract_${filters.fromDate}_to_${filters.toDate}.pdf`
            doc.save(fileName)
            toast.success("PDF exported successfully!")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error("Failed to generate PDF")
        }
    }

    // Handle Filter Changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDistrictChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : ""
        setFilters(prev => ({
            ...prev,
            districtid: value,
            institutionId: "", // Reset institution when district changes
        }))
        fetchInstitutions(value)
    }

    const handleInstitutionChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : ""
        setFilters(prev => ({
            ...prev,
            institutionId: value,
        }))
    }

    // Handle Search
    const handleSearch = () => {
        if (!filters.fromDate || !filters.toDate) {
            toast.error("Please select both From Date and To Date")
            return
        }
        setCurrentPage(0) // Reset to first page
        if (viewMode === "report") {
            fetchAttendanceReport()
        } else {
            fetchAbstractReport()
        }
    }

    // Handle Reset Filters
    const handleReset = () => {
        const resetFilters = {
            districtid: "",
            institutionId: "",
            fromDate: "",
            toDate: "",
            sortType: "",
        }
        setFilters(resetFilters)
        setCurrentPage(0)
        setAttendanceData([])
        setAbstractData([])
        setCsvData([])
    }

    // Handle Current Month Filter
    const handleCurrentMonth = () => {
        const { fromDate, toDate } = getCurrentMonthRange()
        setFilters(prev => ({
            ...prev,
            fromDate,
            toDate
        }))
    }

    // View Attendance Details
    const viewAttendanceDetails = (attendance) => {
        setSelectedAttendance(attendance)
        setModal(true)
    }

    // Close Modal
    const closeModal = () => {
        setSelectedAttendance(null)
        setModal(false)
    }

    // Get Status Badge Color
    const getStatusColor = (present, total) => {
        if (total === 0) return "secondary"
        const percentage = (present / total) * 100
        if (percentage >= 80) return "success"
        if (percentage >= 60) return "warning"
        return "danger"
    }

    // React Select Options
    const districtOptions = useMemo(
        () => districts.map(district => ({
            value: district._id,
            label: district.name,
        })),
        [districts]
    )

    const institutionOptions = useMemo(
        () => institutions.map(inst => ({
            value: inst._id || inst.id,
            label: inst.name,
        })),
        [institutions]
    )

    const sortOptions = [
        { value: "ascending", label: "Ascending" },
        { value: "descending", label: "Descending" },
    ]

    // Pagination Calculations
    const pageCount = Math.ceil(totalItems / itemsPerPage)
    const offset = currentPage * itemsPerPage
    const currentItems = attendanceData.slice(offset, offset + itemsPerPage)

    // Handle Page Change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected)
    }

    // Initialize Component
    useEffect(() => {
        fetchDistricts()
        fetchInstitutions()
        // Set current month as default
        const { fromDate, toDate } = getCurrentMonthRange()
        setFilters(prev => ({ ...prev, fromDate, toDate }))
    }, [fetchDistricts, fetchInstitutions])

    // 🔥 NEW: Auto-fetch abstract report when dates change in abstract mode
    useEffect(() => {
        if (viewMode === "abstract" && filters.fromDate && filters.toDate) {
            fetchAbstractReport();
        }
    }, [viewMode, filters.fromDate, filters.toDate, fetchAbstractReport]);

    // CSS Styles
    const styles = {
        card: {
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            backgroundColor: "#fff",
        },
        tableHeader: {
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #dee2e6",
        },
        statusBadge: {
            fontSize: "11px",
            fontWeight: "600",
            padding: "4px 8px",
            borderRadius: "4px",
        },
        filterSection: {
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "16px",
        },
        filterLabel: {
            fontSize: "12px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "4px",
            display: "block",
        },
        actionButton: {
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "4px",
        },
    }

    // CSV Export Configuration for Report view
    const csvReport = {
        filename: `Attendance_Report_${filters.fromDate}_to_${filters.toDate}.csv`,
        data: csvData,
        headers: [
            { label: "S.No", key: "S.No" },
            { label: "Employee ID", key: "Employee ID" },
            { label: "Name", key: "Name" },
            { label: "District", key: "District" },
            { label: "Place of Working", key: "Place of Working" },
            { label: "Present Days", key: "Present Days" },
            { label: "Absent Days", key: "Absent Days" },
            { label: "Leave Days", key: "Leave Days" },
            { label: "Total Days", key: "Total Days" },
            { label: "Attendance Rate", key: "Attendance Rate" },
        ],
        onClick: () => true,
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs
                        title="VAHD ADMIN"
                        breadcrumbItem="Attendance Report"
                    />

                    {/* Unified Toolbar Section */}
                    <Row className="mb-3">
                        <Col md={12}>
                            <Card style={styles.card}>
                                <CardBody className="p-3">
                                    <div className="d-flex flex-wrap gap-3 align-items-end">
                                        {/* View Toggles */}
                                        <div className="btn-group">
                                            <Button
                                                color={viewMode === "report" ? "primary" : "outline-primary"}
                                                onClick={() => {
                                                    setViewMode("report")
                                                    setAttendanceData([])
                                                    setAbstractData([])
                                                }}
                                                size="sm"
                                                active={viewMode === "report"}
                                            >
                                                Report
                                            </Button>
                                            <Button
                                                color={viewMode === "abstract" ? "primary" : "outline-primary"}
                                                onClick={() => {
                                                    setViewMode("abstract")
                                                    setAttendanceData([])
                                                    setAbstractData([])
                                                }}
                                                size="sm"
                                                active={viewMode === "abstract"}
                                            >
                                                Abstract
                                            </Button>
                                        </div>

                                        {/* Filters */}
                                        <div style={{ minWidth: "150px" }}>
                                            <Label style={styles.filterLabel}>From Date</Label>
                                            <Input
                                                type="date"
                                                name="fromDate"
                                                value={filters.fromDate}
                                                onChange={handleFilterChange}
                                                style={{ height: "34px", fontSize: "13px" }}
                                            />
                                        </div>
                                        <div style={{ minWidth: "150px" }}>
                                            <Label style={styles.filterLabel}>To Date</Label>
                                            <Input
                                                type="date"
                                                name="toDate"
                                                value={filters.toDate}
                                                onChange={handleFilterChange}
                                                style={{ height: "34px", fontSize: "13px" }}
                                            />
                                        </div>

                                        {viewMode === "report" && (
                                            <>
                                                <div style={{ minWidth: "180px" }}>
                                                    <Label style={styles.filterLabel}>District</Label>
                                                    <Select
                                                        options={districtOptions}
                                                        value={districtOptions.find(opt => opt.value === filters.districtid) || null}
                                                        onChange={handleDistrictChange}
                                                        placeholder="District"
                                                        isClearable
                                                        styles={{ control: (base) => ({ ...base, minHeight: "34px", fontSize: "13px" }) }}
                                                    />
                                                </div>
                                                <div style={{ minWidth: "180px" }}>
                                                    <Label style={styles.filterLabel}>Institution</Label>
                                                    <Select
                                                        options={institutionOptions}
                                                        value={institutionOptions.find(opt => opt.value === filters.institutionId) || null}
                                                        onChange={handleInstitutionChange}
                                                        placeholder="Institution"
                                                        isClearable
                                                        isDisabled={!filters.districtid}
                                                        styles={{ control: (base) => ({ ...base, minHeight: "34px", fontSize: "13px" }) }}
                                                    />
                                                </div>
                                                <div style={{ minWidth: "150px" }}>
                                                    <Label style={styles.filterLabel}>Sort Type</Label>
                                                    <Select
                                                        options={sortOptions}
                                                        value={sortOptions.find(opt => opt.value === filters.sortType) || null}
                                                        onChange={(selectedOption) => {
                                                            setFilters(prev => ({
                                                                ...prev,
                                                                sortType: selectedOption ? selectedOption.value : ""
                                                            }))
                                                        }}
                                                        placeholder="Sort"
                                                        isClearable
                                                        styles={{ control: (base) => ({ ...base, minHeight: "34px", fontSize: "13px" }) }}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Actions */}
                                        <div className="d-flex gap-2 ms-auto">
                                            <Button
                                                color="primary"
                                                onClick={handleSearch}
                                                disabled={loading}
                                                size="sm"
                                                style={styles.actionButton}
                                            >
                                                {loading ? <Spinner size="sm" /> : <i className="fas fa-search"></i>}
                                                Search
                                            </Button>
                                            <Button
                                                color="secondary"
                                                onClick={handleReset}
                                                size="sm"
                                                style={styles.actionButton}
                                            >
                                                <i className="fas fa-redo"></i>
                                                Reset
                                            </Button>

                                            {viewMode === "report" ? (
                                                <>
                                                    <Button
                                                        color="success"
                                                        onClick={handleReportExportToExcel}
                                                        disabled={exportLoading || csvData.length === 0}
                                                        size="sm"
                                                        style={styles.actionButton}
                                                    >
                                                        {exportLoading ? <Spinner size="sm" /> : <i className="fas fa-file-excel"></i>}
                                                        Excel
                                                    </Button>
                                                    {csvData.length > 0 && (
                                                        <CSVLink {...csvReport} className="csv-download-link" style={{ display: 'none' }} />
                                                    )}
                                                    <Button
                                                        color="danger"
                                                        onClick={handleReportPdfExport}
                                                        disabled={attendanceData.length === 0}
                                                        size="sm"
                                                        style={styles.actionButton}
                                                    >
                                                        <i className="bx bxs-file-pdf"></i>
                                                        PDF
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        color="success"
                                                        onClick={handleAbstractExportToExcel}
                                                        disabled={exportLoading || abstractData.length === 0}
                                                        size="sm"
                                                        style={styles.actionButton}
                                                    >
                                                        {exportLoading ? <Spinner size="sm" /> : <i className="fas fa-file-excel"></i>}
                                                        Excel
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        onClick={handleAbstractPdfExport}
                                                        disabled={abstractData.length === 0}
                                                        size="sm"
                                                        style={styles.actionButton}
                                                    >
                                                        <i className="bx bxs-file-pdf"></i>
                                                        PDF
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Main Content */}
                    <Row>
                        <Col md={12}>
                            <Card style={styles.card}>
                                <CardBody>
                                    {/* Header Section */}
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <h5 className="mb-0">
                                                {viewMode === "report" ? "Attendance Report" : "Attendance Abstract"}
                                                {(viewMode === "report" ? totalItems > 0 : abstractData.length > 0) && (
                                                    <Badge color="light" className="ms-2" style={{ fontSize: "12px" }}>
                                                        {viewMode === "report" ? totalItems : abstractData.length} Records
                                                    </Badge>
                                                )}
                                            </h5>
                                        </Col>
                                    </Row>
                                    {/* Data Table */}
                                    <div className="table-responsive">
                                        {viewMode === "report" ? (
                                            <Table hover className="mb-0">
                                                <thead style={styles.tableHeader}>
                                                    <tr>
                                                        <th className="text-center">S.No</th>
                                                        <th>Employee ID</th>
                                                        <th>Name</th>
                                                        <th>District</th>
                                                        <th>Place of Working</th>
                                                        <th className="text-center">Present</th>
                                                        <th className="text-center">Absent</th>
                                                        <th className="text-center">Leave</th>
                                                        <th className="text-center">Total</th>
                                                        <th className="text-center">Attendance %</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <tr>
                                                            <td colSpan="10" className="text-center py-5">
                                                                <Spinner color="primary" />
                                                                <p className="mt-2 text-muted">Loading attendance data...</p>
                                                            </td>
                                                        </tr>
                                                    ) : currentItems.length > 0 ? (
                                                        currentItems.map((data, index) => {
                                                            const attendancePercentage = data.total > 0
                                                                ? Math.round((data.present / data.total) * 100)
                                                                : 0
                                                            const statusColor = getStatusColor(data.present, data.total)

                                                            return (
                                                                <tr key={data.employeeId} className="align-middle">
                                                                    <td className="text-center">
                                                                        <strong>{data.sNo || index + 1 + offset}</strong>
                                                                    </td>
                                                                    <td>
                                                                        <code style={{ fontSize: "12px" }}>{data.employeeId}</code>
                                                                    </td>
                                                                    <td>
                                                                        <strong>{data.name}</strong>
                                                                    </td>
                                                                    <td>{data.district || "N/A"}</td>
                                                                    <td>{data.placeOfWorking || "N/A"}</td>
                                                                    <td className="text-center">
                                                                        <Badge color="success" style={styles.statusBadge}>
                                                                            {data.present}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Badge color="danger" style={styles.statusBadge}>
                                                                            {data.absent}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Badge color="warning" style={styles.statusBadge}>
                                                                            {data.leaves}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <strong>{data.total}</strong>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Badge color={statusColor} style={styles.statusBadge}>
                                                                            {attendancePercentage}%
                                                                        </Badge>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="10" className="text-center py-5">
                                                                <div className="text-muted">
                                                                    <i className="fas fa-clipboard-list fa-2x mb-3"></i>
                                                                    <h5>No attendance records found</h5>
                                                                    <p className="mb-0">
                                                                        {filters.fromDate && filters.toDate
                                                                            ? `No data available for the selected period (${formatDateForDisplay(filters.fromDate)} to ${formatDateForDisplay(filters.toDate)})`
                                                                            : "Please select date range and click Search"}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <Table hover className="mb-0 table-bordered">
                                                <thead style={styles.tableHeader}>
                                                    <tr>
                                                        <th>Districts</th>
                                                        {filters.fromDate === filters.toDate ? (
                                                            <>
                                                                <th className="text-center">Present IN</th>
                                                                <th className="text-center">Present OUT</th>
                                                                <th className="text-center">Present Total</th>
                                                            </>
                                                        ) : (
                                                            getDatesInRange(filters.fromDate, filters.toDate).map(date => (
                                                                <th key={date} className="text-center">
                                                                    {formatDateForDisplay(date)}
                                                                </th>
                                                            ))
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <tr>
                                                            <td colSpan={filters.fromDate === filters.toDate ? 4 : getDatesInRange(filters.fromDate, filters.toDate).length + 1} className="text-center py-5">
                                                                <Spinner color="primary" />
                                                                <p className="mt-2 text-muted">Loading abstract data...</p>
                                                            </td>
                                                        </tr>
                                                    ) : abstractData.length > 0 ? (
                                                        <>
                                                            {abstractData.map((row, index) => {
                                                                const presentIn = row.presentIn || 0
                                                                const presentOut = row.presentOut || 0
                                                                return (
                                                                    <tr key={index}>
                                                                        <td><strong>{row.district || "Unknown"}</strong></td>
                                                                        {filters.fromDate === filters.toDate ? (
                                                                            <>
                                                                                <td className="text-center">{presentIn}</td>
                                                                                <td className="text-center">{presentOut}</td>
                                                                                <td className="text-center"><strong>{presentIn + presentOut}</strong></td>
                                                                            </>
                                                                        ) : (
                                                                            getDatesInRange(filters.fromDate, filters.toDate).map(date => (
                                                                                <td key={date} className="text-center">{row[date] || 0}</td>
                                                                            ))
                                                                        )}
                                                                    </tr>
                                                                )
                                                            })}
                                                            {/* Grand Total Row */}
                                                            <tr className="table-light font-weight-bold">
                                                                <td><strong>Grand Total</strong></td>
                                                                {filters.fromDate === filters.toDate ? (
                                                                    <>
                                                                        <td className="text-center"><strong>{abstractData.reduce((sum, row) => sum + (row.presentIn || 0), 0)}</strong></td>
                                                                        <td className="text-center"><strong>{abstractData.reduce((sum, row) => sum + (row.presentOut || 0), 0)}</strong></td>
                                                                        <td className="text-center"><strong>{abstractData.reduce((sum, row) => sum + (row.presentIn || 0) + (row.presentOut || 0), 0)}</strong></td>
                                                                    </>
                                                                ) : (
                                                                    getDatesInRange(filters.fromDate, filters.toDate).map(date => (
                                                                        <td key={date} className="text-center">
                                                                            <strong>{abstractData.reduce((sum, row) => sum + (row[date] || 0), 0)}</strong>
                                                                        </td>
                                                                    ))
                                                                )}
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="100%" className="text-center py-5">
                                                                <div className="text-muted">
                                                                    <h5>No abstract data found</h5>
                                                                    <p>Please select a date range and click Search</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>

                                    {/* Pagination (Only for Report View) */}
                                    {viewMode === "report" && totalItems > itemsPerPage && (
                                        <div className="mt-4 d-flex justify-content-between align-items-center">
                                            <div className="text-muted small">
                                                Showing {offset + 1} to {Math.min(offset + itemsPerPage, totalItems)} of {totalItems} entries
                                            </div>
                                            <ReactPaginate
                                                previousLabel={<i className="fas fa-chevron-left"></i>}
                                                nextLabel={<i className="fas fa-chevron-right"></i>}
                                                breakLabel="..."
                                                pageCount={pageCount}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={3}
                                                onPageChange={handlePageChange}
                                                containerClassName="pagination pagination-sm mb-0"
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                activeClassName="active"
                                                forcePage={currentPage}
                                            />
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Attendance Details Modal */}
            <Modal isOpen={modal} toggle={closeModal} centered size="lg">
                <ModalHeader toggle={closeModal}>
                    Attendance Details - {selectedAttendance?.name}
                </ModalHeader>
                <ModalBody>
                    {selectedAttendance ? (
                        <div>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <h6 className="text-muted mb-1">Employee ID</h6>
                                    <p className="mb-2">{selectedAttendance.employeeId}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-muted mb-1">Place of Working</h6>
                                    <p className="mb-2">{selectedAttendance.placeOfWorking || "N/A"}</p>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="text-center p-3 bg-light rounded">
                                        <h2 className="text-success mb-0">{selectedAttendance.present}</h2>
                                        <small className="text-muted">Present Days</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 bg-light rounded">
                                        <h2 className="text-danger mb-0">{selectedAttendance.absent}</h2>
                                        <small className="text-muted">Absent Days</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 bg-light rounded">
                                        <h2 className="text-warning mb-0">{selectedAttendance.leaves}</h2>
                                        <small className="text-muted">Leave Days</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 bg-light rounded">
                                        <h2 className="text-primary mb-0">{selectedAttendance.total}</h2>
                                        <small className="text-muted">Total Days</small>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mt-4">
                                <h6 className="border-bottom pb-2">Attendance Summary</h6>
                                <p className="mb-1">
                                    <strong>Attendance Rate:</strong>{" "}
                                    <Badge color={getStatusColor(selectedAttendance.present, selectedAttendance.total)}>
                                        {selectedAttendance.total > 0
                                            ? Math.round((selectedAttendance.present / selectedAttendance.total) * 100)
                                            : 0}%
                                    </Badge>
                                </p>
                                <p className="mb-1">
                                    <strong>Period:</strong> {formatDateForDisplay(filters.fromDate)} to {formatDateForDisplay(filters.toDate)}
                                </p>
                                <p className="mb-0">
                                    <strong>District:</strong> {selectedAttendance.district || "N/A"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p>No details available</p>
                    )}
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default AttendanceReport