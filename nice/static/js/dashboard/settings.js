var SE_id = 'settingsModal';
function SE_init()
{
    $('#' + SE_id).on('show.bs.modal', function(){
        // set up
        var agenda_scm = SE_addTypeSegmentedControlWithFilter('Agenda', AGENDA_FILTER);
        $(this).find('#agenda_options').append(agenda_scm);
        var calendar_scm = SE_addTypeSegmentedControlWithFilter('Calendar', CAL_FILTER);
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
                value: true,
                pretty: 'Yes',
                selected: EventsMan_showHidden(),
            },
            {
                value: false,
                pretty: 'No',
                selected: !EventsMan_showHidden(),
            }
        ]);
        $(hidden_sc).on('select', function(ev, choices){
            $.each(choices, function(key, selected){
                if (selected)
                    EventsMan_showHidden(key);
            });
        });
        $(this).find('#hidden_options').append(hidden_sc);
    });
    $('#' + SE_id).on('hide.bs.modal', function(){
        // save
        $('#settingsModal').trigger('close');
    });
    $('#' + SE_id).on('hidden.bs.modal', function(){
        SC_removeAllFromContainer(this);
    });
    $(window).on('beforeunload', function(ev){
        // push filter arrays
        $.ajax('/put/ui-pref', {
            dataType: 'json',
            type: 'POST',
            async: false,
            data: {
                agenda_pref: JSON.stringify(AGENDA_FILTER),
                calendar_pref: JSON.stringify(CAL_FILTER),
                ui_pref: JSON.stringify({
                    theme: THEME,
                })
            },
        });
    });
}
function SE_addTypeSegmentedControlWithFilter(heading, filter)
{
    var choices = [];
    $.each(TP_MAP_INVERSE /* see type-picker.js */, function(key, value) {
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
