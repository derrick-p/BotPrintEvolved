/**
 * @author Kate Compton
 */

define(["common"], function(COMMON) {
    var attachmentCount = 0;

    var Attachment = Class.extend({
        init : function(attachPoint) {
            this.idNumber = attachmentCount;
            attachmentCount++;

            this.globalPosition = new Vector();
            this.globalRotation = 0;
        },

        getForce : function() {

        },

        compileAll : function(list, filter) {
            if (filter(this)) {
                list.push(this);
            }
        },
    });
    //==========================================
    //==========================================
    //==========================================
    // Sensors

    var Sensor = Attachment.extend({
        init : function(attachPoint) {
            this._super(attachPoint);
            this.reading = 0;
            this.name = "Sensor";
        },

        update : function(time) {
            var t = time.total;

            // Sense
            this.reading = app.world.lightMap.sampleAt(this.globalPosition);
        },

        sense : function() {
            return this.reading;
        },

        draw : function(g, t) {
            var r = 4;
            g.noStroke();

            g.fill(0);
            g.rect(-.9 * r, -r, r * 1, r * 2);
            app.world.lightMap.setFill(g, this.reading);
            g.ellipse(0, 0, r * .6, r);
        },

        toString : function() {
            return this.name + " (" + this.reading + ")";
        }
    });

    //==========================================
    //==========================================
    //==========================================
    // Thrusters

    var thrusterWidth = 3;
    var thrusterLength = 10;
    var Thruster = Attachment.extend({
        init : function(attachPoint) {
            this._super(attachPoint);

            this.power = 2500000;
            this.firePct = 0;
            this.force = {
                power : this.power * this.firePct,

                direction : 0,
                p : new Vector(),
            };
            this.name = "Thruster";
        },

        update : function(time) {
            var t = time.total;
            this.firePct *= .9;
        },

        actuate : function(pct) {
            this.firePct = pct;
        },

        getForce : function(t) {
            this.force.direction = this.globalRotation;
            this.force.power = -this.firePct * this.power;
            this.force.p.setTo(this.globalPosition);
            return this.force;
        },

        draw : function(g, t) {

            var endR = .75 * (this.firePct + .2) * thrusterWidth;
            g.fill(.9, 1, 1);
            g.ellipse(-thrusterWidth * .4, 0, thrusterWidth, thrusterWidth * 1.5);
            g.rect(-thrusterLength * .8, -thrusterWidth, thrusterLength, thrusterWidth * 2);

            g.fill(.11 + .05 * Math.sin(20 * t + 20 * this.idNumber), 1, this.firePct);
            g.ellipse(endR, 0, 2 * endR, endR);

        },

        toString : function() {
            return this.name + " (" + this.firePct + ")";
        }
    });

    return {
        Thruster : Thruster,
        Sensor : Sensor
    };
});
