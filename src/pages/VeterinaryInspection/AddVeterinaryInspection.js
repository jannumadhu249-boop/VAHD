import React, { useState, useEffect, useCallback } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import { useHistory } from "react-router-dom"
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

const AddVeterinaryInspection = () => {
  const history = useHistory()
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const UserDetails = TokenJson?.user

  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
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

  const [formData, setFormData] = useState({
    visitDate: getCurrentDate(),
    placeOfWorkingId: "",
    cases_treated_target: "",
    cases_treated_achivement: "",
    preventive_reatment_target: "",
    preventive_reatmentd_achivement: "",
    castrations_target: "",
    castrations_achivement: "",
    vaccinations_target: "",
    vaccinations_achivement: "",
    ai_done_target: "",
    ai_done_achivement: "",
    claves_born_target: "",
    claves_born_achivement: "",
    fertility_camps_organized_target: "",
    fertility_camps_organized_achivement: "",
    general_treatment_before_yesterday: "",
    general_treatment_yesterday: "",
    general_treatment_today: "",
    gynec_before_yesterday: "",
    gynec_yesterday: "",
    gynec_today: "",
    aicases_before_yesterday: "",
    aicases_yesterday: "",
    aicases_today: "",
    deworming_before_yesterday: "",
    deworming_yesterday: "",
    deworming_today: "",
    castration_yesterday: "",
    castration_today: "",
    vaccination_before_yesterday: "",
    vaccination_yesterday: "",
    vaccination_today: "",
    major_minor_surgery_before_yesterday: "",
    major_minor_surgery_yesterday: "",
    major_minor_surgery_today: "",
    others_before_yesterday: "",
    others_yesterday: "",
    remarks: "",
    castration_before_yesterday: "",
    others_Today: "",
    addedByEmp: UserDetails?._id,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [staff, setStaff] = useState([])

  const [placeOfWorking, setPlaceOfWorking] = useState([])
  const [registers, setRegisters] = useState({
    newRegistration: false,
    register: false,
    patient_register: false,
    ai_register: false,
    claves_born_register: false,
    fodder_seed_register: false,
  })

  const token = JSON.parse(localStorage.getItem("authUser"))?.token

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleRegisterChange = e => {
    const { name, checked } = e.target
    setRegisters(prev => ({ ...prev, [name]: checked }))
  }

  const handleStaffChange = (index, e) => {
    const { name, checked } = e.target
    const updatedStaff = [...staff]
    updatedStaff[index] = {
      ...updatedStaff[index],
      [name]: checked,
    }
    setStaff(updatedStaff)
  }

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

  useEffect(() => {
    fetchPlaceOfWorking()
  }, [fetchPlaceOfWorking])

  const handlePlaceChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }))

    if (name === "placeOfWorkingId" && selectedOption) {
      fetchStaff(selectedOption.value)
    }
  }

  const fetchStaff = async placeOfWorkingId => {
    try {
      const response = await axios.post(
        URLS.GetVeterinaryIdbyStaff,
        { placeOfWorkingId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const staffWithDefaults = response.data.data.map(staffMember => ({
        ...staffMember,
        staffAttendance: false,
      }))
      setStaff(staffWithDefaults)
    } catch (error) {
      toast.error("Failed to load staff")
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const missingFields = []
    if (!formData.placeOfWorkingId) missingFields.push("Working Place")
    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }

    setIsSubmitting(true)
    try {
      const formDataToSend = {
        ...formData,
        staff: staff,
        ...registers,
      }

      const response = await axios.post(
        URLS.AddVeterinaryinspection,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      toast.success(response.data.message || "Inspection added successfully")
      history.push("/veterinary-inspection")
    } catch (error) {
      console.error("Error adding Inspection:", error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add Inspection. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  const placeOfWorkingOptions = placeOfWorking.map(p => ({
    value: p._id,
    label: p.name,
  }))

  const getCurrentPlace = () => {
    return (
      placeOfWorkingOptions.find(
        opt => opt.value === formData.placeOfWorkingId
      ) || null
    )
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Add Inspection" />
        <Row>
          <Col lg="12">
            <Form onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <h5>VETERINARY INSTITUTIONS INSPECTION:</h5>
                  <hr />
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
                          value={formData.visitDate}
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
                          name="placeOfWorkingId"
                          value={getCurrentPlace()}
                          onChange={handlePlaceChange}
                          options={placeOfWorkingOptions}
                          styles={selectStyles}
                          placeholder="Select Place"
                          isSearchable
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <div className="text-end pt-3">
                        <h6 className="text-primary">
                          <i className="bx bx-user me-2"></i>
                          Employee: {UserDetails?.name}
                        </h6>
                      </div>
                    </Col>
                    <Col md={12}>
                      {staff.map((staffMember, index) => (
                        <Row key={index} className="mb-3">
                          <Col md="6">
                            <FormGroup>
                              <Label>Staff Member</Label>
                              <Input
                                size="sm"
                                type="text"
                                disabled
                                value={staffMember.name}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6" className="d-flex align-items-center">
                            <div className="form-check me-3 me-lg-5">
                              <Input
                                className="form-check-input"
                                type="checkbox"
                                name="staffAttendance"
                                value={staffMember.staffAttendance || false}
                                defaultChecked={
                                  staffMember.staffAttendance || false
                                }
                                onChange={e => handleStaffChange(index, e)}
                                style={{ fontSize: "20px" }}
                                id={`staff-present-${index}`}
                              />
                              <Label
                                className="form-check-label pt-2"
                                for={`staff-present-${index}`}
                              >
                                Present / Absent
                              </Label>
                            </div>
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h5>Registers:</h5>
                  <hr />
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>1) Attendance Register:</h5>
                    </Col>
                    <Col md={6}>
                      <div className="form-check me-3 me-lg-5">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="newRegistration"
                          value={registers.newRegistration}
                          defaultChecked={registers.newRegistration}
                          onChange={handleRegisterChange}
                          style={{ fontSize: "20px" }}
                          id="attendance-register"
                        />
                        <Label
                          className="form-check-label pt-2"
                          for="attendance-register"
                        >
                          Maintained / Not Maintained
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>2) Register:</h5>
                    </Col>
                    <Col md={6}>
                      <div className="form-check me-3 me-lg-5">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="register"
                          value={registers.register}
                          defaultChecked={registers.register}
                          onChange={handleRegisterChange}
                          style={{ fontSize: "20px" }}
                          id="general-register"
                        />
                        <Label
                          className="form-check-label pt-2"
                          for="general-register"
                        >
                          Maintained / Not Maintained
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>3) Patient Register:</h5>
                    </Col>
                    <Col md={6}>
                      <div className="form-check me-3 me-lg-5">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="patient_register"
                          value={registers.patient_register}
                          defaultChecked={registers.patient_register}
                          onChange={handleRegisterChange}
                          style={{ fontSize: "20px" }}
                          id="patient-register"
                        />
                        <Label
                          className="form-check-label pt-2"
                          for="patient-register"
                        >
                          Maintained / Not Maintained
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>4) A.I. Register:</h5>
                    </Col>
                    <Col md={6}>
                      <div className="form-check me-3 me-lg-5">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          value={registers.ai_register}
                          defaultChecked={registers.ai_register}
                          name="ai_register"
                          onChange={handleRegisterChange}
                          style={{ fontSize: "20px" }}
                          id="ai-register"
                        />
                        <Label
                          className="form-check-label pt-2"
                          for="ai-register"
                        >
                          Maintained / Not Maintained
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>5) Claves born Register:</h5>
                    </Col>
                    <Col md={6}>
                      <div className="form-check me-3 me-lg-5">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="claves_born_register"
                          value={registers.claves_born_register}
                          defaultChecked={registers.claves_born_register}
                          onChange={handleRegisterChange}
                          style={{ fontSize: "20px" }}
                          id="claves-register"
                        />
                        <Label
                          className="form-check-label pt-2"
                          for="claves-register"
                        >
                          Maintained / Not Maintained
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mt-4">
                    <Col md={6}>
                      <h5>6) Fodder Seed Register:</h5>
                    </Col>
                    <Col md={6}>
                      <div className="form-check me-3 me-lg-5">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          name="fodder_seed_register"
                          value={registers.fodder_seed_register}
                          defaultChecked={registers.fodder_seed_register}
                          onChange={handleRegisterChange}
                          style={{ fontSize: "20px" }}
                          id="fodder-register"
                        />
                        <Label
                          className="form-check-label pt-2"
                          for="fodder-register"
                        >
                          Maintained / Not Maintained
                        </Label>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h5>Target and Achievement:</h5>
                  <hr />
                  <Row className="mt-2">
                    <Col md={4}>
                      <label className="pt-3"> Cases Treated: </label>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="cases_treated_target">Target</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="cases_treated_target"
                          id="cases_treated_target"
                          value={formData.cases_treated_target}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="cases_treated_achivement">
                          Cumulative Achievement
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="cases_treated_achivement"
                          id="cases_treated_achivement"
                          value={formData.cases_treated_achivement}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={4}>
                      <label className="pt-3">
                        Preventive Treatment (Deworming):
                      </label>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="preventive_reatment_target">Target</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="preventive_reatment_target"
                          id="preventive_reatment_target"
                          value={formData.preventive_reatment_target}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="preventive_reatmentd_achivement">
                          Cumulative Achievement
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="preventive_reatmentd_achivement"
                          id="preventive_reatmentd_achivement"
                          value={formData.preventive_reatmentd_achivement}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={4}>
                      <label className="pt-3"> Castrations done: </label>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="castrations_target">Target</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="castrations_target"
                          id="castrations_target"
                          value={formData.castrations_target}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="castrations_achivement">
                          Cumulative Achievement
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="castrations_achivement"
                          id="castrations_achivement"
                          value={formData.castrations_achivement}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={4}>
                      <label className="pt-3"> Vaccinations done: </label>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="vaccinations_target">Target</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="vaccinations_target"
                          id="vaccinations_target"
                          value={formData.vaccinations_target}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="vaccinations_achivement">
                          Cumulative Achievement
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="vaccinations_achivement"
                          id="vaccinations_achivement"
                          value={formData.vaccinations_achivement}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={4}>
                      <label className="pt-3"> A.I. done: </label>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="ai_done_target">Target</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="ai_done_target"
                          id="ai_done_target"
                          value={formData.ai_done_target}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="ai_done_achivement">
                          Cumulative Achievement
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="ai_done_achivement"
                          id="ai_done_achivement"
                          value={formData.ai_done_achivement}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={4}>
                      <label className="pt-3"> Claves Born: </label>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="claves_born_target">Target</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="claves_born_target"
                          id="claves_born_target"
                          value={formData.claves_born_target}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="claves_born_achivement">
                          Cumulative Achievement
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="claves_born_achivement"
                          id="claves_born_achivement"
                          value={formData.claves_born_achivement}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={4}>
                      <label className="pt-3">Fertility Camps organized:</label>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="fertility_camps_organized_target">
                          Target
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="fertility_camps_organized_target"
                          id="fertility_camps_organized_target"
                          value={formData.fertility_camps_organized_target}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="fertility_camps_organized_achivement">
                          Cumulative Achievement
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="fertility_camps_organized_achivement"
                          id="fertility_camps_organized_achivement"
                          value={formData.fertility_camps_organized_achivement}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h5>
                    Type of Cases treated Performed on the Inspection day
                    (Numbers of):
                  </h5>
                  <hr />
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3"> General Treatment: </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="general_treatment_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="general_treatment_before_yesterday"
                          id="general_treatment_before_yesterday"
                          value={formData.general_treatment_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="general_treatment_yesterday">
                          Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="general_treatment_yesterday"
                          id="general_treatment_yesterday"
                          value={formData.general_treatment_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="general_treatment_today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="general_treatment_today"
                          id="general_treatment_today"
                          value={formData.general_treatment_today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3">Gynec : </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="gynec_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="gynec_before_yesterday"
                          id="gynec_before_yesterday"
                          value={formData.gynec_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="gynec_yesterday">Yesterday</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="gynec_yesterday"
                          id="gynec_yesterday"
                          value={formData.gynec_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="gynec_today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="gynec_today"
                          id="gynec_today"
                          value={formData.gynec_today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3"> AI Cases: </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="aicases_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="aicases_before_yesterday"
                          id="aicases_before_yesterday"
                          value={formData.aicases_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="aicases_yesterday">Yesterday</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="aicases_yesterday"
                          id="aicases_yesterday"
                          value={formData.aicases_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="aicases_today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="aicases_today"
                          id="aicases_today"
                          value={formData.aicases_today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3"> Deworming: </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="deworming_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="deworming_before_yesterday"
                          id="deworming_before_yesterday"
                          value={formData.deworming_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="deworming_yesterday">Yesterday</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="deworming_yesterday"
                          id="deworming_yesterday"
                          value={formData.deworming_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="deworming_today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="deworming_today"
                          id="deworming_today"
                          value={formData.deworming_today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3"> Castration: </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="castration_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="castration_before_yesterday"
                          id="castration_before_yesterday"
                          value={formData.castration_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="castration_yesterday">Yesterday</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="castration_yesterday"
                          id="castration_yesterday"
                          value={formData.castration_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="castration_today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="castration_today"
                          id="castration_today"
                          value={formData.castration_today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3"> Vaccination: </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="vaccination_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="vaccination_before_yesterday"
                          id="vaccination_before_yesterday"
                          value={formData.vaccination_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="vaccination_yesterday">Yesterday</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="vaccination_yesterday"
                          id="vaccination_yesterday"
                          value={formData.vaccination_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="vaccination_today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="vaccination_today"
                          id="vaccination_today"
                          value={formData.vaccination_today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3"> Major/Minor Surgery: </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="major_minor_surgery_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="major_minor_surgery_before_yesterday"
                          id="major_minor_surgery_before_yesterday"
                          value={formData.major_minor_surgery_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="major_minor_surgery_yesterday">
                          Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="major_minor_surgery_yesterday"
                          id="major_minor_surgery_yesterday"
                          value={formData.major_minor_surgery_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="major_minor_surgery_today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="major_minor_surgery_today"
                          id="major_minor_surgery_today"
                          value={formData.major_minor_surgery_today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={3}>
                      <label className="pt-3"> Others: </label>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="others_before_yesterday">
                          Day before Yesterday
                        </Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="others_before_yesterday"
                          id="others_before_yesterday"
                          value={formData.others_before_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="others_yesterday">Yesterday</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="others_yesterday"
                          id="others_yesterday"
                          value={formData.others_yesterday}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="others_Today">Today</Label>
                        <Input
                          size="sm"
                          type="number"
                          inputMode="decimal"
                          onWheel={e => e.target.blur()}
                          name="others_Today"
                          id="others_Today"
                          value={formData.others_Today}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Row className="mt-2">
                    <Col md={12}>
                      <FormGroup>
                        <Label for="remarks">General Remarks</Label>
                        <textarea
                          type="text"
                          name="remarks"
                          id="remarks"
                          rows={3}
                          className="form-control"
                          value={formData.remarks}
                          onChange={handleInputChange}
                          placeholder="Enter Remarks"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <div className="d-flex justify-content-end mt-4 mb-5">
                <Button
                  type="button"
                  color="secondary"
                  className="me-2"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line align-bottom me-1"></i> Save
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  )
}

export default AddVeterinaryInspection
