# REST API Documentation

## Overview

This document describes all REST API endpoints available in the nest-dictionaries application. All authenticated endpoints require a valid JWT token in the Authorization header.

**Base URL**: Your application base URL with `/api` prefix (e.g., `http://localhost:4200/api`)

**Note**: All endpoints are prefixed with `/api` except for legal pages (`/privacy-policy` and `/data-deletion-instructions`)

**Authentication**: Bearer token in the Authorization header

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)

---

## Authentication

### Google OAuth Login

Initiate Google OAuth authentication flow.

**Endpoint**: `GET /api/auth/google`

**Authentication**: None

**Response**: Redirects to Google OAuth consent screen

---

### Google OAuth Callback

Handles Google OAuth callback after user authentication.

**Endpoint**: `GET /api/auth/google/callback`

**Authentication**: None (OAuth flow)

**Response**: Redirects with token and optional userId

**Success Response**:

- Redirects to verification URL with query parameters:
  - `token`: JWT token
  - `userId`: User ID (if existing user)

**Error Response**:

- **401 Unauthorized**: Failed to authenticate with provider
- **400 Bad Request**: Invalid profile information
- Redirect to error URL if user already exists with different provider

---

### GitHub OAuth Login

Initiate GitHub OAuth authentication flow.

**Endpoint**: `GET /api/auth/github`

**Authentication**: None

**Response**: Redirects to GitHub OAuth consent screen

---

### GitHub OAuth Callback

Handles GitHub OAuth callback after user authentication.

**Endpoint**: `GET /api/auth/github/callback`

**Authentication**: None (OAuth flow)

**Response**: Redirects with token and optional userId

**Success Response**:

- Redirects to verification URL with query parameters:
  - `token`: JWT token
  - `userId`: User ID (if existing user)

**Error Response**:

- **401 Unauthorized**: Failed to authenticate with provider
- **400 Bad Request**: Invalid profile information
- Redirect to error URL if user already exists with different provider

---

## Users

### Get User Profile

Get user information by ID.

**Endpoint**: `GET /api/user/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): User ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "email": "user@example.com",
  "provider": "GOOGLE",
  "sourceId": "google-user-id",
  "displayName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://example.com/photo.jpg",
  "role": "USER",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated or accessing another user's profile
- **404 Not Found**: User not found

---

### Update User Profile

Update user information.

**Endpoint**: `PUT /api/user/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): User ID

**Request Body**:

```
{
  "displayName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://example.com/photo.jpg",
  "email": "newemail@example.com"
}
```

All fields are optional.

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "email": "newemail@example.com",
  "provider": "GOOGLE",
  "sourceId": "google-user-id",
  "displayName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://example.com/photo.jpg",
  "role": "USER",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T11:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated or updating another user's profile
- **404 Not Found**: User not found
- **400 Bad Request**: Invalid data format
