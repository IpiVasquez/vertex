namespace Model {
  export interface User {
    email: string;
    profile: {
      name: string;
      lastName: string;
      image: string;
    };
    settings: {
      expiry: number;
      locale: string;
    };
  }

  export interface Team {
    players: number[];
    playerTwitters: string[];
    scores: number[][];
    code: number;
    points: number;
    name: string;
    shortName: string;
  }

  export interface FPlayer {
    history: {
      id: number;
      points: number;
      totalPoints: number;
      transfer: number;
      transferCost: number;
      benchPoints: number;
    };
    picks: {
      element: number;
      position: number;
      captain: boolean;
      viceCaptain: boolean;
      multiplier: number;
    }[];
  }

  export interface Fixture {
    gw: number;
    home: number;
    away: number;
    match: number;
  }

  export interface BootstrapStatic {
    teams: any[];
    events: {
      name: string;
      deadlineTime: number;
      deadlineFormatted: string;
      finished: boolean;
      current: boolean;
      next: boolean;
    }[];
    nextEvent: number;
  }
}
