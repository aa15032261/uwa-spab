import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

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
import { UtilsService } from 'src/app/service/utils.service';



@Component({
  selector: 'spab-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy  {

  @ViewChild('mainMap') mainMapElem!: ElementRef;
  @ViewChild('clientSelect') clientSelect!: ElementRef;

  private mainMap: olMap;

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private renderer: Renderer2
  ) {
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
        opaque: false,
        url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
      })
    });

    // '© <a href="http://www.openseamap.org/">OpenSeaMap</a> contributors.',
    // olSourceOSMAttribution

    this.mainMap = new olMap({
      controls: [],
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

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.mainMap.setTarget(this.mainMapElem.nativeElement);
    this.utilsService.addResizeListener(
      this.mainMapElem.nativeElement,
      () => {
        this.mainMap.updateSize();
      }
    );

    /*this.clientSelect.nativeElement.addEventListener('change', async (evt: Event) => {
      await this.apiService.unsubscribeAll();

      let selectedClientId = (evt.target as HTMLInputElement).value;
      console.log(selectedClientId);

      await this.apiService.unsubscribeAll();

      if (selectedClientId) {
        await this.apiService.subscribe(selectedClientId);
      }
    });*/

    this.apiService.addLogListener('main', (clientId, log) => {
      console.log(log.obj.buf);
    });

    /*this.apiService.addStatusListener('main', (online) => {
      this.clientSelectItems.length = 1;

      for (let client of this.apiService.clients) {
        this.clientSelectItems.push({
          selected: this.apiService.subscribedClientIds.has(client.clientId),
          name: client.name,
          text: (client.connected ? '⬤' : '◯') + client.name,
          clientId: client.clientId
        });
      }
    });

    this.apiService.addClientStatusListener('main', (clientId, online) => {
      for (let item of this.clientSelectItems) {
        if (item.clientId === clientId) {
          item.text = (online ? '⬤' : '◯') + item.name;
        }
      }
    });*/
  }

  ngOnDestroy() {
    this.utilsService.removeResizeListener(
      this.mainMapElem.nativeElement
    );

    this.apiService.removeLogListener('main');
  }



  private _clientSelectValue: string = '';

  get clientSelectValue() {
    return this._clientSelectValue;
  }

  set clientSelectValue(clientId: string) {
    this._clientSelectValue = clientId;

    setTimeout(async () => {
      await this.apiService.unsubscribeAll();

      if (clientId !== '') {
        await this.apiService.subscribe(clientId);
      }
    }, 0);
  }

  get clientSelectItems() {
    let items: {
      selected: boolean,
      text: string,
      clientId: string
    }[] = [{
      selected: true,
      text: 'Disconnected',
      clientId: ''
    }];


    for (let client of this.apiService.clients) {
      let selected = this.apiService.subscribedClientIds.has(client.clientId);

      items.push({
        selected: selected,
        text: (client.connected ? '🟢' : '🔴') + ' ' + client.name,
        clientId: client.clientId
      });

      if (selected) {
        items[0].selected = false;
      }
    }

    return items;
  }
}
