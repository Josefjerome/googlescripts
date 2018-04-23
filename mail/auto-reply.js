function autoReply_manu() {
  var interval = 5;    //  if the script runs every 5 minutes; change otherwise
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    if ([6,0].indexOf(day) > -1 || (day >=1 && day<=6 && (hour < 8 || hour >= 17))) {
      var timeFrom = Math.floor(date.valueOf()/1000) - 60 * interval;
      var threads = GmailApp.search('is:inbox after:' + timeFrom);
      for (var i = 0; i < threads.length; i++) {
        if (threads[i].isUnread()){
          for(var i2=0; i2 < threads[i].getMessages().length; i2++){
            var msg = threads[i].getMessages()[i2];
            if(msg.isUnread()){
              //PLACE YOUR EMAIL HERE TO EXCLUDE AUTO REPLY TO SERVICES YOU SUBSCRIBE TO]
              if(msg.getReplyTo()!="YOUR EMAIL HERE"){
                threads[i].reply("I am out of office. Our business hours are: \n Manufacturing (Mon-Wed 9am-5pm)\n Salon (Thur-Sat 9am until our last client leaves), no bookings after 5pm.\n\n We apologize for any inconvenience caused: kindly allow until next business day to respond to any of your queries.\n\n Cheers,\nSherelle Curtis Mrs\nOwner\Operator\Team Lead",{
                  htmlBody:"I am out of office. Our business hours are: <ul><li>Manufacturing (Mon-Wed 9am-5pm)</li><li>The Beauty Bar (Thur-Sat 9am until our last client leaves), no bookings after 5pm.<</li></ul>\n\n <p>We apologize for any inconvenience caused: kindly allow until next business day to respond to any of your queries.</p>Cheers,<br />Sherelle Curtis Mrs<br />Owner\Operator\Team Lead",
                  noReply:true
                });
                msg.markRead();
              }
            }
          }
          
          threads[i].markRead();
          threads[i].markImportant();
        }
      }
    }
  }