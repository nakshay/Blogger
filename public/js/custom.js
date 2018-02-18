
$(document).ready(function(){
    $('#deletebtn').click(function(){
        var id = $(this).attr('data-id'); 
        $.ajax({
            type: "DELETE",
            url: "/user/deleteblog/"+id,
            success: function(result) {
                alert('deleting');
                window.location='/user/blogs'
            }
        });
    });
});