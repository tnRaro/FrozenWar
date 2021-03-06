import {Action, System, Component} from 'ecstasy';

/**
 * Represents health state of an entity.
 */
export class DamageComponent extends Component {
  constructor(options) {
    this.health = options.health | 0;
    this.maxHealth = options.maxHealth | 0;
    this.defense = options.defense | 0;
    // TODO fortify, buffs etc
  }
  isAlive() {
    return this.health > 0;
  }
  static get key() {
    return 'damage';
  }
}

/**
 * Heals entity health on init.
 */
export class InitHealthSystem extends System {
  constructor() {
    this.priority = 10000;
  }
  add(engine) {
    this.engine = engine;
    this.entities = engine.e('damage');
  }
  init() {
    this.entities.forEach(entity => {
      let damage = entity.c('damage');
      damage.health = damage.maxHealth;
    });
  }
  static get key() {
    return 'initHealth';
  }
}

/**
 * An action called upon death.
 */
export class DeathAction extends Action {
  run(engine) {
    if (this.player != null) throw new Error('Players cannot run this action');
    let damage = this.entity.c('damage');
    if (damage == null) {
      throw new Error('Entity does not have damage Component');
    }
    // TODO damage.isDead()
    if (damage.isAlive()) {
      throw new Error('Entity is still alive');
    }
    // Remove the entity from the map
    engine.removeEntity(this.entity);
    this.result = true;
  }
}
