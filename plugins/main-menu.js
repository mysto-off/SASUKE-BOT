import moment from 'moment-timezone'

const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
const CHANNEL_ID = '120363427685476208@newsletter'
const DEVELOPER_NUMBER = '212710725533'
const BANNER = 'https://files.catbox.moe/kykjiw.jpeg'

const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

const handler = async (m, { conn, usedPrefix: _p, args, command }) => {
    try {
        let category = command.toLowerCase().replace('الأوامر', '').replace(/_/g, '').replace(/ /g, '')
        if(!category) category = (args[0] || '').toLowerCase().replace(/_/g, '').replace(/ /g, '')

        let name = m.pushName || 'مستخدم'
        let number = m.sender.split('@')[0]
        let date = moment().tz('Africa/Casablanca').format('DD/MM/YYYY')
        let time = moment().tz('Africa/Casablanca').format('HH:mm:ss')
        let uptime = process.uptime()
        let h = Math.floor(uptime / 3600)
        let min = Math.floor((uptime % 3600) / 60)
        let sec = Math.floor(uptime % 60)
        let uptimeStr = `${h} س ${min} د ${sec} ث`

        let channelLink = 'https://whatsapp.com/channel/0029VbCy4D4Fi8xm541ueW3D'
        let devLink = `https://wa.me/${DEVELOPER_NUMBER}`

        const menus = {
            الكل: `*📥 قــســم الـتـحـمــيـل*
            
│📥 *${_p}يـوتـيـوب_فـيـديـو*
│📥 *${_p}يـوتـيـوب_مـوسـيـقـى*
│📥 *${_p}تـيـكـتـوك*
│📥 *${_p}فـيـسـبـوك*
│📥 *${_p}اسـتـغـرام*
│📥 *${_p}مـيـديـافـايـر*
│📥 *${_p}تـويـتـر*
│📥 *${_p}تـحـمـيـل_اغـنـيـة*
│📥 *${_p}تـطـبـيـق*
│📥 *${_p}تـحـمـيـل*

*🔍 قــســم الـبــحــث*

│🔍 *${_p}بـحـث*
│🔍 *${_p}بـيـنـتـرسـت*
│🔍 *${_p}جـيـتـهـاب*
│🔍 *${_p}بـحـث_اغـانـي*

*🤖 قــســم الـذكــاء*

│🤖 *${_p}نـانـو*
│🤖 *${_p}انـشـاء_صـور*
│🤖 *${_p}مـيـتا*

*🎨 قــسـم المـلصـقات*

│🎨 *${_p}تـحـسـيـن_جـودة*
│🎨 *${_p}مـلـصـق*
│🎨 *${_p}تـحـويـل_سـتـيـكـر*

*👥 قــســم الـمـجـمـوعـة*

│👥 *${_p}اضـافـة*
│👥 *${_p}طـرد*
│👥 *${_p}تـرقـيـة*
│👥 *${_p}انـزال*
│👥 *${_p}فـتـح*
│👥 *${_p}اغـلاق*
│👥 *${_p}قـفـل_شـات*
│👥 *${_p}فـتـح_شـات*
│👥 *${_p}اشـارة*

*👑 قــســم الـمـطــور*

│👑 *${_p}حـظـر*
│👑 *${_p}الـغـاء*
│👑 *${_p}اعـادة_تـشـغـيـل*
│👑 *${_p}تـنـضـيـف*
│👑 *${_p}تـسـجـيـل*
│👑 *${_p}الـغـاء_تـسـجـيـل*
│👑 *${_p}الاعـدادات*
│⚡ *${_p}رسالة_الترحيب*
│⚡ *${_p}رسالة_المـغادرة*

*📰 قـسـم الاخـبـار*

│📰 *${_p}اخـبـار_الـجـزيـرة*
│📰 *${_p}اخـبـار_الـمـغـرب*

*🌙 قـسـم الـديـنـي*

│🌙 *${_p}اوقـات_الـصـلاة*
│🌙 *${_p}صـوت_الـقـرآن*
│🌙 *${_p}قـرآن*
│🌙 *${_p}اذكـار*

*⚡ قـسـم الادوات*

│⚡ *${_p}فـحـص*
│⚡ *${_p}رفـع*
│⚡ *${_p}تـسـت*
│⚡ *${_p}تـرجـم*
│⚡ *${_p}بـروفـايـل*
│⚡ *${_p}تـسـجيل*

> © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛 🔥`,

            التحميل: `*📥 قــســم الـتـحـمــيـل*
            
│📥 *${_p}يـوتـيـوب_فـيـديـو*
│📥 *${_p}يـوتـيـوب_مـوسـيـقـى*
│📥 *${_p}تـيـكـتـوك*
│📥 *${_p}فـيـسـبـوك*
│📥 *${_p}اسـتـغـرام*
│📥 *${_p}مـيـديـافـايـر*
│📥 *${_p}تـويـتـر*
│📥 *${_p}تـحـمـيـل_اغـنـيـة*
│📥 *${_p}تـطـبـيـق*
│📥 *${_p}تـحـمـيـل*

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            البحث: `*🔍 قــســم الـبــحــث*
            
│🔍 *${_p}بـحـث*
│🔍 *${_p}بـيـنـتـرسـت*
│🔍 *${_p}جـيـتـهـاب*
│🔍 *${_p}بـحـث_اغـانـي*

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            الذكاء: `*🤖 قــســم الـذكــاء*
            
│🤖 *${_p}نـانـو*
│🤖 *${_p}انـشـاء_صـور*
│🤖 *${_p}مـيـتا*

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            الصور: `*🎨 قــسـم المـلصـقات*
            
│🎨 *${_p}تـحـسـيـن_جـودة*
│🎨 *${_p}مـلـصـق*
│🎨 *${_p}تـحـويـل_سـتـيـكـر*

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            ادارةالمجموعة: `*👥 قــســم الـمـجـمـوعـة*
            
│👥 *${_p}اضـافـة*
│👥 *${_p}طـرد*
│👥 *${_p}تـرقـيـة*
│👥 *${_p}انـزال*
│👥 *${_p}فـتـح*
│👥 *${_p}اغـلاق*
│👥 *${_p}قـفـل_شـات*
│👥 *${_p}فـتـح_شـات*
│👥 *${_p}اشـارة

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            المطور: `*👑 قــســم الـمـطــور*
            
│👑 *${_p}حـظـر*
│👑 *${_p}الـغـاء*
│👑 *${_p}اعـادة_تـشـغـيـل*
│👑 *${_p}تـنـضـيـف*
│👑 *${_p}تـسـجـيـل*
│👑 *${_p}الـغـاء_تـسـجـيـل*
│👑 *${_p}تـفـعـيـل*
│👑 *${_p}تـعـطـيـل*
│⚡ *${_p}رسـالة_الـترحـيب*
│⚡ *${_p}رسـالة_المـغادرة*


> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            الاخبار: `*📰 قـسـم الاخـبـار*
            
│📰 *${_p}اخـبـار_الـجـزيـرة*
│📰 *${_p}اخـبـار_الـمـغـرب*

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            الديني: `*🌙 قـسـم الـديـنـي*
            
│🌙 *${_p}اوقـات_الـصـلاة*
│🌙 *${_p}صـوت_الـقـرآن*
│🌙 *${_p}قـرآن*

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`,

            اخرى: `*⚡ قـسـم الادوات*
            
│⚡ *${_p}فـحـص*
│⚡ *${_p}رفـع*
│⚡ *${_p}تـسـت*
│⚡ *${_p}تـرجـم*
│⚡ *${_p}بـروفـايـل*
│⚡ *${_p}تـسجـيل*

> © 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛`
        }

        if (category && menus[category]) {
            if(category === 'الكل'){
                let fullText = menus[category]
                let parts = fullText.match(/[\s\S]{1,4000}/g) || [fullText]
                await conn.sendMessage(m.chat, {
                    image: { url: BANNER },
                    caption: parts[0],
                    contextInfo: newsletter
                }, {quoted: m})

                for(let i = 1; i < parts.length; i++){
                    await new Promise(resolve => setTimeout(resolve, 800))
                    await conn.sendMessage(m.chat, { text: parts[i], contextInfo: newsletter })
                }
                return
            }

            let caption = menus[category]
            await conn.sendButton(m.chat, {
                image: { url: BANNER },
                caption: caption,
                footer: { text: `© ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ` },
                buttons: [
                    {name: 'quick_reply', buttonParamsJson: JSON.stringify({display_text: '🏠 الـرجـوع', id: _p + 'الأوامر'})}
                ],
                headerType: 4,
                contextInfo: newsletter
            }, {quoted: m, mentions: [m.sender]})
            return
        }

        let caption = `╮──〔 مـعـلـومـات 〕──╭
│✨ *الاسـم:* ${name}
│📞 *الـرقـم:* ${number}
│⏱️ *الـتـشـغـيـل:* ${uptimeStr}
│📆 *الـتـاريـخ:* ${date}
│📟 *الـوقـت:* ${time}
╯────────────────╰

> © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛 🔥`

        let sections = [
            {
                title: "📜 جــمــيــــع الأوامـــــر 📜",
                rows: [
                    {title: "📖 جـمـيـع الـمـيـزات", description: "「 عـرض الـكـل 」", id: _p + "الأوامرالكل"}
                ]
            },
            {
                title: "📚 الأقـــــــســــــام 📚",
                rows: [
                    {title: "📥 قـسـم الـتـحـمـيـل", description: "📡 「 10 اوامر 」", id: _p + "الأوامرالتحميل"},
                    {title: "🔍 قـسـم الـبـحـث", description: "✨ 「 4 اوامر 」", id: _p + "الأوامرالبحث"},
                    {title: "🤖 قـسـم الـذكـاء", description: "👾 「 4 اوامر 」", id: _p + "الأوامرالذكاء"},
                    {title: "🎨 قـسـم الـمـلـصـقـات", description: "🖼️ 「 4 اوامر 」", id: _p + "الأوامرالصور"},
                    {title: "👥 قـسـم الـمـجـمـوعـة", description: "🔒 「 11 امر 」", id: _p + "الأوامرادارةالمجموعة"},
                    {title: "👑 قـسـم الـمـطـور", description: "🛠️ 「 9 اوامر 」", id: _p + "الأوامرالمطور"},
                    {title: "📰 قـسـم الاخـبـار", description: "📑 「 3 اوامر 」", id: _p + "الأوامرالاخبار"},
                    {title: "🌙 قـسـم الـديـنـي", description: "🕋 「 4 اوامر 」", id: _p + "الأوامرالديني"},
                    {title: "⚡ قـسـم الادوات", description: "⚡ 「 6 اوامر 」", id: _p + "الأوامراخرى"}
                ]
            }
        ]

        await conn.sendButton(m.chat, {
            image: { url: BANNER },
            caption: caption,
            footer: { text: `© ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ` },
            buttons: [
                { name: 'single_select', buttonParamsJson: JSON.stringify({ title: '🗂️ الأقــســام الرئــيـســية', sections: sections }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🎉 قـنــاتــي وتــســاب', url: channelLink }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '👑 الــمـطــور', url: devLink }) }
            ],
            headerType: 4,
            contextInfo: newsletter
        }, { quoted: m, mentions: [m.sender] })

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { text: `❌ *خطأ:* ${e.message}`, contextInfo: newsletter }, { quoted: m })
    }
}

handler.help = ['menu', 'help', 'اوامر']
handler.tags = ['main']
handler.command = /^(الأوامر|اوامر|menu|help|الأوامرالكل|الأوامرالتحميل|الأوامرالبحث|الأوامرالذكاء|الأوامرالصور|الأوامرادارةالمجموعة|الأوامرالمطور|الأوامرالاخبار|الأوامرالديني|الأوامراخرى)$/i
export default handler
