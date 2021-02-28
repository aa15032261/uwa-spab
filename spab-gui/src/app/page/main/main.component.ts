import { Component, OnInit } from '@angular/core';

import olView from 'ol/View';
import olMap from 'ol/Map';
import olFeature from 'ol/Feature';
import olGeolocation from 'ol/Geolocation';
import { Coordinate } from 'ol/coordinate';

import { 
  Circle as olStyleCircle, 
  Fill as olStyleFill, 
  Stroke as olStyleStroke, 
  Style as olStyle 
} from 'ol/style';

import olLayerVector from 'ol/layer/Vector';
import olLayerTile from 'ol/layer/Tile';


import Point from 'ol/geom/Point';

import olSourceVector from 'ol/source/Vector';
import {
  default as olSourceOSM,
  ATTRIBUTION as olSourceOSMAttribution
} from 'ol/source/OSM';

import {
  Attribution as olControlAttribution,
  FullScreen as olControlFullScreen,
  defaults as olControlDefaultControls
} from 'ol/control';
import { ApiService } from 'src/app/service/api.service';


/*
import * as olProj from 'ol/proj';
import { Tile as olTile, Vector as olVector } from 'ol/layer';
import { Attribution as olAttribution, FullScreen as olFullScreen, defaults as olDefaultControls } from 'ol/control';
import { Circle as olCircle, Fill as olFill, Stroke as olStroke, Style as olStyle } from 'ol/style';
import olPoint from 'ol/geom/Point';*/



@Component({
  selector: 'spab-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(apiService: ApiService) {
    
  }

  ngOnInit(): void {
    let mapPadding = [0, 334, 0, 0];


    let initPosSet = false;
    let currentPos: Coordinate | undefined = [0, 0];

    let mapView = new olView({
      center: [0, 0],
      zoom: 1,
    });

    // current position marker
    let mapPosFeature = new olFeature();
    mapPosFeature.setStyle(
      new olStyle({
        image: new olStyleCircle({
          radius: 10,
          fill: new olStyleFill({
            color: '#3399CC',
          }),
          stroke: new olStyleStroke({
            color: '#fff',
            width: 3,
          })
        })
      })
    );

    let mapGeolocation = new olGeolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: mapView.getProjection()
    });

    mapGeolocation.on('change:position', function () {
      currentPos = mapGeolocation.getPosition();
      let geo = currentPos ? new Point(currentPos) : null;

      if (geo) {
        mapPosFeature.setGeometry(geo);

        if (!initPosSet) {
          mapView.fit(geo, {
            padding: mapPadding,
            maxZoom: 12
          });
          initPosSet = true;
        }
      }
    });

    let mapMarkerLayer = new olLayerVector({
      source: new olSourceVector({
        features: [mapPosFeature],
      })
    });

    let openSeaMapLayer = new olLayerTile({
      source: new olSourceOSM({
        attributions: [
          '© <a href="http://www.openseamap.org/">OpenSeaMap</a> contributors.',
          olSourceOSMAttribution
        ],
        opaque: false,
        url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
      })
    });

    let map = new olMap({
      target: 'map',
      controls: olControlDefaultControls({ attribution: false }).extend([
        new olControlAttribution({
          collapsible: true,
          collapseLabel: '<'
        })
      ]),
      layers: [
        new olLayerTile({
          source: new olSourceOSM()
        }),
        openSeaMapLayer,
        mapMarkerLayer
      ],
      view: mapView
    });
  }

}
