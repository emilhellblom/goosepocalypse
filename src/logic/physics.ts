import Matter from "matter-js";
import constants from "constants";

const Physics = (entities, { touches, time }) => {
    let engine = entities.physics.engine;
    let enemy1 = entities.enemy1.body;
    let player = entities.player.body;

    touches.filter(t => t.type === "move").forEach(t => {
      if (player.position.x < constants.MAX_WIDTH - 50 && player.position.x > 50) {
        const newPosition = {
          x: player.position.x + t.delta.pageX,
          y: player.position.y,
        }
        Matter.Body.setPosition(player, newPosition)
      } else if (player.position.x < constants.MAX_WIDTH - 50) {
        const newPosition = {
          x: 51,
          y: player.position.y,
        }
        Matter.Body.setPosition(player, newPosition)
      } else {
        const newPosition = {
          x: constants.MAX_WIDTH - 51,
          y: player.position.y,
        }
        Matter.Body.setPosition(player, newPosition)
      }
    });

    if (enemy1.position.y > constants.MAX_HEIGHT) {
      const newPosition = {
        x: Math.random() * ((constants.MAX_WIDTH - 25) - 25) + 25,
        y: 0,
      }
      Matter.Body.setPosition(enemy1, newPosition);
    }

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;