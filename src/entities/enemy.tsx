import React from 'react';
import { Image } from 'react-native';

class Enemy extends React.Component {
  
  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    return (
      <Image
        style={ {
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor: this.props.color,
          transform: [{
            rotate: '270deg',
          }]
        } }
        source={ require('assets/goose.jpeg') }
      />
    )
  }
}

export default Enemy;