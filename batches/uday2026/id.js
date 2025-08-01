// id.js - Centralized data file for UDAY 2026 batch

// YouTube Playlist IDs
const CHAPTER_PLAYLISTS = {
    // Physics Chapters
    'Units and Dimension': 'PL6NSTQ0P5K07v4swaLyzNnJUOjeLcBx03',
    'Basic Maths & Calculus': 'PL6NSTQ0P5K07TGYSBjMGKERGopGzwZnk3',
    'Motion in a Straight Line': 'PL6NSTQ0P5K07oSHB9flt1A0iDSqJHv6JE',
    'Vectors': 'PL6NSTQ0P5K05diiCZKemCeTav7Lz6wwIB',
    'Motion in a Plane': 'PL6NSTQ0P5K055wDxB2YqKWi1Rz5j8efjW',
    'Laws of Motion': 'PL6NSTQ0P5K07O90P9s_zeRc_cp0w5rKto',
    'Work, Energy and Power': 'PL6NSTQ0P5K06EVijlqlj6xe4PiMfoHueW',
    'System of Particles and Rotational Motion': 'PL6NSTQ0P5K055sl1xRC7HdUtZC-WlSyc-',
    'Gravitation': 'PL6NSTQ0P5K06mZiHGdH7A9IMfG_qYCCSN',
    'Mechanical Properties of Solids': 'PL6NSTQ0P5K07ceXlDeoTzdS7ZkK9NUnTu',
    'Mechanical Properties of Fluids': 'PL6NSTQ0P5K06rkORrH0ZwxuS0ANKmmVp-',
    'Thermal Properties of Matter': 'PL6NSTQ0P5K05gNckQ4jKFvNki1JdTOqJ-',
    'Thermodynamics': 'PL6NSTQ0P5K047BylJPoPqdhO2OLAOA5gV',
    'Kinetic Theory': 'PL6NSTQ0P5K050Tj7c_ttCW0mkuahr2JiB',
    'Oscillations': 'PL6NSTQ0P5K04O4KEOsz_OHDvVFiqR--6m',
    'Waves': 'PL6NSTQ0P5K06sjps5Kjcuu7_6UsZWwwdY',

    // Chemistry Chapters
    'Some Basic Concepts of Chemistry (Physical Chemistry)': 'PL6NSTQ0P5K04b35FKwEPdjD_KspxnwBw5',
    'Structure of Atom (Physical Chemistry)': 'PL6NSTQ0P5K07i_NtdtyBztgaCMDtX78Gc',
    'Classification of Elements (Inorganic Chemistry)': 'PL6NSTQ0P5K06Tr-YpjLmR0gF0eLxfPnFW',
    'Chemical Bonding and Molecular Structure (Physical Chemistry)': 'PL6NSTQ0P5K05zHPN5FpU0uNEAWonGXIQR',
    'States of Matter (Physical Chemistry)': 'PL6NSTQ0P5K05VTfSE53uqxPwbin_FLadC',
    'Thermodynamics (Physical Chemistry)': 'PL6NSTQ0P5K047BylJPoPqdhO2OLAOA5gV',
    'Equilibrium (Physical Chemistry)': 'PL6NSTQ0P5K07OWTihBfWpQbTtzZsKklG6',
    'Redox Reactions (Physical Chemistry)': 'PL6NSTQ0P5K06mcqS91cF0YRYoNlGWAyOw',
    'Hydrogen (Inorganic Chemistry)': 'PL6NSTQ0P5K04Fom9SbHAfbp3X4rU8BfPS',
    'The s-Block Elements (Inorganic Chemistry)': 'PL6NSTQ0P5K04VQWFNI5fpJ0cdo6-kyNwo',
    'The p-Block Elements (Inorganic Chemistry)': 'PL6NSTQ0P5K05Zy87nd1nrhoyZ0M7K8xDy',
    'Organic Chemistry - Some Basic Principles (Organic Chemistry)': 'PL6NSTQ0P5K05Z8C3xWJh6_x7YcYmgqm3L',
    'Hydrocarbons (Organic Chemistry)': 'PL6NSTQ0P5K0538oflea825Awcv99tdHvN',
    'Environmental Chemistry (Physical Chemistry)': 'PL6NSTQ0P5K07YANcOfuhHl1iyvQW2iLsU',

    // Mathematics Chapters
    'Sets': 'PL6NSTQ0P5K06z4c_fiuwP-earmQZ23133',
    'Relation and Functions': 'PL6NSTQ0P5K04Cu2KlKGC85P0KvzpHDUXn',
    'Trigonometric Functions': 'PL6NSTQ0P5K06Smsp_Gbhphj-CjGEhMQcf',
    'Principle of Mathematical Induction': 'PL6NSTQ0P5K06z7zAvO7D3eZSxDDbBE_-p',
    'Complex Numbers and Quadratic Equations': 'YOUR_PLAYLIST_ID_HERE',
    'Linear Inequations': 'PL6NSTQ0P5K056VwPkbL8OkRl-a2songPT',
    'Permutations and Combinations': 'YOUR_PLAYLIST_ID_HERE',
    'Binomial Theorem': 'YOUR_PLAYLIST_ID_HERE',
    'Sequences and Series': 'YOUR_PLAYLIST_ID_HERE',
    'Straight Lines': 'YOUR_PLAYLIST_ID_HERE',
    'Conic Sections': 'YOUR_PLAYLIST_ID_HERE',
    'Introduction to Three Dimensional Geometry': 'YOUR_PLAYLIST_ID_HERE',
    'Limits and Derivatives': 'YOUR_PLAYLIST_ID_HERE',
    'Mathematical Reasoning': 'YOUR_PLAYLIST_ID_HERE',
    'Statistics': 'YOUR_PLAYLIST_ID_HERE',
    'Probability': 'YOUR_PLAYLIST_ID_HERE',
    'Basic Mathematics': 'PL6NSTQ0P5K04sGuZfSwMHblrz1eq49HkK',

    // Biology Chapters
    'The Living World (Botany)': 'PL6NSTQ0P5K04HR-2RFhmUwqGq3zQaT2lW',
    'Biological Classification (Botany)': 'PL6NSTQ0P5K05Uwz7A3SPqzm_-VmdQnzRN',
    'Plant Kingdom (Botany)': 'PL6NSTQ0P5K062-NDa9wNaYtXUUY5Aszrl',
    'Morphology of Flowering Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Anatomy of Flowering Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Cell - The Unit of Life (Botany)': 'PL6NSTQ0P5K05Y5kwmdABGokjn4BAcslV7',
    'Cell Cycle and Cell Division (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Transport in Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Mineral Nutrition (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Photosynthesis in Higher Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Respiration in Plants (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Plant Growth and Development (Botany)': 'YOUR_PLAYLIST_ID_HERE',
    'Animal Kingdom (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Structural Organisation in Animals (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Biomolecules (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Digestion and Absorption (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Breathing and Exchange of Gases (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Body Fluids and Circulation (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Excretory Products and their Elimination (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Locomotion and Movement (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Neural Control and Coordination (Zoology)': 'YOUR_PLAYLIST_ID_HERE',
    'Chemical Coordination and Integration (Zoology)': 'YOUR_PLAYLIST_ID_HERE',

    // English Sections (Already Complete)
    'Hornbill : Prose': 'PL6NSTQ0P5K05lqp2O9VFWxzT415eSjA3s',
    'Snapshot : Prose': 'PL6NSTQ0P5K055hoyfWqfIfx57_QW688jY',
    'Figures of Speech': 'PL6NSTQ0P5K07LGmHdzLYUOGtSXQ0Baiwi',
    'Hornbill : Poetry': 'PL6NSTQ0P5K06QlUeEGL8eaP7cYoli-OoN',
    'Grammar': 'PL6NSTQ0P5K07HWmwISjxELpL-_z3tcOjU',
    'Writing Skills': 'PL6NSTQ0P5K04bcQc-rJIDC1ojjot4n3md',

    // Computer Science Chapters
    'Computer System and Organisation': 'YOUR_PLAYLIST_ID_HERE',
    'Computational Thinking and Programming': 'YOUR_PLAYLIST_ID_HERE',
    'Society, Law and Ethics': 'YOUR_PLAYLIST_ID_HERE',
    'Data Management': 'YOUR_PLAYLIST_ID_HERE',
    'Impact of Technology': 'YOUR_PLAYLIST_ID_HERE',

    // Physical Education Chapters
    'Physical Fitness, Wellness and Lifestyle': 'YOUR_PLAYLIST_ID_HERE',
    'Olympic Movement': 'YOUR_PLAYLIST_ID_HERE',
    'Yoga': 'YOUR_PLAYLIST_ID_HERE',
    'Physical Activity and Leadership Training': 'YOUR_PLAYLIST_ID_HERE'
};

// Google Sheet IDs
const SUBJECT_SHEET_IDS = {
    'notices': '1ykHEd37G6uuFUfOMrYcmdXcbYjB2QACqShnquIBEgBw',
    'physics': '1rYWPEnPqOWNd4Y0kMLQzNpamaWwCnEibLStf5rT8i2o',
    'chemistry': '1aGNyEFwlTIVH0bM9_fyo40KqvW9eNofQqGPv5Ikz-No',
    'biology': '1Nf0DJc4wnmt3EOCW_zl4rOo82pw4tbNlGDFkUNF_hco',
    'mathematics': '17Z6oaHbfpF_OgjYNAuqaEa5ulH0OL82escVFRFi97m0',
    'english': '1Yvpuz33VxY0Midoexd6pYR7vqW9rbDJ0zXf27A1kgkI',
    'computer-science': 'YOUR_SHEET_ID_HERE',
    'physical-education': 'YOUR_SHEET_ID_HERE'
};

// Chapter data for CBSE Class 11 subjects
const chaptersData = {
    physics: {
        title: 'Physics',
        chapters: [
            { name: 'Units and Dimension' },
            { name: 'Basic Maths & Calculus' },
            { name: 'Motion in a Straight Line' },
            { name: 'Vectors' },
            { name: 'Motion in a Plane' },
            // { name: 'Laws of Motion' },
            // { name: 'Work, Energy and Power' },
            // { name: 'System of Particles and Rotational Motion' },
            // { name: 'Gravitation' },
            // { name: 'Mechanical Properties of Solids' },
            // { name: 'Mechanical Properties of Fluids' },
            // { name: 'Thermal Properties of Matter' },
            // { name: 'Thermodynamics' },
            // { name: 'Kinetic Theory' },
            // { name: 'Oscillations' },
            // { name: 'Waves' },
            { name: 'Practice Sheet || (Only PDF)' },
            { name: 'Short Notes || (Only PDF)' }
        ]
    },
    chemistry: {
        title: 'Chemistry',
        chapters: [
            { name: 'Some Basic Concepts of Chemistry (Physical Chemistry)' },
            { name: 'Structure of Atom (Physical Chemistry)' },
            // { name: 'Classification of Elements (Inorganic Chemistry)' },
            // { name: 'Chemical Bonding and Molecular Structure (Physical Chemistry)' },
            // { name: 'States of Matter (Physical Chemistry)' },
            // { name: 'Thermodynamics (Physical Chemistry)' },
            // { name: 'Equilibrium (Physical Chemistry)' },
            // { name: 'Redox Reactions (Physical Chemistry)' },
            // { name: 'Hydrogen (Inorganic Chemistry)' },
            // { name: 'The s-Block Elements (Inorganic Chemistry)' },
            // { name: 'The p-Block Elements (Inorganic Chemistry)' },
            // { name: 'Organic Chemistry - Some Basic Principles (Organic Chemistry)' },
            // { name: 'Hydrocarbons (Organic Chemistry)' },
            // { name: 'Environmental Chemistry (Physical Chemistry)' },
            { name: 'Practice Sheet || (Only PDF)' },
            { name: 'Short Notes || (Only PDF)' }
        ]
    },
    mathematics: {
        title: 'Mathematics',
        chapters: [
            { name: 'Sets' },
            { name: 'Linear Inequations' },
            { name: 'Relation and Functions' },
            { name: 'Basic Mathematics' },
            { name: 'Trigonometric Functions' },
            // { name: 'Principle of Mathematical Induction' },
            // { name: 'Complex Numbers and Quadratic Equations' },
            // { name: 'Permutations and Combinations' },
            // { name: 'Binomial Theorem' },
            // { name: 'Sequences and Series' },
            // { name: 'Straight Lines' },
            // { name: 'Conic Sections' },
            // { name: 'Introduction to Three Dimensional Geometry' },
            // { name: 'Limits and Derivatives' },
            // { name: 'Mathematical Reasoning' },
            // { name: 'Statistics' },
            // { name: 'Probability' },
            { name: 'Practice Sheet || (Only PDF)' },
            { name: 'Short Notes || (Only PDF)' }
        ]
    },
    biology: {
        title: 'Biology',
        chapters: [
            { name: 'Cell - The Unit of Life (Botany)' },
            { name: 'The Living World (Botany)' },
            { name: 'Biological Classification (Botany)' },
            { name: 'Plant Kingdom (Botany)' },
            // { name: 'Morphology of Flowering Plants (Botany)' },
            // { name: 'Anatomy of Flowering Plants (Botany)' },
            // { name: 'Cell Cycle and Cell Division (Botany)' },
            // { name: 'Transport in Plants (Botany)' },
            // { name: 'Mineral Nutrition (Botany)' },
            // { name: 'Photosynthesis in Higher Plants (Botany)' },
            // { name: 'Respiration in Plants (Botany)' },
            // { name: 'Plant Growth and Development (Botany)' },
            // { name: 'Animal Kingdom (Zoology)' },
            // { name: 'Structural Organisation in Animals (Zoology)' },
            // { name: 'Biomolecules (Zoology)' },
            // { name: 'Digestion and Absorption (Zoology)' },
            // { name: 'Breathing and Exchange of Gases (Zoology)' },
            // { name: 'Body Fluids and Circulation (Zoology)' },
            // { name: 'Excretory Products and their Elimination (Zoology)' },
            // { name: 'Locomotion and Movement (Zoology)' },
            // { name: 'Neural Control and Coordination (Zoology)' },
            // { name: 'Chemical Coordination and Integration (Zoology)' },
            { name: 'Practice Sheet || (Only PDF)' },
            { name: 'Short Notes || (Only PDF)' }
        ]
    },
    english: {
        title: 'English',
        chapters: [
            { name: 'Hornbill : Prose' },
            { name: 'Snapshot : Prose' },
            { name: 'Figures of Speech' },
            { name: 'Hornbill : Poetry' },
            { name: 'Grammar' },
            { name: 'Writing Skills' }
        ]
    },
    notices: {
        title: 'Notices',
        chapters: [
            { name: 'Batch Demo Videos' },
            { name: 'Master NCERT with AI' },
            { name: 'Lecture Planner || PDF Only' },
            { name: 'Test Planner || PDF Only' },
            { name: 'Class Schedule || PDF Only' },
            { name: 'Telegram Group Link || PDF Only' },
            { name: 'Test Syllabus || PDF Only' },
            { name: 'Test Paper || PDF Only' },
            { name: 'Subjective Test Paper Discussion' }
        ]
    },
    'computer-science': {
        title: 'Computer Science',
        chapters: [

        ]
    },
    'physical-education': {
        title: 'Physical Education',
        chapters: [

        ]
    }
};

// Custom video overrides
const CUSTOM_VIDEO_OVERRIDES = {
    'ym0if1NY2yM': {
        title: 'Sets 01 : Sets || Representation of Sets || Types of Sets || The Empty Set',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/e7ab34fd-f5bb-409e-9f33-2131a333cf14.png'
    },
    'YIItUETFjnA': {
        title: 'Units and Dimension 01 : Introduction to Physics || Units of Measurement || NO DPP',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/d9644373-18ba-4870-88ab-7422164de818.png'
    },
    '02rjTlcyIUo': {
        title: 'Some Basic Concepts of Chemistry 01 : Importance of Chemistry || Introduction to Matter || Physical and Chemical Classification of Matter || NO DPP',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/c0534d1b-e11c-4d4e-b25f-2fda39ba3c61.png'
    },
    'McbBoH2zAFQ': {
        title: 'Cell - The Unit of Life 01 : Introduction to Cell || Cell Theory || Rescheduled @05:00 PM',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/d8853433-3a04-4b29-9d00-b56c2df27b78.png'
    },
    'hB478LQayc4': {
        title: 'Hornbill 01 : Prose 01 : The Portrait of a Lady',
        thumbnail: 'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/bb0d31fb-f05d-466e-8a8d-78de03605897.png'
    }
};

// Export all data to global window object
if (typeof window !== 'undefined') {
    window.CHAPTER_PLAYLISTS = CHAPTER_PLAYLISTS;
    window.SUBJECT_SHEET_IDS = SUBJECT_SHEET_IDS;
    window.chaptersData = chaptersData;
    window.CUSTOM_VIDEO_OVERRIDES = CUSTOM_VIDEO_OVERRIDES;
}

// For Node.js environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CHAPTER_PLAYLISTS,
        SUBJECT_SHEET_IDS,
        chaptersData,
        CUSTOM_VIDEO_OVERRIDES
    };
}

// Ensure data is available globally
window.CHAPTER_PLAYLISTS = CHAPTER_PLAYLISTS;
window.SUBJECT_SHEET_IDS = SUBJECT_SHEET_IDS;
window.chaptersData = chaptersData;
window.CUSTOM_VIDEO_OVERRIDES = CUSTOM_VIDEO_OVERRIDES;
