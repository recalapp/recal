define(["require", "exports"], function(require, exports) {
    var ClickToEditType = (function () {
        function ClickToEditType() {
        }
        ClickToEditType.text = 'CTE_Text';
        ClickToEditType.textArea = 'CTE_TextArea';
        ClickToEditType.select = 'CTE_select';
        return ClickToEditType;
    })();
    
    return ClickToEditType;
});
