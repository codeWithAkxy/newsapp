import React, { Component } from 'react'
import spinner from '../Pinwheel.gif'

export class Loaders extends Component {
  render() {
    return (
      <div  className='text-center'>
       <img src={spinner} alt={spinner} />
      </div>
    )
  }
}

export default Loaders
