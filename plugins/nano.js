// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛

import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";

// ===== مـعـلـومـات الـقـنـاة =====
const channelName = 'ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ 🇲🇦'
const CHANNEL_ID = '120363410733859643@newsletter'
const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}
// ========================

class المحرك {
  static الرابط = "https://be.aimirror.fun";
  static المعرف = المحرك.انشاء_المعرف();
  static الرؤوس = {
    'User-Agent': 'SASUKE-TECH/2.0',
    'store': 'googleplay',
    'uid': المحرك.المعرف,
    'env': 'PRO',
    'package-name': 'com.ai.polyverse.mirror',
    'host': 'be.aimirror.fun',
    'content-type': 'application/json',
    'app-version': '6.8.4+179'
  };

  static التجزئة = "";
  static مفتاح_الصورة = "";

  static التشفير(نص) {
    return crypto.createHash('sha1').update(نص, 'utf8').digest('hex');
  }

  static انشاء_المعرف() {
    return Array.from({ length: 16 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
  }

  static async جلب_الرمز() {
    if (!this.التجزئة) throw new Error("مـطـلـوب الـتـجـزئـة");
    const url = `${this.الرابط}/app_token/v2`;
    const params = { cropped_image_hash: `${this.التجزئة}.jpg`, uid: this.المعرف };
    const res = await axios.get(url, { params, headers: this.الرؤوس });
    return res.data;
  }

  static async رفع_الصورة(buffer, الرمز) {
    const form = new FormData();
    form.append("name", الرمز.name);
    form.append("key", الرمز.key);
    form.append("policy", الرمز.policy);
    form.append("OSSAccessKeyId", الرمز.OSSAccessKeyId);
    form.append("success_action_status", الرمز.success_action_status);
    form.append("signature", الرمز.signature);
    form.append("backend_type", الرمز.backend_type);
    form.append("region", الرمز.region);
    form.append("file", buffer, { filename: `${this.التجزئة}.jpg` });

    const headers = {...form.getHeaders(), "User-Agent": "Dart/3.6"};
    await axios.post(الرمز.upload_host, form, { headers });
  }

  static async توليد(البيانات = {}) {
    const url = `${this.الرابط}/draw?uid=${this.المعرف}`;
    const data = {
      model_id: البيانات.model_id || 271,
      cropped_image_key: this.مفتاح_الصورة,
      cropped_height: 1024,
      cropped_width: 768,
      package_name: "com.ai.polyverse.mirror",
      ext_args: { imagine_value2: 50, custom_prompt: "" },
      version: "6.8.4",
      is_free_trial: true
    };
    const res = await axios.post(url, data, { headers: this.الرؤوس });
    return res.data;
  }

  static async انتظار(المعرف) {
    const url = `${this.الرابط}/draw/process`;
    while (true) {
      const res = await axios.get(url, { headers: this.الرؤوس, params: { draw_request_id: المعرف, uid: this.المعرف } });
      const data = res.data;
      if (data.draw_status === "SUCCEED") return data.generated_image_addresses;
      if (data.draw_status === "FAILED") throw new Error("فـشـل الـتـولـيـد");
      await new Promise(r => setTimeout(r, 7000));
    }
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted? m.quoted : m;
    const mime = (q.msg || q).mimetype || "";
    if (!mime ||!mime.startsWith("image/")) {
      return await conn.sendMessage(m.chat, {
        text: `*📌 الـطـريـقـة:*\nرد عـلـى صـورة واكـتـب *${usedPrefix + command}*\n\n*مـثـال:* رد عـلـى صـورة + ${usedPrefix + command}`,
        contextInfo: newsletter
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    await conn.sendMessage(m.chat, {
      text: `*⏳ جـاري تـحـويـل الـصـورة بـالـذكـاء الاصـطـنـاعـي...*`,
      contextInfo: newsletter
    }, { quoted: m })

    const imgBuffer = await q.download();
    المحرك.التجزئة = المحرك.التشفير(crypto.randomUUID());
    const الرمز = await المحرك.جلب_الرمز();
    المحرك.مفتاح_الصورة = الرمز.key;
    await المحرك.رفع_الصورة(imgBuffer, الرمز);

    const النتيجة = await المحرك.توليد();
    const الصور = await المحرك.انتظار(النتيجة.draw_request_id);

    if (!الصور || الصور.length === 0) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return await conn.sendMessage(m.chat, {
        text: `*❌ فـشـل تـولـيـد الـصـورة*`,
        contextInfo: newsletter
      }, { quoted: m })
    }

    await conn.sendFile(m.chat, الصور[0], "sasuke.jpg", `*✅ تـمـت مـعـالـجـة الـصـورة بـنـجـاح*\n\n*© SASUKE TECH*`, m, { contextInfo: newsletter });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.sendMessage(m.chat, {
      text: `*❌ خـطـأ:* ${e.message}\n\n*© SASUKE TECH*`,
      contextInfo: newsletter
    }, { quoted: m })
  }
}

handler.help = ['نانو']
handler.tags = ['ai']
handler.command = ['نانو']
handler.limit = true
export default handler
