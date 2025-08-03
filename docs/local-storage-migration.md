# 📁 Local Storage Migration Guide

## 🔄 **Migration from Azure Storage to Local Storage**

This document outlines the changes made to migrate from Azure Blob Storage to local file storage for image uploads.

### 🎯 **Why Local Storage?**

- **Cost Effective**: No cloud storage costs
- **Simplified Setup**: No Azure account required
- **Development Friendly**: Easier local development and testing
- **Full Control**: Complete control over file storage and access

### 🔧 **Changes Made**

#### 1. **Upload API Route** (`src/app/api/upload/route.ts`)
- ✅ **Removed**: Azure Blob Storage integration
- ✅ **Enhanced**: Local upload function with validation
- ✅ **Added**: File type validation (images only)
- ✅ **Added**: File size validation (max 5MB)
- ✅ **Improved**: Error handling and security

#### 2. **Package Dependencies** (`package.json`)
- ✅ **Removed**: `@azure/storage-blob` dependency
- ✅ **Reduced**: Bundle size and complexity

#### 3. **Image Service** (`src/services/api/imageService.ts`)
- ✅ **Updated**: Documentation to reflect local storage only
- ✅ **Maintained**: Same API interface for seamless integration

#### 4. **Environment Configuration** (`env.example`)
- ✅ **Removed**: Azure storage environment variables
- ✅ **Added**: Note about local storage usage
- ✅ **Simplified**: Configuration requirements

#### 5. **Next.js Configuration** (`next.config.ts`)
- ✅ **Removed**: Azure blob storage remote patterns
- ✅ **Added**: Local uploads optimization
- ✅ **Enhanced**: Static file serving configuration

#### 6. **Git Configuration** (`.gitignore`)
- ✅ **Added**: Upload directory exclusion
- ✅ **Maintained**: Directory structure with `.gitkeep`

### 📂 **File Storage Structure**

```
public/
└── uploads/
    ├── .gitkeep          # Maintains directory in git
    ├── abc123def456.jpg  # Uploaded images
    ├── def789ghi012.png  # Random filename format
    └── ...               # More uploaded files
```

### 🔒 **Security Features**

#### **File Validation**
```typescript
// File type validation
if (!file.type.startsWith('image/')) {
  throw new Error('Only images are allowed');
}

// File size validation (5MB limit)
const maxSize = 5 * 1024 * 1024;
if (file.size > maxSize) {
  throw new Error('File too large. Maximum size is 5MB');
}
```

#### **Secure File Naming**
- Uses cryptographically secure random names
- Prevents directory traversal attacks
- Maintains original file extensions

### 🚀 **Deployment Considerations**

#### **VPS Deployment**
- ✅ **Automatic**: Upload directory created during deployment
- ✅ **Persistent**: Files persist across deployments
- ✅ **Backup**: Include `/public/uploads` in backup strategy

#### **Production Recommendations**

1. **File Backup Strategy** 📦
   ```bash
   # Regular backup of uploads directory
   tar -czf uploads-backup-$(date +%Y%m%d).tar.gz public/uploads/
   ```

2. **Disk Space Monitoring** 📊
   ```bash
   # Monitor uploads directory size
   du -sh public/uploads/
   ```

3. **File Cleanup** 🧹
   ```bash
   # Remove orphaned files (files not referenced in database)
   # Implement cleanup script based on your database structure
   ```

### 🔄 **Migration Steps for Existing Data**

If you have existing images in Azure Storage:

1. **Download Existing Images**
   ```bash
   # Use Azure CLI to download existing images
   az storage blob download-batch \
     --destination ./public/uploads \
     --source your-container-name \
     --account-name your-account-name
   ```

2. **Update Database URLs**
   ```javascript
   // Update image URLs in your database
   // From: https://youraccount.blob.core.windows.net/container/filename.jpg
   // To: /uploads/filename.jpg
   ```

### 🧪 **Testing the Migration**

#### **Local Testing**
```bash
# Run the local deployment test
./scripts/local-deploy-test.sh
```

#### **Upload Testing**
1. Start your development server
2. Navigate to admin panel
3. Try uploading images
4. Verify files appear in `public/uploads/`
5. Confirm images display correctly

### 📈 **Performance Considerations**

#### **Advantages**
- ✅ **Faster**: No network latency for file access
- ✅ **Reliable**: No external service dependencies
- ✅ **Simple**: Direct file system access

#### **Considerations**
- 📊 **Disk Space**: Monitor available disk space
- 🔄 **Scaling**: For high-traffic sites, consider CDN
- 💾 **Backup**: Implement regular backup strategy

### 🛡️ **Security Best Practices**

1. **File Type Validation**: Only allow image files
2. **Size Limits**: Prevent large file uploads
3. **Random Naming**: Prevent predictable file names
4. **Directory Protection**: Uploads directory is read-only for web access
5. **Regular Cleanup**: Remove unused files periodically

### 🎉 **Benefits Achieved**

- ✅ **Simplified Architecture**: No external dependencies
- ✅ **Cost Reduction**: No cloud storage fees
- ✅ **Faster Development**: Easier local testing
- ✅ **Full Control**: Complete file management control
- ✅ **Enhanced Security**: Built-in file validation
- ✅ **Better Performance**: Direct file system access

### 🔧 **Troubleshooting**

#### **Common Issues**

1. **Upload Directory Not Found**
   ```bash
   mkdir -p public/uploads
   chmod 755 public/uploads
   ```

2. **Permission Issues**
   ```bash
   chmod 755 public/uploads
   chown www-data:www-data public/uploads  # For production
   ```

3. **File Not Displaying**
   - Check file exists in `public/uploads/`
   - Verify Next.js image configuration
   - Ensure correct URL format (`/uploads/filename.jpg`)

### 📋 **Deployment Checklist**

- [ ] Remove Azure storage environment variables
- [ ] Update deployment scripts if needed
- [ ] Test image upload functionality
- [ ] Verify image display on frontend
- [ ] Set up backup strategy for uploads directory
- [ ] Monitor disk space usage
- [ ] Test deployment process

## 🎯 **Conclusion**

The migration to local storage provides a simpler, more cost-effective solution for image storage while maintaining all the functionality of the previous Azure-based system. The enhanced validation and security features make it production-ready for most use cases.