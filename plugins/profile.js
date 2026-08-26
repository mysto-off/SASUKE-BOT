// ============== SASUKE PROFILE LOOKER V3 ==============

// ===== معرف القناة =====
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
// ===========================

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // رسالة الاستعمال
    if (!text) return await conn.sendMessage(m.chat, {
        text: `*👤 SASUKE PROFILE*\n\n📌 *اسـتـعـمـال الأمـر*\n\n${usedPrefix + command} 212698498657\n\n*مـثـال:*\n${usedPrefix + command} 2126xxxxxxx\n*© SASUKE TECH*`,
        contextInfo: newsletter
    }, { quoted: m })

    let number = text.replace(/[^0-9]/g, '')
    
    // التحقق من الرقم
    if (number.length < 10) return await conn.sendMessage(m.chat, {
        text: `❌ *الـرقـم غـيـر صـحـيـح*\n\nتـأكـد مـن الـرقـم ودخـلـو بـهـاد الـشـكـل:\n${usedPrefix + command} 2126xxxxxxx\n*© SASUKE TECH*`,
        contextInfo: newsletter
    }, { quoted: m })

    let jid = number + '@s.whatsapp.net'
    
    try {
        // 1. جيب صورة البروفايل
        let pp = await conn.profilePictureUrl(jid, 'image').catch(() => 'https://i.imgur.com/whlB5rR.png')
        
        // 2. جيب الاسم
        let name = await conn.getName(jid)
        if (!name || name === number) name = 'مـسـتـخـدم واتـسـاب'

        let bio = `
*👤 SASUKE PROFILE*

*الاســم:* ${name}
*الـرقــم:* +${number}
*الـحـالـة:* متصل
*© SASUKE TECH*
        `.trim()

        // 3. زر مراسلة
        let buttons = [
            { buttonId: `https://wa.me/${number}`, buttonText: { displayText: '💬 مـراسـلـة' }, type: 1 }
        ]

        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: bio,
            footer: 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ',
            buttons: buttons,
            headerType: 4,
            contextInfo: newsletter
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        await conn.sendMessage(m.chat, {
            text: `⚠️ *مـا قـدرتـش نـجـيـب الـبـروفـايـل*\n\nالـسـبـب: الـرقـم مـاشـي فـالـواتـسـاب او غـيـر مـوجـود\n\n*© SASUKE TECH*`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['بروفايل <رقم>']
handler.tags = ['SASUKE', 'info']
handler.command = ['بروفايل', 'profile', 'pfp', 'sasuke_profile']
handler.limit = false

export default handler
