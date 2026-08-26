// ============================================
// سكريبت التست - فحص سرعة البوت
// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// ============================================

// ===== معرف القناة =====
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
// ===========================

import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
    // 1. حساب البنق
    let start = new Date() * 1
    
    // رسالة مؤقتة باش نحسبو السرعة
    let testMsg = await conn.sendMessage(m.chat, {
        text: '⏳ *SASUKE كـايـدوز الـفـحـص...*',
        contextInfo: newsletter
    }, { quoted: m })
    
    let end = new Date() * 1
    let ping = end - start

    // 2. وقت التشغيل
    let uptime = process.uptime()
    let h = Math.floor(uptime / 3600)
    let min = Math.floor((uptime % 3600) / 60)
    let sec = Math.floor(uptime % 60)
    let uptimeStr = `${h} س ${min} د ${sec} ث`

    // 3. الوقت والتاريخ ديال المغرب
    let date = moment().tz('Africa/Casablanca').format('DD/MM/YYYY')
    let time = moment().tz('Africa/Casablanca').format('HH:mm:ss')

    // 4. حالة الرام
    let used = process.memoryUsage()
    let ram = `${(used.heapUsed / 1024 / 1024).toFixed(2)} MB / ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`

    // 5. حالة CPU
    let cpu = process.cpuUsage()
    let cpuPercent = ((cpu.user + cpu.system) / 1000000).toFixed(2)

    let result = `
*⚡ نـتـائـج فـحـص SASUKE*

*━━━━━━━━━━━━━━━━━━━*
🚀 *الـسـرعـة:* ${ping} ms
⏱️ *الـتـشـغـيـل:* ${uptimeStr}
📆 *الـتـاريـخ:* ${date}
📟 *الـوقـت:* ${time}
💾 *الـرام:* ${ram}
🧠 *الـمـعـالـج:* ${cpuPercent} ms
*━━━━━━━━━━━*

*© SASUKE TECH*
    `.trim()

    // مسح الرسالة المؤقتة وصيفط النتيجة
    await conn.sendMessage(m.chat, { delete: testMsg.key }).catch(() => {})
    await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: newsletter
    }, { quoted: m })
}

handler.help = ['تست'];
handler.tags = ['SASUKE', 'tools'];
handler.command = ['تست', 'ping', 'فحص', 'test', 'sasuke_test'];
handler.limit = false;

export default handler
