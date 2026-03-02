import React, { useState } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import logo from "../../assets/images/tg.png"
import logoDark from "../../assets/images/tg.png"
import logo1 from "../../assets/images/l2.png"
import logo2 from "../../assets/images/l3.jpeg"
import { withTranslation } from "react-i18next"

const Header = props => {
  return (
    <React.Fragment>
      <header id="page-topbar" className="pt-2">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="#" className="logo logo-dark">
                <span className="logo-sm">
                  <img
                    src={logo}
                    alt=""
                    width="60px"
                    style={{ paddingLeft: "30px" }}
                  />
                </span>
                <span className="logo-lg">
                  <img
                    src={logoDark}
                    alt=""
                    height="60px"
                    style={{ paddingLeft: "30px" }}
                  />
                </span>
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
            data-toggle="collapse"
            onClick={() => {
              props.toggleLeftmenu(!props.leftMenu)
            }}
            data-target="#topnav-menu-content"
          >
            <i className="fa fa-fw fa-bars" />
          </button>

          <a href="#" className="gov-link">
            <h4>
              <span className="gov-title">GOVERNMENT OF TELANGANA</span>
            </h4>
            <h3 className="dept-title">
              VETERINARY AND ANIMAL HUSBANDRY DEPARTMENT
            </h3>
          </a>

          <div className="d-flex">
            <span className="logo-lg">
              <img
                src={logo1}
                alt=""
                height="60px"
                style={{ paddingRight: "30px" }}
              />
            </span>

            <span className="logo-lg">
              <img src={logo2} alt="" height="60px" />
            </span>

            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout
  return { layoutType, showRightSidebar, leftMenu }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header))
