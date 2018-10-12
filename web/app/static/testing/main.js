$(function() {
    $('.btn-testing').on('click', function() {
        var data = {
            'group': $(this).data('group'),
            'name': $(this).data('name')
        };

        $.ajax({
             type: "GET",
             url: "/run",
             data: data,
             dataType: "json"
         });
    });
});