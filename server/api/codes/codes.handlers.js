import path from "path";
import { currentDir } from "../../sockets/sockets.utils.js";

export function handleDownloadSessionCode(req, res) {
  const curDir = currentDir(import.meta.url);
  try {
    const ykFile = path.join(
      curDir,
      `../../sessions/${req.params.sessionId}.yk`
    );
    res.download(ykFile);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}
