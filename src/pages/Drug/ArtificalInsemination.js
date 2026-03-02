// import React, { useEffect, useState, useCallback } from "react"
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
//   FormGroup,
// } from "reactstrap"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer, toast } from "react-toastify"
// import ReactPaginate from "react-paginate"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import axios from "axios"

// const ArtificalInsemination = () => {
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = JSON.parse(GetAuth)
//   const TokenData = TokenJson.token
//   const UserDetails = TokenJson?.user
//   const token = TokenData

//   const [show, setShow] = useState(false)
//   const [show1, setShow1] = useState(false)
//   const [data, setData] = useState([])
//   const [listPerPage] = useState(10)
//   const [pageNumber, setPageNumber] = useState(0)

//   const [placeOfWorking, setPlaceOfWorking] = useState([])

//   const getCurrentDate = () => {
//     const now = new Date()
//     const year = now.getFullYear()
//     const month = String(now.getMonth() + 1).padStart(2, "0")
//     const day = String(now.getDate()).padStart(2, "0")
//     return `${year}-${month}-${day}`
//   }

//   const [form, setForm] = useState({
//     breedType: "",
//     noOfAiDone: "",
//     noOfAnimalsInseminated: "",
//     noOfAnimalsVerified: "",
//     noOfAnimalsPositive: "",
//     maleCalves: "",
//     femaleCalves: "",
//     totalCalves: "",
//     correspondingAi: "",
//     visitDate: getCurrentDate(),
//     workingPlaceId: "",
//     addedBy: UserDetails?._id,
//     search: "",
//   })

//   const [form1, setForm1] = useState({
//     _id: "",
//     breedType: "",
//     noOfAiDone: "",
//     noOfAnimalsInseminated: "",
//     noOfAnimalsVerified: "",
//     noOfAnimalsPositive: "",
//     maleCalves: "",
//     femaleCalves: "",
//     totalCalves: "",
//     correspondingAi: "",
//     visitDate: "",
//     workingPlaceId: "",
//   })

//   const breedTypes = [
//     "Jersey",
//     "Ongole",
//     "Gir",
//     "Sahiwal",
//     "HF X Sahiwal (HFCB)",
//     "Jersey X Red Sindhi (JYCB)",
//     "Murrah",
//     "Mehsana",
//   ]

//   useEffect(() => {
//     Get()
//     fetchPlaceOfWorking()
//   }, [])

//   const Get = () => {
//     const token = TokenData
//     axios
//       .get(URLS.GetArtificalInsemination, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         setData(res?.data?.artificialInseminations)
//       })
//       .catch(error => {
//         console.error("Error fetching ArtificalInsemination:", error)
//       })
//   }

//   const SearchData = e => {
//     const value = e.target.value
//     setForm(prev => ({ ...prev, search: value }))

//     if (value.trim() === "") {
//       Get()
//       return
//     }

//     const token = TokenData
//     axios
//       .get(URLS.GetArtificalInseminationSearch + value, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           setData(res?.data?.artificialInseminations)
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         }
//       })
//   }

//   const pagesVisited = pageNumber * listPerPage
//   const lists = data.slice(pagesVisited, pagesVisited + listPerPage)
//   const pageCount = Math.ceil(data.length / listPerPage)

//   const changePage = ({ selected }) => {
//     setPageNumber(selected)
//   }

//   const AddPopUp = () => {
//     setShow(true)
//     setShow1(false)
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     })
//   }

//   const handleChange = e => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   const handleInputChange = e => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   const handleInputChange1 = e => {
//     const { name, value } = e.target
//     setForm1(prev => ({ ...prev, [name]: value }))
//   }

//   const FormAddSubmit = e => {
//     e.preventDefault()
//     AddData()
//   }

//   const AddData = () => {
//     const missingFields = []
//     if (!form.visitDate) missingFields.push("Visit Date")
//     if (!form.workingPlaceId) missingFields.push("Working Place")
//     if (!form.breedType) missingFields.push("Breed Type")
//     if (missingFields.length > 0) {
//       toast.error(`Please fill: ${missingFields.join(", ")}`)
//       return
//     }
//     const token = TokenData
//     const dataArray = {
//       breedType: form.breedType,
//       noOfAiDone: form.noOfAiDone,
//       noOfAnimalsInseminated: form.noOfAnimalsInseminated,
//       noOfAnimalsVerified: form.noOfAnimalsVerified,
//       noOfAnimalsPositive: form.noOfAnimalsPositive,
//       maleCalves: form.maleCalves,
//       femaleCalves: form.femaleCalves,
//       totalCalves: form.totalCalves,
//       correspondingAi: form.correspondingAi,
//       visitDate: form.visitDate,
//       workingPlaceId: form.workingPlaceId,
//       addedBy: UserDetails?._id,
//     }

//     axios
//       .post(URLS.AddArtificalInsemination, dataArray, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           toast.success(res.data.message)
//           setShow(false)
//           setForm({
//             breedType: "",
//             noOfAiDone: "",
//             noOfAnimalsInseminated: "",
//             noOfAnimalsVerified: "",
//             noOfAnimalsPositive: "",
//             maleCalves: "",
//             femaleCalves: "",
//             totalCalves: "",
//             correspondingAi: "",
//             visitDate: getCurrentDate(),
//             workingPlaceId: "",
//             search: "",
//           })
//           Get()
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         }
//       })
//   }

//   const handleChange1 = e => {
//     const { name, value } = e.target
//     setForm1(prev => ({ ...prev, [name]: value }))
//   }

//   const UpdatePopUp = data => {
//     setForm1({
//       ...data,
//       visitDate: data.visitDate || getCurrentDate(),
//     })
//     setShow(false)
//     setShow1(true)
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
//     const missingFields = []
//     if (!form1.visitDate) missingFields.push("Visit Date")
//     if (!form1.workingPlaceId) missingFields.push("Working Place")
//     if (!form1.breedType) missingFields.push("Breed Type")
//     if (missingFields.length > 0) {
//       toast.error(`Please fill: ${missingFields.join(", ")}`)
//       return
//     }
//     const token = TokenData
//     const dataArray = {
//       breedType: form1.breedType,
//       noOfAiDone: form1.noOfAiDone,
//       noOfAnimalsInseminated: form1.noOfAnimalsInseminated,
//       noOfAnimalsVerified: form1.noOfAnimalsVerified,
//       noOfAnimalsPositive: form1.noOfAnimalsPositive,
//       maleCalves: form1.maleCalves,
//       femaleCalves: form1.femaleCalves,
//       totalCalves: form1.totalCalves,
//       correspondingAi: form1.correspondingAi,
//       visitDate: form1.visitDate,
//       workingPlaceId: form1.workingPlaceId,
//     }

//     axios
//       .put(URLS.EditArtificalInsemination + form1._id, dataArray, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           toast.success(res.data.message)
//           setShow1(false)
//           Get()
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         }
//       })
//   }

//   const DeleteData = data => {
//     const confirmBox = window.confirm("Do you really want to Delete?")
//     if (confirmBox === true) {
//       Delete(data)
//     }
//   }

//   const Delete = data => {
//     const token = TokenData
//     const remid = data._id

//     axios
//       .delete(URLS.DeleteArtificalInsemination + remid, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (res.status === 200) {
//           toast.success(res.data.message)
//           Get()
//         }
//       })
//       .catch(error => {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         }
//       })
//   }

//   const calculateTotals = () => {
//     const totals = {
//       noOfAiDone: 0,
//       noOfAnimalsInseminated: 0,
//       noOfAnimalsVerified: 0,
//       noOfAnimalsPositive: 0,
//       maleCalves: 0,
//       femaleCalves: 0,
//       totalCalves: 0,
//       correspondingAi: 0,
//     }

//     data.forEach(item => {
//       totals.noOfAiDone += parseInt(item.noOfAiDone) || 0
//       totals.noOfAnimalsInseminated +=
//         parseInt(item.noOfAnimalsInseminated) || 0
//       totals.noOfAnimalsVerified += parseInt(item.noOfAnimalsVerified) || 0
//       totals.noOfAnimalsPositive += parseInt(item.noOfAnimalsPositive) || 0
//       totals.maleCalves += parseInt(item.maleCalves) || 0
//       totals.femaleCalves += parseInt(item.femaleCalves) || 0
//       totals.totalCalves += parseInt(item.totalCalves) || 0
//       totals.correspondingAi += parseInt(item.correspondingAi) || 0
//     })

//     return totals
//   }

//   const totals = calculateTotals()

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: 34,
//       height: 34,
//       paddingLeft: 2,
//       fontSize: 14,
//       borderRadius: 8,
//       borderColor: state.isFocused ? "#2563eb" : "#d0d7e2",
//       boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
//       transition: "0.25s",
//       "&:hover": {
//         borderColor: "#b8c2d3",
//       },
//     }),
//     valueContainer: base => ({
//       ...base,
//       padding: "0 8px",
//     }),
//     indicatorsContainer: base => ({
//       ...base,
//       height: 34,
//     }),
//     option: base => ({
//       ...base,
//       fontSize: 14,
//       padding: "8px 12px",
//     }),
//     placeholder: base => ({
//       ...base,
//       fontSize: 14,
//       color: "#94a3b8",
//     }),
//   }

//   const placeOfWorkingOptions = placeOfWorking.map(p => ({
//     value: p._id,
//     label: p.name,
//   }))

//   const fetchPlaceOfWorking = useCallback(async () => {
//     try {
//       const response = await axios.post(
//         URLS.GetPlaceOfWorking,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       setPlaceOfWorking(response.data.data || [])
//     } catch (error) {
//       toast.error("Failed to load Place Of Working")
//     }
//   }, [token])

//   const handleSelectChange = (selectedOption, { name }) => {
//     setForm(prev => ({
//       ...prev,
//       [name]: selectedOption ? selectedOption.value : "",
//     }))
//   }

//   const handleSelectChange1 = (selectedOption, { name }) => {
//     setForm1(prev => ({
//       ...prev,
//       [name]: selectedOption ? selectedOption.value : "",
//     }))
//   }

//   const getCurrentPlace = () => {
//     return (
//       placeOfWorkingOptions.find(opt => opt.value === form.workingPlaceId) ||
//       null
//     )
//   }

//   const getCurrentPlace1 = () => {
//     return (
//       placeOfWorkingOptions.find(opt => opt.value === form1.workingPlaceId) ||
//       null
//     )
//   }

//   // Auto-calculate total when maleCalves or femaleCalves changes
//   useEffect(() => {
//     const male = parseInt(form.maleCalves) || 0
//     const female = parseInt(form.femaleCalves) || 0
//     const total = male + female
//     setForm(prev => ({ ...prev, totalCalves: total.toString() }))
//   }, [form.maleCalves, form.femaleCalves])

//   // Auto-calculate total when maleCalves or femaleCalves changes for edit form
//   useEffect(() => {
//     const male = parseInt(form1.maleCalves) || 0
//     const female = parseInt(form1.femaleCalves) || 0
//     const total = male + female
//     setForm1(prev => ({ ...prev, totalCalves: total.toString() }))
//   }, [form1.maleCalves, form1.femaleCalves])

//   var gets = localStorage.getItem("authUser")
//   var datas = JSON.parse(gets)
//   var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <div className="container-fluid">
//           <Breadcrumbs
//             title="VAHD ADMIN"
//             breadcrumbItem="Artificial Insemination"
//           />
//           <Row>
//             <Col md={12}>
//               {show && (
//                 <Card className="p-4">
//                   <Form onSubmit={FormAddSubmit}>
//                     <h5 className="mb-3">
//                       Create Artificial Insemination Record
//                     </h5>
//                     <Row>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label for="visitDate" className="fw-bold">
//                             Date*
//                           </Label>
//                           <Input
//                             className="form-control"
//                             size="sm"
//                             type="date"
//                             name="visitDate"
//                             id="visitDate"
//                             value={form.visitDate}
//                             onChange={handleInputChange}
//                             max={new Date().toISOString().split("T")[0]}
//                             required
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={4}>
//                         <FormGroup>
//                           <Label for="workingPlaceId" className="fw-bold">
//                             Place of Working*
//                           </Label>
//                           <Select
//                             name="workingPlaceId"
//                             value={getCurrentPlace()}
//                             onChange={handleSelectChange}
//                             options={placeOfWorkingOptions}
//                             styles={selectStyles}
//                             placeholder="Select Place"
//                             isSearchable
//                             required
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={4}>
//                         <div className="text-center pt-4">
//                           <h6 className="text-primary">
//                             <i className="bx bx-user me-2"></i>
//                             User Name: {UserDetails?.name}
//                           </h6>
//                         </div>
//                       </Col>

//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Breed Type</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="breedType"
//                             value={form.breedType}
//                             type="select"
//                           >
//                             <option value="">Select Breed Type</option>
//                             {breedTypes.map((breed, index) => (
//                               <option key={index} value={breed}>
//                                 {breed}
//                               </option>
//                             ))}
//                           </Input>
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of AI Done</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="noOfAiDone"
//                             value={form.noOfAiDone}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of Animals Inseminated</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="noOfAnimalsInseminated"
//                             value={form.noOfAnimalsInseminated}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of Animals Verified for Pregnancy</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="noOfAnimalsVerified"
//                             value={form.noOfAnimalsVerified}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of Animals Found Positive</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="noOfAnimalsPositive"
//                             value={form.noOfAnimalsPositive}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Male Calves</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="maleCalves"
//                             value={form.maleCalves}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Female Calves</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="femaleCalves"
//                             value={form.femaleCalves}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Total Calves</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="totalCalves"
//                             value={form.totalCalves}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Auto-calculated"
//                             readOnly
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Corresponding AI for Calf Births</Label>
//                           <Input
//                             onChange={handleChange}
//                             name="correspondingAi"
//                             value={form.correspondingAi}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                     </Row>
//                     <div className="text-end mt-4">
//                       <Button
//                         type="button"
//                         onClick={() => setShow(false)}
//                         color="danger m-1"
//                       >
//                         Cancel <i className="bx bx-x-circle"></i>
//                       </Button>
//                       <Button type="submit" color="primary text-white m-1">
//                         Submit <i className="bx bx-check-circle"></i>
//                       </Button>
//                     </div>
//                   </Form>
//                 </Card>
//               )}
//             </Col>
//             <Col md={12}>
//               {show1 && (
//                 <Card className="p-4">
//                   <Form onSubmit={FormEditSubmit}>
//                     <h5 className="mb-3">
//                       Edit Artificial Insemination Record
//                     </h5>
//                     <Row>
//                       <Col md={3}>
//                         <FormGroup>
//                           <Label for="visitDate" className="fw-bold">
//                             Date*
//                           </Label>
//                           <Input
//                             size="sm"
//                             type="date"
//                             name="visitDate"
//                             id="visitDate"
//                             value={form1.visitDate}
//                             onChange={handleInputChange1}
//                             max={new Date().toISOString().split("T")[0]}
//                             required
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={4}>
//                         <FormGroup>
//                           <Label for="workingPlaceId" className="fw-bold">
//                             Place of Working*
//                           </Label>
//                           <Select
//                             name="workingPlaceId"
//                             value={getCurrentPlace1()}
//                             onChange={handleSelectChange1}
//                             options={placeOfWorkingOptions}
//                             styles={selectStyles}
//                             placeholder="Select Place"
//                             isSearchable
//                             required
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md={4}>
//                         <div className="text-center pt-4">
//                           <h6 className="text-primary">
//                             <i className="bx bx-user me-2"></i>
//                             User Name: {UserDetails?.name}
//                           </h6>
//                         </div>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Breed Type</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="breedType"
//                             value={form1.breedType}
//                             type="select"
//                           >
//                             <option value="">Select Breed Type</option>
//                             {breedTypes.map((breed, index) => (
//                               <option key={index} value={breed}>
//                                 {breed}
//                               </option>
//                             ))}
//                           </Input>
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of AI Done</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="noOfAiDone"
//                             value={form1.noOfAiDone}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of Animals Inseminated</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="noOfAnimalsInseminated"
//                             value={form1.noOfAnimalsInseminated}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of Animals Verified for Pregnancy</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="noOfAnimalsVerified"
//                             value={form1.noOfAnimalsVerified}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>No. of Animals Found Positive</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="noOfAnimalsPositive"
//                             value={form1.noOfAnimalsPositive}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Male Calves</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="maleCalves"
//                             value={form1.maleCalves}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Female Calves</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="femaleCalves"
//                             value={form1.femaleCalves}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Total Calves</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="totalCalves"
//                             value={form1.totalCalves}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Auto-calculated"
//                             readOnly
//                           />
//                         </FormGroup>
//                       </Col>
//                       <Col md="4">
//                         <FormGroup>
//                           <Label>Corresponding AI for Calf Births</Label>
//                           <Input
//                             onChange={handleChange1}
//                             name="correspondingAi"
//                             value={form1.correspondingAi}
//                             type="number"
//                             inputMode="decimal"
//                             onWheel={e => e.target.blur()}
//                             min="0"
//                             placeholder="Enter Number"
//                           />
//                         </FormGroup>
//                       </Col>
//                     </Row>
//                     <div className="text-end mt-4">
//                       <Button
//                         type="button"
//                         onClick={() => setShow1(false)}
//                         color="danger m-1"
//                       >
//                         Cancel <i className="bx bx-x-circle"></i>
//                       </Button>
//                       <Button type="submit" color="primary text-white m-1">
//                         Submit <i className="bx bx-check-circle"></i>
//                       </Button>
//                     </div>
//                   </Form>
//                 </Card>
//               )}
//             </Col>
//             <Col md={12}>
//               <Card>
//                 <CardBody>
//                   <Row>
//                     <Col>
//                       {Roles?.AIAdd === true || Roles?.accessAll === true ? (
//                         <>
//                           <Button color="primary text-white" onClick={AddPopUp}>
//                             Create Artificial Insemination Record{" "}
//                             <i className="bx bx-plus-circle"></i>
//                           </Button>{" "}
//                         </>
//                       ) : (
//                         ""
//                       )}
//                     </Col>
//                     <Col>
//                       <div style={{ float: "right" }}>
//                         <Input
//                           name="search"
//                           value={form.search}
//                           onChange={SearchData}
//                           type="search"
//                           placeholder="Search..."
//                         />
//                       </div>
//                     </Col>
//                   </Row>
//                   <div className="table-rep-plugin mt-4 table-responsive">
//                     <Table hover className="table table-bordered mb-4">
//                       <thead>
//                         <tr className="text-center">
//                           <th rowSpan="2">S.No.</th>
//                           <th rowSpan="2">Date</th>
//                           <th rowSpan="2">Place Of Working</th>
//                           <th rowSpan="2">Breed Type</th>
//                           <th colSpan="4">Artificial Insemination</th>
//                           <th colSpan="3">No of Calves born</th>
//                           <th rowSpan="2">Corresponding AI for Calf Births</th>
//                           <th rowSpan="2">Action</th>
//                         </tr>
//                         <tr className="text-center">
//                           <th>No of AI done</th>
//                           <th>No. of Animals Inseminated</th>
//                           <th>No. of Animals Verified for pregnancy</th>
//                           <th>No. of Animal found Positive</th>
//                           <th>MALE</th>
//                           <th>FEMALE</th>
//                           <th>TOTAL</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {lists.map((data, key) => (
//                           <tr key={key} className="text-center">
//                             <td>{pagesVisited + key + 1}</td>
//                             <td>{data.visitDate}</td>
//                             <td>{data.workingPlaceName}</td>
//                             <td>{data.breedType}</td>
//                             <td>{data.noOfAiDone}</td>
//                             <td>{data.noOfAnimalsInseminated}</td>
//                             <td>{data.noOfAnimalsVerified}</td>
//                             <td>{data.noOfAnimalsPositive}</td>
//                             <td>{data.maleCalves}</td>
//                             <td>{data.femaleCalves}</td>
//                             <td>{data.totalCalves}</td>
//                             <td>{data.correspondingAi}</td>
//                             <td>
//                               {Roles?.AIEdit === true ||
//                               Roles?.accessAll === true ? (
//                                 <>
//                                   <Button
//                                     onClick={() => UpdatePopUp(data)}
//                                     size="md"
//                                     className="m-1"
//                                     color="info"
//                                   >
//                                     <div className="d-flex">
//                                       <i className="bx bx-edit"></i>
//                                     </div>
//                                   </Button>
//                                 </>
//                               ) : (
//                                 ""
//                               )}
//                               {Roles?.AIDelete === true ||
//                               Roles?.accessAll === true ? (
//                                 <>
//                                   <Button
//                                     size="md"
//                                     className="m-1"
//                                     color="danger"
//                                     onClick={() => DeleteData(data)}
//                                   >
//                                     <div className="d-flex">
//                                       <i className="bx bx-trash"></i>
//                                     </div>
//                                   </Button>{" "}
//                                 </>
//                               ) : (
//                                 ""
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                         <tr className="text-center fw-bold">
//                           <td colSpan="4">TOTAL</td>
//                           <td>{totals.noOfAiDone}</td>
//                           <td>{totals.noOfAnimalsInseminated}</td>
//                           <td>{totals.noOfAnimalsVerified}</td>
//                           <td>{totals.noOfAnimalsPositive}</td>
//                           <td>{totals.maleCalves}</td>
//                           <td>{totals.femaleCalves}</td>
//                           <td>{totals.totalCalves}</td>
//                           <td>{totals.correspondingAi}</td>
//                           <td></td>
//                         </tr>
//                       </tbody>
//                     </Table>
//                     <Col sm="12">
//                       <div
//                         className="d-flex mt-3 mb-1"
//                         style={{ float: "right" }}
//                       >
//                         <ReactPaginate
//                           previousLabel={"Previous"}
//                           nextLabel={"Next"}
//                           pageCount={pageCount}
//                           onPageChange={changePage}
//                           containerClassName={"pagination"}
//                           previousLinkClassName={"previousBttn"}
//                           nextLinkClassName={"nextBttn"}
//                           disabledClassName={"disabled"}
//                           activeClassName={"active"}
//                         />
//                       </div>
//                     </Col>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//         <ToastContainer />
//       </div>
//     </React.Fragment>
//   )
// }

// export default ArtificalInsemination



import React, { useEffect, useState, useCallback } from "react"
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
  FormGroup,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import Select from "react-select"
import { URLS } from "../../Url"
import axios from "axios"

const ArtificalInsemination = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token
  const UserDetails = TokenJson?.user
  const token = TokenData

  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [data, setData] = useState([])
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  const [placeOfWorking, setPlaceOfWorking] = useState([])
  const [animalTypes, setAnimalTypes] = useState([])
  const [sortedSemen, setSortedSemen] = useState([])

  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const initialAnimalDetail = {
    animalTypeId: "",
    noOfAiDone: "",
    sortedSemenId: "",
  }

  const initialFormState = {
    animalDetails: [{ ...initialAnimalDetail }],
    noOfAnimalsInseminated: "",
    noOfAnimalsVerified: "",
    noOfAnimalsPositive: "",
    maleCalves: "",
    femaleCalves: "",
    totalCalves: "",
    correspondingAi: "",
    visitDate: getCurrentDate(),
    workingPlaceId: "",
    addedBy: UserDetails?._id,
    search: "",
  }

  const [form, setForm] = useState(initialFormState)
  const [form1, setForm1] = useState({
    _id: "",
    ...initialFormState,
    visitDate: "",
  })

  const animalTypeOptions = animalTypes.map(type => ({
    value: type._id,
    label: type.name,
  }))

  const sortedSemenOptions = sortedSemen.map(item => ({
    value: item._id,
    label: item.name,
  }))

  const Get = () => {
    const token = TokenData
    axios
      .get(URLS.GetArtificalInsemination, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setData(res?.data?.artificialInseminations || [])
      })
      .catch(error => {
        console.error("Error fetching ArtificalInsemination:", error)
        toast.error("Failed to load data")
      })
  }

  const SearchData = e => {
    const value = e.target.value
    setForm(prev => ({ ...prev, search: value }))

    if (value.trim() === "") {
      Get()
      return
    }

    const token = TokenData
    axios
      .get(URLS.GetArtificalInseminationSearch + value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          setData(res?.data?.artificialInseminations || [])
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(data.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const AddPopUp = () => {
    setShow(true)
    setShow1(false)
    setForm({
      ...initialFormState,
      visitDate: getCurrentDate(),
      animalDetails: [{ ...initialAnimalDetail }],
    })
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleInputChange1 = e => {
    const { name, value } = e.target
    setForm1(prev => ({ ...prev, [name]: value }))
  }

  const handleAnimalDetailChange = (index, field, value) => {
    setForm(prev => {
      const updatedAnimalDetails = [...prev.animalDetails]
      updatedAnimalDetails[index] = {
        ...updatedAnimalDetails[index],
        [field]: value
      }

      // Automatically add new row if this is the last row and both fields are filled
      if (index === prev.animalDetails.length - 1) {
        const currentDetail = updatedAnimalDetails[index]
        if (currentDetail.animalTypeId && currentDetail.noOfAiDone) {
          if (updatedAnimalDetails.length <= index + 1) {
            updatedAnimalDetails.push({ ...initialAnimalDetail })
          }
        }
      }

      return {
        ...prev,
        animalDetails: updatedAnimalDetails
      }
    })
  }

  const handleAnimalSelectChange = (selectedOption, index) => {
    handleAnimalDetailChange(index, 'animalTypeId', selectedOption ? selectedOption.value : "")
  }

  const handleSortedSemenChange = (selectedOption, index) => {
    handleAnimalDetailChange(index, 'sortedSemenId', selectedOption ? selectedOption.value : "")
  }

  const handleAiDoneChange = (e, index) => {
    const { value } = e.target
    handleAnimalDetailChange(index, 'noOfAiDone', value)
  }

  const removeAnimalDetail = (index) => {
    if (form.animalDetails.length > 1) {
      setForm(prev => ({
        ...prev,
        animalDetails: prev.animalDetails.filter((_, i) => i !== index)
      }))
    }
  }

  const handleAnimalDetailChange1 = (index, field, value) => {
    setForm1(prev => {
      const updatedAnimalDetails = [...prev.animalDetails]
      updatedAnimalDetails[index] = {
        ...updatedAnimalDetails[index],
        [field]: value
      }

      // Automatically add new row if this is the last row and both fields are filled
      if (index === prev.animalDetails.length - 1) {
        const currentDetail = updatedAnimalDetails[index]
        if (currentDetail.animalTypeId && currentDetail.noOfAiDone) {
          if (updatedAnimalDetails.length <= index + 1) {
            updatedAnimalDetails.push({ ...initialAnimalDetail })
          }
        }
      }

      return {
        ...prev,
        animalDetails: updatedAnimalDetails
      }
    })
  }

  const handleAnimalSelectChange1 = (selectedOption, index) => {
    handleAnimalDetailChange1(index, 'animalTypeId', selectedOption ? selectedOption.value : "")
  }

  const handleSortedSemenChange1 = (selectedOption, index) => {
    handleAnimalDetailChange1(index, 'sortedSemenId', selectedOption ? selectedOption.value : "")
  }

  const handleAiDoneChange1 = (e, index) => {
    const { value } = e.target
    handleAnimalDetailChange1(index, 'noOfAiDone', value)
  }

  const removeAnimalDetail1 = (index) => {
    if (form1.animalDetails.length > 1) {
      setForm1(prev => ({
        ...prev,
        animalDetails: prev.animalDetails.filter((_, i) => i !== index)
      }))
    }
  }

  const FormAddSubmit = e => {
    e.preventDefault()
    AddData()
  }

  const AddData = () => {
    // Validate required fields
    const missingFields = []
    if (!form.visitDate) missingFields.push("Visit Date")
    if (!form.workingPlaceId) missingFields.push("Working Place")

    // Validate animal details
    const validAnimalDetails = form.animalDetails.filter(detail =>
      detail.animalTypeId && detail.noOfAiDone
    )

    if (validAnimalDetails.length === 0) {
      toast.error("Please fill at least one animal type and number of AI done")
      return
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }

    const token = TokenData
    const dataArray = {
      animalDetails: validAnimalDetails,
      noOfAnimalsInseminated: form.noOfAnimalsInseminated || "0",
      noOfAnimalsVerified: form.noOfAnimalsVerified || "0",
      noOfAnimalsPositive: form.noOfAnimalsPositive || "0",
      maleCalves: form.maleCalves || "0",
      femaleCalves: form.femaleCalves || "0",
      totalCalves: form.totalCalves || "0",
      correspondingAi: form.correspondingAi || "0",
      visitDate: form.visitDate,
      workingPlaceId: form.workingPlaceId,
      addedBy: UserDetails?._id,
    }

    axios
      .post(URLS.AddArtificalInsemination, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShow(false)
          setForm({
            ...initialFormState,
            visitDate: getCurrentDate(),
            animalDetails: [{ ...initialAnimalDetail }],
          })
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to add record")
        }
      })
  }

  const UpdatePopUp = dataItem => {
    try {
      // Parse animal details from data
      let animalDetails = []
      if (dataItem.animalDetails && Array.isArray(dataItem.animalDetails)) {
        animalDetails = dataItem.animalDetails.map(detail => ({
          animalTypeId: detail.animalTypeId,
          noOfAiDone: detail.noOfAiDone || "",
          sortedSemenId: detail.sortedSemenId || ""
        }))
      } else {
        // Fallback for old data structure
        animalDetails = [{
          animalTypeId: dataItem.breedType,
          noOfAiDone: dataItem.noOfAiDone || "",
          sortedSemenId: dataItem.sortedSemenId || ""
        }]
      }

      // ✅ FIX: Do NOT always add an extra empty row.
      // Only add an empty row if there are no animal details at all.
      if (animalDetails.length === 0) {
        animalDetails.push({ ...initialAnimalDetail })
      }

      setForm1({
        ...dataItem,
        _id: dataItem._id,
        visitDate: dataItem.visitDate?.split("T")[0] || getCurrentDate(),
        animalDetails: animalDetails,
        noOfAnimalsInseminated: dataItem.noOfAnimalsInseminated || "",
        noOfAnimalsVerified: dataItem.noOfAnimalsVerified || "",
        noOfAnimalsPositive: dataItem.noOfAnimalsPositive || "",
        maleCalves: dataItem.maleCalves || "",
        femaleCalves: dataItem.femaleCalves || "",
        totalCalves: dataItem.totalCalves || "",
        correspondingAi: dataItem.correspondingAi || "",
      })

      setShow(false)
      setShow1(true)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } catch (error) {
      console.error("Edit popup error:", error)
      toast.error("Failed to load edit data")
    }
  }

  const FormEditSubmit = e => {
    e.preventDefault()
    UpdateData()
  }

  const UpdateData = () => {
    const missingFields = []
    if (!form1.visitDate) missingFields.push("Visit Date")
    if (!form1.workingPlaceId) missingFields.push("Working Place")

    // Validate animal details
    const validAnimalDetails = form1.animalDetails.filter(detail =>
      detail.animalTypeId && detail.noOfAiDone
    )

    if (validAnimalDetails.length === 0) {
      toast.error("Please fill at least one animal type and number of AI done")
      return
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }

    const token = TokenData
    const dataArray = {
      animalDetails: validAnimalDetails,
      noOfAnimalsInseminated: form1.noOfAnimalsInseminated || "0",
      noOfAnimalsVerified: form1.noOfAnimalsVerified || "0",
      noOfAnimalsPositive: form1.noOfAnimalsPositive || "0",
      maleCalves: form1.maleCalves || "0",
      femaleCalves: form1.femaleCalves || "0",
      totalCalves: form1.totalCalves || "0",
      correspondingAi: form1.correspondingAi || "0",
      visitDate: form1.visitDate,
      workingPlaceId: form1.workingPlaceId,
    }

    axios
      .put(URLS.EditArtificalInsemination + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShow1(false)
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to update record")
        }
      })
  }

  const DeleteData = dataItem => {
    const confirmBox = window.confirm("Do you really want to Delete?")
    if (confirmBox === true) {
      Delete(dataItem)
    }
  }

  const Delete = dataItem => {
    const token = TokenData
    const remid = dataItem._id

    axios
      .delete(URLS.DeleteArtificalInsemination + remid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
  }

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 34,
      height: 34,
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
      height: 34,
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

  const placeOfWorkingOptions = placeOfWorking.map(p => ({
    value: p._id,
    label: p.name,
  }))

  const fetchPlaceOfWorking = useCallback(async () => {
    try {
      const response = await axios.post(
        URLS.GetPlaceOfWorking,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPlaceOfWorking(response.data.data || [])
    } catch (error) {
      toast.error("Failed to load Place Of Working")
    }
  }, [token])

  const fetchAnimalTypes = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetAnimalTypes, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAnimalTypes(response.data.data || [])
    } catch (error) {
      toast.error("Failed to load Animal Types")
    }
  }, [token])

  const fetchSortedSemen = useCallback(async () => {
    try {
      const response = await axios.post(
        URLS.GetAllSortedSemen,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        setSortedSemen(response.data.sortedsemens || [])
      }
    } catch (error) {
      console.error("Failed to load Sex Sorted Semen", error)
    }
  }, [token])

  useEffect(() => {
    Get()
    fetchPlaceOfWorking()
    fetchAnimalTypes()
    fetchSortedSemen()
  }, [fetchPlaceOfWorking, fetchAnimalTypes, fetchSortedSemen])

  const handleSelectChange = (selectedOption, { name }) => {
    setForm(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }))
  }

  const handleSelectChange1 = (selectedOption, { name }) => {
    setForm1(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }))
  }

  const getCurrentPlace = () => {
    return (
      placeOfWorkingOptions.find(opt => opt.value === form.workingPlaceId) ||
      null
    )
  }

  const getCurrentPlace1 = () => {
    return (
      placeOfWorkingOptions.find(opt => opt.value === form1.workingPlaceId) ||
      null
    )
  }

  const getCurrentAnimalTypeForRow = (animalTypeId) => {
    return animalTypeOptions.find(o => o.value === animalTypeId) || null
  }

  const getCurrentSortedSemenForRow = (sortedSemenId) => {
    return sortedSemenOptions.find(o => o.value === sortedSemenId) || null
  }

  // Auto-calculate total when maleCalves or femaleCalves changes
  useEffect(() => {
    const male = parseInt(form.maleCalves) || 0
    const female = parseInt(form.femaleCalves) || 0
    const total = male + female
    setForm(prev => ({ ...prev, totalCalves: total.toString() }))
  }, [form.maleCalves, form.femaleCalves])

  // Auto-calculate total when maleCalves or femaleCalves changes for edit form
  useEffect(() => {
    const male = parseInt(form1.maleCalves) || 0
    const female = parseInt(form1.femaleCalves) || 0
    const total = male + female
    setForm1(prev => ({ ...prev, totalCalves: total.toString() }))
  }, [form1.maleCalves, form1.femaleCalves])

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="VAHD ADMIN"
            breadcrumbItem="Artificial Insemination"
          />
          <Row>
            <Col md={12}>
              {show && (
                <Card className="mb-4">
                  <CardBody>
                    <div style={{ height: "auto" }}>
                      <Form onSubmit={FormAddSubmit}>
                        <h5 className="mb-3">
                          Create Artificial Insemination Record
                        </h5>
                        <div className="form-section">
                          <Row>
                            <Col md={3}>
                              <FormGroup>
                                <Label for="visitDate" className="fw-bold">
                                  Date*
                                </Label>
                                <Input
                                  className="form-control"
                                  size="sm"
                                  type="date"
                                  name="visitDate"
                                  id="visitDate"
                                  value={form.visitDate}
                                  onChange={handleInputChange}
                                  max={new Date().toISOString().split("T")[0]}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <FormGroup>
                                <Label for="workingPlaceId" className="fw-bold">
                                  Place of Working*
                                </Label>
                                <Select
                                  name="workingPlaceId"
                                  value={getCurrentPlace()}
                                  onChange={handleSelectChange}
                                  options={placeOfWorkingOptions}
                                  styles={selectStyles}
                                  placeholder="Select Place"
                                  isSearchable
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <div className="text-center pt-4">
                                <h6 className="text-primary">
                                  <i className="bx bx-user me-2"></i>
                                  User Name: {UserDetails?.name}
                                </h6>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div className="form-section mt-3">
                          <h6 className="section-title text-primary mb-3">
                            <i className="bx bx-dna me-2"></i>
                            Animal AI Details
                          </h6>
                          <hr />
                          {form.animalDetails.map((detail, index) => (
                            <Row key={index} className="mb-3 align-items-center">
                              <Col md={3}>
                                <FormGroup>
                                  <Label className="fw-bold">
                                    Animal Type {index + 1}*
                                  </Label>
                                  <Select
                                    name={`animalTypeId-${index}`}
                                    value={getCurrentAnimalTypeForRow(detail.animalTypeId)}
                                    onChange={(selectedOption) =>
                                      handleAnimalSelectChange(selectedOption, index)
                                    }
                                    options={animalTypeOptions}
                                    styles={selectStyles}
                                    placeholder="Select Animal Type"
                                    isSearchable
                                    required
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label className="fw-bold">
                                    Sex Sorted Semen
                                  </Label>
                                  <Select
                                    name={`sortedSemenId-${index}`}
                                    value={getCurrentSortedSemenForRow(detail.sortedSemenId)}
                                    onChange={(selectedOption) =>
                                      handleSortedSemenChange(selectedOption, index)
                                    }
                                    options={sortedSemenOptions}
                                    styles={selectStyles}
                                    placeholder="Select Semen"
                                    isSearchable
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label className="fw-bold">
                                    No of AI Done {index + 1}*
                                  </Label>
                                  <Input
                                    size="sm"
                                    type="number"
                                    inputMode="decimal"
                                    onWheel={(e) => e.target.blur()}
                                    name={`noOfAiDone-${index}`}
                                    value={detail.noOfAiDone}
                                    onChange={(e) => handleAiDoneChange(e, index)}
                                    min="1"
                                    placeholder="No of AI Done"
                                    required
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={2} className="d-flex align-items-end">
                                {form.animalDetails.length > 1 && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    type="button"
                                    onClick={() => removeAnimalDetail(index)}
                                    className="mt-1"
                                  >
                                    <i className="bx bx-trash"></i>
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                        </div>

                        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                          <Button
                            type="button"
                            onClick={() => setShow(false)}
                            color="secondary"
                          >
                            <i className="bx bx-x me-1"></i>
                            Cancel
                          </Button>
                          <Button type="submit" color="primary">
                            <i className="bx bx-check me-1"></i>
                            Submit
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col md={12}>
              {show1 && (
                <Card className="mb-4">
                  <CardBody>
                    <div style={{ height: "auto" }}>
                      <Form onSubmit={FormEditSubmit}>
                        <h5 className="mb-3">
                          Edit Artificial Insemination Record
                        </h5>
                        <div className="form-section">
                          <Row>
                            <Col md={3}>
                              <FormGroup>
                                <Label for="visitDate" className="fw-bold">
                                  Date*
                                </Label>
                                <Input
                                  size="sm"
                                  type="date"
                                  name="visitDate"
                                  id="visitDate"
                                  value={form1.visitDate}
                                  onChange={handleInputChange1}
                                  max={new Date().toISOString().split("T")[0]}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <FormGroup>
                                <Label for="workingPlaceId" className="fw-bold">
                                  Place of Working*
                                </Label>
                                <Select
                                  name="workingPlaceId"
                                  value={getCurrentPlace1()}
                                  onChange={handleSelectChange1}
                                  options={placeOfWorkingOptions}
                                  styles={selectStyles}
                                  placeholder="Select Place"
                                  isSearchable
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <div className="text-center pt-4">
                                <h6 className="text-primary">
                                  <i className="bx bx-user me-2"></i>
                                  User Name: {UserDetails?.name}
                                </h6>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div className="form-section mt-3">
                          <h6 className="section-title text-primary mb-3">
                            <i className="bx bx-dna me-2"></i>
                            Animal AI Details
                          </h6>
                          <hr />
                          {form1.animalDetails.map((detail, index) => (
                            <Row key={index} className="mb-3 align-items-center">
                              <Col md={3}>
                                <FormGroup>
                                  <Label className="fw-bold">
                                    Animal Type {index + 1}*
                                  </Label>
                                  <Select
                                    name={`animalTypeId-${index}`}
                                    value={getCurrentAnimalTypeForRow(detail.animalTypeId)}
                                    onChange={(selectedOption) =>
                                      handleAnimalSelectChange1(selectedOption, index)
                                    }
                                    options={animalTypeOptions}
                                    styles={selectStyles}
                                    placeholder="Select Animal Type"
                                    isSearchable
                                    required
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={3}>
                                <FormGroup>
                                  <Label className="fw-bold">
                                    Sex Sorted Semen
                                  </Label>
                                  <Select
                                    name={`sortedSemenId-${index}`}
                                    value={getCurrentSortedSemenForRow(detail.sortedSemenId)}
                                    onChange={(selectedOption) =>
                                      handleSortedSemenChange1(selectedOption, index)
                                    }
                                    options={sortedSemenOptions}
                                    styles={selectStyles}
                                    placeholder="Select Semen"
                                    isSearchable
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label className="fw-bold">
                                    No of AI Done {index + 1}*
                                  </Label>
                                  <Input
                                    size="sm"
                                    type="number"
                                    inputMode="decimal"
                                    onWheel={(e) => e.target.blur()}
                                    name={`noOfAiDone-${index}`}
                                    value={detail.noOfAiDone}
                                    onChange={(e) => handleAiDoneChange1(e, index)}
                                    min="1"
                                    placeholder="No of AI Done"
                                    required
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={2} className="d-flex align-items-end">
                                {form1.animalDetails.length > 1 && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    type="button"
                                    onClick={() => removeAnimalDetail1(index)}
                                    className="mt-1"
                                  >
                                    <i className="bx bx-trash"></i>
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                        </div>

                        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                          <Button
                            type="button"
                            onClick={() => setShow1(false)}
                            color="secondary"
                          >
                            <i className="bx bx-x me-1"></i>
                            Cancel
                          </Button>
                          <Button type="submit" color="primary">
                            <i className="bx bx-check me-1"></i>
                            Update
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={6}>
                      {Roles?.AIAdd === true || Roles?.accessAll === true ? (
                        <>
                          <Button
                            color="primary"
                            onClick={AddPopUp}
                          >
                            <i className="bx bx-plus me-1"></i>
                            Create Artificial Insemination Record
                          </Button>{" "}
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-end">
                        <div style={{ maxWidth: "300px" }}>
                          <Input
                            name="search"
                            value={form.search}
                            onChange={SearchData}
                            type="search"
                            placeholder="Search..."
                            className="form-control"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4 table-responsive">
                    <Table hover className="table table-bordered mb-4">
                      <thead>
                        <tr className="text-center">
                          <th>S.No.</th>
                          <th>Date</th>
                          <th>Place Of Working</th>
                          <th>Animal AI Details (Current)</th>
                          <th>Total AI Done</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.length > 0 ? (
                          lists.map((row, key) => {
                            // Calculate total AI done from animalDetails array
                            let totalAiDone = 0
                            let animalDetailsList = []

                            if (row.animalDetails && Array.isArray(row.animalDetails)) {
                              animalDetailsList = row.animalDetails
                              totalAiDone = row.animalDetails.reduce((sum, detail) =>
                                sum + (parseInt(detail.noOfAiDone) || 0), 0
                              )
                            } else {
                              // Fallback for old data structure
                              animalDetailsList = [{
                                animalTypeName: row.animalTypeName || row.breedType,
                                noOfAiDone: row.noOfAiDone,
                                sortedSemenId: row.sortedSemenId,
                                sortedSemenName: row.sortedsemenName
                              }]
                              totalAiDone = parseInt(row.noOfAiDone) || 0
                            }

                            return (
                              <tr key={key} className="text-center">
                                <td>{pagesVisited + key + 1}</td>
                                <td>{row.visitDate}</td>
                                <td>{row.workingPlaceName}</td>
                                <td className="text-start">
                                  {animalDetailsList.map((detail, idx) => (
                                    <div key={idx} className="mb-1">
                                      <strong>Type {idx + 1}:</strong> {detail.animalTypeName || "N/A"}
                                      <br />
                                      <strong>AI Done {idx + 1}:</strong> {detail.noOfAiDone || "0"}
                                      <br />
                                      <strong>Sorted Semen:</strong> {
                                        detail.sortedSemenName ||
                                        (sortedSemenOptions.find(o => o.value === detail.sortedSemenId)?.label || "-")
                                      }
                                      {idx < animalDetailsList.length - 1 && <hr className="my-1" />}
                                    </div>
                                  ))}
                                </td>
                                <td className="fw-bold">{totalAiDone}</td>
                                <td>
                                  <div className="btn-group" role="group">
                                    {Roles?.AIEdit === true ||
                                      Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          onClick={() => UpdatePopUp(row)}
                                          size="sm"
                                          color="primary"
                                          className="me-1"
                                          title="Edit"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {Roles?.AIDelete === true ||
                                      Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          size="sm"
                                          color="danger"
                                          onClick={() => DeleteData(row)}
                                          title="Delete"
                                        >
                                          <i className="bx bx-trash"></i>
                                        </Button>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <div className="text-muted">
                                <i className="bx bx-inbox display-4"></i>
                                <p className="mt-2 mb-0">
                                  No artificial insemination records found
                                </p>
                                {form.search && (
                                  <small>
                                    No results found for "{form.search}".
                                    <Button
                                      color="link"
                                      size="sm"
                                      onClick={() => {
                                        setForm(prev => ({ ...prev, search: "" }))
                                        Get()
                                      }}
                                      className="p-0 ms-1"
                                    >
                                      Clear search
                                    </Button>
                                  </small>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  {data.length > listPerPage && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">
                        Showing {lists.length} of {data.length} records
                      </div>
                      <ReactPaginate
                        previousLabel={<i className="bx bx-chevron-left"></i>}
                        nextLabel={<i className="bx bx-chevron-right"></i>}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={"pagination pagination-sm mb-0"}
                        previousLinkClassName={"page-link"}
                        nextLinkClassName={"page-link"}
                        disabledClassName={"disabled"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </div>
    </React.Fragment >
  )
}

export default ArtificalInsemination



