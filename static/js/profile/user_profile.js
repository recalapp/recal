// function UP_init()
// {
//     $('#first_name_box').val(USER.first_name);
//     $('#last_name_box').val(USER.last_name);
//     $('#first_name_box').on('change', function(ev){
//         USER.first_name = $(this).val();
//     });
//     $('#last_name_box').on('change', function(ev){
//         USER.last_name = $(this).val();
//     });
//     $(window).on('beforeunload', function(ev){
//         $.ajax('/put/user', {
//             async: false,
//             dataType: 'json',
//             type: 'POST',
//             data: {
//                 user: JSON.stringify(USER)
//             },
//         });
//     });
// }
