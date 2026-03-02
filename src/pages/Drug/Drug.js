// import React, { useEffect, useState } from "react"
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Input,
//   Button,
//   Table,
//   Label,
//   Form,
//   Collapse,
//   FormGroup,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap"
// import DrugTemplate from "../../assets/images/Drugs.xlsx"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer, toast } from "react-toastify"
// import ReactPaginate from "react-paginate"
// import { URLS } from "../../Url"
// import axios from "axios"

// const Drug = () => {
//   var GetAuth = localStorage.getItem("authUser")
//   var TokenJson = JSON.parse(GetAuth)
//   var TokenData = TokenJson.token

//   const [showAddForm, setShowAddForm] = useState(false)
//   const [showEditForm, setShowEditForm] = useState(false)
//   const [Data, setData] = useState([])
//   const [allocationForms, setAllocationForms] = useState([])
//   const [bulkUploadModal, setBulkUploadModal] = useState(false)
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [uploadLoading, setUploadLoading] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const [listPerPage] = useState(10)
//   const [pageNumber, setPageNumber] = useState(0)
//   const pagesVisited = pageNumber * listPerPage
//   const lists = Data.slice(pagesVisited, pagesVisited + listPerPage)
//   const pageCount = Math.ceil(Data.length / listPerPage)

//   const changePage = ({ selected }) => {
//     setPageNumber(selected)
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     })
//   }

//   const [form, setform] = useState({
//     groupId: "",
//     drugCode: "",
//     tradeName: "",
//     compositionAndStrength: "",
//     packingSpecification: "",
//     unitPack: "",
//     unitPrice: "",
//     salesTax: "",
//     nameOfFirm: "",
//     nameOfStockiest: "",
//   })

//   useEffect(() => {
//     GetDrugs()
//     GetAllocationForms()
//   }, [])

//   const GetDrugs = () => {
//     setLoading(true)
//     var token = TokenData
//     axios
//       .get(URLS.GetDrug, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           setData(res.data.data || [])
//           setPageNumber(0)
//         }
//         setLoading(false)
//       })
//       .catch(error => {
//         console.error("Error fetching drugs:", error)
//         setLoading(false)
//         toast.error("Failed to load drugs")
//       })
//   }

//   const GetAllocationForms = () => {
//     var token = TokenData
//     axios
//       .post(
//         URLS.GetAllocationForm,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then(res => {
//         setAllocationForms(res.data.data || [])
//       })
//       .catch(error => {
//         console.error("Error fetching allocation forms:", error)
//       })
//   }

//   const SearchData = e => {
//     const searchValue = e.target.value
//     const token = TokenData

//     if (!searchValue.trim()) {
//       GetDrugs()
//       return
//     }

//     axios
//       .get(`${URLS.GetDrugSearch}${searchValue}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           setData(res.data.data || [])
//           setPageNumber(0)
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         } else {
//           toast.error("Search failed")
//         }
//       })
//   }

//   const handleChange = e => {
//     let myUser = { ...form }
//     myUser[e.target.name] = e.target.value
//     setform(myUser)
//   }

//   const FormAddSubmit = e => {
//     e.preventDefault()
//     AddData()
//   }

//   const AddData = () => {
//     var token = TokenData

//     const dataArray = {
//       groupId: form.groupId,
//       drugCode: form.drugCode,
//       tradeName: form.tradeName,
//       compositionAndStrength: form.compositionAndStrength,
//       packingSpecification: form.packingSpecification,
//       unitPack: form.unitPack,
//       unitPrice: parseFloat(form.unitPrice),
//       salesTax: parseFloat(form.salesTax),
//       nameOfFirm: form.nameOfFirm,
//       nameOfStockiest: form.nameOfStockiest,
//     }

//     axios
//       .post(URLS.AddDrug, dataArray, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           toast.success(res.data.message)
//           setShowAddForm(false)
//           GetDrugs()
//           resetForm()
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         } else {
//           toast.error("Failed to add drug")
//         }
//       })
//   }

//   const [form1, setform1] = useState({
//     groupId: "",
//     drugCode: "",
//     tradeName: "",
//     compositionAndStrength: "",
//     packingSpecification: "",
//     unitPack: "",
//     unitPrice: "",
//     salesTax: "",
//     nameOfFirm: "",
//     nameOfStockiest: "",
//   })

//   const handleChange1 = e => {
//     let myUser = { ...form1 }
//     myUser[e.target.name] = e.target.value
//     setform1(myUser)
//   }

//   const UpdatePopUp = data => {
//     setform1({
//       ...data,
//       groupId: data.groupId?._id || data.groupId,
//       nameOfFirm: data.nameOfFirm || "",
//       nameOfStockiest: data.nameOfStockiest || "",
//     })
//     setShowEditForm(true)
//     setShowAddForm(false)
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     })
//   }

//   const FormEditSubmit = e => {
//     e.preventDefault()
//     UpdateData()
//   }

//   const UpdateData = () => {
//     var token = TokenData

//     const dataArray = {
//       groupId: form1.groupId,
//       drugCode: form1.drugCode,
//       tradeName: form1.tradeName,
//       compositionAndStrength: form1.compositionAndStrength,
//       packingSpecification: form1.packingSpecification,
//       unitPack: form1.unitPack,
//       unitPrice: parseFloat(form1.unitPrice),
//       salesTax: parseFloat(form1.salesTax),
//       nameOfFirm: form1.nameOfFirm,
//       nameOfStockiest: form1.nameOfStockiest,
//     }

//     axios
//       .put(URLS.EditDrug + form1._id, dataArray, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           toast.success(res.data.message)
//           setShowEditForm(false)
//           GetDrugs()
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         } else {
//           toast.error("Failed to update drug")
//         }
//       })
//   }

//   const DeleteData = data => {
//     const confirmBox = window.confirm(
//       `Do you really want to delete ${data.tradeName}?`
//     )
//     if (confirmBox === true) {
//       DeleteDrug(data)
//     }
//   }

//   const DeleteDrug = data => {
//     var token = TokenData
//     var remid = data._id
//     axios
//       .put(
//         URLS.DeleteDrug + remid,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then(res => {
//         if (res.status === 200) {
//           toast.success(res.data.message)
//           GetDrugs()
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         } else {
//           toast.error("Failed to delete drug")
//         }
//       })
//   }

//   const resetForm = () => {
//     setform({
//       groupId: "",
//       drugCode: "",
//       tradeName: "",
//       compositionAndStrength: "",
//       packingSpecification: "",
//       unitPack: "",
//       unitPrice: "",
//       salesTax: "",
//       nameOfFirm: "",
//       nameOfStockiest: "",
//     })
//   }

//   const toggleBulkUploadModal = () => {
//     setBulkUploadModal(!bulkUploadModal)
//     setSelectedFile(null)
//   }

//   const handleFileSelect = event => {
//     setSelectedFile(event.target.files[0])
//   }

//   const handleBulkUpload = () => {
//     if (!selectedFile) {
//       toast.error("Please select a file to upload")
//       return
//     }

//     const formData = new FormData()
//     formData.append("file", selectedFile)

//     setUploadLoading(true)
//     const token = TokenData

//     axios
//       .post(URLS.BluckUploadDrug, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then(res => {
//         setUploadLoading(false)
//         toggleBulkUploadModal()
//         toast.success(res.data.message || "Drugs uploaded successfully!")
//         GetDrugs()
//       })
//       .catch(error => {
//         setUploadLoading(false)
//         if (
//           error.response &&
//           error.response.data &&
//           error.response.data.message
//         ) {
//           toast.error(error.response.data.message)
//         } else {
//           toast.error("Upload failed. Please try again.")
//         }
//       })
//   }

//   const handleBulkDelete = () => {
//     const confirmBox = window.confirm(
//       "Do you really want to delete ALL drugs? This action cannot be undone."
//     )

//     if (confirmBox === true) {
//       setLoading(true)
//       const token = TokenData

//       axios
//         .delete(URLS.BluckDeleteDrug, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(res => {
//           setLoading(false)
//           if (res.status === 200) {
//             toast.success(res.data.message || "All drugs deleted successfully!")
//             GetDrugs()
//           }
//         })
//         .catch(error => {
//           setLoading(false)
//           if (error.response && error.response.status === 400) {
//             toast.error(error.response.data.message)
//           } else {
//             toast.error("Bulk delete failed. Please try again.")
//           }
//         })
//     }
//   }

//   var gets = localStorage.getItem("authUser")
//   var datas = JSON.parse(gets)
//   var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <div className="container-fluid">
//           <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Drugs" />
//           <Row>
//             <Col md={12}>
//               <Collapse isOpen={showEditForm}>
//                 <Card className="p-4 mb-4">
//                   <Form onSubmit={FormEditSubmit}>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <h5 className="mb-0">Edit Drug</h5>
//                       <Button
//                         type="button"
//                         color="light"
//                         onClick={() => setShowEditForm(false)}
//                       >
//                         <i className="bx bx-x"></i>
//                       </Button>
//                     </div>
//                     <Row>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>
//                             Form Type <span className="text-danger">*</span>
//                           </Label>
//                           <Input
//                             required
//                             name="groupId"
//                             type="select"
//                             value={form1.groupId}
//                             onChange={handleChange1}
//                           >
//                             <option value="">Select Form Type</option>
//                             {allocationForms.map(form => (
//                               <option key={form._id} value={form._id}>
//                                 {form.formName}
//                               </option>
//                             ))}
//                           </Input>
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>
//                             Drug Code <span className="text-danger">*</span>
//                           </Label>
//                           <Input
//                             required
//                             name="drugCode"
//                             type="text"
//                             value={form1.drugCode}
//                             placeholder="Enter Drug Code"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="3">
//                         <FormGroup>
//                           <Label>
//                             Trade Name <span className="text-danger">*</span>
//                           </Label>
//                           <Input
//                             required
//                             name="tradeName"
//                             type="text"
//                             value={form1.tradeName}
//                             placeholder="Enter Trade Name"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>Specification</Label>
//                           <Input
//                             name="packingSpecification"
//                             type="text"
//                             value={form1.packingSpecification}
//                             placeholder="Enter Specification"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>Unit Pack</Label>
//                           <Input
//                             name="unitPack"
//                             type="text"
//                             value={form1.unitPack}
//                             placeholder="Enter Unit Pack"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>Presentation</Label>
//                           <Input
//                             name="compositionAndStrength"
//                             type="text"
//                             value={form1.compositionAndStrength}
//                             placeholder="Enter Presentation"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>
//                             Base Price <span className="text-danger">*</span>
//                           </Label>
//                           <Input
//                             required
//                             name="unitPrice"
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             step="0.01"
//                             value={form1.unitPrice}
//                             placeholder="Enter Base Price"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>Gst (%)</Label>
//                           <Input
//                             name="salesTax"
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             step="0.01"
//                             value={form1.salesTax}
//                             placeholder="Enter Gst"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>Name of the Firm</Label>
//                           <Input
//                             name="nameOfFirm"
//                             type="text"
//                             value={form1.nameOfFirm}
//                             placeholder="Enter Firm Name"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label>Name of the Stockiest</Label>
//                           <Input
//                             name="nameOfStockiest"
//                             type="text"
//                             value={form1.nameOfStockiest}
//                             placeholder="Enter Stockiest Name"
//                             onChange={handleChange1}
//                           />
//                         </FormGroup>
//                       </Col>
//                     </Row>
//                     <div className="text-end mt-4">
//                       <Button
//                         type="button"
//                         onClick={() => setShowEditForm(false)}
//                         color="danger m-1"
//                       >
//                         Cancel <i className="bx bx-x-circle"></i>
//                       </Button>
//                       <Button type="submit" color="primary text-white m-1">
//                         Update <i className="bx bx-check-circle"></i>
//                       </Button>
//                     </div>
//                   </Form>
//                 </Card>
//               </Collapse>
//             </Col>
//           </Row>
//           <Row>
//             <Col md={12}>
//               <Collapse isOpen={showAddForm}>
//                 <Card>
//                   <CardBody>
//                     <Form onSubmit={FormAddSubmit}>
//                       <h5 className="mb-3">Add New Drug</h5>
//                       <Row>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>
//                               Form Type <span className="text-danger">*</span>
//                             </Label>
//                             <Input
//                               required
//                               name="groupId"
//                               type="select"
//                               value={form.groupId}
//                               onChange={handleChange}
//                             >
//                               <option value="">Select Form Type</option>
//                               {allocationForms.map(form => (
//                                 <option key={form._id} value={form._id}>
//                                   {form.formName}
//                                 </option>
//                               ))}
//                             </Input>
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>
//                               Drug Code <span className="text-danger">*</span>
//                             </Label>
//                             <Input
//                               required
//                               name="drugCode"
//                               type="text"
//                               value={form.drugCode}
//                               placeholder="Enter Drug Code"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>
//                               Trade Name <span className="text-danger">*</span>
//                             </Label>
//                             <Input
//                               required
//                               name="tradeName"
//                               type="text"
//                               value={form.tradeName}
//                               placeholder="Enter Trade Name"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>Specification</Label>
//                             <Input
//                               name="packingSpecification"
//                               type="text"
//                               value={form.packingSpecification}
//                               placeholder="Enter Specification"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>Unit Pack</Label>
//                             <Input
//                               name="unitPack"
//                               type="text"
//                               value={form.unitPack}
//                               placeholder="Enter Unit Pack"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>Presentation</Label>
//                             <Input
//                               name="compositionAndStrength"
//                               type="text"
//                               value={form.compositionAndStrength}
//                               placeholder="Enter Presentation"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>
//                               Base Price <span className="text-danger">*</span>
//                             </Label>
//                             <Input
//                               required
//                               name="unitPrice"
//                               type="number"
//                               inputMode="decimal"
//                               onWheel={e => e.target.blur()}
//                               step="0.01"
//                               value={form.unitPrice}
//                               placeholder="Enter Base Price"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>Gst (%)</Label>
//                             <Input
//                               name="salesTax"
//                               type="number"
//                               inputMode="decimal"
//                               onWheel={e => e.target.blur()}
//                               step="0.01"
//                               value={form.salesTax}
//                               placeholder="Enter Gst"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>Name of the Firm</Label>
//                             <Input
//                               name="nameOfFirm"
//                               type="text"
//                               value={form.nameOfFirm}
//                               placeholder="Enter Firm Name"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                         <Col md={3}>
//                           <FormGroup>
//                             <Label>Name of the Stockiest</Label>
//                             <Input
//                               name="nameOfStockiest"
//                               type="text"
//                               value={form.nameOfStockiest}
//                               placeholder="Enter Stockiest Name"
//                               onChange={handleChange}
//                             />
//                           </FormGroup>
//                         </Col>
//                       </Row>
//                       <div className="text-end mt-4">
//                         <Button type="submit" color="success text-white">
//                           Submit <i className="bx bx-check-circle"></i>
//                         </Button>
//                       </div>
//                     </Form>
//                   </CardBody>
//                 </Card>
//               </Collapse>
//             </Col>
//           </Row>
//           <Row>
//             <Col md={12}>
//               <Card>
//                 <CardBody>
//                   <Row className="mb-3">
//                     <Col md={4}>
//                       <h4 className="card-title">Drug Records</h4>
//                       <p className="text-muted">
//                         Showing {lists.length} of {Data.length} drugs
//                         {Data.length > listPerPage && (
//                           <span>
//                             {" "}
//                             (Page {pageNumber + 1} of {pageCount})
//                           </span>
//                         )}
//                       </p>
//                     </Col>
//                     <Col md={8} className="text-end">
//                       <div className="d-flex gap-2 justify-content-end">
//                         {Roles?.accessAll === true ? (
//                           <>
//                             <Button
//                               color="warning"
//                               className="text-white"
//                               onClick={toggleBulkUploadModal}
//                             >
//                               <i className="bx bx-upload me-2"></i>
//                               Bulk Upload
//                             </Button>{" "}
//                           </>
//                         ) : (
//                           ""
//                         )}

//                         {Roles?.accessAll === true ? (
//                           <>
//                             <Button
//                               color="danger"
//                               className="text-white"
//                               onClick={handleBulkDelete}
//                               disabled={Data.length === 0 || loading}
//                             >
//                               <i className="bx bx-trash me-2"></i>
//                               Bulk Delete
//                             </Button>{" "}
//                           </>
//                         ) : (
//                           ""
//                         )}

//                         {Roles?.DrugAdd === true ||
//                         Roles?.accessAll === true ? (
//                           <>
//                             <Button
//                               className="m-1"
//                               color="primary"
//                               onClick={() => {
//                                 setShowAddForm(!showAddForm)
//                                 setShowEditForm(false)
//                                 if (showAddForm) resetForm()
//                               }}
//                             >
//                               {showAddForm ? (
//                                 <>
//                                   Cancel Add <i className="bx bx-x"></i>
//                                 </>
//                               ) : (
//                                 <>
//                                   Add New Drug <i className="bx bx-plus"></i>
//                                 </>
//                               )}
//                             </Button>{" "}
//                           </>
//                         ) : (
//                           ""
//                         )}
//                         <Input
//                           name="search"
//                           value={form.search || ""}
//                           onChange={SearchData}
//                           type="text"
//                           placeholder="Search..."
//                           style={{ width: "200px" }}
//                         />
//                       </div>
//                     </Col>
//                   </Row>
//                   <div className="table-rep-plugin mt-4 table-responsive">
//                     <Table hover className="table table-bordered mb-4">
//                       <thead className="table-light">
//                         <tr>
//                           <th>S.No</th>
//                           <th>Form Type</th>
//                           <th>Drug Code</th>
//                           <th>Trade Name</th>
//                           <th>Specification</th>
//                           <th>Unit Pack</th>
//                           <th>Presentation</th>
//                           <th>Base Price</th>
//                           <th>GST (%)</th>
//                           <th>Firm Name</th>
//                           <th>Stockiest Name</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {loading ? (
//                           <tr>
//                             <td colSpan="12" className="text-center">
//                               <div
//                                 className="spinner-border text-primary"
//                                 role="status"
//                               >
//                                 <span className="visually-hidden">
//                                   Loading...
//                                 </span>
//                               </div>
//                             </td>
//                           </tr>
//                         ) : lists.length === 0 ? (
//                           <tr>
//                             <td colSpan="12" className="text-center text-muted">
//                               No drug records found
//                             </td>
//                           </tr>
//                         ) : (
//                           lists.map((data, index) => (
//                             <tr key={data._id || index}>
//                               <td>{pagesVisited + index + 1}</td>
//                               <td>{data.groupName || "-"}</td>
//                               <td>{data.drugCode}</td>
//                               <td>{data.tradeName}</td>
//                               <td>{data.packingSpecification || "-"}</td>
//                               <td>{data.unitPack || "-"}</td>
//                               <td>{data.compositionAndStrength || "-"}</td>
//                               <td>{data.unitPrice || "0.00"}</td>
//                               <td>{data.salesTax || "0"}%</td>
//                               <td>{data.nameOfFirm || "-"}</td>
//                               <td>{data.nameOfStockiest || "-"}</td>
//                               <td>
//                                 <div className="d-flex gap-2">
//                                   {Roles?.DrugEdit === true ||
//                                   Roles?.accessAll === true ? (
//                                     <>
//                                       <Button
//                                         onClick={() => UpdatePopUp(data)}
//                                         color="info"
//                                         size="sm"
//                                         className="btn-icon"
//                                         title="Edit"
//                                       >
//                                         <i className="bx bx-edit"></i>
//                                       </Button>
//                                     </>
//                                   ) : (
//                                     ""
//                                   )}

//                                   {Roles?.DrugDelete === true ||
//                                   Roles?.accessAll === true ? (
//                                     <>
//                                       <Button
//                                         onClick={() => DeleteData(data)}
//                                         color="danger"
//                                         size="sm"
//                                         className="btn-icon"
//                                         title="Delete"
//                                       >
//                                         <i className="bx bx-trash"></i>
//                                       </Button>{" "}
//                                     </>
//                                   ) : (
//                                     ""
//                                   )}
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </Table>
//                     {Data.length > listPerPage && (
//                       <div className="d-flex justify-content-end mt-3">
//                         <ReactPaginate
//                           previousLabel={"Previous"}
//                           nextLabel={"Next"}
//                           pageCount={pageCount}
//                           onPageChange={changePage}
//                           containerClassName={"pagination"}
//                           previousLinkClassName={"page-link"}
//                           nextLinkClassName={"page-link"}
//                           disabledClassName={"disabled"}
//                           activeClassName={"active"}
//                           pageClassName={"page-item"}
//                           pageLinkClassName={"page-link"}
//                           forcePage={pageNumber}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//           <ToastContainer position="top-right" autoClose={3000} />
//         </div>
//       </div>
//       <Modal isOpen={bulkUploadModal} toggle={toggleBulkUploadModal}>
//         <ModalHeader toggle={toggleBulkUploadModal}>
//           Bulk Upload Drugs
//         </ModalHeader>
//         <ModalBody>
//           <div className="mb-4">
//             <h6 className="mb-3">Download Sample Files:</h6>
//             <div className="d-flex gap-2">
//               <Button color="outline-success" size="sm">
//                 <a
//                   href={DrugTemplate}
//                   download
//                   style={{ color: "inherit", textDecoration: "none" }}
//                 >
//                   <i className="bx bx-download me-1"></i>
//                   Download XLSX Template
//                 </a>
//               </Button>
//             </div>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="fileUpload" className="form-label">
//               Upload Drug File (XLSX or CSV)
//             </label>
//             <input
//               type="file"
//               className="form-control"
//               id="fileUpload"
//               accept=".xlsx,.xls,.csv"
//               onChange={handleFileSelect}
//             />
//             <div className="form-text">
//               Supported formats: XLSX, XLS, CSV. Maximum file size: 10MB
//             </div>
//           </div>
//           {selectedFile && (
//             <div className="alert alert-info">
//               <i className="bx bx-info-circle me-2"></i>
//               Selected file: <strong>{selectedFile.name}</strong>
//             </div>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             onClick={toggleBulkUploadModal}
//             disabled={uploadLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             color="primary"
//             onClick={handleBulkUpload}
//             disabled={!selectedFile || uploadLoading}
//           >
//             {uploadLoading ? (
//               <>
//                 <div
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                 >
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <i className="bx bx-upload me-2"></i>
//                 Upload File
//               </>
//             )}
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </React.Fragment>
//   )
// }

// export default Drug




import React, { useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  Form,
  Collapse,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap"
import DrugTemplate from "../../assets/images/Drugs.xlsx"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"
import Select from "react-select"

const Drug = () => {
  var GetAuth = localStorage.getItem("authUser")
  var TokenJson = JSON.parse(GetAuth)
  var TokenData = TokenJson.token

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [Data, setData] = useState([])
  const [allocationForms, setAllocationForms] = useState([])
  const [allocationFormOptions, setAllocationFormOptions] = useState([])
  const [bulkUploadModal, setBulkUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const pagesVisited = pageNumber * listPerPage
  const lists = Data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Data.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const [form, setform] = useState({
    groupId: [],
    drugCode: "",
    drugCode1: "",
    tradeName: "",
    compositionAndStrength: "",
    packingSpecification: "",
    unitPack: "",
    unitPrice: "",
    salesTax: "",
    nameOfFirm: "",
    nameOfStockiest: "",
  })

  useEffect(() => {
    GetDrugs()
    GetAllocationForms()
  }, [])

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [])

  useEffect(() => {
    // Update select options when allocationForms changes
    if (allocationForms.length > 0) {
      const options = allocationForms.map(form => ({
        value: form._id,
        label: form.formName,
      }))
      setAllocationFormOptions(options)
    }
  }, [allocationForms])

  const GetDrugs = () => {
    setLoading(true)
    var token = TokenData
    axios
      .get(URLS.GetDrug, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setData(res.data.data || [])
          setPageNumber(0)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching drugs:", error)
        setLoading(false)
        toast.error("Failed to load drugs")
      })
  }

  const GetAllocationForms = () => {
    var token = TokenData
    axios
      .post(
        URLS.GetAllocationForm,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setAllocationForms(res.data.data || [])
      })
      .catch(error => {
        console.error("Error fetching allocation forms:", error)
      })
  }

  const SearchData = (searchValue) => {
    const token = TokenData
    
    if (!token) {
      toast.error("Authentication token not found. Please login again.")
      return
    }

    if (!searchValue.trim()) {
      GetDrugs()
      return
    }

    setLoading(true)
    
    axios
      .get(`${URLS.GetDrugSearch}${searchValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setData(res.data.data || [])
          setPageNumber(0)
        }
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Search failed")
        }
      })
  }

  const handleSearchChange = e => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Set new timeout for search
    const newTimeout = setTimeout(() => {
      SearchData(value)
    }, 500) // 500ms debounce
    
    setSearchTimeout(newTimeout)
  }

  const handleChange = e => {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  const handleMultiSelectChange = (selectedOptions) => {
    setform(prev => ({
      ...prev,
      groupId: selectedOptions ? selectedOptions.map(option => option.value) : []
    }))
  }

  const FormAddSubmit = e => {
    e.preventDefault()
    AddData()
  }

  const AddData = () => {
    var token = TokenData

    // Validate at least one form type is selected
    if (!form.groupId || form.groupId.length === 0) {
      toast.error("Please select at least one Form Type")
      return
    }

    const dataArray = {
      groupId: form.groupId, // Now an array of IDs
      drugCode: form.drugCode,
      drugCode1: form.drugCode1,
      tradeName: form.tradeName,
      compositionAndStrength: form.compositionAndStrength,
      packingSpecification: form.packingSpecification,
      unitPack: form.unitPack,
      unitPrice: parseFloat(form.unitPrice),
      salesTax: parseFloat(form.salesTax),
      nameOfFirm: form.nameOfFirm,
      nameOfStockiest: form.nameOfStockiest,
    }

    axios
      .post(URLS.AddDrug, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShowAddForm(false)
          GetDrugs()
          resetForm()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to add drug")
        }
      })
  }

  const [form1, setform1] = useState({
    groupId: [],
    drugCode: "",
    drugCode1: "",
    tradeName: "",
    compositionAndStrength: "",
    packingSpecification: "",
    unitPack: "",
    unitPrice: "",
    salesTax: "",
    nameOfFirm: "",
    nameOfStockiest: "",
  })

  const handleChange1 = e => {
    let myUser = { ...form1 }
    myUser[e.target.name] = e.target.value
    setform1(myUser)
  }

  const handleMultiSelectChange1 = (selectedOptions) => {
    setform1(prev => ({
      ...prev,
      groupId: selectedOptions ? selectedOptions.map(option => option.value) : []
    }))
  }

  const UpdatePopUp = data => {
    // Convert data to handle both old single groupId and new groupId array
    let groupId = []
    
    if (data.groupId && Array.isArray(data.groupId)) {
      // New format: array of group IDs
      groupId = data.groupId
    } else if (data.groupId) {
      // Old format: single group ID (could be string or object with _id)
      if (typeof data.groupId === 'object' && data.groupId._id) {
        groupId = [data.groupId._id]
      } else {
        groupId = [data.groupId]
      }
    }

    setform1({
      ...data,
      groupId: groupId,
      nameOfFirm: data.nameOfFirm || "",
      nameOfStockiest: data.nameOfStockiest || "",
    })
    setShowEditForm(true)
    setShowAddForm(false)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const FormEditSubmit = e => {
    e.preventDefault()
    UpdateData()
  }

  const UpdateData = () => {
    var token = TokenData

    // Validate at least one form type is selected
    if (!form1.groupId || form1.groupId.length === 0) {
      toast.error("Please select at least one Form Type")
      return
    }

    const dataArray = {
      groupId: form1.groupId,
      drugCode: form1.drugCode,
      drugCode1: form1.drugCode1,
      tradeName: form1.tradeName,
      compositionAndStrength: form1.compositionAndStrength,
      packingSpecification: form1.packingSpecification,
      unitPack: form1.unitPack,
      unitPrice: parseFloat(form1.unitPrice),
      salesTax: parseFloat(form1.salesTax),
      nameOfFirm: form1.nameOfFirm,
      nameOfStockiest: form1.nameOfStockiest,
    }

    axios
      .put(URLS.EditDrug + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShowEditForm(false)
          GetDrugs()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to update drug")
        }
      })
  }

  const DeleteData = data => {
    const confirmBox = window.confirm(
      `Do you really want to delete ${data.tradeName}?`
    )
    if (confirmBox === true) {
      DeleteDrug(data)
    }
  }

  const DeleteDrug = data => {
    var token = TokenData
    var remid = data._id
    axios
      .put(
        URLS.DeleteDrug + remid,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          GetDrugs()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to delete drug")
        }
      })
  }

  const resetForm = () => {
    setform({
      groupId: [],
      drugCode: "",
      drugCode1: "",
      tradeName: "",
      compositionAndStrength: "",
      packingSpecification: "",
      unitPack: "",
      unitPrice: "",
      salesTax: "",
      nameOfFirm: "",
      nameOfStockiest: "",
    })
  }

  const toggleBulkUploadModal = () => {
    setBulkUploadModal(!bulkUploadModal)
    setSelectedFile(null)
  }

  const handleFileSelect = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleBulkUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    setUploadLoading(true)
    const token = TokenData

    axios
      .post(URLS.BluckUploadDrug, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        setUploadLoading(false)
        toggleBulkUploadModal()
        toast.success(res.data.message || "Drugs uploaded successfully!")
        GetDrugs()
      })
      .catch(error => {
        setUploadLoading(false)
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Upload failed. Please try again.")
        }
      })
  }

  const handleBulkDelete = () => {
    const confirmBox = window.confirm(
      "Do you really want to delete ALL drugs? This action cannot be undone."
    )

    if (confirmBox === true) {
      setLoading(true)
      const token = TokenData

      axios
        .delete(URLS.BluckDeleteDrug, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          setLoading(false)
          if (res.status === 200) {
            toast.success(res.data.message || "All drugs deleted successfully!")
            GetDrugs()
          }
        })
        .catch(error => {
          setLoading(false)
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Bulk delete failed. Please try again.")
          }
        })
    }
  }

  // Helper function to get selected options for react-select
  const getSelectedOptions = (groupId) => {
    if (!groupId || !Array.isArray(groupId)) return []
    return allocationFormOptions.filter(option => 
      groupId.includes(option.value)
    )
  }

  // Helper function to display form names in table
  const getFormNames = (drug) => {
    if (drug.groupId && Array.isArray(drug.groupId) && drug.groupId.length > 0) {
      // Find form names from allocationForms
      return drug.groupId.map(id => {
        const form = allocationForms.find(f => f._id === id)
        return form ? form.formName : "Unknown Form"
      })
    } else if (drug.groupId) {
      // Handle old single groupId format
      if (typeof drug.groupId === 'object' && drug.groupId.formName) {
        return [drug.groupId.formName]
      }
      return [drug.groupName || "Unknown Form"]
    }
    return ["-"]
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Drugs" />
          <Row>
            <Col md={12}>
              <Collapse isOpen={showEditForm}>
                <Card className="p-4 mb-4">
                  <Form onSubmit={FormEditSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Edit Drug</h5>
                      <Button
                        type="button"
                        color="light"
                        onClick={() => setShowEditForm(false)}
                      >
                        <i className="bx bx-x"></i>
                      </Button>
                    </div>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>
                            Form Types <span className="text-danger">*</span>
                            <small className="text-muted ms-2">(Select multiple if applicable)</small>
                          </Label>
                          <Select
                            isMulti
                            name="groupId"
                            options={allocationFormOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={getSelectedOptions(form1.groupId)}
                            onChange={handleMultiSelectChange1}
                            required
                          />
                          {form1.groupId && form1.groupId.length > 0 && (
                            <div className="mt-2">
                              <small className="text-muted">
                                Selected: {form1.groupId.length} form type(s)
                              </small>
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>
                            Drug Code <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="drugCode"
                            type="text"
                            value={form1.drugCode}
                            placeholder="Enter Drug Code"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>
                            Drug Name(drugCode1)
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="drugCode1"
                            type="text"
                            value={form1.drugCode1}
                            placeholder="Enter Drug Name"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup>
                          <Label>
                            Trade Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="tradeName"
                            type="text"
                            value={form1.tradeName}
                            placeholder="Enter Trade Name"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Specification</Label>
                          <Input
                            name="packingSpecification"
                            type="text"
                            value={form1.packingSpecification}
                            placeholder="Enter Specification"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Unit Pack</Label>
                          <Input
                            name="unitPack"
                            type="text"
                            value={form1.unitPack}
                            placeholder="Enter Unit Pack"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Presentation</Label>
                          <Input
                            name="compositionAndStrength"
                            type="text"
                            value={form1.compositionAndStrength}
                            placeholder="Enter Presentation"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>
                            Base Price <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="unitPrice"
                            type="number"
                            inputMode="decimal"
                            onWheel={e => e.target.blur()}
                            step="0.01"
                            value={form1.unitPrice}
                            placeholder="Enter Base Price"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Gst (%)</Label>
                          <Input
                            name="salesTax"
                            type="number"
                            inputMode="decimal"
                            onWheel={e => e.target.blur()}
                            step="0.01"
                            value={form1.salesTax}
                            placeholder="Enter Gst"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Name of the Firm</Label>
                          <Input
                            name="nameOfFirm"
                            type="text"
                            value={form1.nameOfFirm}
                            placeholder="Enter Firm Name"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Name of the Stockiest</Label>
                          <Input
                            name="nameOfStockiest"
                            type="text"
                            value={form1.nameOfStockiest}
                            placeholder="Enter Stockiest Name"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button
                        type="button"
                        onClick={() => setShowEditForm(false)}
                        color="danger m-1"
                      >
                        Cancel <i className="bx bx-x-circle"></i>
                      </Button>
                      <Button type="submit" color="primary text-white m-1">
                        Update <i className="bx bx-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Collapse>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Collapse isOpen={showAddForm}>
                <Card>
                  <CardBody>
                    <Form onSubmit={FormAddSubmit}>
                      <h5 className="mb-3">Add New Drug</h5>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label>
                              Form Types <span className="text-danger">*</span>
                              <small className="text-muted ms-2">(Select multiple if applicable)</small>
                            </Label>
                            <Select
                              isMulti
                              name="groupId"
                              options={allocationFormOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              value={getSelectedOptions(form.groupId)}
                              onChange={handleMultiSelectChange}
                              required
                            />
                            {form.groupId && form.groupId.length > 0 && (
                              <div className="mt-2">
                                <small className="text-muted">
                                  Selected: {form.groupId.length} form type(s)
                                </small>
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>
                              Drug Code <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="drugCode"
                              type="text"
                              value={form.drugCode}
                              placeholder="Enter Drug Code"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>
                              Drug Name(drugCode1) <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="drugCode1"
                              type="text"
                              value={form.drugCode1}
                              placeholder="Enter Drug Name"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>
                              Trade Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="tradeName"
                              type="text"
                              value={form.tradeName}
                              placeholder="Enter Trade Name"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Specification</Label>
                            <Input
                              name="packingSpecification"
                              type="text"
                              value={form.packingSpecification}
                              placeholder="Enter Specification"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Unit Pack</Label>
                            <Input
                              name="unitPack"
                              type="text"
                              value={form.unitPack}
                              placeholder="Enter Unit Pack"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Presentation</Label>
                            <Input
                              name="compositionAndStrength"
                              type="text"
                              value={form.compositionAndStrength}
                              placeholder="Enter Presentation"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>
                              Base Price <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="unitPrice"
                              type="number"
                              inputMode="decimal"
                              onWheel={e => e.target.blur()}
                              step="0.01"
                              value={form.unitPrice}
                              placeholder="Enter Base Price"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Gst (%)</Label>
                            <Input
                              name="salesTax"
                              type="number"
                              inputMode="decimal"
                              onWheel={e => e.target.blur()}
                              step="0.01"
                              value={form.salesTax}
                              placeholder="Enter Gst"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Name of the Firm</Label>
                            <Input
                              name="nameOfFirm"
                              type="text"
                              value={form.nameOfFirm}
                              placeholder="Enter Firm Name"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Name of the Stockiest</Label>
                            <Input
                              name="nameOfStockiest"
                              type="text"
                              value={form.nameOfStockiest}
                              placeholder="Enter Stockiest Name"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="text-end mt-4">
                        <Button type="submit" color="success text-white">
                          Submit <i className="bx bx-check-circle"></i>
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Collapse>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={4}>
                      <h4 className="card-title">Drug Records</h4>
                      <p className="text-muted">
                        Showing {lists.length} of {Data.length} drugs
                        {Data.length > listPerPage && (
                          <span>
                            {" "}
                            (Page {pageNumber + 1} of {pageCount})
                          </span>
                        )}
                      </p>
                    </Col>
                    <Col md={8} className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="warning"
                              className="text-white"
                              onClick={toggleBulkUploadModal}
                            >
                              <i className="bx bx-upload me-2"></i>
                              Bulk Upload
                            </Button>{" "}
                          </>
                        ) : (
                          ""
                        )}

                        {Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="danger"
                              className="text-white"
                              onClick={handleBulkDelete}
                              disabled={Data.length === 0 || loading}
                            >
                              <i className="bx bx-trash me-2"></i>
                              Bulk Delete
                            </Button>{" "}
                          </>
                        ) : (
                          ""
                        )}

                        {Roles?.DrugAdd === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Button
                              className="m-1"
                              color="primary"
                              onClick={() => {
                                setShowAddForm(!showAddForm)
                                setShowEditForm(false)
                                if (showAddForm) resetForm()
                              }}
                            >
                              {showAddForm ? (
                                <>
                                  Cancel Add <i className="bx bx-x"></i>
                                </>
                              ) : (
                                <>
                                  Add New Drug <i className="bx bx-plus"></i>
                                </>
                              )}
                            </Button>{" "}
                          </>
                        ) : (
                          ""
                        )}
                        <Input
                          name="search"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          type="text"
                          placeholder="Search..."
                          style={{ width: "200px" }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4">
                      <thead className="table-light">
                        <tr>
                          <th>S.No</th>
                          <th>Form Types</th>
                          <th>Drug Code</th>
                          <th>Drug Name</th>
                          <th>Trade Name</th>
                          <th>Specification</th>
                          <th>Unit Pack</th>
                          <th>Presentation</th>
                          <th>Base Price</th>
                          <th>GST (%)</th>
                          <th>Firm Name</th>
                          <th>Stockiest Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="12" className="text-center">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : lists.length === 0 ? (
                          <tr>
                            <td colSpan="12" className="text-center text-muted">
                              No drug records found
                            </td>
                          </tr>
                        ) : (
                          lists.map((data, index) => {
                            const formNames = getFormNames(data)
                            return (
                              <tr key={data._id || index}>
                                <td>{pagesVisited + index + 1}</td>
                                <td>
                                  <div className="d-flex flex-wrap gap-1">
                                    {formNames.map((name, idx) => (
                                      <Badge 
                                        key={idx} 
                                        color="info" 
                                        className="mb-1"
                                      >
                                        {name}
                                      </Badge>
                                    ))}
                                  </div>
                                </td>
                                <td>{data.drugCode}</td>
                                <td>{data.drugCode1}</td>
                                <td>{data.tradeName}</td>
                                <td>{data.packingSpecification || "-"}</td>
                                <td>{data.unitPack || "-"}</td>
                                <td>{data.compositionAndStrength || "-"}</td>
                                <td>{data.unitPrice || "0.00"}</td>
                                <td>{data.salesTax || "0"}%</td>
                                <td>{data.nameOfFirm || "-"}</td>
                                <td>{data.nameOfStockiest || "-"}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    {Roles?.DrugEdit === true ||
                                    Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          onClick={() => UpdatePopUp(data)}
                                          color="info"
                                          size="sm"
                                          className="btn-icon"
                                          title="Edit"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {Roles?.DrugDelete === true ||
                                    Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          onClick={() => DeleteData(data)}
                                          color="danger"
                                          size="sm"
                                          className="btn-icon"
                                          title="Delete"
                                        >
                                          <i className="bx bx-trash"></i>
                                        </Button>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </Table>
                    {Data.length > listPerPage && (
                      <div className="d-flex justify-content-end mt-3">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          pageCount={pageCount}
                          onPageChange={changePage}
                          containerClassName={"pagination"}
                          previousLinkClassName={"page-link"}
                          nextLinkClassName={"page-link"}
                          disabledClassName={"disabled"}
                          activeClassName={"active"}
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          forcePage={pageNumber}
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
      <Modal isOpen={bulkUploadModal} toggle={toggleBulkUploadModal}>
        <ModalHeader toggle={toggleBulkUploadModal}>
          Bulk Upload Drugs
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <h6 className="mb-3">Download Sample Files:</h6>
            <div className="d-flex gap-2">
              <Button color="outline-success" size="sm">
                <a
                  href={DrugTemplate}
                  download
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <i className="bx bx-download me-1"></i>
                  Download XLSX Template
                </a>
              </Button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="fileUpload" className="form-label">
              Upload Drug File (XLSX or CSV)
            </label>
            <input
              type="file"
              className="form-control"
              id="fileUpload"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
            />
            <div className="form-text">
              Supported formats: XLSX, XLS, CSV. Maximum file size: 10MB
            </div>
          </div>
          {selectedFile && (
            <div className="alert alert-info">
              <i className="bx bx-info-circle me-2"></i>
              Selected file: <strong>{selectedFile.name}</strong>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={toggleBulkUploadModal}
            disabled={uploadLoading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleBulkUpload}
            disabled={!selectedFile || uploadLoading}
          >
            {uploadLoading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Uploading...
              </>
            ) : (
              <>
                <i className="bx bx-upload me-2"></i>
                Upload File
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default Drug