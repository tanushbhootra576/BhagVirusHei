import React from 'react';

const svgProps = (size = 20, className = '') => ({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className
});

export const IconDashboard = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
    </svg>
);

export const IconNotes = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
    </svg>
);

export const IconBell = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 17H9a5 5 0 0 1-5-5V9a7 7 0 0 1 14 0v3a5 5 0 0 1-5 5z" />
        <path d="M9 21h6" />
    </svg>
);

export const IconPlus = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export const IconHourglass = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12M6 21h12" />
        <path d="M7 3c0 5 10 5 10 10s-10 5-10 10" />
    </svg>
);

export const IconBuilding = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M8 14h.01"></path>
        <path d="M16 14h.01"></path>
    </svg>
);

export const IconCertificate = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15l3 3m0 0l3 3m-3-3l-3 3m-3-3l-3 3"></path>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
);

export const IconShield = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

export const IconCheckCircle = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
);

export const IconChart = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16" />
        <rect x="6" y="10" width="3" height="7" rx="1" />
        <rect x="11" y="6" width="3" height="11" rx="1" />
        <rect x="16" y="13" width="3" height="4" rx="1" />
    </svg>
);

export const IconAlert = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l9 16H3l9-16z" />
        <path d="M12 10v4" />
        <path d="M12 18h.01" />
    </svg>
);

export const IconUser = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c2-4 6-6 8-6s6 2 8 6" />
    </svg>
);

export const IconSettings = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0A1.65 1.65 0 0 0 20.91 11H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

export const IconLocation = ({ size = 18, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
);

export const IconSun = ({ size = 18, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5L19 19M19 5l1.5-1.5M5 19l-1.5 1.5" />
    </svg>
);

export const IconMoon = ({ size = 18, className = '' }) => (
    <svg {...svgProps(size, className)} fill="currentColor">
        <path d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79z" />
    </svg>
);

export const IconCamera = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

export const IconSearch = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
    </svg>
);

export const IconHandshake = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l4-4 5 5 3-3 6 6" />
        <path d="M8 8l4-4 4 4" />
    </svg>
);

export const IconCalendar = ({ size = 18, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
);

export const IconThumbUp = ({ size = 18, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-6 0v4" />
        <path d="M5 9h14l-1.5 8.5a2 2 0 0 1-2 1.5H8a3 3 0 0 1-3-3V9z" />
    </svg>
);

export const IconMessage = ({ size = 18, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
);

export const IconDownload = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const IconRefresh = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23,4 23,10 17,10" />
        <polyline points="1,20 1,14 7,14" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
);

export const IconEye = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const IconFilter = ({ size = 20, className = '' }) => (
    <svg {...svgProps(size, className)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
    </svg>
);

export default {
    IconDashboard,
    IconNotes,
    IconBell,
    IconPlus,
    IconHourglass,
    IconCheckCircle,
    IconChart,
    IconAlert,
    IconUser,
    IconSettings,
    IconLocation,
    IconSun,
    IconMoon,
    IconCamera,
    IconSearch,
    IconHandshake,
    IconCalendar,
    IconThumbUp,
    IconMessage,
    IconDownload,
    IconRefresh,
    IconEye,
    IconFilter
};
