// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, query, collection, where, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './FirebaseConfig.js';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

const storage = getStorage();

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


  export const createExcusalRequest = async (loggedInUsername, excusalName, event, fromDate, toDate, reason, reasonDetails, comments, fileDownloadURL, dateSubmitted) => {
    try {
        // Reference to the logged-in user's document to fetch COC
        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.error("User document not found:", loggedInUsername);
            return;
        }

        // Get the COC from the user's document
        const cocUsername = userDoc.data().coc;
        if (!cocUsername) {
            console.error("COC not found for user", loggedInUsername);
            return;
        }

        console.log("coc: ", cocUsername);

        let sentToString = cocUsername; // Use let for variables that may change
        let status = "submitted";

        // Sanitize excusalName to ensure it is a valid document ID
        const sanitizedExcusalName = excusalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

        // Ensure that the document ID is valid
        if (!sanitizedExcusalName || sanitizedExcusalName.length === 0) {
            throw new Error("Invalid excusalName. Cannot create a document with an empty or invalid ID.");
        }

        // Create or overwrite a document in the 'excusals' collection with the sanitized name
        const excusalRef = doc(db, 'excusals', sanitizedExcusalName);
        await setDoc(excusalRef, {
            sentBy: loggedInUsername,
            event: event,
            fromDate: fromDate,
            toDate: toDate,
            reason: reason,
            reasonDetails: reasonDetails,
            comments: comments,
            status: status,
            sentTo: sentToString,
            reviews: [],
            fileURL: fileDownloadURL,
            dateSubmitted: dateSubmitted
        });

        console.log("Excusal request created with 'sentTo' pointing to COC:", cocUsername);
    } catch (error) {
        console.error("Error creating excusal request:", error);
        throw error; // Re-throw the error for external handling if necessary
    }
}

export const deleteExcusal = async (excusalId) => {
    try {
        const excusalRef = doc(db, "excusals", excusalId);
        await deleteDoc(excusalRef);
        console.log("Excusal deleted successfully:", excusalId);
    } catch (error) {
        console.error("Error deleting excusal:", error);
        throw error;
    }
};

  export const fetchOwnExcusals = async (loggedInUsername) => {
    const db = getFirestore();
    const excusalsRef = collection(db, 'excusals');
    const q = query(excusalsRef, where("sentBy", "==", loggedInUsername));

    try {
        const querySnapshot = await getDocs(q);
        const excusalDetails = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return excusalDetails;
    } catch (error) {
        console.error("Error fetching own excusals:", error);
        return []; // Return an empty array in case of error
    }
};


export const fetchOtherExcusals = async (loggedInUsername) => {
    const db = getFirestore();
    const excusalsRef = collection(db, 'excusals');
    const q = query(excusalsRef, where("sentTo", "==", loggedInUsername));

    try {
        const querySnapshot = await getDocs(q);
        const excusalDetails = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(excusalDetails);
        return excusalDetails;
    } catch (error) {
        console.error("Error fetching other excusals:", error);
        return []; // Return an empty array in case of error
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
        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const cocUsername = userDoc.data().coc;
            console.log("cocUsername: ", cocUsername);
            const excusalRef = doc(db, 'excusals', excusalId);
            
            if (cocUsername === loggedInUsername) {
                await updateDoc(excusalRef, {
                    sentTo: "",
                    status: "approved",
                    reviews: arrayUnion({ reviewer: loggedInUsername, review: "approve" }) // Updated to use an object
                });
            } else {
                await updateDoc(excusalRef, {
                    sentTo: cocUsername,
                    status: "submitted",
                    reviews: arrayUnion({ reviewer: loggedInUsername, review: "approve" }) // Updated to use an object
                });
            }
        } else {
            console.log("User document not found:", loggedInUsername);
        }
    } catch (error) {
        console.error("Error sending excusal up:", error);
        throw error;
    }
}

export async function fullyAcceptExcusal(loggedInUsername, excusalId) {
    try {
        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            // const cocUsername = userDoc.data().coc;
            const excusalRef = doc(db, 'excusals', excusalId);
            
            await updateDoc(excusalRef, {
                sentTo: "",
                status: "approved",
                reviews: arrayUnion({ reviewer: loggedInUsername, review: "approve" }) // Updated to use an object
            });
        } else {
            console.log("User document not found:", loggedInUsername);
        }
    } catch (error) {
        console.error("Error sending excusal up:", error);
        throw error;
    }
}

export async function rejectExcusal(loggedInUsername, excusalId) {
    try {
        const excusalRef = doc(db, 'excusals', excusalId);
        const userRef = doc(db, 'users', loggedInUsername);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const cocUsername = userDoc.data().coc;
            
            if (cocUsername === loggedInUsername) {
                await updateDoc(excusalRef, {
                    sentTo: "",
                    status: "rejected",
                    reviews: arrayUnion({ reviewer: loggedInUsername, review: "reject" }) // Updated to use an object
                });
            } else {
                // If needed, handle the case for other conditions
                await updateDoc(excusalRef, {
                    sentTo: cocUsername,
                    status: "rejected",
                    reviews: arrayUnion({ reviewer: loggedInUsername, review: "reject" }) // Updated to use an object
                });
            }
        }
    } catch (error) {
        console.error("Error rejecting excusal:", error);
        throw error;
    }
}


export const fetchAllExcusals = async (status = '', dateFrom = '', dateTo = '') => {
    try {
        let q = query(collection(db, "excusals"));

        // Apply status filter
        if (status) {
            q = query(q, where("status", "==", status));
        }

        const querySnapshot = await getDocs(q);
        let excusals = [];

        // Filter by date range after fetching due to limitations in Firestore querying
        querySnapshot.forEach((doc) => {
            const excusal = { id: doc.id, ...doc.data() };
            const excusalFromDate = excusal.fromDate ? new Date(excusal.fromDate).getTime() : null;
            const excusalToDate = excusal.toDate ? new Date(excusal.toDate).getTime() : null;
            const filterFromDate = dateFrom ? new Date(dateFrom).getTime() : null;
            const filterToDate = dateTo ? new Date(dateTo).getTime() : null;

            let includeExcusal = true;

            // If there's a filterFromDate but no filterToDate, check if excusalFromDate is on or after filterFromDate
            if (filterFromDate && !filterToDate) {
                includeExcusal = excusalFromDate && excusalFromDate >= filterFromDate;
            }

            // If there's a filterToDate but no filterFromDate, check if excusalToDate is on or before filterToDate
            if (filterToDate && !filterFromDate) {
                includeExcusal = excusalToDate && excusalToDate <= filterToDate;
            }

            // If both filterFromDate and filterToDate are specified, check if the excusal is within the range
            if (filterFromDate && filterToDate) {
                includeExcusal = (!excusalFromDate || excusalFromDate >= filterFromDate) && (!excusalToDate || excusalToDate <= filterToDate);
            }

            // If the excusal meets the date criteria, add it to the results
            if (includeExcusal) {
                excusals.push(excusal);
            }
        });

        return excusals;
    } catch (error) {
        console.error("Error fetching all excusals:", error);
        return [];
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

    export const listenToUsers = (callback) => {
        const usersRef = collection(db, 'users');
    
        // onSnapshot is a real-time listener for Firestore
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(users); // Call the callback function with the updated users list
        });
    
        // Return the unsubscribe function to stop listening when no longer needed
        return unsubscribe;
    };

    export const createUser = async ({ company, platoon, squad, username, password, email, coc }) => {
        try {
            const userRef = doc(db, "users", username);

            await setDoc(userRef, {
                company,
                platoon,
                squad,
                username,
                password,
                email,
                coc,
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
    
    export const editUserInfo = async (userId, { company, platoon, squad, username, password, email, coc }) => {
        const userRef = doc(db, "users", userId);
        try {
            await updateDoc(userRef, { company, platoon, squad, username, password, email, coc });
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


    export const uploadFile = async (file, path) => {
        const storageRef = ref(storage, path);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref); // Get download URL after upload
            console.log('File uploaded and download URL obtained:', downloadURL);
            return downloadURL; // Return the download URL
        } catch (error) {
            console.error('Upload failed', error);
            throw error;
        }
    };

// Function to fetch user ranks for the selected company
export const fetchUserRanks = async (selectedCompany) => {
    const docRef = doc(db, "ranks", selectedCompany); // Adjust this based on your Firestore structure
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data(); // Return data for the selected company
      } else {
        console.log("No such document for company: ", selectedCompany);
        return null;
      }
    } catch (error) {
      console.error("Error fetching ranks:", error);
      throw error;
    }
};  

// Function to edit user ranks for the selected company
export const editUserRanks = async (company, updatedRanks) => {
    const docRef = doc(db, "ranks", company); // Company-specific document (a, b, c, d)
    try {
        await updateDoc(docRef, updatedRanks);
        console.log(`Ranks for company ${company} successfully updated!`);
    } catch (error) {
        console.error(`Error updating ranks for company ${company}: `, error);
        throw error;
    }
};

export const updateUserCocValues = async (company) => {
    try {
        // Fetch ranks for the selected company
        const ranksRef = doc(db, 'ranks', company);
        const rankSnapshot = await getDoc(ranksRef);
        const ranks = rankSnapshot.data();

        // Fetch all users in the selected company
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const users = usersSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => user.company === company); // Filter users by company

        // Update chain of command for each user
        users.forEach(async (user) => {
            let newCoc = '';

            // Determine the new coc based on user's role and platoon/squad assignment
            switch (user.platoon) {
                case '1st':
                    switch (user.squad) {
                        case '1st': newCoc = ranks._1sl1; break;
                        case '2nd': newCoc = ranks._1sl2; break;
                        case '3rd': newCoc = ranks._1sl3; break;
                        case '4th': newCoc = ranks._1sl4; break;
                        default: newCoc = ranks._1psg; // Default to platoon sergeant
                    }
                    break;
                case '2nd':
                    switch (user.squad) {
                        case '1st': newCoc = ranks._2sl1; break;
                        case '2nd': newCoc = ranks._2sl2; break;
                        case '3rd': newCoc = ranks._2sl3; break;
                        case '4th': newCoc = ranks._2sl4; break;
                        default: newCoc = ranks._2psg; // Default to platoon sergeant
                    }
                    break;
                default:
                    break;
            }

            // Assign the chain of command based on the rank and update the user
            if (newCoc) {
                const userRef = doc(db, 'users', user.id);
                await updateDoc(userRef, { coc: newCoc }).catch(error => console.error(`Error updating user ${user.id} coc:`, error));
            }
        });

        console.log(`All users' CoC values updated successfully for company ${company}.`);
    } catch (error) {
        console.error(`Error updating users' CoC values for company ${company}: `, error);
        throw error;
    }
};


export const updateExcusalSentToValues = async (company, newRanks) => {
    try {
        // Fetch old ranks for the selected company
        const oldRanksRef = doc(db, 'ranks', company);
        const oldRanksSnap = await getDoc(oldRanksRef);
        const oldRanks = oldRanksSnap.data();

        // Fetch all excusals
        const excusalsRef = collection(db, 'excusals');
        const excusalsSnap = await getDocs(excusalsRef);

        excusalsSnap.forEach(async (docSnap) => {
            const excusal = docSnap.data();
            let updatedSentTo = '';

            // Iterate over old ranks to find matches and update to new ranks
            Object.entries(oldRanks).forEach(([key, value]) => {
                if (excusal.sentTo === value) { // Match found
                    updatedSentTo = newRanks[key]; // Get corresponding new rank
                }
            });

            // If a match was found and a new sentTo is determined
            if (updatedSentTo) {
                await updateDoc(doc(db, 'excusals', docSnap.id), { sentTo: updatedSentTo });
            }
        });

        console.log(`All excusals' sentTo values updated successfully for company ${company}.`);
    } catch (error) {
        console.error(`Error updating excusals' sentTo values for company ${company}: `, error);
    }
};
