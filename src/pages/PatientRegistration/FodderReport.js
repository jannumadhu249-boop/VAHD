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
    Input
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { URLS } from "../../Url"
import axios from "axios"
import Select from "react-select"
import { CSVLink } from "react-csv"
import { toast, ToastContainer } from "react-toastify"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const FodderReport = () => {
    // Auth & Token
    const GetAuth = localStorage.getItem("authUser")
    const TokenJson = JSON.parse(GetAuth || "{}")
    const token = TokenJson?.token
    const Roles = TokenJson?.rolesAndPermission?.[0]

    if (!Roles?.FodderReportView && !Roles?.accessAll) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Reports" breadcrumbItem="Fodder Report" />
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
    const [reportData, setReportData] = useState([])
    const [districts, setDistricts] = useState([])
    const [workingPlaces, setWorkingPlaces] = useState([])
    const [showFilters, setShowFilters] = useState(true)
    const [hasSearched, setHasSearched] = useState(false)
    const [reportType, setReportType] = useState("detailed") // "detailed" or "abstract"

    // Filters
    const [filters, setFilters] = useState({
        districtId: null,
        institutionId: null,
        fromDate: "",
        toDate: "",
    })

    // -------------------------------------------------------------------------
    // 1. Helper Functions
    // -------------------------------------------------------------------------
    const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // -------------------------------------------------------------------------
    // 2. Initial Data Fetching (Districts, Working Places)
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

    const fetchWorkingPlaces = useCallback(async (districtId = "") => {
        try {
            let response;
            if (districtId) {
                response = await axios.post(
                    URLS.GetAllPlaceOfWorking,
                    { districtId },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            } else {
                response = await axios.post(
                    URLS.GetPlaceOfWorking,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            }
            if (response.data.success) {
                setWorkingPlaces(response.data.data || [])
            }
        } catch (error) {
            console.error("Error fetching working places:", error)
            toast.error("Failed to load working places")
        }
    }, [token])

    // -------------------------------------------------------------------------
    // 3. Fetch Fodder Report Data
    // -------------------------------------------------------------------------
    const fetchFodderReport = useCallback(async () => {
        if (!filters.fromDate && !filters.toDate) {
            toast.error("Please select at least a date range")
            return;
        }

        setLoader(true)
        try {
            const payload = {
                districtid: filters.districtId || "",
                institutionId: filters.institutionId || "",
                fromDate: formatDateForAPI(filters.fromDate),
                toDate: formatDateForAPI(filters.toDate),
            }

            if (reportType === "abstract") {
                // Abstract mode: Call district-wise API
                const response = await axios.post(
                    URLS.GetFodderReportDistrictWise,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                const rawData = response.data.data || response.data || [];

                if (Array.isArray(rawData) && rawData.length > 0) {
                    // Flatten the nested response: each district has an array of fodder types
                    const abstractRows = [];
                    rawData.forEach((districtItem) => {
                        const districtName = districtItem.districtName || "Unknown District";
                        const fodderTypes = districtItem.data || [];

                        fodderTypes.forEach((fodder) => {
                            abstractRows.push({
                                districtName: districtName,
                                varietyOfSeed: fodder.typeOfFodder || "Unknown",
                                quantityDistributed: parseFloat(fodder.totalUnitSizeKg || 0),
                                beneficiaries: parseInt(fodder.totalRecords || 0, 10),
                                totalCost: parseFloat(fodder.totalCost || 0),
                            });
                        });
                    });

                    setReportData(abstractRows);
                    setHasSearched(true);
                } else {
                    setReportData([]);
                    setHasSearched(true);
                    toast.info("No abstract report data found");
                }
            } else {
                // Detailed mode: Call institution-level API
                const response = await axios.post(
                    URLS.GetFodderReport,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (response.data.status) {
                    const rawData = response.data.data || [];

                    // Aggregate data by district, institution, and fodder type
                    const aggregation = {};

                    rawData.forEach((item) => {
                        const key = `${item.district || "Unknown District"}_${item.institutionName || "Unknown Institution"}_${item.typeOfFodder || "Unknown"}`;

                        if (!aggregation[key]) {
                            aggregation[key] = {
                                districtName: item.district || "Unknown District",
                                institutionName: item.institutionName || "Unknown Institution",
                                varietyOfSeed: item.typeOfFodder || "Unknown",
                                quantityDistributed: parseFloat(item.unitSizeKg || 0),
                                beneficiaries: 1,
                                totalCost: parseFloat(item.totalCost || 0),
                            };
                        } else {
                            aggregation[key].quantityDistributed += parseFloat(item.unitSizeKg || 0);
                            aggregation[key].beneficiaries += 1;
                            aggregation[key].totalCost += parseFloat(item.totalCost || 0);
                        }
                    });

                    setReportData(Object.values(aggregation));
                    setHasSearched(true);
                } else {
                    setReportData([]);
                    toast.error(response.data.message || "Failed to load fodder report data");
                }
            }
        } catch (error) {
            console.error("Error fetching fodder report:", error);
            toast.error("Failed to load Fodder Report data");
            setReportData([]);
        } finally {
            setLoader(false);
        }
    }, [token, filters, reportType]);

    // -------------------------------------------------------------------------
    // 4. Effects for Initial Data
    // -------------------------------------------------------------------------
    useEffect(() => {
        fetchDistricts();
        fetchWorkingPlaces();
    }, [fetchDistricts, fetchWorkingPlaces]);

    // -------------------------------------------------------------------------
    // 5. Dropdown Options
    // -------------------------------------------------------------------------
    const districtOptions = useMemo(() => {
        return districts.map((d) => ({
            label: d.name,
            value: d._id,
        }));
    }, [districts]);

    const placeOptions = useMemo(() => {
        let filteredPlaces = workingPlaces;

        if (filters.districtId) {
            filteredPlaces = workingPlaces.filter((place) => {
                const pDistId = typeof place.districtId === "object"
                    ? place.districtId?._id
                    : place.districtId;
                return pDistId === filters.districtId;
            });
        }

        return filteredPlaces.map((p) => ({
            label: p.name,
            value: p._id,
        }));
    }, [workingPlaces, filters.districtId]);

    // -------------------------------------------------------------------------
    // 6. Filter Handlers
    // -------------------------------------------------------------------------
    const handleDistrictChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null;
        setFilters(prev => ({
            ...prev,
            districtId: value,
            institutionId: null // Reset institution when district changes
        }));
        fetchWorkingPlaces(value || "");
    };

    const handleInstitutionChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null;
        setFilters(prev => ({ ...prev, institutionId: value }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFilters({
            districtId: null,
            institutionId: null,
            fromDate: "",
            toDate: "",
        });
        setReportData([]);
        setHasSearched(false);
        fetchWorkingPlaces("");
    };

    const handleApplyFilters = () => {
        fetchFodderReport();
    };

    // -------------------------------------------------------------------------
    // 7. CSV Export Data
    // -------------------------------------------------------------------------
    const csvData = useMemo(() => {
        return reportData.map((row, index) => {
            const base = {
                sNo: index + 1,
                district: row.districtName,
                variety: row.varietyOfSeed,
                distributed: row.quantityDistributed,
                beneficiaries: row.beneficiaries,
                totalCost: row.totalCost,
            };
            if (reportType === "detailed") {
                base.institution = row.institutionName;
            }
            return base;
        });
    }, [reportData, reportType]);

    const csvHeaders = useMemo(() => {
        const headers = [
            { label: "S.No", key: "sNo" },
            { label: "District", key: "district" },
        ];
        if (reportType === "detailed") {
            headers.push({ label: "Institution", key: "institution" });
        }
        headers.push(
            { label: "Variety Of Seed", key: "variety" },
            { label: "Total Quantity Seed Distributed", key: "distributed" },
            { label: "No of Beneficiaries", key: "beneficiaries" },
            { label: "In Rs.", key: "totalCost" },
        );
        return headers;
    }, [reportType]);

    // -------------------------------------------------------------------------
    // 8. PDF Export
    // -------------------------------------------------------------------------
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
                ? "FODDER DISTRIBUTION REPORT (DISTRICT-WISE ABSTRACT)"
                : "FODDER DISTRIBUTION REPORT (DETAILED)"
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
                ? ["S.No", "District", "Institution", "Variety Of Seed", "Total Qty Seed Distributed", "No of Beneficiaries", "In Rs."]
                : ["S.No", "District", "Variety Of Seed", "Total Qty Seed Distributed", "No of Beneficiaries", "In Rs."]

            // Table data
            const tableRows = reportData.map((row, index) => {
                const base = [(index + 1).toString(), row.districtName]
                if (reportType === "detailed") base.push(row.institutionName)
                base.push(
                    row.varietyOfSeed,
                    row.quantityDistributed.toFixed(2),
                    row.beneficiaries.toString(),
                    row.totalCost.toFixed(2)
                )
                return base
            })

            // Grand total row
            const gt = reportData.reduce((acc, curr) => {
                acc.distributed += curr.quantityDistributed
                acc.beneficiaries += curr.beneficiaries
                acc.cost += curr.totalCost
                return acc
            }, { distributed: 0, beneficiaries: 0, cost: 0 })

            const grandTotalRow = reportType === "detailed"
                ? ["", "", "", "Grand Total", gt.distributed.toFixed(2), gt.beneficiaries.toString(), gt.cost.toFixed(2)]
                : ["", "", "Grand Total", gt.distributed.toFixed(2), gt.beneficiaries.toString(), gt.cost.toFixed(2)]

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

            const fileName = `Fodder_Report_${reportType}_${new Date().toISOString().split("T")[0]}.pdf`
            doc.save(fileName)
            toast.success("PDF exported successfully!")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error("Failed to generate PDF")
        }
    }, [reportData, reportType, filters])

    // -------------------------------------------------------------------------
    // 9. Calculated Totals (Grand Total)
    // -------------------------------------------------------------------------
    const grandTotal = useMemo(() => {
        return reportData.reduce(
            (acc, curr) => {
                acc.distributed += curr.quantityDistributed;
                acc.beneficiaries += curr.beneficiaries;
                acc.cost += curr.totalCost;
                return acc;
            },
            { distributed: 0, beneficiaries: 0, cost: 0 }
        );
    }, [reportData]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Reports" breadcrumbItem="Fodder Report" />
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
                                                    ? districtOptions.find(
                                                        (opt) => opt.value === filters.districtId
                                                    )
                                                    : null
                                            }
                                            onChange={handleDistrictChange}
                                            placeholder="All Districts"
                                            isClearable
                                            classNamePrefix="select2-selection"
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <label className="form-label">Institution</label>
                                        <Select
                                            options={placeOptions}
                                            value={
                                                filters.institutionId
                                                    ? placeOptions.find(
                                                        (opt) => opt.value === filters.institutionId
                                                    )
                                                    : null
                                            }
                                            onChange={handleInstitutionChange}
                                            placeholder="All Institutions"
                                            isClearable
                                            classNamePrefix="select2-selection"
                                            isDisabled={!workingPlaces.length || reportType === 'abstract'}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <label className="form-label">From Date</label>
                                        <Input
                                            type="date"
                                            name="fromDate"
                                            value={filters.fromDate}
                                            onChange={handleDateChange}
                                            max={filters.toDate || new Date().toISOString().split("T")[0]}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <label className="form-label">To Date</label>
                                        <Input
                                            type="date"
                                            name="toDate"
                                            value={filters.toDate}
                                            onChange={handleDateChange}
                                            min={filters.fromDate}
                                            max={new Date().toISOString().split("T")[0]}
                                        />
                                    </Col>
                                    <Col md={2} className="d-flex gap-2 align-items-end">
                                        <Button
                                            color="primary"
                                            onClick={handleApplyFilters}
                                            className="w-100"
                                            disabled={loader}
                                        >
                                            {loader ? <Spinner size="sm" /> : "Apply"}
                                        </Button>
                                        <Button
                                            color="secondary"
                                            onClick={handleReset}
                                            className="w-100"
                                            disabled={loader}
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
                                            setReportData([]);
                                        }}
                                    >
                                        Detailed Report
                                    </Button>
                                    <Button
                                        color={reportType === "abstract" ? "primary" : "light"}
                                        outline={reportType !== "abstract"}
                                        onClick={() => {
                                            setReportType("abstract");
                                            setReportData([]);
                                            setFilters(prev => ({ ...prev, institutionId: null }));
                                        }}
                                    >
                                        Abstract Report
                                    </Button>
                                </Col>
                            </CardBody>
                        </Card>
                    )}

                    {/* Report Table */}
                    <Card>
                        <CardBody>
                            <Row className="mb-3">
                                <Col>
                                    <h5 className="card-title">
                                        Fodder Distribution Details {reportType === "abstract" ? "(District-wise Abstract)" : ""}
                                    </h5>
                                    {filters.fromDate || filters.toDate ? (
                                        <small className="text-muted">
                                            {filters.fromDate && `From: ${formatDateForAPI(filters.fromDate)} `}
                                            {filters.toDate && `To: ${formatDateForAPI(filters.toDate)}`}
                                        </small>
                                    ) : null}
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
                                        filename={`fodder_report_${new Date().toISOString().split("T")[0]}.csv`}
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
                                    <Button
                                        color="danger"
                                        className="btn-sm ms-2"
                                        onClick={handlePdfExport}
                                        disabled={!reportData.length}
                                    >
                                        <i className="bx bxs-file-pdf me-1"></i> PDF
                                    </Button>
                                </Col>
                            </Row>

                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle table-bordered">
                                    <thead className="table-light">
                                        <tr className="text-center">
                                            <th style={{ width: "50px" }}>S.No</th>
                                            <th>District</th>
                                            {reportType === "detailed" && (
                                                <th className="text-start">Institution</th>
                                            )}
                                            <th>Variety Of Seed</th>
                                            <th>Total QuantitySeed Distributed</th>
                                            <th>No ofBeneficiaries</th>
                                            <th>In Rs.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loader ? (
                                            <tr>
                                                <td colSpan={reportType === "abstract" ? "6" : "7"} className="text-center py-5">
                                                    <Spinner color="primary" className="me-2" />
                                                    Loading fodder report data...
                                                </td>
                                            </tr>
                                        ) : reportData.length > 0 ? (
                                            <>
                                                {reportData.map((row, index) => (
                                                    <tr key={index} className="text-center">
                                                        <td>{index + 1}</td>
                                                        <td>{row.districtName}</td>
                                                        {reportType === "detailed" && (
                                                            <td className="text-start fw-medium">{row.institutionName}</td>
                                                        )}
                                                        <td>{row.varietyOfSeed}</td>
                                                        <td>{row.quantityDistributed.toFixed(2)}</td>
                                                        <td>{row.beneficiaries}</td>
                                                        <td>{row.totalCost.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                {/* Grand Total Row */}
                                                <tr className="text-center fw-bold table-light">
                                                    <td colSpan={reportType === "abstract" ? "3" : "4"} className="text-end">Grand Total</td>
                                                    <td>{grandTotal.distributed.toFixed(2)}</td>
                                                    <td>{grandTotal.beneficiaries}</td>
                                                    <td>{grandTotal.cost.toFixed(2)}</td>
                                                </tr>
                                            </>
                                        ) : hasSearched ? (
                                            <tr>
                                                <td colSpan={reportType === "abstract" ? "6" : "7"} className="text-center py-5">
                                                    <h5>No records found</h5>
                                                    <p className="text-muted">Try adjusting your filters or date range</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td colSpan={reportType === "abstract" ? "6" : "7"} className="text-center py-5">
                                                    <div className="text-center">
                                                        <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                                        <h5>No data to display</h5>
                                                        <p className="text-muted">Please select filters and click "Apply" to see report data</p>
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
                                                    <strong>Report Summary:</strong> Showing {reportData.length} distribution records
                                                </div>
                                                <div>
                                                    <strong>Total Beneficiaries:</strong> {grandTotal.beneficiaries} |
                                                    <strong> Total Distributed:</strong> {grandTotal.distributed.toFixed(2)} kg
                                                </div>
                                            </div>
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

export default FodderReport