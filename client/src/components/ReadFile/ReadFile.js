export function readFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".yk");

    input.addEventListener("change", (event) => {
      const fileInput = event.target;
      if (fileInput.files.length === 0) return;

      const selectedFile = fileInput.files[0];

      if (!isIYKYKFile(selectedFile.name)) {
        reject(new Error("Invalid IYKYK format."));
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const fileContent = e.target.result;
        resolve(fileContent);
      };

      fileReader.readAsText(selectedFile);
    });

    input.click();
  });
}

function isIYKYKFile(fileName) {
  return fileName.split(".").pop() === "yk";
}
