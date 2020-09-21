//game logic and data structures go here

/*GAME RELATED CLASSES*/
/*----------------CARDS CLASS------------------*/
class card{
	constructor(suit, number){
		this.suit = suit;
		this.number = number;
		this.imageFileName;
		this.rank;
		this.setRank();
		this.generateImageFileName();
	}

	/*get pathname to file, of image icons of cards*/
	generateImageFileName(){
			//normalilze names
			this.suit = this.suit.charAt(0).toUpperCase() + this.suit.slice(1);

			switch(this.suit) {
				case "Hearts":
					this.imageFileName = "img/" + this.suit + "_" + this.rank + ".png";
					break;
				case "Diamonds":
					this.imageFileName = "img/" + this.suit + "_" + this.rank + ".png";
					break;
				case "Clubs":
					this.imageFileName = "img/" + this.suit + "_" + this.rank + ".png";
					break;
				case "Spades": 
					this.imageFileName = "img/" + this.suit + "_" + this.rank + ".png";
					break;
			}   
		
	}

	setRank(){
		/*generate a card with suit and value*/
		if(this.number < 0 || this.number >13)
		{
			console.log("Invalid Card Number, only enter 1-13");
		}
		
		//generate values
		if(this.number >= 2 && this.number <=13)
			this.rank = this.number;
		else if(this.number == 1)  
			this.rank = 14;
		}

	getcardSuit(){
		return this.suit;
	}

	getNumber(){
		return this.number;
	}

	getRank(){
		return this.rank;
	}

	getImageFileName(){
		return this.imageFileName;
	}
}

/*-------------------HAND CLASS-------------------*/

class deck{
	constructor(){
		this.deck = []; 
		this.generateDeck();
		this.index = 0;
		this.shuffle();
		this.index=0;
	}

	generateDeck(){

		for(let i=1; i< 14; i++){		
			//generate all 52 cards, 13 for each suit in order
			this.deck[i-1] = new card("hearts", i);

			this.deck[i+12] = new card("Diamonds", i);
			
		    this.deck[i+25] = new card("Clubs", i);
		    
		    this.deck[i+38] = new card("Spades", i);
		}
	}

	//function to shuffle the deck
	shuffle() {
		var temp1, temp2;
		
		let index = 0;
		for(var numSwaps=0; numSwaps < 1000; numSwaps++) {
			//get 2 cards in position i, store in temp, replace each with the other
			let ran_num = Math.floor(Math.random()*(52));
			temp1 = this.deck[ran_num];
			temp2 = this.deck[index];
			this.deck[ran_num] = temp2;
			this.deck[index] = temp1; 
			index++;
			index = index%52;
		}
	}

	//return a copy of the top card on the deck, increase index. simulate drawing a card off a deck
	drawCard(){
		if(this.index < 52){
			var temp = this.deck[this.index];
			this.index++;
			return temp;
		}
	}

	//resets the index to deck
	resetIndex(){
		this.index = 0;
	}

	//return number of cards remaining in deck
	cardsRemaining(){
		return 52-this.index;
	}

	//reset the deck, resets index and shuffles deck, essentially a fresh deck
	resetDeck(){
		this.resetIndex();
		this.shuffle();
	}
}


/*---------------Player Class ---------------*/
class player{

	constructor(deck, name){
		this.name = name;
		this.deck = deck;
		this.hand = new Array(5);
		this.handValue = [0,0,0];
		this.tokens = 100;
		this.replace = 0;
		this.generateHand();
		this.assignValue();
	}

	//create a hand for player
	generateHand(){
		
	    for(var i = 0; i < 5; i++){
			//draw 5 cards
			this.hand[i] = this.deck.drawCard();
	}
	}

	//reset the tokens of player to 100
	resetTokens(){
		this.tokens = 100;
	}

	//add tokens
	addTokens(add){
		this.tokens += add;
		
		//return how much was won
		return add; 
	}

	//subtract tokens
	subtractTokens(sub){
		this.tokens -= sub;
		
		//return how much was lost
		return sub;
	}

	//replace cards in hand
	changeCards(c1, c2, c3, c4, c5){
		var cardsToReplace = [0,0,0,0,0];
		if(c1 < 0 || c2 < 0 ||c3 < 0 ||c4 < 0 ||c5 < 0){
			console.log("Invalid index... only enter 0-4");
		}
		if(c1 > 4 || c2 > 4 ||c3 > 4 ||c4 > 4 ||c5 > 4){
			console.log("Invalid index... only enter 0-4");
		}
		//increment replace counter, max 1 per round
		this.replace++;
		cardsToReplace[0] = c1;
		cardsToReplace[1] = c2;
		cardsToReplace[2] = c3;
		cardsToReplace[3] = c4;
		cardsToReplace[4] = c5;
		
		for(let i = 0; i < 5; i++){
			if(cardsToReplace[i] === 1) {
				this.hand[i] = this.replaceCard();	
			}
		}
	}

	//function draw a single card from deck
	replaceCard(){
		return this.deck.drawCard();
	}

	//asign value of hand combination
	assignValue() {
				//check highest combinations first
				if(this.isRoyalFlush())
					return;
				if(this.isStraightFlush()) 
					return;
				//check for flush
				if(this.isFlush())
					return;
				//check for straight
				if(this.isStraight())
					return;
				//check for duplicate combinations
				this.handValue = this.checkDuplicateCases(this.hand);
	}

	//check for straight flush
	isStraightFlush(){
		if(this.isFlush() && this.isStraight()){
			this.handValue[0] = 8;
			return true;
		}
		else
			return false;
	}

	//check for straight
	isStraight() {
		let values = this.normalizeHand(this.hand);
		//look for the highest straight
		if(values[0]==1 && values[1] ==10 && values[2] == 11 && values[3] == 12 && values[4] == 13){
			//this is the BROADWAY straight
			//update values
			this.handValue[0] = 4;
			this.handValue[1] = 14;  //strength of highest card, the ace = 14
			return true;
		}
		else if((values[0] +1) == values[1] && (values[1]+1) == values[2] && (values[2]+1) == values[3] && (values[3] +1) == values[4])
			{
				this.handValue[0] = 4;
				this.handValue[1] = values[4];
				return true;
			}
		
		return false;
			
		}

		//complimentary function for finding straights, orders hand in increasing numerical order
		normalizeHand(hand) {
		
		let temp = [0,0,0,0,0];
		
		for(let i=0; i<5; i++){
			temp[i] = this.hand[i].getNumber();
		}
		
		temp = temp.sort();
		
		return temp;
	}

	//check for flushes
	isFlush() {  
		
		if((this.hand[0].getcardSuit() == this.hand[1].getcardSuit()) && (this.hand[1].getcardSuit() == this.hand[2].getcardSuit()) && (this.hand[2].getcardSuit() == this.hand[3].getcardSuit()) && (this.hand[3].getcardSuit() == this.hand[4].getcardSuit()))
		{
			this.handValue[0] = 5;							
			this.handValue[1] = this.getLargestValueFromHand(); 	
			return true;
		}
		else {
			return false;		
		}
	}

	//check for royal flush
	isRoyalFlush(){
		//check for the values 10,J,Q,K,A
		var hasValues = [false, false, false, false, false];
		
		//first check for a regular flush
		if(this.handValue[0] == 5) { 
		//check for 10, J, Q, K, A
			for(let i=0; i<5; i++) {
				if(this.hand[i].getRank() == 14)
					hasValues[0] = true;
				else if(this.hand[i].getRank() == 10)
					hasValues[1] = true;
				else if(this.hand[i].getRank() == 11)	
					hasValues[2] = true;
				else if(this.hand[i].getRank() == 12)
					hasValues[3] = true;
				else if(this.hand[i].getRank() == 13)	
					hasValues[4] = true;
		}
	}
		//if it is true that all the values are found then set the value of the hand to best hand value =9
		if(hasValues[0] && hasValues[1] && hasValues[2] && hasValues[3] && hasValues[4])
			{
			this.handValue[0] = 9;
			return true;
			}
		return false;
	}

	//check duplicate cards in hand e.g. king hearts king spades... etc.
	checkDuplicateCases(){						
	 															
		var value = [0,0,0];  
		var handValues = [0,0,0,0,0];
		var numOfRepeats = [1,1,1,1,1];
		
		for(let i=0; i< 5; i++){
			handValues[i] = this.hand[i].getRank();
		}
	
		//look for duplicates and populate numOfRepeats array
		for(var i=0; i<4; i++) {
			for(var j=i+1; j<5; j++){
				if(handValues[i]== handValues[j])
				{
					numOfRepeats[i]++;		
				}
			}
		}
		
		//from strongest hand to weakest...
		//4 of a kind, search for a single 4 in numOfRepeats
		for(let i = 0; i<5; i++){
			if(numOfRepeats[i] == 4){
				value[0] = 7;				//strength of 4 of a kind
				value[1] = handValues[i];	//4 of a kind card value
				return value;
			}
		}
		
		//Full House, search for a single 3 and 2 pairs
		let num2s = 0, num3s =0, val3ofKind= 0, val2ofKind = 0;
		for(let i = 0; i<5; i++){
			
			if(numOfRepeats[i] == 3) {
				num3s++;
				val3ofKind = handValues[i];
			}
			else if(numOfRepeats[i] == 2) {
				num2s++;
				if(handValues[i] != val3ofKind){
					val2ofKind = handValues[i];
				}
			}
		}
		if(num3s == 1 && num2s == 2)
		{
			value[0] = 6;
			value[1] = val3ofKind;
			value[2] = val2ofKind;
			return value;
		}
		
		//3 of a kind, so search for a single 3 in numOfRepeats
		for(let i = 0; i<5; i++){
			if(numOfRepeats[i] == 3){
				value[0] = 3;				//strength of 3 of a kind
				value[1] = handValues[i];	//3 of a kind card value
				return value;
			}
		}
		
		//2 pair, so search for two 2s in numOfRepeats
		num2s = 0;
		let pair1 = 0, pair2 = 0;
		for(let i = 0; i<5; i++){
			if(numOfRepeats[i] == 2){
				num2s++;
				if(num2s == 1){
					pair1 = handValues[i]; 
				}
				else if(num2s == 2) {
					pair2 = handValues[i]; 
				}
			}
		}
		if(num2s == 2) {
			value[0] = 2;						//strenght of 2 pair
			value[1] = Math.max(pair1, pair2);	//bigger pair
			value[2] = Math.min(pair1, pair2);	//smaller pair
			return value;
		}
		
		
		//1 pair, so search for a single 2 in numOfRepeats
		for(let i = 0; i<5; i++){
			if(numOfRepeats[i] == 2){
				value[0] = 1;				//strength of 2 of a kind
				value[1] = handValues[i];	//2 of a kind card value
				return value;
			}
		}
		
		//nothing special found, just calculate the biggest card in hand
		value[1] = this.getLargestValueFromHand();
		return value;
	}

	//getter functions
	
	//return the largest value in hand
	getLargestValueFromHand() {
		let largest= 0;
		for(var i =0; i<5; i++)
		{
			largest = Math.max(this.hand[i].getRank(), largest);
		}
		return largest;
	}

	//return tokens
	getTokens() {return this.tokens;}

	//setter functions
	incrementReplaceCTR() {this.replace = 1;}
	resetReplaceCTR() {this.replace = 0;}
	getHandValue(){return this.handValue};

	displayHandValue() {
		
		switch(this.handValue[0])
		{
		case 0: return "Nothing was found, the largest card in hand is " + this.handValue[1];
		case 1: return "Hand contains 1 pair, value of pair is " + this.handValue[1];
		case 2: return "Hand contains 2 pairs, Larger pair value is " + this.handValue[1] +" Smaller pair value is " + this.handValue[2];
		case 3: return "Hand contains three of a kind, three of a kind value is " + this.handValue[1];
		case 4: return "Hand contains a straight, largest number in straight is is " + this.handValue[1];
		case 5: return "Hand contains a flush, larger value in flush is " + this.handValue[1];
		case 6: return "Hand contains a full house, three of kind has value of " + this.handValue[1] + "Pair has value of " + this.handValue[2];
		case 7: return "Hand contains a four of a kind, value of 4 of a kind is " + this.handValue[1];
		case 8: return "Hand contains a straight flush, highest value in flush is " + this.handValue[1];
		case 9: return "Hand contains a royal flush";
		}
		return " ";
	}

}

/--------------------GAME CONTROLLER--------------------/

class GameCtrl{

	constructor(){
		this.deck = new deck();
		this.player = new player(this.deck, "player");
		this.dealer = new player(this.deck, "dealer");
		this.cardsToChange = [0,0,0,0,0];
		this.endTurn = false;	
		this.handChangeCounter = 0;
	}

	compareHands(){
		//returning zero means dealer wins, returning 1 means player wins, returning 2 means tie
		//remember, HandVal1 is p1, and HandVal2 is dealer
		
		let temp1, temp2;
		
		temp1 = this.player.getHandValue();
		temp2 = this.dealer.getHandValue();

		
		//return name of player who's hand has a better combination
		if(temp1[0] > temp2[0])
			return 1;
		else if(temp2[0] > temp1[0])
			return 0;
		
		//if they tie..
		else if(temp1[0] == temp2[0]) {
			
			//if no combinations on either hand, use largest card value in hand to compare
			if(temp1[0] == 0)
			{
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				else 
					return 2;
			}
		
			//if they tie with a pair each, use larger of the pairs
			if(temp1[0] == 1)
			{
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				else 
					return 2;
			}
			
			//if tie with two pair
			if(temp1[0] == 2)
			{	//compare the larger pairs in each hand to determine winner
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				//if it's a tie, compare with smaller pairs in each hand
				else if(temp2[1] == temp1[1]) {
					if(temp1[2] > temp2[2])
						return 1;
					else if(temp2[2] > temp1[2])
						return 0;
					else if(temp2[2] == temp1[2])
						return 2;
				}
			}
			
			//case 3 of a kind
			if(temp1[0] == 3)
			{	//compare the 3 of a kind value
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				//if it's a tie still
				else if(temp2[1] == temp1[1])
						return 2;	//for now, just declare hand a tie... need to add method to check the remaining two card sizes
			}	
			
			//case tie with a straight 
			if(temp1[0] == 4)
			{	//compare highest card in straight
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				//if it's a tie still
				else if(temp2[1] == temp1[1])
						return 2;	//still a tie
			}	
			
			//case flush tie
			if(temp1[0] == 5)
			{	//compare highest card in flush
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				//if it's a tie still
				else if(temp2[1] == temp1[1])
						return 2;	//still a tie
			}	
			
			//case full house tie
			if(temp1[0] == 6){
				//compare 3 of a kind value
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				//if it's a tie still
				else if(temp2[1] == temp1[1]) { //compare 2 of a kind value
					if(temp1[2] > temp2[2])
						return 1;
					else if(temp2[2] > temp1[2])
						return 0;
					else if(temp2[2] == temp1[2])
						return 2;
				}
					
					
					
			}
			
			//case 7: //four of a kind
			if(temp1[0] == 7){
				//compare 4 of a kind value
				if(temp1[1] > temp2[1])
					return 1;
				else if(temp2[1] > temp1[1])
					return 0;
				//if it's a tie still
				else if(temp2[1] == temp1[1]) { 
					
						return 2;		//for now, just leave as tie, needs method to find the value of the fifth card
				}
			}
			//case 8: //straight flush
				if(temp1[0] == 8){
					//compare highest card in flush
					if(temp1[1] > temp2[1])
						return 1;
					else if(temp2[1] > temp1[1])
						return 0;
					//if it's a tie still, then return tie
					else if(temp2[1] == temp1[1]) { 
						
							return 2;		
					}
				}
			//case 9: //royal flush
			if(temp1[0] == 9)
			{
				return 2; //tie no matter what
			}
		}
		return 0;
	}

	//update credits based on what is said to be awarded in the rules
	updateCredits(){

			this.player.subtractTokens(3);

			if(this.compareHands()===1){
				switch(this.player.handValue[0]){

					case 1: this.player.addTokens(6);
					return 6;

					case 2: this.player.addTokens(12);
					return 12;

					case 3:this.player.addTokens(24);
					return 24;

					case 4:this.player.addTokens(48);
					return 48;

					case 5:this.player.addTokens(102);
					return 102;

					case 6:this.player.addTokens(205);
					return 205;

					case 7:this.player.addTokens(417);
					return 417;

					case 8:this.player.addTokens(837);
					return 837;

					case 9:this.player.addTokens(1500);
					return 1500;

					default: this.player.addTokens(6);
					return 6;
				} 
			}
			else
				return -3;
		}
	

	/*these two functions indicate if the turn is over*/
	roundOver(){
		//turn is over
		this.endTurn = true;
	}

	newRound(){
		//begin a new turn
		this.endTurn = false;
	}

	resetHandChangedCounter(){
		this.handChangeCounter = 0;
	}

	//add toggle action to card selecting
	toggle(index){
		if(this.cardsToChange[index] === 1)
			this.cardsToChange[index] = 0;
		else
			this.cardsToChange[index] = 1;
	}

	resetAllCardsToChange(){
		for(var i = 0; i<5; i++)
			this.cardsToChange[i] = 0;
	}

}



//All functions related to UI updating go here
class UICtrl{

	constructor(game){
		this.game = game;
		this.dealer = '.Dcard';
		this.player = '.Pcard';
		this.winner = '.round-status';
		this.dealerHand = '.dealer-value';
		this.playerHand = '.player-value';
		this.playerScore = '.score';
		this.scoreChange = '.score-change'
	}

	//reveal players'hands
	displayHand(player){
			
			var dom;
			if(player.name === "dealer")
				dom = ".Dcard";
			else if(player.name === "player")
				dom = ".Pcard";

			let time = 600;
			for(let i =1; i<=5; i++){
				setTimeout(()=> {this.displayACard(dom, i)}, time);
				time += 600;
			}
	}

	//reset players' hands
	resetHand(player){
		var dom;
			if(player.name === "dealer")
				dom = ".Dcard";
			else if(player.name === "player")
				dom = ".Pcard";

		for(let i =1; i<=5; i++){
				setTimeout(()=> {this.resetACard(dom, i)}, 100);
			}
	}

	//remove cards that were chosen to be swapped from DOM
	removeSpecificCards(){

		var dom = ".Pcard";

		for(let i = 1; i<=5; i++){
			if(this.game.cardsToChange[i-1] === 1)
				setTimeout(()=> {this.resetACard(dom, i)}, 300);
		}

	}

	//DOM command to show a card in hand
	displayACard(playerType, cardNum){
		if(playerType === ".Dcard")
			document.querySelector(playerType + "-" + cardNum ).src = this.game.dealer.hand[cardNum-1].getImageFileName();
		else if(playerType === ".Pcard")
			document.querySelector(playerType + "-" + cardNum ).src = this.game.player.hand[cardNum-1].getImageFileName();
	}

	//DOM command to reset a card in hand
	resetACard(playerType, cardNum){
		
		document.querySelector(playerType + "-" + cardNum ).src = 'img/DeckPattern.jpg';
	}

	//function to enable desired menu item
	static showElement(el){

		let enable = "block";
		let disable = "none";

		let element = document.querySelector(el);
		if(element.style.display === "none" ||element.style.display === "" )
			document.querySelector(el).style.display = enable;
		else
			document.querySelector(el).style.display = disable;
	}

	//function to hide the menu item enabled by showElement()
	static hideElement(el){
		document.querySelector(el).style.display = "none";	
	}

	//disable menu items when click anywhere else outside 
	static hideAll(e){
		
		if(e.target.id === "help")
		{	
			UICtrl.hideElement(".box-rules");
		}
		else if(e.target.id === "rules")
		{
			UICtrl.hideElement(".box-help");
		}
		
		else
		{ 	UICtrl.hideElement(".box-rules");
			UICtrl.hideElement(".box-help");
		}
	}


	//display message on UI that the player won, lost or tied to dealer
	updateRoundResult(win){

		let result;

		if(win === 1)
			result = 'Player 1 Wins!';
		else if(win === 2)
			result = "Tie!";
		else if(win === 0)
			result = "Dealer Wins!";

		document.querySelector(this.winner).innerHTML = result;
	}

	//update score change based on the winner 
	showScoreChange(winner, scoreChange){
		let result;

		//if player wins, display the gain
		if(winner === 1)
			document.querySelector(this.scoreChange).innerHTML = "+ " + scoreChange;
		//otherwise, display the loss of 3 tokens
		
		else if(winner === 2|| winner === 0)
			document.querySelector(this.scoreChange).innerHTML = " - " + "3";
		
		//any other value resets this UI display
		else
			document.querySelector(this.scoreChange).innerHTML = "--";
	}

	updatePlayerScore(score){
		document.querySelector(this.playerScore).innerHTML = score;

	}

	//update the UI dealer and player vales, these inptus are strings
	displayHandValues(dealer, player){
		
		document.querySelector(this.dealerHand).innerHTML = dealer;
		document.querySelector(this.playerHand).innerHTML = player;
		
	}

	showMessageToPlayer(message){
		document.querySelector(this.playerHand).innerHTML = message;
	}

	ToggleBorder(el, val){
		if(val === 1)
			document.querySelector("."+ el).style.border = "1px solid blue";
		else
			document.querySelector("."+ el).style.border = "none";
	}

	RemoveCardBorders(){
		document.querySelector(".Pcard-1").style.border = "none";
		document.querySelector(".Pcard-2").style.border = "none";
		document.querySelector(".Pcard-3").style.border = "none";
		document.querySelector(".Pcard-4").style.border = "none";
		document.querySelector(".Pcard-5").style.border = "none";
	}

	clearMessagesForNewRound(){
		document.querySelector(this.dealerHand).innerHTML = "";
		document.querySelector(this.playerHand).innerHTML = "";
		document.querySelector(this.winner).innerHTML = "---";
		this.showScoreChange(5, "anything");
	}

	clearAllMessages(){
		document.querySelector(this.dealerHand).innerHTML = "";
		document.querySelector(this.playerHand).innerHTML = "";
		document.querySelector(this.winner).innerHTML = "---";
		document.querySelector(this.playerScore).innerHTML = "100";
		this.showScoreChange(5, "anything");
	}


}
//the interface between the UICtrl and the Game data
class Ctrl{

	constructor(){
		this.game = new GameCtrl();
		this.UI = new UICtrl(this.game);
	}

	setUpEventListeners(){

		//help button
		document.querySelector("#help").addEventListener('click', function(){
			UICtrl.showElement(".box-help");
		});

		//rules button
		document.querySelector("#rules").addEventListener('click', function(){
			UICtrl.showElement(".box-rules");
		});
		//remove help sections when clicking anywhere 
		document.body.addEventListener('click', function(e){
			UICtrl.hideAll(e);
		});

		//new game button
		document.querySelector("#new-game").addEventListener('click', this.newGame.bind(this));

		//go button
		document.querySelector(".go").addEventListener('click', this.go.bind(this));
		
		//trade cards button		 
		document.querySelector(".trade-cards").addEventListener('click', this.tradeCards.bind(this));
		
		//next ro und button
		document.querySelector(".next-round").addEventListener('click', this.nextRound.bind(this));

		//card objects
		for(var i = 1; i<=5; i++)
		  	document.querySelector(".Pcard-" + i).addEventListener("click", this.cardEvent.bind(this));

	}

	//event handler functions
	go(){
		//check that player has tokens
		if(this.UI.game.player.tokens > 0){
			if(!this.UI.game.endTurn){
			//variable to hold result of calc winner 0 for dealer wins, 1 for p1 wins, 2 for draw
			 let winner;

			 let tokensWon;

			 //1. calculate winner
			  winner = this.UI.game.compareHands();
			  
			//2.update hand values for each to UI
			 this.UI.displayHandValues(this.UI.game.dealer.displayHandValue(), this.UI.game.player.displayHandValue());
			
			 //3. update updateCredit in memory, save amont of tokens won in a variable
			 tokensWon = this.UI.game.updateCredits();
			 
			 //4. message to user that he won
			 this.UI.updateRoundResult(winner);

			 //5. update dom credit display
			 this.UI.updatePlayerScore(this.UI.game.player.tokens);

			 //6. show change in tokens to user 
			 this.UI.showScoreChange(winner, tokensWon);

			 //7. end round
			 this.UI.game.roundOver();

			 //8.disable ChangeCards button
			 this.UI.game.handChangeCounter+=5;

			}
		}
	}

	tradeCards(){
      if(this.UI.game.player.tokens > 0){	
        //check that this button hasn't been pressed yet
		if(this.UI.game.handChangeCounter === 0){		 

		 //increment counter for player
		 this.UI.game.handChangeCounter++;

		 //display message to player
		 this.UI.showMessageToPlayer("Click cards that you want to swap, double click to unselect. <br>"
			+"Click the 'Trade Cards' button to complete swap.");

		 return;
	 	 }
	  
	

		//if change cards is pressed again, swap the cards selected in first if statement
		if(this.UI.game.handChangeCounter === 1){

			//swap the cards
			this.UI.game.player.changeCards(...this.UI.game.cardsToChange);

			//update new hand value
			this.UI.game.player.assignValue();
			
			//increment the handchange counter
			this.UI.game.handChangeCounter++;
			
			//update cards to UI
			this.UI.removeSpecificCards();
			this.UI.displayHand(this.UI.game.player);

			return;
		}
	  }
	}

	cardEvent(e){
		var className, cardNum;
	  if(this.UI.game.player.tokens > 0){  		
		if(this.UI.game.handChangeCounter === 1){
		  		//get target hand value
		  		className = e.target.className;
		  		cardNum = parseInt(className.slice(className.length-1));
		  		
		  		//toggle the correct card that is desired to be changed
		  		//and highlight the card in UI
		  		switch(cardNum){
		  			case 1: this.UI.game.toggle(0);
		  					this.UI.ToggleBorder(className, this.UI.game.cardsToChange[0]);
		  			break;
		  			case 2: this.UI.game.toggle(1); 
		  					this.UI.ToggleBorder(className, this.UI.game.cardsToChange[1]);
		  			break;
		  			case 3: this.UI.game.toggle(2); 
		  					this.UI.ToggleBorder(className, this.UI.game.cardsToChange[2]);
		  			break;
		  			case 4: this.UI.game.toggle(3); 
		  					this.UI.ToggleBorder(className, this.UI.game.cardsToChange[3]);
		  			break;
		  			case 5: this.UI.game.toggle(4); 
		  					this.UI.ToggleBorder(className, this.UI.game.cardsToChange[4]);
		  			break;
		  		}
		}
   	  }
	}

	newGame(){

		//1. reset all variables in memory
			this.game = new GameCtrl();
			this.UI.game = this.game;

			//display dealer's hand
			this.UI.resetHand(this.UI.game.dealer);
			this.UI.displayHand(this.UI.game.dealer);

			//display player's hand
			this.UI.resetHand(this.UI.game.player);
			this.UI.displayHand(this.UI.game.player);

			//reset hand values
			this.UI.clearAllMessages();

	}

	nextRound(){

		if(this.UI.game.player.tokens > 0){
			//flag state of game as new round
			this.UI.game.newRound();

			//reset handChangedCounter
			this.UI.game.resetHandChangedCounter();	
			

			//resetCardsToChange Array
			this.UI.game.resetAllCardsToChange();		
			

			//reset deck
			this.UI.game.deck.resetIndex();

			//shuffle deck
			this.UI.game.deck.shuffle();
			
			//draw new cards for dealer
			this.UI.game.dealer.generateHand();

			//draw new cards for player
			this.UI.game.player.generateHand();

			//calculate new hand values 
			this.UI.game.dealer.assignValue();
			this.UI.game.player.assignValue();		

			//display to UI new dealer hand
			this.UI.resetHand(this.UI.game.dealer);
			this.UI.displayHand(this.UI.game.dealer);

			//display to UI new player hand
			this.UI.resetHand(this.UI.game.player);
			this.UI.displayHand(this.UI.game.player);

			//reset messages for new round only
			this.UI.clearMessagesForNewRound();

			//remove borders
			this.UI.RemoveCardBorders();
		}
	}

	init(){

		//set up event listeners for all buttons
		this.setUpEventListeners();

		//display the dealers cards
		this.UI.displayHand(this.UI.game.dealer);

		//display
		this.UI.displayHand(this.UI.game.player);

		//display players credits
		this.UI.updatePlayerScore(100);

	}
}

var ctrl = new Ctrl();

ctrl.init();
