// ============================================
// SASUKE TOTAL FEATURES PLUGIN
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
	let total = Object.values(global.plugins).filter((v) => v.help && v.tags).length;
	
	await conn.adReply(m.chat, 
		`*📊 SASUKE BOT STATS*\n\n*عـدد مـيـزات الـبـوت الـحـالـيـة:* ${total}\n\n*© SASUKE TECH*`, 
	'./media/thumbnail.jpg', 
		m, 
	{ 
			title: 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ', 
			body: 'BOT INFORMATION',
			contextInfo: newsletter 
	}
	);
};

handler.help = ['totalfeatures'];
handler.tags = ['SASUKE', 'infobot'];
handler.command = ['totalfeatures','عدد_الميزات','sasuke_stats'];

export default handler;
