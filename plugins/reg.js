// plugin by SASUKE TECH - Command: تسجيل

// ─── معلومات قناة SASUKE ─────────────────────────────────────────────
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
// ────────────────────────────────────────────────────────────────────

let handler = async (m, { conn, usedPrefix, text }) => {
    try {
        global.db.data.users = global.db.data.users || {}
        let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
        user.points = Number(user.points) || 0 

        let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/Q9vVJcM/default.jpg')

        // 1. الى ما كاين والو ورّي المعلومات / طريقة التسجيل
        if(!text) {
            if(!user.registered) return conn.sendMessage(m.chat, {
                text: `*🎌 SASUKE REGISTER*\n\n*📌 طريقة التسجيل:*\n${usedPrefix}تسجيل <الاسم> <العمر> <الدولة>\n\n*💡 مثال:* ${usedPrefix}تسجيل Ahmed 17 Morocco\n\n*© SASUKE TECH*`,
                contextInfo: newsletter
            }, { quoted: m })

            let time = new Date(user.regTime).toLocaleString('ar-MA', { timeZone: 'Africa/Casablanca' })
            let txt = `*🎌 SASUKE PROFILE*\n\n`
            txt += `*👤 الاسـم:* ${user.name}\n`
            txt += `*🎂 الـعـمـر:* ${user.age}\n`
            txt += `*🌍 الـدولـة:* ${user.country}\n`
            txt += `*📅 تـاريـخ الـتـسـجـيـل:* ${time}\n`
            txt += `*💎 النقاط:* ${user.points}\n\n`
            txt += `*© SASUKE TECH*`

            return await conn.sendMessage(m.chat, { image: { url: pp }, caption: txt, contextInfo: newsletter }, { quoted: m })
        }

        // 2. الى كاين نص = تحديث المعلومات
        let args = text.trim().split(/ +/) 
        let country = args.slice(2).join(' ') 
        let [name, age] = args

        if (!name || !age || !country) return conn.sendMessage(m.chat, {
            text: `*❌ تنسيق خاطئ*\n\n*الصحيح:* ${usedPrefix}تسجيل <الاسم> <العمر> <الدولة>\n*مثال:* ${usedPrefix}تسجيل Noureddine 18 Morocco\n*© SASUKE TECH*`,
            contextInfo: newsletter
        }, { quoted: m })

        age = Number(age)
        if (isNaN(age)) return conn.sendMessage(m.chat, { text: `*❌ العمر خاصو يكون رقم*\n*© SASUKE TECH*`, contextInfo: newsletter }, { quoted: m })
        if (age < 5 || age > 100) return conn.sendMessage(m.chat, { text: `*❌ عمر غير صالح*\n*© SASUKE TECH*`, contextInfo: newsletter }, { quoted: m })

        let wasRegistered = user.registered

        user.name = name
        user.age = age
        user.country = country
        user.regTime = Date.now()
        user.registered = true

        let text2 = `*✅ ${wasRegistered? 'تـم الـتـحـديـث بـنـجـاح' : 'تـم الـتـسـجـيـل بـنـجـاح'}*\n\n`
        text2 += `*👤 الاسـم:* ${user.name}\n`
        text2 += `*🎂 الـعـمـر:* ${user.age}\n`
        text2 += `*🌍 الـدولـة:* ${user.country}\n\n`
        text2 += `*© SASUKE TECH*`

        await m.react('✅')
        await conn.sendMessage(m.chat, { image: { url: pp }, caption: text2, contextInfo: newsletter }, { quoted: m })

    } catch (e) {
        console.log(e)
        await m.react('❌')
        conn.sendMessage(m.chat, { text: `*❌ خطأ:* ${e.message}\n*© SASUKE TECH*`, contextInfo: newsletter }, { quoted: m })
    }
}

handler.help = ['تسجيل <الاسم> <العمر> <الدولة>'];
handler.tags = ['SASUKE', 'main'];
handler.command = /^(daftar|تسجيل|register|sasuke_reg)$/i;
handler.limit = false
export default handler;
