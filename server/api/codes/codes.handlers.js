import path from "path";
import {
  currentDir,
  doesSessionFileExist
} from "../../sockets/sockets.utils.js";

export async function handleDownloadSessionCode(req, res) {
  if (!(await doesSessionFileExist(req.params.sessionId))) {
    return res.status(404).send({ success: false, message: "File not found." });
  }

  const curDir = currentDir(import.meta.url);
  const ykFile = path.join(curDir, `../../sessions/${req.params.sessionId}.yk`);
  await res.download(ykFile);
}
