# Backend Developer Intern - VRV Security

## Role-Based Access Control (RBAC) for Secure Vulnerability Management System

A system where users can manage, assign, and resolve vulnerabilities detected in their organization.

## Overview

This is a backend application developed to demonstrate **Role-Based Access Control (RBAC)**. It is designed to impart security for company like VRV Security with four roles: **Admin**, **Security Analyst**, **Responder** and **Auditor**. Each role has different access permissions to the available services. When users register themselves into the system, the role by default they get is of **Auditor**.

## List of services

- **Create User**
- **Get all vulnerabilities**
- **Add new vulnerabilities**
- **Assign vulnerabilities**
- **Update vulnerabilities status**
- **View resolved vulnerabilities**

## Features

- **Authentication**: Users are authenticated when they try login in the system.
- **Authorization**: JWT (Json Web Token) are used to authorize access to different sets of services for different roles.
- **Roles**:
  - **Admin**: Admin has access to all the services.
  - **Security Analyst**: Security Analyst has access to **Add new vulnerabilities**, **Assign vulnerabilities**, **Update vulnerabilities status** and **View resolved vulnerabilities**.
  - **Responder**: Responder has access to **Update vulnerabilities status** and **View resolved vulnerabilities**.
  - **Auditor**: Auditor has access to only **View resolved vulnerabilities**.
- **Admin**:
  - **Admin** is only allowed to create users (**Security Analyst**, **Responder** and **Auditor**).
  - **Security Analyst** and **Responder** are created by **Admin** only. No direct registration for them.
  - When a new user registers, the role **Auditor** is assigned.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Password Hashing**: bcrypt
- **Authorization**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Backend APIs Postman collection
You can access the API collection : [**Link**](https://drive.google.com/drive/folders/1bb9ePxwhnBly889Hh5iSAh0y7e88wPIu?usp=sharing)

## Live Demo
You can access the frontend application : [**Link**](https://vrv-backend-assignment-client-side.vercel.app/)
