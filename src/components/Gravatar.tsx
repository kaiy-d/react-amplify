import React from 'react'
import { Image } from 'semantic-ui-react'
import md5 from 'md5'

/* eslint-disable react/prop-types */
const Gravatar = props => {
  // Generating email hash for the needs of the Gravatar
  const emailHash = md5(props.email.trim().toLowerCase(), {
    encoding: 'binary',
  })

  // d=mp - with this parameter, Gravatar will return default image in case user doesn't have
  const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=mp`

  return (
    <React.Fragment>
      <Image avatar src={gravatarImage} />
    </React.Fragment>
  )
}

export default Gravatar
