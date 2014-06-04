/**
 * @author Kate Compton
 */

define(["common", "./simulation", "../physics/arena", "./population", "./heuristic", "./scoreGraph"], function(common, Simulation, Arena, Population, heuristic, ScoreGraph) {'use strict';
    var arenaInfoDiv = $("#arena_data");
    var arenaSidebar = $("#arena_sidebar");
    var populationPanel = $("#population_panel");

    arenaInfoDiv.hide();
    //  arenaSidebar.hide();
    populationPanel.hide();
    var populationMode = false;
    var devMode = false;

    var heuristics = heuristic.heuristics;
    var currentHeuristic = heuristics.mostBlue;
    var simulationSpeed = 1;

    var current = {
        population : undefined,
        arena : undefined,
        simulation : undefined,
    };

    function toggleDevMode() {
        console.log("TOGGLE DEV MODE");
        devMode = !devMode;
        if (devMode) {
            arenaInfoDiv.show();
        } else {
            arenaInfoDiv.hide();
        }
    }

    // setup the populationmode ui
    $("#mutate").click(function() {
        togglePopulationMode();
        console.log("previous population:  " + current.population);
        current.population = current.population.createNextGenerationFromMutants();
        // console.log("current population:  " + utilities.arrayToString(current.population));
        current.simulation = undefined;
        startSimulation();
    });

    //jquery spaghetti
    //refactor laters
    $("#breed").click(function() {
        var parent0 = current.population.getByName(
            $('#parent0')[0].textContent);
        var parent1 = current.population.getByName(
            $('#parent1')[0].textContent);

        current.population = current.population.createNextGenerationFromParents(parent0, parent1);
    });

    $(".parent_slot").click(function() {
        var $parent = $(this);
        $parent.append("Select parent from left");

        //TODO:
        //Unbinding the click might break other stuff
        $('.population_bot').unbind("click").click(function() {
            var name = this.textContent;
            $parent.empty();
            $parent.append(name);
        });
    });

    function togglePopulationMode() {
        populationMode = !populationMode;
        if (populationMode) {
            populationPanel.show();

            current.population.createPopulationDivs();
            app.paused = true;

        } else {
            populationPanel.hide();

            app.paused = false;
        }
    }

    var graph = new ScoreGraph.BarGraph($("#scoreboard"));

    function initialize() {
        console.log("Init Arena Mode");
        createProcessing();
        createArenaUI();

        // Create the botCard
        app.arenaCard = new app.createBotCard($("#arena_card"));

        Population.initUI();
        // Create the graph

        isStarted = true;

    };

    function createArenaUI() {
        // Add all the heuristics to the menu
        var heuristicSelect = $("#heuristic");

        heuristics.forEach(function(heuristic) {
            heuristicSelect.append($('<option>', {
                value : heuristic.name,
                text : heuristic.name,
            }));

        });

        heuristicSelect.change(function() {
            setCurrentHeuristic(this.value);
        });

        //=======================================
        // Arena selection
        var typeSelect = $("#arena_type");

        var types = ["rectangle", "hexagon", "circle"];
        for (var i = 0; i < types.length; i++) {
            typeSelect.append($('<option>', {
                value : types[i],
                text : types[i],
            }));

        }

        typeSelect.change(function() {
            setArena(this.value);
        });

        var settingsDiv = $("#arena_time_settings");

        app.ui.createSlider(settingsDiv, "simspeed", 1, 0, 7, function(key, val) {
            simulationSpeed = val * val;
        });

    };

    function startSimulation() {
        console.log("Start a new simulation");
        if (!current.simulation) {
            if (!current.population)
                current.population = new Population(5);

            console.log(" population:  " + current.population);

            current.arena = new Arena("rectangle");
            current.simulation = new Simulation(current.population.bots, current.arena, heuristics);
            current.simulation.start();
            current.simulation.run(1, .04);
            setCurrentHeuristic("mostBlue");
        } else {
            current.simulation.refreshBots();
        }
    };

    function setArena(type) {
        console.log("Create arena: " + type);
        current.arena = new Arena(type);

        current.simulation = new Simulation(current.population.bots, current.arena, heuristics);
        current.simulation.start();
        current.simulation.run(1, .04);
    };

    function setCurrentHeuristic(name) {
        currentHeuristic = heuristics[name];
        graph.setTest(current.simulation.getTest(name));
    };

    //============================================================
    // Mode stuff

    var isStarted = false;
    var isOpen = false;
    var div = $("#arena_panel");

    function open() {
        div.addClass("open");
        isOpen = true;

        startSimulation();
    };

    function close() {
        div.removeClass("open");
        isOpen = false;

    };

    //=========================================================================
    //=========================================================================
    // UI

    // Create processing and attach it to a canvas element
    function createProcessing() {
        var canvasDiv = $("#arena_canvas");
        var arenaWindow = app.controls.createTouchableWindow(canvasDiv, "arena", mode);

        // attaching the sketchProc function to the canvas
        var processingInstance = new Processing(canvasDiv.get(0), function(g) {
            var w = canvasDiv.width();
            var h = canvasDiv.height();
            g.size(w, h);
            arenaWindow.center = new Vector(w / 2, h / 2);
            g.colorMode(g.HSB, 1);
            g.ellipseMode(g.CENTER_RADIUS);

            var last = 0;
            g.draw = function() {
                if (isOpen) {
                    app.update();

                    if (!app.paused) {
                        var ellapsed = last - g.millis();
                        ellapsed = utilities.constrain(ellapsed, .01, .1);

                        ellapsed *= simulationSpeed;

                        update(ellapsed);
                    }

                    g.background(.69, .72, 1);
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);

                    g.fill(0);
                    g.ellipse(0, 0, 50, 50);
                    var context = {
                        g : g,
                    };

                    drawArena(context);

                    g.popMatrix();
                    // Draw a shaded rectangle
                    if (app.paused) {
                        g.fill(0, 0, 0, .4);
                        g.rect(0, 0, g.width, g.height);
                    }
                }
            };
        });
    };

    function drawArena(context) {
        if (current.simulation)
            current.simulation.draw(context);
    };

    //=========================================================================
    // Updates and experiments
    function update(ellapsed) {

        arenaInfoDiv.html("");
        app.worldTime.addEllapsed(ellapsed);
        current.simulation.simStep(app.worldTime);

        var s = current.simulation.testsToString();
        arenaInfoDiv.append(s);

        // Update the bar graph

    };

    //=========================================================================
    // Exposed

    function getTouchableAt(query) {
        query.allowBots = true;
        // return the closest bot

        return current.simulation.getAt(query);

    };

    // Add some set of bots
    function addPopulation(population) {

    };

    var mode = {
        initialize : initialize,
        getTouchableAt : getTouchableAt,
        open : open,
        close : close,
        isOpen : function() {
            return isOpen;
        },

        keyPress : function(key) {
            switch(key) {

                case 'p':
                    togglePopulationMode();
                    break;
                case 'd':
                    toggleDevMode();
                    break;

            }
        }
    };
    // interface (all other functions are hidden)
    return mode;
});
