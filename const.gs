/*
  Based on template: 
  https://docs.google.com/spreadsheets/d/19S99lxdE2djjop3n_PpB0g31bWh0COZ81VUgmjkWXnY/
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
  
  var range = SpreadsheetApp.openById(C_FILE_TRIGGER_ID).getRangeByName(C_RANGE_EVAL);    
  var value = range.getValue();
  var data = JSON.parse(value);
  

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
}
