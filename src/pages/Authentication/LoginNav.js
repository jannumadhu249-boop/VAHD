import React, { useState, useEffect } from "react"
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap"
import { useHistory, useLocation } from "react-router-dom"
import classnames from "classnames"

function ViewSeller() {
  const history = useHistory()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1]
    const matchingTab = tabs.find(tab => tab.path === currentPath)
    if (matchingTab) {
      setActiveTab(matchingTab.id)
    }
  }, [location])

  const toggleTab = (tab, path) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
      history.push(`/${path}`)
    }
  }

  const tabs = [
    { id: "login", title: "LogIn", path: "login" },
    { id: "new-user", title: "New User", path: "new-user" },
  ]

  return (
    <Row>
      <Col md={12}>
        <div className="mt-1 ">
          <Nav pills className="navtab-bg nav-justified">
            {tabs.map(tab => (
              <NavItem key={tab.id}>
                <NavLink
                  style={{
                    cursor: "pointer",
                    border: "1px solid #c8d8f1",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  className={classnames({
                    active: activeTab === tab.id,
                  })}
                  onClick={() => toggleTab(tab.id, tab.path)}
                >
                  {tab.title}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </Col>
    </Row>
  )
}

export default ViewSeller
