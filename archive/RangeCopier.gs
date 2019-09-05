// file sample is here: https://drive.google.com/drive/folders/139o8s9hVhx4_nLwXqifbD-540w_AP5vT
function test_rangeCopier()
{
  var t = new Date();
  var ids = false; // use "1;2;3" to copy certain task ids 
  var res = copyRanges_(ids);
  Logger.log(res);
  Logger.log('Time to run the script = ' + (new Date() -t) + ' ms.');
}


function copyRanges_(ids) {
  getSettings_();
  var d = CCC_.STR_DELIMEER1;
  var all_ids = CCC_.STR_TASK_RANGECOPIER.split(d);
  var all_from_ids = CCC_.STR_FROM_ID_RANGECOPIER.split(d);
  var all_from_sheets = CCC_.STR_FROM_SHEET_RANGECOPIER.split(d);
  var all_from_ranges = CCC_.STR_FROM_RANGE_RANGECOPIER.split(d);
  var all_to_ids = CCC_.STR_TO_ID_RANGECOPIER.split(d);
  var all_to_sheets = CCC_.STR_TO_SHEET_RANGECOPIER.split(d);
  var all_to_ranges = CCC_.STR_TO_RANGE_RANGECOPIER.split(d);
  var all_crear_data = CCC_.STR_CLEAR_RANGECOPIER.split(d);
  
  if (!ids) { ids = all_ids; }
  else { ids = ids.split(d); }
  
  var res = [];
  for (var i = 0; i < all_ids.length; i++)
  {
    var id = all_ids[i];
    if (ids.indexOf(id) > -1)
    {
      var rangeCopier = 
          {
            from_id:  all_from_ids[i],
            from_sheet: all_from_sheets[i],
            from_range: all_from_ranges[i],
            to_id: all_to_ids[i],
            to_sheet: all_to_sheets[i],
            to_range: all_to_ranges[i],
            clear_data: all_crear_data[i]
          };
      var subres = copyRange_(rangeCopier);
      res.push(subres);
    }    
  }
  return res;
}

function copyRange_(rangeCopier)
{ 
  
  // file from
  var from_id = rangeCopier.from_id;
  if (from_id == '') { return -1; } // no file id from 
  var fileFrom = SpreadsheetApp.openById(from_id);
  if (!fileFrom) { return -2; } // no file from with id
  
  // sheet from
  var from_sheet = rangeCopier.from_sheet;
  if (from_sheet == '') { return -3; } // no sheet from
  var sheetFrom = fileFrom.getSheetByName(from_sheet);
  if (!sheetFrom) { return -4; } // no sheet from with name
  
  // file to
  var to_id = rangeCopier.to_id;
  if (to_id == '') { return -5; } // no file id to 
  var fileTo = SpreadsheetApp.openById(to_id);
  if (!fileTo) { return -6; } // no file to with id
  
  // sheet to
  var to_sheet = rangeCopier.to_sheet;
  if (to_sheet == '') { return -7; } // no sheet to
  var sheetTo = fileTo.getSheetByName(to_sheet);
  if (!sheetTo) { return -8; } // no sheet to with name  
  
  // rangeFrom
  var from_range = rangeCopier.from_range;
  if (from_range == '')
  {
    var rangeFrom = sheetFrom.getDataRange();    
  }
  else
  {
    var rangeFrom = sheetFrom.getRange(from_range);
    if (!rangeFrom) { return -9; } // no range from
  }
  
  // clear range
  var clear_data = rangeCopier.clear_data;
  var clearData= false;
  if (clear_data == '1') { clearData = true; }  
 
  // range to
  var isFreeRow = false;
  var to_range = rangeCopier.to_range;
  if (to_range == '')
  {
    isFreeRow = true;
  }
  else
  {
    var rangeTo = sheetTo.getRange(to_range);
    if (!rangeTo) { return -10; } // no range to with address
    var row = rangeTo.getRow();
    var column = rangeTo.getColumn();
    isFreeRow = false;
  }
  

  
  var writer = 
      {
        data: rangeFrom.getValues(),
        sheet: sheetTo,
        row: row,
        column: column,
        isFreeRow: isFreeRow,
        clearData: clearData
      }
 return  writeDataToSheet_(writer);
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
  
  if (clearData && !isFreeRow)
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
