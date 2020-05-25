(function(window){

    var $Weather = {
        /**
         * Returns string representations of Date or Date and Time in format dd/mm/YYYY HH:ii
         * @param {Number} timestamp UTC timestamp
         * @param {Number} offset offset from UTC +0 timezone in seconds
         * @param {Boolean} timeonly [optional, default = false] 
         */
        getDateTime: function (timestamp, offset, timeonly) {
            if (timeonly === undefined) timeonly = false;
            offset = offset * 1000 || 0;
            timestamp = timestamp * 1000 || Date.now();
           
            var date = new Date(timestamp + offset);
            var H = (date.getUTCHours()).toString().padStart(2, '0');
            var i = (date.getUTCMinutes()).toString().padStart(2, '0');
            if (timeonly) return `${H}:${i}`;
            
            var Y = date.getUTCFullYear();
            var m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            var d = (date.getUTCDate()).toString().padStart(2, '0');
            return `${d}/${m}/${Y} ${H}:${i}`;
        },

        /**
         * Returns `day` or `night` string depending on sunrize/sunset time, and time offset in seconds
         * @param {Number} sunrise sunrise UTC timestamp
         * @param {Number} sunset sunset UTC timestamp
         * @param {Number} offset offset from UTC +0 timezone in seconds
         * @param {Number} timestamp [optional] UTC timestamp
         */
        getDayPart: function(sunrise, sunset, offset, timestamp) {
            var time = $Weather.getDateTime(timestamp, offset, true);
            var sunriseTime = $Weather.getDateTime(sunrise, offset, true);
            var sunsetTime = $Weather.getDateTime(sunset, offset, true);
            if (sunriseTime < time && sunsetTime >= time) return 'day';
            return 'night';
        },

        _directions: [
            'N', 'NNW', 'NW', 'NWW', 
            'W', 'SWW', 'SW', 'SSW', 
            'S', 'SSE', 'SE', 'SEE', 
            'E', 'NEE', 'NE', 'NNE', 
            'N'
        ],

        /**
         * Returns string representation of cardinal directions (for example N, NNE, W, SWW, etc.)
         * @param {Number} directionDegrees number in range 0..360
         */
        windDirection: function(directionDegrees) {
            return this._directions[Math.round((directionDegrees / (360 / (this._directions.length - 1))))];
        },

        /**
         * Converts temperature in Celsius degrees (°C) into temperature in Fahrenheit degrees (°F)
         * @param {Number} tempertature temperature in Celsius degrees
         */
        celsiusToFahrenheit: function(tempertature) {
            return tempertature * 9 / 5 + 32;
        },

        /**
         * Converts pressure in hPa (hectopascal) into pressure in millimetre of mercury (mm Hg)
         * @param {Number} pressure pressure in hPa
         */
        hPa2mmHg: function(pressure) {
            return pressure * 0.75006157584566;
        },

        Visualforce: {
            initComponent: function(app, cmp, id, params) {
                params = params || {};
                $Lightning.use(app, function() {
                    $Lightning.createComponent(
                        cmp,
                        params,
                        id,
                        function(component) {
                            console.log(`${cmp} component was successfully created on the page!`);
                        }
                    );
                });
            }
        }
    };

    // make $Weather object public
    window.$Weather = $Weather;

})(window);
