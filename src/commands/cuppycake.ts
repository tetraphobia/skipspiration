import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice'
import { CommandInteraction, GuildMember } from 'discord.js'
import { Discord, Slash } from 'discordx'

@Discord()
export class Cuppycake {
    @Slash({ description: 'You\'re my honeybunch sugarplum pumpy-umpy-umpkin.', name: 'cuppycake' })
  async cuppycake (interaction: CommandInteraction): Promise<void> {
    if (
      !interaction.guild ||
            !(interaction.member instanceof GuildMember)
    ) {
      await interaction.reply('WEWEWE WOOWOHFOWO OSLDFJLS DFISDFLSHDFLSLIFLESLFISE HLFLESF LIESIFHL SHEILFIL')
      return
    }
    if (
      !interaction.member.voice.channelId ||
            !interaction.member.voice.channel
    ) {
      await interaction.reply('Join a channel first, cuppycake.')
      return
    }

    const player = createAudioPlayer()
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.member.guild.id,
      adapterCreator: interaction.member.guild.voiceAdapterCreator
    })
    const resource = createAudioResource('public/cuppycake.ogg')

    const subscription = connection.subscribe(player)

    if (subscription) {
      interaction.reply(`${interaction.member} You're my honeybunch sugarplum pumpy-umpy-umpkin!`)
      subscription.player.on(AudioPlayerStatus.Idle, () => {
        setTimeout(() => {
          connection.disconnect()
        }, 1000)
      })
      subscription.player.play(resource)
    }
  }
}
