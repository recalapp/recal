/***************************************************
 * Settings Module
 **************************************************/
var SE_id = 'settingsModal';
function SE_init()
{
    $('#' + SE_id).on('show.bs.modal', function(){
        // set up
        var agenda_scm = SE_addTypeSegmentedControlWithFilter('Visible in agenda:', AGENDA_FILTER);
        $(this).find('#agenda_options').append(agenda_scm);
        var calendar_scm = SE_addTypeSegmentedControlWithFilter('Visible in calendar:', CAL_FILTER);
        $(this).find('#calendar_options').append(calendar_scm);
        var theme_sc = SC_initWithChoices('Theme', [
            {
                value: 'w',
                pretty: 'White',
                selected: THEME == 'w',
            },
            {
                value: 'b',
                pretty: 'Black',
                selected: THEME == 'b',
            },
        ]);
        $(theme_sc).on('select', function(ev, choices){
            var chosen;
            $.each(choices, function(key, selected){
                if (selected) {
                    chosen = key;
                    return false;
                }
            });
            THEME = chosen;
            if (chosen == 'w')
                loadWhiteTheme();
            else
                loadDarkTheme();
        });
        $(this).find('#theme_options').append(theme_sc);
        var hidden_sc = SC_initWithChoices('Show hidden events', [
            {
                value: 1,
                pretty: 'Yes',
                selected: EventsMan_showHidden(),
            },
            {
                value: 0,
                pretty: 'No',
                selected: !EventsMan_showHidden(),
            }
        ]);
        $(hidden_sc).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                    EventsMan_showHidden(Boolean(parseInt(key)));
            });
        });
        $(this).find('#hidden_options').append(hidden_sc);

        var choices = [];
        $.each(COURSE_MAP, function(key, value){
            choices.push({
                value: key,
                pretty: value,
                selected: !(key in COURSE_FILTER_BLACKLIST),
            });
        });
        var course_scm = SCM_initWithChoices('Visible courses:', choices);
        $(course_scm).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                    COURSE_FILTER_BLACKLIST.remove(key);
                else
                    COURSE_FILTER_BLACKLIST.add(key);
            });
        });
        $(this).find('#course_options').append(course_scm);
        var tz_sc = SC_initWithChoices('Use Princeton\'s timezone:', [
                {
                    value: 1,
                    pretty: 'Yes',
                    selected: MAIN_TIMEZONE != null,
                },
                {
                    value: 0,
                    pretty: 'No',
                    selected: MAIN_TIMEZONE == null,
                }
            ]);
        $(tz_sc).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                {
                    if (key == 1)
                    {
                        // princeton
                        MAIN_TIMEZONE = PRINCETON_TIMEZONE;
                    }
                    else
                    {
                        // local
                        MAIN_TIMEZONE = null;
                    }
                }
            });
        });
        $(this).find('#timezone_options').append(tz_sc);
    });
    $('#' + SE_id).on('hide.bs.modal', function(){
        // save
        $(this).trigger('close');
        $.ajax('/put/ui-pref', {
            dataType: 'json',
            type: 'POST',
            data: {
                agenda_pref: JSON.stringify(AGENDA_FILTER),
                calendar_pref: JSON.stringify(CAL_FILTER),
                ui_pref: JSON.stringify({
                    theme: THEME,
                })
            },
            loadingIndicator: false,
        });
    });
    $('#' + SE_id).on('hidden.bs.modal', function(){
        SC_removeAllFromContainer(this);
    });
}
function SE_addTypeSegmentedControlWithFilter(heading, filter)
{
    var choices = [];
    $.each(TYPE_MAP, function(key, value) {
        choices.push({
            value: key,
            pretty: value,
            selected: filter.contains(key),
        });
    });
    var scm = SCM_initWithChoices(heading, choices);
    $(scm).on('select', function(ev, choices){
        filter.splice(0, filter.length);
        $.each(choices, function(type, selected){
            if (selected)
                filter.push(type);
        });
    });
    return scm;
}

// Tutorial modal
function Tutorial_Setup() {
    // Activates tutorial modal on first page load.
    // Then sets cookie to remember that we've already seen it.

    // IE8-compatible refactor from http://stackoverflow.com/a/13865075/130164

    if($.cookie('tutorial_msg') != null && $.cookie('tutorial_msg') != "")
    {
        $("div#tutorialModal.modal, .modal-backdrop").hide();
    }
    else
    {
        $('#tutorialModal').modal('show');
        $.cookie('tutorial_msg', 'str');
    }
}
