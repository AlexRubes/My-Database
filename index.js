  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAMsOIJPH01Zun-85oH8vdHvyS2NIcOjj8",
    authDomain: "chicago-food-b17bc.firebaseapp.com",
    databaseURL: "https://chicago-food-b17bc.firebaseio.com",
    projectId: "chicago-food-b17bc",
    storageBucket: "chicago-food-b17bc.appspot.com",
    messagingSenderId: "335216705212"
  };
  
  firebase.initializeApp(config);

  var trainData = firebase.database();

  $('#add-train-btn').on('click', function() {

    let trainName = $('#train-name-input').val().trim();
    let destination = $('#destination-input').val().trim();
    let firstTrain = $('#first-train-input').val().trim();
    let frequency = $('#frequency-input').val().trim();

    let newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    }

    trainData.ref().push(newTrain);

    return false;

  });

  trainData.ref().on('child_added', function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    let tName = childSnapshot.val().name;
    let tDestination = childSnapshot.val().destination;
    let tFirstTrain = childSnapshot.val().firstTrain;
    let tFrequency = childSnapshot.val().frequency;
    
    let trainArray = tFirstTrain.split(':');
    let trainTime = moment().hours(trainArray[0]).minutes(trainArray[1]);
    console.log(trainTime);

    let maxMoment = moment.max(moment, trainTime);
    let tMinutes; 
    let tArrival;

    if (maxMoment===trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        let diffTimes = moment().diff(trainTime,"minutes");
        let tRemainder = diffTimes % tFrequency;
        tMinutes = tFrequency - tRemainder; 

        tArrival = moment().add(tMinutes,"m").format("hh:mm A");
    }

    $('#train-table > tbody').append('<tr><td>' + tName + '</td><td>' + tDestination + '</td><td>' + tFrequency + '</td><td>' + tArrival + '</td><td>' + tMinutes);

  });