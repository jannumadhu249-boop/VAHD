import React, { useState, useEffect, useCallback, useRef } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { URLS } from "../../Url";
import axios from "axios";
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
} from "reactstrap";

// ---------- React‑select styles ----------
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
    "&:hover": { borderColor: "#b8c2d3" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 8px" }),
  indicatorsContainer: (base) => ({ ...base, height: 34 }),
  option: (base) => ({ ...base, fontSize: 14, padding: "8px 12px" }),
  placeholder: (base) => ({ ...base, fontSize: 14, color: "#94a3b8" }),
};

const FodderDistributionDistrict = () => {
  // Auth token
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const token = authUser?.token || "";

  // ---------- Data states ----------
  const [records, setRecords] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [fodderItems, setFodderItems] = useState([]);

  // UI states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMainList, setShowMainList] = useState(true);
  const [loading, setLoading] = useState({
    page: true,
    submit: false,
    fodderItems: true,
    search: false,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef(null);

  // ---------- Add form state ----------
  const [addFilters, setAddFilters] = useState({
    year: "",
    quarter: "",
    scheme: "",
    placeOfWorking: "",
  });
  const [addRows, setAddRows] = useState([{ fodderItem: "", quantity: "", price: "" }]);

  // ---------- Edit form state (single record) ----------
  const [editItem, setEditItem] = useState({
    _id: "",
    year: "",
    quarter: "",
    scheme: "",
    placeOfWorking: "",
    fodderItem: "",
    quantity: "",
    price: "",
  });

  // ---------- Helper to map IDs to options ----------
  const getOption = (options, value) => options.find((opt) => opt.value === value) || null;

  // Prepare select options
  const yearOptions = financialYears.map((y) => ({ value: y._id, label: y.year }));
  const quarterOptions = quarters.map((q) => ({ value: q._id, label: q.quarter }));
  const schemeOptions = schemes.map((s) => ({ value: s._id, label: s.name }));
  const placeOptions = places.map((p) => ({ value: p._id, label: p.name }));
  const fodderItemOptions = fodderItems.map((f) => ({ value: f._id, label: f.name || f.typeOfSeedName }));

  // ---------- Fetch all dropdown data on mount ----------
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [fyRes, qRes, schRes, pRes, fiRes] = await Promise.all([
          axios.post(URLS.GetFinancialyear, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetQuarter, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetScheme, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetPlaceOfWorking, {}, { headers: { Authorization: `Bearer ${token}` } }),
          axios.post(URLS.GetAllFodderItems, {}, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setFinancialYears(fyRes.data?.data || []);
        setQuarters(qRes.data?.data || []);
        setSchemes(schRes.data?.schemes || []);
        setPlaces(pRes.data?.data || []);
        setFodderItems(fiRes.data?.data || []);
      } catch (error) {
        toast.error("Failed to load filter options or fodder items");
      } finally {
        setLoading((prev) => ({ ...prev, fodderItems: false }));
      }
    };
    fetchDropdowns();
    fetchRecords();
  }, []);

  // ---------- Fetch all records (matches the provided curl & response) ----------
  const fetchRecords = async () => {
    setLoading((prev) => ({ ...prev, page: true }));
    try {
      const res = await axios.post(
        URLS.GetAllFodderDistribution,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setLoading((prev) => ({ ...prev, page: false }));
    }
  };

  // ---------- Search function ----------
  const searchRecords = async (query) => {
    if (!query.trim()) {
      // If search is empty, fetch all records
      fetchRecords();
      return;
    }

    setLoading((prev) => ({ ...prev, search: true }));
    try {
      // Assuming the search endpoint expects a POST with the query appended to the URL
      // e.g., URLS.GetFodderDistributionSearch + query
      const res = await axios.post(
        `${URLS.GetFodderDistributionSearch}${query}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(res.data?.data || []);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading((prev) => ({ ...prev, search: false }));
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout
    searchTimeout.current = setTimeout(() => {
      searchRecords(value);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // ---------- Handlers for add form ----------
  const handleAddFilterChange = (selectedOption, { name }) => {
    setAddFilters((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
  };

  const handleAddRowChange = (index, field, value) => {
    const updated = [...addRows];
    updated[index][field] = value;
    setAddRows(updated);
  };

  const addRow = () => {
    setAddRows([...addRows, { fodderItem: "", quantity: "", price: "" }]);
  };

  const removeRow = (index) => {
    if (addRows.length > 1) {
      setAddRows(addRows.filter((_, i) => i !== index));
    }
  };

  const totalAmount = addRows.reduce(
    (acc, row) => acc + (parseFloat(row.quantity) || 0) * (parseFloat(row.price) || 0),
    0
  );

  // Submit add form – POST each row individually
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addFilters.year || !addFilters.quarter || !addFilters.scheme || !addFilters.placeOfWorking) {
      toast.warning("Please select all filter fields");
      return;
    }

    const invalidRows = addRows.some((row) => !row.fodderItem || !row.quantity || !row.price);
    if (invalidRows) {
      toast.warning("Please fill all fields in each row");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    let successCount = 0;
    for (const row of addRows) {
      const payload = {
        year: addFilters.year,
        quarter: addFilters.quarter,
        scheme: addFilters.scheme,
        placeOfWorking: addFilters.placeOfWorking,
        fodderItem: row.fodderItem,
        quantity: parseFloat(row.quantity),
        price: parseFloat(row.price),
      };

      try {
        await axios.post(URLS.AddFodderDistribution, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        successCount++;
      } catch (error) {
        toast.error(`Failed to add item: ${row.fodderItem}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} item(s) added successfully`);
      await fetchRecords();
      cancelForms();
    }
    setLoading((prev) => ({ ...prev, submit: false }));
  };

  // ---------- Edit handlers ----------
  const openEditForm = (record) => {
    setEditItem({
      _id: record._id,
      year: record.year,
      quarter: record.quarter,
      scheme: record.scheme,
      placeOfWorking: record.placeOfWorking,
      fodderItem: record.fodderItem,
      quantity: record.quantity.toString(),
      price: record.price.toString(),
    });
    setShowAddForm(false);
    setShowEditForm(true);
    setShowMainList(false);
  };

  const handleEditFilterChange = (selectedOption, { name }) => {
    setEditItem((prev) => ({ ...prev, [name]: selectedOption?.value || "" }));
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editItem.fodderItem || !editItem.quantity || !editItem.price) {
      toast.warning("Please fill all fields");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    const payload = {
      year: editItem.year,
      quarter: editItem.quarter,
      scheme: editItem.scheme,
      placeOfWorking: editItem.placeOfWorking,
      fodderItem: editItem.fodderItem,
      quantity: parseFloat(editItem.quantity),
      price: parseFloat(editItem.price),
    };

    try {
      await axios.put(`${URLS.EditFodderDistribution}/${editItem._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Record updated successfully");
      await fetchRecords();
      cancelForms();
    } catch (error) {
      toast.error("Failed to update record");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // ---------- Delete ----------
  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${URLS.DeleteFodderDistribution}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Record deleted");
      fetchRecords();
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  // ---------- Cancel forms ----------
  const cancelForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowMainList(true);
    setAddFilters({ year: "", quarter: "", scheme: "", placeOfWorking: "" });
    setAddRows([{ fodderItem: "", quantity: "", price: "" }]);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Fodder Distribution District" />

          {/* Add Form */}
          {showAddForm && (
            <Row>
              <Col md={12}>
                <Card className="mb-4 border-primary">
                  <CardBody>
                    <h5 className="text-primary mb-3">
                      <i className="bx bx-plus-circle me-2"></i>Add Fodder Distribution
                    </h5>
                    <Form onSubmit={handleAddSubmit}>
                      <Row className="g-3 mb-3">
                        <Col md={3}>
                          <FormGroup>
                            <Label>Financial Year *</Label>
                            <Select
                              name="year"
                              value={getOption(yearOptions, addFilters.year)}
                              onChange={handleAddFilterChange}
                              options={yearOptions}
                              styles={selectStyles}
                              placeholder="Select Year"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Quarter *</Label>
                            <Select
                              name="quarter"
                              value={getOption(quarterOptions, addFilters.quarter)}
                              onChange={handleAddFilterChange}
                              options={quarterOptions}
                              styles={selectStyles}
                              placeholder="Select Quarter"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Scheme *</Label>
                            <Select
                              name="scheme"
                              value={getOption(schemeOptions, addFilters.scheme)}
                              onChange={handleAddFilterChange}
                              options={schemeOptions}
                              styles={selectStyles}
                              placeholder="Select Scheme"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Place of Working *</Label>
                            <Select
                              name="placeOfWorking"
                              value={getOption(placeOptions, addFilters.placeOfWorking)}
                              onChange={handleAddFilterChange}
                              options={placeOptions}
                              styles={selectStyles}
                              placeholder="Select Place"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary mb-0">
                          <i className="bx bx-package me-2"></i>Fodder Items
                        </h6>
                        <Button color="primary" size="sm" onClick={addRow} disabled={loading.submit}>
                          <i className="bx bx-plus me-1"></i>Add Item
                        </Button>
                      </div>

                      <Table bordered size="sm" className="mb-3">
                        <thead className="table-light">
                          <tr>
                            <th>Sl.No</th>
                            <th>Fodder Item</th>
                            <th>Quantity</th>
                            <th>Price (per unit)</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addRows.map((row, idx) => (
                            <tr key={idx}>
                              <th scope="row">{idx + 1}</th>
                              <td>
                                <Select
                                  value={fodderItemOptions.find((opt) => opt.value === row.fodderItem)}
                                  onChange={(opt) => handleAddRowChange(idx, "fodderItem", opt?.value || "")}
                                  options={fodderItemOptions}
                                  styles={selectStyles}
                                  placeholder="Select"
                                  isClearable
                                  isDisabled={loading.submit || loading.fodderItems}
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  value={row.quantity}
                                  onChange={(e) => handleAddRowChange(idx, "quantity", e.target.value)}
                                  min="0"
                                  placeholder="Qty"
                                  disabled={loading.submit}
                                />
                              </td>
                              <td>
                                <Input
                                  type="number"
                                  value={row.price}
                                  onChange={(e) => handleAddRowChange(idx, "price", e.target.value)}
                                  min="0"
                                  step="0.01"
                                  placeholder="Price"
                                  disabled={loading.submit}
                                />
                              </td>
                              <td className="text-center">
                                {addRows.length > 1 && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => removeRow(idx)}
                                    disabled={loading.submit}
                                  >
                                    <i className="bx bx-trash"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      <div className="d-flex justify-content-end mb-3">
                        <div className="bg-light p-2 rounded" style={{ minWidth: "200px", textAlign: "right" }}>
                          <strong>Total Amount: </strong>
                          <span className="text-success fw-bold fs-5">₹{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between border-top pt-3">
                        <Button color="secondary" onClick={cancelForms} disabled={loading.submit}>
                          <i className="bx bx-x me-1"></i>Cancel
                        </Button>
                        <Button color="primary" type="submit" disabled={loading.submit}>
                          {loading.submit ? <Spinner size="sm" /> : <><i className="bx bx-check me-1"></i>Submit</>}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {/* Edit Form (single item) */}
          {showEditForm && (
            <Row>
              <Col md={12}>
                <Card className="mb-4 border-warning">
                  <CardBody>
                    <h5 className="text-warning mb-3">
                      <i className="bx bx-edit me-2"></i>Edit Fodder Distribution
                    </h5>
                    <Form onSubmit={handleEditSubmit}>
                      <Row className="g-3 mb-3">
                        <Col md={3}>
                          <FormGroup>
                            <Label>Financial Year *</Label>
                            <Select
                              name="year"
                              value={getOption(yearOptions, editItem.year)}
                              onChange={handleEditFilterChange}
                              options={yearOptions}
                              styles={selectStyles}
                              placeholder="Select Year"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Quarter *</Label>
                            <Select
                              name="quarter"
                              value={getOption(quarterOptions, editItem.quarter)}
                              onChange={handleEditFilterChange}
                              options={quarterOptions}
                              styles={selectStyles}
                              placeholder="Select Quarter"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Scheme *</Label>
                            <Select
                              name="scheme"
                              value={getOption(schemeOptions, editItem.scheme)}
                              onChange={handleEditFilterChange}
                              options={schemeOptions}
                              styles={selectStyles}
                              placeholder="Select Scheme"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label>Place of Working *</Label>
                            <Select
                              name="placeOfWorking"
                              value={getOption(placeOptions, editItem.placeOfWorking)}
                              onChange={handleEditFilterChange}
                              options={placeOptions}
                              styles={selectStyles}
                              placeholder="Select Place"
                              isClearable
                              isDisabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <h6 className="text-warning mb-3">
                        <i className="bx bx-package me-2"></i>Fodder Item
                      </h6>
                      <Row className="mb-3">
                        <Col md={4}>
                          <FormGroup>
                            <Label>Fodder Item *</Label>
                            <Select
                              name="fodderItem"
                              value={fodderItemOptions.find((opt) => opt.value === editItem.fodderItem)}
                              onChange={(opt) => setEditItem((prev) => ({ ...prev, fodderItem: opt?.value || "" }))}
                              options={fodderItemOptions}
                              styles={selectStyles}
                              placeholder="Select"
                              isClearable
                              isDisabled={loading.submit || loading.fodderItems}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>Quantity *</Label>
                            <Input
                              type="text"
                              name="quantity"
                              value={editItem.quantity}
                              onChange={handleEditFieldChange}
                              min="0"
                              placeholder="Quantity"
                              disabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>Price (per unit) *</Label>
                            <Input
                              type="number"
                              name="price"
                              value={editItem.price}
                              onChange={handleEditFieldChange}
                              min="0"
                              step="0.01"
                              placeholder="Price"
                              disabled={loading.submit}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end mb-3">
                        <div className="bg-light p-2 rounded" style={{ minWidth: "200px", textAlign: "right" }}>
                          <strong>Total: </strong>
                          <span className="text-success fw-bold fs-5">
                            ₹{((parseFloat(editItem.quantity) || 0) * (parseFloat(editItem.price) || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between border-top pt-3">
                        <Button color="secondary" onClick={cancelForms} disabled={loading.submit}>
                          <i className="bx bx-x me-1"></i>Cancel
                        </Button>
                        <Button color="warning" type="submit" disabled={loading.submit}>
                          {loading.submit ? <Spinner size="sm" /> : <><i className="bx bx-check me-1"></i>Update</>}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {/* Main List */}
          {showMainList && (
            <Row>
              <Col md={12}>
                <Card>
                  <CardBody>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Button color="primary" onClick={() => { setShowAddForm(true); setShowMainList(false); }}>
                          <i className="bx bx-plus me-1"></i>Create Fodder
                        </Button>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex justify-content-end">
                          <div style={{ maxWidth: "300px" }}>
                            <Input
                              type="search"
                              placeholder="Search by place, fodder item, year..."
                              value={searchQuery}
                              onChange={handleSearchChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {loading.page || loading.search ? (
                      <div className="text-center py-5">
                        <Spinner color="primary" />
                        <p className="mt-2">{loading.search ? "Searching..." : "Loading records..."}</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover className="table table-bordered mb-4">
                          <thead>
                            <tr>
                              <th className="text-center">S.No</th>
                              <th>Financial Year</th>
                              <th>Quarter</th>
                              <th>Scheme</th>
                              <th>Place of Working</th>
                              <th>Fodder Item</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Total Price</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {records.map((rec, idx) => (
                              <tr key={rec._id}>
                                <td className="text-center fw-bold">{idx + 1}</td>
                                <td>{rec.financialYear}</td>
                                <td>{rec.financialQuarter}</td>
                                <td>{rec.yearScheme}</td>
                                <td>{rec.placeOfWorkingName}</td>
                                <td>{rec.typeOfSeedName}</td>
                                <td>{rec.quantity}</td>
                                <td>₹{rec.price}</td>
                                <td>₹{rec.totalPrice}</td>
                                <td className="text-center">
                                  <Button
                                    size="sm"
                                    color="primary"
                                    className="me-1"
                                    onClick={() => openEditForm(rec)}
                                  >
                                    <i className="bx bx-edit"></i>
                                  </Button>
                                  <Button size="sm" color="danger" onClick={() => deleteRecord(rec._id)}>
                                    <i className="bx bx-trash"></i>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {records.length === 0 && (
                              <tr>
                                <td colSpan="10" className="text-center py-4">
                                  <div className="text-muted">
                                    <i className="bx bx-inbox display-4"></i>
                                    <p className="mt-2 mb-0">No records found</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">Showing {records.length} records</div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  );
};

export default FodderDistributionDistrict;