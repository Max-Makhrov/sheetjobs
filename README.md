
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
Languages: Google-Apps-Script, JavaScript.

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
|Task Id|The *unique* ID of a task. Use numbers `1, 2, 3`. Textual format of ids is also possible: `1a, 1b, my task`. CAUTION: use unique IDs only! 2 tasks with the same ID will run simultanously, which may cause errors.|basic (options are the same for all tasks)|-|
|File Id|Get file id from the browser URL: ![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2019/09/jobs_fileid.png?w=676)  Or get file id from the script using [`File.GetId()`](https://developers.google.com/apps-script/reference/drive/file#getid) method.|basic|The file where whe script was executed: [`SpreadsheetApp.getActive()`](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getActive%28%29)|
|Sheet Name|The name of a sheet.|basic|The left-most sheet in a file: [`File.getSheets[0]`](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#getsheets).
|Range-A1|A range address in A1-Notation|basic|A range with data: [`sheet.getDataRange()`](https://developers.google.com/apps-script/reference/spreadsheet/sheet#getdatarange)
|Range Type|3 options: `range only`, `range and columns behind`, `range up to the end of sheet`|basic|`range only`|
|Operation|The name of a function to run. You may use [Jobs functions](#jobs-functions) or develop new functions for your needs.|special (options differs for different tasks)|-|
|Option1, Option2, Option3|Contains any text depending on the script settings.|special|-|
|Tag|The name of a group of tasks. Use it to easily run multiple tasks with one line of code: `run_JOBS_('Clear Ranges');` where `Clear Ranges` is your custom tag.|basic|-|

## Jobs Script
To see the script, in Jobs file go to menu: Tools > Script Editor.

The basic usege is to run this code:

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
|Save data|The script writes data to the global object `CCC_`. You set the `key` of variable. Script saves the data with this key: `CCC_[key] = data;`|
|Get data|Use key to get the data: `CCC_[key]`. The code to log the data: `Logger.log(CCC_[key]);`. To see the log in Google-Script-Editor, press [Ctrl]+[Enter]|

 ## Jobs Functions
Full list of Jobs functions

|Function name|Description|Options|
|-------------|-----------|-------|
|clearRangeContents_|Clears contents from selected range.|no|
|rememberValues_|Remembers data from selected range. |[link](#rememberValues_)|
|logValues_|Logs values from the memory og Google-Apps-Script.|[link](#logValues_)|
|copyByTemplate_|Creates a copy of Spreadsheets with settings.|link|
|filterByColumn_|Filters data by 1 column and remembers new filtered data.|link|
|writeValues_|Writes data to a sheet|link|

### rememberValues_
|Column|Sample Value|Description|
|--|--|--|
|Option1|myVar|The key (name) of variable|

### logValues_
|Column|Sample Value|Description|
|--|--|--|
|Option1|myVar|The key (name) of variable|



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
eyJoaXN0b3J5IjpbMTYxMjQ4NDQ0XX0=
-->