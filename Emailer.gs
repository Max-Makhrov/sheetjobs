// copy sample file: https://docs.google.com/spreadsheets/d/1b55qnMP1QfqQ1xLR-ooafV-k4Hpj8BbQvrrDBo313B0/copy
function test_Emailer()
{
  var t = new Date();
  var ids = false; // use "1;2;3" to copy certain task ids 
  var res = runEmails_(ids);
  Logger.log(res);
  Logger.log('Time to run the script = ' + (new Date() -t) + ' ms.');
}




function runEmails_(ids) {
  getSettings_();
  var d1 = CCC_.STR_DELIMEER1;
  var d2 = CCC_.STR_DELIMEER2;
  var allids = CCC_.STR_IDS_EMAILER.split(d2);
  var allemails = CCC_.STR_EMAILS_EMAILER.split(d2);
  var alltitles = CCC_.STR_TITLES_EMAILER.split(d2);
  var allmsgs = CCC_.STR_HTMLS_EMAILER.split(d2);
      
  if (ids) { var idslist = ids.split(d1); }
  else { idslist = allids; }
  var id = -1, index;
  
  for (var i = 0, l = idslist.length; i < l; i++)
  {
    
    id = idslist[i];
    index = allids.indexOf(id);    
    if (index > -1)
    {
      var emailer = 
          {
            emails: allemails[index].split(d1),
            title: alltitles[index],
            msg: allmsgs[index]
          };
      runEmailer_(emailer)      
    }    
  }
  return 0;  
}


function runEmailer_(emailer)
{ 
  if(emailer.msg === '') { return -1; } // not send empty email
  GmailApp.sendEmail(
    emailer.emails[0],               // recipient
    emailer.title,                   // subject 
    'test', {                        // body
      htmlBody: emailer.msg,         // advanced options
      cc:emailer.emails.join(',')    // all recipients 
    }
  );
  return 0;
}
