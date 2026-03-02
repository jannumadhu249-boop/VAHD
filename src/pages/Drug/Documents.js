// import React, { useState, useEffect, useCallback, useMemo } from "react"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import axios from "axios"
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   FormGroup,
//   Label,
//   Button,
//   Spinner,
//   Table,
//   Badge,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap"
// import Select from "react-select"
// import { URLS } from "../../Url"

// const Documents = () => {
//   const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//   const token = authUser?.token || ""

//   // State for filters
//   const [financialYears, setFinancialYears] = useState([])
//   const [schemes, setSchemes] = useState([])
//   const [quarters, setQuarters] = useState([])
  
//   // State for form data
//   const [personalDocument, setPersonalDocument] = useState({
//     financialYearId: "",
//     schemeId: "",
//     quarterId: "",
//     file: null,
//     fileName: "",
//   })

//   const [sharedDocument, setSharedDocument] = useState({
//     financialYearId: "",
//     schemeId: "",
//     quarterId: "",
//     file: null,
//     fileName: "",
//   })

//   // State for documents lists
//   const [personalDocuments, setPersonalDocuments] = useState([])
//   const [sharedDocuments, setSharedDocuments] = useState([])
//   const [loading, setLoading] = useState({
//     filters: false,
//     personalUpload: false,
//     sharedUpload: false,
//     personalList: false,
//     sharedList: false,
//   })

//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     documentId: null,
//     documentType: null,
//   })

//   // Select styles to match existing theme
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: 40,
//       height: 40,
//       fontSize: 14,
//       borderRadius: 6,
//       borderColor: state.isFocused ? "#405189" : "#ced4da",
//       boxShadow: state.isFocused
//         ? "0 0 0 0.2rem rgba(64, 81, 137, 0.25)"
//         : "none",
//       transition:
//         "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
//       "&:hover": {
//         borderColor: "#b1bbc4",
//       },
//     }),
//     valueContainer: base => ({
//       ...base,
//       padding: "0 8px",
//       height: "100%",
//     }),
//     input: base => ({
//       ...base,
//       margin: 0,
//       padding: 0,
//     }),
//     indicatorsContainer: base => ({
//       ...base,
//       height: 38,
//     }),
//     dropdownIndicator: base => ({
//       ...base,
//       padding: "4px 8px",
//     }),
//     clearIndicator: base => ({
//       ...base,
//       padding: "4px 8px",
//     }),
//     indicatorSeparator: base => ({
//       ...base,
//       marginTop: 8,
//       marginBottom: 8,
//     }),
//     option: (base, state) => ({
//       ...base,
//       fontSize: 14,
//       padding: "8px 12px",
//       backgroundColor: state.isSelected
//         ? "#2362c8"
//         : state.isFocused
//         ? "#f8f9fa"
//         : "white",
//       color: state.isSelected ? "white" : "#212529",
//       "&:active": {
//         backgroundColor: "#2362c8",
//         color: "white",
//       },
//     }),
//     placeholder: base => ({
//       ...base,
//       fontSize: 14,
//       color: "#6c757d",
//     }),
//     singleValue: base => ({
//       ...base,
//       color: "#212529",
//     }),
//   }

//   // Fetch financial years
//   const fetchFinancialYears = useCallback(async () => {
//     if (!token) return

//     try {
//       const response = await axios.post(
//         URLS.GetFinancialyear,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 15000,
//         }
//       )

//       if (response.data?.data) {
//         setFinancialYears(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error fetching financial years:", error)
//       toast.error("Failed to fetch financial years")
//     }
//   }, [token])

//   // Fetch schemes and quarters based on financial year
//   const fetchSchemesAndQuarters = useCallback(
//     async (financialYearId, type) => {
//       if (!token || !financialYearId) {
//         if (type === "personal") {
//           setPersonalDocument(prev => ({ ...prev, schemeId: "", quarterId: "" }))
//         } else {
//           setSharedDocument(prev => ({ ...prev, schemeId: "", quarterId: "" }))
//         }
//         setSchemes([])
//         setQuarters([])
//         return
//       }

//       setLoading(prev => ({ ...prev, filters: true }))

//       try {
//         const response = await axios.post(
//           URLS.GetScheme,
//           { financialYearId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             timeout: 15000,
//           }
//         )

//         if (response.data) {
//           const schemesData = response.data.schemes || []
//           const quartersData = response.data.quarters || []

//           setSchemes(schemesData)
//           setQuarters(quartersData)
//         }
//       } catch (error) {
//         console.error("Error fetching schemes and quarters:", error)
//         toast.error("Failed to load schemes and quarters")
//         setSchemes([])
//         setQuarters([])
//       } finally {
//         setLoading(prev => ({ ...prev, filters: false }))
//       }
//     },
//     [token]
//   )

//   // Fetch personal documents
//   const fetchPersonalDocuments = useCallback(async () => {
//     if (!token) return

//     setLoading(prev => ({ ...prev, personalList: true }))

//     try {
//       const response = await axios.post(
//         URLS.GetPersonalDocuments || "/api/documents/personal",
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 15000,
//         }
//       )

//       if (response.data?.data) {
//         setPersonalDocuments(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error fetching personal documents:", error)
//       toast.error("Failed to load personal documents")
//       setPersonalDocuments([])
//     } finally {
//       setLoading(prev => ({ ...prev, personalList: false }))
//     }
//   }, [token])

//   // Fetch shared documents
//   const fetchSharedDocuments = useCallback(async () => {
//     if (!token) return

//     setLoading(prev => ({ ...prev, sharedList: true }))

//     try {
//       const response = await axios.post(
//         URLS.GetSharedDocuments || "/api/documents/shared",
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 15000,
//         }
//       )

//       if (response.data?.data) {
//         setSharedDocuments(response.data.data)
//       }
//     } catch (error) {
//       console.error("Error fetching shared documents:", error)
//       toast.error("Failed to load shared documents")
//       setSharedDocuments([])
//     } finally {
//       setLoading(prev => ({ ...prev, sharedList: false }))
//     }
//   }, [token])

//   // Handle file selection
//   const handleFileChange = (event, type) => {
//     const file = event.target.files[0]
//     if (!file) return

//     // Check file size (limit to 10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       toast.error("File size should not exceed 10MB")
//       return
//     }

//     // Check file type (allow common document types)
//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "text/plain",
//       "image/jpeg",
//       "image/png",
//       "image/jpg",
//     ]

//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Invalid file type. Please upload PDF, Word, Excel, or image files.")
//       return
//     }

//     if (type === "personal") {
//       setPersonalDocument(prev => ({
//         ...prev,
//         file,
//         fileName: file.name,
//       }))
//     } else {
//       setSharedDocument(prev => ({
//         ...prev,
//         file,
//         fileName: file.name,
//       }))
//     }
//   }

//   // Handle filter changes
//   const handleFilterChange = (selectedOption, { name }, type) => {
//     const value = selectedOption?.value || ""

//     if (name === "financialYearId") {
//       if (type === "personal") {
//         setPersonalDocument(prev => ({
//           ...prev,
//           financialYearId: value,
//           schemeId: "",
//           quarterId: "",
//         }))
//       } else {
//         setSharedDocument(prev => ({
//           ...prev,
//           financialYearId: value,
//           schemeId: "",
//           quarterId: "",
//         }))
//       }
      
//       if (value) {
//         fetchSchemesAndQuarters(value, type)
//       } else {
//         setSchemes([])
//         setQuarters([])
//       }
//     } else if (name === "schemeId") {
//       if (type === "personal") {
//         setPersonalDocument(prev => ({ ...prev, schemeId: value }))
//       } else {
//         setSharedDocument(prev => ({ ...prev, schemeId: value }))
//       }
//     } else if (name === "quarterId") {
//       if (type === "personal") {
//         setPersonalDocument(prev => ({ ...prev, quarterId: value }))
//       } else {
//         setSharedDocument(prev => ({ ...prev, quarterId: value }))
//       }
//     }
//   }

//   // Upload personal document
//   const uploadPersonalDocument = async () => {
//     if (!personalDocument.file) {
//       toast.warning("Please select a file to upload")
//       return
//     }

//     if (!personalDocument.financialYearId || !personalDocument.schemeId || !personalDocument.quarterId) {
//       toast.warning("Please select Financial Year, Scheme, and Quarter")
//       return
//     }

//     setLoading(prev => ({ ...prev, personalUpload: true }))

//     try {
//       const formData = new FormData()
//       formData.append("file", personalDocument.file)
//       formData.append("financialYearId", personalDocument.financialYearId)
//       formData.append("schemeId", personalDocument.schemeId)
//       formData.append("quarterId", personalDocument.quarterId)
//       formData.append("fileName", personalDocument.fileName)

//       const response = await axios.post(
//         URLS.UploadPersonalDocument || "/api/documents/upload/personal",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       )

//       if (response.status === 200 || response.status === 201) {
//         toast.success("Personal document uploaded successfully")
//         // Reset form
//         setPersonalDocument({
//           financialYearId: "",
//           schemeId: "",
//           quarterId: "",
//           file: null,
//           fileName: "",
//         })
//         // Refresh list
//         fetchPersonalDocuments()
//       }
//     } catch (error) {
//       console.error("Error uploading personal document:", error)
//       toast.error(error.response?.data?.message || "Failed to upload personal document")
//     } finally {
//       setLoading(prev => ({ ...prev, personalUpload: false }))
//     }
//   }

//   // Upload shared document
//   const uploadSharedDocument = async () => {
//     if (!sharedDocument.file) {
//       toast.warning("Please select a file to upload")
//       return
//     }

//     if (!sharedDocument.financialYearId || !sharedDocument.schemeId || !sharedDocument.quarterId) {
//       toast.warning("Please select Financial Year, Scheme, and Quarter")
//       return
//     }

//     setLoading(prev => ({ ...prev, sharedUpload: true }))

//     try {
//       const formData = new FormData()
//       formData.append("file", sharedDocument.file)
//       formData.append("financialYearId", sharedDocument.financialYearId)
//       formData.append("schemeId", sharedDocument.schemeId)
//       formData.append("quarterId", sharedDocument.quarterId)
//       formData.append("fileName", sharedDocument.fileName)

//       const response = await axios.post(
//         URLS.UploadSharedDocument || "/api/documents/upload/shared",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       )

//       if (response.status === 200 || response.status === 201) {
//         toast.success("Shared document uploaded successfully")
//         // Reset form
//         setSharedDocument({
//           financialYearId: "",
//           schemeId: "",
//           quarterId: "",
//           file: null,
//           fileName: "",
//         })
//         // Refresh list
//         fetchSharedDocuments()
//       }
//     } catch (error) {
//       console.error("Error uploading shared document:", error)
//       toast.error(error.response?.data?.message || "Failed to upload shared document")
//     } finally {
//       setLoading(prev => ({ ...prev, sharedUpload: false }))
//     }
//   }

//   // Download document
//   const downloadDocument = async (documentId, fileName, type) => {
//     try {
//       const response = await axios.get(
//         `${URLS.DownloadDocument || "/api/documents/download"}/${documentId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           responseType: 'blob',
//         }
//       )

//       // Create a blob from the response
//       const blob = new Blob([response.data])
//       const url = window.URL.createObjectURL(blob)
      
//       // Create a temporary link and trigger download
//       const link = document.createElement('a')
//       link.href = url
//       link.download = fileName
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
      
//       // Clean up
//       window.URL.revokeObjectURL(url)
      
//       toast.success("Document downloaded successfully")
//     } catch (error) {
//       console.error("Error downloading document:", error)
//       toast.error("Failed to download document")
//     }
//   }

//   // Delete document
//   const deleteDocument = async () => {
//     const { documentId, documentType } = deleteModal

//     try {
//       const response = await axios.delete(
//         `${URLS.DeleteDocument || "/api/documents"}/${documentId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       if (response.status === 200) {
//         toast.success("Document deleted successfully")
        
//         // Refresh the appropriate list
//         if (documentType === "personal") {
//           fetchPersonalDocuments()
//         } else {
//           fetchSharedDocuments()
//         }
        
//         setDeleteModal({ isOpen: false, documentId: null, documentType: null })
//       }
//     } catch (error) {
//       console.error("Error deleting document:", error)
//       toast.error("Failed to delete document")
//     }
//   }

//   // Get file icon based on file type
//   const getFileIcon = (fileName) => {
//     const extension = fileName.split('.').pop().toLowerCase()
    
//     switch (extension) {
//       case 'pdf':
//         return <i className="bx bxs-file-pdf text-danger"></i>
//       case 'doc':
//       case 'docx':
//         return <i className="bx bxs-file-doc text-primary"></i>
//       case 'xls':
//       case 'xlsx':
//         return <i className="bx bxs-file-xls text-success"></i>
//       case 'jpg':
//       case 'jpeg':
//       case 'png':
//         return <i className="bx bxs-file-image text-warning"></i>
//       case 'txt':
//         return <i className="bx bxs-file-txt text-secondary"></i>
//       default:
//         return <i className="bx bxs-file text-muted"></i>
//     }
//   }

//   // Get file size in readable format
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const sizes = ['Bytes', 'KB', 'MB', 'GB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     })
//   }

//   // Initialize data
//   useEffect(() => {
//     fetchFinancialYears()
//     fetchPersonalDocuments()
//     fetchSharedDocuments()
//   }, [fetchFinancialYears, fetchPersonalDocuments, fetchSharedDocuments])

//   // Options for select components
//   const financialYearOptions = useMemo(
//     () =>
//       financialYears.map(year => ({
//         value: year._id,
//         label: year.year,
//       })),
//     [financialYears]
//   )

//   const schemeOptions = useMemo(
//     () =>
//       schemes.map(scheme => ({
//         value: scheme._id,
//         label: scheme.name,
//       })),
//     [schemes]
//   )

//   const quarterOptions = useMemo(
//     () =>
//       quarters.map(quarter => ({
//         value: quarter._id,
//         label: quarter.quarter,
//       })),
//     [quarters]
//   )

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 className="text-primary mb-0">
//             <i className="bx bx-folder me-2"></i>
//             Documents Management
//           </h4>
//         </div>

//         {/* Section 1: Personal Documents */}
//         <Card className="mb-4 border-0 shadow-sm">
//           <CardBody>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div>
//                 <h5 className="text-primary mb-1">
//                   <i className="bx bx-user-circle me-2"></i>
//                   Personal Documents
//                 </h5>
//                 <p className="text-muted mb-0">
//                   Upload your personal documents. Only you can view and manage these documents.
//                 </p>
//               </div>
//             </div>

//             {/* Upload Form */}
//             <Card className="border mb-4">
//               <CardBody>
//                 <Row className="g-3">
//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Financial Year *
//                       </Label>
//                       <Select
//                         name="financialYearId"
//                         value={financialYearOptions.find(
//                           opt => opt.value === personalDocument.financialYearId
//                         )}
//                         onChange={(option) => handleFilterChange(option, { name: "financialYearId" }, "personal")}
//                         options={financialYearOptions}
//                         styles={selectStyles}
//                         placeholder="Select Year"
//                         isSearchable
//                         isClearable
//                         isLoading={loading.filters}
//                       />
//                     </FormGroup>
//                   </Col>

//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Scheme *
//                       </Label>
//                       <Select
//                         name="schemeId"
//                         value={schemeOptions.find(
//                           opt => opt.value === personalDocument.schemeId
//                         )}
//                         onChange={(option) => handleFilterChange(option, { name: "schemeId" }, "personal")}
//                         options={schemeOptions}
//                         styles={selectStyles}
//                         placeholder="Select Scheme"
//                         isSearchable
//                         isClearable
//                         isDisabled={!personalDocument.financialYearId || loading.filters}
//                       />
//                     </FormGroup>
//                   </Col>

//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Quarter *
//                       </Label>
//                       <Select
//                         name="quarterId"
//                         value={quarterOptions.find(
//                           opt => opt.value === personalDocument.quarterId
//                         )}
//                         onChange={(option) => handleFilterChange(option, { name: "quarterId" }, "personal")}
//                         options={quarterOptions}
//                         styles={selectStyles}
//                         placeholder="Select Quarter"
//                         isSearchable
//                         isClearable
//                         isDisabled={!personalDocument.financialYearId || loading.filters}
//                       />
//                     </FormGroup>
//                   </Col>

//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Document File *
//                       </Label>
//                       <div className="d-flex align-items-center">
//                         <div className="flex-grow-1">
//                           <input
//                             type="file"
//                             id="personal-file"
//                             className="form-control"
//                             onChange={(e) => handleFileChange(e, "personal")}
//                             accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
//                           />
//                         </div>
//                       </div>
//                       {personalDocument.fileName && (
//                         <div className="mt-2">
//                           <Badge color="info" className="me-2">
//                             <i className="bx bx-file me-1"></i>
//                             {personalDocument.fileName}
//                           </Badge>
//                         </div>
//                       )}
//                     </FormGroup>
//                   </Col>
//                 </Row>

//                 <div className="d-flex justify-content-end mt-3">
//                   <Button
//                     color="primary"
//                     onClick={uploadPersonalDocument}
//                     disabled={loading.personalUpload || !personalDocument.file}
//                   >
//                     {loading.personalUpload ? (
//                       <>
//                         <Spinner size="sm" className="me-2" />
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bx bx-upload me-2"></i>
//                         Upload Personal Document
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </CardBody>
//             </Card>

//             {/* Personal Documents List */}
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h6 className="mb-0 text-dark">My Uploaded Documents</h6>
//                 <Button
//                   color="outline-secondary"
//                   size="sm"
//                   onClick={fetchPersonalDocuments}
//                   disabled={loading.personalList}
//                 >
//                   <i className="bx bx-refresh me-1"></i>
//                   Refresh
//                 </Button>
//               </div>

//               {loading.personalList ? (
//                 <div className="text-center py-4">
//                   <Spinner color="primary" />
//                   <p className="mt-2 text-muted">Loading personal documents...</p>
//                 </div>
//               ) : personalDocuments.length > 0 ? (
//                 <div className="table-responsive">
//                   <Table hover className="table-bordered">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Document</th>
//                         <th>Financial Year</th>
//                         <th>Scheme</th>
//                         <th>Quarter</th>
//                         <th>Uploaded On</th>
//                         <th>Size</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {personalDocuments.map((doc) => (
//                         <tr key={doc._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               <div className="me-3">
//                                 {getFileIcon(doc.fileName)}
//                               </div>
//                               <div>
//                                 <div className="fw-medium">{doc.fileName}</div>
//                                 {doc.description && (
//                                   <small className="text-muted">{doc.description}</small>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td>{doc.financialYear?.year || "-"}</td>
//                           <td>{doc.scheme?.name || "-"}</td>
//                           <td>{doc.quarter?.quarter || "-"}</td>
//                           <td>{formatDate(doc.createdAt)}</td>
//                           <td>{formatFileSize(doc.fileSize)}</td>
//                           <td>
//                             <div className="d-flex gap-2">
//                               <Button
//                                 color="success"
//                                 size="sm"
//                                 onClick={() => downloadDocument(doc._id, doc.fileName, "personal")}
//                               >
//                                 <i className="bx bx-download"></i>
//                               </Button>
//                               <Button
//                                 color="danger"
//                                 size="sm"
//                                 onClick={() => setDeleteModal({
//                                   isOpen: true,
//                                   documentId: doc._id,
//                                   documentType: "personal"
//                                 })}
//                               >
//                                 <i className="bx bx-trash"></i>
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               ) : (
//                 <Card>
//                   <CardBody className="text-center py-5">
//                     <div className="mb-3">
//                       <i className="bx bx-folder-open display-4 text-muted"></i>
//                     </div>
//                     <h5 className="text-muted mb-2">No Personal Documents</h5>
//                     <p className="text-muted">
//                       Upload your first personal document using the form above.
//                     </p>
//                   </CardBody>
//                 </Card>
//               )}
//             </div>
//           </CardBody>
//         </Card>

//         {/* Section 2: Shared Documents */}
//         <Card className="border-0 shadow-sm">
//           <CardBody>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div>
//                 <h5 className="text-primary mb-1">
//                   <i className="bx bx-share-alt me-2"></i>
//                   Shared Documents
//                 </h5>
//                 <p className="text-muted mb-0">
//                   Upload documents to share with other users. All users can view and download shared documents.
//                 </p>
//               </div>
//             </div>

//             {/* Upload Form */}
//             <Card className="border mb-4">
//               <CardBody>
//                 <Row className="g-3">
//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Financial Year *
//                       </Label>
//                       <Select
//                         name="financialYearId"
//                         value={financialYearOptions.find(
//                           opt => opt.value === sharedDocument.financialYearId
//                         )}
//                         onChange={(option) => handleFilterChange(option, { name: "financialYearId" }, "shared")}
//                         options={financialYearOptions}
//                         styles={selectStyles}
//                         placeholder="Select Year"
//                         isSearchable
//                         isClearable
//                         isLoading={loading.filters}
//                       />
//                     </FormGroup>
//                   </Col>

//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Scheme *
//                       </Label>
//                       <Select
//                         name="schemeId"
//                         value={schemeOptions.find(
//                           opt => opt.value === sharedDocument.schemeId
//                         )}
//                         onChange={(option) => handleFilterChange(option, { name: "schemeId" }, "shared")}
//                         options={schemeOptions}
//                         styles={selectStyles}
//                         placeholder="Select Scheme"
//                         isSearchable
//                         isClearable
//                         isDisabled={!sharedDocument.financialYearId || loading.filters}
//                       />
//                     </FormGroup>
//                   </Col>

//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Quarter *
//                       </Label>
//                       <Select
//                         name="quarterId"
//                         value={quarterOptions.find(
//                           opt => opt.value === sharedDocument.quarterId
//                         )}
//                         onChange={(option) => handleFilterChange(option, { name: "quarterId" }, "shared")}
//                         options={quarterOptions}
//                         styles={selectStyles}
//                         placeholder="Select Quarter"
//                         isSearchable
//                         isClearable
//                         isDisabled={!sharedDocument.financialYearId || loading.filters}
//                       />
//                     </FormGroup>
//                   </Col>

//                   <Col md={3}>
//                     <FormGroup>
//                       <Label className="form-label-sm fw-medium mb-1">
//                         Document File *
//                       </Label>
//                       <div className="d-flex align-items-center">
//                         <div className="flex-grow-1">
//                           <input
//                             type="file"
//                             id="shared-file"
//                             className="form-control"
//                             onChange={(e) => handleFileChange(e, "shared")}
//                             accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
//                           />
//                         </div>
//                       </div>
//                       {sharedDocument.fileName && (
//                         <div className="mt-2">
//                           <Badge color="info" className="me-2">
//                             <i className="bx bx-file me-1"></i>
//                             {sharedDocument.fileName}
//                           </Badge>
//                         </div>
//                       )}
//                     </FormGroup>
//                   </Col>
//                 </Row>

//                 <div className="d-flex justify-content-end mt-3">
//                   <Button
//                     color="primary"
//                     onClick={uploadSharedDocument}
//                     disabled={loading.sharedUpload || !sharedDocument.file}
//                   >
//                     {loading.sharedUpload ? (
//                       <>
//                         <Spinner size="sm" className="me-2" />
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bx bx-upload me-2"></i>
//                         Upload Shared Document
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </CardBody>
//             </Card>

//             {/* Shared Documents List */}
//             <div className="mt-4">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h6 className="mb-0 text-dark">All Shared Documents</h6>
//                 <Button
//                   color="outline-secondary"
//                   size="sm"
//                   onClick={fetchSharedDocuments}
//                   disabled={loading.sharedList}
//                 >
//                   <i className="bx bx-refresh me-1"></i>
//                   Refresh
//                 </Button>
//               </div>

//               {loading.sharedList ? (
//                 <div className="text-center py-4">
//                   <Spinner color="primary" />
//                   <p className="mt-2 text-muted">Loading shared documents...</p>
//                 </div>
//               ) : sharedDocuments.length > 0 ? (
//                 <div className="table-responsive">
//                   <Table hover className="table-bordered">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Document</th>
//                         <th>Financial Year</th>
//                         <th>Scheme</th>
//                         <th>Quarter</th>
//                         <th>Uploaded By</th>
//                         <th>Uploaded On</th>
//                         <th>Size</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {sharedDocuments.map((doc) => (
//                         <tr key={doc._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               <div className="me-3">
//                                 {getFileIcon(doc.fileName)}
//                               </div>
//                               <div>
//                                 <div className="fw-medium">{doc.fileName}</div>
//                                 {doc.description && (
//                                   <small className="text-muted">{doc.description}</small>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td>{doc.financialYear?.year || "-"}</td>
//                           <td>{doc.scheme?.name || "-"}</td>
//                           <td>{doc.quarter?.quarter || "-"}</td>
//                           <td>
//                             <Badge color="light" className="text-dark">
//                               <i className="bx bx-user me-1"></i>
//                               {doc.uploadedBy?.name || "Unknown User"}
//                             </Badge>
//                           </td>
//                           <td>{formatDate(doc.createdAt)}</td>
//                           <td>{formatFileSize(doc.fileSize)}</td>
//                           <td>
//                             <Button
//                               color="success"
//                               size="sm"
//                               onClick={() => downloadDocument(doc._id, doc.fileName, "shared")}
//                             >
//                               <i className="bx bx-download me-1"></i>
//                               Download
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               ) : (
//                 <Card>
//                   <CardBody className="text-center py-5">
//                     <div className="mb-3">
//                       <i className="bx bx-share display-4 text-muted"></i>
//                     </div>
//                     <h5 className="text-muted mb-2">No Shared Documents</h5>
//                     <p className="text-muted">
//                       No documents have been shared yet. Upload the first shared document using the form above.
//                     </p>
//                   </CardBody>
//                 </Card>
//               )}
//             </div>
//           </CardBody>
//         </Card>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={deleteModal.isOpen}
//         toggle={() => setDeleteModal({ isOpen: false, documentId: null, documentType: null })}
//         centered
//       >
//         <ModalHeader toggle={() => setDeleteModal({ isOpen: false, documentId: null, documentType: null })}>
//           Confirm Delete
//         </ModalHeader>
//         <ModalBody>
//           <p className="mb-3">
//             Are you sure you want to delete this document? This action cannot be undone.
//           </p>
//           <div className="alert alert-warning mb-0">
//             <i className="bx bx-error-circle me-2"></i>
//             This will permanently remove the document from the system.
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             onClick={() => setDeleteModal({ isOpen: false, documentId: null, documentType: null })}
//           >
//             Cancel
//           </Button>
//           <Button color="danger" onClick={deleteDocument}>
//             Delete Document
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </div>
//   )
// }

// export default Documents





import React, { useState, useEffect, useCallback, useMemo } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Button,
  Spinner,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import Select from "react-select"
import { URLS } from "../../Url"
import classnames from "classnames"

const Documents = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
  const token = authUser?.token || ""

  // State for filters and data
  const [financialYears, setFinancialYears] = useState([])
  const [schemes, setSchemes] = useState([])
  const [quarters, setQuarters] = useState([])
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("staff")
  
  // State for document form
  const [documentForm, setDocumentForm] = useState({
    financialYearId: "",
    schemeId: "",
    quarterId: "",
    file: null,
    fileName: "",
  })

  // State for documents lists
  const [staffDocuments, setStaffDocuments] = useState([])
  const [adminDocuments, setAdminDocuments] = useState([])
  const [loading, setLoading] = useState({
    filters: false,
    upload: false,
    staffList: false,
    adminList: false,
    deleting: false,
  })

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    documentId: null,
    documentType: null,
    documentName: null,
  })

  // Select styles to match existing theme
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      height: 40,
      fontSize: 14,
      borderRadius: 6,
      borderColor: state.isFocused ? "#405189" : "#ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(64, 81, 137, 0.25)"
        : "none",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      "&:hover": {
        borderColor: "#b1bbc4",
      },
    }),
    valueContainer: base => ({
      ...base,
      padding: "0 8px",
      height: "100%",
    }),
    input: base => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: base => ({
      ...base,
      height: 38,
    }),
    dropdownIndicator: base => ({
      ...base,
      padding: "4px 8px",
    }),
    clearIndicator: base => ({
      ...base,
      padding: "4px 8px",
    }),
    indicatorSeparator: base => ({
      ...base,
      marginTop: 8,
      marginBottom: 8,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 14,
      padding: "8px 12px",
      backgroundColor: state.isSelected
        ? "#2362c8"
        : state.isFocused
        ? "#f8f9fa"
        : "white",
      color: state.isSelected ? "white" : "#212529",
      "&:active": {
        backgroundColor: "#2362c8",
        color: "white",
      },
    }),
    placeholder: base => ({
      ...base,
      fontSize: 14,
      color: "#6c757d",
    }),
    singleValue: base => ({
      ...base,
      color: "#212529",
    }),
  }

  // Fetch financial years
  const fetchFinancialYears = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.post(
        URLS.GetFinancialyear,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      )

      if (response.data?.data) {
        setFinancialYears(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error("Failed to fetch financial years")
    }
  }, [token])

  // Fetch schemes and quarters based on financial year
  const fetchSchemesAndQuarters = useCallback(
    async financialYearId => {
      if (!token || !financialYearId) {
        setSchemes([])
        setQuarters([])
        return
      }

      setIsFiltersLoading(true)

      try {
        // Use Promise.allSettled to handle partial failures
        const [quartersResult, schemesResult] = await Promise.allSettled([
          axios.post(URLS.GetQuarter, {}, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }),
          axios.post(URLS.GetScheme, { financialYearId }, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }),
        ])

        // Process quarters
        let quartersData = []
        if (quartersResult.status === "fulfilled") {
          quartersData = quartersResult.value.data?.data || []
          setQuarters(quartersData)
        } else {
          console.error("Error fetching quarters:", quartersResult.reason)
          toast.error("Failed to load quarters")
          setQuarters([])
        }

        // Process schemes
        let schemesData = []
        if (schemesResult.status === "fulfilled") {
          schemesData = schemesResult.value.data?.schemes || []
          setSchemes(schemesData)
        } else {
          console.error("Error fetching schemes:", schemesResult.reason)
          toast.error("Failed to load schemes")
          setSchemes([])
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        toast.error("An unexpected error occurred")
      } finally {
        setIsFiltersLoading(false)
      }
    },
    [token]
  )

  // Fetch staff documents
  const fetchStaffDocuments = useCallback(async () => {
    if (!token) return

    setLoading(prev => ({ ...prev, staffList: true }))

    try {
      const response = await axios.post(
        URLS.GetAllReports || "/api/admin/drug/getAllReports",
        { type: "staff" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      )

      if (response.data?.status && response.data.data) {
        setStaffDocuments(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching staff documents:", error)
      toast.error("Failed to load staff documents")
      setStaffDocuments([])
    } finally {
      setLoading(prev => ({ ...prev, staffList: false }))
    }
  }, [token])

  // Fetch admin documents
  const fetchAdminDocuments = useCallback(async () => {
    if (!token) return

    setLoading(prev => ({ ...prev, adminList: true }))

    try {
      const response = await axios.post(
        URLS.GetAllReports || "/api/admin/drug/getAllReports",
        { type: "admin" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      )

      if (response.data?.status && response.data.data) {
        setAdminDocuments(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching admin documents:", error)
      toast.error("Failed to load admin documents")
      setAdminDocuments([])
    } finally {
      setLoading(prev => ({ ...prev, adminList: false }))
    }
  }, [token])

  // Fetch all documents for active tab
  const fetchActiveTabDocuments = useCallback(() => {
    if (activeTab === "staff") {
      fetchStaffDocuments()
    } else {
      fetchAdminDocuments()
    }
  }, [activeTab, fetchStaffDocuments, fetchAdminDocuments])

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should not exceed 10MB")
      return
    }

    // Check file type (allow common document types)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload PDF, Word, Excel, or image files.")
      return
    }

    setDocumentForm(prev => ({
      ...prev,
      file,
      fileName: file.name,
    }))
  }

  // Handle filter changes
  const handleFilterChange = (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    if (name === "financialYearId") {
      setDocumentForm(prev => ({
        ...prev,
        financialYearId: value,
        schemeId: "",
        quarterId: "",
      }))
      
      if (value) {
        fetchSchemesAndQuarters(value)
      } else {
        setSchemes([])
        setQuarters([])
      }
    } else if (name === "schemeId") {
      setDocumentForm(prev => ({ ...prev, schemeId: value }))
    } else if (name === "quarterId") {
      setDocumentForm(prev => ({ ...prev, quarterId: value }))
    }
  }

  // Upload document
  const uploadDocument = async () => {
    if (!documentForm.file) {
      toast.warning("Please select a file to upload")
      return
    }

    if (!documentForm.financialYearId || !documentForm.schemeId || !documentForm.quarterId) {
      toast.warning("Please select Financial Year, Scheme, and Quarter")
      return
    }

    setLoading(prev => ({ ...prev, upload: true }))

    try {
      const formData = new FormData()
      formData.append("document", documentForm.file)
      formData.append("financialYear", documentForm.financialYearId)
      formData.append("scheme", documentForm.schemeId)
      formData.append("quarter", documentForm.quarterId)

      const response = await axios.post(
        URLS.CreateDocument ,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data?.status) {
        toast.success(response.data.message || "Document uploaded successfully")
        
        // Reset form
        setDocumentForm({
          financialYearId: "",
          schemeId: "",
          quarterId: "",
          file: null,
          fileName: "",
        })
        
        // Refresh the active tab's list
        fetchActiveTabDocuments()
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error(error.response?.data?.message || "Failed to upload document")
    } finally {
      setLoading(prev => ({ ...prev, upload: false }))
    }
  }

  // Download document
  const downloadDocument = async (documentPath, fileName) => {
    try {
      // If the document path is relative, prepend the base URL
      const fullPath = documentPath.startsWith('http') 
        ? documentPath 
        : `${URLS.Base || ''}${documentPath}`
      
      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = fullPath
      link.download = fileName || documentPath.split('/').pop()
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Document downloaded successfully")
    } catch (error) {
      console.error("Error downloading document:", error)
      toast.error("Failed to download document")
    }
  }

  // Delete document
  const deleteDocument = async () => {
    const { documentId } = deleteModal

    if (!documentId) return

    setLoading(prev => ({ ...prev, deleting: true }))

    try {
      const response = await axios.post(
        `${URLS.DeleteReport || "/api/admin/drug/deleteReport"}/${documentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data?.status) {
        toast.success(response.data.message || "Document deleted successfully")
        
        // Refresh the active tab's list
        fetchActiveTabDocuments()
        
        setDeleteModal({ isOpen: false, documentId: null, documentType: null, documentName: null })
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error(error.response?.data?.message || "Failed to delete document")
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }))
    }
  }

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    if (!fileName) return <i className="bx bxs-file text-muted"></i>
    
    const extension = fileName.split('.').pop().toLowerCase()
    
    switch (extension) {
      case 'pdf':
        return <i className="bx bxs-file-pdf text-danger"></i>
      case 'doc':
      case 'docx':
        return <i className="bx bxs-file-doc text-primary"></i>
      case 'xls':
      case 'xlsx':
        return <i className="bx bxs-file-xls text-success"></i>
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <i className="bx bxs-file-image text-warning"></i>
      case 'txt':
        return <i className="bx bxs-file-txt text-secondary"></i>
      default:
        return <i className="bx bxs-file text-muted"></i>
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Extract filename from path
  const getFileNameFromPath = (path) => {
    if (!path) return "Unknown File"
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  // Get file type badge
  const getFileTypeBadge = (type) => {
    if (type === "staff") {
      return <Badge color="info" className="me-2">Staff</Badge>
    } else if (type === "admin") {
      return <Badge color="success" className="me-2">Admin</Badge>
    }
    return <Badge color="secondary" className="me-2">{type || "Unknown"}</Badge>
  }

  // Initialize data
  useEffect(() => {
    fetchFinancialYears()
    fetchStaffDocuments()
    fetchAdminDocuments()
  }, [fetchFinancialYears, fetchStaffDocuments, fetchAdminDocuments])

  // Refresh data when tab changes
  useEffect(() => {
    fetchActiveTabDocuments()
  }, [activeTab, fetchActiveTabDocuments])

  // Options for select components
  const financialYearOptions = useMemo(
    () =>
      financialYears.map(year => ({
        value: year._id,
        label: year.year,
      })),
    [financialYears]
  )

  const schemeOptions = useMemo(
    () =>
      schemes.map(scheme => ({
        value: scheme._id,
        label: scheme.name,
      })),
    [schemes]
  )

  const quarterOptions = useMemo(
    () =>
      quarters.map(quarter => ({
        value: quarter._id,
        label: quarter.quarter,
      })),
    [quarters]
  )

  // Get current documents based on active tab
  const currentDocuments = useMemo(() => {
    return activeTab === "staff" ? staffDocuments : adminDocuments
  }, [activeTab, staffDocuments, adminDocuments])

  // Get current loading state based on active tab
  const currentLoading = useMemo(() => {
    return activeTab === "staff" ? loading.staffList : loading.adminList
  }, [activeTab, loading.staffList, loading.adminList])

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-primary mb-0">
            <i className="bx bx-folder me-2"></i>
            Document Management System
          </h4>
        </div>

        {/* Tabs for Staff/Admin */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardBody>
            <Nav pills className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "staff" })}
                  onClick={() => setActiveTab("staff")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bx bx-user me-1"></i> Staff Documents
                  <Badge color="info" pill className="ms-2">
                    {staffDocuments.length}
                  </Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "admin" })}
                  onClick={() => setActiveTab("admin")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bx bx-user-check me-1"></i> Admin Documents
                  <Badge color="success" pill className="ms-2">
                    {adminDocuments.length}
                  </Badge>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab} className="mt-4">
              <TabPane tabId="staff">
                <DocumentSection 
                  activeTab={activeTab}
                  documentForm={documentForm}
                  currentDocuments={currentDocuments}
                  currentLoading={currentLoading}
                  financialYearOptions={financialYearOptions}
                  schemeOptions={schemeOptions}
                  quarterOptions={quarterOptions}
                  loading={loading}
                  selectStyles={selectStyles}
                  handleFilterChange={handleFilterChange}
                  handleFileChange={handleFileChange}
                  uploadDocument={uploadDocument}
                  downloadDocument={downloadDocument}
                  setDeleteModal={setDeleteModal}
                  getFileIcon={getFileIcon}
                  formatDate={formatDate}
                  getFileNameFromPath={getFileNameFromPath}
                  getFileTypeBadge={getFileTypeBadge}
                  fetchActiveTabDocuments={fetchActiveTabDocuments}
                />
              </TabPane>
              <TabPane tabId="admin">
                <DocumentSection 
                  activeTab={activeTab}
                  documentForm={documentForm}
                  currentDocuments={currentDocuments}
                  currentLoading={currentLoading}
                  financialYearOptions={financialYearOptions}
                  schemeOptions={schemeOptions}
                  quarterOptions={quarterOptions}
                  loading={loading}
                  selectStyles={selectStyles}
                  handleFilterChange={handleFilterChange}
                  handleFileChange={handleFileChange}
                  uploadDocument={uploadDocument}
                  downloadDocument={downloadDocument}
                  setDeleteModal={setDeleteModal}
                  getFileIcon={getFileIcon}
                  formatDate={formatDate}
                  getFileNameFromPath={getFileNameFromPath}
                  getFileTypeBadge={getFileTypeBadge}
                  fetchActiveTabDocuments={fetchActiveTabDocuments}
                />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        toggle={() => setDeleteModal({ isOpen: false, documentId: null, documentType: null, documentName: null })}
        centered
      >
        <ModalHeader toggle={() => setDeleteModal({ isOpen: false, documentId: null, documentType: null, documentName: null })}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p className="mb-3">
            Are you sure you want to delete the document <strong>"{deleteModal.documentName}"</strong>?
          </p>
          <p className="text-danger mb-3">
            This action cannot be undone. All data associated with this document will be permanently removed.
          </p>
          <div className="alert alert-warning mb-0">
            <i className="bx bx-error-circle me-2"></i>
            This will permanently remove the document from the system.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setDeleteModal({ isOpen: false, documentId: null, documentType: null, documentName: null })}
            disabled={loading.deleting}
          >
            Cancel
          </Button>
          <Button color="danger" onClick={deleteDocument} disabled={loading.deleting}>
            {loading.deleting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Document"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

// Reusable Document Section Component
const DocumentSection = ({
  activeTab,
  documentForm,
  currentDocuments,
  currentLoading,
  financialYearOptions,
  schemeOptions,
  quarterOptions,
  loading,
  selectStyles,
  handleFilterChange,
  handleFileChange,
  uploadDocument,
  downloadDocument,
  setDeleteModal,
  getFileIcon,
  formatDate,
  getFileNameFromPath,
  getFileTypeBadge,
  fetchActiveTabDocuments,
}) => {
  return (
    <>
      {/* Upload Form */}
      <Card className="border mb-4">
        <CardBody>
          <div className="mb-3">
            <h6 className="text-primary mb-3">
              <i className="bx bx-upload me-2"></i>
              Upload New Document ({activeTab === "staff" ? "Staff" : "Admin"})
            </h6>
            <p className="text-muted small mb-4">
              Upload documents for {activeTab === "staff" ? "staff members" : "administrators"}. 
              All {activeTab === "staff" ? "staff" : "admin"} users will have access to these documents.
            </p>
          </div>

          <Row className="g-3">
            <Col md={3}>
              <FormGroup>
                <Label className="form-label-sm fw-medium mb-1">
                  Financial Year *
                </Label>
                <Select
                  name="financialYearId"
                  value={financialYearOptions.find(
                    opt => opt.value === documentForm.financialYearId
                  )}
                  onChange={handleFilterChange}
                  options={financialYearOptions}
                  styles={selectStyles}
                  placeholder="Select Year"
                  isSearchable
                  isClearable
                  isLoading={loading.filters}
                />
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup>
                <Label className="form-label-sm fw-medium mb-1">
                  Scheme *
                </Label>
                <Select
                  name="schemeId"
                  value={schemeOptions.find(
                    opt => opt.value === documentForm.schemeId
                  )}
                  onChange={handleFilterChange}
                  options={schemeOptions}
                  styles={selectStyles}
                  placeholder="Select Scheme"
                  isSearchable
                  isClearable
                  isDisabled={!documentForm.financialYearId || loading.filters}
                />
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup>
                <Label className="form-label-sm fw-medium mb-1">
                  Quarter *
                </Label>
                <Select
                  name="quarterId"
                  value={quarterOptions.find(
                    opt => opt.value === documentForm.quarterId
                  )}
                  onChange={handleFilterChange}
                  options={quarterOptions}
                  styles={selectStyles}
                  placeholder="Select Quarter"
                  isSearchable
                  isClearable
                  isDisabled={!documentForm.financialYearId || loading.filters}
                />
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup>
                <Label className="form-label-sm fw-medium mb-1">
                  Document File *
                </Label>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <input
                      type="file"
                      id="document-file"
                      className="form-control"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
                {documentForm.fileName && (
                  <div className="mt-2">
                    <Badge color="info" className="me-2">
                      <i className="bx bx-file me-1"></i>
                      {documentForm.fileName}
                    </Badge>
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <div className="d-flex justify-content-between mt-3">
            <div>
              <small className="text-muted">
                <i className="bx bx-info-circle me-1"></i>
                Max file size: 10MB | Allowed: PDF, Word, Excel, Images
              </small>
            </div>
            <div className="d-flex gap-2">
              <Button
                color="outline-secondary"
                onClick={() => {
                  setDocumentForm({
                    financialYearId: "",
                    schemeId: "",
                    quarterId: "",
                    file: null,
                    fileName: "",
                  })
                }}
                disabled={loading.upload}
              >
                <i className="bx bx-reset me-1"></i>
                Reset
              </Button>
              <Button
                color="primary"
                onClick={uploadDocument}
                disabled={loading.upload || !documentForm.file}
              >
                {loading.upload ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="bx bx-upload me-2"></i>
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Documents List */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-dark">
            {activeTab === "staff" ? "Staff" : "Admin"} Documents
            <small className="text-muted ms-2">
              ({currentDocuments.length} documents found)
            </small>
          </h6>
          <div className="d-flex gap-2">
            <Button
              color="outline-secondary"
              size="sm"
              onClick={fetchActiveTabDocuments}
              disabled={currentLoading}
            >
              <i className="bx bx-refresh me-1"></i>
              Refresh
            </Button>
          </div>
        </div>

        {currentLoading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-2 text-muted">Loading documents...</p>
          </div>
        ) : currentDocuments.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Financial Year</th>
                  <th>Scheme</th>
                  <th>Quarter</th>
                  <th>Uploaded On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentDocuments.map((doc) => {
                  const fileName = getFileNameFromPath(doc.document)
                  return (
                    <tr key={doc._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            {getFileIcon(fileName)}
                          </div>
                          <div>
                            <div className="fw-medium text-truncate" style={{ maxWidth: "250px" }}>
                              {fileName}
                            </div>
                            <small className="text-muted">
                              ID: {doc._id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {getFileTypeBadge(doc.type)}
                      </td>
                      <td>
                        {financialYearOptions.find(opt => opt.value === doc.financialYear)?.label || "-"}
                      </td>
                      <td>
                        {schemeOptions.find(opt => opt.value === doc.scheme)?.label || "-"}
                      </td>
                      <td>
                        {quarterOptions.find(opt => opt.value === doc.quarter)?.label || "-"}
                      </td>
                      <td>
                        {formatDate(doc.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => downloadDocument(doc.document, fileName)}
                          >
                            <i className="bx bx-download me-1"></i>
                            Download
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => setDeleteModal({
                              isOpen: true,
                              documentId: doc._id,
                              documentType: doc.type,
                              documentName: fileName,
                            })}
                          >
                            <i className="bx bx-trash me-1"></i>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-5">
              <div className="mb-3">
                <i className="bx bx-folder-open display-4 text-muted"></i>
              </div>
              <h5 className="text-muted mb-2">No Documents Found</h5>
              <p className="text-muted">
                No {activeTab} documents have been uploaded yet. Upload your first document using the form above.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  )
}

export default Documents