import Unauthorized from '@/components/unauthorized'
import React from 'react'

type Props = object

const Page = (props: Props) => {
  return <Unauthorized {...props} />
}

export default Page
