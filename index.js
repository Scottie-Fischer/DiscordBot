const Discord = require('discord.js')       //Connects this file to Discord API
const client = new Discord.Client();        //creating the bot

const token = 'NzAwNTE3MzA0MjM2MjQ1MDAz.Xpsv-g.J4bzzgokK1tU_EMi_pe7kypdCCk';

client.on('ready', () => {
    console.log('This bot is online.');
})

client.on('message', message =>{
    if(message.content.includes('**gulaag')){
        var array = message.content.split(" ");
        user1 = array[1];
        user2 = array[2];
        

    }
    if( message.content === 'HELLO'){
        message.channel.send('Hello Friends :D');
    }
    else if(message.content === 'throw'){
        message.reply(handleActions(0));
    }
    else if(message.content === 'meister'){
        message.reply(handleActions(1));
    }
})
function handleActions(command){  
    //This will handle any commands that we have defined
    //0 will be throw, 1 will be meister
    if(command === 0){
       var rand = Math.floor((Math.random() * 100) +1);
       if(rand < 11 ){
            return (" KILLED HIMSELF WITH HIS OWN ROCK");
       }
       if(rand > 11 &&  rand < 26){
            return (" clutched up! HE IS KING OF GULAAG!");
       }
       else{
            return (" missed like a weak bitch");
       }
    }
    else if(commanad === 1){
            return (" picked up rocks");
    }
}

client.login(token);