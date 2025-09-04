# 🎫 Helpdesk Management System

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/REST_API-02569B?style=for-the-badge&logo=postman&logoColor=white" alt="REST API">
</div>

---

## 📦 Project Structure

```
HelpdeskManagementSystem/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── controllers/
│   │   └── TicketController.js
│   ├── models/
│   │   └── Ticket.js
│   └── routes/
│       └── TicketRoutes.js
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html ...
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── components/
│           └── HelpDesk/
│               ├── admin/
│               │   └── AdminDashboard.js ...
│               └── user/
│                   └── TicketDashboard.js ...
```

---

## 🚀 Getting Started

### Backend

#### Prerequisites

- Node.js (v14+)
- MongoDB (running locally or remotely)
- npm

#### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and configure your environment variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helpdesk

# Start server
npm start
# or for development with auto-reload
npm run dev
```

### Frontend

#### Prerequisites

- Node.js (v14+)
- npm

#### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

---

## 🛠️ Backend API Endpoints

| Method | Endpoint                       | Description                |
|--------|-------------------------------|----------------------------|
| GET    | `/api/tickets`                | Get all tickets            |
| GET    | `/api/tickets/:id`            | Get ticket by ID           |
| POST   | `/api/tickets`                | Create a new ticket        |
| PATCH  | `/api/tickets/:id`            | Update a ticket            |
| DELETE | `/api/tickets/:id`            | Delete a ticket            |
| PATCH  | `/api/tickets/:id/status`     | Update ticket status       |
| PATCH  | `/api/tickets/:id/assign`     | Assign ticket to agent     |
| POST   | `/api/tickets/:id/responses`  | Add response to ticket     |

---

## 🗃️ Ticket Model Example

```javascript
{
  title: "Printer not working",
  description: "The printer in lab 2 is showing an error.",
  studentId: "STU123456",
  issueType: "Hardware",
  status: "Open",
  priority: "High",
  assignedTo: "Agent007",
  responses: [
    {
      responder: "Agent007",
      message: "Checked the printer, will replace cartridge.",
      createdAt: "2025-09-04T10:00:00Z"
    }
  ],
  createdAt: "2025-09-04T09:00:00Z",
  updatedAt: "2025-09-04T10:00:00Z"
}
```

---

## 🖥️ Frontend Features

- **User Dashboard**: View, create, and manage your tickets
- **Admin Dashboard**: View all tickets, assign, update status, and export reports
- **Responsive UI**: Built with React and modern CSS
- **PDF Export**: Admins can export ticket lists to PDF
- **Status & Priority Badges**: Visual indicators for ticket status and priority
- **Real-time Updates**: UI updates as tickets are created, updated, or deleted

### Main Components

```
src/components/HelpDesk/
├── admin/
│   ├── AdminDashboard.js
│   ├── AdminTicketList.js
│   ├── AdminTicketDetail.js
│   ├── AdminPDFGenerator.js
│   └── ... (other admin components)
└── user/
    ├── TicketDashboard.js
    ├── TicketCard.js
    ├── TicketDetail.js
    ├── TicketCreateForm.js
    └── ... (other user components)
```

---

## 📝 Usage Example

### Create a Ticket (Frontend)

```javascript
// src/components/HelpDesk/user/TicketCreateForm.js
fetch('http://localhost:5000/api/tickets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Cannot access portal',
    description: 'Login fails with error.',
    studentId: 'STU987654',
    issueType: 'Account',
    priority: 'Medium'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## ⚙️ Environment Variables

| Variable      | Description                  | Example                           |
|---------------|-----------------------------|-----------------------------------|
| PORT          | Server port                 | 5000                              |
| MONGODB_URI   | MongoDB connection string   | mongodb://localhost:27017/helpdesk|

---

## 📚 Useful Commands

```bash
# Backend
npm start         # Start server
npm run dev       # Start server with nodemon

# Frontend
npm start         # Start React app

# Install dependencies
npm install
```

---

## 🛡️ Security & Best Practices

- Input validation on all endpoints
- Error handling with descriptive messages
- Modular MVC structure for scalability
- Environment variables for sensitive data

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📞 Support

For questions or support, contact:  
**chamithusithmaka@gmail.com**

---

<div align="center">
  <p>© 2025 Helpdesk Management System</p>
</div>