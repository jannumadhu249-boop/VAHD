import React, { useState, useEffect } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import { URLS } from "../../Url"
import axios from "axios"
import {
  CardBody,
  Container,
  Row,
  Col,
  Card,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap"

const EditDesignation = () => {
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var datas = data.token

  const [ras, setras] = useState({})

  const handleChange1s = e => {
    const myUser = { ...ras }
    myUser[e.target.name] = e.target.checked
    setras(myUser)
  }

  const [ras1, setras1] = useState({})

  const handleChange2s = e => {
    const myUser = { ...ras1 }
    myUser[e.target.name] = e.target.checked
    setras1(myUser)
  }

  const [form, setform] = useState({
    designation: "",
  })

  const handleSubmit = e => {
    e.preventDefault()
    EditDesignation()
  }

  const check = {
    Dashboardview: ras.Dashboardview,
    EmployeeRegistationsView: ras.EmployeeRegistationsView,
    EmployeeRegistationView: ras.EmployeeRegistationView,
    EmployeeRegistationAdd: ras.EmployeeRegistationAdd,
    EmployeeRegistationEdit: ras.EmployeeRegistationEdit,
    EmployeeRegistationDelete: ras.EmployeeRegistationDelete,
    MprSurgicalsView: ras.MprSurgicalsView,
    MprSurgicalView: ras.MprSurgicalView,
    MprSurgicalAdd: ras.MprSurgicalAdd,
    MprSurgicalEdit: ras.MprSurgicalEdit,
    MprSurgicalDelete: ras.MprSurgicalDelete,
    PatientRegistrationView: ras.PatientRegistrationView,
    CaseTreatedView: ras.CaseTreatedView,
    CaseTreatedAdd: ras.CaseTreatedAdd,
    CaseTreatedEdit: ras.CaseTreatedEdit,
    CaseTreatedDelete: ras.CaseTreatedDelete,
    DewormingView: ras.DewormingView,
    DewormingAdd: ras.DewormingAdd,
    DewormingEdit: ras.DewormingEdit,
    DewormingDelete: ras.DewormingDelete,
    CastrationView: ras.CastrationView,
    CastrationAdd: ras.CastrationAdd,
    CastrationEdit: ras.CastrationEdit,
    CastrationDelete: ras.CastrationDelete,
    VaccinationView: ras.VaccinationView,
    VaccinationAdd: ras.VaccinationAdd,
    VaccinationEdit: ras.VaccinationEdit,
    VaccinationDelete: ras.VaccinationDelete,
    SurgicalView: ras.SurgicalView,
    SurgicalAdd: ras.SurgicalAdd,
    SurgicalEdit: ras.SurgicalEdit,
    SurgicalDelete: ras.SurgicalDelete,
    GoatDewormingsView: ras.GoatDewormingsView,
    GoatDewormingView: ras.GoatDewormingView,
    GoatDewormingAdd: ras.GoatDewormingAdd,
    GoatDewormingEdit: ras.GoatDewormingEdit,
    GoatDewormingDelete: ras.GoatDewormingDelete,
    FoddersView: ras.FoddersView,
    FodderView: ras.FodderView,
    FodderAdd: ras.FodderAdd,
    FodderEdit: ras.FodderEdit,
    FodderDelete: ras.FodderDelete,
    AIsView: ras.AIsView,
    AIView: ras.AIView,
    AIAdd: ras.AIAdd,
    AIEdit: ras.AIEdit,
    AIDelete: ras.AIDelete,
    VeterinaryInspectionsView: ras.VeterinaryInspectionsView,
    VeterinaryInspectionView: ras.VeterinaryInspectionView,
    VeterinaryInspectionAdd: ras.VeterinaryInspectionAdd,
    VeterinaryInspectionEdit: ras.VeterinaryInspectionEdit,
    VeterinaryInspectionDelete: ras.VeterinaryInspectionDelete,
    DrugIndentsView: ras.DrugIndentsView,
    DrugIndentView: ras.DrugIndentView,
    DrugIndentAdd: ras.DrugIndentAdd,
    DrugIndentEdit: ras.DrugIndentEdit,
    DrugIndentDelete: ras.DrugIndentDelete,
    SettingsView: ras.SettingsView,
    DistrictView: ras.DistrictView,
    DistrictAdd: ras.DistrictAdd,
    DistrictEdit: ras.DistrictEdit,
    DistrictDelete: ras.DistrictDelete,
    MandalView: ras.MandalView,
    MandalAdd: ras.MandalAdd,
    MandalEdit: ras.MandalEdit,
    MandalDelete: ras.MandalDelete,
    TownView: ras.TownView,
    TownAdd: ras.TownAdd,
    TownEdit: ras.TownEdit,
    TownDelete: ras.TownDelete,
    TypeOfInstitutionView: ras.TypeOfInstitutionView,
    TypeOfInstitutionAdd: ras.TypeOfInstitutionAdd,
    TypeOfInstitutionEdit: ras.TypeOfInstitutionEdit,
    TypeOfInstitutionDelete: ras.TypeOfInstitutionDelete,
    PlaceOfWorkingView: ras.PlaceOfWorkingView,
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
    DiagnosticView: ras.DiagnosticView,
    DiagnosticAdd: ras.DiagnosticAdd,
    DiagnosticEdit: ras.DiagnosticEdit,
    DiagnosticDelete: ras.DiagnosticDelete,
    AnimalTypesView: ras.AnimalTypesView,
    AnimalTypesAdd: ras.AnimalTypesAdd,
    AnimalTypesEdit: ras.AnimalTypesEdit,
    AnimalTypesDelete: ras.AnimalTypesDelete,
    BreedsView: ras.BreedsView,
    BreedsAdd: ras.BreedsAdd,
    BreedsEdit: ras.BreedsEdit,
    BreedsDelete: ras.BreedsDelete,
    VaccinationTypeView: ras.VaccinationTypeView,
    VaccinationTypeAdd: ras.VaccinationTypeAdd,
    VaccinationTypeEdit: ras.VaccinationTypeEdit,
    VaccinationTypeDelete: ras.VaccinationTypeDelete,
    ItemsView: ras.ItemsView,
    ItemsAdd: ras.ItemsAdd,
    ItemsEdit: ras.ItemsEdit,
    ItemsDelete: ras.ItemsDelete,
    SurgicalTypesView: ras.SurgicalTypesView,
    SurgicalTypesAdd: ras.SurgicalTypesAdd,
    SurgicalTypesEdit: ras.SurgicalTypesEdit,
    SurgicalTypesDelete: ras.SurgicalTypesDelete,
    SurgicalsView: ras.SurgicalsView,
    SurgicalsAdd: ras.SurgicalsAdd,
    SurgicalsEdit: ras.SurgicalsEdit,
    SurgicalsDelete: ras.SurgicalsDelete,
    QualificationsView: ras.QualificationsView,
    QualificationsAdd: ras.QualificationsAdd,
    QualificationsEdit: ras.QualificationsEdit,
    QualificationsDelete: ras.QualificationsDelete,
    SpecializationView: ras.SpecializationView,
    SpecializationAdd: ras.SpecializationAdd,
    SpecializationEdit: ras.SpecializationEdit,
    SpecializationDelete: ras.SpecializationDelete,
    GrampanchayathView: ras.GrampanchayathView,
    GrampanchayathAdd: ras.GrampanchayathAdd,
    GrampanchayathEdit: ras.GrampanchayathEdit,
    GrampanchayathDelete: ras.GrampanchayathDelete,
    CompleteAttendanceReportView: ras.CompleteAttendanceReportView,
    DetailAttendanceReportView: ras.DetailAttendanceReportView,
    LeavesManagement: ras.LeavesManagement,
    AllocationFormView: ras.AllocationFormView,
    AllocationFormAdd: ras.AllocationFormAdd,
    AllocationFormEdit: ras.AllocationFormEdit,
    AllocationFormDelete: ras.AllocationFormDelete,
    DrugView: ras.DrugView,
    DrugAdd: ras.DrugAdd,
    DrugEdit: ras.DrugEdit,
    DrugDelete: ras.DrugDelete,
    FinancialYearView: ras.FinancialYearView,
    FinancialYearAdd: ras.FinancialYearAdd,
    FinancialYearEdit: ras.FinancialYearEdit,
    FinancialYearDelete: ras.FinancialYearDelete,
    SchemeView: ras.SchemeView,
    SchemeAdd: ras.SchemeAdd,
    SchemeEdit: ras.SchemeEdit,
    SchemeDelete: ras.SchemeDelete,
    QuarterView: ras.QuarterView,
    QuarterAdd: ras.QuarterAdd,
    QuarterEdit: ras.QuarterEdit,
    QuarterDelete: ras.QuarterDelete,
    PercentageAllocationView: ras.PercentageAllocationView,
    PercentageAllocationAdd: ras.PercentageAllocationAdd,
    PercentageAllocationEdit: ras.PercentageAllocationEdit,
    PercentageAllocationDelete: ras.PercentageAllocationDelete,
    PoliciesView: ras.PoliciesView,
    PoliciesAdd: ras.PoliciesAdd,
    PoliciesEdit: ras.PoliciesEdit,
    PoliciesDelete: ras.PoliciesDelete,
    ReportsView: ras.ReportsView,
    InstitutionReportView: ras.InstitutionReportView,
    DistrictWiseDVAHOReportView: ras.DistrictWiseDVAHOReportView,
    GroupWiseDistrictReportView: ras.GroupWiseDistrictReportView,
    DistrictWiseAbstractReportView: ras.DistrictWiseAbstractReportView,
    DistrictWiseInstCountReportView: ras.DistrictWiseInstCountReportView,
    InstitutionDrugReportView: ras.InstitutionDrugReportView,
    InstitutionProgressReportView: ras.InstitutionProgressReportView,
    DrugReportView: ras.DrugReportView,
    InstitutionProgressAbstractView: ras.InstitutionProgressAbstractView,
    InventoryManagementView: ras.InventoryManagementView,
    DetailedDrugReportView: ras.DetailedDrugReportView,
    DocumentManagementView: ras.DocumentManagementView,
    CaseTreatedReportView: ras.CaseTreatedReportView,
    ArtificialInseminationReportView: ras.ArtificialInseminationReportView,
    FodderReportView: ras.FodderReportView,
    FarmersReportView: ras.FarmersReportView,
    FarmersAbstractReportView: ras.FarmersAbstractReportView,
  }

  const RoleId = sessionStorage.getItem("Roleid")

  const EditDesignation = () => {
    const token = datas

    const data = {
      designation: form.designation,
      roles: check,
      accessAll: ras1.accessAll,
    }

    axios
      .post(URLS.EditDesignation + RoleId, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        res => {
          if (res.status === 200) {
            toast(res.data.message)
            history.push("/designation")
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

  const GetOneData = () => {
    const data = {
      designationId: RoleId,
    }
    var token = datas
    axios
      .post(URLS.GetDesignationById, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setform(res?.data?.data)
        setras(res?.data?.data?.roles[0] || {})
        setras1(res?.data?.data || [])
      })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Add Designation" />
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
                <CardBody>
                  <Form
                    onSubmit={e => {
                      handleSubmit(e)
                    }}
                  >
                    <Row>
                      <Col md={4}>
                        <Label for="basicpill-firstname-input1">
                          Designation <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-firstname-input1"
                          placeholder="Enter Designation"
                          required
                          value={form.designation}
                          name="designation"
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
                    </Row>
                    <h5 className="mt-3 mb-3">Employee Registation</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Employee Registation : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="EmployeeRegistationsView"
                            defaultChecked={ras.EmployeeRegistationsView}
                            value={ras.EmployeeRegistationsView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Employee Registation : </p>
                      </Col>

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
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Employee Attendance Report : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="AttendanceReportView"
                            defaultChecked={ras.AttendanceReportView}
                            value={ras.AttendanceReportView}
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
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Leaves Management : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="LeavesManagement"
                            defaultChecked={ras.LeavesManagement}
                            value={ras.LeavesManagement}
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
                    </Row>


                    <h5 className="mt-3 mb-3"> Progress Report:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Progress Report : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="MprSurgicalsView"
                            defaultChecked={ras.MprSurgicalsView}
                            value={ras.MprSurgicalsView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Progress Report : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="MprSurgicalView"
                            defaultChecked={ras.MprSurgicalView}
                            value={ras.MprSurgicalView}
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
                            name="MprSurgicalAdd"
                            defaultChecked={ras.MprSurgicalAdd}
                            value={ras.MprSurgicalAdd}
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
                            name="MprSurgicalEdit"
                            defaultChecked={ras.MprSurgicalEdit}
                            value={ras.MprSurgicalEdit}
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
                            name="MprSurgicalDelete"
                            defaultChecked={ras.MprSurgicalDelete}
                            value={ras.MprSurgicalDelete}
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
                    </Row>
                    <h5 className="mt-3 mb-3">Patient Registration:</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Patient Registration : </p>
                      </Col>

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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Case Treated : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CaseTreatedView"
                            defaultChecked={ras.CaseTreatedView}
                            value={ras.CaseTreatedView}
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
                            name="CaseTreatedAdd"
                            defaultChecked={ras.CaseTreatedAdd}
                            value={ras.CaseTreatedAdd}
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
                            name="CaseTreatedEdit"
                            defaultChecked={ras.CaseTreatedEdit}
                            value={ras.CaseTreatedEdit}
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
                            name="CaseTreatedDelete"
                            defaultChecked={ras.CaseTreatedDelete}
                            value={ras.CaseTreatedDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Deworming : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DewormingView"
                            defaultChecked={ras.DewormingView}
                            value={ras.DewormingView}
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
                            name="DewormingAdd"
                            defaultChecked={ras.DewormingAdd}
                            value={ras.DewormingAdd}
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
                            name="DewormingEdit"
                            defaultChecked={ras.DewormingEdit}
                            value={ras.DewormingEdit}
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
                            name="DewormingDelete"
                            defaultChecked={ras.DewormingDelete}
                            value={ras.DewormingDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className=""> Castration : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CastrationView"
                            defaultChecked={ras.CastrationView}
                            value={ras.CastrationView}
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
                            name="CastrationAdd"
                            defaultChecked={ras.CastrationAdd}
                            value={ras.CastrationAdd}
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
                            name="CastrationEdit"
                            defaultChecked={ras.CastrationEdit}
                            value={ras.CastrationEdit}
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
                            name="CastrationDelete"
                            defaultChecked={ras.CastrationDelete}
                            value={ras.CastrationDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Vaccination : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="VaccinationView"
                            defaultChecked={ras.VaccinationView}
                            value={ras.VaccinationView}
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
                            name="VaccinationAdd"
                            defaultChecked={ras.VaccinationAdd}
                            value={ras.VaccinationAdd}
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
                            name="VaccinationEdit"
                            defaultChecked={ras.VaccinationEdit}
                            value={ras.VaccinationEdit}
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
                            name="VaccinationDelete"
                            defaultChecked={ras.VaccinationDelete}
                            value={ras.VaccinationDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Surgical : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SurgicalView"
                            defaultChecked={ras.SurgicalView}
                            value={ras.SurgicalView}
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
                            name="SurgicalAdd"
                            defaultChecked={ras.SurgicalAdd}
                            value={ras.SurgicalAdd}
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
                            name="SurgicalEdit"
                            defaultChecked={ras.SurgicalEdit}
                            value={ras.SurgicalEdit}
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
                            name="SurgicalDelete"
                            defaultChecked={ras.SurgicalDelete}
                            value={ras.SurgicalDelete}
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
                    </Row>
                    <h5 className="mt-3 mb-3">Sheep & Goat Deworming:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Sheep & Goat Deworming : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="GoatDewormingsView"
                            defaultChecked={ras.GoatDewormingsView}
                            value={ras.GoatDewormingsView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Sheep & Goat Deworming : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="GoatDewormingView"
                            defaultChecked={ras.GoatDewormingView}
                            value={ras.GoatDewormingView}
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
                            name="GoatDewormingAdd"
                            defaultChecked={ras.GoatDewormingAdd}
                            value={ras.GoatDewormingAdd}
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
                            name="GoatDewormingEdit"
                            defaultChecked={ras.GoatDewormingEdit}
                            value={ras.GoatDewormingEdit}
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
                            name="GoatDewormingDelete"
                            defaultChecked={ras.GoatDewormingDelete}
                            value={ras.GoatDewormingDelete}
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
                    </Row>

                    <h5 className="mt-3 mb-3">Fodder :</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Fodder : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="FoddersView"
                            defaultChecked={ras.FoddersView}
                            value={ras.FoddersView}
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
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Fodder : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="FodderView"
                            defaultChecked={ras.FodderView}
                            value={ras.FodderView}
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
                            name="FodderAdd"
                            defaultChecked={ras.FodderAdd}
                            value={ras.FodderAdd}
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
                            name="FodderEdit"
                            defaultChecked={ras.FodderEdit}
                            value={ras.FodderEdit}
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
                            name="FodderDelete"
                            defaultChecked={ras.FodderDelete}
                            value={ras.FodderDelete}
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
                    </Row>

                    <h5 className="mt-3 mb-3">AI :</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">AI : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="AIsView"
                            defaultChecked={ras.AIsView}
                            value={ras.AIsView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">AI : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="AIView"
                            defaultChecked={ras.AIView}
                            value={ras.AIView}
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
                            name="AIAdd"
                            defaultChecked={ras.AIAdd}
                            value={ras.AIAdd}
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
                            name="AIEdit"
                            defaultChecked={ras.AIEdit}
                            value={ras.AIEdit}
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
                            name="AIDelete"
                            defaultChecked={ras.AIDelete}
                            value={ras.AIDelete}
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
                    </Row>

                    <h5 className="mt-3 mb-3">Inspection:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Inspection : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="VeterinaryInspectionsView"
                            defaultChecked={ras.VeterinaryInspectionsView}
                            value={ras.VeterinaryInspectionsView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Inspection : </p>
                      </Col>

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
                    </Row>

                    <h5 className="mt-3 mb-3">Drug Indent:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Drug Indent : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DrugIndentsView"
                            defaultChecked={ras.DrugIndentsView}
                            value={ras.DrugIndentsView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Drug Indent : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DrugIndentView"
                            defaultChecked={ras.DrugIndentView}
                            value={ras.DrugIndentView}
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
                            name="DrugIndentAdd"
                            defaultChecked={ras.DrugIndentAdd}
                            value={ras.DrugIndentAdd}
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
                            name="DrugIndentEdit"
                            defaultChecked={ras.DrugIndentEdit}
                            value={ras.DrugIndentEdit}
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
                            name="DrugIndentDelete"
                            defaultChecked={ras.DrugIndentDelete}
                            value={ras.DrugIndentDelete}
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
                    </Row>

                    <h5 className="mt-3 mb-3">Reports:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Reports Menu : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="ReportsView"
                            defaultChecked={ras.ReportsView}
                            value={ras.ReportsView}
                            onClick={e => { handleChange1s(e) }}
                            id="ReportsView"
                          />
                          <Label className="form-check-label" for="ReportsView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Institution Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="InstitutionReportView"
                            defaultChecked={ras.InstitutionReportView}
                            value={ras.InstitutionReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="InstitutionReportView"
                          />
                          <Label className="form-check-label" for="InstitutionReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">District Wise DVAHO Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DistrictWiseDVAHOReportView"
                            defaultChecked={ras.DistrictWiseDVAHOReportView}
                            value={ras.DistrictWiseDVAHOReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="DistrictWiseDVAHOReportView"
                          />
                          <Label className="form-check-label" for="DistrictWiseDVAHOReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Group Wise District Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="GroupWiseDistrictReportView"
                            defaultChecked={ras.GroupWiseDistrictReportView}
                            value={ras.GroupWiseDistrictReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="GroupWiseDistrictReportView"
                          />
                          <Label className="form-check-label" for="GroupWiseDistrictReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">District Wise Abstract Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DistrictWiseAbstractReportView"
                            defaultChecked={ras.DistrictWiseAbstractReportView}
                            value={ras.DistrictWiseAbstractReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="DistrictWiseAbstractReportView"
                          />
                          <Label className="form-check-label" for="DistrictWiseAbstractReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">District Wise Inst Count Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DistrictWiseInstCountReportView"
                            defaultChecked={ras.DistrictWiseInstCountReportView}
                            value={ras.DistrictWiseInstCountReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="DistrictWiseInstCountReportView"
                          />
                          <Label className="form-check-label" for="DistrictWiseInstCountReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Institution Drug Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="InstitutionDrugReportView"
                            defaultChecked={ras.InstitutionDrugReportView}
                            value={ras.InstitutionDrugReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="InstitutionDrugReportView"
                          />
                          <Label className="form-check-label" for="InstitutionDrugReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Institution Progress Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="InstitutionProgressReportView"
                            defaultChecked={ras.InstitutionProgressReportView}
                            value={ras.InstitutionProgressReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="InstitutionProgressReportView"
                          />
                          <Label className="form-check-label" for="InstitutionProgressReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Drug Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DrugReportView"
                            defaultChecked={ras.DrugReportView}
                            value={ras.DrugReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="DrugReportView"
                          />
                          <Label className="form-check-label" for="DrugReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Institution Progress Abstract : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="InstitutionProgressAbstractView"
                            defaultChecked={ras.InstitutionProgressAbstractView}
                            value={ras.InstitutionProgressAbstractView}
                            onClick={e => { handleChange1s(e) }}
                            id="InstitutionProgressAbstractView"
                          />
                          <Label className="form-check-label" for="InstitutionProgressAbstractView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Inventory Management : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="InventoryManagementView"
                            defaultChecked={ras.InventoryManagementView}
                            value={ras.InventoryManagementView}
                            onClick={e => { handleChange1s(e) }}
                            id="InventoryManagementView"
                          />
                          <Label className="form-check-label" for="InventoryManagementView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Detailed Drug Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DetailedDrugReportView"
                            defaultChecked={ras.DetailedDrugReportView}
                            value={ras.DetailedDrugReportView}
                            onClick={e => { handleChange1s(e) }}
                            id="DetailedDrugReportView"
                          />
                          <Label className="form-check-label" for="DetailedDrugReportView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Document Management : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DocumentManagementView"
                            defaultChecked={ras.DocumentManagementView}
                            value={ras.DocumentManagementView}
                            onClick={e => { handleChange1s(e) }}
                            id="DocumentManagementView"
                          />
                          <Label className="form-check-label" for="DocumentManagementView">View</Label>
                        </div>
                      </Col>
                    </Row>
                    {/* <h5 className="mt-3 mb-3">Reports Access:</h5> */}
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Complete Attendance Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CompleteAttendanceReportView"
                            defaultChecked={ras.CompleteAttendanceReportView}
                            value={ras.CompleteAttendanceReportView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="CompleteAttendanceReportView"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="CompleteAttendanceReportView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Detail Attendance Report : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DetailAttendanceReportView"
                            defaultChecked={ras.DetailAttendanceReportView}
                            value={ras.DetailAttendanceReportView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Case Treated Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="CaseTreatedReportView"
                            defaultChecked={ras.CaseTreatedReportView}
                            value={ras.CaseTreatedReportView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="CaseTreatedReportView"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="CaseTreatedReportView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Artificial Insemination Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="ArtificialInseminationReportView"
                            defaultChecked={ras.ArtificialInseminationReportView}
                            value={ras.ArtificialInseminationReportView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="ArtificialInseminationReportView"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="ArtificialInseminationReportView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Fodder Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="FodderReportView"
                            defaultChecked={ras.FodderReportView}
                            value={ras.FodderReportView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="FodderReportView"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="FodderReportView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Farmers Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="FarmersReportView"
                            defaultChecked={ras.FarmersReportView}
                            value={ras.FarmersReportView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="FarmersReportView"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="FarmersReportView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Farmers Abstract Report : </p>
                      </Col>
                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="FarmersAbstractReportView"
                            defaultChecked={ras.FarmersAbstractReportView}
                            value={ras.FarmersAbstractReportView}
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            id="FarmersAbstractReportView"
                          />
                          <Label
                            onClick={e => {
                              handleChange1s(e)
                            }}
                            className="form-check-label"
                            for="FarmersAbstractReportView"
                          >
                            View
                          </Label>
                        </div>
                      </Col>
                    </Row>

                    <h5 className="mt-3 mb-3">Settings:</h5>
                    <Row className=" mt-3">
                      <Col md={2}>
                        <p className="">Settings : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SettingsView"
                            defaultChecked={ras.SettingsView}
                            value={ras.SettingsView}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">District : </p>
                      </Col>

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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Mandal : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="MandalView"
                            defaultChecked={ras.MandalView}
                            value={ras.MandalView}
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
                            name="MandalAdd"
                            defaultChecked={ras.MandalAdd}
                            value={ras.MandalAdd}
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
                            name="MandalEdit"
                            defaultChecked={ras.MandalEdit}
                            value={ras.MandalEdit}
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
                            name="MandalDelete"
                            defaultChecked={ras.MandalDelete}
                            value={ras.MandalDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Village / Town : </p>
                      </Col>

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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Type Of Institution : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="TypeOfInstitutionView"
                            defaultChecked={ras.TypeOfInstitutionView}
                            value={ras.TypeOfInstitutionView}
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
                            name="TypeOfInstitutionAdd"
                            defaultChecked={ras.TypeOfInstitutionAdd}
                            value={ras.TypeOfInstitutionAdd}
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
                            name="TypeOfInstitutionEdit"
                            defaultChecked={ras.TypeOfInstitutionEdit}
                            value={ras.TypeOfInstitutionEdit}
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
                            name="TypeOfInstitutionDelete"
                            defaultChecked={ras.TypeOfInstitutionDelete}
                            value={ras.TypeOfInstitutionDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Place Of Working : </p>
                      </Col>

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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Designation : </p>
                      </Col>

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
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Type Of Posting : </p>
                      </Col>

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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Diagnostic : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DiagnosticView"
                            defaultChecked={ras.DiagnosticView}
                            value={ras.DiagnosticView}
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
                            name="DiagnosticAdd"
                            defaultChecked={ras.DiagnosticAdd}
                            value={ras.DiagnosticAdd}
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
                            name="DiagnosticEdit"
                            defaultChecked={ras.DiagnosticEdit}
                            value={ras.DiagnosticEdit}
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
                            name="DiagnosticDelete"
                            defaultChecked={ras.DiagnosticDelete}
                            value={ras.DiagnosticDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">AnimalTypes : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="AnimalTypesView"
                            defaultChecked={ras.AnimalTypesView}
                            value={ras.AnimalTypesView}
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
                            name="AnimalTypesAdd"
                            defaultChecked={ras.AnimalTypesAdd}
                            value={ras.AnimalTypesAdd}
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
                            name="AnimalTypesEdit"
                            defaultChecked={ras.AnimalTypesEdit}
                            value={ras.AnimalTypesEdit}
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
                            name="AnimalTypesDelete"
                            defaultChecked={ras.AnimalTypesDelete}
                            value={ras.AnimalTypesDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Breeds : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="BreedsView"
                            defaultChecked={ras.BreedsView}
                            value={ras.BreedsView}
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
                            name="BreedsAdd"
                            defaultChecked={ras.BreedsAdd}
                            value={ras.BreedsAdd}
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
                            name="BreedsEdit"
                            defaultChecked={ras.BreedsEdit}
                            value={ras.BreedsEdit}
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
                            name="BreedsDelete"
                            defaultChecked={ras.BreedsDelete}
                            value={ras.BreedsDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Vaccination Type : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="VaccinationTypeView"
                            defaultChecked={ras.VaccinationTypeView}
                            value={ras.VaccinationTypeView}
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
                            name="VaccinationTypeAdd"
                            defaultChecked={ras.VaccinationTypeAdd}
                            value={ras.VaccinationTypeAdd}
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
                            name="VaccinationTypeEdit"
                            defaultChecked={ras.VaccinationTypeEdit}
                            value={ras.VaccinationTypeEdit}
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
                            name="VaccinationTypeDelete"
                            defaultChecked={ras.VaccinationTypeDelete}
                            value={ras.VaccinationTypeDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Items : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="ItemsView"
                            defaultChecked={ras.ItemsView}
                            value={ras.ItemsView}
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
                            name="ItemsAdd"
                            defaultChecked={ras.ItemsAdd}
                            value={ras.ItemsAdd}
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
                            name="ItemsEdit"
                            defaultChecked={ras.ItemsEdit}
                            value={ras.ItemsEdit}
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
                            name="ItemsDelete"
                            defaultChecked={ras.ItemsDelete}
                            value={ras.ItemsDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Surgical Types : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SurgicalTypesView"
                            defaultChecked={ras.SurgicalTypesView}
                            value={ras.SurgicalTypesView}
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
                            name="SurgicalTypesAdd"
                            defaultChecked={ras.SurgicalTypesAdd}
                            value={ras.SurgicalTypesAdd}
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
                            name="SurgicalTypesEdit"
                            defaultChecked={ras.SurgicalTypesEdit}
                            value={ras.SurgicalTypesEdit}
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
                            name="SurgicalTypesDelete"
                            defaultChecked={ras.SurgicalTypesDelete}
                            value={ras.SurgicalTypesDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Surgicals : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SurgicalsView"
                            defaultChecked={ras.SurgicalsView}
                            value={ras.SurgicalsView}
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
                            name="SurgicalsAdd"
                            defaultChecked={ras.SurgicalsAdd}
                            value={ras.SurgicalsAdd}
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
                            name="SurgicalsEdit"
                            defaultChecked={ras.SurgicalsEdit}
                            value={ras.SurgicalsEdit}
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
                            name="SurgicalsDelete"
                            defaultChecked={ras.SurgicalsDelete}
                            value={ras.SurgicalsDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Qualifications : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="QualificationsView"
                            defaultChecked={ras.QualificationsView}
                            value={ras.QualificationsView}
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
                            name="QualificationsAdd"
                            defaultChecked={ras.QualificationsAdd}
                            value={ras.QualificationsAdd}
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
                            name="QualificationsEdit"
                            defaultChecked={ras.QualificationsEdit}
                            value={ras.QualificationsEdit}
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
                            name="QualificationsDelete"
                            defaultChecked={ras.QualificationsDelete}
                            value={ras.QualificationsDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Specialization : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SpecializationView"
                            defaultChecked={ras.SpecializationView}
                            value={ras.SpecializationView}
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
                            name="SpecializationAdd"
                            defaultChecked={ras.SpecializationAdd}
                            value={ras.SpecializationAdd}
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
                            name="SpecializationEdit"
                            defaultChecked={ras.SpecializationEdit}
                            value={ras.SpecializationEdit}
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
                            name="SpecializationDelete"
                            defaultChecked={ras.SpecializationDelete}
                            value={ras.SpecializationDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Grampanchayath : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="GrampanchayathView"
                            defaultChecked={ras.GrampanchayathView}
                            value={ras.GrampanchayathView}
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
                            name="GrampanchayathAdd"
                            defaultChecked={ras.GrampanchayathAdd}
                            value={ras.GrampanchayathAdd}
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
                            name="GrampanchayathEdit"
                            defaultChecked={ras.GrampanchayathEdit}
                            value={ras.GrampanchayathEdit}
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
                            name="GrampanchayathDelete"
                            defaultChecked={ras.GrampanchayathDelete}
                            value={ras.GrampanchayathDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Allocation Form : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="AllocationFormView"
                            defaultChecked={ras.AllocationFormView}
                            value={ras.AllocationFormView}
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
                            name="AllocationFormAdd"
                            defaultChecked={ras.AllocationFormAdd}
                            value={ras.AllocationFormAdd}
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
                            name="AllocationFormEdit"
                            defaultChecked={ras.AllocationFormEdit}
                            value={ras.AllocationFormEdit}
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
                            name="AllocationFormDelete"
                            defaultChecked={ras.AllocationFormDelete}
                            value={ras.AllocationFormDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Drug : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="DrugView"
                            defaultChecked={ras.DrugView}
                            value={ras.DrugView}
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
                            name="DrugAdd"
                            defaultChecked={ras.DrugAdd}
                            value={ras.DrugAdd}
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
                            name="DrugEdit"
                            defaultChecked={ras.DrugEdit}
                            value={ras.DrugEdit}
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
                            name="DrugDelete"
                            defaultChecked={ras.DrugDelete}
                            value={ras.DrugDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Financial Year : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="FinancialYearView"
                            defaultChecked={ras.FinancialYearView}
                            value={ras.FinancialYearView}
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
                            name="FinancialYearAdd"
                            defaultChecked={ras.FinancialYearAdd}
                            value={ras.FinancialYearAdd}
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
                            name="FinancialYearEdit"
                            defaultChecked={ras.FinancialYearEdit}
                            value={ras.FinancialYearEdit}
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
                            name="FinancialYearDelete"
                            defaultChecked={ras.FinancialYearDelete}
                            value={ras.FinancialYearDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Scheme : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="SchemeView"
                            defaultChecked={ras.SchemeView}
                            value={ras.SchemeView}
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
                            name="SchemeAdd"
                            defaultChecked={ras.SchemeAdd}
                            value={ras.SchemeAdd}
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
                            name="SchemeEdit"
                            defaultChecked={ras.SchemeEdit}
                            value={ras.SchemeEdit}
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
                            name="SchemeDelete"
                            defaultChecked={ras.SchemeDelete}
                            value={ras.SchemeDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Quarter : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="QuarterView"
                            defaultChecked={ras.QuarterView}
                            value={ras.QuarterView}
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
                            name="QuarterAdd"
                            defaultChecked={ras.QuarterAdd}
                            value={ras.QuarterAdd}
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
                            name="QuarterEdit"
                            defaultChecked={ras.QuarterEdit}
                            value={ras.QuarterEdit}
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
                            name="QuarterDelete"
                            defaultChecked={ras.QuarterDelete}
                            value={ras.QuarterDelete}
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
                    </Row>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Percentage Allocation : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PercentageAllocationView"
                            defaultChecked={ras.PercentageAllocationView}
                            value={ras.PercentageAllocationView}
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
                            name="PercentageAllocationAdd"
                            defaultChecked={ras.PercentageAllocationAdd}
                            value={ras.PercentageAllocationAdd}
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
                            name="PercentageAllocationEdit"
                            defaultChecked={ras.PercentageAllocationEdit}
                            value={ras.PercentageAllocationEdit}
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
                            name="PercentageAllocationDelete"
                            defaultChecked={ras.PercentageAllocationDelete}
                            value={ras.PercentageAllocationDelete}
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
                    </Row>

                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Policies : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="PoliciesView"
                            defaultChecked={ras.PoliciesView}
                            value={ras.PoliciesView}
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
                            name="PoliciesAdd"
                            defaultChecked={ras.PoliciesAdd}
                            value={ras.PoliciesAdd}
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
                            name="PoliciesEdit"
                            defaultChecked={ras.PoliciesEdit}
                            value={ras.PoliciesEdit}
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
                            name="PoliciesDelete"
                            defaultChecked={ras.PoliciesDelete}
                            value={ras.PoliciesDelete}
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
                    </Row>
                    <h5 className="mt-3 mb-3">Data Access :</h5>
                    <Row className="mt-2">
                      <Col md={2}>
                        <p className="">Data Access : </p>
                      </Col>

                      <Col md={2}>
                        <div className="form-check me-3 me-lg-5">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            name="accessAll"
                            defaultChecked={ras1.accessAll}
                            value={ras1.accessAll}
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
                            for="accessAll"
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

export default EditDesignation
