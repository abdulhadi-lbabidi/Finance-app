import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  // You can add headers here if needed, e.g. Authorization
});

// admins
export const getAdmins = () => api.get("/data/admin");
export const getAdmindata = (id) => api.get(`/data/admin/${id}`);
export const addAdmin = (data) => {
  return api.post("/data/admin", data);
};
export const updateAdmin = (id, data) => {
  return api.put(`/data/admin/${id}`, data);
};
export const deleteAdmin = (id) => {
  return api.delete(`/data/admin/${id}`);
};
// admin types
export const getAdminTypes = () => api.get("/data/admintype");
export const getAdminTypedata = (id) => api.get(`/data/admintype/${id}`);
export const addAdminType = (data) => {
  return api.post("/data/admintype", data);
};
export const updateAdminType = (id, data) => {
  return api.put(`/data/admintype/${id}`, data);
};
export const deleteAdminType = (id) => {
  return api.delete(`/data/admintype/${id}`);
};

// employees
export const getEmployees = () => api.get("/data/employee");
export const getEmployeedata = (id) => api.get(`/data/employee/${id}`);
export const addEmployee = (data) => {
  return api.post("/data/employee", data);
};
export const updateEmployee = (id, data) => {
  return api.put(`/data/employee/${id}`, data);
};
export const deleteEmployee = (id) => {
  return api.delete(`/data/employee/${id}`);
};

// employee types
export const getEmployeeTypes = () => api.get("/data/employeetype");
export const getEmployeeTypedata = (id) => api.get(`/data/employeetype/${id}`);
export const addEmployeeType = (data) => {
  return api.post("/data/employeetype", data);
};
export const updateEmployeeType = (id, data) => {
  return api.put(`/data/employeetype/${id}`, data);
};
export const deleteEmployeeType = (id) => {
  return api.delete(`/data/employeetype/${id}`);
};
// customer
export const getCustomers = () => api.get("/data/customer");
export const getCustomerdata = (id) => api.get(`/data/customer/${id}`);
export const addCustomer = (data) => {
  return api.post("/data/customer", data);
};
export const updateCustomer = (id, data) => {
  return api.put(`/data/customer/${id}`, data);
};
export const deleteCustomer = (id) => {
  return api.delete(`/data/customer/${id}`);
};

// logistic workers
export const getLogistics = () => api.get("/data/logistic");
export const getLogisticdata = (id) => api.get(`/data/logistic/${id}`);
export const addLogistic = (data) => {
  return api.post("/data/logistic", data);
};
export const updateLogistic = (id, data) => {
  return api.put(`/data/logistic/${id}`, data);
};
export const deleteLogistic = (id) => {
  return api.delete(`/data/logistic/${id}`);
};

// technical workers

export const getTechnicals = () => api.get("/data/technical");
export const getTechnicaldata = (id) => api.get(`/data/technical/${id}`);
export const addTechnical = (data) => {
  return api.post("/data/technical", data);
};
export const updateTechnical = (id, data) => {
  return api.put(`/data/technical/${id}`, data);
};
export const deleteTechnical = (id) => {
  return api.delete(`/data/technical/${id}`);
};

// reusable

// phones

export const getPhoneTypes = (type) => api.get(`/data/phones?type=${type}`);
export const getPhones = (type, id) =>
  api.get(`/data/phone?type=${type}&id=${id}`);
export const getPhone = (id) => api.get(`/data/phone/${id}`);
export const addPhone = (data) => {
  return api.post("/data/phone", data);
};
export const updatePhone = (data) => {
  return api.put("/data/phone", data);
};
export const deletePhone = (id) => {
  return api.delete(`/data/phone/${id}`);
};

// socialmedia

export const getSocialMedias = (type, id) =>
  api.get(`/data/socialmedia?type=${type}&id=${id}`);

// socialmedia types
export const getSocialMediaTypes = () => api.get("/data/socialmediatype");
export const getSocialMediaTypedata = (id) =>
  api.get(`/data/socialmediatype/${id}`);
export const addSocialMediaType = (data) => {
  return api.post("/data/socialmediatype", data);
};
export const updateSocialMediaType = (id, data) => {
  return api.put(`/data/socialmediatype/${id}`, data);
};
export const deleteSocialMediaType = (id) => {
  return api.delete(`/data/socialmediatype/${id}`);
};
// Note

export const getNotes = (id) => api.get(`/data/note?user_id=${id}`);
export const getNotedata = (id) => api.get(`/data/note/${id}`);
export const addNote = (data) => api.post(`/data/note`, data);
export const updateNote = (id, data) => api.put(`/data/note/${id}`, data);
export const deleteNote = (id) => api.delete(`/data/note/${id}`);

// Finance Items
export const getFinanceItems = () => api.get("/data/financeitem");
export const getFinanceItemdata = (id) => api.get(`/data/financeitem/${id}`);
export const addFinanceItem = (data) => {
  return api.post("/data/financeitem", data);
};
export const updateFinanceItem = (id, data) => {
  return api.put(`/data/financeitem/${id}`, data);
};
export const deleteFinanceItem = (id) => {
  return api.delete(`/data/financeitem/${id}`);
};

// Department
export const getDepartments = () => api.get("/data/department");
export const getDepartmentdata = (id) => api.get(`/data/department/${id}`);
export const addDepartment = (data) => {
  return api.post("/data/department", data);
};
export const updateDepartment = (id, data) => {
  return api.put(`/data/department/${id}`, data);
};
export const deleteDepartment = (id) => {
  return api.delete(`/data/department/${id}`);
};

// Inventory

export const getInventories = (type) => api.get(`/data/inventory?type=${type}`);
export const getInventory = (id) => api.get(`/data/inventory/${id}`);
export const addInventory = (data) => {
  return api.post("/data/inventory", data);
};
export const updateInventory = (id, data) => {
  return api.put(`/data/inventory/${id}`, data);
};
export const deleteInventory = (id) => {
  return api.delete(`/data/inventory/${id}`);
};

// Workshop
export const getWorkshops = () => api.get("/data/workshop");
export const getWorkshopdata = (id) => api.get(`/data/workshop/${id}`);
export const addWorkshop = (data) => {
  return api.post("/data/workshop", data);
};
export const updateWorkshop = (id, data) => {
  return api.put(`/data/workshop/${id}`, data);
};
export const deleteWorkshop = (id) => {
  return api.delete(`/data/workshop/${id}`);
};

// MoneyTransfare
export const getMoneyTransfares = (id) =>
  api.get(`/data/moneytransfare?tresurefund_id=${id}`);
export const getMoneyTransfaredata = (id) =>
  api.get(`/data/moneytransfare/${id}`);
export const addMoneyTransfare = (data) => {
  return api.post("/data/moneytransfare", data);
};
export const updateMoneyTransfare = (id, data) => {
  return api.put(`/data/moneytransfare/${id}`, data);
};
export const deleteMoneyTransfare = (id) => {
  return api.delete(`/data/moneytransfare/${id}`);
};

// InnerTransaction
export const getInnerTransactions = (id) =>
  api.get(`/data/innertrans?tresurefund_id=${id}`);
export const getInnerTransactiondata = (id) =>
  api.get(`/data/innertrans/${id}`);
export const addInnerTransaction = (data) => {
  return api.post("/data/innertrans", data);
};
export const updateInnerTransaction = (id, data) => {
  return api.put(`/data/innertrans/${id}`, data);
};
export const deleteInnerTransaction = (id) => {
  return api.delete(`/data/innertrans/${id}`);
};
// OuterTransaction
export const getOuterTransactions = (id) =>
  api.get(`/data/outertrans?tresurefund_id=${id}`);
export const getOuterTransactiondata = (id) =>
  api.get(`/data/outertrans/${id}`);
export const addOuterTransaction = (data) => {
  return api.post("/data/outertrans", data);
};
export const updateOuterTransaction = (id, data) => {
  return api.put(`/data/outertrans/${id}`, data);
};
export const deleteOuterTransaction = (id) => {
  return api.delete(`/data/outertrans/${id}`);
};

// WorkshopEmployees
export const getWorkshopEmployees = () => api.get(`/data/workshopre/employee`);
export const getWorkshopEmployee = (id) =>
  api.get(`/data/workshopre/employee/${id}`);
export const getWorkshopEmployeeInfo = (id) =>
  api.get(`/data/workshopre/getemployee/${id}`);
export const addWorkshopEmployee = (data) => {
  return api.post("/data/workshopre/employee", data);
};
export const deleteWorkshopEmployee = (id) => {
  return api.delete(`/data/workshopre/employee/${id}`);
};

// WorkshopLogistics

export const getWorkshopLogistics = () => api.get(`/data/workshopre/logistic`);
export const getWorkshopLogistic = (id) =>
  api.get(`/data/workshopre/logistic/${id}`);
export const getWorkshopLogisticInfo = (id) =>
  api.get(`/data/workshopre/getlogistic/${id}`);
export const addWorkshopLogistic = (data) => {
  return api.post("/data/workshopre/logistic", data);
};
export const deleteWorkshopLogistic = (id) => {
  return api.delete(`/data/workshopre/logistic/${id}`);
};

//Data
export const getTresureSelector = (type) =>
  api.get(`/data/tresure?type=${type}`);
export const getAdminTresure = (id) => api.get(`/data/admin/tresure/${id}`);
export const getWorkshopTresure = (id) =>
  api.get(`/data/workshop/tresure/${id}`);
export const getTresureFunds = (id) => api.get(`/data/tresurefund/${id}`);

// Invoices
export const getInvoices = (type) => api.get(`/data/invoices?type=${type}`);
export const getInvoiceById = (id) => {
  return api.get(`data/invoices/${id}`);
};
export const addInvoices = (data) => {
  return api.post("/data/invoices", data);
};
export const updateInvoices = (id, data) => {
  return api.put(`/data/invoices/${id}`, data);
};
export const deleteInvoices = (id) => {
  return api.delete(`/data/invoices/${id}`);
};

// invoices images
export const getInvoicesImages = (type) =>
  api.get(`/data/invoices-images/${type}`);

export const addInvoicesImages = (invoiceId, formData) => {
  return api.post(`/data/invoices-image/${invoiceId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getInvoiceImageById = (id) => {
  return api.get(`data/invoices-image/${id}`);
};
export const deleteInvoiceImage = (id) => {
  return api.delete(`/data/invoices-image/${id}`);
};
// download invoices images
export const downloadInvoicesImages = (fileName) =>
  api.get(`/data/invoices-images/${fileName}`);

// technicalTeams
export const getTechnicalTeams = () => api.get(`/data/technical-teams`);

// technicalTeams
export const getLogicTeams = () => api.get(`/data/logic-teams`);

// tecPays
export const getTechPays = () => api.get(`/data/tech-pays`);
export const getTechPaysById = (id) => {
  return api.get(`data/tech-pays/${id}`);
};
export const addTechPays = (data) => {
  return api.post("/data/tech-pays", data);
};
export const updateTechPays = (id, data) => {
  return api.put(`/data/tech-pays/${id}`, data);
};
export const deleteTechPays = (id) => {
  return api.delete(`/data/tech-pays/${id}`);
};

// logicPays
export const getLogicPays = () => api.get(`/data/logic-pays`);
export const getLogicPaysById = (id) => {
  return api.get(`data/logic-pays/${id}`);
};
export const addLogicPays = (data) => {
  return api.post("/data/logic-pays", data);
};
export const updateLogicPays = (id, data) => {
  return api.put(`/data/logic-pays/${id}`, data);
};
export const deleteLogicPays = (id) => {
  return api.delete(`/data/logic-pays/${id}`);
};

// invoiceItems
export const getInvoiceItems = () => api.get(`/data/invoice-items`);
export const getInvoiceItemsById = (id) => {
  return api.get(`data/invoice-items/${id}`);
};
export const addInvoiceItems = (data) => {
  return api.post("/data/invoice-items", data);
};
export const updateInvoiceItems = (id, data) => {
  return api.put(`/data/invoice-items/${id}`, data);
};
export const deleteInvoiceItems = (id) => {
  return api.delete(`/data/invoice-items/${id}`);
};
