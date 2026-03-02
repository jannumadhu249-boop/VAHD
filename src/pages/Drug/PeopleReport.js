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

const PeopleReport = () => {
    // Auth & Token
    const GetAuth = localStorage.getItem("authUser")
    const TokenJson = JSON.parse(GetAuth || "{}")
    const token = TokenJson?.token

    // State
    const [loader, setLoader] = useState(false)
    const [reportData, setReportData] = useState([])
    const [districts, setDistricts] = useState([])
    const [showFilters, setShowFilters] = useState(true)
    const [hasSearched, setHasSearched] = useState(false)

    // Filters
    const [filters, setFilters] = useState({
        districtId: null,
    })

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
    // 2. Fetch People Report Data
    // -------------------------------------------------------------------------
    const fetchPeopleReport = useCallback(async () => {
        if (!filters.districtId) {
            toast.error("Please select a district")
            return
        }

        setLoader(true)
        try {
            // TODO: Replace with actual API endpoint when backend is ready
            // const response = await axios.post(
            //     URLS.GetPeopleReport,
            //     { districtId: filters.districtId },
            //     { headers: { Authorization: `Bearer ${token}` } }
            // )

            // For now, using mock data
            console.log("Fetching people data for district:", filters.districtId)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock data
            const mockData = [
                {
                    id: 1,
                    name: "Rajesh Kumar",
                    employeeId: "EMP001",
                    designation: "Veterinary Doctor",
                    district: districts.find(d => d._id === filters.districtId)?.name || "Unknown",
                    phone: "9876543210",
                    email: "rajesh.kumar@example.com",
                    institution: "District Veterinary Hospital",
                    status: "Active"
                },
                {
                    id: 2,
                    name: "Priya Sharma",
                    employeeId: "EMP002",
                    designation: "Veterinary Assistant",
                    district: districts.find(d => d._id === filters.districtId)?.name || "Unknown",
                    phone: "9876543211",
                    email: "priya.sharma@example.com",
                    institution: "Primary Veterinary Center",
                    status: "Active"
                },
                {
                    id: 3,
                    name: "Arjun Reddy",
                    employeeId: "EMP003",
                    designation: "Livestock Inspector",
                    district: districts.find(d => d._id === filters.districtId)?.name || "Unknown",
                    phone: "9876543212",
                    email: "arjun.reddy@example.com",
                    institution: "District Veterinary Hospital",
                    status: "Active"
                },
                {
                    id: 4,
                    name: "Sita Devi",
                    employeeId: "EMP004",
                    designation: "Veterinary Supervisor",
                    district: districts.find(d => d._id === filters.districtId)?.name || "Unknown",
                    phone: "9876543213",
                    email: "sita.devi@example.com",
                    institution: "Regional Veterinary Office",
                    status: "Active"
                },
                {
                    id: 5,
                    name: "Vikram Singh",
                    employeeId: "EMP005",
                    designation: "Field Officer",
                    district: districts.find(d => d._id === filters.districtId)?.name || "Unknown",
                    phone: "9876543214",
                    email: "vikram.singh@example.com",
                    institution: "Primary Veterinary Center",
                    status: "Inactive"
                },
            ]

            setReportData(mockData)
            setHasSearched(true)
            toast.success("People data loaded successfully")
        } catch (error) {
            console.error("Error fetching people report:", error)
            toast.error("Failed to load People Report data")
            setReportData([])
        } finally {
            setLoader(false)
        }
    }, [token, filters.districtId, districts])

    // -------------------------------------------------------------------------
    // 3. Effects for Initial Data
    // -------------------------------------------------------------------------
    useEffect(() => {
        fetchDistricts()
    }, [fetchDistricts])

    // -------------------------------------------------------------------------
    // 4. Dropdown Options
    // -------------------------------------------------------------------------
    const districtOptions = useMemo(() => {
        return districts.map((d) => ({
            label: d.name,
            value: d._id,
        }))
    }, [districts])

    // -------------------------------------------------------------------------
    // 5. Filter Handlers
    // -------------------------------------------------------------------------
    const handleDistrictChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null
        setFilters(prev => ({ ...prev, districtId: value }))
    }

    const handleReset = () => {
        setFilters({ districtId: null })
        setReportData([])
        setHasSearched(false)
    }

    const handleSearch = () => {
        fetchPeopleReport()
    }

    // -------------------------------------------------------------------------
    // 6. CSV Export Data
    // -------------------------------------------------------------------------
    const csvData = useMemo(() => {
        return reportData.map((row, index) => ({
            sNo: index + 1,
            name: row.name,
            employeeId: row.employeeId,
            designation: row.designation,
            district: row.district,
            phone: row.phone,
            email: row.email,
            institution: row.institution,
            status: row.status,
        }))
    }, [reportData])

    const csvHeaders = [
        { label: "S.No", key: "sNo" },
        { label: "Name", key: "name" },
        { label: "Employee ID", key: "employeeId" },
        { label: "Designation", key: "designation" },
        { label: "District", key: "district" },
        { label: "Phone", key: "phone" },
        { label: "Email", key: "email" },
        { label: "Institution", key: "institution" },
        { label: "Status", key: "status" },
    ]

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Reports" breadcrumbItem="People Report" />
                    <ToastContainer />

                    {/* Filters */}
                    {showFilters && (
                        <Card className="mb-3">
                            <CardBody>
                                <h5 className="mb-3">Filters</h5>
                                <Row className="g-3">
                                    <Col md={4}>
                                        <label className="form-label">
                                            District <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            options={districtOptions}
                                            value={
                                                filters.districtId
                                                    ? districtOptions.find(
                                                        (opt) => opt.value === filters.districtId
                                                    )
                                                    : null
                                            }
                                            onChange={handleDistrictChange}
                                            placeholder="Select District"
                                            isClearable
                                            classNamePrefix="select2-selection"
                                        />
                                    </Col>
                                    <Col md={4} className="d-flex gap-2 align-items-end">
                                        <Button
                                            color="primary"
                                            onClick={handleSearch}
                                            className="w-100"
                                            disabled={loader || !filters.districtId}
                                        >
                                            {loader ? <Spinner size="sm" /> : (
                                                <>
                                                    <i className="bx bx-search me-1"></i>
                                                    Search
                                                </>
                                            )}
                                        </Button>
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
                                    <h5 className="card-title">People Details</h5>
                                    {filters.districtId && (
                                        <small className="text-muted">
                                            District: {districtOptions.find(d => d.value === filters.districtId)?.label}
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
                                    <CSVLink
                                        data={csvData}
                                        headers={csvHeaders}
                                        filename={`people_report_${new Date().toISOString().split("T")[0]}.csv`}
                                        target="_blank"
                                    >
                                        <Button
                                            color="success"
                                            className="btn-sm"
                                            disabled={!reportData.length}
                                        >
                                            <i className="bx bx-export me-1"></i> Export
                                        </Button>
                                    </CSVLink>
                                </Col>
                            </Row>

                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle table-bordered">
                                    <thead className="table-light">
                                        <tr className="text-center">
                                            <th style={{ width: "50px" }}>S.No</th>
                                            <th>Name</th>
                                            <th>Employee ID</th>
                                            <th>Designation</th>
                                            <th>District</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Institution</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loader ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5">
                                                    <Spinner color="primary" className="me-2" />
                                                    Loading people report data...
                                                </td>
                                            </tr>
                                        ) : reportData.length > 0 ? (
                                            reportData.map((row, index) => (
                                                <tr key={row.id} className="text-center">
                                                    <td>{index + 1}</td>
                                                    <td className="text-start fw-medium">{row.name}</td>
                                                    <td>{row.employeeId}</td>
                                                    <td>{row.designation}</td>
                                                    <td>{row.district}</td>
                                                    <td>{row.phone}</td>
                                                    <td className="text-start">{row.email}</td>
                                                    <td className="text-start">{row.institution}</td>
                                                    <td>
                                                        <span className={`badge bg-${row.status === "Active" ? "success" : "danger"}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : hasSearched ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5">
                                                    <h5>No records found</h5>
                                                    <p className="text-muted">Try adjusting your filters</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5">
                                                    <div className="text-center">
                                                        <i className="bx bx-search-alt bx-lg text-muted mb-3"></i>
                                                        <h5>No data to display</h5>
                                                        <p className="text-muted">Please select a district and click "Search" to see report data</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Summary Stats */}
                            {!loader && reportData.length > 0 && (
                                <Row className="mt-3">
                                    <Col md={12}>
                                        <div className="alert alert-info mb-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>Report Summary:</strong> Showing {reportData.length} employee records
                                                </div>
                                                <div>
                                                    <strong>Active:</strong> {reportData.filter(r => r.status === "Active").length} |
                                                    <strong> Inactive:</strong> {reportData.filter(r => r.status === "Inactive").length}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {/* Note about mock data */}
                            {reportData.length > 0 && (
                                <Row className="mt-2">
                                    <Col md={12}>
                                        <div className="alert alert-warning mb-0">
                                            <i className="bx bx-info-circle me-1"></i>
                                            <strong>Note:</strong> Currently showing mock data. API endpoint will be integrated once available.
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default PeopleReport