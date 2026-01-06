# NMS DMX Lighting Control

A web-based DMX lighting control application for faculty to control 4 lighting instruments from phones and tablets.

## Features

- **Web-based UI**: Control lights from any device on the local network
- **Real-time Control**: WebSocket-based updates for instant feedback
- **Looks System**: 3 customizable preset looks with smooth blending
- **Individual Fixture Control**: Direct control over each fixture
- **DMX Output**: Supports both sACN (E1.31) and Art-Net protocols
- **Flexible Patching**: Configure universes and DMX addresses through the UI
- **Blackout Function**: Instant all-off capability
- **Configuration Management**: Save, load, export, and import settings

## Fixtures

- **RGB Panel 1**: Hue + Brightness control (3 DMX channels)
- **RGB Panel 2**: Hue + Brightness control (3 DMX channels)
- **Backlight PAR 1**: Intensity control (1 DMX channel)
- **Backlight PAR 2**: Intensity control (1 DMX channel)

## Requirements

- Windows PC
- Node.js (LTS version recommended) - Download from [nodejs.org](https://nodejs.org/)
- Network connection (WiFi or Ethernet)

## Installation

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Run the installer and follow the prompts
   - Restart your computer after installation

2. **Run the installation script**
   - Double-click `install.bat`
   - Wait for all dependencies to install (this may take several minutes)

## Starting the Application

1. Double-click `start.bat`
2. The console will display the URLs to access the app:
   ```
   Local: http://localhost:3001
   Network: http://192.168.1.XXX:3001
   ```
3. On your phone/tablet, open a web browser and navigate to the Network URL
4. The application is ready to use!

## Usage

### Main Control Page

**Looks Section**
- 3 large sliders for preset lighting looks
- Default looks: Warm Dramatic, Cool Dramatic, Vibrant
- Slider values represent the intensity of each look (0-100%)
- Multiple looks can be active simultaneously and will blend together

**Fixtures Section**
- Individual control for each lighting fixture
- RGB Panels: Hue (0-360°) and Brightness (0-100%) sliders
- PARs: Intensity (0-100%) slider

**Blackout Button**
- Located in the top-right corner
- Instantly sets all outputs to 0
- Click again to restore previous values

**Settings Button (⚙)**
- Gear icon in the bottom-right corner
- Opens the configuration page

### Settings Page

**Network Output**
- Choose between sACN (E1.31) or Art-Net protocols
- Configure universe numbers and output settings
- Set output frame rate (FPS)

**Fixture Patching**
- Assign DMX addresses to each fixture
- Configure which universe each fixture uses
- Addresses are automatically validated

**Look Editor**
- Customize the name of each look
- Set target values for all fixtures in each look
- "Capture Current" button saves the current fixture state into a look

**Configuration Management**
- **Save**: Saves all settings to disk
- **Export**: Downloads configuration as a JSON file
- **Import**: Loads configuration from a JSON file
- **Reset**: Restores factory default settings

## Network Configuration

### For sACN (E1.31):
- **Multicast** (default): Automatically sends to the standard sACN multicast address
- **Unicast**: Send to specific IP addresses (enter comma-separated IPs)

### For Art-Net:
- Configure Net, Subnet, and Universe
- Set destination IP (use 255.255.255.255 for broadcast)

## Troubleshooting

**Can't access from phone/tablet:**
1. Ensure PC and mobile device are on the same WiFi network
2. Check Windows Firewall settings - you may need to allow Node.js through the firewall
3. Use the Network URL shown in the console, not localhost

**DMX output not working:**
1. Verify your network settings in the Settings page
2. Ensure the correct protocol (sACN or Art-Net) is selected
3. Check universe numbers and DMX addresses match your lighting setup
4. Verify your lighting console/gateway is on the same network

**Application won't start:**
1. Ensure Node.js is installed correctly: open Command Prompt and run `node --version`
2. Run `install.bat` again to reinstall dependencies
3. Check that no other application is using port 3001

**Changes not saving:**
1. Always click "Save Configuration" in the Settings page
2. Check the console for error messages
3. Ensure the application has write permissions to its folder

## Auto-Start on Windows Boot (Optional)

To automatically start the application when Windows starts:

1. Press `Win + R`, type `shell:startup`, and press Enter
2. Create a shortcut to `start.bat` in this folder
3. The application will now start automatically when you log in

## Technical Details

- **Server**: Node.js with Express and WebSocket
- **Client**: React single-page application
- **DMX Output**: 30 FPS default (configurable)
- **Look Blending**: Advanced color space blending for smooth transitions
- **Config Storage**: JSON file stored in `server/config.json`

## Default DMX Patching

| Fixture | Universe | Start Address | Channels |
|---------|----------|---------------|----------|
| RGB Panel 1 | 1 | 1 | R:1, G:2, B:3 |
| RGB Panel 2 | 1 | 4 | R:4, G:5, B:6 |
| Backlight PAR 1 | 1 | 7 | I:7 |
| Backlight PAR 2 | 1 | 8 | I:8 |

## Support

For issues or questions, check:
- Console output for error messages
- Network connectivity between devices
- DMX address configuration
- Firewall settings on the Windows PC

## License

Internal use for NMS faculty.
