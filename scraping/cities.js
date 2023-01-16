import { clearUrl, scrape, URLS } from './index.js'
import { getLive } from './lives.js'

const parseName = (rName, cName) => {
  let parsed = rName

  if (parsed !== undefined && ~parsed.toLowerCase().indexOf('(')) {
    parsed = parsed.split('(')[0].trim()
  }
  if (parsed !== undefined && ~parsed.toLowerCase().indexOf(cName)) {
    parsed = parsed.split(cName)[0]
  }

  return parsed
}

export const getCityRadios = async (slug, cityName, country) => {
  const url = `${URLS.baseUrl}${country}/${slug}.htm`
  const $ = await scrape(url)
  const $rows = $('table tbody tr')
  const radios = []
  let currFreq = ''

  $rows.each(async (index, el) => {
    const $el = $(el)

    if ($el.find('td').attr('class') === 'tr31') currFreq = $el.find('td.tr31').text().trim().split(',')[0]
    if ($el.attr('class') === 'rt0' && $el.find('td.fsta').children().length === 1) {
      const rawRadio = {}

      rawRadio.name = parseName($el.find('a').text().trim(), cityName)
      rawRadio.freq = currFreq
      rawRadio.mhz = $el.find('td.freq, td.dxfreq').text().trim()
      rawRadio.img = clearUrl($el.find('img.station').last().attr('src'))
      rawRadio.live = clearUrl($el.find('td.fsta a').attr('href'))
      rawRadio.city = cityName
      rawRadio.country = country
      console.log(/http/.test(rawRadio.live))
      // rawRadio.live = await getLive(rawRadio.live)

      radios.push(rawRadio)
    }
  })

  return radios
}
