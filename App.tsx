import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';
import Constants from 'constants';
import Player from 'entities/player';
import Enemy from 'entities/enemy';
import Physics from 'logic/physics';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      running: false,
      preMode: true,
      second: 0,
      interval: null,
      gameOver: false,
    }
  
    this.gameEngine = null;
    this.entities = null;
    // this.interval = null;
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;
    let enemy1 = Matter.Bodies.rectangle( Math.random() * ((Constants.MAX_WIDTH - 25) - 25) + 25, 0, 50, 50);
    // let award2 = Matter.Bodies.rectangle( Math.random() * ((Constants.MAX_WIDTH - 25) - 25) + 25, 0, 50, 50);
    // let award3 = Matter.Bodies.rectangle( Math.random() * ((Constants.MAX_WIDTH - 25) - 25) + 25, 0, 50, 50);
    // let award4 = Matter.Bodies.rectangle( Math.random() * ((Constants.MAX_WIDTH - 25) - 25) + 25, 0, 50, 50);
    let player = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 75, 50, 50, { isStatic: true });
    // let floor = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 50, { isSensor: true });
    Matter.World.add(world, [enemy1, player]);

    Matter.Events.on(engine, 'collisionActive', (event) => {
      const pairs = event.pairs;
      console.log(event)
      const newPosition = {
        y: 0,
        x: Math.random() * ((Constants.MAX_WIDTH - 25) - 25) + 25,
      }

      Matter.Body.setPosition( enemy1, newPosition);
      this.gameEngine.dispatch({ type: "game-over"});  
    });

    this.state.interval = setInterval(() => {
      this.setState({
        second: this.state.second + 1,
      })
    }, 1000);

    return {
      physics: { engine, world },
      enemy1: { body: enemy1, size: [75, 50], color: 'red', renderer: Enemy },
      // award2: { body: award2, size: [50, 50], color: 'purple', renderer: Award },
      // award3: { body: award3, size: [50, 50], color: 'pink', renderer: Award },
      // award4: { body: award4, size: [50, 50], color: 'orange', renderer: Award },
      player: { body: player, size: [50, 50], color: 'blue', renderer: Player },
      // floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: 'green', renderer: Wall },
    }
  }

  onEvent = (e) => {
    if (e.type === 'game-over') {
      this.setState({ running: false, gameOver: true })
      clearInterval(this.state.interval)
    }
  }

  onStart = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      preMode: false,
    });
  }

  onReset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      gameOver: false,
      second: 0,
    });
  }
  render() {
    console.log(this.state.second)
    return (
      <View style={styles.container}>
        { !this.state.gameOver && !this.state.preMode && <View>
          <Text style={ {
            fontSize: 160,
            opacity: 0.6,
          } }>{ this.state.second }</Text>
        </View> }
        <GameEngine
          ref={(ref) => { this.gameEngine = ref }}
          style={ styles.gameContainer }
          running={ this.state.running }
          entities={ this.entities }
          onEvent={this.onEvent}
          systems={[Physics]}>
          <StatusBar hidden={ true } />
        </GameEngine>
        { this.state.gameOver &&
          <View style={ {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          } }>
            <Text style={ {
              fontSize: 30,
              fontWeight: 'bold',
              color: 'white',
            } }>
              GAME OVER
            </Text>
            <Text style={ {
              fontSize: 24,              
              color: 'white',
            } }>
              { `Score: ${ this.state.second }` }
            </Text>
            <View style={ { height: 20 } }/>
            <TouchableOpacity onPress={ this.onReset }>
              <View style={ {
                borderColor: 'white',
                backgroundColor: 'gray',
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 5,
                paddingHorizontal: 10,
              } }>
                <Text style={ {
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: 'white',
                } }>
                  Start new game
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        }
        { this.state.preMode &&
          <View style={ {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          } }>
            <Text style={ {
              fontSize: 30,
              fontWeight: 'bold',
              color: 'white',
            } }>
              Goosepocalypse
            </Text>
            <View style={ { height: 20 } }/>
            <TouchableOpacity onPress={ this.onStart }>
              <View style={ {
                borderColor: 'white',
                backgroundColor: 'gray',
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 5,
                paddingHorizontal: 10,
              } }>
                <Text style={ {
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: 'white',
                } }>
                  Start game
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
