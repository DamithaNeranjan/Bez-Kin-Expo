import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";
import { resizeImageToWebP } from "../utils/image";

export async function uploadImage(file: File, path: string) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured yet.");
  }

  const webp = await resizeImageToWebP(file);
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, webp, { contentType: "image/webp" });
  return getDownloadURL(fileRef);
}
