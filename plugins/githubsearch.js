import axios from 'axios';

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
const IMG_GITHUB = 'https://files.catbox.moe/00p88l.png'

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

// البحث في GitHub
const searchGitHub = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.sendMessage(m.chat, {
    image: { url: IMG_GITHUB },
    caption: `🔍 *SASUKE GITHUB SEARCH*\n\n🚨 يـرجـى إدخـال اسـم المـشـروع\n🔍 *مـثــال:*\n ${usedPrefix + command} WhatsApp-Bot\n*© SASUKE TECH*`,
    contextInfo: newsletter
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

  try {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(text)}&per_page=10`;
    const { data } = await axios.get(url);

    if (!data.items.length) throw new Error("❌ لـم يتـم العثور على أي مـستـودع مـطابـق!");

    let rows = data.items.slice(0, 10).map((repo) => ({
      title: `📂 ${repo.name}`,
      description: `⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}`,
      id: `${usedPrefix}info ${repo.html_url}`
    }));

    let sections = [{ title: "📜 نــتائــج الـبــحث SASUKE", rows: rows }]

    await conn.sendButton(m.chat, {
        image: { url: IMG_GITHUB },
        caption: `🔎 تــم الـعـثـور عـلـى ${data.items.length} مـســتودع\n> اخــتر المــســـتودع لـعــرض الـمعلـومـات`,
        footer: { text: `🚀 SASUKE TECH` },
        buttons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ title: '⬇️ اضــغــط هـنا للاخـتـيار', sections: sections }),
        }],
        headerType: 4,
        contextInfo: newsletter
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    conn.sendMessage(m.chat, {
      image: { url: IMG_GITHUB },
      caption: `❌ حدث خطأ: ${error.message}\n*© SASUKE TECH*`,
      contextInfo: newsletter
    }, { quoted: m });
  }
};

// عرض معلومات المستودع
const getRepoInfo = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, `🚨 *مـثـال:* ${usedPrefix}info https://github.com/user/repo\n*© SASUKE TECH*`, m);

  if (!regex.test(args[0])) return conn.reply(m.chat, "⚠️ الرابط غير صحيح!", m);

  let [_, user, repo] = args[0].match(regex) || [];
  repo = repo.replace(/.git$/, '');
  let repoUrl = `https://github.com/${user}/${repo}`
  let imgUrl = `https://opengraph.githubassets.com/1/${user}/${repo}`

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    const { data } = await axios.get(`https://api.github.com/repos/${user}/${repo}`);

    let caption = `*⭐ SASUKE GITHUB INFO*\n\n`
    caption += `📂 *اســم:* ${data.name}\n\n`
    caption += `📝 *الـوصـف:* ${data.description || 'لا يــوجد وصـف'}\n`
    caption += `👤 *المـطـور:* ${data.owner.login}\n`
    caption += `⭐ *الـنـجـوم:* ${data.stargazers_count}\n`
    caption += `🍴 *الـفـروع:* ${data.forks_count}\n`
    caption += `👀 *المـشـاهدات:* ${data.watchers_count}\n`
    caption += `💻 *الـلـغـة:* ${data.language || 'غير محدد'}\n`
    caption += `📅 *اخـر تـحديـث:* ${new Date(data.updated_at).toLocaleDateString('ar')}\n\n`
    caption += `🔗 *الـرابـط:* ${repoUrl}\n\n`
    caption += `*© SASUKE TECH*`

    await conn.sendMessage(m.chat, {
      image: { url: imgUrl },
      caption: caption,
      footer: { text: `🚀 SASUKE TECH` },
      contextInfo: newsletter
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    conn.reply(m.chat, `❌ فـشل جـلب المـعلومـات: ${error.message}`, m);
  }
};

// الامر الرئيسي
const handler = async (m, context) => {
  const { usedPrefix, command } = context;
  if (command === 'جيتهاب' || command === 'github') return searchGitHub(m, context);
  if (command === 'info' || command === 'sasuke_info') return getRepoInfo(m, context);
};

// باش يلتقط الضغط على الزر
handler.before = async (m, { conn, usedPrefix }) => {
    if (m.isBaileys || m.fromMe) return
    let selectedId = m.selectedId
    if (!selectedId) return

    if (selectedId.startsWith(`${usedPrefix}info`)) {
        let args = selectedId.split(' ').slice(1)
        await getRepoInfo(m, { conn, args, usedPrefix, command: 'info' })
        return true
    }
}

handler.help = ['جيتهاب <اسم>', 'info <رابط>'];
handler.tags = ['SASUKE', 'tools'];
handler.command = /^(جيتهاب|github|info|sasuke_info)$/i;

export default handler;
