import {Injectable} from '@nestjs/common';

const args: string[] = process.argv.slice(2);
const Gpio: any = require(args[0] === '--dev' ? 'pigpio-mock' : 'pigpio').Gpio;

if (args[0] === '--dev') {
  process.env.PIGPIO_NO_LOGGING = 'true';
}

export enum GPIOState {
  HIGH = Gpio.HIGH,
  LOW = Gpio.LOW
}

export enum GPIODirection {
  OUTPUT = Gpio.OUTPUT,
  INPUT = Gpio.INPUT
}

@Injectable()
export class GPIOService {

  public outputs: typeof Gpio[];

  public inputs: typeof Gpio[];

  public constructor() {
    this.outputs = [];
    this.inputs = [];
  }

  public setup(pin: number, direction: GPIODirection): void {
    const gpio: typeof Gpio = new Gpio(
      pin,
      {
        mode: direction
      }
    );

    switch (direction) {
      case GPIODirection.INPUT:
        this.inputs[pin] = gpio;
        break;

      case GPIODirection.OUTPUT:
        this.outputs[pin] = gpio;
        break;
    }
  }

  public output(pin: number, state: GPIOState): void {
    if (!this.outputs[pin]) {
      throw new Error('No output GPIO initialized for pin ' + pin);
    }

    this.outputs[pin].digitalWrite(state);
  }

  public input(pin: number): GPIOState {
    if (!this.inputs[pin]) {
      throw new Error('No input GPIO initialized for pin ' + pin);
    }

    return this.inputs[pin].digitalRead();
  }
}
