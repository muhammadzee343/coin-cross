import * as React from "react"
const DetailIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <g
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        mixBlendMode: "soft-light",
      }}
    >
      <path
        strokeWidth={1.125}
        d="M9 1.5C4.875 1.5 1.5 4.875 1.5 9s3.375 7.5 7.5 7.5 7.5-3.375 7.5-7.5S13.125 1.5 9 1.5ZM9 12V8.25"
      />
      <path strokeWidth={1.5} d="M9.004 6h-.007" />
    </g>
  </svg>
)
export default DetailIcon
