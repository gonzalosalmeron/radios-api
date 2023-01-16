import { clearUrl, scrape } from './index.js'

export async function getCountryRadios (url) {
  const $ = await scrape(url)
  const $rows = $('table tbody tr.rt0')
  const cities = []

  $rows.each((index, el) => {
    const $el = $(el)
    const rawCity = {}

    if (index > 1 && $el.find('span').text().length < 1) return false

    rawCity.name = $el.find('a').text().split(',')[0].trim().split('en ')[1]
    rawCity.slug = $el.find('a').attr('href').split('/')[0].split('.')[0]
    rawCity.autComm = $el.find('span').text()
    rawCity.flag = clearUrl($el.find('img').last().attr('src'))
    rawCity.radios = clearUrl($el.find('a').attr('href'))

    cities.push(rawCity)
  })

  return cities
}
