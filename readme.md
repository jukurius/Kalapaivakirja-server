# Kalapäiväkirja - Backend

Welcome to the backend repository of Kalapäiväkirja, a web application designed for fishermen to log their catches as personal notes or for sharing with other fishermen.

## Overview

Kalapäiväkirja backend serves the frontend application by providing authentication via JWT and managing data storage in a MySQL database. It also handles image uploads to Cloudinary and provides an infinite scroll endpoint for fetching data.

## Features

- **User Authentication**: Secure login using JWT access and refresh tokens.
- **Database Integration**: Connects to a MySQL database using the mysql2 library.
- **Image Uploads**: Uploads images to Cloudinary and stores the image URLs in the MySQL database.
- **Infinite Scroll**: Supports infinite scroll functionality for listing catches.

## JWT Authentication

### How JWT Access and Refresh Tokens Work

1. **Access Token**: After a successful login, the server generates an access token and sends it to the client. The client includes this token in the header of subsequent requests to authenticate and access protected routes. Access tokens have a short lifespan for security reasons.

2. **Refresh Token**: Along with the access token, the server also generates a refresh token, which has a longer lifespan. When the access token expires, the client can send the refresh token to the server to obtain a new access token. This process allows the user to remain authenticated without requiring them to log in again.

## Technology Stack

- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for building RESTful APIs.
- **MySQL**: Relational database for storing application data.
- **mysql2**: Library for connecting Node.js to MySQL databases.
- **Cloudinary**: Cloud-based image and video management service.
