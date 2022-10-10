import countryCodes from './country-codes.json'

export default function findCountryCode(country: string) {
  return Object.entries(countryCodes).find(([_code, aliases]) => (
    aliases.includes(country)
  ))?.[0]
}
