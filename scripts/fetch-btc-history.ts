import fs from 'fs'
import fetch from 'node-fetch'

async function main() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=30'
  )

  const data = await response.json() as [number, number, number, number, number][]


  const candles = data.map(([time, open, high, low, close]) => ({
    time: Math.floor(time / 1000), // seconds
    open,
    high,
    low,
    close,
  }))

  fs.writeFileSync('public/btc-history.json', JSON.stringify(candles, null, 2))
  console.log('✅ BTC history saved to public/btc-history.json')
}

main().catch((err) => {
  console.error('Error fetching BTC history:', err)
})
