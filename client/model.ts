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

enum Flags {
  None = 0,

  /// The car is on the track or paddock, with data available.
  CarOnTrack = 1 << 0,

  /// The game's simulation is paused.
  /// Note: The simulation will not be paused while in the pause menu in online modes.
  Paused = 1 << 1,

  /// Track or car is currently being loaded onto the track.
  LoadingOrProcessing = 1 << 2,

  /// Needs more investigation
  InGear = 1 << 3,

  /// Current car has a Turbo.
  HasTurbo = 1 << 4,

  /// Rev Limiting is active.
  RevLimiterBlinkAlertActive = 1 << 5,

  /// Hand Brake is active.
  HandBrakeActive = 1 << 6,

  /// Lights are active.
  LightsActive = 1 << 7,

  /// High Beams are turned on.
  HighBeamActive = 1 << 8,

  /// Low Beams are turned on.
  LowBeamActive = 1 << 9,

  /// ASM is active.
  ASMActive = 1 << 10,

  /// Traction Control is active.
  TCSActive = 1 << 11,
}

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
  flags: Flags;
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
