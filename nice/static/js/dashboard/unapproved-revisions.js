function UR_pullUnapprovedRevisions()
{
    $.ajax('/get/unapproved', {
        async: true,
        dataType: 'json',
        success: function(data){
            console.log(data);
        },
    });
}
