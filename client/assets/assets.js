import user_image from './user-image.webp';
import code_icon from './code-icon.png';
import code_icon_dark from './code-icon-dark.png';
import edu_icon from './edu-icon.png';
import edu_icon_dark from './edu-icon-dark.png';
import experience_icon from './experience-icon.png';
import experience_icon_dark from './experience-icon-dark.png';
import vscode from './vscode.png';
import right_arrow_white from './right-arrow-white.png';
import logo from './logo.png';
import logo_dark from './logo_dark.png';
import mail_icon from './mail_icon.png';
import mail_icon_dark from './mail_icon_dark.png';
import profile_img from './profile-img.png';
import download_icon from './download-icon.png';
import hand_icon from './hand-icon.png';
import header_bg_color from './header-bg-color.png';
import moon_icon from './moon_icon.png';
import sun_icon from './sun_icon.png';
import arrow_icon from './arrow-icon.png';
import arrow_icon_dark from './arrow-icon-dark.png';
import menu_black from './menu-black.png';
import menu_white from './menu-white.png';
import close_black from './close-black.png';
import close_white from './close-white.png';
import right_arrow from './right-arrow.png';
import send_icon from './send-icon.png';
import right_arrow_bold from './right-arrow-bold.png';
import right_arrow_bold_dark from './right-arrow-bold-dark.png';
import activity_icon from './activity-icon.png';
import activity_icon_dark from './activity-icon-dark.png';
import ansys from './ansys.png';
import solidworks from './solidworks.png';
import matlab from './matlab.png';
import dassault from './dassault.png';
import jira from './jira.png';
import wrike from './wrike.png';
import tableau from './tableau.png';
import microsoft from './microsoft.png';
import power_bi from './power-bi.png';
import certificate_icon from './certificate-icon.png';
import certificate_icon_dark from './certificate-icon-dark.png';
import language_icon from './language-icon.png';
import language_icon_dark from './language-icon-dark.png';
import website_designing from './website-designing.png';
import data_visualization from './data-visualization.png';
import video_editing from './video-editing.png';
import fea_simulation from './fea-simulation.png';
import cad_modeling from './cad-modeling.png';
import backend_programming from './backend-programming.png';
import github_logo from './github-logo.png';
import github_logo_dark from './github-logo-dark.png';
import linkendin_logo from './linkendin-logo.png';
import linkendin_logo_dark from './linkendin-logo-dark.png';
import location from './location.png';
import location_dark from './location-dark.png';
import phone from './phone.png';
import phone_dark from './phone-dark.png';
import download_icon_dark from './download-icon-dark.png';
import right_arrow_light from './right-arrow-light.png';

export const assets = {
    user_image,
    code_icon,
    code_icon_dark,
    edu_icon,
    edu_icon_dark,
    experience_icon,
    experience_icon_dark,
    vscode,
    right_arrow_white,
    logo,
    logo_dark,
    mail_icon,
    mail_icon_dark,
    profile_img,
    download_icon,
    hand_icon,
    header_bg_color,
    moon_icon,
    sun_icon,
    arrow_icon,
    arrow_icon_dark,
    menu_black,
    menu_white,
    close_black,
    close_white,
    right_arrow,
    send_icon,
    right_arrow_bold,
    right_arrow_bold_dark,
    activity_icon,
    activity_icon_dark,
    ansys,
    solidworks,
    matlab,
    dassault,
    jira,
    wrike,
    tableau,
    microsoft,
    power_bi,
    certificate_icon,
    certificate_icon_dark,
    language_icon,
    language_icon_dark,
    website_designing,
    data_visualization,
    video_editing,
    fea_simulation,
    cad_modeling,
    backend_programming,
    linkendin_logo,
    linkendin_logo_dark,
    github_logo,
    github_logo_dark,
    location,
    location_dark,
    phone,
    phone_dark,
    download_icon_dark,
    right_arrow_light,
};

export const workData = [
    {
        slug: 'cad-modeling',
        title: 'CAD Modeling',
        description: 'Modelling 3D Designs',
        bgImage: '/work-1.webp',
        tools: ['SolidWorks', 'CATIA'],
    },
    {
        slug: 'fea-simulation',
        title: 'FEA Simulation',
        description: 'Structural Analysis',
        bgImage: '/work-2.webp',
        tools: ['Abaqus', 'ANSYS'],
    },
    {
        slug: 'frontend-project',
        title: 'Frontend Project',
        description: 'Web Design',
        bgImage: '/work-3.webp',
        tools: ['Next.js', 'Tailwind'],
    },
    {
        slug: 'data-visualization',
        title: 'Data Visualization',
        description: 'Analysing Data',
        bgImage: '/work-4.webp',
        tools: ['Tableau', 'Power BI'],
    },
    {
        slug: 'video-editing',
        title: 'Video Editing',
        description: 'Promotional Video',
        bgImage: '/work-5.webp',
        tools: ['Premiere Pro', 'After Effects'],
    },
];

/*
  `image`: background for the expanding service panels.
  - Temporary: reusing the existing optimized images in /public (work-1.webp ... work-5.webp).
  - Later: put your own renders in /public/services/ and change the paths,
    e.g. image: '/services/cad-modeling.jpg'
  - Set image: null to show the gradient fallback (Backend Programming does this for now).
  `tools`: chips shown on the expanded panel (the component shows the first 4).
*/
export const serviceData = [
    {
        icon: assets.cad_modeling,
        title: 'CAD Modeling',
        description: 'Creating 3D models and technical drawings...',
        link: 'cad-modeling',
        image: '/work-1.webp',
        tools: ['SolidWorks', 'CATIA', 'AutoCAD'],
        detailedDescription: 'I provide comprehensive CAD modeling services using industry-standard software like SolidWorks and Dassault Systèmes tools. Whether you need product design, mechanical parts, or complex assemblies, I deliver precise and manufacturable 3D models.',
        includes: [
            '3D parametric modeling',
            'Assembly design and validation',
            'Technical drawings and documentation',
            'File conversion (STEP, IGES, STL, etc.)',
            'Design for manufacturing (DFM) consultation'
        ],
        process: [
            { title: 'Requirements Gathering', description: 'Understanding your specifications and design intent' },
            { title: '3D Modeling', description: 'Creating detailed CAD models with parametric features' },
            { title: 'Review & Iteration', description: 'Presenting designs and incorporating your feedback' },
            { title: 'Final Delivery', description: 'Providing models in required formats with documentation' }
        ]
    },
    {
        icon: assets.fea_simulation,
        title: 'FEA Simulation',
        description: 'Performing Finite Element Analysis for structural simulation...',
        link: 'fea-simulation',
        image: '/work-2.webp',
        tools: ['ANSYS', 'Abaqus', 'COMSOL'],
        detailedDescription: 'Comprehensive FEA services using ANSYS to validate and optimize your designs. I perform stress analysis, thermal analysis, modal analysis, and more to ensure your products meet safety and performance requirements.',
        includes: [
            'Static structural analysis',
            'Thermal analysis',
            'Modal and dynamic analysis',
            'Fatigue and failure analysis',
            'Detailed reports with visualizations'
        ],
        process: [
            { title: 'Model Preparation', description: 'Simplifying and meshing your CAD geometry' },
            { title: 'Analysis Setup', description: 'Applying loads, constraints, and material properties' },
            { title: 'Simulation', description: 'Running analyses and validating results' },
            { title: 'Reporting', description: 'Delivering comprehensive analysis reports' }
        ]
    },
    {
        icon: assets.backend_programming,
        title: 'Backend Programming',
        description: 'Solving complex problems through efficient backend solutions...',
        link: 'backend-programming',
        image: null,
        tools: ['Python', 'MATLAB', 'NumPy', 'Pandas'],
        detailedDescription: 'I develop custom backend solutions, automation scripts, and APIs tailored to engineering and business needs. Specializing in Python, MATLAB, and modern web technologies.',
        includes: [
            'Custom automation scripts',
            'API development and integration',
            'Database design and optimization',
            'Engineering calculations tools',
            'System integration solutions'
        ],
        process: [
            { title: 'Discovery', description: 'Understanding your workflow and automation needs' },
            { title: 'Development', description: 'Building and testing the solution' },
            { title: 'Deployment', description: 'Implementation and training' },
            { title: 'Support', description: 'Ongoing maintenance and updates' }
        ]
    },
    {
        icon: assets.website_designing,
        title: 'Web design',
        description: 'Developing websites and web applications...',
        link: 'web-design',
        image: '/work-3.webp',
        tools: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
        detailedDescription: 'Creating modern, responsive websites and web applications that deliver exceptional user experiences. From landing pages to full-stack applications, I build solutions that work.',
        includes: [
            'Responsive web design',
            'Frontend development',
            'UI/UX optimization',
            'Performance optimization',
            'Cross-browser compatibility'
        ],
        process: [
            { title: 'Planning', description: 'Understanding your goals and target audience' },
            { title: 'Design', description: 'Creating wireframes and visual designs' },
            { title: 'Development', description: 'Building the website with modern technologies' },
            { title: 'Launch', description: 'Deploying and monitoring the live site' }
        ]
    },
    {
        icon: assets.data_visualization,
        title: 'Data Visualization',
        description: 'Bringing data to life through interactive visualizations...',
        link: 'data-visualization',
        image: '/work-4.webp',
        tools: ['Tableau', 'Power BI', 'Matplotlib'],
        detailedDescription: 'Transform complex data into clear, actionable insights using Tableau, Power BI, and custom visualization solutions. I help you make data-driven decisions with confidence.',
        includes: [
            'Interactive dashboards',
            'Custom data visualizations',
            'Business intelligence reports',
            'Data analysis and insights',
            'Automated reporting systems'
        ],
        process: [
            { title: 'Data Assessment', description: 'Understanding your data sources and goals' },
            { title: 'Design', description: 'Creating effective visualization strategies' },
            { title: 'Development', description: 'Building interactive dashboards and reports' },
            { title: 'Training', description: 'Helping your team use the tools effectively' }
        ]
    },
    {
        icon: assets.video_editing,
        title: 'Video Editing',
        description: 'Editing and producing high-quality video content...',
        link: 'video-editing',
        image: '/work-5.webp',
        tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
        detailedDescription: 'Professional video editing services for promotional content, tutorials, presentations, and more. I create engaging videos that capture attention and deliver your message effectively.',
        includes: [
            'Video cutting and trimming',
            'Color correction and grading',
            'Audio editing and mixing',
            'Motion graphics and titles',
            'Export in multiple formats'
        ],
        process: [
            { title: 'Brief', description: 'Understanding your video goals and requirements' },
            { title: 'Editing', description: 'Crafting your story through precise editing' },
            { title: 'Review', description: 'Incorporating your feedback and revisions' },
            { title: 'Delivery', description: 'Providing final videos in required formats' }
        ]
    },
];

export const serviceIntro =
    'Mechanical engineering services including CAD modeling, FEA analysis, and programming.';

export const infoList = [
    { icon: assets.edu_icon, iconDark: assets.edu_icon_dark, title: 'Education', description: 'B.E. Mechanical Engineering from NED UET' },
    { icon: assets.experience_icon, iconDark: assets.experience_icon_dark, title: 'Electives', description: 'AI & IoT \n Plant Maintenance \n Project Management ' },
    { icon: assets.activity_icon, iconDark: assets.activity_icon_dark, title: 'Activities', description: 'Group Leader - AI & IOT Exhibition' },
    { icon: assets.language_icon, iconDark: assets.language_icon_dark, title: 'Languages', description: ' English - Full Professional Proficiency \n Urdu/Hindi - Native Proficiency'},
];

export const toolsData = [
    assets.solidworks,
    assets.dassault,
    assets.ansys,
    assets.matlab,
    assets.vscode,
    assets.power_bi,
    assets.tableau,
    assets.jira,
    assets.wrike,
    assets.microsoft
];

export const aboutParagraphs = [
    "I'm a student of NED University of Engineering and Technology, pursuing Bachelor of Engineering in Mechanical Engineering, with training in injection molding, machining, and assembly processes. Gained hands-on experience at Sui Southern Gas Company Limited (SSGC) Meter Manufacturing Plant, engaging with quality control, plastic molding, and painting processes that ensure high production standards.",
    "Certified in Google IT Automation with Python and Project Management, bringing complementary skills in automation and organizational efficiency. Motivated to leverage technical expertise and project management knowledge to contribute to innovative engineering solutions and process improvements.",
    "Recently, I worked in IOT & AI Exhibition as a Group Leader, where I led a team to develop innovative projects showcasing the applications of Internet of Things (IoT) and Artificial Intelligence (AI). This experience enhanced my leadership skills and deepened my understanding of cutting-edge technologies.",
];

export const skillCategories = [
    {
        title: 'Programming',
        icon: 'code',
        accent: '#38bdf8',
        skills: [
            { name: 'React/Next.js', level: 60 },
            { name: 'TypeScript', level: 60 },
            { name: 'Matlab', level: 60 },
            { name: 'Numpy', level: 40 },
            { name: 'Pandas', level: 40 },
            { name: 'Matplotlib', level: 40 },
        ],
    },
    {
        title: 'Simulation',
        icon: 'cpu',
        accent: '#fb923c',
        skills: [
            { name: 'Ansys', level: 20 },
            { name: 'Comsol Multiphysics', level: 60 },
            { name: 'Abaqus', level: 80 },
            { name: 'Simulink', level: 80 },
        ],
    },
    {
        title: 'CAD',
        icon: 'box',
        accent: '#34d399',
        skills: [
            { name: 'Solidworks', level: 70 },
            { name: 'Catia', level: 20 },
            { name: 'AutoCAD', level: 60 },
        ],
    },
    {
        title: 'Project Management',
        icon: 'clipboard-list',
        accent: '#a78bfa',
        skills: [
            { name: 'Jira', level: 70 },
            { name: 'Wrike', level: 90 },
            { name: 'Agile/Scrum', level: 60 },
            { name: 'Trello', level: 50 },
        ],
    },
    {
        title: 'Tools & Others',
        icon: 'wrench',
        accent: '#fbbf24',
        skills: [
            { name: 'Git/GitHub', level: 90 },
            { name: 'Tableau', level: 70 },
            { name: 'Power Bi', level: 20 },
            { name: 'Microsoft Office', level: 90 },
            { name: 'Linux', level: 20 },
        ],
    },
];

export const experienceData = [
    {
        id: 1,
        role: 'Planning & Development Intern',
        company: 'Sui Southern Gas Company Limited (SSGC)',
        period: 'One-month internship',
        report: '/pnd%20Intern%20Report.pdf',
        location: 'Karachi, Pakistan',
        logo: '🏗️',
        description:
            'One-month internship in SSGC’s Planning & Development (P&D) Department, gaining an understanding of the pipeline project lifecycle from feasibility and engineering planning through procurement, construction, and quality assurance.',
        achievements: [
            'Studied the pipeline project lifecycle, from gas-supply notification and feasibility through design, approvals, procurement, construction, and commissioning',
            'Learned how pipeline routes and specifications are planned and how General Arrangement Drawings (GADs), Bills of Quantities (BOQs), and Schedules of Requirements (SORs) support budgeting and procurement',
            'Reviewed transmission pipeline construction and quality practices, including welding, non-destructive testing (NDT), coating checks, and hydrostatic testing',
            'Built familiarity with pipeline standards covered in the report, including ASME B31.8, API 5L, and API 1104',
            'Recommended digital twins, centralized document management, and collaboration tools to improve asset management and project workflows',
        ],
        technologies: [],
    },
     {
        id: 2,
        role: 'Internship',
        company: 'Sui Southern Gas Company LTD',
        period: 'March - April (2024)',
        report: '/mmp%20intern%20report.pdf',
        location: 'Karachi, Pakistan',
        logo: '🏭',
        description:
            'One-month internship at Sui Southern Gas Company (SSGC), gaining hands-on experience in gas meter manufacturing, quality control, assembly, calibration, and industrial SOPs',
        achievements: [
            'Gained hands-on exposure to gas meter manufacturing and assembly',
            'Assisted in quality control inspections and testing procedures',
            'Learned calibration techniques as per EN 1359 standards',
            'Understood industrial SOPs, safety protocols, and plant workflows',
            'Improved teamwork and problem-solving in an industrial environment',
        ],
        technologies: [
            'CNC',
            'Injection molding',
            'Meter Calibration',
            'Quality Testing',
            'Surface Treatment',
        ],
    },
];

export const certificationData = [
    {
        id: 1,
        title: 'Google IT Automation with Python Professional',
        issuer: 'Google',
        category: 'devops',
        skills:
            'Git/GitHub, Automation, Programming Principles, Technical Communication, Web Services, Email Automation, Puppet (Configuration Management Tool), Infrastructure As A Service (IaaS), Bash (Scripting Language)',
        date: 'September, 2024',
        icon: 'code',
        iconBg: 'devops',
        issuerIcon: 'user-tie',
        certificateUrl:
            'https://coursera.org/share/cabb455b98d491888ccd3d6cb831b1fb',
    },
    {
        id: 2,
        title: 'Google Project Management',
        issuer: 'Google',
        category: 'project-management',
        skills:
            'Interviewing Skills, Risk Management, Requirements Analysis, Stakeholder Analysis, Project Scoping, Agile, Scrum, Tracking Systems, Project Closure.',
        date: 'September, 2024',
        icon: 'project-diagram',
        iconBg: 'project-management',
        issuerIcon: 'user-tie',
        certificateUrl:
            'https://coursera.org/share/73b3735a29d94775ba3e734fca487fa1',
    },
    {
        id: 4,
        title: 'Create and manage a project dashboard with Wrike',
        issuer: 'Coursera',
        category: 'project-management',
        skills: 'Creating dashboard',
        date: 'November, 2024',
        icon: 'server',
        iconBg: 'project-management',
        issuerIcon: 'aws',
        certificateUrl:
            'https://coursera.org/share/2f320383d2280285cdd9e1c02ef90a06',
    },
    {
        id: 5,
        title: 'Automate tasks and processes with Jira',
        issuer: 'Coursera',
        category: 'project-management',
        skills: 'Automating Tasks',
        date: 'November, 2024',
        icon: 'server',
        iconBg: 'project-management',
        issuerIcon: 'aws',
        certificateUrl:
            'https://coursera.org/share/421d1a1670b7014ddbe9684f69f06259',
    },
];

export const certificationFilters = [
    { id: 'all', label: 'All Certifications' },
    { id: 'devops', label: 'DevOps & Development' },
    { id: 'project-management', label: 'Project Management' },
];

export const contactContent = {
    eyebrow: 'Contact with me',
    title: 'Get in Touch',
    description:
        'Feel free to reach out if you have any questions or are interested in my services.',
    namePlaceholder: 'Enter your name',
    emailPlaceholder: 'Enter your email',
    messagePlaceholder: 'Enter your message',
};

export const contactDetails = {
    email: 'syedzainali4372@outlook.com',
    phone: '+92 300 2678500',
    location: 'Karachi, Pakistan',
    linkedin: 'https://www.linkedin.com/in/syedzainalii/',
    github: 'https://github.com/syedzainalii/',
};