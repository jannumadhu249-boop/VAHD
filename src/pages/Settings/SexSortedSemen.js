import React, { useEffect, useState } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Row, Col, Card, CardBody, Table, Button, Input } from "reactstrap"
import axios from "axios"
import { URLS } from "../../Url"
import { ToastContainer, toast } from "react-toastify"

const SexSortedSemen = () => {
    const GetAuth = localStorage.getItem("authUser")
    const TokenJson = JSON.parse(GetAuth)
    const TokenData = TokenJson.token
    const token = TokenData

    const [data, setData] = useState([])
    const [form, setForm] = useState({ name: "" })
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        Get()
    }, [])

    const Get = () => {
        axios
            .post(
                URLS.GetAllSortedSemen,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(res => {
                if (res.data.success) {
                    setData(res.data.sortedsemens)
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error)
            })
    }

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (isEdit) {
            UpdateData()
        } else {
            AddData()
        }
    }

    const AddData = () => {
        const dataArray = {
            name: form.name,
        }
        axios
            .post(URLS.AddSortedSemen, dataArray, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(
                res => {
                    if (res.data.success) {
                        toast.success(res.data.message)
                        setForm({ name: "" })
                        Get()
                    }
                },
                error => {
                    if (error.response && error.response.status === 400) {
                        toast.error(error.response.data.message)
                    }
                }
            )
    }

    const UpdateData = () => {
        const dataArray = {
            name: form.name,
        }
        axios
            .put(URLS.EditSortedSemen + editId, dataArray, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(
                res => {
                    if (res.data.success) {
                        toast.success(res.data.message)
                        setForm({ name: "" })
                        setIsEdit(false)
                        setEditId(null)
                        Get()
                    }
                },
                error => {
                    if (error.response && error.response.status === 400) {
                        toast.error(error.response.data.message)
                    }
                }
            )
    }

    const handleEdit = item => {
        setForm({ name: item.name })
        setIsEdit(true)
        setEditId(item._id)
    }

    const handleDelete = id => {
        const confirmBox = window.confirm("Do you really want to Delete?")
        if (confirmBox === true) {
            axios
                .delete(URLS.DeleteSortedSemen + id, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(
                    res => {
                        if (res.status === 200 || res.data.success) {
                            toast.success(res.data.message || "Deleted successfully")
                            Get()
                        }
                    },
                    error => {
                        if (error.response && error.response.status === 400) {
                            toast.error(error.response.data.message)
                        } else {
                            // Fallback for presumed URL failure or different status
                            toast.error("Failed to delete. Please contact admin.")
                        }
                    }
                )
        }
    }

    const handleCancel = () => {
        setIsEdit(false)
        setEditId(null)
        setForm({ name: "" })
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Sex Sorted Semen" />

                    <Row>
                        <Col md={4}>
                            <Card className="p-4">
                                <h5 className="mb-3">
                                    {isEdit ? "Edit Sex Sorted Semen" : "Add Sex Sorted Semen"}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <div className="mb-3">
                                                <label className="form-label">Name</label>
                                                <span className="text-danger">*</span>
                                                <Input
                                                    name="name"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="text-end">
                                        {isEdit && (
                                            <Button
                                                type="button"
                                                color="danger"
                                                className="m-1"
                                                onClick={handleCancel}
                                            >
                                                Cancel <i className="bx bx-x-circle"></i>
                                            </Button>
                                        )}
                                        <Button type="submit" color="primary" className="m-1">
                                            {isEdit ? "Update" : "Submit"}{" "}
                                            <i className="bx bx-check-circle"></i>
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </Col>

                        <Col md={8}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h5 className="mb-3">Sex Sorted Semen List</h5>
                                        </Col>
                                    </Row>
                                    <div className="table-rep-plugin mt-4 table-responsive">
                                        <Table hover bordered responsive>
                                            <thead>
                                                <tr className="text-center">
                                                    <th>S.No</th>
                                                    <th>Name</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item, key) => (
                                                    <tr key={key} className="text-center">
                                                        <th scope="row">{key + 1}</th>
                                                        <td>{item.name}</td>
                                                        <td>
                                                            <Button
                                                                size="md"
                                                                className="m-1"
                                                                color="info"
                                                                onClick={() => handleEdit(item)}
                                                            >
                                                                <div className="d-flex">
                                                                    <i className="bx bx-edit"></i>
                                                                </div>
                                                            </Button>
                                                            <Button
                                                                size="md"
                                                                className="m-1"
                                                                color="danger"
                                                                onClick={() => handleDelete(item._id)}
                                                            >
                                                                <div className="d-flex">
                                                                    <i className="bx bx-trash"></i>
                                                                </div>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <ToastContainer />
                </div>
            </div>
        </React.Fragment>
    )
}

export default SexSortedSemen
