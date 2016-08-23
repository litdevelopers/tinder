$(document).ready(function() {
	
	setUpSockets();
	
});

var lowerBound = 0, upperBound = 500;
var question_id = 0;

function setUpSockets() {
	var socket = io();
	var currentQuestion;
	var answering = false;
	socket.on('connect_error', function(err) {
		console.log("socket failed");
	});

	socket.on('connect', function() {

		
		socket.on('ask_question', function(data){
			currentQuestion = data.id;
			answering = true;

			if(data.fill_in){
				showAIRow(data, false);
			} else{
				showAIRow(data, true, data.choices, currentQuestion, socket);
			}
		});

			// DEBUG
			//socket.emit('login', {
			//	'facebookid' : '1234'
			//});


		  	$('div#facebooklogin').on('click', function(){
		  		FB.login(function(response) {
			  		console.log(response);
        				$(".login").fadeOut("slow");
        			    FB.api('/me', function(response) {
							$("#name").typed({
						        strings: ["Hi! Welcome Back "+ response.name]
						    });
					    });
			  		var data = {
		  				facebookid: response.authResponse.userID 
		  			}

		  			socket.emit('login', data);
				}, {scope: 'email,user_likes,user_friends'});
			});



		$("#send_message").click(function(e) {
			
			
			if ($("#message_input").val().trim() != "") {

				if(answering){
					console.log('answering question');
					answering = false;
					answerQuestion(socket, currentQuestion);
				}
				else
				{
					pressEnter(socket, currentQuestion);
				}

			}

			return false;
		});



		
		$("#message_input").keypress(function(e) {
			if (e.which == 13) {
				pressEnter(socket, currentQuestion);
			}
		});


		socket.on('recieve_message_success', function(data) {
			lowerBound += 100000;
			upperBound += 100000;
			console.log(data);
			
			var val = $("#message_input").val();
			$("#message_input").val("");
			
			

			for(var i=0; i<data.result.length+20; i+=1) {

var strVar="";
strVar += "        <section class=\"modal--fade\" id=\"modal-fade\" data-stackable=\"false\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"label-fade\" aria-hidden=\"true\">";
strVar += "            <div class=\"modal-inner card-detail\">";
strVar += "                <div class=\"detail-banner\">";
strVar += "                    <img src=\"images\/header-detail.jpg\"><\/img>";
strVar += "                    <div class=\"cities\">";
strVar += "                        <div class=\"departure\">";
strVar += "                            <h2 class=\"destination-code\">"+data.result[i].origin+"<\/h2>";
//strVar += "                            <h2 class=\"destination-title\">San Francisco<\/h2>";
strVar += "                        <\/div>";
strVar += "                        <img class=\"detail-plane-icon\" src=\"images\/plane.png\"><\/img>";
strVar += "                        <div class=\"destination\">";
strVar += "                            <h2 class=\"destination-code\">"+data.result[i].destination+"<\/h2>";
//strVar += "                            <h2 class=\"destination-title\">New York<\/h2>";
strVar += "                        <\/div>";
strVar += "                    <\/div>";
strVar += "                    <div class=\"hotel\">";
strVar += "                        <span class=\"name\">"+data.result[i].hotel_property+"<\/span>";
strVar += "                        <div class=\"date\">"+data.result[i].hotel_check_in_date.substring(4,8)+" <span>-<\/span>"+data.result[i].hotel_check_out_date.substring(4,8)+"<\/div>";
strVar += "                    <\/div>";
strVar += "                    <div class=\"price\">$"+data.result[i].jetblue_price+"<\/div>";
strVar += "                    <div class=\"savings\">"+data.result[i].percent_saving+"% savings<\/div>";
strVar += "                    <div class=\"tags\">";
strVar += "                        <span class=\"tag-entry\">Tag 1<\/span>";
strVar += "                        <span class=\"tag-entry\">Tag 2<\/span>";
strVar += "                        <span class=\"tag-entry\">Tag 3<\/span>";
strVar += "                    <\/div>";
strVar += "                <\/div>";
strVar += "                <div class=\"modal-content\">";
strVar += "                    <div class=\"container\">";
strVar += "                        <div class=\"row\">";
strVar += "                            <div class=\"two-thirds column\">";
strVar += "                                <span class=\"modalHeader\"><strong>Description<\/strong><\/span>";
strVar += "                                <br>";
strVar += "                                <span class=\"modalDesc\"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur enim nec erat egestas imperdiet. Vivamus bibendum nisl malesuada, congue eros id, lobortis justo. Vivamus eu arcu ultrices, lobortis lacus dapibus, dapibus ipsum. Curabitur varius vestibulum metus vitae tincidunt. Nullam erat leo, ullamcorper mattis blandit vel.                                <\/p><\/span>";
strVar += "                            <\/div>";
strVar += "                            <div class=\"one-third column\">";
strVar += "                                <a class=\"button u-full-width\" href=\"#\">Join Flight<\/a>";
strVar += "                                <span id=\"ticketsLeft\">23<\/span>";
strVar += "                                <span id=\"ticketsRight\">tickets left<\/span>";
strVar += "                                ";
strVar += "                            <\/div>";
strVar += "                        <\/div>";
strVar += "                    <\/div>";
strVar += "                <\/div>";
strVar += "            <\/div>";
strVar += "            <a href=\"#!\" class=\"modal-close\" title=\"Close this modal\" data-dismiss=\"modal\" data-close=\"Close\"><\/a>";
strVar += "        <\/section>";
strVar += "        <a href=\"#modal-fade\">";
strVar += "            <div class=\"card\">";
strVar += "                <div class=\"head\">";
strVar += "                    <div class=\"destination\">"+data.result[i].origin+"<span>-<\/span>"+data.result[i].destination+"<\/div>";
strVar += "                    <div class=\"hotel-property\">"+data.result[i].hotel_property+"<\/div>";
strVar += "                    <div class=\"date-initial\">"+data.result[i].hotel_check_in_date.substring(4,8)+"<span>3:15pm<\/span><\/div>";
strVar += "                    <span class=\"date-connector\">-<\/span>";
strVar += "                    <div class=\"date-end\">"+data.result[i].hotel_check_out_date.substring(4,8)+"<span>5:15pm<\/span><\/div>";
strVar += "                    <div class=\"price\">$"+Math.ceil(data.result[i].jetblue_price)+"<\/div>";
strVar += "                <\/div>";
strVar += "                <div class=\"progress\">";
strVar += "                    <progress value=\"80\" max=\"100\"><\/progress>";
strVar += "                <\/div>";
strVar += "                <div class=\"join\"><\/div>";
strVar += "                <button class=\"join\">Join flight<\/button>";
strVar += "                <span class=\"joined\">7 people are down<\/span>";
strVar += "                <div class=\"tag-set\"><span class=\"tag\">Romance<\/span><span class=\"tag\">Exploration<\/span><span class=\"tag\">Beach<\/span><\/div>";
strVar += "            <\/div>";
strVar += "        <\/a>";


					
	            $("div.deals").append(strVar);

			}
			showUserRow(val);
		});
		socket.on('recieve_message_fail', function(data) {
			alert("Message failed!");
		});

		socket.on('receive_answer_success', function(data) {
			$(data).remove();
		});
	});
}


function answerQuestion(socket, currentQuestion){
	var val = $('#message_input').val();

	socket.emit('receive_answer', {
		'answer': val,
		'id' : currentQuestion
	});
}

function pressEnter(socket, currentQuestion) {
	var val = $("#message_input").val();

	console.log('emitting');
	socket.emit('send_message', {
		'message' : val,
		'question': currentQuestion,
		'indexes' : [lowerBound, upperBound]
	});
}
function showAIRow(message, radio, choices, currentQuestion, socket) {
    var str = '<div class="row">';
    str += '<div class="text bot">';
    str += '<img src="images/bot-icon.png" class="icon botIcon"></img>';
    str += '<div class="comment"><span class="commentTyped"></span></div>';
    str += '</div>';
    str += '</div>';

	if(radio){
		str += "<form id='ques" + question_id + "'>";
		for(var i=0; i<choices.length; i+=1) {
			str+='<input type="radio" name="ques' + question_id + '_input" value="' + choices[i] + '">'+choices[i]+'<br>';
		}
		str += "<input type='submit' value='Submit'></form>";
	}


	var body = $("html, body");
	body.stop().animate({scrollTop:$('#message_field').scrollHeight}, 500);
		console.log($('#message_field').scrollHeight);


	$("#message_field").append(str);
	
	var qs = question_id.toString();
	$("#ques" + question_id).submit(function() {
		socket.emit('receive_answer', {
			'answer': $(this).find("input:checked").val(),
			'id' : currentQuestion,
			'tagid' : "#ques" + qs
		});

		return false;
	});

	question_id += 1;


	turnOn();
	$(".commentTyped").typed({
        strings: [message.question],
        typeSpeed: 50,
        onStringTyped: function() {
        	console.log('finished');
        	$('.botIcon:last').addClass('animated flash').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        	    $('canvas').fadeOut(1000).show(0);
        	    turnOff();
        	    $(".botIcon").removeClass('flash');
        	});
        	$('.typed-cursor').css('display', 'none');
        	turnOff();
        }
    });
}
function showUserRow(message) {
    var str = '<div class="row">';
    str += '<div class="text user">';
    str += '<div class="comment">' + message + '</div>';
    str += '</div>';
	str += '</div>';
	$("#message_field").append(str);
	console.log(document.body.scrollHeight);
	//window.scrollTo(0,document.body.scrollHeight);
	var body = $("html, body");
	body.stop().animate({scrollTop:document.body.scrollHeight}, 500);
}

       