const Url = "https://api.vahdtelangana.com/"

export const URLS = {
  Base: Url,

  //profile
  getProfile: Url + "v1/api/app/getprofile",
  UpdateProfile: Url + "v1/admin/auth/editprofile",
  UpdateImage: Url + "v1/api/app/updateprofilepic",
  ChangePass: Url + "v1/api/app/changepassword",

  //forgetpassword
  ForgotPassword: Url + "v1/api/admin/auth/generateForgotPasswordOTP",
  VerifyForgotPasswordOTP: Url + "v1/api/admin/auth/verifyForgotPasswordOtp",
  ResetForgotPassword: Url + "v1/api/admin/auth/resetForgotPassword",
  forget: Url + "v1/api/admin/auth/sendotpStaff",
  OTP: Url + "v1/api/admin/auth/compareotpStaff",
  Resetpass: Url + "v1/api/admin/auth/resetpassStaff",
  Resetpassword: Url + "v1/api/admin/auth/updatepasswordStaff",

  //District
  AddDistrict: Url + "v1/api/common/adddistrict",
  GetDistrict: Url + "v1/api/common/reporstdistricts",
  GetDistrictSearch: Url + "v1/api/common/districts?searchQuery=",
  EditDistrict: Url + "v1/api/common/editdistrict/",
  DeleteDistrict: Url + "v1/api/common/deletedistrict/",

  //Farmers
  UploadFarmersExcel: Url + "v1/api/admin/auth/addexcell",
  GetFarmersByDistrictId: Url + "v1/api/admin/auth/getfarmersbydistrictid",
  GetAbstractData: Url + "v1/api/admin/auth/getabstractdata",
  GetFarmersExcel: Url + "v1/api/admin/auth/getfarmersexcel",
  GetDistrictWiseFarmersAbstract: Url + "v1/api/admin/auth/getabstractdatawithoutfilter",

  //Mandal
  AddMandal: Url + "v1/api/admin/mandal/addmandal",
  GetMandal: Url + "v1/api/admin/mandal/getallmandals",
  GetMandalSearch: Url + "v1/api/admin/mandal/getallmandals?searchQuery=",
  EditMandal: Url + "v1/api/admin/mandal/editmandal/",
  DeleteMandal: Url + "v1/api/admin/mandal/deletemandal/",
  GetDistrictIdbyMandals:
    Url + "v1/api/admin/mandal/getallmandalsunderdistrictid",

  //VillageTown
  AddVillageTown: Url + "v1/api/admin/town/addtown",
  GetVillageTown: Url + "v1/api/admin/town/getalltowns",
  GetVillageTownSearch: Url + "v1/api/admin/town/getalltowns?searchQuery=",
  EditVillageTown: Url + "v1/api/admin/town/edittown/",
  DeleteVillageTown: Url + "v1/api/admin/town/deletetown/",
  GetMandalIdByVillageTown: Url + "v1/api/admin/town/getalltownsundermandalid",

  //Placeofworking
  AddPlaceOfWorking: Url + "v1/api/admin/placeofworking/addplaceofworkings",
  GetPlaceOfWorking: Url + "v1/api/admin/placeofworking/getallplaceofworkings",
  GetPlaceOfWorkingSearch:
    Url + "v1/api/admin/placeofworking/getallplaceofworkings?searchQuery=",
  EditPlaceOfWorking: Url + "v1/api/admin/placeofworking/editplaceofworking/",
  DeletePlaceOfWorking:
    Url + "v1/api/admin/placeofworking/deleteplaceofworking/",
  GetVillageTownPlaceOfWorkingId:
    Url + "v1/api/admin/placeofworking/getallplaceofworkingsundertownid",
  GetPlaceOfWorkingById: Url + "v1/api/common/getplaceofworkingbyid",
  BulkUploadPlaceOfWorking: Url + "api/upload",
  BulkPlaceOfWorkingDelete:
    Url + "v1/api/admin/placeofworking/bulkdeleteplaceofworking",
  GetAllPlaceOfWorking:
    Url + "v1/api/admin/placeofworking/getAllWorkingPlacesDropdown",
  GetAllPlaceOfWorkingPaginated:
    Url +
    "v1/api/admin/placeofworking/getAllWorkingPlacesPaginated?searchQuery=",

  //Employee Registation
  GetSingleDayAbstract: Url + "v1/api/face_recognitio/getAttendanceAbstract",
  GetMultipleDaysAbstract: Url + "v1/api/face_recognitio/attendanceAbstractReport",
  AttendanceReport: Url + "v1/api/face_recognitio/attandance-report",
  AddEmployeeRegistation: Url + "v1/api/face_recognitio/addstaff",
  GetEmployeeRegistation: Url + "v1/api/admin/staff/getAllstaff",
  GetEmployeeRegistationSearch:
    Url + "v1/api/admin/staff/getAllstaff?searchQuery=",
  EditEmployeeRegistation: Url + "v1/api/admin/staff/editstaff/",
  DeleteEmployeeRegistation: Url + "v1/api/admin/staff/deletestaff/",
  GetEmployeeRegistationId: Url + "v1/api/admin/staff/getstaffbyid",
  GetDetailAttendanceReport: Url + "v1/api/face_recognitio/employee-attandance-report",
  GetDistrictWiseAttendanceReport: Url + "v1/api/face_recognitio/district-attandance-report",
  GetEmployeeReport: Url + "v1/api/admin/getallemployereports",
  GetEmployeeReportSearch:
    Url + "v1/api/admin/getallemployereports?searchQuery=",
  BluckUploadEmployeeRegistation: Url + "api/upload-staff",
  BluckEmployeeDelete: Url + "v1/api/admin/staff/bulkDeleteStaff",
  EmployeeDownloadReport: Url + "v1/api/face_recognitio/employee-download-report",

  //CaseTreated
  AddCaseTreated: Url + "v1/api/admin/patient/addPatient-entry",
  GetCaseTreated: Url + "v1/api/admin/patient/getPatient-entries",
  GetCaseTreatedSearch:
    Url + "v1/api/admin/patient/getPatient-entries?searchQuery=",
  EditCaseTreated: Url + "v1/api/admin/patient/updatePatient-entry/",
  DeleteCaseTreated: Url + "v1/api/admin/patient/deletePatient-entry/",
  CaseTreatedReport: Url + "v1/api/admin/patient/getCaseTreatedReport",
  CaseTreatedAbstract: Url + "v1/api/admin/auth/getdistrictcasetreatedreport",


  //Fodder
  AddFodder: Url + "v1/api/admin/fodder/addFodder",
  GetFodder: Url + "v1/api/admin/fodder/getFodders",
  GetFodderSearch: Url + "v1/api/admin/fodder/getFodders?searchQuery=",
  EditFodder: Url + "v1/api/admin/fodder/updateFodder/",
  DeleteFodder: Url + "v1/api/admin/fodder/deleteFodder/",
  GetFodderReport: Url + "v1/api/admin/patient/getfodderReport",
  GetFodderReportDistrictWise: Url + "v1/api/admin/auth/getfodderreportdistrictwise",

  //Deworming
  AddDeworming: Url + "v1/api/admin/deworming/addDeworming",
  GetDeworming: Url + "v1/api/admin/deworming/getDewormings",
  GetDewormingSearch: Url + "v1/api/admin/deworming/getDewormings?searchQuery=",
  EditDeworming: Url + "v1/api/admin/deworming/updateDeworming/",
  DeleteDeworming: Url + "v1/api/admin/deworming/deleteDeworming/",

  //Veterinaryinspection
  AddVeterinaryinspection: Url + "v1/api/inception/add-inception",
  GetVeterinaryinspection: Url + "v1/api/inception/get-all",
  GetVeterinaryinspectionSearch: Url + "v1/api/inception/get-all?searchQuery=",
  EditVeterinaryinspection:
    Url + "v1/api/clinicaloperation/editdclinicaloperation/",
  DeleteVeterinaryinspection: Url + "v1/api/inception/delete/",
  GetVeterinaryinspectionId:
    Url + "v1/api/clinicaloperation/getclinicaloperationById",
  GetVeterinaryIdbyStaff: Url + "v1/api/inception/get-employees",

  //MprOperation
  AddMprOperation: Url + "v1/api/admin/mproperation/addmprOperation",
  GetMprOperation: Url + "v1/api/admin/mproperation/getallmprOperations",
  GetMprOperationSearch:
    Url + "v1/api/admin/mproperation/getallmprOperations?searchQuery=",
  EditMprOperation: Url + "v1/api/admin/mproperation/updatemproperation/",
  DeleteMprOperation: Url + "v1/api/admin/mproperation/deletemproperation/",
  GetOneMprOperationId: Url + "v1/api/admin/mproperation/getmproperationbyid",

  //Items
  AddItems: Url + "v1/api/admin/additem",
  GetAllItems: Url + "v1/api/admin/items/getall",
  GetAllItemsSearch: Url + "v1/api/admin/items/getall?searchQuery=",
  EditItems: Url + "v1/api/admin/items/update/",
  DeleteItems: Url + "v1/api/admin/items/delete/",

  //MprOperation
  AddMprOperation: Url + "v1/api/admin/mproperation/addmprOperation",
  GetMprOperation: Url + "v1/api/admin/mproperation/getallmprOperations",
  GetMprOperationSearch:
    Url + "v1/api/admin/mproperation/getallmprOperations?searchQuery=",
  EditMprOperation: Url + "v1/api/admin/mproperation/updatemproperation/",
  DeleteMprOperation: Url + "v1/api/admin/mproperation/deletemproperation/",
  GetOneMprOperationId: Url + "v1/api/admin/mproperation/getmproperationbyid",

  //Settings
  //Designation
  AddDesignation: Url + "v1/api/common/addDesignations",
  GetDesignation: Url + "v1/api/common/designations",
  GetDesignationById: Url + "v1/api/common/designationsById",
  GetDesignationSearch: Url + "v1/api/common/designations?searchQuery=",
  EditDesignation: Url + "v1/api/common/editDesignations/",
  DeleteDesignation: Url + "v1/api/common/deleteDesignations/",

  //EmploymentType
  AddEmploymentType: Url + "v1/api/admin/instituteRoutes/addInstituteType",
  GetEmploymentType: Url + "v1/api/admin/instituteRoutes/instituteType",
  GetEmploymentTypeSearch:
    Url + "v1/api/admin/instituteRoutes/instituteType?searchQuery=",
  EditEmploymentType: Url + "v1/api/admin/instituteRoutes/updateInstituteType/",
  DeleteEmploymentType:
    Url + "v1/api/admin/instituteRoutes/deleteInstituteType/",
  GetOneEmploymentType:
    Url + "v1/api/admin/instituteRoutes/getInstituteTypesById",
  GetInstituteType: Url + "v1/api/admin/instituteRoutes/getInstituteTypestest",

  //TypeOfPosting
  AddTypeOfPosting: Url + "v1/api/admin/posting/addpostingType",
  GetTypeOfPosting: Url + "v1/api/admin/posting/postingType",
  GetTypeOfPostingSearch: Url + "v1/api/admin/posting/postingType?searchQuery=",
  EditTypeOfPosting: Url + "v1/api/admin/posting/updatepostingType/",
  DeleteTypeOfPosting: Url + "v1/api/admin/posting/deletepostingType/",

  //AnimalTypes
  AddAnimalTypes: Url + "v1/api/admin/animal/addAnimal-types",
  GetAnimalTypes: Url + "v1/api/admin/animal/getAnimal-types",
  GetAnimalTypesSearch:
    Url + "v1/api/admin/animal/getAnimal-types?searchQuery=",
  EditAnimalTypes: Url + "v1/api/admin/animal/updateAnimal-types/",
  DeleteAnimalTypes: Url + "v1/api/admin/animal/deleteAnimal-types/",

  //Breeds
  AddBreeds: Url + "v1/api/admin/animal/addBreeds",
  GetBreeds: Url + "v1/api/admin/animal/getBreeds",
  GetBreedsSearch: Url + "v1/api/admin/animal/getBreeds?searchQuery=",
  EditBreeds: Url + "v1/api/admin/animal/UpdateBreeds/",
  DeleteBreeds: Url + "v1/api/admin/animal/deleteBreeds/",
  GetOneBreeds: Url + "v1/api/admin/animal/getBreedsById/",

  //Qualification
  AddQualification: Url + "v1/api/admin/qualifications/addQualification",
  GetQualification: Url + "v1/api/admin/qualifications/getQualifications",
  GetQualificationSearch:
    Url + "v1/api/admin/qualifications/getQualifications?searchQuery=",
  EditQualification: Url + "v1/api/admin/qualifications/updateQualification/",
  DeleteQualification: Url + "v1/api/admin/qualifications/deleteQualification/",

  //SubQualification
  AddSubQualification: Url + "v1/api/admin/qualifications/addSubQualification",
  GetSubQualification: Url + "v1/api/admin/qualifications/getSubQualifications",
  GetSubQualificationSearch:
    Url + "v1/api/admin/qualifications/getSubQualifications?searchQuery=",
  EditSubQualification:
    Url + "v1/api/admin/qualifications/updateSubQualification/",
  DeleteSubQualification:
    Url + "v1/api/admin/qualifications/deleteSubQualification/",
  GetQualificationBySubQualification:
    Url + "v1/api/admin/qualifications/getSubQualificationsById/",

  //OperationsType
  AddOperationsType: Url + "v1/api/admin/operation/addOperation",
  GetOperationsType: Url + "v1/api/admin/operation/getOperations",
  GetOperationsTypeSearch:
    Url + "v1/api/admin/operation/getOperations?searchQuery=",
  EditOperationsType: Url + "v1/api/admin/operation/updateOperation/",
  DeleteOperationsType: Url + "v1/api/admin/operation/deleteOperation/",

  //Diagnostics
  AddDiagnostics: Url + "v1/api/admin/diagnostics/addDiagnostics",
  GetDiagnostics: Url + "v1/api/admin/diagnostics/getDiagnostics",
  GetDiagnosticsSearch:
    Url + "v1/api/admin/diagnostics/getDiagnostics?searchQuery=",
  EditDiagnostics: Url + "v1/api/admin/diagnostics/updateDiagnostics/",
  DeleteDiagnostics: Url + "v1/api/admin/diagnostics/deleteDiagnostics/",

  //Operation
  AddOperations: Url + "v1/api/admin/operation/addSubOperation",
  GetOperations: Url + "v1/api/admin/operation/getSubOperations",
  GetOperationsSearch:
    Url + "v1/api/admin/operation/getSubOperations?searchQuery=",
  EditOperations: Url + "v1/api/admin/operation/updateSubOperation/",
  DeleteOperations: Url + "v1/api/admin/operation/deleteSubOperation/",
  GetOperationBySubOperation:
    Url + "v1/api/admin/operation/getSubOperationById/",

  //VaccinationType
  AddVaccinationType: Url + "v1/api/admin/vaccination/addVaccination",
  GetVaccinationType: Url + "v1/api/admin/vaccination/getVaccinations",
  GetVaccinationTypeSearch:
    Url + "v1/api/admin/vaccination/getVaccinations?searchQuery=",
  EditVaccinationType: Url + "v1/api/admin/vaccination/updateVaccination/",
  DeleteVaccinationType: Url + "v1/api/admin/vaccination/deleteVaccination/",
  GetAnimalTypeByVaccinationType:
    Url + "v1/api/admin/vaccination/getVaccinationById/",

  //Grampanchayath
  AddGrampanchayath: Url + "v1/api/common/createGramapanchayat",
  GetGrampanchayathPage: Url + "v1/api/common/getGramapanchayatPaginated",
  GetGrampanchayathPageSearch:
    Url + "v1/api/common/getGramapanchayatPaginated?searchQuery=",
  GetGrampanchayath: Url + "v1/api/common/gramapanchayat",
  GetGrampanchayathSearch: Url + "v1/api/common/gramapanchayat?searchQuery=",
  EditGrampanchayath: Url + "v1/api/common/updateGramapanchayat/",
  DeleteGrampanchayath: Url + "v1/api/common/deleteGramapanchayat/",
  BulkUploadGrampanchayath: Url + "api/upload-gramapanchayat",
  BulkGrampanchayathDelete: Url + "v1/api/common/bulkdeleteGramapanchayat",

  //Allocation Form
  AddAllocationForm: Url + "v1/api/admin/drugform/addAllocatingForm",
  GetAllocationForm: Url + "v1/api/admin/drugform/getAllAllocatingForms",
  GetAllocationFormSearch:
    Url + "v1/api/admin/drugform/getAllAllocatingForms?searchQuery=",
  GetAllocationForms:
    Url + "v1/api/admin/drugform/getAllocatingFormsUncumulated",
  EditAllocationForm: Url + "v1/api/admin/drugform/editAllocatingForm/",
  DeleteAllocationForm: Url + "v1/api/admin/drugform/deleteAllocatingForm/",
  GetByIdAllocationForm: Url + "v1/api/admin/drugform/getAllocatingFormById/",
  GetAllocationFormFilter:
    Url + "v1/api/admin/budgetallocation/getAllocatingFormsBudget",

  //Allocation Form
  AddPercentageAllocation:
    Url + "v1/api/admin/budgetallocation/createBudgetAllocation",
  GetPercentageAllocation:
    Url + "v1/api/admin/budgetallocation/getBudgetAllocations",
  GetPercentageAllocationSearch:
    Url + "v1/api/admin/budgetallocation/getBudgetAllocations?searchQuery=",
  EditPercentageAllocation:
    Url + "v1/api/admin/budgetallocation/updateBudgetAllocation/",
  DeletePercentageAllocation:
    Url + "v1/api/admin/budgetallocation/deleteBudgetAllocation/",
  GetByIdPercentageAllocation:
    Url + "v1/api/admin/budgetallocation/getBudgetAllocationsById/",

  //Drug
  AddDrug: Url + "v1/api/admin/drugcodes/createDrugCodes",
  GetDrug: Url + "v1/api/admin/drugcodes/getDrugCodes",
  GetDrugSearch: Url + "v1/api/admin/drugcodes/getDrugCodes?searchQuery=",
  EditDrug: Url + "v1/api/admin/drugcodes/updateDrugCode/",
  DeleteDrug: Url + "v1/api/admin/drugcodes/deleteDerugCode/",
  GetByIdDrug: Url + "v1/api/admin/drugform/getdrugcodesById/",
  BluckUploadDrug: Url + "v1/api/admin/drugcodes/bulkUploadDrugCodes",
  BluckDeleteDrug: Url + "v1/api/admin/drugcodes/bulkDeletedrugs",
  DrugWiseReports: Url + "v1/api/admin/drug/drugConsumptionReport_single",
  GetAbstractReport: Url + "v1/api/admin/drug/getDistrictIndentAbstract",
  GetDistrictWiseInstitutionsCount: Url + "v1/api/admin/drug/getDistrictInstitutionCount",

  //Dashboard
  getDashboard: Url + "v1/api/admin/getdashboard",

  //Drug SoftWear
  GetOneAllocationForm: Url + "v1/api/admin/drugform/getAllocatingFormById",
  GetInstitutionBygetPlaceOfWorking:
    Url + "v1/api/admin/drug/getPlaceOfWorking",
  GetOneDrugFormData: Url + "v1/api/admin/drug/getDrugFormData",
  GetAllDrugFormData: Url + "v1/api/admin/drug/getAllDrugFormData",
  GetFormByDrugs: Url + "v1/api/admin/drugcodes/getDrugCodesByFormId/",
  AddDrugGroup: Url + "v1/api/admin/drug/createDrugFormData",
  EditDrugGroup: Url + "v1/api/admin/drug/updateDrugFormData/",
  DeleteDrugGroup: Url + "v1/api/admin/drug/deleteDrugFormData/",
  BulkUploadDrugFormData: Url + "v1/api/admin/drug/createmultiDrugFormData",

  //Reports
  GetAllGroupsReport: Url + "v1/api/admin/drug/getAllDrugFormDataReport",
  GetAllDrugsReport: Url + "v1/api/admin/drug/drugConsumptionReport",
  GetPlaceofWorkingReports: Url + "v1/api/admin/drug/placeofworkingreport",
  GetPlaceofWorkingWiseReports:
    Url + "v1/api/admin/drug/placeofworkingwisereport",
  DistrictWiseReport: Url + "v1/api/admin/drug/getDvahoWiseDrugOrders",
  DistrictWiseBudgetUtilization: Url + "v1/api/admin/drug/districtBudgetUtilization",

  //freezeGroup/freezeGroup
  BugetTransfer: Url + "v1/api/admin/drug/createsetDrugFormData",
  freezeGroup: Url + "v1/api/admin/drug/creatfreezeDrugFormData",

  DVAHOfreezeDrugFormData: Url + "v1/api/admin/drug/creatDVAHOfreezeDrugFormData",

  //ArtificalInsemination
  AddArtificalInsemination:
    Url + "v1/api/admin/artificialinsemination/createArtificialInsemination",
  GetArtificalInsemination:
    Url + "v1/api/admin/artificialinsemination/getAllArtificialInseminations",
  GetArtificalInseminationSearch:
    Url +
    "v1/api/admin/artificialinsemination/getAllArtificialInseminations?searchQuery=",
  EditArtificalInsemination:
    Url +
    "v1/api/admin/artificialinsemination/updateArtificialInseminationById/",
  DeleteArtificalInsemination:
    Url +
    "v1/api/admin/artificialinsemination/deleteArtificialInseminationById/",
  GetAiReport: Url + "v1/api/admin/patient/getAiReport",
  GetAiAbstractReport: Url + "v1/api/admin/auth/getdistrictwiseai",

  //Note
  AddNote: Url + "v1/api/admin/note/addNote",
  GetNote: Url + "v1/api/admin/note/getAllNoteFiles",
  GetNoteSearch: Url + "v1/api/admin/note/getAllNoteFiles?searchQuery=",
  EditNote: Url + "v1/api/admin/note/updateNote/",
  DeleteNote: Url + "v1/api/admin/note/deleteNote/",

  //OrdersIssued
  AddOrdersIssued: Url + "v1/api/admin/note/createProceeding",
  GetOrdersIssued: Url + "v1/api/admin/note/getAllProceedings",
  GetOrdersIssuedSearch:
    Url + "v1/api/admin/note/getAllProceedings?searchQuery=",
  EditOrdersIssued: Url + "v1/api/admin/note/updateProceeding/",
  DeleteOrdersIssued: Url + "v1/api/admin/note/deleteProceeding/",

  //Financialyear
  AddFinancialyear: Url + "v1/api/admin/drug/createFinancialYear",
  GetFinancialyear: Url + "v1/api/admin/drug/getFinancialYear",
  GetFinancialyearSearch:
    Url + "v1/api/admin/drug/getFinancialYear?searchQuery=",
  EditFinancialyear: Url + "v1/api/admin/drug/updateFinancialYearById/",
  DeleteFinancialyear: Url + "v1/api/admin/drug/deleteFinancialYearById/",

  //Quarter
  AddQuarter: Url + "v1/api/admin/drug/createFinancialYearQuater",
  GetQuarter: Url + "v1/api/admin/drug/getFinancialYearQuarters",
  GetQuarterSearch:
    Url + "v1/api/admin/drug/getFinancialYearQuarters?searchQuery=",
  EditQuarter: Url + "v1/api/admin/drug/updateFinancialYearQuarterById/",
  DeleteQuarter: Url + "v1/api/admin/drug/deleteFinancialYearQuarterById/",

  //Scheme
  AddScheme: Url + "v1/api/admin/drug/createYearSchemes",
  GetScheme: Url + "v1/api/admin/drug/getYearSchemes",
  GetSchemeSearch: Url + "v1/api/admin/drug/getYearSchemes?searchQuery=",
  EditScheme: Url + "v1/api/admin/drug/updateYearSchemesById/",
  DeleteScheme: Url + "v1/api/admin/drug/deleteYearSchemesById/",

  //TermsAndConditions
  GetTermsAndConditions: Url + "v1/api/common/getTermsAndConditions",
  EditTermsAndConditions: Url + "v1/api/common/updateTermsAndPrivacyPolicy",

  // Faqs
  AddFaq: Url + "v1/api/common/addFaqs",
  GetFaq: Url + "v1/api/common/getFaqs",
  GetFaqSearch: Url + "v1/api/common/getFaqs?searchQuery=",
  EditFaq: Url + "v1/api/common/updateFaqs/",
  DeleteFaq: Url + "v1/api/common/deleteFaqs/",

  //documents
  GetAllReports: Url + "v1/api/admin/drug/getAllReports",
  CreateDocument: Url + "v1/api/admin/drug/createDocument",
  DeleteReport: Url + "v1/api/admin/drug/deleteReport",

  //Leaves
  GetAllLeaves: Url + "v1/api/admin/drug/getleaverequests",
  UpdateLeaveStatus: Url + "v1/api/admin/drug/updateleavestatus/",
  GetLeaveRequestById: Url + "v1/api/admin/drug/getleaverequestbyid",

  //Holidays
  UploadExcelForCalender: Url + "v1/api/admin/drug/addholidays",
  GetHolidaysByInstitutionType: Url + "v1/api/admin/drug/getallholidays",

  // Sex Sorted Semen
  GetAllSortedSemen: Url + "v1/api/admin/auth/getAllsortedsemens",
  AddSortedSemen: Url + "v1/api/admin/auth/addsortedsemen",
  EditSortedSemen: Url + "v1/api/admin/auth/editsortedsemen/",
  DeleteSortedSemen: Url + "v1/api/admin/auth/deletesortedsemen/",

  // Leave Reasons
  GetAllLeaveReasons: Url + "v1/api/admin/auth/getAllleavereasons",
  AddLeaveReason: Url + "v1/api/admin/auth/addleavereason",
  EditLeaveReason: Url + "v1/api/admin/auth/editleavereason/",
  DeleteLeaveReason: Url + "v1/api/admin/auth/deleteleavereason/",









  // madhu

  // Type of Seeds
  GetAllTypeSeeds: Url + "v1/api/admin/typeOfSeed/getallseeds",
  AddTypeSeeds: Url + "v1/api/admin/typeOfSeed/addtypeOfSeed",
  EditTypeSeeds: Url + "v1/api/admin/typeOfSeed/editseed/",
  DeleteTypeSeeds: Url + "v1/api/admin/typeOfSeed/deleteseed/",

  // Unit Size
  GetAllUnitSize: Url + "v1/api/admin/unitSize/getallUnitSize",
  AddUnitSize: Url + "v1/api/admin/unitSize/addtUnitSize",
  EditUnitSize: Url + "v1/api/admin/unitSize/editUnitSize/",
  DeleteUnitSize: Url + "v1/api/admin/unitSize/deleteUnitSize",
  GetUnitSizeSearch: Url + "v1/api/admin/unitSize/getallUnitSize?searchQuery=",

  // Fodder Items
  GetAllFodderItems: Url + "v1/api/admin/fodderSeedDistribution/getallFodderSeedDistribution",
  AddFodderItems: Url + "v1/api/admin/fodderSeedDistribution/addFodderSeedDistribution",
  EditFodderItems: Url + "v1/api/admin/fodderSeedDistribution/editFodderSeedDistribution/",
  DeleteFodderItems: Url + "v1/api/admin/fodderSeedDistribution/deleteFodderSeedDistribution/",

  // Fodder Distribution District
  GetAllFodderDistribution: Url + "v1/api/admin/foderDistributionDistrictWise/getFodderDistributionDistrictWise",
  AddFodderDistribution: Url + "v1/api/admin/foderDistributionDistrictWise/addFodderDistributionDistrictWise",
  EditFodderDistribution: Url+ "v1/api/admin/foderDistributionDistrictWise/updateFodderDistributionDistrictWise/",
  DeleteFodderDistribution: Url + "v1/api/admin/foderDistributionDistrictWise/deleteFodderDistributionDistrictWise/",
  GetFodderDistributionSearch: Url + "v1/api/admin/foderDistributionDistrictWise/getFodderDistributionDistrictWise?searchQuery=",

  // Fodder Distribution State
  GetAllFodderDistributionState: Url + "v1/api/admin/directorateFodderStock/getDirectorateFodderStock",
  AddFodderDistributionState: Url + "v1/api/admin/directorateFodderStock/addDirectorateFodderStock",
  EditFodderDistributionState: Url + "v1/api/admin/directorateFodderStock/updateDirectorateFodderStock/",
  GetFodderDistributionStateSearch: Url + "v1/api/admin/directorateFodderStock/getDirectorateFodderStock?searchQuery=",


  // District Wise Attendance Abstract With Time
  GetAllDistrictWiseAttendanceAbstractTime: Url + "v1/api/face_recognitio/district-attandance-abstract-report",

}
