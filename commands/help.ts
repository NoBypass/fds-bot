import { Message, MessageEmbed } from "discord.js";
import { hypixel_api_key, desc, client } from "../index";

export default {
    callback: async (message: Message, ...args: string[]) => {
        const embed = new MessageEmbed()
        .setColor('#000000')
        .setTitle('Commands:')
        .setDescription('All the commands from our custom bot listed.')
        .addFields(
            { name: '-warp', value: 'Warps members from the "Guest VC" into the channel you\'re in.', inline: true },
            { name: '-verify', value: 'Links you with your hypixel account', inline: true },
            { name: '-getindex', value: 'Easy way to get a players index', inline: true },
            { name: '-help', value: 'Shows this message.', inline: true },
            { name: '-changelog', value: 'Shows the recent changelog.', inline: true },
            { name: '-daily', value: 'Gives you some exp. (Only works once a day though)', inline: true },
            { name: '-leaderboard', value: 'Shows a leaderboard of the top 10 server members (based on xp)', inline: true },
            { name: '-profile', value: 'See how much xp a specific member has.', inline: true },
        )
        .setFooter({ text: desc });
        
        return message.channel.send({ embeds: [embed] });
    }
}