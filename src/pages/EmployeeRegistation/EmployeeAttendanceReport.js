import React, { useState, useEffect, useCallback } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import { toast } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"
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
} from "reactstrap"

function EmployeeAttendanceReport() {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token
  const Roles = TokenJson?.rolesAndPermission?.[0]

  if (!Roles?.AttendanceReportView && !Roles?.accessAll) {
    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title="VAHD ADMIN"
              breadcrumbItem="Employee Attendance Report"
            />
            <h4 className="text-center mt-5">
              You don't have permission to view this page.
            </h4>
          </div>
        </div>
      </React.Fragment>
    )
  }

  const [userInCsv, setUserInCsv] = useState([])
  const [employeeAttendanceReport, setEmployeeAttendanceReport] = useState([])
  const [modal, setModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [imageTitle, setImageTitle] = useState("")
  const [placeOfWorking, setPlaceOfWorking] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [listPerPage, setListPerPage] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [filters, setFilters] = useState({
    workingPlace: "",
    fromDate: "",
    toDate: "",
    search: "",
  })

  const fetchPlaceOfWorking = useCallback(async () => {
    try {
      const response = await axios.post(
        URLS.GetPlaceOfWorking,
        {},
        { headers: { Authorization: `Bearer ${TokenData}` } }
      )
      setPlaceOfWorking(response.data.data || [])
    } catch (error) {
      console.error("Failed to load Place Of Working:", error)
      toast.error("Failed to load Place Of Working")
    }
  }, [TokenData])

  const changePage = ({ selected }) => {
    const newPage = selected + 1
    getEmployeeAttendanceReport(newPage, filters)
  }

  useEffect(() => {
    getEmployeeAttendanceReport()
    fetchPlaceOfWorking()
  }, [fetchPlaceOfWorking])

  const getEmployeeAttendanceReport = useCallback(
    (page = 1, filterParams = filters) => {
      const token = TokenData
      const payload = {
        page,
        workingPlace: filterParams.workingPlace,
        fromDate: filterParams.fromDate,
        toDate: filterParams.toDate,
        search: filterParams.search,
      }

      axios
        .post(URLS.GetEmployeeReport, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          setEmployeeAttendanceReport(res?.data?.user || [])
          setUserInCsv(res?.data?.userExcell || [])
          setListPerPage(res?.data?.totalPages || 0)
          setPageNumber(res?.data?.page || 1)
          setTotalCount(res?.data?.totalCount || 0)
        })
        .catch(error => {
          console.error("Failed to load employee attendance report:", error)
          toast.error("Failed to load attendance data")
        })
    },
    [TokenData, filters]
  )

  const handleFilterChange = e => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    getEmployeeAttendanceReport(1, filters)
  }

  const handleReset = () => {
    const resetFilters = {
      workingPlace: "",
      fromDate: "",
      toDate: "",
      search: "",
    }
    setFilters(resetFilters)
    getEmployeeAttendanceReport(1, resetFilters)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const csvReport = {
    filename: "Employee_Attendance_Report.csv",
    data: userInCsv,
  }

  const toggleModal = (image = "", title = "") => {
    setSelectedImage(image)
    setImageTitle(title)
    setModal(!modal)
  }

  // --- PDF Export ---
  const handlePdfExport = () => {
    if (!employeeAttendanceReport.length) {
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
      doc.text("Employee ATTENDANCE REPORT", pageWidth / 2, 15, { align: "center" })

      // Date range
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, "normal")
      let dateText = ""
      if (filters.fromDate) dateText += `From: ${filters.fromDate} `
      if (filters.toDate) dateText += `To: ${filters.toDate}`
      if (dateText) doc.text(dateText, pageWidth / 2, 22, { align: "center" })

      const generatedText = `Generated On: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
      doc.text(generatedText, pageWidth - marginRight, 30, { align: "right" })

      // Table headers (omit image columns)
      const headers = ["S.No", "Date", "Employee Id", "Employee", "Designation", "Check-In Time", "Check-In Location", "Check-Out Time", "Check-Out Location"]

      // Table data
      const tableRows = employeeAttendanceReport.map((data, index) => [
        ((pageNumber - 1) * 10 + index + 1).toString(),
        data.checkinDate || "N/A",
        data.employeeId || "N/A",
        data.staffName || "N/A",
        data.designationName || "N/A",
        data.checkinTime || "N/A",
        data.checkinAddress || "N/A",
        data.checkoutTime || "N/A",
        data.checkOutAddress || "N/A",
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

      const fileName = `Attendance_Report_${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)
      toast.success("PDF exported successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="VAHD ADMIN"
            breadcrumbItem="Employee Attendance Report"
          />

          {showFilters && (
            <Row className="mb-3">
              <Col md={12}>
                <Card>
                  <CardBody>
                    <h5 className="mb-3">Filters</h5>
                    <Row>
                      <Col md={3}>
                        <Label>Working Place</Label>
                        <Input
                          type="select"
                          name="workingPlace"
                          value={filters.workingPlace}
                          onChange={handleFilterChange}
                        >
                          <option value="">All Working Places</option>
                          {placeOfWorking.map(place => (
                            <option key={place._id} value={place._id}>
                              {place.name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                      <Col md={2}>
                        <Label>From Date</Label>
                        <Input
                          type="date"
                          name="fromDate"
                          value={filters.fromDate}
                          onChange={handleFilterChange}
                        />
                      </Col>
                      <Col md={2}>
                        <Label>To Date</Label>
                        <Input
                          type="date"
                          name="toDate"
                          value={filters.toDate}
                          onChange={handleFilterChange}
                        />
                      </Col>
                      <Col md={3}>
                        <Label>Search Employee</Label>
                        <Input
                          name="search"
                          value={filters.search}
                          onChange={handleFilterChange}
                          type="search"
                          placeholder="Search by employee name..."
                        />
                      </Col>
                      <Col md={2} className="d-flex align-items-end">
                        <div className="d-flex gap-2 w-100">
                          <Button
                            color="primary"
                            onClick={handleSearch}
                            className="w-50"
                          >
                            Search
                          </Button>
                          <Button
                            color="secondary"
                            onClick={handleReset}
                            className="w-50"
                          >
                            Reset
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-3">
                        Employee Attendance Details
                      </h5>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-center justify-content-end">
                        <Button
                          color="primary"
                          onClick={toggleFilters}
                          className="d-flex align-items-center m-1"
                        >
                          <i
                            className={`fas ${showFilters ? "fa-eye-slash" : "fa-filter"
                              } me-2`}
                          ></i>
                          {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                        <CSVLink
                          {...csvReport}
                          className="btn btn-success me-3"
                        >
                          <i className="fas fa-file-excel me-2"></i> Export to
                          Excel
                        </CSVLink>
                        <Button
                          color="danger"
                          onClick={handlePdfExport}
                          className="d-flex align-items-center m-1"
                          disabled={!employeeAttendanceReport.length}
                        >
                          <i className="bx bxs-file-pdf me-2"></i> PDF
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center"> S.No </th>
                          <th>Date</th>
                          <th>Employee Id</th>
                          <th>Employee</th>
                          <th>Designation</th>
                          <th className="text-center">Check-In</th>
                          <th>Time</th>
                          <th>Location</th>
                          <th className="text-center">Check-Out</th>
                          <th>Time</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeAttendanceReport.length > 0 ? (
                          employeeAttendanceReport.map((data, key) => (
                            <tr key={key}>
                              <td className="text-center">
                                {(pageNumber - 1) * 10 + key + 1}
                              </td>
                              <td>{data.checkinDate || "N/A"}</td>
                              <td>{data.employeeId || "N/A"}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <h5 className="font-size-14 mb-1">
                                      {data.staffName || "N/A"}
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{data.designationName || "N/A"}</td>
                              <td className="text-center">
                                {data.checkinImage ? (
                                  <img
                                    src={`${URLS.Base}${data.checkinImage}`}
                                    alt={`Check-In ${data.staffName}`}
                                    className="rounded avatar-sm cursor-pointer"
                                    style={{
                                      cursor: "pointer",
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                    }}
                                    onClick={() =>
                                      toggleModal(
                                        data.checkinImage,
                                        `${data.staffName} - Check-In`
                                      )
                                    }
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>{data.checkinTime || "N/A"}</td>
                              <td>
                                <div>{data.checkinAddress || "N/A"}</div>
                              </td>
                              <td className="text-center">
                                {data.checkOutImage ? (
                                  <img
                                    src={`${URLS.Base}${data.checkOutImage}`}
                                    alt={`Check-Out ${data.staffName}`}
                                    style={{
                                      cursor: "pointer",
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                    }}
                                    className="rounded avatar-sm cursor-pointer"
                                    onClick={() =>
                                      toggleModal(
                                        data.checkOutImage,
                                        `${data.staffName} - Check-Out`
                                      )
                                    }
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td>{data.checkoutTime || "N/A"}</td>
                              <td>
                                <div>{data.checkOutAddress || "N/A"}</div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center py-4">
                              <h5>No attendance records found</h5>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                    {listPerPage > 1 && (
                      <div className="mt-3 d-flex justify-content-end">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={listPerPage}
                          onPageChange={changePage}
                          containerClassName={"pagination pagination-sm"}
                          previousLinkClassName={"page-link"}
                          nextLinkClassName={"page-link"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          total={totalCount}
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggleModal} centered size="lg">
        <ModalHeader toggle={toggleModal}>{imageTitle}</ModalHeader>
        <ModalBody className="text-center">
          {selectedImage ? (
            <img
              src={`${URLS.Base}${selectedImage}`}
              alt={imageTitle}
              className="img-fluid"
              style={{ maxHeight: "70vh" }}
            />
          ) : (
            <p>No image available</p>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default EmployeeAttendanceReport