// file sample is here: https://drive.google.com/drive/folders/1VUMybAKp_qKcIj4yLvyMb9Jtz0-uJxpY
function test_SheetsCopier()
{
  var t = new Date();
  var ids = false; // use "1;2;3" to copy certain task ids 
  var res = copySheetByTaskIds_(ids);
  Logger.log(res);
  Logger.log('Time to run the script = ' + (new Date() -t) + ' ms.');
}


var C_RESTORING_FORMULAS = {}; // object to keep info for restoring formulas

function copySheetByTaskIds_(ids)
{ 
  getSettings_();
  var d1 = CCC_.STR_DELIMEER1;
  var d2 = CCC_.STR_DELIMEER2;
  var allIds = CCC_.STR_ID_SHEETSCOPIER.split(d2);
  var allFileIdsFrom = CCC_.STR_FROM_SHEETSCOPIER.split(d2);
  var allSheetNamesFrom = CCC_.STR_COPYSHEET_SHEETSCOPIER.split(d2);
  var allFileIdsTo = CCC_.STR_TO_SHEETSCOPIER.split(d2);
  var allSheetNamesTo = CCC_.STR_PASTESHEET_SHEETSCOPIER.split(d2);
  var allReplaceSheet = CCC_.STR_REPLACESHEET_SHEETSCOPIER.split(d2);
  
  if (!ids) { var selectedIds = allIds; }
  else { var selectedIds = ids.split(d1); }
  
  var result = [];
  for (var i = 0; i < selectedIds.length; i++)
  {
    var index = allIds.indexOf(selectedIds[i]);
    var copier = 
        {
          fileIdFrom: allFileIdsFrom[index],
          fileIdTo: allFileIdsTo[index],
          sheetName: allSheetNamesFrom[index],
          sheetNewName: allSheetNamesTo[index],
          replaceExisting: allReplaceSheet[index]
        };
    result.push(copySheet_(copier));
  }
  // restore formulas before exit
  restoreFormulas_()
  return result;
}


function copySheet_(copier)
{
  var fileIdFrom = copier.fileIdFrom;
  var fileIdTo = copier.fileIdTo;
  var sheetName = copier.sheetName;
  var sheetNewName = copier.sheetNewName;
  if (sheetNewName === '') { sheetNewName = sheetName; }
  var replaceExisting = copier.replaceExisting; 
  
  var fileTo = SpreadsheetApp.openById(fileIdTo);
  
  // check if sheet was already there
  var sheetCurrent = fileTo.getSheetByName(sheetNewName);  
  // do not copy, do not re-write current sheet   
  if (sheetCurrent && replaceExisting != '1')  { return -1; } // sheet exists
  if (sheetCurrent) {  deleteSheetAndNamedRanges_(sheetCurrent); } // delete (!) current sheet with the same name
  
  // get used names of ranges
  var usedNames = getUsedNames_(fileTo);  
    
  // copy sheet
  var fileFrom = SpreadsheetApp.openById(fileIdFrom);
  var sheetFrom = fileFrom.getSheetByName(sheetName);  
  var newSheet = sheetFrom.copyTo(fileTo);
  
  // hidden
  newSheet.showSheet(); // unhide new created sheet so user can see the result
    
  // rename
  newSheet.setName(sheetNewName);
  
  // recreate named ranges
  recreateNamedRanges_(newSheet, sheetFrom, usedNames);
  
  // protected sheet, ranges
  copySheetProtection_(sheetFrom, newSheet);
  
  // formulas => remember source sheet formulas
  addToRestoringFormulas_(fileFrom, newSheet, sheetFrom); // adds info for restoring all the formulas
   
  // notes are copied automatically  
  // comments are not supported (2019/04)

  return 0;
}




/////////////////// named ranges
function getUsedNames_(file)
{
  var usedNamedRanges = file.getNamedRanges();
  var getNames_ = function (namedRange) { return namedRange.getName(); }  
  return usedNamedRanges.map(getNames_);  
}

function recreateNamedRanges_(sheetTo, sheetFrom, usedNames)
{
  var namedRangesSheetNew = sheetTo.getNamedRanges();
  var namedRangesSheet = sheetFrom.getNamedRanges();  
  var fileTo = sheetTo.getParent();
  
  // read named ranges from sheet1
  var oNamedRanges = {};
  namedRangesSheet.forEach
  (function(elt, index)
  {
    var name = elt.getName();
    if (usedNames.indexOf(name) === -1)
    {
      var namedRangeNew = namedRangesSheetNew[index];
      
      if (!namedRangeNew) { return -1; } // smth went wrong =(
      
      // remember
      oNamedRanges[name] = {};
      oNamedRanges[name].place = namedRangeNew.getRange().getA1Notation();
      oNamedRanges[name].range = namedRangeNew;
    }    
  });
  
  // delete and recreate
  for (var name in oNamedRanges)
  {
    oNamedRanges[name].range.remove();
    fileTo.setNamedRange(name, sheetTo.getRange(oNamedRanges[name].place));    
  }  
  
  return 0;
  
}

function deleteSheetAndNamedRanges_(sheet)
{  
  // remember named ranges
  var namedRanges = sheet.getNamedRanges();
  
  // delete sheet
  sheet.getParent().deleteSheet(sheet);
  
  var delete_ = function(elt) { elt.remove(); }
  
  namedRanges.forEach(delete_);
  
  return 0;
    
}




/////////////////// protections
function copySheetProtection_(sheetFrom, sheetTo)
{
  
  //  getProtections(SHEET) 
  var sheetProtections = sheetFrom.getProtections(SpreadsheetApp.ProtectionType.SHEET)
  var l = sheetProtections.length;
  for (var i = 0; i < l; i++)
  {
    var sheetProtection = sheetProtections[i];
    var description = sheetProtection.getDescription();
    var editors = sheetProtection.getEditors();
    var isWarningOnly = sheetProtection.isWarningOnly();
    var unprotectedRanges = sheetProtection.getUnprotectedRanges();    
    // add new sheet protection
    var protection = sheetTo.protect().setDescription(description);    
    
    if (isWarningOnly)
    {
      protection.setWarningOnly(true);      
    }
    else
    {
      // Ensure the current user is an editor before removing others. Otherwise, if the user's edit
      // permission comes from a group, the script throws an exception upon removing the group.
      var me = Session.getEffectiveUser();
      protection.addEditor(me);
      protection.removeEditors(protection.getEditors());
      if (protection.canDomainEdit()) {
        protection.setDomainEdit(false);    
      }    
      protection.addEditors(editors);               
    }
    protection.setUnprotectedRanges(unprotectedRanges);        
  }

  //  getProtections(RANGE) 
  var rangeProtections = sheetFrom.getProtections(SpreadsheetApp.ProtectionType.RANGE)
  var l = rangeProtections.length;
  for (var i = 0; i < l; i++)
  {
    var rangeProtection = rangeProtections[i];
    var description = rangeProtection.getDescription();
    var editors = rangeProtection.getEditors();
    var isWarningOnly = rangeProtection.isWarningOnly();  
    var range = sheetTo.getRange(rangeProtection.getRange().getA1Notation());
    // add new sheet protection
    var protection = range.protect().setDescription(description);        
    if (isWarningOnly)
    {
      protection.setWarningOnly(true);      
    }
    else
    {
      // Ensure the current user is an editor before removing others. Otherwise, if the user's edit
      // permission comes from a group, the script throws an exception upon removing the group.
      var me = Session.getEffectiveUser();
      protection.addEditor(me);
      protection.removeEditors(protection.getEditors());
      if (protection.canDomainEdit()) {
        protection.setDomainEdit(false);    
      }    
      protection.addEditors(editors);               
    }        
  }  
  return 0;
}




/////////////////// formulas
function addToRestoringFormulas_(fileFrom, sheetTo, sheetFrom)
{
  var key = fileFrom.getId();
  
  if (!(key in C_RESTORING_FORMULAS))
  {
    var node = {};
    node.sheets = [sheetTo];
    node.sheetsFrom = [sheetFrom];
    node.namedRanges = getUsedNames_(fileFrom);
    C_RESTORING_FORMULAS[key] = node;    
  }
  else
  {
    node =  C_RESTORING_FORMULAS[key];
    node.sheets.push(sheetTo); 
    node.sheetsFrom.push(sheetFrom)
    C_RESTORING_FORMULAS[key] = node;
  }
  return 0;  
}
function restoreFormulas_()
{ 
  var obj = C_RESTORING_FORMULAS;
  // loop files
  for (var key in obj)
  {
    var sheets = obj[key].sheets;
    var sheetsFrom = obj[key].sheetsFrom;
    var namedRanges = obj[key].namedRanges;
    var duckMatchPattern = new RegExp(namedRanges.join("|"), "i");
    var ls = sheets.length;
    // loop sheets
    for (var i = 0; i < ls; i++)
    {
      var sheet = sheets[i];
      var sheetFrom = sheetsFrom[i];
      var range = sheetFrom.getDataRange();      
      var formulas = range.getFormulas();   
      var newRange = sheet.getDataRange();
      var newFormulas = newRange.getFormulas(); 
      var values = newRange.getDisplayValues();
      
      var ll = values[0].length;
      // loop range values and formulas
      for (var r = 0, l = values.length; r < l; r++)
      {
        for (var c = 0; c < ll; c++)
        {
          var value = values[r][c];
          var formula = newFormulas[r][c];
          var replaceFormula = formulas[r][c];                
          // duck type bad formula
          if ( (formula.match("!") || formula.match(duckMatchPattern) || formula.match('#REF!')) && (value === '#N/A' || value === '#REF!')) 
          { sheet.getRange(r + 1, c + 1).setFormula(replaceFormula + ' '); } // resets the formula   
        }    
      }            
    }        
  }
  return 0;
}
