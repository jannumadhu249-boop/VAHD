import PropTypes from "prop-types"
import { Collapse } from "reactstrap"
import { connect } from "react-redux"
import React, { useEffect } from "react"
import { withTranslation } from "react-i18next"
import { Link, withRouter, useLocation } from "react-router-dom"

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

  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = [
    {
      title: "Settings",
      path: "/settings",
    },
    {
      title: "District",
      path: "/district",
    },
    {
      title: "Mandal",
      path: "/mandal",
    },
    {
      title: "Village/Town",
      path: "/village-town",
    },
    {
      title: "Place OF Working",
      path: "/place-of-working",
    },
    {
      title: "Place OF Working Map",
      path: "/place-of-working-map",
    },
    {
      title: "Designation",
      path: "/designation",
    },
    {
      title: "Type of Institution",
      path: "/employment-type",
    },
    {
      title: "Type of Posting",
      path: "/type-of-posting",
      icon: "bx bx-transfer-alt",
    },
    {
      title: "Diagnostics",
      path: "/diagnostics",
    },
    {
      title: "Animal Type",
      path: "/animal-types",
    },
    {
      title: "Breeds",
      path: "/breeds",
    },
    {
      title: "Vaccination Type",
      path: "/vaccination-type",
    },
    {
      title: "Items",
      path: "/items",
    },
    {
      title: "Operation Type",
      path: "/operations-type",
    },
    {
      title: "Operations",
      path: "/operations",
    },
    {
      title: "Qualification",
      path: "/qualification",
      icon: "bx bx-graduation",
    },
    {
      title: "Specialization",
      path: "/sub-qualification",
    },
    {
      title: "Grampanchayath",
      path: "/grampanchayath",
    },
    {
      title: "Percentage Allocation",
      path: "/percentage-allocation",
    },
    {
      title: "Drug Form",
      path: "/drug",
    },
    {
      title: "Allocation Form",
      path: "/allocation-form",
    },
    {
      title: "Note",
      path: "/note",
    },
    {
      title: "Orders Issued",
      path: "/orders-issued",
    },
    {
      title: "Financial Year",
      path: "/financial-year",
    },
    {
      title: "Scheme",
      path: "/scheme",
    },
    {
      title: "Quarter",
      path: "/quarter",
    },
    {
      title: "Terms",
      path: "/terms",
    },
    {
      title: "Add Designation",
      path: "/add-designation",
    },
    {
      title: "Edit Designation",
      path: "/edit-designation",
    },
    {
      title: "Edit Designation",
      path: "/edit-designation",
    },
    {
      title: "Profile",
      path: "/profile",
    },
  ]

  const menuItems1 = [
    {
      title: "Groups",
      path: "/groups",
    },
    {
      title: "Group Reports",
      path: "/groups-report",
    },
    {
      title: "Drug Indent",
      path: "/drugIndent",
    },
    {
      title: "All Groups",
      path: "/allgroups",
    },
    {
      title: "All Drugs Reports",
      path: "/drugs-report",
    },
    {
      title: "Place of Working Reports",
      path: "/placeofworking-report",
    },
    {
      title: "Inventory Management",
      path: "/inventory-management",
    },
    {
      title: "Drug Wise Report",
      path: "/drug-wise-report",
    },
    {
      title: "Abstract Report",
      path: "/abstract-report",
    },
  ]

  return (
    <React.Fragment>
      <div className="topnav1" id="Mnav">
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
                {currentPath === "/dashboard" && (
                  <>
                    {Roles?.Dashboardview === true ||
                      Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link className="nav-link arrow-none" to="/dashboard">
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("Dashboard")}
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                )}

                {(currentPath === "/add-employee-registation" ||
                  currentPath === "/employee-registation" ||
                  currentPath === "/edit-employee-registation" ||
                  currentPath === "/employee-attendance-report" ||
                  currentPath === "/edit-employee-registations" ||
                  currentPath === "/leave-report") && (
                    <>
                      {Roles?.EmployeeRegistationAdd === true ||
                        Roles?.accessAll === true ? (
                        <li className="nav-item dropdown">
                          <Link
                            className="nav-link arrow-none"
                            to="/add-employee-registation"
                          >
                            <i className="bx bx-caret-right me-2"></i>
                            {props.t("Employee Registration")}
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}

                      {Roles?.EmployeeRegistationView === true ||
                        Roles?.accessAll === true ? (
                        <li className="nav-item dropdown">
                          <Link
                            className="nav-link arrow-none"
                            to="/employee-registation"
                          >
                            <i className="bx bx-caret-right me-2"></i>
                            {props.t("Employee Details")}
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}

                      {Roles?.AttendanceReportView === true ||
                        Roles?.accessAll === true ? (
                        <li className="nav-item dropdown">
                          <Link
                            className="nav-link arrow-none"
                            to="/employee-attendance-report"
                          >
                            <i className="bx bx-caret-right me-2"></i>
                            {props.t("Employee Attendance Report")}
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}


                      {Roles?.LeavesManagement === true ||
                        Roles?.accessAll === true ? (
                        <li className="nav-item dropdown">
                          <Link
                            className="nav-link arrow-none"
                            to="/leave-report"
                          >
                            <i className="bx bx-caret-right me-2"></i>
                            {props.t("Employee Leave Form")}
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}
                    </>
                  )}

                {(currentPath === "/case-treated" ||
                  currentPath === "/deworming" ||
                  currentPath === "/castration" ||
                  currentPath === "/vaccination" ||
                  currentPath === "/operation") && (
                    <>
                      {Roles?.PatientRegistrationView === true ||
                        Roles?.accessAll === true ? (
                        <>
                          {Roles?.CaseTreatedView === true ||
                            Roles?.accessAll === true ? (
                            <li className="nav-item dropdown">
                              <Link
                                to="/case-treated"
                                className="nav-link arrow-none"
                              >
                                <i className="bx bx-caret-right me-2"></i>
                                {props.t("Case Treated")}
                              </Link>
                            </li>
                          ) : (
                            ""
                          )}
                          {/* {Roles?.DewormingView === true ||
                        Roles?.accessAll === true ? (
                          <li className="nav-item dropdown">
                            <Link
                              to="/deworming"
                              className="nav-link arrow-none"
                            >
                              <i className="bx bx-caret-right me-2"></i>
                              {props.t("Deworming")}
                            </Link>
                          </li>
                        ) : (
                          ""
                        )}
                        {Roles?.CastrationView === true ||
                        Roles?.accessAll === true ? (
                          <li className="nav-item dropdown">
                            <Link
                              to="/castration"
                              className="nav-link arrow-none"
                            >
                              <i className="bx bx-caret-right me-2"></i>
                              {props.t("Castration")}
                            </Link>
                          </li>
                        ) : (
                          ""
                        )}
                        {Roles?.VaccinationView === true ||
                        Roles?.accessAll === true ? (
                          <li className="nav-item dropdown">
                            <Link
                              to="/vaccination"
                              className="nav-link arrow-none"
                            >
                              <i className="bx bx-caret-right me-2"></i>
                              {props.t("Vaccination")}
                            </Link>
                          </li>
                        ) : (
                          ""
                        )}
                        {Roles?.SurgicalView === true ||
                        Roles?.accessAll === true ? (
                          <li className="nav-item dropdown">
                            <Link
                              to="/operation"
                              className="nav-link arrow-none"
                            >
                              <i className="bx bx-caret-right me-2"></i>
                              {props.t("Surgical")}
                            </Link>
                          </li>
                        ) : (
                          ""
                        )} */}
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}

                {(currentPath === "/fodder" ||
                 currentPath === "/fodder-distribution" ||
                currentPath === "/fodder-distribution-state")
                 && (
                  <>
                    {Roles?.FodderView === true || Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link className="nav-link arrow-none" to="/fodder">
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("Fodder")}
                        </Link>
                      </li>
                      
                    ) : (
                      ""
                    )}

                    {Roles?.FodderDistributionStateView === true || Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link className="nav-link arrow-none" to="/fodder-distribution-state">
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("Fodder Distribution State")}
                        </Link>
                      </li>
                      
                    ) : (
                      ""
                    )}
                    
                    {Roles?.FodderDistributionDistrictView === true || Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link className="nav-link arrow-none" to="/fodder-distribution">
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("Fodder Distribution District")}
                        </Link>
                      </li>
                      
                    ) : (
                      ""
                    )}
                  </>
                )}

                {/* {currentPath === "/sheep-goat-deworming" && (
                  <>
                    {Roles?.GoatDewormingsView === true ||
                    Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link arrow-none"
                          to="/sheep-goat-deworming"
                        >
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("S & G Deworming ")}
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                )} */}

                {currentPath === "/artifical-insemination" && (
                  <>
                    {Roles?.AIsView === true || Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link arrow-none"
                          to="/artifical-insemination"
                        >
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("AI")}
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                )}

                {menuItems1.some(item => item.path === currentPath) && (
                  <>
                    {Roles?.DrugIndentView === true ||
                      Roles?.accessAll === true ? (
                      <>
                        <li className="nav-item dropdown">
                          <Link
                            className="nav-link arrow-none"
                            to="/drugIndent"
                          >
                            <i className="bx bx-caret-right me-2"></i>
                            {props.t("Drug Indent")}
                          </Link>
                        </li>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}

                {/* {(currentPath === "/add-Mpr-operation" ||
                  currentPath === "/mpr-operation") && (
                  <>
                    {Roles?.MprSurgicalAdd === true ||
                    Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link arrow-none"
                          to="/add-Mpr-operation"
                        >
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("Add Progress Report")}
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}

                    {Roles?.MprSurgicalView === true ||
                    Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link arrow-none"
                          to="/mpr-operation"
                        >
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("Progress  Report")}
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                )} */}

                {(currentPath === "/add-veterinary-inspection" ||
                  currentPath === "/veterinary-inspection") && (
                    <>
                      {Roles?.VeterinaryInspectionAdd === true ||
                        Roles?.accessAll === true ? (
                        <li className="nav-item dropdown">
                          <Link
                            to="/add-veterinary-inspection"
                            className="nav-link arrow-none"
                          >
                            <i className="bx bx-caret-right me-2"></i>
                            {props.t("Add Inspection")}
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}

                      {Roles?.VeterinaryInspectionView === true ||
                        Roles?.accessAll === true ? (
                        <li className="nav-item dropdown">
                          <Link
                            to="/veterinary-inspection"
                            className="nav-link arrow-none"
                          >
                            <i className="bx bx-caret-right me-2"></i>
                            {props.t("Inspection")}
                          </Link>
                        </li>
                      ) : (
                        ""
                      )}
                    </>
                  )}

                {menuItems.some(item => item.path === currentPath) && (
                  <>
                    {Roles?.SettingsView === true ||
                      Roles?.accessAll === true ? (
                      <li className="nav-item dropdown">
                        <Link className="nav-link arrow-none" to="/settings">
                          <i className="bx bx-caret-right me-2"></i>
                          {props.t("Settings")}
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
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
