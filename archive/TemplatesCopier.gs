// file sample is here: https://drive.google.com/drive/folders/1FClnAMnB9cj8slgijGOb3bu2272waZy8
function test_templatesCopier()
{
  var t = new Date();
  var res = createReportsByTemplates_(false); // use "1;2;3" to copy certain task ids 
  Logger.log(res);
  Logger.log('Time to get reports = ' + ( new Date() - t )/1000 + ' sec'); // 14 files ~ 50 sec
}

// taskIds = '1;3'
function createReportsByTemplates_(taskIds)
{
  getSettings_();
  var file = SpreadsheetApp.getActive();
  
  var delim = CCC_.STR_DELIMEER1;
  var delim2 = CCC_.STR_DELIMEER2;
  
  var allTaskIds = CCC_.STR_IDS_TEMPLATES.split(delim2)
  var allFileIds = CCC_.STR_FILE_TEMPLATES.split(delim2);
  var allFolderIds = CCC_.STR_FOLDERTO_TEPLATES.split(delim2);
  var allA1Replace = CCC_.STR_RANGE_REPLACE_TEPLATES.split(delim2);
  var allPrefixes = CCC_.STR_REPNAMESTARTS_TEPLATES.split(delim2);
  
  var allA1Final = CCC_.STR_RANGE_RESULTURL_TEPLATES.split(delim2);
  var sResName = CCC_.STR_SHEET_RESULT_TEPLATES;
  var sRes = SpreadsheetApp.getActive().getSheetByName(sResName);
  var allValues = CCC_.STR_VALUES_LOOP_TEPLATES.split(delim2);
  
  if (!taskIds) { taskIds.split(delim); }
  else { taskIds = allTaskIds; }

  var results = [];
  // loop tasks
  for (var i = 0, l = allTaskIds.length; i < l; i++)
  {
    var id = allTaskIds[i];
    if (taskIds.indexOf(id) > -1)
    {
      var template = 
          {
            fileId: allFileIds[i],
            folderId: allFolderIds[i],
            replaceA1: allA1Replace[i],
            prefix: allPrefixes[i],
            values: allValues[i].split(delim)
          };
      var result = createCopiesByTemplate_(template);  
      // write links to sheet
      var data = convertLineToColumn_(result);
      var rAdr = allA1Final[i];
      var r = sRes.getRange(rAdr);
      r.setValues(data);
      results.push(result);
    }    
  } // loop tasks end
  
  return results;   
}


function createCopiesByTemplate_(template)
{
  var fileId = template.fileId;
  var folderId = template.folderId;
  
  var folder = DriveApp.getFolderById(folderId);  
  if (!folderId) { return -1; } // wrong folder id
  
  var file = DriveApp.getFileById(fileId);
  if (!file) { return -2; } // wrong file id
  
  // get tasks
  var values = template.values; // expect array []
  
  if (!values) { return -3; } // got no values
  
  var prefix = template.prefix || '';
  var replaceA1 = template.replaceA1;
  
  // check spreadsheet and range
  if (replaceA1 !== '')
  {
    var ss = SpreadsheetApp.openById(fileId);
    if (!ss) { return -4; } // wrong sheet id
    var rangeReplace = ss.getRange(replaceA1);
    if (!rangeReplace) { return -5; } // wrong range address    
  }
  
  var fileUrlsNew = [];
  for (var i = 0, l = values.length; i < l; i++)
  {
    var value = values[i];
    var ss_copier = 
        {
          file: file,
          folder: folder,
          value: value,
          prefix: prefix,
          replaceA1: replaceA1
        };
    var fileUrlNew = createCopyByTemplate_(ss_copier);    
    fileUrlsNew.push(fileUrlNew);
  }
  return fileUrlsNew;     
}

function createCopyByTemplate_(ss_copier)
{
  var folder = ss_copier.folder;
  var file = ss_copier.file; 
  var replaceA1 = ss_copier.replaceA1;
  var prefix = ss_copier.prefix;
  var value = ss_copier.value;
  
  // create a copy
  var copy = file.makeCopy(folder);
  // set new name 
  copy.setName(prefix + value);
  // replace value in range
  if (replaceA1 !== '')
  {
    var id =copy.getId();
    var ss = SpreadsheetApp.openById(id);
    var range = ss.getRange(replaceA1);
    range.setValue(value);    
  }
    
  return copy.getUrl()
}

function convertLineToColumn_(data)
{
  var res = [];
  for (var i = 0, l = data.length; i < l; i++)
  {
    res.push([data[i]]);        
  }
  return res;  
}
