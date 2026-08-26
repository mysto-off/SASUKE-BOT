import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';

// ===== معلومات قناة SASUKE =====
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
// ===========================

/**
 * Handle messages upsert
 * @param {import('baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate
 */
export async function handler(chatUpdate) {
	if (!chatUpdate) return;
	this.pushMessage(chatUpdate.messages).catch(console.error);
	let m = chatUpdate.messages[chatUpdate.messages.length - 1];
	if (!m) return;
	if (global.db.data == null) await global.loadDatabase();
	try {
		m = smsg(this, m) || m;
		if (!m) return;
		m.exp = 0;
		m.limit = false;

		if (m.sender.endsWith('@broadcast') || m.sender.endsWith('@newsletter')) return;
		await (await import(`./lib/database.js?v=${Date.now()}`)).default(m, this);

		if (typeof m.text!== 'string') m.text = '';

		const isROwner = [conn.decodeJid(global.conn.user.id),...global.owner.map(([number]) => number)].map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
		const isOwner = isROwner || m.fromMe;
		const isPrems = isROwner || db.data.users[m.sender]?.premiumTime > 0;

		if (global.db.data.settings[this.user.jid].gconly &&!m.isGroup &&!isOwner &&!isPrems) return;
		if (!global.db.data.settings[this.user.jid].public &&!isOwner &&!m.fromMe) return;

		if (m.isBaileys) return;
		m.exp += Math.ceil(Math.random() * 10);

		let usedPrefix;
		let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender];

		const groupMetadata = (m.isGroup? (conn.chats[m.chat] || {}).metadata || (await this.groupMetadata(m.chat).catch((_) => null)) : {}) || {};
		const participants = (m.isGroup? groupMetadata.participants : []) || [];
		const user = (m.isGroup? participants.find((u) => conn.getJid(u.id) === m.sender) : {}) || {};
		const bot = (m.isGroup? participants.find((u) => conn.getJid(u.id) == this.user.jid) : {}) || {};
		const isRAdmin = user?.admin == 'superadmin' || false;
		const isAdmin = isRAdmin || user?.admin == 'admin' || false;
		const isBotAdmin = bot?.admin || false;

		const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
		for (let name in global.plugins) {
			let plugin = global.plugins[name];
			if (!plugin) continue;
			if (plugin.disabled) continue;
			const __filename = path.join(___dirname, name);
			if (typeof plugin.all === 'function') {
				try {
					await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename });
				} catch (e) {
					console.error(e);
					for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
						let data = (await conn.onWhatsApp(jid))[0] || {};
						if (data.exists) m.reply(`*البلوجن:* ${name}\n*المرسل:* ${m.sender}\n*الشات:* ${m.chat}\n*الامر:* ${m.text}\n\n\`\`\`${format(e)}\`\``.trim(), data.jid);
					}
				}
			}
			if (plugin.tags && plugin.tags.includes('admin')) continue;
			
			const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
			let _prefix = plugin.customPrefix? plugin.customPrefix : conn.prefix? conn.prefix : global.prefix;
			let match = (_prefix instanceof RegExp? [[_prefix.exec(m.text), _prefix]] : Array.isArray(_prefix)? _prefix.map((p) => { let re = p instanceof RegExp? p : new RegExp(str2Regex(p)); return [re.exec(m.text), re]; }) : typeof _prefix === 'string'? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] : [[[], new RegExp()]]).find((p) => p[1]);
			
			if (typeof plugin.before === 'function') {
				if (await plugin.before.call(this, m, { match, conn: this, participants, groupMetadata, user, bot, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename })) continue;
			}
			if (typeof plugin!== 'function') continue;
			if ((usedPrefix = (match[0] || '')[0])) {
				let noPrefix = m.text.replace(usedPrefix, '');
				let [command,...args] = noPrefix.trim().split` `.filter((v) => v);
				args = args || [];
				let _args = noPrefix.trim().split` `.slice(1);
				let text = _args.join` `;
				command = (command || '').toLowerCase();
				let fail = plugin.fail || global.dfail;
				let isAccept = plugin.command instanceof RegExp? plugin.command.test(command) : Array.isArray(plugin.command)? plugin.command.some((cmd) => cmd instanceof RegExp? cmd.test(command) : cmd === command) : typeof plugin.command === 'string'? plugin.command === command : false;

				if (!isAccept) continue;
				m.plugin = name;
				if (!isOwner && (m.chat in global.db.data.chats || m.sender in global.db.data.users)) {
					let chat = global.db.data.chats[m.chat];
					if (name!= 'tools-delete.js' && chat?.isBanned) return;
				}
				if (plugin.rowner && plugin.owner &&!(isROwner || isOwner)) { fail('owner', m, this); continue; }
				if (plugin.rowner &&!isROwner) { fail('rowner', m, this); continue; }
				if (plugin.owner &&!isOwner) { fail('owner', m, this); continue; }
				if (plugin.premium &&!isPrems) { fail('premium', m, this); continue; }
				if (plugin.group &&!m.isGroup) { fail('group', m, this); continue; }
				else if (plugin.botAdmin &&!isBotAdmin) { fail('botAdmin', m, this); continue; }
				else if (plugin.admin &&!isAdmin) { fail('admin', m, this); continue; }
				if (plugin.private && m.isGroup) { fail('private', m, this); continue; }
				if (plugin.register == true && _user.registered == false) { fail('unreg', m, this); continue; }
				
				m.isCommand = true;
				let xp = 'exp' in plugin? parseInt(plugin.exp) : 17;
				if (xp > 200) m.reply('كتهكر -_-'); else m.exp += xp;
				
				if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
					this.reply(m.chat, `[❗] الـلـيـمـيـت ديـالـك سـلا. شـري مـن *${usedPrefix}buy*`, m);
					continue;
				}
				if (plugin.level > _user.level) {
					this.reply(m.chat, `[💬] خـاصـك لـيـفـيـل ${plugin.level} بـاش تـسـتـعـمـل هـاد الأمـر\n*لـيـفـيـل ديـالـك:* ${_user.level} 📊`, m);
					continue;
				}
				let extra = { match, usedPrefix, noPrefix, _args, args, command, text, conn: this, participants, groupMetadata, user, bot, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename };
				try {
					await plugin.call(this, m, extra);
					if (!isPrems) m.limit = m.limit || plugin.limit || false;
				} catch (e) {
					m.error = e;
					console.error(e);
					if (e) {
						let text = format(e);
						if (e.name)
							for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
								let data = (await conn.onWhatsApp(jid))[0] || {};
								if (data.exists)
									m.reply(`*🗂️ البلوجن:* ${m.plugin}\n*👤 المرسل:* ${m.sender}\n*💬 الشات:* ${m.chat}\n*💻 الأمر:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *الخطأ:*\n\n\`\`\`${text}\`\``.trim(), data.jid);
							}
						m.reply(`*❌ وقع خطأ*\n\`\`\`${text}\`\`\`\n*© SASUKE TECH*`);
					}
				} finally {
					if (typeof plugin.after === 'function') { try { await plugin.after.call(this, m, extra); } catch (e) { console.error(e); } }
					if (m.limit) m.reply(`+${m.limit} ليميـت تـسـتـعـمـل ✔️`);
				}
				break;
			}
	}
	} catch (e) {
		console.error(e);
	} finally {
		let user, stats = global.db.data.stats;
		if (m) {
			if (m.sender && (user = global.db.data.users[m.sender])) {
				user.exp += Number(m.exp || 0);
				user.limit -= Number(m.limit || 0);
			}
			if (m.plugin) {
				const now = Date.now();
				stats[m.plugin] = { total: 0, success: 0, last: 0, lastSuccess: 0,...stats[m.plugin] };
				stats[m.plugin].total++;
				stats[m.plugin].last = now;
				if (!m.error) { stats[m.plugin].success++; stats[m.plugin].lastSuccess = now; }
			}
		}
		try { await (await import(`./lib/print.js`)).default(m, this); } catch (e) { console.log(m, m.quoted, e); }
		if (global.db.data.settings[this.user.jid]?.autoread) await conn.readMessages([m.key]);
	}
}

export async function participantsUpdate({ id, participants, action, simulate = false }) {
	if (this.isInit &&!simulate) return;
	if (global.db.data == null) await loadDatabase();
	let chat = global.db.data.chats[id] || {};
	let text = '';
	const groupMetadata = (conn.chats[id] || {}).metadata || (await this.groupMetadata(id));
	switch (action) {
		case 'add':
		case 'remove':
			if (chat.welcome) {
				for (let user of participants) {
					user = this.getJid(user?.phoneNumber || user.id);
					const tamnel = await this.profilePictureUrl(user, 'image', 'buffer');
					text = (action === 'add'? chat.sWelcome || `مرحبا @user فـ @subject` : chat.sBye || `مع السلامة @user`)
						.replace('@user', `@${user.split('@')[0]}`).replace('@subject', this.getName(id)).replace('@desc', groupMetadata.desc || '');
					this.adReply(id, text, tamnel, null, { title: action == 'add'? '💌 تـرحـيـب' : '🐾 مـغـادرة', description: action == 'add'? 'عضو جديد انضم' : 'عضو غادر' });
				}
			}
			break;
		case 'promote':
		case 'demote':
			for (let users of participants) {
				let user = this.getJid(users?.phoneNumber || users.id);
				text = (action === 'promote'? chat.sPromote || '@user ولى أدمن دابا' : chat.sDemote || '@user تحيد من الأدمن')
					.replace('@user', '@' + user.split('@')[0]).replace('@subject', this.getName(id)).replace('@desc', groupMetadata.desc || '');
				if (chat.detect) this.sendMessage(id, { text, mentions: this.parseMention(text), contextInfo: newsletter });
			}
			break;
	}
}

export async function groupsUpdate(groupsUpdate) {
	for (const groupUpdate of groupsUpdate) {
		const id = groupUpdate.id;
		if (!id) continue;
		let chats = global.db.data.chats[id], text = '';
		if (!chats?.detect) continue;
		if (groupUpdate.desc) text = (chats.sDesc || '```تبدل وصف الكروب لـ```\n@desc').replace('@desc', groupUpdate.desc);
		if (groupUpdate.subject) text = (chats.sSubject || '```تبدل اسم الكروب لـ```\n@subject').replace('@subject', groupUpdate.subject);
		if (groupUpdate.icon) text = (chats.sIcon || '```تبدلت صورة الكروب```').replace('@icon', groupUpdate.icon);
		if (groupUpdate.revoke) text = (chats.sRevoke || '```تبدل رابط الكروب لـ```\n@revoke').replace('@revoke', groupUpdate.revoke);
		if (!text) continue;
		await this.sendMessage(id, { text, mentions: this.parseMention(text), contextInfo: newsletter });
	}
}

export async function deleteUpdate(message) {
	try {
		const { fromMe, id, participant } = message;
		if (fromMe) return;
		let msg = this.serializeM(this.loadMessage(id));
		if (!msg) return;
		let chat = global.db.data.chats[msg.chat];
		if (!chat.delete) return;
		await this.reply(
			msg.chat,
			`⚠️ تـم حـذف رسـالـة بـواسـطـة @${participant.split`@`[0]}\nبـاش تـطـفـي هـاد الـخـاصـيـة كـتـب *.enable delete*`,
			msg,
			{ mentions: [participant], contextInfo: newsletter }
	);
		this.copyNForward(msg.chat, msg).catch((e) => console.log(e, msg));
	} catch (e) { console.error(e); }
}

global.dfail = (type, m, conn) => {
	let msg = {
		rowner: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ هـاد الأمـر خـاص غـيـر بـالـمـطـور',
	owner: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ هـاد الأمـر خـاص غـيـر بـالـمـالـك',
		premium: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ هـاد الأمـر خـاص غـيـر بـالمـشـتـركـيـن الـمـمـيـزيـن',
		group: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ هـاد الأمـر خـاص غـيـر بـالـقـروبـات',
		private: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ هـاد الأمـر خـاص غـيـر بـالـخـاص',
		admin: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ هـاد الأمـر خـاص غـيـر بـالأدمـن',
		botAdmin: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ خـاص الـبـوت يـكـون أدمن الأول',
		unreg: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n👋 مـرحـبـا! خـاصـك تـسـجـل الأول\nطـريـقـة الـتـسـجـيـل:.تسجيل الاسـم.الـعـمـر',
	restrict: '*ᏚᎯᏚᏌᏦᎬ ᎿᎬᏨᎻ*\n\n❌ خـاصـيـة الـتـقـيـيـد مـفـعـلـة',
	}[type];
	if (msg) return conn.reply(m.chat, msg, m, { contextInfo: newsletter });
};

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
	unwatchFile(file);
	console.log(chalk.redBright("Update 'handler.js'"));
	if (global.reloadHandler) console.log(await global.reloadHandler());
});
