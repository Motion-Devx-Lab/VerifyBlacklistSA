# VerifyBlacklistSA - South Africa's Community Stolen Device Registry

## 🔧 Setup Instructions

### Quick Start (Recommended)

1. **Start the local server:**
   ```bash
   python server.py
   ```

2. **Open your browser:**
   Navigate to `http://localhost:8000`

3. **Configure Supabase:**
   - Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `script.js`
   - Update `SUPABASE_URL` and `SUPABASE_KEY` in `admin.js`

### Alternative: Node.js Server

If you prefer Node.js:
```bash
npx http-server -p 8000 --cors
```

### Alternative: Live Server (VS Code)

If using VS Code:
1. Install the "Live Server" extension
2. Right-click `index.html` and select "Open with Live Server"

## 🚨 Connection Error Fix

If you see "Connection error." when testing:

**Problem:** Loading from `file:///` blocks API calls due to CORS restrictions.

**Solution:** Use a local server (see setup instructions above).

## 📁 File Structure

```
VerifyBlacklistSA/
├── index.html          # Main public interface
├── admin.html          # Admin management interface
├── script.js           # Main JavaScript functionality
├── admin.js            # Admin JavaScript functionality
├── style.css           # Styling for all pages
├── widget.html         # Embeddable widget
├── database.sql        # PostgreSQL schema
├── server.py           # Python development server
└── README.md           # This file
```

## 🔌 Configuration Required

### Supabase Setup
1. Create a new Supabase project
2. Run the `database.sql` file in your Supabase SQL editor
3. Update the configuration in:
   - `script.js` (lines 2-3)
   - `admin.js` (lines 2-3)

### EmailJS Setup (Optional)
1. Create an EmailJS account
2. Update the configuration in `index.html` (line 81)
3. Update service/template IDs in `script.js` (line 86)

## 🌐 Features

- **IMEI Validation** - Luhn algorithm for accurate IMEI checking
- **Stolen Device Registry** - Public search with verified reports only
- **Admin Verification** - SAPS case number verification system
- **Automated Notifications** - Email alerts for victims
- **Secure Messaging** - Anonymous tip system
- **Embeddable Widget** - Partner integration
- **POPIA Compliant** - South African privacy law adherence

## 🛡️ Security Features

- Row Level Security (RLS) policies
- Public views for safe data access
- SAPS case number requirements
- IMEI validation with Luhn algorithm
- No full ID numbers stored

## 📱 Testing

### Test IMEI Numbers
- **Valid IMEI:** `351756051234563` (will pass Luhn validation)
- **Invalid IMEI:** `123456789012345` (will fail validation)

### Test Workflow
1. Start the local server
2. Open `http://localhost:8000`
3. Try searching with a test IMEI
4. Submit a test report (requires valid IMEI format)
5. Check admin interface at `http://localhost:8000/admin.html`

## 🚀 Deployment

For production deployment:
1. Update all Supabase credentials
2. Configure EmailJS for notifications
3. Deploy to a web server (not GitHub Pages due to API calls)
4. Set up custom domain
5. Configure SSL certificate

## 📞 Support

For issues or questions:
- Check the browser console for specific error messages
- Verify Supabase configuration
- Ensure local server is running
- Test with valid IMEI numbers
