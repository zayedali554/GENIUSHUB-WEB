// Google Apps Script to add new entries to Google Sheets
// This script should be added to your Google Sheets file

// Web app entry point - handles POST requests to add new entries
function doPost(e) {
  try {
    // Extract values from form data
    const subject = e.parameter.subject;
    const chapter = e.parameter.chapter;
    const section = e.parameter.section;
    const title = e.parameter.title;
    const link = e.parameter.link;
    
    // Validate required fields
    if (!subject || !chapter || !section || !title || !link) {
      const errorResponse = {
        status: 'error',
        message: 'Missing required fields'
      };
      
      const output = ContentService.createTextOutput(JSON.stringify(errorResponse));
      output.setMimeType(ContentService.MimeType.JSON);
      return output;
    }
    
    // Map subjects to sheet IDs (matching sheet-config.js)
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
    
    // Get the sheet ID based on the subject
    const sheetId = SUBJECT_SHEET_IDS[subject.toLowerCase()];
    
    // Validate sheet ID
    if (!sheetId || sheetId === 'YOUR_SHEET_ID_HERE') {
      const errorResponse = {
        status: 'error',
        message: `No sheet configured for subject: ${subject}`
      };
      
      const output = ContentService.createTextOutput(JSON.stringify(errorResponse));
      output.setMimeType(ContentService.MimeType.JSON);
      return output;
    }
    
    // Open the correct spreadsheet and get the first sheet
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // Add new row with the data
    // Assuming columns are: Subject, Chapter, Section, Title, Link
    const newRow = [subject, chapter, section, title, link];
    sheet.appendRow(newRow);
    
    // Return success response
    const successResponse = {
      status: 'success',
      message: 'Entry added successfully',
      data: {
        subject: subject,
        chapter: chapter,
        section: section,
        title: title,
        link: link
      }
    };
    
    const output = ContentService.createTextOutput(JSON.stringify(successResponse));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
    
  } catch (error) {
    // Return error response
    const errorResponse = {
      status: 'error',
      message: error.toString()
    };
    
    const output = ContentService.createTextOutput(JSON.stringify(errorResponse));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  const response = {
    status: 'success',
    message: 'Genius Hub API is running correctly',
    timestamp: new Date().toISOString()
  };
  
  const output = ContentService.createTextOutput(JSON.stringify(response));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// Function to get the web app URL (for reference)
function getUrl() {
  const url = ScriptApp.getService().getUrl();
  Logger.log(url);
  return url;
}
