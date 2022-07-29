/* eslint-disable max-len */
/* eslint-disable indent */
'use strict';
/**
 * @typedef {Object} Color
 * @property {String} mainColor
 * @property {String} disabledColor
 */
/**
 * @typedef {Object} Settings
 * @property {Color} backgroundColor
 * @property {Color} progressColor
 * @property {Color} borderProgressColor
 * @property {Color} thumbColor
 * @property {Color} borderBackgroundColor
 * @property {Number} borderRadius
 * @property {Number} thumbRadius
 * @property {Number} height
 * @property {Number} max
 * @property {Number} min
 * @property {Number} startValue
 * @property {Boolean} isEnabledByDefault
 * @property {Boolean} isVertical
 */
/**
 * Slider module
 */
// eslint-disable-next-line no-unused-vars
const SliderModule = (function() {
    /**
     * Default settings for slider
     * @type {Settings}
     */
    const defaultSliderSettings = {
        backgroundColor: {mainColor: '#c0c0c0', disabledColor: '#c0c0c0'},
        progressColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderProgressColor: {mainColor: '#444444', disabledColor: 'blue'},
        thumbColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderBackgroundColor: {mainColor: '#c0c0c0', disabledColor: 'red'},
        borderRadius: 2,
        thumbRadius: 6,
        height: 4,
        max: 100,
        min: -100,
        startValue: 0,
        isEnabledByDefault: false,
        isVertical: false,
    };
    /**
     * @param {Number} x
     * @param {Number} y
     */
    function Coordinates(x, y) {
        this.x = x;
        this.y = y;
    }
    return {
        changeDefaultSettings: function(settings) {
            // eslint-disable-next-line prefer-const
            for (let i in settings) {
                if (Object.prototype.hasOwnProperty.call(defaultSliderSettings, i)) {
                    defaultSliderSettings[i] = settings[i] || defaultSliderSettings[i];
                }
            }
        },
        /**
         * Constructor for sliders
         * @param {Settings} oSettings
         * @param {HTMLDivElement} parent
         */
        CSlider: function(oSettings, parent) {
            // TODO: refactoring
            const settings = {};
            // eslint-disable-next-line prefer-const, guard-for-in
            for (let i in defaultSliderSettings) {
                settings[i] = oSettings[i] || defaultSliderSettings[i];
            }
            let isEnabled = settings.isEnabledByDefault;
            if (settings.borderRadius > settings.height / 2) {
                settings.borderRadius = settings.height / 2;
            }
            if (settings.thumbRadius * 2 < settings.height) {
                settings.thumbRadius = settings.height / 2;
            }

            let value = settings.startValue;

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            /**
             */
            function update() {
                const cWidth = (settings.isVertical) ? canvas.height : canvas.width;
                const cHeight = (settings.isVertical) ? canvas.width : canvas.height;
                const borderRadius = settings.borderRadius * window.devicePixelRatio;
                const height = settings.height * window.devicePixelRatio;
                const thumbRadius = settings.thumbRadius * window.devicePixelRatio;
                const total = settings.max - settings.min;
                const percent = (value - settings.min) / total;
                const needx = ((cWidth - 2 * thumbRadius) * percent) + thumbRadius;

                context.clearRect(0, 0, canvas.width, canvas.height);

                const leftTop = new Coordinates(borderRadius * 2, cHeight / 2 - height / 2);
                const leftMid = new Coordinates(0, cHeight / 2);
                const leftBot = new Coordinates(borderRadius * 2, cHeight / 2 + height / 2);

                const centerTop = new Coordinates(needx, cHeight / 2 - height / 2);
                const centerBot = new Coordinates(needx, cHeight / 2 + height / 2);

                const rightTop = new Coordinates(cWidth - 2 * borderRadius, cHeight / 2 - height / 2);
                const rightMid = new Coordinates(cWidth, cHeight / 2);
                const rightBot = new Coordinates(cWidth - 2 * borderRadius, cHeight / 2 + height / 2);

                const thumbCoords = new Coordinates(needx, cHeight / 2);
                if (settings.isVertical) {
                    [leftTop, leftMid, leftBot, centerTop, centerBot, rightTop, rightMid, rightBot, thumbCoords].forEach(function(item) {
                        item.y = [cWidth - item.x, item.x = item.y][0];
                    });
                }
                const needPenW = 1;
                context.lineWidth = (needPenW * window.devicePixelRatio) >> 0;
                const offsetCeil = (context.lineWidth & 1) / 2;

                // before thumb
                context.beginPath();
                context.moveTo(leftTop.x >> 0, leftTop.y >> 0 + offsetCeil);
                context.arcTo(leftMid.x >> 0, leftMid.y >> 0 + offsetCeil, leftBot.x >> 0, leftBot.y >> 0 + offsetCeil, borderRadius);
                context.lineTo(leftBot.x >> 0, leftBot.y >> 0 + offsetCeil);
                context.lineTo(centerBot.x >> 0, centerBot.y >> 0 + offsetCeil);
                context.lineTo(centerTop.x >> 0, centerTop.y >> 0 + offsetCeil);
                context.lineTo(leftTop.x >> 0, leftTop.y >> 0 + offsetCeil);
                context.arcTo(leftMid.x >> 0, leftMid.y >> 0 + offsetCeil, leftBot.x >> 0, leftBot.y >> 0 + offsetCeil, borderRadius);
                context.fillStyle = (isEnabled) ? settings.progressColor.mainColor : settings.progressColor.disabledColor;
                context.fill();
                context.strokeStyle = (isEnabled) ? settings.borderProgressColor.mainColor : settings.borderProgressColor.disabledColor;
                context.stroke();
                // after thumb
                context.beginPath();
                context.moveTo(centerTop.x >> 0, centerTop.y >> 0 + offsetCeil);
                context.lineTo(rightTop.x >> 0, rightTop.y >> 0 + offsetCeil);
                context.arcTo(rightMid.x >> 0, rightMid.y >> 0 + offsetCeil, rightBot.x >> 0, rightBot.y >> 0 + offsetCeil, borderRadius);
                context.lineTo(rightBot.x >> 0, rightBot.y >> 0 + offsetCeil);
                context.lineTo(centerBot.x >> 0, centerBot.y >> 0 + offsetCeil);
                context.fillStyle = (isEnabled) ? settings.backgroundColor.mainColor : settings.backgroundColor.disabledColor;
                context.fill();
                context.strokeStyle = (isEnabled) ? settings.borderBackgroundColor.mainColor : settings.borderBackgroundColor.disabledColor;
                context.stroke();
                // Thumb
                context.beginPath();
                context.arc(thumbCoords.x, thumbCoords.y, thumbRadius, 0, 2*Math.PI);
                context.fillStyle = (isEnabled) ? settings.thumbColor.mainColor : settings.thumbColor.disabledColor;
                context.fill();
            }
            canvas.onpointerdown = function(event) {
                event.preventDefault();
                event.stopPropagation();
                const pageX = (settings.isVertical) ? event.pageY : event.pageX;
                moveAt(pageX);
                /**
                 * @param {Number} pageX
                 */
                function moveAt(pageX) {
                    const rect = parent.getBoundingClientRect();
                    const offset = (settings.isVertical) ? rect.top : rect.left;
                    const oWidth = (settings.isVertical) ? rect.height : rect.width;
                    const pageOffset = (settings.isVertical) ? window.pageYOffset : window.pageXOffset;
                    let moving = (pageX - offset - settings.thumbRadius + pageOffset);
                    if (settings.isVertical) {
                        moving = oWidth - moving - 2*settings.thumbRadius;
                    }
                    if (moving < 0) {
                        value = settings.min;
                    } else if (moving > oWidth - settings.thumbRadius * 2) {
                        value = settings.max;
                    } else {
                        const total = settings.max - settings.min;
                        const maxWidth = oWidth - settings.thumbRadius * 2;
                        const percent = moving / maxWidth;
                        value = (settings.min + percent * total);
                        // value = Math.floor(value);
                    }
                    canvas.setAttribute('value', '' + value);
                    update();
                }
                /**
                 * @param {PointerEvent} event
                 */
                function onPointerMove(event) {
                    const pageX = (settings.isVertical) ? event.pageY : event.pageX;
                    moveAt(pageX);
                }
                /**
                 * @param {PointerEvent} event
                 */
                function onPointerUp(event) {
                    document.removeEventListener('pointermove', onPointerMove);
                    document.removeEventListener('pointerup', onPointerUp);
                }
                document.addEventListener('pointermove', onPointerMove, false);
                document.addEventListener('pointerup', onPointerUp, false);
            };
            this.getValue = function() {
                return value;
            };
            /**
             * @param {Number} oValue
             */
            this.setValue = function(oValue) {
                value = oValue;
                update();
            };
            this.enable = function() {
                isEnabled = true;
                update();
            };
            this.disable = function() {
                isEnabled = false;
                update();
            };
            parent.appendChild(canvas);
            resize();
            window.addEventListener('resize', resize);
            if (typeof ResizeObserver !== 'undefined') {
                const ro = new ResizeObserver(function() {
                    resize();
                });
                ro.observe(parent);
            }
            /**
             */
            function resize() {
                const scale = window.devicePixelRatio;
                const rect = parent.getBoundingClientRect();
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                canvas.width = Math.round(scale * rect.right) - Math.round(scale * rect.left);
                canvas.height = Math.round(scale * rect.bottom) - Math.round(scale * rect.top);
                update();
            }
        },
    };
})();
