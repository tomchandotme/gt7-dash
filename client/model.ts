type WheelData = {
  FrontLeft: number;
  FrontRight: number;
  RearLeft: number;
  RearRight: number;
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

type Vector3Rotation = {
  pitch: number;
  yaw: number;
  roll: number;
};

export type SimulatorPacket = {
  magic: 1194808112;
  position: Vector3;
  velocity: Vector3;
  rotation: Vector3Rotation;
  relativeOrientationToNorth: number;
  angularVelocity: Vector3;
  bodyHeight: number;
  engineRPM: number;
  gasLevel: number;
  gasCapacity: number;
  metersPerSecond: number;
  turboBoost: number;
  oilPressure: number;
  waterTemperature: number;
  oilTemperature: number;
  tireSurfaceTemperature: WheelData;
  packetId: number;
  lapCount: number;
  lapsInRace: number;
  bestLapTime: number;
  lastLapTime: number;
  timeOfDayProgression: number;
  preRaceStartPositionOrQualiPos: number;
  numCarsAtPreRace: number;
  minAlertRPM: number;
  maxAlertRPM: number;
  calculatedMaxSpeed: number;
  flags: number;
  currentGear: number;
  suggestedGear: number;
  throttle: number;
  brake: number;
  roadPlane: Vector3;
  roadPlaneDistance: number;
  wheelRevPerSecond: WheelData;
  tireTireRadius: WheelData;
  tireSusHeight: WheelData;
  clutchPedal: number;
  clutchEngagement: number;
  rpmFromClutchToGearbox: number;
  transmissionTopSpeed: number;
  gearRatios: number[];
  carCode: number;
};
