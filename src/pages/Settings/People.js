import React, { useState, useEffect, useCallback } from "react"
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Button,
    Form,
    Label,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Select from "react-select"
import { toast, ToastContainer } from "react-toastify"
import { URLS } from "../../Url"
import axios from "axios"

const People = () => {
    const [districts, setDistricts] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const token = JSON.parse(localStorage.getItem("authUser"))?.token

    // Select Styles - matching project design system
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: 38,
            height: 38,
            paddingLeft: 2,
            fontSize: 14,
            borderRadius: 8,
            borderColor: state.isFocused ? "#2563eb" : "#d0d7e2",
            boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
            transition: "0.25s",
            "&:hover": {
                borderColor: "#b8c2d3",
            },
        }),
        valueContainer: base => ({
            ...base,
            padding: "0 8px",
        }),
        indicatorsContainer: base => ({
            ...base,
            height: 38,
        }),
        option: base => ({
            ...base,
            fontSize: 14,
            padding: "8px 12px",
        }),
        placeholder: base => ({
            ...base,
            fontSize: 14,
            color: "#94a3b8",
        }),
    }

    // Fetch Districts
    const fetchDistricts = useCallback(async () => {
        try {
            const response = await axios.get(URLS.GetDistrict, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setDistricts(response.data.data || [])
        } catch (error) {
            toast.error("Failed to load districts")
        }
    }, [token])

    useEffect(() => {
        fetchDistricts()
    }, [fetchDistricts])

    // District Options
    const districtOptions = districts.map(district => ({
        value: district._id,
        label: district.name,
    }))

    // Handle District Change
    const handleDistrictChange = selectedOption => {
        setSelectedDistrict(selectedOption)
    }

    // Handle File Selection
    const handleFileChange = e => {
        const file = e.target.files[0]
        if (file) {
            const ext = file.name.split(".").pop().toLowerCase()
            if (ext === "xlsx" || ext === "xls" || ext === "csv") {
                setSelectedFile(file)
                toast.success(`File "${file.name}" selected`)
            } else {
                toast.error("Please select a valid Excel (.xlsx, .xls) or CSV file")
                e.target.value = null
            }
        }
    }

    // Handle Upload
    const handleUpload = async () => {
        // Validation
        if (!selectedDistrict) {
            toast.error("Please select a district")
            return
        }

        if (!selectedFile) {
            toast.error("Please select a file to upload")
            return
        }

        setIsUploading(true)

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append("file", selectedFile)
            formData.append("districtId", selectedDistrict.value)

            // TODO: Replace with actual upload endpoint when backend is ready
            // For now, this is a static/mock upload
            console.log("Upload Data:", {
                districtId: selectedDistrict.value,
                districtName: selectedDistrict.label,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
            })

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success(
                `File uploaded successfully for ${selectedDistrict.label} district`
            )

            // Reset form
            setSelectedDistrict(null)
            setSelectedFile(null)
            document.getElementById("fileInput").value = null
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
        } finally {
            setIsUploading(false)
        }
    }

    // Format File Size
    const formatFileSize = bytes => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Settings" breadcrumbItem="People" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <h4 className="card-title mb-4">Upload People Data</h4>

                                    <Form>
                                        <Row>
                                            {/* District Dropdown */}
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label>
                                                        District <span className="text-danger">*</span>
                                                    </Label>
                                                    <Select
                                                        value={selectedDistrict}
                                                        onChange={handleDistrictChange}
                                                        options={districtOptions}
                                                        styles={selectStyles}
                                                        placeholder="Select District"
                                                        isClearable
                                                    />
                                                </div>
                                            </Col>

                                            {/* File Input */}
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="fileInput">
                                                        Select File (Excel/CSV){" "}
                                                        <span className="text-danger">*</span>
                                                    </Label>
                                                    <input
                                                        type="file"
                                                        id="fileInput"
                                                        className="form-control"
                                                        accept=".xlsx,.xls,.csv"
                                                        onChange={handleFileChange}
                                                        disabled={isUploading}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* File Preview */}
                                        {selectedFile && (
                                            <Row>
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <div
                                                            style={{
                                                                padding: "12px 16px",
                                                                backgroundColor: "#f8f9fa",
                                                                borderRadius: "8px",
                                                                border: "1px solid #e3e6ea",
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <i className="bx bx-file me-2 text-primary"></i>
                                                                    <strong>{selectedFile.name}</strong>
                                                                    <span className="text-muted ms-2">
                                                                        ({formatFileSize(selectedFile.size)})
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    color="link"
                                                                    className="text-danger p-0"
                                                                    onClick={() => {
                                                                        setSelectedFile(null)
                                                                        document.getElementById("fileInput").value =
                                                                            null
                                                                    }}
                                                                >
                                                                    <i className="bx bx-trash"></i>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}

                                        {/* Upload Button */}
                                        <Row>
                                            <Col md={12}>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        color="primary"
                                                        onClick={handleUpload}
                                                        disabled={isUploading}
                                                        style={{
                                                            minWidth: "120px",
                                                            borderRadius: "8px",
                                                        }}
                                                    >
                                                        {isUploading ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Uploading...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bx bx-upload me-2"></i>
                                                                Upload File
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>

                                    {/* Information Card */}
                                    <div className="mt-4">
                                        <div
                                            style={{
                                                padding: "16px",
                                                backgroundColor: "#ecf3ff",
                                                borderRadius: "8px",
                                                border: "1px solid #c9ddff",
                                            }}
                                        >
                                            <h6 className="text-primary mb-2">
                                                <i className="bx bx-info-circle me-1"></i>
                                                Instructions
                                            </h6>
                                            <ul className="mb-0 text-muted" style={{ fontSize: "14px" }}>
                                                <li>Select a district from the dropdown menu</li>
                                                <li>
                                                    Choose an Excel (.xlsx, .xls) or CSV (.csv) file
                                                    containing people data
                                                </li>
                                                <li>Click the "Upload File" button to upload the data</li>
                                                <li>
                                                    <em>Note: File upload functionality is currently static</em>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <ToastContainer />
        </React.Fragment>
    )
}

export default People