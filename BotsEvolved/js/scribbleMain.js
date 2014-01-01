/**
 * @author Kate Compton
 */

require.config({
    paths : {
        'three' : 'vendor/three',
        'd3' : 'vendor/d3.v3',
        'jQuery' : 'vendor/jquery-1.10.1',
        'jQueryUI' : 'vendor/jquery-ui',
        'jQueryUITouchPunch' : 'vendor/jquery.ui.touch-punch',
        'jQueryHammer' : 'vendor/jquery.hammer',
        'jQueryMigrate' : 'vendor/jquery-migrate-1.2.1',
        'jQueryGridster' : 'vendor/jquery.gridster',
        'mousewheel' : 'vendor/jquery.mousewheel',
        'voronoi' : 'vendor/rhill-voronoi-core',
        'underscore' : 'vendor/underscore',
        'box2D' : 'vendor/box2d',
        'box2DHelpers' : 'vendor/embox2d-helpers',

        'processing' : 'vendor/processing-1.4.1',
        'inheritance' : 'vendor/inheritance',
        'noise' : 'vendor/simplex_noise',

        // My modules
        'common' : 'modules/common/common',
        'geo' : 'modules/geo/geometry',
        'ui' : 'modules/ui/ui',
        'io' : 'modules/io/saveFile',
        'arena' : 'modules/arena/arena',

    },
    shim : {
        'jQueryUITouchPunch' : {
            exports : '$',
            deps : ['jQueryUI']
        },
        'jQueryHammer' : {
            exports : '$',
            deps : ['jQueryUI']
        },
        'jQueryMigrate' : {
            exports : '$',
            deps : ['jQueryUI']
        },

        'jQueryGridster' : {
            exports : '$',
            deps : ['jQueryUI']
        },
        'jQueryUI' : {
            exports : '$',
            deps : ['jQuery']
        },

        'box2DHelpers' : {
            exports : 'box2DHelpers',
            deps : ['box2D']
        },

        'mousewheel' : {
            exports : 'mousewheel',
            deps : ['jQuery']
        },
        'underscore' : {
            exports : '_'
        },

        'processing' : {
            exports : 'Processing'
        },

        'inheritance' : {
            exports : 'Inheritance'
        },
        'three' : {
            exports : 'THREE'
        },

        'voronoi' : {
            exports : 'Voronoi'
        },
        'box2D' : {
            exports : 'Box2D'
        },

    }
});

require(["./modules/scribbles/scribbleApp"], function(ScribbleApp) {
    var app = new ScribbleApp();
    app.start();
    console.log("Start");

});
