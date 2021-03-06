(function (){

    var canvas;
    var ctx;
    var width;
    var height;
    var x_res = 25;  //Horizontal divions (Must be a divisor of canvas width)
    var y_res = 20;  //Vertical divsions  (Must be a divisor of canvas height)
    var bitmap = [];   //Table of availability
    var max_box_size_x = Math.floor(x_res / 3);   //Maximum width of an individual rectangle
    var max_box_size_y = Math.floor(y_res / 3);   //Maximum height of an individual rectangle
    var cell_size_x = 0;  //pixel width of a cell
    var cell_size_y = 0;  //pixel height of a cell
    var rect_obj = [];

    var color_0 = '#FF0004';       //Hex red
    var color_1 = '#0040FF';       //Hex blue
    var color_2 = '#FFFF00';       //Hex yellow
    var color_base = '#FFFFFF';    //Hex white


    var index = 0;


    document.addEventListener("DOMContentLoaded", init, false);

    function init(){
        canvas = document.querySelector('#mon');
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        form = document.querySelector('form');
        form.addEventListener('submit', change_variables, false);

        cell_size_x = Math.floor(width / x_res);
        cell_size_y = Math.floor(height / y_res);

        //Creating the bitmap
        for (var i = 0; i < y_res; i++){
            bitmap.push([]);
            for (var j = 0; j < x_res; j++){
                bitmap[i].push(0);
            }
        }
        checkAvailability();
    }

    function checkAvailability(){

        for (var i = 0; i < bitmap.length; i++){
            var j = 0;
            while (j < bitmap[i].length) {
                if (bitmap[i][j] === 0) {
                    //Cell is available
                    //We want to populate this, and some surrounding cells
                    //with a rectangle
                    j += createRect(i, j);
                } else {
                    j++;
                }
            }
        }
        drawing = window.setInterval(draw, 200);
    }


    function createRect(i, j){
        //Need to generate a random width and height
        //Safeguard against overwriting
        //Create and push rect object
        //Return block_width to indicate next position/row (efficiency)

        var block_width = randomNumber(1, Math.min((bitmap[i].length - j), max_box_size_x));
        var block_height = randomNumber(1, Math.min((bitmap.length - i), max_box_size_y));

        //populate
        for (var p = i; p < i + block_height; p++){
            for (var q = j; q < j + block_width; q++){
                if (bitmap[p][q] === 0){
                    //available
                    bitmap[p][q] = 1;
                } else {
                    //Could check for Y axis overwriting
                    block_width = q - j;
                    break;
                }
            }
        }
        //Create rect object
        rect = {
            x : j * cell_size_x,
            y : i * cell_size_y,
            x_size : block_width * cell_size_x,
            y_size : block_height * cell_size_y
        };
        rect_obj.push(rect);
        return block_width;
    }

    function chooseColor(){

        number = randomNumber(0, 100);
        if(number < 55){
            color = color_base;
        } else if(number < 70){
            color = color_0;
        } else if (number < 85){
            color = color_1;
        } else {
            color = color_2;
        }
        return color;
    }

    function draw(){
        if (index < rect_obj.length){
            //console.log(rect_obj[index].x, rect_obj[index].y, rect_obj[index].x_size, rect_obj[index].y_size);

            ctx.beginPath();
            ctx.moveTo(rect_obj[index].x, rect_obj[index].y);
            ctx.lineTo(rect_obj[index].x + rect_obj[index].x_size, rect_obj[index].y);
            ctx.lineTo(rect_obj[index].x + rect_obj[index].x_size, rect_obj[index].y + rect_obj[index].y_size);
            ctx.lineTo(rect_obj[index].x, rect_obj[index].y + rect_obj[index].y_size);
            ctx.closePath();
            ctx.strokeStyle = 'Black';
            ctx.lineWidth = 3;
            ctx.stroke();

            var color = chooseColor();
            ctx.fillStyle = color;
            ctx.fillRect(rect_obj[index].x, rect_obj[index].y, rect_obj[index].x_size, rect_obj[index].y_size);

            index++;

        } else {
            stop();
        }
    }

    function change_variables(event){
        stop();
        ctx.clearRect(0, 0, width, height);
        event.preventDefault();

        var x_div = document.querySelector('#x_div');
        var y_div = document.querySelector('#y_div');
        var base_colour = document.querySelector('#base_colour');
        var colour_0 = document.querySelector('#colour_0');
        var colour_1 = document.querySelector('#colour_1');
        var colour_2 = document.querySelector('#colour_2');

        if (x_div.value){
            x_res = Number(x_div.value);
        }
        if (y_div.value){
            y_res = Number(y_div.value);
        }
        if (base_colour.value){
            color_base = base_colour.value;
        }
        if (colour_0.value){
            color_0 = colour_0.value;
        }
        if (colour_1.value){
            color_1 = colour_1.value;
        }
        if (colour_2.value){
            color_2 = colour_2.value;
        }

        bitmap = [];
        max_box_size_x = Math.floor(x_res / 3);
        max_box_size_y = Math.floor(y_res / 3);
        cell_size_x = 0;
        cell_size_y = 0;
        rect_obj = [];
        index = 0;

        init();
    }

    function stop(){
        clearInterval(drawing);
    }


    function randomNumber(min, max) {
        return Math.round(Math.random() * (max - min)) + min;

    }







    function debugging(){
        console.log("Rect OBJ length: ", rect_obj.length);
        for (var i = 0; i < bitmap.length; i++){
            for (var j = 0; j < bitmap[i].length; j++){
                if (bitmap[i][j] === 0){
                    index = 999;
                    console.log(false);
                }
            }
        }
        if (index === 999){
            console.log(false);
        } else {
            console.log(true);
        }
    }

})();
