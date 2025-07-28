// Google Sheets API Configuration
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'AIzaSyDzQqArOBJ1eSaVP8LVNwTKSBl70nJrOOI',
    BASE_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
};

// Subject to Google Sheet ID mapping
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

// Google Sheets API Class
class GoogleSheetsAPI {
    constructor() {
        this.apiKey = GOOGLE_SHEETS_CONFIG.API_KEY;
        this.baseUrl = GOOGLE_SHEETS_CONFIG.BASE_URL;
    }

    // Get Notes/DPP data from Google Sheets
    async getSheetData(subjectKey, chapterName, sectionType) {
        try {
            const sheetId = SUBJECT_SHEET_IDS[subjectKey];
            
            if (!sheetId || sheetId === 'YOUR_SHEET_ID_HERE') {
                console.log(`No sheet ID configured for subject: ${subjectKey}`);
                return [];
            }
            
            // Fetch data from Google Sheets API
            const range = 'A:E'; // Columns A to E (Subject, Chapter, Section, Title, Link)
            const url = `${this.baseUrl}/${sheetId}/values/${range}?key=${this.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error('Google Sheets API Error:', data.error);
                return [];
            }
            
            // Parse the data
            const rows = data.values;
            if (!rows || rows.length < 2) return [];
            
            // Remove header row
            const headers = rows.shift();
            
            // Filter data based on chapter and section type
            const filteredData = rows.filter(row => {
                const rowChapter = row[1]; // Chapter is in column B (index 1)
                const rowSection = row[2]; // Section is in column C (index 2)
                
                // Match chapter (exact match or "All Contents")
                const chapterMatch = chapterName === 'All Contents' || rowChapter === chapterName;
                
                // Match section type (Notes or DPP)
                const sectionMatch = rowSection === sectionType;
                
                return chapterMatch && sectionMatch;
            });
            
            // Format the data
            return filteredData.map(row => ({
                subject: row[0], // Column A
                chapter: row[1], // Column B
                section: row[2], // Column C
                title: row[3],   // Column D
                link: row[4]     // Column E
            }));
            
        } catch (error) {
            console.error('Error fetching sheet data:', error);
            return [];
        }
    }
}

// Export for use in main script
window.GoogleSheetsAPI = GoogleSheetsAPI;
