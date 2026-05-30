import React, { useEffect, useState } from 'react'

const Metrics = () => {
  const [cpu, setCpu] = useState({ radar: 14, operator: 3, comms: 5 })
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu({
        radar: 12 + Math.floor(Math.random() * 6),
        operator: 2 + Math.floor(Math.random() * 5),
        comms: 4 + Math.floor(Math.random() * 4)
      })
    }, 3400)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="vm-metrics">
      <span> Radar (RT): CPU {cpu.radar}% | MEM 6%</span>
      <span> Operador: CPU {cpu.operator}% | MEM 12%</span>
      <span> Comms cifradas: CPU {cpu.comms}% | MEM 8%</span>
    </div>
  )
}

export default Metrics