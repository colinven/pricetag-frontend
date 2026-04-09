import createClient from "./client";

const quoteClient = createClient(`${import.meta.env.VITE_BASE_API_URL}/public`);

// see API_CONTRACT.md for request/response shapes

const getCompanyInfo =  (slug) => quoteClient.get(`/${slug}/company-info`);
const sendQuoteRequest = (slug, req) => quoteClient.post(`/${slug}/quote-request`, req);
const amendQuoteRequest = (slug, req) => quoteClient.post(`/${slug}/quote-request/amend`, req);

const viewFinalizedQuote = (id, token) => quoteClient.get(`/quotes/${id}`, { params: token });
const acceptOrDeclineQuote = (id, token) => quoteClient.patch(`/quotes/${id}`, { params: token });

export { getCompanyInfo, sendQuoteRequest, amendQuoteRequest, viewFinalizedQuote, acceptOrDeclineQuote };
