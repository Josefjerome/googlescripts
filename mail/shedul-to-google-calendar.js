// parse new appointment mails from shedul.com 
// create google calendar entry to specific calendar

function createNewAppointments() {
    var interval = 5;    //  if the script runs every 5 minutes; change otherwise
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    if ([6,0].indexOf(day) > -1 || (day >=1 && day<=6 && (hour < 8 || hour >= 17))) {
  //    var timeFrom = Math.floor(date.valueOf()/1000) - 60 * interval;
      var threads = GmailApp.search('from:notifications@shedul.com subject:new appointment after:');
      var findDate = /^((Mon|Tue|Wed|Thur|Fri|Sat).+)$/gim;
      var findEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gim;
      var findPhone = /^\+?[0-9]?\s?\(?[0-9]{3}\)?\s[0-9]{3}\-?[0-9]{4}?$/gim;
      var breakL = /\n/gim;
      var extDate = /([0-9]{1,2}\s[a-zA-Z]{3}\s[0-9]{4})|([0-9]{1,2}\:[0-9]{1,2})/g;
  
      for (var i = 0; i < threads.length; i++) {  
  //      threads[i].markUnread();
  //      Logger.log(threads[i].isUnread());
        if (threads[i].isUnread()){
          var messages = threads[i].getMessages();
          for (var i2 = 0; i2 < messages.length; i2++) { 
  //          messages[i2].markUnread();
            if(messages[i2].isUnread()){
              var str1 = messages[i2].getPlainBody();
              //          Logger.log(str1);
              
      var calProps = {
        titles:[],
        dates:[],
        email: null,
        phone: null,
        name: null
      };
              
              var str_a = str1.split(breakL).filter(function(word,ix){
                if(word.match(extDate)){
                  var dt = {
                    from: new Date(word.match(extDate).join(" ")+(word.match(/(pm)/)?' pm':' am')+"-05:00"),
                    to : new Date(word.match(extDate).join(" ")+(word.match(/(pm)/)?' pm':' am')+"-05:00")
                  };
                  dt.to = new Date(dt.to.setHours(dt.to.getHours() + 1));
                  calProps.dates.push(dt);
                  return true;
                }else if(word.match(findEmail)){
                  calProps.email = word;
                  return true
                }else if(word.match(findPhone)){
                  calProps.phone = word;
                  return true;
                }else{
                  // look ahead
                  if(findDate.test(str1.split(breakL)[ix+1])){
                    calProps.titles.push(word);
                    return true;
                  }else if(findEmail.test(str1.split(breakL)[ix+1])){
                    calProps.name = word;
                    return true;
                  }else{
                    return false;
                  }
                }
              });
              
              Logger.log(calProps);
              for(var i3=0; i3 < calProps.titles.length; i3++){
                var event = CalendarApp.getCalendarsByName('Salon Bookings')[0]
                .createEvent("Online Booking : Salon Appointment for "+calProps.name,calProps.dates[i3].from,calProps.dates[i3].to,{
                  location: "29 Kings House Ave, Kingston, Jamaica",
                  guests: calProps.email,
                             description: calProps.titles[i3]+"\n\nMessage Body:\n"+str1
                });
                //          event.setVisibility(Visibility.PUBLIC);
                Logger.log("EventId: "+event.getId()+"\n");
                Logger.log("EventTitle: "+event.getTitle()+"\n");
                Logger.log("EventST: "+event.getStartTime()+"\n");
                Logger.log("EventST: "+event.getGuestList()+"\n");
              }
              messages[i2].markRead();
            }
            
          }
          
   
  //        threads[i].reply("I am out of office. Our business hours are: \n Manufacturing (Mon-Wed 9am-5pm)\n Salon (Thur-Sat 9am until our last client leaves), no bookings after 5pm.\n\n We apologize for any inconvenience caused: kindly allow until next business day to respond to any of your queries.\n\n Cheers,\nSherelle Curtis Mrs\nOwner\Operator\Team Lead",{
  //          htmlBody:"I am out of office. Our business hours are: <ul><li>Manufacturing (Mon-Wed 9am-5pm)</li><li>The Beauty Bar (Thur-Sat 9am until our last client leaves), no bookings after 5pm.<</li></ul>\n\n We apologize for any inconvenience caused: kindly allow until next business day to respond to any of your queries.Cheers,\nSherelle Curtis Mrs\nOwner\Operator\Team Lead",
  //          noReply:true
  //        });
          
        threads[i].markRead();
        threads[i].markImportant();
        }
      }
    }
  }
  