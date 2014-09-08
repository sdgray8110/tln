/* Maps Module  */
/* Dependencies --
 -- Google Maps JS API v3
 -- Serialize Object Module
 -- Mustache
 */

define(function(require) {
    'use strict';

    var $ = require('jquery'),
        Mustache = require('mustache'),
        serializeObject = require('serializeObject'),
        google = require(['async!//maps.googleapis.com/maps/api/js?sensor=false']);


    return (function () {
        var proto = function () {
            var self = {
                settings: {
                    infoWindow: {
                        alignBottom: true,
                        pixelOffset: new google.maps.Size(-149, -55),
                        boxStyle: {
                            background: 'transparent',
                            width: '300px'
                        },
                        closeBoxURL: ''
                    },
                    mapStyles: [
                        {
                            featureType: "poi.business",
                            elementType: "labels",
                            stylers: [
                                { visibility: "off" }
                            ]
                        }
                    ],
                    mapFiltersEl: null, // Required
                    mapDataEl: null, // Required
                    infoWindowTemplateEl:  null // Required
                },

                cacheDom: function() {
                    self.dom = {};
                    self.dom.mapFilters = self.options.mapFiltersEl;
                    self.dom.mapData = self.options.mapDataEl.text();
                    self.dom.infoWindowTemplate = self.options.infoWindowTemplateEl.text();
                },

                init: function (options) {
                    var options = options || {};
                    self.options = $.extend(self.settings, options);

                    self.cacheDom();
                    self.setModel();
                    self.createMap();
                    self.attachHandlers();
                },

                attachHandlers: function() {
                    self.dom.mapFilters.find('input').on('change', self.applyPropertyFilters);
                },

                createMap: function() {
                    var options = {
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        zoom: 15,
                        styles: self.options.mapStyles
                    };

                    self.model.map = new google.maps.Map(document.getElementById('map-content'), options);
                    self.addMarkers();
                    self.fitBounds();
                },

                setModel: function() {
                    var mapData = JSON.parse(self.dom.mapData);

                    self.model = {};
                    self.model.filters = self.dom.mapFilters.serializeObject();

                    /* Add Geodata for each property */
                    for (var i = 0; i < mapData.property.length; i++) {
                        var item = mapData.property[i];
                        item.location = new google.maps.LatLng(item.geo.lat, item.geo.long);
                    }

                    /* Add geodata for each related location */
                    for (var i = 0; i < mapData.related.length; i++) {
                        /* Add geodata for each related location */
                        mapData.related[i].location = new google.maps.LatLng(mapData.related[i].geo.lat, mapData.related[i].geo.long);
                        mapData.related[i].display = self.model.filters[mapData.related[i].type] == 1;
                    }

                    self.model.property = mapData.property;
                    self.model.related = mapData.related;
                    self.model.infoWindow = new InfoBox(self.options.infoWindow);
                },

                addMarkers: function() {
                    /* Property Marker(s) */
                    for (var i = 0; i < self.model.property.length; i++) {
                        var item = self.model.property[i];
                        item.marker = new google.maps.Marker(self.markerProps(item));
                        self.markerModalHandler(item.marker);
                    }

                    /* Related Markers */
                    for (var i = 0; i < self.model.related.length; i++) {
                        var item = self.model.related[i];

                        item.marker = new google.maps.Marker(self.markerProps(item));
                        item.marker.setVisible(item.display);
                        self.markerModalHandler(item.marker);
                    }

                    google.maps.event.addListener(self.model.map, 'click', function() {
                        self.model.infoWindow.close();
                    });
                },

                markerProps: function(item) {
                    return {
                        position: item.location,
                        map: self.model.map,
                        title: item.name,
                        icon: '/build/images/maps/' + item.type + '.png',
                        model: item
                    }
                },

                markerModalHandler: function(marker) {
                    google.maps.event.addListener(marker, 'click', function() {
                        self.model.infoWindow.setContent(self.markerModalContent(marker.model));
                        self.model.infoWindow.open(self.model.map, marker);
                    });
                },

                markerModalContent: function(model) {
                    return Mustache.render(self.dom.infoWindowTemplate, model);
                },

                /* Zoom Map To Fit All Visible Markers */
                /* If only one marker, sets a maximum zoom level */
                fitBounds: function() {
                    var bounds = new google.maps.LatLngBounds(),
                        ct = 0;

                    for (var i = 0; i < self.model.property.length; i++) {
                        bounds.extend(self.model.property[i].location);
                    }

                    for (var i = 0; i < self.model.related.length; i++) {
                        var item = self.model.related[i];

                        if (item.display) {
                            bounds.extend(item.location);
                            ct += 1;
                        }
                    }

                    if (ct > 1) {
                        self.model.map.fitBounds(bounds);
                    } else {
                        self.model.map.setCenter(self.model.property[0].location);
                        self.model.map.setZoom(16);
                    }
                },

                applyPropertyFilters: function() {
                    self.model.filters = self.dom.mapFilters.serializeObject();
                    self.model.infoWindow.close();

                    for (var i = 0; i < self.model.related.length; i++) {
                        var item = self.model.related[i];

                        item.display = self.model.filters[item.type] == 1;
                        item.marker.setVisible(item.display);
                    }

                    self.fitBounds();
                }
            };

            return self;
        };

        return {
            create: function() {
                var Maps = function() {};
                Maps.prototype = proto();

                return new Maps();
            }
        };
    })();
});
