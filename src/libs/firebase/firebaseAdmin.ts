import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString(
        "ascii"
    )
);

const adminApp = getApps().length
    ? getApps()[0]
    : initializeApp({
          credential: cert(serviceAccount),
          storageBucket: "<BUCKET_NAME>.appspot.com",
      });

const auth = getAuth(adminApp);
const db = getFirestore(adminApp);
const bucket = getStorage(adminApp).bucket();

export { auth, db, bucket };
