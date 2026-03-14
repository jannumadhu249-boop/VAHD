import React from "react"
import { Redirect } from "react-router-dom"

//Auth
import UserProfile from "../pages/Authentication/user-profile"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import Resetpsw from "pages/Authentication/Resetpsw"
import Compareotp from "pages/Authentication/Compareotp"
import VerifyOtp from "pages/Authentication/VerifyOtp"

//Dashboard
import Dashboard from "../pages/Dashboard/index"

//EmployeeRegistation
import AddEmployeeRegistation from "pages/EmployeeRegistation/AddEmployeeRegistation"
import EmployeeRegistation from "pages/EmployeeRegistation/EmployeeRegistation"
import EditEmployeeRegistations from "pages/EmployeeRegistation/EditEmployeeRegistations"
import EditEmployeeRegistation from "pages/EmployeeRegistation/EditEmployeeRegistation"
import EmployeeAttendanceReport from "pages/EmployeeRegistation/EmployeeAttendanceReport"
import DetailAttendanceReport from "pages/EmployeeRegistation/DetailAttendanceReport"

//MprReport
import AddMprOperation from "pages/MprOperation/AddMprOperation"
import MprOperation from "pages/MprOperation/MprOperation"

//Forms
import CaseTreated from "pages/PatientRegistration/CaseTreated"
import Deworming from "pages/PatientRegistration/Deworming"
import Castration from "pages/PatientRegistration/Castration"
import Vaccination from "pages/PatientRegistration/Vaccination"
import Operation from "pages/PatientRegistration/Operation"
import Fodder from "pages/PatientRegistration/Fodder"
import SheepAndGoatDeworming from "pages/PatientRegistration/SheepAndGoatDeworming"

//VeterinaryInspection
import AddVeterinaryInspection from "pages/VeterinaryInspection/AddVeterinaryInspection"
import VeterinaryInspection from "pages/VeterinaryInspection/VeterinaryInspection"

//Drug
import ArtificalInsemination from "pages/Drug/ArtificalInsemination"
import Drug from "pages/Drug/Drug"
import DrugIndent from "pages/Drug/DrugIndent"
import AllocationForm from "pages/Drug/AllocationForm"
import PercentageAllocation from "pages/Drug/PercentageAllocation"
import Groups from "pages/Drug/Groups"

//Reports
import GroupsReport from "pages/Drug/GroupsReport"
import DrugsReport from "pages/Drug/DrugsReport"
import PlaceofWorkingReports from "pages/Drug/PlaceofWorkingReports"
import DrugWiseReport from "pages/Drug/DrugWiseReport"
import AbstractReport from "pages/Drug/AbstractReport"
import DistrictWiseReport from "pages/Drug/DistrictWiseReport"
import GroupWiseDistrictReport from "pages/Drug/GroupWiseDistrictReport"
import DistrictWiseAbstract from "pages/Drug/DistrictWiseAbstract"
import DistrictWiseInstCount from "pages/Drug/DistrictWiseInstCount"

//Inventorymanagement
import Inventorymanagement from "pages/Drug/Inventorymanagement"

//Settings
import District from "pages/Settings/District"
import Mandal from "pages/Settings/Mandal"
import VillageTown from "pages/Settings/VillageTown"
import PlaceOfWorking from "pages/Settings/PlaceOfWorking"
import PlaceOfWorkingMap from "pages/Settings/PlaceOfWorkingMap"
import AddDesignation from "pages/Settings/AddDesignation"
import Designation from "pages/Settings/Designation"
import EditDesignation from "pages/Settings/EditDesignation"
import AddEmploymentType from "pages/Settings/AddEmploymentType"
import EmploymentType from "pages/Settings/EmploymentType"
import EditEmploymentType from "pages/Settings/EditEmploymentType"
import TypeofPosting from "pages/Settings/TypeofPosting"
import SubDesignation from "pages/Settings/SubDesignation"
import AnimalTypes from "pages/Settings/AnimalTypes"
import Breeds from "pages/Settings/Breeds"
import VaccinationType from "pages/Settings/VaccinationType"
import Qualification from "pages/Settings/Qualification"
import SubQualification from "pages/Settings/SubQualification"
import Grampanchayath from "pages/Settings/Grampanchayath"
import Operations from "pages/Settings/Operations"
import OperationsType from "pages/Settings/OperationsType"
import Diagnostics from "pages/Settings/Diagnostics"
import Items from "pages/Settings/Items"
import Settings from "pages/Settings/Settings"
import SexSortedSemen from "pages/Settings/SexSortedSemen"
import Financialyear from "pages/Drug/Financialyear"
import Terms from "pages/Settings/Terms"
import Quarter from "pages/Settings/Quarter"
import Scheme from "pages/Settings/Scheme"
import Categories from "pages/Settings/Categories"
import Note from "pages/Drug/Note"
import OrdersIssued from "pages/Drug/OrdersIssued"
import LeaveReason from "pages/Settings/LeaveReason"

//Terms
import PrivacyPolicy from "pages/PrivacyPolicy"
import TermsAndConditions from "pages/TermsConditions"
import DeleteAccount from "pages/DeleteAccount"
import DetailedDrugReport from "pages/Drug/DetailedDrugReport"
import Documents from "pages/Drug/Documents"
import Reports from "pages/Drug/Reports"
import DvahoTesting from "pages/Drug/DvahoTesting"
import LeavesManagement from "pages/EmployeeRegistation/LeavesManagement"
import Calender from "pages/Settings/Calender"
import NewUser from "pages/Authentication/NewUser"
import AttendanceReport from "pages/EmployeeRegistation/AttendanceReport"
import CaseTreatedReport from "pages/PatientRegistration/CaseTreatedReport"
import ArtificialInseminationReport from "pages/Drug/ArtificialInseminationReport"
import FodderReport from "pages/PatientRegistration/FodderReport"
import Farmers from "pages/Farmers/Farmers"
import FarmersReport from "pages/Farmers/FarmersReport"
import FarmersAbstractReport from "pages/Farmers/FarmersAbstractReport"
import DistrictWiseAttendanceCount from "pages/EmployeeRegistation/DistrictWiseAttendanceCount"


//Fodder
import TypeSeeds from "pages/Settings/TypeSeeds"
import UnitSize from "pages/Settings/UnitSize"
import FodderItems from "pages/Settings/FodderItems"
import FodderDistribution from "pages/PatientRegistration/FodderDistributionDistrict"
import FodderDistributionState from "pages/PatientRegistration/FodderDistributionState"
import FodderDistributionDistrict from "pages/PatientRegistration/FodderDistributionDistrict"
import DetailAttendanceReportWithTime from "pages/EmployeeRegistation/DetailAttendanceReportWithTime"
import DistrictWiseAttendanceCountWithTime from "pages/EmployeeRegistation/DistrictWiseAttendanceCountWithTime"
import DetailEmployeeAttendanceReport from "pages/EmployeeRegistation/DetailEmployeeAttendanceReport"
import { padEnd } from "lodash"

const authProtectedRoutes = [
  //Dashboard
  { path: "/dashboard", component: Dashboard },

  //EmployeeRegistation
  { path: "/add-employee-registation", component: AddEmployeeRegistation },
  { path: "/employee-registation", component: EmployeeRegistation },
  { path: "/edit-employee-registations", component: EditEmployeeRegistations },
  { path: "/edit-employee-registation", component: EditEmployeeRegistation },
  { path: "/employee-attendance-report", component: EmployeeAttendanceReport },
  { path: "/detail-attendance-report", component: DetailAttendanceReport },
  { path: "/leave-report", component: LeavesManagement },
  { path: "/sub-designation", component: SubDesignation },
  { path: "/attendance-report", component: AttendanceReport },
  { path: "/district-wise-attendance-count", component: DistrictWiseAttendanceCount },
  

  { path: "/detail-attendance-report-time", component: DetailAttendanceReportWithTime },
  { path: "/district-wise-attendance-count-time", component: DistrictWiseAttendanceCountWithTime },
  { path: "/detail-employee-attendance-report", component: DetailEmployeeAttendanceReport },



  //MprReport
  { path: "/add-Mpr-operation", component: AddMprOperation },
  { path: "/mpr-operation", component: MprOperation },

  //FarmersReport
  { path: "/farmers-report", component: FarmersReport },
  { path: "/farmers-abstract-report", component: FarmersAbstractReport },

  //New Forms
  { path: "/case-treated", component: CaseTreated },
  { path: "/case-treated-report", component: CaseTreatedReport },
  { path: "/deworming", component: Deworming },
  { path: "/artificial-insemination-report", component: ArtificialInseminationReport },
  { path: "/castration", component: Castration },
  { path: "/vaccination", component: Vaccination },
  { path: "/operation", component: Operation },
  { path: "/fodder", component: Fodder },
  { path: "/fodder-report", component: FodderReport },
  { path: "/sheep-goat-deworming", component: SheepAndGoatDeworming },

  //VeterinaryInspection
  { path: "/add-veterinary-inspection", component: AddVeterinaryInspection },
  { path: "/veterinary-inspection", component: VeterinaryInspection },

  //Drug
  { path: "/artifical-insemination", component: ArtificalInsemination },
  { path: "/groups", component: Groups },
  { path: "/drug", component: Drug },
  { path: "/drugIndent", component: DrugIndent },
  { path: "/allocation-form", component: AllocationForm },
  { path: "/percentage-allocation", component: PercentageAllocation },

  //Reports

  { path: "/reports", component: Reports },
  { path: "/groups-report", component: GroupsReport },
  { path: "/drugs-report", component: DrugsReport },
  { path: "/placeofworking-report", component: PlaceofWorkingReports },
  { path: "/drug-wise-report", component: DrugWiseReport },
  { path: "/abstract-report", component: AbstractReport },
  { path: "/district-wise-report", component: DistrictWiseReport },
  { path: "/group-wise-district-report", component: GroupWiseDistrictReport },
  { path: "/district-wise-abstract", component: DistrictWiseAbstract },
  { path: "/district-wise-inst-count", component: DistrictWiseInstCount },
  { path: "/detailed-drug-report", component: DetailedDrugReport },

  //Docs
  { path: "/documents", component: Documents },

  //DvahoTesting
  { path: "/dvaho-testing", component: DvahoTesting },

  //Inventory-Management
  { path: "/inventory-management", component: Inventorymanagement },

  //Settings
  { path: "/financial-year", component: Financialyear },
  { path: "/terms", component: Terms },
  { path: "/district", component: District },
  { path: "/mandal", component: Mandal },
  { path: "/village-town", component: VillageTown },
  { path: "/place-of-working", component: PlaceOfWorking },
  { path: "/place-of-working-map", component: PlaceOfWorkingMap },
  { path: "/designation", component: Designation },
  { path: "/add-designation", component: AddDesignation },
  { path: "/edit-designation", component: EditDesignation },
  { path: "/add-employment-type", component: AddEmploymentType },
  { path: "/employment-type", component: EmploymentType },
  { path: "/edit-employment-type", component: EditEmploymentType },
  { path: "/type-of-posting", component: TypeofPosting },
  { path: "/animal-types", component: AnimalTypes },
  { path: "/breeds", component: Breeds },
  { path: "/vaccination-type", component: VaccinationType },
  { path: "/qualification", component: Qualification },
  { path: "/sub-qualification", component: SubQualification },
  { path: "/grampanchayath", component: Grampanchayath },
  { path: "/operations", component: Operations },
  { path: "/operations-type", component: OperationsType },
  { path: "/diagnostics", component: Diagnostics },
  { path: "/items", component: Items },
  { path: "/settings", component: Settings },
  { path: "/sex-sorted-semen", component: SexSortedSemen },
  { path: "/quarter", component: Quarter },
  { path: "/scheme", component: Scheme },
  { path: "/categories", component: Categories },
  { path: "/note", component: Note },
  { path: "/orders-issued", component: OrdersIssued },
  { path: "/calender", component: Calender },
  { path: "/farmers", component: Farmers },

  //Leave Reasons
  { path: "/leave-reasons", component: LeaveReason },

  //Fodder
  { path: "/type-seeds", component: TypeSeeds },
  { path: "/unit-size", component: UnitSize },
  { path: "/fodder-items", component: FodderItems },
  { path: "/fodder-distribution", component: FodderDistributionDistrict },
  { path: "/fodder-distribution-state", component: FodderDistributionState },

  //Profile
  { path: "/profile", component: UserProfile },
  { path: "/", exact: true, component: () => <Redirect to="/login" /> },


]

const publicRoutes = [
  //Login
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  //Terms
  { path: "/privacy-policy", component: PrivacyPolicy },
  { path: "/terms-conditions", component: TermsAndConditions },
  { path: "/delete-account", component: DeleteAccount },

  //Resetpsw
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/Resetpsw", component: Resetpsw },
  { path: "/new-user", component: NewUser },
  { path: "/Compareotp", component: Compareotp },
  { path: "/verifyotp", component: VerifyOtp },
  

]

export { publicRoutes, authProtectedRoutes }
