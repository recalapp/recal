/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings-manual/typings.d.ts" />
/// <amd-dependency path="jeditable" />
define(["require", "exports", 'jquery', './ClickToEditType', '../Core/NotImplementedException', "jeditable"], function(require, exports, $, ClickToEditType, NotImplementedException) {
    var TEXT_TYPE = 'RCText';
    var TEXT_AREA_TYPE = 'RCTextArea';

    function br2nl(text) {
        return text.replace(/(\n|\r)/g, "").replace(/<br>/g, "\n");
    }

    $.editable.addInputType(TEXT_TYPE, {
        element: function (settings, original) {
            var $input = $('<input>').addClass('form-control');
            $(this).append($input);
            return $input;
        }
    });
    $.editable.addInputType(TEXT_AREA_TYPE, {
        element: function (settings, original) {
            var $input = $('<textarea>').addClass('form-control');
            $(this).append($input);
            return $input;
        },
        content: function (settings, original) {
            var encoded = br2nl($(original).html());
            encoded = $('<div>').html(encoded).text();
            $(this).find('textarea').val(encoded);
            // TODO handle saving logic in the clicktoedit view class
        }
    });

    var ClickToEditTypeProvider = (function () {
        function ClickToEditTypeProvider() {
        }
        ClickToEditTypeProvider.instance = function () {
            return this._instance;
        };

        ClickToEditTypeProvider.prototype.getTypeString = function (type) {
            switch (type) {
                case 0 /* text */:
                    return TEXT_TYPE;
                case 2 /* textArea */:
                    return TEXT_AREA_TYPE;
                default:
                    throw new NotImplementedException('Type ' + type + ' is not supported');
            }
        };
        ClickToEditTypeProvider._instance = new ClickToEditTypeProvider();
        return ClickToEditTypeProvider;
    })();
    
    return ClickToEditTypeProvider;
});
