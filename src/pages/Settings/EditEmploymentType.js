import React, { useState, useEffect } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"
import {
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap"

const Roles = () => {
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [ras, setras] = useState([])

  const handleChange1s = e => {
    const myUser = { ...ras }
    myUser[e.target.name] = e.target.checked
    setras(myUser)
  }

  const [ras1, setras1] = useState({
    acessAll: false,
  })

  const handleChange2s = e => {
    const myUser = { ...ras1 }
    myUser[e.target.name] = e.target.checked
    setras1(myUser)
  }

  const [form, setform] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    EditRole()
  }

  const check = {
    Dashboardview: ras.Dashboardview,
    EmployeeRegistationView: ras.EmployeeRegistationView,
    EmployeeRegistationAdd: ras.EmployeeRegistationAdd,
    EmployeeRegistationEdit: ras.EmployeeRegistationEdit,
    EmployeeRegistationDelete: ras.EmployeeRegistationDelete,
    MprOperationView: ras.MprOperationView,
    MprOperationAdd: ras.MprOperationAdd,
    MprOperationEdit: ras.MprOperationEdit,
    MprOperationDelete: ras.MprOperationDelete,
    PatientRegistrationView: ras.PatientRegistrationView,
    PatientRegistrationAdd: ras.PatientRegistrationAdd,
    PatientRegistrationEdit: ras.PatientRegistrationEdit,
    PatientRegistrationDelete: ras.PatientRegistrationDelete,
    VeterinaryInspectionView: ras.VeterinaryInspectionView,
    VeterinaryInspectionAdd: ras.VeterinaryInspectionAdd,
    VeterinaryInspectionEdit: ras.VeterinaryInspectionEdit,
    VeterinaryInspectionDelete: ras.VeterinaryInspectionDelete,
    DistrictView: ras.DistrictView,
    DistrictAdd: ras.DistrictAdd,
    DistrictEdit: ras.DistrictEdit,
    DistrictDelete: ras.DistrictDelete,
    StateView: ras.StateView,
    StateAdd: ras.StateAdd,
    StateEdit: ras.StateEdit,
    StateDelete: ras.StateDelete,
    TownView: ras.TownView,
    TownAdd: ras.TownAdd,
    TownEdit: ras.TownEdit,
    TownDelete: ras.TownDelete,
    PlaceOfWorkingView: ras.TownDelete,
    PlaceOfWorkingAdd: ras.PlaceOfWorkingAdd,
    PlaceOfWorkingEdit: ras.PlaceOfWorkingEdit,
    PlaceOfWorkingDelete: ras.PlaceOfWorkingDelete,
    DesignationView: ras.DesignationView,
    DesignationAdd: ras.DesignationAdd,
    DesignationEdit: ras.DesignationEdit,
    DesignationDelete: ras.DesignationDelete,
    EmployeeTypeView: ras.EmployeeTypeView,
    EmployeeTypeAdd: ras.EmployeeTypeAdd,
    EmployeeTypeEdit: ras.EmployeeTypeEdit,
    EmployeeTypeDelete: ras.EmployeeTypeDelete,
    TypeOfPostingView: ras.TypeOfPostingView,
    TypeOfPostingAdd: ras.TypeOfPostingAdd,
    TypeOfPostingEdit: ras.TypeOfPostingEdit,
    TypeOfPostingDelete: ras.TypeOfPostingDelete,
    CustomerHelpView: ras.CustomerHelpView,
  }

  const EditRole = () => {
    const token = datas

    const data = {
      name: form.name,
      roles: check,
      acessAll: ras1.acessAll,
    }
    axios
      .put(URLS.EditEmploymentType + form._id, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            history.push("/employment-type")
            sessionStorage.setItem("tost", "Roles has been Added Successfully")
          }
        },
        error => {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message)
          }
        }
      )
  }

  function handleChange(e) {
    let myUser = { ...form }
    myUser[e.target.name] = e.target.value
    setform(myUser)
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)

  const history = useHistory()

  useEffect(() => {
    GetOneData()
  }, [])

  const RoleId = sessionStorage.getItem("Roleid")

  const GetOneData = () => {
    const data = {
      id: RoleId,
    }
    var token = datas
    axios
      .post(URLS.GetOneEmploymentType, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setform(res?.data?.data)
        setras(res?.data?.data?.roles[0])
      })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Edit Type of Insitution"
            breadcrumbItem="Edit Type of Insitution"
          />
          <Row>
            <Col>
              <Button
                onClick={() => history.goBack()}
                className="mb-3  m-1 "
                style={{ float: "right" }}
                color="primary"
              >
                <i className="far fa-arrow-alt-circle-left"></i> Back
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card>
                <CardHeader className="bg-white mt-2">
                  <CardTitle>Edit Type of Insitution</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <Row>
                      <Col md={4}>
                        <Label for="basicpill-firstname-input1">
                          Type of Insitution
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Type of Insitution"
                          required
                          value={form.name}
                          name="name"
                          onChange={e => {
                            handleChange(e)
                          }}
                        />
                      </Col>
                    </Row>
                    <h5 className="mt-4 mb-3">Dashboard:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Dashboard: </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="Dashboardview"
                            defaultChecked={ras.Dashboardview}
                            value={ras.Dashboardview}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="read">
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <h5 className="mt-3 mb-3">Employee Registation</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Employee Registation : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeRegistationView"
                            defaultChecked={ras.EmployeeRegistationView}
                            value={ras.EmployeeRegistationView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeRegistationAdd"
                            defaultChecked={ras.EmployeeRegistationAdd}
                            value={ras.EmployeeRegistationAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeRegistationEdit"
                            defaultChecked={ras.EmployeeRegistationEdit}
                            value={ras.EmployeeRegistationEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeRegistationDelete"
                            defaultChecked={ras.EmployeeRegistationDelete}
                            value={ras.EmployeeRegistationDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <h5 className="mt-3 mb-3"> Progress Report:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Progress Report : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="MprOperationView"
                            defaultChecked={ras.MprOperationView}
                            value={ras.MprOperationView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="MprOperationAdd"
                            defaultChecked={ras.MprOperationAdd}
                            value={ras.MprOperationAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="MprOperationEdit"
                            defaultChecked={ras.MprOperationEdit}
                            value={ras.MprOperationEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="MprOperationDelete"
                            defaultChecked={ras.MprOperationDelete}
                            value={ras.MprOperationDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <h5 className="mt-3 mb-3">Patient Registration:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Patient Registration : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PatientRegistrationView"
                            defaultChecked={ras.PatientRegistrationView}
                            value={ras.PatientRegistrationView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PatientRegistrationAdd"
                            defaultChecked={ras.PatientRegistrationAdd}
                            value={ras.PatientRegistrationAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PatientRegistrationEdit"
                            defaultChecked={ras.PatientRegistrationEdit}
                            value={ras.PatientRegistrationEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PatientRegistrationDelete"
                            defaultChecked={ras.PatientRegistrationDelete}
                            value={ras.PatientRegistrationDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <h5 className="mt-3 mb-3">Inspection:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Inspection : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="VeterinaryInspectionView"
                            defaultChecked={ras.VeterinaryInspectionView}
                            value={ras.VeterinaryInspectionView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="VeterinaryInspectionAdd"
                            defaultChecked={ras.VeterinaryInspectionAdd}
                            value={ras.VeterinaryInspectionAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="VeterinaryInspectionEdit"
                            defaultChecked={ras.VeterinaryInspectionEdit}
                            value={ras.VeterinaryInspectionEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="VeterinaryInspectionDelete"
                            defaultChecked={ras.VeterinaryInspectionDelete}
                            value={ras.VeterinaryInspectionDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <h5 className="mt-3 mb-3">Settings:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">District : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DistrictView"
                            defaultChecked={ras.DistrictView}
                            value={ras.DistrictView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DistrictAdd"
                            defaultChecked={ras.DistrictAdd}
                            value={ras.DistrictAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DistrictEdit"
                            defaultChecked={ras.DistrictEdit}
                            value={ras.DistrictEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DistrictDelete"
                            defaultChecked={ras.DistrictDelete}
                            value={ras.DistrictDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">State : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="StateView"
                            defaultChecked={ras.StateView}
                            value={ras.StateView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="StateAdd"
                            defaultChecked={ras.StateAdd}
                            value={ras.StateAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="StateEdit"
                            defaultChecked={ras.StateEdit}
                            value={ras.StateEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="StateDelete"
                            defaultChecked={ras.StateDelete}
                            value={ras.StateDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Village / Town : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TownView"
                            defaultChecked={ras.TownView}
                            value={ras.TownView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TownAdd"
                            defaultChecked={ras.TownAdd}
                            value={ras.TownAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TownEdit"
                            defaultChecked={ras.TownEdit}
                            value={ras.TownEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TownDelete"
                            defaultChecked={ras.TownDelete}
                            value={ras.TownDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Place Of Working : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PlaceOfWorkingView"
                            defaultChecked={ras.PlaceOfWorkingView}
                            value={ras.PlaceOfWorkingView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PlaceOfWorkingAdd"
                            defaultChecked={ras.PlaceOfWorkingAdd}
                            value={ras.PlaceOfWorkingAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PlaceOfWorkingEdit"
                            defaultChecked={ras.PlaceOfWorkingEdit}
                            value={ras.PlaceOfWorkingEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PlaceOfWorkingDelete"
                            defaultChecked={ras.PlaceOfWorkingDelete}
                            value={ras.PlaceOfWorkingDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Designation : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DesignationView"
                            defaultChecked={ras.DesignationView}
                            value={ras.DesignationView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DesignationAdd"
                            defaultChecked={ras.DesignationAdd}
                            value={ras.DesignationAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DesignationEdit"
                            defaultChecked={ras.DesignationEdit}
                            value={ras.DesignationEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DesignationDelete"
                            defaultChecked={ras.DesignationDelete}
                            value={ras.DesignationDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Employee Type : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeTypeView"
                            defaultChecked={ras.EmployeeTypeView}
                            value={ras.EmployeeTypeView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeTypeAdd"
                            defaultChecked={ras.EmployeeTypeAdd}
                            value={ras.EmployeeTypeAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeTypeEdit"
                            defaultChecked={ras.EmployeeTypeEdit}
                            value={ras.EmployeeTypeEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeTypeDelete"
                            defaultChecked={ras.EmployeeTypeDelete}
                            value={ras.EmployeeTypeDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Type Of Posting : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TypeOfPostingView"
                            defaultChecked={ras.TypeOfPostingView}
                            value={ras.TypeOfPostingView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="empView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check  me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TypeOfPostingAdd"
                            defaultChecked={ras.TypeOfPostingAdd}
                            value={ras.TypeOfPostingAdd}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empAdd">
                            Add
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TypeOfPostingEdit"
                            defaultChecked={ras.TypeOfPostingEdit}
                            value={ras.TypeOfPostingEdit}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empEdit">
                            Edit
                          </Label>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TypeOfPostingDelete"
                            defaultChecked={ras.TypeOfPostingDelete}
                            value={ras.TypeOfPostingDelete}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="read"
                          />
                          <Label className="form-check-label" for="empl3">
                            Delete
                          </Label>
                        </div>
                      </Col>
                      <Col md={1}></Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Data Access :</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Data Access : </p>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="acessAll"
                            defaultChecked={ras1.acessAll}
                            value={ras1.acessAll}
                            onClick={e => {
                              handleChange2s(e)
                            }}
                            id="read"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="acessAll"
                          >
                            Data Access All ?
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3" style={{ float: "right" }}>
                      <button
                        type="submit"
                        style={{ width: "120px" }}
                        className="btn btn-primary m-1"
                      >
                        Submit
                        <i
                          className="fa fa-check-circle-o"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Roles
