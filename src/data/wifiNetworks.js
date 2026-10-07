export const INITIAL_COMPANY_WIFIS = [
  {
    id: 'WIFI-01',
    ssid: 'NEXORA-CORP-5G',
    location: 'HQ Main Campus (San Francisco)',
    bssid: '74:83:C2:11:A9:01',
    ipRange: '192.168.1.0/24',
    security: 'WPA3 Enterprise',
    isPrimary: true,
    speed: '650 Mbps',
    attendanceEnabled: true,
    description: 'Executive & Staff primary workstation router'
  },
  {
    id: 'WIFI-02',
    ssid: 'NEXORA-OFFICE-SECURE',
    location: 'Engineering Hub (Austin Wing B)',
    bssid: 'B0:4E:26:99:43:12',
    ipRange: '192.168.10.0/24',
    security: 'WPA3 Enterprise',
    isPrimary: false,
    speed: '500 Mbps',
    attendanceEnabled: true,
    description: 'Austin branch engineering floor access point'
  },
  {
    id: 'WIFI-03',
    ssid: 'NEXORA-CAMPUS-WIFI',
    location: 'R&D Innovation Center',
    bssid: 'A2:18:7C:55:82:34',
    ipRange: '192.168.20.0/24',
    security: 'WPA3 Enterprise',
    isPrimary: false,
    speed: '450 Mbps',
    attendanceEnabled: true,
    description: 'R&D prototyping labs & hardware testbed'
  },
  {
    id: 'WIFI-04',
    ssid: 'NEXORA-OFFICE-GUEST',
    location: 'HQ Visitor Lobby & Cafeteria',
    bssid: 'C4:71:FE:22:90:54',
    ipRange: '192.168.100.0/24',
    security: 'WPA2 Personal (Restricted)',
    isPrimary: false,
    speed: '150 Mbps',
    attendanceEnabled: false,
    description: 'Company visitor & public lobby network (Attendance Disabled by Admin)'
  }
];

export const AVAILABLE_SIMULATION_NETWORKS = [
  {
    ssid: 'NEXORA-CORP-5G',
    label: 'NEXORA-CORP-5G (HQ Office)',
    location: 'Headquarters, San Francisco',
    ip: '192.168.1.142',
    bssid: '74:83:C2:11:A9:01',
    security: 'WPA3 Enterprise',
    isCompanyWifi: true,
    signalStrength: 96,
    speedMbps: 650,
    type: 'company'
  },
  {
    ssid: 'NEXORA-OFFICE-SECURE',
    label: 'NEXORA-OFFICE-SECURE (Tech Hub)',
    location: 'Austin Tech Hub Wing B',
    ip: '192.168.10.88',
    bssid: 'B0:4E:26:99:43:12',
    security: 'WPA3 Enterprise',
    isCompanyWifi: true,
    signalStrength: 92,
    speedMbps: 500,
    type: 'company'
  },
  {
    ssid: 'NEXORA-CAMPUS-WIFI',
    label: 'NEXORA-CAMPUS-WIFI (R&D Lab)',
    location: 'R&D Innovation Lab',
    ip: '192.168.20.45',
    bssid: 'A2:18:7C:55:82:34',
    security: 'WPA3 Enterprise',
    isCompanyWifi: true,
    signalStrength: 88,
    speedMbps: 450,
    type: 'company'
  },
  {
    ssid: 'NEXORA-OFFICE-GUEST',
    label: 'NEXORA-OFFICE-GUEST (Company Lobby)',
    location: 'HQ Visitor Lobby & Cafeteria',
    ip: '192.168.100.22',
    bssid: 'C4:71:FE:22:90:54',
    security: 'WPA2 Personal (Restricted)',
    isCompanyWifi: true,
    signalStrength: 85,
    speedMbps: 150,
    type: 'company'
  },
  {
    ssid: 'Home_Fiber_5G',
    label: 'Home_Fiber_5G (Personal Home WiFi)',
    location: 'Remote Residential Network',
    ip: '10.0.0.12',
    bssid: '58:D9:D5:81:42:19',
    security: 'WPA2 Personal',
    isCompanyWifi: false,
    signalStrength: 80,
    speedMbps: 100,
    type: 'home'
  },
  {
    ssid: 'Jio_5G_Mobile_Hotspot',
    label: 'Jio_5G_Mobile_Hotspot (Personal Cellular Hotspot)',
    location: 'Cellular / Outside Office',
    ip: '192.168.43.15',
    bssid: '32:9F:88:22:90:BB',
    security: 'WPA2 Mobile Hotspot',
    isCompanyWifi: false,
    signalStrength: 65,
    speedMbps: 45,
    type: 'mobile'
  },
  {
    ssid: 'Cafe_Coffee_Day_Guest',
    label: 'Cafe_Coffee_Day_Guest (Public WiFi)',
    location: 'Public Commercial Cafe',
    ip: '172.16.0.4',
    bssid: '88:76:54:32:10:AA',
    security: 'Open Network (Unsecured)',
    isCompanyWifi: false,
    signalStrength: 55,
    speedMbps: 20,
    type: 'public'
  }
];
