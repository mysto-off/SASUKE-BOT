// ============================================
// SASUKE PRAYER TIMES - No dependencies
// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// ============================================

let handler = async (m, { conn, args, usedPrefix }) => {
    // ===== Channel Info =====
    const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
    const CHANNEL_ID = '120363427685476208@newsletter'
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: CHANNEL_ID,
            newsletterName: channelName
        }
    }
    // ======================================

    let city = args.join(' ')
    if(!city) {
        return conn.sendMessage(m.chat, {
            text: `*📌 SASUKE PRAYER TIMES*\n\n*الـطـريـقـة:* ${usedPrefix}prayer <city>\n\n*امـثـلـة:*\n• ${usedPrefix}prayer Oujda\n• ${usedPrefix}prayer Casablanca\n• ${usedPrefix}prayer Rabat\n*© SASUKE TECH*`,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, {
        text: `⏳ *SASUKE كـايـجـبـد اوقـات الـصـلاة فـي ${city}...*`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        let res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=MA&method=2`)
        let json = await res.json()
        
        if(json.code !== 200) {
            await m.react('❌')
            return conn.sendMessage(m.chat, {
                text: `*❌ الـمـديـنـة غـيـر مـوجـودة*\n*جـرب تـكـتـبـهـا بـالانـجـلـيـزيـة*`,
                contextInfo: newsletter
            }, { quoted: m })
        }

        let timings = json.data.timings
        let date = json.data.date.readable
        let hijri = json.data.date.hijri.date

        let txt = `*🕌 اوقـات الـصـلاة - ${city}* 🕌\n\n`
        txt += `*📅 الـتـاريـخ الـمـيـلادي:* ${date}\n`
        txt += `*📆 الـتـاريـخ الـهـجـري:* ${hijri}\n\n`
        txt += `*🌅 الـفـجـر:* ${timings.Fajr}\n`
        txt += `*☀️ الـشـروق:* ${timings.Sunrise}\n`
        txt += `*🌞 الـظـهـر:* ${timings.Dhuhr}\n`
        txt += `*🌤️ الـعـصـر:* ${timings.Asr}\n`
        txt += `*🌆 الـمـغـرب:* ${timings.Maghrib}\n`
        txt += `*🌙 الـعـشـاء:* ${timings.Isha}\n\n`
        txt += `*مـلاحـظـة:* الاوقـات حـسـب تـوقـيـت الـمـغـرب\n*© SASUKE TECH*`

        await conn.sendMessage(m.chat, { 
            text: txt, 
            contextInfo: newsletter 
        }, { quoted: m })

        await m.react('✅')

    } catch(e) {
        console.log(e)
        await m.react('❌')
        await conn.sendMessage(m.chat, {
            text: `*❌ حـدث خـطـأ*\n*تـأكـد مـن اسـم الـمـديـنـة والانـتـرنـت*`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['prayer <city>']
handler.tags = ['SASUKE', 'islam']
handler.command = /^(prayer|اوقات_الصلاة|sasuke_prayer)$/i
handler.limit = false
handler.register = false
export default handler
