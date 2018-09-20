var qs = {
    
}

if (typeof(question) !== "undefined") {
    var answer = qs[question.question_id];
    answer = answer != "1" ? "1":"2";
    $(".reya-image-input[value="+ answer +"]").click();
} else {
    $(".reya-image-input[value=1]").click();
}
