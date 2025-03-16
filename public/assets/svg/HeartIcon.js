import * as React from "react"
const HeartIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--background-green)" />
        <stop offset="100%" stopColor="var(--background-green)" />
      </linearGradient>
      
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="blur" in2="SourceGraphic" operator="out" result="glowOut" />
        <feFlood floodColor="black" result="glowColor" />
        <feComposite in="glowColor" in2="glowOut" operator="in" result="softGlow" />
        <feMerge>
          <feMergeNode in="softGlow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path
      stroke="#78f765"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.688}
      filter="url(#glow)"
      d="M14.697 23.911c-.382.135-1.012.135-1.394 0C10.04 22.797 2.75 18.151 2.75 10.276c0-3.476 2.801-6.289 6.255-6.289 2.047 0 3.859.99 4.995 2.52a6.22 6.22 0 0 1 4.995-2.52c3.454 0 6.255 2.813 6.255 6.29 0 7.874-7.29 12.52-10.553 13.634Z"
    />
  </svg>
)
export default HeartIcon
