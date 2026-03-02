import React, { useEffect, useState } from "react";
import {
  Row, Col, Card, CardBody, Input, Button, Table, Label, Form,
  Collapse, FormGroup,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { URLS } from "../../Url";
import axios from "axios";

const FodderItems = () => {
  // Safely parse auth token
  const authUser = localStorage.getItem("authUser") || "{}";
  const TokenJson = JSON.parse(authUser);
  const TokenData = TokenJson.token;

  // Data states
  const [Data, setData] = useState([]);
  const [seedTypes, setSeedTypes] = useState([]);
  const [unitSizes, setUnitSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [listPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  // Roles & Permissions
  const Roles = TokenJson?.rolesAndPermission?.[0] ?? { accessAll: true };

  // ---------- Fetch data on mount ----------
  useEffect(() => {
    fetchFodderItems();
    fetchSeedTypes();
    fetchUnitSizes();
  }, []);

  // ---------- API Calls ----------
  const fetchFodderItems = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        URLS.GetAllFodderItems,
        {},
        { headers: { Authorization: `Bearer ${TokenData}` } }
      );
      // Extract array – your API puts it directly under "data"
      const items = res.data?.data || [];
      // Ensure each item has an _id
      const formatted = items.map((item) => ({
        ...item,
        _id: item._id || item.id,
      }));
      setData(formatted);
    } catch (error) {
      console.error("Error fetching fodder items:", error);
      toast.error("Failed to load fodder items");
    } finally {
      setLoading(false);
    }
  };

  const fetchSeedTypes = async () => {
    try {
      const res = await axios.post(
        URLS.GetAllTypeSeeds,
        {},
        { headers: { Authorization: `Bearer ${TokenData}` } }
      );
      const types = res.data?.seeds || res.data?.data || [];
      setSeedTypes(types);
    } catch (error) {
      console.error("Error fetching seed types:", error);
      toast.error("Failed to load seed types");
    }
  };

  const fetchUnitSizes = async () => {
    try {
      const res = await axios.post(
        URLS.GetAllUnitSize,
        {},
        { headers: { Authorization: `Bearer ${TokenData}` } }
      );
      const sizes = res.data?.unitSize || res.data?.data || [];
      setUnitSizes(sizes);
    } catch (error) {
      console.error("Error fetching unit sizes:", error);
      toast.error("Failed to load unit sizes");
    }
  };

  // ---------- Search (client-side) ----------
  const filteredData = Data.filter((item) => {
    const seedName = (item.typeOfSeedName || "").toLowerCase();
    const unitName = (item.unitSizeName || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return seedName.includes(term) || unitName.includes(term);
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPageNumber(0);
  };

  // ---------- Pagination ----------
  const pagesVisited = pageNumber * listPerPage;
  const lists = filteredData.slice(pagesVisited, pagesVisited + listPerPage);
  const pageCount = Math.ceil(filteredData.length / listPerPage);
  const changePage = ({ selected }) => setPageNumber(selected);

  // ---------- Display Name Helpers (simplified) ----------
  const getSeedTypeName = (item) => {
    if (!item) return "N/A";
    // Use the field provided by your API
    if (item.typeOfSeedName) return item.typeOfSeedName;
    // Fallback: try to map from seedTypes array
    if (typeof item.typeOfSeed === "string") {
      const found = seedTypes.find((st) => st._id === item.typeOfSeed);
      return found ? found.Name || found.name : item.typeOfSeed;
    }
    return "N/A";
  };

  const getUnitSizeName = (item) => {
    if (!item) return "N/A";
    if (item.unitSizeName) return item.unitSizeName;
    if (typeof item.unitSize === "string") {
      const found = unitSizes.find((us) => us._id === item.unitSize);
      return found ? found.Name || found.name : item.unitSize;
    }
    return "N/A";
  };

  // ---------- Add Form ----------
  const initialFormState = {
    typeOfSeed: "",
    unitSize: "",
    unitPrice: "",
    beneficiaryContributionPerUnit: "",
    subsidyPerUnit: "",
  };

  const [form, setForm] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm(initialFormState);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      typeOfSeed: form.typeOfSeed,
      unitSize: form.unitSize,
      unitPrice: parseFloat(form.unitPrice) || 0,
      beneficiaryContributionPerUnit: parseFloat(form.beneficiaryContributionPerUnit) || 0,
      subsidyPerUnit: parseFloat(form.subsidyPerUnit) || 0,
    };

    try {
      const res = await axios.post(URLS.AddFodderItems, payload, {
        headers: { Authorization: `Bearer ${TokenData}` },
      });
      if (res.status >= 200 && res.status < 300) {
        toast.success(res.data?.message || "Added successfully");
        setShowAddForm(false);
        resetForm();
        await fetchFodderItems(); // refresh list
        // Optionally go to last page to see the new item
        const newPageCount = Math.ceil((Data.length + 1) / listPerPage);
        setPageNumber(newPageCount - 1);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Bad request");
      } else {
        toast.error("Failed to add fodder item");
      }
    }
  };

  // ---------- Edit Form ----------
  const [editForm, setEditForm] = useState(initialFormState);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditForm = (item) => {
    // item.typeOfSeed and item.unitSize are already IDs – use them directly
    setEditForm({
      _id: item._id,
      typeOfSeed: item.typeOfSeed,
      unitSize: item.unitSize,
      unitPrice: item.unitPrice?.toString() || "",
      beneficiaryContributionPerUnit: item.beneficiaryContributionPerUnit?.toString() || "",
      subsidyPerUnit: item.subsidyPerUnit?.toString() || "",
    });
    setShowEditForm(true);
    setShowAddForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      typeOfSeed: editForm.typeOfSeed,
      unitSize: editForm.unitSize,
      unitPrice: parseFloat(editForm.unitPrice) || 0,
      beneficiaryContributionPerUnit: parseFloat(editForm.beneficiaryContributionPerUnit) || 0,
      subsidyPerUnit: parseFloat(editForm.subsidyPerUnit) || 0,
    };

    try {
      const res = await axios.put(`${URLS.EditFodderItems}/${editForm._id}`, payload, {
        headers: { Authorization: `Bearer ${TokenData}` },
      });
      if (res.status >= 200 && res.status < 300) {
        toast.success(res.data?.message || "Updated successfully");
        setShowEditForm(false);
        await fetchFodderItems();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Bad request");
      } else {
        toast.error("Failed to update fodder item");
      }
    }
  };

  // ---------- Delete ----------
  const confirmDelete = (item) => {
    if (window.confirm("Do you really want to delete this item?")) {
      deleteItem(item);
    }
  };

  const deleteItem = async (item) => {
    try {
      const res = await axios.delete(`${URLS.DeleteFodderItems}/${item._id}`, {
        headers: { Authorization: `Bearer ${TokenData}` },
      });
      if (res.status >= 200 && res.status < 300) {
        toast.success(res.data?.message || "Deleted successfully");
        await fetchFodderItems();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Bad request");
      } else {
        toast.error("Failed to delete fodder item");
      }
    }
  };

  // ---------- Render ----------
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Fodder Items" />

          {/* Edit Form Collapse */}
          <Row>
            <Col md={12}>
              <Collapse isOpen={showEditForm}>
                <Card className="p-4 mb-4 border-primary">
                  <Form onSubmit={handleEditSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0 text-primary">
                        <i className="bx bx-edit me-2"></i>
                        Edit Fodder Item
                      </h5>
                      <Button type="button" color="light" onClick={() => setShowEditForm(false)}>
                        <i className="bx bx-x"></i>
                      </Button>
                    </div>
                    <Row>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Type of seed <span className="text-danger">*</span></Label>
                          <Input
                            type="select"
                            name="typeOfSeed"
                            value={editForm.typeOfSeed}
                            onChange={handleEditChange}
                            required
                          >
                            <option value="">Select</option>
                            {seedTypes.map((st) => (
                              <option key={st._id} value={st._id}>
                                {st.Name || st.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Unit size <span className="text-danger">*</span></Label>
                          <Input
                            type="select"
                            name="unitSize"
                            value={editForm.unitSize}
                            onChange={handleEditChange}
                            required
                          >
                            <option value="">Select</option>
                            {unitSizes.map((us) => (
                              <option key={us._id} value={us._id}>
                                {us.Name || us.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Unit price <span className="text-danger">*</span></Label>
                          <Input
                            type="number"
                            name="unitPrice"
                            value={editForm.unitPrice}
                            onChange={handleEditChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Beneficiary Contribution Per Unit <span className="text-danger">*</span></Label>
                          <Input
                            type="number"
                            name="beneficiaryContributionPerUnit"
                            value={editForm.beneficiaryContributionPerUnit}
                            onChange={handleEditChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Subsidy Per Unit <span className="text-danger">*</span></Label>
                          <Input
                            type="number"
                            name="subsidyPerUnit"
                            value={editForm.subsidyPerUnit}
                            onChange={handleEditChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button type="button" onClick={() => setShowEditForm(false)} color="danger" className="m-1">
                        Cancel <i className="bx bx-x-circle"></i>
                      </Button>
                      <Button type="submit" color="primary" className="m-1">
                        Update <i className="bx bx-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Collapse>
            </Col>
          </Row>

          {/* Add Form Collapse */}
          <Row>
            <Col md={12}>
              <Collapse isOpen={showAddForm}>
                <Card className="p-4 mb-4 border-success">
                  <Form onSubmit={handleAddSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0 text-success">
                        <i className="bx bx-plus-circle me-2"></i>
                        Add Fodder Item
                      </h5>
                      <Button type="button" color="light" onClick={() => setShowAddForm(false)}>
                        <i className="bx bx-x"></i>
                      </Button>
                    </div>
                    <Row>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Type of seed <span className="text-danger">*</span></Label>
                          <Input
                            type="select"
                            name="typeOfSeed"
                            value={form.typeOfSeed}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select</option>
                            {seedTypes.map((st) => (
                              <option key={st._id} value={st._id}>
                                {st.Name || st.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Unit size <span className="text-danger">*</span></Label>
                          <Input
                            type="select"
                            name="unitSize"
                            value={form.unitSize}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select</option>
                            {unitSizes.map((us) => (
                              <option key={us._id} value={us._id}>
                                {us.Name || us.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Label>Unit price <span className="text-danger">*</span></Label>
                          <Input
                            type="number"
                            name="unitPrice"
                            value={form.unitPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Beneficiary Contribution Per Unit <span className="text-danger">*</span></Label>
                          <Input
                            type="number"
                            name="beneficiaryContributionPerUnit"
                            value={form.beneficiaryContributionPerUnit}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Subsidy Per Unit <span className="text-danger">*</span></Label>
                          <Input
                            type="number"
                            name="subsidyPerUnit"
                            value={form.subsidyPerUnit}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button type="button" onClick={() => setShowAddForm(false)} color="danger" className="m-1">
                        Cancel <i className="bx bx-x-circle"></i>
                      </Button>
                      <Button type="submit" color="success" className="m-1">
                        Submit <i className="bx bx-check-circle"></i>
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Collapse>
            </Col>
          </Row>

          {/* Main List Card */}
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <Row className="mb-3 align-items-center">
                    <Col md={6}>
                      <h5 className="mb-0">Fodder Items List</h5>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-end gap-2">
                        <Input
                          name="search"
                          value={searchTerm}
                          onChange={handleSearch}
                          type="search"
                          placeholder="Search..."
                          style={{ maxWidth: "200px" }}
                          className="m-1"
                        />
                        {(Roles?.FodderItemsAdd || Roles?.accessAll) && (
                          <Button
                            className="m-1"
                            color="primary"
                            onClick={() => {
                              setShowAddForm((prev) => {
                                if (prev) resetForm(); // reset only when closing
                                return !prev;
                              });
                              setShowEditForm(false);
                            }}
                          >
                            {showAddForm ? (
                              <>Cancel Add <i className="bx bx-x"></i></>
                            ) : (
                              <>Add New Item <i className="bx bx-plus"></i></>
                            )}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="table-rep-plugin mt-4">
                    <Table hover bordered responsive>
                      <thead className="table-light">
                        <tr className="text-center">
                          <th>S.No</th>
                          <th>Type of seed</th>
                          <th>Unit size</th>
                          <th>Unit price</th>
                          <th>Beneficiary Contribution (Per Unit)</th>
                          <th>Subsidy (Per Unit)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                        ) : lists.length > 0 ? (
                          lists.map((item, idx) => (
                            <tr key={item._id} className="text-center">
                              <th scope="row">{pagesVisited + idx + 1}</th>
                              <td>{getSeedTypeName(item)}</td>
                              <td>{getUnitSizeName(item)}</td>
                              <td>{item.unitPrice}</td>
                              <td>{item.beneficiaryContributionPerUnit}</td>
                              <td>{item.subsidyPerUnit}</td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  {(Roles?.FodderItemsEdit || Roles?.accessAll) && (
                                    <Button
                                      onClick={() => openEditForm(item)}
                                      size="sm"
                                      className="me-1"
                                      color="info"
                                    >
                                      <i className="bx bx-edit"></i>
                                    </Button>
                                  )}
                                  {(Roles?.FodderItemsDelete || Roles?.accessAll) && (
                                    <Button
                                      onClick={() => confirmDelete(item)}
                                      size="sm"
                                      className="me-1"
                                      color="danger"
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              <div className="text-muted">
                                <i className="bx bx-data display-4"></i>
                                <p className="mt-2">No fodder items found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {filteredData.length > listPerPage && (
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
  );
};

export default FodderItems;