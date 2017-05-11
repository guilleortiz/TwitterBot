console.log("Starting bot...");

var Twit = require('twit');
var config=require('./config');
// Now using rita.js!
var rita = require('rita');



var T = new Twit(config);

var stream=T.stream('user');//set up a user stream




stream.on('tweet',tweetEvent);//anytime someone tweets me

function tweetEvent(event){

	console.log("tweet recibido!");
	
	var replyto=event.in_reply_to_screen_name;
	var text=event.text;
	var from=event.user.screen_name;

	if(replyto=='The_Lion_Roar'){
		
		rg=new rita.RiGrammar();

	var grammar={
	  "<start>": ["  <interj> <noun-phrase>  "],

	  "<noun-phrase>": [" <determiner>  <adj> <noun> that <verb-phrase>"],
	  
	  "<verb-phrase>":[" <adv> <verbI> "],
	  
	  " <determiner>": [
	    " the",
	    " that"
	  ],
	  "<noun>": [
	    "dog",
	    "men",
	    "face",
	    "mama",
	    "chicken","goal in life",
	    "skinny woman","sneaky criminal","dragon","toilet seat"
	    
	    
	    
	  ],
	  "<adv>":[
	  "barely","arrogantly","joyfully","quickly","nastily",
	  "stealthily","successfully","unsuccessfully"

	  ],
	  "<verbT>": [
	    "runs over","sleeps","teachs","loves","attacks","blows","calls","cleans","drains"
	  ],
	  "<verbI>":[
	    "daydreams","agrees","disappears","goes","lives","vanishes","appears","collapses","cries","dies","sleeps"
	  ],
	  "<adj>":[
	  	"playfull",
	  	"ugly",
	  	"loser",
	  	"dirty","happy","addicted"
	  	,"anxios","defeated","fluffy","selfish"
	  	,"tight","elegant","spicy","massive","twisted","flirting"
	  	,"zombie like","narrow-minded"

	  	],

	  "<interj>":[
	    "wow,",
	    "oh,"
	  ]

	}

		rg.load(grammar,function(){console.log("grammar load...")});

		generate(text,from);


		
	}


	

	
}

//Stream TWEETED END----------------

function generate(text,from){
		
		var lastw;//ultima palabra

		var cleanText=text.replace(/[!|?|=|)|D|;|:|.|,|(|P|-|_|\d]/g,"");//lipiamos tweet

		var rs=new rita.RiString(cleanText);
		var lexicon = new rita.RiLexicon();
	
		palabras=rs.words();
	
	
	
		for(var i=0;i<palabras.length;i++){
			//console.log(palabras.length);
			
			lastw=palabras[i];//cojemos la ultima palabra
		}
	
		//var rimas=lexicon.rhymes(lastw);
		//console.log(rimas);

		//obtenemos una palabra que rima aleaoria de las que nos da rhmes()
		var rima=lexicon.rhymes(lastw)[Math.floor((Math.random() * lexicon.rhymes(lastw).length) + 1)]
		
		var result=rg.expand();//expand
		
		//console.log(lastw+", "+result+" "+rima);

		var newtweet=".@"+from+" "+"your are like the "+rima+", "+result;
		tweetIt(newtweet);
		console.log(newtweet);
		console.log("Respuesta automatica enviada a @"+from);
		
		
	}




//Stream FOLLOWED--------------------

stream.on('follow',followed);//anytime someone follows me

function followed(event){
	console.log("follow event");
	var name=event.source.name;//json data
	var screenName=event.source.screen_name;//json actual twitteraccount name
	tweetIt('.@'+screenName+' do you like Unicorns?');
	console.log('@'+screenName+' followed you!');

}

//Stream FOLLWED END----------------


//POST();


function tweetIt(mensaje){
	var tweet={
	status: mensaje 
	}

	T.post('statuses/update',tweet,tweeted )


	function tweeted(err, data, response) {
		if(err){
			console.log("Something went wrong...");
			console.log(err);
		}else{
			console.log("tweet Sent!");

		}
	 
	}


}

//POST(); END






