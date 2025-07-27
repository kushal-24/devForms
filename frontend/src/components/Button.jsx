import React from 'react'

function Button({
    children,
    type='button',
    bgColor='bg-blue-500',
    textColor='',
    className = '',
    ...props
}) {
  return (
    <button className={`px-4 py-2 rounded-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 ${className} ${textColor} ${bgColor}` }{...props}>
        {children}
    </button>
  )
}

export default Button