import { useEffect, useRef } from 'react'
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function CandlestickChart({ ohlcData, indicatorData, activeIndicators, height = 420 }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef({})

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: { background: { color: '#161b26' }, textColor: '#e2e8f0' },
      grid: { vertLines: { color: '#2a2f3e' }, horzLines: { color: '#2a2f3e' } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#2a2f3e' },
      timeScale: { borderColor: '#2a2f3e', timeVisible: true, secondsVisible: false },
    })
    chartRef.current = chart

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      borderVisible: false,
    })
    seriesRef.current.candles = candleSeries

    const volSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'vol',
      color: '#3b82f620',
    })
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })
    seriesRef.current.volume = volSeries

    const indicatorConfigs = {
      sma20: { color: '#3b82f6', lineWidth: 1.5, title: 'SMA 20' },
      sma50: { color: '#f97316', lineWidth: 1.5, title: 'SMA 50' },
      ema20: { color: '#a855f7', lineWidth: 1.5, title: 'EMA 20' },
      bbUpper: { color: '#6b7280', lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'BB Upper' },
      bbMiddle: { color: '#6b7280', lineWidth: 1, title: 'BB Mid' },
      bbLower: { color: '#6b7280', lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'BB Lower' },
    }
    Object.entries(indicatorConfigs).forEach(([key, opts]) => {
      seriesRef.current[key] = chart.addLineSeries({ ...opts, lastValueVisible: false, priceLineVisible: false })
    })

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)

    return () => { ro.disconnect(); chart.remove() }
  }, [height])

  useEffect(() => {
    if (!ohlcData?.length || !seriesRef.current.candles) return
    seriesRef.current.candles.setData(ohlcData)
    seriesRef.current.volume.setData(
      ohlcData.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? '#22c55e33' : '#ef444433' }))
    )
    chartRef.current?.timeScale().fitContent()
  }, [ohlcData])

  useEffect(() => {
    if (!indicatorData) return

    const show = (key, seriesKey, data) => {
      seriesRef.current[seriesKey]?.setData(activeIndicators.includes(key) ? (data || []) : [])
    }

    show('sma20', 'sma20', indicatorData.sma_20)
    show('sma50', 'sma50', indicatorData.sma_50)
    show('ema20', 'ema20', indicatorData.ema_20)
    show('bb', 'bbUpper', indicatorData.bb?.upper)
    show('bb', 'bbMiddle', indicatorData.bb?.middle)
    show('bb', 'bbLower', indicatorData.bb?.lower)
  }, [indicatorData, activeIndicators])

  if (!ohlcData) return <LoadingSpinner center />
  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" style={{ height }} />
}
