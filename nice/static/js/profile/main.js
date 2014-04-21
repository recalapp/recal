$(init)

function init()
{
    moment.tz.add({
        "zones": {
            "America/New_York": [
                "-4:56:2 - LMT 1883_10_18_12_3_58 -4:56:2",
                "-5 US E%sT 1920 -5",
                "-5 NYC E%sT 1942 -5",
                "-5 US E%sT 1946 -5",
                "-5 NYC E%sT 1967 -5",
                "-5 US E%sT"
            ]
        },
        "rules": {
            "US": [
                "1918 1919 2 0 8 2 0 1 D",
                "1918 1919 9 0 8 2 0 0 S",
                "1942 1942 1 9 7 2 0 1 W",
                "1945 1945 7 14 7 23 1 1 P",
                "1945 1945 8 30 7 2 0 0 S",
                "1967 2006 9 0 8 2 0 0 S",
                "1967 1973 3 0 8 2 0 1 D",
                "1974 1974 0 6 7 2 0 1 D",
                "1975 1975 1 23 7 2 0 1 D",
                "1976 1986 3 0 8 2 0 1 D",
                "1987 2006 3 1 0 2 0 1 D",
                "2007 9999 2 8 0 2 0 1 D",
                "2007 9999 10 1 0 2 0 0 S"
            ],
            "NYC": [
                "1920 1920 2 0 8 2 0 1 D",
                "1920 1920 9 0 8 2 0 0 S",
                "1921 1966 3 0 8 2 0 1 D",
                "1921 1954 8 0 8 2 0 0 S",
                "1955 1966 9 0 8 2 0 0 S"
            ]
        },
        "links": {}
    });
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    CacheMan_init();
    CourseMan_init();
    Cal_init();
    CL_init();
}
function enableAllInteractions()
{
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
