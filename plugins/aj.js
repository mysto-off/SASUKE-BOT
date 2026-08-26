//تـرجـمـة وتـعـديـل: ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ
//بـلـوغـيـن: SASUKE | اخـبـار الـجـزيـرة

// Aljazeera News Plugin - SASUKE Style
import * as cheerio from 'cheerio'

const RSS_URL = 'https://www.aljazeera.net/rss'

let handler = async (m, { conn, args, usedPrefix }) => {
    // ===== مـعـلـومـات الـقـنـاة SASUKE =====
    const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
    const newsletter = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363427685476208@newsletter',
            newsletterName: channelName
        }
    }
    // ======================================

    await m.react('📰')
    await conn.sendMessage(m.chat, {
        text: `*🔍 SASUKE NEWS*\n\n*جـاري جـلـب اخـر 5 اخـبـار مـن الـجـزيـرة... انـتـظـر قـلـيـلا*\n*© SASUKE TECH*`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        let news = await fetchAljazeeraNews()

        if (!news.length) {
            return conn.sendMessage(m.chat, {
                text: `*❌ لا تـوجـد اخـبـار جـديـدة حـالـيـا*\n*© SASUKE TECH*`,
                contextInfo: newsletter
            }, { quoted: m })
        }

        // ارسـال اول 5 اخـبـار مـع الـتـفـاصـيـل
        for(let i = 0; i < Math.min(5, news.length); i++) {
            let item = news[i]

            let cap = `╭━━━〔 *📰 SASUKE NEWS ${i + 1}* 〕━━━╮\n`
            cap += `┃ *${item.title}*\n`
            cap += `╰━━━━━━━━━╯\n\n`
            cap += `*📅 الـتـاريـخ:* ${new Date(item.date).toLocaleString('ar-MA', {timeZone: 'Africa/Casablanca'})}\n`
            cap += `*🏷️ الـمـصـدر:* الـجـزيـرة\n`
            cap += `${item.desc}\n\n`
            cap += `*🔗 الـرابـط:* ${item.link}\n\n`
            cap += `*© SASUKE TECH*`

            if(item.img) {
                await conn.sendMessage(m.chat, {
                    image: { url: item.img },
                    caption: cap,
                    footer: channelName,
                    contextInfo: newsletter
                })
            } else {
                await conn.sendMessage(m.chat, {
                    text: cap,
                    contextInfo: newsletter
                })
            }

            await new Promise(r => setTimeout(r, 1500))
        }

        await conn.sendMessage(m.chat, {
            text: `*✅ تـم ارسـال ${Math.min(5, news.length)} مـقـالـة اخـبـاريـة*\n*© SASUKE TECH*`,
            contextInfo: newsletter
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        await conn.sendMessage(m.chat, {
            text: `*❌ حـدث خـطـأ اثـنـاء جـلـب الاخـبـار*\n*© SASUKE TECH*`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ["aljazeera", "اخبار_الجزيرة"];
handler.tags = ["SASUKE", "اخـبـار"];
handler.command = /^(aljazeera|اخبار_الجزيرة|sasuke_news)$/i;
handler.limit = false;
handler.register = false;
export default handler;

// Function to fetch news from RSS
async function fetchAljazeeraNews() {
  try {
    const HEADERS = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    }
    const res = await fetch(RSS_URL, { headers: HEADERS, signal: AbortSignal.timeout(15000) })
    if(!res.ok) throw new Error('HTTP ' + res.status)
    const xml = await res.text()
    const $ = cheerio.load(xml, { xmlMode: true })
    let news = []

    $('item').each((i, el) => {
      if(news.length >= 5) return false
      let title = $(el).find('title').text().trim()
      let link = $(el).find('link').text().trim()
      let desc = $(el).find('description').text().replace(/<[^>]*>/g,'').trim().slice(0,500)+'...'
      let date = $(el).find('pubDate').text()
      let img = $(el).find('enclosure').attr('url') || $(el).find('media\\:content').attr('url') || ''

      if(title && link) {
        news.push({ title, link, img, desc, date })
      }
    })
    return news
  } catch(e) {
    console.log('Aljazeera Error:', e.message)
    return []
  }
}
