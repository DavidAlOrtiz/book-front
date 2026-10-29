export const MAX_PDF_BYTES = 10 * 1024 * 1024;

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1)); // quita "data:application/pdf;base64,"
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}