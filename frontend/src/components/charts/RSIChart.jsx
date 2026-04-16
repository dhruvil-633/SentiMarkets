import { useEffect, useRef } from 'react'
import { createChart, LineStyle } from 'lightweight-charts'

export default function RSIChart({ rsiData, height = 120 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: { background: { color: '#161b26' }, textColor: '#e2e8f0' },
      grid: { vertLines: { color: '#2a2f3e' }, horzLines: { color: '#2a2f3e' } },
      rightPriceScale: { borderColor: '#2a2f3e', scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderColor: '#2a2f3e', timeVisible: true },
    })

    const rsiLine = chart.addLineSeries({ color: '#eab308', lineWidth: 1.5, lastValueVisible: true, title: 'RSI 14' })
    const ob = chart.addLineSeries({ color: '#ef444450', lineWidth: 1, lineStyle: LineStyle.Dashed, lastValueVisible: false, priceLineVisible: false })
    const os = chart.addLineSeries({ color: '#22c55e50', lineWidth: 1, lineStyle: LineStyle.Dashed, lastValueVisible: false, priceLineVisible: false })

    if (rsiData?.length) {
      rsiLine.setData(rsiData)
      const t0 = rsiData[0].time, t1 = rsiData[rsiData.length - 1].time
      ob.setData([{ time: t0, value: 70 }, { time: t1, value: 70 }])
      os.setData([{ time: t0, value: 30 }, { time: t1, value: 30 }])
      chart.timeScale().fitContent()
    }

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)
    return () => { ro.disconnect(); chart.remove() }
  }, [rsiData, height])

  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" style={{ height }} />
}
