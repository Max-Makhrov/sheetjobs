/*
  Based on template: 
  https://docs.google.com/spreadsheets/d/19S99lxdE2djjop3n_PpB0g31bWh0COZ81VUgmjkWXnY/
  
  Sample formula for the named range "Ini":
  =ADDRESS(ROW(D3),COLUMN(D3),4,,"_Ini_")&":"&ADDRESS(MAX(FILTER(ROW(D:D),D:D<>"")),COLUMN(D3),4)
    D3 - first row with data
    D - column with data
*/

var C_RANGE_EVAL = 'A1';
var C_SHEET_EVAL = '_Ini_';
var C_FILE_TRIGGER_ID = '1b55qnMP1QfqQ1xLR-ooafV-k4Hpj8BbQvrrDBo313B0';  // Put your file id here!


// Declare
var STR_DELIMEER1; // delim1
var STR_DELIMEER2; // delim2
var STR_IDS_EMAILER; // Id
var STR_EMAILS_EMAILER; // Emails
var STR_TITLES_EMAILER; // Title
var STR_HTMLS_EMAILER; // Html

// get settings from named range
function getSettings_(getAgain)
{
  
  if ( typeof STR_DELIMEER1 !== 'undefined' && !getAgain) { return -1; }
  
  // get data
  var file = SpreadsheetApp.openById(C_FILE_TRIGGER_ID);
  var rangeAddress = file.getSheetByName(C_SHEET_EVAL).getRange(C_RANGE_EVAL);
  var data = file.getRange(rangeAddress.getValue()).getValues(); 

// Assign
STR_DELIMEER1 = data[0][0];
STR_DELIMEER2 = data[1][0];
STR_IDS_EMAILER = data[2][0];
STR_EMAILS_EMAILER = data[3][0];
STR_TITLES_EMAILER = data[4][0];
STR_HTMLS_EMAILER = data[5][0];
  
  
  return 0;
}


function test_getSettings()
{
  var t = new Date();
  
  Logger.log(getSettings_());     //  0
  Logger.log(getSettings_());     // -1
  Logger.log(getSettings_(true)); //  0  
  Logger.log(STR_DELIMEER1);      // ;
  Logger.log(STR_DELIMEER2);      // ~
  
  
  Logger.log('Time to get sets = ' + (new Date() - t) + ' ms.'); //  Time to get sets = 481 ms.
}
