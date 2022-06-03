const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mailchimp.setConfig({
    apiKey: "0ff839ccdaa8003364e92e6fd5f9a4dc-us11",
    server: "us11"
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userEmail = req.body.email;
    const listId = "6ff86124c2";
    const subscribingUser = {
        fName: firstName,
        lName: lastName,
        email: userEmail
    };
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
            FNAME: subscribingUser.fName,
            LNAME: subscribingUser.lName
        }
        });
    res.sendFile(__dirname + "/success.html");
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running...");
});

// 0ff839ccdaa8003364e92e6fd5f9a4dc-us11
// 6ff86124c2