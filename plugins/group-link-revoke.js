// ===== معلومات القناة SASUKE =====
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
// ========================

let handler = async (m, { conn, command }) => {
	if (command === 'رابط_القروب' || command === 'linkgc') {
		try {
			let code = await conn.groupInviteCode(m.chat)
			m.reply(`*🔗 رابـط قـروب SASUKE*\n\nhttps://chat.whatsapp.com/${code}\n\n*© SASUKE TECH*`, null, { contextInfo: newsletter })
	} catch {
			m.reply(`*❌ مـاقـدرتـش نـجـيـب الـرابـط*\n*تـأكـد انـي ادمـيـن*`, null, { contextInfo: newsletter })
	}
	}
	
	if (command === 'تجديد_الرابط' || command === 'revoke') {
		try {
			let code = await conn.groupRevokeInvite(m.chat)
			m.reply(`*✅ تـم تـجـديـد رابـط الـقـروب بـنـجـاح*\n\n*🔗 الـرابـط الـجـديـد:*\nhttps://chat.whatsapp.com/${code}\n\n*© SASUKE TECH*`, null, { contextInfo: newsletter })
	} catch {
			m.reply(`*❌ مـاقـدرتـش نـجـدد الـرابـط*\n*تـأكـد انـي ادمـيـن*`, null, { contextInfo: newsletter })
		}
	}
};

handler.help = ['رابط_القروب', 'تجديد_الرابط', 'linkgc', 'revoke'];
handler.tags = ['SASUKE', 'مجموعة'];
handler.command = /^(رابط_القروب|تجديد_الرابط|linkgc|revoke|sasuke_link)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
