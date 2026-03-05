// import React, { useEffect, useState } from "react"
// import { Container, Row, Col, Card, CardBody } from "reactstrap"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer } from "react-toastify"
// import ReactEcharts from "echarts-for-react"
// import { URLS } from "../../Url"
// import axios from "axios"

// const Dashboard = () => {
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = JSON.parse(GetAuth)
//   const TokenData = TokenJson?.token

//   const [dashboardData, setDashboardData] = useState({})

//   const [analyticsData, setanalyticsData] = useState([])

//   const fetchDashboardData = () => {
//     axios
//       .post(
//         URLS.getDashboard,
//         {},
//         {
//           headers: { Authorization: `Bearer ${TokenData}` },
//         }
//       )
//       .then(res => {
//         setDashboardData(res?.data || {})
//         setanalyticsData(res?.data.analytics || [])
//       })
//       .catch(error => {
//         console.error("Error fetching dashboard data:", error)
//       })
//   }

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const stats = [
//     {
//       title: "Total Employees",
//       value: dashboardData.totalEmployes || 0,
//       icon: "bx bx-user",
//       color: "primary",
//       description: "All registered employees",
//     },
//     {
//       title: "Checked In Today",
//       value: dashboardData.checkinEmployes || 0,
//       icon: "bx bx-log-in",
//       color: "success",
//       description: "Employees who checked in today",
//     },
//     {
//       title: "Checked Out Today",
//       value: dashboardData.checkoutEmployes || 0,
//       icon: "bx bx-log-out",
//       color: "info",
//       description: "Employees who checked out today",
//     },
//     {
//       title: "Absent Today",
//       value: dashboardData.absentEmployes || 0,
//       icon: "bx bx-user-x",
//       color: "warning",
//       description: "Employees absent today",
//     },
//   ]

//   const pieChartOptions = {
//     toolbox: {
//       show: false,
//     },
//     tooltip: {
//       trigger: "item",
//       formatter: "{a} <br/>{b}: {c} ({d}%)",
//     },
//     legend: {
//       orient: "vertical",
//       right: 10,
//       top: "center",
//       data: ["DVAHO", "SSVH", "DVH", "AVH", "PVC", "SC(AH)", "ADDL"],
//       textStyle: {
//         color: "#74788d",
//         fontSize: 12,
//       },
//     },
//     color: [
//       "#3b5de7",
//       "#45cb85",
//       "#eeb902",
//       "#ff715b",
//       "#5b2c6f",
//       "#3498db",
//       "#9b59b6",
//     ],
//     series: [
//       {
//         name: "Employees Registrations",
//         type: "pie",
//         radius: ["50%", "70%"],
//         avoidLabelOverlap: false,
//         center: ["40%", "50%"],
//         itemStyle: {
//           borderRadius: 5,
//           borderColor: "#fff",
//           borderWidth: 2,
//         },
//         label: {
//           show: false,
//           position: "center",
//         },
//         emphasis: {
//           label: {
//             show: true,
//             fontSize: "18",
//             fontWeight: "bold",
//           },
//         },
//         labelLine: {
//           show: false,
//         },
//         data: [
//           { value: 120, name: "DVAHO" },
//           { value: 85, name: "SSVH" },
//           { value: 45, name: "DVH" },
//           { value: 60, name: "AVH" },
//           { value: 25, name: "PVC" },
//           { value: 25, name: "SC(AH)" },
//           { value: 25, name: "ADDL" },
//         ],
//       },
//     ],
//   }

//   const barChartOptions = {
//     tooltip: {
//       trigger: "axis",
//       axisPointer: {
//         type: "shadow",
//       },
//     },
//     grid: {
//       left: "3%",
//       right: "4%",
//       bottom: "3%",
//       containLabel: true,
//     },
//     xAxis: {
//       type: "category",
//       data: ["Murrah", "Jersey", "Jersey Cross", "HF Cross", "Ongol", "Tharpa"],
//       axisLabel: {
//         rotate: 30,
//         interval: 0,
//       },
//     },
//     yAxis: {
//       type: "value",
//       name: "",
//     },
//     series: [
//       {
//         name: "Patient Registrations",
//         type: "bar",
//         data: [120, 85, 45, 60, 25, 30],
//         itemStyle: {
//           color: function (params) {
//             const colorList = [
//               "#3b5de7",
//               "#45cb85",
//               "#eeb902",
//               "#ff715b",
//               "#5b2c6f",
//               "#3498db",
//             ]
//             return colorList[params.dataIndex]
//           },
//           borderRadius: [4, 4, 0, 0],
//         },
//         label: {
//           show: true,
//           position: "top",
//         },
//       },
//     ],
//   }

//   const lineChartOptions = {
//     tooltip: {
//       trigger: "axis",
//     },
//     legend: {
//       data: ["Inspections", "Follow-ups"],
//       bottom: 0,
//     },
//     grid: {
//       left: "3%",
//       right: "4%",
//       bottom: "15%",
//       containLabel: true,
//     },
//     xAxis: {
//       type: "category",
//       boundaryGap: false,
//       data: [
//         "Attendance",
//         "General",
//         "Patient",
//         "A.I.",
//         "Calves Born",
//         "Fodder Seed",
//       ],
//       axisLabel: {
//         rotate: 30,
//         interval: 0,
//       },
//     },
//     yAxis: {
//       type: "value",
//       name: "Number of Records",
//     },
//     series: [
//       {
//         name: "Inspections",
//         type: "line",
//         stack: "Total",
//         data: [120, 132, 101, 134, 90, 230],
//         smooth: true,
//         lineStyle: {
//           width: 3,
//         },
//         symbolSize: 8,
//         itemStyle: {
//           color: "#45cb85",
//         },
//         areaStyle: {
//           color: {
//             type: "linear",
//             x: 0,
//             y: 0,
//             x2: 0,
//             y2: 1,
//             colorStops: [
//               {
//                 offset: 0,
//                 color: "rgba(69, 203, 133, 0.3)",
//               },
//               {
//                 offset: 1,
//                 color: "rgba(69, 203, 133, 0)",
//               },
//             ],
//           },
//         },
//       },
//       {
//         name: "Follow-ups",
//         type: "line",
//         stack: "Total",
//         data: [220, 182, 191, 234, 290, 330],
//         smooth: true,
//         lineStyle: {
//           width: 3,
//         },
//         symbolSize: 8,
//         itemStyle: {
//           color: "#eeb902",
//         },
//         areaStyle: {
//           color: {
//             type: "linear",
//             x: 0,
//             y: 0,
//             x2: 0,
//             y2: 1,
//             colorStops: [
//               {
//                 offset: 0,
//                 color: "rgba(238, 185, 2, 0.3)",
//               },
//               {
//                 offset: 1,
//                 color: "rgba(238, 185, 2, 0)",
//               },
//             ],
//           },
//         },
//       },
//     ],
//   }

//   var gets = localStorage.getItem("authUser")
//   var datas = JSON.parse(gets)
//   var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Dashboard" />
//           {Roles?.Dashboardview === true || Roles?.accessAll === true ? (
//             <>
//               <Row className="mb-2">
//                 {stats.map((stat, index) => (
//                   <Col xl="3" md="6" key={index}>
//                     <Card className="card-animate">
//                       <CardBody>
//                         <div className="d-flex align-items-center">
//                           <div className="flex-grow-1 overflow-hidden">
//                             <p className="text-uppercase fw-medium text-muted text-truncate mb-0 ">
//                               {stat.title}
//                             </p>
//                             <p className="text-muted mb-0 small">
//                               {stat.description}
//                             </p>
//                           </div>
//                           <div className="flex-shrink-0">
//                             <div
//                               className={`avatar-sm rounded-circle bg-${stat.color}-subtle p-1`}
//                             >
//                               <i
//                                 className={`${stat.icon} font-size-24 text-${stat.color} d-block text-center`}
//                               ></i>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="mt-2">
//                           <h4 className="fs-22 fw-semibold ff-secondary mb-0">
//                             {stat.value}
//                           </h4>
//                         </div>
//                       </CardBody>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//               <Row className="mt-2 mb-2">
//                 {analyticsData.slice(0, 3)?.map((institute, instIndex) => (
//                   <Col lg="4" key={instIndex}>
//                     <Card className="card-animate border bg-light-subtle">
//                       <CardBody>
//                         <div className="d-flex align-items-center mb-2">
//                           <div className="flex-grow-1">
//                             <h5 className="card-title mb-0 fs-16">
//                               {institute.institutionName}
//                             </h5>
//                           </div>
//                         </div>
//                         <Row className="g-2">
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Total
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.total.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Progress
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.progress.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Completed
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.completed.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Pending
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.pending.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                         </Row>
//                       </CardBody>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//               <Row className="mt-2 mb-2">
//                 {analyticsData.slice(3)?.map((institute, instIndex) => (
//                   <Col lg="6" key={instIndex}>
//                     <Card className="card-animate border bg-light-subtle">
//                       <CardBody>
//                         <div className="d-flex align-items-center mb-2">
//                           <div className="flex-grow-1">
//                             <h5 className="card-title mb-0 fs-16">
//                               {institute.institutionName}
//                             </h5>
//                           </div>
//                         </div>
//                         <Row className="g-2">
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Total
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.total.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Progress
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.progress.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Completed
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.completed.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                           <Col xs="6">
//                             <Card className="shadow-none border mb-0">
//                               <CardBody className="p-3">
//                                 <div className="d-flex align-items-center">
//                                   <div className="flex-shrink-0 me-3">
//                                     <div
//                                       className={`avatar-sm rounded bg-${"primary"}-subtle d-flex align-items-center justify-content-center`}
//                                     >
//                                       <i
//                                         className={`${"bx bxs-doughnut-chart"} font-size-18 text-${"primary"}`}
//                                       ></i>
//                                     </div>
//                                   </div>
//                                   <div className="flex-grow-1">
//                                     <p className="text-muted mb-1 fw-medium">
//                                       Pending
//                                     </p>
//                                     <div className="d-flex align-items-center">
//                                       <h4 className="mb-0 fs-20 fw-semibold">
//                                         {institute.pending.toLocaleString()}
//                                       </h4>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </CardBody>
//                             </Card>
//                           </Col>
//                         </Row>
//                       </CardBody>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//               <Row className="mt-2 mb-2">
//                 <Col xl="5" className="mb-2">
//                   <Card className="h-100">
//                     <CardBody>
//                       <h4 className="card-title mb-4">
//                         Employees by Department
//                       </h4>
//                       <div style={{ height: "350px" }}>
//                         <ReactEcharts
//                           option={pieChartOptions}
//                           style={{ height: "100%" }}
//                         />
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//                 <Col xl="7" className="mb-2">
//                   <Card className="h-100">
//                     <CardBody>
//                       <h4 className="card-title mb-4">
//                         Patient Registration by Breed
//                       </h4>
//                       <div style={{ height: "350px" }}>
//                         <ReactEcharts
//                           option={barChartOptions}
//                           style={{ height: "100%" }}
//                         />
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//                 <Col xl="12" className="mb-2 mt-2">
//                   <Card className="h-100">
//                     <CardBody>
//                       <h4 className="card-title mb-4">Inspections</h4>
//                       <div style={{ height: "350px" }}>
//                         <ReactEcharts
//                           option={lineChartOptions}
//                           style={{ height: "100%" }}
//                         />
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>
//             </>
//           ) : (
//             ""
//           )}
//         </Container>
//         <ToastContainer />
//       </div>
//     </React.Fragment>
//   )
// }

// export default Dashboard


// import React, { useEffect, useState } from "react"
// import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer } from "react-toastify"
// import ReactEcharts from "echarts-for-react"
// import { URLS } from "../../Url"
// import axios from "axios"

// const Dashboard = () => {
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = JSON.parse(GetAuth)
//   const TokenData = TokenJson?.token
//   const Roles = TokenJson?.rolesAndPermission?.[0] ?? { accessAll: true }

//   const [dashboardData, setDashboardData] = useState({})
//   const [analyticsData, setAnalyticsData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedInstitution, setSelectedInstitution] = useState(null)

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.post(
//         URLS.getDashboard,
//         {},
//         {
//           headers: { Authorization: `Bearer ${TokenData}` },
//         }
//       )
//       setDashboardData(response?.data || {})
//       setAnalyticsData(response?.data.analytics || [])
//       if (response?.data.analytics && response?.data.analytics.length > 0) {
//         setSelectedInstitution(response?.data.analytics[0])
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const handleInstitutionChange = (e) => {
//     const selected = analyticsData.find(
//       (inst) => inst.institutionName === e.target.value
//     )
//     setSelectedInstitution(selected)
//   }

//   // Inline Styles
//   const styles = {
//     pageContent: {
//       backgroundColor: "#f8f9fa",
//       minHeight: "100vh",
//       padding: "24px 0",
//     },
//     attendanceCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     attendanceLabel: {
//       fontSize: "11px",
//       fontWeight: "600",
//       color: "#dc3545",
//       textTransform: "uppercase",
//       marginBottom: "6px",
//       letterSpacing: "0.3px",
//     },
//     attendanceValue: {
//       fontSize: "28px",
//       fontWeight: "700",
//       color: "#495057",
//       marginBottom: "0",
//       lineHeight: "1.2",
//     },
//     rightSideCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     dropdown: {
//       width: "48%",
//       padding: "8px 12px",
//       border: "1px solid #ced4da",
//       borderRadius: "6px",
//       fontSize: "13px",
//       fontWeight: "500",
//       backgroundColor: "#fff",
//       cursor: "pointer",
//       outline: "none",
//     },
//     metricBox: {
//       display: "flex",
//       padding: "14px",
//       borderRadius: "8px",
//       backgroundColor: "#f8f9fa",
//       border: "1px solid #e9ecef",
//       height: "100%",
//     },
//     metricIconWrapper: {
//       width: "42px",
//       height: "42px",
//       borderRadius: "50%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       marginLeft: "10px",
//       marginRight: "10px",
//     },
//     metricValue: {
//       fontSize: "20px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "4px",
//       textAlign: "center",
//       lineHeight: "1",
//     },
//     metricLabel: {
//       fontSize: "11px",
//       fontWeight: "500",
//       color: "#74788d",
//       marginBottom: "0",
//       textAlign: "center",
//     },
//     institutionCard: {
//       border: "1px solid #e9ecef",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     institutionHeader: {
//       backgroundColor: "#f8f9fa",
//       borderBottom: "1px solid #e9ecef",
//       padding: "14px 18px",
//     },
//     institutionTitle: {
//       fontSize: "15px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "0",
//     },
//     institutionMetricCard: {
//       border: "1px solid #e9ecef",
//       borderRadius: "6px",
//       backgroundColor: "#f8f9fa",
//       marginBottom: "0",
//       boxShadow: "none",
//     },
//     institutionMetricBody: {
//       padding: "10px",
//     },
//     institutionMetricIcon: {
//       width: "28px",
//       height: "28px",
//       borderRadius: "6px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       flexShrink: 0,
//     },
//     institutionMetricLabel: {
//       fontSize: "10px",
//       fontWeight: "500",
//       color: "#74788d",
//       marginBottom: "3px",
//     },
//     institutionMetricValue: {
//       fontSize: "18px",
//       fontWeight: "700",
//       color: "#495057",
//       marginBottom: "0",
//     },
//     chartCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     chartHeader: {
//       backgroundColor: "#f8f9fa",
//       borderBottom: "1px solid #e9ecef",
//       padding: "14px 18px",
//     },
//     chartTitle: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "0",
//     },
//     loadingOverlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 9999,
//     },
//     loadingSpinner: {
//       textAlign: "center",
//     },
//     skeletonCard: {
//       border: "none",
//       borderRadius: "8px",
//       backgroundColor: "#fff",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//   }

//   // Color configurations
//   const colors = {
//     primary: { bg: "rgba(59, 93, 231, 0.15)", text: "#3b5de7" },
//     success: { bg: "rgba(69, 203, 133, 0.15)", text: "#45cb85" },
//     warning: { bg: "rgba(238, 185, 2, 0.15)", text: "#eeb902" },
//     danger: { bg: "rgba(255, 113, 91, 0.15)", text: "#ff715b" },
//     info: { bg: "rgba(52, 152, 219, 0.15)", text: "#3498db" },
//   }

//   // Chart Options
//   const pieChartOptions = {
//     toolbox: { show: false },
//     tooltip: {
//       trigger: "item",
//       formatter: "{a} <br/>{b}: {c} ({d}%)",
//     },
//     legend: {
//       orient: "vertical",
//       right: 10,
//       top: "center",
//       data: ["DVAHO", "SSVH", "DVH", "AVH", "PVC", "SC(AH)", "ADDL"],
//       textStyle: { color: "#74788d", fontSize: 10 },
//     },
//     color: ["#3b5de7", "#45cb85", "#eeb902", "#ff715b", "#5b2c6f", "#3498db", "#9b59b6"],
//     series: [
//       {
//         name: "Employees by Department",
//         type: "pie",
//         radius: ["50%", "70%"],
//         center: ["35%", "50%"],
//         avoidLabelOverlap: false,
//         itemStyle: {
//           borderRadius: 6,
//           borderColor: "#fff",
//           borderWidth: 2,
//         },
//         label: { show: false },
//         emphasis: {
//           label: {
//             show: true,
//             fontSize: "14",
//             fontWeight: "bold",
//           },
//         },
//         labelLine: { show: false },
//         data: [
//           { value: 120, name: "DVAHO" },
//           { value: 85, name: "SSVH" },
//           { value: 45, name: "DVH" },
//           { value: 60, name: "AVH" },
//           { value: 25, name: "PVC" },
//           { value: 25, name: "SC(AH)" },
//           { value: 25, name: "ADDL" },
//         ],
//       },
//     ],
//   }

//   const barChartOptions = {
//     tooltip: {
//       trigger: "axis",
//       axisPointer: { type: "shadow" },
//     },
//     grid: {
//       left: "3%",
//       right: "4%",
//       bottom: "8%",
//       top: "10%",
//       containLabel: true,
//     },
//     xAxis: {
//       type: "category",
//       data: ["Murrah", "Jersey", "Jersey Cross", "HF Cross", "Ongol", "Tharpa"],
//       axisLabel: {
//         rotate: 30,
//         interval: 0,
//         fontSize: 10,
//       },
//     },
//     yAxis: {
//       type: "value",
//       name: "Count",
//       nameTextStyle: { fontSize: 11 },
//     },
//     series: [
//       {
//         name: "Patient Registrations",
//         type: "bar",
//         data: [120, 85, 45, 60, 25, 30],
//         itemStyle: {
//           color: function (params) {
//             const colorList = ["#3b5de7", "#45cb85", "#eeb902", "#ff715b", "#5b2c6f", "#3498db"]
//             return colorList[params.dataIndex]
//           },
//           borderRadius: [5, 5, 0, 0],
//         },
//         label: {
//           show: true,
//           position: "top",
//           fontSize: 10,
//           fontWeight: "bold",
//         },
//       },
//     ],
//   }

//   const lineChartOptions = {
//     tooltip: {
//       trigger: "axis",
//     },
//     legend: {
//       data: ["Inspections", "Follow-ups"],
//       bottom: 0,
//     },
//     grid: {
//       left: "3%",
//       right: "4%",
//       bottom: "15%",
//       containLabel: true,
//     },
//     xAxis: {
//       type: "category",
//       boundaryGap: false,
//       data: [
//         "Attendance",
//         "General",
//         "Patient",
//         "A.I.",
//         "Calves Born",
//         "Fodder Seed",
//       ],
//       axisLabel: {
//         rotate: 30,
//         interval: 0,
//       },
//     },
//     yAxis: {
//       type: "value",
//       name: "Number of Records",
//     },
//     series: [
//       {
//         name: "Inspections",
//         type: "line",
//         stack: "Total",
//         data: [120, 132, 101, 134, 90, 230],
//         smooth: true,
//         lineStyle: {
//           width: 3,
//         },
//         symbolSize: 8,
//         itemStyle: {
//           color: "#45cb85",
//         },
//         areaStyle: {
//           color: {
//             type: "linear",
//             x: 0,
//             y: 0,
//             x2: 0,
//             y2: 1,
//             colorStops: [
//               {
//                 offset: 0,
//                 color: "rgba(69, 203, 133, 0.3)",
//               },
//               {
//                 offset: 1,
//                 color: "rgba(69, 203, 133, 0)",
//               },
//             ],
//           },
//         },
//       },
//       {
//         name: "Follow-ups",
//         type: "line",
//         stack: "Total",
//         data: [220, 182, 191, 234, 290, 330],
//         smooth: true,
//         lineStyle: {
//           width: 3,
//         },
//         symbolSize: 8,
//         itemStyle: {
//           color: "#eeb902",
//         },
//         areaStyle: {
//           color: {
//             type: "linear",
//             x: 0,
//             y: 0,
//             x2: 0,
//             y2: 1,
//             colorStops: [
//               {
//                 offset: 0,
//                 color: "rgba(238, 185, 2, 0.3)",
//               },
//               {
//                 offset: 1,
//                 color: "rgba(238, 185, 2, 0)",
//               },
//             ],
//           },
//         },
//       },
//     ],
//   }

//   // Loading State Component
//   if (loading) {
//     return (
//       <React.Fragment>
//         <div className="page-content">
//           <Container fluid>
//             <Breadcrumbs title="VHIS" breadcrumbItem="Employee Attendance" />

//             {/* <div style={styles.loadingOverlay}> */}
//               <div style={styles.loadingSpinner}>
//                 <div
//                   className="spinner-border text-primary"
//                   role="status"
//                   style={{ width: "4rem", height: "4rem", borderWidth: "0.3rem" }}
//                 >
//                   <span className="sr-only">Loading...</span>
//                 </div>
//                 <p style={{ marginTop: "16px", color: "#74788d", fontSize: "14px", fontWeight: "500" }}>
//                   Loading Dashboard Data...
//                 </p>
//               </div>
//             {/* </div> */}
//           </Container>
//         </div>
//       </React.Fragment>
//     )
//   }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="VHIS" breadcrumbItem="Employee Attendance" />

//           {Roles?.Dashboardview === true || Roles?.accessAll === true ? (
//             <>
//               {/* Top Section - Attendance Grid */}
//               <Row style={{ marginBottom: "20px" }}>
//                 {/* Left Side - 6 Attendance Cards (2 rows x 3 columns) */}
//                 <Col lg="8" md="12">
//                   <Row>
//                     {/* Row 1 - Top 3 Cards */}
//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Total Employees</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.staff || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Checked In On-Site</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkInsite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={{...styles.attendanceLabel, color: "#dc3545"}}>
//                             checked in Off-Site
//                           </p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkIntimesite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     {/* Row 2 - Bottom 3 Cards */}
//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Absent</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.absentees || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Checked Out On-Site</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkOutsite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={{...styles.attendanceLabel, color: "#dc3545"}}>
//                             checked Out Off-Site
//                           </p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkOuttimesite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>
//                   </Row>
//                 </Col>

//                 {/* Right Side - Institution Dropdown with Metrics (2x2 Grid) */}
//                 <Col lg="4" md="12">
//                   <Card style={styles.rightSideCard}>
//                     <CardBody style={{ padding: "7px" }}>
//                       {/* Dropdowns Row */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           marginBottom: "7px",
//                           gap: "10px",
//                         }}
//                       >
//                         <select
//                           style={styles.dropdown}
//                           value={selectedInstitution?.institutionName || ""}
//                           onChange={handleInstitutionChange}
//                         >
//                           {analyticsData.map((inst, idx) => (
//                             <option key={idx} value={inst.institutionName}>
//                               {inst.institutionName}
//                             </option>
//                           ))}
//                         </select>

//                         <select style={styles.dropdown}>
//                           <option>Qarter</option>
//                         </select>
//                       </div>

//                       {/* Metrics Grid - 2x2 Layout */}
//                       {selectedInstitution && (
//                         <Row style={{ rowGap: "7px" }}>
//                           {/* Top Row */}
//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.primary.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-time"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.primary.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div>
//                               <p style={styles.metricLabel}>Total</p>
//                               <h5 style={styles.metricValue}>
//                                 {selectedInstitution.total?.toLocaleString()}
//                               </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.info.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-trending-up"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.info.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div>

//                                 <p style={styles.metricLabel}>Progress</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.progress?.toLocaleString()}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           {/* Bottom Row */}
//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.success.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-check-circle"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.success.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div>
//                                 <p style={styles.metricLabel}>Completed</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.completed?.toLocaleString()}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.warning.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-time-five"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.warning.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div>
//                                 <p style={styles.metricLabel}>Pending</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.pending?.toLocaleString()}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       )}
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* Charts Section */}
//               <Row style={{ marginBottom: "20px" }}>
//                 {/* Pie Chart */}
//                 <Col lg="5" md="12" style={{ marginBottom: "16px" }}>
//                   <Card style={styles.chartCard}>
//                     <CardHeader style={styles.chartHeader}>
//                       <h5 style={styles.chartTitle}>Employees by Department</h5>
//                     </CardHeader>
//                     <CardBody style={{ padding: "16px" }}>
//                       <div style={{ height: "320px", width: "100%" }}>
//                         <ReactEcharts
//                           option={pieChartOptions}
//                           style={{ height: "100%", width: "100%" }}
//                           opts={{ renderer: "canvas" }}
//                         />
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>

//                 {/* Bar Chart */}
//                 <Col lg="7" md="12" style={{ marginBottom: "16px" }}>
//                   <Card style={styles.chartCard}>
//                     <CardHeader style={styles.chartHeader}>
//                       <h5 style={styles.chartTitle}>Patient Registration by Breed</h5>
//                     </CardHeader>
//                     <CardBody style={{ padding: "16px" }}>
//                       <div style={{ height: "320px", width: "100%" }}>
//                         <ReactEcharts
//                           option={barChartOptions}
//                           style={{ height: "100%", width: "100%" }}
//                           opts={{ renderer: "canvas" }}
//                         />
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>

//                 {/* Line Chart */}
//                 <Col xl="12" className="mb-2 mt-2">
//                   <Card className="h-100">
//                     <CardBody>
//                       <h4 className="card-title mb-4">Inspections</h4>
//                       <div style={{ height: "350px" }}>
//                         <ReactEcharts
//                           option={lineChartOptions}
//                           style={{ height: "100%" }}
//                         />
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>
//             </>
//           ) : (
//             <Row>
//               <Col xs="12">
//                 <Card style={{ textAlign: "center", padding: "40px" }}>
//                   <CardBody>
//                     <i
//                       className="bx bx-lock-alt"
//                       style={{ fontSize: "48px", color: "#74788d" }}
//                     ></i>
//                     <h4 style={{ marginTop: "16px", color: "#495057" }}>Access Denied</h4>
//                     <p style={{ color: "#74788d" }}>
//                       You don't have permission to view this dashboard.
//                     </p>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           )}
//         </Container>
//         <ToastContainer />
//       </div>
//     </React.Fragment>
//   )
// }

// export default Dashboard




// import React, { useEffect, useState, useCallback, useMemo } from "react"
// import { Container, Row, Col, Card, CardBody, CardHeader, FormFeedback } from "reactstrap"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer, toast } from "react-toastify"
// import ReactEcharts from "echarts-for-react"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import axios from "axios"

// const Dashboard = () => {
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = JSON.parse(GetAuth)
//   const TokenData = TokenJson?.token
//   const Roles = TokenJson?.rolesAndPermission?.[0] ?? { accessAll: true }

//   const [dashboardData, setDashboardData] = useState({})
//   const [analyticsData, setAnalyticsData] = useState([])
//   const [institutionTypeCounts, setInstitutionTypeCounts] = useState([])
//   const [utilizedResult, setUtilizedResult] = useState([])
//   const [districtWiseResult, setDistrictWiseResult] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedInstitution, setSelectedInstitution] = useState(null)

//   // Filter states
//   const [institutionTypeOptions, setInstitutionTypeOptions] = useState([])
//   const [quarterOptions, setQuarterOptions] = useState([])
//   const [filters, setFilters] = useState({
//     institutionTypeId: localStorage.getItem("saved_institutionTypeId") || "",
//     quarterId: localStorage.getItem("saved_quarterId") || "",
//   })

//   // Validation states
//   const [validationErrors, setValidationErrors] = useState({
//     institutionTypeId: "",
//     quarterId: "",
//   })
//   const [touchedFields, setTouchedFields] = useState({
//     institutionTypeId: false,
//     quarterId: false,
//   })
//   const [isFormValid, setIsFormValid] = useState(false)
//   const [filtersLoading, setFiltersLoading] = useState(false)

//   // React Select styles
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: 40,
//       height: 40,
//       fontSize: 14,
//       borderRadius: 6,
//       borderColor: validationErrors.institutionTypeId && touchedFields.institutionTypeId 
//         ? "#dc3545" 
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "#dc3545"
//           : state.isFocused ? "#405189" : "#ced4da",
//       boxShadow: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//         ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
//           : state.isFocused
//             ? "0 0 0 0.2rem rgba(64, 81, 137, 0.25)"
//             : "none",
//       transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
//       "&:hover": {
//         borderColor: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//           ? "#dc3545"
//           : validationErrors.quarterId && touchedFields.quarterId
//             ? "#dc3545"
//             : "#b1bbc4",
//       },
//     }),
//     valueContainer: base => ({
//       ...base,
//       padding: "0 8px",
//       height: "100%",
//     }),
//     input: base => ({
//       ...base,
//       margin: 0,
//       padding: 0,
//     }),
//     indicatorsContainer: base => ({
//       ...base,
//       height: 38,
//     }),
//     dropdownIndicator: base => ({
//       ...base,
//       padding: "4px 8px",
//     }),
//     clearIndicator: base => ({
//       ...base,
//       padding: "4px 8px",
//     }),
//     indicatorSeparator: base => ({
//       ...base,
//       marginTop: 8,
//       marginBottom: 8,
//     }),
//     option: (base, state) => ({
//       ...base,
//       fontSize: 14,
//       padding: "8px 12px",
//       backgroundColor: state.isSelected
//         ? "#2362c8"
//         : state.isFocused
//         ? "#f8f9fa"
//         : "white",
//       color: state.isSelected ? "white" : "#212529",
//       "&:active": {
//         backgroundColor: "#2362c8",
//         color: "white",
//       },
//     }),
//     placeholder: base => ({
//       ...base,
//       fontSize: 14,
//       color: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//         ? "#dc3545"
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "#dc3545"
//           : "#6c757d",
//     }),
//     singleValue: base => ({
//       ...base,
//       color: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//         ? "#dc3545"
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "#dc3545"
//           : "#212529",
//     }),
//   }

//   // Validation rules
//   const validateField = (name, value) => {
//     let error = ""

//     switch (name) {
//       case "institutionTypeId":
//         if (!value) {
//           error = "Institution Type is required"
//         }
//         break
//       case "quarterId":
//         if (!value) {
//           error = "Quarter is required"
//         }
//         break
//       default:
//         break
//     }

//     return error
//   }

//   // Validate all fields
//   const validateForm = useCallback(() => {
//     const errors = {
//       institutionTypeId: validateField("institutionTypeId", filters.institutionTypeId),
//       quarterId: validateField("quarterId", filters.quarterId),
//     }

//     setValidationErrors(errors)

//     // Form is valid if no errors
//     const isValid = !errors.institutionTypeId && !errors.quarterId
//     setIsFormValid(isValid)

//     return isValid
//   }, [filters])

//   // Handle field blur
//   const handleFieldBlur = (fieldName) => {
//     setTouchedFields(prev => ({
//       ...prev,
//       [fieldName]: true,
//     }))

//     // Validate the field
//     const error = validateField(fieldName, filters[fieldName])
//     setValidationErrors(prev => ({
//       ...prev,
//       [fieldName]: error,
//     }))
//   }

//   // Fetch Institution Types
//   const fetchInstitutionTypes = useCallback(async () => {
//     try {
//       setFiltersLoading(true)
//       const response = await axios.get(URLS.GetEmploymentType, {
//         headers: { Authorization: `Bearer ${TokenData}` },
//         timeout: 15000,
//       })

//       if (response.data?.data) {
//         const employmentTypes = response.data.data.map(type => ({
//           value: type._id,
//           label: type.name,
//         }))
//         setInstitutionTypeOptions(employmentTypes)
//       }
//     } catch (error) {
//       console.error("Error fetching institution types:", error)
//       toast.error("Failed to load institution types")
//     } finally {
//       setFiltersLoading(false)
//     }
//   }, [TokenData])

//   // Fetch Quarters
//   const fetchQuarters = useCallback(async () => {
//     try {
//       setFiltersLoading(true)
//       const response = await axios.post(URLS.GetQuarter, {}, {
//         headers: { Authorization: `Bearer ${TokenData}` },
//         timeout: 15000,
//       })

//       if (response.data?.data) {
//         const quartersData = response.data.data.map(quarter => ({
//           value: quarter._id,
//           label: quarter.quarter,
//         }))
//         setQuarterOptions(quartersData)
//       }
//     } catch (error) {
//       console.error("Error fetching quarters:", error)
//       toast.error("Failed to load quarters")
//     } finally {
//       setFiltersLoading(false)
//     }
//   }, [TokenData])

//   // Fetch Dashboard Data with Filters
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       setLoading(true)

//       // Prepare request data
//       const requestData = {}
//       if (filters.institutionTypeId) {
//         requestData.institutionTypeId = filters.institutionTypeId
//       }
//       if (filters.quarterId) {
//         requestData.quarterId = filters.quarterId
//       }

//       const response = await axios.post(
//         URLS.getDashboard,
//         requestData,
//         {
//           headers: { Authorization: `Bearer ${TokenData}` },
//         }
//       )

//       const responseData = response?.data || {}
//       setDashboardData(responseData)

//       // Handle analytics data
//       const analytics = responseData.analytics || []
//       setAnalyticsData(analytics)

//       // Handle institution type counts for pie chart
//       const counts = responseData.institutionTypeCounts || []
//       setInstitutionTypeCounts(counts)

//       // Handle utilized result for bar chart
//       const utilized = responseData.utilizedResult || []
//       setUtilizedResult(utilized)

//       // Handle district wise result for line chart
//       const districtWise = responseData.districtWiseResult || []
//       setDistrictWiseResult(districtWise)

//       if (analytics.length > 0) {
//         setSelectedInstitution(analytics[0])
//       } else {
//         setSelectedInstitution(null)
//       }

//     } catch (error) {
//       console.error("Error fetching dashboard data:", error)
//       toast.error("Failed to load dashboard data")
//       setAnalyticsData([])
//       setInstitutionTypeCounts([])
//       setUtilizedResult([])
//       setDistrictWiseResult([])
//       setSelectedInstitution(null)
//     } finally {
//       setLoading(false)
//     }
//   }, [TokenData, filters])

//   // Initialize filters data
//   useEffect(() => {
//     const initializeFilters = async () => {
//       await Promise.all([
//         fetchInstitutionTypes(),
//         fetchQuarters()
//       ])
//     }
//     initializeFilters()
//   }, [fetchInstitutionTypes, fetchQuarters])

//   // Validate form when filters change
//   useEffect(() => {
//     validateForm()
//   }, [filters, validateForm])

//   // Fetch dashboard data when filters are valid
//   useEffect(() => {
//     // Only fetch if form is valid and at least one filter is selected
//     if (isFormValid && (filters.institutionTypeId || filters.quarterId)) {
//       const timer = setTimeout(() => {
//         fetchDashboardData()
//       }, 300) // Debounce

//       return () => clearTimeout(timer)
//     }
//   }, [filters, fetchDashboardData, isFormValid])

//   // Handle filter changes
//   const handleFilterChange = (selectedOption, { name }) => {
//     const value = selectedOption?.value || ""

//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }))

//     // Mark field as touched
//     setTouchedFields(prev => ({
//       ...prev,
//       [name]: true,
//     }))

//     // Validate the field
//     const error = validateField(name, value)
//     setValidationErrors(prev => ({
//       ...prev,
//       [name]: error,
//     }))

//     // Save to localStorage
//     if (value) {
//       localStorage.setItem(`saved_${name}`, value)
//     } else {
//       localStorage.removeItem(`saved_${name}`)
//     }
//   }



//   const handleInstitutionChange = (e) => {
//     const selected = analyticsData.find(
//       (inst) => inst.institutionName === e.target.value
//     )
//     setSelectedInstitution(selected)
//   }

//   // Memoized filter values for React Select
//   const institutionTypeValue = useMemo(() => {
//     if (!filters.institutionTypeId) return null
//     return institutionTypeOptions.find(opt => opt.value === filters.institutionTypeId)
//   }, [filters.institutionTypeId, institutionTypeOptions])

//   const quarterValue = useMemo(() => {
//     if (!filters.quarterId) return null
//     return quarterOptions.find(opt => opt.value === filters.quarterId)
//   }, [filters.quarterId, quarterOptions])

//   // Dynamic Pie Chart Options using institutionTypeCounts
//   const pieChartOptions = useMemo(() => {
//     // Filter out empty institution names and sort by count
//     const validCounts = institutionTypeCounts
//       .filter(item => item.institutionName && item.institutionName.trim() !== "")
//       .sort((a, b) => b.count - a.count)

//     // Transform to pie chart data format
//     const pieData = validCounts.map(item => ({
//       value: item.count || 0,
//       name: item.institutionName
//     }))

//     // Get unique institution names for legend
//     const legendData = validCounts.map(item => item.institutionName)

//     // Color palette for pie chart
//     const colorPalette = [
//       "#3b5de7", "#45cb85", "#eeb902", "#ff715b", 
//       "#5b2c6f", "#3498db", "#9b59b6", "#1abc9c",
//       "#e74c3c", "#8e44ad", "#f39c12", "#d35400",
//       "#27ae60", "#16a085", "#c0392b", "#7f8c8d"
//     ]

//     return {
//       toolbox: { show: false },
//       tooltip: {
//         trigger: "item",
//         formatter: function(params) {
//           return `${params.name}: ${params.value.toLocaleString()} (${params.percent}%)`
//         },
//       },
//       legend: {
//         orient: "vertical",
//         right: 10,
//         top: "center",
//         data: legendData,
//         textStyle: { color: "#74788d", fontSize: 10 },
//         type: 'scroll'
//       },
//       color: colorPalette.slice(0, Math.min(pieData.length, colorPalette.length)),
//       series: [
//         {
//           name: "DEPARTMENT WISE PLACE OF WORKING",
//           type: "pie",
//           radius: ["50%", "70%"],
//           center: ["35%", "50%"],
//           avoidLabelOverlap: false,
//           itemStyle: {
//             borderRadius: 6,
//             borderColor: "#fff",
//             borderWidth: 2,
//           },
//           label: { 
//             show: false,
//             formatter: '{b}: {c}'
//           },
//           emphasis: {
//             label: {
//               show: true,
//               fontSize: "14",
//               fontWeight: "bold",
//             },
//             scale: true,
//             scaleSize: 10
//           },
//           labelLine: { show: false },
//           data: pieData,
//         },
//       ],
//     }
//   }, [institutionTypeCounts])

//   // Dynamic Bar Chart Options using utilizedResult
//   const barChartOptions = useMemo(() => {
//     // Filter out empty institution names
//     const validResults = utilizedResult
//       .filter(item => item.institutionName && item.institutionName.trim() !== "")
//       .sort((a, b) => b.totalAllocatedBudget - a.totalAllocatedBudget)

//     // Prepare data for bar chart
//     const institutionNames = validResults.map(item => item.institutionName)
//     const allocatedBudgets = validResults.map(item => item.totalAllocatedBudget || 0)
//     const utilizedBudgets = validResults.map(item => item.totalUtilizedBudget || 0)

//     // Calculate utilization percentages
//     const utilizationPercentages = validResults.map(item => {
//       if (item.totalAllocatedBudget === 0) return 0
//       return Math.round((item.totalUtilizedBudget / item.totalAllocatedBudget) * 100)
//     })

//     return {
//       tooltip: {
//         trigger: "axis",
//         axisPointer: { type: "shadow" },
//         formatter: function(params) {
//           let tooltip = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].name}</div>`
//           params.forEach(param => {
//             const value = param.value.toLocaleString('en-IN', {
//               style: 'currency',
//               currency: 'INR',
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 0
//             })
//             tooltip += `<div style="display: flex; align-items: center; margin: 3px 0;">
//               <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 5px; border-radius: 2px;"></span>
//               ${param.seriesName}: <strong>${value}</strong>
//             </div>`
//           })

//           // Add utilization percentage
//           const index = params[0].dataIndex
//           if (utilizationPercentages[index] !== undefined) {
//             tooltip += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
//               <strong>Utilization Rate:</strong> ${utilizationPercentages[index]}%
//             </div>`
//           }

//           return tooltip
//         },
//       },
//       grid: {
//         left: "3%",
//         right: "4%",
//         bottom: "10%",
//         top: "12%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         data: institutionNames,
//         axisLabel: {
//           rotate: institutionNames.length > 5 ? 30 : 0,
//           interval: 0,
//           fontSize: 10,
//           formatter: function(value) {
//             // Truncate long names
//             return value.length > 10 ? value.substring(0, 10) + '...' : value
//           }
//         },
//       },
//       yAxis: {
//         type: "value",
//         name: "Budget Amount (₹)",
//         nameTextStyle: { fontSize: 11 },
//         axisLabel: {
//           formatter: function(value) {
//             if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//             if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//             if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//             return '₹' + value
//           }
//         },
//       },
//       legend: {
//         data: ["Total Allocated Budget", "Total Utilized Budget"],
//         bottom: 0,
//         textStyle: { fontSize: 11 }
//       },
//       series: [
//         {
//           name: "Total Allocated Budget",
//           type: "bar",
//           data: allocatedBudgets,
//           itemStyle: {
//             color: "#3b5de7",
//             borderRadius: [5, 5, 0, 0],
//           },
//           label: {
//             show: true,
//             position: "top",
//             fontSize: 9,
//             fontWeight: "bold",
//             formatter: function(params) {
//               const value = params.value
//               if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//               if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//               if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//               return '₹' + value
//             }
//           },
//           emphasis: {
//             focus: 'series'
//           }
//         },
//         {
//           name: "Total Utilized Budget",
//           type: "bar",
//           data: utilizedBudgets,
//           itemStyle: {
//             color: "#45cb85",
//             borderRadius: [5, 5, 0, 0],
//           },
//           label: {
//             show: true,
//             position: "top",
//             fontSize: 9,
//             fontWeight: "bold",
//             formatter: function(params) {
//               const value = params.value
//               if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//               if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//               if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//               return '₹' + value
//             }
//           },
//           emphasis: {
//             focus: 'series'
//           }
//         }
//       ],
//     }
//   }, [utilizedResult])

//   // Dynamic Line Chart Options using districtWiseResult
//   const lineChartOptions = useMemo(() => {
//     // Filter out null district names and sort by district name
//     const validDistricts = districtWiseResult
//       .filter(item => item.districtName && item.districtName.trim() !== "")
//       .sort((a, b) => a.districtName.localeCompare(b.districtName))

//     // Prepare data for line chart
//     const districtNames = validDistricts.map(item => item.districtName)
//     const allocatedBudgets = validDistricts.map(item => item.totalAllocatedBudget || 0)
//     const utilizedBudgets = validDistricts.map(item => item.totalUtilizedBudget || 0)

//     // Calculate total allocated and utilized for summary
//     const totalAllocated = validDistricts.reduce((sum, item) => sum + (item.totalAllocatedBudget || 0), 0)
//     const totalUtilized = validDistricts.reduce((sum, item) => sum + (item.totalUtilizedBudget || 0), 0)

//     return {
//       tooltip: {
//         trigger: "axis",
//         axisPointer: { type: "shadow" },
//         formatter: function(params) {
//           let tooltip = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].name}</div>`
//           params.forEach(param => {
//             const value = param.value.toLocaleString('en-IN', {
//               style: 'currency',
//               currency: 'INR',
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 0
//             })
//             tooltip += `<div style="display: flex; align-items: center; margin: 3px 0;">
//               <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 5px; border-radius: 2px;"></span>
//               ${param.seriesName}: <strong>${value}</strong>
//             </div>`
//           })

//           // Add utilization percentage
//           const index = params[0].dataIndex
//           const district = validDistricts[index]
//           if (district && district.totalAllocatedBudget > 0) {
//             const utilizationRate = Math.round((district.totalUtilizedBudget / district.totalAllocatedBudget) * 100)
//             tooltip += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
//               <strong>Utilization Rate:</strong> ${utilizationRate}%
//             </div>`
//           }

//           return tooltip
//         },
//       },
//       legend: {
//         data: ["Total Allocated Budget", "Total Utilized Budget"],
//         bottom: 0,
//         textStyle: { fontSize: 11 }
//       },
//       grid: {
//         left: "3%",
//         right: "4%",
//         bottom: "10%",
//         top: "12%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         boundaryGap: false,
//         data: districtNames,
//         axisLabel: {
//           rotate: districtNames.length > 5 ? 30 : 0,
//           interval: 0,
//           fontSize: 10,
//           formatter: function(value) {
//             return value.length > 12 ? value.substring(0, 12) + '...' : value
//           }
//         },
//       },
//       yAxis: {
//         type: "value",
//         name: "Budget Amount (₹)",
//         nameTextStyle: { fontSize: 11 },
//         axisLabel: {
//           formatter: function(value) {
//             if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//             if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//             if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//             return '₹' + value
//           }
//         },
//       },
//       series: [
//         {
//           name: "Total Allocated Budget",
//           type: "line",
//           data: allocatedBudgets,
//           smooth: true,
//           lineStyle: {
//             width: 3,
//           },
//           symbolSize: 6,
//           itemStyle: {
//             color: "#3b5de7",
//           },
//           areaStyle: {
//             color: {
//               type: "linear",
//               x: 0,
//               y: 0,
//               x2: 0,
//               y2: 1,
//               colorStops: [
//                 {
//                   offset: 0,
//                   color: "rgba(59, 93, 231, 0.3)",
//                 },
//                 {
//                   offset: 1,
//                   color: "rgba(59, 93, 231, 0)",
//                 },
//               ],
//             },
//           },
//         },
//         {
//           name: "Total Utilized Budget",
//           type: "line",
//           data: utilizedBudgets,
//           smooth: true,
//           lineStyle: {
//             width: 3,
//           },
//           symbolSize: 6,
//           itemStyle: {
//             color: "#45cb85",
//           },
//           areaStyle: {
//             color: {
//               type: "linear",
//               x: 0,
//               y: 0,
//               x2: 0,
//               y2: 1,
//               colorStops: [
//                 {
//                   offset: 0,
//                   color: "rgba(69, 203, 133, 0.3)",
//                 },
//                 {
//                   offset: 1,
//                   color: "rgba(69, 203, 133, 0)",
//                 },
//               ],
//             },
//           },
//         },
//       ],
//     }
//   }, [districtWiseResult])

//   // Inline Styles
//   const styles = {
//     pageContent: {
//       backgroundColor: "#f8f9fa",
//       minHeight: "100vh",
//       padding: "24px 0",
//     },
//     attendanceCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     attendanceLabel: {
//       fontSize: "11px",
//       fontWeight: "600",
//       color: "#dc3545",
//       textTransform: "uppercase",
//       marginBottom: "6px",
//       letterSpacing: "0.3px",
//     },
//     attendanceValue: {
//       fontSize: "28px",
//       fontWeight: "700",
//       color: "#495057",
//       marginBottom: "0",
//       lineHeight: "1.2",
//     },
//     rightSideCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     dropdown: {
//       width: "48%",
//       padding: "8px 12px",
//       border: "1px solid #ced4da",
//       borderRadius: "6px",
//       fontSize: "13px",
//       fontWeight: "500",
//       backgroundColor: "#fff",
//       cursor: "pointer",
//       outline: "none",
//     },
//     metricBox: {
//       display: "flex",
//       alignItems: "flex-start",  
//       padding: "14px",
//       borderRadius: "8px",
//       backgroundColor: "#f8f9fa",
//       border: "1px solid #e9ecef",
//       height: "100%",
//     },
//     metricIconWrapper: {
//       width: "42px",
//       height: "42px",
//       borderRadius: "50%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       marginRight: "10px",  
//       flexShrink: 0, 
//     },
//     metricValue: {
//       fontSize: "20px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "4px",
//       textAlign: "left",  
//       lineHeight: "1",
//     },
//     metricLabel: {
//       fontSize: "11px",
//       fontWeight: "500",
//       color: "#74788d",
//       marginBottom: "0",
//       textAlign: "left",  
//     },
//     institutionCard: {
//       border: "1px solid #e9ecef",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     institutionHeader: {
//       backgroundColor: "#f8f9fa",
//       borderBottom: "1px solid #e9ecef",
//       padding: "14px 18px",
//     },
//     institutionTitle: {
//       fontSize: "15px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "0",
//     },
//     institutionMetricCard: {
//       border: "1px solid #e9ecef",
//       borderRadius: "6px",
//       backgroundColor: "#f8f9fa",
//       marginBottom: "0",
//       boxShadow: "none",
//     },
//     institutionMetricBody: {
//       padding: "10px",
//     },
//     institutionMetricIcon: {
//       width: "28px",
//       height: "28px",
//       borderRadius: "6px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       flexShrink: 0,
//     },
//     institutionMetricLabel: {
//       fontSize: "10px",
//       fontWeight: "500",
//       color: "#74788d",
//       marginBottom: "3px",
//     },
//     institutionMetricValue: {
//       fontSize: "18px",
//       fontWeight: "700",
//       color: "#495057",
//       marginBottom: "0",
//     },
//     chartCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     chartHeader: {
//       backgroundColor: "#f8f9fa",
//       borderBottom: "1px solid #e9ecef",
//       padding: "14px 18px",
//     },
//     chartTitle: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "0",
//     },
//     loadingOverlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 9999,
//     },
//     loadingSpinner: {
//       textAlign: "center",
//     },
//     skeletonCard: {
//       border: "none",
//       borderRadius: "8px",
//       backgroundColor: "#f8f9fa",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//     filterDropdown: {
//       width: "100%",
//     },
//     selectLabel: {
//       fontSize: "12px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "4px",
//       display: "block",
//     },
//     shimmerContainer: {
//       backgroundColor: "#f8f9fa",
//       minHeight: "100vh",
//       padding: "24px 0",
//     },
//     shimmerCard: {
//       backgroundColor: "#fff",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       marginBottom: "16px",
//       overflow: "hidden",
//     },
//     shimmerLine: {
//       height: "20px",
//       backgroundColor: "#e9ecef",
//       borderRadius: "4px",
//       margin: "16px",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//     shimmerCircle: {
//       height: "42px",
//       width: "42px",
//       backgroundColor: "#e9ecef",
//       borderRadius: "50%",
//       margin: "10px",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//     shimmerChart: {
//       height: "320px",
//       backgroundColor: "#e9ecef",
//       borderRadius: "8px",
//       margin: "16px",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//     filterHeader: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "12px",
//     },
//     clearFiltersBtn: {
//       backgroundColor: "transparent",
//       border: "1px solid #dc3545",
//       color: "#dc3545",
//       fontSize: "12px",
//       padding: "4px 8px",
//       borderRadius: "4px",
//       cursor: "pointer",
//       transition: "all 0.2s ease",
//       "&:hover": {
//         backgroundColor: "#dc3545",
//         color: "#fff",
//       },
//     },
//     validationMessage: {
//       fontSize: "12px",
//       color: "#dc3545",
//       marginTop: "4px",
//       marginBottom: "0",
//     },
//     validationAlert: {
//       backgroundColor: "#f8d7da",
//       border: "1px solid #f5c6cb",
//       borderRadius: "6px",
//       padding: "8px 12px",
//       marginBottom: "12px",
//       fontSize: "12px",
//       color: "#721c24",
//     },
//   }

//   // Color configurations
//   const colors = {
//     primary: { bg: "rgba(59, 93, 231, 0.15)", text: "#3b5de7" },
//     success: { bg: "rgba(69, 203, 133, 0.15)", text: "#45cb85" },
//     warning: { bg: "rgba(238, 185, 2, 0.15)", text: "#eeb902" },
//     danger: { bg: "rgba(255, 113, 91, 0.15)", text: "#ff715b" },
//     info: { bg: "rgba(52, 152, 219, 0.15)", text: "#3498db" },
//   }

//   // Calculate total budgets
//   const totalAllocated = utilizedResult.reduce((sum, item) => sum + (item.totalAllocatedBudget || 0), 0)
//   const totalUtilized = utilizedResult.reduce((sum, item) => sum + (item.totalUtilizedBudget || 0), 0)
//   const overallUtilizationRate = totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0

//   // Calculate district-wise totals
//   const totalDistrictAllocated = districtWiseResult.reduce((sum, item) => sum + (item.totalAllocatedBudget || 0), 0)
//   const totalDistrictUtilized = districtWiseResult.reduce((sum, item) => sum + (item.totalUtilizedBudget || 0), 0)
//   const districtUtilizationRate = totalDistrictAllocated > 0 ? Math.round((totalDistrictUtilized / totalDistrictAllocated) * 100) : 0

//   // Loading Shimmer UI
//   const ShimmerUI = () => (
//     <div className="page-content">
//       <div style={styles.shimmerContainer}>
//         <Container fluid>
//           <Breadcrumbs title="VHIS" breadcrumbItem="Employee Attendance" />

//           {/* Top Section - Attendance Grid Shimmer */}
//           <Row style={{ marginBottom: "20px" }}>
//             {/* Left Side - 6 Attendance Cards */}
//             <Col lg="8" md="12">
//               <Row>
//                 {[1, 2, 3, 4, 5, 6].map((item) => (
//                   <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }} key={item}>
//                     <div style={styles.shimmerCard}>
//                       <div style={{ padding: "16px" }}>
//                         <div style={{...styles.shimmerLine, width: "60%", height: "11px", margin: "0 0 6px 0"}}></div>
//                         <div style={{...styles.shimmerLine, width: "80%", height: "28px", margin: "0"}}></div>
//                       </div>
//                     </div>
//                   </Col>
//                 ))}
//               </Row>
//             </Col>

//             {/* Right Side - Filter Dropdowns with Metrics Shimmer */}
//             <Col lg="4" md="12">
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "16px" }}>
//                   {/* Filter Dropdowns Row */}
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", gap: "10px" }}>
//                     <div style={{...styles.shimmerLine, width: "100%", height: "40px", margin: "0"}}></div>
//                     <div style={{...styles.shimmerLine, width: "100%", height: "40px", margin: "0"}}></div>
//                   </div>

//                   {/* Metrics Grid - 2x2 Layout */}
//                   <Row style={{ rowGap: "7px" }}>
//                     {[1, 2, 3, 4].map((item) => (
//                       <Col xs="6" key={item}>
//                         <div style={styles.metricBox}>
//                           <div style={styles.shimmerCircle}></div>
//                           <div style={{ flex: 1 }}>
//                             <div style={{...styles.shimmerLine, width: "60%", height: "11px", margin: "0 0 4px 0"}}></div>
//                             <div style={{...styles.shimmerLine, width: "80%", height: "20px", margin: "0"}}></div>
//                           </div>
//                         </div>
//                       </Col>
//                     ))}
//                   </Row>
//                 </div>
//               </div>
//             </Col>
//           </Row>

//           {/* Charts Section Shimmer */}
//           <Row style={{ marginBottom: "20px" }}>
//             {/* Pie Chart Shimmer */}
//             <Col lg="5" md="12" style={{ marginBottom: "16px" }}>
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "14px 18px", borderBottom: "1px solid #e9ecef" }}>
//                   <div style={{...styles.shimmerLine, width: "70%", height: "20px", margin: "0"}}></div>
//                 </div>
//                 <div style={{ padding: "16px" }}>
//                   <div style={styles.shimmerChart}></div>
//                 </div>
//               </div>
//             </Col>

//             {/* Bar Chart Shimmer */}
//             <Col lg="7" md="12" style={{ marginBottom: "16px" }}>
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "14px 18px", borderBottom: "1px solid #e9ecef" }}>
//                   <div style={{...styles.shimmerLine, width: "80%", height: "20px", margin: "0"}}></div>
//                 </div>
//                 <div style={{ padding: "16px" }}>
//                   <div style={styles.shimmerChart}></div>
//                 </div>
//               </div>
//             </Col>

//             {/* Line Chart Shimmer */}
//             <Col xl="12" className="mb-2 mt-2">
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "24px" }}>
//                   <div style={{...styles.shimmerLine, width: "40%", height: "24px", margin: "0 0 16px 0"}}></div>
//                   <div style={{...styles.shimmerChart, height: "350px", margin: "0"}}></div>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>

//         {/* CSS Animation for Shimmer */}
//         <style>
//           {`
//             @keyframes pulse {
//               0% { opacity: 0.6; }
//               50% { opacity: 1; }
//               100% { opacity: 0.6; }
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   )

//   // Loading State Component
//   if (loading || filtersLoading) {
//     return <ShimmerUI />
//   }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="VHIS" breadcrumbItem="Employee Attendance" />

//           {Roles?.Dashboardview === true || Roles?.accessAll === true ? (
//             <>
//               {/* Top Section - Attendance Grid */}
//               <Row style={{ marginBottom: "20px" }}>
//                 {/* Left Side - 6 Attendance Cards (2 rows x 3 columns) */}
//                 <Col lg="8" md="12">
//                   <Row>
//                     {/* Row 1 - Top 3 Cards */}
//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Total Employees</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.staff || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Checked In On-Site</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkInsite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={{...styles.attendanceLabel, color: "#dc3545"}}>
//                             checked in Off-Site
//                           </p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkIntimesite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     {/* Row 2 - Bottom 3 Cards */}
//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Absent</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.absentees || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Checked Out On-Site</p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkOutsite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     <Col lg="4" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={{...styles.attendanceLabel, color: "#dc3545"}}>
//                             checked Out Off-Site
//                           </p>
//                           <h2 style={styles.attendanceValue}>
//                             {dashboardData.checkOuttimesite || 0}
//                           </h2>
//                         </CardBody>
//                       </Card>
//                     </Col>
//                   </Row>
//                 </Col>

//                 {/* Right Side - Filter Dropdowns with Metrics */}
//                 <Col lg="4" md="12">
//                   <Card style={styles.rightSideCard}>
//                     <CardBody style={{ padding: "16px" }}>
//                       {/* Filter Header with Clear Button */}
//                       {/* <div style={styles.filterHeader}>
//                         <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#495057" }}>
//                           Filter Dashboard
//                         </h6>

//                       </div> */}

//                       {/* Validation Alert */}
//                       {(!isFormValid && (filters.institutionTypeId || filters.quarterId)) && (
//                         <div style={styles.validationAlert}>
//                           <i className="bx bx-error" style={{ marginRight: "6px" }}></i>
//                           Please fill all required filter fields to see filtered data.
//                         </div>
//                       )}

//                       {/* Filter Dropdowns Row */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           marginBottom: "16px",
//                           gap: "10px",
//                         }}
//                       >
//                         {/* Institution Type Dropdown */}
//                         <div style={styles.filterDropdown}>
//                           <label style={styles.selectLabel}>
//                             Institution Type
//                             <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>
//                           </label>
//                           <Select
//                             name="institutionTypeId"
//                             value={institutionTypeValue}
//                             onChange={handleFilterChange}
//                             onBlur={() => handleFieldBlur("institutionTypeId")}
//                             options={institutionTypeOptions}
//                             styles={selectStyles}
//                             placeholder="Select Institution Type"
//                             isSearchable
//                             isClearable
//                             isLoading={filtersLoading}
//                             required
//                             aria-invalid={!!(validationErrors.institutionTypeId && touchedFields.institutionTypeId)}
//                           />
//                           {validationErrors.institutionTypeId && touchedFields.institutionTypeId && (
//                             <FormFeedback style={{ display: "block", fontSize: "12px" }}>
//                               {validationErrors.institutionTypeId}
//                             </FormFeedback>
//                           )}
//                         </div>

//                         {/* Quarter Dropdown */}
//                         <div style={styles.filterDropdown}>
//                           <label style={styles.selectLabel}>
//                             Quarter
//                             <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>
//                           </label>
//                           <Select
//                             name="quarterId"
//                             value={quarterValue}
//                             onChange={handleFilterChange}
//                             onBlur={() => handleFieldBlur("quarterId")}
//                             options={quarterOptions}
//                             styles={selectStyles}
//                             placeholder="Select Quarter"
//                             isSearchable
//                             isClearable
//                             isLoading={filtersLoading}
//                             required
//                             aria-invalid={!!(validationErrors.quarterId && touchedFields.quarterId)}
//                           />
//                           {validationErrors.quarterId && touchedFields.quarterId && (
//                             <FormFeedback style={{ display: "block", fontSize: "12px" }}>
//                               {validationErrors.quarterId}
//                             </FormFeedback>
//                           )}
//                         </div>
//                       </div>

//                       {/* Metrics Grid - 2x2 Layout */}
//                       {selectedInstitution && isFormValid ? (
//                         <Row style={{ rowGap: "7px" }}>
//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.primary.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-time"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.primary.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Total</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.total?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.info.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-trending-up"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.info.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Progress</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.progress?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.success.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-check-circle"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.success.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Completed</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.completed?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           <Col xs="6">
//                             <div style={styles.metricBox}>
//                               <div
//                                 style={{
//                                   ...styles.metricIconWrapper,
//                                   backgroundColor: colors.warning.bg,
//                                 }}
//                               >
//                                 <i
//                                   className="bx bx-time-five"
//                                   style={{
//                                     fontSize: "20px",
//                                     color: colors.warning.text,
//                                   }}
//                                 ></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Pending</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.pending?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       ) : (
//                         <div style={{ 
//                           textAlign: "center", 
//                           padding: "20px",
//                           color: "#6c757d"
//                         }}>
//                           {!isFormValid && (filters.institutionTypeId || filters.quarterId) ? (
//                             <>
//                               <i className="bx bx-error-circle" style={{ fontSize: "32px", marginBottom: "10px", color: "#dc3545" }}></i>
//                               <p style={{ margin: 0, color: "#dc3545", fontWeight: "500" }}>
//                                 Please complete all filter fields
//                               </p>
//                               <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
//                                 Both Institution Type and Quarter are required
//                               </p>
//                             </>
//                           ) : analyticsData.length === 0 ? (
//                             <>
//                               <i className="bx bx-info-circle" style={{ fontSize: "32px", marginBottom: "10px" }}></i>
//                               <p style={{ margin: 0 }}>
//                                 No institution data available for selected filters
//                               </p>
//                             </>
//                           ) : (
//                             <>
//                               <i className="bx bx-filter-alt" style={{ fontSize: "32px", marginBottom: "10px" }}></i>
//                               <p style={{ margin: 0 }}>
//                                 Please select filters to view institution metrics
//                               </p>
//                               <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
//                                 Both Institution Type and Quarter are required
//                               </p>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* Charts Section */}
//               <Row style={{ marginBottom: "20px" }}>
//                 {/* Pie Chart */}
//                 <Col lg="5" md="12" style={{ marginBottom: "16px" }}>
//                   <Card style={styles.chartCard}>
//                     <CardHeader style={styles.chartHeader}>
//                       <h5 style={styles.chartTitle}>
//                         DEPARTMENT WISE PLACE OF WORKING
//                         {institutionTypeCounts.length > 0 && (
//                           <span style={{ fontSize: "12px", color: "#6c757d", marginLeft: "8px" }}>
//                             (Total: {institutionTypeCounts.reduce((sum, item) => sum + (item.count || 0), 0).toLocaleString()})
//                           </span>
//                         )}
//                       </h5>
//                     </CardHeader>
//                     <CardBody style={{ padding: "16px" }}>
//                       <div style={{ height: "320px", width: "100%" }}>
//                         {institutionTypeCounts.length > 0 ? (
//                           <ReactEcharts
//                             option={pieChartOptions}
//                             style={{ height: "100%", width: "100%" }}
//                             opts={{ renderer: "canvas" }}
//                           />
//                         ) : (
//                           <div style={{ 
//                             display: "flex", 
//                             alignItems: "center", 
//                             justifyContent: "center", 
//                             height: "100%",
//                             color: "#6c757d"
//                           }}>
//                             <div style={{ textAlign: "center" }}>
//                               <i className="bx bx-pie-chart-alt" style={{ fontSize: "48px", marginBottom: "12px" }}></i>
//                               <p>No institution type data available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>

//                 {/* Bar Chart */}
//                 <Col lg="7" md="12" style={{ marginBottom: "16px" }}>
//                   <Card style={styles.chartCard}>
//                     <CardHeader style={styles.chartHeader}>
//                       <h5 style={styles.chartTitle}>
//                         INSTITUTE TYPE WISE BUDGET ALLOCATION & UTILIZATION
//                         {utilizedResult.length > 0 && (
//                           <div style={{ fontSize: "12px", color: "#6c757d", marginTop: "4px" }}>
//                             <span style={{ marginRight: "12px" }}>
//                               Total Allocated: ₹{(totalAllocated / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span style={{ marginRight: "12px" }}>
//                               Total Utilized: ₹{(totalUtilized / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span>
//                               Overall Utilization: {overallUtilizationRate}%
//                             </span>
//                           </div>
//                         )}
//                       </h5>
//                     </CardHeader>
//                     <CardBody style={{ padding: "16px" }}>
//                       <div style={{ height: "320px", width: "100%" }}>
//                         {utilizedResult.length > 0 ? (
//                           <ReactEcharts
//                             option={barChartOptions}
//                             style={{ height: "100%", width: "100%" }}
//                             opts={{ renderer: "canvas" }}
//                           />
//                         ) : (
//                           <div style={{ 
//                             display: "flex", 
//                             alignItems: "center", 
//                             justifyContent: "center", 
//                             height: "100%",
//                             color: "#6c757d"
//                           }}>
//                             <div style={{ textAlign: "center" }}>
//                               <i className="bx bx-bar-chart-alt" style={{ fontSize: "48px", marginBottom: "12px" }}></i>
//                               <p>No budget data available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>

//                 {/* Line Chart */}
//                 <Col xl="12" className="mb-2 mt-2">
//                   <Card className="h-100">
//                     <CardBody>
//                       <h4 className="card-title mb-4">
//                         DISTRICT WISE BUDGET ALLOCATION & UTILIZATION
//                         {districtWiseResult.length > 0 && (
//                           <div style={{ fontSize: "12px", color: "#6c757d", marginTop: "4px" }}>
//                             <span style={{ marginRight: "12px" }}>
//                               Total Allocated: ₹{(totalDistrictAllocated / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span style={{ marginRight: "12px" }}>
//                               Total Utilized: ₹{(totalDistrictUtilized / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span>
//                               Overall Utilization: {districtUtilizationRate}%
//                             </span>
//                           </div>
//                         )}
//                       </h4>
//                       <div style={{ height: "350px" }}>
//                         {districtWiseResult.length > 0 ? (
//                           <ReactEcharts
//                             option={lineChartOptions}
//                             style={{ height: "100%" }}
//                           />
//                         ) : (
//                           <div style={{ 
//                             display: "flex", 
//                             alignItems: "center", 
//                             justifyContent: "center", 
//                             height: "100%",
//                             color: "#6c757d"
//                           }}>
//                             <div style={{ textAlign: "center" }}>
//                               <i className="bx bx-line-chart" style={{ fontSize: "48px", marginBottom: "12px" }}></i>
//                               <p>No district wise data available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>
//             </>
//           ) : (
//             <Row>
//               <Col xs="12">
//                 <Card style={{ textAlign: "center", padding: "40px" }}>
//                   <CardBody>
//                     <i
//                       className="bx bx-lock-alt"
//                       style={{ fontSize: "48px", color: "#74788d" }}
//                     ></i>
//                     <h4 style={{ marginTop: "16px", color: "#495057" }}>Access Denied</h4>
//                     <p style={{ color: "#74788d" }}>
//                       You don't have permission to view this dashboard.
//                     </p>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           )}
//         </Container>
//         <ToastContainer 
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//         />
//       </div>
//     </React.Fragment>
//   )
// }

// export default Dashboard






// import React, { useEffect, useState, useCallback, useMemo } from "react"
// import { Container, Row, Col, Card, CardBody, CardHeader, FormFeedback, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import { ToastContainer, toast } from "react-toastify"
// import ReactEcharts from "echarts-for-react"
// import Select from "react-select"
// import { URLS } from "../../Url"
// import axios from "axios"

// const Dashboard = () => {
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = JSON.parse(GetAuth)
//   const TokenData = TokenJson?.token
//   const Roles = TokenJson?.rolesAndPermission?.[0] ?? { accessAll: true }

//   const [dashboardData, setDashboardData] = useState({})
//   const [analyticsData, setAnalyticsData] = useState([])
//   const [institutionTypeCounts, setInstitutionTypeCounts] = useState([])
//   const [utilizedResult, setUtilizedResult] = useState([])
//   const [districtWiseResult, setDistrictWiseResult] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedInstitution, setSelectedInstitution] = useState(null)

//   // Filter states
//   const [institutionTypeOptions, setInstitutionTypeOptions] = useState([])
//   const [quarterOptions, setQuarterOptions] = useState([])
//   const [filters, setFilters] = useState({
//     institutionTypeId: localStorage.getItem("saved_institutionTypeId") || "",
//     quarterId: localStorage.getItem("saved_quarterId") || "",
//   })

//   // Validation states
//   const [validationErrors, setValidationErrors] = useState({
//     institutionTypeId: "",
//     quarterId: "",
//   })
//   const [touchedFields, setTouchedFields] = useState({
//     institutionTypeId: false,
//     quarterId: false,
//   })
//   const [isFormValid, setIsFormValid] = useState(false)
//   const [filtersLoading, setFiltersLoading] = useState(false)

//   // Filter dropdown menu state
//   const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
//   const [showFilters, setShowFilters] = useState(false)

//   // React Select styles
//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: 40,
//       height: 40,
//       fontSize: 14,
//       borderRadius: 6,
//       borderColor: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//         ? "#dc3545"
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "#dc3545"
//           : state.isFocused ? "#405189" : "#ced4da",
//       boxShadow: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//         ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
//           : state.isFocused
//             ? "0 0 0 0.2rem rgba(64, 81, 137, 0.25)"
//             : "none",
//       transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
//       "&:hover": {
//         borderColor: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//           ? "#dc3545"
//           : validationErrors.quarterId && touchedFields.quarterId
//             ? "#dc3545"
//             : "#b1bbc4",
//       },
//     }),
//     valueContainer: base => ({
//       ...base,
//       padding: "0 8px",
//       height: "100%",
//     }),
//     input: base => ({
//       ...base,
//       margin: 0,
//       padding: 0,
//     }),
//     indicatorsContainer: base => ({
//       ...base,
//       height: 38,
//     }),
//     dropdownIndicator: base => ({
//       ...base,
//       padding: "4px 8px",
//     }),
//     clearIndicator: base => ({
//       ...base,
//       padding: "4px 8px",
//     }),
//     indicatorSeparator: base => ({
//       ...base,
//       marginTop: 8,
//       marginBottom: 8,
//     }),
//     option: (base, state) => ({
//       ...base,
//       fontSize: 14,
//       padding: "8px 12px",
//       backgroundColor: state.isSelected
//         ? "#2362c8"
//         : state.isFocused
//           ? "#f8f9fa"
//           : "white",
//       color: state.isSelected ? "white" : "#212529",
//       "&:active": {
//         backgroundColor: "#2362c8",
//         color: "white",
//       },
//     }),
//     placeholder: base => ({
//       ...base,
//       fontSize: 14,
//       color: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//         ? "#dc3545"
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "#dc3545"
//           : "#6c757d",
//     }),
//     singleValue: base => ({
//       ...base,
//       color: validationErrors.institutionTypeId && touchedFields.institutionTypeId
//         ? "#dc3545"
//         : validationErrors.quarterId && touchedFields.quarterId
//           ? "#dc3545"
//           : "#212529",
//     }),
//   }

//   // Validation rules
//   const validateField = (name, value) => {
//     let error = ""

//     switch (name) {
//       case "institutionTypeId":
//         if (!value) {
//           error = "Institution Type is required"
//         }
//         break
//       case "quarterId":
//         if (!value) {
//           error = "Quarter is required"
//         }
//         break
//       default:
//         break
//     }

//     return error
//   }

//   // Validate all fields
//   const validateForm = useCallback(() => {
//     const errors = {
//       institutionTypeId: validateField("institutionTypeId", filters.institutionTypeId),
//       quarterId: validateField("quarterId", filters.quarterId),
//     }

//     setValidationErrors(errors)

//     // Form is valid if no errors
//     const isValid = !errors.institutionTypeId && !errors.quarterId
//     setIsFormValid(isValid)

//     return isValid
//   }, [filters])

//   // Handle field blur
//   const handleFieldBlur = (fieldName) => {
//     setTouchedFields(prev => ({
//       ...prev,
//       [fieldName]: true,
//     }))

//     // Validate the field
//     const error = validateField(fieldName, filters[fieldName])
//     setValidationErrors(prev => ({
//       ...prev,
//       [fieldName]: error,
//     }))
//   }

//   // Fetch Institution Types
//   const fetchInstitutionTypes = useCallback(async () => {
//     try {
//       setFiltersLoading(true)
//       const response = await axios.get(URLS.GetEmploymentType, {
//         headers: { Authorization: `Bearer ${TokenData}` },
//         timeout: 15000,
//       })

//       if (response.data?.data) {
//         const employmentTypes = response.data.data.map(type => ({
//           value: type._id,
//           label: type.name,
//         }))
//         setInstitutionTypeOptions(employmentTypes)
//       }
//     } catch (error) {
//       console.error("Error fetching institution types:", error)
//       toast.error("Failed to load institution types")
//     } finally {
//       setFiltersLoading(false)
//     }
//   }, [TokenData])

//   // Fetch Quarters
//   const fetchQuarters = useCallback(async () => {
//     try {
//       setFiltersLoading(true)
//       const response = await axios.post(URLS.GetQuarter, {}, {
//         headers: { Authorization: `Bearer ${TokenData}` },
//         timeout: 15000,
//       })

//       if (response.data?.data) {
//         const quartersData = response.data.data.map(quarter => ({
//           value: quarter._id,
//           label: quarter.quarter,
//         }))
//         setQuarterOptions(quartersData)
//       }
//     } catch (error) {
//       console.error("Error fetching quarters:", error)
//       toast.error("Failed to load quarters")
//     } finally {
//       setFiltersLoading(false)
//     }
//   }, [TokenData])

//   // Fetch Dashboard Data with Filters
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       setLoading(true)

//       // Prepare request data
//       const requestData = {}
//       if (filters.institutionTypeId) {
//         requestData.institutionTypeId = filters.institutionTypeId
//       }
//       if (filters.quarterId) {
//         requestData.quarterId = filters.quarterId
//       }

//       const response = await axios.post(
//         URLS.getDashboard,
//         requestData,
//         {
//           headers: { Authorization: `Bearer ${TokenData}` },
//         }
//       )

//       const responseData = response?.data || {}
//       setDashboardData(responseData)

//       // Handle analytics data
//       const analytics = responseData.analytics || []
//       setAnalyticsData(analytics)

//       // Handle institution type counts for pie chart
//       const counts = responseData.institutionTypeCounts || []
//       setInstitutionTypeCounts(counts)

//       // Handle utilized result for bar chart
//       const utilized = responseData.utilizedResult || []
//       setUtilizedResult(utilized)

//       // Handle district wise result for line chart
//       const districtWise = responseData.districtWiseResult || []
//       setDistrictWiseResult(districtWise)

//       if (analytics.length > 0) {
//         setSelectedInstitution(analytics[0])
//       } else {
//         setSelectedInstitution(null)
//       }

//     } catch (error) {
//       console.error("Error fetching dashboard data:", error)
//       toast.error("Failed to load dashboard data")
//       setAnalyticsData([])
//       setInstitutionTypeCounts([])
//       setUtilizedResult([])
//       setDistrictWiseResult([])
//       setSelectedInstitution(null)
//     } finally {
//       setLoading(false)
//     }
//   }, [TokenData, filters])

//   // Initialize filters data
//   useEffect(() => {
//     const initializeFilters = async () => {
//       await Promise.all([
//         fetchInstitutionTypes(),
//         fetchQuarters()
//       ])
//     }
//     initializeFilters()
//   }, [fetchInstitutionTypes, fetchQuarters])

//   // Validate form when filters change
//   useEffect(() => {
//     validateForm()
//   }, [filters, validateForm])

//   // Fetch dashboard data when filters are valid
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchDashboardData()
//     }, 300) // Debounce

//     return () => clearTimeout(timer)
//   }, [filters, fetchDashboardData])

//   // Handle filter changes
//   const handleFilterChange = (selectedOption, { name }) => {
//     const value = selectedOption?.value || ""

//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }))

//     // Mark field as touched
//     setTouchedFields(prev => ({
//       ...prev,
//       [name]: true,
//     }))

//     // Validate the field
//     const error = validateField(name, value)
//     setValidationErrors(prev => ({
//       ...prev,
//       [name]: error,
//     }))

//     // Save to localStorage
//     if (value) {
//       localStorage.setItem(`saved_${name}`, value)
//     } else {
//       localStorage.removeItem(`saved_${name}`)
//     }
//   }

//   // Toggle filter dropdown
//   const toggleFilterDropdown = () => {
//     setFilterDropdownOpen(prev => !prev)
//   }

//   // Toggle filters visibility
//   const toggleFiltersVisibility = () => {
//     setShowFilters(prev => !prev)
//     setFilterDropdownOpen(false)
//   }

//   // Clear all filters
//   const handleClearFilters = () => {
//     setFilters({
//       institutionTypeId: "",
//       quarterId: "",
//     })
//     setTouchedFields({
//       institutionTypeId: false,
//       quarterId: false,
//     })
//     setValidationErrors({
//       institutionTypeId: "",
//       quarterId: "",
//     })
//     localStorage.removeItem("saved_institutionTypeId")
//     localStorage.removeItem("saved_quarterId")
//     setFilterDropdownOpen(false)
//   }

//   // Apply filters
//   const handleApplyFilters = () => {
//     // Validate form before applying
//     const isValid = validateForm()
//     if (isValid) {
//       // Close the filter panel if form is valid
//       setShowFilters(false)
//     }
//   }

//   const handleInstitutionChange = (e) => {
//     const selected = analyticsData.find(
//       (inst) => inst.institutionName === e.target.value
//     )
//     setSelectedInstitution(selected)
//   }

//   // Memoized filter values for React Select
//   const institutionTypeValue = useMemo(() => {
//     if (!filters.institutionTypeId) return null
//     return institutionTypeOptions.find(opt => opt.value === filters.institutionTypeId)
//   }, [filters.institutionTypeId, institutionTypeOptions])

//   const quarterValue = useMemo(() => {
//     if (!filters.quarterId) return null
//     return quarterOptions.find(opt => opt.value === filters.quarterId)
//   }, [filters.quarterId, quarterOptions])

//   // Dynamic Pie Chart Options using institutionTypeCounts
//   const pieChartOptions = useMemo(() => {
//     // Filter out empty institution names and sort by count
//     const validCounts = institutionTypeCounts
//       .filter(item => item.institutionName && item.institutionName.trim() !== "")
//       .sort((a, b) => b.count - a.count)

//     // Transform to pie chart data format
//     const pieData = validCounts.map(item => ({
//       value: item.count || 0,
//       name: `${item.institutionName} (${item.count})`  // ✅ CHANGED: Added count to name
//     }))

//     // Get unique institution names for legend
//     const legendData = validCounts.map(item => `${item.institutionName} (${item.count})`)  // ✅ CHANGED: Added count to legend

//     // Color palette for pie chart
//     const colorPalette = [
//       "#3b5de7", "#45cb85", "#eeb902", "#ff715b",
//       "#5b2c6f", "#3498db", "#9b59b6", "#1abc9c",
//       "#e74c3c", "#8e44ad", "#f39c12", "#d35400",
//       "#27ae60", "#16a085", "#c0392b", "#7f8c8d"
//     ]

//     return {
//       toolbox: { show: false },
//       tooltip: {
//         trigger: "item",
//         formatter: function (params) {
//           return `${params.name}: ${params.value.toLocaleString()} (${params.percent}%)`
//         },
//       },
//       legend: {
//         orient: "vertical",
//         right: 10,
//         top: "center",
//         data: legendData,
//         textStyle: { color: "#74788d", fontSize: 10 },
//         type: 'scroll'
//       },
//       color: colorPalette.slice(0, Math.min(pieData.length, colorPalette.length)),
//       series: [
//         {
//           name: "DEPARTMENT WISE PLACE OF WORKING",
//           type: "pie",
//           radius: ["50%", "70%"],
//           center: ["35%", "50%"],
//           avoidLabelOverlap: false,
//           itemStyle: {
//             borderRadius: 6,
//             borderColor: "#fff",
//             borderWidth: 2,
//           },
//           label: {
//             show: false,
//             formatter: '{b}: {c}'
//           },
//           emphasis: {
//             label: {
//               show: true,
//               fontSize: "14",
//               fontWeight: "bold",
//             },
//             scale: true,
//             scaleSize: 10
//           },
//           labelLine: { show: false },
//           data: pieData,
//         },
//       ],
//     }
//   }, [institutionTypeCounts])

//   // Dynamic Bar Chart Options using utilizedResult
//   const barChartOptions = useMemo(() => {
//     // Filter out empty institution names
//     const validResults = utilizedResult
//       .filter(item => item.institutionName && item.institutionName.trim() !== "")
//       .sort((a, b) => b.totalAllocatedBudget - a.totalAllocatedBudget)

//     // Prepare data for bar chart
//     const institutionNames = validResults.map(item => item.institutionName)
//     const allocatedBudgets = validResults.map(item => item.totalAllocatedBudget || 0)
//     const utilizedBudgets = validResults.map(item => item.totalUtilizedBudget || 0)

//     // Calculate utilization percentages
//     const utilizationPercentages = validResults.map(item => {
//       if (item.totalAllocatedBudget === 0) return 0
//       return Math.round((item.totalUtilizedBudget / item.totalAllocatedBudget) * 100)
//     })

//     return {
//       tooltip: {
//         trigger: "axis",
//         axisPointer: { type: "shadow" },
//         formatter: function (params) {
//           let tooltip = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].name}</div>`
//           params.forEach(param => {
//             const value = param.value.toLocaleString('en-IN', {
//               style: 'currency',
//               currency: 'INR',
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 0
//             })
//             tooltip += `<div style="display: flex; align-items: center; margin: 3px 0;">
//               <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 5px; border-radius: 2px;"></span>
//               ${param.seriesName}: <strong>${value}</strong>
//             </div>`
//           })

//           // Add utilization percentage
//           const index = params[0].dataIndex
//           if (utilizationPercentages[index] !== undefined) {
//             tooltip += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
//               <strong>Utilization Rate:</strong> ${utilizationPercentages[index]}%
//             </div>`
//           }

//           return tooltip
//         },
//       },
//       grid: {
//         left: "3%",
//         right: "4%",
//         bottom: "10%",
//         top: "12%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         data: institutionNames,
//         axisLabel: {
//           rotate: institutionNames.length > 5 ? 30 : 0,
//           interval: 0,
//           fontSize: 10,
//           formatter: function (value) {
//             // Truncate long names
//             return value.length > 10 ? value.substring(0, 10) + '...' : value
//           }
//         },
//       },
//       yAxis: {
//         type: "value",
//         name: "Budget Amount (₹)",
//         nameTextStyle: { fontSize: 11 },
//         axisLabel: {
//           formatter: function (value) {
//             if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//             if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//             if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//             return '₹' + value
//           }
//         },
//       },
//       legend: {
//         data: ["Total Allocated Budget", "Total Utilized Budget"],
//         bottom: 0,
//         textStyle: { fontSize: 11 }
//       },
//       series: [
//         {
//           name: "Total Allocated Budget",
//           type: "bar",
//           data: allocatedBudgets,
//           itemStyle: {
//             color: "#3b5de7",
//             borderRadius: [5, 5, 0, 0],
//           },
//           label: {
//             show: true,
//             position: "top",
//             fontSize: 9,
//             fontWeight: "bold",
//             formatter: function (params) {
//               const value = params.value
//               if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//               if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//               if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//               return '₹' + value
//             }
//           },
//           emphasis: {
//             focus: 'series'
//           }
//         },
//         {
//           name: "Total Utilized Budget",
//           type: "bar",
//           data: utilizedBudgets,
//           itemStyle: {
//             color: "#45cb85",
//             borderRadius: [5, 5, 0, 0],
//           },
//           label: {
//             show: true,
//             position: "top",
//             fontSize: 9,
//             fontWeight: "bold",
//             formatter: function (params) {
//               const value = params.value
//               if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//               if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//               if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//               return '₹' + value
//             }
//           },
//           emphasis: {
//             focus: 'series'
//           }
//         }
//       ],
//     }
//   }, [utilizedResult])

//   // Dynamic Line Chart Options using districtWiseResult
//   const lineChartOptions = useMemo(() => {
//     // Filter out null district names and sort by district name
//     const validDistricts = districtWiseResult
//       .filter(item => item.districtName && item.districtName.trim() !== "")
//       .sort((a, b) => a.districtName.localeCompare(b.districtName))

//     // Prepare data for line chart
//     const districtNames = validDistricts.map(item => item.districtName)
//     const allocatedBudgets = validDistricts.map(item => item.totalAllocatedBudget || 0)
//     const utilizedBudgets = validDistricts.map(item => item.totalUtilizedBudget || 0)

//     return {
//       tooltip: {
//         trigger: "axis",
//         axisPointer: { type: "shadow" },
//         formatter: function (params) {
//           let tooltip = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].name}</div>`
//           params.forEach(param => {
//             const value = param.value.toLocaleString('en-IN', {
//               style: 'currency',
//               currency: 'INR',
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 0
//             })
//             tooltip += `<div style="display: flex; align-items: center; margin: 3px 0;">
//               <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 5px; border-radius: 2px;"></span>
//               ${param.seriesName}: <strong>${value}</strong>
//             </div>`
//           })

//           // Add utilization percentage
//           const index = params[0].dataIndex
//           const district = validDistricts[index]
//           if (district && district.totalAllocatedBudget > 0) {
//             const utilizationRate = Math.round((district.totalUtilizedBudget / district.totalAllocatedBudget) * 100)
//             tooltip += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
//               <strong>Utilization Rate:</strong> ${utilizationRate}%
//             </div>`
//           }

//           return tooltip
//         },
//       },
//       legend: {
//         data: ["Total Allocated Budget", "Total Utilized Budget"],
//         bottom: 0,
//         textStyle: { fontSize: 11 }
//       },
//       grid: {
//         left: "3%",
//         right: "4%",
//         bottom: "10%",
//         top: "12%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         boundaryGap: false,
//         data: districtNames,
//         axisLabel: {
//           rotate: districtNames.length > 5 ? 30 : 0,
//           interval: 0,
//           fontSize: 10,
//           formatter: function (value) {
//             return value.length > 12 ? value.substring(0, 12) + '...' : value
//           }
//         },
//       },
//       yAxis: {
//         type: "value",
//         name: "Budget Amount (₹)",
//         nameTextStyle: { fontSize: 11 },
//         axisLabel: {
//           formatter: function (value) {
//             if (value >= 10000000) return '₹' + (value / 10000000).toFixed(1) + 'Cr'
//             if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L'
//             if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'K'
//             return '₹' + value
//           }
//         },
//       },
//       series: [
//         {
//           name: "Total Allocated Budget",
//           type: "line",
//           data: allocatedBudgets,
//           smooth: true,
//           lineStyle: {
//             width: 3,
//           },
//           symbolSize: 6,
//           itemStyle: {
//             color: "#3b5de7",
//           },
//           areaStyle: {
//             color: {
//               type: "linear",
//               x: 0,
//               y: 0,
//               x2: 0,
//               y2: 1,
//               colorStops: [
//                 {
//                   offset: 0,
//                   color: "rgba(59, 93, 231, 0.3)",
//                 },
//                 {
//                   offset: 1,
//                   color: "rgba(59, 93, 231, 0)",
//                 },
//               ],
//             },
//           },
//         },
//         {
//           name: "Total Utilized Budget",
//           type: "line",
//           data: utilizedBudgets,
//           smooth: true,
//           lineStyle: {
//             width: 3,
//           },
//           symbolSize: 6,
//           itemStyle: {
//             color: "#45cb85",
//           },
//           areaStyle: {
//             color: {
//               type: "linear",
//               x: 0,
//               y: 0,
//               x2: 0,
//               y2: 1,
//               colorStops: [
//                 {
//                   offset: 0,
//                   color: "rgba(69, 203, 133, 0.3)",
//                 },
//                 {
//                   offset: 1,
//                   color: "rgba(69, 203, 133, 0)",
//                 },
//               ],
//             },
//           },
//         },
//       ],
//     }
//   }, [districtWiseResult])

//   // Inline Styles
//   const styles = {
//     pageContent: {
//       backgroundColor: "#f8f9fa",
//       minHeight: "100vh",
//       padding: "24px 0",
//     },
//     attendanceCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     attendanceLabel: {
//       fontSize: "11px",
//       fontWeight: "600",
//       color: "#dc3545",
//       textTransform: "uppercase",
//       marginBottom: "6px",
//       letterSpacing: "0.3px",
//     },
//     attendanceValue: {
//       fontSize: "28px",
//       fontWeight: "700",
//       color: "#495057",
//       marginBottom: "0",
//       lineHeight: "1.2",
//     },
//     metricsCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       backgroundColor: "#fff",
//       position: "relative",
//     },
//     metricBox: {
//       display: "flex",
//       alignItems: "center",
//       padding: "14px",
//       borderRadius: "8px",
//       backgroundColor: "#f8f9fa",
//       border: "1px solid #e9ecef",
//       height: "100%",
//     },
//     metricIconWrapper: {
//       width: "42px",
//       height: "42px",
//       borderRadius: "50%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       marginRight: "10px",
//       flexShrink: 0,
//     },
//     metricValue: {
//       fontSize: "20px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "4px",
//       textAlign: "left",
//       lineHeight: "1",
//     },
//     metricLabel: {
//       fontSize: "11px",
//       fontWeight: "500",
//       color: "#74788d",
//       marginBottom: "0",
//       textAlign: "left",
//     },
//     chartCard: {
//       border: "none",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       height: "100%",
//       backgroundColor: "#fff",
//     },
//     chartHeader: {
//       backgroundColor: "#f8f9fa",
//       borderBottom: "1px solid #e9ecef",
//       padding: "14px 18px",
//     },
//     chartTitle: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "0",
//     },
//     selectLabel: {
//       fontSize: "12px",
//       fontWeight: "600",
//       color: "#495057",
//       marginBottom: "4px",
//       display: "block",
//     },
//     shimmerContainer: {
//       backgroundColor: "#f8f9fa",
//       minHeight: "100vh",
//       padding: "24px 0",
//     },
//     shimmerCard: {
//       backgroundColor: "#fff",
//       borderRadius: "8px",
//       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//       marginBottom: "16px",
//       overflow: "hidden",
//     },
//     shimmerLine: {
//       height: "20px",
//       backgroundColor: "#e9ecef",
//       borderRadius: "4px",
//       margin: "16px",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//     shimmerCircle: {
//       height: "42px",
//       width: "42px",
//       backgroundColor: "#e9ecef",
//       borderRadius: "50%",
//       margin: "10px",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//     shimmerChart: {
//       height: "320px",
//       backgroundColor: "#e9ecef",
//       borderRadius: "8px",
//       margin: "16px",
//       animation: "pulse 1.5s ease-in-out infinite",
//     },
//     filterHeader: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "12px",
//     },
//     validationAlert: {
//       backgroundColor: "#f8d7da",
//       border: "1px solid #f5c6cb",
//       borderRadius: "6px",
//       padding: "8px 12px",
//       marginBottom: "12px",
//       fontSize: "12px",
//       color: "#721c24",
//     },
//     filtersSection: {
//       backgroundColor: "#f8f9fa",
//       border: "1px solid #e9ecef",
//       borderRadius: "6px",
//       padding: "16px",
//       marginTop: "16px",
//     },
//     filterActions: {
//       display: "flex",
//       justifyContent: "flex-end",
//       gap: "8px",
//       marginTop: "12px",
//     },
//     actionButton: {
//       padding: "6px 12px",
//       borderRadius: "4px",
//       border: "none",
//       fontSize: "12px",
//       fontWeight: "500",
//       cursor: "pointer",
//       transition: "all 0.2s ease",
//     },
//     clearButton: {
//       backgroundColor: "transparent",
//       border: "1px solid #dc3545",
//       color: "#dc3545",
//     },
//     applyButton: {
//       backgroundColor: "#3b5de7",
//       color: "white",
//       border: "1px solid #3b5de7",
//     },
//     threeDotMenu: {
//       position: "absolute",
//       top: "14px",
//       right: "14px",
//       cursor: "pointer",
//       zIndex: 10, // Increased z-index
//     },
//     dropdownMenu: {
//       minWidth: "200px",
//       padding: "8px",
//       borderRadius: "6px",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
//       zIndex: 9999, // Very high z-index to ensure it appears above everything
//       position: "fixed", // Changed to fixed for better control
//       marginTop: "5px",
//     },
//     dropdownItem: {
//       fontSize: "13px",
//       padding: "8px 12px",
//       borderRadius: "4px",
//       display: "flex",
//       alignItems: "center",
//       gap: "8px",
//       "&:hover": {
//         backgroundColor: "#f8f9fa",
//       },
//     },
//     activeFilterIndicator: {
//       display: "inline-flex",
//       alignItems: "center",
//       justifyContent: "center",
//       width: "18px",
//       height: "18px",
//       backgroundColor: "#3b5de7",
//       color: "white",
//       borderRadius: "50%",
//       fontSize: "10px",
//       marginLeft: "8px",
//     },
//     noDataMessage: {
//       textAlign: "center",
//       padding: "40px",
//       color: "#6c757d",
//     },
//   }

//   // Color configurations
//   const colors = {
//     primary: { bg: "rgba(59, 93, 231, 0.15)", text: "#3b5de7" },
//     success: { bg: "rgba(69, 203, 133, 0.15)", text: "#45cb85" },
//     warning: { bg: "rgba(238, 185, 2, 0.15)", text: "#eeb902" },
//     danger: { bg: "rgba(255, 113, 91, 0.15)", text: "#ff715b" },
//     info: { bg: "rgba(52, 152, 219, 0.15)", text: "#3498db" },
//   }

//   // Calculate total budgets
//   const totalAllocated = utilizedResult.reduce((sum, item) => sum + (item.totalAllocatedBudget || 0), 0)
//   const totalUtilized = utilizedResult.reduce((sum, item) => sum + (item.totalUtilizedBudget || 0), 0)
//   const overallUtilizationRate = totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0

//   // Calculate district-wise totals
//   const totalDistrictAllocated = districtWiseResult.reduce((sum, item) => sum + (item.totalAllocatedBudget || 0), 0)
//   const totalDistrictUtilized = districtWiseResult.reduce((sum, item) => sum + (item.totalUtilizedBudget || 0), 0)
//   const districtUtilizationRate = totalDistrictAllocated > 0 ? Math.round((totalDistrictUtilized / totalDistrictAllocated) * 100) : 0

//   // Loading Shimmer UI
//   const ShimmerUI = () => (
//     <div className="page-content">
//       <div style={styles.shimmerContainer}>
//         <Container fluid>
//           <Breadcrumbs title="VHIS" breadcrumbItem="Employee Attendance" />

//           {/* Attendance Cards Shimmer */}
//           <Row style={{ marginBottom: "20px" }}>
//             <Col lg="12">
//               <Row>
//                 {[1, 2, 3, 4, 5, 6].map((item) => (
//                   <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }} key={item}>
//                     <div style={styles.shimmerCard}>
//                       <div style={{ padding: "16px" }}>
//                         <div style={{ ...styles.shimmerLine, width: "60%", height: "11px", margin: "0 0 6px 0" }}></div>
//                         <div style={{ ...styles.shimmerLine, width: "80%", height: "28px", margin: "0" }}></div>
//                       </div>
//                     </div>
//                   </Col>
//                 ))}
//               </Row>
//             </Col>
//           </Row>

//           {/* Metrics Shimmer */}
//           <Row style={{ marginBottom: "20px" }}>
//             <Col lg="12">
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "16px" }}>
//                   <Row style={{ rowGap: "12px" }}>
//                     {[1, 2, 3, 4].map((item) => (
//                       <Col lg="3" md="6" xs="6" key={item}>
//                         <div style={styles.metricBox}>
//                           <div style={styles.shimmerCircle}></div>
//                           <div style={{ flex: 1 }}>
//                             <div style={{ ...styles.shimmerLine, width: "60%", height: "11px", margin: "0 0 4px 0" }}></div>
//                             <div style={{ ...styles.shimmerLine, width: "80%", height: "20px", margin: "0" }}></div>
//                           </div>
//                         </div>
//                       </Col>
//                     ))}
//                   </Row>
//                 </div>
//               </div>
//             </Col>
//           </Row>

//           {/* Charts Section Shimmer */}
//           {/* <Row style={{ marginBottom: "20px" }}> */}
//           {/* Pie Chart Shimmer */}
//           {/* <Col lg="5" md="12" style={{ marginBottom: "16px" }}>
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "14px 18px", borderBottom: "1px solid #e9ecef" }}>
//                   <div style={{...styles.shimmerLine, width: "70%", height: "20px", margin: "0"}}></div>
//                 </div>
//                 <div style={{ padding: "16px" }}>
//                   <div style={styles.shimmerChart}></div>
//                 </div>
//               </div>
//             </Col> */}

//           {/* Bar Chart Shimmer */}
//           {/* <Col lg="7" md="12" style={{ marginBottom: "16px" }}>
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "14px 18px", borderBottom: "1px solid #e9ecef" }}>
//                   <div style={{...styles.shimmerLine, width: "80%", height: "20px", margin: "0"}}></div>
//                 </div>
//                 <div style={{ padding: "16px" }}>
//                   <div style={styles.shimmerChart}></div>
//                 </div>
//               </div>
//             </Col> */}

//           {/* Line Chart Shimmer */}
//           {/* <Col xl="12" className="mb-2 mt-2">
//               <div style={styles.shimmerCard}>
//                 <div style={{ padding: "24px" }}>
//                   <div style={{...styles.shimmerLine, width: "40%", height: "24px", margin: "0 0 16px 0"}}></div>
//                   <div style={{...styles.shimmerChart, height: "350px", margin: "0"}}></div>
//                 </div>
//               </div>
//             </Col> */}
//           {/* </Row> */}
//         </Container>

//         {/* CSS Animation for Shimmer */}
//         <style>
//           {`
//             @keyframes pulse {
//               0% { opacity: 0.6; }
//               50% { opacity: 1; }
//               100% { opacity: 0.6; }
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   )

//   // Loading State Component
//   if (loading || filtersLoading) {
//     return <ShimmerUI />
//   }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs title="VHIS" breadcrumbItem="Employee Attendance" />

//           {Roles?.Dashboardview === true || Roles?.accessAll === true ? (
//             <>
//               {/* ATTENDANCE CARDS - AT THE TOP */}
//               <Row style={{ marginBottom: "20px" }}>
//                 <Col lg="12">
//                   <Row>
//                     {/* Total Employees */}
//                     <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Total Employees</p>
//                           <h2 style={styles.attendanceValue}>{dashboardData.staff || 0}</h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     {/* Checked In On-Site */}
//                     <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Present </p>
//                           <h2 style={styles.attendanceValue}>{dashboardData.checkInsite || 0}</h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     {/* Absent */}
//                     <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Absent</p>
//                           <h2 style={styles.attendanceValue}>{dashboardData.absentees || 0}</h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     {/* Checked In Off-Site */}
//                     <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={{ ...styles.attendanceLabel, color: "#dc3545" }}>In Leave</p>
//                           <h2 style={styles.attendanceValue}>{dashboardData.checkIntimesite || 0}</h2>
//                         </CardBody>
//                       </Card>
//                     </Col>



//                     {/* Checked Out On-Site */}
//                     <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={styles.attendanceLabel}>Case Treated</p>
//                           <h2 style={styles.attendanceValue}>{dashboardData.checkOutsite || 0}</h2>
//                         </CardBody>
//                       </Card>
//                     </Col>

//                     {/* Checked Out Off-Site */}
//                     <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={{ ...styles.attendanceLabel, color: "#dc3545" }}>Fodder</p>
//                           <h2 style={styles.attendanceValue}>{dashboardData.checkOuttimesite || 0}</h2>
//                         </CardBody>
//                       </Card>
//                     </Col>


//                     {/* <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }}>
//                       <Card style={styles.attendanceCard}>
//                         <CardBody style={{ padding: "16px" }}>
//                           <p style={{ ...styles.attendanceLabel, color: "#dc3545" }}>AI</p>
//                           <h2 style={styles.attendanceValue}>{dashboardData.checkOuttimesite || 0}</h2>
//                         </CardBody>
//                       </Card>
//                     </Col> */}
//                   </Row>
//                 </Col>
//               </Row>

//               {/* METRICS SECTION WITH THREE-DOT MENU */}
//               <Row style={{ marginBottom: "20px" }}>
//                 <Col lg="12">
//                   <Card style={styles.metricsCard}>
//                     <CardBody style={{ padding: "16px", position: "relative" }}>
//                       {/* Header with Three-Dot Menu */}
//                       <div style={styles.filterHeader}>
//                         <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#495057", marginBottom: "8px" }}>
//                           Institution Metrics
//                           {/* {(filters.institutionTypeId || filters.quarterId) && (
//                             <span style={styles.activeFilterIndicator}>
//                               <i className="bx bx-filter-alt"></i>
//                             </span>
//                           )} */}
//                         </h6>

//                         {/* Three-Dot Menu - Fixed positioning */}
//                         <div style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           position: "absolute",
//                           top: "14px",
//                           right: "14px",
//                         }}>
//                           {/* Clear Filters Button (only when filters are applied) */}
//                           {/* {(filters.institutionTypeId || filters.quarterId) && (
//                             <button
//                               onClick={handleClearFilters}
//                               style={{
//                                 backgroundColor: "transparent",
//                                 border: "1px solid #dc3545",
//                                 color: "#dc3545",
//                                 padding: "4px 8px",
//                                 borderRadius: "4px",
//                                 fontSize: "12px",
//                                 fontWeight: "500",
//                                 cursor: "pointer",
//                                 transition: "all 0.2s ease",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "4px",
//                                 height: "32px",
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.backgroundColor = "#dc3545"
//                                 e.currentTarget.style.color = "#fff"
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.backgroundColor = "transparent"
//                                 e.currentTarget.style.color = "#dc3545"
//                               }}
//                             >
//                               <i className="bx bx-x" style={{ fontSize: "16px" }}></i>
//                               Clear 
//                             </button>
//                           )} */}

//                           {/* Filter Toggle Button */}
//                           <button
//                             onClick={toggleFiltersVisibility}
//                             style={{
//                               backgroundColor: showFilters ? "#3b5de7" : "transparent",
//                               border: `1px solid ${showFilters ? "#3b5de7" : "#6c757d"}`,
//                               color: showFilters ? "#fff" : "#6c757d",
//                               width: "32px",
//                               height: "32px",
//                               borderRadius: "50%",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               cursor: "pointer",
//                               transition: "all 0.2s ease",
//                             }}
//                             onMouseEnter={(e) => {
//                               if (!showFilters) {
//                                 e.currentTarget.style.backgroundColor = "#f8f9fa"
//                                 e.currentTarget.style.borderColor = "#3b5de7"
//                                 e.currentTarget.style.color = "#3b5de7"
//                               }
//                             }}
//                             onMouseLeave={(e) => {
//                               if (!showFilters) {
//                                 e.currentTarget.style.backgroundColor = "transparent"
//                                 e.currentTarget.style.borderColor = "#6c757d"
//                                 e.currentTarget.style.color = "#6c757d"
//                               }
//                             }}
//                             title={showFilters ? "Hide Filters" : "Show Filters"}
//                           >
//                             <i className="bx bx-filter-alt" style={{ fontSize: "18px" }}></i>
//                           </button>
//                         </div>
//                       </div>

//                       {/* Validation Alert */}
//                       {!isFormValid && (filters.institutionTypeId || filters.quarterId) && (
//                         <div style={styles.validationAlert}>
//                           <i className="bx bx-error" style={{ marginRight: "6px" }}></i>
//                           Please fill all required filter fields to see filtered data.
//                         </div>
//                       )}

//                       {/* Filters Section (Conditional) */}
//                       {showFilters && (
//                         <div style={styles.filtersSection}>
//                           <Row style={{ alignItems: "center" }}>
//                             {/* Institution Type Dropdown */}
//                             <Col md="3" sm="12">
//                               <div style={{ marginBottom: "0" }}>
//                                 <label style={styles.selectLabel}>
//                                   Institution Type <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>
//                                 </label>
//                                 <Select
//                                   name="institutionTypeId"
//                                   value={institutionTypeValue}
//                                   onChange={handleFilterChange}
//                                   onBlur={() => handleFieldBlur("institutionTypeId")}
//                                   options={institutionTypeOptions}
//                                   styles={selectStyles}
//                                   placeholder="Select Institution Type"
//                                   isSearchable
//                                   isClearable
//                                   isLoading={filtersLoading}
//                                   required
//                                   aria-invalid={!!(validationErrors.institutionTypeId && touchedFields.institutionTypeId)}
//                                 />
//                                 {validationErrors.institutionTypeId && touchedFields.institutionTypeId && (
//                                   <FormFeedback style={{ display: "block", fontSize: "12px" }}>
//                                     {validationErrors.institutionTypeId}
//                                   </FormFeedback>
//                                 )}
//                               </div>
//                             </Col>

//                             {/* Quarter Dropdown */}
//                             <Col md="3" sm="12">
//                               <div style={{ marginBottom: "0" }}>
//                                 <label style={styles.selectLabel}>
//                                   Quarter <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>
//                                 </label>
//                                 <Select
//                                   name="quarterId"
//                                   value={quarterValue}
//                                   onChange={handleFilterChange}
//                                   onBlur={() => handleFieldBlur("quarterId")}
//                                   options={quarterOptions}
//                                   styles={selectStyles}
//                                   placeholder="Select Quarter"
//                                   isSearchable
//                                   isClearable
//                                   isLoading={filtersLoading}
//                                   required
//                                   aria-invalid={!!(validationErrors.quarterId && touchedFields.quarterId)}
//                                 />
//                                 {validationErrors.quarterId && touchedFields.quarterId && (
//                                   <FormFeedback style={{ display: "block", fontSize: "12px" }}>
//                                     {validationErrors.quarterId}
//                                   </FormFeedback>
//                                 )}
//                               </div>
//                             </Col>

//                             {/* Clear Filters Button */}
//                             <Col md="1" sm="6" xs="6">
//                               <div style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "flex-end",
//                                 height: "100%",
//                                 paddingTop: "24px",
//                               }}>
//                                 <button
//                                   type="button"
//                                   onClick={handleClearFilters}
//                                   style={{
//                                     ...styles.actionButton,
//                                     ...styles.clearButton,
//                                     width: "100%",
//                                     padding: "8px 12px",
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.currentTarget.style.backgroundColor = "#dc3545"
//                                     e.currentTarget.style.color = "#fff"
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.currentTarget.style.backgroundColor = "transparent"
//                                     e.currentTarget.style.color = "#dc3545"
//                                   }}
//                                 >
//                                   Clear Filters
//                                 </button>
//                               </div>
//                             </Col>

//                             {/* Apply Filters Button */}
//                             <Col md="2" sm="6" xs="6">
//                               <div style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "flex-end",
//                                 height: "100%",
//                                 paddingTop: "24px",
//                               }}>
//                                 <button
//                                   type="button"
//                                   onClick={handleApplyFilters}
//                                   style={{
//                                     ...styles.actionButton,
//                                     ...styles.applyButton,
//                                     width: "100%",
//                                     padding: "8px 12px",
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.currentTarget.style.backgroundColor = "#2a4bd7"
//                                     e.currentTarget.style.borderColor = "#2a4bd7"
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.currentTarget.style.backgroundColor = "#3b5de7"
//                                     e.currentTarget.style.borderColor = "#3b5de7"
//                                   }}
//                                 >
//                                   Apply Filters
//                                 </button>
//                               </div>
//                             </Col>

//                             {/* Spacer Column for better alignment */}
//                             <Col md="2" sm="12">
//                               {/* Empty column for spacing */}
//                             </Col>
//                           </Row>
//                         </div>
//                       )}

//                       {/* Metrics Grid */}
//                       {selectedInstitution && isFormValid ? (
//                         <Row style={{ rowGap: "12px", marginTop: showFilters ? "16px" : "0" }}>
//                           {/* Total */}
//                           <Col lg="3" md="6" xs="6">
//                             <div style={styles.metricBox}>
//                               <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.primary.bg }}>
//                                 <i className="bx bx-time" style={{ fontSize: "20px", color: colors.primary.text }}></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Total</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.total?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           {/* Progress */}
//                           <Col lg="3" md="6" xs="6">
//                             <div style={styles.metricBox}>
//                               <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.info.bg }}>
//                                 <i className="bx bx-trending-up" style={{ fontSize: "20px", color: colors.info.text }}></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Progress</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.progress?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           {/* Completed */}
//                           <Col lg="3" md="6" xs="6">
//                             <div style={styles.metricBox}>
//                               <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.success.bg }}>
//                                 <i className="bx bx-check-circle" style={{ fontSize: "20px", color: colors.success.text }}></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Completed</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.completed?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>

//                           {/* Pending */}
//                           <Col lg="3" md="6" xs="6">
//                             <div style={styles.metricBox}>
//                               <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.warning.bg }}>
//                                 <i className="bx bx-time-five" style={{ fontSize: "20px", color: colors.warning.text }}></i>
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <p style={styles.metricLabel}>Pending</p>
//                                 <h5 style={styles.metricValue}>
//                                   {selectedInstitution.pending?.toLocaleString() || 0}
//                                 </h5>
//                               </div>
//                             </div>
//                           </Col>
//                         </Row>
//                       ) : !isFormValid ? (
//                         <div style={styles.noDataMessage}>
//                           <i className="bx bx-filter-alt" style={{ fontSize: "48px", color: "#6c757d", marginBottom: "16px" }}></i>
//                           <h5 style={{ color: "#495057", marginBottom: "8px" }}>Apply filters to view metrics</h5>
//                           <p style={{ color: "#6c757d", marginBottom: "0", fontSize: "14px" }}>
//                             {filters.institutionTypeId || filters.quarterId
//                               ? "Please complete all filter fields (both Institution Type and Quarter are required)"
//                               : "Click the three-dot menu above to show filters"}
//                           </p>
//                         </div>
//                       ) : null}
//                     </CardBody>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* CHARTS SECTION */}
//               {/* <Row style={{ marginBottom: "20px" }}> */}
//               {/* Pie Chart */}
//               {/* <Col lg="5" md="12" style={{ marginBottom: "16px" }}>
//                   <Card style={styles.chartCard}>
//                     <CardHeader style={styles.chartHeader}>
//                       <h5 style={styles.chartTitle}>
//                         DEPARTMENT WISE PLACE OF WORKING
//                         {institutionTypeCounts.length > 0 && (
//                           <span style={{ fontSize: "12px", color: "#6c757d", marginLeft: "8px", fontWeight: "800" }}>
//                             (Total: {institutionTypeCounts.reduce((sum, item) => sum + (item.count || 0), 0).toLocaleString()})
//                           </span>
//                         )}
//                       </h5>
//                     </CardHeader>
//                     <CardBody style={{ padding: "16px" }}>
//                       <div style={{ height: "320px", width: "100%" }}>
//                         {institutionTypeCounts.length > 0 ? (
//                           <ReactEcharts
//                             option={pieChartOptions}
//                             style={{ height: "100%", width: "100%" }}
//                             opts={{ renderer: "canvas" }}
//                           />
//                         ) : (
//                           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6c757d" }}>
//                             <div style={{ textAlign: "center" }}>
//                               <i className="bx bx-pie-chart-alt" style={{ fontSize: "48px", marginBottom: "12px" }}></i>
//                               <p>No institution type data available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col> */}

//               {/* Bar Chart */}
//               {/* <Col lg="7" md="12" style={{ marginBottom: "16px" }}>
//                   <Card style={styles.chartCard}>
//                     <CardHeader style={styles.chartHeader}>
//                       <h5 style={styles.chartTitle}>
//                         INSTITUTE TYPE WISE BUDGET ALLOCATION & UTILIZATION
//                         {utilizedResult.length > 0 && (
//                           <div style={{ fontSize: "12px", color: "#6c757d", marginTop: "4px" }}>
//                             <span style={{ marginRight: "12px", fontWeight: "800" }}>
//                               Total Allocated: ₹{(totalAllocated / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span style={{ marginRight: "12px", fontWeight: "800" }}>
//                               Total Utilized: ₹{(totalUtilized / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span style={{ fontWeight: "800"}}>Overall Utilization: {overallUtilizationRate}%</span>
//                           </div>
//                         )}
//                       </h5>
//                     </CardHeader>
//                     <CardBody style={{ padding: "16px" }}>
//                       <div style={{ height: "320px", width: "100%" }}>
//                         {utilizedResult.length > 0 ? (
//                           <ReactEcharts
//                             option={barChartOptions}
//                             style={{ height: "100%", width: "100%" }}
//                             opts={{ renderer: "canvas" }}
//                           />
//                         ) : (
//                           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6c757d" }}>
//                             <div style={{ textAlign: "center" }}>
//                               <i className="bx bx-bar-chart-alt" style={{ fontSize: "48px", marginBottom: "12px" }}></i>
//                               <p>No budget data available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col> */}

//               {/* Line Chart */}
//               {/* <Col xl="12" className="mb-2 mt-2">
//                   <Card className="h-100">
//                     <CardBody>
//                       <h4 className="card-title mb-4">
//                         DISTRICT WISE BUDGET ALLOCATION & UTILIZATION
//                         {districtWiseResult.length > 0 && (
//                           <div style={{ fontSize: "12px", color: "#6c757d", marginTop: "4px" }}>
//                             <span style={{ marginRight: "12px", fontWeight: "800" }}>
//                               Total Allocated: ₹{(totalDistrictAllocated / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span style={{ marginRight: "12px", fontWeight: "800" }}>
//                               Total Utilized: ₹{(totalDistrictUtilized / 10000000).toFixed(2)} Cr
//                             </span>
//                             <span style={{ fontWeight: "800" }}>Overall Utilization: {districtUtilizationRate}%</span>
//                           </div>
//                         )}
//                       </h4>
//                       <div style={{ height: "350px" }}>
//                         {districtWiseResult.length > 0 ? (
//                           <ReactEcharts option={lineChartOptions} style={{ height: "100%" }} />
//                         ) : (
//                           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6c757d" }}>
//                             <div style={{ textAlign: "center" }}>
//                               <i className="bx bx-line-chart" style={{ fontSize: "48px", marginBottom: "12px" }}></i>
//                               <p>No district wise data available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col> */}
//               {/* </Row> */}
//             </>
//           ) : (
//             <Row>
//               <Col xs="12">
//                 <Card style={{ textAlign: "center", padding: "40px" }}>
//                   <CardBody>
//                     <i className="bx bx-lock-alt" style={{ fontSize: "48px", color: "#74788d" }}></i>
//                     <h4 style={{ marginTop: "16px", color: "#495057" }}>Access Denied</h4>
//                     <p style={{ color: "#74788d" }}>You don't have permission to view this dashboard.</p>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           )}
//         </Container>

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//         />
//       </div>
//     </React.Fragment>
//   )
// }

// export default Dashboard





import React, { useEffect, useState, useCallback, useMemo } from "react"
import { Container, Row, Col, Card, CardBody, CardHeader, FormFeedback } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import Select from "react-select"
import { URLS } from "../../Url"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import InstitutionProfile from "../Settings/PlaceOfWorkingMap"

const Dashboard = () => {
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const TokenData = TokenJson?.token
  const Roles = TokenJson?.rolesAndPermission?.[0] ?? { accessAll: true }

  const [dashboardData, setDashboardData] = useState({})
  const [analyticsData, setAnalyticsData] = useState([])
  const [institutionTypeCounts, setInstitutionTypeCounts] = useState([])
  const [utilizedResult, setUtilizedResult] = useState([])
  const [districtWiseResult, setDistrictWiseResult] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Filter states
  const [institutionTypeOptions, setInstitutionTypeOptions] = useState([])
  const [quarterOptions, setQuarterOptions] = useState([])
  const [filters, setFilters] = useState({
    institutionTypeId: localStorage.getItem("saved_institutionTypeId") || "",
    quarterId: localStorage.getItem("saved_quarterId") || "",
  })

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    institutionTypeId: "",
    quarterId: "",
  })
  const [touchedFields, setTouchedFields] = useState({
    institutionTypeId: false,
    quarterId: false,
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [filtersLoading, setFiltersLoading] = useState(false)
  const [isPdfDownloading, setIsPdfDownloading] = useState(false)
  const [isCaseTreatedDownloading, setIsCaseTreatedDownloading] = useState(false)

  // Filter dropdown menu state
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // React Select styles
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      height: 40,
      fontSize: 14,
      borderRadius: 6,
      borderColor: validationErrors.institutionTypeId && touchedFields.institutionTypeId
        ? "#dc3545"
        : validationErrors.quarterId && touchedFields.quarterId
          ? "#dc3545"
          : state.isFocused ? "#405189" : "#ced4da",
      boxShadow: validationErrors.institutionTypeId && touchedFields.institutionTypeId
        ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
        : validationErrors.quarterId && touchedFields.quarterId
          ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
          : state.isFocused
            ? "0 0 0 0.2rem rgba(64, 81, 137, 0.25)"
            : "none",
      transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      "&:hover": {
        borderColor: validationErrors.institutionTypeId && touchedFields.institutionTypeId
          ? "#dc3545"
          : validationErrors.quarterId && touchedFields.quarterId
            ? "#dc3545"
            : "#b1bbc4",
      },
    }),
    valueContainer: base => ({
      ...base,
      padding: "0 8px",
      height: "100%",
    }),
    input: base => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: base => ({
      ...base,
      height: 38,
    }),
    dropdownIndicator: base => ({
      ...base,
      padding: "4px 8px",
    }),
    clearIndicator: base => ({
      ...base,
      padding: "4px 8px",
    }),
    indicatorSeparator: base => ({
      ...base,
      marginTop: 8,
      marginBottom: 8,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 14,
      padding: "8px 12px",
      backgroundColor: state.isSelected
        ? "#2362c8"
        : state.isFocused
          ? "#f8f9fa"
          : "white",
      color: state.isSelected ? "white" : "#212529",
      "&:active": {
        backgroundColor: "#2362c8",
        color: "white",
      },
    }),
    placeholder: base => ({
      ...base,
      fontSize: 14,
      color: validationErrors.institutionTypeId && touchedFields.institutionTypeId
        ? "#dc3545"
        : validationErrors.quarterId && touchedFields.quarterId
          ? "#dc3545"
          : "#6c757d",
    }),
    singleValue: base => ({
      ...base,
      color: validationErrors.institutionTypeId && touchedFields.institutionTypeId
        ? "#dc3545"
        : validationErrors.quarterId && touchedFields.quarterId
          ? "#dc3545"
          : "#212529",
    }),
  }

  // Validation rules
  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "institutionTypeId":
        if (!value) {
          error = "Institution Type is required"
        }
        break
      case "quarterId":
        if (!value) {
          error = "Quarter is required"
        }
        break
      default:
        break
    }

    return error
  }

  // Validate all fields
  const validateForm = useCallback(() => {
    const errors = {
      institutionTypeId: validateField("institutionTypeId", filters.institutionTypeId),
      quarterId: validateField("quarterId", filters.quarterId),
    }

    setValidationErrors(errors)

    // Form is valid if no errors
    const isValid = !errors.institutionTypeId && !errors.quarterId
    setIsFormValid(isValid)

    return isValid
  }, [filters])

  // Handle field blur
  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true,
    }))

    // Validate the field
    const error = validateField(fieldName, filters[fieldName])
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }))
  }

  // Fetch User Profile to determine if admin
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.post(URLS.getProfile, {},
        {
          headers: { Authorization: `Bearer ${TokenData}` },
          timeout: 15000,
        })

      if (response.data?.isadmin !== undefined) {
        setIsAdmin(response.data.isadmin)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast.error("Failed to load user profile")
      setIsAdmin(false)
    }
  }, [TokenData])

  // Fetch Institution Types
  const fetchInstitutionTypes = useCallback(async () => {
    try {
      setFiltersLoading(true)
      const response = await axios.get(URLS.GetEmploymentType, {
        headers: { Authorization: `Bearer ${TokenData}` },
        timeout: 15000,
      })

      if (response.data?.data) {
        const employmentTypes = response.data.data.map(type => ({
          value: type._id,
          label: type.name,
        }))
        setInstitutionTypeOptions(employmentTypes)
      }
    } catch (error) {
      console.error("Error fetching institution types:", error)
      toast.error("Failed to load institution types")
    } finally {
      setFiltersLoading(false)
    }
  }, [TokenData])

  // Fetch Quarters
  const fetchQuarters = useCallback(async () => {
    try {
      setFiltersLoading(true)
      const response = await axios.post(URLS.GetQuarter, {}, {
        headers: { Authorization: `Bearer ${TokenData}` },
        timeout: 15000,
      })

      if (response.data?.data) {
        const quartersData = response.data.data.map(quarter => ({
          value: quarter._id,
          label: quarter.quarter,
        }))
        setQuarterOptions(quartersData)
      }
    } catch (error) {
      console.error("Error fetching quarters:", error)
      toast.error("Failed to load quarters")
    } finally {
      setFiltersLoading(false)
    }
  }, [TokenData])

  // Fetch Dashboard Data with Filters
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)

      // Prepare request data
      const requestData = {}
      if (filters.institutionTypeId) {
        requestData.institutionTypeId = filters.institutionTypeId
      }
      if (filters.quarterId) {
        requestData.quarterId = filters.quarterId
      }

      const response = await axios.post(
        URLS.getDashboard,
        requestData,
        {
          headers: { Authorization: `Bearer ${TokenData}` },
        }
      )

      const responseData = response?.data || {}
      setDashboardData(responseData)

      // Handle analytics data (only for admin)
      const analytics = responseData.analytics || []
      setAnalyticsData(analytics)

      // Handle institution type counts for pie chart
      const counts = responseData.institutionTypeCounts || []
      setInstitutionTypeCounts(counts)

      // Handle utilized result for bar chart
      const utilized = responseData.utilizedResult || []
      setUtilizedResult(utilized)

      // Handle district wise result for line chart
      const districtWise = responseData.districtWiseResult || []
      setDistrictWiseResult(districtWise)

      if (analytics.length > 0) {
        setSelectedInstitution(analytics[0])
      } else {
        setSelectedInstitution(null)
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
      setAnalyticsData([])
      setInstitutionTypeCounts([])
      setUtilizedResult([])
      setDistrictWiseResult([])
      setSelectedInstitution(null)
    } finally {
      setLoading(false)
    }
  }, [TokenData, filters])

  // Handle Download Total Employees Report
  const handleDownloadTotalEmployeesReport = async () => {
    if (isPdfDownloading) return
    const newWindow = window.open("", "_blank")
    try {
      setIsPdfDownloading(true)
      const currentDate = new Date().toISOString().split("T")[0]
      const response = await axios.post(
        URLS.EmployeeDownloadReport,
        { Date: currentDate },
        {
          headers: { Authorization: `Bearer ${TokenData}` },
          responseType: "blob",
        }
      )

      if (response.status === 200 && response.data) {
        const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
        if (newWindow) {
          newWindow.location.href = fileURL
        } else {
          window.open(fileURL, "_blank")
        }
        toast.success("PDF Downloaded Successfully")
      } else {
        if (newWindow) newWindow.close()
        toast.error("Failed to download PDF")
      }
    } catch (error) {
      if (newWindow) newWindow.close()
      console.error("Error downloading report:", error)

      let errorMessage = "An error occurred while downloading PDF"
      if (
        error.response &&
        error.response.data &&
        error.response.data.type === "application/json"
      ) {
        try {
          const text = await error.response.data.text()
          const errorData = JSON.parse(text)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Failed to parse error response as JSON", e)
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast.error(errorMessage)
    } finally {
      setIsPdfDownloading(false)
    }
  }

  // Handle Download Case Treated Report
  const handleDownloadCaseTreatedReport = async () => {
    if (isCaseTreatedDownloading) return
    const newWindow = window.open("", "_blank")
    try {
      setIsCaseTreatedDownloading(true)
      const dateObj = new Date()
      const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj.getFullYear()}`

      const payload = {
        districtId: "",
        institutionId: "",
        fromDate: formattedDate,
        toDate: formattedDate
      }

      const response = await axios.post(
        "https://api.vahdtelangana.com/v1/api/admin/patient/getCaseTreatedPDFDownloadReport",
        payload,
        {
          headers: { Authorization: `Bearer ${TokenData}` },
          responseType: "blob",
        }
      )

      if (response.status === 200 && response.data) {
        const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
        if (newWindow) {
          newWindow.location.href = fileURL
        } else {
          window.open(fileURL, "_blank")
        }
        toast.success("PDF Downloaded Successfully")
      } else {
        if (newWindow) newWindow.close()
        toast.error("Failed to download PDF")
      }
    } catch (error) {
      if (newWindow) newWindow.close()
      console.error("Error downloading case treated report:", error)

      let errorMessage = "An error occurred while downloading PDF"
      if (
        error.response &&
        error.response.data &&
        error.response.data.type === "application/json"
      ) {
        try {
          const text = await error.response.data.text()
          const errorData = JSON.parse(text)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Failed to parse error response as JSON", e)
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast.error(errorMessage)
    } finally {
      setIsCaseTreatedDownloading(false)
    }
  }

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await fetchUserProfile()
      await Promise.all([
        fetchInstitutionTypes(),
        fetchQuarters()
      ])
    }
    initializeData()
  }, [fetchUserProfile, fetchInstitutionTypes, fetchQuarters])

  // Validate form when filters change
  useEffect(() => {
    validateForm()
  }, [filters, validateForm])

  // Fetch dashboard data when filters are valid
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData()
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, fetchDashboardData])

  // Handle filter changes
  const handleFilterChange = (selectedOption, { name }) => {
    const value = selectedOption?.value || ""

    setFilters(prev => ({
      ...prev,
      [name]: value
    }))

    setTouchedFields(prev => ({
      ...prev,
      [name]: true,
    }))

    const error = validateField(name, value)
    setValidationErrors(prev => ({
      ...prev,
      [name]: error,
    }))

    if (value) {
      localStorage.setItem(`saved_${name}`, value)
    } else {
      localStorage.removeItem(`saved_${name}`)
    }
  }

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(prev => !prev)
  }

  // Toggle filters visibility
  const toggleFiltersVisibility = () => {
    setShowFilters(prev => !prev)
    setFilterDropdownOpen(false)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      institutionTypeId: "",
      quarterId: "",
    })
    setTouchedFields({
      institutionTypeId: false,
      quarterId: false,
    })
    setValidationErrors({
      institutionTypeId: "",
      quarterId: "",
    })
    localStorage.removeItem("saved_institutionTypeId")
    localStorage.removeItem("saved_quarterId")
    setFilterDropdownOpen(false)
  }

  // Apply filters
  const handleApplyFilters = () => {
    const isValid = validateForm()
    if (isValid) {
      setShowFilters(false)
    }
  }

  const handleInstitutionChange = (e) => {
    const selected = analyticsData.find(
      (inst) => inst.institutionName === e.target.value
    )
    setSelectedInstitution(selected)
  }

  // Memoized filter values for React Select
  const institutionTypeValue = useMemo(() => {
    if (!filters.institutionTypeId) return null
    return institutionTypeOptions.find(opt => opt.value === filters.institutionTypeId)
  }, [filters.institutionTypeId, institutionTypeOptions])

  const quarterValue = useMemo(() => {
    if (!filters.quarterId) return null
    return quarterOptions.find(opt => opt.value === filters.quarterId)
  }, [filters.quarterId, quarterOptions])

  // Inline Styles
  const styles = {
    pageContent: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      padding: "24px 0",
    },
    attendanceCard: {
      border: "none",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      height: "100%",
      backgroundColor: "#fff",
    },
    attendanceLabel: {
      fontSize: "11px",
      fontWeight: "600",
      color: "#dc3545",
      textTransform: "uppercase",
      marginBottom: "6px",
      letterSpacing: "0.3px",
    },
    attendanceValue: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#495057",
      marginBottom: "0",
      lineHeight: "1.2",
    },
    metricsCard: {
      border: "none",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      backgroundColor: "#fff",
      position: "relative",
    },
    metricBox: {
      display: "flex",
      alignItems: "center",
      padding: "14px",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #e9ecef",
      height: "100%",
    },
    metricIconWrapper: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "10px",
      flexShrink: 0,
    },
    metricValue: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#495057",
      marginBottom: "4px",
      textAlign: "left",
      lineHeight: "1",
    },
    metricLabel: {
      fontSize: "11px",
      fontWeight: "500",
      color: "#74788d",
      marginBottom: "0",
      textAlign: "left",
    },
    chartCard: {
      border: "none",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      height: "100%",
      backgroundColor: "#fff",
    },
    chartHeader: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e9ecef",
      padding: "14px 18px",
    },
    chartTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#495057",
      marginBottom: "0",
    },
    selectLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#495057",
      marginBottom: "4px",
      display: "block",
    },
    shimmerContainer: {
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      padding: "24px 0",
    },
    shimmerCard: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      marginBottom: "16px",
      overflow: "hidden",
    },
    shimmerLine: {
      height: "20px",
      backgroundColor: "#e9ecef",
      borderRadius: "4px",
      margin: "16px",
      animation: "pulse 1.5s ease-in-out infinite",
    },
    shimmerCircle: {
      height: "42px",
      width: "42px",
      backgroundColor: "#e9ecef",
      borderRadius: "50%",
      margin: "10px",
      animation: "pulse 1.5s ease-in-out infinite",
    },
    shimmerChart: {
      height: "320px",
      backgroundColor: "#e9ecef",
      borderRadius: "8px",
      margin: "16px",
      animation: "pulse 1.5s ease-in-out infinite",
    },
    filterHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    validationAlert: {
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      borderRadius: "6px",
      padding: "8px 12px",
      marginBottom: "12px",
      fontSize: "12px",
      color: "#721c24",
    },
    filtersSection: {
      backgroundColor: "#f8f9fa",
      border: "1px solid #e9ecef",
      borderRadius: "6px",
      padding: "16px",
      marginTop: "16px",
    },
    filterActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
      marginTop: "12px",
    },
    actionButton: {
      padding: "6px 12px",
      borderRadius: "4px",
      border: "none",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    clearButton: {
      backgroundColor: "transparent",
      border: "1px solid #dc3545",
      color: "#dc3545",
    },
    applyButton: {
      backgroundColor: "#3b5de7",
      color: "white",
      border: "1px solid #3b5de7",
    },
    threeDotMenu: {
      position: "absolute",
      top: "14px",
      right: "14px",
      cursor: "pointer",
      zIndex: 10,
    },
    dropdownMenu: {
      minWidth: "200px",
      padding: "8px",
      borderRadius: "6px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      zIndex: 9999,
      position: "fixed",
      marginTop: "5px",
    },
    dropdownItem: {
      fontSize: "13px",
      padding: "8px 12px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    },
    activeFilterIndicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "18px",
      height: "18px",
      backgroundColor: "#3b5de7",
      color: "white",
      borderRadius: "50%",
      fontSize: "10px",
      marginLeft: "8px",
    },
    noDataMessage: {
      textAlign: "center",
      padding: "40px",
      color: "#6c757d",
    },
  }

  // Color configurations
  const colors = {
    primary: { bg: "rgba(59, 93, 231, 0.15)", text: "#3b5de7" },
    success: { bg: "rgba(69, 203, 133, 0.15)", text: "#45cb85" },
    warning: { bg: "rgba(238, 185, 2, 0.15)", text: "#eeb902" },
    danger: { bg: "rgba(255, 113, 91, 0.15)", text: "#ff715b" },
    info: { bg: "rgba(52, 152, 219, 0.15)", text: "#3498db" },
  }

  // Calculate total budgets (Admin only)
  const totalAllocated = utilizedResult.reduce((sum, item) => sum + (item.totalAllocatedBudget || 0), 0)
  const totalUtilized = utilizedResult.reduce((sum, item) => sum + (item.totalUtilizedBudget || 0), 0)
  const overallUtilizationRate = totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0

  // Calculate district-wise totals (Admin only)
  const totalDistrictAllocated = districtWiseResult.reduce((sum, item) => sum + (item.totalAllocatedBudget || 0), 0)
  const totalDistrictUtilized = districtWiseResult.reduce((sum, item) => sum + (item.totalUtilizedBudget || 0), 0)
  const districtUtilizationRate = totalDistrictAllocated > 0 ? Math.round((totalDistrictUtilized / totalDistrictAllocated) * 100) : 0

  // Loading Shimmer UI
  const ShimmerUI = () => (
    <div className="page-content">
      <div style={styles.shimmerContainer}>
        <Container fluid>
          <Breadcrumbs title="VHIS" breadcrumbItem="Dashboard" />
          <Row style={{ marginBottom: "20px" }}>
            <Col lg="12">
              <Row>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Col lg="2" md="4" sm="6" style={{ marginBottom: "16px" }} key={item}>
                    <div style={styles.shimmerCard}>
                      <div style={{ padding: "16px" }}>
                        <div style={{ ...styles.shimmerLine, width: "60%", height: "11px", margin: "0 0 6px 0" }}></div>
                        <div style={{ ...styles.shimmerLine, width: "80%", height: "28px", margin: "0" }}></div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}
        </style>
      </div>
    </div>
  )

  // Loading State Component
  if (loading || filtersLoading) {
    return <ShimmerUI />
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="VHIS" breadcrumbItem="Dashboard" />

          {Roles?.Dashboardview === true || Roles?.accessAll === true ? (
            <>
              {/* CONDITIONAL RENDERING BASED ON isAdmin */}
              {isAdmin ? (
                <>
                  {/* ADMIN VIEW - 8 ATTENDANCE CARDS IN A SINGLE ROW */}
                  <Row style={{ marginBottom: "20px" }}>
                    <Col lg="12">
                      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        {/* Total Employees */}
                        <div
                          style={{
                            flex: "1 1 calc(12.28% - 16px)",
                            minWidth: "120px",
                            cursor: isPdfDownloading ? "not-allowed" : "pointer",
                            opacity: isPdfDownloading ? 0.7 : 1,
                            position: "relative"
                          }}
                          onClick={handleDownloadTotalEmployeesReport}
                        >
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px", position: "relative" }}>
                              {isPdfDownloading && (
                                <div style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  zIndex: 1
                                }}>
                                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </div>
                              )}
                              <div style={{ visibility: isPdfDownloading ? "hidden" : "visible" }}>
                                <p style={styles.attendanceLabel}>Total Employees</p>
                                <h2 style={styles.attendanceValue}>{dashboardData.staff || 0}</h2>
                              </div>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Present */}
                        <div style={{ flex: "1 1 calc(12.28% - 16px)", minWidth: "120px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={styles.attendanceLabel}>Present In</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.presentIn || 0}</h2>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Present */}
                        <div style={{ flex: "1 1 calc(12.28% - 16px)", minWidth: "120px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={styles.attendanceLabel}>Present Out</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.presentOut || 0}</h2>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Absent */}
                        <div style={{ flex: "1 1 calc(12.28% - 16px)", minWidth: "120px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={styles.attendanceLabel}>Absent</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.absentees || 0}</h2>
                            </CardBody>
                          </Card>
                        </div>

                        {/* In Leave */}
                        <div style={{ flex: "1 1 calc(12.28% - 16px)", minWidth: "120px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={{ ...styles.attendanceLabel }}>In Leave</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.checkIntimesite || 0}</h2>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Case Treated */}
                        <div
                          style={{
                            flex: "1 1 calc(12.28% - 16px)",
                            minWidth: "120px",
                            cursor: isCaseTreatedDownloading ? "not-allowed" : "pointer",
                            opacity: isCaseTreatedDownloading ? 0.7 : 1,
                            position: "relative"
                          }}
                          onClick={handleDownloadCaseTreatedReport}
                        >
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px", position: "relative" }}>
                              {isCaseTreatedDownloading && (
                                <div style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  zIndex: 1
                                }}>
                                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                </div>
                              )}
                              <div style={{ visibility: isCaseTreatedDownloading ? "hidden" : "visible" }}>
                                <p style={styles.attendanceLabel}>Case Treated</p>
                                <h2 style={styles.attendanceValue}>{dashboardData.caseTreatedCount || 0}</h2>
                              </div>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Check Out Site */}
                        <div style={{ flex: "1 1 calc(12.28% - 16px)", minWidth: "120px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={styles.attendanceLabel}>Fodder</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.foodersCount || 0}</h2>
                            </CardBody>
                          </Card>
                        </div>

                        {/* Check Out Time Site */}
                        <div style={{ flex: "1 1 calc(12.28% - 16px)", minWidth: "120px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={{ ...styles.attendanceLabel, color: "#dc3545" }}>AI</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.artificialInseminationsCount || 0}</h2>
                            </CardBody>
                          </Card>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* ADMIN - INSTITUTION METRICS SECTION */}
                  {/* <Row style={{ marginBottom: "20px" }}>
                    <Col lg="12">
                      <Card style={styles.metricsCard}>
                        <CardBody style={{ padding: "16px", position: "relative" }}>
                          <div style={styles.filterHeader}>
                            <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#495057", marginBottom: "8px" }}>
                              Institution Metrics
                            </h6>

                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              position: "absolute",
                              top: "14px",
                              right: "14px",
                            }}>
                              <button
                                onClick={toggleFiltersVisibility}
                                style={{
                                  backgroundColor: showFilters ? "#3b5de7" : "transparent",
                                  border: `1px solid ${showFilters ? "#3b5de7" : "#6c757d"}`,
                                  color: showFilters ? "#fff" : "#6c757d",
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  if (!showFilters) {
                                    e.currentTarget.style.backgroundColor = "#f8f9fa"
                                    e.currentTarget.style.borderColor = "#3b5de7"
                                    e.currentTarget.style.color = "#3b5de7"
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!showFilters) {
                                    e.currentTarget.style.backgroundColor = "transparent"
                                    e.currentTarget.style.borderColor = "#6c757d"
                                    e.currentTarget.style.color = "#6c757d"
                                  }
                                }}
                                title={showFilters ? "Hide Filters" : "Show Filters"}
                              >
                                <i className="bx bx-filter-alt" style={{ fontSize: "18px" }}></i>
                              </button>
                            </div>
                          </div>

                          {!isFormValid && (filters.institutionTypeId || filters.quarterId) && (
                            <div style={styles.validationAlert}>
                              <i className="bx bx-error" style={{ marginRight: "6px" }}></i>
                              Please fill all required filter fields to see filtered data.
                            </div>
                          )}

                          {showFilters && (
                            <div style={styles.filtersSection}>
                              <Row style={{ alignItems: "center" }}>
                                <Col md="3" sm="12">
                                  <div style={{ marginBottom: "0" }}>
                                    <label style={styles.selectLabel}>
                                      Institution Type <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>
                                    </label>
                                    <Select
                                      name="institutionTypeId"
                                      value={institutionTypeValue}
                                      onChange={handleFilterChange}
                                      onBlur={() => handleFieldBlur("institutionTypeId")}
                                      options={institutionTypeOptions}
                                      styles={selectStyles}
                                      placeholder="Select Institution Type"
                                      isSearchable
                                      isClearable
                                      isLoading={filtersLoading}
                                      required
                                      aria-invalid={!!(validationErrors.institutionTypeId && touchedFields.institutionTypeId)}
                                    />
                                    {validationErrors.institutionTypeId && touchedFields.institutionTypeId && (
                                      <FormFeedback style={{ display: "block", fontSize: "12px" }}>
                                        {validationErrors.institutionTypeId}
                                      </FormFeedback>
                                    )}
                                  </div>
                                </Col>

                                <Col md="3" sm="12">
                                  <div style={{ marginBottom: "0" }}>
                                    <label style={styles.selectLabel}>
                                      Quarter <span style={{ color: "#dc3545", marginLeft: "2px" }}>*</span>
                                    </label>
                                    <Select
                                      name="quarterId"
                                      value={quarterValue}
                                      onChange={handleFilterChange}
                                      onBlur={() => handleFieldBlur("quarterId")}
                                      options={quarterOptions}
                                      styles={selectStyles}
                                      placeholder="Select Quarter"
                                      isSearchable
                                      isClearable
                                      isLoading={filtersLoading}
                                      required
                                      aria-invalid={!!(validationErrors.quarterId && touchedFields.quarterId)}
                                    />
                                    {validationErrors.quarterId && touchedFields.quarterId && (
                                      <FormFeedback style={{ display: "block", fontSize: "12px" }}>
                                        {validationErrors.quarterId}
                                      </FormFeedback>
                                    )}
                                  </div>
                                </Col>

                                <Col md="2" sm="6" xs="6">
                                  <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    height: "100%",
                                    paddingTop: "24px",
                                  }}>
                                    <button
                                      type="button"
                                      onClick={handleClearFilters}
                                      style={{
                                        ...styles.actionButton,
                                        ...styles.clearButton,
                                        width: "100%",
                                        padding: "8px 12px",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#dc3545"
                                        e.currentTarget.style.color = "#fff"
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "transparent"
                                        e.currentTarget.style.color = "#dc3545"
                                      }}
                                    >
                                      Clear Filters
                                    </button>
                                  </div>
                                </Col>

                                <Col md="2" sm="6" xs="6">
                                  <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    height: "100%",
                                    paddingTop: "24px",
                                  }}>
                                    <button
                                      type="button"
                                      onClick={handleApplyFilters}
                                      style={{
                                        ...styles.actionButton,
                                        ...styles.applyButton,
                                        width: "100%",
                                        padding: "8px 12px",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#2a4bd7"
                                        e.currentTarget.style.borderColor = "#2a4bd7"
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#3b5de7"
                                        e.currentTarget.style.borderColor = "#3b5de7"
                                      }}
                                    >
                                      Apply Filters
                                    </button>
                                  </div>
                                </Col>

                                <Col md="2" sm="12"></Col>
                              </Row>
                            </div>
                          )}

                          {selectedInstitution && isFormValid ? (
                            <Row style={{ rowGap: "12px", marginTop: showFilters ? "16px" : "0" }}>
                              <Col lg="3" md="6" xs="6">
                                <div style={styles.metricBox}>
                                  <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.primary.bg }}>
                                    <i className="bx bx-time" style={{ fontSize: "20px", color: colors.primary.text }}></i>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <p style={styles.metricLabel}>Total</p>
                                    <h5 style={styles.metricValue}>
                                      {selectedInstitution.total?.toLocaleString() || 0}
                                    </h5>
                                  </div>
                                </div>
                              </Col>

                              <Col lg="3" md="6" xs="6">
                                <div style={styles.metricBox}>
                                  <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.info.bg }}>
                                    <i className="bx bx-trending-up" style={{ fontSize: "20px", color: colors.info.text }}></i>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <p style={styles.metricLabel}>Progress</p>
                                    <h5 style={styles.metricValue}>
                                      {selectedInstitution.progress?.toLocaleString() || 0}
                                    </h5>
                                  </div>
                                </div>
                              </Col>

                              <Col lg="3" md="6" xs="6">
                                <div style={styles.metricBox}>
                                  <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.success.bg }}>
                                    <i className="bx bx-check-circle" style={{ fontSize: "20px", color: colors.success.text }}></i>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <p style={styles.metricLabel}>Completed</p>
                                    <h5 style={styles.metricValue}>
                                      {selectedInstitution.completed?.toLocaleString() || 0}
                                    </h5>
                                  </div>
                                </div>
                              </Col>

                              <Col lg="3" md="6" xs="6">
                                <div style={styles.metricBox}>
                                  <div style={{ ...styles.metricIconWrapper, backgroundColor: colors.warning.bg }}>
                                    <i className="bx bx-time-five" style={{ fontSize: "20px", color: colors.warning.text }}></i>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <p style={styles.metricLabel}>Pending</p>
                                    <h5 style={styles.metricValue}>
                                      {selectedInstitution.pending?.toLocaleString() || 0}
                                    </h5>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          ) : !isFormValid ? (
                            <div style={styles.noDataMessage}>
                              <i className="bx bx-filter-alt" style={{ fontSize: "48px", color: "#6c757d", marginBottom: "16px" }}></i>
                              <h5 style={{ color: "#495057", marginBottom: "8px" }}>Apply filters to view metrics</h5>
                              <p style={{ color: "#6c757d", marginBottom: "0", fontSize: "14px" }}>
                                {filters.institutionTypeId || filters.quarterId
                                  ? "Please complete all filter fields (both Institution Type and Quarter are required)"
                                  : "Click the filter icon above to show filters"}
                              </p>
                            </div>
                          ) : null}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row> */}
                  <Row className="mb-4">
                    <Col xl="12">
                      <InstitutionProfile />
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  {/* EMPLOYEE VIEW - 4 ATTENDANCE CARDS */}
                  <Row style={{ marginBottom: "20px" }}>
                    <Col lg="12">
                      <Row>
                        {/* Working Days */}
                        <Col lg="3" md="6" sm="6" style={{ marginBottom: "16px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={styles.attendanceLabel}>Working Days</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.totalDaysInMonth || dashboardData.totalDays || 0}</h2>
                            </CardBody>
                          </Card>
                        </Col>

                        {/* Present */}
                        <Col lg="3" md="6" sm="6" style={{ marginBottom: "16px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={{ ...styles.attendanceLabel, color: "#45cb85" }}>Present</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.presentDays || 0}</h2>
                            </CardBody>
                          </Card>
                        </Col>

                        {/* Absent */}
                        <Col lg="3" md="6" sm="6" style={{ marginBottom: "16px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={{ ...styles.attendanceLabel, color: "#ff715b" }}>Absent</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.absentDays || 0}</h2>
                            </CardBody>
                          </Card>
                        </Col>

                        {/* Leave */}
                        <Col lg="3" md="6" sm="6" style={{ marginBottom: "16px" }}>
                          <Card style={styles.attendanceCard}>
                            <CardBody style={{ padding: "16px" }}>
                              <p style={{ ...styles.attendanceLabel, color: "#3b5de7" }}>Leave</p>
                              <h2 style={styles.attendanceValue}>{dashboardData.leaves || 0}</h2>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}

            </>
          ) : (
            <Row>
              <Col xs="12">
                <Card style={{ textAlign: "center", padding: "40px" }}>
                  <CardBody>
                    <i className="bx bx-lock-alt" style={{ fontSize: "48px", color: "#74788d" }}></i>
                    <h4 style={{ marginTop: "16px", color: "#495057" }}>Access Denied</h4>
                    <p style={{ color: "#74788d" }}>You don't have permission to view this dashboard.</p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>

        <ToastContainer
          position="top-right"
          autoClose={3000}
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

export default Dashboard
