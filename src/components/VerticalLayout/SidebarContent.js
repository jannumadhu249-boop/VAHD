import PropTypes from "prop-types"
import React, { useEffect, useRef } from "react"
import SimpleBar from "simplebar-react"
import MetisMenu from "metismenujs"
import { withRouter } from "react-router-dom"
import { Link } from "react-router-dom"
import { withTranslation } from "react-i18next"

const SidebarContent = props => {
  const ref = useRef()
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname

    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname])

  useEffect(() => {
    ref.current.recalculate()
  })

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li>
              <Link to="/dashboard">
                <i className="fas fa-tachometer-alt"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
            </li>
            <li className="menu-title">{props.t("Employee Registation")} </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="fas fa-user-tie"></i>
                <span>{props.t("Employee Registation")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/add-employee-registation">
                    {props.t("Add Employee Registation")}
                  </Link>
                </li>
                <li>
                  <Link to="/employee-registation">
                    {props.t("Employee Registation")}
                  </Link>
                </li>
                <li>
                  <Link to="/employee-attendance-report">
                    {props.t("Employee Attendance Report")}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="menu-title">{props.t(" Progress  Report")} </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="fas fa-chart-bar"></i>
                <span>{props.t(" Progress  Report")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/add-Mpr-operation">
                    {props.t("Add Progress  Report ")}
                  </Link>
                </li>
                <li>
                  <Link to="/mpr-operation">{props.t(" Progress  Report")}</Link>
                </li>
                {/* <li>
                  <Link to="/mpr-report">
                    {props.t("Mpr Report")}
                  </Link>
                </li> */}
              </ul>
            </li>
            <li className="menu-title">{props.t("Patient Registration")} </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="fas fa-procedures"></i>
                <span>{props.t("Patient Registration")}</span>
              </Link>
              <ul className="sub-menu">
                {/* <li>
                  <Link to="/add-patient-registration">
                    {props.t("Add Patient Registration")}
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/add-patient-registration">
                    {props.t("Add Patient Registration")}
                  </Link>
                </li>
                <li>
                  <Link to="/patient-registration">
                    {props.t("Patient Registration")}
                  </Link>
                </li> */}
                <li>
                  <Link to="/case-treated">{props.t("Case Treated")}</Link>
                </li>
                <li>
                  <Link to="/deworming">{props.t("Deworming")}</Link>
                </li>
                <li>
                  <Link to="/castration">{props.t("Castration")}</Link>
                </li>
                <li>
                  <Link to="/vaccination">{props.t("Vaccination")}</Link>
                </li>
                <li>
                  <Link to="/operation">{props.t("Operation")}</Link>
                </li>
                <li>
                  <Link to="/sheep-goat-deworming">
                    {props.t("Sheep & Goat Deworming")}
                  </Link>
                </li>
                <li>
                  <Link to="/fodder">{props.t("Fodder")}</Link>
                </li>
              </ul>
            </li>
            <li className="menu-title">{props.t("Inspection")} </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="fas fa-stethoscope"></i>
                <span>{props.t("Inspection")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/add-veterinary-inspection">
                    {props.t("Add Inspection")}
                  </Link>
                </li>
                <li>
                  <Link to="/veterinary-inspection">
                    {props.t("Inspection")}
                  </Link>
                </li>
              </ul>
            </li>
            <li className="menu-title">{props.t("Settings")} </li>
            <li>
              <Link to="/#" className="has-arrow">
                <i className="fas fa-cog"></i>
                <span>{props.t("Settings")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/district">{props.t("District")}</Link>
                </li>
                <li>
                  <Link to="/mandal">{props.t("Mandal")}</Link>
                </li>
                <li>
                  <Link to="/village-town">{props.t("Village/Town")}</Link>
                </li>
                <li>
                  <Link to="/place-of-working">
                    {props.t("Place OF Working")}
                  </Link>
                </li>
                <li>
                  <Link to="/designation">{props.t("Designation")}</Link>
                </li>
                <li>
                  <Link to="/employment-type">
                    {props.t("Type of Insitution")}
                  </Link>
                </li>
                <li>
                  <Link to="/type-of-posting">
                    {props.t("Type of Posting")}
                  </Link>
                </li>
                <li>
                  <Link to="/diagnostics">
                    {props.t("Diagnostics")}
                  </Link>
                </li>
                <li>
                  <Link to="/animal-types">{props.t("Animal Type")}</Link>
                </li>
                <li>
                  <Link to="/breeds">{props.t("Breedes")}</Link>
                </li>
                <li>
                  <Link to="/vaccination-type">
                    {props.t("Vaccination Type")}
                  </Link>
                </li>
                 <li>
                  <Link to="/items">{props.t("Items")}</Link>
                </li>
                <li>
                  <Link to="/operations-type">{props.t("Operation Type")}</Link>
                </li>
                <li>
                  <Link to="/operations">{props.t("Operations")}</Link>
                </li>
                <li>
                  <Link to="/qualification">{props.t("Qualification")}</Link>
                </li>
                <li>
                  <Link to="/sub-qualification">
                    {props.t("Specialization")}
                  </Link>
                </li>
                <li>
                  <Link to="/grampanchayath">{props.t("Grampanchayath")}</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
