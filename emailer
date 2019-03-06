// file sample is here: https://docs.google.com/spreadsheets/d/1b55qnMP1QfqQ1xLR-ooafV-k4Hpj8BbQvrrDBo313B0

function runEmails_test1()
{
  runEmails_('1;2'); // ids --- '1;2;3'
}


function runEmails_(ids) {
  getSettings_();
  var allids = STR_IDS_EMAILER.split(STR_DELIMEER2);
  var allemails = STR_EMAILS_EMAILER.split(STR_DELIMEER2);
  var alltitles = STR_TITLES_EMAILER.split(STR_DELIMEER2);
  var allmsgs = STR_HTMLS_EMAILER.split(STR_DELIMEER2);
      
  var idslist = ids.split(STR_DELIMEER1);
  var id = -1, index;
  
  for (var i = 0, l = idslist.length; i < l; i++)
  {
    
    id = idslist[i];
    index = allids.indexOf(id);    
    if (index > -1)
    {
      var emailer = 
          {
            emails: allemails[index].split(STR_DELIMEER1),
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
