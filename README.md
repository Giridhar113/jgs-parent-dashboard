# JGS Parent Dashboard

Parent dashboard for the JGS College Website Management System.

This repository contains only the parent-facing frontend used by guardians to track child progress, attendance, marks, fee receipts, notifications, PTM bookings, complaints, notices, and teacher communication.

## Project Scope

This repo is only for the parent dashboard.

It does not include:

- Public website
- Admin dashboard
- Teacher dashboard
- Student dashboard
- Shared backend API source code
- MongoDB credentials
- Local `.env` files

## Main Features

- Parent login
- Parent dashboard overview
- Child attendance view
- Child marks and progress view
- Fee history and receipt download
- Real-time notification polling
- PTM booking
- Child performance comparison
- Complaint and feedback form
- Parent-teacher messages
- Notices and events

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js
- jsPDF

## Backend API

This dashboard connects to the shared backend API:

```text
jgs-shared-backend
```

Set the deployed backend URL in the dashboard config before production deployment.

## Deployment

This dashboard can be deployed on GitHub Pages, Vercel, Netlify, or any static hosting platform.

Recommended static deployment settings:

```text
Framework Preset: Other / Static
Build Command: None
Output Directory: .
```

## Entry Page

```text
index.html -> parent-login.html
```

## Version

Current release: `v1.4`
