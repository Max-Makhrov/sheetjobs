/*
  Based on template: 
  https://docs.google.com/spreadsheets/d/19S99lxdE2djjop3n_PpB0g31bWh0COZ81VUgmjkWXnY/
  
  Sample formula for the named range "Ini":
  =ADDRESS(ROW(D3),COLUMN(D3),4,,"_Ini_")&":"&ADDRESS(MAX(FILTER(ROW(D:D),D:D<>"")),COLUMN(D3),4)
    D3 - first row with data
    D - column with data
*/

var C_RANGE_EVAL = 'eval';
var C_FILE_TRIGGER_ID = '19S99lxdE2djjop3n_PpB0g31bWh0COZ81VUgmjkWXnY';  // Put your file id here!


// Declare
var STR_DELIMEER1; // delim1
var STR_DELIMEER2; // delim2


// get settings from named range
function getSettings_(getAgain)
{
  
  if ( typeof STR_DELIMEER1 !== 'undefined' && !getAgain) { return -1; }
  
  // get data
  var file = SpreadsheetApp.openById(C_FILE_TRIGGER_ID);
  var key = 'bom-bom-bom'
  var data = file.getRange(file.getRangeByName(C_RANGE_EVAL).getValue()).getValues().join(key).split(key);
  
  
  // Assign
  STR_DELIMEER1 = data[0];
  STR_DELIMEER2 = data[1];
  
  
  return 0;
}


function test_getSettings()
{
  Logger.log(getSettings_());     //  0
  Logger.log(getSettings_());     // -1
  Logger.log(getSettings_(true)); //  0  
  Logger.log(STR_DELIMEER1);      // ;
}
