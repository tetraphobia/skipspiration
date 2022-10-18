import googleTTS from 'google-tts-api'
import Stream, { Readable } from 'stream'

/**
 *
 * @param text
 * @param root0
 * @param root0.lang
 * @param root0.slow
 * @param root0.host
 * @param root0.timeout
 * @param root0.splitPunct
 */
export async function getVoiceStream (text: string, { slow = false, host = 'https://translate.google.com', timeout = 10000 } = {}): Promise<Readable> {
  const langs = [
    'en',
    'fr',
    'ja',
    'de',
    'zh-CN'
  ]
  const lang = langs[Math.floor(Math.random() * langs.length)]
  const stream = await new Stream.PassThrough()
  const base64Audio = await googleTTS.getAudioBase64(text, { lang, slow, host, timeout })

  const audioBinaryStream = new Stream.Readable()
  audioBinaryStream.push(Buffer.from(base64Audio, 'base64'))
  audioBinaryStream.push(null)

  audioBinaryStream.pipe(stream)
  return stream
}
