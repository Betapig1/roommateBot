var Discord = require('discord.js')
var client = new Discord.Client()
const mongoose = require("mongoose");
const ProfileModel = require("./Models/profile")
const mongo = url

mongoose.connect(mongo,
    { useNewUrlParser: true },
    () => console.log("connected to DB"))

 

client.login(token)


client.on('ready', () => {



    console.log(client.guilds)
    console.log("Connected as " + client.user.tag);

    setInterval (serverCount, 15000)
    client.user.setActivity("&help in " + client.guilds.cache.size + " servers")


    //timer code currently disabled as the bot is now running on multiple servers

    //creates a timer to remind my players about D&D
    //setInterval(function(){ // Set interval for checking
        //var date = new Date();// Create a Date object to find out what time it is
    
        //var week = date.getDay();
    
        //console.log(week);
        //console.log(date.getHours());
        ///console.log(date.getMinutes());
    
        //if(date.getHours() === 8 && date.getMinutes() === 0 && week == 4){ // Check the time
            //var channel = client.channels.cache.get('735284750998306920');
                //channel.send('@everyone dnd today');
       /// }
  //  }, 60000); // Repeat every 60000 milliseconds (1 minute)
    
    

})



client.on('message', (recievedMessage, channel) => {

    //stops the if statements if the bot is the one that sent a message, prevents loops

    




    if (recievedMessage.author == client.user){


        return

    }

    else {





    console.log(recievedMessage.content.startsWith)
        //checks if the command symbol was used
        if (recievedMessage.content.startsWith("&")) {



                //if so it sends the message to the function that checks what the command is
                processCommand(recievedMessage)


        }


    }
})



function serverCount (){
    //updates the bots count of how many servers it is in

    client.user.setActivity("&help in " + client.guilds.cache.size + " servers")

}


async function processCommand(recievedMessage){




    






    //removes the symobl
    let fullCommand = recievedMessage.content.substr('1')

    //splits the message into seperate words in an array
    let splitCommand = fullCommand.split(" ")

    //sets the command to look for as the first index of the array
    let primaryCommand = splitCommand[0]
  
    console.log(primaryCommand);

    if (primaryCommand == "create"||primaryCommand=="Create"){


      

        createProfile(recievedMessage);

}
else if(primaryCommand == "find"||primaryCommand=="Find"){
    sendList(recievedMessage)
}
else if(primaryCommand == "update"||primaryCommand=="Update"){
    update(recievedMessage)
}






else{

    recievedMessage.channel.send("Hey, looks like that's not one of my commands. Go ahead and do &help to see what my commands are")


}


}


async function sendList(recievedMessage){
    var show = []
    let channel = recievedMessage.author.dmChannel;
   
if (!channel) channel = await recievedMessage.author.createDM();
   ProfileModel.find({}, function(err, res){
       var all = res;
    ProfileModel.find({user:recievedMessage.author.username}, function(err, res){
        var me = res[0];
       
       for(var x = 0; x<all.length;x++){
           if(all[x].show){
               if(all[x].user!=recievedMessage.author.username){
                if(me.comfort.includes(all[x].gender)){
                    if(all[x].comfort.includes(me.gender)){
                    percentage = Math.abs(me.time-all[x].time)+Math.abs(me.tidy-all[x].tidy)+Math.abs(me.introvert-all[x].introvert)
                    percentage = ((percentage/13)*-100)+100
                   }
                   
                   
                   var temp = [all[x],percentage];
                  
                   show.push(temp)
                    }
               }
           }
       }
      
       var currentNum = 0;
       show.sort((a,b)=>{
         
         a[1]-b[1]?1:-1
       })
       var listListener = async(reaction, user) =>{
        if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
            if(reaction._emoji.name == "◀️"){
                currentNum=currentNum-1
                console.log(currentNum)
            }else{currentNum++}
            console.log(currentNum)
            if(currentNum<0){
                console.log(show.length)
                currentNum=show.length-1;
            }
            else if(currentNum>show.length-1){
                currentNum=0
            }
            console.log(currentNum)
            profileUpdate(currentNum)
            //channel.send("Thank you! Your profile has been added to the database. You can view what you put with &profile, or you can look for roommate with &find")
        }
    }
    var currMessage;
    async function profileUpdate(num){
        console.log(show)
        if(show.length>0){
        if(currMessage==undefined){
       currMessage = await channel.send("Name: " + show[num][0].name + "\nCompatibility: "+ show[num][1]+ "\nDiscord Name: " + show[num][0].user)
        currMessage.react("◀️")
        currMessage.react("▶️")}
        else{
            currMessage.edit("Name: " + show[num][0].name + "\nCompatibility: "+ show[num][1]+ "\nDiscord Name: " + show[num][0].user)
        }}else{channel.send("Sorry, there aren't any available profiles at this time. Please try again later!")}
    }
    profileUpdate(currentNum)
    client.on("messageReactionAdd",listListener)
    client.on("messageReactionRemove",listListener)
     
    })
})




}


async function update(recievedMessage){
    var profile;
   ProfileModel.find({user:recievedMessage.author.username}, function(err, res){
     profile=res[0]
     console.log("INSIDE",res)
    })
    console.log("outside",profile)
    //console.log(update)
    let channel = recievedMessage.author.dmChannel;
    console.log(recievedMessage.author)
if (!channel) channel = await recievedMessage.author.createDM();

      channel.send("Thank you for choosing my Roommate Finder bot to help you find roommate for your microsoft internship \n\nFirst I need to ask you a few questions. What's your name?").then(msg => {
        channel.awaitMessages(()=>true, { 
            max: 1, 
            time: 10000, 
            errors: ['time'] })

            .then(async(collected )=>{var mes = collected.first() 
                profile.name=mes.content;
              var currentMessage = await channel.send("Thanks "+ mes.content+"! Now for the next question, for these ones you'll just need to react to the message\n\nAre you more of a night owl?:owl:\n\n Or an early bird?:bird:  ")
                currentMessage.react('🦉')
                currentMessage.react("🐦")
                var nightListener = async(reaction, user) =>{
                    console.log(reaction)
                   console.log(user.username)
                   if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                       if(reaction._emoji.name=="🦉"){
                           profile.time=0
                       }else{profile.time=2}
                       console.log("remove")
                       client.removeListener("messageReactionAdd",nightListener)
                       currentMessage.delete()
                       var tidy = await channel.send("Perfect, next question, on a scale from 1-5, how clean/tidy would you say your are?")
                       tidy.react('1️⃣')
                       tidy.react("2️⃣")
                       tidy.react('3️⃣')
                       tidy.react("4️⃣")
                       tidy.react('5️⃣')
                       var tidyListener = async(reaction, user) =>{
                       if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                           console.log(reaction._emoji.name)
                        if(reaction._emoji.name=="1️⃣"){
                            profile.tidy=1
                        }
                        else if(reaction._emoji.name=="2️⃣"){
                            profile.tidy=2
                        }
                        else if(reaction._emoji.name=="3️⃣"){
                            
                            profile.tidy=3
                        }
                        else if(reaction._emoji.name=="4️⃣"){
                            profile.tidy=4
                        }
                        else if(reaction._emoji.name=="5️⃣"){
                            profile.tidy=5
                        }
                        console.log(profile)


                        console.log("remove")
                        client.removeListener("messageReactionAdd",tidyListener)
                        tidy.delete()
                        var introvert = await channel.send("On a scale from 1-5, 1 being very introverted, 5 beign very extroverted, how much would you consider yourself an introvert/extrovert?")
                        introvert.react('1️⃣')
                        introvert.react("2️⃣")
                        introvert.react('3️⃣')
                        introvert.react("4️⃣")
                        introvert.react('5️⃣')
                        var introvertListener = async(reaction, user) =>{
                            if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){

                                if(reaction._emoji.name=="1️⃣"){
                                    profile.introvert=1
                                }
                                else if(reaction._emoji.name=="2️⃣"){
                                    profile.introvert=2
                                }
                                else if(reaction._emoji.name=="3️⃣"){
                                    profile.introvert=3
                                }
                                else if(reaction._emoji.name=="4️⃣"){
                                    profile.introvert=4
                                }
                                else if(reaction._emoji.name=="5️⃣"){
                                    profile.introvert=5
                                }

                        console.log("remove")
                        client.removeListener("messageReactionAdd",introvertListener)
                        introvert.delete();
                        var gender = await channel.send("What gender do you identify as? Male :male_sign: , Female :female_sign: , Non-Binary :rainbow_flag: , or something not listed :question: ?")
                        gender.react("♂️")
                        gender.react("♀️")
                        gender.react("🏳️‍🌈")
                        gender.react("❓")
                       
                        var genderListener = async(reaction, user) =>{
                            if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                                if(reaction._emoji.name=="♂️"){
                                    profile.gender="Male"
                                }
                                else if(reaction._emoji.name=="♀️"){
                                    profile.gender="Female"
                                }
                                else if(reaction._emoji.name=="🏳️‍🌈"){
                                    profile.gender="Non-Binary"
                                }
                                else if(reaction._emoji.name=="❓"){
                                    profile.gender="Other"
                                }
                                
                                var comfortArray=[]
                                console.log("remove")
                                client.removeListener("messageReactionAdd",genderListener)
                                gender.delete();
                                var comfort = await channel.send("Which genders are you comfortable being roommates with? Select all that apply, and press the arrow :arrow_forward: when you're done. Male :male_sign: , Female :female_sign: , Non-Binary :rainbow_flag: , or something not listed :question: ?")
                                comfort.react("♂️")
                                comfort.react("♀️")
                                comfort.react("🏳️‍🌈")
                                comfort.react("❓")
                                comfort.react("▶️")
                                var remove = async(reaction,user)=>{
                                    var check;
                                    if(reaction._emoji.name=="♂️"){
                                        check = "Male"
                                    }
                                    else if(reaction._emoji.name=="♀️"){
                                        check = "Female"
                                    }
                                    else if(reaction._emoji.name=="🏳️‍🌈"){
                                        check="Non-Binary"
                                    }
                                    else if(reaction._emoji.name=="❓"){
                                        check="Other"
                                    }
                                    for(var x = 0; x<comfortArray.length;x++){
                                        if(comfortArray[x]==check){
                                            comfortArray.splice(x,1);
                                        }
                                    }
                                    console.log(comfortArray)

                                }
                                var comfortListener = async(reaction, user) =>{
                                    if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                                        if(reaction._emoji.name=="♂️"){
                                            comfortArray.push("Male")
                                        }
                                        else if(reaction._emoji.name=="♀️"){
                                            comfortArray.push("Female")
                                        }
                                        else if(reaction._emoji.name=="🏳️‍🌈"){
                                            comfortArray.push("Non-Binary")
                                        }
                                        else if(reaction._emoji.name=="❓"){
                                            comfortArray.push("Other")
                                        }
                                        console.log(comfortArray)
                                    }
                                    if((user.username!="Roommate Finder"&&user.username==recievedMessage.author.username)&&reaction._emoji.name=="▶️"){
                                       profile.comfort=comfortArray;
                                        console.log("remove")
                                        client.removeListener("messageReactionAdd",comfortListener)
                                        client.removeListener("messageReactRemove",remove)
                                        comfort.delete();
                                       var show = await channel.send("Would you like to be listed as looking for a roommate? (P.S. This, and everything else can be changed later with &update")
                                        show.react("👍")
                                        show.react("👎")
                                        var showListener = async(reaction, user) =>{
                                            if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                                                client.removeListener("messageReactionAdd",showListener)
                                                if(reaction._emoji.name=="👍"){
                                                    profile.show=true
                                                }
                                                else{profile.show=false}
                                                console.log(profile)
                                                var prof = new ProfileModel({
                                                    user:profile.user,
                                                    name:profile.name,
                                                    time:profile.time,
                                                    tidy:profile.tidy,
                                                    introvert:profile.introvert,
                                                    gender:profile.gender,
                                                    comfort:profile.comfort,
                                                    show:profile.show
                                                })
                                                ProfileModel.find({user:recievedMessage.author.username}, function(err, res){
                                                    profile=res[0]
                                                    res[0].remove()
                                                   })
                                               
                                                prof.save()
                                                channel.send("Thank you! Your profile has been added to the database. You can look for roommate with &find")
                                            }
                                        }
                                        client.on("messageReactionAdd",showListener)
                                    }
                                   
                                }
                                client.on("messageReactionRemove",remove)
                                client.on("messageReactionAdd",comfortListener)
                            }

                        }
                        client.on("messageReactionAdd",genderListener)
                    
                    }
                        }
                        client.on("messageReactionAdd",introvertListener)
                     }

                    }
                    client.on("messageReactionAdd",tidyListener)

                    
                    
                    }
                }
                client.on("messageReactionAdd",nightListener)
                
            })

            .catch(collected => channel.send("Operation Cancelled"));
    });
        


}




async function createProfile(recievedMessage){

    var profile = {user:recievedMessage.author.username}

    let channel = recievedMessage.author.dmChannel;
    console.log(recievedMessage.author)
if (!channel) channel = await recievedMessage.author.createDM();

      channel.send("Thank you for choosing my Roommate Finder bot to help you find roommate for your microsoft internship \n\nFirst I need to ask you a few questions. What's your name?").then(msg => {
        channel.awaitMessages(()=>true, { 
            max: 1, 
            time: 10000, 
            errors: ['time'] })

            .then(async(collected )=>{var mes = collected.first() 
                profile.name=mes.content;
              var currentMessage = await channel.send("Thanks "+ mes.content+"! Now for the next question, for these ones you'll just need to react to the message\n\nAre you more of a night owl?:owl:\n\n Or an early bird?:bird:  ")
                currentMessage.react('🦉')
                currentMessage.react("🐦")
                var nightListener = async(reaction, user) =>{
                    console.log(reaction)
                   console.log(user.username)
                   if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                       if(reaction._emoji.name=="🦉"){
                           profile.time=0
                       }else{profile.time=2}
                       console.log("remove")
                       client.removeListener("messageReactionAdd",nightListener)
                       currentMessage.delete()
                       var tidy = await channel.send("Perfect, next question, on a scale from 1-5, how clean/tidy would you say your are?")
                       tidy.react('1️⃣')
                       tidy.react("2️⃣")
                       tidy.react('3️⃣')
                       tidy.react("4️⃣")
                       tidy.react('5️⃣')
                       var tidyListener = async(reaction, user) =>{
                       if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                           console.log(reaction._emoji.name)
                        if(reaction._emoji.name=="1️⃣"){
                            profile.tidy=1
                        }
                        else if(reaction._emoji.name=="2️⃣"){
                            profile.tidy=2
                        }
                        else if(reaction._emoji.name=="3️⃣"){
                            
                            profile.tidy=3
                        }
                        else if(reaction._emoji.name=="4️⃣"){
                            profile.tidy=4
                        }
                        else if(reaction._emoji.name=="5️⃣"){
                            profile.tidy=5
                        }
                        console.log(profile)


                        console.log("remove")
                        client.removeListener("messageReactionAdd",tidyListener)
                        tidy.delete()
                        var introvert = await channel.send("On a scale from 1-5, 1 being very introverted, 5 beign very extroverted, how much would you consider yourself an introvert/extrovert?")
                        introvert.react('1️⃣')
                        introvert.react("2️⃣")
                        introvert.react('3️⃣')
                        introvert.react("4️⃣")
                        introvert.react('5️⃣')
                        var introvertListener = async(reaction, user) =>{
                            if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){

                                if(reaction._emoji.name=="1️⃣"){
                                    profile.introvert=1
                                }
                                else if(reaction._emoji.name=="2️⃣"){
                                    profile.introvert=2
                                }
                                else if(reaction._emoji.name=="3️⃣"){
                                    profile.introvert=3
                                }
                                else if(reaction._emoji.name=="4️⃣"){
                                    profile.introvert=4
                                }
                                else if(reaction._emoji.name=="5️⃣"){
                                    profile.introvert=5
                                }

                        console.log("remove")
                        client.removeListener("messageReactionAdd",introvertListener)
                        introvert.delete();
                        var gender = await channel.send("What gender do you identify as? Male :male_sign: , Female :female_sign: , Non-Binary :rainbow_flag: , or something not listed :question: ?")
                        gender.react("♂️")
                        gender.react("♀️")
                        gender.react("🏳️‍🌈")
                        gender.react("❓")
                       
                        var genderListener = async(reaction, user) =>{
                            if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                                if(reaction._emoji.name=="♂️"){
                                    profile.gender="Male"
                                }
                                else if(reaction._emoji.name=="♀️"){
                                    profile.gender="Female"
                                }
                                else if(reaction._emoji.name=="🏳️‍🌈"){
                                    profile.gender="Non-Binary"
                                }
                                else if(reaction._emoji.name=="❓"){
                                    profile.gender="Other"
                                }
                                
                                var comfortArray=[]
                                console.log("remove")
                                client.removeListener("messageReactionAdd",genderListener)
                                gender.delete();
                                var comfort = await channel.send("Which genders are you comfortable being roommates with? Select all that apply, and press the arrow :arrow_forward: when you're done. Male :male_sign: , Female :female_sign: , Non-Binary :rainbow_flag: , or something not listed :question: ?")
                                comfort.react("♂️")
                                comfort.react("♀️")
                                comfort.react("🏳️‍🌈")
                                comfort.react("❓")
                                comfort.react("▶️")
                                var remove = async(reaction,user)=>{
                                    var check;
                                    if(reaction._emoji.name=="♂️"){
                                        check = "Male"
                                    }
                                    else if(reaction._emoji.name=="♀️"){
                                        check = "Female"
                                    }
                                    else if(reaction._emoji.name=="🏳️‍🌈"){
                                        check="Non-Binary"
                                    }
                                    else if(reaction._emoji.name=="❓"){
                                        check="Other"
                                    }
                                    for(var x = 0; x<comfortArray.length;x++){
                                        if(comfortArray[x]==check){
                                            comfortArray.splice(x,1);
                                        }
                                    }
                                    console.log(comfortArray)

                                }
                                var comfortListener = async(reaction, user) =>{
                                    if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                                        if(reaction._emoji.name=="♂️"){
                                            comfortArray.push("Male")
                                        }
                                        else if(reaction._emoji.name=="♀️"){
                                            comfortArray.push("Female")
                                        }
                                        else if(reaction._emoji.name=="🏳️‍🌈"){
                                            comfortArray.push("Non-Binary")
                                        }
                                        else if(reaction._emoji.name=="❓"){
                                            comfortArray.push("Other")
                                        }
                                        console.log(comfortArray)
                                    }
                                    if((user.username!="Roommate Finder"&&user.username==recievedMessage.author.username)&&reaction._emoji.name=="▶️"){
                                       profile.comfort=comfortArray;
                                        console.log("remove")
                                        client.removeListener("messageReactionAdd",comfortListener)
                                        client.removeListener("messageReactRemove",remove)
                                        comfort.delete();
                                       var show = await channel.send("Would you like to be listed as looking for a roommate? (P.S. This, and everything else can be changed later with &update")
                                        show.react("👍")
                                        show.react("👎")
                                        var showListener = async(reaction, user) =>{
                                            if(user.username!="Roommate Finder"&&user.username==recievedMessage.author.username){
                                                client.removeListener("messageReactionAdd",showListener)
                                                if(reaction._emoji.name=="👍"){
                                                    profile.show=true
                                                }
                                                else{profile.show=false}
                                                console.log(profile)
                                                var prof = new ProfileModel({
                                                    user:profile.user,
                                                    name:profile.name,
                                                    time:profile.time,
                                                    tidy:profile.tidy,
                                                    introvert:profile.introvert,
                                                    gender:profile.gender,
                                                    comfort:profile.comfort,
                                                    show:profile.show
                                                })
                                                prof.save()
                                                channel.send("Thank you! Your profile has been added to the database. You can look for roommate with &find")
                                            }
                                        }
                                        client.on("messageReactionAdd",showListener)
                                    }
                                   
                                }
                                client.on("messageReactionRemove",remove)
                                client.on("messageReactionAdd",comfortListener)
                            }

                        }
                        client.on("messageReactionAdd",genderListener)
                    
                    }
                        }
                        client.on("messageReactionAdd",introvertListener)
                     }

                    }
                    client.on("messageReactionAdd",tidyListener)

                    
                    
                    }
                }
                client.on("messageReactionAdd",nightListener)
                
            })

            .catch(collected => channel.send("Operation Cancelled"));
    });
        


}

