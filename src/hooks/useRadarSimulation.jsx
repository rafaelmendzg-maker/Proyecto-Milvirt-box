import { useState, useRef, useEffect, useCallback } from 'react'

export const useRadarSimulation = (canvasRef = null, initialSensitivity = 80) => {
  const [targets, setTargets] = useState([])
  const [nextId, setNextId] = useState(1)
  const [threatCount, setThreatCount] = useState(0)
  const [sensitivity, setSensitivity] = useState(initialSensitivity)
  const [alarmSilenced, setAlarmSilenced] = useState(false)
  const sweepAngle = useRef(0)
  const animationId = useRef(null)
  const lastUpdateTime = useRef(0)
  const intervalGen = useRef(null)

  const updateThreats = useCallback((currentTargets) => {
    const count = currentTargets.filter(t => t.isThreat).length
    setThreatCount(count)
    return count
  }, [])

  const addRandomTarget = useCallback((fromOperator = false) => {
    if (!fromOperator && Math.random() * 100 > sensitivity) return
    const angle = Math.random() * 360
    const distance = 40 + Math.random() * 110
    const speed = 0.6 + Math.random() * 2.2
    const isThreat = (distance < 50 && !fromOperator) || distance < 38
    setTargets(prev => {
      const newTarget = { id: nextId, distance, angleDeg: angle, speed, isThreat }
      const updated = [...prev, newTarget]
      if (updated.length > 24) updated.shift()
      setNextId(prevId => prevId + 1)
      updateThreats(updated)
      return updated
    })
  }, [sensitivity, nextId, updateThreats])

  const updateTargetPositions = useCallback(() => {
    setTargets(prev => {
      let anyThreat = false
      const updated = prev.map(t => {
        let distance = t.distance - t.speed * 0.45
        if (distance < 6) {
          if (!alarmSilenced && distance < 8) anyThreat = true
          if (distance <= 1.5) return null
        }
        const isThreat = distance < 38
        if (isThreat && !alarmSilenced) anyThreat = true
        return { ...t, distance, isThreat }
      }).filter(t => t !== null)
      if (anyThreat && !alarmSilenced) {
        const threatSpan = document.getElementById('threatCount')
        if (threatSpan && !threatSpan.classList.contains('blink-red')) {
          threatSpan.classList.add('blink-red')
          setTimeout(() => threatSpan.classList.remove('blink-red'), 800)
        }
      }
      updateThreats(updated)
      return updated
    })
  }, [alarmSilenced, updateThreats])

  const drawRadar = useCallback((ctx, canvas, targets, sweepAngleRad) => {
    if (!ctx || !canvas) return
    const w = canvas.width, h = canvas.height
    if (w === 0) return
    const cx = w/2, cy = h/2, rad = w/2 - 4
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#05180e'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#44cf9a'
    ctx.beginPath()
    ctx.arc(cx, cy, rad, 0, 2 * Math.PI)
    ctx.stroke()
    for (let r = rad/3; r <= rad; r += rad/3) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.strokeStyle = '#2e805e'
      ctx.stroke()
    }
    for (let ang = 0; ang < 360; ang += 45) {
      const radAng = ang * Math.PI / 180
      const x2 = cx + rad * Math.cos(radAng)
      const y2 = cy + rad * Math.sin(radAng)
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = '#2f6e53'
      ctx.stroke()
    }
    targets.forEach(t => {
      const radAngle = (t.angleDeg - 90) * Math.PI / 180
      const r = (t.distance / 150) * rad
      const x = cx + r * Math.cos(radAngle)
      const y = cy + r * Math.sin(radAngle)
      ctx.beginPath()
      ctx.fillStyle = t.isThreat ? '#ff8855' : '#66ffcc'
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(t.id, x + 4, y - 3)
    })
    const sweepRad = (sweepAngleRad - 90) * Math.PI / 180
    const ex = cx + rad * Math.cos(sweepRad)
    const ey = cy + rad * Math.sin(sweepRad)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(ex, ey)
    ctx.strokeStyle = '#f5ffbe'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.lineWidth = 1
  }, [])

  
  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const animate = (now) => {
      sweepAngle.current = (sweepAngle.current + 5) % 360
      if (!lastUpdateTime.current || now - lastUpdateTime.current > 550) {
        updateTargetPositions()
        lastUpdateTime.current = now
      }
      drawRadar(ctx, canvas, targets, sweepAngle.current)
      animationId.current = requestAnimationFrame(animate)
    }
    animationId.current = requestAnimationFrame(animate)
    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current)
    }
  }, [canvasRef, targets, drawRadar, updateTargetPositions])

  
  useEffect(() => {
    intervalGen.current = setInterval(() => {
      if (Math.random() < 0.5) addRandomTarget(false)
      if (targets.length < 6 && Math.random() < 0.4) addRandomTarget(false)
    }, 1900)
    return () => {
      if (intervalGen.current) clearInterval(intervalGen.current)
    }
  }, [addRandomTarget, targets.length])

  const simulateIncursion = useCallback(() => {
    const newTargets = []
    for (let i = 0; i < 3; i++) {
      newTargets.push({
        id: nextId + i,
        distance: 25 + Math.random() * 40,
        angleDeg: Math.random() * 360,
        speed: 1.9,
        isThreat: true
      })
    }
    setTargets(prev => {
      const updated = [...prev, ...newTargets]
      updateThreats(updated)
      return updated
    })
    setNextId(prev => prev + 3)
  }, [nextId, updateThreats])

  return {
    targets,
    threatCount,
    sensitivity,
    setSensitivity,
    alarmSilenced,
    setAlarmSilenced,
    addRandomTarget,
    simulateIncursion
  }
}