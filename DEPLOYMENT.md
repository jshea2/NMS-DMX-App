# Deployment Checklist

## Pre-Deployment

- [ ] Node.js installed on target Windows PC
- [ ] PC connected to the network (Ethernet recommended for reliability)
- [ ] Firewall configured to allow Node.js
- [ ] DMX gateway/console on same network

## Installation Steps

1. [ ] Copy entire application folder to Windows PC
2. [ ] Run `install.bat`
3. [ ] Wait for installation to complete
4. [ ] Note any errors in console

## Configuration

1. [ ] Run `start.bat` to start the server
2. [ ] Open Settings page from any device
3. [ ] Configure network output:
   - [ ] Select protocol (sACN or Art-Net)
   - [ ] Set universe numbers
   - [ ] Configure destination IPs if needed
4. [ ] Configure fixture patching:
   - [ ] Set DMX addresses for all fixtures
   - [ ] Verify no address overlaps
5. [ ] Configure looks:
   - [ ] Set up 3 preset looks
   - [ ] Name them appropriately
   - [ ] Test blending behavior
6. [ ] Click "Save Configuration"

## Testing

1. [ ] Test from PC browser (http://localhost:3001)
2. [ ] Test from phone/tablet on same network
3. [ ] Verify WebSocket connection (check for "Disconnected" warning)
4. [ ] Test each look individually
5. [ ] Test look blending (multiple looks active)
6. [ ] Test individual fixture controls
7. [ ] Test blackout function
8. [ ] Verify DMX output with actual fixtures or analyzer
9. [ ] Test configuration export/import
10. [ ] Test "Capture Current" functionality

## Network Verification

- [ ] PC and mobile devices on same WiFi/network
- [ ] Static IP recommended for PC (or DHCP reservation)
- [ ] Firewall allows inbound connections on port 3001
- [ ] DMX gateway/console receiving data (check indicators)

## Optional: Auto-Start

1. [ ] Press `Win + R`, type `shell:startup`, press Enter
2. [ ] Create shortcut to `start.bat`
3. [ ] Test by restarting PC
4. [ ] Verify server starts automatically

## Optional: QR Code for Easy Access

You can create a QR code pointing to the Network URL for easy phone access:

1. Get the Network URL (e.g., http://192.168.1.100:3001)
2. Use a QR code generator website
3. Print and post near the control area

## Backup

- [ ] Export configuration to JSON file
- [ ] Save backup copy of entire application folder
- [ ] Document any custom settings

## Troubleshooting Reference

**Connection Issues:**
- Verify same network
- Check firewall settings
- Verify port 3001 is not blocked
- Try using IP address instead of hostname

**DMX Output Issues:**
- Check protocol selection (sACN vs Art-Net)
- Verify universe numbers
- Check DMX address patching
- Verify network settings on DMX gateway

**Performance Issues:**
- Reduce output FPS in settings
- Check network bandwidth
- Ensure PC is not under heavy load
- Use wired Ethernet instead of WiFi for PC

## Production Notes

- Configuration is stored in `server/config.json`
- All settings persist across restarts
- WebSocket auto-reconnects on connection loss
- Console shows all network URLs on startup
- Press Ctrl+C in console to gracefully stop server

## Faculty Training

Recommended training points:
1. How to start the application (`start.bat`)
2. How to access from phone (bookmark the URL)
3. Using the Looks sliders
4. Using individual fixture controls
5. Blackout button location and function
6. Where to find the Settings (gear icon)
7. When to click Save in Settings
8. How to stop the application (Ctrl+C)

## Maintenance

- Check for Windows updates periodically
- Verify config.json backup exists
- Test from multiple devices occasionally
- Monitor console for errors during shows
