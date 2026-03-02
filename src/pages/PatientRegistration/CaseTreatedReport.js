import React, { useState, useEffect, useCallback, useMemo } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { URLS } from "../../Url"
import axios from "axios"
import Select from "react-select"
import { CSVLink } from "react-csv"
import {
    Row,
    Col,
    Card,
    CardBody,
    Label,
    Input,
    Button,
    Table,
    Spinner,
} from "reactstrap"
import { toast } from "react-toastify"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const CaseTreatedReport = () => {
    const [districts, setDistricts] = useState([])
    const [workingPlaces, setWorkingPlaces] = useState([])
    const [reportData, setReportData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(true)

    const [reportType, setReportType] = useState("detailed") // "detailed" or "abstract"

    const [filters, setFilters] = useState({
        districtId: "",
        institutionId: "",
        fromDate: "",
        toDate: "",
    })

    const GetAuth = localStorage.getItem("authUser")
    const TokenJson = JSON.parse(GetAuth || "{}")
    const TokenData = TokenJson.token
    const Roles = TokenJson?.rolesAndPermission?.[0]

    if (!Roles?.CaseTreatedReportView && !Roles?.accessAll) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <div className="container-fluid">
                        <Breadcrumbs title="Reports" breadcrumbItem="Case Treated Report" />
                        <h4 className="text-center mt-5">
                            You don't have permission to view this page.
                        </h4>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    // --- Helper Functions ---
    const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const [day, month, year] = dateString.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // --- API Calls ---
    const fetchDistricts = useCallback(async () => {
        try {
            const response = await axios.get(URLS.GetDistrict, {
                headers: { Authorization: `Bearer ${TokenData}` },
            })
            setDistricts(response.data.data || [])
        } catch (error) {
            console.error("Error fetching districts:", error)
            toast.error("Failed to load Districts")
        }
    }, [TokenData])

    const fetchWorkingPlaces = useCallback(
        async (districtId = "") => {
            try {
                let response
                if (districtId) {
                    response = await axios.post(
                        URLS.GetAllPlaceOfWorking,
                        { districtId },
                        { headers: { Authorization: `Bearer ${TokenData}` } }
                    )
                } else {
                    response = await axios.post(
                        URLS.GetPlaceOfWorking,
                        {},
                        { headers: { Authorization: `Bearer ${TokenData}` } }
                    )
                }
                setWorkingPlaces(response.data.data || [])
            } catch (error) {
                console.error("Error fetching working places:", error)
                toast.error("Failed to load Working Places")
            }
        },
        [TokenData]
    )

    const fetchReportData = useCallback(async () => {
        setIsLoading(true)
        try {
            const payload = {
                districtId: filters.districtId || "",
                institutionId: filters.institutionId || "",
                fromDate: formatDateForAPI(filters.fromDate),
                toDate: formatDateForAPI(filters.toDate),
            }

            const apiUrl = reportType === "abstract" ? URLS.CaseTreatedAbstract : URLS.CaseTreatedReport

            const response = await axios.post(
                apiUrl,
                payload,
                { headers: { Authorization: `Bearer ${TokenData}` } }
            )

            if (response.data.status || response.data.success) {
                // Format the data
                // For Abstract: name is districtName
                // For Detailed: name is institutionName
                const formattedData = (response.data.data || []).map(item => {
                    const cattle = item.cattle || 0
                    const buffalo = item.buffalo || 0
                    const sheep = item.sheep || 0
                    const goat = item.goat || 0
                    const dog = item.dog || 0
                    const cat = item.cat || 0
                    const poultry = item.poultry || 0
                    const others = item.others || 0
                    const total = item.total || (cattle + buffalo + sheep + goat + dog + cat + poultry + others)

                    return {
                        name: reportType === "abstract" ? item.districtName : (item.institutionName || item.district || "Unknown District"),
                        districtName: reportType === "abstract" ? item.districtName : (item.district || "Unknown District"),
                        cattle,
                        buffalo,
                        sheep,
                        goat,
                        dog,
                        cat,
                        poultry,
                        others,
                        total,
                    }
                })

                if (reportType === "detailed" && filters.institutionId) {
                    // Find the selected institution
                    const selectedInstitution = workingPlaces.find(wp =>
                        (wp._id || wp.id) === filters.institutionId
                    );

                    if (selectedInstitution) {
                        // Get district of the selected institution
                        const districtId = selectedInstitution.districtId?._id || selectedInstitution.districtId;
                        const district = districts.find(d => d._id === districtId);

                        // Filter the report data for this district only
                        const filteredData = formattedData.filter(item =>
                            district && item.districtName === district.name
                        );

                        // If we have data for this district, modify it to show institution name
                        if (filteredData.length > 0) {
                            const modifiedData = filteredData.map(item => ({
                                ...item,
                                name: selectedInstitution.name,
                                districtName: district.name,
                            }));
                            setReportData(modifiedData);
                        } else {
                            // If no data for this district, create a zero entry
                            setReportData([{
                                name: selectedInstitution.name,
                                districtName: district?.name || "Unknown District",
                                cattle: 0,
                                buffalo: 0,
                                sheep: 0,
                                goat: 0,
                                dog: 0,
                                cat: 0,
                                poultry: 0,
                                others: 0,
                                total: 0,
                            }]);
                        }
                    } else {
                        setReportData(formattedData);
                    }
                } else {
                    setReportData(formattedData);
                }
            } else {
                setReportData([])
                toast.error(response.data.message || "Failed to load report data")
            }
        } catch (error) {
            console.error("Error fetching report data:", error)
            toast.error("Failed to load Report Data")
            setReportData([])
        } finally {
            setIsLoading(false)
        }
    }, [TokenData, filters, districts, workingPlaces, reportType])

    // --- Effects ---
    useEffect(() => {
        fetchDistricts()
        fetchWorkingPlaces()
    }, [fetchDistricts, fetchWorkingPlaces])

    // Report data is now fetched only via Apply button

    // --- Handlers ---
    const handleDistrictChange = selectedOption => {
        const value = selectedOption ? selectedOption.value : ""
        setFilters(prev => ({
            ...prev,
            districtId: value,
            institutionId: "", // Reset institution when district changes
        }))
        fetchWorkingPlaces(value)
    }

    const handleWorkingPlaceChange = selectedOption => {
        const value = selectedOption ? selectedOption.value : ""
        setFilters(prev => ({
            ...prev,
            institutionId: value,
        }))
    }

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleReset = () => {
        setFilters({
            districtId: "",
            institutionId: "",
            fromDate: "",
            toDate: "",
        })
        fetchWorkingPlaces("")
        setReportData([])   // Clear the table data
    }

    const handleApplyFilters = () => {
        fetchReportData()
    }

    const toggleFilters = () => {
        setShowFilters(!showFilters)
    }

    // --- Options ---
    const districtOptions = useMemo(
        () =>
            districts.map(d => ({
                value: d._id,
                label: d.name,
            })),
        [districts]
    )

    const workingPlaceOptions = useMemo(
        () =>
            workingPlaces.map(p => ({
                value: p._id || p.id,
                label: p.name,
            })),
        [workingPlaces]
    )

    // --- CSV Export ---
    const csvReport = {
        filename: `Case_Treated_Report_${new Date().toISOString().slice(0, 10)}.csv`,
        data: reportData,
        headers: [
            { label: "District", key: "districtName" },
            // Only add Institution column if NOT in abstract mode
            ...(reportType === "detailed" ? [{ label: filters.districtId || filters.institutionId ? "Institution" : "District", key: "name" }] : []),
            { label: "Cattle", key: "cattle" },
            { label: "Buffalo", key: "buffalo" },
            { label: "Sheep", key: "sheep" },
            { label: "Goat", key: "goat" },
            { label: "Dog", key: "dog" },
            { label: "Cat", key: "cat" },
            { label: "Poultry", key: "poultry" },
            { label: "Others", key: "others" },
            { label: "Total", key: "total" },
        ]
    }

    // Calculate grand totals
    const grandTotals = useMemo(() => {
        return reportData.reduce((acc, row) => ({
            cattle: acc.cattle + row.cattle,
            buffalo: acc.buffalo + row.buffalo,
            sheep: acc.sheep + row.sheep,
            goat: acc.goat + row.goat,
            dog: acc.dog + row.dog,
            cat: acc.cat + row.cat,
            poultry: acc.poultry + row.poultry,
            others: acc.others + row.others,
            total: acc.total + row.total,
        }), {
            cattle: 0,
            buffalo: 0,
            sheep: 0,
            goat: 0,
            dog: 0,
            cat: 0,
            poultry: 0,
            others: 0,
            total: 0,
        })
    }, [reportData])

    // --- PDF Export ---
    const handlePdfExport = useCallback(() => {
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

            // Title
            doc.setFontSize(16)
            doc.setTextColor(0, 0, 128)
            doc.setFont(undefined, "bold")
            const title = reportType === "abstract"
                ? "CASE TREATED REPORT (DISTRICT-WISE ABSTRACT)"
                : "CASE TREATED REPORT (DETAILED)"
            doc.text(title, pageWidth / 2, 15, { align: "center" })

            // Date range
            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont(undefined, "normal")
            let dateText = ""
            if (filters.fromDate) dateText += `From: ${formatDateForAPI(filters.fromDate)} `
            if (filters.toDate) dateText += `To: ${formatDateForAPI(filters.toDate)}`
            if (dateText) doc.text(dateText, pageWidth / 2, 22, { align: "center" })

            const generatedText = `Generated On: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
            doc.text(generatedText, pageWidth - marginRight, 30, { align: "right" })

            // Table headers
            const headers = reportType === "detailed"
                ? ["S.No", "District", "Institution", "Cattle", "Buffalo", "Sheep", "Goat", "Dog", "Cat", "Poultry", "Others", "Total"]
                : ["S.No", "District", "Cattle", "Buffalo", "Sheep", "Goat", "Dog", "Cat", "Poultry", "Others", "Total"]

            // Table data
            const tableRows = reportData.map((row, index) => {
                const base = [(index + 1).toString(), row.districtName]
                if (reportType === "detailed") base.push(row.name || "")
                base.push(
                    row.cattle.toString(), row.buffalo.toString(), row.sheep.toString(),
                    row.goat.toString(), row.dog.toString(), row.cat.toString(),
                    row.poultry.toString(), row.others.toString(), row.total.toString()
                )
                return base
            })

            // Grand total row
            const grandTotalRow = reportType === "detailed"
                ? ["", "", "Grand Total", grandTotals.cattle.toString(), grandTotals.buffalo.toString(), grandTotals.sheep.toString(), grandTotals.goat.toString(), grandTotals.dog.toString(), grandTotals.cat.toString(), grandTotals.poultry.toString(), grandTotals.others.toString(), grandTotals.total.toString()]
                : ["", "Grand Total", grandTotals.cattle.toString(), grandTotals.buffalo.toString(), grandTotals.sheep.toString(), grandTotals.goat.toString(), grandTotals.dog.toString(), grandTotals.cat.toString(), grandTotals.poultry.toString(), grandTotals.others.toString(), grandTotals.total.toString()]

            tableRows.push(grandTotalRow)

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
                willDrawCell: function (data) {
                    if (data.row.index === tableRows.length - 1) {
                        doc.setFont(undefined, "bold")
                        data.cell.styles.fillColor = [240, 240, 240]
                        data.cell.styles.fontStyle = "bold"
                    }
                },
            })

            const fileName = `Case_Treated_Report_${reportType}_${new Date().toISOString().split("T")[0]}.pdf`
            doc.save(fileName)
            toast.success("PDF exported successfully!")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error("Failed to generate PDF")
        }
    }, [reportData, reportType, filters, grandTotals])

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Reports" breadcrumbItem="Case Treated Report" />

                    {showFilters && (
                        <Row className="mb-3">
                            <Col md={12}>
                                <Card>
                                    <CardBody>
                                        <h5 className="mb-3">Filters</h5>
                                        <Row>
                                            <Col md={3}>
                                                <Label>District</Label>
                                                <Select
                                                    options={districtOptions}
                                                    value={
                                                        filters.districtId
                                                            ? districtOptions.find(
                                                                opt => opt.value === filters.districtId
                                                            )
                                                            : null
                                                    }
                                                    onChange={handleDistrictChange}
                                                    placeholder="All Districts"
                                                    isClearable
                                                />
                                            </Col>
                                            <Col md={3}>
                                                <Label>Institution</Label>
                                                <Select
                                                    options={workingPlaceOptions}
                                                    value={
                                                        filters.institutionId
                                                            ? workingPlaceOptions.find(
                                                                opt => opt.value === filters.institutionId
                                                            )
                                                            : null
                                                    }
                                                    onChange={handleWorkingPlaceChange}
                                                    placeholder="All Institutions"
                                                    isClearable
                                                    isDisabled={!workingPlaces.length || reportType === 'abstract'}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Label>From Date</Label>
                                                <Input
                                                    type="date"
                                                    name="fromDate"
                                                    value={filters.fromDate}
                                                    onChange={handleFilterChange}
                                                    max={filters.toDate || new Date().toISOString().split('T')[0]}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Label>To Date</Label>
                                                <Input
                                                    type="date"
                                                    name="toDate"
                                                    value={filters.toDate}
                                                    onChange={handleFilterChange}
                                                    min={filters.fromDate}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </Col>
                                            <Col md={2} className="d-flex gap-2 align-items-end">
                                                <Button
                                                    color="primary"
                                                    onClick={handleApplyFilters}
                                                    className="w-100"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? <Spinner size="sm" /> : "Apply"}
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={handleReset}
                                                    className="w-100"
                                                    disabled={isLoading}
                                                >
                                                    Reset
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Col md={12} className="d-flex gap-2 mt-2">
                                            <Button
                                                color={reportType === "detailed" ? "primary" : "light"}
                                                outline={reportType !== "detailed"}
                                                onClick={() => {
                                                    setReportType("detailed");
                                                    setReportData([]); // Clear table on switch
                                                }}
                                            >
                                                Detailed Report
                                            </Button>
                                            <Button
                                                color={reportType === "abstract" ? "primary" : "light"}
                                                outline={reportType !== "abstract"}
                                                onClick={() => {
                                                    setReportType("abstract");
                                                    setReportData([]); // Clear table on switch
                                                    setFilters(prev => ({ ...prev, institutionId: "" })); // Clear institution logic if switching to abstract
                                                }}
                                            >
                                                Abstract Report
                                            </Button>
                                        </Col>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    <Row>
                        <Col md={12}>
                            <Card>
                                <CardBody>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <h5 className="mb-0">
                                                Case Treated Details {reportType === "abstract" ? "(District-wise Abstract)" : (filters.institutionId ? "(Institution-wise)" : "(District-wise)")}
                                            </h5>
                                            {filters.fromDate || filters.toDate ? (
                                                <small className="text-muted">
                                                    {filters.fromDate && `From: ${formatDateForAPI(filters.fromDate)} `}
                                                    {filters.toDate && `To: ${formatDateForAPI(filters.toDate)}`}
                                                </small>
                                            ) : null}
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                <Button
                                                    color="primary"
                                                    onClick={toggleFilters}
                                                    className="d-flex align-items-center"
                                                    disabled={isLoading}
                                                >
                                                    <i
                                                        className={`fas ${showFilters ? "fa-eye-slash" : "fa-filter"
                                                            } me-2`}
                                                    ></i>
                                                    {showFilters ? "Hide Filters" : "Show Filters"}
                                                </Button>
                                                <CSVLink
                                                    {...csvReport}
                                                    className="btn btn-success"
                                                    target="_blank"
                                                >
                                                    <i className="fas fa-file-excel me-2"></i> Export
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
                                        </Col>
                                    </Row>

                                    <div className="table-responsive">
                                        <Table hover className="mb-0 table-bordered align-middle">
                                            <thead className="table-light">
                                                <tr className="text-center">
                                                    <th style={{ width: "50px" }}>S.No</th>
                                                    <th>District</th>
                                                    {reportType === "detailed" && (
                                                        <th className="text-start">
                                                            Institution
                                                        </th>
                                                    )}
                                                    <th>Cattle</th>
                                                    <th>Buffalo</th>
                                                    <th>Sheep</th>
                                                    <th>Goat</th>
                                                    <th>Dog</th>
                                                    <th>Cat</th>
                                                    <th>Poultry</th>
                                                    <th>Others</th>
                                                    <th className="fw-bold">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading ? (
                                                    <tr>
                                                        <td colSpan="12" className="text-center py-5">
                                                            <Spinner color="primary" className="me-2" />
                                                            Loading report data...
                                                        </td>
                                                    </tr>
                                                ) : reportData.length > 0 ? (
                                                    <>
                                                        {reportData.map((row, index) => (
                                                            <tr key={index} className="text-center">
                                                                <td>{index + 1}</td>
                                                                <td>{row.districtName}</td>
                                                                {reportType === "detailed" && (
                                                                    <td className="text-start fw-medium">{row.name}</td>
                                                                )}
                                                                <td>{row.cattle}</td>
                                                                <td>{row.buffalo}</td>
                                                                <td>{row.sheep}</td>
                                                                <td>{row.goat}</td>
                                                                <td>{row.dog}</td>
                                                                <td>{row.cat}</td>
                                                                <td>{row.poultry}</td>
                                                                <td>{row.others}</td>
                                                                <td className="fw-bold">{row.total}</td>
                                                            </tr>
                                                        ))}

                                                        {/* Grand Total Row */}
                                                        <tr className="table-light fw-bold text-center">
                                                            <td colSpan={reportType === "detailed" ? "3" : "2"} className="text-end">Grand Total</td>
                                                            <td>{grandTotals.cattle}</td>
                                                            <td>{grandTotals.buffalo}</td>
                                                            <td>{grandTotals.sheep}</td>
                                                            <td>{grandTotals.goat}</td>
                                                            <td>{grandTotals.dog}</td>
                                                            <td>{grandTotals.cat}</td>
                                                            <td>{grandTotals.poultry}</td>
                                                            <td>{grandTotals.others}</td>
                                                            <td>{grandTotals.total}</td>
                                                        </tr>
                                                    </>
                                                ) : (
                                                    <tr>
                                                        <td colSpan="12" className="text-center py-5">
                                                            <h5>No records found</h5>
                                                            <p className="text-muted">Try adjusting your filters or date range</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {/* Summary Stats */}
                                    {!isLoading && reportData.length > 0 && (
                                        <Row className="mt-3">
                                            <Col md={12}>
                                                <div className="alert alert-info mb-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <strong>Report Summary:</strong> Showing {reportData.length} {filters.institutionId ? "institutions" : "districts"}
                                                        </div>
                                                        <div>
                                                            <strong>Total Cases:</strong> {grandTotals.total}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CaseTreatedReport