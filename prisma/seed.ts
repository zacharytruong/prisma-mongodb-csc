import { PrismaClient } from '@prisma/client'
import {
  City,
  Country,
  Region,
  State,
  SubRegion
} from '../types/locations'

const prisma = new PrismaClient()

const API_BASE =
  'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/'

async function fetchData(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}.json`)
  return response.json()
}

async function main() {
  // Seed Regions
  console.log('seeding regions')
  const regions = (await fetchData('regions')) as Region[]
  for (const region of regions) {
    await prisma.region.upsert({
      where: {
        name: String(region.name)
      },
      update: {},
      create: {
        name: region.name,
        translations: region.translations,
        wikiDataId: region.wikiDataId
      }
    })
    console.log(`region ${region.name} added`)
  }
  console.log('finished seeding regions')

  // Seed Subregions
  console.log('seeding subregions')
  const subregions = (await fetchData('subregions')) as SubRegion[]
  for (const subregion of subregions) {
    if (subregion.region) {
      const region = await prisma.region.findUnique({
        where: { name: subregion.region }
      })
      if (region) {
        await prisma.subregion.upsert({
          where: {
            name: String(subregion.name)
          },
          update: {},
          create: {
            name: subregion.name,
            translations: subregion.translations,
            wikiDataId: subregion.wikiDataId,
            regionId: region.id
          }
        })
      }
    }
    console.log(`subregion ${subregion.name} added`)
  }
  console.log('finished seeding subregions')

  // Seed Countries
  console.log('seeding countries')
  const countries = (await fetchData('countries')) as Country[]
  for (const country of countries) {
    const region = country.region
      ? await prisma.region.findUnique({
          where: { name: String(country.region) }
        })
      : null
    const subregion = country.subregion
      ? await prisma.subregion.findUnique({
          where: { name: String(country.subregion) }
        })
      : null
    await prisma.country.upsert({
      where: {
        id: String(country.id)
      },
      update: {},
      create: {
        name: country.name,
        iso3: country.iso3,
        iso2: country.iso2,
        numericCode: country.numeric_code,
        phoneCode: country.phone_code,
        capital: country.capital,
        currency: country.currency,
        currencyName: country.currency_name,
        currencySymbol: country.currency_symbol,
        tld: country.tld,
        native: country.native,
        region: country.region || null,
        subregion: country.subregion || null,
        latitude: Number(country.latitude),
        longitude: Number(country.longitude),
        emoji: country.emoji,
        emojiU: country.emojiU,
        timezones: country.timezones,
        translations: country.translations,
        wikiDataId: country.wikiDataId,
        regionId: region?.id || null,
        subregionId: subregion?.id || null
      }
    })
    console.log(`country ${country.name} added`)
  }
  console.log('finished seeding countries')

  // Seed States
  console.log('seeding states')
  const states = (await fetchData('states')) as State[]
  for (const state of states) {
    const country = await prisma.country.findUnique({
      where: { iso2: String(state.country_code) }
    })
    if (country) {
      await prisma.state.upsert({
        where: { id: String(state.id) },
        update: {},
        create: {
          name: state.name,
          countryCode: state.country_code,
          fipsCode: state.fips_code,
          iso2: state.iso2,
          type: state.type,
          latitude: Number(state.latitude),
          longitude: Number(state.longitude),
          wikiDataId: state.wikiDataId,
          countryId: country.id
        }
      })
      console.log(`state ${state.name} added`)
    }
  }
  console.log('finished seeding states')

  // Seed Cities
  console.log('seeding cities')
  const cities = (await fetchData('cities')) as City[]
  for (const city of cities) {
    const state = await prisma.state.findFirst({
      where: {
        name: city.state_name,
        country: { iso2: city.country_code }
      }
    })
    const country = await prisma.country.findUnique({
      where: { iso2: city.country_code }
    })
    if (state && country) {
      await prisma.city.upsert({
        where: {
          id: String(city.id)
        },
        update: {},
        create: {
          name: city.name,
          stateCode: city.state_code,
          countryCode: city.country_code,
          latitude: Number(city.latitude),
          longitude: Number(city.longitude),
          wikiDataId: city.wikiDataId,
          stateId: state.id,
          countryId: country.id
        }
      })
      console.log(`city ${city.name} added`)
    }
  }
  console.log('finished seeding cities')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
