import Log from "../../shared/log/Log";
import { ZebraTagDecoder } from "./zebraTag/ZebraTagDecoder";

self.onmessage = (event) => {
  // WORKER SETUP
  let { id, payload } = event.data;
  function resolve(result: any) {
    self.postMessage({ id: id, payload: result });
  }
  function reject() {
    self.postMessage({ id: id });
  }

  // MAIN LOGIC

  // Run worker
  let log = new Log();
  let reader = new ZebraTagDecoder(payload[0]);

  try {
    reader.forEach((record) => {
      let key: string = record.getTeamName();
      let timestamp = record.getTimestamp();
      log.putNumberArray(key, timestamp, record.getRobotPosition());
    });
  } catch (exception) {
    console.error(exception);
    reject();
    return;
  }
  resolve(log.toSerialized());
};
