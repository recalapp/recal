/// <reference path="../typings/tsd.d.ts" />
import $ = require('jquery');
import View = require('../library/CoreUI/View');
import ViewTester = require('../library/Testers/ViewTester');
$(()=>
        {
            var viewTester = new ViewTester<View>('View', new View($('<div>')));
            viewTester.run();
        }
 );
