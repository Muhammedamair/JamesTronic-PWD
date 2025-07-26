import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as jwt from "jsonwebtoken";

admin.initializeApp();
const db = admin.firestore();

// A "secret" for signing JWTs. In a real app, this should be stored
// securely in a secret manager.
const JWT_SECRET = "your-super-secret-key-that-is-long-and-random";

/**
 * Creates a user document in Firestore after mobile verification.
 * This function is triggered when a new Firebase Auth user is created.
 */
export const createProvisionalUser = functions.auth.user().onCreate(async (user) => {
  const { uid, phoneNumber } = user;
  if (!uid || !phoneNumber) {
    console.error("User created without UID or phone number.");
    return;
  }

  const userRef = db.collection("users").doc(uid);
  await userRef.set({
    mobileNumber: phoneNumber,
    status: "provisional",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});


/**
 * An HTTPS callable function to send an activation email.
 */
export const sendActivationEmail = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const email = data.email;

  if (!uid) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  if (!email || typeof email !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with a valid email address.");
  }

  // Generate a JWT token valid for 24 hours
  const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: "24h" });

  // In a real app, you would use a service like SendGrid or AWS SES here.
  // For this example, we will log the activation link to the console.
  const activationLink = `http://localhost:5173/activate?token=${token}`; // Adjust domain for production
  
  console.log(`Activation link for ${email}: ${activationLink}`);

  // Update the user's document with the email address
  await db.collection("users").doc(uid).update({ email });

  return { success: true, message: "Activation email sent (check logs)." };
});

/**
 * An HTTPS callable function to activate the user's account.
 */
export const activateAccount = functions.https.onCall(async (data, context) => {
  const token = data.token;

  if (!token || typeof token !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with a token.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string, email: string };
    const { uid } = decoded;

    // Update the user's status to "active"
    await db.collection("users").doc(uid).update({ status: "active" });

    return { success: true, message: "Account activated successfully." };
  } catch (error) {
    console.error("Invalid or expired token:", error);
    throw new functions.https.HttpsError("invalid-argument", "Invalid or expired activation token.");
  }
});
