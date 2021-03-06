
$(document).ready(function () {

    $('#deletebtn').click(function () {
        var id = $(this).attr('data-id');
        $.ajax({
            type: "DELETE",
            url: "/blog/deleteblog/" + id,
            success: function (result) {
                alert('deleting');
                window.location = '/blog/all'
            }
        });
    });

    $('#commentBtn').click(function () {
        var id = $(this).attr('data-id'); //get the blog id
        //var id = $(this).attr('data-id').split('|')[0]; //get the blog id
        //var commentor = $(this).attr('data-id').split('|')[1]; //get the current username or commentor
        var comment = $('#commentTxt').val();
        if (comment.trim().length > 0) {
            $.ajax({
                type: "POST",
                data: { comment: comment },
                url: "/blog/comment/" + id,
                success: function (result) {
                    window.location = '/blog/show/' + id
                }
            });
        }
    });


    $('#btnlike').click(function () {
        var id = $(this).attr('data-id'); //get the blog id

        //var id = $(this).attr('data-id').split('|')[0]; //get the blog id
        //var commentor = $(this).attr('data-id').split('|')[1]; //get the current username or commentor

        $.ajax({
            type: "POST",
            url: "/blog/like/" + id,
            success: function (result) {
                window.location = '/blog/show/' + id
            }
        });
    });


    $('#btndislike').click(function () {
        var id = $(this).attr('data-id'); //get the blog id

        //var id = $(this).attr('data-id').split('|')[0]; //get the blog id
        //var commentor = $(this).attr('data-id').split('|')[1]; //get the current username or commentor

        $.ajax({
            type: "POST",
            url: "/blog/dislike/" + id,
            success: function (result) {
                window.location = '/blog/show/' + id
            }
        });
    });





});