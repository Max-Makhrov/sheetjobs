// copy sample file: https://docs.google.com/spreadsheets/d/1FzJGNUkZSh-jBE4fvcNY3NjB9yfo77IAOA3C-PXxGLQ/copy
// run this code to create folders
function test_FolderMaker()
{
  var t = new Date();
  var ids = false; // use "1;2;3" to copy certain task ids 
  var res = createFoldersTasks_(ids);
  Logger.log(res);
  Logger.log('Time to run the script = ' + (new Date() -t) + ' ms.');
}



// code for tasks
function createFoldersTasks_(ids)
{
  var t = new Date();
  getSettings_();
  var d1 = CCC_.STR_DELIMEER1;
  var d2 = CCC_.STR_DELIMEER2;
  var allids = CCC_.STR_IDS_FOLDERMAKER.split(d2);
  var allFolderIds = CCC_.STR_FOLDERIDS_FOLDERMAKER.split(d2);
  var allFolderPaths = CCC_.STR_PATHS_FOLDERMAKER.split(d2);
  
  if (ids) { var taskIds = ids.split(d1); }
  else { var taskIds = allids; } 
 
  // loop tasks
  var folderMaker = {}, index;
  var delim = CCC_.STR_PATHDELIM_FOLDERMAKER;
  for (var i = 0; i < taskIds.length; i++)
  {
    index = allids.indexOf(taskIds[i]);
    folderMaker.names = allFolderPaths[index].split(delim);
    folderMaker.folderId = allFolderIds[index];
    createFolderByTask_(folderMaker);    
  }
  return 0;  
}
function createFolderByTask_(folderMaker)
{
  var folder =  DriveApp.getFolderById(folderMaker.folderId);
  var names = folderMaker.names;
  createFolders_(folder, names);
}



// code for creating folders
function createFolders_(folder, names)
{
  if (('' + folder) === 'null') { folder = DriveApp.getRootFolder(); }
  var name = '';
  for (var i = 0; i < names.length; i++)
  {
    name = names[i];
    folder = createFolderInFolder_(folder, name); 
  }
  return folder;  
}
function createFolderInFolder_(folder, name) {
  var existingFolder = isFolderInFolder_(folder, name);
  if (existingFolder) { return existingFolder; } // exclude creating folders with the same names 
  var result = folder.createFolder(name);
  return result;  
}
function isFolderInFolder_(folder, name) {
  var folders = folder.getFolders();
  var folder;
  while (folders.hasNext())
  {
    folder = folders.next();
    if (folder.getName() === name) { return folder; }
  }
  return false; 
}
