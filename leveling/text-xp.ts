import fetch from "node-fetch";
import verifiedUsers from '../schemas/verified-users'
import { hypixel_api_key, desc, client, guildID } from "../index";

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (await verifiedUsers.exists({ memberid: message.member.id }) !== null) {
            if (message.channel.parent.id === '1000781349248057354') return;
            const args = message.content.slice(1).split(/ +/)
            const { member } = message
            if (message.channel.parent.id == '1000781575681757254') var xpPerMessage = args.length * 6
            else var xpPerMessage = args.length * 3

            addXP(member.id, xpPerMessage, message)
        }
    })
}

const getNeededXP = (level) => {
    if (level < 10) {
        return Math.pow(level, 2) * 100
    } else if (level >= 10) {
        return 10000
    }
}

const addXP = async (memberid, xpToAdd, message) => {
    const result = await verifiedUsers.findOneAndUpdate(
        {
            memberid,
        },
        {
            memberid,
            $inc: {
                xp: xpToAdd,
            },
        },
    )

    let { xp, level } = result
    const needed = getNeededXP(level)

    if (xp >= needed) {
        ++level
        xp -= needed
        message.reply(
            'You are now level ' + level + '!'
        )
        await verifiedUsers.updateOne(
            {
                memberid,
            },
            {
                level,
                xp,
            }
        )
        const currentNick = await verifiedUsers.where('memberid').equals(memberid).select('ign -_id')
        if (getGmBo(currentNick[0].ign) as unknown as boolean == true) var prefix = '❂ '
        else prefix = ''
        if (!message.member.permissions.has('ADMINISTRATOR')) message.member.setNickname(prefix + currentNick[0].ign + ' [' + level + ']').catch(err => {console.log(err)})
    }
}

async function getGmBo(ign) {
    fetch('https://api.ashcon.app/mojang/v2/user/' + ign)
    .then(response => response.json())
    .then(async mdata => {
        const uuid = (mdata as any).uuid.replaceAll('-', '')

        const gURL = 'https://api.hypixel.net/guild?key=' + hypixel_api_key + '&id=' + guildID
        fetch(gURL)
            .then(response => response.json())
            .then(async gData => {
                const gMemberArr = gData.guild.members
                for (var i = 0; i < gMemberArr.length; i++) {
                    if (gMemberArr[i].uuid == uuid) {
                        return true;
                    } else {
                        return false
                    }
                }
            })
    })
}

module.exports.addXP = addXP