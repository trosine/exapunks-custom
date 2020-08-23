// For the latest Axiom VirtualNetwork+ scripting documentation,
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
    return "Compass Heading";
}

function getSubtitle() {
    return "";
}

function getDescription() {
    return "Calculate the compass heading given the directions from the *#DIRX* and *#DIRY* registers and write the result to #HEAD.\n" +
        "To allow for better precision, the *#ATAN* register expects its input is multiplied by 100 " +
        "and will return the angle in degrees. For example, 1/2 should be entered as 50."
    ;
}

function initializeTestRun(testRun) {
    var targetHost = createHost("target", 5, 0, 3, 3);
    var latitudes = []; // east/west inputs
    var longitudes = []; // north/south inputs
    var headings = []; // compass heading results
    for (var i = 0; i < 30; i++) {
        latitudes[i] = randomInt(-90, 90);
        longitudes[i] = randomInt(-90, 90);
        headings[i] = Math.atan(latitudes[i] / longitudes[i]) * 180 / Math.PI;
        if (latitudes[i] < 0) {
            headings[i] += 180;
        }
        if (longitudes[i] < 0) {
            headings[i] += 180;
        }
    }

    if (testRun == 1) {
        latitudes[0] =  0; longitudes[0] =  1; headings[0] =   0;
        latitudes[1] =  1; longitudes[1] =  1; headings[1] =  45;
        latitudes[2] =  1; longitudes[2] =  0; headings[2] =  90;
        latitudes[3] =  1; longitudes[3] = -1; headings[3] = 135;
        latitudes[4] =  0; longitudes[4] = -1; headings[4] = 180;
        latitudes[5] = -1; longitudes[5] = -1; headings[5] = 225;
        latitudes[6] = -1; longitudes[6] =  0; headings[6] = 270;
        latitudes[7] = -1; longitudes[7] =  1; headings[7] = 315;
    }

    createRegister(targetHost, 8, 1, "ATAN")
    createTable("Where do you want to go", 108, 0, "Calculate all compass headings");
    addTableInput("DIRX", latitudes, createRegister(targetHost, 7, 0, "DIRX"));
    addTableInput("DIRY", latitudes, createRegister(targetHost, 7, 1, "DIRY"));
    addTableOutput("HEAD", latitudes, createRegister(targetHost, 7, 2, "HEAD"));
}

function onCycleFinished() {
}
