import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import { withTranslation } from "react-i18next"
import { connect } from "react-redux"

const Navbar = props => {
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
      parent.classList.add("active")
      const parent2 = parent.parentElement
      parent2.classList.add("active")
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active")
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active")
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active")
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active")
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
                {Roles?.Dashboardview === true || Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link className="nav-link arrow-none" to="/dashboard">
                        <i className="fas fa-home me-2"></i>
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
                        className="nav-link arrow-none"
                        to={
                          Roles?.EmployeeRegistationAdd === true ||
                            Roles?.accessAll === true
                            ? "/add-employee-registation"
                            : "/employee-registation"
                        }
                      >
                        <i className="fas fa-user-clock me-2"></i>
                        {props.t("Employee Details")} {props.menuOpen}
                      </Link>
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
                        to={
                          Roles?.accessAll
                            ? "/case-treated"
                            : Roles?.CaseTreatedView
                              ? "/case-treated"
                              : Roles?.DewormingView
                                ? "/deworming"
                                : Roles?.CastrationView
                                  ? "/castration"
                                  : Roles?.VaccinationView
                                    ? "/vaccination"
                                    : Roles?.OperationView
                                      ? "/operation"
                                      : "/dashboard"
                        }
                        className="nav-link arrow-none"
                      >
                        <i className="fas fa-hospital-alt me-2"></i>
                        {props.t("Daily Progress")}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {Roles?.FodderView === true || Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link to="/fodder" className="nav-link arrow-none">
                        <i className="fas fa-seedling me-2"></i>
                        {props.t("Fodder")} {props.menuOpen}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {/* {Roles?.GoatDewormingsView === true ||
                  Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        to="/sheep-goat-deworming"
                        className="nav-link arrow-none"
                      >
                        <i className="fas fa-paw me-2"></i>
                        {props.t("S & G")}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )} */}

                {Roles?.AIsView === true || Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        to="/artifical-insemination"
                        className="nav-link arrow-none"
                      >
                        <i className="fas fa-dna me-2"></i>
                        {props.t("AI")}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {Roles?.DrugIndentsView === true ||
                  Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link to="/drugIndent" className="nav-link arrow-none">
                        <i className="fas fa-pills me-2"></i>
                        {props.t("Drug Indent")}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {/* Reports Nav Item */}
                {Roles?.ReportsView === true ||
                  Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link to="/reports" className="nav-link arrow-none">
                        <i className="fas fa-chart-bar me-2"></i>
                        {props.t("Reports")}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )}

                {/* {Roles?.MprSurgicalsView === true ||
                  Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link arrow-none"
                        to={
                          Roles?.MprSurgicalAdd === true ||
                            Roles?.accessAll === true
                            ? "/add-Mpr-operation"
                            : "/mpr-operation"
                        }
                      >
                        <i className="fas fa-file-medical-alt me-2"></i>
                        {props.t("Progress  Report")} {props.menuOpen}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )} */}

                {/* {Roles?.VeterinaryInspectionsView === true ||
                  Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link arrow-none"
                        to={
                          Roles?.VaccinationAdd === true ||
                            Roles?.accessAll === true
                            ? "/add-veterinary-inspection"
                            : "/veterinary-inspection"
                        }
                      >
                        <i className="fas fa-stethoscope me-2"></i>
                        {props.t("Inspection")} {props.menuOpen}
                      </Link>
                    </li>
                  </>
                ) : (
                  ""
                )} */}

                {Roles?.SettingsView === true || Roles?.accessAll === true ? (
                  <>
                    <li className="nav-item dropdown">
                      <Link to="/settings" className="nav-link arrow-none">
                        <i className="fas fa-cog me-2"></i>
                        {props.t("Settings")}
                      </Link>
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
