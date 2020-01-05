import { Injectable } from '@nestjs/common';
import { GPIODirection, GPIOService, GPIOState } from '../../system/service/gpio.service';

enum StepperDirection {
  BACKWARD = 0,
  FORWARD = 1
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Injectable()
export class StepperService {

  private stepCount: number;

  private in1: number;

  private in2: number;

  private in3: number;

  private in4: number;

  private currentStep: number = 0;

  private direction: StepperDirection = StepperDirection.FORWARD;

  private stepDelay: number;

  public constructor(private gpioService: GPIOService) {}

  public initialize(stepCount: number, in1: number, in2: number, in3: number, in4: number): void {
    this.stepCount = stepCount;
    this.in1 = in1;
    this.in2 = in2;
    this.in3 = in3;
    this.in4 = in4;

    this.gpioService.setup(this.in1, GPIODirection.OUTPUT);
    this.gpioService.output(this.in1, GPIOState.LOW);
    this.gpioService.setup(this.in2, GPIODirection.OUTPUT);
    this.gpioService.output(this.in2, GPIOState.LOW);
    this.gpioService.setup(this.in3, GPIODirection.OUTPUT);
    this.gpioService.output(this.in3, GPIOState.LOW);
    this.gpioService.setup(this.in4, GPIODirection.OUTPUT);
    this.gpioService.output(this.in4, GPIOState.LOW);
  }

  public setSpeed(speed: number): void {
    this.stepDelay = 60 * 1000 / this.stepCount / speed;
  }

  public async steps(steps: number): Promise<void> {
    if (!this.stepCount || !this.in1 || !this.in2 || !this.in3 || !this.in4) {
      throw new Error('Stepper service is\'nt initialized');
    }

    let stepsLeft: number = Math.abs(steps);
    if (steps > 0) {
      this.direction = StepperDirection.FORWARD;
    }
    if (steps < 0) {
      this.direction = StepperDirection.BACKWARD;
    }

    while (stepsLeft > 0) {
      await sleep(this.stepDelay);
      if (this.direction === StepperDirection.FORWARD) {
        this.currentStep++;
        if (this.currentStep === this.stepCount) {
          this.currentStep = 0;
        }
      } else {
        if (this.currentStep === 0) {
          this.currentStep = this.stepCount;
        }
        this.currentStep--;
      }
      stepsLeft--;
      switch (this.currentStep % 4) {
        case 0:
          this.gpioService.output(this.in1, GPIOState.HIGH);
          this.gpioService.output(this.in2, GPIOState.LOW);
          this.gpioService.output(this.in3, GPIOState.HIGH);
          this.gpioService.output(this.in4, GPIOState.LOW);
          break;

        case 1:
          this.gpioService.output(this.in1, GPIOState.LOW);
          this.gpioService.output(this.in2, GPIOState.HIGH);
          this.gpioService.output(this.in3, GPIOState.HIGH);
          this.gpioService.output(this.in4, GPIOState.LOW);
          break;

        case 2:
          this.gpioService.output(this.in1, GPIOState.LOW);
          this.gpioService.output(this.in2, GPIOState.HIGH);
          this.gpioService.output(this.in3, GPIOState.LOW);
          this.gpioService.output(this.in4, GPIOState.HIGH);
          break;

        case 3:
          this.gpioService.output(this.in1, GPIOState.HIGH);
          this.gpioService.output(this.in2, GPIOState.LOW);
          this.gpioService.output(this.in3, GPIOState.LOW);
          this.gpioService.output(this.in4, GPIOState.HIGH);
          break;
      }
    }

    this.gpioService.output(this.in1, GPIOState.LOW);
    this.gpioService.output(this.in2, GPIOState.LOW);
    this.gpioService.output(this.in3, GPIOState.LOW);
    this.gpioService.output(this.in4, GPIOState.LOW);
  }
}
