/* eslint-disable max-len */
/* eslint-disable indent */

const divs = document.querySelectorAll('.cont');
const vert = document.querySelector('.vert');
const sliders = [];
const colors = ['blue', 'red', 'black', 'yellow', 'green', 'purple', 'orange', 'aqua', 'yellowgreen'];
SliderModule.changeDefaultSettings({
    borderRadius: 10,
    thumbRadius: 18,
    height: 15,
});
let i = 0;
Array.prototype.forEach.call(divs, function(div) {
    sliders.push(new SliderModule.CSlider({
        progressColor: {
            mainColor: colors[i], disabledColor: colors[i+1],
        },
        thumbColor: {
            mainColor: colors[i+1], disabledColor: colors[i+2],
        },
        borderRadius: (i+5)*2,
        height: (i+5)*2,
        thumbRadius: (i+5)*2,
    }, div));
    console.log(i);
    i+=1;
});

new SliderModule.CSlider({isVertical: true}, vert);
