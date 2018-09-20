var qs = {
    
}
if (typeof(question) !== "undefined") {
    var answer = qs[question.question_id];
    $(".reya-image-input[value="+ answer +"]").click();
} else {
    $(".reya-image-input[value=1]").click();
}
