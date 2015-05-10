var imageDrachen;
var imageFarben;
var neueFarbe = [255, 0, 0];

function startKonfigurator(drachenSrc, farbenSrc) {

    var contextDrachen = document.getElementById("drachen").getContext("2d");
    imageDrachen = new Image();
    /* Hier die URL vom Bild des Drachens einf�gen*/
    imageDrachen.src = drachenSrc;
    imageDrachen.onload = imageLoad("drachen", contextDrachen, imageDrachen);


    var contextFarben = document.getElementById("farben").getContext("2d");
    imageFarben = new Image();
    /* Hier die URL vom Bild der Drachenfraben einf�gen*/
    imageFarben.src = farbenSrc;
    imageFarben.onload = imageLoad("farben", contextFarben, imageFarben);

    function imageLoad(pic, context, image) {
        return function () {

            var skalierung = document.getElementById(pic + "_div").offsetWidth / image.width;

            if (skalierung < 1) {
                document.getElementById(pic).width = image.width * skalierung;
                document.getElementById(pic).height = image.height * skalierung;
                context.drawImage(image, 0, 0, image.width * skalierung, image.height * skalierung);
            } else {
                document.getElementById(pic).width = image.width;
                document.getElementById(pic).height = image.height;
                context.drawImage(image, 0, 0);
            }
            if(pic === "drachen"){
                blackWhite();
            }
        };
    }

    function blackWhite() {

        var contextDrachen = document.getElementById("drachen").getContext("2d");
        var image = contextDrachen.getImageData(0, 0, contextDrachen.canvas.width, contextDrachen.canvas.height);
        var imageData = image.data;
        for (var i = 0; i < imageData.length; i += 4) {
            var val = 0;
            if (imageData[i] > 155 && imageData[i + 1] > 155 && imageData[i + 2] > 155) {
                val = 255;
            }
            imageData[i] = val;
            imageData[i + 1] = val;
            imageData[i + 2] = val;
        }
        contextDrachen.putImageData(image, 0, 0);
    }

}

function clean(cxVar) {
    cxVar.clearRect(0, 0, cxVar.canvas.width, cxVar.canvas.height);
}

$('#farben').click(function (e) {
    /*Wo wurde hin geklickt*/
    var pos = findPos(this);
    var mouseX = Math.floor(e.pageX - pos.x);
    var mouseY = Math.floor(e.pageY - pos.y);

    var farben = document.getElementById("farben");
    if (farben.getContext) {
        var context = farben.getContext("2d");
        var myImgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        var index = (mouseX + mouseY * myImgData.width) * 4;
        if (!farbenVergleich([myImgData.data[index], myImgData.data[index + 1], myImgData.data[index + 2]], [0, 0, 0])) {
            neueFarbe[0] = myImgData.data[index];
            neueFarbe[1] = myImgData.data[index + 1];
            neueFarbe[2] = myImgData.data[index + 2];
            $('#aktFarbe').css("background-color", "rgb(" + neueFarbe[0] + "," + neueFarbe[1] + "," + neueFarbe[2] + ")");
        }
    }
});

$('#drachen').click(function (e) {
    /*Wo wurde hin geklickt*/
    var pos = findPos(this);
    var mouseX = Math.floor(e.pageX - pos.x);
    var mouseY = Math.floor(e.pageY - pos.y);


    var drachen = document.getElementById("drachen");
    if (drachen.getContext) {
        var context = drachen.getContext("2d");
        var myImgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        var index = (mouseX + mouseY * myImgData.width) * 4;

        clean(context);
        context.save();

        /*Fl�che f�llen
         * Wenn auf einen schwarzen Bereich geklickt wurde wird fill4 nicht ausgef�hrt.
         */
        var alteFarbe = [myImgData.data[index], myImgData.data[index + 1], myImgData.data[index + 2]];
        if (!farbenVergleich(alteFarbe, neueFarbe) && !farbenVergleich(alteFarbe, [0, 0, 0])) {
            myImgData = fill4(mouseX, mouseY, alteFarbe, neueFarbe, myImgData);
        }

        context.putImageData(myImgData, 0, 0);
        context.restore();
    }
});

function farbenVergleich(farbe1, farbe2) {
    return farbe1.every(function (rgb, index) {
        return farbe1[index] === farbe2[index];
    });
}

function fill4(x, y, alteFarbe, neueFarbe, myImgData) {

    var stack = [];
    stack.push([x, y]);

    while (stack.length > 0) {
        var aktKoordinaten = stack.pop();
        var index = (aktKoordinaten[0] + aktKoordinaten[1] * myImgData.width) * 4;

        if (myImgData.data[index] == alteFarbe[0] && myImgData.data[index + 1] == alteFarbe[1] && myImgData.data[index + 2] == alteFarbe[2]) {

            myImgData.data[index] = neueFarbe[0];
            myImgData.data[index + 1] = neueFarbe[1];
            myImgData.data[index + 2] = neueFarbe[2];

            stack.push([aktKoordinaten[0], aktKoordinaten[1] + 1]);
            stack.push([aktKoordinaten[0], aktKoordinaten[1] - 1]);
            stack.push([aktKoordinaten[0] + 1, aktKoordinaten[1]]);
            stack.push([aktKoordinaten[0] - 1, aktKoordinaten[1]]);
        }
    }

    return myImgData;
}

/*
 Um die Position eines Objektes auf der Seite finden zu k�nnen.
 */
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x: curleft, y: curtop};
    }
    return undefined;
}
