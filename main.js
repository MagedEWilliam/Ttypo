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
		example: ['Something', 'is', 'bieng', 'written', 'here'],
		currentExample: 0,
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

			for(var i = 0; i <= exampleLettersCount; i++){
				
				if(example[i] === typed[i]){
					styledTyped.push('<a class="--correct">'+typed[i]+'</a>');
				}else if(example[i] !== typed[i]){
					styledTyped.push('<a class="--wrong">'+typed[i]+'</a>');
				}
			}

			console.log(styledTyped.reverse().join(""))

			return styledTyped.reverse().join("");
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

			setCaretToEnd(event.target);
		},
		nextExample: function(event) {
			if(this.typed.trim() === this.example[this.currentExample]) {
				this.currentExample += 1;

				HTMLElement.prototype.empty = function() {
				    while (this.firstChild) {
				        this.removeChild(this.firstChild);
				    }
				}

				this.typed = '';
				event.target.innerHTML = '';
				
				console.log('next');
			}
		}
	}
})