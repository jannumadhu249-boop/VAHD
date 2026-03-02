import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Row, Col, Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import classname from "classnames"
import { withTranslation } from "react-i18next"
import { connect } from "react-redux"

const Navbar = props => {
  const [dashboard, setdashboard] = useState(false)
  const [ui, setui] = useState(false)
  const [app, setapp] = useState(false)
  const [email, setemail] = useState(false)
  const [ecommerce, setecommerce] = useState(false)

  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }

  var gets = localStorage.getItem("authUser")
  var data = JSON.parse(gets)
  var Roles = data?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {Roles?.Dashview === true || Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link className="nav-link arrow-none" to="/dashboard">
                        <i className="bx bx-home-circle me-2"></i>
                        {props.t("Dashboard")} {props.menuOpen}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {Roles?.EmployeeRegistationsView === true ||
                Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setemail(!email)
                        }}
                        to="#"
                      >
                        <i className="fas fa-user-tie me-2"></i>
                        {props.t("Employee Attendance")} {props.menuOpen}
                        <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: email })}
                      >
                        {Roles?.EmployeeRegistationAdd === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link
                              to="/add-employee-registation"
                              className="dropdown-item"
                            >
                              {props.t("Add Employee Registation")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.EmployeeRegistationView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link
                              to="/employee-registation"
                              className="dropdown-item"
                            >
                              {props.t("Employee Registation")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.EmployeeRegistationView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link
                              to="/employee-attendance-report"
                              className="dropdown-item"
                            >
                              {props.t("Employee Attendance Report")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {Roles?.MprOperationsView === true ||
                Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setdashboard(!dashboard)
                        }}
                        to="#"
                      >
                        <i className="fas fa-chart-bar me-2"></i>
                        {props.t(" Progress  Report")} {props.menuOpen}
                        <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: dashboard,
                        })}
                      >
                        {Roles?.MprOperationAdd === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link
                              to="/add-Mpr-operation"
                              className="dropdown-item"
                            >
                              {props.t("Add Progress  Report ")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.MprOperationAdd === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/mpr-operation" className="dropdown-item">
                              {props.t(" Progress  Report")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {Roles?.PatientRegistrationView === true ||
                Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        to="/#"
                        onClick={e => {
                          e.preventDefault()
                          setui(!ui)
                        }}
                        className="nav-link dropdown-toggle arrow-none"
                      >
                        <i className="fas fa-procedures me-2"></i>
                        {props.t("Patient Registration")}
                        <div className="arrow-down"></div>
                      </Link>
                      <div className={classname("dropdown-menu", { show: ui })}>
                        {Roles?.CaseTreatedView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/case-treated" className="dropdown-item">
                              {props.t("Case Treated")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.DewormingView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/deworming" className="dropdown-item">
                              {props.t("Deworming")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.CastrationView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/castration" className="dropdown-item">
                              {props.t("Castration")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.VaccinationView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/vaccination" className="dropdown-item">
                              {props.t("Vaccination")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.OperationView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/operation" className="dropdown-item">
                              {props.t("Operation")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.GoatDewormingView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link
                              to="/sheep-goat-deworming"
                              className="dropdown-item"
                            >
                              {props.t("Sheep & Goat Deworming")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.FodderView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/fodder" className="dropdown-item">
                              {props.t("Fodder")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                      {Roles?.FodderDistributionView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link to="/fodder-distribution" className="dropdown-item">
                              {props.t("Fodder Distribution District")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  </>
                ) : (
                  ""
                )}
                {Roles?.VeterinaryInspectionsView === true ||
                Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault()
                          setapp(!app)
                        }}
                        to="#"
                      >
                        <i className="fas fa-chart-bar me-2"></i>
                        {props.t("Inspection")} {props.menuOpen}
                        <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: app })}
                      >
                        {Roles?.VeterinaryInspectionAdd === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link
                              to="/add-veterinary-inspection"
                              className="dropdown-item"
                            >
                              {props.t("Add Inspection")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                        {Roles?.VeterinaryInspectionView === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Link
                              to="/veterinary-inspection"
                              className="dropdown-item"
                            >
                              {props.t("Inspection")}
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {Roles?.SettingsView === true || Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        to="/#"
                        onClick={e => {
                          e.preventDefault()
                          setecommerce(!ecommerce)
                        }}
                        className="nav-link dropdown-toggle arrow-none"
                      >
                        <i className="fas fa-cog me-2"></i>
                        {props.t("Settings")} <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname(
                          "dropdown-menu mega-dropdown-menu dropdown-menu-left dropdown-mega-menu-lg",
                          { show: ecommerce }
                        )}
                      >
                        <Row>
                          <Col lg={6}>
                            <div>
                              {Roles?.DistrictView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/district"
                                    className="dropdown-item"
                                  >
                                    {props.t("District")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.MandalView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link to="/mandal" className="dropdown-item">
                                    {props.t("Mandal")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.TownView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/village-town"
                                    className="dropdown-item"
                                  >
                                    {props.t("Village/Town")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.PlaceOfWorkingView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/place-of-working"
                                    className="dropdown-item"
                                  >
                                    {props.t("Place OF Working")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.DesignationView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/designation"
                                    className="dropdown-item"
                                  >
                                    {props.t("Designation")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.EmployeeTypeView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/employment-type"
                                    className="dropdown-item"
                                  >
                                    {props.t("Type of Insitution")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.TypeOfPostingView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/type-of-posting"
                                    className="dropdown-item"
                                  >
                                    {props.t("Type of Posting")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.DiagnosticView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/diagnostics"
                                    className="dropdown-item"
                                  >
                                    {props.t("Diagnostics")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.AnimalTypesView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/animal-types"
                                    className="dropdown-item"
                                  >
                                    {props.t("Animal Type")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              {Roles?.BreedsView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link to="/breeds" className="dropdown-item">
                                    {props.t("Breedes")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.VaccinationTypeView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/vaccination-type"
                                    className="dropdown-item"
                                  >
                                    {props.t("Vaccination Type")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.ItemsView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link to="/items" className="dropdown-item">
                                    {props.t("Items")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.OperationTypesView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/operations-type"
                                    className="dropdown-item"
                                  >
                                    {props.t("Operation Type")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.OperationsView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/operations"
                                    className="dropdown-item"
                                  >
                                    {props.t("Operations")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.QualificationsView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/qualification"
                                    className="dropdown-item"
                                  >
                                    {props.t("Qualification")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.SpecializationView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/sub-qualification"
                                    className="dropdown-item"
                                  >
                                    {props.t("Specialization")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                              {Roles?.GrampanchayathView === true ||
                              Roles?.accessAll === true ? (
                                <>
                                  <Link
                                    to="/grampanchayath"
                                    className="dropdown-item"
                                  >
                                    {props.t("Grampanchayath")}
                                  </Link>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </li>
                  </>
                ) : (
                  ""
                )}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)
