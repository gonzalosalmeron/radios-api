import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import { readFileSync } from 'fs'
import path from 'node:path'
import { getCountryRadios } from './country.js'
import { getCityRadios } from './cities.js'
import { getLive } from './lives.js'

// EXPORTED FUNCTIONS
export async function writeJson (data, directory, docName) {
  const filePath = path.join(process.cwd(), directory, docName + '.json')
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

export function slugify (str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
  const to = 'aaaaaeeeeeiiiiooooouuuunc------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

export const clearUrl = (url) => {
  let parsed = url

  if (url !== undefined && ~url.indexOf('../')) parsed = url.split('../')[1]
  if (url !== undefined && ~url.indexOf(URLS.baseUrl)) parsed = url.split(URLS.baseUrl)[1]
  if (url !== undefined && ~url.indexOf(URLS.baseUrlSec)) parsed = url.split(URLS.baseUrlSec)[1]

  return parsed
}

export const URLS = {
  baseUrl: process.env.SCRAPPING_URL,
  baseUrlSec: process.env.SCRAPPING_URL_SEC,
  api: process.env.API_URL,
  countries: {
    es: process.env.SCRAPPING_URL + 'es/'
  }
}

// SCRAPING
const countries = () => {
  Object.keys(URLS.countries).map(async (el) => {
    const url = URLS.countries[el]
    const radios = await getCountryRadios(url)
    writeJson(radios, 'db/countries', el)

    return true
  })
}

const cities = () => {
  const cities = JSON.parse(readFileSync('./db/countries/es.json'))

  cities.forEach(async (city) => {
    const country = 'es'
    const cityRadios = await getCityRadios(city.slug, city.name, country)
    console.log(cityRadios)
    writeJson(cityRadios, `db/${country}`, city.slug)
  })
}

cities()
// console.log(await getLive('es/play/cope_valencia.htm'))
