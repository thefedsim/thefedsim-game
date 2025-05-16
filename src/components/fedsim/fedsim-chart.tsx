'use client'

import { useEffect, useRef } from 'react'
import {
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  CandlestickSeries,
} from 'lightweight-charts'

export function FedSimChart({ data }: { data: CandlestickData[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.offsetWidth,
      height: 300,
      layout: {
        background: { color: '#0f0f0f' },
        textColor: '#ccc',
      },
      grid: {
        vertLines: { color: '#1f1f1f' },
        horzLines: { color: '#1f1f1f' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    })

    chart.priceScale('right').applyOptions({
      autoScale: true,
      scaleMargins: {
        top: 0.2,
        bottom: 0.1,
      },
    })

    chartRef.current = chart
    seriesRef.current = chart.addSeries(CandlestickSeries, {
      title: 'BTC/USD',
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => price.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      },
    })
    
    seriesRef.current.setData(data)
    chart.timeScale().fitContent()

    return () => {
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data)
      chartRef.current?.timeScale().fitContent()
    }
  }, [data])

  return <div ref={containerRef} className="w-full h-[300px]" />
}
