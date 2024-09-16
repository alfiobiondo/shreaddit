import * as functions from 'firebase-functions/v1'; // Import Firebase Functions v1
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Cloud function to create a user document on user creation
export const createUserDocument = functions.auth
	.user()
	.onCreate(async (user: admin.auth.UserRecord) => {
		// Convert the user object to JSON and store it in Firestore
		await db
			.collection('users')
			.doc(user.uid)
			.set(JSON.parse(JSON.stringify(user)));
	});
