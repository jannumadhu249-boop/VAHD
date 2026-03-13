// import React, { useState, useEffect, useCallback } from "react"
// import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"
// import { Row, Col, Card, CardBody, Badge } from "reactstrap"
// import { toast } from "react-toastify"
// import { URLS } from "../../Url"
// import axios from "axios"

// const PlaceOfWorking = () => {
//   const [data, setData] = useState([])
//   const [selectedLocation, setSelectedLocation] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [mapCenter, setMapCenter] = useState({
//     lat: 17.385044,
//     lng: 78.486671,
//   })
//   const GetAuth = localStorage.getItem("authUser")
//   const TokenJson = GetAuth ? JSON.parse(GetAuth) : null
//   const TokenData = TokenJson?.token || ""

//   const mapContainerStyle = {
//     width: "100%",
//     height: "80vh",
//     borderRadius: "12px",
//     border: "1px solid #e9ecef",
//   }

//   const defaultCenter = {
//     lat: 17.385044,
//     lng: 78.486671,
//   }

//   const defaultZoom = 9

//   const institutionTypeColors = {
//     "SC(AH)": "#3B82F6",
//     AVH: "#10B981",
//     DVAHO: "#8B5CF6",
//     ADDL: "#EF4444",
//     DVH: "#F59E0B",
//     ISDP: "#06B6D4",
//     TGVCI: "#8B5CF6",
//     TGVBRI: "#EC4899",
//     "Deoni Cattle Bredding farm": "#F97316",
//     Directorate: "#6366F1",
//     MC: "#14B8A6",
//     PVC: "#84CC16",
//     QAL: "#0EA5E9",
//     RAHTC: "#D946EF",
//     SDBP: "#F43F5E",
//     SSVH: "#64748B",
//     SVHRDI: "#A855F7",
//     TGSGCFL: "#22C55E",
//   }

//   const institutionTypeCounts = [
//     { type: "ADDL", count: 8, color: "#EF4444" },
//     { type: "AVH", count: 99, color: "#10B981" },
//     { type: "D C B farm", count: 1, color: "#F97316" },
//     { type: "Directorate", count: 1, color: "#6366F1" },
//     { type: "DVAHO", count: 33, color: "#8B5CF6" },
//     { type: "DVH", count: 8, color: "#F59E0B" },
//     { type: "ISDP", count: 4, color: "#06B6D4" },
//     { type: "MC", count: 1, color: "#14B8A6" },
//     { type: "PVC", count: 979, color: "#84CC16" },
//     { type: "QAL", count: 1, color: "#0EA5E9" },
//     { type: "RAHTC", count: 2, color: "#D946EF" },
//     { type: "SC(AH)", count: 1196, color: "#3B82F6" },
//     { type: "SDBP", count: 1, color: "#F43F5E" },
//     { type: "SSVH", count: 1, color: "#64748B" },
//     { type: "SVHRDI", count: 1, color: "#A855F7" },
//     { type: "TGSGCFL", count: 1, color: "#22C55E" },
//     { type: "TGVBRI", count: 1, color: "#EC4899" },
//     { type: "TGVCI", count: 1, color: "#8B5CF6" },
//   ]

//   const getMarkerColor = useCallback(institutionType => {
//     if (!institutionType) return "#94A3B8"

//     const typeString = String(institutionType).trim()

//     if (institutionTypeColors[typeString]) {
//       return institutionTypeColors[typeString]
//     }

//     for (const [key, value] of Object.entries(institutionTypeColors)) {
//       if (typeString.toLowerCase() === key.toLowerCase()) {
//         return value
//       }
//     }

//     const colors = Object.values(institutionTypeColors)
//     let hash = 0
//     for (let i = 0; i < typeString.length; i++) {
//       hash = typeString.charCodeAt(i) + ((hash << 5) - hash)
//     }
//     return colors[Math.abs(hash) % colors.length]
//   }, [])

//   const createGoogleStylePin = useCallback(color => {
//     const svg = `
//       <svg xmlns="http://www.w3.org/2000/svg" width="28" height="42" viewBox="0 0 24 40">
//         <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 12 28 12 28s12-21.4 12-28c0-6.6-5.4-12-12-12z"
//               fill="${color}" stroke="#FFFFFF" stroke-width="1"/>
//         <circle cx="12" cy="12" r="3.5" fill="#FFFFFF"/>
//         <circle cx="12" cy="12" r="1.5" fill="${color}"/>
//       </svg>
//     `
//     return {
//       url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
//       scaledSize: new window.google.maps.Size(28, 42),
//       origin: new window.google.maps.Point(0, 0),
//       anchor: new window.google.maps.Point(14, 42),
//     }
//   }, [])

//   const fetchData = useCallback(() => {
//     setLoading(true)
//     axios
//       .post(
//         URLS.GetPlaceOfWorking,
//         {},
//         {
//           headers: { Authorization: `Bearer ${TokenData}` },
//         }
//       )
//       .then(res => {
//         const locations = res.data.data || []
//         setData(locations)

//         if (locations.length > 0) {
//           const validLocations = locations.filter(
//             loc => loc.latitude && loc.longitude
//           )
//           if (validLocations.length > 0) {
//             const avgLat =
//               validLocations.reduce(
//                 (sum, loc) => sum + parseFloat(loc.latitude),
//                 0
//               ) / validLocations.length
//             const avgLng =
//               validLocations.reduce(
//                 (sum, loc) => sum + parseFloat(loc.longitude),
//                 0
//               ) / validLocations.length

//             const telanganaBounds = {
//               minLat: 16.0,
//               maxLat: 19.5,
//               minLng: 77.0,
//               maxLng: 81.0,
//             }

//             if (
//               avgLat >= telanganaBounds.minLat &&
//               avgLat <= telanganaBounds.maxLat &&
//               avgLng >= telanganaBounds.minLng &&
//               avgLng <= telanganaBounds.maxLng
//             ) {
//               setMapCenter({ lat: avgLat, lng: avgLng })
//             } else {
//               setMapCenter(defaultCenter)
//             }
//           }
//         }

//         setLoading(false)
//       })
//       .catch(error => {
//         console.error("Error fetching place of working:", error)
//         toast.error("Failed to load data. Please try again.")
//         setLoading(false)
//       })
//   }, [TokenData])

//   useEffect(() => {
//     fetchData()
//   }, [fetchData])

//   const handleMarkerClick = useCallback(location => {
//     setSelectedLocation(location)
//   }, [])

//   const handleCloseInfoWindow = useCallback(() => {
//     setSelectedLocation(null)
//   }, [])

//   return (
//     <Row>
//       <Col md={12}>
//         <Card className="shadow-sm border-0">
//           <CardBody className="p-2">
//             <div className="mb-2">
//               <div className="row g-2">
//                 {institutionTypeCounts.map((item, index) => (
//                   <div key={index} className="col-1 col-md-1 col-lg-1 col-xl-1">
//                     <div
//                       className="d-flex align-items-center p-2 rounded"
//                       style={{
//                         backgroundColor: `${item.color}10`,
//                         borderLeft: `4px solid ${item.color}`,
//                         transition: "all 0.2s ease",
//                         cursor: "default",
//                       }}
//                       onMouseEnter={e => {
//                         e.currentTarget.style.backgroundColor = `${item.color}20`
//                         e.currentTarget.style.transform = "translateX(4px)"
//                       }}
//                       onMouseLeave={e => {
//                         e.currentTarget.style.backgroundColor = `${item.color}10`
//                         e.currentTarget.style.transform = "translateX(0)"
//                       }}
//                     >
//                       <div
//                         className="me-2 rounded-circle"
//                         style={{
//                           width: "12px",
//                           height: "12px",
//                           backgroundColor: item.color,
//                           minWidth: "12px",
//                         }}
//                       ></div>
//                       <div
//                         className="d-flex flex-column"
//                         style={{ lineHeight: "1.2" }}
//                       >
//                         <span
//                           className="fw-medium"
//                           style={{
//                             fontSize: "12px",
//                             color: "#1e293b",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {item.type}
//                         </span>
//                         <span
//                           className="text-muted"
//                           style={{ fontSize: "11px" }}
//                         >
//                           {item.count}{" "}
//                           {item.count === 1 ? "location" : "locations"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="d-flex justify-content-end align-items-center mb-2">
//               <button
//                 className="btn btn-primary d-flex align-items-center btn-sm"
//                 onClick={fetchData}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Loading...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bx bx-refresh me-2"></i>
//                     Refresh Map
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Map Container */}
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-3 text-muted">
//                   Loading Telangana institutions map...
//                 </p>
//               </div>
//             ) : data.length === 0 ? (
//               <div className="text-center py-5">
//                 <i className="bx bx-map-alt bx-lg text-muted mb-3"></i>
//                 <h5 className="text-muted">No institutions found</h5>
//                 <p className="text-muted mb-4">
//                   No veterinary institutions available in Telangana.
//                 </p>
//               </div>
//             ) : (
//               <div style={{ position: "relative" }}>
//                 <GoogleMap
//                   mapContainerStyle={mapContainerStyle}
//                   center={mapCenter}
//                   zoom={defaultZoom}
//                   options={{
//                     streetViewControl: true,
//                     mapTypeControl: true,
//                     fullscreenControl: true,
//                     zoomControl: true,
//                     mapTypeControlOptions: {
//                       position:
//                         window.google.maps?.ControlPosition?.TOP_RIGHT || 3,
//                     },
//                     zoomControlOptions: {
//                       position:
//                         window.google.maps?.ControlPosition?.RIGHT_CENTER || 5,
//                     },
//                     styles: [
//                       {
//                         featureType: "administrative",
//                         elementType: "geometry",
//                         stylers: [{ visibility: "off" }],
//                       },
//                       {
//                         featureType: "poi",
//                         elementType: "labels.text",
//                         stylers: [{ visibility: "off" }],
//                       },
//                       {
//                         featureType: "water",
//                         elementType: "labels.text",
//                         stylers: [{ visibility: "off" }],
//                       },
//                     ],
//                   }}
//                 >
//                   {data.map((location, index) => {
//                     if (!location.latitude || !location.longitude) return null

//                     const institutionType = location.institutionType || ""
//                     const markerColor = getMarkerColor(institutionType)
//                     const markerIcon = createGoogleStylePin(markerColor)

//                     return (
//                       <Marker
//                         key={location._id || `location-${index}`}
//                         position={{
//                           lat: parseFloat(location.latitude),
//                           lng: parseFloat(location.longitude),
//                         }}
//                         icon={markerIcon}
//                         title={`${location.name || "Institution"} - ${
//                           institutionType || "Unknown Type"
//                         }`}
//                         onClick={() => handleMarkerClick(location)}
//                         animation={
//                           selectedLocation === location &&
//                           window.google.maps?.Animation?.BOUNCE
//                             ? window.google.maps.Animation.BOUNCE
//                             : null
//                         }
//                       />
//                     )
//                   })}

//                   {selectedLocation && (
//                     <InfoWindow
//                       position={{
//                         lat: parseFloat(selectedLocation.latitude),
//                         lng: parseFloat(selectedLocation.longitude),
//                       }}
//                       onCloseClick={handleCloseInfoWindow}
//                       options={{
//                         pixelOffset: new window.google.maps.Size(0, -45),
//                       }}
//                     >
//                       <div
//                         style={{
//                           padding: "16px",
//                           maxWidth: "300px",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//                         }}
//                       >
//                         <div className="d-flex align-items-start justify-content-between mb-3">
//                           <h6
//                             style={{
//                               margin: 0,
//                               color: "#1e293b",
//                               fontWeight: "600",
//                               fontSize: "14px",
//                               flex: 1,
//                             }}
//                           >
//                             {selectedLocation.name || "Institution"}
//                           </h6>
//                           <button
//                             onClick={handleCloseInfoWindow}
//                             style={{
//                               background: "none",
//                               border: "none",
//                               color: "#64748b",
//                               cursor: "pointer",
//                               padding: "0 4px",
//                               fontSize: "18px",
//                             }}
//                           >
//                             ×
//                           </button>
//                         </div>

//                         <div className="mb-3">
//                           <Badge className="bg-white"
//                             style={{
//                               backgroundColor: `${getMarkerColor(
//                                 selectedLocation.institutionType
//                               )}20`,
//                               color: getMarkerColor(
//                                 selectedLocation.institutionType
//                               ),
//                               border: `1px solid ${getMarkerColor(
//                                 selectedLocation.institutionType
//                               )}40`,
//                               fontSize: "11px",
//                               padding: "4px 8px",
//                             }}
//                           >
//                             {selectedLocation.institutionType || "No Type"}
//                           </Badge>
//                         </div>

//                         <div style={{ fontSize: "13px", color: "#475569" }}>
//                           {selectedLocation.districtName && (
//                             <div className="d-flex align-items-center mb-2">
//                               <i
//                                 className="bx bx-map bx-xs me-2"
//                                 style={{ color: "#64748b" }}
//                               ></i>
//                               <span>
//                                 <strong>District:</strong>{" "}
//                                 {selectedLocation.districtName}
//                               </span>
//                             </div>
//                           )}

//                           {selectedLocation.mandalName && (
//                             <div className="d-flex align-items-center mb-2">
//                               <i
//                                 className="bx bx-buildings bx-xs me-2"
//                                 style={{ color: "#64748b" }}
//                               ></i>
//                               <span>
//                                 <strong>Mandal:</strong>{" "}
//                                 {selectedLocation.mandalName}
//                               </span>
//                             </div>
//                           )}

//                           {selectedLocation.townName && (
//                             <div className="d-flex align-items-center mb-2">
//                               <i
//                                 className="bx bx-current-location bx-xs me-2"
//                                 style={{ color: "#64748b" }}
//                               ></i>
//                               <span>
//                                 <strong>Town:</strong>{" "}
//                                 {selectedLocation.townName}
//                               </span>
//                             </div>
//                           )}

//                           <div className="mt-3 pt-3 border-top">
//                             <div className="row g-2">
//                               <div className="col-6">
//                                 <div
//                                   className="text-center p-2 rounded"
//                                   style={{ backgroundColor: "#f8fafc" }}
//                                 >
//                                   <div
//                                     style={{
//                                       fontSize: "11px",
//                                       color: "#64748b",
//                                     }}
//                                   >
//                                     Latitude
//                                   </div>
//                                   <div
//                                     style={{
//                                       fontSize: "12px",
//                                       fontWeight: "600",
//                                       color: "#334155",
//                                     }}
//                                   >
//                                     {Number(selectedLocation.latitude).toFixed(
//                                       6
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="col-6">
//                                 <div
//                                   className="text-center p-2 rounded"
//                                   style={{ backgroundColor: "#f8fafc" }}
//                                 >
//                                   <div
//                                     style={{
//                                       fontSize: "11px",
//                                       color: "#64748b",
//                                     }}
//                                   >
//                                     Longitude
//                                   </div>
//                                   <div
//                                     style={{
//                                       fontSize: "12px",
//                                       fontWeight: "600",
//                                       color: "#334155",
//                                     }}
//                                   >
//                                     {Number(selectedLocation.longitude).toFixed(
//                                       6
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </InfoWindow>
//                   )}
//                 </GoogleMap>
//               </div>
//             )}
//           </CardBody>
//         </Card>
//       </Col>
//     </Row>
//   )
// }

// export default PlaceOfWorking

import React, { useState, useMemo, useCallback } from "react"
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"
import { Row, Col, Card, CardBody, Badge } from "reactstrap"
// import { type } from "@testing-library/user-event/dist/types/utility"

// ---------- Static Dataset ----------
const institutionData = [
  // S.No 1
  {
    id: 1,
    name: "SSVH, Narayanguda, Hyderabad",
    type: "SSVH",
    category: "SSVH",
    mandal: "Himayathnagar,Museerabad",
    district: "Hyderabad",
    coordinates: { lat: 17.413583, lng: 78.4885 }, // 17.23'48.9 N, 78.29'18.6 E
    landArea: "1233.33 Sy.yards",
    ownership: "Govt building",
    remarks: "Radiographer Drafted from DVH, Seetharampet",
  },
  // S.No 2
  {
    id: 2,
    name: "District Veterinary Hospital, Seetharampet, Hyderabad",
    type: "DVH",
    category: "District Veterinary Hospital",
    mandal: "Asif nagar",
    district: "Hyderabad",
    coordinates: { lat: 17.381962, lng: 78.460138 },
    landArea: "11Acres",
    ownership: "Govt building",
    remarks: "Radiographer Drafted to SSVH,Narayanaguda",
  },
  // S.No 3
  {
    id: 3,
    name: "Area Veterinary Hospital Pathergatti",
    type: "AVH",
    category: "AVH",
    mandal: "Bandlaguda",
    district: "Hyderabad",
    coordinates: { lat: 17.33138, lng: 78.47999 },
    landArea: "6072 Sq.feets",
    ownership: "Govt building",
    remarks: "",
  },
  // S.No 4
  {
    id: 4,
    name: "PVC Langerhouse",
    type: "PVC",
    category: "PVC",
    mandal: "GOLCONDA",
    district: "Hyderabad",
    coordinates: { lat: 17.37438, lng: 78.413567 },
    landArea: "-",
    ownership: "-",
    remarks: "No Govt.Building, running in rented building",
  },
  // S.No 5 – no coordinates (NO BUILDING)
  // S.No 6
  {
    id: 6,
    name: "PVC Malakpet",
    type: "PVC",
    category: "PVC",
    mandal: "Saidabad",
    district: "Hyderabad",
    coordinates: { lat: 17.366, lng: 78.476 }, // approx
    landArea: "1089 Sq.yards",
    ownership: "Govt building",
    remarks: "",
  },
  // S.No 7 – no valid coordinates
  // S.No 8
  {
    id: 8,
    name: "PVC Shanthinagar",
    type: "PVC",
    category: "PVC",
    mandal: "Khairtabad",
    district: "Hyderabad",
    coordinates: { lat: 17.39, lng: 78.485 }, // approx from "17.38, 17.40"
    landArea: "1700 Sq.yards",
    ownership: "Govt building",
    remarks: "",
  },
  // S.No 9
  {
    id: 9,
    name: "Serilingampally",
    type: "PVC",
    category: "PVC",
    mandal: "Serilingampally",
    district: "Rangareddy",
    coordinates: { lat: 17.479652, lng: 78.315317 },
    landArea: "800 Sq.Yards",
    ownership: "V& AH Department",
    remarks: "",
  },
  // S.No 10
  {
    id: 10,
    name: "Madhapur",
    type: "PVC",
    category: "PVC",
    mandal: "Serilingampally",
    district: "Rangareddy",
    coordinates: { lat: 17.441757, lng: 78.38775 },
    landArea: "110 Sq.Yards",
    ownership: "Govt. old primary school building",
    remarks:
      "Building alloted to V &AHD is given to Vijaya Dairy on lease, hence our institution is running in Old Govt. Primary school.",
  },
  // S.No 11
  {
    id: 11,
    name: "Nankramguda",
    type: "PVC",
    category: "PVC",
    mandal: "Serilingampally",
    district: "Rangareddy",
    coordinates: { lat: 17.419, lng: 78.365 },
    landArea: "170",
    ownership: "GP/GHMC",
    remarks: "",
  },
  // S.No 12
  {
    id: 12,
    name: "Narsingi",
    type: "PVC",
    category: "PVC",
    mandal: "Gandipet",
    district: "Rangareddy",
    coordinates: { lat: 17.377422, lng: 67.64712 }, // note: longitude seems wrong (67.6) but keep as given
    landArea: "575",
    ownership: "GHMC",
    remarks: "",
  },
  // S.No 13
  {
    id: 13,
    name: "Saroornagar",
    type: "PVC",
    category: "PVC",
    mandal: "Saroornagar",
    district: "Rangareddy",
    coordinates: { lat: 17.357321, lng: 78.536001 },
    landArea: "400",
    ownership: "GHMC",
    remarks: "Urgent Need of Repairs as building is in debilitating situation",
  },
  // S.No 14
  {
    id: 14,
    name: "Pahadihareef",
    type: "PVC",
    category: "PVC",
    mandal: "Balapur",
    district: "Rangareddy",
    coordinates: { lat: 17.331, lng: 78.474 }, // approx from "11936282" (invalid)
    landArea: "150",
    ownership: "Govt.",
    remarks: "",
  },
  // S.No 15
  {
    id: 15,
    name: "Hayathnagar",
    type: "PVC",
    category: "PVC",
    mandal: "Hayathnagar",
    district: "Rangareddy",
    coordinates: { lat: 17.327241, lng: 78.605196 },
    landArea: "500 sq yards",
    ownership: "Govt Land",
    remarks:
      "NH-65 is under widening and marking of the road widening was also done in the open plot o area of the Hospital. Approx.150 sq yards is demarcated for widening of the NH-65 from the available area of hospital",
  },
  // S.No 16
  {
    id: 16,
    name: "Thukkuguda",
    type: "PVC",
    category: "PVC",
    mandal: "Maheshwaram",
    district: "Rangareddy",
    coordinates: { lat: 17.21264, lng: 78.4777 },
    landArea: "960 SQ YARDS",
    ownership: "V&AH DEPARTMENT",
    remarks: "",
  },
  // S.No 17
  {
    id: 17,
    name: "Hyderguda",
    type: "PVC",
    category: "PVC",
    mandal: "Rajendranagar",
    district: "Rangareddy",
    coordinates: { lat: 17.36662, lng: 78.423591 },
    landArea: "Temporarily accommodated in a single room",
    ownership: "GHMC Ward Office, Hyderguda",
    remarks: "*",
  },
  // S.No 18
  {
    id: 18,
    name: "Shamshabad",
    type: "PVC",
    category: "PVC",
    mandal: "Shamshabad",
    district: "Rangareddy",
    coordinates: { lat: 17.2551, lng: 78.395 },
    landArea: "1700 Sq.yds",
    ownership: "Govt",
    remarks: "",
  },
  // S.No 19
  {
    id: 19,
    name: "Thurkamyajal",
    type: "SCAH",
    category: "SCAH",
    mandal: "Abdullapurmet",
    district: "Rangareddy",
    coordinates: { lat: 17.27551, lng: 78.5874 },
    landArea: "200 Sq Yds",
    ownership: "Govt",
    remarks: "",
  },
  // S.No 20
  {
    id: 20,
    name: "Koheda",
    type: "SCAH",
    category: "SCAH",
    mandal: "Abdullapurmet",
    district: "Rangareddy",
    coordinates: { lat: 17.284585, lng: 78.638422 },
    landArea: "200 Sq.Yds",
    ownership: "Govt",
    remarks: "",
  },
  // S.No 21
  {
    id: 21,
    name: "Qudbullapur",
    type: "SCAH",
    category: "SCAH",
    mandal: "Abdullapurmet",
    district: "Rangareddy",
    coordinates: { lat: 17.377914, lng: 78.640702 },
    landArea: "200 Sq Yds",
    ownership: "Govt",
    remarks: "",
  },
  // S.No 22
  {
    id: 22,
    name: "Thorrur",
    type: "SCAH",
    category: "SCAH",
    mandal: "Abdullapurmet",
    district: "Rangareddy",
    coordinates: { lat: 17.289203, lng: 78.608291 },
    landArea: "400 Sq.yds",
    ownership: "Govt",
    remarks: "",
  },
  // S.No 23 – no valid coordinates
  // S.No 24 – no valid coordinates
  // S.No 25
  {
    id: 25,
    name: "Peddaamberpet",
    type: "SCAH",
    category: "SCAH",
    mandal: "Hayathnagar",
    district: "Rangareddy",
    coordinates: { lat: 17.318806, lng: 78.637171 },
    landArea: "approx 50 sq yards",
    ownership: "Govt Land",
    remarks:
      "Jointly office shared with Mandal Arogya Pradhamika Kendram (Palle davakana)",
  },
  // S.No 26 – no building
  // S.No 27
  {
    id: 27,
    name: "Raidurgam",
    type: "SCAH",
    category: "SCAH",
    mandal: "Serilingampally",
    district: "Rangareddy",
    coordinates: { lat: 17.41245, lng: 78.39251 },
    landArea: "120",
    ownership: "GP/GHMC",
    remarks: "",
  },
  // S.No 28
  {
    id: 28,
    name: "Chinnagolkonda",
    type: "SCAH",
    category: "SCAH",
    mandal: "Shamshabad",
    district: "Rangareddy",
    coordinates: { lat: 17.2101, lng: 78.3928 },
    landArea: "20sq.yards",
    ownership: "G.P building",
    remarks: "",
  },
  // S.No 29
  {
    id: 29,
    name: "RAVIRYALA",
    type: "SCAH",
    category: "SCAH",
    mandal: "Maheshwaram",
    district: "Rangareddy",
    coordinates: { lat: 17.215452, lng: 78.510762 },
    landArea: "400 SQ YARDS",
    ownership: "LAND BELONGS TO GRAMPANCHAYATH",
    remarks: "",
  },
  // S.No 30
  {
    id: 30,
    name: "Kondapur",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Serilingampally",
    district: "Rangareddy",
    coordinates: { lat: 17.46331, lng: 78.341122 },
    landArea: "180 Sq. yards",
    ownership: "Rent free GHMC building, but not being used since 10 years",
    remarks:
      "As the building is in dilapidated condition, SC(AH) Kondapur has been shifted to PVC Madhapur 10 years ago and is running from PVC since then.",
  },
  // S.No 31
  {
    id: 31,
    name: "AVH, Medchal",
    type: "AVH",
    category: "AVH",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.65735, lng: 78.476082 },
    landArea: "430",
    ownership: "Govt",
    remarks: "",
  },
  // S.No 32
  {
    id: 32,
    name: "PVC ,Dabilpur",
    type: "PVC",
    category: "PVC",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.666197, lng: 78.468969 },
    landArea: "397",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 33
  {
    id: 33,
    name: "SCAH , Nuthankal",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.682152, lng: 78.442322 },
    landArea: "80",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 34
  {
    id: 34,
    name: "SCAH, SriRangavaram",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.653238, lng: 78.424329 },
    landArea: "120",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 35
  {
    id: 35,
    name: "SCAH, Gowdavelly",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.611757, lng: 78.468936 },
    landArea: "160",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 36
  {
    id: 36,
    name: "SCAH, Yellampet",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.4815742, lng: 78.4268947 },
    landArea: "400",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 37
  {
    id: 37,
    name: "PVC.Pudur",
    type: "PVC",
    category: "PVC",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.62226, lng: 78.525427 },
    landArea: "762",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 38
  {
    id: 38,
    name: "SCAH, G. P.pally",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.568392, lng: 78.48034 },
    landArea: "100",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 39
  {
    id: 39,
    name: "SCAH, Ravalkole",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Medchal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.658552, lng: 78.48034 },
    landArea: "150",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 40
  {
    id: 40,
    name: "PVC,Shamirpet",
    type: "PVC",
    category: "PVC",
    mandal: "Shamirpet",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.597079, lng: 78.565788 },
    landArea: "917",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 41
  {
    id: 41,
    name: "SCAH, Ponnal",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Shamirpet",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.603591, lng: 78.621546 },
    landArea: "164",
    ownership: "Grama Kamtam",
    remarks: "",
  },
  // S.No 42
  {
    id: 42,
    name: "SCAH, Turkapally",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Shamirpet",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.674547, lng: 78.586059 },
    landArea: "251",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 43
  {
    id: 43,
    name: "SCAH, Lalgadi Malakpet",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Shamirpet",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.63245, lng: 78.602838 },
    landArea: "150",
    ownership: "Grama kantam",
    remarks: "",
  },
  // S.No 44
  {
    id: 44,
    name: "PVC,Yamjal",
    type: "PVC",
    category: "PVC",
    mandal: "Shamirpet",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.513521, lng: 78.523489 },
    landArea: "125",
    ownership: "Grama Kamtam",
    remarks: "",
  },
  // S.No 45
  {
    id: 45,
    name: "PVC,Mudchintalapally",
    type: "PVC",
    category: "PVC",
    mandal: "MCPally",
    district: "Medchal -Malkajigiri",
    coordinates: { lat: 17.3908, lng: 78.4122 },
    landArea: "20 guntas",
    ownership: "govt",
    remarks: "",
  },
  // S.No 46
  {
    id: 46,
    name: "PVC,Uddemarry",
    type: "PVC",
    category: "PVC",
    mandal: "Mcpally",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.617107, lng: 78.678221 },
    landArea: "255",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 47
  {
    id: 47,
    name: "SCAH, Keshavapur",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Mcpally",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.58902, lng: 78.689619 },
    landArea: "162",
    ownership: "Gramakantam",
    remarks: "",
  },
  // S.No 48
  {
    id: 48,
    name: "PVC,Keesara",
    type: "PVC",
    category: "PVC",
    mandal: "Keesara",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.520597, lng: 78.666658 },
    landArea: "550",
    ownership: "Gramakantam",
    remarks: "",
  },
  // S.No 49
  {
    id: 49,
    name: "SCAH, Cheriyal",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Keesara",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.516015, lng: 78.628221 },
    landArea: "116",
    ownership: "Gramakantam",
    remarks: "",
  },
  // S.No 50
  {
    id: 50,
    name: "SCAH, Bhogaram",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Keesara",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.58196, lng: 78.688657 },
    landArea: "582",
    ownership: "Gramakantam",
    remarks: "",
  },
  // S.No 51
  {
    id: 51,
    name: "PVC,Nagaram",
    type: "PVC",
    category: "PVC",
    mandal: "Keesara",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.488221, lng: 78.604449 },
    landArea: "506",
    ownership: ".Govt",
    remarks: "",
  },
  // S.No 52
  {
    id: 52,
    name: "SCAH, Rampally",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Keesara",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.4672, lng: 78.6419 },
    landArea: "70",
    ownership: "Gramakantam",
    remarks: "",
  },
  // S.No 53 – no building
  // S.No 54
  {
    id: 54,
    name: "PVC.Ghatkesar",
    type: "PVC",
    category: "PVC",
    mandal: "Ghatkesar",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.449142, lng: 78.68468 },
    landArea: "230 sq yards",
    ownership: "donated",
    remarks: "No legal issues or encroachment",
  },
  // S.No 55
  {
    id: 55,
    name: "SCAH,Edulabad",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Edulabad",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.418601, lng: 78.708095 },
    landArea: "620,sq yards",
    ownership: "Gramakantam",
    remarks: "",
  },
  // S.No 56
  {
    id: 56,
    name: "SCAH,Ankushapur.",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Ghatkesar",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.445542, lng: 78.728276 },
    landArea: "110",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 57
  {
    id: 57,
    name: "PVC.Pocharam",
    type: "PVC",
    category: "PVC",
    mandal: "ghatkesar",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.4249, lng: 78.6448 },
    landArea: "180",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 58
  {
    id: 58,
    name: "SCAH,Korremula.",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "ghatkesar",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.4043, lng: 78.6662 },
    landArea: "150",
    ownership: "Donated, grama kantam",
    remarks: "",
  },
  // S.No 59
  {
    id: 59,
    name: "SCAH, Prathap Singaram.",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "ghatkesar",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.38639, lng: 78.66194 },
    landArea: "156",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 60
  {
    id: 60,
    name: "SCAH,Kachavani Singaram",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "ghatkesar",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.3878, lng: 78.6304 },
    landArea: "156",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 61
  {
    id: 61,
    name: "SCAH,Cherlapally.",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Kapara",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.469936, lng: 78.60974 },
    landArea: "45",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 62
  {
    id: 62,
    name: "SCAH, Boduppal.",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "medipally",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.4139, lng: 78.5783 },
    landArea: "50",
    ownership: "Boduppal Municipality Donated",
    remarks: "",
  },
  // S.No 63
  {
    id: 63,
    name: "A.V.H.Uppal.",
    type: "AVH",
    category: "AVH",
    mandal: "Uppal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.3715, lng: 78.5695 },
    landArea: "150",
    ownership: "Ghmc donated",
    remarks: "",
  },
  // S.No 64 – no building
  // S.No 65
  {
    id: 65,
    name: "PVC,Malkajgiri",
    type: "PVC",
    category: "PVC",
    mandal: "Malkajgiri",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.449291, lng: 78.536421 },
    landArea: "200sq yards",
    ownership: "Ghmc",
    remarks: "",
  },
  // S.No 66
  {
    id: 66,
    name: "PVC,Alwal",
    type: "PVC",
    category: "PVC",
    mandal: "ALWAL",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.507205, lng: 78.504553 },
    landArea: "1470 Sq yards",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 67
  {
    id: 67,
    name: "SCAH, Bollaram",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Alwal",
    district: "Medchal-Malkajgiri",
    coordinates: { lat: 17.532392, lng: 78.515896 },
    landArea: "2 guntas",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 68
  {
    id: 68,
    name: "SCAH, Kowkur",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Alwal",
    district: "Medcal-Malkajgiri",
    coordinates: { lat: 17.526522, lng: 78.541076 },
    landArea: "130",
    ownership: "Donated",
    remarks: "",
  },
  // S.No 69
  {
    id: 69,
    name: "PVC,Kukatpally",
    type: "PVC",
    category: "PVC",
    mandal: "Kukatpally",
    district: "Medchal - Malkajgiri",
    coordinates: { lat: 17.455913, lng: 78.438751 },
    landArea: "186 sq yards",
    ownership: "Gramakantam",
    remarks: "",
  },
  // S.No 70
  {
    id: 70,
    name: "PVC, Balanagar",
    type: "PVC",
    category: "PVC",
    mandal: "Balanagar",
    district: "Medchal - Malkajgiri",
    coordinates: { lat: 17.466893, lng: 78.454686 },
    landArea: "100",
    ownership: "GHMC community hall",
    remarks: "",
  },
  // S.No 71
  {
    id: 71,
    name: "PVC,Quthubullapur",
    type: "PVC",
    category: "PVC",
    mandal: "Quthbullapur",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.501944, lng: 78.455556 }, // approx from "17°30`067N/78°27`320E"
    landArea: "170 sq yards",
    ownership: "govt land",
    remarks: "",
  },
  // S.No 72
  {
    id: 72,
    name: "SCAH, Jeedimetla",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Jeedimetla",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.509598, lng: 78.476868 },
    landArea: "30 sq yards",
    ownership: "Rent free building",
    remarks: "",
  },
  // S.No 73
  {
    id: 73,
    name: "SCAH, Gajularamaram",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Gajularamaram",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.501, lng: 78.4555 }, // approx from "17°30062.N/78.27326E"
    landArea: "125 sq yards",
    ownership: "govt land",
    remarks: "",
  },
  // S.No 74
  {
    id: 74,
    name: "PVC,Dundigal",
    type: "PVC",
    category: "PVC",
    mandal: "dundigal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.607394, lng: 78.416455 },
    landArea: "220",
    ownership: "Donated by GP",
    remarks: "",
  },
  // S.No 75
  {
    id: 75,
    name: "SCAH, Bowrampet",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Dundigal",
    district: "Medchal Malkajagiri",
    coordinates: { lat: 17.561, lng: 78.398 },
    landArea: "120",
    ownership: "Donated GP",
    remarks: "",
  },
  // S.No 76
  {
    id: 76,
    name: "SCAH, Kompally",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Dundigal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.54, lng: 78.4 },
    landArea: "200",
    ownership: "Donated GP",
    remarks: "",
  },
  // S.No 77
  {
    id: 77,
    name: "SCAH, Bachupally",
    type: "SCAH",
    category: "SC(AH)",
    mandal: "Dundigal",
    district: "Medchal Malkajgiri",
    coordinates: { lat: 17.539, lng: 78.36 },
    landArea: "100",
    ownership: "Govt",
    remarks: "",
  },

  // S.No 78
  {
    id: 1,
    applicantNumber: "NLM202212010000042",
    applicantName: "MUVVA RAMA RAO",
    type: "NLM",
    category: "General",
    mobileNumber: "7670993033",
    district: "NALGONDA",
    coordinates: { lat: 16.8678895, lng: 79.435929 },
  },
  {
    id: 2,
    applicantNumber: "NLM202207040000049",
    applicantName: "ENJAM SRINIVASA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9059862059",
    district: "NALGONDA",
    coordinates: { lat: 16.8199432, lng: 79.3676753 },
  },
  {
    id: 3,
    applicantNumber: "NLM202212030000034",
    applicantName: "BAREDDY MADHAVI",
    type: "NLM",
    category: "General",
    mobileNumber: "9010426162",
    district: "NALGONDA",
    coordinates: { lat: 16.8470879, lng: 79.3578201 },
  },
  {
    id: 4,
    applicantNumber: "NLM202201250000060",
    applicantName: "NENAVATH BALKOTI",
    type: "NLM",
    category: "ST",
    mobileNumber: "9399990916",
    district: "NALGONDA",
    coordinates: { lat: 16.72577, lng: 78.869075 },
  },
  {
    id: 5,
    applicantNumber: "NLM202201260000011",
    applicantName: "KAMIREDDY NARENDAR REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9494467116",
    district: "BHADRADRI KOTHAGUDEM",
    coordinates: { lat: 17.6452908, lng: 80.853174 },
  },
  {
    id: 6,
    applicantNumber: "NLM202310210000215",
    applicantName: "RAMAVATH UDAYASRI",
    type: "NLM",
    category: "ST",
    mobileNumber: "9110723253",
    district: "NALGONDA",
    coordinates: { lat: 16.979352, lng: 79.4610945 },
  },
  {
    id: 7,
    applicantNumber: "NLM202201060000167",
    applicantName: "MANDA RAJITHA",
    type: "NLM",
    category: "General",
    mobileNumber: "9182661431",
    district: "JAGITIAL",
    coordinates: { lat: 18.8354207, lng: 79.1225708 },
  },
  {
    id: 8,
    applicantNumber: "NLM202110210000022",
    applicantName: "B Chakravarthy",
    type: "NLM",
    category: "Others",
    mobileNumber: "9959925789",
    district: "MAHABUBNAGAR",
    coordinates: { lat: 16.7901419, lng: 78.3159411 },
  },
  {
    id: 9,
    applicantNumber: "NLM202110280000138",
    applicantName: "KONDA BALAKISHAN",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9000477234",
    district: "JAGITIAL",
    coordinates: { lat: 18.7147684, lng: 78.9113051 },
  },
  {
    id: 10,
    applicantNumber: "NLM202110300000056",
    applicantName: "DEVA MALLAIAH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9866285902",
    district: "JAGITIAL",
    coordinates: { lat: 18.9587257, lng: 78.6729361 },
  },
  {
    id: 11,
    applicantNumber: "NLM202203310000062",
    applicantName: "Mohammad Shafiuddin",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9848850410",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.6013546, lng: 78.8427019 },
  },
  {
    id: 12,
    applicantNumber: "NLM202302050000015",
    applicantName: "Marri Srinivas Reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9849953549",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.290746, lng: 79.531278 },
  },
  {
    id: 13,
    applicantNumber: "NLM202110270000081",
    applicantName: "MUDAM KISHORE",
    type: "NLM",
    category: "OBC",
    mobileNumber: "6303047410",
    district: "JAGITIAL",
    coordinates: { lat: 18.7622552, lng: 78.6131019 },
  },
  {
    id: 14,
    applicantNumber: "NLM202207230000056",
    applicantName: "KETHAVATH RAMULU",
    type: "NLM",
    category: "ST",
    mobileNumber: "8788547943",
    district: "VIKARABAD",
    coordinates: { lat: 17.09611, lng: 77.79372 },
  },
  {
    id: 15,
    applicantNumber: "NLM202110270000070",
    applicantName: "GUJJULA KRISHNA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "7702651964",
    district: "NIRMAL",
    coordinates: { lat: 18.9980108, lng: 78.5430269 },
  },
  {
    id: 16,
    applicantNumber: "NLM202110300000416",
    applicantName: "BAIRA SUBHASH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "7337456891",
    district: "NIZAMABAD",
    coordinates: { lat: 18.5610801, lng: 78.2547421 },
  },
  {
    id: 17,
    applicantNumber: "NLM202110300000264",
    applicantName: "BAIRA SUNAND",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9390744447",
    district: "NIZAMABAD",
    coordinates: { lat: 18.6312929, lng: 78.0516232 },
  },
  {
    id: 18,
    applicantNumber: "NLM202110270000090",
    applicantName: "NOMULA NARSIMHA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9912008834",
    district: "JAGITIAL",
    coordinates: { lat: 18.851593, lng: 78.8100882 },
  },
  {
    id: 19,
    applicantNumber: "NLM202302070000114",
    applicantName: "KATRAVATH SAROJA CHAND",
    type: "NLM",
    category: "ST",
    mobileNumber: "7711997706",
    district: "MAHABUBNAGAR",
    coordinates: { lat: 16.744963, lng: 77.86615 },
  },
  {
    id: 20,
    applicantNumber: "NLM202112060000046",
    applicantName: "MOHAMMED MAQBOOL",
    type: "NLM",
    category: "General",
    mobileNumber: "9989308771",
    district: "JAGITIAL",
    coordinates: { lat: 18.752849, lng: 78.80499 },
  },
  {
    id: 21,
    applicantNumber: "NLM202110270000056",
    applicantName: "GONE MAMATHA",
    type: "NLM",
    category: "General",
    mobileNumber: "9553039890",
    district: "JAGITIAL",
    coordinates: { lat: 19.0631097, lng: 79.0201828 },
  },
  {
    id: 22,
    applicantNumber: "NLM202304180000057",
    applicantName: "CHOUDARAPALLI MANGA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9010345624",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.661873, lng: 79.129616 },
  },
  {
    id: 23,
    applicantNumber: "NLM202111300000073",
    applicantName: "BAIRI VINOD",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8374707095",
    district: "JAGITIAL",
    coordinates: { lat: 18.94216, lng: 78.98273 },
  },
  {
    id: 24,
    applicantNumber: "NLM202305240000080",
    applicantName: "Yellu Ganesh",
    type: "NLM",
    category: "General",
    mobileNumber: "9985458518",
    district: "MAHABUBABAD",
    coordinates: { lat: 17.471785, lng: 79.751755 },
  },
  {
    id: 25,
    applicantNumber: "NLM202110140000032",
    applicantName: "B Laxminarsimha Yadav",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9985768283",
    district: "MAHABUBNAGAR",
    coordinates: { lat: 16.6031891, lng: 77.9788615 },
  },
  {
    id: 26,
    applicantNumber: "NLM202112080000071",
    applicantName: "MYAKA LAXMAN",
    type: "NLM",
    category: "SC",
    mobileNumber: "9441376500",
    district: "JAGITIAL",
    coordinates: { lat: 18.670968, lng: 78.946599 },
  },
  {
    id: 27,
    applicantNumber: "NLM202110270000084",
    applicantName: "Goskula Rakesh",
    type: "NLM",
    category: "OBC",
    mobileNumber: "7702549546",
    district: "PEDDAPALLI",
    coordinates: { lat: 18.4902463, lng: 79.3324733 },
  },
  {
    id: 28,
    applicantNumber: "NLM202304100000099",
    applicantName: "GAJJALA LEELADHAR REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "7989099481",
    district: "BHADRADRI KOTHAGUDEM",
    coordinates: { lat: 17.792911, lng: 80.851314 },
  },
  {
    id: 29,
    applicantNumber: "NLM202305040000125",
    applicantName: "Dursheti Rajamouli",
    type: "NLM",
    category: "General",
    mobileNumber: "9959491317",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.4976452, lng: 79.0288683 },
  },
  {
    id: 30,
    applicantNumber: "NLM202302190000039",
    applicantName: "Dasari Padma",
    type: "NLM",
    category: "General",
    mobileNumber: "9959066994",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.2536376, lng: 79.1645312 },
  },
  {
    id: 31,
    applicantNumber: "NLM202112190000018",
    applicantName: "Sammi Reddy Kalva",
    type: "NLM",
    category: "General",
    mobileNumber: "9866050573",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.253675, lng: 79.164588 },
  },
  {
    id: 32,
    applicantNumber: "NLM202210310000060",
    applicantName: "Annampatla Rajeswari",
    type: "NLM",
    category: "SC",
    mobileNumber: "9908518181",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.33247, lng: 78.52566 },
  },
  {
    id: 33,
    applicantNumber: "NLM202110290000218",
    applicantName: "GOGURI GOPAL REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9989455070",
    district: "JAGITIAL",
    coordinates: { lat: 18.5896723, lng: 78.9417242 },
  },
  {
    id: 34,
    applicantNumber: "NLM202110280000023",
    applicantName: "KASARAPU PRAVEEN KUMAR",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9000414414",
    district: "JAGITIAL",
    coordinates: { lat: 18.7860799, lng: 79.0434945 },
  },
  {
    id: 35,
    applicantNumber: "NLM202110240000053",
    applicantName: "BEDADHA BHEEMANNA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9440615102",
    district: "NIRMAL",
    coordinates: { lat: 19.0903411, lng: 78.8803676 },
  },
  {
    id: 36,
    applicantNumber: "NLM202112080000015",
    applicantName: "RAMCHANDRAM BANDARI",
    type: "NLM",
    category: "General",
    mobileNumber: "9440139637",
    district: "JAGITIAL",
    coordinates: { lat: 18.950439, lng: 78.753016 },
  },
  {
    id: 37,
    applicantNumber: "NLM202110080000017",
    applicantName: "DEVASANI THIRUPATHI REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9705996699",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.2854716, lng: 79.1600383 },
  },
  {
    id: 38,
    applicantNumber: "NLM202110260000076",
    applicantName: "ANNAMANENI SANDEEP RAO",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9097966666",
    district: "JAGITIAL",
    coordinates: { lat: 18.8693082, lng: 79.0215352 },
  },
  {
    id: 39,
    applicantNumber: "NLM202110210000050",
    applicantName: "Karne Rajendar",
    type: "NLM",
    category: "General",
    mobileNumber: "9959234208",
    district: "JAGITIAL",
    coordinates: { lat: 18.8261658, lng: 78.8477259 },
  },
  {
    id: 40,
    applicantNumber: "NLM202304280000025",
    applicantName: "AVANAGANTI SRAVAN",
    type: "NLM",
    category: "General",
    mobileNumber: "9182418674",
    district: "NALGONDA",
    coordinates: { lat: 16.9655492, lng: 79.2845772 },
  },
  {
    id: 41,
    applicantNumber: "NLM202202180000048",
    applicantName: "DARMASOTH HARILAL",
    type: "NLM",
    category: "ST",
    mobileNumber: "9740252642",
    district: "MAHABUBABAD",
    coordinates: { lat: 17.4758696, lng: 79.8690484 },
  },
  {
    id: 42,
    applicantNumber: "NLM202201060000159",
    applicantName: "MANDHA VENKATA RAMANA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9490004210",
    district: "JAGITIAL",
    coordinates: { lat: 18.8240418, lng: 79.1167232 },
  },
  {
    id: 43,
    applicantNumber: "NLM202204050000007",
    applicantName: "GADDAM KAVITHA",
    type: "NLM",
    category: "General",
    mobileNumber: "8500959204",
    district: "NALGONDA",
    coordinates: { lat: 16.9429627, lng: 79.2155073 },
  },
  {
    id: 44,
    applicantNumber: "NLM202110300000336",
    applicantName: "KURMILLA RAGHURAM MURTHY",
    type: "NLM",
    category: "SC",
    mobileNumber: "9494444366",
    district: "NALGONDA",
    coordinates: { lat: 17.2040839, lng: 79.1964876 },
  },
  {
    id: 45,
    applicantNumber: "NLM202110300000090",
    applicantName: "NAKKA VIJAY BABU",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8686862231",
    district: "NIZAMABAD",
    coordinates: { lat: 18.6353506, lng: 77.8834191 },
  },
  {
    id: 46,
    applicantNumber: "NLM202301100000042",
    applicantName: "POREDDY VENKAT REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "8686223456",
    district: "NALGONDA",
    coordinates: { lat: 17.0593323, lng: 79.5034293 },
  },
  {
    id: 47,
    applicantNumber: "NLM202202120000093",
    applicantName: "Sankineni Sunil Kumar",
    type: "NLM",
    category: "General",
    mobileNumber: "9395151004",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.45008, lng: 79.18526 },
  },
  {
    id: 48,
    applicantNumber: "NLM202110290000007",
    applicantName: "THATIPARTHI RAMCHANDRA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9440666699",
    district: "JAGITIAL",
    coordinates: { lat: 18.6672414, lng: 78.9099055 },
  },
  {
    id: 49,
    applicantNumber: "NLM202306280000091",
    applicantName: "KUMBAM MADAN GOPAL REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "7893412601",
    district: "NALGONDA",
    coordinates: { lat: 16.8855151, lng: 78.9585208 },
  },
  {
    id: 50,
    applicantNumber: "NLM202302080000189",
    applicantName: "Jillala Sudhakar",
    type: "NLM",
    category: "General",
    mobileNumber: "9989795345",
    district: "JAGITIAL",
    coordinates: { lat: 18.896393, lng: 78.812733 },
  },
  {
    id: 51,
    applicantNumber: "NLM202201110000063",
    applicantName: "Maidam Thirupathi",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8328668572",
    district: "JAGITIAL",
    coordinates: { lat: 18.970055, lng: 79.095762 },
  },
  {
    id: 52,
    applicantNumber: "NLM202203140000085",
    applicantName: "BADDAM SANJEEV REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9948242486",
    district: "JAGITIAL",
    coordinates: { lat: 18.809646, lng: 78.59938 },
  },
  {
    id: 53,
    applicantNumber: "NLM202110290000212",
    applicantName: "MITTAPELLY THIRUPATHI",
    type: "NLM",
    category: "General",
    mobileNumber: "9676954767",
    district: "JAGITIAL",
    coordinates: { lat: 18.8479829, lng: 78.8292391 },
  },
  {
    id: 54,
    applicantNumber: "NLM202202270000072",
    applicantName: "Katipelli Dayananda Reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9849220765",
    district: "JAGITIAL",
    coordinates: { lat: 18.72384, lng: 78.86298 },
  },
  {
    id: 55,
    applicantNumber: "NLM202305170000040",
    applicantName: "Polisu Sangameshwar",
    type: "NLM",
    category: "General",
    mobileNumber: "9000291626",
    district: "SANGAREDDY",
    coordinates: { lat: 17.6075232, lng: 78.0798191 },
  },
  {
    id: 56,
    applicantNumber: "NLM202304210000041",
    applicantName: "Kola Manjula",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9100589110",
    district: "JAGITIAL",
    coordinates: { lat: 18.970974, lng: 79.076972 },
  },
  {
    id: 57,
    applicantNumber: "NLM202201290000037",
    applicantName: "Pulipalupula Andalu",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9182508007",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.361364, lng: 79.12921 },
  },
  {
    id: 58,
    applicantNumber: "NLM202204050000008",
    applicantName: "GADDAM JAYASREE",
    type: "NLM",
    category: "General",
    mobileNumber: "9440044143",
    district: "NALGONDA",
    coordinates: { lat: 16.9429627, lng: 79.2155073 },
  },
  {
    id: 59,
    applicantNumber: "NLM202202260000010",
    applicantName: "GUGGILLA THIRUPATHI",
    type: "NLM",
    category: "General",
    mobileNumber: "9492201633",
    district: "JAGITIAL",
    coordinates: { lat: 18.727368, lng: 78.847297 },
  },
  {
    id: 60,
    applicantNumber: "NLM202212290000091",
    applicantName: "KONGARI  THIRUPATHI",
    type: "NLM",
    category: "General",
    mobileNumber: "9440740687",
    district: "JAGITIAL",
    coordinates: { lat: 18.908738, lng: 78.823374 },
  },
  {
    id: 61,
    applicantNumber: "NLM202110210000006",
    applicantName: "MADHAVI BHANOTHU",
    type: "NLM",
    category: "ST",
    mobileNumber: "8309050103",
    district: "JANGOAN",
    coordinates: { lat: 17.6113801, lng: 79.3991697 },
  },
  {
    id: 62,
    applicantNumber: "NLM202305020000060",
    applicantName: "KESABONI SHIVA",
    type: "NLM",
    category: "Others",
    mobileNumber: "6305302778",
    district: "RANGA REDDY",
    coordinates: { lat: 16.82425, lng: 78.725793 },
  },
  {
    id: 63,
    applicantNumber: "NLM202301160000102",
    applicantName: "Sowmya Ontela",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9493264486",
    district: "JAGITIAL",
    coordinates: { lat: 18.5913036, lng: 78.9557709 },
  },
  {
    id: 64,
    applicantNumber: "NLM202203260000062",
    applicantName: "JELLA ANJANEYULU",
    type: "NLM",
    category: "Others",
    mobileNumber: "9849741909",
    district: "RANGA REDDY",
    coordinates: { lat: 16.8335256, lng: 78.7196358 },
  },
  {
    id: 65,
    applicantNumber: "NLM202110280000041",
    applicantName: "MERUGU RAJESHAM",
    type: "NLM",
    category: "General",
    mobileNumber: "9866159617",
    district: "MANCHERIAL",
    coordinates: { lat: 18.8496383, lng: 79.6754694 },
  },
  {
    id: 66,
    applicantNumber: "NLM202110300000437",
    applicantName: "GUNTI DEVAIAH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9440002643",
    district: "JAGITIAL",
    coordinates: { lat: 18.948383, lng: 78.63178 },
  },
  {
    id: 67,
    applicantNumber: "NLM202110300000357",
    applicantName: "Damuka Jayachander",
    type: "NLM",
    category: "SC",
    mobileNumber: "7386454580",
    district: "PEDDAPALLI",
    coordinates: { lat: 18.7756948, lng: 79.7071384 },
  },
  {
    id: 68,
    applicantNumber: "NLM202206080000009",
    applicantName: "GAJJI SHIRISHA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9505631147",
    district: "NALGONDA",
    coordinates: { lat: 16.8199432, lng: 79.3676753 },
  },
  {
    id: 69,
    applicantNumber: "NLM202203170000038",
    applicantName: "CHIKYALA DHEERAJ RAO",
    type: "NLM",
    category: "General",
    mobileNumber: "7893308611",
    district: "NIRMAL",
    coordinates: { lat: 19.07988, lng: 78.517277 },
  },
  {
    id: 70,
    applicantNumber: "NLM202305070000005",
    applicantName: "Padidam Malla Reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9849944016",
    district: "WARANGAL",
    coordinates: { lat: 17.8901934, lng: 79.7091368 },
  },
  {
    id: 71,
    applicantNumber: "NLM202306280000067",
    applicantName: "CHANAMOLU SRINIVASA RAO",
    type: "NLM",
    category: "General",
    mobileNumber: "9848264642",
    district: "KHAMMAM",
    coordinates: { lat: 17.245515, lng: 80.151754 },
  },
  {
    id: 72,
    applicantNumber: "NLM202401100000023",
    applicantName: "Baddam Padma",
    type: "NLM",
    category: "General",
    mobileNumber: "9441154201",
    district: "NIZAMABAD",
    coordinates: { lat: 18.871832, lng: 78.511387 },
  },
  {
    id: 73,
    applicantNumber: "NLM202401010000145",
    applicantName: "BADDAM LAXMI",
    type: "NLM",
    category: "General",
    mobileNumber: "8886847338",
    district: "NIZAMABAD",
    coordinates: { lat: 18.881571, lng: 78.50949 },
  },
  {
    id: 74,
    applicantNumber: "NLM202208290000025",
    applicantName: "KOMMINENI MUDDU KRISHNA",
    type: "NLM",
    category: "General",
    mobileNumber: "9848053010",
    district: "SURYAPET",
    coordinates: { lat: 17.0982621, lng: 79.8903454 },
  },
  {
    id: 75,
    applicantNumber: "NLM202308060000089",
    applicantName: "Goguri Sumalatha",
    type: "NLM",
    category: "General",
    mobileNumber: "8885433457",
    district: "RAJANNA SIRCILLA",
    coordinates: { lat: 18.268481, lng: 78.952532 },
  },
  {
    id: 76,
    applicantNumber: "NLM202204160000044",
    applicantName: "GADDAM RAJESHAM GOUD",
    type: "NLM",
    category: "General",
    mobileNumber: "9440393318",
    district: "JAGITIAL",
    coordinates: { lat: 18.8094747, lng: 78.7542578 },
  },
  {
    id: 77,
    applicantNumber: "NLM202110190000035",
    applicantName: "musku  karunakar reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9491322833",
    district: "JAGITIAL",
    coordinates: { lat: 18.787587, lng: 79.044201 },
  },
  {
    id: 78,
    applicantNumber: "NLM202312030000040",
    applicantName: "MD ANWAR PASHA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9849008361",
    district: "HANUMAKONDA",
    coordinates: { lat: 17.884804, lng: 79.502902 },
  },
  {
    id: 79,
    applicantNumber: "NLM202110230000064",
    applicantName: "MADHUKAR SRIRAM",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9241361461",
    district: "JAGITIAL",
    coordinates: { lat: 18.575312, lng: 78.984069 },
  },
  {
    id: 80,
    applicantNumber: "NLM202110260000068",
    applicantName: "GUDA SOUJANYA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9705228287",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.443437, lng: 79.156793 },
  },
  {
    id: 81,
    applicantNumber: "NLM202110280000005",
    applicantName: "R SATYA NARAYANA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9959649731",
    district: "JOGULAMBA GADWAL",
    coordinates: { lat: 16.2007176, lng: 77.8790661 },
  },
  {
    id: 82,
    applicantNumber: "NLM202112100000055",
    applicantName: "GUDI ANANTHA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9441758318",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.569161, lng: 79.015445 },
  },
  {
    id: 83,
    applicantNumber: "NLM202211170000045",
    applicantName: "ERRABELLI RAJA RAO",
    type: "NLM",
    category: "General",
    mobileNumber: "8500597911",
    district: "WARANGAL URBAN",
    coordinates: { lat: 17.833596, lng: 79.621498 },
  },
  {
    id: 84,
    applicantNumber: "NLM202110140000057",
    applicantName: "MARADWAR PRAVEENKUMAR",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9491004400",
    district: "KAMAREDDY",
    coordinates: { lat: 18.5041884, lng: 77.6598762 },
  },
  {
    id: 85,
    applicantNumber: "NLM202302050000023",
    applicantName: "Polneni Vijaya",
    type: "NLM",
    category: "General",
    mobileNumber: "9989765889",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.293369, lng: 79.487893 },
  },
  {
    id: 86,
    applicantNumber: "NLM202110300000293",
    applicantName: "Dyava Amar",
    type: "NLM",
    category: "Others",
    mobileNumber: "9494997072",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.6084163, lng: 79.0998895 },
  },
  {
    id: 87,
    applicantNumber: "NLM202110270000085",
    applicantName: "THOTA RAJA SHEKAR",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9573907040",
    district: "JAGITIAL",
    coordinates: { lat: 18.948148, lng: 78.755419 },
  },
  {
    id: 88,
    applicantNumber: "NLM202110260000072",
    applicantName: "GUDA MALLA  REDDY",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9494788077",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.4465815, lng: 79.1606735 },
  },
  {
    id: 89,
    applicantNumber: "NLM202110270000033",
    applicantName: "GADDAM SRINIVAS",
    type: "NLM",
    category: "General",
    mobileNumber: "9949826515",
    district: "JAGITIAL",
    coordinates: { lat: 18.973327, lng: 78.765154 },
  },
  {
    id: 90,
    applicantNumber: "NLM202303290000163",
    applicantName: "BUSIREDDY RAM MOHAN REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "8790074655",
    district: "NALGONDA",
    coordinates: { lat: 17.232025, lng: 79.1261474 },
  },
  {
    id: 91,
    applicantNumber: "NLM202212020000046",
    applicantName: "BEDADHA VENKATESH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9502432136",
    district: "MANCHERIAL",
    coordinates: { lat: 19.11726, lng: 78.981919 },
  },
  {
    id: 92,
    applicantNumber: "NLM202110300000022",
    applicantName: "GOLLA RAJU",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9493594388",
    district: "MEDAK",
    coordinates: { lat: 17.5355294, lng: 78.9380218 },
  },
  {
    id: 93,
    applicantNumber: "NLM202202010000088",
    applicantName: "Neelagiri Ganga Rao",
    type: "NLM",
    category: "General",
    mobileNumber: "9949595520",
    district: "JAGITIAL",
    coordinates: { lat: 18.470618, lng: 79.10667 },
  },
  {
    id: 94,
    applicantNumber: "NLM202110220000058",
    applicantName: "HANMANDLA MANJULATHA",
    type: "NLM",
    category: "General",
    mobileNumber: "9701622155",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.265346, lng: 79.1455048 },
  },
  {
    id: 95,
    applicantNumber: "NLM202110300000201",
    applicantName: "Vontela Krishna Reddy",
    type: "NLM",
    category: "Others",
    mobileNumber: "9440406202",
    district: "KARIMNAGAR",
    coordinates: { lat: 18.5494016, lng: 79.0935756 },
  },
  {
    id: 96,
    applicantNumber: "NLM202303100000021",
    applicantName: "RAJI REDDY KESHI REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9849211486",
    district: "JANGOAN",
    coordinates: { lat: 17.903886, lng: 79.308674 },
  },
  {
    id: 97,
    applicantNumber: "NLM202204050000001",
    applicantName: "Mallesh Pilli",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8464861430",
    district: "NALGONDA",
    coordinates: { lat: 16.722657, lng: 79.016002 },
  },
  {
    id: 98,
    applicantNumber: "NLM202111250000016",
    applicantName: "NAVVA THIRUPATHI",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8008105005",
    district: "JAGITIAL",
    coordinates: { lat: 18.790772, lng: 79.053663 },
  },
  {
    id: 99,
    applicantNumber: "NLM202302170000055",
    applicantName: "Narra Sridhar Reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9704834560",
    district: "NALGONDA",
    coordinates: { lat: 17.1835282, lng: 79.2590868 },
  },
  {
    id: 100,
    applicantNumber: "NLM202310150000121",
    applicantName: "MANUKA MALLESHAM",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9440459419",
    district: "RAJANNA SIRCILLA",
    coordinates: { lat: 18.37118, lng: 78.70717 },
  },
  {
    id: 101,
    applicantNumber: "NLM202205170000063",
    applicantName: "KILARU HYMAVATHI",
    type: "NLM",
    category: "General",
    mobileNumber: "9346134488",
    district: "KHAMMAM",
    coordinates: { lat: 17.3598943, lng: 80.1280594 },
  },
  {
    id: 102,
    applicantNumber: "NLM202303280000149",
    applicantName: "GUTTEDAR ASHWINI NARAYAN",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9949609327",
    district: "HANUMAKONDA",
    coordinates: { lat: 17.9295, lng: 79.470543 },
  },
  {
    id: 103,
    applicantNumber: "NLM202304260000153",
    applicantName: "Cheemala Anitha",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9866969956",
    district: "RANGA REDDY",
    coordinates: { lat: 17.083395, lng: 78.768784 },
  },
  {
    id: 104,
    applicantNumber: "NLM202209260000040",
    applicantName: "KAMIREDDY VENKATA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9985393799",
    district: "BHADRADRI KOTHAGUDEM",
    coordinates: { lat: 17.619802, lng: 80.830435 },
  },
  {
    id: 105,
    applicantNumber: "NLM202307280000146",
    applicantName: "BOINI VIJAY SAGAR",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9849551649",
    district: "PEDDAPALLI",
    coordinates: { lat: 18.6389593, lng: 79.3705403 },
  },
  {
    id: 106,
    applicantNumber: "NLM202110300000244",
    applicantName: "MADHAVAREDDY BUCHIBABU",
    type: "NLM",
    category: "Others",
    mobileNumber: "9849119225",
    district: "KHAMMAM",
    coordinates: { lat: 17.3583409, lng: 80.1280286 },
  },
  {
    id: 107,
    applicantNumber: "NLM202110250000034",
    applicantName: "TALLAPUREDDY NAGIREDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9948304824",
    district: "KHAMMAM",
    coordinates: { lat: 16.8946833, lng: 80.4804485 },
  },
  {
    id: 108,
    applicantNumber: "NLM202110290000018",
    applicantName: "AZMEERA RAVI",
    type: "NLM",
    category: "ST",
    mobileNumber: "9908153544",
    district: "KHAMMAM",
    coordinates: { lat: 17.3519571, lng: 79.9389219 },
  },
  {
    id: 109,
    applicantNumber: "NLM202202110000042",
    applicantName: "Srihari Sriperambudur",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9989603199",
    district: "RANGA REDDY",
    coordinates: { lat: 17.1604626, lng: 78.720695 },
  },
  {
    id: 110,
    applicantNumber: "NLM202110270000019",
    applicantName: "Angampally Goverdhan Sanjeev",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9849522567",
    district: "MAHABUBNAGAR",
    coordinates: { lat: 16.8758041, lng: 78.1528568 },
  },
  {
    id: 111,
    applicantNumber: "NLM202110230000043",
    applicantName: "KANKANALA RAM REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9490162302",
    district: "MAHABUBNAGAR",
    coordinates: { lat: 16.6426151, lng: 78.1042905 },
  },
  {
    id: 112,
    applicantNumber: "NLM202303080000111",
    applicantName: "MATLA LINGAM",
    type: "NLM",
    category: "SC",
    mobileNumber: "9440006498",
    district: "SIDDIPET",
    coordinates: { lat: 18.126683, lng: 79.03667 },
  },
  {
    id: 113,
    applicantNumber: "NLM202110170000005",
    applicantName: "JAMMULA LAXMI NARAYANA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9494946228",
    district: "MAHABUBNAGAR",
    coordinates: { lat: 16.5035238, lng: 77.8132713 },
  },
  {
    id: 114,
    applicantNumber: "NLM202202150000026",
    applicantName: "RRR HITECH FARMS LLP",
    type: "NLM",
    category: "General",
    mobileNumber: "9440885504",
    district: "NALGONDA",
    coordinates: { lat: 16.876641, lng: 79.291752 },
  },
  {
    id: 115,
    applicantNumber: "NLM202202150000031",
    applicantName: "RIKKALA HYMAVATHI",
    type: "NLM",
    category: "General",
    mobileNumber: "9849264647",
    district: "NALGONDA",
    coordinates: { lat: 16.876641, lng: 79.291752 },
  },
  {
    id: 116,
    applicantNumber: "NLM202201190000116",
    applicantName: "SURASANI SAHITYA",
    type: "NLM",
    category: "General",
    mobileNumber: "9848476657",
    district: "MEDCHAL MALKAJGIRI",
    coordinates: { lat: 17.5767289, lng: 78.6169979 },
  },
  {
    id: 117,
    applicantNumber: "NLM202111250000043",
    applicantName: "VASTHAPURI MANGAMMA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8500233239",
    district: "NALGONDA",
    coordinates: { lat: 16.592822, lng: 79.387502 },
  },
  {
    id: 118,
    applicantNumber: "NLM202111080000023",
    applicantName: "N SRINIVASULU",
    type: "NLM",
    category: "SC",
    mobileNumber: "9440845150",
    district: "NAGARKURNOOL",
    coordinates: { lat: 16.7411, lng: 78.5622949 },
  },
  {
    id: 119,
    applicantNumber: "NLM202203080000053",
    applicantName: "SABAVATH SHANKAR NAYAK",
    type: "NLM",
    category: "ST",
    mobileNumber: "9866727504",
    district: "JAYASHANKAR BHUPALAPALLY",
    coordinates: { lat: 18.34204, lng: 79.53232 },
  },
  {
    id: 120,
    applicantNumber: "NLM202112040000032",
    applicantName: "PRANEETH KUMAR MARKA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9392711412",
    district: "NAGARKURNOOL",
    coordinates: { lat: 16.3326783, lng: 78.49062 },
  },
  {
    id: 121,
    applicantNumber: "NLM202110220000033",
    applicantName: "VADTHYA DEVENDAR NAIK",
    type: "NLM",
    category: "ST",
    mobileNumber: "9491000199",
    district: "NALGONDA",
    coordinates: { lat: 16.7774668, lng: 78.8932824 },
  },
  {
    id: 122,
    applicantNumber: "NLM202110160000013",
    applicantName: "DR MUVVA RAMA RAO",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9441993033",
    district: "NALGONDA",
    coordinates: { lat: 16.8680433, lng: 79.4226283 },
  },
  {
    id: 123,
    applicantNumber: "NLM202110290000141",
    applicantName: "Malka Sharadha",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9849202889",
    district: "PEDDAPALLI",
    coordinates: { lat: 18.6983052, lng: 79.4384519 },
  },
  {
    id: 124,
    applicantNumber: "NLM202205090000048",
    applicantName: "Kondagorla Rajabapu",
    type: "NLM",
    category: "SC",
    mobileNumber: "7673967391",
    district: "JAYASHANKAR BHUPALAPALLY",
    coordinates: { lat: 18.633005, lng: 79.9387091 },
  },
  {
    id: 125,
    applicantNumber: "NLM202201180000107",
    applicantName: "KURMA PRABHAKAR",
    type: "NLM",
    category: "General",
    mobileNumber: "9676815907",
    district: "JAGITIAL",
    coordinates: { lat: 18.868712, lng: 78.766571 },
  },
  {
    id: 126,
    applicantNumber: "NLM202112230000025",
    applicantName: "LALCHAVULA RAJANNA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9951809040",
    district: "JAGITIAL",
    coordinates: { lat: 18.921048, lng: 78.844758 },
  },
  {
    id: 127,
    applicantNumber: "NLM202112080000023",
    applicantName: "SRI VALLI SHEEP FARM proprietor Surathani Mallareddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9848911220",
    district: "JAGITIAL",
    coordinates: { lat: 18.904405, lng: 78.874638 },
  },
  {
    id: 128,
    applicantNumber: "NLM202307060000023",
    applicantName: "RASAMALLA RAMA RAO",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9505739363",
    district: "NALGONDA",
    coordinates: { lat: 16.8424043, lng: 79.3937162 },
  },
  {
    id: 129,
    applicantNumber: "NLM202211010000030",
    applicantName: "GANGIREDDY SRINIVASAREDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9490370182",
    district: "BHADRADRI KOTHAGUDEM",
    coordinates: { lat: 17.663678, lng: 80.729432 },
  },
  {
    id: 130,
    applicantNumber: "NLM202209040000007",
    applicantName: "S MANJULA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9000973666",
    district: "RANGA REDDY",
    coordinates: { lat: 16.7919576, lng: 78.700019 },
  },
  {
    id: 131,
    applicantNumber: "NLM202110290000214",
    applicantName: "Malka Chandrakala",
    type: "NLM",
    category: "OBC",
    mobileNumber: "7901005100",
    district: "PEDDAPALLI",
    coordinates: { lat: 18.6984645, lng: 79.4385055 },
  },
  {
    id: 132,
    applicantNumber: "NLM202207040000047",
    applicantName: "ENJAM KAVYA",
    type: "NLM",
    category: "General",
    mobileNumber: "9381742207",
    district: "NALGONDA",
    coordinates: { lat: 16.8199432, lng: 79.3676753 },
  },
  {
    id: 133,
    applicantNumber: "NLM202110300000281",
    applicantName: "VELPULA RAJU",
    type: "NLM",
    category: "OBC",
    mobileNumber: "6302849211",
    district: "RAJANNA SIRCILLA",
    coordinates: { lat: 18.3629524, lng: 78.9109665 },
  },
  {
    id: 134,
    applicantNumber: "NLM202211220000003",
    applicantName: "ANDHE RAVI",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8801235678",
    district: "NALGONDA",
    coordinates: { lat: 17.0247216, lng: 79.3363462 },
  },
  {
    id: 135,
    applicantNumber: "NLM202206250000004",
    applicantName: "POLUSANI SUNIL",
    type: "NLM",
    category: "General",
    mobileNumber: "9000571119",
    district: "MULUGU",
    coordinates: { lat: 18.2439639, lng: 79.8556064 },
  },
  {
    id: 136,
    applicantNumber: "NLM202301270000046",
    applicantName: "V NARASIMHA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9704859368",
    district: "NALGONDA",
    coordinates: { lat: 16.7230536, lng: 79.3374024 },
  },
  {
    id: 137,
    applicantNumber: "NLM202211250000056",
    applicantName: "BOMMAGANI NAGESH GOUD",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9959933345",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.682217, lng: 78.959959 },
  },
  {
    id: 138,
    applicantNumber: "NLM202112150000107",
    applicantName: "SHYAMALAIAH",
    type: "NLM",
    category: "SC",
    mobileNumber: "9121010798",
    district: "NARAYANPET",
    coordinates: { lat: 16.8353993, lng: 77.6915171 },
  },
  {
    id: 139,
    applicantNumber: "NLM202110280000022",
    applicantName: "Ravikumar Moortala",
    type: "NLM",
    category: "General",
    mobileNumber: "8886812172",
    district: "MULUGU",
    coordinates: { lat: 18.195379, lng: 79.9842202 },
  },
  {
    id: 140,
    applicantNumber: "NLM202110300000106",
    applicantName: "PENJARLA RAMESH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9866029135",
    district: "RAJANNA SIRCILLA",
    coordinates: { lat: 18.3428296, lng: 78.6196789 },
  },
  {
    id: 141,
    applicantNumber: "NLM202110270000077",
    applicantName: "KOUDAGANI SATHYANARAYANA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9441534404",
    district: "RAJANNA SIRCILLA",
    coordinates: { lat: 18.4766553, lng: 78.9339482 },
  },
  {
    id: 142,
    applicantNumber: "NLM202202280000106",
    applicantName: "sathaiah palakurla",
    type: "NLM",
    category: "General",
    mobileNumber: "9177922623",
    district: "RANGA REDDY",
    coordinates: { lat: 16.8990188, lng: 78.6588442 },
  },
  {
    id: 143,
    applicantNumber: "NLM202110300000181",
    applicantName: "N SREEDHAR REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9912118343",
    district: "RANGA REDDY",
    coordinates: { lat: 17.194725, lng: 78.5845143 },
  },
  {
    id: 144,
    applicantNumber: "NLM202202020000077",
    applicantName: "RAMPRASAD REDDY KATIPALLY",
    type: "NLM",
    category: "General",
    mobileNumber: "9949988355",
    district: "RANGA REDDY",
    coordinates: { lat: 17.1388498, lng: 78.7283221 },
  },
  {
    id: 145,
    applicantNumber: "NLM202111260000080",
    applicantName: "MURARISHETTY SUDHAKAR",
    type: "NLM",
    category: "General",
    mobileNumber: "9100937934",
    district: "NALGONDA",
    coordinates: { lat: 17.076458, lng: 79.33895 },
  },
  {
    id: 146,
    applicantNumber: "NLM202110290000226",
    applicantName: "Joginapally Kishan Rao",
    type: "NLM",
    category: "General",
    mobileNumber: "9035218680",
    district: "SANGAREDDY",
    coordinates: { lat: 17.6044456, lng: 77.5588514 },
  },
  {
    id: 147,
    applicantNumber: "NLM202304040000059",
    applicantName: "GOVINDAPUR RATNA MALA",
    type: "NLM",
    category: "General",
    mobileNumber: "9550721144",
    district: "VIKARABAD",
    coordinates: { lat: 17.165632, lng: 77.790082 },
  },
  {
    id: 148,
    applicantNumber: "NLM202110300000078",
    applicantName: "SRINIVAS YADAV KAMBALAPALLI",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8074270273",
    district: "SURYAPET",
    coordinates: { lat: 17.2879347, lng: 79.5278507 },
  },
  {
    id: 149,
    applicantNumber: "NLM202110300000154",
    applicantName: "K yadagiri",
    type: "NLM",
    category: "ST",
    mobileNumber: "9440083874",
    district: "NIZAMABAD",
    coordinates: { lat: 18.492241, lng: 78.15861 },
  },
  {
    id: 150,
    applicantNumber: "NLM202110290000096",
    applicantName: "M PURNENDAR RAO",
    type: "NLM",
    category: "General",
    mobileNumber: "9848483284",
    district: "SURYAPET",
    coordinates: { lat: 16.9337122, lng: 79.9928738 },
  },
  {
    id: 151,
    applicantNumber: "NLM202207170000008",
    applicantName: "PILLALAMARRI VEERAIAH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8985555891",
    district: "NALGONDA",
    coordinates: { lat: 17.1647223, lng: 79.4274672 },
  },
  {
    id: 152,
    applicantNumber: "NLM202110140000064",
    applicantName: "Sangi Krishna",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8686863539",
    district: "WARANGAL",
    coordinates: { lat: 18.029507, lng: 79.642185 },
  },
  {
    id: 153,
    applicantNumber: "NLM202303020000044",
    applicantName: "KOLA GANGADHAR",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9989719827",
    district: "JAGITIAL",
    coordinates: { lat: 18.97093, lng: 79.076961 },
  },
  {
    id: 154,
    applicantNumber: "NLM202303020000026",
    applicantName: "MYDAM DUBBAIAH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8106055025",
    district: "JAGITIAL",
    coordinates: { lat: 18.97021, lng: 79.097072 },
  },
  {
    id: 155,
    applicantNumber: "NLM202110240000028",
    applicantName: "MOTAPALUKULA LAXMI NARAYANA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8247895857",
    district: "MANCHERIAL",
    coordinates: { lat: 19.0852789, lng: 79.0062289 },
  },
  {
    id: 156,
    applicantNumber: "NLM202207290000022",
    applicantName: "BANDA NARENDER REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9100101188",
    district: "NALGONDA",
    coordinates: { lat: 17.2040839, lng: 79.1964876 },
  },
  {
    id: 157,
    applicantNumber: "NLM202109250000014",
    applicantName: "Kalal Ravinder Goud",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9618940408",
    district: "VIKARABAD",
    coordinates: { lat: 16.6286934, lng: 77.6009715 },
  },
  {
    id: 158,
    applicantNumber: "NLM202302160000037",
    applicantName: "JALADI RAVI KUMAR",
    type: "NLM",
    category: "General",
    mobileNumber: "9502845891",
    district: "KHAMMAM",
    coordinates: { lat: 17.2907864, lng: 80.2043254 },
  },
  {
    id: 159,
    applicantNumber: "NLM202110210000005",
    applicantName: "GILLELA AMARENDER REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9701230844",
    district: "WANAPARTHY",
    coordinates: { lat: 16.3406336, lng: 78.1316779 },
  },
  {
    id: 160,
    applicantNumber: "NLM202110230000086",
    applicantName: "KASHETTI LAXMAN",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9441816360",
    district: "MANCHERIAL",
    coordinates: { lat: 19.0916976, lng: 79.0117405 },
  },
  {
    id: 161,
    applicantNumber: "NLM202110180000022",
    applicantName: "GOTTIMUKKULA RAGHOTHAM REDDY",
    type: "NLM",
    category: "Others",
    mobileNumber: "9848054377",
    district: "WARANGAL",
    coordinates: { lat: 18.0698448, lng: 79.9193736 },
  },
  {
    id: 162,
    applicantNumber: "NLM202211110000013",
    applicantName: "CHANDRAPAL REDDY MUNUGALA",
    type: "NLM",
    category: "General",
    mobileNumber: "9888760999",
    district: "RANGA REDDY",
    coordinates: { lat: 17.001491, lng: 78.3753236 },
  },
  {
    id: 163,
    applicantNumber: "NLM202306280000117",
    applicantName: "MARRI SUSHMA GOPAL",
    type: "NLM",
    category: "General",
    mobileNumber: "9951638060",
    district: "RANGA REDDY",
    coordinates: { lat: 16.8937148, lng: 78.3427273 },
  },
  {
    id: 164,
    applicantNumber: "NLM202202080000051",
    applicantName: "RAJINI PERAM",
    type: "NLM",
    category: "OBC",
    mobileNumber: "7981901850",
    district: "MANCHERIAL",
    coordinates: { lat: 18.89403, lng: 79.261464 },
  },
  {
    id: 165,
    applicantNumber: "NLM202201190000014",
    applicantName: "VINDYALA GOVARDHAN REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9010203292",
    district: "NAGARKURNOOL",
    coordinates: { lat: 16.589258, lng: 78.298574 },
  },
  {
    id: 166,
    applicantNumber: "NLM202112180000004",
    applicantName: "Vendi Ravindar",
    type: "NLM",
    category: "SC",
    mobileNumber: "9949633518",
    district: "WARANGAL",
    coordinates: { lat: 18.074568, lng: 79.8217952 },
  },
  {
    id: 167,
    applicantNumber: "NLM202204270000052",
    applicantName: "Gugulothu Salamma",
    type: "NLM",
    category: "ST",
    mobileNumber: "8520807736",
    district: "MAHABUBABAD",
    coordinates: { lat: 17.6310071, lng: 79.7553943 },
  },
  {
    id: 168,
    applicantNumber: "NLM202110300000245",
    applicantName: "Kanugula Ganitha",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9912785366",
    district: "WARANGAL",
    coordinates: { lat: 18.0455231, lng: 79.7856449 },
  },
  {
    id: 169,
    applicantNumber: "NLM202110300000271",
    applicantName: "KAIRIKA KOMURAIAH",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9550891324",
    district: "WARANGAL URBAN",
    coordinates: { lat: 17.9646199, lng: 79.3102432 },
  },
  {
    id: 170,
    applicantNumber: "NLM202112220000023",
    applicantName: "KARABU GOPAL RAO",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8919130853",
    district: "WARANGAL URBAN",
    coordinates: { lat: 18.1886174, lng: 79.5372034 },
  },
  {
    id: 171,
    applicantNumber: "NLM202110120000014",
    applicantName: "Tummala Krishnarjun Reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9246268419",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.3764688, lng: 79.0216021 },
  },
  {
    id: 172,
    applicantNumber: "NLM202110290000008",
    applicantName: "Mekala Sai Kiran Reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9989315013",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.6265933, lng: 79.0056984 },
  },
  {
    id: 173,
    applicantNumber: "NLM202110210000028",
    applicantName: "ANAGANDULA  SATHANNA",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9849471161",
    district: "NIRMAL",
    coordinates: { lat: 19.0820341, lng: 78.8513748 },
  },
  {
    id: 174,
    applicantNumber: "NLM202312050000175",
    applicantName: "Komire Ravi",
    type: "NLM",
    category: "OBC",
    mobileNumber: "9515474971",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.5247017, lng: 79.1430517 },
  },
  {
    id: 175,
    applicantNumber: "NLM202110280000048",
    applicantName: "PARNE MALLA REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9848055588",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.3335724, lng: 78.8051678 },
  },
  {
    id: 176,
    applicantNumber: "NLM202201070000087",
    applicantName: "MARLA ANIL KUMAR REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9959448883",
    district: "NALGONDA",
    coordinates: { lat: 16.82804, lng: 79.45322 },
  },
  {
    id: 177,
    applicantNumber: "NLM202204160000010",
    applicantName: "ANUMULA RAMREDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9440354113",
    district: "KHAMMAM",
    coordinates: { lat: 17.2472528, lng: 80.1514447 },
  },
  {
    id: 178,
    applicantNumber: "NLM202304240000108",
    applicantName: "B PAVANI",
    type: "NLM",
    category: "OBC",
    mobileNumber: "8919938366",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.682185, lng: 78.9647 },
  },
  {
    id: 179,
    applicantNumber: "NLM202110270000031",
    applicantName: "Dandu Pulla Reddy",
    type: "NLM",
    category: "General",
    mobileNumber: "9440901497",
    district: "YADADRI BHUVANAGIRI",
    coordinates: { lat: 17.066759, lng: 78.8904526 },
  },
  {
    id: 180,
    applicantNumber: "NLM202208260000006",
    applicantName: "YEDULLA ANJI REDDY",
    type: "NLM",
    category: "General",
    mobileNumber: "9948255544",
    district: "NALGONDA",
    coordinates: { lat: 17.1240999, lng: 79.211982 },
  },
  {
    id: 181,
    applicantNumber: "NLM202303170000137",
    applicantName: "Theerthala Chidambar Rao",
    type: "NLM",
    category: "General",
    mobileNumber: "7702577877",
    district: "KHAMMAM",
    coordinates: { lat: 17.3989915, lng: 80.2537696 },
  },
  {
    id: 182,
    applicantNumber: "NLM202110270000054",
    applicantName: "TATIPELLI AMULYA",
    type: "NLM",
    category: "General",
    mobileNumber: "9502655687",
    district: "ADILABAD",
    coordinates: { lat: 19.7661296, lng: 78.505158 },
  },
  {
    id: 183,
    applicantNumber: "NLM202110290000038",
    applicantName: "CHAVA CHANDRA SHEKHAR",
    type: "NLM",
    category: "General",
    mobileNumber: "9448028642",
    district: "BHADRADRI KOTHAGUDEM",
    coordinates: { lat: 17.4727693, lng: 80.6103154 },
  },
].filter(loc => loc.coordinates && loc.coordinates.lat && loc.coordinates.lng)

// ---------- Component ----------
const InstitutionProfile = () => {
  const [selectedLocation, setSelectedLocation] = useState(null)

  const mapContainerStyle = {
    width: "100%",
    height: "80vh",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
  }

  const defaultCenter = {
    lat: 17.385044,
    lng: 78.486671, // Hyderabad
  }

  const defaultZoom = 10

  // Color mapping for institution types
  const institutionTypeColors = {
    SSVH: "#64748B",
    DVH: "#F59E0B",
    AVH: "#10B981",
    PVC: "#84CC16",
    SCAH: "#3B82F6",
    SC_AH: "#3B82F6", // alias
    NLM: "#cf88cc",
    OTHER: "#94A3B8",
  }

  // Compute counts for legend
  const institutionTypeCounts = useMemo(() => {
    const counts = {}
    institutionData.forEach(loc => {
      const type = loc.type || "OTHER"
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      color: institutionTypeColors[type] || institutionTypeColors.OTHER,
    }))
  }, [])

  const getMarkerColor = useCallback(type => {
    if (!type) return institutionTypeColors.OTHER
    return institutionTypeColors[type] || institutionTypeColors.OTHER
  }, [])

  const createGoogleStylePin = useCallback(color => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="42" viewBox="0 0 24 40">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 12 28 12 28s12-21.4 12-28c0-6.6-5.4-12-12-12z" 
              fill="${color}" stroke="#FFFFFF" stroke-width="1"/>
        <circle cx="12" cy="12" r="3.5" fill="#FFFFFF"/>
        <circle cx="12" cy="12" r="1.5" fill="${color}"/>
      </svg>
    `
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(28, 42),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(14, 42),
    }
  }, [])

  const handleMarkerClick = useCallback(location => {
    setSelectedLocation(location)
  }, [])

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedLocation(null)
  }, [])

  return (
    <Row>
      <Col md={12}>
        <Card className="shadow-sm border-0">
          <CardBody className="p-2">
            {/* Legend */}
            <div className="mb-2">
              <div className="row g-2">
                {institutionTypeCounts.map((item, index) => (
                  <div key={index} className="col-1 col-md-1 col-lg-1 col-xl-1">
                    <div
                      className="d-flex align-items-center p-2 rounded"
                      style={{
                        backgroundColor: `${item.color}10`,
                        borderLeft: `4px solid ${item.color}`,
                        transition: "all 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = `${item.color}20`
                        e.currentTarget.style.transform = "translateX(4px)"
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = `${item.color}10`
                        e.currentTarget.style.transform = "translateX(0)"
                      }}
                    >
                      <div
                        className="me-2 rounded-circle"
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: item.color,
                          minWidth: "12px",
                        }}
                      ></div>
                      <div
                        className="d-flex flex-column"
                        style={{ lineHeight: "1.2" }}
                      >
                        <span
                          className="fw-medium"
                          style={{
                            fontSize: "12px",
                            color: "#1e293b",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.type}
                        </span>
                        <span
                          className="text-muted"
                          style={{ fontSize: "11px" }}
                        >
                          {item.count}{" "}
                          {item.count === 1 ? "location" : "locations"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div style={{ position: "relative" }}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={defaultZoom}
                options={{
                  streetViewControl: true,
                  mapTypeControl: true,
                  fullscreenControl: true,
                  zoomControl: true,
                  mapTypeControlOptions: {
                    position:
                      window.google.maps?.ControlPosition?.TOP_RIGHT || 3,
                  },
                  zoomControlOptions: {
                    position:
                      window.google.maps?.ControlPosition?.RIGHT_CENTER || 5,
                  },
                  styles: [
                    {
                      featureType: "administrative",
                      elementType: "geometry",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "poi",
                      elementType: "labels.text",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "water",
                      elementType: "labels.text",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                }}
              >
                {institutionData.map(location => {
                  const markerColor = getMarkerColor(location.type)
                  const markerIcon = createGoogleStylePin(markerColor)

                  return (
                    <Marker
                      key={location.id}
                      position={location.coordinates}
                      icon={markerIcon}
                      title={`${location.name} - ${location.type}`}
                      onClick={() => handleMarkerClick(location)}
                      animation={
                        selectedLocation?.id === location.id &&
                        window.google.maps?.Animation?.BOUNCE
                          ? window.google.maps.Animation.BOUNCE
                          : null
                      }
                    />
                  )
                })}

                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation.coordinates}
                    onCloseClick={handleCloseInfoWindow}
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -45),
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        maxWidth: "300px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <h6
                          style={{
                            margin: 0,
                            color: "#1e293b",
                            fontWeight: "600",
                            fontSize: "14px",
                            flex: 1,
                          }}
                        >
                          {selectedLocation.name}
                        </h6>
                        <button
                          onClick={handleCloseInfoWindow}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#64748b",
                            cursor: "pointer",
                            padding: "0 4px",
                            fontSize: "18px",
                          }}
                        >
                          ×
                        </button>
                      </div>

                      <div className="mb-3">
                        <Badge
                          className="bg-white"
                          style={{
                            backgroundColor: `${getMarkerColor(
                              selectedLocation.type
                            )}20`,
                            color: getMarkerColor(selectedLocation.type),
                            border: `1px solid ${getMarkerColor(
                              selectedLocation.type
                            )}40`,
                            fontSize: "11px",
                            padding: "4px 8px",
                          }}
                        >
                          {selectedLocation.type || "No Type"}
                        </Badge>
                      </div>

                      <div style={{ fontSize: "13px", color: "#475569" }}>
                        {selectedLocation.category && (
                          <div className="d-flex align-items-center mb-2">
                            <i
                              className="bx bx-layer bx-xs me-2"
                              style={{ color: "#64748b" }}
                            ></i>
                            <span>
                              <strong>Category:</strong>{" "}
                              {selectedLocation.category}
                            </span>
                          </div>
                        )}

                        {selectedLocation.applicantNumber && (
                          <div className="d-flex align-items-center mb-2">
                            <i
                              className="bx bx-id-card bx-xs me-2"
                              style={{ color: "#64748b" }}
                            ></i>
                            <span>
                              <strong>Applicant No:</strong>{" "}
                              {selectedLocation.applicantNumber}
                            </span>
                          </div>
                        )}

                        {selectedLocation.applicantName && (
                          <div className="d-flex align-items-center mb-2">
                            <i
                              className="bx bx-user bx-xs me-2"
                              style={{ color: "#64748b" }}
                            ></i>
                            <span>
                              <strong>Applicant:</strong>{" "}
                              {selectedLocation.applicantName}
                            </span>
                          </div>
                        )}

                        {selectedLocation.mobileNumber && (
                          <div className="d-flex align-items-center mb-2">
                            <i
                              className="bx bx-phone bx-xs me-2"
                              style={{ color: "#64748b" }}
                            ></i>
                            <span>
                              <strong>Mobile:</strong>{" "}
                              {selectedLocation.mobileNumber}
                            </span>
                          </div>
                        )}

                        <div className="d-flex align-items-center mb-2">
                          <i
                            className="bx bx-map bx-xs me-2"
                            style={{ color: "#64748b" }}
                          ></i>
                          <span>
                            <strong>District:</strong>{" "}
                            {selectedLocation.district}
                          </span>
                        </div>

                        {selectedLocation.mandal && (
                          <div className="d-flex align-items-center mb-2">
                            <i
                              className="bx bx-buildings bx-xs me-2"
                              style={{ color: "#64748b" }}
                            ></i>
                            <span>
                              <strong>Mandal:</strong> {selectedLocation.mandal}
                            </span>
                          </div>
                        )}

                        {selectedLocation.landArea && (
                          <div className="mb-2">
                            <i
                              className="bx bx-file bx-xs me-2"
                              style={{ color: "#64748b" }}
                            ></i>
                            <span>
                              <strong>Land:</strong> {selectedLocation.landArea}
                            </span>
                          </div>
                        )}

                        {selectedLocation.remarks && (
                          <div className="mb-2">
                            <i
                              className="bx bx-comment bx-xs me-2"
                              style={{ color: "#64748b" }}
                            ></i>
                            <span>
                              <strong>Remarks:</strong>{" "}
                              {selectedLocation.remarks}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 pt-3 border-top">
                          <div className="row g-2">
                            <div className="col-6">
                              <div
                                className="text-center p-2 rounded"
                                style={{ backgroundColor: "#f8fafc" }}
                              >
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#64748b",
                                  }}
                                >
                                  Latitude
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#334155",
                                  }}
                                >
                                  {selectedLocation.coordinates.lat.toFixed(6)}
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div
                                className="text-center p-2 rounded"
                                style={{ backgroundColor: "#f8fafc" }}
                              >
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#64748b",
                                  }}
                                >
                                  Longitude
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#334155",
                                  }}
                                >
                                  {selectedLocation.coordinates.lng.toFixed(6)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>

            {/* Footer note – total count */}
            <div className="mt-3 text-muted small text-end">
              <i className="bx bx-map me-1"></i>
              Showing {institutionData.length} veterinary institutions within
              ORR limits
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default InstitutionProfile
