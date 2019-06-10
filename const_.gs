// sample files are here: https://drive.google.com/drive/folders/1U4GrMHHyakOoCG3PVehkQD_AKADvFdVL

var C_FILE_TRIGGER_ID = '';  // Put your file id here if you plan to use it as Library
var C_SHEET_EVAL = '_Ini_';
var C_RANGE_VALS = 'C2:D';
var CCC_ = {}; // for holding constants
var C_DELIMETER1_NAME = 'STR_DELIMEER1';

// get settings from named range
function getSettings_(getAgain)
{  
  if ( typeof CCC_[C_DELIMETER1_NAME] !== 'undefined' && !getAgain) { return -1; }  
  // get data
  
  if (C_FILE_TRIGGER_ID === '')
  {
    var file = SpreadsheetApp.getActive();
  }
  else
  {
    var file = SpreadsheetApp.openById(C_FILE_TRIGGER_ID);
  }  
  var sheet = file.getSheetByName(C_SHEET_EVAL);
  var range = sheet.getRange(C_RANGE_VALS);
  var data = range.getValues();  
  for (var i = 0, l = data.length; i < l; i++)
  {
    CCC_[data[i][0]] =  data[i][1];
  }  
  return 0;
}


function test_getSettings()
{
  var t = new Date();
  
  Logger.log(getSettings_());      //  0
  Logger.log(getSettings_());      // -1
  Logger.log(getSettings_(true));  //  0  
  Logger.log(CCC_[C_DELIMETER1_NAME]); // ; 
  
  var t2 = new Date();
  Logger.log('Time to get sets = ' + (t2 - t) + ' ms.');                      //  ~59 ms.
  getSettings_();
  Logger.log('Time to get sets second time = ' + (new Date() - t2) + ' ms.'); //  ~1 ms.
}
