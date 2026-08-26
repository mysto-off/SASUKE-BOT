// ============================================
// Description: AI Image Generation using Nano Banana Pro API
// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// تـعـديـل : SASUKE TECH
// ============================================

// ─── Channel Info ─────────────────────────────────────────────
const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
const CHANNEL_ID = '120363427685476208@newsletter' // <-- الـمـعـرف الـجـديـد
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) {
        return conn.sendMessage(m.chat, { 
            text: `*🫯 SASUKE AI IMAGE GENERATOR*\n\n*الـرجـاء إدخـال وصـف الـصـورة*\n\n*📌 مـثـال :* \`${usedPrefix}${command} كـرستـيانو رونالـدو بـالـبـدلـة\``,
            contextInfo: newsletter
        }, { quoted: m })
    }

    await m.react('⏳')
    await conn.sendMessage(m.chat, { 
        text: `*⏳ SASUKE كـانـشـأ لـيـك الـصـورة...*`,
        contextInfo: newsletter
    }, { quoted: m })

    const prompt = encodeURIComponent(text)

    try {
        const apiUrl = `https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro?prompt=${prompt}`
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!data.success || !data.image) {
            throw new Error('Failed to get image URL')
        }

        await conn.sendMessage(m.chat, {
            image: { url: data.image },
            caption: `*✅ تـم انـشـاء الـصـورة بـنـجـاح*\n\n*الـوصـف:* ${text}\n\n*© SASUKE TECH*`,
            contextInfo: newsletter
        }, { quoted: m })

        await m.react('✅')

    } catch (err) {
        console.error(err)
        await m.react('❌')
        await conn.sendMessage(m.chat, { 
            text: `*❌ فـشـل انـشـاء الـصـورة*\n\n*الـسـبـب:* ${err.message}`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['انشاء_صورة <الـوصـف>'];
handler.tags = ['SASUKE', 'ذكـاء اصـطـنـاعـي'];
handler.command = /^(انشاء_صورة|انشاء|imagine|aiimg|sasuke_ai)$/i;
handler.limit = false; 

export default handler
