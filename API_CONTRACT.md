# PriceTag Backend — Frontend API Contract

## 1. Base URL & Auth

Base URL: http://localhost:8080/api/v1

### JWT Authentication (cookie-based)

- The JWT is delivered via a `Set-Cookie` header on `POST /auth/login` and `POST /auth/register`. It is **not** returned in the response body.
- Cookie name: `auth_token`
- Cookie attributes:
  - `HttpOnly` — not readable from JavaScript
  - `Secure` — HTTPS only
  - `Path=/`
  - `SameSite=Strict`
  - `Max-Age=86400` (24 hours)
- **Frontend must send credentialed requests** — without this, the browser will not attach the cookie and authenticated endpoints will return 401:
  - `fetch`: pass `credentials: 'include'` on every request to the API
  - `axios`: set `withCredentials: true` (globally or per-request)
- CORS is configured server-side with `allowCredentials=true` against the configured frontend domain, which is required for the cookie flow to work cross-origin.
- **Reading the current user:** because the cookie is `HttpOnly`, JS cannot read JWT claims directly. Call `GET /auth/me` to obtain the authenticated user's `firstName`, `lastName`, `email`, and `role`.

---

## 2. Endpoints by Domain

### Auth — /api/v1/auth

| Method | Path           | Auth |
| ------ | -------------- | ---- |
| POST   | /auth/register | No   |
| POST   | /auth/login    | No   |
| POST   | /auth/logout   | Yes  |
| GET    | /auth/me       | Yes  |

#### POST /auth/register

```json
// Request
{
  "companyName": "string",
  "companyEmail": "string",
  "companyPhone": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

```json
// Response — 200 OK — UserResponse
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "OWNER"          // OWNER | MEMBER
}
```

```
// Side effect
Set-Cookie: auth_token=<jwt>; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=86400
```

#### POST /auth/login

```json
// Request
{ "email": "string", "password": "string" }
```

```json
// Response — 200 OK — UserResponse
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "OWNER"          // OWNER | MEMBER
}
```

```
// Side effect
Set-Cookie: auth_token=<jwt>; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=86400
```

#### POST /auth/logout

Requires the auth_token cookie to be present.

```
// Request
(no body)
```

```
// Response — 204 No Content
(empty body)
```

```
// Side effect — clears the cookie
Set-Cookie: auth_token=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0
```

#### GET /auth/me

Requires the auth_token cookie. This is how the frontend obtains the current user, since the cookie is HttpOnly and JWT claims are not readable from JS.

```
// Request
(no body)
```

```json
// Response — 200 OK — UserResponse
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "OWNER"          // OWNER | MEMBER
}
```

---

### Public Quote Form — /api/v1/public/{slug}

No auth required. {slug} identifies the company.

| Method | Path                               | Auth |
| ------ | ---------------------------------- | ---- |
| GET    | /public/{slug}/company-info        | No   |
| POST   | /public/{slug}/quote-request       | No   |
| POST   | /public/{slug}/quote-request/amend | No   |

#### GET /public/{slug}/company-info

```json
// Response
{
  "companyName": "string",
  "companyPhone": "string",
  "companyEmail": "string"
}
```

#### POST /public/{slug}/quote-request

```json
// Request
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "email": "string",
  "street": "string",        // must match: ^\d+\s+\S+.*
  "city": "string",
  "state": "string",         // 2-letter code, e.g. "TX"
  "zip": "string",           // 5 digits
  "lastWash": "string"
}
```

```json
// Response
{
  "customerId": "uuid",
  "lookupResult": {
    "data": {
      "sqft": 2100,
      "year_built": 2005,
      "stories": 2,
      "garage": 2,
      "property_type": "string"
    },
    "message": "string"
  },
  "price": [1200, 1400],     // [low, high]
  "address": "string"
}
```

#### POST /public/{slug}/quote-request/amend

Used when the customer corrects property data returned from the lookup.

```json
// Request
{
  "customerId": "uuid",
  "data": {
    "sqft": 2100,
    "year_built": 2005,
    "stories": 2,
    "garage": 2,
    "property_type": "string"
  },
  "addressInfo": {
    "street": "string",
    "city": "string",
    "state": "TX",
    "zip": "12345"
  },
  "lastWash": "string"
}
```

```json
// Response
{ "price": [1200, 1400] }
```

---

### Token-Based Quote Page — /api/v1/public/quotes

No JWT required. A token query param is used instead. This is the customer-facing final quote page.

| Method | Path                                        | Auth  |
| ------ | ------------------------------------------- | ----- |
| GET    | /public/quotes/{quoteId}?token={quoteToken} | Token |
| PATCH  | /public/quotes/{quoteId}?token={quoteToken} | Token |

#### GET /public/quotes/{quoteId}

```json
// Response — QuoteAndCompanyDetails
{
  "id": "uuid",
  "companyName": "string",
  "companyEmail": "string",
  "companyPhone": "string",
  "customerFirstName": "string",
  "customerLastName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "propertyAddress": "string",
  "propertySqft": 2100,
  "propertyStories": 2,
  "propertyYearBuilt": 2005,
  "propertyGarageSize": 2,
  "propertyType": "string",
  "priceLow": 1200,
  "priceHigh": 1400,
  "finalPrice": 1300,
  "status": "REVIEWED",
  "createdAt": "datetime",
  "reviewedAt": "datetime",
  "acceptedAt": null,
  "declinedAt": null,
  "expiresAt": "datetime"
}
```

#### PATCH /public/quotes/{quoteId} — Customer accepts or declines

```json
// Request
{ "status": "ACCEPTED" }   // or "DECLINED"
```

```json
// Response
{
  "quoteId": "uuid",
  "finalPrice": 1300,
  "status": "ACCEPTED"
}
```

Errors: 404 if token is invalid/missing, 409 if already used, 410 if expired

---

### Dashboard — /api/v1/company/dashboard

All require the auth_token cookie (sent automatically with credentialed requests). Company is resolved from JWT.

| Method | Path                                         | Description               |
| ------ | -------------------------------------------- | ------------------------- |
| GET    | /company/dashboard/summary                   | Aggregate stats           |
| GET    | /company/dashboard/quotes-to-review          | Quotes pending review     |
| GET    | /company/dashboard/quotes                    | All quotes (paginated)    |
| GET    | /company/dashboard/quotes/{quoteId}          | Single quote detail       |
| PATCH  | /company/dashboard/quotes/{quoteId}/finalize | Set final price           |
| PATCH  | /company/dashboard/quotes/{quoteId}/status   | Update status manually    |
| GET    | /company/dashboard/customers                 | All customers (paginated) |
| GET    | /company/dashboard/customers/{customerId}    | Single customer detail    |

#### GET /company/dashboard/summary

```json
{
  "totalNumOfQuotes": 42,
  "numOfQuotesThirtyDays": 8,
  "numOfQuotesToReview": 3,
  "conversionRate": 0.65,
  "averageFinalPrice": 1350.0
}
```

#### GET /company/dashboard/quotes-to-review

```json
{ "quotes": [ /* QuoteSummary[] */ ] }
```

#### GET /company/dashboard/quotes — Query params: page (0), size (20), sortBy ("createdAt"), direction ("desc")

Returns Page<QuoteSummary> (Spring pageable envelope).

#### GET /company/dashboard/quotes/{quoteId} → QuoteDetails (see models below)

#### PATCH /company/dashboard/quotes/{quoteId}/finalize

```json
// Request
{ "finalPrice": 1300 }
```

```json
// Response — FinalizedQuoteResponse
{ "quoteId": "uuid", "finalPrice": 1300, "status": "REVIEWED" }
```

#### PATCH /company/dashboard/quotes/{quoteId}/status

```json
// Request
{ "status": "REVIEWED" }   // Quote.Status enum
```

```json
// Response
{ "quoteId": "uuid", "finalPrice": 1300, "status": "REVIEWED" }
```

#### GET /company/dashboard/customers — Query params: page (0), size (20), sortBy ("createdAt"), sortDirection ("desc")

Returns Page<CustomerSummary>.

#### GET /company/dashboard/customers/{customerId} → CustomerDetails (see models below)

---

### Settings — /api/v1/company/settings

All require the auth_token cookie (sent automatically with credentialed requests).

| Method | Path                             |
| ------ | -------------------------------- |
| GET    | /company/settings                |
| PUT    | /company/settings/pricing-config |
| PUT    | /company/settings/service-area   |

#### GET /company/settings

```json
{
  "pricingConfig": {
    "baseSqftPrice": 0.11,
    "storyMultiplier": 0.03,
    "minimumPrice": 250,
    "priceRangeBuffer": 50,
    "quoteExpiryDays": 30
  },
  "serviceArea": {
    "serviceRadiusMiles": 25,
    "serviceAreaLatitude": 30.267,
    "serviceAreaLongitude": -97.743
  }
}
```

#### PUT /company/settings/pricing-config

```json
// Request (all fields required, positive values)
{
  "baseSqftPrice": 0.11,        // min 0.01
  "storyMultiplier": 0.03,      // min 0.01
  "minimumPrice": 250,          // min 1
  "priceRangeBuffer": 50,       // min 1
  "quoteExpiryDays": 30         // min 1, max 365
}
// Response: same shape
```

#### PUT /company/settings/service-area

```json
// Request
{
  "serviceRadiusMiles": 25,          // min 1
  "serviceAreaLatitude": 30.267,     // -90 to 90
  "serviceAreaLongitude": -97.743    // -180 to 180
}
// Response: same shape
```

---

## 3. Key Data Models

### QuoteSummary

```json
{
  "id": "uuid",
  "status": "PENDING",
  "customerFirstName": "string",
  "customerLastName": "string",
  "propertyAddress": "string",
  "priceLow": 1200,
  "priceHigh": 1400,
  "finalPrice": null,
  "createdAt": "datetime"
}
```

### QuoteDetails

```json
{
  "id": "uuid",
  "customerFirstName": "string",
  "customerLastName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "propertyAddress": "string",
  "propertySqft": 2100,
  "propertyStories": 2,
  "propertyYearBuilt": 2005,
  "propertyGarageSize": 2,
  "propertyType": "string",
  "priceLow": 1200,
  "priceHigh": 1400,
  "finalPrice": 1300,
  "status": "REVIEWED",
  "createdAt": "datetime",
  "reviewedAt": "datetime",
  "acceptedAt": null,
  "declinedAt": null,
  "expiresAt": "datetime"
}
```

### CustomerSummary

```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "createdAt": "datetime"
}
```

### CustomerDetails

```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "createdAt": "datetime",
  "quotes": [ /* QuoteSummary[] */ ]
}
```

### UserResponse

```json
{
  "firstName": "string",
  "lastName":  "string",
  "email":     "string",
  "role":      "OWNER"        // OWNER | MEMBER
}
```

---

## 4. Enum Values

### Quote.Status

| Value    | Meaning                                                |
| -------- | ------------------------------------------------------ |
| PENDING  | Submitted, not yet reviewed by company                 |
| REVIEWED | Company set a final price; awaiting customer decision  |
| ACCEPTED | Customer accepted the quote                            |
| DECLINED | Customer declined the quote                            |

### User.Role

| Value  |
| ------ |
| OWNER  |
| MEMBER |

---

## 5. Company Slug

- The slug is a path parameter used only on public endpoints: /{slug}/quote-request, /{slug}/quote-request/amend, /{slug}/company-info
- It uniquely identifies the company. The slug is generated at registration from the company name.
- On authenticated (dashboard/settings) endpoints, the company is resolved automatically from the JWT — no slug needed.

---

## 6. Special Endpoints Summary

| Endpoint                                | How to Access               | Purpose                            |
| --------------------------------------- | --------------------------- | ---------------------------------- |
| POST /public/{slug}/quote-request       | No auth, slug in path       | Customer submits quote form        |
| POST /public/{slug}/quote-request/amend | No auth, slug in path       | Customer corrects property data    |
| GET /public/quotes/{quoteId}?token=     | 72hr access via token param | Customer views finalized quote     |
| PATCH /public/quotes/{quoteId}?token=   | One-time token query param  | Customer accepts or declines quote |
| GET /public/{slug}/company-info         | No auth, slug in path       | Load company info on public form   |

The quote token (QuoteToken) is a server-generated token valid for 72hr. It is passed to the customer (via email) and consumed when the customer acts on the quote.
Once usedAt is set, the token is invalid for PATCH, but still valid for GET until expired.
