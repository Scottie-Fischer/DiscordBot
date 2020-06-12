require('dotenv').config();
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const mysql = require('mysql');
const Discord = require('discord.js')       //Connects this file to Discord API
const client = new Discord.Client();        //creating the bot
const token = process.env.BOT_TOKEN;        //This is the file that holds the token, so we can use github and still have a secure token

client.login(token);

client.on('ready', () => {
    console.log('This bot is online as: ' + client.user.tag + '!');
    //db.autheniticate().then(()=> console.log("Logged in!")).catch(err=>console.log(err));
})

//------------This is section for mysql data base------------//
var con = mysql.createConnection({
    host:   "localhost",
    user:   "Scott Fischer",
    poassword:  "leaf1234"
});
con.connect(function(err){
    if(err) return console.log("error");//throw "error";
    console.log("Connected!");
});
var gulaag_flag = 0;

//-----------------------Admin Section----------------------//
client.on('guildMemberAdd', newMember =>{
    let welcome_channel = newMember.guild.channels.cache.find(channel => channel.name === 'welcome-channel');
    if(welcome_channel == null){
        console.log("creating channel");
        welcome_channel = this_guild.channels.create("welcome-channel");
        welcome_channel = newMember.guild.channels.cache.find(channel => channel.name === 'welcome-channel');
    }
    else{
        console.log("welcome channel already exists");
    }
    welcome_channel.send("Welcome " + newMember.user.username + " this is the starting point. Please verify that you have read our rules.")
    .then(async function (message) {
        await message.react('✅')
        const filter = (reaction, user) => reaction.emoji.name === '👌' || user.id === newMember.id
        message.awaitReactions(filter, { time: 60000 })
        .then(collected => {
            console.log(`Collected ${collected.size} reactions`); 
            message.channel.send("Thank you!")
            //newMember.roles.add("717429828524965948");
        })
        .catch(console.error);
    });
});


//-----------------------Game Section-----------------------//
var gamecounter = 0;
var orginal_channel;

client.on('message', async message =>{
    let server = message.guild;
    
    if(!message.guild)return;   //Checks if the bot message is not in a server aka DM
    
    if(message.content.startsWith('//permaGulaag')){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send("You are scum, you need to be pure to use that power.");
            return;
        }
        gulaag_flag = message.mentions.members.first().id;
        console.log("gulaag flag changed to: " + gulaag_flag);
    }
    if(message.content.startsWith("//emptyGulaag")){
        console.log("Gulaag emptied");
        gulaag_flag = 0;
    }
    if(message.content.includes('//gulaag')) {
        //First Check if the member has permission to move members
        if (!message.member.hasPermission("MOVE_MEMBERS")) {
            message.channel.send("You do not have the correct permissions.");
            return;
        }
        //Set variables to respective values
        gulaag_channel = message.guild.channels.resolve('700446425938657305');
        player1 = message.mentions.members.first();   
        player2 = message.mentions.members.last();

        //Check if players are valid and connected
        if(player1 == null || player2 == null || player1.voice.channel == null || player2.voice.channel == null){
            message.delete();
            message.reply("One of the players doesn't want to play with your bitch ass");
            return;
        }
        //Check if channel is valid
        else{
            if(gulaag_channel == null){
                console.log("channel is null");
                return;
            }
            //Move players
            else{
                message.delete();
                gamecounter = 1;
                original_channel = message.member.voice.channel;
                player1.voice.setChannel(gulaag_channel);
                player2.voice.setChannel(gulaag_channel);
                message.channel.send("Players moved. Let the games begin!");
            }

        }
    }
    //Checks for Actions Messages
    switch(message.content){
        case 'hello':
            message.channel.send("Hello Comrads :D");
            break;
        case 'throw':
            if((message.author.id == player1.user.id || message.author.id == player2.user.id) && (gamecounter == 1)){
                message.delete();
                rand = Math.floor((Math.random() * 100) +1);
                if(rand < 11){
                    gamecounter = 0;
                    message.reply(" KILLED HIMSELF WITH HIS OWN ROCK!!");
                    player1.voice.setChannel(original_channel);
                    player2.voice.setChannel(original_channel);
                    endMessage(message,message.author,player1,player2);
                }
                else if(rand > 11 && rand < 21){
                    gamecounter = 0;
                    message.reply(" clutched up! HE IS KING OF THE GULAAG!");
                    player1.voice.setChannel(original_channel);
                    player2.voice.setChannel(original_channel);
                    endMessage(message,message.author,player2,player1);

                }
                else{
                    message.reply(" missed like a weak bitch");
                }
            }
            else{
                message.delete();
            }
            break;
        case 'fuck you':
            message.channel.send("No comrad! FUCK YOU SCUM!");
            break;
    }

    if(message.content === 'meister'){
        message.delete(message);
    }
    else if(message.contetn === '**stats'){
        message.delete(message);
        //this will be where you interact with the database to get stats
    }
})
client.on("voiceStateUpdate",(oldMember,newMember)=>{
    if(gulaag_flag == 0){return;}
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = newMember.voiceChannel;
    gulaag_channel = newMember.guild.channels.resolve("700446425938657305");
    console.log("changed: " + newMember.id);
    let id = gulaag_flag;
    
    if(newMember.id == id && newUserChannel != gulaag_channel){
            newMember.member.voice.setChannel(gulaag_channel);
    }
});
function endMessage(message,author,player1,player2){
    if(author.id == player1.user.id){
        //These are user types
        message.channel.send(player2.user.username + " Wins!");
        message.channel.send(player1.user.username + " loses like the scum that he is.");
    }
    else{
        message.channel.send(player1.user.username + " Wins!");
        message.channel.send(player1.userusername + " loses like the scum that he is.");
    }
    //This doesn't work right now
    /*
    const connection = original_channel.join();//player1.voice.channel.join();
    const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=gII-ghI2_8k',{filter: 'audio'}));
    
    dispatcher.on('finish',  ()=>{
        console.log("finished playing");
        connection.disconnect();
        dispatcher.destroy();
    });
    */
}
