import React, { useMemo } from 'react'

import CardShimmer from './CardShimmer'

const TimelineShimmer = () => {
  const cards = useMemo(() => Array(16).fill(1), [])
  return (
    <div className="ultrawide:grid-cols-6 laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-2 md:gap-y-8 2xl:grid-cols-5">
      {cards.map((i, idx) => (
        <CardShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export default TimelineShimmer
