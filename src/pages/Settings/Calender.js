import React, { useEffect, useState, useCallback } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Select from "react-select"
import * as XLSX from "xlsx"
import axios from "axios"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Label,
  FormGroup,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Badge,
} from "reactstrap"
import { URLS } from "Url"

const Calendar = () => {
  // Auth
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const token = TokenJson?.token
  const userDetails = TokenJson?.user

  // State Management
  const [employmentType, setEmploymentType] = useState([])
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("")
  const [holidays, setHolidays] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  // Upload Modal State
  const [uploadModal, setUploadModal] = useState(false)
  const [uploadData, setUploadData] = useState({
    institutionId: "",
    date: new Date().toISOString().split("T")[0],
    name: "",
    file: null,
  })
  const [uploadFileName, setUploadFileName] = useState("")
  const [validationErrors, setValidationErrors] = useState({})

  // Select Styles
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 38,
      fontSize: 14,
      borderRadius: 6,
      borderColor: state.isFocused ? "#2563eb" : "#d0d7e2",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
      "&:hover": {
        borderColor: "#b8c2d3",
      },
    }),
    menu: base => ({
      ...base,
      zIndex: 9999,
      maxHeight: "300px",
    }),
    menuList: base => ({
      ...base,
      maxHeight: "250px",
      overflowY: "auto",
    }),
    option: base => ({
      ...base,
      fontSize: 14,
      padding: "8px 12px",
    }),
  }

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Convert Excel serial date to JavaScript Date
  const excelSerialToDate = serial => {
    if (!serial) return null
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + serial * 86400000)
    return date
  }

  // Parse holiday date - handles both Excel serial numbers and DD/MM/YYYY strings
  const parseHolidayDate = holidayDate => {
    if (!holidayDate) return null

    // If it's a number (Excel serial date)
    if (typeof holidayDate === "number") {
      return excelSerialToDate(holidayDate)
    }

    // If it's a string in DD/MM/YYYY format
    if (typeof holidayDate === "string") {
      const parts = holidayDate.split("/")
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
        const year = parseInt(parts[2], 10)
        return new Date(year, month, day)
      }
    }

    return null
  }

  // Format Date to DD-MM-YYYY
  const formatDateToDDMMYYYY = dateInput => {
    if (!dateInput) return ""

    let date
    if (dateInput instanceof Date) {
      date = dateInput
    } else if (typeof dateInput === "number") {
      date = excelSerialToDate(dateInput)
    } else if (typeof dateInput === "string") {
      // If already in DD/MM/YYYY format, convert to DD-MM-YYYY
      if (dateInput.includes("/")) {
        return dateInput.replace(/\//g, "-")
      }
      date = new Date(dateInput)
    }

    if (!date || isNaN(date.getTime())) return ""

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Fetch Employment Types
  const fetchEmploymentType = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data?.data) {
        setEmploymentType(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching employment types:", error)
      toast.error("Failed to load institution types")
    }
  }, [token])

  useEffect(() => {
    fetchEmploymentType()
  }, [fetchEmploymentType])

  // Fetch Holidays
  const fetchHolidays = useCallback(async () => {
    if (!token || !selectedInstitutionId) {
      toast.error("Please select an institution type")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        URLS.GetHolidaysByInstitutionType,
        { institutionId: selectedInstitutionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data?.holidays) {
        setHolidays(response.data.holidays)
        toast.success("Holidays loaded successfully")
      } else {
        setHolidays([])
        toast.info("No holidays found for this institution")
      }
    } catch (error) {
      console.error("Error fetching holidays:", error)
      toast.error(error.response?.data?.message || "Failed to fetch holidays")
      setHolidays([])
    } finally {
      setIsLoading(false)
    }
  }, [token, selectedInstitutionId])

  // Institution Type Options
  const institutionTypeOptions = employmentType.map(type => ({
    value: type._id,
    label: type.name,
  }))

  // Handle Institution Select
  const handleInstitutionSelect = selectedOption => {
    setSelectedInstitutionId(selectedOption?.value || "")
    setHolidays([]) // Clear previous holidays
  }

  // Check if date is holiday
  const isHoliday = (year, month, day) => {
    const dateStr = `${String(day).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`
    return holidays.some(holiday => {
      const holidayDateStr = formatDateToDDMMYYYY(holiday.holidayDate)
      return holidayDateStr === dateStr
    })
  }

  // Get holiday name
  const getHolidayName = (year, month, day) => {
    const dateStr = `${String(day).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`
    const holiday = holidays.find(h => {
      const holidayDateStr = formatDateToDDMMYYYY(h.holidayDate)
      return holidayDateStr === dateStr
    })
    return holiday?.holidayName || ""
  }

  // Generate calendar for a month
  const generateMonthCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const calendar = []
    let week = []

    // Fill empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      week.push(null)
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day)
      if (week.length === 7) {
        calendar.push(week)
        week = []
      }
    }

    // Fill remaining cells
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null)
      }
      calendar.push(week)
    }

    return calendar
  }

  // Upload Modal Functions
  const toggleUploadModal = () => {
    setUploadModal(!uploadModal)
    if (!uploadModal) {
      resetUploadForm()
    }
  }

  const resetUploadForm = () => {
    setUploadData({
      institutionId: "",
      date: new Date().toISOString().split("T")[0],
      name: "",
      file: null,
    })
    setUploadFileName("")
    setValidationErrors({})
  }

  const handleUploadInputChange = e => {
    const { name, value } = e.target
    setUploadData(prev => ({
      ...prev,
      [name]: value,
    }))
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined,
    }))
  }

  const handleUploadSelectChange = (selectedOption, { name }) => {
    setUploadData(prev => ({
      ...prev,
      [name]: selectedOption?.value || "",
    }))
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined,
    }))
  }

  const handleFileUpload = e => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)")
      return
    }

    setUploadFileName(file.name)
    setUploadData(prev => ({ ...prev, file }))
    setValidationErrors(prev => ({ ...prev, file: undefined }))
    toast.success(`File selected: ${file.name}`)
  }

  const validateUploadForm = () => {
    const errors = {}

    if (!uploadData.institutionId) {
      errors.institutionId = "Institution Type is required"
    }

    if (!uploadData.name) {
      errors.name = "Name is required"
    }

    if (!uploadData.file) {
      errors.file = "Excel file is required"
    }

    return errors
  }

  const handleUploadSubmit = async e => {
    e.preventDefault()

    const errors = validateUploadForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsUploading(true)

    // Format date to DD-MM-YYYY
    const dateObj = new Date(uploadData.date)
    const formattedDate = formatDateToDDMMYYYY(dateObj)

    const formData = new FormData()
    formData.append("institutionId", uploadData.institutionId)
    formData.append("date", formattedDate)
    formData.append("name", uploadData.name)
    formData.append("excell", uploadData.file)

    try {
      const response = await axios.post(URLS.UploadExcelForCalender, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data?.success) {
        toast.success(response.data.message || "Holidays uploaded successfully")
        toggleUploadModal()
        // Refresh holidays if same institution is selected
        if (selectedInstitutionId === uploadData.institutionId) {
          fetchHolidays()
        }
      }
    } catch (error) {
      console.error("Error uploading holidays:", error)
      toast.error(error.response?.data?.message || "Failed to upload holidays")
    } finally {
      setIsUploading(false)
    }
  }

  // Download Excel Template
  const downloadTemplate = () => {
    const templateData = [
      ["Holiday Date", "Holiday Name"],
      ["01/01/2026", "New Year"],
      ["26/01/2026", "Republic Day"],
      ["15/08/2026", "Independence Day"],
    ]

    const ws = XLSX.utils.aoa_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Holidays Template")
    XLSX.writeFile(wb, "Holidays_Template.xlsx")
    toast.success("Template downloaded successfully")
  }

  // Get sorted holidays
  const sortedHolidays = [...holidays].sort((a, b) => {
    const dateA = parseHolidayDate(a.holidayDate)
    const dateB = parseHolidayDate(b.holidayDate)
    if (!dateA || !dateB) return 0
    return dateA - dateB
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Calendar" />

          {/* Header Card */}
          <Card className="mb-3">
            <CardBody>
              <Row className="align-items-end">
                <Col md={4}>
                  <FormGroup>
                    <Label className="fw-bold">
                      Institution Type <span className="text-danger">*</span>
                    </Label>
                    <Select
                      name="institutionType"
                      value={institutionTypeOptions.find(
                        opt => opt.value === selectedInstitutionId
                      )}
                      onChange={handleInstitutionSelect}
                      options={institutionTypeOptions}
                      styles={selectStyles}
                      placeholder="Select Institution Type"
                      isSearchable
                      isClearable
                    />
                  </FormGroup>
                </Col>
                <Col md={8}>
                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      onClick={fetchHolidays}
                      disabled={!selectedInstitutionId || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-search me-2"></i>
                          Get Holidays List
                        </>
                      )}
                    </Button>
                    <Button color="success" outline onClick={toggleUploadModal}>
                      <i className="bx bx-upload me-2"></i>
                      Upload Holidays
                    </Button>
                    <Button color="info" outline onClick={downloadTemplate}>
                      <i className="bx bx-download me-2"></i>
                      Download Template
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row>
            {/* Calendar Section */}
            <Col lg={9}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">
                      <i className="bx bx-calendar me-2 text-primary"></i>
                      Calendar {currentYear}
                    </h5>
                    {holidays.length > 0 && (
                      <Badge color="success" pill className="px-3 py-2">
                        {holidays.length} Holidays
                      </Badge>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2 text-muted">Loading calendar...</p>
                    </div>
                  ) : (
                    <Row>
                      {monthNames.map((monthName, monthIndex) => (
                        <Col lg={4} md={6} key={monthIndex} className="mb-4">
                          <div className="border rounded p-2">
                            <h6 className="text-center mb-2 text-primary">
                              {monthName}
                            </h6>
                            <table className="table table-sm table-bordered mb-0">
                              <thead>
                                <tr className="text-center">
                                  <th style={{ fontSize: "10px", padding: "4px" }}>S</th>
                                  <th style={{ fontSize: "10px", padding: "4px" }}>M</th>
                                  <th style={{ fontSize: "10px", padding: "4px" }}>T</th>
                                  <th style={{ fontSize: "10px", padding: "4px" }}>W</th>
                                  <th style={{ fontSize: "10px", padding: "4px" }}>T</th>
                                  <th style={{ fontSize: "10px", padding: "4px" }}>F</th>
                                  <th style={{ fontSize: "10px", padding: "4px" }}>S</th>
                                </tr>
                              </thead>
                              <tbody>
                                {generateMonthCalendar(currentYear, monthIndex).map(
                                  (week, weekIndex) => (
                                    <tr key={weekIndex} className="text-center">
                                      {week.map((day, dayIndex) => {
                                        const isHol = day
                                          ? isHoliday(currentYear, monthIndex, day)
                                          : false
                                        const holidayName = day
                                          ? getHolidayName(currentYear, monthIndex, day)
                                          : ""

                                        return (
                                          <td
                                            key={dayIndex}
                                            style={{
                                              fontSize: "11px",
                                              padding: "6px 4px",
                                              backgroundColor: isHol
                                                ? "#d4edda"
                                                : "transparent",
                                              fontWeight: isHol ? "bold" : "normal",
                                              cursor: isHol ? "pointer" : "default",
                                            }}
                                            title={holidayName}
                                          >
                                            {day || ""}
                                          </td>
                                        )
                                      })}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Holidays List Section */}
            <Col lg={3}>
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">
                    <i className="bx bx-list-ul me-2 text-success"></i>
                    Holidays List
                  </h5>

                  {sortedHolidays.length > 0 ? (
                    <div style={{ maxHeight: "800px", overflowY: "auto" }}>
                      {sortedHolidays.map((holiday, index) => (
                        <div
                          key={index}
                          className="border rounded p-2 mb-2"
                          style={{ backgroundColor: "#d4edda" }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div style={{ flex: 1 }}>
                              <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>
                                {holiday.holidayName || "N/A"}
                              </div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>
                                <i className="bx bx-calendar-alt me-1"></i>
                                {formatDateToDDMMYYYY(holiday.holidayDate)}
                              </div>
                            </div>
                            <Badge color="success" pill>
                              {index + 1}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bx bx-calendar-x display-4 text-muted"></i>
                      <p className="text-muted mt-2">
                        {selectedInstitutionId
                          ? "No holidays found"
                          : "Select institution type and click 'Get Holidays List'"}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Upload Modal */}
          <Modal isOpen={uploadModal} toggle={toggleUploadModal} size="md">
            <ModalHeader toggle={toggleUploadModal} className="bg-success text-white">
              <i className="bx bx-upload me-2"></i>
              Upload Holidays
            </ModalHeader>
            <form onSubmit={handleUploadSubmit}>
              <ModalBody>
                <Alert color="info">
                  <i className="bx bx-info-circle me-2"></i>
                  Upload Excel file with columns: <strong>Holiday Date</strong> (DD/MM/YYYY) and{" "}
                  <strong>Holiday Name</strong>
                </Alert>

                <FormGroup>
                  <Label>
                    Institution Type <span className="text-danger">*</span>
                  </Label>
                  <Select
                    name="institutionId"
                    value={institutionTypeOptions.find(
                      opt => opt.value === uploadData.institutionId
                    )}
                    onChange={handleUploadSelectChange}
                    options={institutionTypeOptions}
                    styles={selectStyles}
                    placeholder="Select Institution Type"
                    isSearchable
                  />
                  {validationErrors.institutionId && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                      {validationErrors.institutionId}
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    Date <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="date"
                    name="date"
                    value={uploadData.date}
                    onChange={handleUploadInputChange}
                    className="form-control"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={uploadData.name}
                    onChange={handleUploadInputChange}
                    placeholder="Enter name (e.g., Annual Holidays 2026)"
                    className="form-control"
                  />
                  {validationErrors.name && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                      {validationErrors.name}
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    Excel File <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="form-control"
                  />
                  {uploadFileName && (
                    <div className="text-success mt-1" style={{ fontSize: "12px" }}>
                      <i className="bx bx-check-circle me-1"></i>
                      {uploadFileName}
                    </div>
                  )}
                  {validationErrors.file && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                      {validationErrors.file}
                    </div>
                  )}
                </FormGroup>

                <Alert color="warning" className="mb-0">
                  <small>
                    <strong>Note:</strong> Date format in Excel should be DD/MM/YYYY (e.g., 01/01/2026)
                  </small>
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggleUploadModal} disabled={isUploading}>
                  <i className="bx bx-x me-1"></i>
                  Cancel
                </Button>
                <Button color="success" type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-upload me-1"></i>
                      Upload
                    </>
                  )}
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default Calendar
