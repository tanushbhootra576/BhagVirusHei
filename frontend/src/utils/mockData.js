// mockData.js - Provides mock data for development and testing

// Issue category options
export const ISSUE_CATEGORIES = [
    { value: 'pothole', label: 'Pothole' },
    { value: 'garbage', label: 'Garbage & Waste' },
    { value: 'streetlight', label: 'Streetlight' },
    { value: 'water', label: 'Water Supply' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'sewage', label: 'Sewage & Drainage' },
    { value: 'traffic', label: 'Traffic & Signals' },
    { value: 'vandalism', label: 'Vandalism' },
    { value: 'other', label: 'Other' }
];

// Department options
export const DEPARTMENTS = [
    { value: 'Roads & Transportation', label: 'Roads & Transportation' },
    { value: 'Waste Management', label: 'Waste Management' },
    { value: 'Electricity', label: 'Electricity' },
    { value: 'Water Supply', label: 'Water Supply' },
    { value: 'Sanitation', label: 'Sanitation' },
    { value: 'Traffic Police', label: 'Traffic Police' },
    { value: 'Municipal Administration', label: 'Municipal Administration' },
    { value: 'General Administration', label: 'General Administration' }
];

// Priority options
export const PRIORITIES = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
];

// Status options
export const STATUSES = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
];

// City areas for alert targeting
export const AREAS = [
    { id: 'sector-1', name: 'Sector 1' },
    { id: 'sector-2', name: 'Sector 2' },
    { id: 'sector-3', name: 'Sector 3' },
    { id: 'sector-4', name: 'Sector 4' },
    { id: 'sector-5', name: 'Sector 5' },
    { id: 'sector-6', name: 'Sector 6' },
    { id: 'sector-10', name: 'Sector 10' },
    { id: 'sector-11', name: 'Sector 11' },
    { id: 'sector-12', name: 'Sector 12' },
    { id: 'central-business', name: 'Central Business District' },
    { id: 'marina-beach', name: 'Marina Beach Road' },
    { id: 'anna-salai', name: 'Anna Salai' },
    { id: 'industrial-area', name: 'Industrial Area' },
    { id: 'residential-north', name: 'North Residential Zone' },
    { id: 'residential-south', name: 'South Residential Zone' },
    { id: 'residential-east', name: 'East Residential Zone' },
    { id: 'residential-west', name: 'West Residential Zone' }
];

// Chennai-specific areas
export const CHENNAI_AREAS = [
    { id: 'tnagar', name: 'T. Nagar' },
    { id: 'mylapore', name: 'Mylapore' },
    { id: 'adyar', name: 'Adyar' },
    { id: 'anna-salai', name: 'Anna Salai (Mount Road)' },
    { id: 'velachery', name: 'Velachery' },
    { id: 'tambaram', name: 'Tambaram' },
    { id: 'koyambedu', name: 'Koyambedu' },
    { id: 'perambur', name: 'Perambur' },
    { id: 'chromepet', name: 'Chromepet' },
    { id: 'royapettah', name: 'Royapettah' },
    { id: 'guindy', name: 'Guindy' },
    { id: 'ecr', name: 'ECR (Neelankarai)' },
    { id: 'omr', name: 'OMR (Sholinganallur)' },
    { id: 'marina', name: 'Marina Beach' }
];

// Generate random date within last 30 days
const getRandomDate = () => {
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

// Mock pending issues
export const MOCK_PENDING_ISSUES = [
    {
        id: 'PI001',
        title: 'Large pothole on MG Road near City Mall',
        description: 'There is a large pothole approximately 2 feet wide that is causing traffic congestion and safety hazards for vehicles.',
        category: 'pothole',
        reporter: {
            id: 'U123',
            name: 'Rahul Sharma',
            phone: '+91-9876543210',
            email: 'rahul.sharma@gmail.com'
        },
        location: {
            address: 'MG Road, Near City Mall',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            coordinates: [77.5946, 12.9716] // [longitude, latitude]
        },
        images: [
            '/images/mock/pothole1.jpg',
            '/images/mock/pothole2.jpg'
        ],
        status: 'submitted',
        priority: 'high',
        date: getRandomDate(),
        votes: 15,
        department: 'Roads & Transportation'
    },
    {
        id: 'PI002',
        title: 'Broken streetlight on Gandhi Street',
        description: 'The streetlight has been non-functional for over a week, causing security concerns in the neighborhood.',
        category: 'streetlight',
        reporter: {
            id: 'U124',
            name: 'Priya Patel',
            phone: '+91-9876543211',
            email: 'priya.patel@gmail.com'
        },
        location: {
            address: 'Gandhi Street, Near Central Park',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            coordinates: [77.2090, 28.6139] // [longitude, latitude]
        },
        images: [
            '/images/mock/streetlight1.jpg'
        ],
        status: 'submitted',
        priority: 'medium',
        date: getRandomDate(),
        votes: 7,
        department: 'Electricity'
    },
    {
        id: 'PI003',
        title: 'Garbage accumulation near residential area',
        description: 'Waste has not been collected for more than two weeks, causing health hazards and foul smell.',
        category: 'garbage',
        reporter: {
            id: 'U125',
            name: 'Arjun Singh',
            phone: '+91-9876543212',
            email: 'arjun.singh@outlook.com'
        },
        location: {
            address: 'Sector 15, Near Community Center',
            city: 'Chandigarh',
            state: 'Punjab',
            pincode: '160015',
            coordinates: [76.7794, 30.7333] // [longitude, latitude]
        },
        images: [
            '/images/mock/garbage1.jpg',
            '/images/mock/garbage2.jpg'
        ],
        status: 'submitted',
        priority: 'urgent',
        date: getRandomDate(),
        votes: 23,
        department: 'Waste Management'
    },
    {
        id: 'PI004',
        title: 'Water supply interruption in Sector 9',
        description: 'No water supply for the past 3 days in the entire sector. Residents are facing severe difficulties.',
        category: 'water',
        reporter: {
            id: 'U126',
            name: 'Neha Kapoor',
            phone: '+91-9876543213',
            email: 'neha.kapoor@yahoo.com'
        },
        location: {
            address: 'Sector 9, Block C',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201301',
            coordinates: [77.3910, 28.5355] // [longitude, latitude]
        },
        images: [
            '/images/mock/water1.jpg'
        ],
        status: 'submitted',
        priority: 'urgent',
        date: getRandomDate(),
        votes: 42,
        department: 'Water Supply'
    },
    {
        id: 'PI005',
        title: 'Traffic signal malfunction at main intersection',
        description: 'The traffic signal at the main market intersection is not working properly, causing confusion and near accidents.',
        category: 'traffic',
        reporter: {
            id: 'U127',
            name: 'Vikram Mehta',
            phone: '+91-9876543214',
            email: 'vikram.mehta@gmail.com'
        },
        location: {
            address: 'Main Market Intersection, Koramangala',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560034',
            coordinates: [77.6185, 12.9302] // [longitude, latitude]
        },
        images: [
            '/images/mock/traffic1.jpg'
        ],
        status: 'submitted',
        priority: 'high',
        date: getRandomDate(),
        votes: 19,
        department: 'Traffic Police'
    },
    {
        id: 'PI006',
        title: 'Sewage overflow on residential street',
        description: 'Sewage is overflowing onto the street causing unsanitary conditions and difficulties for residents.',
        category: 'sewage',
        reporter: {
            id: 'U128',
            name: 'Aditya Kumar',
            phone: '+91-9876543215',
            email: 'aditya.kumar@hotmail.com'
        },
        location: {
            address: 'Gali No. 5, Old City Area',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
            coordinates: [75.8241, 26.9124] // [longitude, latitude]
        },
        images: [
            '/images/mock/sewage1.jpg',
            '/images/mock/sewage2.jpg'
        ],
        status: 'submitted',
        priority: 'high',
        date: getRandomDate(),
        votes: 28,
        department: 'Sanitation'
    }
];

// Chennai-specific pending issues
export const CHENNAI_PENDING_ISSUES = [
    {
        id: 'CPI001',
        title: 'Pothole near LIC Building, Anna Salai',
        description: 'Deep pothole causing traffic slowdown and bike skids near the LIC building signal.',
        category: 'pothole',
        reporter: { id: 'UC001', name: 'Sridhar K', phone: '+91-9876501000', email: 'sridhar@example.com' },
        location: {
            address: 'Anna Salai, near LIC Building',
            city: 'Chennai', state: 'Tamil Nadu', pincode: '600002',
            coordinates: [80.2715, 13.0649]
        },
        images: ['/images/mock/chennai_pothole_anna_salai.jpg'],
        status: 'submitted', priority: 'high', date: getRandomDate(), votes: 21,
        department: 'Roads & Transportation'
    },
    {
        id: 'CPI002',
        title: 'Garbage overflow at Pondy Bazaar, T. Nagar',
        description: 'Overflowing garbage bins attracting stray animals and smell in busy shopping area.',
        category: 'garbage',
        reporter: { id: 'UC002', name: 'Meena Iyer', phone: '+91-9876501001', email: 'meena@example.com' },
        location: {
            address: 'Pondy Bazaar, T. Nagar',
            city: 'Chennai', state: 'Tamil Nadu', pincode: '600017',
            coordinates: [80.2340, 13.0418]
        },
        images: ['/images/mock/chennai_garbage_tnagar.jpg'],
        status: 'submitted', priority: 'urgent', date: getRandomDate(), votes: 33,
        department: 'Waste Management'
    },
    {
        id: 'CPI003',
        title: 'Streetlight not working, ECR Neelankarai',
        description: 'Multiple poles dark at night on ECR service road near Neelankarai bus stop.',
        category: 'streetlight',
        reporter: { id: 'UC003', name: 'Arun Prakash', phone: '+91-9876501002', email: 'arun@example.com' },
        location: {
            address: 'ECR, Neelankarai',
            city: 'Chennai', state: 'Tamil Nadu', pincode: '600115',
            coordinates: [80.2592, 12.9573]
        },
        images: ['/images/mock/chennai_streetlight_ecr.jpg'],
        status: 'submitted', priority: 'medium', date: getRandomDate(), votes: 12,
        department: 'Electricity'
    }
];

// Mock in-progress issues
export const MOCK_IN_PROGRESS_ISSUES = [
    {
        id: 'IP001',
        title: 'Damaged footpath near metro station',
        description: 'The footpath is broken in multiple places making it dangerous for pedestrians, especially elderly people.',
        category: 'other',
        reporter: {
            id: 'U130',
            name: 'Sanjay Gupta',
            phone: '+91-9876543216',
            email: 'sanjay.gupta@gmail.com'
        },
        assignedTo: {
            id: 'GO101',
            name: 'Rajesh Kumar',
            department: 'Roads & Transportation'
        },
        location: {
            address: 'Near Metro Station, Sector 18',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201301',
            coordinates: [77.3915, 28.5700] // [longitude, latitude]
        },
        images: [
            '/images/mock/footpath1.jpg'
        ],
        status: 'in-progress',
        priority: 'medium',
        date: getRandomDate(),
        votes: 11,
        department: 'Roads & Transportation',
        statusHistory: [
            {
                status: 'submitted',
                date: '2023-08-12',
                comment: 'Issue reported by citizen'
            },
            {
                status: 'in-progress',
                date: '2023-08-15',
                comment: 'Assigned to Roads & Transportation department. Team dispatched for inspection.'
            }
        ]
    },
    {
        id: 'IP002',
        title: 'Frequent power outages in residential colony',
        description: 'Power cuts lasting 3-4 hours occurring daily for the past week without any prior notice.',
        category: 'electricity',
        reporter: {
            id: 'U131',
            name: 'Meera Reddy',
            phone: '+91-9876543217',
            email: 'meera.reddy@gmail.com'
        },
        assignedTo: {
            id: 'GO102',
            name: 'Suresh Patel',
            department: 'Electricity'
        },
        location: {
            address: 'Green Valley Colony, Phase 2',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500072',
            coordinates: [78.3893, 17.4400] // [longitude, latitude]
        },
        images: [
            '/images/mock/electricity1.jpg'
        ],
        status: 'in-progress',
        priority: 'high',
        date: getRandomDate(),
        votes: 36,
        department: 'Electricity',
        statusHistory: [
            {
                status: 'submitted',
                date: '2023-08-10',
                comment: 'Issue reported by citizen'
            },
            {
                status: 'in-progress',
                date: '2023-08-11',
                comment: 'Assigned to Electricity department. Technical team is investigating the cause.'
            }
        ]
    },
    {
        id: 'IP003',
        title: 'Waterlogging after rainfall',
        description: 'Severe waterlogging on main road after rainfall making it difficult for vehicles and pedestrians.',
        category: 'sewage',
        reporter: {
            id: 'U132',
            name: 'Kabir Sharma',
            phone: '+91-9876543218',
            email: 'kabir.sharma@yahoo.com'
        },
        assignedTo: {
            id: 'GO103',
            name: 'Anjali Desai',
            department: 'Sanitation'
        },
        location: {
            address: 'Main Market Road, Near Government School',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            coordinates: [72.8277, 19.0760] // [longitude, latitude]
        },
        images: [
            '/images/mock/waterlogging1.jpg',
            '/images/mock/waterlogging2.jpg'
        ],
        status: 'in-progress',
        priority: 'urgent',
        date: getRandomDate(),
        votes: 47,
        department: 'Sanitation',
        statusHistory: [
            {
                status: 'submitted',
                date: '2023-08-05',
                comment: 'Issue reported by citizen'
            },
            {
                status: 'in-progress',
                date: '2023-08-06',
                comment: 'Assigned to Sanitation department. Drainage cleaning work has started.'
            }
        ]
    }
];

export const CHENNAI_IN_PROGRESS_ISSUES = [
    {
        id: 'CIP001',
        title: 'Water supply interruption in Velachery',
        description: 'Intermittent water supply for 4 days in Dhandeswaram Nagar, Velachery.',
        category: 'water',
        reporter: { id: 'UC010', name: 'Bhavana S', phone: '+91-9876501010', email: 'bhavana@example.com' },
        assignedTo: { id: 'GO108', name: 'Shalini Sharma', department: 'Water Supply' },
        location: { address: 'Dhandeswaram, Velachery', city: 'Chennai', state: 'Tamil Nadu', pincode: '600042', coordinates: [80.2180, 12.9797] },
        images: ['/images/mock/chennai_water_velachery.jpg'],
        status: 'in-progress', priority: 'high', date: getRandomDate(), votes: 29, department: 'Water Supply',
        statusHistory: [
            { status: 'submitted', date: getRandomDate(), comment: 'Issue reported by citizen' },
            { status: 'in-progress', date: getRandomDate(), comment: 'Assigned to Water Supply; repair scheduled' }
        ]
    },
    {
        id: 'CIP002',
        title: 'Traffic signal malfunction at Koyambedu Junction',
        description: 'Signals out of sync during peak hours causing congestion near market.',
        category: 'traffic',
        reporter: { id: 'UC011', name: 'Karthik R', phone: '+91-9876501011', email: 'karthik@example.com' },
        assignedTo: { id: 'GO101', name: 'Rajesh Kumar', department: 'Roads & Transportation' },
        location: { address: 'Koyambedu Junction', city: 'Chennai', state: 'Tamil Nadu', pincode: '600107', coordinates: [80.1999, 13.0731] },
        images: ['/images/mock/chennai_traffic_koyambedu.jpg'],
        status: 'in-progress', priority: 'medium', date: getRandomDate(), votes: 17, department: 'Traffic Police',
        statusHistory: [
            { status: 'submitted', date: getRandomDate(), comment: 'Reported by commuters' },
            { status: 'in-progress', date: getRandomDate(), comment: 'Signal contractor notified' }
        ]
    }
];

// Mock resolved issues
export const MOCK_RESOLVED_ISSUES = [
    {
        id: 'RI001',
        title: 'Broken bench in public park',
        description: 'The wooden bench in the central park is broken and poses safety risk for elderly people.',
        category: 'other',
        reporter: {
            id: 'U133',
            name: 'Deepak Verma',
            phone: '+91-9876543219',
            email: 'deepak.verma@gmail.com'
        },
        assignedTo: {
            id: 'GO104',
            name: 'Pradeep Singh',
            department: 'Municipal Administration'
        },
        location: {
            address: 'Central Park, Sector 21',
            city: 'Chandigarh',
            state: 'Punjab',
            pincode: '160022',
            coordinates: [76.8051, 30.7295] // [longitude, latitude]
        },
        images: [
            '/images/mock/bench1.jpg'
        ],
        status: 'resolved',
        priority: 'low',
        date: getRandomDate(),
        resolvedDate: getRandomDate(),
        votes: 8,
        department: 'Municipal Administration',
        statusHistory: [
            {
                status: 'submitted',
                date: '2023-07-20',
                comment: 'Issue reported by citizen'
            },
            {
                status: 'in-progress',
                date: '2023-07-22',
                comment: 'Assigned to Municipal Administration. Work order issued for repair.'
            },
            {
                status: 'resolved',
                date: '2023-07-25',
                comment: 'Bench has been repaired and reinstalled.'
            }
        ],
        resolutionDetails: {
            description: 'The bench has been repaired with new wooden planks and repainted.',
            images: ['/images/mock/bench_fixed1.jpg', '/images/mock/bench_fixed2.jpg']
        }
    },
    {
        id: 'RI002',
        title: 'Stray animals on main road',
        description: 'Stray cattle on the main road causing traffic jams and accidents.',
        category: 'other',
        reporter: {
            id: 'U134',
            name: 'Ritu Sharma',
            phone: '+91-9876543220',
            email: 'ritu.sharma@outlook.com'
        },
        assignedTo: {
            id: 'GO105',
            name: 'Nitin Joshi',
            department: 'Municipal Administration'
        },
        location: {
            address: 'GT Road, Near Bus Terminal',
            city: 'Lucknow',
            state: 'Uttar Pradesh',
            pincode: '226001',
            coordinates: [80.9462, 26.8467] // [longitude, latitude]
        },
        images: [
            '/images/mock/stray1.jpg'
        ],
        status: 'resolved',
        priority: 'medium',
        date: getRandomDate(),
        resolvedDate: getRandomDate(),
        votes: 17,
        department: 'Municipal Administration',
        statusHistory: [
            {
                status: 'submitted',
                date: '2023-07-15',
                comment: 'Issue reported by citizen'
            },
            {
                status: 'in-progress',
                date: '2023-07-16',
                comment: 'Assigned to Municipal Administration. Animal control team notified.'
            },
            {
                status: 'resolved',
                date: '2023-07-18',
                comment: 'Stray animals have been relocated to animal shelter.'
            }
        ],
        resolutionDetails: {
            description: 'Animal control team safely relocated the animals to a local shelter. Area has been monitored for 48 hours with no further incidents.',
            images: ['/images/mock/stray_resolved1.jpg']
        }
    },
    {
        id: 'RI003',
        title: 'Large pothole on highway',
        description: 'Dangerous pothole on the highway causing vehicle damage and traffic slowdowns.',
        category: 'pothole',
        reporter: {
            id: 'U135',
            name: 'Manish Tiwari',
            phone: '+91-9876543221',
            email: 'manish.tiwari@gmail.com'
        },
        assignedTo: {
            id: 'GO106',
            name: 'Ramesh Yadav',
            department: 'Roads & Transportation'
        },
        location: {
            address: 'National Highway 8, KM Marker 143',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380001',
            coordinates: [72.5714, 23.0225] // [longitude, latitude]
        },
        images: [
            '/images/mock/highway_pothole1.jpg',
            '/images/mock/highway_pothole2.jpg'
        ],
        status: 'resolved',
        priority: 'urgent',
        date: getRandomDate(),
        resolvedDate: getRandomDate(),
        votes: 53,
        department: 'Roads & Transportation',
        statusHistory: [
            {
                status: 'submitted',
                date: '2023-07-10',
                comment: 'Issue reported by citizen'
            },
            {
                status: 'in-progress',
                date: '2023-07-10',
                comment: 'Assigned to Roads & Transportation. Emergency repair scheduled.'
            },
            {
                status: 'resolved',
                date: '2023-07-11',
                comment: 'Pothole has been filled and road surface repaired.'
            }
        ],
        resolutionDetails: {
            description: 'The pothole was filled with asphalt and the surrounding area reinforced to prevent recurrence. Work completed within 24 hours of reporting.',
            images: ['/images/mock/highway_fixed1.jpg']
        }
    },
    {
        id: 'RI004',
        title: 'Tree fallen after storm',
        description: 'Large tree has fallen across the road after last night\'s storm, blocking traffic completely.',
        category: 'other',
        reporter: {
            id: 'U136',
            name: 'Sunita Agarwal',
            phone: '+91-9876543222',
            email: 'sunita.agarwal@yahoo.com'
        },
        assignedTo: {
            id: 'GO107',
            name: 'Vijay Saxena',
            department: 'Municipal Administration'
        },
        location: {
            address: 'Lake Road, Near Children\'s Park',
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            pincode: '462001',
            coordinates: [77.4126, 23.2599] // [longitude, latitude]
        },
        images: [
            '/images/mock/fallen_tree1.jpg',
            '/images/mock/fallen_tree2.jpg'
        ],
        status: 'resolved',
        priority: 'high',
        date: getRandomDate(),
        resolvedDate: getRandomDate(),
        votes: 22,
        department: 'Municipal Administration',
        statusHistory: [
            {
                status: 'submitted',
                date: '2023-07-05',
                comment: 'Issue reported by citizen'
            },
            {
                status: 'in-progress',
                date: '2023-07-05',
                comment: 'Assigned to Municipal Administration. Emergency response team dispatched.'
            },
            {
                status: 'resolved',
                date: '2023-07-05',
                comment: 'Tree has been removed and road cleared for traffic.'
            }
        ],
        resolutionDetails: {
            description: 'Emergency team removed the fallen tree within 3 hours of reporting. Road has been cleared and is now open for traffic.',
            images: ['/images/mock/cleared_road1.jpg']
        }
    }
];

export const CHENNAI_RESOLVED_ISSUES = [
    {
        id: 'CRI001',
        title: 'Sewage overflow resolved in Perambur',
        description: 'Overflow from manhole on Paper Mills Road cleared and sanitation done.',
        category: 'sewage',
        reporter: { id: 'UC020', name: 'Revathi P', phone: '+91-9876501020', email: 'revathi@example.com' },
        assignedTo: { id: 'GO103', name: 'Anjali Desai', department: 'Sanitation' },
        location: { address: 'Paper Mills Road, Perambur', city: 'Chennai', state: 'Tamil Nadu', pincode: '600011', coordinates: [80.2376, 13.1143] },
        images: ['/images/mock/chennai_sewage_perambur_before.jpg'],
        status: 'resolved', priority: 'high', date: getRandomDate(), resolvedDate: getRandomDate(), votes: 14, department: 'Sanitation',
        statusHistory: [
            { status: 'submitted', date: getRandomDate(), comment: 'Issue reported' },
            { status: 'in-progress', date: getRandomDate(), comment: 'Jetting truck deployed' },
            { status: 'resolved', date: getRandomDate(), comment: 'Area disinfected' }
        ],
        resolutionDetails: { description: 'Blockage cleared; line flushed; area sanitized.', images: ['/images/mock/chennai_sewage_perambur_after.jpg'] }
    },
    {
        id: 'CRI002',
        title: 'Broken railing fixed at Marina Beach promenade',
        description: 'Damaged railing section repaired and painted.',
        category: 'other',
        reporter: { id: 'UC021', name: 'Naveen', phone: '+91-9876501021', email: 'naveen@example.com' },
        assignedTo: { id: 'GO104', name: 'Pradeep Singh', department: 'Municipal Administration' },
        location: { address: 'Marina Beach Promenade', city: 'Chennai', state: 'Tamil Nadu', pincode: '600005', coordinates: [80.2824, 13.0499] },
        images: ['/images/mock/chennai_marina_before.jpg'],
        status: 'resolved', priority: 'low', date: getRandomDate(), resolvedDate: getRandomDate(), votes: 9, department: 'Municipal Administration',
        statusHistory: [
            { status: 'submitted', date: getRandomDate(), comment: 'Issue reported' },
            { status: 'in-progress', date: getRandomDate(), comment: 'Repair crew scheduled' },
            { status: 'resolved', date: getRandomDate(), comment: 'Railing restored' }
        ],
        resolutionDetails: { description: 'New railing installed and painted to match.', images: ['/images/mock/chennai_marina_after.jpg'] }
    }
];

// Mock alerts
export const MOCK_ALERTS = [
    {
        id: 'AL001',
        title: 'Planned Water Supply Interruption',
        description: 'Water supply will be interrupted on July 15, 2023 from 10:00 AM to 4:00 PM due to maintenance work at the main water treatment plant. Please store water accordingly.',
        type: 'planned',
        severity: 'medium',
        affectedAreas: ['Sector 10', 'Sector 11', 'Sector 12'],
        startDate: '2023-07-15T10:00:00',
        endDate: '2023-07-15T16:00:00',
        department: 'Water Supply',
        isActive: true,
        createdBy: {
            id: 'GO101',
            name: 'Rajesh Kumar'
        },
        createdAt: '2023-07-10T09:30:00'
    },
    {
        id: 'AL002',
        title: 'Heavy Rainfall Warning',
        description: 'Meteorological Department has issued a heavy rainfall warning for the next 48 hours. Citizens are advised to avoid unnecessary travel and stay indoors. Emergency services are on high alert.',
        type: 'emergency',
        severity: 'high',
        affectedAreas: ['Entire City'],
        startDate: '2023-07-20T00:00:00',
        endDate: '2023-07-22T00:00:00',
        department: 'Disaster Management',
        isActive: true,
        createdBy: {
            id: 'GO102',
            name: 'Suresh Patel'
        },
        createdAt: '2023-07-19T18:45:00'
    },
    {
        id: 'AL003',
        title: 'Road Closure for Marathon',
        description: 'Main City Road will be closed for the Annual Marathon from 6:00 AM to 11:00 AM on July 25, 2023. Please use alternate routes during this time.',
        type: 'planned',
        severity: 'low',
        affectedAreas: ['Central Business District', 'Marina Beach Road', 'Anna Salai'],
        startDate: '2023-07-25T06:00:00',
        endDate: '2023-07-25T11:00:00',
        department: 'Traffic Police',
        isActive: true,
        createdBy: {
            id: 'GO103',
            name: 'Anjali Desai'
        },
        createdAt: '2023-07-18T14:20:00'
    },
    {
        id: 'AL004',
        title: 'Garbage Collection Schedule Change',
        description: 'Due to upcoming festive season, garbage collection in residential areas will be done in the evening (4:00 PM to 8:00 PM) instead of morning for the next two weeks starting August 1, 2023.',
        type: 'information',
        severity: 'low',
        affectedAreas: ['All Residential Areas'],
        startDate: '2023-08-01T00:00:00',
        endDate: '2023-08-15T00:00:00',
        department: 'Waste Management',
        isActive: true,
        createdBy: {
            id: 'GO104',
            name: 'Pradeep Singh'
        },
        createdAt: '2023-07-25T10:15:00'
    },
    {
        id: 'AL005',
        title: 'Scheduled Power Outage',
        description: 'There will be a scheduled power outage for maintenance of electrical substations on July 30, 2023 from 2:00 AM to 6:00 AM.',
        type: 'planned',
        severity: 'medium',
        affectedAreas: ['Industrial Area', 'Sector 5', 'Sector 6'],
        startDate: '2023-07-30T02:00:00',
        endDate: '2023-07-30T06:00:00',
        department: 'Electricity',
        isActive: true,
        createdBy: {
            id: 'GO105',
            name: 'Nitin Joshi'
        },
        createdAt: '2023-07-23T11:30:00'
    }
];

// Mock analytics data
export const MOCK_ANALYTICS = {
    issueCounts: {
        total: 245,
        pending: 68,
        inProgress: 59,
        resolved: 112,
        rejected: 6
    },
    categoryDistribution: [
        { category: 'pothole', count: 57 },
        { category: 'garbage', count: 42 },
        { category: 'streetlight', count: 39 },
        { category: 'water', count: 28 },
        { category: 'electricity', count: 25 },
        { category: 'sewage', count: 20 },
        { category: 'traffic', count: 15 },
        { category: 'vandalism', count: 8 },
        { category: 'other', count: 11 }
    ],
    monthlyTrends: [
        { month: 'Jan', submitted: 15, resolved: 12 },
        { month: 'Feb', submitted: 18, resolved: 14 },
        { month: 'Mar', submitted: 22, resolved: 16 },
        { month: 'Apr', submitted: 19, resolved: 18 },
        { month: 'May', submitted: 25, resolved: 20 },
        { month: 'Jun', submitted: 28, resolved: 22 },
        { month: 'Jul', submitted: 32, resolved: 25 },
        { month: 'Aug', submitted: 30, resolved: 24 }
    ],

    // Dashboard data for the new analytics dashboard
    dashboardData: {
        totalIssues: {
            current: 245,
            previous: 210,
            percentChange: { value: 16.7, isPositive: true }
        },
        resolvedIssues: {
            current: 112,
            previous: 95,
            percentChange: { value: 17.9, isPositive: true }
        },
        resolutionRate: {
            current: 45.7,
            previous: 42.1,
            percentChange: { value: 8.6, isPositive: true }
        },
        avgResolutionTime: {
            current: 4.2,
            previous: 5.1,
            percentChange: { value: 17.6, isPositive: false }
        },
        issuesByCategory: [
            { name: 'Potholes', count: 57, percentage: 23, color: '#4338CA' },
            { name: 'Garbage & Waste', count: 42, percentage: 17, color: '#10B981' },
            { name: 'Streetlights', count: 39, percentage: 16, color: '#F97316' },
            { name: 'Water Supply', count: 28, percentage: 11, color: '#06B6D4' },
            { name: 'Electricity', count: 25, percentage: 10, color: '#F59E0B' },
            { name: 'Sewage', count: 20, percentage: 8, color: '#8B5CF6' },
            { name: 'Traffic', count: 15, percentage: 6, color: '#EC4899' },
            { name: 'Others', count: 19, percentage: 9, color: '#6B7280' }
        ],
        issueTrend: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            reported: [18, 24, 32, 28],
            resolved: [12, 18, 27, 20],
            maxValue: 35
        },
        departmentPerformance: [
            { id: 'roads', name: 'Roads & Transportation', totalIssues: 68, resolvedIssues: 42, avgResolutionTime: 3.8, performanceScore: 85 },
            { id: 'waste', name: 'Waste Management', totalIssues: 45, resolvedIssues: 23, avgResolutionTime: 4.2, performanceScore: 75 },
            { id: 'electricity', name: 'Electricity', totalIssues: 32, resolvedIssues: 18, avgResolutionTime: 3.5, performanceScore: 80 },
            { id: 'water', name: 'Water Supply', totalIssues: 28, resolvedIssues: 12, avgResolutionTime: 5.1, performanceScore: 65 },
            { id: 'sanitation', name: 'Sanitation', totalIssues: 25, resolvedIssues: 9, avgResolutionTime: 6.2, performanceScore: 55 },
            { id: 'traffic', name: 'Traffic Police', totalIssues: 15, resolvedIssues: 8, avgResolutionTime: 2.9, performanceScore: 78 }
        ],
        citizenSatisfaction: 72,
        satisfactionBreakdown: {
            verySatisfied: 18,
            satisfied: 54,
            neutral: 19,
            dissatisfied: 7,
            veryDissatisfied: 2
        }
    },

    // Monthly data for trends
    monthlyLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    monthlyReported: [15, 18, 22, 19, 25, 28, 32, 30],
    monthlyResolved: [12, 14, 16, 18, 20, 22, 25, 24],

    // Weekly data for trends
    weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weeklyReported: [5, 8, 12, 9, 7, 4, 3],
    weeklyResolved: [4, 6, 9, 8, 6, 3, 2],

    // Yearly data for trends
    yearlyLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yearlyReported: [45, 52, 60, 58, 65, 70, 75, 72, 68, 63, 58, 55],
    yearlyResolved: [38, 45, 50, 52, 58, 62, 65, 64, 60, 56, 50, 48],

    resolutionTimes: {
        average: 4.2, // days
        byPriority: [
            { priority: 'low', days: 6.5 },
            { priority: 'medium', days: 4.8 },
            { priority: 'high', days: 2.3 },
            { priority: 'urgent', days: 1.1 }
        ],
        byCategory: [
            { category: 'pothole', days: 3.8 },
            { category: 'garbage', days: 2.5 },
            { category: 'streetlight', days: 4.2 },
            { category: 'water', days: 1.9 },
            { category: 'electricity', days: 2.1 },
            { category: 'sewage', days: 3.5 },
            { category: 'traffic', days: 2.8 },
            { category: 'vandalism', days: 5.6 },
            { category: 'other', days: 4.9 }
        ]
    },
    geographicalDistribution: {
        topLocations: [
            { name: 'Anna Salai', count: 30 },
            { name: 'T. Nagar', count: 27 },
            { name: 'Velachery', count: 24 },
            { name: 'Marina Beach', count: 20 },
            { name: 'Koyambedu', count: 18 }
        ],
        citywide: {
            north: 65,
            south: 72,
            east: 48,
            west: 60
        }
    },
    citizenEngagement: {
        totalUsers: 1250,
        activeUsers: 685,
        reportingUsers: 248,
        averageVotesPerIssue: 8.5
    }
};

// Mock notifications
export const MOCK_NOTIFICATIONS = [
    {
        id: 'N001',
        userId: 'U123',
        title: 'Issue Status Update',
        message: 'Your reported issue "Large pothole on MG Road" has been assigned to Roads & Transportation department.',
        type: 'issue_update',
        referenceId: 'PI001',
        isRead: false,
        createdAt: '2023-08-18T09:45:00'
    },
    {
        id: 'N002',
        userId: 'U123',
        title: 'New Alert in Your Area',
        message: 'New alert: Heavy Rainfall Warning has been issued for your area.',
        type: 'alert',
        referenceId: 'AL002',
        isRead: true,
        createdAt: '2023-08-17T18:30:00'
    },
    {
        id: 'N003',
        userId: 'U123',
        title: 'Issue Resolved',
        message: 'Your reported issue "Broken bench in public park" has been resolved. Please check the resolution details.',
        type: 'issue_update',
        referenceId: 'RI001',
        isRead: false,
        createdAt: '2023-08-15T14:20:00'
    },
    {
        id: 'N004',
        userId: 'U123',
        title: 'Comment on Your Issue',
        message: 'A government official has added a comment to your issue "Water supply interruption in Sector 9".',
        type: 'issue_comment',
        referenceId: 'PI004',
        isRead: true,
        createdAt: '2023-08-14T11:10:00'
    },
    {
        id: 'N005',
        userId: 'U123',
        title: 'Issue Status Update',
        message: 'Your reported issue "Garbage accumulation near residential area" status has been changed to "In Progress".',
        type: 'issue_update',
        referenceId: 'PI003',
        isRead: false,
        createdAt: '2023-08-12T16:45:00'
    },
    {
        id: 'N006',
        userId: 'U123',
        title: 'Survey Request',
        message: 'Please take a moment to complete a short survey about your recent issue resolution experience.',
        type: 'survey',
        referenceId: 'SV001',
        isRead: true,
        createdAt: '2023-08-10T09:30:00'
    },
    {
        id: 'N007',
        userId: 'U123',
        title: 'New Feature Available',
        message: 'You can now track the live status of your reported issues with our new tracking feature!',
        type: 'system',
        referenceId: null,
        isRead: false,
        createdAt: '2023-08-05T10:15:00'
    }
];

// Mock government officials
export const MOCK_GOVERNMENT_OFFICIALS = [
    {
        id: 'GO101',
        name: 'Rajesh Kumar',
        department: 'Roads & Transportation',
        position: 'Senior Engineer',
        email: 'rajesh.kumar@gov.in',
        phone: '+91-9876500101'
    },
    {
        id: 'GO102',
        name: 'Suresh Patel',
        department: 'Electricity',
        position: 'Chief Engineer',
        email: 'suresh.patel@gov.in',
        phone: '+91-9876500102'
    },
    {
        id: 'GO103',
        name: 'Anjali Desai',
        department: 'Sanitation',
        position: 'Deputy Director',
        email: 'anjali.desai@gov.in',
        phone: '+91-9876500103'
    },
    {
        id: 'GO104',
        name: 'Pradeep Singh',
        department: 'Municipal Administration',
        position: 'Administrative Officer',
        email: 'pradeep.singh@gov.in',
        phone: '+91-9876500104'
    },
    {
        id: 'GO105',
        name: 'Nitin Joshi',
        department: 'Municipal Administration',
        position: 'Field Supervisor',
        email: 'nitin.joshi@gov.in',
        phone: '+91-9876500105'
    },
    {
        id: 'GO106',
        name: 'Ramesh Yadav',
        department: 'Roads & Transportation',
        position: 'Maintenance Engineer',
        email: 'ramesh.yadav@gov.in',
        phone: '+91-9876500106'
    },
    {
        id: 'GO107',
        name: 'Vijay Saxena',
        department: 'Municipal Administration',
        position: 'Emergency Response Coordinator',
        email: 'vijay.saxena@gov.in',
        phone: '+91-9876500107'
    },
    {
        id: 'GO108',
        name: 'Shalini Sharma',
        department: 'Water Supply',
        position: 'Technical Specialist',
        email: 'shalini.sharma@gov.in',
        phone: '+91-9876500108'
    }
];

// Export all mock data
export const mockData = {
    pendingIssues: [...MOCK_PENDING_ISSUES, ...CHENNAI_PENDING_ISSUES],
    inProgressIssues: [...MOCK_IN_PROGRESS_ISSUES, ...CHENNAI_IN_PROGRESS_ISSUES],
    resolvedIssues: [...MOCK_RESOLVED_ISSUES, ...CHENNAI_RESOLVED_ISSUES],
    alerts: MOCK_ALERTS,
    analytics: MOCK_ANALYTICS,
    notifications: MOCK_NOTIFICATIONS,
    officials: MOCK_GOVERNMENT_OFFICIALS,
    categories: ISSUE_CATEGORIES,
    departments: [...DEPARTMENTS, { value: 'Greater Chennai Corporation', label: 'Greater Chennai Corporation' }],
    priorities: PRIORITIES,
    statuses: STATUSES,
    areas: [...AREAS, ...CHENNAI_AREAS]
};

export default mockData;
