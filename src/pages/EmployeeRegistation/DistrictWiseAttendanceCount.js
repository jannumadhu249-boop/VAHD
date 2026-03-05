import React, { useState, useEffect, useMemo } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Select from "react-select"
import { Row, Col, Card, CardBody, Table, Label, Button, Input, Spinner } from "reactstrap"
import { CSVLink } from "react-csv"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "react-toastify"
import axios from "axios"
import { URLS } from "../../Url"

const DistrictWiseAttendanceCount = () => {
    // Get roles from localStorage
    var gets = localStorage.getItem("authUser")
    var data = JSON.parse(gets)
    var Roles = data?.rolesAndPermission?.[0] ?? { accessAll: true }
    var token = data?.token

    // State
    const [reportData, setReportData] = useState([])
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        time: "",
    })

    const timeOptions = [
        { value:"09:00 AM - 10:00 AM" , label: "09:00 AM - 10:00 AM"},
        { value:"10:00 AM - 11:00 AM" , label: "10:00 AM - 11:00 AM"},
        { value:"After 11:00 AM" , label: "After 11:00 AM"},
        
    ]

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    const sortedData = useMemo(() => {
        let sortableItems = [...reportData]
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] || ''
                const bValue = b[sortConfig.key] || ''
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }
        return sortableItems
    }, [reportData, sortConfig])

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <i className="bx bx-sort text-muted ms-1" style={{ opacity: 0.3 }}></i>
        return sortConfig.direction === 'asc'
            ? <i className="bx bx-sort-up text-dark ms-1"></i>
            : <i className="bx bx-sort-down text-dark ms-1"></i>
    }

    // Fetch report data on component mount and when filters change (manual search)
    const fetchReport = () => {
        if (!filters.date) {
            toast.warning("Please select a date")
            return
        }
        setLoading(true)

        const payload = {
            Date: filters.date,
            timeSlot:filters.time?.value || "",
        }

        axios
            .post(URLS.GetDistrictWiseAttendanceReport, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => {
                const rows = (res.data?.data || []).map((item, idx) => ({
                    id: idx + 1,
                    district: item.districtName || "-",
                    registered: item.register ?? 0,
                    present: item.present ?? 0,
                }))
                setReportData(rows)
                if (!rows.length) toast.info("No records found for the selected date")
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || "Failed to fetch district wise attendance count")
            })
            .finally(() => setLoading(false))
    }

    // Optional: Auto fetch on mount
    useEffect(() => {
        fetchReport()
    }, [])

    const handleReset = () => {
        setFilters({ date: new Date().toISOString().split('T')[0] })
        setFilters({timeSlot:''})
        // Optional: clear data or refetch on reset
    }

    const styles = {
        card: {
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            backgroundColor: "#fff",
        },
        filterLabel: {
            fontSize: "12px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "4px",
            display: "block",
        },
    }

    // PDF Export
    const handlePdfExport = () => {
        if (!reportData.length) {
            toast.error("No data to export")
            return
        }
        try {
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
            const pageWidth = doc.internal.pageSize.width
            const pageHeight = doc.internal.pageSize.height
            const marginLeft = 14
            const marginRight = 14

            doc.setFontSize(14)
            doc.setTextColor(0, 0, 128)
            doc.setFont(undefined, "bold")
            doc.text("DISTRICT WISE ATTENDANCE COUNT", pageWidth / 2, 15, { align: "center" })

            let filterText = ""
            if (filters.date) {
                const dateObj = new Date(filters.date)
                const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj.getFullYear()}`
                filterText += `Date: ${formattedDate}`
            }
            if (filterText) {
                doc.setFontSize(10)
                doc.setTextColor(0, 0, 0)
                doc.setFont(undefined, "normal")
                doc.text(filterText, marginLeft, 22, { align: "left" })
            }

            const generatedText = `Generated On: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
            doc.setFontSize(9)
            doc.text(generatedText, pageWidth - marginRight, 22, { align: "right" })

            const headers = ["Sl. No.", "District Name", "Registered", "Present"]

            // Calculate totals
            const totalRegistered = reportData.reduce((sum, row) => sum + (Number(row.registered) || 0), 0)
            const totalPresent = reportData.reduce((sum, row) => sum + (Number(row.present) || 0), 0)

            const tableRows = reportData.map((row, index) => [
                (index + 1).toString(),
                row.district,
                row.registered.toString(),
                row.present.toString(),
            ])

            // Add grand total row
            tableRows.push(["", "GRAND TOTAL", totalRegistered.toString(), totalPresent.toString()])

            autoTable(doc, {
                startY: 28,
                head: [headers],
                body: tableRows,
                theme: "grid",
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold", fontSize: 9, halign: "center" },
                bodyStyles: { fontSize: 8, cellPadding: 2 },
                styles: { valign: "middle", overflow: "linebreak" },
                columnStyles: {
                    0: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' },
                },
                willDrawCell: function (data) {
                    if (data.row.index === tableRows.length - 1 && data.section === 'body') {
                        doc.setFont(undefined, 'bold')
                        doc.setTextColor(0, 0, 0)
                        doc.setFillColor(240, 240, 240) // Light grey background for total row
                    }
                },
                margin: { left: marginLeft, right: marginRight },
                didDrawPage: function () {
                    doc.setFontSize(8)
                    doc.setTextColor(150, 150, 150)
                    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, pageHeight - 10, { align: "center" })
                },
            })

            doc.save(`District_Wise_Attendance_Count_${new Date().toISOString().split("T")[0]}.pdf`)
            toast.success("PDF exported successfully!")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error("Failed to generate PDF")
        }
    }

    // CSV Export config
    // Calculate totals for CSV
    const totalRegistered = reportData.reduce((sum, row) => sum + (Number(row.registered) || 0), 0)
    const totalPresent = reportData.reduce((sum, row) => sum + (Number(row.present) || 0), 0)

    const csvData = [
        ...reportData,
        { id: "", district: "GRAND TOTAL", registered: totalRegistered, present: totalPresent }
    ]

    const csvReport = {
        filename: `District_Wise_Attendance_Count_${new Date().toISOString().split("T")[0]}.csv`,
        data: csvData,
        headers: [
            { label: "Sl. No.", key: "id" },
            { label: "District Name", key: "district" },
            // { label: "Registered", key: "registered" },
            { label: "Present", key: "present" },
        ],
    }

    return (
        <React.Fragment>
            {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <div className="page-content">
                    <div className="container-fluid">
                        <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="District Wise Attendance Count" />

                        {/* Filters Section */}
                        <Row className="mb-3">
                            <Col md={12}>
                                <Card style={styles.card}>
                                    <CardBody className="p-3">
                                        <div className="d-flex flex-wrap gap-3 align-items-end">
                                            {/* Date */}
                                            <div style={{ minWidth: "200px" }}>
                                                <Label style={styles.filterLabel}>Date <span className="text-danger">*</span></Label>
                                                <Input
                                                    type="date"
                                                    name="date"
                                                    value={filters.date}
                                                    onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
                                                    style={{ height: "34px", fontSize: "13px" }}
                                                />
                                            </div>
                                            {/* Time */}
                                            <div style={{ minWidth: "150px" }}>
                                                <Label style={styles.filterLabel}>Time</Label>
                                                <Select
                                                    options={timeOptions}
                                                    value={filters.time}
                                                    onChange={opt => setFilters(prev => ({ ...prev, time: opt || null }))}
                                                    placeholder="Select Time"
                                                    isClearable
                                                    style={{ control: base => ({ ...base, minHeight: "34px", fontSize: "13px" }) }}
                                                />
                                            </div>
                                            {/* Buttons */}
                                            <div className="d-flex gap-2 ms-auto">
                                                <Button
                                                    color="primary"
                                                    onClick={fetchReport}
                                                    size="sm"
                                                    disabled={loading}
                                                    className="d-flex align-items-center rounded-1"
                                                    style={{ height: "34px", padding: "0 15px", fontSize: "13px" }}
                                                >
                                                    {loading ? <Spinner size="sm" className="me-1" /> : null}
                                                    Search
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={handleReset}
                                                    size="sm"
                                                    className="d-flex align-items-center rounded-1"
                                                    style={{ height: "34px", padding: "0 15px", fontSize: "13px" }}
                                                >
                                                    Reset
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        {/* Table Section */}
                        <Row>
                            <Col md={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex align-items-center justify-content-between mb-4 mt-2">
                                            <div style={{ width: "150px" }}></div>
                                            <div className="text-center">
                                                <h4 style={{ fontWeight: "bold", fontSize: "24px", margin: 0 }}>District Wise Attendance Count</h4>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <CSVLink
                                                    {...csvReport}
                                                    className={`btn btn-success d-flex align-items-center${!reportData.length ? " disabled" : ""}`}
                                                >
                                                    <i className="fas fa-file-excel me-2"></i> Export to Excel
                                                </CSVLink>
                                                <Button
                                                    color="danger"
                                                    onClick={handlePdfExport}
                                                    className="d-flex align-items-center"
                                                    disabled={!reportData.length}
                                                >
                                                    <i className="bx bxs-file-pdf me-2"></i> PDF
                                                </Button>
                                            </div>
                                        </div>

                                        {loading ? (
                                            <div className="text-center py-5">
                                                <Spinner color="primary" />
                                                <p className="mt-2 text-muted">Loading report...</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <Table bordered hover className="mb-0 text-center" style={{ borderCollapse: "collapse" }}>
                                                    <thead style={{ backgroundColor: "#c5e0b4", color: "#000" }}>
                                                        <tr style={{ cursor: "pointer" }}>
                                                            <th style={{ width: "10%" }} onClick={() => requestSort('id')}>Sl. No. {getSortIcon('id')}</th>
                                                            <th style={{ textAlign: "left" }} onClick={() => requestSort('district')}>District Name {getSortIcon('district')}</th>
                                                            {/* <th style={{ width: "20%" }} onClick={() => requestSort('registered')}>Registered {getSortIcon('registered')}</th> */}
                                                            <th style={{ width: "20%" }} onClick={() => requestSort('present')}>Present {getSortIcon('present')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedData.length > 0 ? (
                                                            <>
                                                                {sortedData.map((row, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td style={{ textAlign: "left" }}>{row.district}</td>
                                                                        {/* <td>{row.registered}</td> */}
                                                                        <td>
                                                                            <span className={`badge ${row.present > 0 ? "bg-success" : "bg-danger"}`}>
                                                                                {row.present}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {/* Grand Total Row */}
                                                                <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                                                                    <td></td>
                                                                    <td style={{ textAlign: "left" }}>GRAND TOTAL</td>
                                                                    {/* <td>{totalRegistered}</td> */}
                                                                    <td>{totalPresent}</td>
                                                                </tr>
                                                            </>
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4} className="text-center text-muted py-4">
                                                                    No data available. Please select filters and click Search.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default DistrictWiseAttendanceCount
