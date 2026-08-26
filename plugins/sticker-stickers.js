// تـرجـمـة وتـعـديـل: نـورديـن
// بـلـوغـيـن: SASUKE TECH | صـنـع سـتـيـكـر مـن صـورة/فـيـديـو/GIF

// ─── مـعـلـومـات قـنـاة سـاسـكـي ─────────────────────────────────────────────
const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
const CHANNEL_ID = '120363427685476208@newsletter' // المعرف الجديد
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}

let handler = async (m, { conn, text, usedPrefix: _p }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || ''

	if (/image|video|gif|webp/.test(mime)) {
		let seconds = q.msg?.seconds || q.seconds || 0
		if (seconds > 10) {
			return conn.sendMessage(m.chat, { 
				text: '*❌ رجـاءً الـفـيـديـو خـاصـو يـكـون قـل مـن 10 ثـوانـي*',
				contextInfo: newsletter 
			}, { quoted: m })
	}

		await conn.sendMessage(m.chat, { text: '*⏳ جـاري صـنـع الـسـتـيـكـر...*', contextInfo: newsletter }, { quoted: m })
		
		let media = await q.download()
		
		let packname = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ'
		let author = 'SASUKE BOT'
		
		if (text) {
			const [p, a] = text.split(/[,|\-+&]/)
			if(p) packname = p.trim()
			if(a) author = a.trim()
	}

		await conn.sendMessage(m.chat, {
			sticker: media,
			packname: packname,
			author: author,
			contextInfo: newsletter
	}, { quoted: m })

	} else {
		conn.sendMessage(m.chat, { 
			text: `*📎 رجـاءً قـم بـالـرد عـلـى الـصـورة/الـفـيـديـو الـتـي تـريـد تـحـويـلـهـا الـى سـتـيـكـر*\n\n*مـثـال:* ${_p}ستيكر اسـم الـبـاكـة|اسـمـك`,
			contextInfo: newsletter 
	}, { quoted: m })
	}
}

handler.help = ['ستيكر <اسـم الـبـاكـة|الـمـؤلـف>']
handler.tags = ['تحويل']
handler.command = /^(ستيكر|sticker|s|ملصق|stc|ساسكي)$/i
handler.register = false

export default handler
