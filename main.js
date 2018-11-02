function reverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}

var app = new Vue({
	el: '.ttypo',
	data: {
		example: 'Something',
		typed: '',
		currentStatus: 0,
		timerStarted: false,
		correctSound: new Audio('single-key-press.mp3'),
		wrongSound: new Audio('swipe-over-keys.mp3')
	},
	mounted: function() {
		this.$el.querySelector('.--entered span').focus();
		this.$el.querySelector('.--entered span').innerText = this.typed;
	},
	computed:{
		isCorrectLetter: function(){
			var typedLettersCount = this.typed.length -1;
			if(this.typed[typedLettersCount] ===  this.example[typedLettersCount]){
				return true;
			}
			return false;
		},
		currentClass: function(){
			var status = {
				'--idle': false,
				'--pass': false,
				'--error': false
			};
			switch (this.currentStatus){
				case 0: status['--idle'] = true ; break;
				case 1: status['--pass'] = true ; break;
				case 2: status['--error'] = true ; break;
			}
			return status;
		},
		sortLetters: function(){
			var exampleLettersCount = this.typed.length -1;
			var styledTyped = '';

			for(var i = 0; i <= exampleLettersCount; i++){
				if(this.example[i] === this.typed[i]){
					styledTyped += this.typed[i];
				}else{
					styledTyped += '<a>'+this.typed[i]+'</a>';
				}
			}

			return styledTyped;
		},
		timer: function(){
			return '00:00';
		}
	},
	methods: {
		setFocus: function() {
			document.querySelector(".ttypo .--entered span").focus();
		},
		typing:function(event){

			this.typed = event.target.innerText;
			
			if(this.typed === this.example){
				console.log('pass');
			}

			if(this.isCorrectLetter){

				this.correctSound.currentTime=0;
				this.correctSound.play();
				this.currentStatus = 1;
			}else if(!this.isCorrectLetter){

				this.wrongSound.currentTime=0;
				this.wrongSound.play();
				this.currentStatus = 2;
			}
			setTimeout(function(){
				this.currentStatus = 0;
			}.bind(this), 300);

			event.target.innerHTML = this.sortLetters;
		},
		nexExample: function() {
			if(this.typed === this.example) {
				console.log('next');
			}
		}
	}
})