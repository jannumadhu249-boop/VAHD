import React, { useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  Button,
  Label,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Input,
  CardBody,
  Table,
} from "reactstrap"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ReactPaginate from "react-paginate"
import { URLS } from "../../Url"
import axios from "axios"

const TermsAndConditionsTab = () => {
  const [authData, setAuthData] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("authUser")
      return storedAuth ? JSON.parse(storedAuth) : null
    } catch (error) {
      console.error("Error parsing auth data:", error)
      return null
    }
  })

  const token = authData?.token || ""
  const userRoles = authData?.rolesAndPermission?.[0] || {}

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    getTermsAndConditions()
  }, [])

  const getTermsAndConditions = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        URLS.GetTermsAndConditions,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data && response.data.data) {
        setText(response.data.data.termsAndConditions || "")
      }
    } catch (error) {
      console.error("Error fetching terms and conditions:", error)
      toast.error(
        error.response?.data?.message || "Failed to load terms and conditions"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!canEdit()) {
      toast.warning("You don't have permission to edit")
      return
    }

    setUpdating(true)
    try {
      const response = await axios.post(
        URLS.EditTermsAndConditions,
        { termsAndConditions: text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success(response.data?.message || "Updated successfully")
        getTermsAndConditions()
      }
    } catch (error) {
      console.error("Error updating terms and conditions:", error)
      toast.error(
        error.response?.data?.message || "Failed to update terms and conditions"
      )
    } finally {
      setUpdating(false)
    }
  }

  const canEdit = () => {
    return (
      userRoles.TermsConditionsEdit === true || userRoles.accessAll === true
    )
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <Form onSubmit={handleSubmit}>
      <Col md="12" className="mt-3 mb-3">
        <Label htmlFor="terms-editor">Terms & Conditions</Label>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <CKEditor
            editor={ClassicEditor}
            id="terms-editor"
            data={text}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "indent",
                "outdent",
                "|",
                "undo",
                "redo",
              ],
            }}
            disabled={!canEdit()}
            onChange={(event, editor) => {
              const data = editor.getData()
              setText(data)
            }}
          />
        )}
      </Col>
      {Roles?.PoliciesEdit === true || Roles?.accessAll === true ? (
        <>
          {canEdit() && (
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                color="primary"
                className="px-4"
                disabled={updating || loading}
              >
                {updating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  <>
                    Update <i className="bx bx-check-circle ms-1"></i>
                  </>
                )}
              </Button>
            </div>
          )}{" "}
        </>
      ) : (
        ""
      )}
    </Form>
  )
}

const PrivacyPolicyTab = () => {
  const [authData, setAuthData] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("authUser")
      return storedAuth ? JSON.parse(storedAuth) : null
    } catch (error) {
      console.error("Error parsing auth data:", error)
      return null
    }
  })

  const token = authData?.token || ""
  const userRoles = authData?.rolesAndPermission?.[0] || {}

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    getPrivacyPolicy()
  }, [])

  const getPrivacyPolicy = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        URLS.GetTermsAndConditions,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data && response.data.data) {
        setText(response.data.data.privacyPolicy || "")
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error)
      toast.error(
        error.response?.data?.message || "Failed to load privacy policy"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!canEdit()) {
      toast.warning("You don't have permission to edit")
      return
    }

    setUpdating(true)
    try {
      const response = await axios.post(
        URLS.EditTermsAndConditions,
        {
          privacyPolicy: text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success(
          response.data?.message || "Privacy policy updated successfully"
        )
        getPrivacyPolicy()
      }
    } catch (error) {
      console.error("Error updating privacy policy:", error)
      toast.error(
        error.response?.data?.message || "Failed to update privacy policy"
      )
    } finally {
      setUpdating(false)
    }
  }

  const canEdit = () => {
    return (
      userRoles.PrivacyPolicyEdit === true ||
      userRoles.TermsConditionsEdit === true ||
      userRoles.accessAll === true
    )
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <Form onSubmit={handleSubmit}>
      <Col md="12" className="mt-3 mb-3">
        <Label htmlFor="privacy-policy-editor">Privacy Policy</Label>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <CKEditor
            editor={ClassicEditor}
            id="privacy-policy-editor"
            data={text}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "indent",
                "outdent",
                "|",
                "undo",
                "redo",
              ],
            }}
            disabled={!canEdit()}
            onChange={(event, editor) => {
              const data = editor.getData()
              setText(data)
            }}
          />
        )}
      </Col>

      {Roles?.PoliciesEdit === true || Roles?.accessAll === true ? (
        <>
          {canEdit() && (
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                color="primary"
                className="px-4"
                disabled={updating || loading}
              >
                {updating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  <>
                    Update <i className="bx bx-check-circle ms-1"></i>
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </Form>
  )
}

const FAQTab = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson.token

  const [show, setShow] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [data, setData] = useState([])
  const [form, setForm] = useState({
    question: "",
    search: "",
  })
  const [formEdit, setFormEdit] = useState({
    _id: "",
    question: "",
  })
  const [answer, setAnswer] = useState("")
  const [answerEdit, setAnswerEdit] = useState("")
  const [editorError, setEditorError] = useState(false)
  const [editorEditError, setEditorEditError] = useState(false)

  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    getFAQs()
  }, [])

  const getFAQs = () => {
    axios
      .post(
        URLS.GetFaq,
        {},
        {
          headers: { Authorization: `Bearer ${TokenData}` },
        }
      )
      .then(res => {
        setData(res.data.data)
      })
      .catch(error => {
        toast.error(error.response?.data?.message || "Failed to fetch FAQs")
      })
  }

  const pagesVisited = pageNumber * listPerPage
  const displayedData = data.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(data.length / listPerPage)
  const changePage = ({ selected }) => setPageNumber(selected)

  const handleAddClick = () => {
    setShow(true)
    setShowEdit(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAnswerChange = e => {
    const value = e.target.value
    setAnswer(value)
    if (value.trim() !== "") {
      setEditorError(false)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.question.trim()) {
      toast.error("Please enter a question")
      return
    }

    if (!answer.trim()) {
      setEditorError(true)
      toast.error("Please enter an answer")
      return
    }

    const faqData = {
      question: form.question,
      answer: answer,
    }

    axios
      .post(URLS.AddFaq, faqData, {
        headers: { Authorization: `Bearer ${TokenData}` },
      })
      .then(res => {
        toast.success(res.data.message)
        setShow(false)
        setForm({ question: "", search: "" })
        setAnswer("")
        getFAQs()
      })
      .catch(error => {
        toast.error(error.response?.data?.message || "Failed to add FAQ")
      })
  }

  const handleEditClick = faq => {
    setFormEdit({
      _id: faq._id,
      question: faq.question,
    })
    setAnswerEdit(faq.answer)
    setShow(false)
    setShowEdit(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleEditFormChange = e => {
    const { name, value } = e.target
    setFormEdit(prev => ({ ...prev, [name]: value }))
  }

  const handleEditAnswerChange = e => {
    const value = e.target.value
    setAnswerEdit(value)
    if (value.trim() !== "") {
      setEditorEditError(false)
    }
  }

  const handleEditSubmit = e => {
    e.preventDefault()

    if (!formEdit.question.trim()) {
      toast.error("Please enter a question")
      return
    }

    if (!answerEdit.trim()) {
      setEditorEditError(true)
      toast.error("Please enter an answer")
      return
    }

    const faqData = {
      question: formEdit.question,
      answer: answerEdit,
    }

    axios
      .post(URLS.EditFaq + formEdit._id, faqData, {
        headers: { Authorization: `Bearer ${TokenData}` },
      })
      .then(res => {
        toast.success(res.data.message)
        setShowEdit(false)
        getFAQs()
      })
      .catch(error => {
        toast.error(error.response?.data?.message || "Failed to update FAQ")
      })
  }

  const handleDelete = faq => {
    const confirmDelete = window.confirm(
      "Do you really want to delete this FAQ?"
    )
    if (!confirmDelete) return

    axios
      .post(
        URLS.DeleteFaq + faq._id,
        {},
        {
          headers: { Authorization: `Bearer ${TokenData}` },
        }
      )
      .then(res => {
        toast.success(res.data.message)
        getFAQs()
      })
      .catch(error => {
        toast.error(error.response?.data?.message || "Failed to delete FAQ")
      })
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <div>
      {show && (
        <Row className="mb-4">
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <h5 className="mb-3">Create FAQ</h5>
              <Row>
                <Col md="6">
                  <Label>
                    Question <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="question"
                    value={form.question}
                    onChange={handleFormChange}
                    required
                    type="text"
                    placeholder="Enter Question"
                  />
                </Col>
                <Col md="6">
                  <Label>
                    Answer <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="textarea"
                    name="answer"
                    value={answer}
                    onChange={handleAnswerChange}
                    rows="1"
                    placeholder="Enter Answer"
                    className={editorError ? "border-danger" : ""}
                  />
                  {editorError && (
                    <div className="text-danger small mt-1">
                      Please enter an answer
                    </div>
                  )}
                </Col>
              </Row>
              <div className="text-end mt-4">
                <Button
                  type="button"
                  onClick={() => setShow(false)}
                  color="danger m-1"
                >
                  Cancel <i className="bx bx-x-circle"></i>
                </Button>
                <Button type="submit" color="primary text-white m-1">
                  Submit <i className="bx bx-check-circle"></i>
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      )}
      {showEdit && (
        <Row className="mb-4">
          <Col md={12}>
            <Form onSubmit={handleEditSubmit}>
              <h5 className="mb-3">Edit FAQ</h5>
              <Row>
                <Col md="6">
                  <Label>
                    Question <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="question"
                    value={formEdit.question}
                    onChange={handleEditFormChange}
                    required
                    type="text"
                    placeholder="Enter Question"
                  />
                </Col>
                <Col md="6">
                  <Label>
                    Answer <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="textarea"
                    name="answerEdit"
                    value={answerEdit}
                    onChange={handleEditAnswerChange}
                    rows="1"
                    placeholder="Enter Answer"
                    className={editorEditError ? "border-danger" : ""}
                  />
                  {editorEditError && (
                    <div className="text-danger small mt-1">
                      Please enter an answer
                    </div>
                  )}
                </Col>
              </Row>
              <div className="text-end mt-4">
                <Button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  color="danger m-1"
                >
                  Cancel <i className="bx bx-x-circle"></i>
                </Button>
                <Button type="submit" color="primary text-white m-1">
                  Update <i className="bx bx-check-circle"></i>
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      )}
      <Row>
        <Col md={12}>
          <Row className="mb-3">
            <Col md={6}>
              {Roles?.PoliciesAdd === true || Roles?.accessAll === true ? (
                <>
                  <Button color="primary" onClick={handleAddClick}>
                    <i className="bx bx-plus me-1"></i> Create FAQ
                  </Button>{" "}
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <div className="table-responsive">
            <Table hover bordered>
              <thead>
                <tr className="text-center">
                  <th> S.No </th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.length > 0 ? (
                  displayedData.map((faq, index) => (
                    <tr key={faq._id} className="text-center">
                      <td>{pagesVisited + index + 1}</td>
                      <td>{faq.question}</td>
                      <td>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: faq.answer,
                          }}
                        />
                      </td>
                      <td>
                        {Roles?.PoliciesEdit === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="info"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEditClick(faq)}
                            >
                              <i className="bx bx-edit"></i>
                            </Button>
                          </>
                        ) : (
                          ""
                        )}

                        {Roles?.PoliciesDelete === true ||
                        Roles?.accessAll === true ? (
                          <>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(faq)}
                            >
                              <i className="bx bx-trash"></i>
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No FAQs found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {data.length > listPerPage && (
              <div className="d-flex justify-content-end mt-3">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"pagination pagination-rounded"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

const TermsAndConditions = () => {
  const [activeTab, setActiveTab] = useState("1")

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Policies" />

          <Row>
            <Col>
              <Card className="p-0">
                <CardBody className="p-4">
                  <Nav tabs className="nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        className={activeTab === "1" ? "active" : ""}
                        onClick={() => setActiveTab("1")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bx bx-file me-1"></i> Terms & Conditions
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "2" ? "active" : ""}
                        onClick={() => setActiveTab("2")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bx bx-shield-alt me-1"></i> Privacy Policy
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "3" ? "active" : ""}
                        onClick={() => setActiveTab("3")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bx bx-help-circle me-1"></i> FAQ's
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3">
                    <TabPane tabId="1">
                      <TermsAndConditionsTab />
                    </TabPane>
                    <TabPane tabId="2">
                      <PrivacyPolicyTab />
                    </TabPane>
                    <TabPane tabId="3">
                      <FAQTab />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </React.Fragment>
  )
}

export default TermsAndConditions
