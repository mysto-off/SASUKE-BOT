import { parentPort } from 'worker_threads';

// ===== Channel Info SASUKE =====
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
// ========================

let handler = async (m, { conn }) => {
	
	const sendWithChannel = async (txt) => {
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: newsletter
        }, { quoted: m })
    }

	if (!parentPort) throw '*❌ خـطـأ:* شـغـل الـبـوت بـ `node index.js` مـاشـي `node main.js`'
	
	if (global.conn.user.jid == conn.user.jid) {
		await m.react('🔄')
		await sendWithChannel(`
*🔄 SASUKE RESTART*

*جـاري اعـادة الـتـشـغـيـل ✨*

*⚡ الـحـالـة:* \`SASUKE TECH . .\`
*⏳ يتـم إعــادة تشـغـيــل مـن جـديــد*

*© SASUKE TECH*`)
		
		parentPort.postMessage('restart');
	} else throw '*⚠️ مـمـنـوع:* هـاد الامـر غـيـر لـلـمـالـك';
};

handler.help = ['اعادة_تشغيل']
handler.tags = ['SASUKE', 'owner']
handler.command = /^(اعادة_تشغيل|restart|sasuke_restart)$/i
handler.owner = true
export default handler
