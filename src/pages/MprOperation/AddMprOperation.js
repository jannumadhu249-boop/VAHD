import React, { useState, useEffect, useCallback, useMemo } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import { FiPlus, FiTrash2 } from "react-icons/fi"
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

const AddMprOperation = () => {
  const history = useHistory()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const UserDetails = TokenJson?.user

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

  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const initialFormState = {
    visitDate: getCurrentDate(),
    workingPlaceId: "",
  }
  const [form, setForm] = useState(initialFormState)

  const [placeOfWorking, setPlaceOfWorking] = useState([])

  const [selectedVillage, setSelectedVillage] = useState(null)

  const [inputList, setInputList] = useState([
    { itemName: "", gender: "", count: "" },
  ])

  const handleInputChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const token = JSON.parse(localStorage.getItem("authUser"))?.token
  const [items, setItems] = useState([])

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.post(
        URLS.GetAllItems,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setItems(response.data.items || [])
    } catch (error) {
      toast.error("Failed to load Items")
    }
  }, [token])

  const placeOfWorkingOptions = useMemo(
    () =>
      placeOfWorking.map(p => ({
        value: p._id,
        label: p.name,
      })),
    [placeOfWorking]
  )

  const [inputValue, setInputValue] = useState("")

  const handlePlaceOfWorking = inputValue => {
    setInputValue(inputValue)
    debouncedSearch(inputValue)
  }

  const debouncedSearch = useCallback(
    debounce(searchValue => {
      if (searchValue.trim()) {
        SearchfetchPlaceOfWorking(searchValue)
      } else {
        fetchPlaceOfWorking()
      }
    }, 500),
    [token]
  )

  const fetchPlaceOfWorking = useCallback(
    async e => {
      try {
        const response = await axios.post(
          URLS.GetAllPlaceOfWorkingPaginated,
          { page: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setPlaceOfWorking(response.data.data || [])
      } catch (error) {
        toast.error("Failed to load Place Of Working")
      }
    },
    [token]
  )

  const SearchfetchPlaceOfWorking = async searchValue => {
    try {
      const response = await axios.post(
        `${URLS.GetAllPlaceOfWorkingPaginated}${searchValue}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.status === 200) {
        setPlaceOfWorking(response.data.data || [])
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(error.response.data.message)
      }
      setPlaceOfWorking([])
    }
  }

  useEffect(() => {
    fetchItems()
    fetchPlaceOfWorking()
  }, [fetchItems, fetchPlaceOfWorking])

  const handleSpecInputChange = (e, index) => {
    const { name, value } = e.target
    const list = [...inputList]
    list[index][name] = value
    setInputList(list)
  }

  const handleRemoveClick = index => {
    if (inputList.length <= 1) return
    const list = [...inputList]
    list.splice(index, 1)
    setInputList(list)
  }

  const handleAddClick = () => {
    setInputList([...inputList, { itemName: "", gender: "", count: "" }])
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const missingFields = []
    if (!form.visitDate) missingFields.push("Visit Date")
    if (!form.workingPlaceId) missingFields.push("Working Place")
    if (missingFields.length > 0) {
      toast.error(`Please fill: ${missingFields.join(", ")}`)
      return
    }
    setIsSubmitting(true)
    try {
      const formDataToSend = {
        mprOperation: inputList,
        visitDate: form.visitDate,
        addedByEmp: UserDetails?._id,
        workingPlaceId: form.workingPlaceId,
      }
      const response = await axios.post(URLS.AddMprOperation, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      toast.success(
        response.data.message || "Progress  Report added successfully"
      )
      history.push("/mpr-operation")
    } catch (error) {
      console.error("Error addingProgress  Report :", error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to Add Progress  Report . Please try again"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectChange = (selectedOption, { name }) => {
    if (name === "workingPlaceId") {
      setSelectedVillage(selectedOption)
    }
    setForm(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }))

    if (name === "animalTypeId" && selectedOption) {
      getOneBreeds(selectedOption.value)
      setForm(prev => ({ ...prev, breedId: "" }))
    }
  }

  const getCurrentPlace = () => {
    return selectedVillage
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Add Progress Report" />
        <Row>
          <Col lg="12">
            <Form onSubmit={handleSubmit}>
              <Card className="mb-3">
                <CardBody className="p-3">
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
                          inputValue={inputValue}
                          onChange={handleSelectChange}
                          onInputChange={handlePlaceOfWorking}
                          options={placeOfWorkingOptions}
                          styles={selectStyles}
                          placeholder="Search and select Place of Working..."
                          isSearchable
                          filterOption={() => true}
                          noOptionsMessage={() =>
                            inputValue
                              ? "No Place of Working found"
                              : "Type to search Place of Working..."
                          }
                          loadingMessage={() => "Searching..."}
                          isClearable
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
                  </Row>
                </CardBody>
              </Card>
              <Row className="mb-3">
                <Col md="12">
                  {inputList.map((x, i) => (
                    <Card key={i} className="mb-3">
                      <CardBody>
                        <Row className="mb-3">
                          <Col md={6}>
                            {inputList.length > 1 && (
                              <Button
                                color="danger"
                                size="sm"
                                className="me-2"
                                onClick={() => handleRemoveClick(i)}
                                disabled={isSubmitting}
                              >
                                <FiTrash2 className="me-1" />
                                Remove
                              </Button>
                            )}
                          </Col>
                          <Col md={6} className="text-end">
                            {inputList.length - 1 === i && (
                              <Button
                                color="info"
                                size="sm"
                                onClick={handleAddClick}
                                disabled={isSubmitting}
                              >
                                <FiPlus className="me-1" />
                                Add More
                              </Button>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <FormGroup>
                              <Label>Item Name</Label>
                              <Input
                                size="sm"
                                type="select"
                                name="itemName"
                                value={x.itemName}
                                onChange={e => handleSpecInputChange(e, i)}
                                className="form-select"
                                required
                                disabled={isSubmitting}
                              >
                                <option value="">Select Item Name</option>
                                {items.map(item => (
                                  <option key={item.name} value={item.name}>
                                    {item.name}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label>Gender</Label>
                              <Input
                                size="sm"
                                type="select"
                                name="gender"
                                value={x.gender}
                                onChange={e => handleSpecInputChange(e, i)}
                                className="form-select"
                                required
                                disabled={isSubmitting}
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label>Count</Label>
                              <Input
                                size="sm"
                                type="number"
                                inputMode="decimal"
                                onWheel={e => e.target.blur()}
                                min="1"
                                required
                                name="count"
                                placeholder="Enter Count"
                                value={x.count}
                                onChange={e => handleSpecInputChange(e, i)}
                                disabled={isSubmitting}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}
                </Col>
              </Row>
              <div className="d-flex justify-content-end mb-5">
                <Button color="primary" type="submit">
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit</>
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

export default AddMprOperation
