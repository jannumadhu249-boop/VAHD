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
].filter((loc) => loc.coordinates && loc.coordinates.lat && loc.coordinates.lng)

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
    OTHER: "#94A3B8",
  }

  // Compute counts for legend
  const institutionTypeCounts = useMemo(() => {
    const counts = {}
    institutionData.forEach((loc) => {
      const type = loc.type || "OTHER"
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      color: institutionTypeColors[type] || institutionTypeColors.OTHER,
    }))
  }, [])

  const getMarkerColor = useCallback((type) => {
    if (!type) return institutionTypeColors.OTHER
    return institutionTypeColors[type] || institutionTypeColors.OTHER
  }, [])

  const createGoogleStylePin = useCallback((color) => {
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

  const handleMarkerClick = useCallback((location) => {
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
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${item.color}20`
                        e.currentTarget.style.transform = "translateX(4px)"
                      }}
                      onMouseLeave={(e) => {
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
                    position: window.google.maps?.ControlPosition?.TOP_RIGHT || 3,
                  },
                  zoomControlOptions: {
                    position: window.google.maps?.ControlPosition?.RIGHT_CENTER || 5,
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
                {institutionData.map((location) => {
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
                        <div className="d-flex align-items-center mb-2">
                          <i
                            className="bx bx-map bx-xs me-2"
                            style={{ color: "#64748b" }}
                          ></i>
                          <span>
                            <strong>District:</strong> {selectedLocation.district}
                          </span>
                        </div>

                        <div className="d-flex align-items-center mb-2">
                          <i
                            className="bx bx-buildings bx-xs me-2"
                            style={{ color: "#64748b" }}
                          ></i>
                          <span>
                            <strong>Mandal:</strong> {selectedLocation.mandal}
                          </span>
                        </div>

                        <div className="mb-2">
                          <i
                            className="bx bx-file bx-xs me-2"
                            style={{ color: "#64748b" }}
                          ></i>
                          <span>
                            <strong>Land:</strong> {selectedLocation.landArea}
                          </span>
                        </div>

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
              Showing {institutionData.length} veterinary institutions within ORR limits
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default InstitutionProfile















