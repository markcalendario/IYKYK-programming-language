import path from "path";
import { currentDir } from "../../sockets/sockets.utils.js";

export function handleDownloadSessionCode(req, res) {
  const curDir = currentDir(import.meta.url);
  const ykFile = path.join(curDir, `../../sessions/${req.params.sessionId}.yk`);
  res.download(ykFile);
}
