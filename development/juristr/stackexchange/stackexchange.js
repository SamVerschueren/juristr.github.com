steal(
	'jquery/controller',
	'jquery/controller/view',
	'jquery/view/ejs')
.then(
	)
.then(function(){
	
	$.Controller('Juristr.Stackexchange',{

		init: function(){
			this.element.html(this.view("stackoverflow"));
			this._loadFeedData();
			/* 
				Answers: http://api.stackexchange.com/2.0/users/50109/answers?site=stackoverflow
				Questions: http://api.stackexchange.com/2.0/questions/11518816;11518470?order=desc&sort=activity&site=stackoverflow
			*/
		},

		//privates
		_loadFeedData: function(){
			$.ajax({
				url: "http://api.stackexchange.com/2.0/users/50109/answers?site=stackoverflow&pagesize=5&callback=?",
				type: "GET",
				dataType: "JSON",
				success: this.proxy(function(result){
					//iterate all answers and remember question id's
					var questionIds = [];
					for(var i=0, l=result.items.length; i<l; i++){
						questionIds.push(result.items[i].question_id);
					}

					$.ajax({
						url: "http://api.stackexchange.com/2.0/questions/" + questionIds.join(";") + "?order=desc&sort=activity&site=stackoverflow",
						type: "GET",
						dataType: "JSON",
						success: this.proxy(function(questionResult){
							for(var i=0, l=result.items.length; i<l; i++){
								var matchingQuestion = this._findQuestionByQuestionId(result.items[i].question_id, questionResult.items);
								if(matchingQuestion !== null){
									result.items[i].questionTitle = matchingQuestion.title;
								}
							}

							$(".js-feed-content", this.element).html(this.view("feedlist", result.items));
						})
					});
				}),
				error: function(e){
					console.log("Oops, an error occured");
				}
			});
		},

		_findQuestionByQuestionId: function(questionId, questions){
			for(var i=0, l=questions.length; i<l; i++){
				if(questions[i].question_id === questionId){
					return questions[i];
				}
			}

			return null;
		}

	});

});