class SelectOnClick {
    public static restrict = 'A';
    public static link(scope, element) {
        var focusedElement;
        element.on('click', function () {
            if (focusedElement != this) {
                this.select();
                focusedElement = this;
            }
        });
        element.on('blur', function () {
            focusedElement = null;
        });
    }
}

export = SelectOnClick;
