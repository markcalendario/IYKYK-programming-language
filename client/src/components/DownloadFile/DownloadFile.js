export async function download(url) {
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", true);

  link.click();
  link.remove(link);
}
