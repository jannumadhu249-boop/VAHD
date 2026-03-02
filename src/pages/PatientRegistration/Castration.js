// import React, { useEffect, useState, useCallback } from "react"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer, toast } from "react-toastify"
// import ReactPaginate from "react-paginate"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import axios from "axios"
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

// function debounce(func, wait) {
//   let timeout
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout)
//       func(...args)
//     }
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//   }
// }

// const CaseTreated = () => {
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = JSON.parse(GetAuth)
//   const TokenData = TokenJson?.token
//   const UserDetails = TokenJson?.user
//   const token = TokenData
//   const [show, setShow] = useState(false)
//   const [show1, setShow1] = useState(false)
//   const [show3, setShow3] = useState(true)
//   const [data, setData] = useState([])
//   const [animalTypes, setAnimalTypes] = useState([])
//   const [Gampanchayath, setGampanchayath] = useState([])
//   const [breed, setBreed] = useState([])
//   const [placeOfWorking, setPlaceOfWorking] = useState([])

//   const [listPerPage] = useState(10)
//   const [pageNumber, setPageNumber] = useState(0)

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

//   const genderOptions = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//   ]

//   const casteOptions = [
//     { value: "General", label: "General" },
//     { value: "BC-A", label: "BC-A" },
//     { value: "BC-B", label: "BC-B" },
//     { value: "BC-C", label: "BC-C" },
//     { value: "BC-D", label: "BC-D" },
//     { value: "BC-E", label: "BC-E" },
//     { value: "SC", label: "SC" },
//     { value: "ST", label: "ST" },
//   ]

//   const getCurrentDate = () => {
//     const now = new Date()
//     const year = now.getFullYear()
//     const month = String(now.getMonth() + 1).padStart(2, "0")
//     const day = String(now.getDate()).padStart(2, "0")
//     return `${year}-${month}-${day}`
//   }

//   const initialFormState = {
//     visitDate: getCurrentDate(),
//     animalTypeId: "",
//     breedId: "",
//     gender: "",
//     ageYears: "",
//     ageMonths: "",
//     noOfUnits: "",
//     diagnostics: "Castration",
//     remarks: "",
//     ownerName: "",
//     ownerMobile: "",
//     workingPlaceId: "",
//     formType: "castration",
//     caste: "",
//     aadharNo: "",
//     Village: "",
//     search: "",
//   }

//   const [form, setForm] = useState(initialFormState)
//   const [form1, setForm1] = useState(initialFormState)

//   const animalTypeOptions = animalTypes.map(type => ({
//     value: type._id,
//     label: type.name,
//   }))

//   const villageOptions = Gampanchayath.map(g => ({
//     value: g.Village,
//     label: g.Village,
//   }))

//   const breedOptions = breed.map(b => ({
//     value: b._id,
//     label: b.name,
//   }))

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

//   const getCaseTreated = useCallback(async () => {
//     try {
//       const response = await axios.post(
//         URLS.GetCaseTreated,
//         { formType: "castration" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       setData(response.data.data || [])
//     } catch (error) {
//       console.error("Error fetching CaseTreated:", error)
//       toast.error("Failed to load castration data")
//     }
//   }, [token])

//   const getAnimalTypes = useCallback(async () => {
//     try {
//       const response = await axios.get(URLS.GetAnimalTypes, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setAnimalTypes(response.data.data || [])
//     } catch (error) {
//       console.error("Error fetching Animal Types:", error)
//       toast.error("Failed to load Animal Types")
//     }
//   }, [token])

//   const GetGrampanchayath = useCallback(async () => {
//     try {
//       const response = await axios.get(URLS.GetGrampanchayath, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setGampanchayath(response.data.data || [])
//     } catch (error) {
//       console.error("Error fetching Grampanchayath:", error)
//       toast.error("Failed to load Grampanchayath")
//     }
//   }, [token])

//   const getOneBreeds = useCallback(
//     async animalTypeId => {
//       if (!animalTypeId) {
//         setBreed([])
//         return
//       }
//       try {
//         const response = await axios.get(URLS.GetOneBreeds + animalTypeId, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         setBreed(response.data.data || [])
//       } catch (error) {
//         console.log("Failed to load Breed details")
//         setBreed([])
//         toast.error("Failed to load breeds")
//       }
//     },
//     [token]
//   )

//   useEffect(() => {
//     fetchPlaceOfWorking()
//     getCaseTreated()
//     getAnimalTypes()
//     GetGrampanchayath()
//   }, [fetchPlaceOfWorking, getCaseTreated, getAnimalTypes, GetGrampanchayath])

//   const searchData = useCallback(
//     async value => {
//       if (value.trim() === "") {
//         getCaseTreated()
//         return
//       }

//       try {
//         const response = await axios.post(
//           `${URLS.GetCaseTreatedSearch}${value}`,
//           { formType: "castration" },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         if (response.status === 200) {
//           setData(response.data.data || [])
//           setPageNumber(0)
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 400) {
//           toast.error(error.response.data.message)
//         }
//       }
//     },
//     [token, getCaseTreated]
//   )

//   const handleSearchChange = e => {
//     const value = e.target.value
//     setForm(prev => ({ ...prev, search: value }))

//     const timeoutId = setTimeout(() => {
//       searchData(value)
//     }, 500)

//     return () => clearTimeout(timeoutId)
//   }

//   const [selectedVillage, setSelectedVillage] = useState(null)
//   const [selectedVillageEdit, setSelectedVillageEdit] = useState(null)
//   const [inputValue, setInputValue] = useState("")
//   const [inputValueEdit, setInputValueEdit] = useState("")

//   const debouncedSearch = useCallback(
//     debounce(searchValue => {
//       if (searchValue.trim()) {
//         SearchGampanchayath(searchValue)
//       } else {
//         GetGrampanchayath()
//       }
//     }, 500),
//     [token]
//   )

//   const SearchGampanchayath = async searchValue => {
//     try {
//       const response = await axios.get(
//         `${URLS.GetGrampanchayathSearch}${searchValue}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       if (response.status === 200) {
//         setGampanchayath(response.data.data || [])
//       }
//     } catch (error) {
//       if (error.response?.status === 400) {
//         toast.error(error.response.data.message)
//       }
//       setGampanchayath([])
//     }
//   }

//   const handleVillageSearch = inputValue => {
//     setInputValue(inputValue)
//     debouncedSearch(inputValue)
//   }

//   const handleVillageSearchEdit = inputValue => {
//     setInputValueEdit(inputValue)
//     debouncedSearch(inputValue)
//   }

//   const pagesVisited = pageNumber * listPerPage
//   const lists = data.slice(pagesVisited, pagesVisited + listPerPage)
//   const pageCount = Math.ceil(data.length / listPerPage)

//   const changePage = ({ selected }) => {
//     setPageNumber(selected)
//   }

//   const addPopUp = () => {
//     setShow(true)
//     setShow1(false)
//     setShow3(false)
//     setForm({
//       ...initialFormState,
//       visitDate: getCurrentDate(),
//     })
//     setSelectedVillage(null)
//     setInputValue("")
//     GetGrampanchayath()

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     })
//   }

//   const handleSelectChange = (selectedOption, { name }) => {
//     setForm(prev => ({
//       ...prev,
//       [name]: selectedOption ? selectedOption.value : "",
//     }))

//     if (name === "animalTypeId" && selectedOption) {
//       getOneBreeds(selectedOption.value)
//       setForm(prev => ({ ...prev, breedId: "" }))
//     }

//     if (name === "Village") {
//       setSelectedVillage(selectedOption)
//     }
//   }

//   const handleInputChange = e => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   const formAddSubmit = e => {
//     e.preventDefault()
//     addData()
//   }

//   const addData = async () => {
//     const missingFields = []
//     if (!form.animalTypeId) missingFields.push("Animal Type")
//     if (!form.noOfUnits) missingFields.push("Number of Units")
//     if (!form.visitDate) missingFields.push("Visit Date")
//     if (!form.workingPlaceId) missingFields.push("Working Place")

//     if (missingFields.length > 0) {
//       toast.error(`Please fill: ${missingFields.join(", ")}`)
//       return
//     }

//     const dataArray = {
//       visitDate: form.visitDate,
//       animalTypeId: form.animalTypeId,
//       breedId: form.breedId,
//       gender: form.gender,
//       ageYears: form.ageYears || "0",
//       ageMonths: form.ageMonths || "0",
//       noOfUnits: form.noOfUnits || "0",
//       diagnostics: form.diagnostics,
//       remarks: form.remarks,
//       ownerName: form.ownerName,
//       ownerMobile: form.ownerMobile,
//       workingPlaceId: form.workingPlaceId,
//       addedByEmp: UserDetails?._id,
//       formType: "castration",
//       caste: form.caste,
//       aadharNo: form.aadharNo,
//       Village: form.Village,
//     }
//     try {
//       const response = await axios.post(URLS.AddCaseTreated, dataArray, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.status === 200) {
//         toast.success(response.data.message)
//         setShow(false)
//         setShow3(true)
//         setForm(initialFormState)
//         setSelectedVillage(null)
//         setInputValue("")
//         getCaseTreated()
//         GetGrampanchayath()
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         toast.error(error.response.data.message)
//       } else {
//         toast.error("Failed to add castration")
//       }
//     }
//   }

//   const handleSelectChange1 = (selectedOption, { name }) => {
//     setForm1(prev => ({
//       ...prev,
//       [name]: selectedOption ? selectedOption.value : "",
//     }))

//     if (name === "animalTypeId" && selectedOption) {
//       getOneBreeds(selectedOption.value)
//     }

//     if (name === "Village") {
//       setSelectedVillageEdit(selectedOption)
//     }
//   }

//   const handleInputChange1 = e => {
//     const { name, value } = e.target
//     setForm1(prev => ({ ...prev, [name]: value }))
//   }

//   const updatePopUp = async data => {
//     try {
//       setShow(false)
//       setShow1(true)
//       setShow3(false)
//       window.scrollTo({ top: 0, behavior: "smooth" })

//       setBreed([])

//       let loadedBreeds = []

//       if (data.animalTypeId) {
//         const response = await axios.get(
//           URLS.GetOneBreeds + data.animalTypeId,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         loadedBreeds = response.data.data || []
//         setBreed(loadedBreeds)
//       }

//       const freshBreedOptions = loadedBreeds.map(b => ({
//         value: b._id,
//         label: b.name,
//       }))

//       const selectedBreedOption =
//         freshBreedOptions.find(opt => opt.value === data.breedId) || null

//       const animalTypeOption =
//         animalTypeOptions.find(o => o.value === data.animalTypeId) || null
//       const placeOption =
//         placeOfWorkingOptions.find(o => o.value === data.workingPlaceId) || null
//       const villageOption =
//         villageOptions.find(o => o.value === data.Village) || null
//       const genderOption =
//         genderOptions.find(o => o.value === data.gender) || null
//       const casteOption = casteOptions.find(o => o.value === data.caste) || null

//       setForm1({
//         ...data,
//         visitDate: data.visitDate?.split("T")[0] || getCurrentDate(),
//         animalTypeId: animalTypeOption,
//         breedId: selectedBreedOption,
//         workingPlaceId: placeOption,
//         gender: genderOption,
//         caste: casteOption,
//         Village: villageOption,
//       })

//       setSelectedVillageEdit(villageOption)
//       setInputValueEdit(data.Village || "")

//       GetGrampanchayath()
//     } catch (error) {
//       console.error("Edit popup error:", error)
//       toast.error("Failed to load edit data")
//     }
//   }

//   const getCurrentBreed1 = () => {
//     return form1.breedId && typeof form1.breedId === "object"
//       ? form1.breedId
//       : breedOptions.find(opt => opt.value === form1.breedId) || null
//   }

//   const getCurrentAnimalType1 = () => {
//     if (typeof form1.animalTypeId === "object") {
//       return form1.animalTypeId
//     }
//     return animalTypeOptions.find(o => o.value === form1.animalTypeId) || null
//   }

//   const getCurrentPlace1 = () => {
//     if (typeof form1.workingPlaceId === "object") {
//       return form1.workingPlaceId
//     }
//     return (
//       placeOfWorkingOptions.find(o => o.value === form1.workingPlaceId) || null
//     )
//   }

//   const formEditSubmit = e => {
//     e.preventDefault()
//     updateData()
//   }

//   const updateData = async () => {
//     const missingFields = []
//     if (!form1.animalTypeId) missingFields.push("Animal Type")
//     if (!form1.noOfUnits) missingFields.push("Number of Units")
//     if (!form1.visitDate) missingFields.push("Visit Date")
//     if (!form1.workingPlaceId) missingFields.push("Working Place")

//     if (missingFields.length > 0) {
//       toast.error(`Please fill: ${missingFields.join(", ")}`)
//       return
//     }

//     // Safe value extraction with null checks
//     const getSafeValue = (field, defaultValue = "") => {
//       if (!field) return defaultValue
//       if (typeof field === "object" && field !== null) {
//         return field.value || defaultValue
//       }
//       return field || defaultValue
//     }

//     const dataArray = {
//       visitDate: form1.visitDate,
//       animalTypeId: getSafeValue(form1.animalTypeId),
//       breedId: getSafeValue(form1.breedId),
//       gender: getSafeValue(form1.gender),
//       ageYears: form1.ageYears || "0",
//       ageMonths: form1.ageMonths || "0",
//       noOfUnits: form1.noOfUnits || "0",
//       diagnostics: form1.diagnostics,
//       remarks: form1.remarks,
//       ownerName: form1.ownerName,
//       ownerMobile: form1.ownerMobile,
//       workingPlaceId: getSafeValue(form1.workingPlaceId),
//       addedByEmp: UserDetails?._id,
//       formType: "castration",
//       caste: getSafeValue(form1.caste),
//       aadharNo: form1.aadharNo,
//       Village: getSafeValue(form1.Village),
//     }

//     try {
//       const response = await axios.put(
//         URLS.EditCaseTreated + form1._id,
//         dataArray,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       if (response.status === 200) {
//         toast.success(response.data.message)
//         setShow1(false)
//         setShow3(true)
//         setSelectedVillageEdit(null)
//         setInputValueEdit("")
//         getCaseTreated()
//         GetGrampanchayath()
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         toast.error(error.response.data.message)
//       } else {
//         toast.error("Failed to update castration")
//       }
//     }
//   }

//   const deleteData = data => {
//     const confirmBox = window.confirm("Do you really want to delete this case?")
//     if (confirmBox === true) {
//       deleteCase(data)
//     }
//   }

//   const deleteCase = async data => {
//     const caseId = data._id

//     try {
//       const response = await axios.delete(URLS.DeleteCaseTreated + caseId, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.status === 200) {
//         toast.success(response.data.message)
//         getCaseTreated()
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         toast.error(error.response.data.message)
//       } else {
//         toast.error("Failed to delete castration")
//       }
//     }
//   }

//   const cancelForm = () => {
//     setShow(false)
//     setShow1(false)
//     setShow3(true)
//     setForm(initialFormState)
//     setForm1(initialFormState)
//     setSelectedVillage(null)
//     setSelectedVillageEdit(null)
//     setInputValue("")
//     setInputValueEdit("")
//     GetGrampanchayath()
//   }

//   const getCurrentAnimalType = () => {
//     return (
//       animalTypeOptions.find(opt => opt.value === form.animalTypeId) || null
//     )
//   }

//   const getCurrentVillage = () => {
//     return selectedVillage
//   }

//   const getCurrentBreed = () => {
//     return breedOptions.find(opt => opt.value === form.breedId) || null
//   }

//   const getCurrentPlace = () => {
//     return (
//       placeOfWorkingOptions.find(opt => opt.value === form.workingPlaceId) ||
//       null
//     )
//   }

//   const getCurrentGender = () => {
//     return genderOptions.find(opt => opt.value === form.gender) || null
//   }

//   const getCurrentCaste = () => {
//     return casteOptions.find(opt => opt.value === form.caste) || null
//   }

//   const getCurrentVillage1 = () => {
//     return selectedVillageEdit
//   }

//   const getCurrentGender1 = () => {
//     if (typeof form1.gender === "object") {
//       return form1.gender
//     }
//     return genderOptions.find(opt => opt.value === form1.gender) || null
//   }

//   const getCurrentCaste1 = () => {
//     if (typeof form1.caste === "object") {
//       return form1.caste
//     }
//     return casteOptions.find(opt => opt.value === form1.caste) || null
//   }

//   var gets = localStorage.getItem("authUser")
//   var datas = JSON.parse(gets)
//   var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <div className="container-fluid">
//           <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Castration" />

//           <Row>
//             <Col md={12}>
//               {show && (
//                 <Card className="mb-4">
//                   <CardBody>
//                     <Form onSubmit={formAddSubmit}>
//                       <div className="form-section">
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="visitDate" className="fw-bold">
//                                 Date*
//                               </Label>
//                               <Input
//                                 className="form-control"
//                                 size="sm"
//                                 type="date"
//                                 name="visitDate"
//                                 id="visitDate"
//                                 value={form.visitDate}
//                                 onChange={handleInputChange}
//                                 max={new Date().toISOString().split("T")[0]}
//                                 required
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={4}>
//                             <FormGroup>
//                               <Label for="workingPlaceId" className="fw-bold">
//                                 Place of Working*
//                               </Label>
//                               <Select
//                                 name="workingPlaceId"
//                                 value={getCurrentPlace()}
//                                 onChange={handleSelectChange}
//                                 options={placeOfWorkingOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Place"
//                                 isSearchable
//                                 required
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={4}>
//                             <div className="text-center pt-4">
//                               <h6 className="text-primary">
//                                 <i className="bx bx-user me-2"></i>
//                                 User Name: {UserDetails?.name}
//                               </h6>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>
//                       <div className="form-section mt-2">
//                         <h6 className="section-title text-primary mb-3">
//                           <i className="bx bx-dna me-2"></i>
//                           Animal Details
//                         </h6>
//                         <hr></hr>
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="animalTypeId" className="fw-bold">
//                                 Animal Type*
//                               </Label>
//                               <Select
//                                 name="animalTypeId"
//                                 value={getCurrentAnimalType()}
//                                 onChange={handleSelectChange}
//                                 options={animalTypeOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Animal Type"
//                                 isSearchable
//                                 required
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="breedId">Breed</Label>
//                               <Select
//                                 name="breedId"
//                                 value={getCurrentBreed()}
//                                 onChange={handleSelectChange}
//                                 options={breedOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Breed"
//                                 isSearchable
//                                 isDisabled={!form.animalTypeId}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="gender">Gender</Label>
//                               <Select
//                                 name="gender"
//                                 value={getCurrentGender()}
//                                 onChange={handleSelectChange}
//                                 options={genderOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Gender"
//                                 isSearchable
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="ageYears">Age (Years)</Label>
//                               <Input
//                                 size="sm"
//                                 type="number"
//                             inputMode="decimal"
//                             onWheel={(e) => e.target.blur()}
//                                 name="ageYears"
//                                 id="ageYears"
//                                 value={form.ageYears}
//                                 onChange={handleInputChange}
//                                 min="0"
//                                 max="50"
//                                 placeholder="Enter Age (Years)"
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="ageMonths">Months</Label>
//                               <Input
//                                 size="sm"
//                                 type="number"
//                             inputMode="decimal"
//                             onWheel={(e) => e.target.blur()}
//                                 name="ageMonths"
//                                 id="ageMonths"
//                                 value={form.ageMonths}
//                                 onChange={handleInputChange}
//                                 min="0"
//                                 max="11"
//                                 placeholder="Enter Months"
//                               />
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="noOfUnits">No of Units *</Label>
//                               <Input
//                                 size="sm"
//                                 type="number"
//                             inputMode="decimal"
//                             onWheel={(e) => e.target.blur()}
//                                 name="noOfUnits"
//                                 id="noOfUnits"
//                                 value={form.noOfUnits}
//                                 onChange={handleInputChange}
//                                 min="1"
//                                 placeholder="No of Units"
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="diagnostics">Diagnostics</Label>
//                               <Input
//                                 size="sm"
//                                 type="text"
//                                 name="diagnostics"
//                                 id="diagnostics"
//                                 value={form.diagnostics}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter Diagnostics"
//                                 required
//                                 disabled
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={6}>
//                             <FormGroup>
//                               <Label for="remarks">Remarks</Label>
//                               <textarea
//                                 size="sm"
//                                 type="text"
//                                 name="remarks"
//                                 id="remarks"
//                                 rows={1}
//                                 value={form.remarks}
//                                 className="form-control"
//                                 onChange={handleInputChange}
//                                 placeholder="Enter any additional remarks"
//                               />
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                       </div>
//                       <div className="form-section mt-2">
//                         <h6 className="section-title text-primary mb-3">
//                           <i className="bx bx-user me-2"></i>
//                           Owner Details
//                         </h6>
//                         <hr></hr>
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="ownerName" className="fw-bold">
//                                 Owner Name
//                               </Label>
//                               <Input
//                                 size="sm"
//                                 type="text"
//                                 name="ownerName"
//                                 id="ownerName"
//                                 value={form.ownerName}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter owner's full name"
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="ownerMobile" className="fw-bold">
//                                 Mobile No
//                               </Label>
//                               <Input
//                                 size="sm"
//                                 type="tel"
//                                 name="ownerMobile"
//                                 id="ownerMobile"
//                                 value={form.ownerMobile}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter Mobile No"
//                                 maxLength="10"
//                                 minLength="10"
//                                 pattern="[0-9]{10}"
//                                 onKeyPress={e => {
//                                   const charCode = e.which ? e.which : e.keyCode
//                                   if (charCode < 48 || charCode > 57) {
//                                     e.preventDefault()
//                                   }
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="caste">Caste</Label>
//                               <Select
//                                 name="caste"
//                                 value={getCurrentCaste()}
//                                 onChange={handleSelectChange}
//                                 options={casteOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Caste"
//                                 isSearchable
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="aadharNo">Aadhar Card Number</Label>
//                               <Input
//                                 size="sm"
//                                 type="text"
//                                 name="aadharNo"
//                                 value={form.aadharNo}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter 12-digit Aadhar"
//                                 className="form-control"
//                                 maxLength="12"
//                                 minLength="12"
//                                 pattern="[0-9]{12}"
//                                 onKeyPress={e => {
//                                   const charCode = e.which ? e.which : e.keyCode
//                                   if (charCode < 48 || charCode > 57) {
//                                     e.preventDefault()
//                                   }
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="Village">Village</Label>
//                               <Select
//                                 name="Village"
//                                 value={getCurrentVillage()}
//                                 inputValue={inputValue}
//                                 onChange={handleSelectChange}
//                                 onInputChange={handleVillageSearch}
//                                 options={villageOptions}
//                                 styles={selectStyles}
//                                 placeholder="Search and select village..."
//                                 isSearchable
//                                 filterOption={() => true}
//                                 noOptionsMessage={() =>
//                                   inputValue
//                                     ? "No villages found"
//                                     : "Type to search villages..."
//                                 }
//                                 loadingMessage={() => "Searching..."}
//                                 isClearable
//                               />
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                       </div>
//                       <div className="d-flex justify-content-between mt-2 pt-1 border-top">
//                         <Button
//                           color="secondary"
//                           onClick={cancelForm}
//                           type="button"
//                         >
//                           <i className="bx bx-x me-1"></i>
//                           Cancel
//                         </Button>
//                         <Button color="primary" type="submit">
//                           <i className="bx bx-check me-1"></i>
//                           Submit
//                         </Button>
//                       </div>
//                     </Form>
//                   </CardBody>
//                 </Card>
//               )}
//             </Col>
//           </Row>

//           {/* Edit Form with React Select */}
//           <Row>
//             <Col md={12}>
//               {show1 && (
//                 <Card className="mb-4">
//                   <CardBody>
//                     <Form onSubmit={formEditSubmit}>
//                       <div className="form-section">
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="visitDate" className="fw-bold">
//                                 Date*
//                               </Label>
//                               <Input
//                                 size="sm"
//                                 type="date"
//                                 name="visitDate"
//                                 id="visitDate"
//                                 value={form1.visitDate}
//                                 onChange={handleInputChange1}
//                                 max={new Date().toISOString().split("T")[0]}
//                                 required
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={4}>
//                             <FormGroup>
//                               <Label for="workingPlaceId" className="fw-bold">
//                                 Place of Working*
//                               </Label>
//                               <Select
//                                 name="workingPlaceId"
//                                 value={getCurrentPlace1()}
//                                 onChange={handleSelectChange1}
//                                 options={placeOfWorkingOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Place"
//                                 isSearchable
//                                 required
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={4}>
//                             <div className="text-center pt-4">
//                               <h6 className="text-primary">
//                                 <i className="bx bx-user me-2"></i>
//                                 User Name: {UserDetails?.name}
//                               </h6>
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>
//                       <div className="form-section mt-2">
//                         <h6 className="section-title text-primary mb-3">
//                           <i className="bx bx-dna me-2"></i>
//                           Animal Details
//                         </h6>
//                         <hr></hr>
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="animalTypeId" className="fw-bold">
//                                 Animal Type*
//                               </Label>
//                               <Select
//                                 name="animalTypeId"
//                                 value={getCurrentAnimalType1()}
//                                 onChange={handleSelectChange1}
//                                 options={animalTypeOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Animal Type"
//                                 isSearchable
//                                 required
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="breedId">Breed</Label>
//                               <Select
//                                 name="breedId"
//                                 value={getCurrentBreed1()}
//                                 onChange={handleSelectChange1}
//                                 options={breedOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Breed"
//                                 isSearchable
//                                 isDisabled={!form1.animalTypeId}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="gender">Gender</Label>
//                               <Select
//                                 name="gender"
//                                 value={getCurrentGender1()}
//                                 onChange={handleSelectChange1}
//                                 options={genderOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Gender"
//                                 isSearchable
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="ageYears">Age (Years)</Label>
//                               <Input
//                                 size="sm"
//                                 type="number"
//                             inputMode="decimal"
//                             onWheel={(e) => e.target.blur()}
//                                 name="ageYears"
//                                 id="ageYears"
//                                 value={form1.ageYears}
//                                 onChange={handleInputChange1}
//                                 min="0"
//                                 max="50"
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="ageMonths">Months</Label>
//                               <Input
//                                 size="sm"
//                                 type="number"
//                             inputMode="decimal"
//                             onWheel={(e) => e.target.blur()}
//                                 name="ageMonths"
//                                 id="ageMonths"
//                                 value={form1.ageMonths}
//                                 onChange={handleInputChange1}
//                                 min="0"
//                                 max="11"
//                               />
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="noOfUnits">No of Units *</Label>
//                               <Input
//                                 size="sm"
//                                 type="number"
//                             inputMode="decimal"
//                             onWheel={(e) => e.target.blur()}
//                                 name="noOfUnits"
//                                 id="noOfUnits"
//                                 value={form1.noOfUnits}
//                                 onChange={handleInputChange1}
//                                 min="1"
//                                 placeholder="No of Units"
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="diagnostics">Diagnostics</Label>
//                               <Input
//                                 size="sm"
//                                 type="text"
//                                 name="diagnostics"
//                                 id="diagnostics"
//                                 value={form1.diagnostics}
//                                 onChange={handleInputChange1}
//                                 placeholder="Enter Diagnostics"
//                                 required
//                                 disabled
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={6}>
//                             <FormGroup>
//                               <Label for="remarks">Remarks</Label>
//                               <Input
//                                 size="sm"
//                                 type="text"
//                                 name="remarks"
//                                 id="remarks"
//                                 value={form1.remarks}
//                                 onChange={handleInputChange1}
//                                 placeholder="Enter any additional remarks"
//                               />
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                       </div>
//                       <div className="form-section mt-2">
//                         <h6 className="section-title text-primary mb-3">
//                           <i className="bx bx-user me-2"></i>
//                           Owner Details
//                         </h6>
//                         <hr></hr>
//                         <Row>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="ownerName" className="fw-bold">
//                                 Owner Name
//                               </Label>
//                               <Input
//                                 size="sm"
//                                 type="text"
//                                 name="ownerName"
//                                 id="ownerName"
//                                 value={form1.ownerName}
//                                 onChange={handleInputChange1}
//                                 placeholder="Enter owner's full name"
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="ownerMobile" className="fw-bold">
//                                 Mobile No
//                               </Label>
//                               <Input
//                                 size="sm"
//                                 type="tel"
//                                 name="ownerMobile"
//                                 id="ownerMobile"
//                                 value={form1.ownerMobile}
//                                 onChange={handleInputChange1}
//                                 placeholder="Enter 10-digit mobile number"
//                                 maxLength="10"
//                                 minLength="10"
//                                 pattern="[0-9]{10}"
//                                 onKeyPress={e => {
//                                   const charCode = e.which ? e.which : e.keyCode
//                                   if (charCode < 48 || charCode > 57) {
//                                     e.preventDefault()
//                                   }
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="caste">Caste</Label>
//                               <Select
//                                 name="caste"
//                                 value={getCurrentCaste1()}
//                                 onChange={handleSelectChange1}
//                                 options={casteOptions}
//                                 styles={selectStyles}
//                                 placeholder="Select Caste"
//                                 isSearchable
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={2}>
//                             <FormGroup>
//                               <Label for="aadharNo">Aadhar Card Number</Label>
//                               <Input
//                                 size="sm"
//                                 type="text"
//                                 name="aadharNo"
//                                 value={form1.aadharNo}
//                                 onChange={handleInputChange1}
//                                 placeholder="Enter 12-digit Aadhar"
//                                 className="form-control"
//                                 maxLength="12"
//                                 minLength="12"
//                                 pattern="[0-9]{12}"
//                                 onKeyPress={e => {
//                                   const charCode = e.which ? e.which : e.keyCode
//                                   if (charCode < 48 || charCode > 57) {
//                                     e.preventDefault()
//                                   }
//                                 }}
//                               />
//                             </FormGroup>
//                           </Col>
//                           <Col md={3}>
//                             <FormGroup>
//                               <Label for="Village">Village</Label>
//                               <Select
//                                 name="Village"
//                                 value={getCurrentVillage1()}
//                                 inputValue={inputValueEdit}
//                                 onChange={handleSelectChange1}
//                                 onInputChange={handleVillageSearchEdit}
//                                 options={villageOptions}
//                                 styles={selectStyles}
//                                 placeholder="Search and select village..."
//                                 isSearchable
//                                 filterOption={() => true}
//                                 noOptionsMessage={() =>
//                                   inputValueEdit
//                                     ? "No villages found"
//                                     : "Type to search villages..."
//                                 }
//                                 loadingMessage={() => "Searching..."}
//                                 isClearable
//                               />
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                       </div>
//                       <div className="d-flex justify-content-between mt-2 pt-1 border-top">
//                         <Button
//                           color="secondary"
//                           onClick={cancelForm}
//                           type="button"
//                         >
//                           <i className="bx bx-x me-1"></i>
//                           Cancel
//                         </Button>
//                         <Button color="primary" type="submit">
//                           <i className="bx bx-check me-1"></i>
//                           Update
//                         </Button>
//                       </div>
//                     </Form>
//                   </CardBody>
//                 </Card>
//               )}
//             </Col>
//           </Row>

//           {/* Data Table View */}
//           <Row>
//             <Col md={12}>
//               {show3 && (
//                 <Card>
//                   <CardBody>
//                     <Row className="mb-3">
//                       <Col md={6}>
//                         {Roles?.CastrationAdd === true ||
//                         Roles?.accessAll === true ? (
//                           <>
//                             <Button color="primary" onClick={addPopUp}>
//                               <i className="bx bx-plus me-1"></i>
//                               Create Castration
//                             </Button>
//                           </>
//                         ) : (
//                           ""
//                         )}
//                       </Col>
//                       <Col md={6}>
//                         <div className="d-flex justify-content-end">
//                           <div style={{ maxWidth: "300px" }}>
//                             <Input
//                               name="search"
//                               value={form.search}
//                               onChange={handleSearchChange}
//                               type="search"
//                               placeholder="Search by owner name or mobile..."
//                               className="form-control"
//                             />
//                           </div>
//                         </div>
//                       </Col>
//                     </Row>
//                     <div className="table-rep-plugin mt-4 table-responsive">
//                       <Table hover className="table table-bordered mb-4 ">
//                         <thead>
//                           <tr>
//                             <th className="text-center"> S.No </th>
//                             <th>Owner Details</th>
//                             <th>Animal Details</th>
//                             <th>Visit Details</th>
//                             <th>Diagnostics & Remarks</th>
//                             <th className="text-center">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {lists.length > 0 ? (
//                             lists.map((data, index) => (
//                               <tr key={data._id}>
//                                 <td className="text-center fw-bold">
//                                   {pagesVisited + index + 1}
//                                 </td>
//                                 <td>
//                                   <div>
//                                     <strong className="text-primary">
//                                       {data.ownerName}
//                                     </strong>
//                                     <br />
//                                     <small className="text-muted">
//                                       <i className="bx bx-phone me-1"></i>
//                                       {data.ownerMobile}
//                                     </small>
//                                     {data.Village && (
//                                       <>
//                                         <br />
//                                         <small className="text-info">
//                                           <i className="bx bx-map me-1"></i>
//                                           {data.Village}
//                                         </small>
//                                       </>
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td>
//                                   <div>
//                                     <strong>Type:</strong>
//                                     {data.animalTypeName || "N/A"}
//                                     <br />
//                                     <strong>Breed:</strong>
//                                     {data.breedName || "N/A"}
//                                     <br />
//                                     <strong>Gender:</strong>
//                                     {data.gender || "N/A"}
//                                     <br />
//                                     <strong>Age:</strong> {data.ageYears || "0"}
//                                     y {data.ageMonths || "0"}m
//                                     <br />
//                                     <strong>Units:</strong>
//                                     {data.noOfUnits || "0"}
//                                   </div>
//                                 </td>
//                                 <td>
//                                   <div>
//                                     <strong>Date:</strong> {data.visitDate}
//                                     <br />
//                                     <strong>Place:</strong>
//                                     {data.placeOfWorkingName || "N/A"}
//                                   </div>
//                                 </td>
//                                 <td>
//                                   <div>
//                                     <strong>Diagnostics:</strong>
//                                     {data.diagnostics || "N/A"}
//                                     <br />
//                                     <strong>Remarks:</strong>
//                                     {data.remarks || "N/A"}
//                                   </div>
//                                 </td>
//                                 <td className="text-center">
//                                   <div className="btn-group" role="group">
//                                     {Roles?.CastrationEdit === true ||
//                                     Roles?.accessAll === true ? (
//                                       <>
//                                         <Button
//                                           onClick={() => updatePopUp(data)}
//                                           size="sm"
//                                           color="primary"
//                                           className="me-1"
//                                           title="Edit"
//                                         >
//                                           <i className="bx bx-edit"></i>
//                                         </Button>{" "}
//                                       </>
//                                     ) : (
//                                       ""
//                                     )}

//                                     {Roles?.CastrationDelete === true ||
//                                     Roles?.accessAll === true ? (
//                                       <>
//                                         <Button
//                                           size="sm"
//                                           color="danger"
//                                           onClick={() => deleteData(data)}
//                                           title="Delete"
//                                         >
//                                           <i className="bx bx-trash"></i>
//                                         </Button>{" "}
//                                       </>
//                                     ) : (
//                                       ""
//                                     )}
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="6" className="text-center py-4">
//                                 <div className="text-muted">
//                                   <i className="bx bx-inbox display-4"></i>
//                                   <p className="mt-2 mb-0">
//                                     No castration records found
//                                   </p>
//                                   {form.search && (
//                                     <small>
//                                       No results found for "{form.search}".
//                                       <Button
//                                         color="link"
//                                         size="sm"
//                                         onClick={() => {
//                                           setForm(prev => ({
//                                             ...prev,
//                                             search: "",
//                                           }))
//                                           getCaseTreated()
//                                         }}
//                                         className="p-0 ms-1"
//                                       >
//                                         Clear search
//                                       </Button>
//                                     </small>
//                                   )}
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </Table>
//                     </div>
//                     {/* Pagination */}
//                     {data.length > listPerPage && (
//                       <div className="d-flex justify-content-between align-items-center mt-3">
//                         <div className="text-muted">
//                           Showing {lists.length} of {data.length} records
//                         </div>
//                         <ReactPaginate
//                           previousLabel={<i className="bx bx-chevron-left"></i>}
//                           nextLabel={<i className="bx bx-chevron-right"></i>}
//                           pageCount={pageCount}
//                           onPageChange={changePage}
//                           containerClassName={"pagination pagination-sm mb-0"}
//                           previousLinkClassName={"page-link"}
//                           nextLinkClassName={"page-link"}
//                           disabledClassName={"disabled"}
//                           activeClassName={"active"}
//                           pageClassName={"page-item"}
//                           pageLinkClassName={"page-link"}
//                           breakClassName={"page-item"}
//                           breakLinkClassName={"page-link"}
//                         />
//                       </div>
//                     )}
//                   </CardBody>
//                 </Card>
//               )}
//             </Col>
//           </Row>
//         </div>
//         <ToastContainer position="top-right" autoClose={3000} />
//       </div>
//     </React.Fragment>
//   )
// }

// export default CaseTreated


import React, { useEffect, useState, useCallback } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import Select from "react-select"
import { URLS } from "../../Url"
import axios from "axios"
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

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const CaseTreated = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson?.token
  const UserDetails = TokenJson?.user
  const token = TokenData
  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [show3, setShow3] = useState(true)
  const [data, setData] = useState([])
  const [animalTypes, setAnimalTypes] = useState([])
  const [Gampanchayath, setGampanchayath] = useState([])
  const [breed, setBreed] = useState([])
  const [placeOfWorking, setPlaceOfWorking] = useState([])

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

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
    // ADD THESE NEW STYLES
    menu: base => ({
      ...base,
      zIndex: 9999, // Ensures dropdown appears above other elements
      maxHeight: '300px', // Limits the height
    }),
    menuList: base => ({
      ...base,
      maxHeight: '250px', // Height for scrollable area
      overflowY: 'auto', // Enables vertical scrolling
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#555',
      },
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

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ]

  const casteOptions = [
    { value: "General", label: "General" },
    { value: "BC-A", label: "BC-A" },
    { value: "BC-B", label: "BC-B" },
    { value: "BC-C", label: "BC-C" },
    { value: "BC-D", label: "BC-D" },
    { value: "BC-E", label: "BC-E" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
  ]

  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const initialFormState = {
    visitDate: getCurrentDate(),
    animalTypeId: "",
    breedId: "",
    gender: "",
    ageYears: "",
    ageMonths: "",
    noOfUnits: "",
    diagnostics: "Castration",
    remarks: "",
    ownerName: "",
    ownerMobile: "",
    workingPlaceId: "",
    formType: "castration",
    caste: "",
    aadharNo: "",
    Village: "",
    search: "",
  }

  const [form, setForm] = useState(initialFormState)
  const [form1, setForm1] = useState(initialFormState)

  const animalTypeOptions = animalTypes.map(type => ({
    value: type._id,
    label: type.name,
  }))

  const villageOptions = Gampanchayath.map(g => ({
    value: g.Village,
    label: g.Village,
  }))

  const breedOptions = breed.map(b => ({
    value: b._id,
    label: b.name,
  }))

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

  const getCaseTreated = useCallback(async () => {
    try {
      const response = await axios.post(
        URLS.GetCaseTreated,
        { formType: "castration" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setData(response.data.data || [])
    } catch (error) {
      console.error("Error fetching CaseTreated:", error)
      toast.error("Failed to load castration data")
    }
  }, [token])

  const getAnimalTypes = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetAnimalTypes, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAnimalTypes(response.data.data || [])
    } catch (error) {
      console.error("Error fetching Animal Types:", error)
      toast.error("Failed to load Animal Types")
    }
  }, [token])

  const GetGrampanchayath = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetGrampanchayath, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setGampanchayath(response.data.data || [])
    } catch (error) {
      console.error("Error fetching Grampanchayath:", error)
      toast.error("Failed to load Grampanchayath")
    }
  }, [token])

  const getOneBreeds = useCallback(
    async animalTypeId => {
      if (!animalTypeId) {
        setBreed([])
        return
      }
      try {
        const response = await axios.get(URLS.GetOneBreeds + animalTypeId, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBreed(response.data.data || [])
      } catch (error) {
        console.log("Failed to load Breed details")
        setBreed([])
        toast.error("Failed to load breeds")
      }
    },
    [token]
  )

  useEffect(() => {
    fetchPlaceOfWorking()
    getCaseTreated()
    getAnimalTypes()
    GetGrampanchayath()
  }, [fetchPlaceOfWorking, getCaseTreated, getAnimalTypes, GetGrampanchayath])

  const searchData = useCallback(
    async value => {
      if (value.trim() === "") {
        getCaseTreated()
        return
      }

      try {
        const response = await axios.post(
          `${URLS.GetCaseTreatedSearch}${value}`,
          { formType: "castration" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.status === 200) {
          setData(response.data.data || [])
          setPageNumber(0)
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      }
    },
    [token, getCaseTreated]
  )

  const handleSearchChange = e => {
    const value = e.target.value
    setForm(prev => ({ ...prev, search: value }))

    const timeoutId = setTimeout(() => {
      searchData(value)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const [selectedVillage, setSelectedVillage] = useState(null)
  const [selectedVillageEdit, setSelectedVillageEdit] = useState(null)
  const [inputValue, setInputValue] = useState("")
  const [inputValueEdit, setInputValueEdit] = useState("")

  const debouncedSearch = useCallback(
    debounce(searchValue => {
      if (searchValue.trim()) {
        SearchGampanchayath(searchValue)
      } else {
        GetGrampanchayath()
      }
    }, 500),
    [token]
  )

  const SearchGampanchayath = async searchValue => {
    try {
      const response = await axios.get(
        `${URLS.GetGrampanchayathSearch}${searchValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.status === 200) {
        setGampanchayath(response.data.data || [])
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message)
      }
      setGampanchayath([])
    }
  }

  const handleVillageSearch = inputValue => {
    setInputValue(inputValue)
    debouncedSearch(inputValue)
  }

  const handleVillageSearchEdit = inputValue => {
    setInputValueEdit(inputValue)
    debouncedSearch(inputValue)
  }

  const pagesVisited = pageNumber * listPerPage
  const lists = data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(data.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const addPopUp = () => {
    setShow(true)
    setShow1(false)
    setShow3(false)
    setForm({
      ...initialFormState,
      visitDate: getCurrentDate(),
    })
    setSelectedVillage(null)
    setInputValue("")
    GetGrampanchayath()

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleSelectChange = (selectedOption, { name }) => {
    setForm(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }))

    if (name === "animalTypeId" && selectedOption) {
      getOneBreeds(selectedOption.value)
      setForm(prev => ({ ...prev, breedId: "" }))
    }

    if (name === "Village") {
      setSelectedVillage(selectedOption)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const formAddSubmit = e => {
    e.preventDefault()
    addData()
  }

  const addData = async () => {
    const missingFields = []
    if (!form.animalTypeId) missingFields.push("Animal Type")
    if (!form.noOfUnits) missingFields.push("Number of Units")
    if (!form.visitDate) missingFields.push("Visit Date")
    if (!form.workingPlaceId) missingFields.push("Working Place")

    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }

    const dataArray = {
      visitDate: form.visitDate,
      animalTypeId: form.animalTypeId,
      breedId: form.breedId,
      gender: form.gender,
      ageYears: form.ageYears || "0",
      ageMonths: form.ageMonths || "0",
      noOfUnits: form.noOfUnits || "0",
      diagnostics: form.diagnostics,
      remarks: form.remarks,
      ownerName: form.ownerName,
      ownerMobile: form.ownerMobile,
      workingPlaceId: form.workingPlaceId,
      addedByEmp: UserDetails?._id,
      formType: "castration",
      caste: form.caste,
      aadharNo: form.aadharNo,
      Village: form.Village,
    }
    try {
      const response = await axios.post(URLS.AddCaseTreated, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success(response.data.message)
        setShow(false)
        setShow3(true)
        setForm(initialFormState)
        setSelectedVillage(null)
        setInputValue("")
        getCaseTreated()
        GetGrampanchayath()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to add castration")
      }
    }
  }

  const handleSelectChange1 = (selectedOption, { name }) => {
    setForm1(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }))

    if (name === "animalTypeId" && selectedOption) {
      getOneBreeds(selectedOption.value)
    }

    if (name === "Village") {
      setSelectedVillageEdit(selectedOption)
    }
  }

  const handleInputChange1 = e => {
    const { name, value } = e.target
    setForm1(prev => ({ ...prev, [name]: value }))
  }

  const updatePopUp = async data => {
    try {
      setShow(false)
      setShow1(true)
      setShow3(false)
      window.scrollTo({ top: 0, behavior: "smooth" })

      setBreed([])

      let loadedBreeds = []

      if (data.animalTypeId) {
        const response = await axios.get(
          URLS.GetOneBreeds + data.animalTypeId,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        loadedBreeds = response.data.data || []
        setBreed(loadedBreeds)
      }

      const freshBreedOptions = loadedBreeds.map(b => ({
        value: b._id,
        label: b.name,
      }))

      const selectedBreedOption =
        freshBreedOptions.find(opt => opt.value === data.breedId) || null

      const animalTypeOption =
        animalTypeOptions.find(o => o.value === data.animalTypeId) || null
      const placeOption =
        placeOfWorkingOptions.find(o => o.value === data.workingPlaceId) || null
      const villageOption =
        villageOptions.find(o => o.value === data.Village) || null
      const genderOption =
        genderOptions.find(o => o.value === data.gender) || null
      const casteOption = casteOptions.find(o => o.value === data.caste) || null

      setForm1({
        ...data,
        visitDate: data.visitDate?.split("T")[0] || getCurrentDate(),
        animalTypeId: animalTypeOption,
        breedId: selectedBreedOption,
        workingPlaceId: placeOption,
        gender: genderOption,
        caste: casteOption,
        Village: villageOption,
      })

      setSelectedVillageEdit(villageOption)
      setInputValueEdit(data.Village || "")

      GetGrampanchayath()
    } catch (error) {
      console.error("Edit popup error:", error)
      toast.error("Failed to load edit data")
    }
  }

  const getCurrentBreed1 = () => {
    return form1.breedId && typeof form1.breedId === "object"
      ? form1.breedId
      : breedOptions.find(opt => opt.value === form1.breedId) || null
  }

  const getCurrentAnimalType1 = () => {
    if (typeof form1.animalTypeId === "object") {
      return form1.animalTypeId
    }
    return animalTypeOptions.find(o => o.value === form1.animalTypeId) || null
  }

  const getCurrentPlace1 = () => {
    if (typeof form1.workingPlaceId === "object") {
      return form1.workingPlaceId
    }
    return (
      placeOfWorkingOptions.find(o => o.value === form1.workingPlaceId) || null
    )
  }

  const formEditSubmit = e => {
    e.preventDefault()
    updateData()
  }

  const updateData = async () => {
    const missingFields = []
    if (!form1.animalTypeId) missingFields.push("Animal Type")
    if (!form1.noOfUnits) missingFields.push("Number of Units")
    if (!form1.visitDate) missingFields.push("Visit Date")
    if (!form1.workingPlaceId) missingFields.push("Working Place")

    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }

    // Safe value extraction with null checks
    const getSafeValue = (field, defaultValue = "") => {
      if (!field) return defaultValue
      if (typeof field === "object" && field !== null) {
        return field.value || defaultValue
      }
      return field || defaultValue
    }

    const dataArray = {
      visitDate: form1.visitDate,
      animalTypeId: getSafeValue(form1.animalTypeId),
      breedId: getSafeValue(form1.breedId),
      gender: getSafeValue(form1.gender),
      ageYears: form1.ageYears || "0",
      ageMonths: form1.ageMonths || "0",
      noOfUnits: form1.noOfUnits || "0",
      diagnostics: form1.diagnostics,
      remarks: form1.remarks,
      ownerName: form1.ownerName,
      ownerMobile: form1.ownerMobile,
      workingPlaceId: getSafeValue(form1.workingPlaceId),
      addedByEmp: UserDetails?._id,
      formType: "castration",
      caste: getSafeValue(form1.caste),
      aadharNo: form1.aadharNo,
      Village: getSafeValue(form1.Village),
    }

    try {
      const response = await axios.put(
        URLS.EditCaseTreated + form1._id,
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        setShow1(false)
        setShow3(true)
        setSelectedVillageEdit(null)
        setInputValueEdit("")
        getCaseTreated()
        GetGrampanchayath()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to update castration")
      }
    }
  }

  const deleteData = data => {
    const confirmBox = window.confirm("Do you really want to delete this case?")
    if (confirmBox === true) {
      deleteCase(data)
    }
  }

  const deleteCase = async data => {
    const caseId = data._id

    try {
      const response = await axios.delete(URLS.DeleteCaseTreated + caseId, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success(response.data.message)
        getCaseTreated()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to delete castration")
      }
    }
  }

  const cancelForm = () => {
    setShow(false)
    setShow1(false)
    setShow3(true)
    setForm(initialFormState)
    setForm1(initialFormState)
    setSelectedVillage(null)
    setSelectedVillageEdit(null)
    setInputValue("")
    setInputValueEdit("")
    GetGrampanchayath()
  }

  const getCurrentAnimalType = () => {
    return (
      animalTypeOptions.find(opt => opt.value === form.animalTypeId) || null
    )
  }

  const getCurrentVillage = () => {
    return selectedVillage
  }

  const getCurrentBreed = () => {
    return breedOptions.find(opt => opt.value === form.breedId) || null
  }

  const getCurrentPlace = () => {
    return (
      placeOfWorkingOptions.find(opt => opt.value === form.workingPlaceId) ||
      null
    )
  }

  const getCurrentGender = () => {
    return genderOptions.find(opt => opt.value === form.gender) || null
  }

  const getCurrentCaste = () => {
    return casteOptions.find(opt => opt.value === form.caste) || null
  }

  const getCurrentVillage1 = () => {
    return selectedVillageEdit
  }

  const getCurrentGender1 = () => {
    if (typeof form1.gender === "object") {
      return form1.gender
    }
    return genderOptions.find(opt => opt.value === form1.gender) || null
  }

  const getCurrentCaste1 = () => {
    if (typeof form1.caste === "object") {
      return form1.caste
    }
    return casteOptions.find(opt => opt.value === form1.caste) || null
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content"  style={{ height: "auto" }}>
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Castration" />

          <Row>
            <Col md={12}>
              {show && (
                <Card className="mb-4">
                  <CardBody>
                    <Form onSubmit={formAddSubmit}>
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
                      <div className="form-section mt-2">
                        <h6 className="section-title text-primary mb-3">
                          <i className="bx bx-dna me-2"></i>
                          Animal Details
                        </h6>
                        <hr></hr>
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="animalTypeId" className="fw-bold">
                                Animal Type*
                              </Label>
                              <Select
                                name="animalTypeId"
                                value={getCurrentAnimalType()}
                                onChange={handleSelectChange}
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
                              <Label for="noOfUnits">No of Units *</Label>
                              <Input
                                size="sm"
                                type="number"
                            inputMode="decimal"
                            onWheel={(e) => e.target.blur()}
                                name="noOfUnits"
                                id="noOfUnits"
                                value={form.noOfUnits}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="No of Units"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="remarks">Remarks</Label>
                              <textarea
                                size="sm"
                                type="text"
                                name="remarks"
                                id="remarks"
                                rows={1}
                                value={form.remarks}
                                className="form-control"
                                onChange={handleInputChange}
                                placeholder="Enter any additional remarks"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <div className="d-flex justify-content-between mt-2 pt-1 border-top">
                        <Button
                          color="secondary"
                          onClick={cancelForm}
                          type="button"
                        >
                          <i className="bx bx-x me-1"></i>
                          Cancel
                        </Button>
                        <Button color="primary" type="submit">
                          <i className="bx bx-check me-1"></i>
                          Submit
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>

          {/* Edit Form with React Select */}
          <Row>
            <Col md={12}>
              {show1 && (
                <Card className="mb-4">
                  <CardBody>
                    <Form onSubmit={formEditSubmit}>
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
                      <div className="form-section mt-2">
                        <h6 className="section-title text-primary mb-3">
                          <i className="bx bx-dna me-2"></i>
                          Animal Details
                        </h6>
                        <hr></hr>
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="animalTypeId" className="fw-bold">
                                Animal Type*
                              </Label>
                              <Select
                                name="animalTypeId"
                                value={getCurrentAnimalType1()}
                                onChange={handleSelectChange1}
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
                              <Label for="noOfUnits">No of Units *</Label>
                              <Input
                                size="sm"
                                type="number"
                            inputMode="decimal"
                            onWheel={(e) => e.target.blur()}
                                name="noOfUnits"
                                id="noOfUnits"
                                value={form1.noOfUnits}
                                onChange={handleInputChange1}
                                min="1"
                                placeholder="No of Units"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="remarks">Remarks</Label>
                              <Input
                                size="sm"
                                type="text"
                                name="remarks"
                                id="remarks"
                                value={form1.remarks}
                                onChange={handleInputChange1}
                                placeholder="Enter any additional remarks"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <div className="d-flex justify-content-between mt-2 pt-1 border-top">
                        <Button
                          color="secondary"
                          onClick={cancelForm}
                          type="button"
                        >
                          <i className="bx bx-x me-1"></i>
                          Cancel
                        </Button>
                        <Button color="primary" type="submit">
                          <i className="bx bx-check me-1"></i>
                          Update
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>

          {/* Data Table View */}
          <Row>
            <Col md={12}>
              {show3 && (
                <Card>
                  <CardBody>
                    <Row className="mb-3">
                      <Col md={6}>
                        {Roles?.CastrationAdd === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Button color="primary" onClick={addPopUp}>
                              <i className="bx bx-plus me-1"></i>
                              Create Castration
                            </Button>
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
                              onChange={handleSearchChange}
                              type="search"
                              placeholder="Search by owner name or mobile..."
                              className="form-control"
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="table-rep-plugin mt-4 table-responsive">
                      <Table hover className="table table-bordered mb-4 ">
                        <thead>
                          <tr>
                            <th className="text-center"> S.No </th>
                            <th>Animal Details</th>
                            <th>Visit Details</th>
                            <th>Diagnostics & Remarks</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.length > 0 ? (
                            lists.map((data, index) => (
                              <tr key={data._id}>
                                <td className="text-center fw-bold">
                                  {pagesVisited + index + 1}
                                </td>
                                <td>
                                  <div>
                                    <strong>Type:</strong>
                                    {data.animalTypeName || "N/A"}
                                    <br />
                                    <strong>Units:</strong>
                                    {data.noOfUnits || "0"}
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>Date:</strong> {data.visitDate}
                                    <br />
                                    <strong>Place:</strong>
                                    {data.placeOfWorkingName || "N/A"}
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <strong>Remarks:</strong>
                                    {data.remarks || "N/A"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="btn-group" role="group">
                                    {Roles?.CastrationEdit === true ||
                                    Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          onClick={() => updatePopUp(data)}
                                          size="sm"
                                          color="primary"
                                          className="me-1"
                                          title="Edit"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {Roles?.CastrationDelete === true ||
                                    Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          size="sm"
                                          color="danger"
                                          onClick={() => deleteData(data)}
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
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-4">
                                <div className="text-muted">
                                  <i className="bx bx-inbox display-4"></i>
                                  <p className="mt-2 mb-0">
                                    No castration records found
                                  </p>
                                  {form.search && (
                                    <small>
                                      No results found for "{form.search}".
                                      <Button
                                        color="link"
                                        size="sm"
                                        onClick={() => {
                                          setForm(prev => ({
                                            ...prev,
                                            search: "",
                                          }))
                                          getCaseTreated()
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
                    {/* Pagination */}
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
              )}
            </Col>
          </Row>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default CaseTreated
