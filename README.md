# Wyxan – Simulated Web Browser

A full-stack simulated web browser that allows multiple users to browse interconnected websites, maintain independent browsing histories, navigate between pages, restore scroll positions, search website content, and publish new websites.

Built as part of the **Full Stack Developer Technical Assessment**.

## Overview

Wyxan provides a simulated browsing environment where users can explore websites stored in a MongoDB database.

Each user maintains an independent browsing history. The application supports browser-style navigation, website search, page-state restoration, and website publishing through an interactive interface.

The project follows a modular backend architecture and separates frontend, backend, and database responsibilities.

## Features

### 1. Multiple Users
- Supports multiple people/authors.
- Each person has an independent browsing history.
- Switch between users using the Browsing As selector.

### 2. Simulated Browser Navigation
- Navigate to websites using the address bar.
- Back and Forward navigation.
- Maintains browsing history for each user.
- Handles forward-history truncation when navigating to a new page after going back.

### 3. Scroll Position Restoration
- Captures the current page's scroll position.
- Saves scroll state through the backend.
- Restores the previous scroll position when returning to a page.

### 4. Website Search
- Search websites using keywords.
- Searches website titles and HTML content.
- Displays matching website results.

### 5. Website Publishing
- Publish new websites through the application.
- Provide a website title, address, and HTML content.
- Associate published websites with an author.
- Sanitizes HTML content on the backend using `sanitize-html`.

### 6. Seed Data
- Includes interconnected sample websites.
- Provides sample people/authors.
- Supports initial database population through a seed script.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | NestJS, Node.js, TypeScript |
| Database | MongoDB |
| ODM | Mongoose |
| Validation | class-validator |
| HTML Sanitization | sanitize-html |
| API Communication | REST API |

## Project Structure

```text
wxyan/
│
├── backend/
│   ├── src/
│   │   ├── people/          # People management
│   │   ├── sites/            # Website management and publishing
│   │   ├── visits/           # Browsing history and navigation
│   │   ├── search/           # Website content search
│   │   ├── seed/             # Database seed functionality
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx      # Main browser interface
│   │       ├── layout.tsx
│   │       └── globals.css
│   │
│   ├── .env.local.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Make sure the following are installed:

- Node.js and npm
- MongoDB Community Server
- Git

MongoDB should be running before starting the backend.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammad-Musa3344/wxyan.git

cd wxyan
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory using `.env.example`.

Backend environment configuration:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/wxyan
```

### 3. Frontend Setup

Open another terminal from the project root:

```bash
cd frontend
npm install
```

Create `.env.local` inside the `frontend` directory using `.env.local.example`.

Frontend environment configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Running the Application

Make sure MongoDB is running.

### Terminal 1 – Start Backend

```bash
cd backend
npm run start:dev
```

Backend API:

`http://localhost:4000/api`

### Terminal 2 – Start Frontend

```bash
cd frontend
npm run dev
```

Frontend application:

`http://localhost:3000`

Open the frontend URL in your browser to use Wyxan.

## Database Seeding

To populate the database with the sample people and interconnected websites, run the seed script.

From the project root:

```bash
cd backend
npm run seed
```

Run the seed command when setting up the application for the first time or when you need to initialize the sample data.

## API Endpoints

All backend endpoints use the `/api` prefix.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/people` | Retrieve all people |
| POST | `/api/people` | Create a person |
| GET | `/api/people/:id` | Retrieve a person |
| GET | `/api/sites` | Retrieve websites |
| POST | `/api/sites` | Publish a website |
| GET | `/api/visits/:personId` | Retrieve browsing history |
| POST | `/api/visits/:personId/navigate` | Navigate to a website |
| POST | `/api/visits/:personId/back` | Navigate backward |
| POST | `/api/visits/:personId/forward` | Navigate forward |
| POST | `/api/visits/:personId/state` | Save page state |
| GET | `/api/search?q=keyword` | Search website content |

## Application Architecture

The application consists of three main components:

**Frontend – Next.js**

Provides the browser interface, user selection, address bar, navigation controls, website rendering, search, and publishing form.

**Backend – NestJS**

Exposes REST APIs and handles people management, website management, browsing history, navigation, search, and HTML sanitization.

**Database – MongoDB**

Stores people, websites, and browsing history using Mongoose models.

The frontend communicates with the backend through REST APIs, while the backend handles database operations.

## Author

**Muhammad Musa**

- GitHub: [Muhammad-Musa3344](https://github.com/Muhammad-Musa3344)
- Project Repository: [Wyxan – Simulated Web Browser](https://github.com/Muhammad-Musa3344/wxyan)

---

**Developed as part of the Wyxan Full Stack Developer Technical Assessment.**