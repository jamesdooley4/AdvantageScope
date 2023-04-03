/** A record in the zebra tag log. */
export class ZebraTagDecoderRecord {
  private eventKey: string;
  private timestamp: number;
  private teamName: string;
  private robotPosition: number[];

  /**
   * Creates a new ZebraTagDecoderRecord.
   * @param eventKey The event key
   * @param timestamp The timestamp in seconds
   * @param teamName The team name
   * @param robotPosition: The robot position [x,y]
   */
  constructor(eventKey: string, timestamp: number, teamName: string, robotPosition: number[]) {
    this.eventKey = eventKey;
    this.timestamp = timestamp;
    this.teamName = teamName;
    this.robotPosition = robotPosition;
  }

  /** Gets the event key. */
  getEventKey(): string {
    return this.eventKey;
  }

  /** Gets the record timestamp. */
  getTimestamp(): number {
    return this.timestamp;
  }

  /** Gets the team number. */
  getTeamName(): string {
    return this.teamName;
  }

  /** Gets the robot position. */
  getRobotPosition(): number[] {
    return this.robotPosition;
  }
}

/** WPILOG decoder. */
export class ZebraTagDecoder {
  private data: any;

  constructor(data: Uint8Array) {
    const decoder = new TextDecoder("utf-8");
    this.data = JSON.parse(decoder.decode(data));
  }

  /** Returns true if the data has the expected fields. */
  isValid(): boolean {
    return (
      this.data.key != null &&
      this.data.times != null &&
      this.data.alliances != null &&
      this.data.alliances.blue != null &&
      this.data.alliances.red != null
    );
  }

  /** Runs the specified function for each record in the log. */
  forEach(callback: (record: ZebraTagDecoderRecord) => void) {
    if (!this.isValid()) throw "Log is not valid";
    let index: number = 0;
    let eventKey: string = this.data.key;
    for (let timestamp of this.data.times) {
      for (let team of this.data.alliances.red) {
        let robotPosition: number[] = [team.xs[index], team.ys[index]];
        callback(new ZebraTagDecoderRecord(eventKey, timestamp, team.team_key, robotPosition));
      }

      for (let team of this.data.alliances.blue) {
        let robotPosition: number[] = [team.xs[index], team.ys[index]];
        callback(new ZebraTagDecoderRecord(eventKey, timestamp, team.team_key, robotPosition));
      }
      index++;
    }
  }
}
