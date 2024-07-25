/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmailNotifications = functions.firestore
    .document('excusals/{excusalId}')
    .onWrite(async (change, context) => {
        const excusalBeforeData = change.before.exists ? change.before.data() : null;
        const excusalAfterData = change.after.exists ? change.after.data() : null;

        // Determine if the document is newly created or if the status field is updated
        const isNewExcusal = !change.before.exists && change.after.exists;
        const statusChangedToApprovedOrRejected = excusalBeforeData && excusalAfterData && excusalBeforeData.status !== excusalAfterData.status && (excusalAfterData.status === 'approved' || excusalAfterData.status === 'rejected');

        let emailDetails = {
            to: '',
            from: 'adam.bournes2003@gmail.com', // Your verified sender
            subject: '',
            text: '',
            html: '',
        };

        if (isNewExcusal || statusChangedToApprovedOrRejected) {
            // Fetch user data based on the scenario
            let userRef;
            if (isNewExcusal) {
                // For new excusals, notify the reviewer (assuming 'sentTo' contains the reviewer's userID)
                userRef = admin.firestore().doc(`users/${excusalAfterData.sentTo}`);
            } else if (statusChangedToApprovedOrRejected) {
                // For status updates, notify the submitter (assuming 'sentBy' contains the submitter's userID)
                userRef = admin.firestore().doc(`users/${excusalAfterData.sentBy}`);
            }

            const doc = await userRef.get();
            if (!doc.exists) {
                return;
            }
            const userData = doc.data();
            emailDetails.to = userData.email; // Set email recipient

            const websiteUrl = "https://excusal-39359.web.app/";

            // Customize the email content based on the scenario
            if (isNewExcusal) {
                emailDetails.subject = 'New Excusal Needs Your Review';
                emailDetails.text = `A new excusal with ID: ${context.params.excusalId} has been assigned to you for review. Please review it at ${websiteUrl}`;
                emailDetails.html = `<strong>${emailDetails.text.substring(0, emailDetails.text.indexOf('Please'))}</strong><a href="${websiteUrl}">Please review it here</a>.`;
            } else if (statusChangedToApprovedOrRejected) {
                emailDetails.subject = `Your Excusal Submission Has Been ${excusalAfterData.status.charAt(0).toUpperCase() + excusalAfterData.status.slice(1)}`;
                emailDetails.text = `Your excusal with ID: ${context.params.excusalId} has been ${excusalAfterData.status}. You can view the details at ${websiteUrl}`;
                emailDetails.html = `<strong>${emailDetails.text.substring(0, emailDetails.text.indexOf('You can'))}</strong><a href="${websiteUrl}">You can view more details here</a>.`;
            }

            // Send the email
            return sgMail.send(emailDetails).then(() => console.log("Email sent.")).catch((error) => console.error("Error sending email:", error));
        }
    });



    exports.sendWeeklyExcusalReminders = functions.pubsub.schedule('0 7 * * 1,3').timeZone('America/New_York').onRun(async (context) => {
        const excusalSnapshot = await admin.firestore().collection('excusals').get();
        const sentToUsers = new Set();
    
        // Gather all unique 'sentTo' user IDs
        excusalSnapshot.forEach(doc => {
            const excusal = doc.data();
            if (excusal.sentTo) {
                sentToUsers.add(excusal.sentTo);
            }
        });

        const websiteUrl = "https://excusal-39359.web.app/";
    
        // For each unique 'sentTo' user, fetch their email and send a reminder
        const emailPromises = [];
        sentToUsers.forEach(async (userId) => {
            const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
            if (userSnapshot.exists) {
                const userData = userSnapshot.data();
                const emailDetails = {
                    to: userData.email,
                    from: 'adam.bournes2003@gmail.com',
                    subject: 'Weekly Excusal Reminder: YOU HAVE EXCUSALS TO REVIEW',
                    text: 'You have excusals to review.',
                    html: `<strong>You have excusals to review.</strong> <a href="${websiteUrl}">You can view the website here</a>`,
                };
                emailPromises.push(sgMail.send(emailDetails));
            }
        });
    
        try {
            await Promise.all(emailPromises);
            console.log('Weekly reminder emails sent successfully.');
        } catch (error) {
            console.error('Failed to send weekly reminder emails:', error);
        }
    });
    
    function getMondayOfCurrentWeek() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // Sunday - 0, Monday - 1, etc.
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(now.setDate(diff));
    }