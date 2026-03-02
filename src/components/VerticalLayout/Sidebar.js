import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"
import { Link } from "react-router-dom"
import logo from "../../assets/images/loho.png"

const Sidebar = props => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logo} alt="" width="40px" />
            </span>
            <span className="logo-lg">
              <img src={logo} alt="" height="60px" />
            </span>
          </Link>
          <Link to="/dashboard" className="logo logo-light">
            <span className="logo-sm">
              <img src={logo} alt="" width="40px" />
            </span>
            <span className="logo-lg">
              <img src={logo} height="60px" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)))
