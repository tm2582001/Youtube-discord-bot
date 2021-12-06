let { google } = require('googleapis');
let OAuth2 = google.auth.OAuth2;

function authorize(memberCount,luckyMember) {
    console.log("I was called");
    var clientSecret = process.env.CLIENT_SECRET;
    var clientId = process.env.CLIENT_ID;
    var redirectUrl = process.env.REDIRECT_URI;
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    oauth2Client.credentials = JSON.parse(process.env.OAUTH_TOKEN);
    updateVideo(oauth2Client,memberCount,luckyMember);
}

function updateVideo(auth,memberCount,luckyMember = " ") {
    var service = google.youtube('v3');
    service.videos.update({
        auth: auth,
        part: [
            "snippet"
        ],
        resource: {
            id: process.env.VIDEO_ID,
            snippet: {
                categoryId: 20,
                defaultLanguage: "hi",
                description: "Hello world",
                tags: ["pokemon"],
                title: "My discord has "+memberCount+" members " + luckyMember + " Thanks for joining"
            }
        }
    });
}

module.exports = authorize;