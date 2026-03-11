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
import { control } from "leaflet"

const DetailAttendanceReportWithTime = () => {
    // Get roles from localStorage
    var gets = localStorage.getItem("authUser")
    var data = JSON.parse(gets)
    var Roles = data?.rolesAndPermission?.[0] ?? { accessAll: true }
    var token = data?.token

    // State
    const [reportData, setReportData] = useState([])
    const [loading, setLoading] = useState(false)
    const [districtOptions, setDistrictOptions] = useState([])
    const [placeOfWorkingOptions, setPlaceOfWorkingOptions] = useState([])

    const [filters, setFilters] = useState({
        districtid: null,
        institutionId: null,
        present: null,
        date: new Date().toISOString().split('T')[0],
        time: "",
    })

    const presentOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ]

    const timeOptions = [
        { value:"09:00 AM – 10:00 AM" , label: "09:00 AM - 10:00 AM"},
        { value:"10:00 AM – 11:00 AM" , label: "10:00 AM - 11:00 AM"},
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

    // Fetch district dropdown options on mount
    useEffect(() => {
        axios
            .get(URLS.GetDistrict, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const options = (res.data?.data || []).map(d => ({
                    value: d._id,
                    label: d.name,
                }))
                setDistrictOptions(options)
            })
            .catch(() => { })
    }, [])

    // Fetch place of working when district changes
    useEffect(() => {
        if (!filters.districtid) {
            setPlaceOfWorkingOptions([])
            return
        }
        axios
            //(URLS.GetInstitutionBygetPlaceOfWorking,
            .post(URLS.GetAllPlaceOfWorking, { districtId: filters.districtid }, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const all = res.data?.data || res.data?.placeofworkings || []
                const filtered = all
                    .map(p => ({
                        value: p._id,
                        label: p.name,
                    }))
                setPlaceOfWorkingOptions(filtered)
            })
            .catch(() => { })
    }, [filters.districtid])

    // Fetch report data
    const fetchReport = () => {
        if (!filters.date) {
            toast.warning("Please select a date")
            return
        }
        setLoading(true)
        const payload = {
            Date: filters.date,
            ...(filters.districtid ? { districtid: filters.districtid } : {}),
            ...(filters.institutionId ? { institutionId: filters.institutionId } : {}),
            ...(filters.present ? { search: filters.present.value } : {}),
            timeSlot:filters.time?.value || "",
        }
        axios
            .post(URLS.GetDetailAttendanceReport, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => {
                const rows = (res.data?.data || []).map((item, idx) => ({
                    id: idx + 1,
                    district: item.district || "-",
                    empId: item.employeeId || "-",
                    name: item.name || "-",
                    designation: item.designationName || "-",
                    institution: item.placeOfWorking || "-",
                    registered: item.register === true ? "Yes" : item.register === false ? "No" : "-",
                    present: item.present || "-",
                }))
                setReportData(rows)
                if (!rows.length) toast.info("No records found for the selected filters")
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || "Failed to fetch report data")
            })
            .finally(() => setLoading(false))
    }

    const handleReset = () => {
        setFilters({ districtid: null, institutionId: null, present: null, date: "", timeSlot: '' })
        setReportData([])
        setPlaceOfWorkingOptions([])
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
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
            const pageWidth = doc.internal.pageSize.width
            const pageHeight = doc.internal.pageSize.height
            const marginLeft = 14
            const marginRight = 14

            doc.setFontSize(16)
            doc.setTextColor(0, 0, 128)
            doc.setFont(undefined, "bold")
            doc.text("DETAIL ATTENDANCE REPORT", pageWidth / 2, 15, { align: "center" })

            let filterText = ""
            if (filters.date) {
                const dateObj = new Date(filters.date)
                const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj.getFullYear()}`
                filterText += `Date: ${formattedDate} `
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

            const headers = ["Sl. No.", "Name of the District", "Employee ID", "Name", "Designation", "Institution", "Registered in App", "Present"]
            const tableRows = reportData.map((row, index) => [
                (index + 1).toString(),
                row.district,
                row.empId,
                row.name,
                row.designation,
                row.institution,
                row.registered,
                row.present,
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

            doc.save(`Detail_Attendance_Report_${new Date().toISOString().split("T")[0]}.pdf`)
            toast.success("PDF exported successfully!")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error("Failed to generate PDF")
        }
    }

    // CSV Export config
    const csvReport = {
        filename: `Detail_Attendance_Report_${new Date().toISOString().split("T")[0]}.csv`,
        data: reportData,
        headers: [
            { label: "Sl. No.", key: "id" },
            { label: "Name of the District", key: "district" },
            { label: "Employee ID", key: "empId" },
            { label: "Name", key: "name" },
            { label: "Designation", key: "designation" },
            { label: "Institution", key: "institution" },
            { label: "Registered in App", key: "registered" },
            { label: "Present", key: "present" },
        ],
    }

    return (
        <React.Fragment>
            {(Roles?.DetailAttendanceReportView === true || Roles?.accessAll === true) && (
                <div className="page-content">
                    <div className="container-fluid">
                        <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Detail Attendance Report" />

                        {/* Filters Section */}
                        <Row className="mb-3">
                            <Col md={12}>
                                <Card style={styles.card}>
                                    <CardBody className="p-3">
                                        <div className="d-flex flex-wrap gap-3 align-items-end">
                                            {/* District */}
                                            <div style={{ minWidth: "230px" }}>
                                                <Label style={styles.filterLabel}>District</Label>
                                                <Select
                                                    options={districtOptions}
                                                    value={districtOptions.find(opt => opt.value === filters.districtid) || null}
                                                    onChange={opt => setFilters(prev => ({ ...prev, districtid: opt ? opt.value : null, institutionId: null }))}
                                                    placeholder="Select District"
                                                    isClearable
                                                    styles={{ control: base => ({ ...base, minHeight: "34px", fontSize: "13px" }) }}
                                                />
                                            </div>
                                            {/* Place of Working */}
                                            <div style={{ minWidth: "280px" }}>
                                                <Label style={styles.filterLabel}>Place of Working</Label>
                                                <Select
                                                    options={placeOfWorkingOptions}
                                                    value={placeOfWorkingOptions.find(opt => opt.value === filters.institutionId) || null}
                                                    onChange={opt => setFilters(prev => ({ ...prev, institutionId: opt ? opt.value : null }))}
                                                    placeholder="Select Place of Working"
                                                    isClearable
                                                    isDisabled={!filters.districtid}
                                                    styles={{ control: base => ({ ...base, minHeight: "34px", fontSize: "13px" }) }}
                                                />
                                            </div>
                                            {/* Present */}
                                            <div style={{ minWidth: "150px" }}>
                                                <Label style={styles.filterLabel}>Present (Yes/No)</Label>
                                                <Select
                                                    options={presentOptions}
                                                    value={filters.present}
                                                    onChange={opt => setFilters(prev => ({ ...prev, present: opt || null }))}
                                                    placeholder="Select Status"
                                                    isClearable
                                                    styles={{ control: base => ({ ...base, minHeight: "34px", fontSize: "13px" }) }}
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
                                            {/* Date */}
                                            <div style={{ minWidth: "150px" }}>
                                                <Label style={styles.filterLabel}>Date <span className="text-danger">*</span></Label>
                                                <Input
                                                    type="date"
                                                    name="date"
                                                    value={filters.date}
                                                    onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
                                                    style={{ height: "34px", fontSize: "13px" }}
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
                                                <h4 style={{ fontWeight: "bold", fontSize: "24px", margin: 0 }}>Detail Attendance Report</h4>
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
                                                            <th onClick={() => requestSort('id')}>Sl. No. {getSortIcon('id')}</th>
                                                            <th onClick={() => requestSort('district')}>Name of the District {getSortIcon('district')}</th>
                                                            <th onClick={() => requestSort('empId')}>Employee ID {getSortIcon('empId')}</th>
                                                            <th onClick={() => requestSort('name')}>Name {getSortIcon('name')}</th>
                                                            <th onClick={() => requestSort('designation')}>Designation {getSortIcon('designation')}</th>
                                                            <th onClick={() => requestSort('institution')}>Institution {getSortIcon('institution')}</th>
                                                            {/* <th onClick={() => requestSort('registered')}>Registered in App {getSortIcon('registered')}</th> */}
                                                            <th onClick={() => requestSort('present')}>Present {getSortIcon('present')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedData.length > 0 ? (
                                                            sortedData.map((row, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{row.district}</td>
                                                                    <td>{row.empId}</td>
                                                                    <td>{row.name}</td>
                                                                    <td>{row.designation}</td>
                                                                    <td>{row.institution}</td>
                                                                    <td>{row.registered}</td>
                                                                    {/* <td>
                                                                        <span className={`badge ${row.present === "Yes" ? "bg-success" : "bg-danger"}`}>
                                                                            {row.present}
                                                                        </span>
                                                                    </td> */}
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={8} className="text-center text-muted py-4">
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

export default DetailAttendanceReportWithTime