import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Table,
    Button,
    Spinner,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { URLS } from "../../Url"
import axios from "axios"
import Select from "react-select"
import { CSVLink } from "react-csv"
import { toast, ToastContainer } from "react-toastify"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const FarmersReport = () => {
    // Auth & Token
    const GetAuth = localStorage.getItem("authUser")
    const TokenJson = JSON.parse(GetAuth || "{}")
    const token = TokenJson?.token
    const Roles = TokenJson?.rolesAndPermission?.[0]

    if (!Roles?.FarmersReportView && !Roles?.accessAll) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Reports" breadcrumbItem="Farmers Report" />
                        <h4 className="text-center mt-5">
                            You don't have permission to view this page.
                        </h4>
                    </Container>
                </div>
            </React.Fragment>
        )
    }

    // State
    const [loader, setLoader] = useState(false)
    const [exportLoader, setExportLoader] = useState({ excel: false, pdf: false, abstractPdf: false })
    const [reportData, setReportData] = useState([])
    const [districts, setDistricts] = useState([])
    const [mandals, setMandals] = useState([])
    const [villages, setVillages] = useState([])
    const [mandalLoading, setMandalLoading] = useState(false)
    const [villageLoading, setVillageLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(true)
    const [hasSearched, setHasSearched] = useState(false)

    // Filters
    const [filters, setFilters] = useState({
        districtId: null,
        mandalId: null,
        villageId: null,
        reportType: "abstract",
        page: 1,
    })
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
    })

    const excelDateToJSDate = (serial) => {
        if (!serial) return ""
        const numericSerial = Number(serial)
        if (isNaN(numericSerial)) return serial
        const utc_days = Math.floor(numericSerial - 25569)
        const utc_value = utc_days * 86400
        const date_info = new Date(utc_value * 1000)
        return date_info.toLocaleDateString("en-GB")
    }

    // -------------------------------------------------------------------------
    // 1. Initial Data Fetching (Districts)
    // -------------------------------------------------------------------------
    const fetchDistricts = useCallback(async () => {
        try {
            const response = await axios.get(URLS.GetDistrict, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.data.success) {
                setDistricts(response.data.data || [])
            }
        } catch (error) {
            console.error("Error fetching districts:", error)
            toast.error("Failed to load districts")
        }
    }, [token])

    // -------------------------------------------------------------------------
    // 2. Fetch Mandals under selected District
    // -------------------------------------------------------------------------
    const fetchMandals = useCallback(async (districtId) => {
        if (!districtId) {
            setMandals([])
            return
        }
        setMandalLoading(true)
        try {
            const response = await axios.post(
                URLS.GetDistrictIdbyMandals,
                { districtId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (response.data.success) {
                setMandals(response.data.mandals || [])
            } else {
                toast.error(response.data.message || "Failed to load mandals")
                setMandals([])
            }
        } catch (error) {
            console.error("Error fetching mandals:", error)
            toast.error("Failed to load mandals")
            setMandals([])
        } finally {
            setMandalLoading(false)
        }
    }, [token])

    // -------------------------------------------------------------------------
    // 3. Fetch Villages under selected Mandal
    // -------------------------------------------------------------------------
    const fetchVillages = useCallback(async (mandalId) => {
        if (!mandalId) {
            setVillages([])
            return
        }
        setVillageLoading(true)
        try {
            const response = await axios.post(
                URLS.GetMandalIdByVillageTown,
                { mandalId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (response.data.success) {
                setVillages(response.data.towns || [])
            } else {
                toast.error(response.data.message || "Failed to load villages")
                setVillages([])
            }
        } catch (error) {
            console.error("Error fetching villages:", error)
            toast.error("Failed to load villages")
            setVillages([])
        } finally {
            setVillageLoading(false)
        }
    }, [token])

    // -------------------------------------------------------------------------
    // 4. Fetch Farmers Report Data (Abstract or User)
    // -------------------------------------------------------------------------
    const fetchFarmersReport = useCallback(async (pageOverride) => {
        setLoader(true)
        setReportData([])
        try {
            const page = typeof pageOverride === "number" ? pageOverride : filters.page

            // Build request body – only include selected filters
            const requestBody = {
                ...(filters.districtId && { districtId: filters.districtId }),
                ...(filters.mandalId && { mandalId: filters.mandalId }),
                ...(filters.villageId && { villageId: filters.villageId }),
            }

            if (filters.reportType === "abstract") {
                const response = await axios.post(
                    URLS.GetAbstractData,
                    requestBody,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (response.data.success) {
                    const mappedData = (response.data.data || []).map((item) => ({
                        district: item.district,
                        mandal: item.mandal,
                        village: item.village,
                        noOfFarmers: item.totalFarmers,
                        blankAadhar: item.blankAadhar,
                        aadharPresent: item.aadharPresent,
                        mobileVerified: item.mobileVerified,
                        mobileNotVerified: item.mobileNotVerified,
                        ownerActive: item.ownerStatusActive,
                        ownerInactive: item.ownerStatusInactive,
                    }))
                    setReportData(mappedData)
                    setPagination({ currentPage: 1, totalPages: 1, totalCount: mappedData.length })
                } else {
                    toast.error(response.data.message || "Failed to fetch abstract report")
                    setReportData([])
                }
            } else {
                const response = await axios.post(
                    URLS.GetFarmersByDistrictId,
                    { ...requestBody, page },
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (response.data.success) {
                    const apiFarmers = response.data.farmers || []
                    const mappedData = apiFarmers.map((farmer) => ({
                        id: farmer._id,
                        stateName: "Telangana",
                        ownerId: farmer.ownerId,
                        organization: farmer.organization,
                        ownerName: farmer.ownerName,
                        fatherName: farmer.fatherOrHusbandName,
                        dob: excelDateToJSDate(farmer.ownerDateOfBirth),
                        gender: farmer.gender,
                        category: farmer.ownerCategory,
                        mobileNo: farmer.mobileNo,
                        district: farmer.district,
                        tehsil: farmer.tehsilOrULB,
                        village: farmer.villageOrWard,
                        wardNumber: farmer.villageOrWard,
                        membershipNumber: farmer.membershipNumber,
                        landHolding: farmer.landHolding,
                        hhid: farmer.hhid,
                        pourerMember: farmer.pourerMember,
                        povertyLine: farmer.belowPovertyLine,
                        blankAadhar: farmer.blankAadhar,
                        registeredAnimals: farmer.registeredAnimals,
                        loginId: farmer.dataEntryLoginId,
                        dataEntryDate: excelDateToJSDate(farmer.dataEntryDate),
                        villageInstitutionName: farmer.villageInstitutionName,
                        villageInstitutionType: farmer.villageInstitutionType,
                        mobileVerified: farmer.ownerMobileVerified,
                        ownerStatus: farmer.ownerStatus,
                        ownerAddress: farmer.ownerAddress,
                    }))

                    setReportData(mappedData)
                    setPagination({
                        currentPage: response.data.currentPage,
                        totalPages: response.data.totalPages,
                        totalCount: response.data.totalCount,
                    })
                } else {
                    toast.error(response.data.message || "Failed to fetch data")
                    setReportData([])
                }
            }

            setHasSearched(true)
            if (filters.reportType === "abstract" || reportData.length > 0) {
                toast.success("Report data loaded successfully")
            }
        } catch (error) {
            console.error("Error fetching farmers report:", error)
            toast.error("Failed to load Farmers Report data")
            setReportData([])
        } finally {
            setLoader(false)
        }
    }, [token, filters])

    // -------------------------------------------------------------------------
    // 5. Effects for Initial Data
    // -------------------------------------------------------------------------
    useEffect(() => {
        fetchDistricts()
    }, [fetchDistricts])

    // -------------------------------------------------------------------------
    // 6. Cascading Effects when District / Mandal changes
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (filters.districtId) {
            fetchMandals(filters.districtId)
            setFilters(prev => ({ ...prev, mandalId: null, villageId: null }))
            setVillages([])
        } else {
            setMandals([])
            setVillages([])
        }
    }, [filters.districtId, fetchMandals])

    useEffect(() => {
        if (filters.mandalId) {
            fetchVillages(filters.mandalId)
            setFilters(prev => ({ ...prev, villageId: null }))
        } else {
            setVillages([])
        }
    }, [filters.mandalId, fetchVillages])

    // -------------------------------------------------------------------------
    // 7. Dropdown Options
    // -------------------------------------------------------------------------
    const districtOptions = useMemo(() => {
        return districts.map((d) => ({ label: d.name, value: d._id }))
    }, [districts])

    const mandalOptions = useMemo(() => {
        return mandals.map((m) => ({ label: m.name, value: m._id }))
    }, [mandals])

    const villageOptions = useMemo(() => {
        return villages.map((v) => ({ label: v.name, value: v._id }))
    }, [villages])

    const reportTypeOptions = [
        { label: "Abstract", value: "abstract" },
        { label: "User Report", value: "user" },
    ]

    // -------------------------------------------------------------------------
    // 8. Filter Handlers
    // -------------------------------------------------------------------------
    const handleDistrictChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null
        setFilters(prev => ({ ...prev, districtId: value }))
    }

    const handleMandalChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null
        setFilters(prev => ({ ...prev, mandalId: value }))
    }

    const handleVillageChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null
        setFilters(prev => ({ ...prev, villageId: value }))
    }

    const handleReportTypeChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : "abstract"
        setFilters(prev => ({ ...prev, reportType: value, page: 1 }))
    }

    const handleReset = () => {
        setFilters({
            districtId: null,
            mandalId: null,
            villageId: null,
            reportType: "abstract",
            page: 1,
        })
        setReportData([])
        setHasSearched(false)
        setPagination({ currentPage: 1, totalPages: 1, totalCount: 0 })
        setMandals([])
        setVillages([])
    }

    const handleSearch = () => {
        setFilters((prev) => ({ ...prev, page: 1 }))
        fetchFarmersReport(1)
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilters((prev) => ({ ...prev, page: newPage }))
            fetchFarmersReport(newPage)
        }
    }

    // -------------------------------------------------------------------------
    // 9. Export Handlers
    // -------------------------------------------------------------------------
    const getExportPayload = () => ({
        ...(filters.districtId && { districtId: filters.districtId }),
        ...(filters.mandalId && { mandalId: filters.mandalId }),
        ...(filters.villageId && { villageId: filters.villageId }),
    })

    // ----- Excel Export (User Report) -----
    const handleExcelExport = async () => {
        setExportLoader(prev => ({ ...prev, excel: true }))
        try {
            const response = await axios.post(
                URLS.GetFarmersExcel,
                getExportPayload(),
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (response.data.success) {
                const farmers = response.data.farmerExcell || []
                if (farmers.length === 0) {
                    toast.warning("No data to export")
                    return
                }

                const headers = Object.keys(farmers[0]).join(",")
                const rows = farmers.map(row =>
                    Object.values(row).map(val => `"${val}"`).join(",")
                ).join("\n")
                const csvContent = `${headers}\n${rows}`

                const blob = new Blob([csvContent], { type: "text/csv" })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `farmers_user_report_${new Date().toISOString().split("T")[0]}.csv`
                link.click()
                window.URL.revokeObjectURL(url)

                toast.success("Excel export completed")
            } else {
                toast.error(response.data.message || "Failed to export data")
            }
        } catch (error) {
            console.error("Excel export error:", error)
            toast.error("Failed to export Excel")
        } finally {
            setExportLoader(prev => ({ ...prev, excel: false }))
        }
    }

    // ----- PDF Export (User Report) -----
    const handlePdfExport = async () => {
        setExportLoader(prev => ({ ...prev, pdf: true }))
        try {
            const response = await axios.post(
                URLS.GetFarmersExcel,
                getExportPayload(),
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (response.data.success) {
                const farmers = response.data.farmerExcell || []
                if (farmers.length === 0) {
                    toast.warning("No data to export")
                    return
                }

                const doc = new jsPDF({ orientation: "landscape" })
                const pageTitle = `Farmers Report - ${new Date().toLocaleDateString()}`

                const districtName = districtOptions.find(d => d.value === filters.districtId)?.label || ""
                const mandalName = mandalOptions.find(m => m.value === filters.mandalId)?.label || ""
                const villageName = villageOptions.find(v => v.value === filters.villageId)?.label || ""
                const filterText = `District: ${districtName || "All"}${mandalName ? `, Mandal: ${mandalName}` : ""}${villageName ? `, Village: ${villageName}` : ""}`

                doc.setFontSize(16)
                doc.text(pageTitle, 14, 15)
                doc.setFontSize(10)
                doc.text(filterText, 14, 22)

                const columns = [
                    "S.No", "Owner ID", "Owner Name", "Father/Husband",
                    "Mobile", "District", "Tehsil/ULB", "Village",
                    "Category", "Aadhar", "Animals", "Mobile Verified", "Status"
                ]

                const rows = farmers.map(f => [
                    f["S.No"],
                    f.ownerId,
                    f.ownerName,
                    f.fatherOrHusbandName,
                    f.mobileNo,
                    f.district,
                    f.tehsilOrULB,
                    f.villageOrWard,
                    f.ownerCategory,
                    f.blankAadhar,
                    f.registeredAnimals,
                    f.ownerMobileVerified,
                    f.ownerStatus
                ])

                autoTable(doc, {
                    startY: 30,
                    head: [columns],
                    body: rows,
                    styles: { fontSize: 8, cellPadding: 2 },
                    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                })

                doc.save(`farmers_user_report_${new Date().toISOString().split("T")[0]}.pdf`)
                toast.success("PDF export completed")
            } else {
                toast.error(response.data.message || "Failed to export data")
            }
        } catch (error) {
            console.error("PDF export error:", error)
            toast.error("Failed to export PDF")
        } finally {
            setExportLoader(prev => ({ ...prev, pdf: false }))
        }
    }

    // ----- PDF Export (Abstract Report) -----
    const handleAbstractPdfExport = () => {
        if (!reportData.length) {
            toast.warning("No data to export")
            return
        }

        setExportLoader(prev => ({ ...prev, abstractPdf: true }))
        try {
            const doc = new jsPDF({ orientation: "landscape" })
            const pageTitle = `Farmers Abstract Report - ${new Date().toLocaleDateString()}`

            const districtName = districtOptions.find(d => d.value === filters.districtId)?.label || ""
            const mandalName = mandalOptions.find(m => m.value === filters.mandalId)?.label || ""
            const villageName = villageOptions.find(v => v.value === filters.villageId)?.label || ""
            const filterText = `District: ${districtName || "All"}${mandalName ? `, Mandal: ${mandalName}` : ""}${villageName ? `, Village: ${villageName}` : ""}`

            doc.setFontSize(16)
            doc.text(pageTitle, 14, 15)
            doc.setFontSize(10)
            doc.text(filterText, 14, 22)

            const columns = [
                "S.No", "District", "Mandal", "Village",
                "No of Farmers", "Blank Aadhar", "Aadhar Present",
                "Mobile Verified", "Mobile Not Verified",
                "Owner Active", "Owner Inactive"
            ]

            const rows = reportData.map((row, idx) => [
                idx + 1,
                row.district,
                row.mandal,
                row.village,
                row.noOfFarmers,
                row.blankAadhar,
                row.aadharPresent,
                row.mobileVerified,
                row.mobileNotVerified,
                row.ownerActive,
                row.ownerInactive
            ])

            // Grand Total Row
            let grandTotalRow = [];
            if (totals) {
                grandTotalRow = [
                    "", "", "", "Grand Total",
                    totals.noOfFarmers,
                    totals.blankAadhar,
                    totals.aadharPresent,
                    totals.mobileVerified,
                    totals.mobileNotVerified,
                    totals.ownerActive,
                    totals.ownerInactive
                ]
            }

            autoTable(doc, {
                startY: 30,
                head: [columns],
                body: rows,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            })

            // Add grand total as a separate table to show only at the end
            if (totals) {
                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY, // Start right after the previous table
                    body: [grandTotalRow],
                    styles: { fontSize: 8, cellPadding: 2, fontStyle: "bold" },
                    bodyStyles: { fillColor: [240, 240, 240], textColor: 0 },
                    showHead: 'never', // Don't show header for this row
                })
            }

            doc.save(`farmers_abstract_report_${new Date().toISOString().split("T")[0]}.pdf`)
            toast.success("PDF export completed")
        } catch (error) {
            console.error("Abstract PDF export error:", error)
            toast.error("Failed to export PDF")
        } finally {
            setExportLoader(prev => ({ ...prev, abstractPdf: false }))
        }
    }

    // -------------------------------------------------------------------------
    // 10. CSV Export Data & Parsers (Abstract only)
    // -------------------------------------------------------------------------
    const csvHeaders = useMemo(() => {
        if (filters.reportType === "abstract") {
            return [
                { label: "S.No", key: "sNo" },
                { label: "District", key: "district" },
                { label: "Mandal", key: "mandal" },
                { label: "Village", key: "village" },
                { label: "No of Farmers", key: "noOfFarmers" },
                { label: "Blank Aadhar", key: "blankAadhar" },
                { label: "Aadhar Present", key: "aadharPresent" },
                { label: "Mobile Number Verified", key: "mobileVerified" },
                { label: "Mobile Number Not Verified", key: "mobileNotVerified" },
                { label: "Owner Active", key: "ownerActive" },
                { label: "Owner Inactive", key: "ownerInactive" },
            ]
        }
        return []
    }, [filters.reportType])

    const csvData = useMemo(() => {
        if (filters.reportType === "abstract") {
            return reportData.map((row, index) => ({ sNo: index + 1, ...row }))
        }
        return []
    }, [reportData, filters.reportType])

    // -------------------------------------------------------------------------
    // 11. Calculate Totals (Abstract Only)
    // -------------------------------------------------------------------------
    const totals = useMemo(() => {
        if (filters.reportType !== "abstract") return null
        return reportData.reduce(
            (acc, curr) => ({
                noOfFarmers: acc.noOfFarmers + curr.noOfFarmers,
                blankAadhar: acc.blankAadhar + curr.blankAadhar,
                aadharPresent: acc.aadharPresent + curr.aadharPresent,
                mobileVerified: acc.mobileVerified + curr.mobileVerified,
                mobileNotVerified: acc.mobileNotVerified + curr.mobileNotVerified,
                ownerActive: (acc.ownerActive || 0) + (curr.ownerActive || 0),
                ownerInactive: (acc.ownerInactive || 0) + (curr.ownerInactive || 0),
            }),
            { noOfFarmers: 0, blankAadhar: 0, aadharPresent: 0, mobileVerified: 0, mobileNotVerified: 0, ownerActive: 0, ownerInactive: 0 }
        )
    }, [reportData, filters.reportType])

    // -------------------------------------------------------------------------
    // 12. Render
    // -------------------------------------------------------------------------


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Reports" breadcrumbItem="Farmers Report" />
                    <ToastContainer />

                    {/* Filters */}
                    {showFilters && (
                        <Card className="mb-3">
                            <CardBody>
                                <h5 className="mb-3">Filters</h5>
                                <Row className="g-3">
                                    <Col md={3}>
                                        <label className="form-label">District</label>
                                        <Select
                                            options={districtOptions}
                                            value={
                                                filters.districtId
                                                    ? districtOptions.find(opt => opt.value === filters.districtId)
                                                    : null
                                            }
                                            onChange={handleDistrictChange}
                                            placeholder="Select District"
                                            isClearable
                                            classNamePrefix="select2-selection"
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <label className="form-label">Mandal</label>
                                        <Select
                                            options={mandalOptions}
                                            value={
                                                filters.mandalId
                                                    ? mandalOptions.find(opt => opt.value === filters.mandalId)
                                                    : null
                                            }
                                            onChange={handleMandalChange}
                                            placeholder={mandalLoading ? "Loading..." : "Select Mandal"}
                                            isClearable
                                            isDisabled={!filters.districtId || mandalLoading}
                                            isLoading={mandalLoading}
                                            classNamePrefix="select2-selection"
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <label className="form-label">Village</label>
                                        <Select
                                            options={villageOptions}
                                            value={
                                                filters.villageId
                                                    ? villageOptions.find(opt => opt.value === filters.villageId)
                                                    : null
                                            }
                                            onChange={handleVillageChange}
                                            placeholder={villageLoading ? "Loading..." : "Select Village"}
                                            isClearable
                                            isDisabled={!filters.mandalId || villageLoading}
                                            isLoading={villageLoading}
                                            classNamePrefix="select2-selection"
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <label className="form-label">Report Type</label>
                                        <Select
                                            options={reportTypeOptions}
                                            value={reportTypeOptions.find(opt => opt.value === filters.reportType)}
                                            onChange={handleReportTypeChange}
                                            placeholder="Select Type"
                                            classNamePrefix="select2-selection"
                                        />
                                    </Col>
                                    <Col md={1} className="d-flex gap-2 align-items-end">
                                        <Button
                                            color="primary"
                                            onClick={handleSearch}
                                            className="w-100"
                                            disabled={loader}
                                        >
                                            {loader ? <Spinner size="sm" /> : (
                                                <>
                                                    <i className="bx bx-search me-1"></i>
                                                    Search
                                                </>
                                            )}
                                        </Button>
                                    </Col>
                                    <Col md={1} className="d-flex align-items-end">
                                        <Button
                                            color="secondary"
                                            onClick={handleReset}
                                            className="w-100"
                                            disabled={loader}
                                        >
                                            <i className="bx bx-reset me-1"></i>
                                            Reset
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    )}

                    {/* Report Table */}
                    <Card>
                        <CardBody>
                            <Row className="mb-3">
                                <Col>
                                    <h5 className="card-title">
                                        {filters.reportType === 'abstract' ? "Abstract Report" : "User Report"}
                                    </h5>
                                    {filters.districtId && (
                                        <small className="text-muted d-block">
                                            District: {districtOptions.find(d => d.value === filters.districtId)?.label}
                                            {filters.mandalId && `, Mandal: ${mandalOptions.find(m => m.value === filters.mandalId)?.label}`}
                                            {filters.villageId && `, Village: ${villageOptions.find(v => v.value === filters.villageId)?.label}`}
                                        </small>
                                    )}
                                </Col>
                                <Col className="text-end">
                                    <Button
                                        color="primary"
                                        className="btn-sm me-2"
                                        onClick={() => setShowFilters(!showFilters)}
                                        disabled={loader}
                                    >
                                        {showFilters ? (
                                            <>
                                                <i className="bx bx-hide me-1"></i> Hide Filters
                                            </>
                                        ) : (
                                            <>
                                                <i className="bx bx-filter-alt me-1"></i> Show Filters
                                            </>
                                        )}
                                    </Button>

                                    {/* Export buttons */}
                                    {filters.reportType === 'abstract' ? (
                                        <>
                                            <CSVLink
                                                data={csvData}
                                                headers={csvHeaders}
                                                filename={`farmers_abstract_${new Date().toISOString().split("T")[0]}.csv`}
                                                target="_blank"
                                            >
                                                <Button
                                                    color="success"
                                                    className="btn-sm me-2"
                                                    disabled={!reportData.length}
                                                >
                                                    <i className="bx bx-export me-1"></i> Export CSV
                                                </Button>
                                            </CSVLink>
                                            <Button
                                                color="danger"
                                                className="btn-sm"
                                                onClick={handleAbstractPdfExport}
                                                disabled={!reportData.length || exportLoader.abstractPdf}
                                            >
                                                {exportLoader.abstractPdf ? (
                                                    <Spinner size="sm" className="me-1" />
                                                ) : (
                                                    <i className="bx bxs-file-pdf me-1"></i>
                                                )}
                                                Export PDF
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                color="success"
                                                className="btn-sm me-2"
                                                onClick={handleExcelExport}
                                                disabled={exportLoader.excel}
                                            >
                                                {exportLoader.excel ? (
                                                    <Spinner size="sm" className="me-1" />
                                                ) : (
                                                    <i className="bx bx-file me-1"></i>
                                                )}
                                                Export Excel
                                            </Button>
                                            <Button
                                                color="danger"
                                                className="btn-sm"
                                                onClick={handlePdfExport}
                                                disabled={exportLoader.pdf}
                                            >
                                                {exportLoader.pdf ? (
                                                    <Spinner size="sm" className="me-1" />
                                                ) : (
                                                    <i className="bx bxs-file-pdf me-1"></i>
                                                )}
                                                Export PDF
                                            </Button>
                                        </>
                                    )}
                                </Col>
                            </Row>

                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle table-bordered" style={{ fontSize: '13px' }}>
                                    <thead className="table-light">
                                        {filters.reportType === 'abstract' ? (
                                            <tr className="text-center">
                                                <th style={{ width: "50px" }}>S.No</th>
                                                <th>District</th>
                                                <th>Mandal</th>
                                                <th>Village</th>
                                                <th>No of Farmers</th>
                                                <th>Blank Aadhar</th>
                                                <th>Aadhar Present</th>
                                                <th>Mobile Verified</th>
                                                <th>Mobile Not Verified</th>
                                                <th>Owner Active</th>
                                                <th>Owner Inactive</th>
                                            </tr>
                                        ) : (
                                            <tr className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                <th>State</th>
                                                <th>Owner ID</th>
                                                <th>Org</th>
                                                <th>Owner Name</th>
                                                <th>Father/Husband</th>
                                                <th>DOB</th>
                                                <th>Gender</th>
                                                <th>Category</th>
                                                <th>Mobile</th>
                                                <th>District</th>
                                                <th>Tehsil/ULB</th>
                                                <th>Village</th>
                                                <th>Membership No</th>
                                                <th>Land Holding</th>
                                                <th>HHID</th>
                                                <th>Pourer</th>
                                                <th>BPL</th>
                                                <th>Blank Aadhar</th>
                                                <th>Reg Animals</th>
                                                <th>Login ID</th>
                                                <th>Entry Date</th>
                                                <th>Village Inst Name</th>
                                                <th>Village Inst Type</th>
                                                <th>Mobile Verified</th>
                                                <th>Status</th>
                                                <th>Address</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        {loader ? (
                                            <tr>
                                                <td colSpan={filters.reportType === 'abstract' ? "11" : "26"} className="text-center py-5">
                                                    <Spinner color="primary" className="me-2" />
                                                    Loading report data...
                                                </td>
                                            </tr>
                                        ) : reportData.length > 0 ? (
                                            <>
                                                {reportData.map((row, index) => (
                                                    <tr key={index} className="text-center">
                                                        {filters.reportType === 'abstract' ? (
                                                            <>
                                                                <td>{index + 1}</td>
                                                                <td>{row.district}</td>
                                                                <td className="text-start">{row.mandal}</td>
                                                                <td className="text-start">{row.village}</td>
                                                                <td className="fw-medium">{row.noOfFarmers}</td>
                                                                <td>{row.blankAadhar}</td>
                                                                <td>{row.aadharPresent}</td>
                                                                <td>{row.mobileVerified}</td>
                                                                <td>{row.mobileNotVerified}</td>
                                                                <td>{row.ownerActive}</td>
                                                                <td>{row.ownerInactive}</td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td>{row.stateName}</td>
                                                                <td>{row.ownerId}</td>
                                                                <td>{row.organization}</td>
                                                                <td>{row.ownerName}</td>
                                                                <td>{row.fatherName}</td>
                                                                <td>{row.dob}</td>
                                                                <td>{row.gender}</td>
                                                                <td>{row.category}</td>
                                                                <td>{row.mobileNo}</td>
                                                                <td>{row.district}</td>
                                                                <td>{row.tehsil}</td>
                                                                <td>{row.village}</td>
                                                                <td>{row.membershipNumber}</td>
                                                                <td>{row.landHolding}</td>
                                                                <td>{row.hhid}</td>
                                                                <td>{row.pourerMember}</td>
                                                                <td>{row.povertyLine}</td>
                                                                <td>{row.blankAadhar}</td>
                                                                <td>{row.registeredAnimals}</td>
                                                                <td>{row.loginId}</td>
                                                                <td>{row.dataEntryDate}</td>
                                                                <td>{row.villageInstitutionName}</td>
                                                                <td>{row.villageInstitutionType}</td>
                                                                <td>{row.mobileVerified}</td>
                                                                <td>{row.ownerStatus}</td>
                                                                <td>{row.ownerAddress}</td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                                {filters.reportType === 'abstract' && totals && (
                                                    <tr className="text-center fw-bold table-light">
                                                        <td colSpan="4" className="text-end">Grand Total</td>
                                                        <td>{totals.noOfFarmers}</td>
                                                        <td>{totals.blankAadhar}</td>
                                                        <td>{totals.aadharPresent}</td>
                                                        <td>{totals.mobileVerified}</td>
                                                        <td>{totals.mobileNotVerified}</td>
                                                        <td>{totals.ownerActive}</td>
                                                        <td>{totals.ownerInactive}</td>
                                                    </tr>
                                                )}
                                            </>
                                        ) : hasSearched ? (
                                            <tr>
                                                <td colSpan={filters.reportType === 'abstract' ? "11" : "26"} className="text-center py-5">
                                                    <h5>No records found</h5>
                                                    <p className="text-muted">Try adjusting your filters</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td colSpan={filters.reportType === 'abstract' ? "11" : "26"} className="text-center py-5">
                                                    <div className="text-center">
                                                        <i className="bx bx-search-alt bx-lg text-muted mb-3"></i>
                                                        <h5>No data to display</h5>
                                                        <p className="text-muted">Please select filters and click "Search"</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Pagination for User Report */}
                    {filters.reportType === "user" && reportData.length > 0 && (
                        <Row className="mt-3 align-items-center">
                            <Col md={6}>
                                <div className="text-muted">
                                    Showing page {pagination.currentPage} of {pagination.totalPages} (
                                    {pagination.totalCount} entries)
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        color="primary"
                                        disabled={pagination.currentPage === 1 || loader}
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    >
                                        <i className="bx bx-chevron-left"></i> Previous
                                    </Button>
                                    <Button
                                        color="primary"
                                        disabled={pagination.currentPage === pagination.totalPages || loader}
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    >
                                        Next <i className="bx bx-chevron-right"></i>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default FarmersReport