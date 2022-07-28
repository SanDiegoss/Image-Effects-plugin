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
        borderProgressColor: {mainColor: '#444444', disabledColor: 'red'},
        thumbColor: {mainColor: '#444444', disabledColor: '#a0a0a0'},
        borderBackgroundColor: {mainColor: '#c0c0c0', disabledColor: 'blue'},
        borderRadius: 2,
        thumbRadius: 6,
        height: 4,
        max: 100,
        min: -100,
        startValue: 0,
        isEnabledByDefault: false,
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
            // eslint-disable-next-line prefer-const
            for (let i in defaultSliderSettings) {
                if (Object.prototype.hasOwnProperty.call(defaultSliderSettings, i)) {
                    settings[i] = oSettings[i] || defaultSliderSettings[i];
                }
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
            function drawBorders() {
                const borderRadius = settings.borderRadius * window.devicePixelRatio;
                const height = settings.height * window.devicePixelRatio;
                const thumbRadius = settings.thumbRadius * window.devicePixelRatio;
                context.beginPath();
                context.clearRect(0, 0, canvas.width, canvas.height);
                const LeftArcStartPoint = new Coordinates(borderRadius, thumbRadius - height / 2);
                const LeftArcMiddlePoint = new Coordinates(0, thumbRadius);
                const LeftArcEndPoint = new Coordinates(borderRadius, thumbRadius + height / 2);

                const RightArcStartPoint = new Coordinates(canvas.width - 2 * borderRadius, thumbRadius - height / 2);
                const RightArcMiddlePoint = new Coordinates(canvas.width, thumbRadius);
                const RightArcEndPoint = new Coordinates(canvas.width - 2 * borderRadius, thumbRadius + height / 2);

                context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);
                context.arcTo(LeftArcMiddlePoint.x, LeftArcMiddlePoint.y, LeftArcEndPoint.x, LeftArcEndPoint.y, borderRadius);
                context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);

                context.lineTo(RightArcStartPoint.x, RightArcStartPoint.y);
                context.arcTo(RightArcMiddlePoint.x, RightArcMiddlePoint.y, RightArcEndPoint.x, RightArcEndPoint.y, borderRadius);
                context.lineTo(RightArcEndPoint.x, RightArcEndPoint.y);

                context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                context.strokeStyle = (isEnabled) ? settings.borderBackgroundColor.mainColor : settings.borderBackgroundColor.disabledColor;
                context.stroke();
                context.fillStyle = (isEnabled) ? settings.backgroundColor.mainColor : settings.backgroundColor.disabledColor;
                context.fill();

                context.closePath();
            }
            /**
             */
            function drawThumb() {
                const thumbRadius = settings.thumbRadius * window.devicePixelRatio;
                const total = settings.max - settings.min;
                const percent = (value - settings.min) / total;
                const needx = ((canvas.width - 2 * thumbRadius) * percent) + thumbRadius;
                context.beginPath();
                context.arc(needx, thumbRadius, thumbRadius, 0, 2*Math.PI);
                context.fillStyle = (isEnabled) ? settings.thumbColor.mainColor : settings.thumbColor.disabledColor;
                context.fill();
                context.closePath();
            }
            /**
             */
            function drawProgress() {
                const borderRadius = settings.borderRadius * window.devicePixelRatio;
                const height = settings.height * window.devicePixelRatio;
                const thumbRadius = settings.thumbRadius * window.devicePixelRatio;
                const total = settings.max - settings.min;
                const percent = (value - settings.min) / total;
                const needWidth = (canvas.width - thumbRadius) * percent;
                console.log(needWidth);
                if (percent == 0) {
                    return;
                }
                const LeftArcStartPoint = new Coordinates(borderRadius, thumbRadius - height / 2);
                const LeftArcMiddlePoint = new Coordinates(0, thumbRadius);
                const LeftArcEndPoint = new Coordinates(borderRadius, thumbRadius + height / 2);

                const RightArcStartPoint = new Coordinates(needWidth + thumbRadius / 2, thumbRadius - height / 2);
                const RightArcEndPoint = new Coordinates(needWidth + thumbRadius / 2, thumbRadius + height / 2);

                context.beginPath();

                context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);
                context.arcTo(LeftArcMiddlePoint.x, LeftArcMiddlePoint.y, LeftArcEndPoint.x, LeftArcEndPoint.y, borderRadius);
                context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                context.moveTo(LeftArcStartPoint.x, LeftArcStartPoint.y);

                context.lineTo(RightArcStartPoint.x, RightArcStartPoint.y);
                context.lineTo(RightArcEndPoint.x, RightArcEndPoint.y);

                context.lineTo(LeftArcEndPoint.x, LeftArcEndPoint.y);

                context.strokeStyle = (isEnabled) ? settings.borderProgressColor.mainColor : settings.borderProgressColor.disabledColor;
                context.stroke();
                context.fillStyle = (isEnabled) ? settings.progressColor.mainColor : settings.progressColor.disabledColor;
                context.fill();
                context.closePath();
            }
            /**
             */
            function update() {
                drawBorders();
                drawProgress();
                drawThumb();
            }
            canvas.onpointerdown = function(event) {
                event.preventDefault();
                event.stopPropagation();
                moveAt(event.pageX);
                /**
                 * @param {Number} pageX
                 */
                function moveAt(pageX) {
                    const offset = parent.getBoundingClientRect();
                    const moving = (pageX - offset.left - settings.thumbRadius + window.pageXOffset);
                    console.log(offset.left);
                    if (moving < 0) {
                        value = settings.min;
                    } else if (moving > offset.width - settings.thumbRadius * 2) {
                        value = settings.max;
                    } else {
                        const total = settings.max - settings.min;
                        const maxleft = offset.width - settings.thumbRadius * 2;
                        const percent = moving / maxleft;
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
                    moveAt(event.pageX);
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
            /**
             */
            function resize() {
                const scale = window.devicePixelRatio;
                const rect = parent.getBoundingClientRect();
                console.log(rect.height);
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                canvas.width = Math.round(scale * rect.right) - Math.round(scale * rect.left);
                canvas.height = Math.round(scale * rect.bottom) - Math.round(scale * rect.top);
                update();
            }
        },
    };
})();
