// Initialize Firebase
var config = {
    apiKey: "AIzaSyCMnkBcx3xysNo8RxBDtPRbHDP2ZpWY2qU",
    authDomain: "trainscheduler-53a73.firebaseapp.com",
    databaseURL: "https://trainscheduler-53a73.firebaseio.com",
    projectId: "trainscheduler-53a73",
    storageBucket: "trainscheduler-53a73.appspot.com",
    messagingSenderId: "685420829051"
  };
  firebase.initializeApp(config);

var database = firebase.database();


// Global Variables
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = 0;


// Submit Button Click
$("#submit").on("click", function(event) {
    event.preventDefault();

    // Get value from form
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();

    // Add data to database
    database.ref().push({
        trainName : trainName,
        destination : destination,
        firstTrain : firstTrain,
        frequency : frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Retreive info from database
database.ref().on("child_added", function(childSnapshot) {

    var snap = childSnapshot.val();

    trainName = snap.trainName;
    destination = snap.destination;
    firstTrain = snap.firstTrain;
    frequency = snap.frequency;


    // moment.js time conversion
    
    // Fisrt Train time converted
    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

    // Time Apart remainder
    var tRemainder = diffTime % frequency;

    // Minutes till next train
    var minutesTillTrain = frequency - tRemainder;

    // Next Train
    var nextTrainRaw = moment().add(minutesTillTrain, "minutes");
    var nextTrain = moment(nextTrainRaw).format("hh:mm a");


    // End Moment conversion



    // Add train data to page
    var html = 
    '<div class="row trainInfo">' +
    '<div class="col-md-1 text-center"><h5><i class="fas fa-train"></i></h5></div>'+
    '<div class="col-md-3"><h5>' + trainName + '</h5></div>' +
    '<div class="col-md-2"><h5>' + destination + '</h5></div>' + 
    '<div class="col-md-2"><h5>' + frequency + '</h5></div>' + 
    '<div class="col-md-2"><h5>' + nextTrain + '</h5></div>' +
    '<div class="col-md-2"><h5>' + minutesTillTrain + '</h5></div></div>'

    $("#trains").append(html);

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});
