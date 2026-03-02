import React, { useEffect, useState, useMemo, useCallback } from "react"
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
  Spinner,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

const NoteForm = ({
  form,
  handleFormChange,
  handleHeaderChange,
  handleReferenceChange,
  addReference,
  removeReference,
  handleDrugSelect,
  handleItemChange,
  addItem,
  removeItem,
  handleBodyParagraphChange,
  addBodyParagraph,
  removeBodyParagraph,
  handleAccountHeadChange,
  addAccountHead,
  removeAccountHead,
  onSubmit,
  onCancel,
  drugs,
  financialYears,
  mode = "create",
  loading = false,
}) => {
  const calculateTotals = () => {
    const itemsTotal = form.items.reduce((sum, item) => {
      const total = parseFloat(item.total) || 0
      return sum + total
    }, 0)

    const taxRate = 0.12
    const taxAmount = itemsTotal * taxRate
    const totalWithTax = itemsTotal + taxAmount

    return {
      itemsTotal: itemsTotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalWithTax: totalWithTax.toFixed(2),
    }
  }

  const totals = calculateTotals()

  return (
    <Card className="p-4 mb-4 border-primary">
      <Form onSubmit={onSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="text-primary">
            <i className="bx bx-note me-2"></i>
            {mode === "edit" ? "Edit Note" : "Create New Note"}
          </h5>
          <Badge color={mode === "edit" ? "warning" : "success"}>
            {mode === "edit" ? "Editing Mode" : "Creation Mode"}
          </Badge>
        </div>

        {/* Header Information */}
        <h6 className="mb-3 border-bottom pb-2">
          <i className="bx bx-credit-card-front me-2"></i>
          Header Information
        </h6>
        <Row>
          <Col md="4" className="mb-3">
            <FormGroup>
              <Label className="fw-bold">
                Financial Year <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={handleFormChange}
                name="financialYearId"
                value={form.financialYearId}
                required
                type="select"
                bsSize="sm"
                className="border-primary"
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
          <Col md="4" className="mb-3">
            <FormGroup>
              <Label className="fw-bold">
                Title <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={handleHeaderChange}
                name="title"
                value={form.header.title}
                required
                type="text"
                placeholder="Enter note title"
                bsSize="sm"
                className="border-primary"
              />
            </FormGroup>
          </Col>
          <Col md="4" className="mb-3">
            <FormGroup>
              <Label className="fw-bold">
                File No <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={handleHeaderChange}
                name="noteFileNo"
                value={form.header.noteFileNo}
                required
                type="text"
                placeholder="Enter file number"
                bsSize="sm"
                className="border-primary"
              />
            </FormGroup>
          </Col>
          <Col md="12" className="mb-3">
            <FormGroup>
              <Label className="fw-bold">
                Subject <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={handleFormChange}
                name="subject"
                value={form.subject}
                required
                type="text"
                placeholder="Enter subject"
                bsSize="sm"
                className="border-primary"
              />
            </FormGroup>
          </Col>
        </Row>

        {/* References */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">
            <i className="bx bx-link me-2"></i>
            References
          </h6>
          <Button color="secondary" onClick={addReference} size="sm">
            <i className="bx bx-plus me-1"></i> Add Reference
          </Button>
        </div>
        {form.references.map((ref, index) => (
          <Row key={index} className="mb-2 align-items-center">
            <Col md="10">
              <Input
                value={ref}
                onChange={e => handleReferenceChange(index, e.target.value)}
                type="text"
                placeholder={`Reference ${index + 1}`}
                bsSize="sm"
                className="border-info"
              />
            </Col>
            <Col md="2" className="text-end">
              {form.references.length > 1 && (
                <Button
                  color="danger"
                  onClick={() => removeReference(index)}
                  size="sm"
                  outline
                >
                  <i className="bx bx-trash"></i>
                </Button>
              )}
            </Col>
          </Row>
        ))}

        {/* Introduction Paragraph */}
        <h6 className="mb-3">
          <i className="bx bx-text me-2"></i>
          Introduction Paragraph
        </h6>
        <FormGroup>
          <Input
            onChange={handleFormChange}
            name="introParagraph"
            value={form.introParagraph}
            type="textarea"
            rows="3"
            placeholder="Enter introduction paragraph..."
            bsSize="sm"
            className="border-info"
          />
        </FormGroup>

        {/* Items / Drugs */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">
            <i className="bx bx-package me-2"></i>
            Items / Drugs
          </h6>
          <Button color="secondary" onClick={addItem} size="sm">
            <i className="bx bx-plus me-1"></i> Add Item
          </Button>
        </div>
        {form.items.map((item, index) => (
          <div key={index} className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 text-muted">Item #{index + 1}</h6>
              {form.items.length > 1 && (
                <Button
                  color="danger"
                  onClick={() => removeItem(index)}
                  size="sm"
                  outline
                >
                  <i className="bx bx-trash me-1"></i> Remove
                </Button>
              )}
            </div>
            <Row className="g-2">
              <Col md="3">
                <FormGroup>
                  <Label>Drug Code</Label>
                  <Input
                    type="select"
                    value={item.code}
                    onChange={e => handleDrugSelect(index, e.target.value)}
                    bsSize="sm"
                    className="border-info"
                  >
                    <option value="">Select Drug</option>
                    {drugs.map(drug => (
                      <option key={drug._id} value={drug.drugCode}>
                        {drug.drugCode} - {drug.tradeName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Trade Name</Label>
                  <Input
                    value={item.tradeName}
                    type="text"
                    readOnly
                    placeholder="Auto-filled"
                    bsSize="sm"
                    className="bg-light"
                  />
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label>Firm</Label>
                  <Input
                    value={item.firm}
                    onChange={e =>
                      handleItemChange(index, "firm", e.target.value)
                    }
                    type="text"
                    placeholder="Firm name"
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label>Quantity</Label>
                  <Input
                    value={item.qty}
                    onChange={e =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    min="0"
                    step="1"
                    placeholder="Qty"
                    bsSize="sm"
                    className="border-warning"
                  />
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label>Unit Price (₹)</Label>
                  <Input
                    value={item.unitPrice}
                    type="text"
                    readOnly
                    placeholder="Auto-filled"
                    bsSize="sm"
                    className="bg-light"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md="6">
                <FormGroup>
                  <Label>Total (₹)</Label>
                  <Input
                    value={item.total}
                    type="text"
                    readOnly
                    placeholder="Auto-calculated"
                    bsSize="sm"
                    className="bg-light fw-bold"
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        ))}

        {/* Totals Summary */}
        <Card className="border shadow-sm mb-4">
          <CardBody>
            <h6 className="mb-3">
              <i className="bx bx-calculator me-2"></i>
              Totals Summary
            </h6>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label className="fw-bold">Items Total (₹)</Label>
                  <Input
                    value={totals.itemsTotal}
                    type="text"
                    readOnly
                    bsSize="sm"
                    className="fw-bold text-success"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="fw-bold">Tax Amount (₹)</Label>
                  <Input
                    value={totals.taxAmount}
                    type="text"
                    readOnly
                    bsSize="sm"
                    className="fw-bold text-warning"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="fw-bold">Total with Tax (₹)</Label>
                  <Input
                    value={totals.totalWithTax}
                    type="text"
                    readOnly
                    bsSize="sm"
                    className="fw-bold text-danger"
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Financial Information */}
        <Card className="border shadow-sm mb-4">
          <CardBody>
            <h6 className="mb-3">
              <i className="bx bx-money me-2"></i>
              Financial Information
            </h6>
            <Row className="g-3">
              <Col md="4">
                <FormGroup>
                  <Label className="fw-bold">Allocated Budget (₹)</Label>
                  <Input
                    onChange={handleFormChange}
                    name="allocatedBudget"
                    value={form.allocatedBudget}
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    step="0.01"
                    placeholder="Enter allocated budget"
                    bsSize="sm"
                    className="border-success"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="fw-bold">Budget Released (₹)</Label>
                  <Input
                    onChange={handleFormChange}
                    name="budgetReleased"
                    value={form.budgetReleased}
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    step="0.01"
                    placeholder="Enter budget released"
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="fw-bold">
                    Balance Budget Available (₹)
                  </Label>
                  <Input
                    onChange={handleFormChange}
                    name="balanceBudgetAvailable"
                    value={form.balanceBudgetAvailable}
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    step="0.01"
                    placeholder="Enter balance budget"
                    bsSize="sm"
                    className="border-info"
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Body Paragraphs */}
        <Card className="border shadow-sm mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">
                <i className="bx bx-paragraph me-2"></i>
                Body Paragraphs
              </h6>
              <Button color="secondary" onClick={addBodyParagraph} size="sm">
                <i className="bx bx-plus me-1"></i> Add Paragraph
              </Button>
            </div>

            <FormGroup className="mb-3">
              <Label>First Line</Label>
              <Input
                onChange={handleFormChange}
                name="bodyParagraphFirstLine"
                value={form.bodyParagraphFirstLine}
                type="text"
                placeholder="Enter first line"
                bsSize="sm"
              />
            </FormGroup>

            {form.bodyParagraph.map((paragraph, index) => (
              <div key={index} className="mb-2">
                <Row className="align-items-center">
                  <Col md="10">
                    <Input
                      value={paragraph}
                      onChange={e =>
                        handleBodyParagraphChange(index, e.target.value)
                      }
                      type="textarea"
                      rows="2"
                      placeholder={`Paragraph ${index + 1}`}
                      bsSize="sm"
                    />
                  </Col>
                  <Col md="2" className="text-end">
                    {form.bodyParagraph.length > 1 && (
                      <Button
                        color="danger"
                        onClick={() => removeBodyParagraph(index)}
                        size="sm"
                        outline
                      >
                        <i className="bx bx-trash"></i>
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Technical Sanctions */}
        <Card className="border shadow-sm mb-4">
          <CardBody>
            <h6 className="mb-3">
              <i className="bx bx-check-shield me-2"></i>
              Technical Sanctions
            </h6>
            <Row className="g-3">
              <Col md="4">
                <FormGroup>
                  <Label>Already Issued (Incl. Tax) (₹)</Label>
                  <Input
                    onChange={handleFormChange}
                    name="technicalSanctionsAlreadyIssuedInclTax"
                    value={form.technicalSanctionsAlreadyIssuedInclTax}
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    step="0.01"
                    placeholder="Already issued amount"
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Now Issued (Incl. Tax) (₹)</Label>
                  <Input
                    onChange={handleFormChange}
                    name="technicalSanctionsNowIssuedInclTax"
                    value={form.technicalSanctionsNowIssuedInclTax}
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    step="0.01"
                    placeholder="Now issued amount"
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Total Issued (Incl. Tax) (₹)</Label>
                  <Input
                    onChange={handleFormChange}
                    name="totalTechnicalSanctionsIssuedInclTax"
                    value={form.totalTechnicalSanctionsIssuedInclTax}
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    step="0.01"
                    placeholder="Total issued amount"
                    bsSize="sm"
                    className="border-warning"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Now Issued (Excl. Tax) (₹)</Label>
                  <Input
                    onChange={handleFormChange}
                    name="technicalSanctionNowIssuedExclTax"
                    value={form.technicalSanctionNowIssuedExclTax}
                    type="number"
                    inputMode="decimal"
                    onWheel={e => e.target.blur()}
                    step="0.01"
                    placeholder="Now issued excl. tax"
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Account Heads */}
        <Card className="border shadow-sm mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">
                <i className="bx bx-list-ul me-2"></i>
                Account Heads
              </h6>
              <Button color="secondary" onClick={addAccountHead} size="sm">
                <i className="bx bx-plus me-1"></i> Add Account Head
              </Button>
            </div>

            {form.accountHeads.map((accountHead, index) => (
              <Row key={index} className="mb-2 align-items-center">
                <Col md="10">
                  <Input
                    value={accountHead}
                    onChange={e =>
                      handleAccountHeadChange(index, e.target.value)
                    }
                    type="text"
                    placeholder={`Account Head ${index + 1}`}
                    bsSize="sm"
                  />
                </Col>
                <Col md="2" className="text-end">
                  {form.accountHeads.length > 1 && (
                    <Button
                      color="danger"
                      onClick={() => removeAccountHead(index)}
                      size="sm"
                      outline
                    >
                      <i className="bx bx-trash"></i>
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
          </CardBody>
        </Card>

        {/* Extra Paragraph */}
        <Card className="border shadow-sm mb-4">
          <CardBody>
            <h6 className="mb-3">
              <i className="bx bx-add-to-queue me-2"></i>
              Extra Paragraph
            </h6>
            <FormGroup>
              <Input
                onChange={handleFormChange}
                name="extraParagraph"
                value={form.extraParagraph}
                type="textarea"
                rows="3"
                placeholder="Enter extra paragraph..."
                bsSize="sm"
              />
            </FormGroup>
          </CardBody>
        </Card>

        {/* Footer Text */}
        <Card className="border shadow-sm mb-4">
          <CardBody>
            <h6 className="mb-3">
              <i className="bx bx-flag me-2"></i>
              Footer Text
            </h6>
            <FormGroup>
              <Input
                onChange={handleFormChange}
                name="footerText"
                value={form.footerText}
                type="textarea"
                rows="3"
                placeholder="Enter footer text..."
                bsSize="sm"
              />
            </FormGroup>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4 p-3 bg-light rounded">
          <Button
            type="button"
            onClick={onCancel}
            color="light"
            size="sm"
            className="border"
            disabled={loading}
          >
            <i className="bx bx-x-circle me-1"></i>
            Cancel
          </Button>
          <Button type="submit" color="primary" size="sm" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                {mode === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <i className="bx bx-check-circle me-1"></i>
                {mode === "edit" ? "Update Note" : "Create Note"}
              </>
            )}
          </Button>
        </div>
      </Form>
    </Card>
  )
}

const Note = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson?.token

  const [show, setShow] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [data, setData] = useState([])
  const [drugs, setDrugs] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  const initialFormState = {
    header: {
      title: "",
      noteFileNo: "",
    },
    financialYearId: "",
    subject: "",
    references: [""],
    introParagraph: "",
    items: [
      {
        code: "",
        firm: "",
        tradeName: "",
        qty: "",
        unitPrice: "",
        total: "",
      },
    ],
    allocatedBudget: "",
    bodyParagraphFirstLine: "",
    bodyParagraph: [""],
    extraParagraph: "",
    accountHeads: [""],
    budgetReleased: "",
    technicalSanctionsAlreadyIssuedInclTax: "",
    technicalSanctionsNowIssuedInclTax: "",
    totalTechnicalSanctionsIssuedInclTax: "",
    balanceBudgetAvailable: "",
    technicalSanctionNowIssuedExclTax: "",
    footerText: "",
  }

  const [form, setForm] = useState(initialFormState)
  const [editForm, setEditForm] = useState(initialFormState)
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  // Fetch financial years
  const fetchFinancialYears = useCallback(async () => {
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
        setFinancialYears(response.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error(
        error.response?.data?.message || "Failed to fetch financial years"
      )
    }
  }, [TokenData])

  useEffect(() => {
    Get()
    GetDrugs()
    fetchFinancialYears()
  }, [fetchFinancialYears])

  const Get = useCallback(() => {
    setLoading(true)
    const token = TokenData
    axios
      .post(
        URLS.GetNote,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setData(res.data.data || [])
      })
      .catch(error => {
        console.error("Error fetching notes:", error)
        toast.error("Failed to fetch notes")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [TokenData])

  const GetDrugs = useCallback(() => {
    const token = TokenData
    setLoading(true)
    axios
      .get(URLS.GetDrug, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setDrugs(res.data.data || [])
      })
      .catch(error => {
        console.error("Error fetching drugs:", error)
        toast.error("Failed to fetch drugs")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [TokenData])

  const SearchData = e => {
    const value = e.target.value
    setSearchTerm(value)

    if (!value.trim()) {
      Get()
      return
    }

    const token = TokenData
    setLoading(true)
    axios
      .post(
        URLS.GetNoteSearch + value,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        if (res.status === 200) {
          setData(res.data.data || [])
          setPageNumber(0)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const createFormHandlers = (formState, setFormState) => {
    const handleFormChange = e => {
      const { name, value } = e.target
      setFormState(prev => ({ ...prev, [name]: value }))
    }

    const handleHeaderChange = e => {
      const { name, value } = e.target
      setFormState(prev => ({
        ...prev,
        header: {
          ...prev.header,
          [name]: value,
        },
      }))
    }

    const handleReferenceChange = (index, value) => {
      const newReferences = [...formState.references]
      newReferences[index] = value
      setFormState(prev => ({ ...prev, references: newReferences }))
    }

    const addReference = () => {
      setFormState(prev => ({
        ...prev,
        references: [...prev.references, ""],
      }))
    }

    const removeReference = index => {
      const newReferences = formState.references.filter((_, i) => i !== index)
      setFormState(prev => ({ ...prev, references: newReferences }))
    }

    const handleDrugSelect = (index, drugCode) => {
      const selectedDrug = drugs.find(drug => drug.drugCode === drugCode)
      if (selectedDrug) {
        const newItems = [...formState.items]
        newItems[index] = {
          ...newItems[index],
          code: selectedDrug.drugCode,
          tradeName: selectedDrug.tradeName,
          unitPrice: selectedDrug.unitPrice,
          total: calculateItemTotal(
            newItems[index].qty,
            selectedDrug.unitPrice
          ),
        }
        setFormState(prev => ({ ...prev, items: newItems }))
      }
    }

    const calculateItemTotal = (qty, unitPrice) => {
      const qtyNum = parseFloat(qty) || 0
      const priceNum = parseFloat(unitPrice) || 0
      return (qtyNum * priceNum).toFixed(2)
    }

    const handleItemChange = (index, field, value) => {
      const newItems = [...formState.items]
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      }

      if (field === "qty") {
        const qty = parseFloat(value) || 0
        const unitPrice = parseFloat(newItems[index].unitPrice) || 0
        newItems[index].total = calculateItemTotal(qty, unitPrice)
      }

      setFormState(prev => ({ ...prev, items: newItems }))
    }

    const addItem = () => {
      setFormState(prev => ({
        ...prev,
        items: [
          ...prev.items,
          {
            code: "",
            firm: "",
            tradeName: "",
            qty: "",
            unitPrice: "",
            total: "",
          },
        ],
      }))
    }

    const removeItem = index => {
      if (formState.items.length > 1) {
        const newItems = formState.items.filter((_, i) => i !== index)
        setFormState(prev => ({ ...prev, items: newItems }))
      }
    }

    const handleBodyParagraphChange = (index, value) => {
      const newBodyParagraphs = [...formState.bodyParagraph]
      newBodyParagraphs[index] = value
      setFormState(prev => ({ ...prev, bodyParagraph: newBodyParagraphs }))
    }

    const addBodyParagraph = () => {
      setFormState(prev => ({
        ...prev,
        bodyParagraph: [...prev.bodyParagraph, ""],
      }))
    }

    const removeBodyParagraph = index => {
      if (formState.bodyParagraph.length > 1) {
        const newBodyParagraphs = formState.bodyParagraph.filter(
          (_, i) => i !== index
        )
        setFormState(prev => ({ ...prev, bodyParagraph: newBodyParagraphs }))
      }
    }

    const handleAccountHeadChange = (index, value) => {
      const newAccountHeads = [...formState.accountHeads]
      newAccountHeads[index] = value
      setFormState(prev => ({ ...prev, accountHeads: newAccountHeads }))
    }

    const addAccountHead = () => {
      setFormState(prev => ({
        ...prev,
        accountHeads: [...prev.accountHeads, ""],
      }))
    }

    const removeAccountHead = index => {
      if (formState.accountHeads.length > 1) {
        const newAccountHeads = formState.accountHeads.filter(
          (_, i) => i !== index
        )
        setFormState(prev => ({ ...prev, accountHeads: newAccountHeads }))
      }
    }

    return {
      handleFormChange,
      handleHeaderChange,
      handleReferenceChange,
      addReference,
      removeReference,
      handleDrugSelect,
      handleItemChange,
      addItem,
      removeItem,
      handleBodyParagraphChange,
      addBodyParagraph,
      removeBodyParagraph,
      handleAccountHeadChange,
      addAccountHead,
      removeAccountHead,
    }
  }

  const formHandlers = createFormHandlers(form, setForm)
  const editFormHandlers = createFormHandlers(editForm, setEditForm)

  const AddPopUp = () => {
    setShow(!show)
    setShowEdit(false)
    setForm(initialFormState)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const FormAddSubmit = e => {
    e.preventDefault()
    AddData()
  }

  const AddData = () => {
    const token = TokenData

    const filteredReferences = form.references.filter(ref => ref.trim() !== "")
    const filteredAccountHeads = form.accountHeads.filter(
      accountHead => accountHead.trim() !== ""
    )
    const filteredBodyParagraphs = form.bodyParagraph.filter(
      paragraph => paragraph.trim() !== ""
    )

    const itemsWithTotals = form.items.map(item => ({
      ...item,
      qty: parseFloat(item.qty) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: parseFloat(item.total) || 0,
    }))

    const dataArray = {
      header: {
        title: form.header.title,
        noteFileNo: form.header.noteFileNo,
      },
      financialYearId: form.financialYearId,
      subject: form.subject,
      references: filteredReferences,
      introParagraph: form.introParagraph,
      items: itemsWithTotals,
      allocatedBudget: parseFloat(form.allocatedBudget) || 0,
      bodyParagraphFirstLine: form.bodyParagraphFirstLine,
      bodyParagraph: filteredBodyParagraphs,
      extraParagraph: form.extraParagraph,
      accountHeads: filteredAccountHeads,
      budgetReleased: parseFloat(form.budgetReleased) || 0,
      technicalSanctionsAlreadyIssuedInclTax:
        parseFloat(form.technicalSanctionsAlreadyIssuedInclTax) || 0,
      technicalSanctionsNowIssuedInclTax:
        parseFloat(form.technicalSanctionsNowIssuedInclTax) || 0,
      totalTechnicalSanctionsIssuedInclTax:
        parseFloat(form.totalTechnicalSanctionsIssuedInclTax) || 0,
      balanceBudgetAvailable: parseFloat(form.balanceBudgetAvailable) || 0,
      technicalSanctionNowIssuedExclTax:
        parseFloat(form.technicalSanctionNowIssuedExclTax) || 0,
      footerText: form.footerText,
    }

    setLoading(true)
    axios
      .post(URLS.AddNote, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShow(false)
          setForm(initialFormState)
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to create note")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const UpdatePopUp = data => {
    const formattedData = {
      ...data,
      _id: data._id,
      header: {
        title: data.header?.title || "",
        noteFileNo: data.header?.noteFileNo || "",
      },
      financialYearId: data.financialYearId || "",
      subject: data.subject || "",
      references:
        data.references && data.references.length > 0 ? data.references : [""],
      introParagraph: data.introParagraph || "",
      items:
        data.items && data.items.length > 0
          ? data.items
          : initialFormState.items,
      allocatedBudget: data.allocatedBudget || "",
      bodyParagraphFirstLine: data.bodyParagraphFirstLine || "",
      bodyParagraph:
        data.bodyParagraph && data.bodyParagraph.length > 0
          ? data.bodyParagraph
          : [""],
      extraParagraph: data.extraParagraph || "",
      accountHeads:
        data.accountHeads && data.accountHeads.length > 0
          ? data.accountHeads
          : [""],
      budgetReleased: data.budgetReleased || "",
      technicalSanctionsAlreadyIssuedInclTax:
        data.technicalSanctionsAlreadyIssuedInclTax || "",
      technicalSanctionsNowIssuedInclTax:
        data.technicalSanctionsNowIssuedInclTax || "",
      totalTechnicalSanctionsIssuedInclTax:
        data.totalTechnicalSanctionsIssuedInclTax || "",
      balanceBudgetAvailable: data.balanceBudgetAvailable || "",
      technicalSanctionNowIssuedExclTax:
        data.technicalSanctionNowIssuedExclTax || "",
      footerText: data.footerText || "",
    }

    setEditForm(formattedData)
    setShow(false)
    setShowEdit(true)
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
    const token = TokenData

    const filteredReferences = editForm.references.filter(
      ref => ref.trim() !== ""
    )
    const filteredAccountHeads = editForm.accountHeads.filter(
      accountHead => accountHead.trim() !== ""
    )
    const filteredBodyParagraphs = editForm.bodyParagraph.filter(
      paragraph => paragraph.trim() !== ""
    )

    const itemsWithTotals = editForm.items.map(item => ({
      ...item,
      qty: parseFloat(item.qty) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: parseFloat(item.total) || 0,
    }))

    const dataArray = {
      header: {
        title: editForm.header.title,
        noteFileNo: editForm.header.noteFileNo,
      },
      financialYearId: editForm.financialYearId,
      subject: editForm.subject,
      references: filteredReferences,
      introParagraph: editForm.introParagraph,
      items: itemsWithTotals,
      allocatedBudget: parseFloat(editForm.allocatedBudget) || 0,
      bodyParagraphFirstLine: editForm.bodyParagraphFirstLine,
      bodyParagraph: filteredBodyParagraphs,
      extraParagraph: editForm.extraParagraph,
      accountHeads: filteredAccountHeads,
      budgetReleased: parseFloat(editForm.budgetReleased) || 0,
      technicalSanctionsAlreadyIssuedInclTax:
        parseFloat(editForm.technicalSanctionsAlreadyIssuedInclTax) || 0,
      technicalSanctionsNowIssuedInclTax:
        parseFloat(editForm.technicalSanctionsNowIssuedInclTax) || 0,
      totalTechnicalSanctionsIssuedInclTax:
        parseFloat(editForm.totalTechnicalSanctionsIssuedInclTax) || 0,
      balanceBudgetAvailable: parseFloat(editForm.balanceBudgetAvailable) || 0,
      technicalSanctionNowIssuedExclTax:
        parseFloat(editForm.technicalSanctionNowIssuedExclTax) || 0,
      footerText: editForm.footerText,
    }

    setLoading(true)
    axios
      .put(URLS.EditNote + editForm._id, dataArray, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data.message)
          setShowEdit(false)
          Get()
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Failed to update note")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const DeleteData = data => {
    setSelectedNote(data)
    setDeleteModal(true)
  }

  const handleDelete = () => {
    if (!selectedNote) return

    const token = TokenData
    const remid = selectedNote._id

    setLoading(true)
    axios
      .delete(URLS.DeleteNote + remid, {
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
        } else {
          toast.error("Failed to delete note")
        }
      })
      .finally(() => {
        setLoading(false)
        setDeleteModal(false)
        setSelectedNote(null)
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const pageCount = Math.ceil(data.length / listPerPage)

  const currentItems = useMemo(() => {
    return data.slice(pagesVisited, pagesVisited + listPerPage)
  }, [data, pagesVisited, listPerPage])

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const getFinancialYearName = id => {
    const fy = financialYears.find(fy => fy._id === id)
    return fy ? fy.year : "N/A"
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0)
  }

  const history = useHistory()

  const Approved = data => {
    localStorage.setItem("ordersId", data._id)
    history.push("/orders-issued")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Note" />

          {/* Create Note Button */}
          <Row className="mb-3">
            <Col md="12" className="text-end">
              <Button
                color="primary"
                onClick={AddPopUp}
                size="sm"
                disabled={loading}
                className="px-4"
              >
                {loading && show ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="bx bx-plus-circle me-1"></i> Create Note
                  </>
                )}
              </Button>
            </Col>
          </Row>

          {/* Edit Form */}
          <Row>
            <Col md={12}>
              {showEdit && (
                <NoteForm
                  form={editForm}
                  {...editFormHandlers}
                  onSubmit={FormEditSubmit}
                  onCancel={() => setShowEdit(false)}
                  drugs={drugs}
                  financialYears={financialYears}
                  mode="edit"
                  loading={loading}
                />
              )}
            </Col>
          </Row>

          {/* Create Form */}
          <Row>
            <Col md={12}>
              {show && (
                <NoteForm
                  form={form}
                  {...formHandlers}
                  onSubmit={FormAddSubmit}
                  onCancel={() => setShow(false)}
                  drugs={drugs}
                  financialYears={financialYears}
                  mode="create"
                  loading={loading}
                />
              )}
            </Col>
          </Row>

          {/* Notes List */}
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  {/* Search Bar */}
                  <Row className="mb-3">
                    <Col md={12}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-0">Notes List</h5>
                          <p className="text-muted small mb-0">
                            Showing {currentItems.length} of {data.length} notes
                          </p>
                        </div>
                        <Input
                          name="search"
                          value={searchTerm}
                          onChange={SearchData}
                          type="search"
                          placeholder="Search notes..."
                          bsSize="sm"
                          style={{ width: "250px" }}
                          disabled={loading}
                        />
                      </div>
                    </Col>
                  </Row>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2">Loading notes...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="mb-0" size="sm">
                        <thead className="table-light">
                          <tr>
                            <th> S.No </th>
                            <th>Financial Year</th>
                            <th>Title</th>
                            <th>Subject</th>
                            <th>File No</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                              <tr key={item._id}>
                                <td>
                                  <span className="badge bg-light text-dark">
                                    {pagesVisited + index + 1}
                                  </span>
                                </td>
                                <td>
                                  <Badge color="info">
                                    {getFinancialYearName(item.financialYearId)}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="fw-medium">
                                    {item.header?.title || "N/A"}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="text-truncate"
                                    style={{ maxWidth: "200px" }}
                                    title={item.subject}
                                  >
                                    {item.subject || "N/A"}
                                  </div>
                                </td>
                                <td>
                                  <Badge color="secondary">
                                    {item.header?.noteFileNo || "N/A"}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge color="warning" pill>
                                    {item.items?.length || 0}
                                  </Badge>
                                </td>
                                <td className="fw-bold">
                                  {formatCurrency(
                                    item.items?.reduce(
                                      (sum, i) =>
                                        sum + (parseFloat(i.total) || 0),
                                      0
                                    )
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <Button
                                      onClick={() => Approved(item)}
                                      color="success"
                                      size="sm"
                                      className="btn-icon"
                                      title="Approve"
                                      disabled={loading}
                                    >
                                      <i className="bx bx-check"></i>
                                    </Button>
                                    {item.noteFile && (
                                      <Button
                                        tag="a"
                                        href={`${URLS.Base}${item.noteFile}`}
                                        target="_blank"
                                        size="sm"
                                        color="warning"
                                        outline
                                        title="Download PDF"
                                        disabled={loading}
                                      >
                                        <i className="bx bxs-file-pdf"></i>
                                      </Button>
                                    )}
                                    <Button
                                      onClick={() => UpdatePopUp(item)}
                                      size="sm"
                                      color="info"
                                      outline
                                      title="Edit"
                                      disabled={loading}
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                    <Button
                                      onClick={() => DeleteData(item)}
                                      size="sm"
                                      color="danger"
                                      outline
                                      title="Delete"
                                      disabled={loading}
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center py-5">
                                <div className="text-muted">
                                  <i className="bx bx-package display-4"></i>
                                  <p className="mt-2">No notes found</p>
                                  {searchTerm && (
                                    <Button
                                      color="link"
                                      size="sm"
                                      onClick={() => {
                                        setSearchTerm("")
                                        Get()
                                      }}
                                    >
                                      Clear search
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>

                      {/* Pagination */}
                      {data.length > listPerPage && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div className="text-muted small">
                            Showing {pagesVisited + 1} to{" "}
                            {Math.min(pagesVisited + listPerPage, data.length)}{" "}
                            of {data.length} entries
                          </div>
                          <ReactPaginate
                            previousLabel={
                              <i className="bx bx-chevron-left"></i>
                            }
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
                            forcePage={pageNumber}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete the note "
          {selectedNote?.header?.title || "this note"}"? This action cannot be
          undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </React.Fragment>
  )
}

export default Note
