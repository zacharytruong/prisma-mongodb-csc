import { Prisma } from '@prisma/client'

export interface Region {
  id: string
  name: string
  translations?: Prisma.JsonValue
  wikiDataId?: string
}

export interface SubRegion {
  id: string
  name: string
  region_id: number
  region?: string
  translations?: Prisma.JsonValue
  wikiDataId?: string
}

export interface Country {
  id: string
  name: string
  iso3: string
  iso2: string
  numeric_code?: string
  phone_code?: string
  capital?: string
  currency?: string
  currency_name?: string
  currency_symbol?: string
  tld?: string
  native?: string
  region?: string
  region_id?: string
  subregion?: string
  subregion_id?: string
  nationality: string
  timezones?: Prisma.JsonValue
  translations?: Prisma.JsonValue
  latitude?: string
  longitude?: string
  emoji?: string
  emojiU?: string
  wikiDataId?: string
}

export interface State {
  id: string
  name: string
  country_id: number
  country_code: string
  country_name: string
  state_code: string
  type?: string
  latitude?: string
  longitude?: string
  fips_code?: string
  iso2?: string
  wikiDataId?: string
}

export interface City {
  id: string
  name: string
  state_name: string
  state_code: string
  country_code: string
  latitude: number
  longitude: number
  wikiDataId?: string
  createdAt: Date
  updatedAt: Date
  stateId: string
  countryId: string
  state: State
  country: Country
}
