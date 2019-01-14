function setCaretToEnd(target) {
	const range = document.createRange();
	const sel = window.getSelection();
	range.selectNodeContents(target);
	range.collapse(false);
	sel.removeAllRanges();
	sel.addRange(range);
	target.focus();
	range.detach();
	target.scrollTop = target.scrollHeight; 
}

var app = new Vue({
	el: '.ttypo',
	data: {
		preloading: true,
		example: ['hi', 'example', 'some'],
		languages: ['en', 'ar'],
		selectedLanguages: [0, 0],
		currentExample: 0,
		typed: '',
		currentStatus: 0,
		timerStarted: false,
		correctLetterSound: new Audio('single-key-press.mp3'),
		nextWordSound: new Audio('success-powerup.mp3'),
		wrongLetterSound: new Audio('swipe-over-keys.mp3')
	},
	mounted: function() {
		this.preloading = false;
		this.$el.querySelector('.--entered span').focus();
		this.$el.querySelector('.--entered span').innerText = this.typed;
	},
	computed:{
		isCorrectLetter: function(){
			var typedLettersCount = this.typed.length -1;
			var exampleLettersCount = this.example[this.currentExample].length -1;
			if(this.typed[typedLettersCount].trim() ===  this.example[this.currentExample][typedLettersCount]){
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

			var typed = this.typed;
			var example = this.example[this.currentExample];
			
			var exampleLettersCount = typed.length -1;
			var styledTyped = [];


			if(typed[0].charCodeAt(0) != 160){
				for(var i = 0; i <= exampleLettersCount; i++){

					if(example[i] === typed[i]){
						styledTyped.push('<a class="--correct">'+typed[i]+'</a>');
					}else if(example[i] !== typed[i]){
						styledTyped.push('<a class="--wrong">'+typed[i]+'</a>');
					}

				}
			}
			var styledTypedReady = styledTyped.reverse().reverse().join("");

			return styledTypedReady;
		},
		timer: function(){
			return '00:00';
		}
	},
	methods: {
		setFocus: function() {
			document.querySelector(".ttypo .--entered .--area").focus();
		},
		nextExample: function(event) {
			if(this.typed.trim() === this.example[this.currentExample]) {
				if(this.currentExample+1 >= this.example.length){
					this.currentExample = 0;
				}else{
					this.currentExample += 1;
				}

				HTMLElement.prototype.empty = function() {
					while (this.firstChild) {
						this.removeChild(this.firstChild);
					}
				}

				this.typed = '';
				event.target.innerHTML = '';
			}
		},
		typing:function(event){

			this.typed = event.target.innerText;
			
			if(this.typed === this.example){
				console.log('pass');
			}

			if(this.isCorrectLetter){

				this.correctLetterSound.currentTime=0;
				this.correctLetterSound.play();
				this.currentStatus = 1;
			}else if(!this.isCorrectLetter){

				if(this.typed.trim() != ''){

					this.wrongLetterSound.currentTime=0;
					this.wrongLetterSound.play();
					this.currentStatus = 2;
				}else{

					this.nextWordSound.currentTime=0;
					this.nextWordSound.play();
				}
			}

			setTimeout(function(){
				this.currentStatus = 0;
			}.bind(this), 300);

			event.target.innerHTML = this.sortLetters;

			setCaretToEnd(event.target);
		},
	}
})