// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// 𝗦𝘁𝗶𝗰𝗸𝗲𝗿 𝗧𝗼 𝗜𝗺𝗮𝗴𝗲 𝗘𝗻𝗴𝗶𝗻𝗲

// ===== مـعـلـومـات الـقـنـاة =====
const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}
// ==============================================

let handler = async (m, { conn, usedPrefix, command }) => {

    const notStickerMessage = `*⚠️ الـرجـاء الـرد عـلـى سـتـيـكـر*`
    
    if (!m.quoted) return await conn.sendMessage(m.chat, {
        text: notStickerMessage,
        contextInfo: newsletter
    }, { quoted: m })

    const q = m.quoted
    let mime = (q.mtype || q.mediaType || '').toLowerCase()
    
    if (mime.includes('webp') || q.mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        let media = await q.download()
        
        await conn.sendMessage(m.chat, {
            image: media, 
            caption: `*📥 مـحـول الـسـتـيـكـر*\n\n*✅ تـم الـتـحـويـل بـنـجـاح*\n\n*© SASUKE TECH*`,
            contextInfo: newsletter
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        
    } else {
        return await conn.sendMessage(m.chat, {
            text: notStickerMessage,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['تحويل_ستيكر', 'toimg'];
handler.tags = ['تـحـويـل'];
handler.command = /^(تحويل_ستيكر|toimg|img)$/i;
handler.limit = false;
export default handler
