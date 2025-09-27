/**
 * Google Drive Manager for AgriSwarm
 * Handles data storage, file management, and folder organization
 *
 * @constructor
 */
function DriveManager() {
  this.rootFolderId = this.getOrCreateRootFolder();
  this.dataFolderId = this.getOrCreateDataFolder();
  this.reportsFolderId = this.getOrCreateReportsFolder();
  this.archiveFolderId = this.getOrCreateArchiveFolder();
}

/**
 * Get or create the root AgriSwarm folder
 * @return {string} Folder ID
 */
DriveManager.prototype.getOrCreateRootFolder = function() {
  const folderName = 'AgriSwarm';
  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next().getId();
  } else {
    return DriveApp.createFolder(folderName).getId();
  }
};

/**
 * Get or create the data folder
 * @return {string} Folder ID
 */
DriveManager.prototype.getOrCreateDataFolder = function() {
  return this.getOrCreateSubfolder('AgriSwarm-Data');
};

/**
 * Get or create the reports folder
 * @return {string} Folder ID
 */
DriveManager.prototype.getOrCreateReportsFolder = function() {
  return this.getOrCreateSubfolder('AgriSwarm-Reports');
};

/**
 * Get or create the archive folder
 * @return {string} Folder ID
 */
DriveManager.prototype.getOrCreateArchiveFolder = function() {
  return this.getOrCreateSubfolder('AgriSwarm-Archive');
};

/**
 * Create subfolder within root folder
 * @param {string} folderName
 * @return {string} Folder ID
 */
DriveManager.prototype.getOrCreateSubfolder = function(folderName) {
  const rootFolder = DriveApp.getFolderById(this.rootFolderId);
  const folders = rootFolder.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next().getId();
  } else {
    return rootFolder.createFolder(folderName).getId();
  }
};

/**
 * Save sensor data to Google Sheets
 * @param {Object} sensorData
 * @param {string} sheetName
 * @return {string} File ID
 */
DriveManager.prototype.saveSensorData = function(sensorData, sheetName) {
  const timestamp = new Date().toISOString();
  const fileName = `${sheetName}_${this.formatDateForFileName()}`;

  // Check if file exists
  const existingFiles = this.dataFolder.getFilesByName(fileName + '.xlsx');
  let sheet;

  if (existingFiles.hasNext()) {
    // Use existing file
    const file = existingFiles.next();
    sheet = SpreadsheetApp.openById(file.getId());
  } else {
    // Create new file
    sheet = SpreadsheetApp.create(fileName);
    const file = DriveApp.getFileById(sheet.getId());
    this.dataFolder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);

    // Set up headers
    this.setupDataSheetHeaders(sheet, sensorData);
  }

  // Append data
  this.appendDataToSheet(sheet, sensorData, timestamp);

  return sheet.getId();
};

/**
 * Set up headers for data sheet
 * @param {Spreadsheet} sheet
 * @param {Object} dataSample
 */
DriveManager.prototype.setupDataSheetHeaders = function(sheet, dataSample) {
  const sheetTab = sheet.getActiveSheet();
  const headers = ['Timestamp', ...Object.keys(dataSample)];
  sheetTab.appendRow(headers);

  // Format header row
  sheetTab.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#f3f3f3');
};

/**
 * Append data to sheet
 * @param {Spreadsheet} sheet
 * @param {Object} data
 * @param {string} timestamp
 */
DriveManager.prototype.appendDataToSheet = function(sheet, data, timestamp) {
  const sheetTab = sheet.getActiveSheet();
  const values = [timestamp, ...Object.values(data)];
  sheetTab.appendRow(values);
};

/**
 * Generate report and save to reports folder
 * @param {string} reportName
 * @param {Object} reportData
 * @return {string} File ID
 */
DriveManager.prototype.saveReport = function(reportName, reportData) {
  const timestamp = this.formatDateForFileName();
  const fileName = `${reportName}_${timestamp}`;

  const doc = DocumentApp.create(fileName);
  const body = doc.getBody();

  // Add title
  const title = body.appendParagraph(reportName);
  title.setHeading(DocumentApp.ParagraphHeading.TITLE);

  // Add content
  this.addReportContent(body, reportData);

  // Move to reports folder
  const file = DriveApp.getFileById(doc.getId());
  this.reportsFolder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  return doc.getId();
};

/**
 * Add content to report
 * @param {Body} body
 * @param {Object} data
 */
DriveManager.prototype.addReportContent = function(body, data) {
  for (const [key, value] of Object.entries(data)) {
    const paragraph = body.appendParagraph(`${key}: ${value}`);
    paragraph.setIndentFirstLine(36); // 0.5 inch indent
  }
};

/**
 * Archive old data files
 * @param {number} daysOld
 */
DriveManager.prototype.archiveOldData = function(daysOld) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const files = this.dataFolder.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const fileDate = file.getDateCreated();

    if (fileDate < cutoffDate) {
      this.archiveFolder.addFile(file);
      this.dataFolder.removeFile(file);
    }
  }
};

/**
 * Format date for file names
 * @return {string} Formatted date
 */
DriveManager.prototype.formatDateForFileName = function() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
};

/**
 * Get folder by ID with error handling
 * @param {string} folderId
 * @return {Folder|null}
 */
DriveManager.prototype.getFolder = function(folderId) {
  try {
    return DriveApp.getFolderById(folderId);
  } catch (e) {
    Logger.log(`Folder not found: ${folderId}`);
    return null;
  }
};

/**
 * Get file by ID with error handling
 * @param {string} fileId
 * @return {File|null}
 */
DriveManager.prototype.getFile = function(fileId) {
  try {
    return DriveApp.getFileById(fileId);
  } catch (e) {
    Logger.log(`File not found: ${fileId}`);
    return null;
  }
};