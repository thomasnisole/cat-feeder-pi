import { Gpio } from 'pigpio';
import { Injectable } from '@nestjs/common';

export enum GPIOState {
  HIGH = 1,
  LOW = 0
}

export enum GPIODirection {
  OUTPUT = Gpio.OUTPUT,
  INPUT = Gpio.INPUT
}

@Injectable()
export class GPIOService {

  public outputs: Gpio[];

  public inputs: Gpio[];

  public constructor() {
    this.outputs = [];
    this.inputs = [];
  }

  public setup(pin: number, direction: GPIODirection): void {
    const gpio: Gpio = new Gpio(
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
    return null;
    if (!this.inputs[pin]) {
      throw new Error('No input GPIO initialized for pin ' + pin);
    }

    return this.inputs[pin].digitalRead();
  }
}
