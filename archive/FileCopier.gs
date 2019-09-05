// file sample is here: https://drive.google.com/drive/folders/1w3u2oO07xMCm5t89al73uSaeQ66hJ-oU
function test_fileCopier()
{
  var t = new Date();
  var ids = false; // use "1;2;3" to copy certain task ids 
  var res = copyFiles_(ids);
  Logger.log(res);
  Logger.log('Time to run the script = ' + (new Date() -t) + ' ms.');
}


function copyFiles_(ids) {
  getSettings_();
  var d = CCC_.STR_DELIMEER1;
  var all_ids = CCC_.STR_TASKID_FILECOPIER.split(d);
  var all_fileIds = CCC_.STR_FILE_ID_FILECOPIER.split(d);
  var all_folderIds = CCC_.STR_FOLDER_TO_ID_FILECOPIER.split(d);
  var all_prefix = CCC_.STR_NAME_PREFIX_FILECOPIER.split(d);
  var all_postfix = CCC_.STR_NAME_POSTFIX_FILECOPIER.split(d);
  
  
  if (!ids) { ids = all_ids; }
  else { ids = ids.split(d); }
  
  var res = [];
  for (var i = 0; i < all_ids.length; i++)
  {
    var id = all_ids[i];
    if (ids.indexOf(id) > -1)
    {
      var fileCopier = 
          {
            fileId: all_fileIds[i],
            folderId: all_folderIds[i],
            prefix: all_prefix[i],
            postfix: all_postfix[i]
          }
      var subRes = copyFile_(fileCopier);
      res.push(subRes);
    }    
  }
  return res;
}


function copyFile_(fileCopier)
{
  var fileId = fileCopier.fileId, 
      folderId = fileCopier.folderId, 
      prefix = fileCopier.prefix, 
      postfix = fileCopier.postfix;
  
  var file = DriveApp.getFileById(fileId);
  if (!file) { return -1; } // no file
  var type = file.getMimeType();
  var folder = DriveApp.getFolderById(folderId);
  if (!folder) { return -2; } // no folder
  var name = file.getName();
  
  switch (type) {
    case MimeType.GOOGLE_SHEETS:
      // copy the form too
      var copy = file.makeCopy(folder);
      var copyId = copy.getId();
      var ss = SpreadsheetApp.openById(copyId); // get file of a copy
      if (!ss) { return -3; } // no ss??
      var formUrl = ss.getFormUrl();
      if (formUrl)
      {
        var form = FormApp.openByUrl(formUrl);
        var formId = form.getId();
        var formFile = DriveApp.getFileById(formId);
        // get folders from form copy
        var fileParents = formFile.getParents();
        // add to folder
        folder.addFile(formFile); 
        // remove old copies        
        while ( fileParents.hasNext() ) {
          var folderFrom = fileParents.next();
          folderFrom.removeFile(formFile);
        }
        // rename file copy
        formFile.setName(prefix + name + postfix);        
      }
      break;
    case MimeType.GOOGLE_FORMS:
      // do not copy the form
      return -4; // userforms are copied automatically with linked spreadsheet
    default:
      // copy as usual
      var copy = file.makeCopy(folder);
  }
  // rename copy
  copy.setName(prefix + name + postfix);
  return 0; 
}
