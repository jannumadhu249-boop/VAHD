// import React, { useState, useEffect, useMemo } from "react"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   CardHeader,
//   Input,
//   Button,
//   Table,
//   Label,
//   FormGroup,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Badge,
// } from "reactstrap"
// import Select from "react-select"

// const DrugInventory = () => {
//   // State for UI tabs
//   const [activeTab, setActiveTab] = useState("1")

//   // Sale type state
//   const [saleType, setSaleType] = useState("cash")
//   const [invoiceData, setInvoiceData] = useState({
//     invoiceNo: "INV-2024-001",
//     customer: "",
//     date: new Date().toISOString().split("T")[0],
//     dueDate: "",
//     billType: "invoice",
//     taxType: "inclusive",
//     priceType: "mrp",
//   })

//   // Items data
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       sno: 1,
//       selected: true,
//       barcode: "8901234567890",
//       itemName: "Paracetamol 500mg Tablet",
//       brand: "Generic",
//       size: "10x10",
//       color: "White",
//       style: "Strip",
//       qty: 10,
//       mrp: 50.0,
//       rate: 45.0,
//       priceType: "mrp",
//       discount1Percent: 0,
//       discount1Amount: 0,
//       taxableValue: 450.0,
//       gstPercent: 12,
//       gstAmount: 54.0,
//       grossRate: 504.0,
//       netAmount: 504.0,
//     },
//     {
//       id: 2,
//       sno: 2,
//       selected: true,
//       barcode: "8901234567891",
//       itemName: "Amoxicillin 250mg Capsule",
//       brand: "Cipla",
//       size: "10x10",
//       color: "Red/Yellow",
//       style: "Capsule",
//       qty: 5,
//       mrp: 120.0,
//       rate: 110.0,
//       priceType: "mrp",
//       discount1Percent: 5,
//       discount1Amount: 27.5,
//       taxableValue: 522.5,
//       gstPercent: 12,
//       gstAmount: 62.7,
//       grossRate: 585.2,
//       netAmount: 585.2,
//     },
//     {
//       id: 3,
//       sno: 3,
//       selected: false,
//       barcode: "8901234567892",
//       itemName: "Cetirizine 10mg Tablet",
//       brand: "Zydus",
//       size: "10x10",
//       color: "White",
//       style: "Strip",
//       qty: 8,
//       mrp: 35.0,
//       rate: 30.0,
//       priceType: "wholesale",
//       discount1Percent: 2,
//       discount1Amount: 4.8,
//       taxableValue: 235.2,
//       gstPercent: 5,
//       gstAmount: 11.76,
//       grossRate: 246.96,
//       netAmount: 246.96,
//     },
//   ])

//   // Summary state
//   const [summary, setSummary] = useState({
//     totalMRP: 0,
//     totalSale: 0,
//     couponPercent: 0,
//     couponAmount: 0,
//     redeemAmount: 0,
//     extraDiscountPercent: 0,
//     extraDiscountAmount: 0,
//     taxableValue: 0,
//     gstAmount: 0,
//     grossSale: 0,
//     roundOff: 0,
//     totalQuantity: 0,
//     totalItems: 0,
//     netSale: 0,
//   })

//   // Other charges
//   const [otherCharges, setOtherCharges] = useState([
//     {
//       id: 1,
//       chargeName: "Delivery Charges",
//       gstRate: 18,
//       gstType: "inclusive",
//       amount: 50,
//       gstAmount: 7.63,
//       totalAmount: 57.63,
//     },
//   ])

//   // Selected item highlight
//   const [selectedItem, setSelectedItem] = useState({
//     barcode: "8901234567890",
//     itemName: "Paracetamol 500mg Tablet (long name for testing ellipsis)",
//     brand: "Generic",
//     size: "10x10",
//     color: "White",
//     style: "Strip",
//     qty: 10,
//     mrp: 50.0,
//     rate: 45.0,
//   })

//   // Search state
//   const [searchTerm, setSearchTerm] = useState("")
//   const [inStockOnly, setInStockOnly] = useState(true)

//   // Modals
//   const [draftModal, setDraftModal] = useState(false)
//   const [serviceModal, setServiceModal] = useState(false)

//   // Calculate summary whenever items change
//   useEffect(() => {
//     const selectedItems = items.filter(item => item.selected)

//     const totalMRP = selectedItems.reduce(
//       (sum, item) => sum + item.mrp * item.qty,
//       0
//     )
//     const totalSale = selectedItems.reduce(
//       (sum, item) => sum + item.rate * item.qty,
//       0
//     )
//     const totalDiscount = selectedItems.reduce(
//       (sum, item) => sum + item.discount1Amount,
//       0
//     )
//     const taxableValue = selectedItems.reduce(
//       (sum, item) => sum + item.taxableValue,
//       0
//     )
//     const totalGST = selectedItems.reduce(
//       (sum, item) => sum + item.gstAmount,
//       0
//     )
//     const grossSale = selectedItems.reduce(
//       (sum, item) => sum + item.grossRate,
//       0
//     )

//     const otherChargesTotal = otherCharges.reduce(
//       (sum, charge) => sum + charge.totalAmount,
//       0
//     )
//     const couponAmount = (totalSale * summary.couponPercent) / 100
//     const extraDiscountAmount =
//       (taxableValue * summary.extraDiscountPercent) / 100
//     const netSale =
//       grossSale + otherChargesTotal - couponAmount - extraDiscountAmount

//     setSummary(prev => ({
//       ...prev,
//       totalMRP,
//       totalSale,
//       taxableValue,
//       gstAmount: totalGST,
//       grossSale,
//       totalQuantity: selectedItems.reduce((sum, item) => sum + item.qty, 0),
//       totalItems: selectedItems.length,
//       netSale,
//       couponAmount,
//       extraDiscountAmount,
//       roundOff: Math.round(netSale) - netSale,
//     }))
//   }, [items, otherCharges, summary.couponPercent, summary.extraDiscountPercent])

//   // Handle item updates
//   const handleItemUpdate = (id, field, value) => {
//     setItems(prev =>
//       prev.map(item => {
//         if (item.id === id) {
//           const updatedItem = { ...item, [field]: parseFloat(value) || value }

//           // Recalculate dependent fields
//           if (
//             field === "qty" ||
//             field === "rate" ||
//             field === "discount1Percent"
//           ) {
//             const qty = field === "qty" ? parseFloat(value) || 0 : item.qty
//             const rate = field === "rate" ? parseFloat(value) || 0 : item.rate
//             const discountPercent =
//               field === "discount1Percent"
//                 ? parseFloat(value) || 0
//                 : item.discount1Percent

//             const total = qty * rate
//             const discountAmount = (total * discountPercent) / 100
//             const taxableValue = total - discountAmount
//             const gstAmount = (taxableValue * item.gstPercent) / 100
//             const grossRate = taxableValue + gstAmount
//             const netAmount = grossRate

//             return {
//               ...updatedItem,
//               discount1Amount: discountAmount,
//               taxableValue,
//               gstAmount,
//               grossRate,
//               netAmount,
//             }
//           }

//           return updatedItem
//         }
//         return item
//       })
//     )
//   }

//   // Handle checkbox selection
//   const handleItemSelection = id => {
//     setItems(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, selected: !item.selected } : item
//       )
//     )
//   }

//   // Select all items
//   const selectAllItems = () => {
//     const allSelected = items.every(item => item.selected)
//     setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })))
//   }

//   // Add new item
//   const addNewItem = () => {
//     const newItem = {
//       id: items.length + 1,
//       sno: items.length + 1,
//       selected: true,
//       barcode: `890123456789${items.length}`,
//       itemName: "New Medicine",
//       brand: "Generic",
//       size: "10x10",
//       color: "White",
//       style: "Tablet",
//       qty: 1,
//       mrp: 100.0,
//       rate: 90.0,
//       priceType: "mrp",
//       discount1Percent: 0,
//       discount1Amount: 0,
//       taxableValue: 90.0,
//       gstPercent: 12,
//       gstAmount: 10.8,
//       grossRate: 100.8,
//       netAmount: 100.8,
//     }
//     setItems(prev => [...prev, newItem])
//   }

//   // Remove item
//   const removeItem = id => {
//     setItems(prev =>
//       prev
//         .filter(item => item.id !== id)
//         .map((item, index) => ({
//           ...item,
//           sno: index + 1,
//         }))
//     )
//   }

//   // Add other charge
//   const addOtherCharge = () => {
//     const newCharge = {
//       id: otherCharges.length + 1,
//       chargeName: "New Charge",
//       gstRate: 18,
//       gstType: "inclusive",
//       amount: 0,
//       gstAmount: 0,
//       totalAmount: 0,
//     }
//     setOtherCharges(prev => [...prev, newCharge])
//   }

//   // Update other charge
//   const updateOtherCharge = (id, field, value) => {
//     setOtherCharges(prev =>
//       prev.map(charge => {
//         if (charge.id === id) {
//           const updated = { ...charge, [field]: parseFloat(value) || value }

//           if (field === "amount" || field === "gstRate") {
//             const amount =
//               field === "amount" ? parseFloat(value) || 0 : charge.amount
//             const gstRate =
//               field === "gstRate" ? parseFloat(value) || 0 : charge.gstRate

//             if (charge.gstType === "inclusive") {
//               const baseAmount = amount / (1 + gstRate / 100)
//               const gstAmount = amount - baseAmount
//               return {
//                 ...updated,
//                 gstAmount: parseFloat(gstAmount.toFixed(2)),
//                 totalAmount: amount,
//               }
//             } else {
//               const gstAmount = (amount * gstRate) / 100
//               return {
//                 ...updated,
//                 gstAmount: parseFloat(gstAmount.toFixed(2)),
//                 totalAmount: amount + gstAmount,
//               }
//             }
//           }

//           return updated
//         }
//         return charge
//       })
//     )
//   }

//   // Save invoice
//   const saveInvoice = () => {
//     toast.success("Invoice saved successfully!")
//     // Here you would typically make an API call
//   }

//   // Print invoice
//   const printInvoice = () => {
//     window.print()
//   }

//   // Format currency
//   const formatCurrency = amount => {
//     return `₹${parseFloat(amount).toFixed(2)}`
//   }

//   // Price type options
//   const priceTypeOptions = [
//     { value: "mrp", label: "MRP" },
//     { value: "wholesale", label: "Wholesale" },
//     { value: "distributor", label: "Distributor" },
//   ]

//   // Sale type options
//   const saleTypeOptions = [
//     { value: "cash", label: "Cash Sale" },
//     { value: "credit", label: "Credit Sale" },
//     { value: "return", label: "Return / Issue Credit Note" },
//   ]

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         {/* 2️⃣ SALE CONFIGURATION ROW */}
//         <Card className="mb-3">
//           <CardBody>
//             <Row className="g-3">
//               <Col md={2}>
//                 <FormGroup>
//                   <Label className="small mb-1">Sale Type (GST)</Label>
//                   <Input type="select" className="form-control-sm">
//                     <option>Regular</option>
//                     <option>Composition</option>
//                     <option>Unregistered</option>
//                     <option>Export</option>
//                   </Input>
//                 </FormGroup>
//               </Col>
//               <Col md={2}>
//                 <FormGroup>
//                   <Label className="small mb-1">Price Type (Rate)</Label>
//                   <Select
//                     options={priceTypeOptions}
//                     defaultValue={priceTypeOptions[0]}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     styles={{
//                       control: base => ({
//                         ...base,
//                         minHeight: "31px",
//                         fontSize: "14px",
//                       }),
//                       dropdownIndicator: base => ({
//                         ...base,
//                         padding: "4px",
//                       }),
//                     }}
//                   />
//                 </FormGroup>
//               </Col>
//               <Col md={2}>
//                 <FormGroup>
//                   <Label className="small mb-1">Bill Type</Label>
//                   <Input
//                     type="select"
//                     className="form-control-sm"
//                     value={invoiceData.billType}
//                   >
//                     <option>Invoice</option>
//                     <option>Bill</option>
//                     <option>Estimate</option>
//                   </Input>
//                 </FormGroup>
//               </Col>
//               <Col md={2}>
//                 <FormGroup>
//                   <Label className="small mb-1">Tax Type</Label>
//                   <Input
//                     type="select"
//                     className="form-control-sm"
//                     value={invoiceData.taxType}
//                   >
//                     <option>Inclusive</option>
//                     <option>Exclusive</option>
//                   </Input>
//                 </FormGroup>
//               </Col>
//               <Col md={2}>
//                 <FormGroup>
//                   <Label className="small mb-1">Sale To</Label>
//                   <Select
//                     options={[
//                       { value: "walkin", label: "Walk-in Customer" },
//                       { value: "regular", label: "Regular Customer" },
//                       { value: "hospital", label: "Hospital" },
//                     ]}
//                     placeholder="Select Customer"
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     styles={{
//                       control: base => ({
//                         ...base,
//                         minHeight: "31px",
//                         fontSize: "14px",
//                       }),
//                     }}
//                   />
//                 </FormGroup>
//               </Col>
//               <Col md={1}>
//                 <FormGroup>
//                   <Label className="small mb-1">Bill Date</Label>
//                   <Input
//                     type="date"
//                     className="form-control-sm"
//                     value={invoiceData.date}
//                     onChange={e =>
//                       setInvoiceData(prev => ({
//                         ...prev,
//                         date: e.target.value,
//                       }))
//                     }
//                   />
//                 </FormGroup>
//               </Col>
//               <Col md={1}>
//                 <FormGroup>
//                   <Label className="small mb-1">Due Days</Label>
//                   <Input
//                     type="number"
//                     className="form-control-sm"
//                     defaultValue="30"
//                     min="0"
//                   />
//                 </FormGroup>
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>

//         {/* 3️⃣ ITEM SEARCH ROW */}
//         <Card className="mb-3">
//           <CardBody>
//             <Row className="g-3 align-items-center">
//               <Col md={4}>
//                 <div className="input-group">
//                   <span className="input-group-text bg-light border-end-0">
//                     <i className="bx bx-search"></i>
//                   </span>
//                   <Input
//                     type="text"
//                     placeholder="Search item by name, code or barcode..."
//                     className="form-control-sm border-start-0"
//                     value={searchTerm}
//                     onChange={e => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </Col>
//               <Col md={3}>
//                 <Input
//                   type="text"
//                   placeholder="Scan barcode..."
//                   className="form-control-sm"
//                 />
//               </Col>
//               <Col md={2}>
//                 <FormGroup check className="mt-2">
//                   <Input
//                     type="checkbox"
//                     id="inStockCheck"
//                     checked={inStockOnly}
//                     onChange={e => setInStockOnly(e.target.checked)}
//                   />
//                   <Label for="inStockCheck" check className="small ms-2">
//                     In Stock Only
//                   </Label>
//                 </FormGroup>
//               </Col>
//               <Col md={3} className="text-end">
//                 <Button color="success" size="sm" className="me-2">
//                   <i className="bx bx-phone me-1"></i>
//                   PhonePe Transaction
//                 </Button>
//                 <Button color="info" size="sm">
//                   <i className="bx bx-receipt me-1"></i>
//                   Last Bill
//                 </Button>
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>

//         {/* 4️⃣ SELECTED ITEM HIGHLIGHT ROW */}
//         <Card className="mb-3 border-success">
//           <CardHeader className="bg-success text-white py-1">
//             <Row className="g-0 text-center">
//               <Col>Barcode</Col>
//               <Col>Item Name</Col>
//               <Col>Brand</Col>
//               <Col>Size</Col>
//               <Col>Colour</Col>
//               <Col>Style</Col>
//               <Col>Qty</Col>
//               <Col>MRP</Col>
//               <Col>Rate</Col>
//             </Row>
//           </CardHeader>
//           <CardBody className="bg-warning-subtle py-2">
//             <Row className="g-0 text-center align-items-center">
//               <Col>
//                 <span className="fw-bold">{selectedItem.barcode}</span>
//               </Col>
//               <Col>
//                 <span
//                   className="text-truncate d-inline-block"
//                   style={{ maxWidth: "200px" }}
//                   title={selectedItem.itemName}
//                 >
//                   {selectedItem.itemName}
//                 </span>
//               </Col>
//               <Col>{selectedItem.brand}</Col>
//               <Col>{selectedItem.size}</Col>
//               <Col>{selectedItem.color}</Col>
//               <Col>{selectedItem.style}</Col>
//               <Col>
//                 <Badge color="primary" className="fs-6">
//                   {selectedItem.qty}
//                 </Badge>
//               </Col>
//               <Col className="fw-bold">{formatCurrency(selectedItem.mrp)}</Col>
//               <Col className="fw-bold text-success">
//                 {formatCurrency(selectedItem.rate)}
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>

//         <Row>
//           {/* 5️⃣ MAIN ITEMS TABLE */}
//           <Col md={8}>
//             <Card className="mb-3">
//               <CardBody className="p-0">
//                 <div className="table-responsive">
//                   <Table bordered hover className="mb-0">
//                     <thead className="table-light">
//                       <tr>
//                         <th className="text-center" style={{ width: "50px" }}>
//                           Sno
//                         </th>
//                         <th className="text-center" style={{ width: "40px" }}>
//                           <Input
//                             type="checkbox"
//                             checked={items.every(item => item.selected)}
//                             onChange={selectAllItems}
//                           />
//                         </th>
//                         <th>Barcode</th>
//                         <th>Item Name</th>
//                         <th>Price Type</th>
//                         <th className="text-center">QTY</th>
//                         <th className="text-end">MRP</th>
//                         <th className="text-end">Rate</th>
//                         <th className="text-center">Disc1 %</th>
//                         <th className="text-end">Disc1 ₹</th>
//                         <th className="text-end">Taxable Value</th>
//                         <th className="text-center">GST %</th>
//                         <th className="text-end">GST ₹</th>
//                         <th className="text-end">Gross Rate</th>
//                         <th className="text-end">Net Amount</th>
//                         <th className="text-center" style={{ width: "40px" }}>
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map(item => (
//                         <tr key={item.id}>
//                           <td className="text-center fw-bold">{item.sno}</td>
//                           <td className="text-center">
//                             <Input
//                               type="checkbox"
//                               checked={item.selected}
//                               onChange={() => handleItemSelection(item.id)}
//                             />
//                           </td>
//                           <td>
//                             <Input
//                               type="text"
//                               className="form-control-sm"
//                               value={item.barcode}
//                               onChange={e =>
//                                 handleItemUpdate(
//                                   item.id,
//                                   "barcode",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                           </td>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               <span className="me-2">{item.itemName}</span>
//                               <Badge color="light" className="border">
//                                 #{item.id}
//                               </Badge>
//                             </div>
//                           </td>
//                           <td>
//                             <Select
//                               options={priceTypeOptions}
//                               value={priceTypeOptions.find(
//                                 opt => opt.value === item.priceType
//                               )}
//                               onChange={selected =>
//                                 handleItemUpdate(
//                                   item.id,
//                                   "priceType",
//                                   selected.value
//                                 )
//                               }
//                               className="react-select-container"
//                               classNamePrefix="react-select"
//                               styles={{
//                                 control: base => ({
//                                   ...base,
//                                   minHeight: "31px",
//                                   fontSize: "12px",
//                                 }),
//                               }}
//                             />
//                           </td>
//                           <td className="text-center">
//                             <Input
//                               type="number"
//                               className="form-control-sm text-center"
//                               value={item.qty}
//                               onChange={e =>
//                                 handleItemUpdate(item.id, "qty", e.target.value)
//                               }
//                               min="1"
//                               step="1"
//                             />
//                           </td>
//                           <td className="text-end">
//                             {formatCurrency(item.mrp)}
//                           </td>
//                           <td className="text-end">
//                             <Input
//                               type="number"
//                               className="form-control-sm text-end"
//                               value={item.rate}
//                               onChange={e =>
//                                 handleItemUpdate(
//                                   item.id,
//                                   "rate",
//                                   e.target.value
//                                 )
//                               }
//                               step="0.01"
//                             />
//                           </td>
//                           <td className="text-center">
//                             <Input
//                               type="number"
//                               className="form-control-sm text-center"
//                               value={item.discount1Percent}
//                               onChange={e =>
//                                 handleItemUpdate(
//                                   item.id,
//                                   "discount1Percent",
//                                   e.target.value
//                                 )
//                               }
//                               step="0.01"
//                             />
//                           </td>
//                           <td className="text-end">
//                             {formatCurrency(item.discount1Amount)}
//                           </td>
//                           <td className="text-end fw-bold">
//                             {formatCurrency(item.taxableValue)}
//                           </td>
//                           <td className="text-center">
//                             <Input
//                               type="number"
//                               className="form-control-sm text-center"
//                               value={item.gstPercent}
//                               onChange={e =>
//                                 handleItemUpdate(
//                                   item.id,
//                                   "gstPercent",
//                                   e.target.value
//                                 )
//                               }
//                               step="0.01"
//                             />
//                           </td>
//                           <td className="text-end">
//                             {formatCurrency(item.gstAmount)}
//                           </td>
//                           <td className="text-end fw-bold">
//                             {formatCurrency(item.grossRate)}
//                           </td>
//                           <td className="text-end fw-bold text-primary">
//                             {formatCurrency(item.netAmount)}
//                           </td>
//                           <td className="text-center">
//                             <Button
//                               color="danger"
//                               size="sm"
//                               onClick={() => removeItem(item.id)}
//                               className="px-2"
//                             >
//                               <i className="bx bx-trash"></i>
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//                 <div className="p-2 border-top">
//                   <Button color="primary" size="sm" onClick={addNewItem}>
//                     <i className="bx bx-plus me-1"></i>
//                     Add New Item
//                   </Button>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>

//           {/* 6️⃣ RIGHT SUMMARY PANEL (STICKY) */}
//           <Col md={4}>
//             <div style={{ position: "sticky", top: "20px" }}>
//               <Card className="shadow">
//                 <CardHeader className="bg-primary text-white py-2">
//                   <h6 className="mb-0">Summary</h6>
//                 </CardHeader>
//                 <CardBody>
//                   <div className="mb-3">
//                     <div className="d-flex justify-content-between mb-2">
//                       <span>TOTAL MRP:</span>
//                       <span className="fw-bold">
//                         {formatCurrency(summary.totalMRP)}
//                       </span>
//                     </div>
//                     <div className="d-flex justify-content-between mb-2">
//                       <span>TOTAL SALE:</span>
//                       <span className="fw-bold text-success">
//                         {formatCurrency(summary.totalSale)}
//                       </span>
//                     </div>

//                     <div className="border-top pt-2 mt-2">
//                       <h6 className="small text-muted mb-2">APPLY COUPON</h6>
//                       <Row className="g-2 mb-2">
//                         <Col md={6}>
//                           <Input
//                             type="number"
//                             placeholder="Coupon %"
//                             className="form-control-sm"
//                             value={summary.couponPercent}
//                             onChange={e =>
//                               setSummary(prev => ({
//                                 ...prev,
//                                 couponPercent: parseFloat(e.target.value) || 0,
//                               }))
//                             }
//                             step="0.01"
//                           />
//                         </Col>
//                         <Col md={6}>
//                           <Input
//                             type="text"
//                             className="form-control-sm text-end"
//                             value={formatCurrency(summary.couponAmount)}
//                             readOnly
//                           />
//                         </Col>
//                       </Row>
//                       <Row className="g-2 mb-2">
//                         <Col md={6}>
//                           <Input
//                             type="number"
//                             placeholder="Redeem Amount"
//                             className="form-control-sm"
//                             value={summary.redeemAmount}
//                             onChange={e =>
//                               setSummary(prev => ({
//                                 ...prev,
//                                 redeemAmount: parseFloat(e.target.value) || 0,
//                               }))
//                             }
//                             step="0.01"
//                           />
//                         </Col>
//                         <Col md={6}>
//                           <Button color="warning" size="sm" className="w-100">
//                             Apply
//                           </Button>
//                         </Col>
//                       </Row>
//                     </div>

//                     <div className="border-top pt-2 mt-2">
//                       <Row className="g-2 mb-2">
//                         <Col md={6}>
//                           <Input
//                             type="number"
//                             placeholder="Extra Disc %"
//                             className="form-control-sm"
//                             value={summary.extraDiscountPercent}
//                             onChange={e =>
//                               setSummary(prev => ({
//                                 ...prev,
//                                 extraDiscountPercent:
//                                   parseFloat(e.target.value) || 0,
//                               }))
//                             }
//                             step="0.01"
//                           />
//                         </Col>
//                         <Col md={6}>
//                           <Input
//                             type="text"
//                             className="form-control-sm text-end"
//                             value={formatCurrency(summary.extraDiscountAmount)}
//                             readOnly
//                           />
//                         </Col>
//                       </Row>
//                     </div>

//                     <div className="border-top pt-2 mt-2">
//                       <div className="d-flex justify-content-between mb-1">
//                         <span>Taxable Value:</span>
//                         <span className="fw-bold">
//                           {formatCurrency(summary.taxableValue)}
//                         </span>
//                       </div>
//                       <div className="d-flex justify-content-between mb-1">
//                         <span>GST Amount:</span>
//                         <span className="fw-bold text-danger">
//                           {formatCurrency(summary.gstAmount)}
//                         </span>
//                       </div>
//                       <div className="d-flex justify-content-between mb-1">
//                         <span>Gross Sale:</span>
//                         <span className="fw-bold">
//                           {formatCurrency(summary.grossSale)}
//                         </span>
//                       </div>
//                       <div className="d-flex justify-content-between mb-1">
//                         <span>Round Off:</span>
//                         <span className="fw-bold">
//                           {formatCurrency(summary.roundOff)}
//                         </span>
//                       </div>
//                       <div className="d-flex justify-content-between mb-1">
//                         <span>Total Quantity:</span>
//                         <span className="fw-bold">{summary.totalQuantity}</span>
//                       </div>
//                       <div className="d-flex justify-content-between mb-1">
//                         <span>Total Item:</span>
//                         <span className="fw-bold">{summary.totalItems}</span>
//                       </div>
//                     </div>

//                     <div className="border-top pt-2 mt-2">
//                       <div className="d-flex justify-content-between align-items-center">
//                         <h5 className="mb-0">NET SALE:</h5>
//                         <h2 className="mb-0 text-danger">
//                           {formatCurrency(summary.netSale)}
//                         </h2>
//                       </div>
//                     </div>
//                   </div>

//                   <Button
//                     color="success"
//                     size="lg"
//                     className="w-100 mb-2"
//                     onClick={saveInvoice}
//                   >
//                     <i className="bx bx-check-circle me-2"></i>
//                     SAVE SALE
//                   </Button>
//                   <Button
//                     color="primary"
//                     size="lg"
//                     className="w-100"
//                     onClick={printInvoice}
//                   >
//                     <i className="bx bx-printer me-2"></i>
//                     PRINT INVOICE
//                   </Button>
//                 </CardBody>
//               </Card>
//             </div>
//           </Col>
//         </Row>

//         {/* Modals */}
//         <Modal
//           isOpen={draftModal}
//           toggle={() => setDraftModal(false)}
//           size="lg"
//         >
//           <ModalHeader toggle={() => setDraftModal(false)}>
//             Draft Invoices
//           </ModalHeader>
//           <ModalBody>
//             <Table bordered>
//               <thead>
//                 <tr>
//                   <th>Invoice No</th>
//                   <th>Customer</th>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>INV-2024-003</td>
//                   <td>Walk-in Customer</td>
//                   <td>2024-01-15</td>
//                   <td>₹1,250.00</td>
//                   <td>
//                     <Button color="primary" size="sm">
//                       Load
//                     </Button>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>INV-2024-004</td>
//                   <td>Regular Customer</td>
//                   <td>2024-01-14</td>
//                   <td>₹850.00</td>
//                   <td>
//                     <Button color="primary" size="sm">
//                       Load
//                     </Button>
//                   </td>
//                 </tr>
//               </tbody>
//             </Table>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="secondary" onClick={() => setDraftModal(false)}>
//               Close
//             </Button>
//           </ModalFooter>
//         </Modal>

//         <Modal isOpen={serviceModal} toggle={() => setServiceModal(false)}>
//           <ModalHeader toggle={() => setServiceModal(false)}>
//             Add Service
//           </ModalHeader>
//           <ModalBody>
//             <FormGroup>
//               <Label>Service Name</Label>
//               <Input type="text" placeholder="Enter service name" />
//             </FormGroup>
//             <FormGroup>
//               <Label>Service Charge</Label>
//               <Input type="number" placeholder="Enter amount" />
//             </FormGroup>
//             <FormGroup>
//               <Label>GST %</Label>
//               <Input type="number" defaultValue="18" />
//             </FormGroup>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="primary">Add Service</Button>
//             <Button color="secondary" onClick={() => setServiceModal(false)}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </Modal>

//         <ToastContainer position="top-right" autoClose={3000} />
//       </div>
//     </div>
//   )
// }

// export default DrugInventory



import React, { useState, useEffect, useMemo } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Table,
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap"
import Select from "react-select"

const DrugInventory = () => {
  // State for UI tabs
  const [activeTab, setActiveTab] = useState("1")

  // Sale type state
  const [saleType, setSaleType] = useState("cash")
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "INV-2024-001",
    customer: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    billType: "invoice",
    taxType: "inclusive",
    priceType: "mrp",
  })

  // Items data
  const [items, setItems] = useState([
    {
      id: 1,
      sno: 1,
      selected: true,
      barcode: "8901234567890",
      itemName: "Paracetamol 500mg Tablet",
      brand: "Generic",
      size: "10x10",
      color: "White",
      style: "Strip",
      qty: 10,
      mrp: 50.0,
      rate: 45.0,
      priceType: "mrp",
      discount1Percent: 0,
      discount1Amount: 0,
      taxableValue: 450.0,
      gstPercent: 12,
      gstAmount: 54.0,
      grossRate: 504.0,
      netAmount: 504.0,
    },
    {
      id: 2,
      sno: 2,
      selected: true,
      barcode: "8901234567891",
      itemName: "Amoxicillin 250mg Capsule",
      brand: "Cipla",
      size: "10x10",
      color: "Red/Yellow",
      style: "Capsule",
      qty: 5,
      mrp: 120.0,
      rate: 110.0,
      priceType: "mrp",
      discount1Percent: 5,
      discount1Amount: 27.5,
      taxableValue: 522.5,
      gstPercent: 12,
      gstAmount: 62.7,
      grossRate: 585.2,
      netAmount: 585.2,
    },
    {
      id: 3,
      sno: 3,
      selected: false,
      barcode: "8901234567892",
      itemName: "Cetirizine 10mg Tablet",
      brand: "Zydus",
      size: "10x10",
      color: "White",
      style: "Strip",
      qty: 8,
      mrp: 35.0,
      rate: 30.0,
      priceType: "wholesale",
      discount1Percent: 2,
      discount1Amount: 4.8,
      taxableValue: 235.2,
      gstPercent: 5,
      gstAmount: 11.76,
      grossRate: 246.96,
      netAmount: 246.96,
    },
  ])

  // Summary state
  const [summary, setSummary] = useState({
    totalMRP: 0,
    totalSale: 0,
    couponPercent: 0,
    couponAmount: 0,
    redeemAmount: 0,
    extraDiscountPercent: 0,
    extraDiscountAmount: 0,
    taxableValue: 0,
    gstAmount: 0,
    grossSale: 0,
    roundOff: 0,
    totalQuantity: 0,
    totalItems: 0,
    netSale: 0,
  })

  // Other charges
  const [otherCharges, setOtherCharges] = useState([
    {
      id: 1,
      chargeName: "Delivery Charges",
      gstRate: 18,
      gstType: "inclusive",
      amount: 50,
      gstAmount: 7.63,
      totalAmount: 57.63,
    },
  ])

  // Selected item highlight
  const [selectedItem, setSelectedItem] = useState({
    barcode: "8901234567890",
    itemName: "Paracetamol 500mg Tablet (long name for testing ellipsis)",
    brand: "Generic",
    size: "10x10",
    color: "White",
    style: "Strip",
    qty: 10,
    mrp: 50.0,
    rate: 45.0,
  })

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [inStockOnly, setInStockOnly] = useState(true)

  // Modals
  const [draftModal, setDraftModal] = useState(false)
  const [serviceModal, setServiceModal] = useState(false)

  // Calculate summary whenever items change
  useEffect(() => {
    const selectedItems = items.filter(item => item.selected)

    const totalMRP = selectedItems.reduce(
      (sum, item) => sum + item.mrp * item.qty,
      0
    )
    const totalSale = selectedItems.reduce(
      (sum, item) => sum + item.rate * item.qty,
      0
    )
    const totalDiscount = selectedItems.reduce(
      (sum, item) => sum + item.discount1Amount,
      0
    )
    const taxableValue = selectedItems.reduce(
      (sum, item) => sum + item.taxableValue,
      0
    )
    const totalGST = selectedItems.reduce(
      (sum, item) => sum + item.gstAmount,
      0
    )
    const grossSale = selectedItems.reduce(
      (sum, item) => sum + item.grossRate,
      0
    )

    const otherChargesTotal = otherCharges.reduce(
      (sum, charge) => sum + charge.totalAmount,
      0
    )
    const couponAmount = (totalSale * summary.couponPercent) / 100
    const extraDiscountAmount =
      (taxableValue * summary.extraDiscountPercent) / 100
    const netSale =
      grossSale + otherChargesTotal - couponAmount - extraDiscountAmount

    setSummary(prev => ({
      ...prev,
      totalMRP,
      totalSale,
      taxableValue,
      gstAmount: totalGST,
      grossSale,
      totalQuantity: selectedItems.reduce((sum, item) => sum + item.qty, 0),
      totalItems: selectedItems.length,
      netSale,
      couponAmount,
      extraDiscountAmount,
      roundOff: Math.round(netSale) - netSale,
    }))
  }, [items, otherCharges, summary.couponPercent, summary.extraDiscountPercent])

  // Handle item updates
  const handleItemUpdate = (id, field, value) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: parseFloat(value) || value }

          // Recalculate dependent fields
          if (
            field === "qty" ||
            field === "rate" ||
            field === "discount1Percent"
          ) {
            const qty = field === "qty" ? parseFloat(value) || 0 : item.qty
            const rate = field === "rate" ? parseFloat(value) || 0 : item.rate
            const discountPercent =
              field === "discount1Percent"
                ? parseFloat(value) || 0
                : item.discount1Percent

            const total = qty * rate
            const discountAmount = (total * discountPercent) / 100
            const taxableValue = total - discountAmount
            const gstAmount = (taxableValue * item.gstPercent) / 100
            const grossRate = taxableValue + gstAmount
            const netAmount = grossRate

            return {
              ...updatedItem,
              discount1Amount: discountAmount,
              taxableValue,
              gstAmount,
              grossRate,
              netAmount,
            }
          }

          return updatedItem
        }
        return item
      })
    )
  }

  // Handle checkbox selection
  const handleItemSelection = id => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  // Select all items
  const selectAllItems = () => {
    const allSelected = items.every(item => item.selected)
    setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })))
  }

  // Add new item
  const addNewItem = () => {
    const newItem = {
      id: items.length + 1,
      sno: items.length + 1,
      selected: true,
      barcode: `890123456789${items.length}`,
      itemName: "New Medicine",
      brand: "Generic",
      size: "10x10",
      color: "White",
      style: "Tablet",
      qty: 1,
      mrp: 100.0,
      rate: 90.0,
      priceType: "mrp",
      discount1Percent: 0,
      discount1Amount: 0,
      taxableValue: 90.0,
      gstPercent: 12,
      gstAmount: 10.8,
      grossRate: 100.8,
      netAmount: 100.8,
    }
    setItems(prev => [...prev, newItem])
  }

  // Remove item
  const removeItem = id => {
    setItems(prev =>
      prev
        .filter(item => item.id !== id)
        .map((item, index) => ({
          ...item,
          sno: index + 1,
        }))
    )
  }

  // Add other charge
  const addOtherCharge = () => {
    const newCharge = {
      id: otherCharges.length + 1,
      chargeName: "New Charge",
      gstRate: 18,
      gstType: "inclusive",
      amount: 0,
      gstAmount: 0,
      totalAmount: 0,
    }
    setOtherCharges(prev => [...prev, newCharge])
  }

  // Update other charge
  const updateOtherCharge = (id, field, value) => {
    setOtherCharges(prev =>
      prev.map(charge => {
        if (charge.id === id) {
          const updated = { ...charge, [field]: parseFloat(value) || value }

          if (field === "amount" || field === "gstRate") {
            const amount =
              field === "amount" ? parseFloat(value) || 0 : charge.amount
            const gstRate =
              field === "gstRate" ? parseFloat(value) || 0 : charge.gstRate

            if (charge.gstType === "inclusive") {
              const baseAmount = amount / (1 + gstRate / 100)
              const gstAmount = amount - baseAmount
              return {
                ...updated,
                gstAmount: parseFloat(gstAmount.toFixed(2)),
                totalAmount: amount,
              }
            } else {
              const gstAmount = (amount * gstRate) / 100
              return {
                ...updated,
                gstAmount: parseFloat(gstAmount.toFixed(2)),
                totalAmount: amount + gstAmount,
              }
            }
          }

          return updated
        }
        return charge
      })
    )
  }

  // Save invoice
  const saveInvoice = () => {
    toast.success("Invoice saved successfully!")
    // Here you would typically make an API call
  }

  // Print invoice
  const printInvoice = () => {
    window.print()
  }

  // Format currency
  const formatCurrency = amount => {
    return `₹${parseFloat(amount).toFixed(2)}`
  }

  // Price type options
  const priceTypeOptions = [
    { value: "mrp", label: "MRP" },
    { value: "wholesale", label: "Wholesale" },
    { value: "distributor", label: "Distributor" },
  ]

  // Sale type options
  const saleTypeOptions = [
    { value: "cash", label: "Cash Sale" },
    { value: "credit", label: "Credit Sale" },
    { value: "return", label: "Return / Issue Credit Note" },
  ]

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* 2️⃣ SALE CONFIGURATION ROW */}
        <Card className="mb-3">
          <CardBody>
            <Row className="g-3">
              <Col md={2}>
                <FormGroup>
                  <Label className="small mb-1">Sale Type (GST)</Label>
                  <Input type="select" className="form-control-sm">
                    <option>Regular</option>
                    <option>Composition</option>
                    <option>Unregistered</option>
                    <option>Export</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label className="small mb-1">Price Type (Rate)</Label>
                  <Select
                    options={priceTypeOptions}
                    defaultValue={priceTypeOptions[0]}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: base => ({
                        ...base,
                        minHeight: "31px",
                        fontSize: "14px",
                      }),
                      dropdownIndicator: base => ({
                        ...base,
                        padding: "4px",
                      }),
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label className="small mb-1">Bill Type</Label>
                  <Input
                    type="select"
                    className="form-control-sm"
                    value={invoiceData.billType}
                  >
                    <option>Invoice</option>
                    <option>Bill</option>
                    <option>Estimate</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label className="small mb-1">Tax Type</Label>
                  <Input
                    type="select"
                    className="form-control-sm"
                    value={invoiceData.taxType}
                  >
                    <option>Inclusive</option>
                    <option>Exclusive</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label className="small mb-1">Sale To</Label>
                  <Select
                    options={[
                      { value: "walkin", label: "Walk-in Customer" },
                      { value: "regular", label: "Regular Customer" },
                      { value: "hospital", label: "Hospital" },
                    ]}
                    placeholder="Select Customer"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: base => ({
                        ...base,
                        minHeight: "31px",
                        fontSize: "14px",
                      }),
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={1}>
                <FormGroup>
                  <Label className="small mb-1">Bill Date</Label>
                  <Input
                    type="date"
                    className="form-control-sm"
                    value={invoiceData.date}
                    onChange={e =>
                      setInvoiceData(prev => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={1}>
                <FormGroup>
                  <Label className="small mb-1">Due Days</Label>
                  <Input
                    type="number"
                    className="form-control-sm"
                    defaultValue="30"
                    min="0"
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>

 

 

        <Row>
          {/* 5️⃣ MAIN ITEMS TABLE */}
          <Col >
            <Card className="mb-3">
              <CardBody className="p-0">
                <div className="table-responsive">
                  <Table bordered hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center" style={{ width: "50px" }}>
                          Sno
                        </th> 
                        <th>Barcode</th>
                        <th>Item Name</th>
                        <th className="text-center">QTY</th>
                        <th className="text-end">MRP</th>
                        <th className="text-end">Rate</th> 
                        <th className="text-end">Taxable Value</th>
                        <th className="text-center">GST %</th>
                        <th className="text-end">GST ₹</th>
                        <th className="text-end">Gross Rate</th>
                        <th className="text-end">Net Amount</th>
                        <th className="text-center" style={{ width: "40px" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id}>
                          <td className="text-center fw-bold">{item.sno}</td> 
                          <td>
                            <Input
                              type="text"
                              className="form-control-sm"
                              value={item.barcode}
                              onChange={e =>
                                handleItemUpdate(
                                  item.id,
                                  "barcode",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2">{item.itemName}</span>
                              <Badge color="light" className="border">
                                #{item.id}
                              </Badge>
                            </div>
                          </td> 
                          <td className="text-center">
                            <Input
                              type="number"
                              className="form-control-sm text-center"
                              value={item.qty}
                              onChange={e =>
                                handleItemUpdate(item.id, "qty", e.target.value)
                              }
                              min="1"
                              step="1"
                            />
                          </td>
                          <td className="text-end">
                            {formatCurrency(item.mrp)}
                          </td>
                          <td className="text-end">
                            <Input
                              type="number"
                              className="form-control-sm text-end"
                              value={item.rate}
                              onChange={e =>
                                handleItemUpdate(
                                  item.id,
                                  "rate",
                                  e.target.value
                                )
                              }
                              step="0.01"
                            />
                          </td> 
                          <td className="text-end fw-bold">
                            {formatCurrency(item.taxableValue)}
                          </td>
                          <td className="text-center">
                            <Input
                              type="number"
                              className="form-control-sm text-center"
                              value={item.gstPercent}
                              onChange={e =>
                                handleItemUpdate(
                                  item.id,
                                  "gstPercent",
                                  e.target.value
                                )
                              }
                              step="0.01"
                            />
                          </td>
                          <td className="text-end">
                            {formatCurrency(item.gstAmount)}
                          </td>
                          <td className="text-end fw-bold">
                            {formatCurrency(item.grossRate)}
                          </td>
                          <td className="text-end fw-bold text-primary">
                            {formatCurrency(item.netAmount)}
                          </td>
                          <td className="text-center">
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="px-2"
                            >
                              <i className="bx bx-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="p-2 border-top">
                  <Button color="primary" size="sm" onClick={addNewItem}>
                    <i className="bx bx-plus me-1"></i>
                    Add New Item
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

 
        </Row>

        {/* Modals */}
        <Modal
          isOpen={draftModal}
          toggle={() => setDraftModal(false)}
          size="lg"
        >
          <ModalHeader toggle={() => setDraftModal(false)}>
            Draft Invoices
          </ModalHeader>
          <ModalBody>
            <Table bordered>
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>INV-2024-003</td>
                  <td>Walk-in Customer</td>
                  <td>2024-01-15</td>
                  <td>₹1,250.00</td>
                  <td>
                    <Button color="primary" size="sm">
                      Load
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>INV-2024-004</td>
                  <td>Regular Customer</td>
                  <td>2024-01-14</td>
                  <td>₹850.00</td>
                  <td>
                    <Button color="primary" size="sm">
                      Load
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setDraftModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={serviceModal} toggle={() => setServiceModal(false)}>
          <ModalHeader toggle={() => setServiceModal(false)}>
            Add Service
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Service Name</Label>
              <Input type="text" placeholder="Enter service name" />
            </FormGroup>
            <FormGroup>
              <Label>Service Charge</Label>
              <Input type="number" placeholder="Enter amount" />
            </FormGroup>
            <FormGroup>
              <Label>GST %</Label>
              <Input type="number" defaultValue="18" />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Add Service</Button>
            <Button color="secondary" onClick={() => setServiceModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  )
}

export default DrugInventory
