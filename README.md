
# Jobs
<p align="left">
    <a href="https://docs.google.com/spreadsheets/d/1-uutvWRg2zQYM-M5XW9awGpZc_uXiCXSG5eelkLErzk/copy" alt="Copy Sample Google Spreadsheet File">
        <img src="https://img.shields.io/badge/copy-sample%20file-green" /></a>
    <a href="https://sheetswithmaxmakhrov.wordpress.com/2019/09/02/jobs/" alt="Copy Sample Google Spreadsheet File">
        <img src="https://img.shields.io/badge/article-about-brightgreen" /></a>
     <a href="https://sheetswithmaxmakhrov.wordpress.com/2019/09/05/clear-my-ranges-jobs-%f0%9f%94%a5/" alt="Copy Sample Google Spreadsheet File">
        <img src="https://img.shields.io/badge/article-usage-brightgreen" /></a>   


</p>

Jobs is a Goole Spreadsheet with the script for automating tasks.

 - [Installation](#Installation)
 - [About](#About-Jobs)
 - [File structure](#Jobs-structure)
 - [Settings](#Settings-Jobs)
 - [Script](#Jobs-Script)
 - [Full list of functions ☠️]( #Jobs-Functions)

## Installation
The simplest way is to [create your copy of Jobs](https://docs.google.com/spreadsheets/d/1-uutvWRg2zQYM-M5XW9awGpZc_uXiCXSG5eelkLErzk/copy).

## About Jobs
Here's sample workflow for Jobs:

    1. Copy the range (from source1) →
    2. Copy the range (from source2) →
    3. Combine the data (from steps 1, 2) →
    4. Filter the data (from step 3) → 
    5. Paste it (somewhere).

The advantage of using Jobs is to save time on repeated tasks. The basic functions are:

    clearRangeContents_
    rememberValues_
    logValues_
    copyByTemplate_
    filterByColumn_
    writeValues_
New functions will appear in Jobs as native bound functions, or will be added as libraries (see more [about libraries](https://developers.google.com/apps-script/guides/libraries) in Google Sheets).

Jobs has a flexible system of selecting ranges in Google Sheets. A range is the smallest part of Spreasheet object model. Having a range, the script will find all parent objects from it if needed.

More info about Jobs:
1. [How to use Jobs](https://sheetswithmaxmakhrov.wordpress.com/2019/09/05/clear-my-ranges-jobs-%f0%9f%94%a5/)
2. [General info](https://sheetswithmaxmakhrov.wordpress.com/2019/09/02/jobs/)
3. [How I store variables](https://sheetswithmaxmakhrov.wordpress.com/2018/12/18/sheetjobs-how-i-store-variables-for-my-projects/) — about the file [Const.gs](https://github.com/Max-Makhrov/sheetjobs/blob/master/const_.gs)


## Jobs structure
Jobs is a Google Spreadhsheet file. The file contains of 3 sheets:

![Jobs sheets](https://sheetswithmaxmakhrov.files.wordpress.com/2019/09/jobs-sheets.png)


|Sheet Name|Description|
|--|--|
|\_Jobs_Promo\_|Introductory sheet. This sheet is not used by script or any dependent formulas.|
|\_Jobs\_|Sheet with settings — main sheet of Jobs.|
|\_ini\_|Technical sheet. Used by script to get variables.|

## Settings Jobs
All settings are in the sheet \_Jobs\_:
![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2019/09/jobs_allsets-1.png?w=676)

↑ Each line of settings represents one task for Jobs.

 The table below gives basic info about settings. 

 Notes:

 - Some settings may be left blank. In this case the script will use
   default values (see the coulum |Default|).   
  - Some settings are the
   same for all tasks (see the *basic* type in column |Type|).

|Column|Description|Type|Default|
|-----------|-----------|----|--|
|Task Id|The *unique* ID of a task. Use numbers `1, 2, 3`. Textual format of ids is also possible: `1a, 1b, my task`. CAUTION: use unique IDs only! 2 tasks with the same ID will run simultanously, which may cause errors.|basic<sup id="a1">[1](#f1)</sup>|-|
|File Id|Get file id from the browser URL: ![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2019/09/jobs_fileid.png?w=676)  Or get file id from the script using [`File.GetId()`](https://developers.google.com/apps-script/reference/drive/file#getid) method.|basic|The file where whe script was executed: [`SpreadsheetApp.getActive()`](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getActive%28%29)|
|Sheet Name|The name of a sheet.|basic|The left-most sheet in a file: [`File.getSheets[0]`](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#getsheets).
|Range-A1|A range address in A1-Notation|basic|A range with data: [`sheet.getDataRange()`](https://developers.google.com/apps-script/reference/spreadsheet/sheet#getdatarange)
|Range Type|3 options: `range only`, `range and columns behind`, `range up to the end of sheet`|basic|`range only`|
|Operation|The name of a function to run. You may use [Jobs functions](#jobs-functions) or develop new functions for your needs.|special<sup id="a2">[2](#f2)</sup>|-|
|Option1, Option2, Option3|Contains any text depending on the script settings.|special|-|
|Tag|The name of a group of tasks. Use it to easily run multiple tasks with one line of code: `run_JOBS_('Clear Ranges');` where `Clear Ranges` is your custom tag.|basic|-|

 <small id="f1">1. *basic* options are the same for all tasks.  </small> [↩](#a1)
 
 <small id="f2">2. *special* options differs for different tasks.  </small> [↩](#a2)

## Jobs Script
To see the script, in Jobs file go to menu: Tools > Script Editor.

The basic usage is to run this code:

    // Change tag /tags and run the function
    // To run more then 1 tag, use semicolon as a delimeter: Clear Ranges;Log Values
    function test_Jobs()
    {
      // Test Tags:
      //   --------------------------------------------------------------------------
      //   Clear Ranges     = clear values from selected 
      //   Log Values       = run the code and open the log: [Ctrl]+[Enter] 
      //   Copy Report      = create a copy of the given report-template
      //   Fill Report      = fill the report with the portion of filtered data
      //   --------------------------------------------------------------------------
      run_JOBS_('Clear Ranges');    
    }

The core of Jobs functionality is using data. Data is stored in Google Sheets as 2-d arrays:

    [
     [value], [value],
     [value], [value],
     [value], [value]
    ]
↑ This sample data contains 2 columns and 3 rows.

Here's how the script treats data:

|Script option|Description|
|-------------|-----------|
|Save data|The script writes data to the global object `CCC_REM`. You set the `key` of variable. Script saves the data with this key: `CCC_REM[key] = data;`|
|Get data|Use key to get the data: `CCC_REM[key]`. The code to log the data: `Logger.log(CCC_REM[key]);`. To see the log in Google-Script-Editor, press [Ctrl]+[Enter]|

 ## Jobs Functions
Full list of Jobs functions

|Operation|Description|Options|
|-------------|-----------|-------|
|clearRangeContents_|Clears contents from selected range|no|
|rememberValues_|Remembers data from selected range |[link](#rememberValues_)|
|logValues_|Logs values from the memory og Google-Apps-Script|[link](#logValues_)|
|copyByTemplate_|Creates a copy of Spreadsheets with settings.|[link](#copyByTemplate_)|
|filterByColumn_|Filters data by 1 column and remembers new filtered data.|[link](#filterByColumn_)|
|writeValues_|Writes data to a sheet|[link](#writeValues_)|
|createDataValidation_|Creates drop-down list in a range|[link](#createDataValidation_)|
|groupRows_|Creates a new row group for selected range|no|
|ungroupRows_|Clears all row groups in selected range|no|
|sendGmail_|Clears all row groups in selected range|[link](#sendGmail_)|


### rememberValues_
|Column|Sample Value|Description|
|--|--|--|
|Option1|`myVar`|The key (name) of variable. The script will remember values from selected range: `CCC_REM[Option1] = values;`|

### logValues_
|Column|Sample Value|Description|
|--|--|--|
|Option1|`myVar`|The key (name) of variable. The script will log values from memory: `Logger.log(CCC_REM[Option1]);`|

### copyByTemplate_
Creates a copy of Spreadsheets with settings. 

|Column|Sample Value|Description|
|--|--|--|
|Option1|`Smith`|The copied file has a cell with changed parameter. The script changes this cell content to Option1-value: `range.setValue(Option1);`. The script also uses it in the new file's name: `copy.setName(prefix + Option1 + postfix);`|
|Option2|`1fqhDJz4ZRkeSphqipOYBTw8lwMifwkW6~Report_~_created by Jobs`|3 parameters delimited by `~`: folder ID, file's name prefix, file's name postfix. Folder ID = the ID of distination folder. The script will create new file in this folder. Prefix and postfix are used for file naming.|
|Option3|`Jardine_fileId`|The key (name) of variable. The script will put the file id into this key: `CCC_REM[Option3] = [[id]]; // save as 2d array`|

### filterByColumn_
|Column|Sample Value|Description|
|--|--|--|
|Option1|`data_mastrer`|The key (name) of variable. The script will get values from the memory: `var data_in = CCC_REM[Option1];`|
|Option2|`data_Smith`|The key (name) of variable. The script will save filtered values to the memory: `CCC_REM[Option2] = data_out;`|
|Option3|`Col3~Smith`|2 parameters delimited by `~`: column to filter, value to leave. In this case, filter by column 3 where value = 'Smith'. Columns are counted from left to rigth, the first column has index = 1: Col1, Col2, Col3, ...|

### writeValues_
|Column|Sample Value|Description|
|--|--|--|
|Option1|`data_Smith`|The key (name) of variable. The script will get values from memory: `var data = CCC_REM[Option1];`. The script will write the data to selected range.|

### createDataValidation_
|Column|Sample Value|Description|
|--|--|--|
|Option1|`'_cost-groups_'!A3:A1000`|The full A1-address of a range with data for validation: `var dvrange = file.getRange(Option1);`. New validation rule will be created with this range as source: `validation.requireValueInRange(dv_range);`.|


### sendGmail_

|Column|Sample Value|Description|
|--|--|--|
|Option1|`test1@test.com;test2@test.com`|Recipient - list delimited by semicolon `;`|
|Option2|`Test email from Jobs`|Subject|
|Option3|`<p>Dear Max!</p><p>Someone is happily testing Jobs. Please <i>do not reply</i> to this message.</p>`|Body|

----

## Archive samples (will migrate to Jobs):

### Files & Folders
[**FolderFiles**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/FolderFiles.gs)
Create a list of all files from selected folders.

[**FileCopier**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/FileCopier.gs)
Copy files to a selected folder.

[**FolderMaker**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/FolderMaker.gs)
Create new folders.

### Sheets & Ranges

[**RangeCopier**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/RangeCopier.gs)
Copy ranges to custom ranges, sheets, and files.

[**SheetsCopier**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/SheetsCopier.gs)
Copy multiple sheets. Remain formulas, named ranges, protections and sheet names.

[**SheetsDeleter**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/SheetsDeleter.gs)
Delete multiple sheets.

[**TeplatesCopier**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/TemplatesCopier.gs)
Create custom reports. Copy own template, rename it, set it to show different data.

### Other
[**Emailer**](https://github.com/Max-Makhrov/sheetjobs/blob/master/archive/Emailer.gs)
Send custom emails


## Lisense
<a name="top"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
<a name="overview"></a>
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTExMDYwMDI4MzEsMTc1MTMyMDg0NCwtOD
MxMTExMjM4LC0xNTM5NjYwODc5LDI1NzM5NTA1NSwxOTY5Mjg3
MTEsMTg4MDE3MTk3OSwzNDAzMDMyNDksLTg3ODExMTQsLTEyNT
Q1MTEwOTgsMTAwNTMxNzMwMCwtMzExMDE2ODIzXX0=
-->