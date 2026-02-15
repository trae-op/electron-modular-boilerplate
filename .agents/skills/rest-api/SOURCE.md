# REST API Documentation

## Overview

This document describes all REST API endpoints available in the nest-dictionaries application. All authenticated endpoints require a valid JWT token in the Authorization header.

**Base URL**: Your application base URL with `/api` prefix (e.g., `http://localhost:4200/api`)

**Note**: All endpoints are prefixed with `/api` except for legal pages (`/privacy-policy` and `/data-deletion-instructions`)

**Authentication**: Bearer token in the Authorization header

## ID Types

- All resources use UUID strings (e.g., `"3fa85f64-5717-4562-b3fc-2c963f66afa6"`).

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Dictionaries](#dictionaries)
4. [Words](#words)
5. [Groups](#groups)
6. [Sentences](#sentences)
7. [Statistics Learning](#statistics-learning)
8. [Legal](#legal)

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

---

## Dictionaries

### Create Dictionary

Create a new dictionary for the authenticated user.

**Endpoint**: `POST /api/dictionaries`

**Authentication**: Required (JWT)

**Request Body**:

```
{
  "name": "My English Dictionary",
  "image": "https://example.com/image.jpg"
}
```

**Fields**:

- `name` (string, required): Dictionary name
- `image` (string, optional): Dictionary image URL

**Success Response** (201 Created):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My English Dictionary",
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

**Notes**:

- `recentLearning` includes the 10 most recent sessions
- **409 Conflict**: Dictionary with the same name already exists
- **400 Bad Request**: Invalid data format

---

### Get All Dictionaries

Get all dictionaries for the authenticated user.

**Endpoint**: `GET /api/dictionaries`

**Authentication**: Required (JWT)

**Success Response** (200 OK):

```
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "My English Dictionary",
    "image": "https://example.com/image.jpg",
    "words": [
      {
        "id": "uuid",
        "category": "WORDS",
        "text": "hello",
        "translation": "hola",
        "associatedImageName": null,
        "authorName": null,
        "authorEmail": null,
        "createdAt": "2026-01-28T10:05:00.000Z",
        "updatedAt": "2026-01-28T10:05:00.000Z"
      }
    ],
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "My Spanish Dictionary",
    "image": null,
    "words": [],
    "createdAt": "2026-01-28T11:00:00.000Z",
    "updatedAt": "2026-01-28T11:00:00.000Z"
  }
]
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

---

### Get Dictionary by ID

Get a specific dictionary with its words (limited fields).

**Endpoint**: `GET /api/dictionaries/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Dictionary ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My English Dictionary",
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z",
  "words": [
    {
      "id": "uuid",
      "text": "hello",
        "translation": "hola",
        "category": "WORDS"
    }
  ]
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Dictionary not found

**Notes**:

- The `words` array contains only `id`, `text`, `translation`, and `category`

**Notes**:

- Deleting a dictionary removes only the dictionary and its associations
- Words remain in the system if they belong to other dictionaries

---

### Update Dictionary

Update an existing dictionary.

**Endpoint**: `PUT /api/dictionaries/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Dictionary ID

**Request Body**:

```
{
  "name": "Updated Dictionary Name",
  "image": "https://example.com/new-image.jpg"
}
```

All fields are optional.

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Updated Dictionary Name",
  "image": "https://example.com/new-image.jpg",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Dictionary not found
- **409 Conflict**: Dictionary with the new name already exists
- **400 Bad Request**: Invalid data format

---

### Add Words to Dictionary

Add existing words to a dictionary.

**Endpoint**: `POST /api/dictionaries/:id/words`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Dictionary ID

**Request Body**:

```
{
  "wordIds": [
    "uuid-of-word-1",
    "uuid-of-word-2",
    "uuid-of-word-3"
  ]
}
```

**Fields**:

- `wordIds` (array of strings, required): Array of word IDs (UUIDs) to add to the dictionary

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My English Dictionary",
  "image": "https://example.com/image.jpg",
  "words": [
    {
      "id": "uuid",
      "category": "WORDS",
      "text": "hello",
      "translation": "hola",
      "associatedImageName": null,
      "authorName": null,
      "authorEmail": null,
      "createdAt": "2026-01-28T10:00:00.000Z",
      "updatedAt": "2026-01-28T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "category": "IDIOMS",
      "text": "break the ice",
      "translation": "romper el hielo",
      "associatedImageName": "ice.jpg",
      "authorName": null,
      "authorEmail": null,
      "createdAt": "2026-01-28T11:00:00.000Z",
      "updatedAt": "2026-01-28T11:00:00.000Z"
    }
  ],
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Dictionary not found
- **400 Bad Request**: Invalid data format or empty wordIds array

**Notes**:

- Adds one or more existing words to the dictionary
- Words can belong to multiple dictionaries simultaneously
- Returns the updated dictionary with all associated words
- Duplicate word IDs are handled gracefully (Prisma `connect` operation skips already associated words)

---

### Delete Word from Dictionary

Delete a word from a dictionary without deleting the word itself from the database.

**Endpoint**: `DELETE /api/dictionaries/:id/words/:wordId`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Dictionary ID
- `wordId` (string, UUID): Word ID to remove from the dictionary

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My English Dictionary",
  "image": "https://example.com/image.jpg",
  "words": [
    {
      "id": "uuid",
      "category": "IDIOMS",
      "text": "break the ice",
      "translation": "romper el hielo",
      "associatedImageName": "ice.jpg",
      "authorName": null,
      "authorEmail": null,
      "createdAt": "2026-01-28T11:00:00.000Z",
      "updatedAt": "2026-01-28T11:00:00.000Z"
    }
  ],
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T12:30:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Dictionary not found
- **400 Bad Request**: Invalid data format

**Notes**:

- Removes the association between the word and the dictionary
- The word itself is NOT deleted from the database
- If the word belongs to other dictionaries, it remains accessible through those dictionaries
- Returns the updated dictionary with remaining words

---

### Delete Dictionary

Delete an existing dictionary.

**Endpoint**: `DELETE /api/dictionaries/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Dictionary ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My English Dictionary",
  "image": "https://example.com/image.jpg",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Dictionary not found

---

## Words

All word endpoints require authentication. Words can belong to multiple dictionaries and groups.

### Create Word

Create a new word.

**Endpoint**: `POST /api/words`

**Authentication**: Required (JWT)

**Request Body**:

```
{
  "category": "WORDS",
  "text": "hello",
  "translation": "hola",
  "associatedImageName": "hello.jpg",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "dictionaryIds": ["uuid-1", "uuid-2"],
  "groupIds": ["uuid-3", "uuid-4"]
}
```

**Fields**:

- `category` (enum, required): Word category - `WORDS`, `IDIOMS`, or `IRREGULAR_VERBS`
- `text` (string, required): The word or phrase
- `translation` (string, required): Translation of the word
- `associatedImageName` (string, optional): Image filename associated with the word
- `authorName` (string, optional): Author's name
- `authorEmail` (string, optional): Author's email
- `dictionaryIds` (array of strings, optional): Array of dictionary IDs (UUIDs) to associate the word with
- `groupIds` (array of strings, optional): Array of group IDs (UUIDs) to associate the word with

**Notes**:

- To associate a newly created word with a dictionary, include the dictionary ID in `dictionaryIds`.
- Alternatively, create the word first and then use **Add Words to Dictionary**.

**Success Response** (201 Created):

```
{
  "id": "uuid",
  "category": "WORDS",
  "text": "hello",
  "translation": "hola",
  "associatedImageName": "hello.jpg",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: One or more groups not found
- **400 Bad Request**: Invalid data format

---

### Get All Words

Get all words in the system.

**Endpoint**: `GET /api/words`

**Authentication**: Required (JWT)

**Success Response** (200 OK):

```
[
  {
    "id": "uuid",
    "category": "WORDS",
    "text": "hello",
    "translation": "hola",
    "associatedImageName": null,
    "authorName": null,
    "authorEmail": null,
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "category": "IDIOMS",
    "text": "break the ice",
    "translation": "romper el hielo",
    "associatedImageName": "ice.jpg",
    "authorName": null,
    "authorEmail": null,
    "createdAt": "2026-01-28T11:00:00.000Z",
    "updatedAt": "2026-01-28T11:00:00.000Z"
  }
]
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

---

### Get Word by ID

Get a specific word.

**Endpoint**: `GET /api/words/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Word ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "category": "WORDS",
  "text": "hello",
  "translation": "hola",
  "associatedImageName": null,
  "authorName": null,
  "authorEmail": null,
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Word not found

---

### Update Word

Update an existing word.

**Endpoint**: `PUT /api/words/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Word ID

**Request Body**:

```
{
  "category": "IDIOMS",
  "text": "hello world",
  "translation": "hola mundo",
  "associatedImageName": "world.jpg",
  "authorName": "Jane Doe",
  "authorEmail": "jane@example.com",
  "groupIds": ["uuid-1", "uuid-2"]
}
```

All fields are optional.

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "category": "IDIOMS",
  "text": "hello world",
  "translation": "hola mundo",
  "associatedImageName": "world.jpg",
  "authorName": "Jane Doe",
  "authorEmail": "jane@example.com",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated or attempting to update a word not owned by the user
- **404 Not Found**: Word not found
- **400 Bad Request**: Invalid data format

**Notes**:

- Users can only update words that belong to at least one of their own dictionaries
- The ownership check verifies that the word is linked to at least one dictionary owned by the authenticated user
- `groupIds` field replaces all existing group associations with the new ones

---

### Delete Word

Delete a word permanently.

**Endpoint**: `DELETE /api/words/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Word ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "category": "WORDS",
  "text": "hello",
  "translation": "hola",
  "associatedImageName": null,
  "authorName": null,
  "authorEmail": null,
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated or attempting to delete a word not owned by the user
- **404 Not Found**: Word not found

**Notes**:

- Users can only delete words that belong to at least one of their own dictionaries
- The ownership check verifies that the word is linked to at least one dictionary owned by the authenticated user
- Deleting a word removes it permanently from the database and all associated dictionaries and groups

---

## Groups

### Create Group

Create a new group for the authenticated user.

**Endpoint**: `POST /api/groups`

**Authentication**: Required (JWT)

**Request Body**:

```
{
  "name": "My Study Group"
}
```

**Fields**:

- `name` (string, required): Group name

**Success Response** (201 Created):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My Study Group",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **409 Conflict**: Group with the same name already exists
- **400 Bad Request**: Invalid data format

---

### Get All Groups

Get all groups for the authenticated user.

**Endpoint**: `GET /api/groups`

**Authentication**: Required (JWT)

**Success Response** (200 OK):

```
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "My Study Group",
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Advanced English",
    "createdAt": "2026-01-28T11:00:00.000Z",
    "updatedAt": "2026-01-28T11:00:00.000Z"
  }
]
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

---

### Get Group by ID

Get a specific group.

**Endpoint**: `GET /api/groups/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Group ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My Study Group",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Group not found

---

### Update Group

Update an existing group.

**Endpoint**: `PUT /api/groups/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Group ID

**Request Body**:

```
{
  "name": "Updated Group Name"
}
```

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Updated Group Name",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Group not found
- **409 Conflict**: Group with the new name already exists
- **400 Bad Request**: Invalid data format

---

### Delete Group

Delete an existing group.

**Endpoint**: `DELETE /api/groups/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Group ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "My Study Group",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Group not found

---

### Get Words by Group ID

Get all words associated with a specific group.

**Endpoint**: `GET /api/groups/:id/words`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Group ID

**Success Response** (200 OK):

```
[
  {
    "id": "uuid",
    "category": "WORDS",
    "text": "hello",
    "translation": "hola",
    "associatedImageName": null,
    "authorName": "John Doe",
    "authorEmail": "john@example.com",
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "category": "IDIOMS",
    "text": "break the ice",
    "translation": "romper el hielo",
    "associatedImageName": null,
    "authorName": "Jane Smith",
    "authorEmail": "jane@example.com",
    "createdAt": "2026-01-28T11:00:00.000Z",
    "updatedAt": "2026-01-28T11:00:00.000Z"
  }
]
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Group not found

**Notes**:

- Returns all words that have been assigned to the specified group
- Words can belong to multiple groups simultaneously
- Empty array is returned if the group has no associated words
- Words are ordered by creation date (newest first)

---

## Sentences

### Create Sentence

Create example sentences for a word or item.

**Endpoint**: `POST /api/sentences`

**Authentication**: Required (JWT)

**Request Body**:

```
{
  "itemId": "uuid",
  "values": "Hello, how are you? | Nice to meet you.",
  "category": "WORDS"
}
```

**Fields**:

- `itemId` (string, UUID, required): ID of the associated word/item
- `values` (string, required): Sentence examples (can be separated by delimiter)
- `category` (enum, optional): Sentence category - `WORDS`, `IDIOMS`, or `IRREGULAR_VERBS` (defaults to `WORDS`)

**Success Response** (201 Created):

```
{
  "id": "uuid",
  "itemId": "uuid",
  "values": "Hello, how are you? | Nice to meet you.",
  "category": "WORDS",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **400 Bad Request**: Invalid data format

---

### Get Sentences by Item ID

Get all sentences for a specific word.

**Endpoint**: `GET /api/sentences/item/:itemId`

**Authentication**: Required (JWT)

**URL Parameters**:

- `itemId` (string, UUID): Item/Word ID

**Success Response** (200 OK):

```
[
  {
    "id": "uuid",
    "itemId": "uuid",
    "values": "Hello, how are you? | Nice to meet you.",
    "category": "WORDS",
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "itemId": "uuid",
    "values": "Hello everyone!",
    "category": "WORDS",
    "createdAt": "2026-01-28T11:00:00.000Z",
    "updatedAt": "2026-01-28T11:00:00.000Z"
  }
]
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

**Notes**:

- `itemId` refers to the word ID for which you want to retrieve example sentences
- Returns all sentences associated with the specified word
- Sentences are ordered by creation date (newest first)
- Empty array is returned if the word has no example sentences

---

### Get Sentence by ID

Get a specific sentence.

**Endpoint**: `GET /api/sentences/:id/item/:itemId`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Sentence ID
- `itemId` (string, UUID): Item/Word ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "itemId": "uuid",
  "values": "Hello, how are you? | Nice to meet you.",
  "category": "WORDS",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Sentence not found

---

### Update Sentence

Update an existing sentence.

**Endpoint**: `PUT /api/sentences/:id/item/:itemId`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Sentence ID
- `itemId` (string, UUID): Item/Word ID

**Request Body**:

```
{
  "values": "Updated sentence examples.",
  "category": "WORDS"
}
```

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "itemId": "uuid",
  "values": "Updated sentence examples.",
  "category": "WORDS",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Sentence not found
- **400 Bad Request**: Invalid data format

---

### Delete Sentence

Delete a sentence.

**Endpoint**: `DELETE /api/sentences/:id/item/:itemId`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Sentence ID
- `itemId` (string, UUID): Item/Word ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "itemId": "uuid",
  "values": "Hello, how are you? | Nice to meet you.",
  "category": "WORDS",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Sentence not found

---

## Statistics Learning

Track and analyze learning progress for words/items.

### Create Learning Statistic

Record a learning session for an item.

**Endpoint**: `POST /api/statistic-learning`

**Authentication**: Required (JWT)

**Request Body**:
Word

```
{
  "itemId": "uuid",
  "dateLearning": "2026-01-28T10:00:00.000Z"
}
```

**Fields**:

- `itemId` (string, UUID, required): ID of the word/item learned
- `dateLearning` (string, ISO date, optional): Date of learning session (defaults to now)

**Success Response** (201 Created):

```
{
  "id": "uuid",
  "userId": "uuid",
  "itemId": "uuid",
  "dateLearning": "2026-01-28T10:00:00.000Z",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **400 Bad Request**: Invalid data format

---

### Get All Learning Statistics

Get all learning statistics for the authenticated user.

**Endpoint**: `GET /api/statistic-learning`

**Authentication**: Required (JWT)

**Success Response** (200 OK):

```
[
  {
    "id": "uuid",
    "userId": "uuid",
    "itemId": "uuid",
    "dateLearning": "2026-01-28T10:00:00.000Z",
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "itemId": "uuid",
    "dateLearning": "2026-01-28T11:00:00.000Z",
    "createdAt": "2026-01-28T11:00:00.000Z",
    "updatedAt": "2026-01-28T11:00:00.000Z"
  }
]
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

---

### Get Learning Summary

Get aggregated learning statistics summary for the authenticated user.

**Endpoint**: `GET /api/statistic-learning/summary`

**Authentication**: Required (JWT)

**Success Response** (200 OK):

```
{
  "totalItemsLearned": 45,
  "totalSessions": 150,
  "recentLearning": [
    {
      "itemId": "uuid",
      "dateLearning": "2026-01-28T10:00:00.000Z"
    }
  ]
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

---

### Get Learning Statistics by Item ID

Get all learning statistics for a specific item.

**Endpoint**: `GET /api/statistic-learning/item/:itemId`

**Authentication**: Required (JWT)

**URL Parameters**:

- `itemId` (string, UUID): Item/Word ID

**Success Response** (200 OK):

```
[
  {
    "id": "uuid",
    "userId": "uuid",
    "itemId": "uuid",
    "dateLearning": "2026-01-28T10:00:00.000Z",
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "itemId": "uuid",
    "dateLearning": "2026-01-29T15:00:00.000Z",
    "createdAt": "2026-01-29T15:00:00.000Z",
    "updatedAt": "2026-01-29T15:00:00.000Z"
  }
]
```

**Error Response**:

- **401 Unauthorized**: User not authenticated

---

### Get Learning Statistic by ID

Get a specific learning statistic record.

**Endpoint**: `GET /api/statistic-learning/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Statistic record ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "itemId": "uuid",
  "dateLearning": "2026-01-28T10:00:00.000Z",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Statistic record not found

---

### Delete Learning Statistic

Delete a learning statistic record.

**Endpoint**: `DELETE /api/statistic-learning/:id`

**Authentication**: Required (JWT)

**URL Parameters**:

- `id` (string, UUID): Statistic record ID

**Success Response** (200 OK):

```
{
  "id": "uuid",
  "userId": "uuid",
  "itemId": "uuid",
  "dateLearning": "2026-01-28T10:00:00.000Z",
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T10:00:00.000Z"
}
```

**Error Response**:

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Statistic record not found

---

## Legal

### Privacy Policy

Get the privacy policy HTML page.

**Endpoint**: `GET /privacy-policy`

**Authentication**: None

**Success Response** (200 OK):

- Content-Type: `text/html; charset=utf-8`
- Returns HTML page with privacy policy information

---

### Data Deletion Instructions

Get data deletion instructions HTML page.

**Endpoint**: `GET /data-deletion-instructions`

**Authentication**: None

**Success Response** (200 OK):

- Content-Type: `text/html; charset=utf-8`
- Returns HTML page with data deletion instructions

---

## Common Error Responses

### 400 Bad Request

```
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

### 404 Not Found

```
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 409 Conflict

```
{
  "statusCode": 409,
  "message": "Resource already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error

```
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Data Types Reference

### User

```
{
  id: string(UUID);
  email: string | null;
  provider: 'GOOGLE' | 'GITHUB' | null;
  sourceId: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
  role: 'USER' | 'ADMIN' | 'SUB_ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
```

### Dictionary

```
{
  id: string(UUID);
  userId: string(UUID);
  name: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Word

```
{
  id: string(UUID);
  category: 'WORDS' | 'IDIOMS' | 'IRREGULAR_VERBS';
  text: string;
  translation: string;
  associatedImageName: string | null;
  authorName: string | null;
  authorEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Group

```
{
  id: string(UUID);
  userId: string(UUID);
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Sentence

```
{
  id: string(UUID);
  itemId: string(UUID);
  values: string;
  category: Categories;
  createdAt: Date;
  updatedAt: Date;
}
```

### StatisticLearning

```
{
  id: string(UUID);
  userId: string(UUID);
  itemId: string(UUID);
  dateLearning: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Usage Examples

### Example: Complete User Flow

#### 1. Authenticate with Google

```
# Browser navigation
GET /api/auth/google
# User completes OAuth flow
# Redirected to callback with token
```

#### 2. Get User Profile

```
curl -X GET \
  http://localhost:4200/api/user/uuid-here \
  -H 'Authorization: Bearer your-jwt-token'
```

#### 3. Create a Dictionary

```
curl -X POST \
  http://localhost:4200/api/dictionaries \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My English Dictionary",
    "image": "https://example.com/image.jpg"
  }'
```

#### 4. Add Words to Dictionary

```
curl -X POST \
  http://localhost:4200/api/dictionaries/uuid/words \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "wordIds": ["uuid-1", "uuid-2"]
  }'
```

#### 5. Track Learning

```
curl -X POST \
  http://localhost:4200/api/statistic-learning \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "itemId": "uuid"
  }'
```

#### 6. Get Learning Summary

```
curl -X GET \
  http://localhost:4200/api/statistic-learning/summary \
  -H 'Authorization: Bearer your-jwt-token'
```

---

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all resource IDs
- Authentication is required for all endpoints except OAuth flows and legal pages
- Users can only access and modify their own resources
- Cascade deletion is applied: deleting a user deletes all associated data; deleting a dictionary removes its word links but does not delete words that are linked to other dictionaries
- Unique constraints:
  - User email (if provided)
  - User provider + sourceId combination
  - Dictionary name per user
  - Group name per user
