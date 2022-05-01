const { Client, Intents, MessageEmbed, Permissions} = require('discord.js');
const fs = require('fs');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
let token = process.env.BOT_TOKEN || 'ODgwODI3ODAwMTA4NTY0NTEw.YSj80A.8S-dJl6wiZBMVR6w_bp-OgLbtwY';
const bodyParser = require('body-parser');
const ur = bodyParser.urlencoded({extended: false});
bot.login(token);
let s = 10;
let m = 0;
let h = 0;
let lis_msg = require(__dirname+'/lis_msg.json');
let lis_msg_zav = [];
let lis_type = new Map();
let cont = new Map();
let conttt = {
    connection: null,
    mus_list:[],
    pl_stat: false,
    loop: false,
    VOL: 100
}
let frt = ["1","2","3","4","5","6","7","8","9","0","A","B","D","S","V","C","X","Z","R","F","G","T","Q","N","M","Y","P","L","E","W","K","I","O", "_","a","b","d","s","v","c","x","z","r","f","g","t","q","n","m","y","p","l","e","w","k","i","o"];
let shif666= [];
const ytdl = require('ytdl-core');


bot.on('ready',() => {
    console.info(`[Console] ${bot.user.tag} is ready to all work`);
    loop(10000);
    bot.user.setActivity('игре на гитаре', { type: 'COMPETING' })
})
function loop (time){
    setTimeout(function(){
        console.log(`[LOG] Прошло ${h} часов ${m} мин ${s} сек`);
        s += 10;
        if(s == 60){
            s = 0;
            m++
        }
        if(m == 60){
            m = 0;
            h++
        }
        loop(10000);
    }, time)
}
bot.on('message', (msg) =>{
    const prefix = '!'
        const commandBody = msg.content.slice(prefix.length);
	    const args = commandBody.split(' ');
  	    const command = args.shift().toLowerCase();
        if(command === 'loop'){
            if(conttt.loop === false){
                conttt.loop = true
                msg.channel.send('Петля включина')
            }else if(conttt.loop === true){
                conttt.loop = false
                msg.channel.send('Петля выключина')
            }
        }
        if(command === 'stop'){
            conttt.connection.destroy();
            conttt.mus_list = [];
            conttt.pl_stat =  false;
            conttt.connection = null;
        }
          if(command === 'list'){
              if(!conttt.connection) return msg.channel.send('Щас не воспроизводиться')
              if(conttt.mus_list.length == 0) return msg.channel.send('В списке нечего нет')
            for(let i = 0 ; i< conttt.mus_list.length; i++){
                msg.channel.send(`Сейчас в списке: №${(i + 1)}**${conttt.mus_list[i].snippet.title}**`)
            }
          }
        if(command === 'resume'){
            conttt.connection.resume();
        }
        if(command === 'pause'){
            conttt.connection.pause();
        }
        if(command === 'volume'){
            conttt.connection.setVolume(args[0] / 100);
            conttt.VOL = args[0] / 100;
        }
        if(command === 'skip'){
            if(!conttt.connection) return msg.channel.send('Я не могу пропустить')
            
            if(conttt.mus_list.length == 0){
                conttt.connection.destroy();
                conttt.pl_stat = false;
                
            }else{
                skip(conttt.mus_list[0], msg.channel);
            }
        }
        async function skip(Vid, chan) {
            const sk = await conttt.connection.destroy()
            conttt.pl_stat = false;
            if(!conttt.mus_list[0].id){
                const pl = await play(conttt.mus_list[0], msg.channel, conttt.mus_list[0].id.videoId);
            }else{
                const pl = await play(conttt.mus_list[0], msg.channel, conttt.mus_list[0].id);
            }
            const del = await conttt.mus_list.shift();
            
        }
        
        if(command === 'магнитола'){
            
            
            if (msg.member.voice.channel) {
                
                var YouTube = require('youtube-node');
    
                var youTube = new YouTube();
                youTube.setKey('AIzaSyCrXEnAXPB0BwTw4M1O_bA7AOEYWSSvD1g');
                if(args[0].startsWith('http')){
                    console.log((args[0].split("="))[1])
    
                    
                    youTube.getById((args[0].split("="))[1], function(error, result) {
                        if (error) {
                          console.log(error);
                        }
                        else {
                          console.log(result);
                          if(!result.items[0].id){
                            play(result.items[0], msg.channel, result.items[0].id.videoId)
                          }else{
                            play(result.items[0], msg.channel, result.items[0].id)
                          }
                        }
                    });
                }else {
                    youTube.search(`${args.join(' ')}`, 2, function(error, result) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(result.items[0]);
                            console.log(result.items[0].snippet.thumbnails.default.url);
                            play(result.items[0], msg.channel, result.items[0].id.videoId)
                        }
                        });
                }
            }else{
                msg.reply('You need to join a voice channel first!');
            }
            
        }
    async function play(Vid, chan, ID) {
        
        const connection = await msg.member.voice.channel.join();
        if(!conttt.connection || conttt.pl_stat === false || conttt.loop === true){
            const dispatcher = connection.play(ytdl(`https://www.youtube.com/watch?v=${ID}`, { filter: 'audioonly'}))
            console.log(Vid.status);
            dispatcher.setVolume(conttt.VOL / 100);
            conttt.connection = dispatcher;
            if(conttt.loop === false){  
            const form = new MessageEmbed()
                .setColor('#00ffff')
                .setTitle('Сейчас воспроизводиться: \n'+Vid.snippet.title)
                .setImage(Vid.snippet.thumbnails.high.url);
                chan.send(form)
            }
            conttt.pl_stat = true;
            dispatcher.on('finish', () => {
                if(conttt.loop === true){
                    play(Vid, chan, ID);
                }else if(conttt.mus_list.length == 0){
                    msg.member.voice.channel.leave();
                    conttt.pl_stat = false;
                }else{
                    if(!conttt.mus_list[0].id){
                        play(conttt.mus_list[0], chan, conttt.mus_list[0].id.videoId);
                    }else{
                        play(conttt.mus_list[0], chan, conttt.mus_list[0].id);
                    }
                    
                }
            });
        }else{
            conttt.mus_list.push(Vid);
            chan.send('**Музыка добавлина в список**')
        }
            
    }
    if(msg.channel.type == 'dm'){
        let user = lis_type.get(msg.author.id);
        
        let em_t = false;
        let guildy = bot.guilds.cache.get('880815094907437118');
        if(command === 'z'){
            if(guildy.member(msg.author.id).roles.cache.get('880854287729696830') || guildy.member(msg.author.id).roles.cache.get('880854342373093416')){
                if(!args[0]) return msg.author.send('Вы не указали **Ключ заявки**')
                if(!args[1]) return msg.author.send('Вы не указали **Результат**')
                if(!args[2]) return msg.author.send('Вы не указали **Коментарий**')
                for(let i = 0 ; i< fs.readdirSync(__dirname+"/zajvka/").length; i++){
                    if(((fs.readdirSync(__dirname+"/zajvka/")[i]).split(".")[0].replace('json', '')) === args[0]){
                        let fitu = require(`${__dirname}/zajvka/${fs.readdirSync(__dirname+"/zajvka/")[i]}`);
                        let author = guildy.members.cache.get(fitu.AUTHOR_ID);
                        if(args[1] === '-'){
                            let comm = args.splice(0,2);
                            const form = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(`Ваша заявка отклонена ❌`)
                            .addFields({
                                name:'Коментарий от Проверяющего:', 
                                value:`${args.join(' ')}`
                            })
                            author.send(form)
                        }
                        if(args[1] === '+'){
                            let comm = args.splice(0,2);
                            const form = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle(`Ваша заявка одобрена ✅`)
                            .addFields({
                                name:'Коментарий от Проверяющего:', 
                                value:`${args.join(' ')}`
                            })
                            author.send(form)
                        }
                    }
                }
            }else{
                msg.author.send('НЕ Понял')
            }
        }
        if(command === 'andromeda'){
            if(guildy.member(msg.author.id).roles.cache.get('880820430708015104') || guildy.member(msg.author.id).roles.cache.get('880816109685731328')){
                if(!args[0]) return msg.author.send('Вы не указали **Ключ заявки**')
                if(!args[1]) return msg.author.send('Вы не указали **Результат**')
                if(!args[2]) return msg.author.send('Вы не указали **Коментарий**')
                for(let i = 0 ; i< fs.readdirSync(__dirname+"/zajavka_v_komandu/").length; i++){
                    if(((fs.readdirSync(__dirname+"/zajavka_v_komandu/")[i]).split(".")[0].replace('json', '')) === args[0]){
                        let fitu = require(`${__dirname}/zajavka_v_komandu/${fs.readdirSync(__dirname+"/zajavka_v_komandu/")[i]}`);
                        let authors = guildy.members.cache.get(fitu.AUTHOR_ID);
                        if(args[1] === '-'){
                            console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
                            let comm = args.splice(0,2);
                            const form = new MessageEmbed()
                                .setColor('RED')
                                .setTitle(`Ваша заявка отклонена ❌`)
                                .addFields({
                                    name:'Коментарий от Проверяющего:',
                                    value:`${args.join(' ')}`
                                })
                            authors.send(form)
                        }
                        if(args[1] === '+'){
                            console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
                            let comm = args.splice(0,2);
                            const form = new MessageEmbed()
                                .setColor('GREEN')
                                .setTitle(`Ваша заявка одобрена ✅`)
                                .addFields({
                                    name:'Коментарий от Проверяющего:',
                                    value:`${args.join(' ')}`
                                })
                            authors.send(form)
                        }
                    }
                }
            }else{
                msg.author.send('НЕ Понял')
            }
        }
        if(command ==='заявка'){
            const form = new MessageEmbed()
            .setColor('#00ffff')
            .addFields({
                name:'Вы написали команду !заявка', 
                value:`Отправте заявку следующим сообщением в виде формы:\n\nТехническая информация:\n1. Ник в игре\n2. Ваш дискорд\nБиография:\n1. Ф.И.О персонажа\n2. Место рождения\n3. Дата рождения (не менее 18 лет)\n4. Особенности детства\n5. Особенности юношенства\n6.События, повлиявшие на формирования характера\n7.Становление личности\n8.Цели в жизни\n9.Как и когда узнал о ЧЗО\n10.Характера персонажа\n11. Особые черты персонажа\n12.Навыки персонажа\n13.Основная цель в ЧЗО\n\n⛔️ВНИМАНИЕ! Заявки которые будут скопированы у другого человека будут отклонены`
            })
            
            msg.author.send(form).then(()=>{
                lis_type.set(msg.author.id, 'j');
            });;
        }
        if(command === 'отзыв'){
            const form = new MessageEmbed()
                .setColor('#e399ff')
                .addFields({name:'Вы написали команду !отзыв', value:`Отправте отзыв следующим сообщением в виде формы:\n\nОт: (Ваше имя)\n Для: (Имя Админестратора)\nОтзыв: (отзыв)\n(Писать с большой буквы (От, Для, Отзыв))`})
            msg.author.send(form).then(()=>{
                lis_type.set(msg.author.id,'jn');
            });
        }
        if(command ==='знк'){
            const form = new MessageEmbed()
                .setColor('#00ffff')
                .addFields({
                    name:'Вы написали команду !знк',
                    value:`Отправте заявку следующим сообщением в виде формы:\n\n1. Ваш возраст\n2. Характеристики вашего ПК\n3. Ваша скорость интернета.\n4. Сколько времени вы готовы уделять.\n5. Опыт работы в той, или иной сфере\n6. Ваш микрофон\n7. Примеры ваших работ.\n\nКем вы можете быть в моей команде:\n● Билдер\n● 3D моделлер\n● Кодер на JAVA или очень хорошие навыки программы MCreator\n● Актер озвучка\n● Дизайнер\n\n⛔️ВНИМАНИЕ! Заявки которые будут скопированы у другого человека будут отклонены`
                })

            msg.author.send(form).then(()=>{
                lis_type.set(msg.author.id, 'ueban');
            });;
        }
        if(command === 'кпк'){
            let chan = bot.channels.cache.find(channel => channel.id === '880870998847680543');
            chan.send('```'+args.join(' ')+'```')
        }
        if(command === 'report'){
            em_t = true
            const form = new MessageEmbed()
                .setColor('GREEN')
                .addFields({name: `Вы написали команду !report`, value:"Нажмите 1️⃣ для подачи жалобы\n\nНажмите 2️⃣  для подачи заявки на восстановление вещей\n(Без прямых фото или видео доказательств заявка будет отклонена)"})
	            .setFooter(`Ваш ${bot.user.username} © 2021`);
            msg.author.send(form).then((mess) =>{
                mess.react('1️⃣')
                mess.react('2️⃣').then(()=>{
                        lis_msg.push(mess.id);
                    setTimeout(function(){
                        lis_msg.pop()
                    }, 60000 * 5)
                })
            })
            
        }
        if(user === "1️⃣"){
            let chan = bot.channels.cache.find(channel => channel.id === '880835083588747274');
            if(!(msg.content).split('\n')[0]) return msg.author.send('Вы не указали что он нарушил');
            if(!(msg.content).split('\n')[1]) return msg.author.send('Вы не указали ник нарушителя');
            if(!(msg.content).split('\n')[2]) return msg.author.send('Вы не указали описание произошедшего');
            if(!(msg.content).split('\n')[3]) return msg.author.send('Вы не указали прямое фото или видео докозательсво в виде ссылки');
            let co = {
                AUTHOR_ID: msg.author.id, 
                F1: (msg.content).split('\n')[0],
                F2: (msg.content).split('\n')[1],
                F3: (msg.content).split('\n')[2],
                F4: (msg.content).split('\n')[3]
            }
            let KeY;
            let shif_key= [];
            for(let u = 0; u < 70; u++){
                let it = Math.floor(Math.random() * frt.length);
                let tii = frt[it];
                shif_key.push(tii);
            }
            KeY = shif_key.join('');
            fs.writeFile(`${__dirname}/djuloba/${KeY}.json`, JSON.stringify(co), (err) => {
                if (err) throw err;
            });
            const form = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor(msg.author.tag)
                .addFields({name: `Что он нарушил:`, value:`${(msg.content).split('\n')[0].replace('1.', '')}`})
                .addFields({name: `Ник нарушителя:`, value:`${(msg.content).split('\n')[1].replace('2.', '')}`})
                .addFields({name: `Описание произошедшего:`, value:`${(msg.content).split('\n')[2].replace('3.', '')}`})
                .addFields({name: `Прямое фото или видео доказательство:`, value:`${(msg.content).split('\n')[3].replace('4.', '')}`})
	            .setFooter(`Ваш, ${bot.user.username} © 2021`);

            chan.send(form).then((messs) =>{
                let fi = require(__dirname+`/djuloba/${KeY}.json`)
                messs.react('✅').then(()=>{
                    messs.react('❌').then(()=>{
                        lis_msg.push(messs.id);
                        fi.msg_id = messs.id;
                    })
                })
                lis_type.set(msg.author.id, 'null');
                fs.writeFile(`${__dirname}/djuloba/${KeY}.json`, JSON.stringify(fi), (err) => {
                    if (err) throw err;
                });
                const form2 = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Спасибо за то что помогаете следить за не исполнением правил. Ваша жалоба: ${KeY}\n Ожидайте ответа тут`)
                msg.author.send(form2);
            });
        }
        if(lis_type.get(msg.author.id) === "2️⃣"){
            let chan = bot.channels.cache.find(channel => channel.id === '880835171853664276');
            if(!(msg.content).split('\n')[0]) return msg.author.send('Вы не указали ник');
            if(!(msg.content).split('\n')[1]) return msg.author.send('Вы не указали что произашло');
            if(!(msg.content).split('\n')[2]) return msg.author.send('Вы не указали во сколько это произашло');
            if(!(msg.content).split('\n')[3]) return msg.author.send('Вы не указали прямое фото или видео докозательсво в виде ссылки');
            let co = {
                AUTHOR_ID: msg.author.id, 
                F1: (msg.content).split('\n')[0],
                F2: (msg.content).split('\n')[1],
                F3: (msg.content).split('\n')[2],
                F4: (msg.content).split('\n')[3]
            }
            let shif_key= [];
            for(let u = 0; u < 70; u++){
                let it = Math.floor(Math.random() * frt.length);
                let tii = frt[it];
                shif_key.push(tii);
            }
            KeY = shif_key.join('');
            fs.writeFile(`${__dirname}/djuloba/${KeY}.json`, JSON.stringify(co), (err) => {
                if (err) throw err;
            });
            const form = new MessageEmbed()
                .setColor('BLUE')
                .setAuthor(msg.author.tag)
                .addFields({name: `Ник:`, value:`${(msg.content).split('\n')[0].replace('1.', '')}`})
                .addFields({name: `Что произашло:`, value:`${(msg.content).split('\n')[1].replace('2.', '')}`})
                .addFields({name: `Во сколько это произашло:`, value:`${(msg.content).split('\n')[2].replace('3.', '')}`})
                .addFields({name: `Прямое фото или видео докозательсво:`, value:`${(msg.content).split('\n')[3].replace('4.', '')}`})
	            .setFooter(`Ваш, ${bot.user.username} © 2021`);

            chan.send(form).then((messs) =>{
                let fi = require(__dirname+`/djuloba/${KeY}.json`)
                
                messs.react('✅').then(()=>{
                    messs.react('❌').then(()=>{
                        lis_msg.push(messs.id);
                        fi.msg_id = messs.id;
                    })
                })
               
                lis_type.set(msg.author.id, 'null');
                fs.writeFile(`${__dirname}/djuloba/${KeY}.json`, JSON.stringify(fi), (err) => {
                    if (err) throw err;
                });
                const form2 = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`Спасибо за то что помогаете следить за не исполнением правил. Ваша жалоба: ${KeY}\n Ожидайте ответа тут`)
                msg.author.send(form2);
            });
        }
        if(lis_type.get(msg.author.id) === 'ueban'){
            let chan = bot.channels.cache.find(channel => channel.id === '891698461848772718');
            if(!(msg.content).split('\n')[0]) return msg.author.send('Вы не указали ваш возраст');
            if(!(msg.content).split('\n')[1]) return msg.author.send('Вы не указали характеристики вашего ПК');
            if(!(msg.content).split('\n')[2]) return msg.author.send('Вы не указали ваша скорость интернета');
            if(!(msg.content).split('\n')[3]) return msg.author.send('Вы не указали сколько времени вы готовы уделять');
            if(!(msg.content).split('\n')[4]) return msg.author.send('Вы не указали опыт работы в той, или иной сфере');
            if(!(msg.content).split('\n')[5]) return msg.author.send('Вы не указали ваш микрофон');
            if(!(msg.content).split('\n')[6]) return msg.author.send('Вы не указали фото или видео докозательсво в виде ссылки');
            let co = {
                AUTHOR_ID: msg.author.id,
                F1: (msg.content).split('\n')[0],
                F2: (msg.content).split('\n')[1],
                F3: (msg.content).split('\n')[2],
                F4: (msg.content).split('\n')[3],
                F5: (msg.content).split('\n')[4],
                F6: (msg.content).split('\n')[5],
                F7: (msg.content).split('\n')[6],
            }
            let KeY;
            let shif_key= [];
            for(let u = 0; u < 70; u++){
                let it = Math.floor(Math.random() * frt.length);
                let tii = frt[it];
                shif_key.push(tii);
            }
            KeY = shif_key.join('');
                lis_type.set(msg.author.id, 'null');
                fs.writeFile(`${__dirname}/zajavka_v_komandu/${KeY}.json`, JSON.stringify(co), (err) => {
                    if (err) throw err;
                });
                const form = new MessageEmbed()
                    .setColor('#2400ff')
                    .addFields({name:`Подача заявки от человека: ${msg.author.username}, Ключ заявки \n${KeY}`, value:`${msg.content}`})
                chan.send(form).then(() =>{
                    lis_type.set(msg.author.id, 'null');
                    const form2 = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Ваша заявка отправлена. Ваш ключ заявки: ${KeY}\n Ожидайте ответа тут`)
                    msg.author.send(form2);
                })

        }
        if(lis_type.get(msg.author.id) === 'jn'){
            let chan = bot.channels.cache.find(channel => channel.id === '880919651217989632');
            if(!(msg.content).split('\n')[0]) return msg.author.send('Вы не указали ник');
            if(!(msg.content).split('\n')[1]) return msg.author.send('Вы не указали кому отзыв');
            if(!(msg.content).split('\n')[2]) return msg.author.send('Вы не указали отзыв');
            
            const form = new MessageEmbed()
                .setColor('#e400ff')
                .setAuthor(msg.author.tag)
                .addFields({name: `От:`, value:`${(msg.content).split('\n')[0].replace('От:', '')}`})
                .addFields({name: `Для:`, value:`${(msg.content).split('\n')[1].replace('Для:', '')}`})
                .addFields({name: `Отзыв:`, value:`${(msg.content).split('\n')[2].replace('Отзыв:', '')}`})
	            .setFooter(`Ваш, ${bot.user.username} © 2021`);

            chan.send(form).then(() =>{
                lis_type.set(msg.author.id, 'null');
            })
        }
        if(lis_type.get(msg.author.id) === 'j'){
            let chan = bot.channels.cache.find(channel => channel.id === '881251623110836244');
            let co = {
                AUTHOR_ID: msg.author.id, 
                F1: (msg.content).split('\n')[0],
                F2: (msg.content).split('\n')[1],
                F3: (msg.content).split('\n')[2],
                F4: (msg.content).split('\n')[3],
                F5: (msg.content).split('\n')[4],
                F6: (msg.content).split('\n')[5],
                F7: (msg.content).split('\n')[6],
                F8: (msg.content).split('\n')[7],
                F9: (msg.content).split('\n')[8],
                F10: (msg.content).split('\n')[9],
                F11: (msg.content).split('\n')[10],
                F12: (msg.content).split('\n')[11],
                F13: (msg.content).split('\n')[12],
                F14: (msg.content).split('\n')[13],
                F15: (msg.content).split('\n')[14]
            }
            let KeY;
            let shif_key= [];
            for(let u = 0; u < 70; u++){
                let it = Math.floor(Math.random() * frt.length);
                let tii = frt[it];
                shif_key.push(tii);
            }
            KeY = shif_key.join('');
            fs.writeFile(`${__dirname}/zajvka/${KeY}.json`, JSON.stringify(co), (err) => {
                if (err) throw err;
            });
            const form = new MessageEmbed()
                .setColor('#2400ff')
                .addFields({name:`Подача заявки от человека: ${msg.author.username}, Ключ заявки \n${KeY}`, value:`${msg.content}`})
                chan.send(form).then(() =>{
                lis_type.set(msg.author.id, 'null');
                const form2 = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Ваша заявка отправлена. Ваш ключ заявки: ${KeY}\n Ожидайте ответа тут`)
                msg.author.send(form2);
                })
        }
    }
});
bot.on('messageReactionAdd', (react, user) => {
    let guildy = bot.guilds.cache.get('880815094907437118');
    for(let ht = 0; ht < lis_msg.length; ht++){
        if(react.message.id == lis_msg[ht]){
            if(react._emoji.name === '1️⃣'){
                console.log("Одиннннннннн!!!!")
                lis_msg.pop()
                const form = new MessageEmbed()
                    .setColor('GREEN')
                    .addFields({name: `Вы написали команду !report`, value:"Вы выбрали 1️⃣ пожалуйста, напишите жалобу по этому шаблону:\n\n1. Что он нарушил\n2. Ник нарушителя\n3. Описание произошедшего\n4.Прямое фото или видео доказательство в виде ссылки.\n\n(писать с намирацию)\n(у вас есть 5 минут)\n(Без прямых фото или видео доказательств заявка будет отклонена)"})
                    .setFooter(`Ваш ${bot.user.username} © 2021`);
                react.message.channel.send(form).then(() =>{
                    lis_type.set(user.id, '1️⃣')
                });
            }
            if(react._emoji.name === '2️⃣'){
                console.log("Двааааааааааааааааааааааааааа!!!!")
                lis_msg.pop()
                const form = new MessageEmbed()
                    .setColor('GREEN')
                    .addFields({name: `Вы написали команду !report`, value:"Вы выбрали 2️⃣,пожалуйста, опишите что у вас произошло:\n\n1. Ваш ник-нейм\n2.Что с вами произошло\n3. Во сколько это произошло\n4.Прямое фото или видео доказательство в виде ссылки.\n\n(писать с намирацию)\n(у вас есть 5 минут)\n(Без прямых фото или видео доказательств заявка будет отклонена)"})
                    .setFooter(`Ваш ${bot.user.username} © 2021`);
                react.message.channel.send(form).then(()=>{
                    lis_type.set(user.id,'2️⃣');
                });
                

            }
            if(react._emoji.name === '✅'){
                let yyyyyy = 0;
                for(let i = 0 ; i< fs.readdirSync(__dirname+"/djuloba/").length; i++){
                    let formi = require(__dirname+`/djuloba/${fs.readdirSync(__dirname+"/djuloba/")[i]}`)
                    if(formi.msg_id === lis_msg[ht] && yyyyyy < 2){
                        yyyyyy++
                        console.log(formi.AUTHOR_ID)
                        let author = guildy.members.cache.get(formi.AUTHOR_ID);
                        const form2 = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle(`Ваша заявка одобрена✅ задача будет выполнена!!`)
                        author.send(form2).then(()=>{
                            fs.unlinkSync(__dirname+`/djuloba/${fs.readdirSync(__dirname+"/djuloba/")[i]}`);
                            lis_type.set(formi.AUTHOR_ID, 'null');
                        });
                    }
                }
            }
            if(react._emoji.name === '❌'){
                let yyyyyy11 = 0;
                for(let i = 0 ; i< fs.readdirSync(__dirname+"/djuloba/").length; i++){
                    let formi = require(__dirname+`/djuloba/${fs.readdirSync(__dirname+"/djuloba/")[i]}`)
                    if(formi.msg_id === lis_msg[ht] && yyyyyy11 < 2){
                        console.log(yyyyyy11)
                        yyyyyy11++
                        console.log(formi.AUTHOR_ID)
                        let author = guildy.members.cache.get(formi.AUTHOR_ID);
                        const form2 = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(`Ваша заявка отклонена ❌ Вы можите повторно отправить при этом подав на Апелляцию`)
                        author.send(form2).then(()=>{
                            fs.unlinkSync(__dirname+`/djuloba/${fs.readdirSync(__dirname+"/djuloba/")[i]}`);
                            lis_type.set(formi.AUTHOR_ID, 'null');
                        });
                    }
                }
            }
        }
    }
})
bot.on("guildMemberAdd", (gMembAdd) => {
    let guildy = bot.guilds.cache.get('880815094907437118')
    let def_role = guildy.roles.cache.get('880832026977136730');
    const form = new MessageEmbed()        
        .setColor('GREEN')
        .setTitle(`Здравствуй ${gMembAdd.username}, и добро пожаловать на дискорд сервер, проекта STALMINE RP`)
        .addFields({name:'Сводка полезной информации:', value:`[#Правила](https://discord.gg/wZ9cJSjaQh)\n[#Норма подачи заявок](https://discord.gg/S5vSpzpYbw)\n[#О нас](https://discord.gg/V7bYp9Pwjz)\n[#Инструкция по боту](https://discord.gg/7mWeUKTZz9)\n[#Поддержать проект](https://discord.gg/MkWFtn6F8u)\n\n**Меню сервера:**\n[#Рп правила](https://discord.gg/75zgeuMsm8)\n[#Лор](https://discord.gg/aGfmqs8xaR)\n\n**Полезные ссылки:**\n[Ютуб канал создателя](https://www.youtube.com/channel/UCjF2kHl4fMNQi440NTI1vxg)\n[Дискорд создателя](https://discord.gg/eMTPcRXAms)`})
    guildy.member(gMembAdd.id).roles.add(def_role);
    gMembAdd.send(form)
});