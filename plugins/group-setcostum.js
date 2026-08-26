// ===== معلومات القناة SASUKE =====
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
// =====================================

let handler = async (m, { conn, usedPrefix, command, text }) => {
	if (!text) return conn.sendMessage(m.chat, {
        text: `*🎌 SASUKE GROUP SETTINGS*\n\n*❌ واين هو النص؟*\n\n*📌 المتغيرات المتاحة:*\n*@user* = مـنـشـن الـعـضـو\n*@subject* = اسـم الـمـجـمـوعـة\n*@desc* = وصـف الـمـجـمـوعـة\n*💡 مثال:*\n${usedPrefix + command} مـرحـبـا بـيـك @user فـي @subject\n\n*© SASUKE TECH*`,
        contextInfo: newsletter
    }, { quoted: m })
	
    let chat = global.db.data.chats[m.chat];
    chat.sWelcome = chat.sWelcome || ''
    chat.sBye = chat.sBye || ''
    chat.sPromote = chat.sPromote || ''
    chat.sDemote = chat.sDemote || ''

	switch (command) {
		case 'رسالة_الترحيب':
			chat.sWelcome = text;
			await m.react('✅')
			conn.sendMessage(m.chat, {
                text: `*✅ تـم تـعـيـيـن رسـالـة الـتـرحـيـب*\n\n${text}\n\n*© SASUKE TECH*`,
                contextInfo: newsletter
            }, { quoted: m })
			break;
		case 'رسالة_المغادرة':
			chat.sBye = text;
			await m.react('✅')
			conn.sendMessage(m.chat, {
                text: `*✅ تـم تـعـيـيـن رسـالـة الـمـغـادرة*\n\n${text}\n\n*© SASUKE TECH*`,
                contextInfo: newsletter
            }, { quoted: m })
			break;
		case 'رسالة_الترقية':
			chat.sPromote = text;
			await m.react('✅')
			conn.sendMessage(m.chat, {
                text: `*✅ تـم تـعـيـيـن رسـالـة الـتـرقـيـة*\n\n${text}\n\n*© SASUKE TECH*`,
                contextInfo: newsletter
            }, { quoted: m })
			break;
		case 'رسالة_التنزيل':
			chat.sDemote = text;
			await m.react('✅')
			conn.sendMessage(m.chat, {
                text: `*✅ تـم تـعـيـيـن رسـالـة الـتـنـزيـل*\n\n${text}\n\n*© SASUKE TECH*`,
                contextInfo: newsletter
            }, { quoted: m })
			break;
	}
};

handler.help = ['رسالة_الترحيب', 'رسالة_المغادرة', 'رسالة_الترقية', 'رسالة_التنزيل'];
handler.tags = ['SASUKE', 'group'];
handler.command = /^(رسالة_الترحيب|رسالة_المغادرة|رسالة_الترقية|رسالة_التنزيل)$/i;
handler.group = true;
handler.admin = true;
export default handler;
