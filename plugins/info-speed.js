// ============================================
// تـرجـمـة وتـعـديـل: SASUKE TECH
// بـلـوغـيـن: فـحـص سـرعـة الـبـوت
// ============================================

import { performance } from 'perf_hooks'

// ===== مـعـلـومـات الـقـنـاة =====
const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
const newsletterJid = '120363427685476208@newsletter' // <-- الـمـعـرف الـجـديـد
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: newsletterJid,
        newsletterName: channelName
    }
}
// =================================================

let handler = async (m, { conn }) => {
    let timestamp = performance.now()
    
    // نـرسـل رسـالـة مـؤقـتـة ونـحـسـب الـفـرق
    let msg = await conn.sendMessage(m.chat, {
        text: `*⏳ SASUKE الـسرعـة البــوت*`,
        contextInfo: newsletter
    }, { quoted: m })
    
    let latency = (performance.now() - timestamp).toFixed(4)

    // الـرد نـقـي: الـوقـت فـقـط
    let txt = `*⚡ سـرعـة اسـتـجـابـة SASUKE:*\n\n*الـبـيـنـغ:* ${latency} ثـانـيـة\n*الـحـالـة:* ✅ خـدام نـيـشـان`
    
    await conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: newsletter
    }, { quoted: m })
}

handler.help = ['ping', 'فحص'];
handler.tags = ['SASUKE', 'مـعـلـومـات'];
handler.command = /^(ping|فحص|speed)$/i;
handler.limit = false;
handler.register = false;

export default handler;
