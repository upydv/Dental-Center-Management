# ENTNT Dental Center Management System

A comprehensive dental practice management system built with React and Next.js, featuring role-based access control, appointment scheduling, patient management, and file handling capabilities.

## 🚀 Features

### 👨‍⚕️ Admin Features
- **Dashboard Overview**: Real-time statistics and insights
- **Patient Management**: Complete patient records with medical history
- **Appointment Scheduling**: Full appointment lifecycle management
- **Calendar View**: Visual appointment scheduling and management
- **File Management**: Upload and manage treatment records, X-rays, and documents
- **Treatment Tracking**: Record treatments, costs, and follow-up appointments

### 👤 Patient Features
- **Personal Dashboard**: View appointment statistics and upcoming visits
- **Appointment History**: Complete treatment history with costs and details
- **File Access**: Download treatment records and medical documents
- **Secure Access**: View only personal data with strict privacy controls

### 🔐 Security & Authentication
- **Role-Based Access Control**: Separate admin and patient interfaces
- **Secure Login System**: Email/password authentication
- **Data Privacy**: Patients can only access their own records
- **Session Management**: Persistent login with localStorage

### 📱 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with shadcn/ui components
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Real-time Updates**: Dynamic data updates without page refresh

## 🛠️ Technology Stack

- **Frontend**: React 18, Next.js 14 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Storage**: localStorage for data persistence
- **File Handling**: Base64 encoding for file storage

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

## 🚀 Installation

### Option 1: Using v0 (Recommended)
1. Click the "Download Code" button in the v0 interface
2. Follow the automated setup instructions
3. The system will handle all dependencies and configuration

### Option 2: Manual Setup
1. Clone or download the project files
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 👥 Demo Accounts

### Admin Account
- **Email**: `admin@entnt.in`
- **Password**: `admin123`
- **Access**: Full system administration

### Patient Accounts
- **Email**: `john@entnt.in`
- **Password**: `patient123`
- **Access**: Personal appointment data only

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── LoginPage.jsx
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/            # Dashboard components
│   │   └── Dashboard.jsx
│   ├── patients/             # Patient management
│   │   └── PatientManagement.jsx
│   ├── appointments/         # Appointment management
│   │   └── AppointmentManagement.jsx
│   ├── calendar/             # Calendar view
│   │   └── CalendarView.jsx
│   ├── patient-view/         # Patient portal
│   │   └── PatientView.jsx
│   ├── layout/               # Layout components
│   │   └── DashboardLayout.jsx
│   └── ui/                   # Reusable UI components
├── contexts/                 # React Context providers
│   ├── AuthContext.js
│   └── DataContext.js
├── lib/                      # Utility functions
│   └── utils.js
└── index.css                 # Global styles
\`\`\`

## 🔧 Configuration

### Environment Variables
The application uses localStorage for data persistence. No external database configuration is required for the demo version.

### Customization
- **Styling**: Modify `src/index.css` for global styles
- **Components**: Update individual component files for UI changes
- **Data**: Modify demo data in `src/contexts/DataContext.js`

## 📊 Key Features Breakdown

### Patient Management
- Add, edit, and delete patient records
- Store comprehensive medical history
- Emergency contact information
- Search and filter capabilities
- File attachment support

### Appointment System
- Schedule appointments with date/time selection
- Multiple appointment types (Consultation, Cleaning, Root Canal, etc.)
- Status tracking (Scheduled, Confirmed, Completed, Cancelled)
- Cost tracking and billing information
- Treatment notes and follow-up scheduling

### File Management
- Upload multiple file types (Images, PDFs, Documents)
- File size validation (5MB limit)
- Secure file storage and retrieval
- Download functionality for patients
- File organization by appointment

### Calendar Integration
- Monthly and weekly calendar views
- Visual appointment scheduling
- Drag-and-drop functionality
- Color-coded appointment status
- Today's appointments summary

## 🔒 Security Features

- **Authentication**: Secure login system with role validation
- **Authorization**: Role-based access control (Admin/Patient)
- **Data Privacy**: Strict data isolation between patients
- **Session Security**: Secure session management
- **Input Validation**: Form validation and sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Optimized mobile interface with collapsible navigation

## 🧪 Testing

### Manual Testing
1. Test admin login and patient management
2. Verify appointment scheduling and editing
3. Test file upload and download functionality
4. Verify patient portal access restrictions
5. Test responsive design on different devices

### Demo Data
The application includes comprehensive demo data:
- 3 sample patients with complete profiles
- Multiple appointments with different statuses
- Sample file attachments
- Realistic medical history data

## 🚀 Deployment

### Development
\`\`\`bash
npm start
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run serve
\`\`\`

### Deployment Platforms
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment
- **AWS S3**: Static hosting with CloudFront
- **GitHub Pages**: Free static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added file management system
- **v1.2.0**: Enhanced patient portal with cost tracking
- **v1.3.0**: Improved responsive design and UI/UX

## 🎯 Future Enhancements

- [ ] Email notifications for appointments
- [ ] SMS reminders
- [ ] Payment processing integration
- [ ] Advanced reporting and analytics
- [ ] Multi-location support
- [ ] API integration for external systems
- [ ] Mobile app development
- [ ] Telemedicine features

---

**Built with ❤️ for ENTNT Technical Assignment**

