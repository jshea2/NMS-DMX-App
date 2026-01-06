# Quick Start Guide

## First Time Setup

1. **Install Node.js**
   - Go to https://nodejs.org/
   - Download and install the LTS version
   - Restart your computer

2. **Install the Application**
   - Double-click `install.bat`
   - Wait for installation to complete (5-10 minutes)

3. **Start the Application**
   - Double-click `start.bat`
   - Note the Network URL shown in the console

4. **Connect from Phone/Tablet**
   - Connect to the same WiFi as the PC
   - Open browser and go to the Network URL
   - Example: `http://192.168.1.100:3001`

## Daily Use

1. Double-click `start.bat` on the Windows PC
2. Open the Network URL on your phone/tablet
3. Control the lights!
4. Press Ctrl+C in the console window to stop

## Tips

- **Bookmark the URL** on your phone for quick access
- Use the **Settings (⚙)** button to configure DMX addresses
- The **Blackout** button is perfect for quick scene changes
- **Looks** can be blended together - try combining multiple at once!
- Use **Capture Current** in Settings to save your favorite looks

## Getting the Network URL

The Network URL is shown when you run `start.bat`. It looks like:
```
Network: http://192.168.1.XXX:3001
```

If you miss it, you can find your PC's IP address:
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your WiFi adapter
4. Add `:3001` to the end

## Firewall Setup

If you can't connect from your phone:

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Look for "Node.js" and ensure both Private and Public are checked
4. If Node.js isn't listed, click "Allow another app" and browse to:
   `C:\Program Files\nodejs\node.exe`

## Common Issues

**"Node.js is not installed"**
- Install Node.js from https://nodejs.org/
- Restart your computer

**"Can't connect from phone"**
- Ensure phone and PC are on same WiFi
- Check Windows Firewall (see above)
- Use Network URL, not localhost

**"Port 3001 in use"**
- Close any other applications using that port
- Or edit `server/server.js` and change the PORT number

## Need Help?

Check the full [README.md](README.md) for detailed documentation.
