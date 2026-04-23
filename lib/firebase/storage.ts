import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadResult,
} from "firebase/storage";
import { getFirebaseStorage } from "./config";

export type StoredFile = {
  storagePath: string;
  fileUrl: string;
  fileName: string;
  sizeBytes: number;
};

/**
 * Upload a single file and return metadata suitable for persisting in the
 * `Document` table.
 *
 * `pathPrefix` should be namespace-style, e.g. `participants/<id>` or
 * `intake/<sessionId>`. See `storage.rules` for allowed paths.
 */
export async function uploadFile(
  file: File,
  pathPrefix: string
): Promise<StoredFile> {
  const storage = getFirebaseStorage();
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const storagePath = `${pathPrefix}/${Date.now()}-${safeName}`;
  const objectRef = ref(storage, storagePath);
  const result: UploadResult = await uploadBytes(objectRef, file, {
    contentType: file.type || undefined,
  });
  const fileUrl = await getDownloadURL(result.ref);
  return {
    storagePath,
    fileUrl,
    fileName: file.name,
    sizeBytes: file.size,
  };
}

export async function removeFile(storagePath: string): Promise<void> {
  const storage = getFirebaseStorage();
  await deleteObject(ref(storage, storagePath));
}
