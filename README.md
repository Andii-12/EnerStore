# 🚀 EnerStore - E-commerce Platform

A full-stack e-commerce platform built with React, Node.js, and MongoDB, designed for selling electronic products in Mongolia.

## ✨ Features

- **Multi-vendor Marketplace**: Companies can sell their products
- **Advanced Product Management**: Categories, brands, sales, inventory
- **Real-time Features**: Live viewer count, search, Socket.io
- **Responsive Design**: Mobile-friendly interface
- **Localization**: Mongolian language support
- **Admin Dashboard**: Comprehensive management tools
- **Shopping Cart & Favorites**: Local storage-based
- **Payment Options**: Multiple payment method displays

## 🛠️ Tech Stack

### Frontend
- **React 18** with React Router v7
- **CSS Modules** and inline styles
- **Socket.io Client** for real-time features
- **Local Storage** for state persistence

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose ODM**
- **Socket.io** for real-time connections
- **CORS** enabled for cross-origin requests

### Database
- **MongoDB Atlas** (Cloud)
- **Mongoose** schemas for data modeling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd EnerStore
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Server (.env file in server directory)
   cd ../server
   cp env.example .env
   # Edit .env with your MongoDB connection string
   
   # Client (.env.local file in client directory)
   cd ../client
   cp env.example .env.local
   # Edit .env.local with your API URLs
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend (from client directory, in new terminal)
   npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🌐 Deployment

### MongoDB Atlas
1. Create a free MongoDB Atlas account
2. Set up a cluster and database
3. Configure network access and database users
4. Get your connection string

### Railway (Backend)
1. Push code to GitHub
2. Connect Railway to your repository
3. Set environment variables
4. Deploy automatically

### Vercel (Frontend)
1. Connect Vercel to your repository
2. Set root directory to `client`
3. Configure environment variables
4. Deploy with automatic builds

📖 **Detailed deployment instructions**: See [deploy.md](./deploy.md)

## 📁 Project Structure

```
EnerStore/
├── client/                 # React frontend
│   ├── src/
│   │   ├── admin/         # Admin panel components
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # API configuration
│   │   └── App.js         # Main application
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── scripts/           # Database scripts
│   ├── index.js           # Server entry point
│   └── package.json
├── railway.json            # Railway configuration
├── vercel.json            # Vercel configuration
├── deploy.md              # Deployment guide
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
NODE_ENV=production
CORS_ORIGINS=https://your-vercel-domain.vercel.app
```

#### Client (.env.local)
```bash
REACT_APP_API_URL=https://your-railway-app.railway.app
REACT_APP_SOCKET_URL=https://your-railway-app.railway.app
REACT_APP_ENV=production
```

## 📊 API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/categories` - Get all categories
- `GET /api/brands` - Get all brands
- `GET /api/companies` - Get all companies
- `POST /api/customer-users/login` - Customer login
- `POST /api/companies/login` - Company login

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS_ORIGINS in server environment
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Build Errors**: Check Railway logs for dependency issues
4. **Environment Variables**: Ensure they're set in both Railway and Vercel

### Useful Commands
```bash
# Check server logs
railway logs

# Test API health
curl https://your-railway-app.railway.app/health

# Test MongoDB connection
mongosh "your-connection-string"
```

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure MongoDB Atlas access

## 📈 Performance

- Image optimization recommendations
- Lazy loading for product images
- Efficient database queries
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

- **Issues**: Create GitHub issues for bugs
- **Documentation**: Check deploy.md for deployment help
- **MongoDB Atlas**: [Official Docs](https://docs.atlas.mongodb.com/)
- **Railway**: [Official Docs](https://docs.railway.app/)
- **Vercel**: [Official Docs](https://vercel.com/docs)

---

**Happy coding! 🎉** 