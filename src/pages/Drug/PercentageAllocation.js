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
  Badge,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import Select from "react-select"
import { URLS } from "../../Url"
import axios from "axios"

const PercentageAllocation = () => {
  var GetAuth = localStorage.getItem("authUser")
  var TokenJson = JSON.parse(GetAuth)
  var TokenData = TokenJson.token

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [Data, setData] = useState([])
  const [allocationForms, setAllocationForms] = useState([])
  const [typeofInstitution, settypeofInstitution] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [schemes, setSchemes] = useState([])
  const [quarters, setQuarters] = useState([])

  useEffect(() => {
    Get()
    GetAllocationForms()
    GetTypeofInstitution()
    fetchFinancialYears()
    fetchSchemesAndQuarters()
  }, [])

  const Get = () => {
    var token = TokenData
    axios
      .get(URLS.GetPercentageAllocation, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setData(res.data.data)
      })
      .catch(error => {
        console.error("Error fetching Budget / percentage allocation:", error)
        toast.error("Failed to load Budget / percentage allocation data")
      })
  }

  const fetchFinancialYears = async () => {
    const token = TokenData
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    try {
      const response = await axios.post(
        URLS.GetFinancialyear,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.status === 200) {
        setFinancialYears(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error(
        error.response?.data?.message || "Failed to fetch financial years"
      )
    }
  }

  const fetchSchemesAndQuarters = () => {
    const token = TokenData
    axios
      .post(
        URLS.GetScheme,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setSchemes(res.data.schemes || [])
        setQuarters(res.data.quarters || [])
      })
      .catch(error => {
        console.error("Error fetching Schemes and Quarters:", error)
        toast.error("Failed to load data")
      })
  }

  const GetAllocationForms = () => {
    var token = TokenData
    axios
      .post(
        URLS.GetAllocationForms,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setAllocationForms(res.data.data)
      })
      .catch(error => {
        console.error("Error fetching allocation forms:", error)
        toast.error("Failed to load allocation forms")
      })
  }

  const GetTypeofInstitution = () => {
    var token = TokenData
    axios
      .get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const options = res.data.data.map(item => ({
          value: item._id,
          label: item.typeName || item.name || "Unnamed Type",
        }))
        settypeofInstitution(options)
      })
      .catch(error => {
        console.error("Error fetching institution types:", error)
        toast.error("Failed to load institution types")
      })
  }

  const SearchData = e => {
    const searchValue = e.target.value
    const myUser = { ...form }
    myUser[e.target.name] = searchValue
    setform(myUser)

    const token = TokenData
    axios
      .get(URLS.GetPercentageAllocationSearch + `${searchValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            setData(res.data)
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          }
        }
      )
  }

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const pagesVisited = pageNumber * listPerPage
  const lists = Data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(Data.length / listPerPage)
  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const initializeForm = () => {
    const defaultForms = allocationForms.map(form => ({
      groupId: form._id,
      budgetPercentage: "0",
      budget: "0",
    }))

    return {
      institutionType: [],
      financialYearId: "",
      schemeId: "",
      quarterId: "",
      totalBudget: "0",
      remainingBudget: "0",
      forms: defaultForms,
    }
  }

  const [form, setform] = useState(initializeForm())

  useEffect(() => {
    if (allocationForms.length > 0) {
      setform(initializeForm())
    }
  }, [allocationForms])

  const handleChange = e => {
    const { name, value } = e.target

    let myUser = { ...form }
    myUser[name] = value

    if (name === "totalBudget") {
      const totalBudget = parseFloat(value) || 0
      myUser.forms = myUser.forms.map(formItem => ({
        ...formItem,
        budget: (
          ((parseFloat(formItem.budgetPercentage) || 0) * totalBudget) /
          100
        ).toFixed(2),
      }))
      myUser.remainingBudget = calculateRemainingBudget(
        myUser.forms,
        totalBudget
      )
    }

    setform(myUser)
  }

  const handleFormChange = (index, field, value) => {
    let myUser = { ...form }
    const totalBudget = parseFloat(myUser.totalBudget) || 0

    if (field === "budgetPercentage") {
      myUser.forms[index].budgetPercentage = value
      const percentage = parseFloat(value) || 0
      myUser.forms[index].budget = ((percentage * totalBudget) / 100).toFixed(2)
    } else if (field === "budget") {
      myUser.forms[index].budget = value
      const budgetAmount = parseFloat(value) || 0
      if (totalBudget > 0) {
        const percentage = ((budgetAmount / totalBudget) * 100).toFixed(2)
        myUser.forms[index].budgetPercentage = percentage
      } else {
        myUser.forms[index].budgetPercentage = "0"
      }
    }

    myUser.remainingBudget = calculateRemainingBudget(myUser.forms, totalBudget)

    setform(myUser)
  }

  const handleSelectChange = (selectedOptions, action) => {
    let myUser = { ...form }

    if (action.name === "institutionType") {
      myUser.institutionType = selectedOptions || []
    }

    setform(myUser)
  }

  const FormAddSubmit = e => {
    e.preventDefault()

    if (!form.institutionType || form.institutionType.length === 0) {
      toast.error("Please select at least one institution type")
      return
    }

    if (!form.financialYearId) {
      toast.error("Please select a financial year")
      return
    }

    if (!form.schemeId) {
      toast.error("Please select a scheme")
      return
    }

    if (!form.quarterId) {
      toast.error("Please select a quarter")
      return
    }

    const totalPercentage = form.forms.reduce((total, formItem) => {
      return total + (parseFloat(formItem.budgetPercentage) || 0)
    }, 0)

    if (totalPercentage > 100) {
      toast.error("Total percentage cannot exceed 100%")
      return
    }

    if (parseFloat(form.remainingBudget) < 0) {
      toast.error("Budget allocation cannot exceed total budget")
      return
    }

    AddData()
  }

  const AddData = () => {
    var token = TokenData

    const dataArray = {
      institutionType: form.institutionType.map(inst => inst.value),
      financialYearId: form.financialYearId,
      schemeId: form.schemeId,
      quarterId: form.quarterId,
      totalBudget: parseFloat(form.totalBudget) || 0,
      remainingBudget: parseFloat(form.remainingBudget) || 0,
      forms: form.forms.map(formItem => ({
        groupId: formItem.groupId,
        budgetPercentage: parseFloat(formItem.budgetPercentage) || 0,
        budget: parseFloat(formItem.budget) || 0,
      })),
    }

    axios
      .post(URLS.AddPercentageAllocation, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setShowAddForm(false)
            Get()
            resetForm()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Failed to add Budget / percentage allocation")
          }
        }
      )
  }

  const [form1, setform1] = useState({
    _id: "",
    institutionType: [],
    financialYearId: "",
    schemeId: "",
    quarterId: "",
    totalBudget: "0",
    remainingBudget: "0",
    forms: [],
  })

  const handleChange1 = e => {
    const { name, value } = e.target

    let myUser = { ...form1 }
    myUser[name] = value

    if (name === "totalBudget") {
      const totalBudget = parseFloat(value) || 0
      myUser.forms = myUser.forms.map(formItem => ({
        ...formItem,
        budget: (
          ((parseFloat(formItem.budgetPercentage) || 0) * totalBudget) /
          100
        ).toFixed(2),
      }))
      myUser.remainingBudget = calculateRemainingBudget(
        myUser.forms,
        totalBudget
      )
    }

    setform1(myUser)
  }

  const handleFormChange1 = (index, field, value) => {
    let myUser = { ...form1 }
    const totalBudget = parseFloat(myUser.totalBudget) || 0

    if (field === "budgetPercentage") {
      myUser.forms[index].budgetPercentage = value
      const percentage = parseFloat(value) || 0
      myUser.forms[index].budget = ((percentage * totalBudget) / 100).toFixed(2)
    } else if (field === "budget") {
      myUser.forms[index].budget = value
      const budgetAmount = parseFloat(value) || 0
      if (totalBudget > 0) {
        const percentage = ((budgetAmount / totalBudget) * 100).toFixed(2)
        myUser.forms[index].budgetPercentage = percentage
      } else {
        myUser.forms[index].budgetPercentage = "0"
      }
    }

    myUser.remainingBudget = calculateRemainingBudget(myUser.forms, totalBudget)

    setform1(myUser)
  }

  const handleSelectChange1 = (selectedOptions, action) => {
    let myUser = { ...form1 }

    if (action.name === "institutionType") {
      myUser.institutionType = selectedOptions || []
    }

    setform1(myUser)
  }

  const UpdatePopUp = data => {
    const institutionTypes = Array.isArray(data.institutionType)
      ? data.institutionType
      : data.institutionType
      ? [data.institutionType]
      : []

    const transformedData = {
      _id: data._id,
      institutionType: typeofInstitution.filter(opt =>
        institutionTypes.some(inst =>
          typeof inst === "object" ? inst._id === opt.value : inst === opt.value
        )
      ),
      financialYearId: data.financialYearId?._id || data.financialYearId || "",
      schemeId: data.schemeId?._id || data.schemeId || "",
      quarterId: data.quarterId?._id || data.quarterId || "",
      totalBudget:
        data.totalBudget?.toString() || data.totalBudget?.toString() || "0",
      remainingBudget: data.remainingBudget?.toString() || "0",
      forms: Array.isArray(data.forms)
        ? data.forms.map(formItem => ({
            groupId: formItem.groupId?._id || formItem.groupId,
            budgetPercentage: formItem.budgetPercentage?.toString() || "0",
            budget:
              formItem.budget?.toString() ||
              formItem.budgetAllocation?.toString() ||
              "0",
          }))
        : [],
    }

    setform1(transformedData)
    setShowEditForm(true)
    setShowAddForm(false)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const FormEditSubmit = e => {
    e.preventDefault()

    if (!form1.institutionType || form1.institutionType.length === 0) {
      toast.error("Please select at least one institution type")
      return
    }

    if (!form1.financialYearId) {
      toast.error("Please select a financial year")
      return
    }

    if (!form1.schemeId) {
      toast.error("Please select a scheme")
      return
    }

    if (!form1.quarterId) {
      toast.error("Please select a quarter")
      return
    }

    const totalPercentage = form1.forms.reduce((total, formItem) => {
      return total + (parseFloat(formItem.budgetPercentage) || 0)
    }, 0)

    if (totalPercentage > 100) {
      toast.error("Total percentage cannot exceed 100%")
      return
    }

    if (parseFloat(form1.remainingBudget) < 0) {
      toast.error("Budget allocation cannot exceed total budget")
      return
    }

    UpdateData()
  }

  const UpdateData = () => {
    var token = TokenData

    const dataArray = {
      institutionType: form1.institutionType.map(inst => inst.value),
      financialYearId: form1.financialYearId,
      schemeId: form1.schemeId,
      quarterId: form1.quarterId,
      totalBudget: parseFloat(form1.totalBudget) || 0,
      remainingBudget: parseFloat(form1.remainingBudget) || 0,
      forms: form1.forms.map(formItem => ({
        groupId: formItem.groupId,
        budgetPercentage: parseFloat(formItem.budgetPercentage) || 0,
        budget: parseFloat(formItem.budget) || 0,
      })),
    }

    axios
      .put(URLS.EditPercentageAllocation + form1._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            setShowEditForm(false)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Failed to update Budget / percentage allocation")
          }
        }
      )
  }

  const DeleteData = data => {
    const confirmBox = window.confirm(
      "Do you really want to Delete this Budget / percentage allocation?"
    )
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = data => {
    var token = TokenData
    var remid = data._id
    axios
      .delete(
        URLS.DeletePercentageAllocation + remid,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(
        res => {
          if (res.status === 200) {
            toast.success(res.data.message)
            Get()
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Failed to delete Budget / percentage allocation")
          }
        }
      )
  }

  const getFormName = groupId => {
    if (!groupId) return "N/A"

    if (typeof groupId === "object" && groupId.formName) {
      return groupId.formName
    }

    const form = allocationForms.find(f => f._id === groupId)
    return form ? form.formName : "N/A"
  }

  const getInstitutionNames = institutionTypes => {
    if (!institutionTypes || institutionTypes.length === 0) return "N/A"

    return institutionTypes
      .map(inst => {
        if (typeof inst === "object" && inst.typeName) {
          return inst.typeName
        }
        const institution = typeofInstitution.find(
          typeInst => typeInst.value === inst
        )
        return institution ? institution.label : "Unknown"
      })
      .join(", ")
  }

  const getSchemeName = schemeId => {
    if (!schemeId) return "N/A"

    if (typeof schemeId === "object" && schemeId.schemeName) {
      return schemeId.schemeName
    }

    const scheme = schemes.find(s => s._id === schemeId)
    return scheme ? scheme.schemeName : "N/A"
  }

  const getQuarterName = quarterId => {
    if (!quarterId) return "N/A"

    if (typeof quarterId === "object" && quarterId.quarterName) {
      return quarterId.quarterName
    }

    const quarter = quarters.find(q => q._id === quarterId)
    return quarter ? quarter.quarterName : "N/A"
  }

  const resetForm = () => {
    setform(initializeForm())
  }

  const calculateRemainingBudget = (forms, totalBudget) => {
    const allocatedBudget = forms.reduce((total, formItem) => {
      return total + (parseFloat(formItem.budget) || 0)
    }, 0)

    return (totalBudget - allocatedBudget).toFixed(2)
  }

  const calculateTotalPercentage = forms => {
    return forms.reduce((total, formItem) => {
      return total + (parseFloat(formItem.budgetPercentage) || 0)
    }, 0)
  }

  const customSelectStyles = {
    control: provided => ({
      ...provided,
      border: "1px solid #dee2e6",
      borderRadius: "0.3rem",
      minHeight: "38px",
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: "#e9ecef",
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: "#495057",
    }),
  }

  const isAllocationActive = financialYearData => {
    if (!financialYearData) return false

    const today = new Date()
    const start = new Date(
      financialYearData.startDate || financialYearData.fromDate
    )
    const end = new Date(financialYearData.endDate || financialYearData.toDate)

    return today >= start && today <= end
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="VAHD ADMIN"
            breadcrumbItem="Budget / Percentage Allocation"
          />
          <Row>
            <Col md={12}>
              <Collapse isOpen={showEditForm}>
                <Card className="p-4 mb-4 border-primary">
                  <Form onSubmit={FormEditSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0 text-primary">
                        <i className="bx bx-edit me-2"></i>
                        Edit Budget / Percentage Allocation
                      </h5>
                      <Button
                        type="button"
                        color="light"
                        onClick={() => setShowEditForm(false)}
                      >
                        <i className="bx bx-x"></i>
                      </Button>
                    </div>
                    <Row>
                      <Col md={2}>
                        <FormGroup>
                          <Label>
                            Type of Institution
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="institutionType"
                            options={typeofInstitution}
                            value={form1.institutionType}
                            onChange={handleSelectChange1}
                            placeholder="Select Institution Types..."
                            styles={customSelectStyles}
                            isMulti
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>
                            Financial Year
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="financialYearId"
                            type="select"
                            value={form1.financialYearId}
                            placeholder="Select Financial Year"
                            onChange={handleChange1}
                          >
                            <option value="">Select Financial Year</option>
                            {financialYears.map(fy => (
                              <option key={fy._id} value={fy._id}>
                                {fy.year}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>
                            Scheme <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="schemeId"
                            type="select"
                            value={form1.schemeId}
                            placeholder="Select Scheme"
                            onChange={handleChange1}
                          >
                            <option value="">Select Scheme</option>
                            {schemes.map(scheme => (
                              <option key={scheme._id} value={scheme._id}>
                                {scheme.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>
                            Quarter <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="quarterId"
                            type="select"
                            value={form1.quarterId}
                            placeholder="Select Quarter"
                            onChange={handleChange1}
                          >
                            <option value="">Select Quarter</option>
                            {quarters.map(quarter => (
                              <option key={quarter._id} value={quarter._id}>
                                {quarter.quarter}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>
                            Total Budget <span className="text-danger">*</span>
                          </Label>
                          <Input
                            required
                            name="totalBudget"
                            type="number"
                            inputMode="decimal"
                            onWheel={e => e.target.blur()}
                            min="0"
                            step="0.01"
                            value={form1.totalBudget}
                            placeholder="Total Budget"
                            onChange={handleChange1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Remaining Budget</Label>
                          <Input
                            disabled
                            name="remainingBudget"
                            type="number"
                            inputMode="decimal"
                            onWheel={e => e.target.blur()}
                            value={form1.remainingBudget}
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr />
                    <h6 className="mb-3">Form Allocations</h6>
                    {form1.forms.map((formItem, index) => {
                      const formDetails = allocationForms.find(
                        f => f._id === formItem.groupId
                      )
                      return (
                        <Row key={index} className="mb-3 border-bottom pb-3">
                          <Col md={4}>
                            <FormGroup>
                              <Label>Form Type</Label>
                              <Input
                                disabled
                                value={formDetails?.formName || "Unknown Form"}
                                className="bg-light"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label>Budget Percentage (%)</Label>
                              <Input
                                name="budgetPercentage"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                min="0"
                                max="100"
                                step="0.1"
                                value={formItem.budgetPercentage}
                                placeholder="Enter Budget Percentage"
                                onChange={e =>
                                  handleFormChange1(
                                    index,
                                    "budgetPercentage",
                                    e.target.value
                                  )
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label>Budget Amount</Label>
                              <Input
                                name="budget"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                min="0"
                                step="0.01"
                                value={formItem.budget}
                                placeholder="Enter Budget Amount"
                                onChange={e =>
                                  handleFormChange1(
                                    index,
                                    "budget",
                                    e.target.value
                                  )
                                }
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label>Allocated</Label>
                              <div className="mt-2">
                                <Badge
                                  color={
                                    parseFloat(formItem.budgetPercentage) > 0 ||
                                    parseFloat(formItem.budget) > 0
                                      ? "success"
                                      : "secondary"
                                  }
                                  className="d-block"
                                >
                                  {formItem.budgetPercentage}%
                                </Badge>
                                <small className="text-muted d-block">
                                  Amount: {formItem.budget}
                                </small>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      )
                    })}
                    <Row className="mt-3">
                      <Col md={6}>
                        <div className="alert alert-info">
                          <strong>
                            Total Allocation:
                            {calculateTotalPercentage(form1.forms).toFixed(1)}%
                          </strong>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div
                          className={`alert ${
                            parseFloat(form1.remainingBudget) >= 0
                              ? "alert-success"
                              : "alert-danger"
                          }`}
                        >
                          <strong>
                            Remaining Budget: {form1.remainingBudget}
                          </strong>
                        </div>
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
                <Card className="border-success">
                  <CardBody>
                    <Form onSubmit={FormAddSubmit}>
                      <h5 className="mb-3 text-success">
                        <i className="bx bx-plus-circle me-2"></i>
                        Add Budget / Percentage Allocation
                      </h5>
                      <Row>
                        <Col md={2}>
                          <FormGroup>
                            <Label>
                              Type of Institution
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              name="institutionType"
                              options={typeofInstitution}
                              value={form.institutionType}
                              onChange={handleSelectChange}
                              placeholder="Select Institution Types..."
                              styles={customSelectStyles}
                              isMulti
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>
                              Financial Year
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="financialYearId"
                              type="select"
                              value={form.financialYearId}
                              placeholder="Select Financial Year"
                              onChange={handleChange}
                            >
                              <option value="">Select Financial Year</option>
                              {financialYears.map(fy => (
                                <option key={fy._id} value={fy._id}>
                                  {fy.year}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>
                              Scheme <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="schemeId"
                              type="select"
                              value={form.schemeId}
                              placeholder="Select Scheme"
                              onChange={handleChange}
                            >
                              <option value="">Select Scheme</option>
                              {schemes.map(scheme => (
                                <option key={scheme._id} value={scheme._id}>
                                  {scheme.name}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>
                              Quarter <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="quarterId"
                              type="select"
                              value={form.quarterId}
                              placeholder="Select Quarter"
                              onChange={handleChange}
                            >
                              <option value="">Select Quarter</option>
                              {quarters.map(quarter => (
                                <option key={quarter._id} value={quarter._id}>
                                  {quarter.quarter}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>
                              Total Budget
                              <span className="text-danger">*</span>
                            </Label>
                            <Input
                              required
                              name="totalBudget"
                              type="number"
                              inputMode="decimal"
                              onWheel={e => e.target.blur()}
                              min="0"
                              step="0.01"
                              value={form.totalBudget}
                              placeholder="Total Budget"
                              onChange={handleChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Remaining Budget</Label>
                            <Input
                              disabled
                              name="remainingBudget"
                              type="number"
                              inputMode="decimal"
                              onWheel={e => e.target.blur()}
                              value={form.remainingBudget}
                              className="bg-light"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr />
                      <h6 className="mb-3">Form Allocations</h6>
                      {form.forms.map((formItem, index) => {
                        const formDetails = allocationForms.find(
                          f => f._id === formItem.groupId
                        )
                        return (
                          <Row key={index} className="mb-3 border-bottom pb-3">
                            <Col md={4}>
                              <FormGroup>
                                <Label>Form Type</Label>
                                <Input
                                  disabled
                                  value={
                                    formDetails?.formName || "Unknown Form"
                                  }
                                  className="bg-light"
                                />
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup>
                                <Label>Budget Percentage (%)</Label>
                                <Input
                                  name="budgetPercentage"
                                  type="number"
                                  inputMode="decimal"
                                  onWheel={e => e.target.blur()}
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  value={formItem.budgetPercentage}
                                  placeholder="Enter Budget Percentage"
                                  onChange={e =>
                                    handleFormChange(
                                      index,
                                      "budgetPercentage",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup>
                                <Label>Budget Amount</Label>
                                <Input
                                  name="budget"
                                  type="number"
                                  inputMode="decimal"
                                  onWheel={e => e.target.blur()}
                                  min="0"
                                  step="0.01"
                                  value={formItem.budget}
                                  placeholder="Enter Budget Amount"
                                  onChange={e =>
                                    handleFormChange(
                                      index,
                                      "budget",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormGroup>
                            </Col>
                            <Col md={2}>
                              <FormGroup>
                                <Label>Allocated</Label>
                                <div className="mt-2">
                                  <Badge
                                    color={
                                      parseFloat(formItem.budgetPercentage) >
                                        0 || parseFloat(formItem.budget) > 0
                                        ? "success"
                                        : "secondary"
                                    }
                                    className="d-block"
                                  >
                                    {formItem.budgetPercentage}%
                                  </Badge>
                                  <small className="text-muted d-block">
                                    Amount: {formItem.budget}
                                  </small>
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                        )
                      })}
                      <Row className="mt-3">
                        <Col md={6}>
                          <div className="alert alert-info">
                            <strong>
                              Total Allocation:
                              {calculateTotalPercentage(form.forms).toFixed(1)}%
                            </strong>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div
                            className={`alert ${
                              parseFloat(form.remainingBudget) >= 0
                                ? "alert-success"
                                : "alert-danger"
                            }`}
                          >
                            <strong>
                              Remaining Budget: {form.remainingBudget}
                            </strong>
                          </div>
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
                    <Col md={6}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          <i className="bx bx-pie-chart me-2"></i>
                          Budget / Percentage Allocation Management
                        </h5>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-end">
                        <Input
                          name="search"
                          value={form.search || ""}
                          onChange={SearchData}
                          type="search"
                          placeholder="Search..."
                          style={{ maxWidth: "200px" }}
                          className="m-1"
                        />

                        {Roles?.PercentageAllocationAdd === true ||
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
                                  Add New Allocation{" "}
                                  <i className="bx bx-plus"></i>
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                  </Row>
                  <div className="table-rep-plugin mt-4">
                    <Table hover bordered responsive className="mb-0">
                      <thead className="table-light">
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Institution Type</th>
                          <th>Form Allocations</th>
                          <th>Financial Year</th>
                          <th>Scheme</th>
                          <th>Quarter</th>
                          <th>Total Percentage</th>
                          <th>Total Budget</th>
                          <th>Remaining Budget</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lists.length > 0 ? (
                          lists.map((data, key) => {
                            const institutionTypes = Array.isArray(
                              data.institutionType
                            )
                              ? data.institutionType
                              : data.institutionType
                              ? [data.institutionType]
                              : []

                            const totalPercentage = Array.isArray(data.forms)
                              ? data.forms.reduce(
                                  (total, formItem) =>
                                    total +
                                    (parseFloat(formItem.budgetPercentage) ||
                                      0),
                                  0
                                )
                              : 0
                            const totalBudget = Array.isArray(data.forms)
                              ? data.forms.reduce(
                                  (total, formItem) =>
                                    total +
                                    (parseFloat(formItem.budget) ||
                                      parseFloat(formItem.budgetAllocation) ||
                                      0),
                                  0
                                )
                              : 0
                            const remainingBudget =
                              (parseFloat(data.totalBudget) ||
                                parseFloat(data.totalBudget) ||
                                0) - totalBudget

                            const isActive = isAllocationActive(
                              data.financialYearId
                            )
                            return (
                              <tr key={key} className="text-center">
                                <th scope="row">{pagesVisited + key + 1}</th>
                                <td>
                                  <div className="text-start">
                                    {getInstitutionNames(institutionTypes)
                                      .split(", ")
                                      .map((inst, index) => (
                                        <Badge
                                          key={index}
                                          color="primary"
                                          className="me-1 mb-1 fs-6"
                                        >
                                          {inst}
                                        </Badge>
                                      ))}
                                  </div>
                                </td>
                                <td>
                                  {Array.isArray(data.forms) ? (
                                    <div className="text-start">
                                      {data.forms.map((formItem, index) => (
                                        <div key={index} className="mb-1">
                                          <small>
                                            <strong>
                                              {getFormName(formItem.groupId)}:
                                            </strong>
                                            {formItem.budgetPercentage}% (
                                            {(
                                              parseFloat(formItem.budget) ||
                                              parseFloat(
                                                formItem.budgetAllocation
                                              ) ||
                                              0
                                            ).toLocaleString()}
                                            )
                                          </small>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td>
                                  <Badge color="info" className="fs-6">
                                    {data.financialYearId?.year ||
                                      data.financialYear ||
                                      "N/A"}
                                  </Badge>
                                </td>
                                <td>{data.schemeName}</td>
                                <td>{data.quarterName}</td>
                                <td>
                                  <Badge color="info" className="fs-6">
                                    {totalPercentage.toFixed(1)}%
                                  </Badge>
                                </td>
                                <td>
                                  <strong>
                                    {(
                                      parseFloat(data.totalBudget) ||
                                      parseFloat(data.totalBudget) ||
                                      0
                                    ).toLocaleString()}
                                  </strong>
                                </td>
                                <td>
                                  <Badge
                                    color={
                                      remainingBudget >= 0
                                        ? "success"
                                        : "danger"
                                    }
                                    className="fs-6"
                                  >
                                    {remainingBudget.toLocaleString()}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    {Roles?.PercentageAllocationEdit === true ||
                                    Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          onClick={() => UpdatePopUp(data)}
                                          size="sm"
                                          className="me-1"
                                          color="info"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {Roles?.PercentageAllocationDelete ===
                                      true || Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          onClick={() => DeleteData(data)}
                                          size="sm"
                                          className="me-1"
                                          color="danger"
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
                            <td colSpan="11" className="text-center py-4">
                              <div className="text-muted">
                                <i className="bx bx-data display-4"></i>
                                <p className="mt-2">
                                  No Budget / percentage allocations found
                                </p>
                              </div>
                            </td>
                          </tr>
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
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default PercentageAllocation
