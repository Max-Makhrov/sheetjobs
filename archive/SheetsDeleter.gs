// file sample is here: https://drive.google.com/drive/folders/1VUMybAKp_qKcIj4yLvyMb9Jtz0-uJxpY
function test_sheetsDeleter()
{
  var t = new Date();
  var ids = false; // use "1;2;3" to copy certain task ids 
  var res = deleteSheetsByTaskIds_(ids);
  Logger.log(res); // number of deleted sheets
  Logger.log('Time to run the script = ' + (new Date() -t) + ' ms.');
}

function deleteSheetsByTaskIds_(ids)
{
  getSettings_();
  
  var d1 = CCC_.STR_DELIMEER1;
  var d2 = CCC_.STR_DELIMEER2;
  
  var allIds = CCC_.STR_TASKIDS_SHEETDELETER.split(d2);
  var allFileIds = CCC_.STR_FILEIDS_SHEETDELETER.split(d2);
  var allSheetNames = CCC_.STR_SHEETNAMES_SHEETDELETER.split(d2);
  
  if (!ids) { var selectedIds = allIds; }
  else { var selectedIds = ids.split(d1); }
  
  var sheets, name, result = [];
  for (var i = 0; i < selectedIds.length; i++)
  {
    var pos = allIds.indexOf(selectedIds[i]);
    var file = SpreadsheetApp.openById(allFileIds[pos]);
    name = allSheetNames[pos];
    if (name === '')
    {
      sheets = getSheetsExceptFirst_(file);
    }
    else
    {
      sheets = [file.getSheetByName(name)];
    }    
    result.push(deleteSheetsBySheets_(sheets));
  }
  return result;    
}


function deleteSheetsBySheets_(sheets)
{
  var l = sheets.length, sheet, sheetsCount = 0;
  for (var i = 0; i < l; i++)
  {
    sheet = sheets[i];
    sheetsCount += deleteSheetAndNamedRanges_(sheet);      
  }  
  return sheetsCount;  
}

function getSheetsExceptFirst_(file)
{
  var sheets = file.getSheets();
  var result = [], sheet;
  for (var i = 0; i < sheets.length; i++)
  {
    sheet = sheets[i];
    if (sheet.getIndex() !== 1) { result.push(sheet); } 
  }
  return result;
}



function deleteSheetAndNamedRanges_(sheet)
{  
  if (!sheet) { return 0; } // no sheet to delete
  // remember named ranges
  var namedRanges = sheet.getNamedRanges();
  
  // delete sheet
  sheet.getParent().deleteSheet(sheet);
  
  var delete_ = function(elt) { elt.remove(); }
  
  namedRanges.forEach(delete_);
  
  return 1;
    
}
