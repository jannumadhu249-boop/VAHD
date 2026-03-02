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
import { CSVLink } from "react-csv"
import { toast, ToastContainer } from "react-toastify"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"


const FarmersAbstractReport = () => {
    // Auth & Token
    const GetAuth = localStorage.getItem("authUser")
    const TokenJson = JSON.parse(GetAuth || "{}")
    const token = TokenJson?.token
    const Roles = TokenJson?.rolesAndPermission?.[0]

    if (!Roles?.FarmersAbstractReportView && !Roles?.accessAll) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Reports" breadcrumbItem="District Wise Abstract Report" />
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
    const [exportLoader, setExportLoader] = useState({ pdf: false })
    const [reportData, setReportData] = useState([])


    // -------------------------------------------------------------------------
    // 1. Fetch District‑wise Abstract Report
    // -------------------------------------------------------------------------
    const fetchDistrictWiseReport = useCallback(async () => {
        setLoader(true)
        setReportData([])
        try {
            const response = await axios.post(
                URLS.GetDistrictWiseFarmersAbstract,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )


            if (response.data.success) {
                // The API returns 'data' array with district level stats
                const apiData = (response.data.data || []).map(item => ({
                    ...item,
                    ownerActive: item.ownerStatusActive,
                    ownerInactive: item.ownerStatusInactive
                }))
                setReportData(apiData)
                if (apiData.length > 0) {
                    toast.success("Report data loaded successfully")
                }
            } else {
                toast.error(response.data.message || "Failed to fetch district wise report")
                setReportData([])
            }
        } catch (error) {
            console.error("Error fetching district wise report:", error)
            toast.error("Failed to load District Wise Abstract Report")
            setReportData([])
        } finally {
            setLoader(false)
        }
    }, [token])


    // -------------------------------------------------------------------------
    // 2. Effects – Load data on mount
    // -------------------------------------------------------------------------
    useEffect(() => {
        fetchDistrictWiseReport()
    }, [fetchDistrictWiseReport])


    // -------------------------------------------------------------------------
    // 3. Totals Calculation
    // -------------------------------------------------------------------------
    const totals = useMemo(() => {
        return reportData.reduce(
            (acc, curr) => ({
                noOfFarmers: acc.noOfFarmers + (curr.totalFarmers || 0),
                blankAadhar: acc.blankAadhar + (curr.blankAadhar || 0),
                aadharPresent: acc.aadharPresent + (curr.aadharPresent || 0),
                mobileVerified: acc.mobileVerified + (curr.mobileVerified || 0),
                mobileNotVerified: acc.mobileNotVerified + (curr.mobileNotVerified || 0),
                ownerActive: acc.ownerActive + (curr.ownerActive || 0),
                ownerInactive: acc.ownerInactive + (curr.ownerInactive || 0),
            }),
            {
                noOfFarmers: 0,
                blankAadhar: 0,
                aadharPresent: 0,
                mobileVerified: 0,
                mobileNotVerified: 0,
                ownerActive: 0,
                ownerInactive: 0,
            }
        )
    }, [reportData])


    // -------------------------------------------------------------------------
    // 4. CSV Export – using react-csv
    // -------------------------------------------------------------------------
    const csvHeaders = [
        { label: "S.No", key: "sNo" },
        { label: "District", key: "district" },
        { label: "No of Farmers", key: "noOfFarmers" },
        { label: "Blank Aadhar", key: "blankAadhar" },
        { label: "Aadhar Present", key: "aadharPresent" },
        { label: "Mobile Number Verified", key: "mobileVerified" },
        { label: "Mobile Number Not Verified", key: "mobileNotVerified" },
        { label: "Owner Active", key: "ownerActive" },
        { label: "Owner Inactive", key: "ownerInactive" },
    ]


    const csvData = useMemo(
        () => {
            const dataRows = reportData.map((row, index) => ({
                sNo: index + 1,
                district: row.district || "",
                noOfFarmers: row.totalFarmers || 0,
                blankAadhar: row.blankAadhar || 0,
                aadharPresent: row.aadharPresent || 0,
                mobileVerified: row.mobileVerified || 0,
                mobileNotVerified: row.mobileNotVerified || 0,
                ownerActive: row.ownerActive || 0,
                ownerInactive: row.ownerInactive || 0,
            }))

            // Add Grand Total row to CSV
            dataRows.push({
                sNo: "",
                district: "Grand Total",
                noOfFarmers: totals.noOfFarmers,
                blankAadhar: totals.blankAadhar,
                aadharPresent: totals.aadharPresent,
                mobileVerified: totals.mobileVerified,
                mobileNotVerified: totals.mobileNotVerified,
                ownerActive: totals.ownerActive,
                ownerInactive: totals.ownerInactive,
            })

            return dataRows
        },
        [reportData, totals]
    )


    // -------------------------------------------------------------------------
    // 5. PDF Export (jsPDF + autoTable)
    // -------------------------------------------------------------------------
    const handlePdfExport = () => {
        if (!reportData.length) {
            toast.warning("No data to export")
            return
        }


        setExportLoader((prev) => ({ ...prev, pdf: true }))
        try {
            const doc = new jsPDF({ orientation: "landscape" })
            const pageTitle = `District Wise Farmers Abstract - ${new Date().toLocaleDateString()}`


            doc.setFontSize(16)
            doc.text(pageTitle, 14, 15)


            const columns = [
                "S.No",
                "District",
                "No of Farmers",
                "Blank Aadhar",
                "Aadhar Present",
                "Mobile Verified",
                "Mobile Not Verified",
                "Owner Active",
                "Owner Inactive",
            ]


            const rows = reportData.map((row, idx) => [
                idx + 1,
                row.district || "",
                row.totalFarmers || 0,
                row.blankAadhar || 0,
                row.aadharPresent || 0,
                row.mobileVerified || 0,
                row.mobileNotVerified || 0,
                row.ownerActive || 0,
                row.ownerInactive || 0,
            ])


            // Grand Total Row
            const grandTotalRow = [
                "",
                "Grand Total",
                totals.noOfFarmers,
                totals.blankAadhar,
                totals.aadharPresent,
                totals.mobileVerified,
                totals.mobileNotVerified,
                totals.ownerActive,
                totals.ownerInactive,
            ]


            autoTable(doc, {
                startY: 25,
                head: [columns],
                body: rows,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            })

            // Add grand total as a separate table to show only at the end
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY,
                body: [grandTotalRow],
                styles: { fontSize: 8, cellPadding: 2, fontStyle: "bold" },
                bodyStyles: { fillColor: [240, 240, 240], textColor: 0 },
                showHead: 'never',
            })


            doc.save(`district_wise_farmers_abstract_${new Date().toISOString().split("T")[0]}.pdf`)
            toast.success("PDF export completed")
        } catch (error) {
            console.error("PDF export error:", error)
            toast.error("Failed to export PDF")
        } finally {
            setExportLoader((prev) => ({ ...prev, pdf: false }))
        }
    }


    // -------------------------------------------------------------------------
    // 6. Render
    // -------------------------------------------------------------------------
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Reports" breadcrumbItem="District Wise Abstract Report" />
                    <ToastContainer />


                    <Card>
                        <CardBody>
                            <Row className="mb-3">
                                <Col>
                                    <h5 className="card-title">District Wise Farmers Abstract</h5>
                                </Col>
                                <Col className="text-end">
                                    {/* Refresh Button */}
                                    <Button
                                        color="secondary"
                                        className="btn-sm me-2"
                                        onClick={fetchDistrictWiseReport}
                                        disabled={loader}
                                    >
                                        {loader ? (
                                            <Spinner size="sm" className="me-1" />
                                        ) : (
                                            <i className="bx bx-refresh me-1"></i>
                                        )}
                                        Refresh
                                    </Button>


                                    {/* CSV Export */}
                                    <CSVLink
                                        data={csvData}
                                        headers={csvHeaders}
                                        filename={`district_wise_abstract_${new Date().toISOString().split("T")[0]}.csv`}
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


                                    {/* PDF Export */}
                                    <Button
                                        color="danger"
                                        className="btn-sm"
                                        onClick={handlePdfExport}
                                        disabled={!reportData.length || exportLoader.pdf}
                                    >
                                        {exportLoader.pdf ? (
                                            <Spinner size="sm" className="me-1" />
                                        ) : (
                                            <i className="bx bxs-file-pdf me-1"></i>
                                        )}
                                        Export PDF
                                    </Button>
                                </Col>
                            </Row>


                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle table-bordered" style={{ fontSize: "13px" }}>
                                    <thead className="table-light">
                                        <tr className="text-center">
                                            <th style={{ width: "50px" }}>S.No</th>
                                            <th>District</th>
                                            <th>No of Farmers</th>
                                            <th>Blank Aadhar</th>
                                            <th>Aadhar Present</th>
                                            <th>Mobile Verified</th>
                                            <th>Mobile Not Verified</th>
                                            <th>Owner Active</th>
                                            <th>Owner Inactive</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loader ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5">
                                                    <Spinner color="primary" className="me-2" />
                                                    Loading district wise report...
                                                </td>
                                            </tr>
                                        ) : reportData.length > 0 ? (
                                            <>
                                                {reportData.map((row, index) => (
                                                    <tr key={index} className="text-center">
                                                        <td>{index + 1}</td>
                                                        <td className="text-start">{row.district || "—"}</td>
                                                        <td className="fw-medium">{row.totalFarmers || 0}</td>
                                                        <td>{row.blankAadhar || 0}</td>
                                                        <td>{row.aadharPresent || 0}</td>
                                                        <td>{row.mobileVerified || 0}</td>
                                                        <td>{row.mobileNotVerified || 0}</td>
                                                        <td>{row.ownerActive || 0}</td>
                                                        <td>{row.ownerInactive || 0}</td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5">
                                                    <div className="text-center">
                                                        <i className="bx bx-bar-chart-alt-2 bx-lg text-muted mb-3"></i>
                                                        <h5>No data available</h5>
                                                        <p className="text-muted">
                                                            The report API returned no records.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                    {/* Grand Total in tfoot - Always at the bottom of table */}
                                    {reportData.length > 0 && !loader && (
                                        <tfoot className="table-light">
                                            <tr className="text-center fw-bold">
                                                <td colSpan="2" className="text-end">
                                                    Grand Total
                                                </td>
                                                <td>{totals.noOfFarmers}</td>
                                                <td>{totals.blankAadhar}</td>
                                                <td>{totals.aadharPresent}</td>
                                                <td>{totals.mobileVerified}</td>
                                                <td>{totals.mobileNotVerified}</td>
                                                <td>{totals.ownerActive}</td>
                                                <td>{totals.ownerInactive}</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}


export default FarmersAbstractReport
