import axios from 'axios'

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
// =================================================

let handler = async (m, { conn, text, usedPrefix }) => {

  if (!text) {
    return conn.sendMessage(m.chat, {
        text: `*📥 SASUKE TIKTOK DOWNLOADER*\n\n📌 *طـريـقـة الاسـتـعـمـال:* \`${usedPrefix}tiktok الـرابـط\`\n💡 *مـثـال:* \`${usedPrefix}tiktok https://vt.tiktok.com/xxx\`\n*© SASUKE TECH*`,
        contextInfo: newsletter
    }, { quoted: m })
  }

  await m.react('⏳')
  let s = await conn.sendMessage(m.chat, { text: '⏳ *SASUKE كـايـحـمـل فـيـديـو تـيـكـتـوك...*', contextInfo: newsletter }, { quoted: m })

  try {
    const encodedParams = new URLSearchParams()
    encodedParams.set("url", text)
    encodedParams.set("hd", "1")

    const { data } = await axios({
        method: "POST",
        url: "https://tikwm.com/api/",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: "current_language=en",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
        data: encodedParams,
        timeout: 20000
    })

    if (!data.data || !data.data.play) {
        return conn.sendMessage(m.chat, { text: '❌ *فـشـل فـجـلـب الـفـيـديـو.* الـرابـط مـاشـي صـحـيـح', edit: s.key, contextInfo: newsletter })
    }

    let v = data.data
    let title = v.title || 'بـلا عـنـوان'
    let author = v.author?.nickname || v.author?.unique_id || 'مـجـهـول'
    let views = v.play_count?.toLocaleString() || '0'
    let likes = v.digg_count?.toLocaleString() || '0'
    let comments = v.comment_count?.toLocaleString() || '0'
    let music = v.music_info?.title || 'مـوسـيـقـى'

    let caption = `*🔍 الـعـنـوان:* ${title}
*📡 صـاحـب الـحـسـاب:* @${author}
*🎵 الـصـوت:* ${music}
*🎥 الـمـشـاهـدات:* ${views}
*♥️ الاعـجـابـات:* ${likes}
*🗯️ الـتـعـلـيـقـات:* ${comments}

*© SASUKE TECH*`

    await conn.sendFile(m.chat, v.play, 'sasuke_tt.mp4', caption, m, false, { contextInfo: newsletter })

    await conn.sendMessage(m.chat, { delete: s.key }).catch(() => {})
    await m.react('✅');

  } catch(e) {
    await conn.sendMessage(m.chat, { text: `❌ *خـطـا:* ${e.message || e}`, edit: s.key, contextInfo: newsletter })
    console.log(e)
    await m.react('❌')
  }
}

handler.help = ['tiktok <الـرابـط>']
handler.tags = ['SASUKE', 'downloader'] 
handler.command = ['tiktok', 'تيكتوك', 'sasuke_tt', 'tt']
handler.limit = false
export default handler
