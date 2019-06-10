// copy sample file: https://docs.google.com/spreadsheets/d/1FsBuPVkXdzSpD2KovlrVZvtkE5BJ31p8UXx3qIW56ss/copy
function test_folderFiles()
{
  var t = new Date();
  var ids = false; // use "1;2;3" to copy certain task ids 
  var res = getFoldersInfo_(ids);
  Logger.log(res);
  Logger.log('Time to run the script = ' + (new Date() -t) + ' ms.');
}



function getFoldersInfo_(ids)
{
  getSettings_();
  
  // output info
  var fileIdOut = CCC_.STR_FILEID_FOLDERFILES;
  if (fileIdOut == '')
  {
    var fileTo = SpreadsheetApp.getActive();
  }
  else
  {
    var fileTo = SpreadsheetApp.openById(fileIdOut);
  }
  if (!fileTo) { return -1; } // no file
  var sheetOut = CCC_.STR_SHEET_FOLDERFILES;
  var sheetTo = fileTo.getSheetByName(sheetOut);
  if (!sheetTo) { return -2; } // no sheet
  
    
  // tasks & folders
  var d = CCC_.STR_DELIMEER1;
  var folderIds = CCC_.STR_FOLDERIDS_FOLDERFILES.split(d);
  var taskIds = CCC_.STR_TASKIDS_FOLDERFILES.split(d);
  
  if (!ids) { ids = taskIds; }
  else { ids = ids.split(d); }
  
  // headers of the result  
  var res = [['Task Id', 'Folder', 'Path', 'Folder Id', 'Folder Link', 
              'File Name', 'File Type', 'File Id', 'File Link',
              'created', 'updated', 'owner', 'editors', 'viewers', 'size'
             ]];
  for (var i = 0, l = taskIds.length; i < l; i++)
  {
    var id = taskIds[i];
    if (ids.indexOf(id) > -1)
    {
      var folderInfo = {
        taskId: id,
        folderId: folderIds[i]        
      };      
      res = res.concat(getFolderInfo_(folderInfo));              
    }    
  }
  
  // write the result to the file
  var writer = { data: res, sheet: sheetTo, clearData: true }
  writeDataToSheet_(writer);
  
  return 0; // 0 = success
}


function getFolderInfo_(folderInfo) {
  var taskId = folderInfo.taskId;
  var folderId = folderInfo.folderId;
  
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();  
    
  var folderLink = 'https://drive.google.com/drive/folders/' + folderId;  
  var folderName = folder.getName();
  var folderPath = getFolderPathFolders_(folder).join('\\');
  
  
  // loop files
  var result = [], row = [];
  while (files.hasNext())    
  {
    var file = files.next();
    row = [taskId];
    
    row.push(folderName);
    row.push(folderPath)
    row.push(folderId);
    row.push(folderLink);
    row.push(file.getName());
    row.push(file.getMimeType())
    row.push(file.getId());
    row.push(file.getUrl());
    
    row.push(file.getDateCreated());
    row.push(file.getLastUpdated());
    row.push(file.getOwner().getEmail());
    row.push(file.getEditors().map(function(user) { return user.getEmail(); }).join(','));
    row.push(file.getViewers().map(function(user) { return user.getEmail(); }).join(','));
    
    row.push(file.getSize());
    
    result.push(row);

  }
  
  return result;
  
}
// Log the name of every folder in the user's Drive.
function getFolderPathFolders_(folder)
{
  var self = getFolderPathFolders_;
  var parents = folder.getParents();
  var folderNames = [];
  
  if (parents.hasNext())
  {
    return self(parents.next()).concat([folder.getName()]);    
  }
  else 
  {
    // base case
    return [folder.getName()];     
  }
} 


function writeDataToSheet_(writer)
{
  var data = writer.data;
  var fileId = writer.fileId;
  var file = writer.file;
  var sheetName = writer.sheetName;
  var sheet = writer.sheet;
  var row = writer.row || 1;
  var column = writer.column || 1;
  var isFreeRow = writer.isFreeRow;
  var clearData = writer.clearData; 
  
  // get sheet
  if (fileId) { file = SpreadsheetApp.openById(fileId); }
  if (sheetName) { sheet = file.getSheetByName(sheetName); }
  if (!sheet) { return -1; }
  
  // get row
  if (isFreeRow)
  {
    row = sheet.getLastRow() + 1;    
  }
  
  // get numRows, numColumns
  var numRows = data.length;
  var numColumns = data[0].length;  
  
  // get range
  var range = sheet.getRange(row, column, numRows, numColumns);
  
  
  if (clearData)
  {
   // clear old data if needed
    var last = sheet.getMaxRows();    
    var rowsDel = last - row + 1;
    var colsDel = data[0].length;
    var r = sheet.getRange(row, column, rowsDel, colsDel);
    Logger.log('Cleared. Range: [' +  r.getA1Notation() + '], Sheet: [' + sheet.getName() + '], Data: [[' + data[0].join(', ') + '], ...]');
    r.clearContent();    
  }  
  
  
  // set values
  range.setValues(data);
  
  return 0;
}
