//The URIs of the REST endpoint
//Media Upload URIs
IUPS = "https://prod-29.eastus.logic.azure.com:443/workflows/e3442dbf83c34acc842add3be7b405e5/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8x4iPJg2KePMZnP6BC0U19VyzO_oMEIDsQkTIrkf484";
RAI = "https://prod-07.eastus.logic.azure.com:443/workflows/235d4de8cbb54c429b2786c95d3520e1/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MjvtgutOtWmXxaU4mU1VUZ-gcZ07AXjFaL-V0K7NL3Y";

BLOB_ACCOUNT = "https://blobstoragemediaupload.blob.core.windows.net";

//Register and Login URIs
CIAURI = "https://prod-92.eastus.logic.azure.com/workflows/43f945469dec4c5389d1a3145cceb063/triggers/manual/paths/invoke/rest/v1/assets?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=k9yrUK0El0_pLI0X8tQa-y_0OWYN-W0-fp7-sPFi344"
RIAURI1 = "https://prod-95.eastus.logic.azure.com/workflows/1bd459065e0a42fabd8ff5a16106d6b6/triggers/manual/paths/invoke/rest/v1/assets/"
RIAURI2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=sM-2ffJqGa301k3Apd_pq9f5rVQP_4UbGZqd_5nB3fo"
RAAURI = "https://prod-78.eastus.logic.azure.com/workflows/df6893809c0849c7991214c1ca46d63d/triggers/manual/paths/invoke/rest/v1/assets?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Or087KOyjEM80F-_LXZNqLHct3aN0byC8FFGHWTA0ms"
DIAURI0 = "https://prod-89.eastus.logic.azure.com/workflows/f813d4c9b3ad41898ac9bae3e8a666a8/triggers/manual/paths/invoke/rest/v1/assets/"
DIAURI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jUCr1tsK2qY5YyR201HNPGTPIX3U7frP0NSYlMwWTZc"

//Handlers for button clicks
$(document).ready(function() {

  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 

  //Handler for the new account creation
  $("#subNewUser").click(function(){

    submitNewUser();
      
  });

  //Handler for logging in
  $("#retUser").click(function(){

    getCurrentUser();
    console.log("Session Storage:" + sessionStorage.getItem("currentUser"))
  }); 

    //Handler deleting image
    $("#deleteImage").click(function(){
      deleteAsset();
    }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('FileName', $('#FileName').val());
 submitData.append('userID', $('#userID').val());
 submitData.append('userName', $('#userName').val());
 submitData.append('File', $("#UpFile")[0].files[0]);

 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: IUPS,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){
 document.getElementById('FileName').value = ''
 document.getElementById('userIDBox').value = ''
 document.getElementById('userNameBox').value = ''
 document.getElementById('UpFile').value = ''
 window.alert("File successfully uploaded to Blob/CosmosDB");

 }
 });

}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){
  //Replace the current HTML in that div with a loading message
 $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span>');
  $.getJSON(RAI, function( data ) {
    
  //Create an array to hold all the retrieved assets
  var items = [];
 
  //Iterate through the returned records and build HTML, incorporating the key values of the
  $.each( data, function( key, val ) {
    //if goes here to check if video or image
  if(val["filePath"] == "/imagestoremediaupload/638369001292387556"){
    items.push('<video width="350" height="350" controls> <br/>')
    items.push("<source src='"+BLOB_ACCOUNT + val["filePath"] +"'><br/>")
    items.push("</video><br/>")

    items.push( "File : " + val["fileName"] + "<br/>");
    items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br/>");
    items.push( "<hr />");

  }else{
    items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"' width='300'/> <br/>")
    console.log(BLOB_ACCOUNT + val["filePath"])
    items.push( "File : " + val["fileName"] + "<br/>");
    //console.log(val["userName"])
    items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br/>");
    items.push( "<hr />");
  }


  var str = val["fileName"];
  var result = [];
  for(var i = 0, length = str.length; i < length; i++) {
      var code = str.charCodeAt(i);
      // Since charCodeAt returns between 0~65536, simply save every character as 2-bytes
      result.push(code & 0xff00, code & 0xff);
  }
  console.log(result);
  });

 //Clear the assetlist div
 $('#ImageList').empty();

 //Append the contents of the items array to the ImageList Div
 $( "<ul/>", {
 "class": "my-new-list",
 html: items.join( "" )
 }).appendTo( "#ImageList" );
 //console.log($('#ImageList'))
 });
 
}

//LOGIN AND REGISTER//

//A function to submit a new asset to the REST endpoint 
function submitNewUser(){
  var itemsRegister = [];
  //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('email', $('#emailreg').val());
 submitData.append('userName', $('#unamereg').val());
 submitData.append('pPassword', $('#pswreg').val());

 //Flash up telling user to login
 itemsRegister.push( "<hr />");
 itemsRegister.push( '<div class="alert alert-info">');
 itemsRegister.push( "Successfully registered, please login to continue <br />");
 itemsRegister.push( '</div>');

 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: CIAURI,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){

 }
 });
//Registered message thing
 $( "<ul/>", {
  "class": "my-new-list",
  html: itemsRegister.join( "" )
  }).appendTo( "#UserRegistered" );

}

function getCurrentUser(){
  //Get all users
  $.getJSON(RAAURI, function( data ) {

    var enteredUsername = document.getElementById('uname').value;
    var enteredPassword = document.getElementById('psw').value;
    var itemsLogin = []; //To store different stuff like "User doesnt exist" or "Welcome"

    //Loop through the credentials and check if our user exists
    $.each( data, function( key, val ) {
      console.log(val["userName"] + " " + val["pPassword"]);
      console.log(enteredUsername);
      if(enteredUsername == val["userName"] && enteredPassword == val["pPassword"]){
        itemsLogin.push( "<hr />");
        //Successful login message
        itemsLogin.push( '<div class="alert alert-success">');
        itemsLogin.push( "Welcome " + val["userName"] + "!<br />");
        itemsLogin.push( '</div>');

        sessionStorage.setItem("currentUser", enteredUsername);
        console.log("Function triggered");

        //Autofill the form with the logged in users credentials
        document.getElementById('userNameBox').value = val["userName"];
        document.getElementById('userIDBox').value = val["userID"];
        document.getElementById('userNameBox').readOnly = true;
        document.getElementById('userIDBox').readOnly = true;
        document.getElementById("retUser").disabled = true;
        document.getElementById("mainregbtn").disabled = true;


      };
      
      });
    //Check if the user has been found and if not add an error message to display
    if(itemsLogin.length == 0 || itemsLogin == undefined){

      //Unsuccessful login message
      itemsLogin.push( '<div class="alert alert-warning">');
      itemsLogin.push( "user doesn't exist <br />");
      itemsLogin.push( '</div>');

    }

    //Clear the assetlist div
    $('#UserWelcome').empty();

    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
    "class": "my-new-list",
    html: itemsLogin.join( "" )
    }).appendTo( "#UserWelcome" );
      });
}

function deleteAsset(id){
  $.ajax({
  type: "DELETE",
  //Note the need to concatenate the
  url: DIAURI0 + id + DIAURI1,
  }).done(function( msg ) {
  //On success, update the assetlist.
  getImages();
  });
  }