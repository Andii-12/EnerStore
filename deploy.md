# EnerStore Deployment Guide

## 🚀 Deployment Overview
This guide will help you deploy EnerStore to:
- **Database**: MongoDB Atlas (Cloud)
- **Backend**: Railway (Server)
- **Frontend**: Vercel (Client)

## 📊 Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "EnerStore"

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Railway)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<database>` with your values

## 🚂 Step 2: Railway Backend Deployment

### 2.1 Prepare Repository
1. Push your code to GitHub
2. Ensure you have the `railway.json` file in your root directory

### 2.2 Deploy to Railway
1. Go to [Railway](https://railway.app/)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your EnerStore repository
6. Select the root directory (not client or server)

### 2.3 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
NODE_ENV=production
CORS_ORIGINS=https://your-vercel-domain.vercel.app
```

### 2.4 Deploy
1. Railway will automatically detect it's a Node.js app
2. It will install dependencies and start the server
3. Note the generated domain (e.g., `https://your-app.railway.app`)

## 🌐 Step 3: Vercel Frontend Deployment

### 3.1 Prepare Repository
1. Ensure your code is pushed to GitHub
2. Make sure you have the `vercel.json` file in the `client` directory

### 3.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign in with GitHub
3. Click "New Project"
4. Import your EnerStore repository
5. Set the root directory to `client`
6. Click "Deploy"

### 3.3 Configure Environment Variables
In Vercel dashboard, add these environment variables:
```
REACT_APP_API_URL=https://your-railway-app.railway.app
REACT_APP_SOCKET_URL=https://your-railway-app.railway.app
REACT_APP_ENV=production
```

### 3.4 Update CORS in Railway
Go back to Railway and update the CORS_ORIGINS to include your Vercel domain:
```
CORS_ORIGINS=https://your-vercel-domain.vercel.app
```

## 🔧 Step 4: Update Client Code

### 4.1 Update API URLs
The client code has been updated to use environment variables. Make sure all components use the `API_ENDPOINTS` from `src/config/api.js`.

### 4.2 Test Deployment
1. Test your Vercel app
2. Verify API calls work
3. Check Socket.io connections
4. Test all major functionality

## 📝 Step 5: Final Configuration

### 5.1 Update Domain References
Update any hardcoded localhost references in your code to use the new URLs.

### 5.2 SSL Certificates
Both Railway and Vercel provide automatic SSL certificates.

### 5.3 Monitoring
- Railway provides logs and monitoring
- Vercel provides analytics and performance insights

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CORS_ORIGINS in Railway
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Environment Variables**: Ensure they're set in both Railway and Vercel
4. **Build Errors**: Check Railway logs for dependency issues

### Useful Commands:
```bash
# Test MongoDB connection locally
mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>"

# Check Railway logs
railway logs

# Test API endpoints
curl https://your-railway-app.railway.app/health
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database Access**: Use strong passwords
3. **CORS**: Restrict to only necessary domains
4. **API Keys**: Rotate regularly

## 📈 Next Steps

1. Set up monitoring and logging
2. Configure custom domains
3. Set up CI/CD pipelines
4. Add analytics and error tracking
5. Implement backup strategies

## 📞 Support

- **MongoDB Atlas**: [Documentation](https://docs.atlas.mongodb.com/)
- **Railway**: [Documentation](https://docs.railway.app/)
- **Vercel**: [Documentation](https://vercel.com/docs) 