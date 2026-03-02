import React, { useState, useEffect, useCallback } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import { useHistory } from "react-router-dom"
import Dropzone from "react-dropzone"
import Select from "react-select"
import { URLS } from "../../Url"
import axios from "axios"
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  Spinner,
  FormGroup,
} from "reactstrap"

const EditEmployeeRegistration = () => {
  const history = useHistory()
  const [designations, setDesignations] = useState([])
  const [qualifications, setQualifications] = useState([])
  const [subQualifications, setSubQualifications] = useState([])
  const [institutionTypes, setInstitutionTypes] = useState([])
  const [postingTypes, setPostingTypes] = useState([])
  const [districts, setDistricts] = useState([])
  const [errors, setErrors] = useState({})
  const [fileError, setFileError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [districtPlacesMap, setDistrictPlacesMap] = useState({})

  const token = JSON.parse(localStorage.getItem("authUser"))?.token
  const employeeRegistrationId = sessionStorage.getItem("EmployeeRegistationid")

  const [formData, setFormData] = useState({
    ddoNumber: "",
    employeeId: "",
    name: "",
    designationId: "",
    gender: "",
    caste: "",
    nativity: "",
    phone: "",
    email: "",
    institutionType: "",
    subcaste: "",
    qualificationId: "",
    subqualificationId: "",
    bloodGroup: "",
    employeeAadharCard: "",
    permanentAddress: "",
    temporaryAddress: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    spouseAadharCard: "",
    spouseEmpId: "",
    awardsAndRewards: "",
    apgliNumber: "",
    gpfNumber: "",
    cpsNumber: "",
    gisNumber: "",
    totalYearsOfService: "",
    serviceInPresentPost: "",
    maritalStatus: "",
    status: "Active",
    caseReference: "",
    specialRewards: "",
    currentdesignation: "",
    previousPromotionDate: "",
    previousDesignation: "",
    lastPromotedDate: "",
    dateOfIncident: "",
  })

  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [existingImage, setExistingImage] = useState("")
  const [existingCommendations, setExistingCommendations] = useState([])
  const [spouse, setSpouse] = useState({ spouseIsGovernmentEmployee: false })

  const [employeePostings, setEmployeePostings] = useState([
    {
      id: Date.now(),
      postingType: "",
      placesOfWorking: [
        {
          id: Date.now(),
          districtId: "",
          placeOfWorkingId: "",
          mandalId: "",
          townId: "",
          districtName: "",
          mandalName: "",
          townName: "",
        },
      ],
    },
  ])

  const [postingTypeIds, setPostingTypeIds] = useState(new Set())
  const [placeOfWorkingIds, setPlaceOfWorkingIds] = useState(new Set())

  // Select Styles
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

  // Options
  const designationOptions = designations.map(designation => ({
    value: designation._id,
    label: designation.designation,
  }))

  const qualificationOptions = qualifications.map(qual => ({
    value: qual._id,
    label: qual.name,
  }))

  const subQualificationOptions = subQualifications.map(subQual => ({
    value: subQual._id,
    label: subQual.name,
  }))

  const institutionTypeOptions = institutionTypes.map(inst => ({
    value: inst.name,
    label: inst.name,
  }))

  const postingTypeOptions = postingTypes.map(type => ({
    value: type.name,
    label: type.name,
  }))

  const districtOptions = districts.map(district => ({
    value: district._id,
    label: district.name,
  }))

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
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

  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ]

  const maritalStatusOptions = [
    { value: "Married", label: "Married" },
    { value: "Single", label: "Single" },
  ]

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Closed", label: "Closed" },
    { value: "None", label: "None" },
  ]

  const specialRewardsOptions = [
    { value: "Bonuses", label: "Bonuses" },
    { value: "incentives", label: "Incentives" },
  ]

  // Helper Functions
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  // Handlers
  const handleSpouseChange = e => {
    const isChecked = e.target.checked
    setSpouse(prev => ({
      ...prev,
      [e.target.name]: isChecked,
    }))

    if (!isChecked) {
      setFormData(prev => ({
        ...prev,
        spouseEmpId: "",
      }))
    }
  }

  const handleAcceptedFiles = files => {
    const formattedFiles = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setSelectedFiles(formattedFiles)
  }

  const changeHandler = e => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        const ext = file.name.split(".").pop().toLowerCase()
        return ext === "pdf"
      })

      if (validFiles.length !== files.length) {
        toast.error(
          "Some files are not PDF. Only PDF files are allowed for commendations"
        )
      }

      setFiles(prev => [...prev, ...validFiles])
    }
  }

  // Fetch Data Functions
  const fetchDesignations = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetDesignation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDesignations(response.data.data || [])
    } catch (error) {
      toast.error("Failed to load designations")
    }
  }, [token])

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

  const fetchPlaceOfWorking = useCallback(
    async districtId => {
      if (!districtId) {
        return []
      }
      try {
        const response = await axios.post(
          URLS.GetAllPlaceOfWorking,
          { districtId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        return response.data.data || []
      } catch (error) {
        toast.error("Failed to load places of working")
        return []
      }
    },
    [token]
  )

  const fetchInstitutionTypes = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInstitutionTypes(response.data.data || [])
    } catch (error) {
      toast.error("Failed to load institution types")
    }
  }, [token])

  const fetchPostingTypes = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetTypeOfPosting, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPostingTypes(response.data.data || [])
    } catch (error) {
      toast.error("Failed to load posting types")
    }
  }, [token])

  const fetchQualifications = useCallback(async () => {
    try {
      const response = await axios.get(URLS.GetQualification, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setQualifications(response.data.data || [])
    } catch (error) {
      toast.error("Failed to load qualifications")
    }
  }, [token])

  const fetchSubQualifications = useCallback(
    async qualificationId => {
      if (!qualificationId) {
        setSubQualifications([])
        return
      }
      try {
        const response = await axios.get(
          URLS.GetQualificationBySubQualification + qualificationId,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setSubQualifications(response.data.data || [])
      } catch (error) {
        console.error("Failed to load Qualification details")
        setSubQualifications([])
      }
    },
    [token]
  )

  const fetchEmployeeData = useCallback(async () => {
    if (!token || !employeeRegistrationId) {
      toast.error("Authentication token or employee ID not found")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        URLS.GetEmployeeRegistationId,
        { id: employeeRegistrationId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data && response.data.staff) {
        const staffData = response.data.staff

        // Format date fields
        const formatDate = dateString => {
          if (!dateString) return ""
          try {
            return new Date(dateString).toISOString().split("T")[0]
          } catch {
            return ""
          }
        }

        const updatedFormData = {
          ddoNumber: staffData.ddoNumber || "",
          employeeId: staffData.employeeId || "",
          name: staffData.name || "",
          designationId: staffData.designationId || "",
          gender: staffData.gender || "",
          caste: staffData.caste || "",
          nativity: staffData.nativity || "",
          phone: staffData.phone || "",
          email: staffData.email || "",
          institutionType: staffData.institutionType || "",
          subcaste: staffData.subcaste || "",
          qualificationId: staffData.qualificationId || "",
          subqualificationId: staffData.subqualificationId || "",
          bloodGroup: staffData.bloodGroup || "",
          employeeAadharCard: staffData.employeeAadharCard || "",
          permanentAddress: staffData.permanentAddress || "",
          temporaryAddress: staffData.temporaryAddress || "",
          fatherName: staffData.fatherName || "",
          motherName: staffData.motherName || "",
          spouseName: staffData.spouseName || "",
          spouseAadharCard: staffData.spouseAadharCard || "",
          spouseEmpId: staffData.spouseEmpId || "",
          awardsAndRewards: staffData.awardsAndRewards || "",
          apgliNumber: staffData.apgliNumber || "",
          gpfNumber: staffData.gpfNumber || "",
          cpsNumber: staffData.cpsNumber || "",
          gisNumber: staffData.gisNumber || "",
          totalYearsOfService: staffData.totalYearsOfService || "",
          serviceInPresentPost: staffData.serviceInPresentPost || "",
          maritalStatus: staffData.maritalStatus || "",
          status: staffData.status || "Active",
          caseReference: staffData.caseReference || "",
          specialRewards: staffData.specialRewards || "",
          currentdesignation: staffData.currentdesignation || "",
          previousPromotionDate:
            formatDate(staffData.previousPromotionDate) || "",
          previousDesignation: staffData.previousDesignation || "",
          lastPromotedDate: formatDate(staffData.lastPromotedDate) || "",
          dateOfIncident: formatDate(staffData.dateOfIncident) || "",
        }

        setFormData(updatedFormData)
        setSpouse({
          spouseIsGovernmentEmployee:
            staffData.spouseIsGovernmentEmployee || false,
        })

        if (staffData.postingTypes && staffData.postingTypes.length > 0) {
          const postingsPromises = staffData.postingTypes.map(async posting => {
            const placesPromises = (posting.placesOfWorking || []).map(
              async place => {
                let placesForDistrict = []

                if (place.districtId) {
                  placesForDistrict = await fetchPlaceOfWorking(
                    place.districtId
                  )
                }

                return {
                  id: place.id || Date.now(),
                  districtId: place.districtId || "",
                  placeOfWorkingId: place.placeOfWorkingId || "",
                  mandalId: place.mandalId || "",
                  townId: place.townId || "",
                  districtName: place.districtName || "",
                  mandalName: place.mandalName || "",
                  townName: place.townName || "",
                }
              }
            )

            const placesOfWorking = await Promise.all(placesPromises)

            return {
              id: posting.id || Date.now(),
              postingType: posting.postingType || "",
              placesOfWorking: placesOfWorking,
            }
          })

          const postings = await Promise.all(postingsPromises)

          // Build district places map
          const newDistrictPlacesMap = {}
          for (const posting of postings) {
            for (const place of posting.placesOfWorking) {
              if (place.districtId) {
                if (!newDistrictPlacesMap[place.districtId]) {
                  newDistrictPlacesMap[place.districtId] =
                    await fetchPlaceOfWorking(place.districtId)
                }
              }
            }
          }

          setDistrictPlacesMap(newDistrictPlacesMap)
          setEmployeePostings(postings)

          const postingIds = new Set()
          const placeIds = new Set()
          postings.forEach(posting => {
            if (posting.postingType) postingIds.add(posting.postingType)
            posting.placesOfWorking?.forEach(place => {
              if (place.placeOfWorkingId) placeIds.add(place.placeOfWorkingId)
            })
          })
          setPostingTypeIds(postingIds)
          setPlaceOfWorkingIds(placeIds)
        }

        if (staffData.image) {
          setExistingImage(staffData.image)
          setSelectedFiles([
            {
              preview: `${URLS.Base}${staffData.image}`,
              name: "existing-image.jpg",
              formattedSize: "Existing Image",
              isExisting: true,
            },
          ])
        }

        if (staffData.commendations && staffData.commendations.length > 0) {
          setExistingCommendations(staffData.commendations)
        }

        if (staffData.qualificationId) {
          await fetchSubQualifications(staffData.qualificationId)
        }
      }
    } catch (error) {
      console.error("Error fetching employee data:", error)
      toast.error("Failed to fetch employee data")
    } finally {
      setIsLoading(false)
    }
  }, [
    token,
    employeeRegistrationId,
    fetchSubQualifications,
    fetchPlaceOfWorking,
  ])

  useEffect(() => {
    fetchDesignations()
    fetchDistricts()
    fetchInstitutionTypes()
    fetchPostingTypes()
    fetchQualifications()
    if (employeeRegistrationId) {
      fetchEmployeeData()
    }
  }, [
    fetchDesignations,
    fetchDistricts,
    fetchInstitutionTypes,
    fetchPostingTypes,
    fetchQualifications,
    employeeRegistrationId,
    fetchEmployeeData,
  ])

  // Form Handlers
  const handleSelectChange = (name, selectedOption) => {
    const value = selectedOption ? selectedOption.value : ""

    if (name === "maritalStatus" && value === "Single") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        spouseName: "",
        spouseAadharCard: "",
        spouseEmpId: "",
      }))
      setSpouse({ spouseIsGovernmentEmployee: false })
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }

    if (name === "qualificationId") {
      fetchSubQualifications(value)
      setFormData(prev => ({ ...prev, subqualificationId: "" }))
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target

    if (
      formData.maritalStatus === "Single" &&
      (name === "spouseName" ||
        name === "spouseAadharCard" ||
        name === "spouseEmpId")
    ) {
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleDesignationChange = selectedOption => {
    const value = selectedOption ? selectedOption.value : ""
    setFormData(prev => ({ ...prev, designationId: value }))

    if (errors.designationId) {
      setErrors(prev => ({ ...prev, designationId: "" }))
    }
  }

  const handlePostingTypeChange = (postingIndex, selectedOption) => {
    const value = selectedOption ? selectedOption.value : ""
    const updatedPostings = [...employeePostings]

    if (postingTypeIds.has(value) && value !== "") {
      toast.error(
        "This Posting Type has already been selected. Please choose a different one."
      )
      return
    }

    const oldValue = updatedPostings[postingIndex].postingType
    if (oldValue) {
      setPostingTypeIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(oldValue)
        return newSet
      })
    }

    updatedPostings[postingIndex].postingType = value

    if (value) {
      setPostingTypeIds(prev => new Set(prev).add(value))
    }

    const errorKey = `postingType_${postingIndex}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }))
    }

    setEmployeePostings(updatedPostings)
  }

  const handleDistrictChange = async (
    postingIndex,
    placeIndex,
    selectedOption
  ) => {
    const value = selectedOption ? selectedOption.value : ""
    const updatedPostings = [...employeePostings]

    // Clear all place of working fields when district changes
    updatedPostings[postingIndex].placesOfWorking[placeIndex] = {
      ...updatedPostings[postingIndex].placesOfWorking[placeIndex],
      districtId: value,
      districtName: selectedOption ? selectedOption.label : "",
      placeOfWorkingId: "",
      mandalId: "",
      townId: "",
      mandalName: "",
      townName: "",
    }

    setEmployeePostings(updatedPostings)

    // Fetch places of working for selected district if not already fetched
    if (value) {
      if (!districtPlacesMap[value]) {
        try {
          const places = await fetchPlaceOfWorking(value)
          setDistrictPlacesMap(prev => ({
            ...prev,
            [value]: places,
          }))
        } catch (error) {
          console.error("Failed to load places for district:", error)
        }
      }
    }

    const errorKey = `district_${postingIndex}_${placeIndex}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }))
    }
  }

  const handlePlaceOfWorkingChange = async (
    postingIndex,
    placeIndex,
    selectedOption
  ) => {
    const value = selectedOption ? selectedOption.value : ""
    const updatedPostings = [...employeePostings]

    if (placeOfWorkingIds.has(value) && value !== "") {
      toast.error(
        "This Place of Working has already been selected. Please choose a different one."
      )
      return
    }

    const oldValue =
      updatedPostings[postingIndex].placesOfWorking[placeIndex].placeOfWorkingId
    if (oldValue) {
      setPlaceOfWorkingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(oldValue)
        return newSet
      })
    }

    updatedPostings[postingIndex].placesOfWorking[placeIndex].placeOfWorkingId =
      value

    if (value) {
      setPlaceOfWorkingIds(prev => new Set(prev).add(value))
    }

    // Fetch location details
    if (value) {
      await fetchLocationDetails(postingIndex, placeIndex, value)
    } else {
      // Clear location details if no place selected
      updatedPostings[postingIndex].placesOfWorking[placeIndex] = {
        ...updatedPostings[postingIndex].placesOfWorking[placeIndex],
        mandalId: "",
        townId: "",
        mandalName: "",
        townName: "",
      }
    }

    const errorKey = `placeOfWorking_${postingIndex}_${placeIndex}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }))
    }

    setEmployeePostings(updatedPostings)
  }

  const fetchLocationDetails = async (
    postingIndex,
    placeIndex,
    placeOfWorkingId
  ) => {
    try {
      const response = await axios.post(
        URLS.GetPlaceOfWorkingById,
        { placeOfWorkingId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const updatedPostings = [...employeePostings]
      const locationData = response.data.data

      updatedPostings[postingIndex].placesOfWorking[placeIndex] = {
        ...updatedPostings[postingIndex].placesOfWorking[placeIndex],
        mandalName: locationData.mandal?.name || "N/A",
        townName: locationData.town?.name || "N/A",
        mandalId: locationData.mandal?._id || "",
        townId: locationData.town?._id || "",
      }

      setEmployeePostings(updatedPostings)
    } catch (error) {
      toast.error("Failed to load location details")
    }
  }

  // Place of working options based on selected district
  const getPlaceOfWorkingOptions = (postingIndex, placeIndex) => {
    const districtId =
      employeePostings[postingIndex]?.placesOfWorking[placeIndex]?.districtId
    if (!districtId) return []

    const places = districtPlacesMap[districtId] || []
    return places.map(place => ({
      value: place._id,
      label: place.name,
    }))
  }

  // Get current district value for select
  const getCurrentDistrict = (postingIndex, placeIndex) => {
    const districtId =
      employeePostings[postingIndex]?.placesOfWorking[placeIndex]?.districtId
    if (!districtId) return null
    return districtOptions.find(option => option.value === districtId) || null
  }

  // Get current place of working value for select
  const getCurrentPlaceOfWorking = (postingIndex, placeIndex) => {
    const placeId =
      employeePostings[postingIndex]?.placesOfWorking[placeIndex]
        ?.placeOfWorkingId
    if (!placeId) return null
    const options = getPlaceOfWorkingOptions(postingIndex, placeIndex)
    return options.find(option => option.value === placeId) || null
  }

  // Posting Management
  const addPostingType = () => {
    setEmployeePostings(prev => [
      ...prev,
      {
        id: Date.now(),
        postingType: "",
        placesOfWorking: [
          {
            id: Date.now(),
            districtId: "",
            placeOfWorkingId: "",
            mandalId: "",
            townId: "",
            districtName: "",
            mandalName: "",
            townName: "",
          },
        ],
      },
    ])
  }

  const removePostingType = index => {
    if (employeePostings.length > 1) {
      const postingToRemove = employeePostings[index]

      if (postingToRemove.postingType) {
        setPostingTypeIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(postingToRemove.postingType)
          return newSet
        })
      }

      postingToRemove.placesOfWorking.forEach(place => {
        if (place.placeOfWorkingId) {
          setPlaceOfWorkingIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(place.placeOfWorkingId)
            return newSet
          })
        }
      })

      setEmployeePostings(prev => prev.filter((_, i) => i !== index))
    } else {
      toast.error("At least one posting type is required")
    }
  }

  const addPlaceOfWorking = postingIndex => {
    const updatedPostings = [...employeePostings]
    updatedPostings[postingIndex].placesOfWorking.push({
      id: Date.now(),
      districtId: "",
      placeOfWorkingId: "",
      mandalId: "",
      townId: "",
      districtName: "",
      mandalName: "",
      townName: "",
    })
    setEmployeePostings(updatedPostings)
  }

  const removePlaceOfWorking = (postingIndex, placeIndex) => {
    const updatedPostings = [...employeePostings]
    if (updatedPostings[postingIndex].placesOfWorking.length > 1) {
      const placeToRemove =
        updatedPostings[postingIndex].placesOfWorking[placeIndex]

      if (placeToRemove.placeOfWorkingId) {
        setPlaceOfWorkingIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(placeToRemove.placeOfWorkingId)
          return newSet
        })
      }

      updatedPostings[postingIndex].placesOfWorking = updatedPostings[
        postingIndex
      ].placesOfWorking.filter((_, i) => i !== placeIndex)
      setEmployeePostings(updatedPostings)
    } else {
      toast.error("At least one place of working is required")
    }
  }

  // Validation
  const validateForm = () => {
    const newErrors = {}
    const missingFields = []

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required"
      missingFields.push("Employee ID")
    }

    if (!formData.designationId) {
      newErrors.designationId = "Designation is required"
      missingFields.push("Designation")
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile Number is required"
      missingFields.push("Mobile Number")
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Mobile Number must be 10 digits"
    }

    employeePostings.forEach((posting, postingIndex) => {
      if (!posting.postingType) {
        newErrors[`postingType_${postingIndex}`] = "Type of Posting is required"
        missingFields.push(`Type of Posting (Posting ${postingIndex + 1})`)
      }

      posting.placesOfWorking.forEach((place, placeIndex) => {
        if (!place.districtId) {
          newErrors[`district_${postingIndex}_${placeIndex}`] =
            "District is required"
          missingFields.push(
            `District (Posting ${postingIndex + 1}, Location ${placeIndex + 1})`
          )
        }

        if (!place.placeOfWorkingId) {
          newErrors[`placeOfWorking_${postingIndex}_${placeIndex}`] =
            "Place of Working is required"
          missingFields.push(
            `Place of Working (Posting ${postingIndex + 1}, Location ${placeIndex + 1
            })`
          )
        }
      })
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const errorMessage = `Please fill all required fields:\n• ${missingFields.join(
        "\n• "
      )}`
      toast.error(
        <div>
          <strong>Missing Required Fields:</strong>
          <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>,
        {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )
    }

    return Object.keys(newErrors).length === 0
  }

  // Form Submission
  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key])
        }
      })

      formDataToSend.append("postingTypes", JSON.stringify(employeePostings))
      formDataToSend.append(
        "spouseIsGovernmentEmployee",
        spouse.spouseIsGovernmentEmployee
      )

      formDataToSend.append("_id", employeeRegistrationId)

      // Handle existing image
      if (existingImage && selectedFiles.length === 0) {
        formDataToSend.append("existingImage", existingImage)
      }

      // Handle new image if selected
      selectedFiles.forEach(file => {
        if (!file.isExisting && file instanceof File) {
          formDataToSend.append("image", file)
        }
      })

      // Handle existing commendations
      if (existingCommendations.length > 0) {
        formDataToSend.append(
          "existingCommendations",
          JSON.stringify(existingCommendations)
        )
      }

      // Handle new commendations
      for (let i = 0; i < files.length; i++) {
        formDataToSend.append("commendations", files[i])
      }

      // Use EDIT endpoint instead of ADD endpoint
      const response = await axios.post(
        `${URLS.AddEmployeeRegistation}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      toast.success(response.data.message || "Employee updated successfully!")
      history.push("/employee-registation")
    } catch (error) {
      console.error("Update error:", error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update employee. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper Functions for Select Values
  const getCurrentDesignation = () =>
    designationOptions.find(
      option => option.value === formData.designationId
    ) || null

  const getCurrentGender = () =>
    genderOptions.find(option => option.value === formData.gender) || null

  const getCurrentCaste = () =>
    casteOptions.find(option => option.value === formData.caste) || null

  const getCurrentInstitutionType = () =>
    institutionTypeOptions.find(
      option => option.value === formData.institutionType
    ) || null

  const getCurrentQualification = () =>
    qualificationOptions.find(
      option => option.value === formData.qualificationId
    ) || null

  const getCurrentSubQualification = () =>
    subQualificationOptions.find(
      option => option.value === formData.subqualificationId
    ) || null

  const getCurrentBloodGroup = () =>
    bloodGroupOptions.find(option => option.value === formData.bloodGroup) ||
    null

  const getCurrentMaritalStatus = () =>
    maritalStatusOptions.find(
      option => option.value === formData.maritalStatus
    ) || null

  const getCurrentStatus = () =>
    statusOptions.find(option => option.value === formData.status) || null

  const getCurrentSpecialRewards = () =>
    specialRewardsOptions.find(
      option => option.value === formData.specialRewards
    ) || null

  const getCurrentDesignationForField = fieldName => {
    const value = formData[fieldName]
    return designationOptions.find(option => option.value === value) || null
  }

  const showSpouseDetails = formData.maritalStatus === "Married"

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Employee Registration"
            breadcrumbItem="Edit Employee Registration"
          />
          <Card>
            <CardBody className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">Loading employee data...</p>
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }

  if (!employeeRegistrationId) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Employee Registration"
            breadcrumbItem="Edit Employee Registration"
          />
          <Card>
            <CardBody className="text-center">
              <h4>No employee selected for editing</h4>
              <Button
                color="primary"
                className="mt-3"
                onClick={() => history.push("/employee-registation")}
              >
                Back to Employee List
              </Button>
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="VAHD ADMIN"
          breadcrumbItem="Edit Employee Registration"
        />
        <Form onSubmit={handleSubmit}>
          <div>
            {/* Employee Profile Card */}
            <Card>
              <CardBody>
                <h5 className="text-primary mb-2">
                  Employee Profile Overview
                </h5>
                <hr />
                <Row>
                  <Col md={10}>
                    <h6 className="text-primary mb-2">Basic Information</h6>
                    <Row>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Employee ID *</Label>
                          <Input
                            required
                            size="sm"
                            type="text"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleInputChange}
                            placeholder="Enter Employee ID"
                            className="form-control"
                            minLength="7"
                            maxLength="10"
                            pattern="[0-9]{7,}"
                            onKeyPress={e => {
                              const charCode = e.which ? e.which : e.keyCode
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault()
                              }
                            }}
                          />
                          {errors.employeeId && (
                            <div className="text-danger small mt-1">
                              {errors.employeeId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Employee Name</Label>
                          <Input
                            size="sm"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter Employee Name"
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Designation *</Label>
                          <Select
                            name="designationId"
                            value={getCurrentDesignation()}
                            onChange={handleDesignationChange}
                            options={designationOptions}
                            styles={selectStyles}
                            placeholder="Select Designation"
                            isSearchable
                          />
                          {errors.designationId && (
                            <div className="text-danger small mt-1">
                              {errors.designationId}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Gender</Label>
                          <Select
                            name="gender"
                            value={getCurrentGender()}
                            onChange={selectedOption =>
                              handleSelectChange("gender", selectedOption)
                            }
                            options={genderOptions}
                            styles={selectStyles}
                            placeholder="Select gender"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                      {/* </Row>
                    <h6 className="text-primary mb-2 pt-2">
                      Employment Details
                    </h6>
                    <hr />
                    <Row> */}
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Mobile Number *</Label>
                          <Input
                            required
                            size="sm"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit Mobile Number"
                            className="form-control"
                            maxLength="10"
                            minLength="10"
                            pattern="[0-9]{10}"
                            onKeyPress={e => {
                              const charCode = e.which ? e.which : e.keyCode
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault()
                              }
                            }}
                          />
                          {errors.phone && (
                            <div className="text-danger small mt-1">
                              {errors.phone}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      {/* <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Caste</Label>
                          <Select
                            name="caste"
                            value={getCurrentCaste()}
                            onChange={selectedOption =>
                              handleSelectChange("caste", selectedOption)
                            }
                            options={casteOptions}
                            styles={selectStyles}
                            placeholder="Select Caste"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Sub Caste</Label>
                          <Input
                            size="sm"
                            type="text"
                            name="subcaste"
                            value={formData.subcaste}
                            onChange={handleInputChange}
                            placeholder="Enter Sub Caste"
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Email Id</Label>
                          <Input
                            size="sm"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email Id"
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Institution</Label>
                          <Select
                            name="institutionType"
                            value={getCurrentInstitutionType()}
                            onChange={selectedOption =>
                              handleSelectChange(
                                "institutionType",
                                selectedOption
                              )
                            }
                            options={institutionTypeOptions}
                            styles={selectStyles}
                            placeholder="Select Institution"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="qualificationId" className="fw-bold">
                            Qualification
                          </Label>
                          <Select
                            name="qualificationId"
                            value={getCurrentQualification()}
                            onChange={selectedOption =>
                              handleSelectChange(
                                "qualificationId",
                                selectedOption
                              )
                            }
                            options={qualificationOptions}
                            styles={selectStyles}
                            placeholder="Select Qualification"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="subqualificationId">Specialization</Label>
                          <Select
                            name="subqualificationId"
                            value={getCurrentSubQualification()}
                            onChange={selectedOption =>
                              handleSelectChange(
                                "subqualificationId",
                                selectedOption
                              )
                            }
                            options={subQualificationOptions}
                            styles={selectStyles}
                            placeholder="Select Specialization"
                            isSearchable
                            isDisabled={!formData.qualificationId}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">
                            Aadhar Card Number
                          </Label>
                          <Input
                            size="sm"
                            type="text"
                            name="employeeAadharCard"
                            value={formData.employeeAadharCard}
                            onChange={handleInputChange}
                            placeholder="Enter 12-digit Aadhar"
                            className="form-control"
                            maxLength="12"
                            minLength="12"
                            pattern="[0-9]{12}"
                            onKeyPress={e => {
                              const charCode = e.which ? e.which : e.keyCode
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault()
                              }
                            }}
                          />
                        </FormGroup>
                      </Col> */}
                    </Row>
                  </Col>
                  <Col md={2}>
                    <h6 className="text-primary mb-2">Employee Photo</h6>
                    <div className="m-auto mt-3">
                      {selectedFiles.length > 0 ? (
                        <div className="dropzone-cover-container">
                          <div
                            className="dropzone-cover-preview"
                            // onClick={() =>
                            //   document.getElementById("file-input")?.click()
                            // }
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={selectedFiles[0].preview}
                              alt="Employee cover"
                              className="cover-image rounded"
                              style={{
                                width: "100%",
                                height: "220px",
                                objectFit: "cover",
                                border: "2px solid #dee2e6",
                              }}
                            />
                            <div className="cover-overlay">
                              <small className="text-white">
                                {/* Click to change image */}
                              </small>
                            </div>
                          </div>
                        </div>
                      ) : existingImage ? (
                        <div className="dropzone-cover-container">
                          <div
                            className="dropzone-cover-preview"
                            // onClick={() =>
                            //   document.getElementById("file-input")?.click()
                            // }
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={`${URLS.Base}${existingImage}`}
                              alt="Employee cover"
                              className="cover-image rounded"
                              style={{
                                width: "100%",
                                height: "220px",
                                objectFit: "cover",
                                border: "2px solid #dee2e6",
                              }}
                            />
                            <div className="cover-overlay">
                              <small className="text-white">
                                {/* Click to change image */}
                              </small>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Dropzone onDrop={handleAcceptedFiles}>
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                              <div
                                className="dz-message needsclick mt-2"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <div className="mb-2">
                                  <i className="display-4 text-muted bx bx-user" />
                                </div>
                                <h4>Upload</h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      )}
                      <input
                        id="file-input"
                        type="file"
                        style={{ display: "none" }}
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleAcceptedFiles([e.target.files[0]])
                          }
                        }}
                        accept="image/*"
                      />
                      {fileError && (
                        <div className="text-danger small mt-1">
                          {fileError}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Posting Information Card */}
            <Card>
              <CardBody>
                <Col md={12}>
                  <Row>
                    {employeePostings.map((posting, postingIndex) => (
                      <div className="posting-section" key={posting.id}>
                        <Row className="align-items-center">
                          <Col md={2}>
                            {postingIndex === 0 && (
                              <div className="d-flex justify-content-between align-items-center">
                                <Button
                                  type="button"
                                  color="success"
                                  onClick={addPostingType}
                                  size="sm"
                                  className="shadow-none w-100 mt-2"
                                >
                                  <i className="ri-add-line me-1"></i>+ Add
                                  Posting Type
                                </Button>
                              </div>
                            )}
                          </Col>
                          <Col md={3}>
                            <FormGroup className="mb-2">
                              <Label className="form-label">
                                Type of Posting *
                              </Label>
                              <Select
                                value={
                                  postingTypeOptions.find(
                                    option =>
                                      option.value === posting.postingType
                                  ) || null
                                }
                                onChange={selectedOption =>
                                  handlePostingTypeChange(
                                    postingIndex,
                                    selectedOption
                                  )
                                }
                                options={postingTypeOptions}
                                styles={selectStyles}
                                placeholder="Select Posting Type"
                                isSearchable
                              />
                              {errors[`postingType_${postingIndex}`] && (
                                <div className="text-danger small mt-1">
                                  {errors[`postingType_${postingIndex}`]}
                                </div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md={1}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              {employeePostings.length > 1 && (
                                <Button
                                  type="button"
                                  color="danger"
                                  size="sm"
                                  className="shadow-none w-100 mt-2"
                                  onClick={() =>
                                    removePostingType(postingIndex)
                                  }
                                >
                                  <i className="ri-delete-bin-line me-1"></i>X
                                  Remove
                                </Button>
                              )}
                            </div>
                          </Col>
                          <Col md={12}>
                            <div className="places-section">
                              {posting.placesOfWorking.map(
                                (place, placeIndex) => (
                                  <div key={place.id}>
                                    <Row className="align-items-center">
                                      <Col md={2}>
                                        {placeIndex === 0 && (
                                          <div className="text-start mt-3">
                                            <Button
                                              type="button"
                                              color="info"
                                              size="sm"
                                              className="shadow-none w-100"
                                              onClick={() =>
                                                addPlaceOfWorking(postingIndex)
                                              }
                                            >
                                              <i className="ri-add-line me-1"></i>
                                              + Add Location
                                            </Button>
                                          </div>
                                        )}
                                      </Col>
                                      <Col md={2}>
                                        <FormGroup className="mb-0">
                                          <Label className="form-label">
                                            District *
                                          </Label>
                                          <Select
                                            value={getCurrentDistrict(
                                              postingIndex,
                                              placeIndex
                                            )}
                                            onChange={selectedOption =>
                                              handleDistrictChange(
                                                postingIndex,
                                                placeIndex,
                                                selectedOption
                                              )
                                            }
                                            options={districtOptions}
                                            styles={selectStyles}
                                            placeholder="Select District"
                                            isSearchable
                                          />
                                          {errors[
                                            `district_${postingIndex}_${placeIndex}`
                                          ] && (
                                              <div className="text-danger small mt-1">
                                                {
                                                  errors[
                                                  `district_${postingIndex}_${placeIndex}`
                                                  ]
                                                }
                                              </div>
                                            )}
                                        </FormGroup>
                                      </Col>
                                      <Col md={3}>
                                        <FormGroup className="mb-0">
                                          <Label className="form-label">
                                            {placeIndex === 0 ? (
                                              <>Place Of Working * </>
                                            ) : (
                                              <> Sub Centers * </>
                                            )}
                                          </Label>
                                          <Select
                                            value={getCurrentPlaceOfWorking(
                                              postingIndex,
                                              placeIndex
                                            )}
                                            onChange={selectedOption =>
                                              handlePlaceOfWorkingChange(
                                                postingIndex,
                                                placeIndex,
                                                selectedOption
                                              )
                                            }
                                            options={getPlaceOfWorkingOptions(
                                              postingIndex,
                                              placeIndex
                                            )}
                                            styles={selectStyles}
                                            placeholder="Select Place"
                                            isSearchable
                                            isDisabled={!place.districtId}
                                          />
                                          {errors[
                                            `placeOfWorking_${postingIndex}_${placeIndex}`
                                          ] && (
                                              <div className="text-danger small mt-1">
                                                {
                                                  errors[
                                                  `placeOfWorking_${postingIndex}_${placeIndex}`
                                                  ]
                                                }
                                              </div>
                                            )}
                                        </FormGroup>
                                      </Col>
                                      <Col md={2}>
                                        <FormGroup className="mb-0">
                                          <Label className="form-label">
                                            Mandal
                                          </Label>
                                          <Input
                                            size="sm"
                                            readOnly
                                            type="text"
                                            value={place.mandalName}
                                            className="form-control bg-light"
                                            placeholder="Auto-filled"
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col md={2}>
                                        <FormGroup className="mb-0">
                                          <Label className="form-label">
                                            Village/Town
                                          </Label>
                                          <Input
                                            size="sm"
                                            readOnly
                                            type="text"
                                            value={place.townName}
                                            className="form-control bg-light"
                                            placeholder="Auto-filled"
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col md={1}>
                                        {posting.placesOfWorking.length > 1 && (
                                          <div className="pt-3">
                                            <Button
                                              type="button"
                                              color="danger"
                                              size="sm"
                                              className="w-100"
                                              onClick={() =>
                                                removePlaceOfWorking(
                                                  postingIndex,
                                                  placeIndex
                                                )
                                              }
                                            >
                                              X Remove
                                            </Button>
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                )
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Row>
                </Col>
              </CardBody>
            </Card>

            {/* Personal & Family Details Card */}
            {/* <Row>
              <Col md={12}>
                <Card>
                  <CardBody>
                    <h6 className="text-primary mb-2">
                      Personal & Family Details
                    </h6>
                    <Row>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Blood Group</Label>
                          <Select
                            name="bloodGroup"
                            value={getCurrentBloodGroup()}
                            onChange={selectedOption =>
                              handleSelectChange("bloodGroup", selectedOption)
                            }
                            options={bloodGroupOptions}
                            styles={selectStyles}
                            placeholder="Select Blood Group"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Father's Name</Label>
                          <Input
                            size="sm"
                            type="text"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            placeholder="Enter Father's Name"
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Mother's Name</Label>
                          <Input
                            size="sm"
                            type="text"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInputChange}
                            placeholder="Enter Mother's Name"
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Marital Status</Label>
                          <Select
                            name="maritalStatus"
                            value={getCurrentMaritalStatus()}
                            onChange={selectedOption =>
                              handleSelectChange(
                                "maritalStatus",
                                selectedOption
                              )
                            }
                            options={maritalStatusOptions}
                            styles={selectStyles}
                            placeholder="Select Marital Status"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {showSpouseDetails && (
                      <>
                        <h6 className="text-primary mb-2">
                          Spouse Employment Details
                        </h6>
                        <hr />
                        <Row>
                          <Col md={3}>
                            <FormGroup className="mb-2 ">
                              <Label className="form-label">
                                Spouse's Name
                              </Label>
                              <Input
                                type="text"
                                size="sm"
                                name="spouseName"
                                value={formData.spouseName}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Enter Spouse's Name"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="mb-2">
                              <Label className="form-label">
                                Spouse's Aadhar
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="spouseAadharCard"
                                value={formData.spouseAadharCard}
                                onChange={handleInputChange}
                                placeholder="Enter 12-digit Aadhar"
                                className="form-control"
                                maxLength="12"
                                minLength="12"
                                pattern="[0-9]{12}"
                                onKeyPress={e => {
                                  const charCode = e.which ? e.which : e.keyCode
                                  if (charCode < 48 || charCode > 57) {
                                    e.preventDefault()
                                  }
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <Row className="mt-3">
                              <Col md={6}>
                                <p className="mb-2 mt-2">
                                  If spouse is Government employee
                                </p>
                              </Col>
                              <Col md={6}>
                                <div className="form-check me-3 me-lg-5 mt-2">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="spouseIsGovernmentEmployee"
                                    defaultChecked={
                                      spouse.spouseIsGovernmentEmployee
                                    }
                                    onChange={handleSpouseChange}
                                    id="spouseGovtEmployee"
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor="spouseGovtEmployee"
                                  >
                                    Yes / No
                                  </Label>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col md={3}>
                            <FormGroup className="mb-2 ">
                              <Label className="form-label text-bold">
                                Spouse's Employee ID
                              </Label>
                              <Input
                                size="sm"
                                type="text"
                                name="spouseEmpId"
                                value={formData.spouseEmpId}
                                onChange={handleInputChange}
                                placeholder="Enter Spouse's Employee ID"
                                className="form-control"
                                disabled={!spouse.spouseIsGovernmentEmployee}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row> */}

            {/* Address Information Card */}
            {/* <Card>
              <CardBody>
                <h6 className="text-primary mb-2">Address Information</h6>
                <hr />
                <Row>
                  <Col md={4}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">Permanent Address</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleInputChange}
                        placeholder="Enter Permanent Address"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">Temporary Address</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="temporaryAddress"
                        value={formData.temporaryAddress}
                        onChange={handleInputChange}
                        placeholder="Enter Temporary Address"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">Native District</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="nativity"
                        value={formData.nativity}
                        onChange={handleInputChange}
                        placeholder="Enter Native District"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card> */}

            {/* Official ID Numbers Card */}
            {/* <Card>
              <CardBody>
                <h6 className="text-primary mb-2">Official ID Numbers</h6>
                <hr />
                <Row>
                  <Col md={2}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">DDO Number</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="ddoNumber"
                        value={formData.ddoNumber}
                        onChange={handleInputChange}
                        placeholder="Enter DDO Number"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">GPF Number</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="gpfNumber"
                        value={formData.gpfNumber}
                        onChange={handleInputChange}
                        placeholder="Enter GPF Number"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">CPS Number</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="cpsNumber"
                        value={formData.cpsNumber}
                        onChange={handleInputChange}
                        placeholder="Enter CPS Number"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">GIS Number</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="gisNumber"
                        value={formData.gisNumber}
                        onChange={handleInputChange}
                        placeholder="Enter GIS Number"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup className="mb-2">
                      <Label className="form-label">APGLI Number</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="apgliNumber"
                        value={formData.apgliNumber}
                        onChange={handleInputChange}
                        placeholder="Enter APGLI Number"
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card> */}

            {/* Promotion & Service History Card */}
            {/* <Card>
              <CardBody>
                <Col md={12}>
                  <h6 className="text-primary mb-2">Promotion History</h6>
                  <hr />
                  <Row>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="form-label">
                          Current Designation
                        </Label>
                        <Select
                          name="currentdesignation"
                          value={getCurrentDesignationForField(
                            "currentdesignation"
                          )}
                          onChange={selectedOption =>
                            handleSelectChange(
                              "currentdesignation",
                              selectedOption
                            )
                          }
                          options={designationOptions}
                          styles={selectStyles}
                          placeholder="Select Current Designation"
                          isSearchable
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="form-label">
                          Date of Last Promotion
                        </Label>
                        <Input
                          type="date"
                          size="sm"
                          name="lastPromotedDate"
                          value={formData.lastPromotedDate}
                          onChange={handleInputChange}
                          className="form-control"
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="form-label">
                          Previous Designation
                        </Label>
                        <Select
                          name="previousDesignation"
                          value={getCurrentDesignationForField(
                            "previousDesignation"
                          )}
                          onChange={selectedOption =>
                            handleSelectChange(
                              "previousDesignation",
                              selectedOption
                            )
                          }
                          options={designationOptions}
                          styles={selectStyles}
                          placeholder="Select Previous Designation"
                          isSearchable
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="form-label">
                          Previous Promotion Date
                        </Label>
                        <Input
                          type="date"
                          size="sm"
                          name="previousPromotionDate"
                          value={formData.previousPromotionDate}
                          onChange={handleInputChange}
                          className="form-control"
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md={12}>
                  <h6 className="text-primary mb-2">Service Record</h6>
                  <hr />
                  <Row>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="form-label">
                          Total Years of Service
                        </Label>
                        <Input
                          size="sm"
                          type="text"
                          name="totalYearsOfService"
                          value={formData.totalYearsOfService}
                          onChange={handleInputChange}
                          placeholder="Enter Total Years of Service"
                          className="form-control"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup className="mb-2">
                        <Label className="form-label">
                          Service in Present Post
                        </Label>
                        <Input
                          size="sm"
                          type="text"
                          name="serviceInPresentPost"
                          value={formData.serviceInPresentPost}
                          onChange={handleInputChange}
                          placeholder="Enter Service in Present Post"
                          className="form-control"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </CardBody>
            </Card> */}

            {/* Vigilance & Awards Cards */}
            {/* <Row>
              <Col md={6}>
                <Card>
                  <CardBody>
                    <h6 className="text-primary mb-2">Vigilance Cases</h6>
                    <hr />
                    <Row>
                      <Col md={4}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Status</Label>
                          <Select
                            name="status"
                            value={getCurrentStatus()}
                            onChange={selectedOption =>
                              handleSelectChange("status", selectedOption)
                            }
                            options={statusOptions}
                            styles={selectStyles}
                            placeholder="Select Status"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Case Reference</Label>
                          <Input
                            size="sm"
                            type="text"
                            name="caseReference"
                            value={formData.caseReference}
                            onChange={handleInputChange}
                            placeholder="Enter Case Reference"
                            className="form-control"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Date of Incident</Label>
                          <Input
                            size="sm"
                            type="date"
                            name="dateOfIncident"
                            value={formData.dateOfIncident}
                            onChange={handleInputChange}
                            placeholder="Enter Date of Incident"
                            className="form-control"
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <CardBody>
                    <h6 className="text-primary mb-2">Awards & Recognition</h6>
                    <hr />
                    <Row>
                      <Col md={4}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Notable Awards</Label>
                          <Input
                            size="sm"
                            type="text"
                            name="awardsAndRewards"
                            value={formData.awardsAndRewards}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter Notable Awards"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Special Rewards</Label>
                          <Select
                            name="specialRewards"
                            value={getCurrentSpecialRewards()}
                            onChange={selectedOption =>
                              handleSelectChange(
                                "specialRewards",
                                selectedOption
                              )
                            }
                            options={specialRewardsOptions}
                            styles={selectStyles}
                            placeholder="Special Rewards"
                            isSearchable
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-2">
                          <Label className="form-label">Commendations</Label>
                          <Input
                            size="sm"
                            type="file"
                            className="form-control"
                            id="commendations"
                            name="commendations"
                            onChange={changeHandler}
                            multiple
                            accept=".pdf"
                          />
                          <small>(PDF only)</small>
                          {existingCommendations.length > 0 && (
                            <div className="mt-2">
                              <small className="text-muted">
                                Existing files: {existingCommendations.length}
                              </small>
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row> */}
          </div>

          {/* Form Actions */}
          <div className="d-flex justify-content-between align-items-center mt-3 p-2">
            <Button
              type="button"
              color="secondary"
              className="shadow-none"
              onClick={() => history.goBack()}
            >
              <i className="ri-arrow-left-line me-1"></i>
              Back
            </Button>
            <div className="d-flex">
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line me-1"></i>
                    Update Employee
                  </>
                )}
              </Button>
            </div>
          </div>
          <ToastContainer />
        </Form>
      </Container>
    </div>
  )
}

export default EditEmployeeRegistration
