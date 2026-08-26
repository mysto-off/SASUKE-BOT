// ============================================
// SASUKE UNBAN CHAT PLUGIN
// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// ============================================

// ===== معلومات القناة =====
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
// =====================

let handler = async (m, { conn }) => {
	// تأكد ان الشات موجود في قاعدة البيانات
	global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
	global.db.data.chats[m.chat].isBanned = false;
	
	await conn.sendMessage(m.chat, { 
		text: '*✅ تـم فـتـح الشـات بـنـجـاح*\n*الان يـمـكـن اسـتـخـدام الـبـوت*\n*© SASUKE TECH*',
		contextInfo: newsletter
	}, { quoted: m });
	
	await m.react('✅')
};

handler.help = ['unbanchat'];
handler.tags = ['SASUKE', 'owner'];
handler.command = /^(unbanchat|فتح_شات|sasuke_unban)$/i;
handler.owner = true;
handler.group = true;

export default handler;
