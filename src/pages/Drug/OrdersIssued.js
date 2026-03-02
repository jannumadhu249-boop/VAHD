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
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

const OrderForm = ({
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
  handleHeadOfAccountChange,
  addHeadOfAccount,
  removeHeadOfAccount,
  handleSignatureChange,
  handleAccountHeadChange,
  addAccountHead,
  removeAccountHead,
  onSubmit,
  onCancel,
  drugs,
  mode = "create",
}) => {
  return (
    <Card className="p-4">
      <Form onSubmit={onSubmit}>
        <h5 className="mb-3">
          {mode === "edit" ? "Edit" : "Create"} Orders Issued
        </h5>

        {/* Main Title Section */}
        <Row className="mb-3">
          <h6>Document Titles</h6>
          <Col md="6">
            <FormGroup>
              <Label>
                Main Title <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={handleFormChange}
                name="mainTitle"
                value={form.mainTitle}
                required
                type="text"
                placeholder="e.g., GOVERNMENT OF TELANGANA"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>
                Second Title <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={handleFormChange}
                name="secondTitle"
                value={form.secondTitle}
                required
                type="text"
                placeholder="e.g., DIRECTORATE OF VETERINARY & ANIMAL HUSBANDRY"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
        </Row>

        {/* Header Section */}
        <Row className="mb-3">
          <h6>Header Information</h6>
          <Col md="6">
            <FormGroup>
              <Label>
                File No <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={e => handleHeaderChange("fileNo", e.target.value)}
                name="fileNo"
                value={form.header?.fileNo || ""}
                required
                type="text"
                placeholder="e.g., 8431/H1/2025"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>
                Date <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={e => handleHeaderChange("date", e.target.value)}
                name="date"
                value={form.header?.date || ""}
                required
                type="date"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
        </Row>

        {/* Subject Section */}
        <Row className="mb-3">
          <Col md="12">
            <FormGroup>
              <Label>
                Subject <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={handleFormChange}
                name="subject"
                value={form.subject}
                required
                type="textarea"
                rows="2"
                placeholder="Enter subject of the order"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
        </Row>

        {/* References Section */}
        <Row className="mb-3">
          <h6>References</h6>
          {form.references.map((ref, index) => (
            <Row key={index} className="mb-2">
              <Col md="10">
                <Input
                  value={ref}
                  onChange={e => handleReferenceChange(index, e.target.value)}
                  type="text"
                  placeholder={`Reference ${index + 1}`}
                  bsSize="sm"
                />
              </Col>
              <Col md="2">
                {form.references.length > 1 && (
                  <Button
                    color="danger"
                    onClick={() => removeReference(index)}
                    className="mt-1"
                    size="sm"
                  >
                    <i className="bx bx-trash"></i>
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Col md="12" className="mt-2">
            <Button color="secondary" onClick={addReference} size="sm">
              Add Reference <i className="bx bx-plus"></i>
            </Button>
          </Col>
        </Row>

        {/* Body Section */}
        <Row className="mb-3">
          <Col md="12">
            <Label>
              Body Content <span className="text-danger">*</span>
            </Label>
            <Input
              onChange={handleFormChange}
              name="body"
              value={form.body}
              required
              type="textarea"
              rows="3"
              placeholder="Enter main body content of the order"
              bsSize="sm"
            />
          </Col>
        </Row>

        {/* Items Section */}
        <Row className="mb-3">
          <h6>Items/Drugs</h6>
          {form.items.map((item, index) => (
            <Card key={index} className="mb-3 p-2">
              <Row>
                <Col md="1">
                  <FormGroup>
                    <Label>No</Label>
                    <Input
                      value={item.no || index + 1}
                      type="text"
                      readOnly
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label>Code</Label>
                    <Input
                      value={item.code}
                      onChange={e =>
                        handleItemChange(index, "code", e.target.value)
                      }
                      type="text"
                      placeholder="Item Code"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Drug Name</Label>
                    <Input
                      type="select"
                      value={item.name}
                      onChange={e => handleDrugSelect(index, e.target.value)}
                      bsSize="sm"
                    >
                      <option value="">Select Drug</option>
                      {drugs.map(drug => (
                        <option key={drug._id} value={drug.tradeName}>
                          {drug.tradeName} - {drug.drugCode}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label>Firm</Label>
                    <Input
                      value={item.firm}
                      onChange={e =>
                        handleItemChange(index, "firm", e.target.value)
                      }
                      type="text"
                      placeholder="Firm Name"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md="1">
                  <FormGroup>
                    <Label>Qty</Label>
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
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label>Unit Price (₹)</Label>
                    <Input
                      value={item.unitPrice}
                      onChange={e =>
                        handleItemChange(index, "unitPrice", e.target.value)
                      }
                      type="number"
                      inputMode="decimal"
                      onWheel={e => e.target.blur()}
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="12" className="d-flex justify-content-end">
                  {form.items.length > 1 && (
                    <Button
                      color="danger"
                      onClick={() => removeItem(index)}
                      size="sm"
                    >
                      Remove <i className="bx bx-trash"></i>
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
          ))}
          <Col md="12" className="mt-2">
            <Button color="secondary" onClick={addItem} size="sm">
              Add Item <i className="bx bx-plus"></i>
            </Button>
          </Col>
        </Row>

        {/* Under Table Paragraph */}
        <Row className="mb-3">
          <Col md="12">
            <Label>Under Table Paragraph</Label>
            <Input
              onChange={handleFormChange}
              name="underTableParagraph"
              value={form.underTableParagraph}
              type="textarea"
              rows="2"
              placeholder="Enter paragraph that appears below the items table"
              bsSize="sm"
            />
          </Col>
        </Row>

        {/* Account Heads Section */}
        <Row className="mb-3">
          <h6>Head of Account</h6>
          {form.accountHeads.map((account, index) => (
            <Row key={index} className="mb-2">
              <Col md="10">
                <Input
                  value={account}
                  onChange={e => handleAccountHeadChange(index, e.target.value)}
                  type="text"
                  placeholder={`Account Head ${index + 1}`}
                  bsSize="sm"
                />
              </Col>
              <Col md="2">
                {form.accountHeads.length > 1 && (
                  <Button
                    color="danger"
                    onClick={() => removeAccountHead(index)}
                    className="mt-1"
                    size="sm"
                  >
                    <i className="bx bx-trash"></i>
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Col md="12" className="mt-2">
            <Button color="secondary" onClick={addAccountHead} size="sm">
              Add Head of Account <i className="bx bx-plus"></i>
            </Button>
          </Col>
        </Row>

        {/* Last Paragraph */}
        <Row className="mb-3">
          <Col md="12">
            <Label>Closing Paragraph</Label>
            <Input
              onChange={handleFormChange}
              name="bodyLastParagraph"
              value={form.bodyLastParagraph}
              type="textarea"
              rows="2"
              placeholder="Enter closing paragraph"
              bsSize="sm"
            />
          </Col>
        </Row>

        {/* Signature Section */}
        <Row className="mb-3">
          <h6>Signature</h6>
          <Col md="3">
            <FormGroup>
              <Label>Name</Label>
              <Input
                onChange={e => handleSignatureChange("name", e.target.value)}
                name="name"
                value={form.signature?.name || ""}
                type="text"
                placeholder="Signatory Name"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Designation</Label>
              <Input
                onChange={e =>
                  handleSignatureChange("designation", e.target.value)
                }
                name="designation"
                value={form.signature?.designation || ""}
                type="text"
                placeholder="Designation"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Place</Label>
              <Input
                onChange={e => handleSignatureChange("place", e.target.value)}
                name="place"
                value={form.signature?.place || ""}
                type="text"
                placeholder="Place"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
              <Label>Date</Label>
              <Input
                onChange={e => handleSignatureChange("date", e.target.value)}
                name="date"
                value={form.signature?.date || ""}
                type="date"
                bsSize="sm"
              />
            </FormGroup>
          </Col>
        </Row>

        <div className="text-end mt-4">
          <Button type="button" onClick={onCancel} color="danger m-1" size="sm">
            Cancel <i className="bx bx-x-circle"></i>
          </Button>
          <Button type="submit" color="primary text-white m-1" size="sm">
            {mode === "edit" ? "Update" : "Submit"}{" "}
            <i className="bx bx-check-circle"></i>
          </Button>
        </div>
      </Form>
    </Card>
  )
}

const OrdersIssued = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson?.token

  const [show, setShow] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [data, setData] = useState([])
  const [drugs, setDrugs] = useState([])
  const [loading, setLoading] = useState(false)

  const initialFormState = {
    noteFileId: localStorage.getItem("ordersId"),
    mainTitle: "GOVERNMENT OF TELANGANA",
    secondTitle:
      "DIRECTORATE OF VETERINARY & ANIMAL HUSBANDRY, T.G., HYDERABAD",
    header: {
      fileNo: "",
      date: "",
    },
    subject: "",
    references: [""],
    body: "",
    items: [
      {
        no: 1,
        code: "",
        firm: "",
        name: "",
        qty: "",
        unitPrice: "",
      },
    ],
    underTableParagraph: "",
    accountHeads: [""],
    bodyLastParagraph: "",
    signature: {
      name: "",
      designation: "",
      place: "",
      date: "",
    },
    search: "",
  }

  const [form, setForm] = useState(initialFormState)
  const [editForm, setEditForm] = useState(initialFormState)

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    Get()
    GetDrugs()
  }, [])

  const Get = useCallback(() => {
    setLoading(true)
    const token = TokenData
    axios
      .post(
        URLS.GetOrdersIssued,
        { noteFileId: localStorage.getItem("ordersId") },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setData(res.data.data || [])
      })
      .catch(error => {
        console.error("Error fetching orders:", error)
        toast.error("Failed to fetch orders")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [TokenData])

  const GetDrugs = useCallback(() => {
    const token = TokenData
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
  }, [TokenData])

  const SearchData = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (!value.trim()) {
      Get()
      return
    }

    const token = TokenData
    axios
      .post(
        URLS.GetOrdersIssuedSearch + value,
        { noteFileId: localStorage.getItem("ordersId") },
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
  }

  // Generic form handler
  const createFormHandlers = (formState, setFormState) => {
    const handleFormChange = e => {
      const { name, value } = e.target
      setFormState(prev => ({ ...prev, [name]: value }))
    }

    const handleHeaderChange = (field, value) => {
      setFormState(prev => ({
        ...prev,
        header: {
          ...prev.header,
          [field]: value,
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

    const handleDrugSelect = (index, tradeName) => {
      const selectedDrug = drugs.find(drug => drug.tradeName === tradeName)
      if (selectedDrug) {
        const newItems = [...formState.items]
        newItems[index] = {
          ...newItems[index],
          code: selectedDrug.drugCode,
          name: selectedDrug.tradeName,
          unitPrice: selectedDrug.unitPrice,
        }
        setFormState(prev => ({ ...prev, items: newItems }))
      }
    }

    const handleItemChange = (index, field, value) => {
      const newItems = [...formState.items]
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      }
      // Update item numbers
      const updatedItems = newItems.map((item, idx) => ({
        ...item,
        no: idx + 1,
      }))
      setFormState(prev => ({ ...prev, items: updatedItems }))
    }

    const addItem = () => {
      setFormState(prev => ({
        ...prev,
        items: [
          ...prev.items,
          {
            no: prev.items.length + 1,
            code: "",
            firm: "",
            name: "",
            qty: "",
            unitPrice: "",
          },
        ],
      }))
    }

    const removeItem = index => {
      if (formState.items.length > 1) {
        const newItems = formState.items.filter((_, i) => i !== index)
        // Re-number items
        const renumberedItems = newItems.map((item, idx) => ({
          ...item,
          no: idx + 1,
        }))
        setFormState(prev => ({ ...prev, items: renumberedItems }))
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
      const newAccountHeads = formState.accountHeads.filter(
        (_, i) => i !== index
      )
      setFormState(prev => ({ ...prev, accountHeads: newAccountHeads }))
    }

    const handleSignatureChange = (field, value) => {
      setFormState(prev => ({
        ...prev,
        signature: {
          ...prev.signature,
          [field]: value,
        },
      }))
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
      handleAccountHeadChange,
      addAccountHead,
      removeAccountHead,
      handleSignatureChange,
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

  // Calculate total amount
  const calculateTotal = items => {
    return items.reduce((total, item) => {
      const qty = parseFloat(item.qty) || 0
      const unitPrice = parseFloat(item.unitPrice) || 0
      return total + qty * unitPrice
    }, 0)
  }

  const AddData = () => {
    const token = TokenData
    const filteredReferences = form.references.filter(ref => ref.trim() !== "")
    const filteredAccountHeads = form.accountHeads.filter(
      account => account.trim() !== ""
    )

    const itemsWithNumbers = form.items.map((item, index) => ({
      ...item,
      no: index + 1,
      qty: parseFloat(item.qty) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0,
    }))

    const totalAmount = calculateTotal(itemsWithNumbers)

    const dataArray = {
      noteFileId: localStorage.getItem("ordersId"),
      mainTitle: form.mainTitle,
      secondTitle: form.secondTitle,
      header: {
        fileNo: form.header.fileNo,
        date: form.header.date,
      },
      subject: form.subject,
      references: filteredReferences,
      body: form.body,
      items: itemsWithNumbers,
      underTableParagraph: form.underTableParagraph,
      accountHeads: filteredAccountHeads,
      bodyLastParagraph: form.bodyLastParagraph,
      signature: form.signature,
      totalAmount: totalAmount,
      totalAmountInWords: `Rupees ${totalAmount} only`,
    }

    setLoading(true)
    axios
      .post(URLS.AddOrdersIssued, dataArray, {
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
      noteFileId: data.noteFileId || null,
      mainTitle: data.mainTitle || initialFormState.mainTitle,
      secondTitle: data.secondTitle || initialFormState.secondTitle,
      header: data.header || initialFormState.header,
      subject: data.subject || "",
      references:
        data.references && data.references.length > 0 ? data.references : [""],
      body: data.body || "",
      items:
        data.items && data.items.length > 0
          ? data.items
          : initialFormState.items,
      underTableParagraph:
        data.underTableParagraph || initialFormState.underTableParagraph,
      accountHeads:
        data.accountHeads && data.accountHeads.length > 0
          ? data.accountHeads
          : [""],
      bodyLastParagraph: data.bodyLastParagraph || "",
      signature: data.signature || initialFormState.signature,
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
      account => account.trim() !== ""
    )

    const itemsWithNumbers = editForm.items.map((item, index) => ({
      ...item,
      no: index + 1,
      qty: parseFloat(item.qty) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0,
    }))

    const totalAmount = calculateTotal(itemsWithNumbers)

    const dataArray = {
      noteFileId: editForm.noteFileId,
      mainTitle: editForm.mainTitle,
      secondTitle: editForm.secondTitle,
      header: editForm.header,
      subject: editForm.subject,
      references: filteredReferences,
      body: editForm.body,
      items: itemsWithNumbers,
      underTableParagraph: editForm.underTableParagraph,
      accountHeads: filteredAccountHeads,
      bodyLastParagraph: editForm.bodyLastParagraph,
      signature: editForm.signature,
      totalAmount: totalAmount,
      totalAmountInWords: `Rupees ${totalAmount} only`,
    }

    setLoading(true)
    axios
      .post(URLS.EditOrdersIssued + editForm._id, dataArray, {
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
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const DeleteData = data => {
    const confirmBox = window.confirm(
      "Do you really want to delete this order?"
    )
    if (confirmBox === true) {
      Delete(data)
    }
  }

  const Delete = data => {
    const token = TokenData
    const remid = data._id

    setLoading(true)
    axios
      .post(
        URLS.DeleteOrdersIssued + remid,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
      .finally(() => {
        setLoading(false)
      })
  }

  // Pagination calculations
  const pagesVisited = pageNumber * listPerPage
  const pageCount = Math.ceil(data.length / listPerPage)

  const currentItems = useMemo(() => {
    return data.slice(pagesVisited, pagesVisited + listPerPage)
  }, [data, pagesVisited, listPerPage])

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Orders Issued" />

          <Row>
            {/* Create Form */}
            <Col md={12}>
              {show && (
                <OrderForm
                  form={form}
                  {...formHandlers}
                  onSubmit={FormAddSubmit}
                  onCancel={() => setShow(false)}
                  drugs={drugs}
                  mode="create"
                />
              )}
            </Col>

            {/* Edit Form */}
            <Col md={12}>
              {showEdit && (
                <OrderForm
                  form={editForm}
                  {...editFormHandlers}
                  onSubmit={FormEditSubmit}
                  onCancel={() => setShowEdit(false)}
                  drugs={drugs}
                  mode="edit"
                />
              )}
            </Col>

            {/* Main Table */}
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Button
                        color="primary text-white"
                        onClick={AddPopUp}
                        size="sm"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-plus-circle"></i> Create Order
                          </>
                        )}
                      </Button>
                    </Col>
                    <Col md={6}>
                      <div className="float-end">
                        <Input
                          name="search"
                          value={form.search}
                          onChange={SearchData}
                          type="search"
                          placeholder="Search by subject or file no..."
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
                      <p className="mt-2">Loading orders...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table responsive hover className="mb-0" size="sm">
                        <thead>
                          <tr>
                            <th> S.No </th>
                            <th>File No</th>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length > 0 ? (
                            currentItems.map((data, index) => (
                              <tr key={data._id}>
                                <td>{pagesVisited + index + 1}</td>
                                <td
                                  className="text-truncate"
                                  style={{ maxWidth: "150px" }}
                                >
                                  {data.header?.fileNo || "N/A"}
                                </td>
                                <td>{data.header?.date || "N/A"}</td>
                                <td
                                  className="text-truncate"
                                  style={{ maxWidth: "300px" }}
                                  title={data.subject}
                                >
                                  {data.subject || "N/A"}
                                </td>
                                <td>{data.items?.length || 0}</td>
                                <td>
                                  ₹
                                  {data.totalAmount
                                    ? data.totalAmount.toLocaleString("en-IN")
                                    : "0"}
                                </td>
                                <td>
                                  <Button
                                    tag="a"
                                    href={`${URLS.Base}${data?.proceedingFile}`}
                                    target="_blank"
                                    download
                                    size="sm"
                                    className="m-1"
                                    color="warning"
                                    disabled={loading}
                                  >
                                    <i className="bx bxs-file-pdf"></i>
                                  </Button>
                                  <Button
                                    onClick={() => UpdatePopUp(data)}
                                    size="sm"
                                    className="m-1"
                                    color="info"
                                    disabled={loading}
                                  >
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="m-1"
                                    color="danger"
                                    onClick={() => DeleteData(data)}
                                    disabled={loading}
                                  >
                                    <i className="bx bx-trash"></i>
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                No orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>

                      {pageCount > 1 && (
                        <div className="d-flex justify-content-end mt-3">
                          <ReactPaginate
                            previousLabel={"‹"}
                            nextLabel={"›"}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={"pagination pagination-sm"}
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
        <ToastContainer />
      </div>
    </React.Fragment>
  )
}

export default OrdersIssued
