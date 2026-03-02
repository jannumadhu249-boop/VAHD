// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { Link, useHistory } from "react-router-dom"
// import Select from "react-select"
// import { URLS } from "../../Url"
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
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap"

// const DrugIndent = () => {
//   const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//   const token = authUser?.token || ""
//   const history = useHistory()
//   const isInitialMount = useRef(true)

//   const [budgetTransferModal, setBudgetTransferModal] = useState(false)
//   const [freezeModal, setFreezeModal] = useState(false)
//   const [filteredPlaces, setFilteredPlaces] = useState([])
//   const [employmentType, setEmploymentType] = useState([])
//   const [allocationForms, setAllocationForms] = useState([])
//   const [financialYears, setFinancialYears] = useState([])
//   const [budgetButtons, setBudgetButtons] = useState({})
//   const [quarters, setQuarters] = useState([])
//   const [schemes, setSchemes] = useState([])
//   const [loading, setLoading] = useState({
//     filters: false,
//     data: false,
//     initialization: true,
//   })

//   const getInitialFilters = () => ({
//     institutionTypeId: localStorage.getItem("saved_institutionTypeId") || "",
//     workingPlaceId: localStorage.getItem("saved_workingPlaceId") || "",
//     financialYearId: localStorage.getItem("saved_financialYearId") || "",
//     schemeId: localStorage.getItem("saved_schemeId") || "",
//     quarterId: localStorage.getItem("saved_quarterId") || "",
//   })

//   const [filters, setFilters] = useState(getInitialFilters())

//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false
//       return
//     }

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         localStorage.setItem(`saved_${key}`, value)
//       } else {
//         localStorage.removeItem(`saved_${key}`)
//       }
//     })
//   }, [filters])

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

//   const institutionTypeOptions = useMemo(
//     () =>
//       employmentType.map(type => ({
//         value: type._id,
//         label: type.name,
//       })),
//     [employmentType]
//   )

//   const filterPlaceOfWorkingOptions = useMemo(
//     () =>
//       filteredPlaces.map(place => ({
//         value: place._id,
//         label: place.name,
//       })),
//     [filteredPlaces]
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

//   const financialYearOptions = useMemo(
//     () =>
//       financialYears.map(year => ({
//         value: year._id,
//         label: year.year,
//       })),
//     [financialYears]
//   )

//   const getWorkingPlaceValue = useMemo(() => {
//     if (!filters.workingPlaceId || !filteredPlaces.length) {
//       return null
//     }

//     const place = filteredPlaces.find(p => p._id === filters.workingPlaceId)
//     return place ? { value: place._id, label: place.name } : null
//   }, [filters.workingPlaceId, filteredPlaces])

//   const fetchDrugIndents = useCallback(async () => {
//     if (!token) return

//     const requiredFilters = [
//       "financialYearId",
//       "institutionTypeId",
//       "workingPlaceId",
//       "schemeId",
//       "quarterId",
//     ]

//     const missingFilters = requiredFilters.filter(key => !filters[key])

//     if (missingFilters.length > 0) {
//       setAllocationForms([])
//       return
//     }

//     setLoading(prev => ({ ...prev, data: true }))

//     try {
//       const response = await axios.post(URLS.GetAllocationFormFilter, filters, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 30000,
//       })

//       setBudgetButtons(response.data || {})
//       const forms = response.data?.data?.[0]?.forms || []
//       setAllocationForms(forms)

//       if (forms.length === 0) {
//         toast.info("No drug groups found with the selected filters")
//       }
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to load drug indents"
//       toast.error(message)
//       setAllocationForms([])
//     } finally {
//       setLoading(prev => ({ ...prev, data: false }))
//     }
//   }, [token, filters])

//   const fetchEmploymentType = useCallback(async () => {
//     if (!token) return

//     try {
//       const response = await axios.get(URLS.GetEmploymentType, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 15000,
//       })

//       if (response.data?.data) {
//         const employmentTypes = response.data.data
//         setEmploymentType(employmentTypes)
//         if (filters.institutionTypeId) {
//           await fetchPlaceOfWorking(filters.institutionTypeId)
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching employment types:", error)
//       toast.error("Failed to load employment types")
//     }
//   }, [token, filters.institutionTypeId])

//   const fetchPlaceOfWorking = useCallback(
//     async institutionTypeId => {
//       if (!token || !institutionTypeId) {
//         setFilteredPlaces([])
//         return
//       }

//       try {
//         const response = await axios.post(
//           URLS.GetInstitutionBygetPlaceOfWorking,
//           { institutionTypeId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             timeout: 15000,
//           }
//         )

//         const places = response.data?.data || []
//         setFilteredPlaces(places)
//       } catch (error) {
//         console.error("Error fetching places of working:", error)
//         toast.error("Failed to load places of working")
//         setFilteredPlaces([])
//       }
//     },
//     [token]
//   )

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
//         const years = response.data.data
//         setFinancialYears(years)
//       }
//     } catch (error) {
//       console.error("Error fetching financial years:", error)
//       toast.error("Failed to fetch financial years")
//     }
//   }, [token])

//   const fetchSchemesAndQuarters = useCallback(
//     async financialYearId => {
//       if (!token || !financialYearId) {
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

//   const handleSearch = () => {
//     if (
//       !filters.financialYearId ||
//       !filters.institutionTypeId ||
//       !filters.workingPlaceId ||
//       !filters.schemeId ||
//       !filters.quarterId
//     ) {
//       toast.warning("Please select all required filters")
//       return
//     }
//     fetchDrugIndents()
//   }

//   const handleSelectFilterChange = async (selectedOption, { name }) => {
//     const value = selectedOption?.value || ""

//     if (name === "institutionTypeId") {
//       setFilters(prev => ({
//         ...prev,
//         institutionTypeId: value,
//         workingPlaceId: "",
//       }))

//       setFilteredPlaces([])

//       if (value) {
//         await fetchPlaceOfWorking(value)
//       }
//     } else if (name === "financialYearId") {
//       setFilters(prev => ({
//         ...prev,
//         [name]: value,
//         schemeId: "",
//         quarterId: "",
//       }))

//       if (value) {
//         fetchSchemesAndQuarters(value)
//       } else {
//         setSchemes([])
//         setQuarters([])
//       }
//     } else {
//       setFilters(prev => ({ ...prev, [name]: value }))
//     }
//   }

//   const handleDrugClick = data => {
//     const formData = {
//       FormId: data._id,
//       institutionTypeId: filters.institutionTypeId,
//       workingPlaceId: filters.workingPlaceId,
//       financialYearId: filters.financialYearId,
//       schemeId: filters.schemeId,
//       quarterId: filters.quarterId,
//     }

//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) {
//         localStorage.setItem(key, value)
//       } else {
//         localStorage.removeItem(key)
//       }
//     })

//     if (data.utilised === false) {
//       history.push("groups")
//     }
//   }

//   const handleReportsClick = () => {
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         localStorage.setItem(key, value)
//       } else {
//         localStorage.removeItem(key)
//       }
//     })
//   }

//   const resetFilters = () => {
//     const clearedFilters = {
//       institutionTypeId: "",
//       workingPlaceId: "",
//       financialYearId: "",
//       schemeId: "",
//       quarterId: "",
//     }
//     setFilters(clearedFilters)
//     setAllocationForms([])
//     setFilteredPlaces([])
//     setSchemes([])
//     setQuarters([])
//     const itemsToClear = [
//       "saved_institutionTypeId",
//       "saved_workingPlaceId",
//       "saved_financialYearId",
//       "saved_schemeId",
//       "saved_quarterId",
//       "institutionTypeId",
//       "workingPlaceId",
//       "financialYearId",
//       "schemeId",
//       "quarterId",
//       "FormId",
//     ]
//     itemsToClear.forEach(item => localStorage.removeItem(item))
//     toast.info("Filters reset successfully")
//     setTimeout(() => {
//       window.location.reload()
//     }, 100)
//   }

//   useEffect(() => {
//     const initializeData = async () => {
//       setLoading(prev => ({ ...prev, initialization: true }))
//       try {
//         await Promise.all([fetchEmploymentType(), fetchFinancialYears()])
//         if (filters.financialYearId) {
//           await fetchSchemesAndQuarters(filters.financialYearId)
//         }
//       } catch (error) {
//         console.error("Error initializing data:", error)
//         toast.error("Failed to initialize application data")
//       } finally {
//         setLoading(prev => ({ ...prev, initialization: false }))
//       }
//     }
//     initializeData()
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       if (
//         filters.financialYearId &&
//         filters.institutionTypeId &&
//         filters.workingPlaceId &&
//         filters.schemeId &&
//         filters.quarterId
//       ) {
//         await fetchDrugIndents()
//       }
//     }
//     const debounceTimer = setTimeout(fetchData, 500)
//     return () => clearTimeout(debounceTimer)
//   }, [
//     filters.financialYearId,
//     filters.institutionTypeId,
//     filters.workingPlaceId,
//     filters.schemeId,
//     filters.quarterId,
//   ])

//   const handleFreeze = async () => {
//     try {
//       const filterParams = {
//         workingPlaceId: filters.workingPlaceId,
//         financialYearId: filters.financialYearId,
//         schemeId: filters.schemeId,
//         quarterId: filters.quarterId,
//         institutionTypeId: filters.institutionTypeId,
//       }

//       const response = await axios.post(URLS.freezeGroup, filterParams, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.status === 200) {
//         toast.success("Freeze Updated Successfully")
//         setFreezeModal(false)
//         fetchDrugIndents()
//       }
//     } catch (error) {
//       console.error("Error Freeze Updated:", error)
//       toast.error(error.response?.data?.message || "Failed to Freeze Updated")
//     }
//   }

//   const handleBudgetTransfer = async () => {
//     try {
//       const filterParams = {
//         workingPlaceId: filters.workingPlaceId,
//         financialYearId: filters.financialYearId,
//         schemeId: filters.schemeId,
//         quarterId: filters.quarterId,
//         institutionTypeId: filters.institutionTypeId,
//       }

//       const response = await axios.post(URLS.BugetTransfer, filterParams, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.status === 200) {
//         toast.success("Budget Transfer Updated Successfully")
//         setBudgetTransferModal(false)
//         fetchDrugIndents()
//       }
//     } catch (error) {
//       console.error("Error Budget Transfer Updated:", error)
//       toast.error(
//         error.response?.data?.message || "Failed to Budget Transfer Updated"
//       )
//     }
//   }

//   if (loading.initialization) {
//     return (
//       <div className="page-content">
//         <div className="container-fluid">
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{ minHeight: "60vh" }}
//           >
//             <div className="text-center">
//               <Spinner color="primary" />
//               <p className="mt-2 text-muted">Loading application data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const areFiltersComplete = Boolean(
//     filters.financialYearId &&
//       filters.institutionTypeId &&
//       filters.workingPlaceId &&
//       filters.schemeId &&
//       filters.quarterId
//   )

//   const isPlaceOfWorkingCleared = !filters.workingPlaceId

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <Card className="mb-2 border-0 shadow-sm">
//           <CardBody>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div>
//                 <h5 className="text-primary mb-0">
//                   <i className="fas fa-filter me-2"></i>
//                   Filters
//                 </h5>
//               </div>
//               <div className="d-flex gap-2">
//                 <Button
//                   color="outline-secondary"
//                   size="sm"
//                   onClick={resetFilters}
//                   className="px-3"
//                   disabled={loading.data}
//                 >
//                   <i className="bx bx-reset me-1"></i>
//                   Reset Filters
//                 </Button>
//               </div>
//             </div>

//             <Row className="g-3">
//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Financial Year *
//                   </Label>
//                   <Select
//                     name="financialYearId"
//                     value={financialYearOptions.find(
//                       opt => opt.value === filters.financialYearId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={financialYearOptions}
//                     styles={selectStyles}
//                     placeholder="Select Year"
//                     isSearchable
//                     isClearable
//                     isLoading={loading.filters}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Scheme *
//                   </Label>
//                   <Select
//                     name="schemeId"
//                     value={schemeOptions.find(
//                       opt => opt.value === filters.schemeId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={schemeOptions}
//                     styles={selectStyles}
//                     placeholder="Select Scheme"
//                     isSearchable
//                     isClearable
//                     isDisabled={!filters.financialYearId || loading.filters}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Quarter *
//                   </Label>
//                   <Select
//                     name="quarterId"
//                     value={quarterOptions.find(
//                       opt => opt.value === filters.quarterId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={quarterOptions}
//                     styles={selectStyles}
//                     placeholder="Select Quarter"
//                     isSearchable
//                     isClearable
//                     isDisabled={!filters.financialYearId || loading.filters}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Institution Type *
//                   </Label>
//                   <Select
//                     name="institutionTypeId"
//                     value={institutionTypeOptions.find(
//                       opt => opt.value === filters.institutionTypeId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={institutionTypeOptions}
//                     styles={selectStyles}
//                     placeholder="Select Type"
//                     isSearchable
//                     isClearable
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={3}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Place of Working *
//                   </Label>
//                   <Select
//                     name="workingPlaceId"
//                     value={getWorkingPlaceValue}
//                     onChange={handleSelectFilterChange}
//                     options={filterPlaceOfWorkingOptions}
//                     styles={selectStyles}
//                     placeholder={
//                       !filters.institutionTypeId
//                         ? "Select Institution Type first"
//                         : filteredPlaces.length === 0
//                         ? "Loading places..."
//                         : "Select Place"
//                     }
//                     isSearchable
//                     isClearable
//                     isDisabled={!filters.institutionTypeId}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={1}>
//                 <Button
//                   style={{ marginTop: "28px" }}
//                   color="primary"
//                   className="w-100"
//                   onClick={handleSearch}
//                   disabled={loading.data || !areFiltersComplete}
//                 >
//                   {loading.data ? (
//                     <Spinner size="sm" />
//                   ) : (
//                     <>
//                       <i className="bx bx-search me-1"></i>
//                       Search
//                     </>
//                   )}
//                 </Button>
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>
//         {loading.data ? (
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//             <p className="mt-3 text-muted">Loading drug groups...</p>
//           </div>
//         ) : allocationForms.length > 0 &&
//           areFiltersComplete &&
//           !isPlaceOfWorkingCleared ? (
//           <>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0 text-dark">Drug Groups</h5>
//               <div className="d-flex gap-2">
//                 <Button
//                   disabled={
//                     budgetButtons.freeze_display === false ? true : false
//                   }
//                   color="danger"
//                   onClick={() => setFreezeModal(true)}
//                   className="d-flex align-items-center"
//                 >
//                   <i className="bx bx-lock me-1"></i>
//                   Freeze
//                 </Button>
//                 <Button
//                   disabled={
//                     budgetButtons.transfer_display === false ? true : false
//                   }
//                   color="warning"
//                   onClick={() => setBudgetTransferModal(true)}
//                   className="d-flex align-items-center"
//                 >
//                   <i className="bx bx-transfer me-1"></i>
//                   Budget Transfer
//                 </Button>
//               </div>
//             </div>
//             <Row>
//               {allocationForms.map((item, index) => (
//                 <Col
//                   xl="2"
//                   lg="3"
//                   md="4"
//                   sm="6"
//                   xs="6"
//                   key={item._id || index}
//                   className="mb-3"
//                 >
//                   <Card
//                     className="h-100 border-0 shadow-sm hover-lift cursor-pointer transition-all"
//                     onClick={() => handleDrugClick(item)}
//                     style={{
//                       cursor: item.utilised === false ? "pointer" : "default",
//                       backgroundColor:
//                         item.utilised === true ? "#d2d2d2" : "white",
//                       opacity: item.utilised === true ? 0.9 : 1,
//                     }}
//                   >
//                     <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                       <div className="mb-3">
//                         <div
//                           className="position-relative mx-auto"
//                           style={{ width: 70, height: 70 }}
//                         >
//                           <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center border">
//                             {item.image ? (
//                               <img
//                                 src={`${URLS.Base}${item.image}`}
//                                 alt={item?.group || "Drug Group"}
//                                 className="img-fluid"
//                                 style={{
//                                   maxWidth: "100%",
//                                   maxHeight: "100%",
//                                   objectFit: "contain",
//                                 }}
//                                 onError={e => {
//                                   e.target.src =
//                                     "https://via.placeholder.com/80?text=No+Image"
//                                 }}
//                               />
//                             ) : (
//                               <div className="text-primary">
//                                 <i
//                                   className="bx bx-package"
//                                   style={{ fontSize: "1.75rem" }}
//                                 ></i>
//                               </div>
//                             )}
//                           </div>
//                           {item.utilisedBudgetPercent != null && (
//                             <div className="position-absolute top-0 end-0">
//                               <span className="badge bg-danger rounded-pill">
//                                 {item.utilisedBudgetPercent}%
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div>
//                         <h6 className="text-dark fw-semibold mb-1 text-truncate">
//                           {item?.group || "Unnamed Group"}
//                         </h6>
//                         {item.description && (
//                           <p
//                             className="text-muted small mb-0 text-truncate-2"
//                             style={{ height: "2.5em" }}
//                           >
//                             {item.description}
//                           </p>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </>
//         ) : (
//           <Card>
//             <CardBody>
//               <div className="text-center py-5">
//                 <div className="mb-3">
//                   <i className="bx bx-package display-4 text-muted"></i>
//                 </div>
//                 <h5 className="text-muted mb-2">No Drug Groups Found</h5>
//                 <p className="text-muted mb-3">
//                   {!areFiltersComplete
//                     ? "Please select all required filters to view drug groups"
//                     : isPlaceOfWorkingCleared
//                     ? "Please select Place of Working to view drug groups"
//                     : "No drug groups available for the selected filters"}
//                 </p>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={resetFilters}
//                   className="me-2"
//                 >
//                   <i className="bx bx-refresh me-1"></i>
//                   Reset Filters
//                 </Button>
//               </div>
//             </CardBody>
//           </Card>
//         )}

//         <h5 className="mb-3 text-dark">Group Reports</h5>
//         <Row>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/groups-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//             <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/district-wise-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     District Wise DVAHO Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>


//     <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/group-wise-district-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Group Wise District Indent Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>


//             <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/district-wise-abstract"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                      District Wise Abstract Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//   <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/district-wise-inst-count"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                      District Wise Institution Count Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>
//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/drugs-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution-wise Drug Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/placeofworking-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution Progress Reports
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/drug-wise-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">Drug Report</h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/abstract-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution Progress Abstract
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/inventory-management"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Inventory Management
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>


//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/detailed-drug-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Detailed Drug Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>
//         </Row>
//       </div>

//       <Modal
//         isOpen={budgetTransferModal}
//         toggle={() => setBudgetTransferModal(false)}
//         centered
//       >
//         <ModalHeader toggle={() => setBudgetTransferModal(false)}>
//           Confirm Budget Transfer
//         </ModalHeader>
//         <ModalBody>
//           <p className="mb-3">
//             Are you sure you want to transfer budget for the selected criteria?
//             This action cannot be undone.
//           </p>
//           <div className="mb-3">
//             <strong>Selected Filters:</strong>
//             <div className="mt-2">
//               <small className="text-muted">
//                 Financial Year:{" "}
//                 {financialYearOptions.find(
//                   opt => opt.value === filters.financialYearId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Scheme:{" "}
//                 {schemeOptions.find(opt => opt.value === filters.schemeId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Quarter:{" "}
//                 {quarterOptions.find(opt => opt.value === filters.quarterId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Institution Type:{" "}
//                 {institutionTypeOptions.find(
//                   opt => opt.value === filters.institutionTypeId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Place of Working:{" "}
//                 {filterPlaceOfWorkingOptions.find(
//                   opt => opt.value === filters.workingPlaceId
//                 )?.label || "Not selected"}
//               </small>
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             onClick={() => setBudgetTransferModal(false)}
//           >
//             Cancel
//           </Button>
//           <Button color="warning" onClick={handleBudgetTransfer}>
//             Confirm Budget Transfer
//           </Button>
//         </ModalFooter>
//       </Modal>

//       <Modal isOpen={freezeModal} toggle={() => setFreezeModal(false)} centered>
//         <ModalHeader toggle={() => setFreezeModal(false)}>
//           Confirm Freeze
//         </ModalHeader>
//         <ModalBody>
//           <p className="mb-3">
//             Are you sure you want to freeze the selected drug groups? This
//             action cannot be undone.
//           </p>
//           <div className="mb-3">
//             <strong>Selected Filters:</strong>
//             <div className="mt-2">
//               <small className="text-muted">
//                 Financial Year:{" "}
//                 {financialYearOptions.find(
//                   opt => opt.value === filters.financialYearId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Scheme:{" "}
//                 {schemeOptions.find(opt => opt.value === filters.schemeId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Quarter:{" "}
//                 {quarterOptions.find(opt => opt.value === filters.quarterId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Institution Type:{" "}
//                 {institutionTypeOptions.find(
//                   opt => opt.value === filters.institutionTypeId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Place of Working:{" "}
//                 {filterPlaceOfWorkingOptions.find(
//                   opt => opt.value === filters.workingPlaceId
//                 )?.label || "Not selected"}
//               </small>
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={() => setFreezeModal(false)}>
//             Cancel
//           </Button>
//           <Button color="danger" onClick={handleFreeze}>
//             Confirm Freeze
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

// export default DrugIndent






// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import { Link, useHistory } from "react-router-dom"
// import Select from "react-select"
// import { URLS } from "../../Url"
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
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap"

// const DrugIndent = () => {
//   const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//   const token = authUser?.token || ""
//   const history = useHistory()
//   const isInitialMount = useRef(true)

//   const [budgetTransferModal, setBudgetTransferModal] = useState(false)
//   const [freezeModal, setFreezeModal] = useState(false)
//   const [dvahoFreezeModal, setDvahoFreezeModal] = useState(false)
//   const [filteredPlaces, setFilteredPlaces] = useState([])
//   const [employmentType, setEmploymentType] = useState([])
//   const [allocationForms, setAllocationForms] = useState([])
//   const [financialYears, setFinancialYears] = useState([])
//   const [budgetButtons, setBudgetButtons] = useState({})
//   const [quarters, setQuarters] = useState([])
//   const [schemes, setSchemes] = useState([])
//   const [loading, setLoading] = useState({
//     filters: false,
//     data: false,
//     initialization: true,
//     dvahoFreeze: false,
//   })

//   const getInitialFilters = () => ({
//     institutionTypeId: localStorage.getItem("saved_institutionTypeId") || "",
//     workingPlaceId: localStorage.getItem("saved_workingPlaceId") || "",
//     financialYearId: localStorage.getItem("saved_financialYearId") || "",
//     schemeId: localStorage.getItem("saved_schemeId") || "",
//     quarterId: localStorage.getItem("saved_quarterId") || "",
//   })

//   const [filters, setFilters] = useState(getInitialFilters())

//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false
//       return
//     }

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         localStorage.setItem(`saved_${key}`, value)
//       } else {
//         localStorage.removeItem(`saved_${key}`)
//       }
//     })
//   }, [filters])

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

//   const institutionTypeOptions = useMemo(
//     () =>
//       employmentType.map(type => ({
//         value: type._id,
//         label: type.name,
//       })),
//     [employmentType]
//   )

//   const filterPlaceOfWorkingOptions = useMemo(
//     () =>
//       filteredPlaces.map(place => ({
//         value: place._id,
//         label: place.name,
//       })),
//     [filteredPlaces]
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

//   const financialYearOptions = useMemo(
//     () =>
//       financialYears.map(year => ({
//         value: year._id,
//         label: year.year,
//       })),
//     [financialYears]
//   )

//   const getWorkingPlaceValue = useMemo(() => {
//     if (!filters.workingPlaceId || !filteredPlaces.length) {
//       return null
//     }

//     const place = filteredPlaces.find(p => p._id === filters.workingPlaceId)
//     return place ? { value: place._id, label: place.name } : null
//   }, [filters.workingPlaceId, filteredPlaces])

//   const fetchDrugIndents = useCallback(async () => {
//     if (!token) return

//     const requiredFilters = [
//       "financialYearId",
//       "institutionTypeId",
//       "workingPlaceId",
//       "schemeId",
//       "quarterId",
//     ]

//     const missingFilters = requiredFilters.filter(key => !filters[key])

//     if (missingFilters.length > 0) {
//       setAllocationForms([])
//       return
//     }

//     setLoading(prev => ({ ...prev, data: true }))

//     try {
//       const response = await axios.post(URLS.GetAllocationFormFilter, filters, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 30000,
//       })

//       setBudgetButtons(response.data || {})
//       const forms = response.data?.data?.[0]?.forms || []
//       setAllocationForms(forms)

//       if (forms.length === 0) {
//         toast.info("No drug groups found with the selected filters")
//       }
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to load drug indents"
//       toast.error(message)
//       setAllocationForms([])
//     } finally {
//       setLoading(prev => ({ ...prev, data: false }))
//     }
//   }, [token, filters])

//   const fetchEmploymentType = useCallback(async () => {
//     if (!token) return

//     try {
//       const response = await axios.get(URLS.GetEmploymentType, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 15000,
//       })

//       if (response.data?.data) {
//         const employmentTypes = response.data.data
//         setEmploymentType(employmentTypes)
//         if (filters.institutionTypeId) {
//           await fetchPlaceOfWorking(filters.institutionTypeId)
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching employment types:", error)
//       toast.error("Failed to load employment types")
//     }
//   }, [token, filters.institutionTypeId])

//   const fetchPlaceOfWorking = useCallback(
//     async institutionTypeId => {
//       if (!token || !institutionTypeId) {
//         setFilteredPlaces([])
//         return
//       }

//       try {
//         const response = await axios.post(
//           URLS.GetInstitutionBygetPlaceOfWorking,
//           { institutionTypeId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             timeout: 15000,
//           }
//         )

//         const places = response.data?.data || []
//         setFilteredPlaces(places)
//       } catch (error) {
//         console.error("Error fetching places of working:", error)
//         toast.error("Failed to load places of working")
//         setFilteredPlaces([])
//       }
//     },
//     [token]
//   )

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
//         const years = response.data.data
//         setFinancialYears(years)
//       }
//     } catch (error) {
//       console.error("Error fetching financial years:", error)
//       toast.error("Failed to fetch financial years")
//     }
//   }, [token])

//   const fetchSchemesAndQuarters = useCallback(
//     async financialYearId => {
//       if (!token || !financialYearId) {
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

//   const handleSearch = () => {
//     if (
//       !filters.financialYearId ||
//       !filters.institutionTypeId ||
//       !filters.workingPlaceId ||
//       !filters.schemeId ||
//       !filters.quarterId
//     ) {
//       toast.warning("Please select all required filters")
//       return
//     }
//     fetchDrugIndents()
//   }

//   const handleSelectFilterChange = async (selectedOption, { name }) => {
//     const value = selectedOption?.value || ""

//     if (name === "institutionTypeId") {
//       setFilters(prev => ({
//         ...prev,
//         institutionTypeId: value,
//         workingPlaceId: "",
//       }))

//       setFilteredPlaces([])

//       if (value) {
//         await fetchPlaceOfWorking(value)
//       }
//     } else if (name === "financialYearId") {
//       setFilters(prev => ({
//         ...prev,
//         [name]: value,
//         schemeId: "",
//         quarterId: "",
//       }))

//       if (value) {
//         fetchSchemesAndQuarters(value)
//       } else {
//         setSchemes([])
//         setQuarters([])
//       }
//     } else {
//       setFilters(prev => ({ ...prev, [name]: value }))
//     }
//   }

//   const handleDrugClick = data => {
//     const formData = {
//       FormId: data._id,
//       institutionTypeId: filters.institutionTypeId,
//       workingPlaceId: filters.workingPlaceId,
//       financialYearId: filters.financialYearId,
//       schemeId: filters.schemeId,
//       quarterId: filters.quarterId,
//     }

//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) {
//         localStorage.setItem(key, value)
//       } else {
//         localStorage.removeItem(key)
//       }
//     })

//     if (data.utilised === false) {
//       history.push("groups")
//     }
//   }

//   const handleReportsClick = () => {
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         localStorage.setItem(key, value)
//       } else {
//         localStorage.removeItem(key)
//       }
//     })
//   }

//   const resetFilters = () => {
//     const clearedFilters = {
//       institutionTypeId: "",
//       workingPlaceId: "",
//       financialYearId: "",
//       schemeId: "",
//       quarterId: "",
//     }
//     setFilters(clearedFilters)
//     setAllocationForms([])
//     setFilteredPlaces([])
//     setSchemes([])
//     setQuarters([])
//     const itemsToClear = [
//       "saved_institutionTypeId",
//       "saved_workingPlaceId",
//       "saved_financialYearId",
//       "saved_schemeId",
//       "saved_quarterId",
//       "institutionTypeId",
//       "workingPlaceId",
//       "financialYearId",
//       "schemeId",
//       "quarterId",
//       "FormId",
//     ]
//     itemsToClear.forEach(item => localStorage.removeItem(item))
//     toast.info("Filters reset successfully")
//     setTimeout(() => {
//       window.location.reload()
//     }, 100)
//   }

//   // Handle DVAHO Freeze
//   const handleDvahoFreeze = async () => {
//     if (!filters.financialYearId || !filters.schemeId || !filters.quarterId) {
//       toast.warning("Please select Financial Year, Scheme, and Quarter for DVAHO Freeze")
//       return
//     }

//     setLoading(prev => ({ ...prev, dvahoFreeze: true }))

//     try {
//       const requestData = {
//         financialYearId: filters.financialYearId,
//         schemeId: filters.schemeId,
//         quarterId: filters.quarterId,
//       }

//       const response = await axios.post(
//         URLS.DVAHOfreezeDrugFormData ,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       )

//       if (response.status === 200) {
//         toast.success("DVAHO Freeze completed successfully")
//         setDvahoFreezeModal(false)
//         // Refresh the data to reflect changes
//         fetchDrugIndents()
//       }
//     } catch (error) {
//       console.error("Error in DVAHO Freeze:", error)
//       toast.error(
//         error.response?.data?.message || "Failed to complete DVAHO Freeze"
//       )
//     } finally {
//       setLoading(prev => ({ ...prev, dvahoFreeze: false }))
//     }
//   }

//   useEffect(() => {
//     const initializeData = async () => {
//       setLoading(prev => ({ ...prev, initialization: true }))
//       try {
//         await Promise.all([fetchEmploymentType(), fetchFinancialYears()])
//         if (filters.financialYearId) {
//           await fetchSchemesAndQuarters(filters.financialYearId)
//         }
//       } catch (error) {
//         console.error("Error initializing data:", error)
//         toast.error("Failed to initialize application data")
//       } finally {
//         setLoading(prev => ({ ...prev, initialization: false }))
//       }
//     }
//     initializeData()
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       if (
//         filters.financialYearId &&
//         filters.institutionTypeId &&
//         filters.workingPlaceId &&
//         filters.schemeId &&
//         filters.quarterId
//       ) {
//         await fetchDrugIndents()
//       }
//     }
//     const debounceTimer = setTimeout(fetchData, 500)
//     return () => clearTimeout(debounceTimer)
//   }, [
//     filters.financialYearId,
//     filters.institutionTypeId,
//     filters.workingPlaceId,
//     filters.schemeId,
//     filters.quarterId,
//   ])

//   const handleFreeze = async () => {
//     try {
//       const filterParams = {
//         workingPlaceId: filters.workingPlaceId,
//         financialYearId: filters.financialYearId,
//         schemeId: filters.schemeId,
//         quarterId: filters.quarterId,
//         institutionTypeId: filters.institutionTypeId,
//       }

//       const response = await axios.post(URLS.freezeGroup, filterParams, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.status === 200) {
//         toast.success("Freeze Updated Successfully")
//         setFreezeModal(false)
//         fetchDrugIndents()
//       }
//     } catch (error) {
//       console.error("Error Freeze Updated:", error)
//       toast.error(error.response?.data?.message || "Failed to Freeze Updated")
//     }
//   }

//   const handleBudgetTransfer = async () => {
//     try {
//       const filterParams = {
//         workingPlaceId: filters.workingPlaceId,
//         financialYearId: filters.financialYearId,
//         schemeId: filters.schemeId,
//         quarterId: filters.quarterId,
//         institutionTypeId: filters.institutionTypeId,
//       }

//       const response = await axios.post(URLS.BugetTransfer, filterParams, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.status === 200) {
//         toast.success("Budget Transfer Updated Successfully")
//         setBudgetTransferModal(false)
//         fetchDrugIndents()
//       }
//     } catch (error) {
//       console.error("Error Budget Transfer Updated:", error)
//       toast.error(
//         error.response?.data?.message || "Failed to Budget Transfer Updated"
//       )
//     }
//   }

//   if (loading.initialization) {
//     return (
//       <div className="page-content">
//         <div className="container-fluid">
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{ minHeight: "60vh" }}
//           >
//             <div className="text-center">
//               <Spinner color="primary" />
//               <p className="mt-2 text-muted">Loading application data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const areFiltersComplete = Boolean(
//     filters.financialYearId &&
//       filters.institutionTypeId &&
//       filters.workingPlaceId &&
//       filters.schemeId &&
//       filters.quarterId
//   )

//   const isPlaceOfWorkingCleared = !filters.workingPlaceId

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <Card className="mb-2 border-0 shadow-sm">
//           <CardBody>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div>
//                 <h5 className="text-primary mb-0">
//                   <i className="fas fa-filter me-2"></i>
//                   Filters
//                 </h5>
//               </div>
//               <div className="d-flex gap-2">
//                 <Button
//                   color="outline-secondary"
//                   size="sm"
//                   onClick={resetFilters}
//                   className="px-3"
//                   disabled={loading.data}
//                 >
//                   <i className="bx bx-reset me-1"></i>
//                   Reset Filters
//                 </Button>
//               </div>
//             </div>

//             <Row className="g-3">
//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Financial Year *
//                   </Label>
//                   <Select
//                     name="financialYearId"
//                     value={financialYearOptions.find(
//                       opt => opt.value === filters.financialYearId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={financialYearOptions}
//                     styles={selectStyles}
//                     placeholder="Select Year"
//                     isSearchable
//                     isClearable
//                     isLoading={loading.filters}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Scheme *
//                   </Label>
//                   <Select
//                     name="schemeId"
//                     value={schemeOptions.find(
//                       opt => opt.value === filters.schemeId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={schemeOptions}
//                     styles={selectStyles}
//                     placeholder="Select Scheme"
//                     isSearchable
//                     isClearable
//                     isDisabled={!filters.financialYearId || loading.filters}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Quarter *
//                   </Label>
//                   <Select
//                     name="quarterId"
//                     value={quarterOptions.find(
//                       opt => opt.value === filters.quarterId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={quarterOptions}
//                     styles={selectStyles}
//                     placeholder="Select Quarter"
//                     isSearchable
//                     isClearable
//                     isDisabled={!filters.financialYearId || loading.filters}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={2}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Institution Type *
//                   </Label>
//                   <Select
//                     name="institutionTypeId"
//                     value={institutionTypeOptions.find(
//                       opt => opt.value === filters.institutionTypeId
//                     )}
//                     onChange={handleSelectFilterChange}
//                     options={institutionTypeOptions}
//                     styles={selectStyles}
//                     placeholder="Select Type"
//                     isSearchable
//                     isClearable
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={3}>
//                 <FormGroup className="mb-0">
//                   <Label className="form-label-sm fw-medium mb-1">
//                     Place of Working *
//                   </Label>
//                   <Select
//                     name="workingPlaceId"
//                     value={getWorkingPlaceValue}
//                     onChange={handleSelectFilterChange}
//                     options={filterPlaceOfWorkingOptions}
//                     styles={selectStyles}
//                     placeholder={
//                       !filters.institutionTypeId
//                         ? "Select Institution Type first"
//                         : filteredPlaces.length === 0
//                         ? "Loading places..."
//                         : "Select Place"
//                     }
//                     isSearchable
//                     isClearable
//                     isDisabled={!filters.institutionTypeId}
//                   />
//                 </FormGroup>
//               </Col>

//               <Col md={1}>
//                 <Button
//                   style={{ marginTop: "28px" }}
//                   color="primary"
//                   className="w-100"
//                   onClick={handleSearch}
//                   disabled={loading.data || !areFiltersComplete}
//                 >
//                   {loading.data ? (
//                     <Spinner size="sm" />
//                   ) : (
//                     <>
//                       <i className="bx bx-search me-1"></i>
//                       Search
//                     </>
//                   )}
//                 </Button>
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>
//         {loading.data ? (
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//             <p className="mt-3 text-muted">Loading drug groups...</p>
//           </div>
//         ) : allocationForms.length > 0 &&
//           areFiltersComplete &&
//           !isPlaceOfWorkingCleared ? (
//           <>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0 text-dark">Drug Groups</h5>
//               <div className="d-flex gap-2">
//                 <Button
//                   disabled={
//                     budgetButtons.freeze_display === false ? true : false
//                   }
//                   color="danger"
//                   onClick={() => setFreezeModal(true)}
//                   className="d-flex align-items-center"
//                 >
//                   <i className="bx bx-lock me-1"></i>
//                   Freeze
//                 </Button>
//                 <Button
//                   disabled={
//                     budgetButtons.transfer_display === false ? true : false
//                   }
//                   color="warning"
//                   onClick={() => setBudgetTransferModal(true)}
//                   className="d-flex align-items-center"
//                 >
//                   <i className="bx bx-transfer me-1"></i>
//                   Budget Transfer
//                 </Button>
//                 <Button
//                   color="info"
//                   onClick={() => setDvahoFreezeModal(true)}
//                   className="d-flex align-items-center"
//                   disabled={!filters.financialYearId || !filters.schemeId || !filters.quarterId}
//                 >
//                   <i className="bx bx-lock-alt me-1"></i>
//                   DVAHO Freeze
//                 </Button>
//               </div>
//             </div>
//             <Row>
//               {allocationForms.map((item, index) => (
//                 <Col
//                   xl="2"
//                   lg="3"
//                   md="4"
//                   sm="6"
//                   xs="6"
//                   key={item._id || index}
//                   className="mb-3"
//                 >
//                   <Card
//                     className="h-100 border-0 shadow-sm hover-lift cursor-pointer transition-all"
//                     onClick={() => handleDrugClick(item)}
//                     style={{
//                       cursor: item.utilised === false ? "pointer" : "default",
//                       backgroundColor:
//                         item.utilised === true ? "#d2d2d2" : "white",
//                       opacity: item.utilised === true ? 0.9 : 1,
//                     }}
//                   >
//                     <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                       <div className="mb-3">
//                         <div
//                           className="position-relative mx-auto"
//                           style={{ width: 70, height: 70 }}
//                         >
//                           <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center border">
//                             {item.image ? (
//                               <img
//                                 src={`${URLS.Base}${item.image}`}
//                                 alt={item?.group || "Drug Group"}
//                                 className="img-fluid"
//                                 style={{
//                                   maxWidth: "100%",
//                                   maxHeight: "100%",
//                                   objectFit: "contain",
//                                 }}
//                                 onError={e => {
//                                   e.target.src =
//                                     "https://via.placeholder.com/80?text=No+Image"
//                                 }}
//                               />
//                             ) : (
//                               <div className="text-primary">
//                                 <i
//                                   className="bx bx-package"
//                                   style={{ fontSize: "1.75rem" }}
//                                 ></i>
//                               </div>
//                             )}
//                           </div>
//                           {item.utilisedBudgetPercent != null && (
//                             <div className="position-absolute top-0 end-0">
//                               <span className="badge bg-danger rounded-pill">
//                                 {item.utilisedBudgetPercent}%
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div>
//                         <h6 className="text-dark fw-semibold mb-1 text-truncate">
//                           {item?.group || "Unnamed Group"}
//                         </h6>
//                         {item.description && (
//                           <p
//                             className="text-muted small mb-0 text-truncate-2"
//                             style={{ height: "2.5em" }}
//                           >
//                             {item.description}
//                           </p>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </>
//         ) : (
//           <Card>
//             <CardBody>
//               <div className="text-center py-5">
//                 <div className="mb-3">
//                   <i className="bx bx-package display-4 text-muted"></i>
//                 </div>
//                 <h5 className="text-muted mb-2">No Drug Groups Found</h5>
//                 <p className="text-muted mb-3">
//                   {!areFiltersComplete
//                     ? "Please select all required filters to view drug groups"
//                     : isPlaceOfWorkingCleared
//                     ? "Please select Place of Working to view drug groups"
//                     : "No drug groups available for the selected filters"}
//                 </p>
//                 <Button
//                   color="primary"
//                   size="sm"
//                   onClick={resetFilters}
//                   className="me-2"
//                 >
//                   <i className="bx bx-refresh me-1"></i>
//                   Reset Filters
//                 </Button>
//               </div>
//             </CardBody>
//           </Card>
//         )}

//         <h5 className="mb-3 text-dark">Group Reports</h5>
//         <Row>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/groups-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//             <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/district-wise-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     District Wise DVAHO Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>


//     <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/group-wise-district-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Group Wise District Indent Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>


//             <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/district-wise-abstract"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                      District Wise Abstract Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//   <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/district-wise-inst-count"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                      District Wise Institution Count Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>
//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/drugs-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution-wise Drug Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/placeofworking-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution Progress Reports
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/drug-wise-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">Drug Report</h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/abstract-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Institution Progress Abstract
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>

//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/inventory-management"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Inventory Management
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>


//           <Col xl="2" lg="3" md="4" sm="6" xs="6" className="mb-3">
//             <Link
//               to="/detailed-drug-report"
//               className="text-decoration-none"
//               onClick={handleReportsClick}
//             >
//               <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
//                 <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
//                   <div className="mb-3">
//                     <div
//                       className="bg-soft-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
//                       style={{ width: 70, height: 70 }}
//                     >
//                       <i
//                         className="bx bx-file text-primary"
//                         style={{ fontSize: "2rem" }}
//                       ></i>
//                     </div>
//                   </div>
//                   <h6 className="text-dark fw-semibold mb-0">
//                     Detailed Drug Report
//                   </h6>
//                 </CardBody>
//               </Card>
//             </Link>
//           </Col>
//         </Row>
//       </div>

//       {/* Budget Transfer Modal */}
//       <Modal
//         isOpen={budgetTransferModal}
//         toggle={() => setBudgetTransferModal(false)}
//         centered
//       >
//         <ModalHeader toggle={() => setBudgetTransferModal(false)}>
//           Confirm Budget Transfer
//         </ModalHeader>
//         <ModalBody>
//           <p className="mb-3">
//             Are you sure you want to transfer budget for the selected criteria?
//             This action cannot be undone.
//           </p>
//           <div className="mb-3">
//             <strong>Selected Filters:</strong>
//             <div className="mt-2">
//               <small className="text-muted">
//                 Financial Year:{" "}
//                 {financialYearOptions.find(
//                   opt => opt.value === filters.financialYearId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Scheme:{" "}
//                 {schemeOptions.find(opt => opt.value === filters.schemeId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Quarter:{" "}
//                 {quarterOptions.find(opt => opt.value === filters.quarterId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Institution Type:{" "}
//                 {institutionTypeOptions.find(
//                   opt => opt.value === filters.institutionTypeId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Place of Working:{" "}
//                 {filterPlaceOfWorkingOptions.find(
//                   opt => opt.value === filters.workingPlaceId
//                 )?.label || "Not selected"}
//               </small>
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             onClick={() => setBudgetTransferModal(false)}
//           >
//             Cancel
//           </Button>
//           <Button color="warning" onClick={handleBudgetTransfer}>
//             Confirm Budget Transfer
//           </Button>
//         </ModalFooter>
//       </Modal>

//       {/* Freeze Modal */}
//       <Modal isOpen={freezeModal} toggle={() => setFreezeModal(false)} centered>
//         <ModalHeader toggle={() => setFreezeModal(false)}>
//           Confirm Freeze
//         </ModalHeader>
//         <ModalBody>
//           <p className="mb-3">
//             Are you sure you want to freeze the selected drug groups? This
//             action cannot be undone.
//           </p>
//           <div className="mb-3">
//             <strong>Selected Filters:</strong>
//             <div className="mt-2">
//               <small className="text-muted">
//                 Financial Year:{" "}
//                 {financialYearOptions.find(
//                   opt => opt.value === filters.financialYearId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Scheme:{" "}
//                 {schemeOptions.find(opt => opt.value === filters.schemeId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Quarter:{" "}
//                 {quarterOptions.find(opt => opt.value === filters.quarterId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Institution Type:{" "}
//                 {institutionTypeOptions.find(
//                   opt => opt.value === filters.institutionTypeId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Place of Working:{" "}
//                 {filterPlaceOfWorkingOptions.find(
//                   opt => opt.value === filters.workingPlaceId
//                 )?.label || "Not selected"}
//               </small>
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={() => setFreezeModal(false)}>
//             Cancel
//           </Button>
//           <Button color="danger" onClick={handleFreeze}>
//             Confirm Freeze
//           </Button>
//         </ModalFooter>
//       </Modal>

//       {/* DVAHO Freeze Modal */}
//       <Modal
//         isOpen={dvahoFreezeModal}
//         toggle={() => setDvahoFreezeModal(false)}
//         centered
//       >
//         <ModalHeader toggle={() => setDvahoFreezeModal(false)}>
//           Confirm DVAHO Freeze
//         </ModalHeader>
//         <ModalBody>
//           <p className="mb-3">
//             Are you sure you want to perform DVAHO Freeze? This action will freeze
//             all DVAHO-related drug form data for the selected criteria and cannot be undone.
//           </p>
//           <div className="mb-3">
//             <strong>Selected Filters for DVAHO Freeze:</strong>
//             <div className="mt-2">
//               <small className="text-muted">
//                 Financial Year:{" "}
//                 {financialYearOptions.find(
//                   opt => opt.value === filters.financialYearId
//                 )?.label || "Not selected"}{" "}
//                 <br />
//                 Scheme:{" "}
//                 {schemeOptions.find(opt => opt.value === filters.schemeId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 Quarter:{" "}
//                 {quarterOptions.find(opt => opt.value === filters.quarterId)
//                   ?.label || "Not selected"}{" "}
//                 <br />
//                 <div className="alert alert-info mt-2 mb-0 small">
//                   Note: DVAHO Freeze only requires Financial Year, Scheme, and Quarter.
//                   Institution Type and Place of Working are not required for this operation.
//                 </div>
//               </small>
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             onClick={() => setDvahoFreezeModal(false)}
//             disabled={loading.dvahoFreeze}
//           >
//             Cancel
//           </Button>
//           <Button 
//             color="info" 
//             onClick={handleDvahoFreeze}
//             disabled={loading.dvahoFreeze}
//           >
//             {loading.dvahoFreeze ? (
//               <>
//                 <Spinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : (
//               "Confirm DVAHO Freeze"
//             )}
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

// export default DrugIndent




import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Link, useHistory } from "react-router-dom"
import Select from "react-select"
import { URLS } from "../../Url"
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"

const DrugIndent = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
  const token = authUser?.token || ""
  const history = useHistory()
  const isInitialMount = useRef(true)

  const [budgetTransferModal, setBudgetTransferModal] = useState(false)
  const [freezeModal, setFreezeModal] = useState(false)
  const [dvahoFreezeModal, setDvahoFreezeModal] = useState(false)
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [employmentType, setEmploymentType] = useState([])
  const [allocationForms, setAllocationForms] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [budgetButtons, setBudgetButtons] = useState({})
  const [quarters, setQuarters] = useState([])
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState({
    filters: false,
    data: false,
    initialization: true,
    dvahoFreeze: false,
  })

  const getInitialFilters = () => ({
    institutionTypeId: localStorage.getItem("saved_institutionTypeId") || "",
    workingPlaceId: localStorage.getItem("saved_workingPlaceId") || "",
    financialYearId: localStorage.getItem("saved_financialYearId") || "",
    schemeId: localStorage.getItem("saved_schemeId") || "",
    quarterId: localStorage.getItem("saved_quarterId") || "",
  })

  const [filters, setFilters] = useState(getInitialFilters())

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(`saved_${key}`, value)
      } else {
        localStorage.removeItem(`saved_${key}`)
      }
    })
  }, [filters])

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

  const institutionTypeOptions = useMemo(
    () =>
      employmentType.map(type => ({
        value: type._id,
        label: type.name,
      })),
    [employmentType]
  )

  const filterPlaceOfWorkingOptions = useMemo(
    () =>
      filteredPlaces.map(place => ({
        value: place._id,
        label: place.name,
      })),
    [filteredPlaces]
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

  const financialYearOptions = useMemo(
    () =>
      financialYears.map(year => ({
        value: year._id,
        label: year.year,
      })),
    [financialYears]
  )

  const getWorkingPlaceValue = useMemo(() => {
    if (!filters.workingPlaceId || !filteredPlaces.length) {
      return null
    }

    const place = filteredPlaces.find(p => p._id === filters.workingPlaceId)
    return place ? { value: place._id, label: place.name } : null
  }, [filters.workingPlaceId, filteredPlaces])

  const fetchDrugIndents = useCallback(async () => {
    if (!token) return

    const requiredFilters = [
      "financialYearId",
      "institutionTypeId",
      "workingPlaceId",
      "schemeId",
      "quarterId",
    ]

    const missingFilters = requiredFilters.filter(key => !filters[key])

    if (missingFilters.length > 0) {
      setAllocationForms([])
      return
    }

    setLoading(prev => ({ ...prev, data: true }))

    try {
      const response = await axios.post(URLS.GetAllocationFormFilter, filters, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      })

      setBudgetButtons(response.data || {})
      
      // Get forms from response - filter out forms with budget = 0
      const forms = response.data?.data?.[0]?.forms || []
      
      // Filter forms to only show those with budget > 0
      const filteredForms = forms.filter(form => {
        // Convert budget to number and check if it's greater than 0
        const budget = Number(form.budget) || 0
        return budget > 0
      })
      
      setAllocationForms(filteredForms)

      if (filteredForms.length === 0) {
        // Check if there were forms with budget = 0
        if (forms.length > 0) {
          toast.info("No drug groups with allocated budget found for the selected filters")
        } else {
          toast.info("No drug groups found with the selected filters")
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load drug indents"
      toast.error(message)
      setAllocationForms([])
    } finally {
      setLoading(prev => ({ ...prev, data: false }))
    }
  }, [token, filters])

  const fetchEmploymentType = useCallback(async () => {
    if (!token) return

    try {
      const response = await axios.get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      })

      if (response.data?.data) {
        const employmentTypes = response.data.data
        setEmploymentType(employmentTypes)
        if (filters.institutionTypeId) {
          await fetchPlaceOfWorking(filters.institutionTypeId)
        }
      }
    } catch (error) {
      console.error("Error fetching employment types:", error)
      toast.error("Failed to load employment types")
    }
  }, [token, filters.institutionTypeId])

  const fetchPlaceOfWorking = useCallback(
    async institutionTypeId => {
      if (!token || !institutionTypeId) {
        setFilteredPlaces([])
        return
      }

      try {
        const response = await axios.post(
          URLS.GetInstitutionBygetPlaceOfWorking,
          { institutionTypeId },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        )

        const places = response.data?.data || []
        setFilteredPlaces(places)
      } catch (error) {
        console.error("Error fetching places of working:", error)
        toast.error("Failed to load places of working")
        setFilteredPlaces([])
      }
    },
    [token]
  )

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
        const years = response.data.data
        setFinancialYears(years)
      }
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error("Failed to fetch financial years")
    }
  }, [token])

  const fetchSchemesAndQuarters = useCallback(
    async financialYearId => {
      if (!token || !financialYearId) {
        setSchemes([])
        setQuarters([])
        return
      }

      setLoading(prev => ({ ...prev, filters: true }))

      try {
        const response = await axios.post(
          URLS.GetScheme,
          { financialYearId },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        )

        if (response.data) {
          const schemesData = response.data.schemes || []
          const quartersData = response.data.quarters || []

          setSchemes(schemesData)
          setQuarters(quartersData)
        }
      } catch (error) {
        console.error("Error fetching schemes and quarters:", error)
        toast.error("Failed to load schemes and quarters")
        setSchemes([])
        setQuarters([])
      } finally {
        setLoading(prev => ({ ...prev, filters: false }))
      }
    },
    [token]
  )

  const handleSearch = () => {
    if (
      !filters.financialYearId ||
      !filters.institutionTypeId ||
      !filters.workingPlaceId ||
      !filters.schemeId ||
      !filters.quarterId
    ) {
      toast.warning("Please select all required filters")
      return
    }
    fetchDrugIndents()
  }

  const handleSelectFilterChange = async (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    if (name === "institutionTypeId") {
      setFilters(prev => ({
        ...prev,
        institutionTypeId: value,
        workingPlaceId: "",
      }))

      setFilteredPlaces([])

      if (value) {
        await fetchPlaceOfWorking(value)
      }
    } else if (name === "financialYearId") {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        schemeId: "",
        quarterId: "",
      }))

      if (value) {
        fetchSchemesAndQuarters(value)
      } else {
        setSchemes([])
        setQuarters([])
      }
    } else {
      setFilters(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDrugClick = data => {
    const formData = {
      FormId: data._id,
      institutionTypeId: filters.institutionTypeId,
      workingPlaceId: filters.workingPlaceId,
      financialYearId: filters.financialYearId,
      schemeId: filters.schemeId,
      quarterId: filters.quarterId,
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value)
      } else {
        localStorage.removeItem(key)
      }
    })

    if (data.utilised === false) {
      history.push("groups")
    }
  }

  const resetFilters = () => {
    const clearedFilters = {
      institutionTypeId: "",
      workingPlaceId: "",
      financialYearId: "",
      schemeId: "",
      quarterId: "",
    }
    setFilters(clearedFilters)
    setAllocationForms([])
    setFilteredPlaces([])
    setSchemes([])
    setQuarters([])
    const itemsToClear = [
      "saved_institutionTypeId",
      "saved_workingPlaceId",
      "saved_financialYearId",
      "saved_schemeId",
      "saved_quarterId",
      "institutionTypeId",
      "workingPlaceId",
      "financialYearId",
      "schemeId",
      "quarterId",
      "FormId",
    ]
    itemsToClear.forEach(item => localStorage.removeItem(item))
    toast.info("Filters reset successfully")
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  // Handle DVAHO Freeze
  const handleDvahoFreeze = async () => {
    if (!filters.financialYearId || !filters.schemeId || !filters.quarterId) {
      toast.warning("Please select Financial Year, Scheme, and Quarter for DVAHO Freeze")
      return
    }

    setLoading(prev => ({ ...prev, dvahoFreeze: true }))

    try {
      const requestData = {
        financialYearId: filters.financialYearId,
        schemeId: filters.schemeId,
        quarterId: filters.quarterId,
        workingPlaceId: filters.workingPlaceId,
      }

      const response = await axios.post(
        URLS.DVAHOfreezeDrugFormData,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (response.status === 200) {
        toast.success("DVAHO Freeze completed successfully")
        setDvahoFreezeModal(false)
        // Refresh the data to reflect changes
        fetchDrugIndents()
      }
    } catch (error) {
      console.error("Error in DVAHO Freeze:", error)
      toast.error(
        error.response?.data?.message || "Failed to complete DVAHO Freeze"
      )
    } finally {
      setLoading(prev => ({ ...prev, dvahoFreeze: false }))
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      setLoading(prev => ({ ...prev, initialization: true }))
      try {
        await Promise.all([fetchEmploymentType(), fetchFinancialYears()])
        if (filters.financialYearId) {
          await fetchSchemesAndQuarters(filters.financialYearId)
        }
      } catch (error) {
        console.error("Error initializing data:", error)
        toast.error("Failed to initialize application data")
      } finally {
        setLoading(prev => ({ ...prev, initialization: false }))
      }
    }
    initializeData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (
        filters.financialYearId &&
        filters.institutionTypeId &&
        filters.workingPlaceId &&
        filters.schemeId &&
        filters.quarterId
      ) {
        await fetchDrugIndents()
      }
    }
    const debounceTimer = setTimeout(fetchData, 500)
    return () => clearTimeout(debounceTimer)
  }, [
    filters.financialYearId,
    filters.institutionTypeId,
    filters.workingPlaceId,
    filters.schemeId,
    filters.quarterId,
  ])

  const handleFreeze = async () => {
    try {
      const filterParams = {
        workingPlaceId: filters.workingPlaceId,
        financialYearId: filters.financialYearId,
        schemeId: filters.schemeId,
        quarterId: filters.quarterId,
        institutionTypeId: filters.institutionTypeId,
      }

      const response = await axios.post(URLS.freezeGroup, filterParams, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success("Freeze Updated Successfully")
        setFreezeModal(false)
        fetchDrugIndents()
      }
    } catch (error) {
      console.error("Error Freeze Updated:", error)
      toast.error(error.response?.data?.message || "Failed to Freeze Updated")
    }
  }

  const handleBudgetTransfer = async () => {
    try {
      const filterParams = {
        workingPlaceId: filters.workingPlaceId,
        financialYearId: filters.financialYearId,
        schemeId: filters.schemeId,
        quarterId: filters.quarterId,
        institutionTypeId: filters.institutionTypeId,
      }

      const response = await axios.post(URLS.BugetTransfer, filterParams, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success("Budget Transfer Updated Successfully")
        setBudgetTransferModal(false)
        fetchDrugIndents()
      }
    } catch (error) {
      console.error("Error Budget Transfer Updated:", error)
      toast.error(
        error.response?.data?.message || "Failed to Budget Transfer Updated"
      )
    }
  }

  if (loading.initialization) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <div className="text-center">
              <Spinner color="primary" />
              <p className="mt-2 text-muted">Loading application data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const areFiltersComplete = Boolean(
    filters.financialYearId &&
      filters.institutionTypeId &&
      filters.workingPlaceId &&
      filters.schemeId &&
      filters.quarterId
  )

  const isPlaceOfWorkingCleared = !filters.workingPlaceId

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Card className="mb-2 border-0 shadow-sm">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="text-primary mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Filters
                </h5>
              </div>
              <div className="d-flex gap-2">
                <Button
                  color="outline-secondary"
                  size="sm"
                  onClick={resetFilters}
                  className="px-3"
                  disabled={loading.data}
                >
                  <i className="bx bx-reset me-1"></i>
                  Reset Filters
                </Button>
              </div>
            </div>

            <Row className="g-3">
              <Col md={2}>
                <FormGroup className="mb-0">
                  <Label className="form-label-sm fw-medium mb-1">
                    Financial Year *
                  </Label>
                  <Select
                    name="financialYearId"
                    value={financialYearOptions.find(
                      opt => opt.value === filters.financialYearId
                    )}
                    onChange={handleSelectFilterChange}
                    options={financialYearOptions}
                    styles={selectStyles}
                    placeholder="Select Year"
                    isSearchable
                    isClearable
                    isLoading={loading.filters}
                  />
                </FormGroup>
              </Col>

              <Col md={2}>
                <FormGroup className="mb-0">
                  <Label className="form-label-sm fw-medium mb-1">
                    Scheme *
                  </Label>
                  <Select
                    name="schemeId"
                    value={schemeOptions.find(
                      opt => opt.value === filters.schemeId
                    )}
                    onChange={handleSelectFilterChange}
                    options={schemeOptions}
                    styles={selectStyles}
                    placeholder="Select Scheme"
                    isSearchable
                    isClearable
                    isDisabled={!filters.financialYearId || loading.filters}
                  />
                </FormGroup>
              </Col>

              <Col md={2}>
                <FormGroup className="mb-0">
                  <Label className="form-label-sm fw-medium mb-1">
                    Quarter *
                  </Label>
                  <Select
                    name="quarterId"
                    value={quarterOptions.find(
                      opt => opt.value === filters.quarterId
                    )}
                    onChange={handleSelectFilterChange}
                    options={quarterOptions}
                    styles={selectStyles}
                    placeholder="Select Quarter"
                    isSearchable
                    isClearable
                    isDisabled={!filters.financialYearId || loading.filters}
                  />
                </FormGroup>
              </Col>

              <Col md={2}>
                <FormGroup className="mb-0">
                  <Label className="form-label-sm fw-medium mb-1">
                    Institution Type *
                  </Label>
                  <Select
                    name="institutionTypeId"
                    value={institutionTypeOptions.find(
                      opt => opt.value === filters.institutionTypeId
                    )}
                    onChange={handleSelectFilterChange}
                    options={institutionTypeOptions}
                    styles={selectStyles}
                    placeholder="Select Type"
                    isSearchable
                    isClearable
                  />
                </FormGroup>
              </Col>

              <Col md={3}>
                <FormGroup className="mb-0">
                  <Label className="form-label-sm fw-medium mb-1">
                    Place of Working *
                  </Label>
                  <Select
                    name="workingPlaceId"
                    value={getWorkingPlaceValue}
                    onChange={handleSelectFilterChange}
                    options={filterPlaceOfWorkingOptions}
                    styles={selectStyles}
                    placeholder={
                      !filters.institutionTypeId
                        ? "Select Institution Type first"
                        : filteredPlaces.length === 0
                        ? "Loading places..."
                        : "Select Place"
                    }
                    isSearchable
                    isClearable
                    isDisabled={!filters.institutionTypeId}
                  />
                </FormGroup>
              </Col>

              <Col md={1}>
                <Button
                  style={{ marginTop: "28px" }}
                  color="primary"
                  className="w-100"
                  onClick={handleSearch}
                  disabled={loading.data || !areFiltersComplete}
                >
                  {loading.data ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <i className="bx bx-search me-1"></i>
                      Search
                    </>
                  )}
                </Button>
              </Col>
            </Row>
            
          </CardBody>
        </Card>
        {loading.data ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-3 text-muted">Loading drug groups...</p>
          </div>
        ) : allocationForms.length > 0 &&
          areFiltersComplete &&
          !isPlaceOfWorkingCleared ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 text-dark">Drug Groups with Allocated Budget</h5>
              <div className="d-flex gap-2">
                <Button
                  disabled={
                    budgetButtons.freeze_display === false ? true : false
                  }
                  color="danger"
                  onClick={() => setFreezeModal(true)}
                  className="d-flex align-items-center"
                >
                  <i className="bx bx-lock me-1"></i>
                  Freeze
                </Button>
                <Button
                  disabled={
                    budgetButtons.transfer_display === false ? true : false
                  }
                  color="warning"
                  onClick={() => setBudgetTransferModal(true)}
                  className="d-flex align-items-center"
                >
                  <i className="bx bx-transfer me-1"></i>
                  Budget Transfer
                </Button>
                <Button
                  color="info"
                  onClick={() => setDvahoFreezeModal(true)}
                  className="d-flex align-items-center"
                  disabled={!filters.financialYearId || !filters.schemeId || !filters.quarterId}
                >
                  <i className="bx bx-lock-alt me-1"></i>
                  DVAHO Freeze
                </Button>
              </div>
            </div>
            <Row>
              {allocationForms.map((item, index) => {
                // Format budget for display
                const budget = Number(item.budget) || 0
                const formattedBudget = budget.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
                
                return (
                  <Col
                    xl="2"
                    lg="3"
                    md="4"
                    sm="6"
                    xs="6"
                    key={item._id || index}
                    className="mb-3"
                  >
                    <Card
                      className="h-100 border-0 shadow-sm hover-lift cursor-pointer transition-all"
                      onClick={() => handleDrugClick(item)}
                      style={{
                        cursor: item.utilised === false ? "pointer" : "default",
                        backgroundColor:
                          item.utilised === true ? "#d2d2d2" : "white",
                        opacity: item.utilised === true ? 0.9 : 1,
                      }}
                    >
                      <CardBody className="p-3 text-center d-flex flex-column justify-content-between">
                        <div className="mb-3">
                          <div
                            className="position-relative mx-auto"
                            style={{ width: 70, height: 70 }}
                          >
                            <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center border">
                              {item.image ? (
                                <img
                                  src={`${URLS.Base}${item.image}`}
                                  alt={item?.group || "Drug Group"}
                                  className="img-fluid"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                  }}
                                  onError={e => {
                                    e.target.src =
                                      "https://via.placeholder.com/80?text=No+Image"
                                  }}
                                />
                              ) : (
                                <div className="text-primary">
                                  <i
                                    className="bx bx-package"
                                    style={{ fontSize: "1.75rem" }}
                                  ></i>
                                </div>
                              )}
                            </div>
                            {item.utilisedBudgetPercent != null && (
                              <div className="position-absolute top-0 end-0">
                                <span className="badge bg-danger rounded-pill">
                                  {item.utilisedBudgetPercent}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h6 className="text-dark fw-semibold mb-1 text-truncate">
                            {item?.group || "Unnamed Group"}
                            <br />
                            {item?.formName}
                            {/* {item.formName && (
                              <p
                                className="text-muted small mb-0 text-truncate-2"
                                style={{ height: "2.5em" }}
                              >
                                {item.formName}
                              </p>
                            )} */}
                          </h6>

                          <div className="mb-2">
                            <small className="text-success fw-bold fs-5">
                              Budget: {formattedBudget}
                            </small>
                            {/* <br/>
                            <small className="text-success fw-bold fs-6">
                              Budget: {formattedBudget}
                            </small> */}
                          </div>
                          
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </>
        ) : (
          <Card>
            <CardBody>
            <div className="d-flex gap-2 justify-content-end ">
              <Button
                disabled={
                  budgetButtons.freeze_display === false ? true : false
                }
                color="danger"
                onClick={() => setFreezeModal(true)}
                className="d-flex align-items-center"
              >
                <i className="bx bx-lock me-1"></i>
                Freeze
              </Button>
              <Button
                disabled={
                  budgetButtons.transfer_display === false ? true : false
                }
                color="warning"
                onClick={() => setBudgetTransferModal(true)}
                className="d-flex align-items-center"
              >
                <i className="bx bx-transfer me-1"></i>
                Budget Transfer
              </Button>
              <Button
                color="info"
                onClick={() => setDvahoFreezeModal(true)}
                className="d-flex align-items-center"
                disabled={!filters.financialYearId || !filters.schemeId || !filters.quarterId}
              >
                <i className="bx bx-lock-alt me-1"></i>
                DVAHO Freeze
              </Button>
            </div>
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bx bx-package display-4 text-muted"></i>
                </div>
                <h5 className="text-muted mb-2">No Drug Groups Found</h5>
                <p className="text-muted mb-3">
                  {!areFiltersComplete
                    ? "Please select all required filters to view drug groups"
                    : isPlaceOfWorkingCleared
                    ? "Please select Place of Working to view drug groups"
                    : "No drug groups with allocated budget available for the selected filters"}
                </p>
                <Button
                  color="primary"
                  size="sm"
                  onClick={resetFilters}
                  className="me-2"
                >
                  <i className="bx bx-refresh me-1"></i>
                  Reset Filters
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/*
        <div className="text-center mt-4">
          <Link to="/reports" className="btn btn-primary">
            <i className="bx bx-bar-chart-alt me-2"></i>
            View All Reports
          </Link>
        </div> */}
      </div>

      {/* Budget Transfer Modal */}
      <Modal
        isOpen={budgetTransferModal}
        toggle={() => setBudgetTransferModal(false)}
        centered
      >
        <ModalHeader toggle={() => setBudgetTransferModal(false)}>
          Confirm Budget Transfer
        </ModalHeader>
        <ModalBody>
          <p className="mb-3">
            Are you sure you want to transfer budget for the selected criteria?
            This action cannot be undone.
          </p>
          <div className="mb-3">
            <strong>Selected Filters:</strong>
            <div className="mt-2">
              <small className="text-muted">
                Financial Year:{" "}
                {financialYearOptions.find(
                  opt => opt.value === filters.financialYearId
                )?.label || "Not selected"}{" "}
                <br />
                Scheme:{" "}
                {schemeOptions.find(opt => opt.value === filters.schemeId)
                  ?.label || "Not selected"}{" "}
                <br />
                Quarter:{" "}
                {quarterOptions.find(opt => opt.value === filters.quarterId)
                  ?.label || "Not selected"}{" "}
                <br />
                Institution Type:{" "}
                {institutionTypeOptions.find(
                  opt => opt.value === filters.institutionTypeId
                )?.label || "Not selected"}{" "}
                <br />
                Place of Working:{" "}
                {filterPlaceOfWorkingOptions.find(
                  opt => opt.value === filters.workingPlaceId
                )?.label || "Not selected"}
              </small>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setBudgetTransferModal(false)}
          >
            Cancel
          </Button>
          <Button color="warning" onClick={handleBudgetTransfer}>
            Confirm Budget Transfer
          </Button>
        </ModalFooter>
      </Modal>

      {/* Freeze Modal */}
      <Modal isOpen={freezeModal} toggle={() => setFreezeModal(false)} centered>
        <ModalHeader toggle={() => setFreezeModal(false)}>
          Confirm Freeze
        </ModalHeader>
        <ModalBody>
          <p className="mb-3">
            Are you sure you want to freeze the selected drug groups? This
            action cannot be undone.
          </p>
          <div className="mb-3">
            <strong>Selected Filters:</strong>
            <div className="mt-2">
              <small className="text-muted">
                Financial Year:{" "}
                {financialYearOptions.find(
                  opt => opt.value === filters.financialYearId
                )?.label || "Not selected"}{" "}
                <br />
                Scheme:{" "}
                {schemeOptions.find(opt => opt.value === filters.schemeId)
                  ?.label || "Not selected"}{" "}
                <br />
                Quarter:{" "}
                {quarterOptions.find(opt => opt.value === filters.quarterId)
                  ?.label || "Not selected"}{" "}
                <br />
                Institution Type:{" "}
                {institutionTypeOptions.find(
                  opt => opt.value === filters.institutionTypeId
                )?.label || "Not selected"}{" "}
                <br />
                Place of Working:{" "}
                {filterPlaceOfWorkingOptions.find(
                  opt => opt.value === filters.workingPlaceId
                )?.label || "Not selected"}
              </small>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setFreezeModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleFreeze}>
            Confirm Freeze
          </Button>
        </ModalFooter>
      </Modal>

      {/* DVAHO Freeze Modal */}
      <Modal
        isOpen={dvahoFreezeModal}
        toggle={() => setDvahoFreezeModal(false)}
        centered
      >
        <ModalHeader toggle={() => setDvahoFreezeModal(false)}>
          Confirm DVAHO Freeze
        </ModalHeader>
        <ModalBody>
          <p className="mb-3">
            Are you sure you want to perform DVAHO Freeze? This action will freeze
            all DVAHO-related drug form data for the selected criteria and cannot be undone.
          </p>
          <div className="mb-3">
            <strong>Selected Filters for DVAHO Freeze:</strong>
            <div className="mt-2">
              <small className="text-muted">
                Financial Year:{" "}
                {financialYearOptions.find(
                  opt => opt.value === filters.financialYearId
                )?.label || "Not selected"}{" "}
                <br />
                Scheme:{" "}
                {schemeOptions.find(opt => opt.value === filters.schemeId)
                  ?.label || "Not selected"}{" "}
                <br />
                Quarter:{" "}
                {quarterOptions.find(opt => opt.value === filters.quarterId)
                  ?.label || "Not selected"}{" "}
                <br />
                Working Place:{" "}
                {filterPlaceOfWorkingOptions.find(
                  opt => opt.value === filters.workingPlaceId
                )?.label || "Not selected"}{" "}
                <br />
                <div className="alert alert-info mt-2 mb-0 small">
                  Note: DVAHO Freeze only requires Financial Year, Scheme, and Quarter.
                  Institution Type and Place of Working are not required for this operation.
                </div>
              </small>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setDvahoFreezeModal(false)}
            disabled={loading.dvahoFreeze}
          >
            Cancel
          </Button>
          <Button 
            color="info" 
            onClick={handleDvahoFreeze}
            disabled={loading.dvahoFreeze}
          >
            {loading.dvahoFreeze ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Confirm DVAHO Freeze"
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

export default DrugIndent
