// import React, { useEffect, useState, useCallback } from "react"
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Button,
//   Label,
//   FormGroup,
//   Input,
// } from "reactstrap"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer, toast } from "react-toastify"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import axios from "axios"

// const DvahoTesting = () => {
//   // Get token from localStorage
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = JSON.parse(GetAuth)
//   const token = TokenJson?.token

//   // State for dropdowns
//   const [financialYears, setFinancialYears] = useState([])
//   const [quarters, setQuarters] = useState([])
//   const [schemes, setSchemes] = useState([])
//   const [workingPlaces, setWorkingPlaces] = useState([])
//   const [institutionTypes, setInstitutionTypes] = useState([])

//   // State for loading
//   const [loading, setLoading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // State for form values
//   const [formData, setFormData] = useState({
//     financialYearId: "",
//     quarterId: "",
//     schemeId: "",
//     workingPlaceId: "",
//     institutionTypeId: "",
//     amount: "0",
//   })

//   // React-select styles
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

//   // Fetch Financial Years - FIXED: Using POST method
//   const fetchFinancialYears = useCallback(async () => {
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
//         const options = response.data.data.map(item => ({
//           value: item._id,
//           label: item.year || item.financialYear,
//         }))
//         setFinancialYears(options)
//       }
//     } catch (error) {
//       console.error("Error fetching financial years:", error)
//       toast.error("Failed to load financial years")
//     }
//   }, [token])

//   // Fetch Quarters
//   const fetchQuarters = useCallback(async () => {
//     try {
//       const response = await axios.post(
//         URLS.GetQuarter,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 15000,
//         }
//       )
//       if (response.data?.data) {
//         const options = response.data.data.map(item => ({
//           value: item._id,
//           label: item.quarter,
//         }))
//         setQuarters(options)
//       }
//     } catch (error) {
//       console.error("Error fetching quarters:", error)
//       toast.error("Failed to load quarters")
//     }
//   }, [token])

//   // Fetch Schemes based on Financial Year
//   const fetchSchemes = useCallback(
//     async financialYearId => {
//       if (!financialYearId) {
//         setSchemes([])
//         return
//       }
//       try {
//         const response = await axios.post(
//           URLS.GetScheme,
//           { financialYearId },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             timeout: 15000,
//           }
//         )
//         if (response.data?.schemes) {
//           const options = response.data.schemes.map(item => ({
//             value: item._id,
//             label: item.name,
//           }))
//           setSchemes(options)
//         }
//       } catch (error) {
//         console.error("Error fetching schemes:", error)
//         toast.error("Failed to load schemes")
//       }
//     },
//     [token]
//   )

//   // Fetch Institution Types
//   const fetchInstitutionTypes = useCallback(async () => {
//     try {
//       const response = await axios.get(URLS.GetEmploymentType, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 15000,
//       })
//       if (response.data?.data) {
//         const options = response.data.data.map(item => ({
//           value: item._id,
//           label: item.name,
//         }))
//         setInstitutionTypes(options)
//       }
//     } catch (error) {
//       console.error("Error fetching institution types:", error)
//       toast.error("Failed to load institution types")
//     }
//   }, [token])

//   // Fetch Working Places
//   const fetchWorkingPlaces = useCallback(async () => {
//     const institutionTypeId = "6948facbd22b3f8ef3ecf16e" 
//     try {
//       const response = await axios.post(
//         URLS.GetInstitutionBygetPlaceOfWorking,
//         { institutionTypeId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 15000,
//         }
//       )
//       if (response.data?.data) {
//         const options = response.data.data.map(item => ({
//           value: item._id,
//           label: item.name,
//         }))
//         setWorkingPlaces(options)
//       }
//     } catch (error) {
//       console.error("Error fetching working places:", error)
//       toast.error("Failed to load working places")
//     }
//   }, [token])

//   // Load initial data
//   useEffect(() => {
//     const initializeData = async () => {
//       setLoading(true)
//       try {
//         await Promise.all([
//           fetchFinancialYears(),
//           fetchQuarters(),
//           fetchInstitutionTypes(),
//           fetchWorkingPlaces(),
//         ])
//       } catch (error) {
//         console.error("Error initializing data:", error)
//         toast.error("Failed to initialize application data")
//       } finally {
//         setLoading(false)
//       }
//     }
//     initializeData()
//   }, [fetchFinancialYears, fetchQuarters, fetchInstitutionTypes, fetchWorkingPlaces])

//   // Fetch schemes when financial year changes
//   useEffect(() => {
//     if (formData.financialYearId) {
//       fetchSchemes(formData.financialYearId)
//     }
//   }, [formData.financialYearId, fetchSchemes])

//   // Handle dropdown change
//   const handleSelectChange = (selectedOption, { name }) => {
//     const value = selectedOption?.value || ""
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }))

//     // Reset scheme when financial year changes
//     if (name === "financialYearId") {
//       setFormData(prev => ({
//         ...prev,
//         schemeId: "",
//       }))
//     }
//   }

//   // Handle input change
//   const handleInputChange = e => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   // Submit form
//   const handleSubmit = async e => {
//     e.preventDefault()

//     // Validate all fields are filled
//     if (
//       !formData.financialYearId ||
//       !formData.quarterId ||
//       !formData.schemeId ||
//       !formData.workingPlaceId ||
//       !formData.institutionTypeId
//     ) {
//       toast.error("Please fill all required fields")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const response = await axios.post(
//         "https://api.vahdtelangana.com/v1/api/admin/checkWorkingPlaceAllocation",
//         {
//           financialYearId: formData.financialYearId,
//           quarterId: formData.quarterId,
//           schemeId: formData.schemeId,
//           workingPlaceId: formData.workingPlaceId,
//           institutionTypeId: formData.institutionTypeId,
//           amount: formData.amount,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           timeout: 30000,
//         }
//       )

//       if (response.status === 200) {
//         toast.success(response.data?.message || "Request successful!")
//         console.log("Response Data:", response.data)
        
//         // Log the response in a formatted way
//         console.table({
//           "Financial Year": financialYears.find(f => f.value === formData.financialYearId)?.label,
//           "Quarter": quarters.find(q => q.value === formData.quarterId)?.label,
//           "Scheme": schemes.find(s => s.value === formData.schemeId)?.label,
//           "Working Place": workingPlaces.find(w => w.value === formData.workingPlaceId)?.label,
//           "Institution Type": institutionTypes.find(i => i.value === formData.institutionTypeId)?.label,
//           "Amount": formData.amount,
//         })
//       }
//     } catch (error) {
//       console.error("Error:", error)
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message)
//       } else if (error.message) {
//         toast.error(error.message)
//       } else {
//         toast.error("Request failed")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Reset form
//   const handleReset = () => {
//     setFormData({
//       financialYearId: "",
//       quarterId: "",
//       schemeId: "",
//       workingPlaceId: "",
//       institutionTypeId: "",
//       amount: "0",
//     })
//     setSchemes([])
//     toast.info("Form reset successfully")
//   }

//   // Get selected value for react-select
//   const getSelectedOption = (options, value) => {
//     return options.find(opt => opt.value === value) || null
//   }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="VAHD Testing" breadcrumbItem="Check Working Place Allocation" />
//           <Row>
//             <Col lg={10} className="mx-auto">
//               <Card className="border-0 shadow-sm">
//                 <CardBody>
//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h5 className="mb-0 text-primary">
//                       <i className="bx bx-test-tube me-2"></i>
//                       Test Working Place Allocation
//                     </h5>
//                     <Button
//                       color="outline-secondary"
//                       size="sm"
//                       onClick={handleReset}
//                       disabled={isSubmitting}
//                     >
//                       <i className="bx bx-reset me-1"></i>
//                       Reset
//                     </Button>
//                   </div>
                  
//                   {loading ? (
//                     <div className="text-center p-5">
//                       <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                       <p className="mt-3 text-muted">Loading dropdown options...</p>
//                     </div>
//                   ) : (
//                     <form onSubmit={handleSubmit}>
//                       <Row className="g-3">
//                         <Col md={6}>
//                           <FormGroup>
//                             <Label className="fw-medium">
//                               Financial Year <span className="text-danger">*</span>
//                             </Label>
//                             <Select
//                               name="financialYearId"
//                               options={financialYears}
//                               value={getSelectedOption(financialYears, formData.financialYearId)}
//                               onChange={handleSelectChange}
//                               styles={selectStyles}
//                               placeholder="Select Financial Year"
//                               isClearable
//                               isSearchable
//                             />
//                             {financialYears.length === 0 && !loading && (
//                               <small className="text-muted">
//                                 No financial years available
//                               </small>
//                             )}
//                           </FormGroup>
//                         </Col>

//                         <Col md={6}>
//                           <FormGroup>
//                             <Label className="fw-medium">
//                               Quarter <span className="text-danger">*</span>
//                             </Label>
//                             <Select
//                               name="quarterId"
//                               options={quarters}
//                               value={getSelectedOption(quarters, formData.quarterId)}
//                               onChange={handleSelectChange}
//                               styles={selectStyles}
//                               placeholder="Select Quarter"
//                               isClearable
//                               isSearchable
//                             />
//                           </FormGroup>
//                         </Col>

//                         <Col md={6}>
//                           <FormGroup>
//                             <Label className="fw-medium">
//                               Scheme <span className="text-danger">*</span>
//                             </Label>
//                             <Select
//                               name="schemeId"
//                               options={schemes}
//                               value={getSelectedOption(schemes, formData.schemeId)}
//                               onChange={handleSelectChange}
//                               styles={selectStyles}
//                               placeholder="Select Scheme"
//                               isClearable
//                               isSearchable
//                               isDisabled={!formData.financialYearId}
//                             />
//                             {!formData.financialYearId && (
//                               <small className="text-muted">
//                                 Please select Financial Year first
//                               </small>
//                             )}
//                           </FormGroup>
//                         </Col>

//                         <Col md={6}>
//                           <FormGroup>
//                             <Label className="fw-medium">
//                               Institution Type <span className="text-danger">*</span>
//                             </Label>
//                             <Select
//                               name="institutionTypeId"
//                               options={institutionTypes}
//                               value={getSelectedOption(institutionTypes, formData.institutionTypeId)}
//                               onChange={handleSelectChange}
//                               styles={selectStyles}
//                               placeholder="Select Institution Type"
//                               isClearable
//                               isSearchable
//                             />
//                           </FormGroup>
//                         </Col>

//                         <Col md={6}>
//                           <FormGroup>
//                             <Label className="fw-medium">
//                               Place of Working <span className="text-danger">*</span>
//                             </Label>
//                             <Select
//                               name="workingPlaceId"
//                               options={workingPlaces}
//                               value={getSelectedOption(workingPlaces, formData.workingPlaceId)}
//                               onChange={handleSelectChange}
//                               styles={selectStyles}
//                               placeholder="Select Working Place"
//                               isClearable
//                               isSearchable
//                             />
//                           </FormGroup>
//                         </Col>

//                         <Col md={6}>
//                           <FormGroup>
//                             <Label className="fw-medium">
//                               Amount <span className="text-danger">*</span>
//                             </Label>
//                             <Input
//                               type="number"
//                               name="amount"
//                               value={formData.amount}
//                               onChange={handleInputChange}
//                               placeholder="Enter Amount"
//                               step="0.01"
//                               min="0"
//                               style={{
//                                 height: "40px",
//                                 fontSize: "14px",
//                                 borderRadius: "6px",
//                               }}
//                             />
//                           </FormGroup>
//                         </Col>
//                       </Row>

//                       <div className="text-end mt-4">
//                         <Button
//                           type="submit"
//                           color="primary"
//                           size="lg"
//                           disabled={isSubmitting}
//                           className="px-5"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <span className="spinner-border spinner-border-sm me-2" />
//                               Submitting...
//                             </>
//                           ) : (
//                             <>
//                               Submit Test <i className="bx bx-check-circle ms-2"></i>
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </form>
//                   )}
//                 </CardBody>
//               </Card>

//               {/* Info Card */}
//               <Card className="border-primary">
//                 <CardBody>
//                   <h6 className="text-primary mb-3">
//                     <i className="bx bx-info-circle me-2"></i>Testing Information
//                   </h6>
//                   <Row>
//                     <Col md={6}>
//                       <p className="mb-2 small">
//                         <strong>Endpoint:</strong>
//                       </p>
//                       <p className="mb-3 small text-muted">
//                         /api/admin/checkWorkingPlaceAllocation
//                       </p>
//                     </Col>
//                     <Col md={6}>
//                       <p className="mb-2 small">
//                         <strong>Method:</strong>
//                       </p>
//                       <p className="mb-3 small text-muted">POST</p>
//                     </Col>
//                   </Row>
//                   <p className="mb-0 small text-muted">
//                     This component is for testing the working place allocation API.
//                     Check the browser console for detailed response data and formatted output.
//                   </p>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//         />
//       </div>
//     </React.Fragment>
//   )
// }

// export default DvahoTesting


import React, { useEffect, useState, useCallback } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  FormGroup,
  Input,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import Select from "react-select"
import { URLS } from "../../Url"
import axios from "axios"

const DvahoTesting = () => {
  // Get token from localStorage
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const token = TokenJson?.token

  // State for dropdowns
  const [financialYears, setFinancialYears] = useState([])
  const [quarters, setQuarters] = useState([])
  const [schemes, setSchemes] = useState([])
  const [workingPlaces, setWorkingPlaces] = useState([])
  const [institutionTypes, setInstitutionTypes] = useState([])

  // State for loading
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for form values
  const [formData, setFormData] = useState({
    financialYearId: "",
    quarterId: "",
    schemeId: "",
    workingPlaceId: "",
    institutionTypeId: "",
    amount: "0",
  })

  // React-select styles
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

  // Fetch Financial Years
  const fetchFinancialYears = useCallback(async () => {
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
        const options = response.data.data.map(item => ({
          value: item._id,
          label: item.year || item.financialYear,
        }))
        setFinancialYears(options)
      }
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error("Failed to load financial years")
    }
  }, [token])

  // Fetch Quarters
  const fetchQuarters = useCallback(async () => {
    try {
      const response = await axios.post(
        URLS.GetQuarter,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      )
      if (response.data?.data) {
        const options = response.data.data.map(item => ({
          value: item._id,
          label: item.quarter,
        }))
        setQuarters(options)
      }
    } catch (error) {
      console.error("Error fetching quarters:", error)
      toast.error("Failed to load quarters")
    }
  }, [token])

  // Fetch Schemes based on Financial Year
  const fetchSchemes = useCallback(
    async financialYearId => {
      if (!financialYearId) {
        setSchemes([])
        return
      }
      try {
        const response = await axios.post(
          URLS.GetScheme,
          { financialYearId },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        )
        if (response.data?.schemes) {
          const options = response.data.schemes.map(item => ({
            value: item._id,
            label: item.name,
          }))
          setSchemes(options)
        }
      } catch (error) {
        console.error("Error fetching schemes:", error)
        toast.error("Failed to load schemes")
      }
    },
    [token]
  )

  // Fetch Institution Types
  const fetchInstitutionTypes = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      })
      if (response.data?.data) {
        const options = response.data.data.map(item => ({
          value: item._id,
          label: item.name,
        }))
        setInstitutionTypes(options)
      }
    } catch (error) {
      console.error("Error fetching institution types:", error)
      toast.error("Failed to load institution types")
    }
  }, [token])

  // ✅ FIXED: Fetch Working Places based on Institution Type ID
  const fetchWorkingPlaces = useCallback(
    async institutionTypeId => {
      if (!institutionTypeId) {
        setWorkingPlaces([])
        return
      }

      try {
        const response = await axios.post(
          URLS.GetInstitutionBygetPlaceOfWorking,
          { institutionTypeId }, // ✅ Now properly passing the institutionTypeId
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        )
        if (response.data?.data) {
          const options = response.data.data.map(item => ({
            value: item._id,
            label: item.name,
          }))
          setWorkingPlaces(options)
        }
      } catch (error) {
        console.error("Error fetching working places:", error)
        toast.error("Failed to load working places")
        setWorkingPlaces([])
      }
    },
    [token]
  )

  // Load initial data (without working places since it depends on institution type)
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchFinancialYears(),
          fetchQuarters(),
          fetchInstitutionTypes(),
        ])
      } catch (error) {
        console.error("Error initializing data:", error)
        toast.error("Failed to initialize application data")
      } finally {
        setLoading(false)
      }
    }
    initializeData()
  }, [fetchFinancialYears, fetchQuarters, fetchInstitutionTypes])

  // Fetch schemes when financial year changes
  useEffect(() => {
    if (formData.financialYearId) {
      fetchSchemes(formData.financialYearId)
    } else {
      setSchemes([])
    }
  }, [formData.financialYearId, fetchSchemes])

  // ✅ FIXED: Fetch working places when institution type changes
  useEffect(() => {
    if (formData.institutionTypeId) {
      fetchWorkingPlaces(formData.institutionTypeId)
    } else {
      setWorkingPlaces([])
    }
  }, [formData.institutionTypeId, fetchWorkingPlaces])

  // ✅ FIXED: Handle dropdown change with proper logic
  const handleSelectChange = (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    // Reset dependent fields based on the changed field
    if (name === "financialYearId") {
      setFormData(prev => ({
        ...prev,
        financialYearId: value,
        schemeId: "", // Reset scheme when financial year changes
      }))
    } else if (name === "institutionTypeId") {
      setFormData(prev => ({
        ...prev,
        institutionTypeId: value,
        workingPlaceId: "", // Reset working place when institution type changes
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle input change
  const handleInputChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Submit form
  const handleSubmit = async e => {
    e.preventDefault()

    // Validate all fields are filled
    if (
      !formData.financialYearId ||
      !formData.quarterId ||
      !formData.schemeId ||
      !formData.workingPlaceId ||
      !formData.institutionTypeId
    ) {
      toast.error("Please fill all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post(
        "https://api.vahdtelangana.com/v1/api/admin/checkWorkingPlaceAllocation",
        {
          financialYearId: formData.financialYearId,
          quarterId: formData.quarterId,
          schemeId: formData.schemeId,
          workingPlaceId: formData.workingPlaceId,
          institutionTypeId: formData.institutionTypeId,
          amount: formData.amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      )

      if (response.status === 200) {
        toast.success(response.data?.message || "Request successful!")
        console.log("Response Data:", response.data)

        // Log the response in a formatted way
        console.table({
          "Financial Year": financialYears.find(
            f => f.value === formData.financialYearId
          )?.label,
          Quarter: quarters.find(q => q.value === formData.quarterId)?.label,
          Scheme: schemes.find(s => s.value === formData.schemeId)?.label,
          "Working Place": workingPlaces.find(
            w => w.value === formData.workingPlaceId
          )?.label,
          "Institution Type": institutionTypes.find(
            i => i.value === formData.institutionTypeId
          )?.label,
          Amount: formData.amount,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error("Request failed")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      financialYearId: "",
      quarterId: "",
      schemeId: "",
      workingPlaceId: "",
      institutionTypeId: "",
      amount: "0",
    })
    setSchemes([])
    setWorkingPlaces([])
    toast.info("Form reset successfully")
  }

  // Get selected value for react-select
  const getSelectedOption = (options, value) => {
    return options.find(opt => opt.value === value) || null
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="VAHD Testing"
            breadcrumbItem="Check Working Place Allocation"
          />
          <Row>
            <Col lg={10} className="mx-auto">
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 text-primary">
                      <i className="bx bx-test-tube me-2"></i>
                      Test Working Place Allocation
                    </h5>
                    <Button
                      color="outline-secondary"
                      size="sm"
                      onClick={handleReset}
                      disabled={isSubmitting}
                    >
                      <i className="bx bx-reset me-1"></i>
                      Reset
                    </Button>
                  </div>

                  {loading ? (
                    <div className="text-center p-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">
                        Loading dropdown options...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <FormGroup>
                            <Label className="fw-medium">
                              Financial Year{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              name="financialYearId"
                              options={financialYears}
                              value={getSelectedOption(
                                financialYears,
                                formData.financialYearId
                              )}
                              onChange={handleSelectChange}
                              styles={selectStyles}
                              placeholder="Select Financial Year"
                              isClearable
                              isSearchable
                            />
                            {financialYears.length === 0 && !loading && (
                              <small className="text-muted">
                                No financial years available
                              </small>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label className="fw-medium">
                              Quarter <span className="text-danger">*</span>
                            </Label>
                            <Select
                              name="quarterId"
                              options={quarters}
                              value={getSelectedOption(
                                quarters,
                                formData.quarterId
                              )}
                              onChange={handleSelectChange}
                              styles={selectStyles}
                              placeholder="Select Quarter"
                              isClearable
                              isSearchable
                            />
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label className="fw-medium">
                              Scheme <span className="text-danger">*</span>
                            </Label>
                            <Select
                              name="schemeId"
                              options={schemes}
                              value={getSelectedOption(
                                schemes,
                                formData.schemeId
                              )}
                              onChange={handleSelectChange}
                              styles={selectStyles}
                              placeholder="Select Scheme"
                              isClearable
                              isSearchable
                              isDisabled={!formData.financialYearId}
                            />
                            {!formData.financialYearId && (
                              <small className="text-muted">
                                Please select Financial Year first
                              </small>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label className="fw-medium">
                              Institution Type{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              name="institutionTypeId"
                              options={institutionTypes}
                              value={getSelectedOption(
                                institutionTypes,
                                formData.institutionTypeId
                              )}
                              onChange={handleSelectChange}
                              styles={selectStyles}
                              placeholder="Select Institution Type"
                              isClearable
                              isSearchable
                            />
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label className="fw-medium">
                              Place of Working{" "}
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              name="workingPlaceId"
                              options={workingPlaces}
                              value={getSelectedOption(
                                workingPlaces,
                                formData.workingPlaceId
                              )}
                              onChange={handleSelectChange}
                              styles={selectStyles}
                              placeholder={
                                !formData.institutionTypeId
                                  ? "Select Institution Type first"
                                  : "Select Working Place"
                              }
                              isClearable
                              isSearchable
                              isDisabled={!formData.institutionTypeId}
                            />
                            {!formData.institutionTypeId && (
                              <small className="text-muted">
                                Please select Institution Type first
                              </small>
                            )}
                          </FormGroup>
                        </Col>

                        <Col md={6}>
                          <FormGroup>
                            <Label className="fw-medium">
                              Amount <span className="text-danger">*</span>
                            </Label>
                            <Input
                              type="number"
                              name="amount"
                              value={formData.amount}
                              onChange={handleInputChange}
                              placeholder="Enter Amount"
                              step="0.01"
                              min="0"
                              style={{
                                height: "40px",
                                fontSize: "14px",
                                borderRadius: "6px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="text-end mt-4">
                        <Button
                          type="submit"
                          color="primary"
                          size="lg"
                          disabled={isSubmitting}
                          className="px-5"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Test{" "}
                              <i className="bx bx-check-circle ms-2"></i>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardBody>
              </Card>

              {/* Info Card */}
              <Card className="border-primary">
                <CardBody>
                  <h6 className="text-primary mb-3">
                    <i className="bx bx-info-circle me-2"></i>Testing
                    Information
                  </h6>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2 small">
                        <strong>Endpoint:</strong>
                      </p>
                      <p className="mb-3 small text-muted">
                        /api/admin/checkWorkingPlaceAllocation
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2 small">
                        <strong>Method:</strong>
                      </p>
                      <p className="mb-3 small text-muted">POST</p>
                    </Col>
                  </Row>
                  <p className="mb-0 small text-muted">
                    This component is for testing the working place allocation
                    API. Check the browser console for detailed response data
                    and formatted output.
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
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
    </React.Fragment>
  )
}

export default DvahoTesting
