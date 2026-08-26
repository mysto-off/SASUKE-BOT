// ============================================
// SASUKE TAG ALL PLUGIN
// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// ============================================

// ===== معلومات القناة =====
const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
const CHANNEL_ID = '120363427685476208@newsletter' // <-- هادي هي
const newsletter = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: CHANNEL_ID,
    newsletterName: channelName
  }
}
// =====================

let handler = async (m, { conn, participants, usedPrefix, command }) => {
	let users = participants.map((u) => u.id).filter((v) => v !== conn.user.jid);
	
	if (!m.quoted) {
		throw `*🔔 SASUKE TAG*\n\n*✳️ رد عـلى الرسـالـة اللي بـغيـتي تعـيـد تـوجـيـهـها*\n*مـثـال:* رد عـلى مـيـسـاج وديـر ${usedPrefix}${command}`
	};
	
	await conn.sendMessage(m.chat, { 
		text: `*🔔 تـنـبـيـه مـن SASUKE*\n*تـم تـاغ الـجـمـيـع*\n*© SASUKE TECH*`, 
	mentions: users,
		contextInfo: newsletter 
	}, { quoted: m.quoted });
	
	await conn.sendMessage(m.chat, { 
		forward: m.quoted.fakeObj, 
		mentions: users,
		contextInfo: newsletter 
	});
};

handler.help = ['tag'];
handler.tags = ['SASUKE', 'owner'];
handler.command = /^(totag|اشارة|tagall|sasuke_tag)$/i;

handler.admin = true;
handler.group = true;
handler.botAdmin = false;

export default handler;
