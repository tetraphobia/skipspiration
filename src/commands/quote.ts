import { EmbedBuilder } from '@discordjs/builders'
import { AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } from '@discordjs/voice'
import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { connect } from 'http2'
import { getVoiceStream } from '../helpers/index.js'
import { Quote } from '../models/quote.model.js'

/**
 * /quote
 * Quote a user.
 */
@Discord()
export class QuoteCommand {
  @Slash({ description: 'Put an inspirational quote into the archives of gamer wisdom.', name: 'quote' })
  async quote (
    @SlashOption({
      description: 'A user.',
      name: 'user',
      required: true,
      type: ApplicationCommandOptionType.User
    })
      user: string,
    @SlashOption({
      description: "A user's words of wisdom.",
      name: 'quote',
      required: true,
      type: ApplicationCommandOptionType.String
    })
      quote: string,
      interaction: CommandInteraction
  ): Promise<void> {
    try {
      const newQuote = await Quote.create({
        user: JSON.stringify(user),
        quote
      })

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setThumbnail('https://cdn.discordapp.com/app-icons/1031826927662682193/6b2b90f865944bf707f4d09ac5ca9367.png')
        .setAuthor({ name: 'Papa Skipbot IV, Preserver of Texts' })
        .setTimestamp()
        .setDescription(`"${newQuote.quote}"\n\nThank you for your wisdom, ${user}.`)
      interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error(error)
    }
  }
}

/**
 * /inspireme
 * Inspire me
 */
@Discord()
export class InspireMeCommand {
  @Slash({ description: 'Be inspired by the words of your peers.', name: 'inspireme' })
  async inspireme (
    interaction: CommandInteraction
  ): Promise<void> {
    if (
      !interaction.guild ||
      !(interaction.member instanceof GuildMember)
    ) {
      await interaction.reply('WEWEWE WOOWOHFOWO OSLDFJLS DFISDFLSHDFLSLIFLESLFISE HLFLESF LIESIFHL SHEILFIL')
      return
    }
    try {
      const quotes = await Quote.findAll()
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      const user = JSON.parse(randomQuote.user)

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Archives of Wisdom' })
        .setColor(0x0099FF)
        .setThumbnail(user.displayAvatarURL)
        .setDescription(`"${randomQuote.quote}"\n\n- ${user.nickname}`)
        .addFields(
          { name: 'Date Added', value: randomQuote.created_at.toLocaleDateString('en-us') }
        )

      if (
        interaction.member.voice.channelId
      ) {
        const player = createAudioPlayer()
        const connection = joinVoiceChannel({
          channelId: interaction.member.voice.channelId,
          guildId: interaction.member.guild.id,
          adapterCreator: interaction.member.guild.voiceAdapterCreator
        })
        const stream = await getVoiceStream(user.nickname + ' says... ' + randomQuote.quote)
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true })

        const subscription = connection.subscribe(player)

        if (subscription) {
          subscription.player.on(AudioPlayerStatus.Idle, () => {
            setTimeout(() => {
              connection.disconnect()
            }, 1000)
          })
          subscription.player.play(resource)
        }
        await interaction.reply({ embeds: [embed] })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
