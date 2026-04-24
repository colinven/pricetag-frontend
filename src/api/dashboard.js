import createClient from "./client";

const dashboardClient = createClient(`${import.meta.env.VITE_BASE_API_URL}/company/dashboard`);

// see API_CONTRACT.md for request/response shapes

const getDashboardSummary = () => dashboardClient.get("/summary");
const getQuotesToReview = () => dashboardClient.get("/quotes-to-review");
const getAllQuotesPaginated = (page, size, sortBy, direction, statuses) => dashboardClient.get("/quotes",
    { params: { page, size, sortBy, direction, ...(statuses && { statuses }) } }
);
const getQuoteDetails = (id) => dashboardClient.get(`/quotes/${id}`);
const finalizeQuote = (id, req) => dashboardClient.patch(`/quotes/${id}/finalize`, req);
const manuallySetQuoteStatus = (id, req) => dashboardClient.patch(`/quotes/${id}/status`, req);
const getAllCustomersPaginated = (page, size, sortBy, direction) => dashboardClient.get("/customers", 
    { params: {page, size, sortBy, direction} }
);
const getCustomerDetails = (id) => dashboardClient.get(`/customers/${id}`);

export { 
    getDashboardSummary, 
    getQuotesToReview, 
    getAllQuotesPaginated, 
    getQuoteDetails, 
    finalizeQuote,
    manuallySetQuoteStatus,
    getAllCustomersPaginated,
    getCustomerDetails
};