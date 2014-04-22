$(function() {
        var cache = {};
        $( "#class" ).autocomplete({
            minLength: 3,
            source: function( request, response ) {
                var term = request.term;
                if ( term in cache ) {
                    response( cache[ term ] );
                    return;
                }
                $.getJSON( "/api/classlist", request, function( data, status, xhr ) {
                    cache[ term ] = data;
                    response( data );
                    /* data should be like 
                     * [{
                     * value: "jquery",
                     * label: "jQuery",
                     * desc: "the write less, do more, JavaScript library"
                     * },] */
                });
            },
            focus: function( event, ui ) {
                $( "#class" ).val( ui.item.label );
                return false;
            },
            select: function( event, ui ) {
                // TODO: add class checkbox
                $( "#class" ).val( ui.item.label );
                $( "#class-id" ).val( ui.item.value );
                $( "#class-description" ).html( ui.item.desc );
                return false;
            }
        }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li>" ).append( "<a>" + item.label + "<br>" + item.desc + "</a>" ).appendTo( ul );
        };
});
