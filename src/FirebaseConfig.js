// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion, query, collection, where, getDocs, deleteDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './firebase.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export async function checkCredentials(username, password) {
    try {
      const userDocRef = doc(db, 'users', username);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        return false; // User not found
      }
  
      const user = userDoc.data();
      return user.password === password; // Returns true if password matches, false otherwise
    } catch (error) {
      console.error("Error checking credentials:", error);
      return false; // Return false in case of any errors
    }
  }

  export async function createExcusalRequest(loggedInUsername, excusalName, event, date, reason, reasonDetails, comments) {
    try {
      // Create or overwrite a document in the 'excusals' collection
      const excusalRef = doc(db, 'excusals', excusalName);
      await setDoc(excusalRef, {
        username: loggedInUsername,
        event: event,
        date: date,
        reason: reason,
        reasonDetails: reasonDetails,
        comments: comments,
        status: "submitted"
      });
  
      // Update the user's document in the 'users' collection
      const userRef = doc(db, 'users', loggedInUsername);
      await updateDoc(userRef, {
        ownExcusals: arrayUnion(excusalName)
      });
  
      // Fetch the COC person's username from the current user's document
      const currentUserDoc = await getDoc(userRef);
      if (currentUserDoc.exists()) {
        const currentUserData = currentUserDoc.data();
        const cocPersonUsername = currentUserData.coc;
  
        if (cocPersonUsername) {
          // Update the COC person's document in the 'users' collection
          const cocPersonRef = doc(db, 'users', cocPersonUsername);
          await updateDoc(cocPersonRef, {
            otherExcusals: arrayUnion(excusalName)
          });
        }
      }
  
      console.log("Excusal request created and both user's ownExcusals and COC person's otherExcusals updated");
    } catch (error) {
      console.error("Error creating excusal request:", error);
    }
  }

  export const fetchOwnExcusals = async (loggedInUsername) => {
    try {
        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const ownExcusals = userData.ownExcusals || [];

            // Fetch each excusal details
            const excusalDetails = await Promise.all(ownExcusals.map(async (excusalName) => {
                const excusalRef = doc(db, 'excusals', excusalName);
                const excusalDoc = await getDoc(excusalRef);

                return excusalDoc.exists() ? { id: excusalDoc.id, ...excusalDoc.data() } : null;
            }));
            console.log(excusalDetails);

            return excusalDetails.filter(e => e); // Filter out any null values
        }
    } catch (error) {
        console.error("Error fetching excusals:", error);
    }
};

export const fetchOtherExcusals = async (loggedInUsername) => {
    try {
        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const otherExcusals = userData.otherExcusals || [];

            // Fetch each excusal details
            const excusalDetails = await Promise.all(otherExcusals.map(async (excusalName) => {
                const excusalRef = doc(db, 'excusals', excusalName);
                const excusalDoc = await getDoc(excusalRef);

                return excusalDoc.exists() ? { id: excusalDoc.id, ...excusalDoc.data() } : null;
            }));
            console.log(excusalDetails);

            return excusalDetails.filter(e => e); // Filter out any null values
        }
    } catch (error) {
        console.error("Error fetching excusals:", error);
    }
};


export async function fetchExcusalInformation(excusalId) {
    try {
        const excusalRef = doc(db, 'excusals', excusalId);
        const excusalDoc = await getDoc(excusalRef);

        if (excusalDoc.exists()) {
            return { id: excusalDoc.id, ...excusalDoc.data() }; // Return the excusal object
        } else {
            console.log('No such excusal found!');
            return null; // Return null if no excusal is found
        }
    } catch (error) {
        console.error("Error fetching excusal information:", error);
        throw error; // You might want to handle this error more gracefully
    }
}

export async function sendExcusalUp(loggedInUsername, excusalId) {
    try {
        // Reference to the logged-in user's document
        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Remove the excusalId from the user's otherExcusals
            await updateDoc(userRef, {
                otherExcusals: arrayRemove(excusalId)
            });

            // Get the COC from the user's document
            const cocUsername = userDoc.data().coc;
            if (cocUsername) {
                // Reference to the COC's document
                const cocRef = doc(db, 'users', cocUsername);

                // Add the excusalId to the COC's otherExcusals
                await updateDoc(cocRef, {
                    otherExcusals: arrayUnion(excusalId)
                });
            } else {
                console.log("COC not found for user", loggedInUsername);
            }
        } else {
            console.log("User document not found:", loggedInUsername);
        }
    } catch (error) {
        console.error("Error updating excusal in COC:", error);
        throw error;
    }
}

export async function approveExcusal(loggedInUsername, excusalId) {
    try {
        // Reference to the excusal document
        const excusalRef = doc(db, 'excusals', excusalId);

        // Update the status of the excusal
        await updateDoc(excusalRef, {
            status: "approved"
        });

        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Remove the excusalId from the user's otherExcusals
            await updateDoc(userRef, {
                otherExcusals: arrayRemove(excusalId)
            });
        } else {
            console.log("User document not found:", loggedInUsername);
        }

        console.log("Excusal approved:", excusalId);
    } catch (error) {
        console.error("Error accepting excusal:", error);
        throw error; // Depending on your error handling strategy
    }
}

export async function rejectExcusal(excusalId) {
    try {
        // Reference to the excusal document
        const excusalRef = doc(db, 'excusals', excusalId);

        // Update the status of the excusal
        await updateDoc(excusalRef, {
            status: "rejected"
        });

        console.log("Excusal rejected:", excusalId);
    } catch (error) {
        console.error("Error rejecting excusal:", error);
        throw error; // Depending on your error handling strategy
    }
}

export const fetchApprovedExcusals = async () => {
    try {
        const q = query(collection(db, "excusals"), where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        const excusals = [];

        querySnapshot.forEach((doc) => {
            excusals.push({ id: doc.id, ...doc.data() });
        });

        return excusals;
    } catch (error) {
        console.error("Error fetching approved excusals:", error);
    }
};

export const fetchUserNames = async () => {
    const usersRef = collection(db, "users");
    try {
      const snapshot = await getDocs(usersRef);
      const userNames = snapshot.docs.map(doc => ({
        id: doc.id, // The document name (usually the user's username or UID)
        ...doc.data() // You can include other data here if needed
      }));
      return userNames;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error; // Handle the error appropriately
    }
};


export const createUser = async ({ chainOfCommand, username, password, otherExcusals, ownExcusals }) => {
    try {
        const userRef = doc(db, "users", username);

        await setDoc(userRef, {
          coc: chainOfCommand,
          username,
          password,
          otherExcusals,
          ownExcusals
        });
      console.log("Document written with ID: ", userRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };


    // Function to fetch user information
    export const fetchUserInfo = async (userId) => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
        return userSnap.data(); // Returns the user document's data
        } else {
        throw new Error("No such user!");
        }
    };
    
    // Function to edit user information
    export const editUserInfo = async (userId, { coc, password, username }) => {
        const userRef = doc(db, "users", userId);
        try {
        await updateDoc(userRef, { coc, password, username });
        console.log("User information updated successfully");
        } catch (error) {
        console.error("Error updating user:", error);
        throw error;
        }
    };

    export const deleteUser = async (userId) => {
        try {
          await deleteDoc(doc(db, "users", userId));
          console.log("User deleted successfully");
        } catch (error) {
          console.error("Error deleting user:", error);
          throw error; // Consider handling this more gracefully
        }
      };