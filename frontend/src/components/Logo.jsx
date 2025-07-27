import React from 'react'
import img from '../assets/img.svg'

const Logo = ({width='100px', className=" "}) => {
  return (
    <div><img src={img} className={`border border-neutral-950 border-solid rounded-full ${className}`}></img></div>
  )
}

export default Logo