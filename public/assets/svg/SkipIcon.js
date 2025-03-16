import * as React from "react";
const SkipCoinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <defs>
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
      stroke="#9a2d2e"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.688}
      filter="url(#glow)"
      d="M17.262 2.75h-6.524c-.765 0-1.845.45-2.386.99L3.74 8.353c-.54.54-.99 1.62-.99 2.385v6.524c0 .765.45 1.846.99 2.386l4.612 4.612c.54.54 1.62.99 2.386.99h6.524c.765 0 1.846-.45 2.386-.99l4.612-4.613c.54-.54.99-1.62.99-2.384v-6.526c0-.764-.45-1.844-.99-2.384L19.647 3.74c-.54-.54-1.62-.99-2.384-.99ZM10.063 17.938l7.874-7.875M17.938 17.938l-7.875-7.875"
    />
  </svg>
);
export default SkipCoinIcon;
