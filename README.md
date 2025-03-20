# Taxibee Fleet Management System Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Admin Portal](#admin-portal)
4. [Driver Portal](#driver-portal)
5. [Common Features](#common-features)

## Introduction

Taxibee is a comprehensive taxi fleet management system designed to streamline operations for taxi companies. The platform offers powerful analytics, real-time tracking, and separate interfaces for both administrators and drivers. This documentation will guide you through the features and functionality of the Taxibee platform.

Think of Taxibee as your company's command center - administrators can monitor the entire fleet's performance from a bird's-eye view, while drivers have their own personalized dashboard to track earnings and ride history.

## Getting Started

### Logging In

1. Navigate to the login page
2. Enter your username and password
3. Select your role (Admin or Driver)
4. Click "Sign In"

If you've forgotten your password or are having trouble logging in, please contact your system administrator.

## Admin Portal

The admin portal provides comprehensive tools for managing your taxi fleet, analyzing performance, and monitoring operations in real-time.

### Dashboard

The dashboard is your central hub for monitoring fleet performance at a glance. It displays key metrics and analytics including:

**Weekly Summary Cards:**
- Total Revenue: Overall earnings for the selected period
- Total Orders: Number of rides completed
- Total Distance: Combined distance traveled by all drivers
- Average Revenue Per Order: Mean earnings per trip

**Analytics Charts:**
- Revenue Trend: Visualizes earnings over time
- Daily Orders: Shows order volume patterns throughout the week
- Average Order Value: Displays pricing trends across different days

**Payment Method Distribution:**
- Visual breakdown of revenue by payment method (cash, card, etc.)
- Percentage and amount for each payment type

**Top Performing Drivers:**
- List of highest-earning drivers
- Revenue figures and percentage of total fleet revenue

Think of the dashboard as your fleet's vital signs monitor - you can quickly assess the health of your operation and identify trends that require attention.

### Orders

The Orders page provides a comprehensive view of all rides in your system.

**Features:**
- Sortable and searchable table of all orders
- Filter by date, driver, or status
- Detailed information for each order including:
  - Reference number
  - Creation date
  - Driver assignment
  - Pickup location
  - Price
  - Payment method
  - Status

**Order Details:**
Clicking on an order provides expanded information:
- Basic Information (reference, status, timestamps)
- Location Information (pickup address, distance)
- Payment Information (total price, fees, tips, driver commission)
- Trip Timeline (created, accepted, pickup, dropoff, finished)

### Live Status

The Live Status page allows you to monitor your drivers in real-time.

**Features:**
- Status summary cards showing:
  - Total active drivers
  - Drivers waiting for orders
  - Drivers with active orders
  - Drivers with unknown status

- Live driver table with:
  - Driver name and contact information
  - Current status (waiting orders, has order, etc.)
  - Status duration
  - Quick actions (call driver)

- Auto-refresh settings to keep information current
- Option to update driver table with latest information

### Drivers

The Drivers page helps you manage your driver workforce.

**Features:**
- Searchable list of all drivers
- Active/Inactive status indicators
- Filters for status and employment type
- Driver profile information including:
  - Personal details (name, phone, email)
  - System information (ID numbers, status)
  - Order history and performance

**Driver Details:**
Selecting a driver displays their complete profile:
- Personal Information
  - Full name
  - Phone number
  - Email address
  - Chauffeurs card number

- System Information
  - Taxibee ID
  - Bolt Driver UUID
  - Status
  - Terminal assignment
  - EXACT debnr (accounting reference)
  - myPOS operator code

- Order History
  - Table of all orders assigned to this driver
  - Order details (date, price, status)
  - Pagination for viewing older orders

### Transactions

The Transactions page helps you track and manage payment transactions.

**Features:**
- Multiple views:
  - By Weekday: Analyze transaction patterns across different days
  - By Terminal: Track transactions by payment terminal
  - Unaccounted Transactions: Identify transactions without proper driver assignment

- Detailed transaction information:
  - Reference numbers
  - Dates and times
  - Terminal names
  - Transaction amounts
  - Driver assignments

- Ability to assign drivers to unaccounted transactions
- Weekly summary with total transaction counts and amounts

### EXACT File

The EXACT File page helps you export accounting information for integration with EXACT accounting software.

**Features:**
- Export CSV files with transaction data
- Filter by week number and year
- View Exact Debnr assignments for drivers
- Review financial summaries including:
  - Ride price sums
  - Commission amounts
  - Tips received
  - Terminal values

### Contacts

The Contacts page provides a directory of important contacts.

**Features:**
- Filter contacts by category (drivers, developers)
- View contact details (name, email, phone)
- Quick action buttons for:
  - Initiating phone calls
  - Sending emails
  - Opening WhatsApp chats

## Driver Portal

The driver portal gives drivers access to their personal performance metrics, earnings data, and order history.

### Dashboard

The driver dashboard provides a personal overview of performance and earnings.

**Features:**
- Welcome card with period selection (today, this week, this month)
- Summary cards showing:
  - Total Earnings
  - Total Rides
  - Total Distance
  - Total Time
  
- Performance metrics:
  - Average Earnings per Ride
  - Average Distance per Ride
  - Average Time per Ride
  - Average Earnings per km
  
- Recent Orders list with:
  - Order amounts
  - Pickup locations
  - Timestamps
  - Payment methods

Think of the dashboard as your personal scorecard - it gives you a clear picture of your performance and helps you track your earnings over time.

### Orders

The Orders page provides a complete history of your rides.

**Features:**
- Filter orders by period (today, yesterday, this week, this month)
- Detailed order information:
  - Date and time
  - Pickup location
  - Distance
  - Price (including tips)
  - Payment method
  - Status

**Order Details:**
Clicking on an order reveals comprehensive information:
- Basic Information (reference, timestamps, vehicle)
- Location Information (pickup address, distance)
- Payment Information (price breakdown, tips, commission, net earnings)
- Trip Timeline (created, accepted, pickup, dropoff, finished)

### Contacts

The Contacts page provides access to important company contacts.

**Features:**
- List of company contacts
- Contact details (name, email, phone)
- Quick action buttons for:
  - Initiating phone calls
  - Sending emails
  - Opening WhatsApp chats

## Common Features

### Profile Management

Both admins and drivers can access their profile page to view account information and change passwords.

**Features:**
- Profile Information
  - Username
  - Name
  - Role
  - System IDs
  
- Security Settings
  - Password update functionality

### Language Settings

Taxibee supports multiple languages. Users can switch between languages using the language switcher in the top-right corner of the application.

**Currently supported languages:**
- English
- Dutch (Beta)

---

This documentation provides an overview of the Taxibee fleet management system. For specific questions or technical support, please contact your system administrator or the support team.