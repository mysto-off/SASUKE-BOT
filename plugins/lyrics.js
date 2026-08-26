// ============================================
// Description: Search song lyrics using LrcLib API
// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// ============================================

// ─── مـعـلـومـات الـقـنـاة ─────────────────────────────────────────────
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

import axios from 'axios';

async function searchLyrics(title) {
    if (!title) throw new Error('*❌ الـرجـاء ادخـال اسـم الاغـنـيـة اولـا*');

    const { data } = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(title)}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 15000
    });

    if (!data ||!data[0]) throw new Error('*❌ لـم يـتـم الـعـثـور عـلـى كـلـمـات لـهـذه الاغـنـيـة*');

    const song = data[0];
    const lyricsRaw = song.plainLyrics || song.syncedLyrics;

    if (!lyricsRaw) throw new Error('*❌ تـم الـعـثـور عـلـى الاغـنـيـة ولـكـن لا تـوجـد كـلـمـات*');

    const cleanLyrics = lyricsRaw.replace(/\[.*?\]/g, '').trim();

    const minutes = Math.floor(song.duration / 60);
    const seconds = Math.floor(song.duration % 60);
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return {
        trackName: song.trackName,
        artistName: song.artistName,
        albumName: song.albumName,
        duration: duration,
        lyrics: cleanLyrics
    };
}

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) return conn.sendMessage(m.chat, { 
        text: `*🎵 SASUKE LYRICS SEARCH - مـجـانـي*\n\n*📌 الـطـريـقـة:* ${usedPrefix + command} اسـم الاغـنـيـة\n*📌 امـثـلـة:* \n${usedPrefix + command} Bohemian Rhapsody\n${usedPrefix + command} عـمـرو ديـاب تـمـالـي مـعـاك\n*© SASUKE TECH*`,
        contextInfo: newsletter
    }, { quoted: m });

    try {
        await m.react('🎵');
        let msg = await conn.sendMessage(m.chat, { 
            text: '*🔍 SASUKE كـايـقـلـب عـلـى الـكـلـمـات...*',
            contextInfo: newsletter
        }, { quoted: m });

        const res = await searchLyrics(text);

        let caption = `*🎤 ${res.trackName}*\n`;
        caption += `*🎙️ الـمـغـنـي:* ${res.artistName}\n`;
        if (res.albumName) caption += `*💿 الـالـبـوم:* ${res.albumName}\n`;
        caption += `*⏰ الـمـدة:* ${res.duration}\n`;
        caption += `------------------------\n\n`;
        caption += res.lyrics + `\n\n*© SASUKE TECH*`;

        if (caption.length > 4000) {
            await conn.sendMessage(m.chat, { 
                text: caption.slice(0, 4000) + '\n\n*...يـتـبـع*',
                contextInfo: newsletter
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { 
                text: caption,
                contextInfo: newsletter
            }, { quoted: m });
        }

        await m.react('✅');
        await conn.sendMessage(m.chat, { delete: msg.key }).catch(() => {});

    } catch (e) {
        console.log('[LYRICS ERROR]', e.message);
        await m.react('❌');
        await conn.sendMessage(m.chat, { 
            text: `${e.message}`,
            contextInfo: newsletter
        }, { quoted: m });
    }
};

handler.help = ['lyrics <اسـم الاغـنـيـة>'];
handler.tags = ['SASUKE', 'مـوسـيـقـى'];
handler.command = /^(lyrics|بحث_اغاني|كلمات)$/i;
handler.limit = false
handler.register = false

export default handler;
