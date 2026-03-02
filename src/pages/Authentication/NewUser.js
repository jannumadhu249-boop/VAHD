import React, { useState } from "react"
import {
    Row,
    Col,
    Card,
    CardBody,
    Container,
    Label,
    Form,
    FormFeedback,
    Input,
} from "reactstrap"
import { withRouter, Link, useHistory } from "react-router-dom"
import profile from "../../assets/images/profile-img.png"
import { ToastContainer, toast } from "react-toastify"
import logo from "assets/images/fav.png"
import { useFormik } from "formik"
import { URLS } from "../../Url"
import LoginNav from "./LoginNav"
import * as Yup from "yup"
import axios from "axios"

const NewUser= () => {
    const history = useHistory()

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            phone: "",
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .length(10, "Phone number must be 10 digits")
                .required("Please enter your phone number"),
        }),

        onSubmit: values => {
            const dataArray = {
                mobile: values.phone,
            }

            axios.post(URLS.forget, dataArray).then(
                res => {
                    if (res.status === 200) {
                        toast.success(res.data.message)
                        sessionStorage.setItem("phone", res.data.userId)
                        localStorage.setItem(
                            "tost",
                            "OTP has been sent successfully to specified phone number..!"
                        )
                        history.push("/Compareotp")
                    }
                },
                error => {
                    if (error.response && error.response.status === 400) {
                        toast.error(error.response.data.message)
                    }
                }
            )
        },
    })

    return (
        <React.Fragment>
            <div className="home-btn d-none d-sm-block">
                <Link to="#" className="text-dark">
                    <i className="fas fa-home h2" />
                </Link>
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <LoginNav />
                            <Card className="overflow-hidden" style={{ borderRadius: "0px" }}>
                                <div className="bg-primary bg-soft">
                                    <Row className="p-3">
                                        <Col xs={12}>
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">VAHD ADMIN New User</h5>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
                                    <div>
                                        <Link to="#">
                                            <div className="avatar-md profile-user-wid mb-4">
                                                <span className="avatar-title rounded-circle bg-light">
                                                    <img
                                                        src={logo}
                                                        alt=""
                                                        className="rounded-circle"
                                                        height="34"
                                                    />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="p-2">
                                        <Form
                                            className="form-horizontal"
                                            onSubmit={validation.handleSubmit}
                                        >
                                            <div className="mb-3">
                                                <Label className="form-label">Phone</Label>
                                                <Input
                                                    name="phone"
                                                    className="form-control"
                                                    placeholder="Enter phone number (10 digits)"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.phone || ""}
                                                    invalid={
                                                        validation.touched.phone &&
                                                        Boolean(validation.errors.phone)
                                                    }
                                                    onKeyPress={e => {
                                                        const charCode = e.which ? e.which : e.keyCode
                                                        if (charCode < 48 || charCode > 57) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    maxLength="10"
                                                    pattern="[0-9]{10}"
                                                />
                                                {validation.touched.phone && validation.errors.phone ? (
                                                    <FormFeedback type="invalid">
                                                        {validation.errors.phone}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                            <Row className="mb-3">
                                                <Col className="text-end">
                                                    <button
                                                        className="btn btn-primary w-md"
                                                        type="submit"
                                                    >
                                                        Submit
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="mt-5 text-center">
                                <p>
                                    Go back to{" "}
                                    <Link to="login" className="font-weight-medium text-primary">
                                        Login
                                    </Link>
                                </p>
                                <p>
                                    <p>© {new Date().getFullYear()} VAHD ADMIN</p>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <ToastContainer />
        </React.Fragment>
    )
}

export default withRouter(NewUser)
