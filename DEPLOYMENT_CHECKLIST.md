# 🚀 EnerStore Deployment Checklist

Use this checklist to ensure your deployment is complete and working correctly.

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All hardcoded localhost URLs replaced with environment variables
- [ ] API configuration file created and imported in all components
- [ ] Environment example files created (.env.example, env.example)
- [ ] .gitignore updated to exclude sensitive files
- [ ] README.md updated with deployment instructions
- [ ] All dependencies properly listed in package.json files

### ✅ Configuration Files
- [ ] `railway.json` created in root directory
- [ ] `vercel.json` created in client directory
- [ ] `deploy.md` created with detailed instructions
- [ ] Environment variable templates created

## 🌐 MongoDB Atlas Setup

### ✅ Account & Project
- [ ] MongoDB Atlas account created
- [ ] New project "EnerStore" created
- [ ] Free tier cluster created (M0)

### ✅ Database Configuration
- [ ] Database user created with read/write permissions
- [ ] Network access configured (allow from anywhere)
- [ ] Connection string copied and saved
- [ ] Database name chosen (e.g., "enerstore")

### ✅ Security
- [ ] Strong password set for database user
- [ ] IP whitelist configured (if needed)
- [ ] Connection string contains all required parameters

## 🚂 Railway Backend Deployment

### ✅ Repository Setup
- [ ] Code pushed to GitHub
- [ ] `railway.json` present in root directory
- [ ] Server package.json has correct scripts

### ✅ Railway Configuration
- [ ] Railway account created and connected to GitHub
- [ ] New project created from GitHub repository
- [ ] Root directory selected (not client or server)
- [ ] Automatic deployment triggered

### ✅ Environment Variables
- [ ] `MONGODB_URI` set with Atlas connection string
- [ ] `NODE_ENV` set to "production"
- [ ] `CORS_ORIGINS` set (initially empty, update after Vercel)

### ✅ Deployment Verification
- [ ] Build successful (check Railway logs)
- [ ] Server started without errors
- [ ] Health check endpoint responding (`/health`)
- [ ] Database connection successful
- [ ] Note Railway domain (e.g., `https://app.railway.app`)

## 🌐 Vercel Frontend Deployment

### ✅ Repository Setup
- [ ] Code pushed to GitHub (same repository)
- [ ] `vercel.json` present in client directory
- [ ] Client package.json has correct build scripts

### ✅ Vercel Configuration
- [ ] Vercel account created and connected to GitHub
- [ ] New project imported from GitHub repository
- [ ] Root directory set to `client`
- [ ] Framework auto-detected as Create React App

### ✅ Environment Variables
- [ ] `REACT_APP_API_URL` set to Railway domain
- [ ] `REACT_APP_SOCKET_URL` set to Railway domain
- [ ] `REACT_APP_ENV` set to "production"

### ✅ Deployment Verification
- [ ] Build successful (check Vercel logs)
- [ ] App accessible via Vercel domain
- [ ] Note Vercel domain (e.g., `https://app.vercel.app`)

## 🔧 Post-Deployment Configuration

### ✅ CORS Update
- [ ] Update Railway `CORS_ORIGINS` with Vercel domain
- [ ] Restart Railway service if needed
- [ ] Test API calls from Vercel frontend

### ✅ API Testing
- [ ] Test product listing from Vercel
- [ ] Test search functionality
- [ ] Test user/company login
- [ ] Test Socket.io connections
- [ ] Test admin dashboard access

### ✅ Functionality Testing
- [ ] Product browsing and filtering
- [ ] Shopping cart operations
- [ ] User registration and login
- [ ] Company dashboard
- [ ] Admin panel access
- [ ] Image uploads and displays

## 🚨 Troubleshooting Verification

### ✅ Common Issues Checked
- [ ] CORS errors resolved
- [ ] Database connection stable
- [ ] Environment variables properly set
- [ ] Build processes successful
- [ ] SSL certificates working

### ✅ Performance Check
- [ ] Page load times acceptable
- [ ] API response times reasonable
- [ ] Image loading working
- [ ] Mobile responsiveness maintained

## 📊 Monitoring Setup

### ✅ Logs & Analytics
- [ ] Railway logs accessible
- [ ] Vercel analytics enabled
- [ ] Error tracking configured (if needed)
- [ ] Performance monitoring active

### ✅ Health Checks
- [ ] Railway health endpoint responding
- [ ] Database connection monitoring
- [ ] API endpoint availability
- [ ] Frontend build status

## 🔒 Security Verification

### ✅ Access Control
- [ ] Environment variables not exposed in client
- [ ] Database access restricted to Railway
- [ ] CORS properly configured
- [ ] No sensitive data in logs

### ✅ SSL & HTTPS
- [ ] Railway provides HTTPS
- [ ] Vercel provides HTTPS
- [ ] All API calls use HTTPS
- [ ] No mixed content warnings

## 📝 Documentation

### ✅ Deployment Records
- [ ] Railway domain recorded
- [ ] Vercel domain recorded
- [ ] MongoDB Atlas connection details saved
- [ ] Environment variables documented

### ✅ Team Access
- [ ] Team members have access to all platforms
- [ ] Deployment procedures documented
- [ ] Troubleshooting guide created
- [ ] Support contacts documented

## 🎯 Final Verification

### ✅ Production Readiness
- [ ] All functionality working in production
- [ ] No development artifacts in production
- [ ] Performance meets requirements
- [ ] Security measures implemented

### ✅ Backup & Recovery
- [ ] Database backup strategy in place
- [ ] Code deployment rollback plan
- [ ] Environment variable backup
- [ ] Emergency contact procedures

---

## 🚀 Deployment Complete!

Once all items are checked, your EnerStore application is successfully deployed and ready for production use!

### Quick Links
- **Frontend**: [Your Vercel Domain]
- **Backend**: [Your Railway Domain]
- **Database**: MongoDB Atlas Dashboard
- **Documentation**: [deploy.md](./deploy.md)

### Next Steps
1. Set up custom domains (optional)
2. Configure monitoring and alerts
3. Set up CI/CD pipelines
4. Plan scaling strategies
5. Regular security audits

---

**Congratulations on your successful deployment! 🎉** 