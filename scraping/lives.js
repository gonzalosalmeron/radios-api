import { URLS } from './index.js'

export async function getLive (url) {
  // console.log(url.length > 1)
  if (/http/.test(url)) return ''

  const res = await fetch(URLS.baseUrl + url)
  const html = await res.text()
  if (!/id="radiomapplayer"/.test()) return 'null'

  const regex = /(?<=id="radiomapplayer" src=")(.*)(?=" type)/
  const liveUrl = html.match(regex)[1]

  return liveUrl
}
