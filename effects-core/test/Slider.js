/* eslint-disable indent */

/**
 * @typedef {Object} Color
 * @property {String} mainColor
 * @property {String} disabledColor
 */
/**
 * @typedef {Object} Settings
 * @property {Color} backgroundColor
 * @property {Color} progressColor
 * @property {Color} thumbColor
 */

/**
 * Constructor for sliders
 * @param {Settings} settings
 */
function CSlider(settings) {
    this.settings = settings;
}
