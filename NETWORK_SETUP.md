# CivicPulse - Local Network Setup

This guide will help you run CivicPulse on your local network so that other devices (phones, tablets, other computers) can access the application.

## Quick Start

### Option 1: Use the automated scripts

**Windows (Command Prompt):**
```bash
start-network.bat
```

**Windows (PowerShell):**
```powershell
.\start-network.ps1
```

### Option 2: Manual setup

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Server (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

## Finding Your Local IP Address

### Windows:
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

### macOS/Linux:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## Accessing the Application

Once both servers are running:

- **Frontend:** `http://YOUR_LOCAL_IP:5173`
- **Backend API:** `http://YOUR_LOCAL_IP:5000`

Example: If your local IP is 192.168.1.100:
- Frontend: `http://192.168.1.100:5173`
- Backend: `http://192.168.1.100:5000`

## Device Access

Other devices on the same network (WiFi) can access the application by:

1. Connecting to the same WiFi network
2. Opening a web browser
3. Navigating to `http://YOUR_LOCAL_IP:5173`

## Firewall Configuration

If you can't access the application from other devices, you may need to:

### Windows:
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change Settings" and then "Allow another app..."
4. Add Node.js to the exceptions for both Private and Public networks

### Alternative: Temporarily disable firewall
```powershell
# Run as Administrator
netsh advfirewall set allprofiles state off
```

**Remember to re-enable it later:**
```powershell
# Run as Administrator
netsh advfirewall set allprofiles state on
```

## Configuration Details

The following configurations have been made to enable network access:

### Frontend (Vite):
- Added `--host` flag to dev script
- Configured `vite.config.js` with `host: '0.0.0.0'`
- Server binds to all network interfaces

### Backend (Express):
- Server listens on `0.0.0.0:5000` (all interfaces)
- CORS configured to allow any origin in development
- Socket.IO configured for cross-origin requests

## Troubleshooting

1. **Can't access from other devices:**
   - Check firewall settings
   - Ensure devices are on the same network
   - Verify the IP address is correct

2. **CORS errors:**
   - The backend is configured to allow all origins in development
   - If issues persist, check browser console for specific errors

3. **Port conflicts:**
   - Frontend runs on port 5173 (Vite default)
   - Backend runs on port 5000
   - Change ports in configuration if needed

## Security Note

These configurations are for development purposes only. For production deployment, you should:
- Restrict CORS origins to specific domains
- Use proper firewall rules
- Implement proper authentication and authorization
- Use HTTPS
- Follow security best practices
