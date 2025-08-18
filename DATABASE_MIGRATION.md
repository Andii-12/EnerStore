# 🗄️ Database Migration Guide: Local MongoDB → MongoDB Atlas

This guide will help you migrate your local EnerStore database to MongoDB Atlas.

## 📋 **Prerequisites**

- ✅ Local MongoDB running with data
- ✅ MongoDB Atlas account and cluster set up
- ✅ Environment variables configured
- ✅ Node.js and npm installed

## 🚀 **Step 1: Export Data from Local Database**

### **1.1 Navigate to Scripts Directory:**
```bash
cd server/scripts
```

### **1.2 Run Export Script:**
```bash
node exportLocalData.js
```

**Expected Output:**
```
🔄 Starting data export from local database...
📦 Exporting products...
✅ Exported 25 products
🏷️ Exporting categories...
✅ Exported 8 categories
🏭 Exporting brands...
✅ Exported 12 brands
🏢 Exporting companies...
✅ Exported 5 companies
👥 Exporting customer users...
✅ Exported 15 customer users
👤 Exporting admin users...
✅ Exported 3 admin users
📋 Exporting header menu items...
✅ Exported 6 header menu items
🖼️ Exporting carousel slides...
✅ Exported 4 carousel slides

🎉 Data export completed successfully!
📁 Exports saved to: /path/to/server/scripts/exports

📊 Export Summary:
Products: 25
Categories: 8
Brands: 12
Companies: 5
Customer Users: 15
Admin Users: 3
Header Menu Items: 6
Carousel Slides: 4
```

### **1.3 Verify Export Files:**
Check that these files were created in `server/scripts/exports/`:
- `products.json`
- `categories.json`
- `brands.json`
- `companies.json`
- `customerUsers.json`
- `users.json`
- `headerMenuItems.json`
- `carouselSlides.json`

## 🌐 **Step 2: Import Data to MongoDB Atlas**

### **2.1 Ensure Environment Variables:**
Make sure your `.env` file in the server directory has:
```bash
MONGODB_URI=mongodb+srv://andiiandii159:frmuBfZJXIMKzcZK@enerstore.vwi8w1y.mongodb.net/?retryWrites=true&w=majority&appName=EnerStore
```

### **2.2 Run Import Script:**
```bash
node importToAtlas.js
```

**Expected Output:**
```
🔄 Starting data import to MongoDB Atlas...
🔗 Connected to: mongodb+srv://...
🧹 Clearing existing data...
✅ Existing data cleared
🏷️ Importing categories...
✅ Imported 8 categories
🏭 Importing brands...
✅ Imported 12 brands
🏢 Importing companies...
✅ Imported 5 companies
📦 Importing products...
✅ Imported 25 products
👥 Importing customer users...
✅ Imported 15 customer users
👤 Importing admin users...
✅ Imported 3 admin users
📋 Importing header menu items...
✅ Imported 6 header menu items
🖼️ Importing carousel slides...
✅ Imported 4 carousel slides

🎉 Data import completed successfully!

📊 Import Summary:
Products: 25
Categories: 8
Brands: 12
Companies: 5
Customer Users: 15
Admin Users: 3
Header Menu Items: 6
Carousel Slides: 4
```

## 🔍 **Step 3: Validate Data in MongoDB Atlas**

### **3.1 Run Validation Script:**
```bash
node validateAtlasData.js
```

**Expected Output:**
```
🔍 Starting data validation in MongoDB Atlas...
🔗 Connected to: mongodb+srv://...

📊 Document Counts:
Products: 25
Categories: 8
Brands: 12
Companies: 5
Customer Users: 15
Admin Users: 3
Header Menu Items: 6
Carousel Slides: 4

🔍 Sample Data Validation:
📦 Sample Product: { name: 'Sample Product', price: 150000, category: 'Electronics', brand: 'Sample Brand' }
🏷️ Sample Category: { name: 'Electronics', image: 'Has image' }
🏭 Sample Brand: { name: 'Sample Brand', description: 'Sample description' }
🏢 Sample Company: { name: 'Sample Company', email: 'sample@company.com', hasLogo: true }

🔍 Data Integrity Checks:
✅ All products have categories
✅ All products have prices
✅ No duplicate product names found
✅ All product prices are valid
📸 25 products have images

🔍 Reference Integrity:
✅ All product categories exist
✅ All product brands exist

🎉 Data validation completed!

🏥 Database Health Score: 100/100
🟢 Excellent - Database is in great condition!
```

## 🔧 **Step 4: Update Application Configuration**

### **4.1 Update Server Environment:**
Ensure your Railway environment has:
```bash
MONGODB_URI=mongodb+srv://andiiandii159:frmuBfZJXIMKzcZK@enerstore.vwi8w1y.mongodb.net/?retryWrites=true&w=majority&appName=EnerStore
NODE_ENV=production
CORS_ORIGINS=https://your-vercel-domain.vercel.app
```

### **4.2 Update Client Environment:**
Ensure your Vercel environment has:
```bash
REACT_APP_API_URL=https://your-railway-app.railway.app
REACT_APP_SOCKET_URL=https://your-railway-app.railway.app
REACT_APP_ENV=production
```

## 🧪 **Step 5: Test the Migration**

### **5.1 Test Backend API:**
```bash
# Test health endpoint
curl https://your-railway-app.railway.app/health

# Test products endpoint
curl https://your-railway-app.railway.app/api/products

# Test categories endpoint
curl https://your-railway-app.railway.app/api/categories
```

### **5.2 Test Frontend:**
1. Open your Vercel app
2. Navigate to products page
3. Check if data is loading
4. Test search functionality
5. Verify admin panel access

## 🚨 **Troubleshooting Common Issues**

### **Issue: Export Script Fails**
**Solution:**
- Ensure local MongoDB is running
- Check if you have data in your local database
- Verify model imports are correct

### **Issue: Import Script Fails**
**Solution:**
- Check MongoDB Atlas connection string
- Ensure network access allows your IP
- Verify database user permissions

### **Issue: Data Not Showing in Frontend**
**Solution:**
- Check Railway logs for errors
- Verify CORS configuration
- Ensure environment variables are set correctly

### **Issue: Missing Relationships**
**Solution:**
- Run validation script to identify issues
- Check if all referenced categories/brands exist
- Re-run import if needed

## 📊 **Migration Checklist**

- [ ] **Local data exported** to JSON files
- [ ] **Data imported** to MongoDB Atlas
- [ ] **Data validated** for integrity
- [ ] **Environment variables** updated
- [ ] **Backend deployed** to Railway
- [ ] **Frontend deployed** to Vercel
- [ ] **API endpoints tested** and working
- [ ] **Frontend functionality** verified
- [ ] **Admin panel** accessible
- [ ] **Real-time features** working

## 🔒 **Security Considerations**

1. **Database Access**: Only Railway should access MongoDB Atlas
2. **Environment Variables**: Never commit `.env` files
3. **Network Security**: Restrict MongoDB Atlas access to Railway IPs
4. **User Permissions**: Use least privilege principle for database users

## 📈 **Post-Migration Steps**

1. **Monitor Performance**: Check Railway logs and Vercel analytics
2. **Backup Strategy**: Set up regular MongoDB Atlas backups
3. **Scaling Plan**: Monitor database usage and plan for growth
4. **Maintenance**: Schedule regular data validation checks

## 🎯 **Success Criteria**

Your migration is successful when:
- ✅ All data is accessible in MongoDB Atlas
- ✅ Railway backend connects to Atlas successfully
- ✅ Vercel frontend displays data correctly
- ✅ All functionality works as expected
- ✅ Performance is acceptable
- ✅ No data loss occurred

---

## 📞 **Need Help?**

If you encounter issues during migration:
1. Check the troubleshooting section above
2. Review Railway and Vercel logs
3. Run validation scripts to identify problems
4. Check MongoDB Atlas dashboard for connection issues

**Happy migrating! 🚀** 