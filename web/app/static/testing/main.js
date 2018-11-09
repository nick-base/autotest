$(function() {
    function formatJson(json) {
        if (typeof json != 'string') {
            str = JSON.stringify(json, undefined, 2);
        } else {
            str = json;
        }
        str = str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    $('.btn-testing').bind('contextmenu', function(){
        return false;
    });

    function run(target, flag) {
        var data = {
            'project': $(target).data('project'),
            'group': $(target).data('group'),
            'name': $(target).data('name'),
            'run': flag
        };
        var block = $(target).closest('.card');

        $.ajax({
            type: "GET",
            url: "/v/run",
            data: data,
            dataType: "json",
            success: function(response) {
                if (flag == 0 && response) {
                    var data = formatJson(response.data),
                        config = formatJson(response.config);
                    $('.result').hide()
                    if (data) {
                        block.find('.result').html(data).show();
                    } else {
                        block.find('.result').html(config).show();
                    }
                }
            }
        });
    }

    $('.btn-testing').mousedown(function(event) {
        if (1 == event.which) {
            run(this, 1);
        }
        if (3 == event.which) {
            run(this, 0);
        }
    })
});
