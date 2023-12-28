import path from "path";
import { doesSessionFileExist } from "../../sockets/sockets.utils.js";

export async function handleDownloadSessionCode(req, res) {
  if (!(await doesSessionFileExist(req.session.id))) {
    return res.status(404).send({ success: false, message: "File not found." });
  }

  const curDir = currentDir(import.meta.url);
  const ykFile = path.join(curDir, `../../sessions/${req.params.sessionId}.yk`);
  await res.download(ykFile);
}
