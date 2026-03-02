import React from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"
import Items from "./Items"

const Settings = () => {
  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission?.[0] ?? { accessAll: true }

  const menuItems = [
    {
      title: "District",
      path: "/district",
      icon: "bx bx-map-alt",
      permission: Roles?.DistrictView === true || Roles?.accessAll === true,
    },
    {
      title: "Mandal",
      path: "/mandal",
      icon: "bx bx-map",
      permission: Roles?.MandalView === true || Roles?.accessAll === true,
    },
    {
      title: "Village/Town",
      path: "/village-town",
      icon: "bx bx-buildings",
      permission: Roles?.TownView === true || Roles?.accessAll === true,
    },
    {
      title: "Type of Institution",
      path: "/employment-type",
      icon: "bx bx-buildings",
      permission:
        Roles?.TypeOfInstitutionView === true || Roles?.accessAll === true,
    },
    {
      title: "Place OF Working",
      path: "/place-of-working",
      icon: "bx bx-briefcase",
      permission:
        Roles?.PlaceOfWorkingView === true || Roles?.accessAll === true,
    },
    {
      title: "Designation",
      path: "/designation",
      icon: "bx bx-id-card",
      permission: Roles?.DesignationView === true || Roles?.accessAll === true,
    },
    {
      title: "Type of Posting",
      path: "/type-of-posting",
      icon: "bx bx-transfer",
      permission:
        Roles?.TypeOfPostingView === true || Roles?.accessAll === true,
    },
    {
      title: "Diagnostics",
      path: "/diagnostics",
      icon: "bx bx-test-tube",
      permission: Roles?.DiagnosticView === true || Roles?.accessAll === true,
    },
    {
      title: "Animal Type",
      path: "/animal-types",
      icon: "bx bx-category",
      permission: Roles?.AnimalTypesView === true || Roles?.accessAll === true,
    },
    {
      title: "Breeds",
      path: "/breeds",
      icon: "bx bx-dna",
      permission: Roles?.BreedsView === true || Roles?.accessAll === true,
    },
    {
      title: "Vaccination Type",
      path: "/vaccination-type",
      icon: "bx bx-health",
      permission:
        Roles?.VaccinationTypeView === true || Roles?.accessAll === true,
    },
    {
      title: "Items",
      path: "/items",
      icon: "bx bx-package",
      permission: Roles?.ItemsView === true || Roles?.accessAll === true,
    },
    {
      title: "Surgical Type",
      path: "/operations-type",
      icon: "bx bx-cog",
      permission:
        Roles?.SurgicalTypesView === true || Roles?.accessAll === true,
    },
    {
      title: "Surgical",
      path: "/operations",
      icon: "bx bx-plus-medical",
      permission: Roles?.SurgicalsView === true || Roles?.accessAll === true,
    },
    {
      title: "Qualification",
      path: "/qualification",
      icon: "bx bx-book",
      permission:
        Roles?.QualificationsView === true || Roles?.accessAll === true,
    },
    {
      title: "Specialization",
      path: "/sub-qualification",
      icon: "bx bx-book-alt",
      permission:
        Roles?.SpecializationView === true || Roles?.accessAll === true,
    },
    {
      title: "Grampanchayath",
      path: "/grampanchayath",
      icon: "bx bx-home-alt",
      permission:
        Roles?.GrampanchayathView === true || Roles?.accessAll === true,
    },
    {
      title: "Allocation Form",
      path: "/allocation-form",
      icon: "bx bx-layer",
      permission:
        Roles?.AllocationFormView === true || Roles?.accessAll === true,
    },
    {
      title: "Drugs",
      path: "/drug",
      icon: "bx bx-capsule",
      permission: Roles?.DrugView === true || Roles?.accessAll === true,
    },
    {
      title: "Financial Year",
      path: "/financial-year",
      icon: "bx bx-rupee",
      permission:
        Roles?.FinancialYearView === true || Roles?.accessAll === true,
    },
    {
      title: "Scheme",
      path: "/scheme",
      icon: "bx bx-bar-chart-alt-2",
      permission: Roles?.SchemeView === true || Roles?.accessAll === true,
    },
    {
      title: "Quarter",
      path: "/quarter",
      icon: "bx bx-git-merge",
      permission: Roles?.QuarterView === true || Roles?.accessAll === true,
    },
    {
      title: "Budget / Percentage Allocation",
      path: "/percentage-allocation",
      icon: "bx bx-pie-chart-alt",
      permission:
        Roles?.PercentageAllocationView === true || Roles?.accessAll === true,
    },
    // {
    //   title: "Note",
    //   path: "/note",
    //   icon: "bx bxs-file-txt",
    //   permission: Roles?.SettingsView === true || Roles?.accessAll === true,
    // },
    {
      title: "Policies",
      path: "/terms",
      icon: "bx bx-file",
      permission: Roles?.PoliciesView === true || Roles?.accessAll === true,
    },
    {
      title: "Calender",
      path: "/calender",
      icon: "bx bxs-calendar",
      permission: Roles?.CalenderView === true || Roles?.accessAll === true,
    },
    {
      title: "Farmers",
      path: "/farmers",
      icon: "bx bx-user",
      permission: Roles?.FarmersView === true || Roles?.accessAll === true,
    },
    {
      title: "Sex Sorted Semen",
      path: "/sex-sorted-semen",
      icon: "bx bx-dna",
      permission: Roles?.SexSortedSemenView === true || Roles?.accessAll === true,
    },
    {
      title: "Leave Reasons",
      path: "/leave-reasons",
      icon: "bx bx-receipt",
      permission: Roles?.LeaveReasonsView === true || Roles?.accessAll === true,
    }
  ]


  const fodderItems = [
    {
      title: "Type of Seed",
      path: "/type-seeds",
      icon: "bx bx-spa",
      permission: Roles?.TypeOfSeedView === true || Roles?.accessAll === true,
    },
    {
      title: "Unit Size",
      path: "/unit-size",
      icon: "bx bx-ruler",
      permission: Roles?.UnitSizeView === true || Roles?.accessAll === true,
    },
    {
      title: "Fodder Items",
      path: "/fodder-items",
      icon: "bx bx-food-menu",
      permission: Roles?.FodderItemView === true || Roles?.accessAll === true,
    },
  ]

  const filteredItem = fodderItems.filter(items => items.permission)

  const filteredItems = menuItems.filter(item => item.permission)

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {filteredItems.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3 text-dark">Settings</h5>
              <Row>
                {filteredItems.map((item, index) => (
                  <Col xl="2" md="3" sm="4" xs="6" key={index} className="mb-3">
                    <Link to={item.path} className="text-decoration-none">
                      <Card className="settings-card h-100 text-center hover-shadow border-0">
                        <CardBody className="d-flex flex-column align-items-center justify-content-center p-2">
                          <div className="settings-icon mb-2">
                            <div className="icon-wrapper bg-soft-primary rounded-circle d-flex align-items-center justify-content-center">
                              <i
                                className={`${item.icon} display-6 text-primary`}
                              ></i>
                            </div>
                          </div>
                          <h6 className="settings-title mb-0 text-dark fw-semibold text-truncate w-100 small">
                            {item.title}
                          </h6>
                        </CardBody>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {filteredItem.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3 text-dark">Fodder</h5>
              <Row>
                {filteredItem.map((items, index) => (
                  <Col xl="2" md="3" sm="4" xs="6" key={index} className="mb-3">
                    <Link to={items.path} className="text-decoration-none">
                      <Card className="settings-card h-100 text-center hover-shadow border-0">
                        <CardBody className="d-flex flex-column align-items-center justify-content-center p-2">
                          <div className="settings-icon mb-2">
                            <div className="icon-wrapper bg-soft-primary rounded-circle d-flex align-items-center justify-content-center">
                              <i
                                className={`${items.icon} display-6 text-primary`}
                              ></i>
                            </div>
                          </div>
                          <h6 className="settings-title mb-0 text-dark fw-semibold text-truncate w-100 small">
                            {items.title}
                          </h6>
                        </CardBody>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          )}
          {filteredItems.length === 0 && (
            <div className="text-center py-5">
              <div className="icon-wrapper bg-soft-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                <i className="bx bx-lock-alt display-4 text-danger"></i>
              </div>
              <h5 className="text-muted mb-2">No Access Available</h5>
              <p className="text-muted mb-0">
                You don't have permission to access any settings at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Settings
