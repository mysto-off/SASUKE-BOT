// ============================================
// SASUKE GROUP MANAGEMENT
// © 𝗖𝗢𝗣𝗬𝗥𝗜𝗚𝗛𝗧 𝗕𝗬 𝗦𝗔𝗦𝗨𝗞𝗘 𝗧𝗘𝗖𝗛
// ============================================

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
// =====================================

const handler = async (m, { conn, text, participants, groupMetadata, command, usedPrefix }) => {
	const target = m.quoted
	? m.quoted.sender
	: m.mentionedJid && m.mentionedJid[0]
		? m.mentionedJid[0]
	: text
	? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
	: null

	const cmd = ['اضافة', 'طرد', 'ترقية', 'انزال', 'add', 'kick', 'promote', 'demote', 'فتح', 'اغلاق', 'opengc', 'closegc']

	if (cmd.includes(command) && ['اضافة', 'طرد', 'ترقية', 'انزال', 'add', 'kick', 'promote', 'demote'].includes(command) &&!target)
		return conn.sendMessage(m.chat, {
			text: `*🔰 SASUKE ADMIN*\n\n*🫯 الـرجـاء مـنـشـن الـعـضـو او الـرد عـلـى رسـالـتـه*\n\n*📌 مـثـل :* \`${usedPrefix}طرد @tag\`\n*© SASUKE TECH*`,
			contextInfo: newsletter
		}, { quoted: m })

	const inGc = participants.some(
	(v) => v.jid == target || v.id === target || v.phoneNumber === target
	)

	await m.react('⏳')

	switch (command) {
		case 'add':
		case 'اضافة':
			{
				if (inGc) {
					await m.react('❌')
					return m.reply(`*❌ الـعـضـو مـوجـود فـي الـمـجـمـوعـة*`)
				}
				const response = await conn.groupParticipantsUpdate(m.chat, [target], 'add')
				const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image', 'buffer').catch(() => null)

				for (const participant of response) {
					const jid = participant.content?.attrs?.phone_number || participant.content?.attrs?.jid || participant.jid
					const status = participant.status

					if (status === '408') {
						await m.reply(`*❌ مـا يـمـكـنـش تـضـيـف @${jid.split('@')[0]}*\n*الـسـبـب:* خـرج مـؤخـرا او تـطـرد\n*© SASUKE TECH*`)
					} else if (status === '403') {
						const inviteCode = participant.content?.[0]?.attrs?.code
						const inviteExp = participant.content?.[0]?.attrs?.expiration
						await m.reply(`*⏳ جـاري ارسـال دعـوة ل @${jid.split('@')[0]}*`)
						await conn.sendGroupV4Invite(m.chat, jid, inviteCode, inviteExp, groupMetadata.subject, 'دعـوة لـلانـضـمـام مـن SASUKE', jpegThumbnail)
					} else {
						await m.reply(`*✅ تـمـت اضـافـة @${jid.split('@')[0]}*\n*© SASUKE TECH*`)
						await m.react('✅')
					}
				}
			}
			break

		case 'kick':
		case 'طرد':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
			await m.reply(`*✅ تـم طـرد @${target.split('@')[0]}*\n*© SASUKE TECH*`)
			await m.react('✅')
			break

		case 'promote':
		case 'ترقية':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'promote')
			await m.reply(`*✅ تـم تـرقـيـة @${target.split('@')[0]} لادمـيـن*\n*© SASUKE TECH*`)
			await m.react('✅')
			break

		case 'demote':
		case 'انزال':
			if (!inGc) {
				await m.react('❌')
				return m.reply(`*❌ الـعـضـو مـاشـي فـي الـمـجـمـوعـة*`)
			}
			await conn.groupParticipantsUpdate(m.chat, [target], 'demote')
			await m.reply(`*✅ تـم انـزال @${target.split('@')[0]} مـن الادارة*\n*© SASUKE TECH*`)
			await m.react('✅')
			break

		case 'closegc':
		case 'اغلاق':
			await conn.groupSettingUpdate(m.chat, 'announcement')
			await m.reply(`*✅ تـم اغـلاق الـمـجـمـوعـة*\n*الان فـقـط الادمـيـن يـقـدر يـرسـل*\n*© SASUKE TECH*`)
			await m.react('✅')
			break

		case 'opengc':
		case 'فتح':
			await conn.groupSettingUpdate(m.chat, 'not_announcement')
			await m.reply(`*✅ تـم فـتـح الـمـجـمـوعـة*\n*الان كـلـشـي يـقـدر يـرسـل*\n*© SASUKE TECH*`)
			await m.react('✅')
			break

		default:
			return m.reply(`*❌ امـر غـيـر مـعـروف*`)
	}
}

handler.help = ['اضافة @tag', 'طرد @tag', 'ترقية @tag', 'انزال @tag', 'فتح', 'اغلاق']
handler.tags = ['SASUKE', 'owner']
handler.command = /^(اضافة|طرد|ترقية|انزال|add|kick|promote|demote|فتح|اغلاق|opengc|closegc)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.owner = true
export default handler
