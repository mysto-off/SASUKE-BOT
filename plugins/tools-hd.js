// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛

import axios from 'axios'

// ===== إعدادات القناة =====
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

// رفع الصورة
async function uploadToServer(buffer) {
  const form = new FormData()
  form.append("files[]", new Blob([buffer]), "image.jpg")
  const { data } = await axios.post("https://uguu.se/upload.php", form)
  if (!data.success) throw new Error("فشل الرفع")
  return data.files[0].url
}

// معالجة الصورة
async function processHD(imageUrl) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "SASUKE-TECH/2.0"
  }

  const { data: task } = await axios.post("https://jpghd.com/api/task/",
    `conf=${JSON.stringify({ input: imageUrl, style: "art" })}`,
    { headers }
  )

  if (task.status!== "ok") throw new Error("فشل إنشاء المهمة")

  for(let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const { data: check } = await axios.get(`https://jpghd.com/api/task/${task.tid}`, { headers })
    if (check[task.tid]?.status === "success") {
      return check[task.tid].output.jpghd
    }
  }
  throw new Error("انتهت مدة المعالجة")
}

// الأمر الرئيسي
let handler = async (m, { conn }) => {
  try {
    const q = m.quoted? m.quoted : m
    const mime = (q.msg || q).mimetype || ""

    if (!/image/.test(mime)) {
      return await conn.sendMessage(m.chat, {
        text: `*⚠️ الـرجـاء الــرد عـلــى صـورة مـــع الأمـر.hd*`,
        contextInfo: newsletter
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    await conn.sendMessage(m.chat, {
      text: `*⏳ جـاري تـحـسـيـن جـودة الـصـورة...*`,
      contextInfo: newsletter
    }, { quoted: m })

    const buffer = await q.download()
    const url = await uploadToServer(buffer)
    const hdUrl = await processHD(url)

    await conn.sendMessage(m.chat, {
      image: { url: hdUrl },
      caption: `*✅ تــم تحـسـين جــودة الصـورة بـنـجاح*\n\n*© SASUKE TECH*`,
      contextInfo: newsletter
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, {
      text: `*❌ خـطـأ:* ${err.message || err}\n\n*© SASUKE TECH*`,
      contextInfo: newsletter
    }, { quoted: m })
  }
}

handler.help = ['hd']
handler.tags = ['تعديل']
handler.command = /^(hd|تحسين|تحسين_جودة)$/i
handler.limit = true

export default handler
