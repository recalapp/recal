# Angular Qtip2 Directive

Angular directive for [Qtip2](http://qtip2.com/)

## Usage

Install with [Bower](http://bower.io)

    bower install angular-qtip2-directive --save-dev

Include the script `qtip2` into your app and add `qtip2` as a module dependency to your app. Use the directive on the elements with the attribute `qtip`

    <a href="/cool-stuff" qtip data-content="Text to appear in the tip">Hover me</a>

List of attributes you can use:

* `data-content`: Content that will appear in the tip
* `data-my`: position of the tip arrow - optionnal: default to `bottom center`
* `data-at`: position of the tip - optionnal: default to `top center`
* `data-class`: class to use on the tip - optionnal: default to `qtip`

For more details about the options see the [Qtip2 documentation](http://qtip2.com/demos#section-positioning)
