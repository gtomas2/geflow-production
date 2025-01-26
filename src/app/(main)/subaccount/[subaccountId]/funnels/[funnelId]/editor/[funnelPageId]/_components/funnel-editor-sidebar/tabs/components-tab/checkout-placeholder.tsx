import Image from 'next/image'
import React from 'react'

const CheckoutPlaceholder = () => {
  const handleDragStart = (e: React.DragEvent, type: 'paymentForm') => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, 'paymentForm')}
      className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <Image
        src="/stripelogo.png"
        height={40}
        width={40}
        alt="stripe logo"
        className="object-cover"
      />
    </div>
  )
}

export default CheckoutPlaceholder
