// @flow

import React, { PureComponent, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Kjorskra.scss';
import walkingIcon from './walking.png';
import drivingIcon from './driving.png';
import bicyclingIcon from './bicycling.png';
import busIcon from './bus.png';
import busData from './bus.json';
import BusPlanner from './components/BusPlanner';
import TaxiPlanner from './components/TaxiPlanner';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

const Map = withScriptjs(
  withGoogleMap(({ mapOptions, kjorstadur }) => {
    return (
      <GoogleMap defaultZoom={mapOptions.zoom} center={mapOptions.center}>
        <Marker position={mapOptions.center}>
          <InfoWindow>
            <div>
              Kjörstaðurinn þinn er <b>{kjorstadur}</b>
            </div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    );
  })
);

class Itinery extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { duration, distance, type } = this.props;

    const translate = {
      walking: 'að labba',
      driving: 'að keyra',
      bicycling: 'að hjóla',
      bus: 'með Strætó',
    };

    const icons = {
      walkingIcon,
      drivingIcon,
      bicyclingIcon,
      busIcon
    };

    const icon = icons[`${type}Icon`];

    // TODO: Fix nánar link
    return (
      <li style={{backgroundImage: `url(${icon})`}} className={duration ? '' : s.faded}>
        <b>{duration ? Math.round(duration / 60) : '...'} mínútur</b> {translate[type]}.
        Sjá nánar á {' '}
        <a href="https://straeto.is" target="_blank">
          Google Maps
        </a>
      </li>
    )
  }
}

class Kjorskra extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired
  };
  state = {
    kennitala: '',
    data: null,
    isFetching: false,
    mapOptions: {
      zoom: 13,
      center: { lat: 65.7, lng: -19.6 }
    },
    currentAddress: null,
    currentAddressInput: '',
    driving: {},
    walking: {},
    bicycling: {},
    bussing: {},
  };
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.submit = this.submit.bind(this);
    this.submitCurrentAddress = this.submitCurrentAddress.bind(this);

    setTimeout(() => {}, 3000);
  }
  componentWillMount() {
    // if (__DEV__) {
    //   // To test
    //   this.setState({
    //     mapOptions: {
    //       zoom: 13,
    //       center: { lat: 64.1163028, lng: -21.7996805 }
    //     },
    //     data: {
    //       success: true,
    //       kennitala: '1234567890',
    //       nafn: 'Kristján Ingi Mikaelsson',
    //       logheimili: 'Melbær 14',
    //       kjordaemi: 'Reykjavíkurkjördæmi suður',
    //       sveitafelag: 'Reykjavík',
    //       kjorstadur: 'Árbæjarskóli',
    //       kjordeild: '5'
    //     },
    //     currentAddress: { lat: 64.11, lng: -21.79 },
    //   });
    //
    //   setTimeout(() => {
    //     this.setState({
    //       walking: { duration: 1500, distance: 1111 },
    //       bicycling: { duration: 1000, distance: 1234 },
    //       driving: { duration: 700, distance: 1357 },
    //       bussing: { duration: 1200, distance: 1200 },
    //     });
    //   }, 3000);
    // }
  }
  async getDistance({ from, to, mode }) {
    if (!process.env.BROWSER) return { distance: null, duration: null };
    return new Promise(resolve => {
      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        {
          origins: ['austurbrun 2'],
          destinations: ['arbaejarskoli'],
          travelMode: mode //BICYCLING,WALKING,DRIVING
        },
        results => {
          if (results.rows.length === 0) {
            console.error('No results from distance matrix');
            return;
          }

          let distance = null;
          let duration = null;

          results.rows.forEach(row => {
            row.elements.forEach(element => {
              if (element && element.distance) {
                distance = element.distance.value;
              }
              if (element && element.duration) {
                duration = element.duration.value;
              }
            });
          });

          resolve({
            distance,
            duration
          });
        }
      );
    });
  }
  async getBusDistance({ from , to }) {
    const now = new Date();
    const timestamp = `${now.getHours()}:${('0' + now.getMinutes()).substr(
      -2
    )}`;

    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    const url = `https://otp.straeto.is/otp/routers/default/plan?fromPlace=${from.lat()},${from.lng()}&toPlace=${to.lat()},${to.lng()}&time=${timestamp}&date=${date}&mode=TRANSIT,WALK&arriveBy=false&wheelchair=false&showIntermediateStops=false&numItineraries=1&locale=is`;

    const response = await this.context.fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });
    const data = await response.json();

    console.log('bus from and to:', from, to);
    console.log('bus response status:', response.status);
    console.log('bus response data:', data);

    // TODO: find the one with the shortest time.
    const { duration, legs } = data.plan.itineraries[0];
    const distance = legs.reduce((sum, leg) => {
      return sum + leg.distance;
    }, 0);

    return {
      distance,
      duration,
    };
  }
  async locationFromAddress(address) {
    if (!process.env.BROWSER) return this.state.mapOptions.center;

    // const distance = await this.getDistance({
    //   from: 'Austurbrun 2',
    //   to: 'Arbaejarskoli',
    //   mode: 'DRIVING'
    // });
    //
    // console.log('what is distance result', distance);

    return new Promise(resolve => {
      new window.google.maps.Geocoder().geocode(
        {
          address
        },
        (results, status) => {
          if (results.length === 0) {
            return resolve({
              invalidLocation: true
            });
          }
          console.log('here', results[0]);
          resolve({
            center: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            }
          });
        }
      );
    });
  }
  onInputChange(type, e) {
    this.setState({
      [type]: e.target.value
    });
  }
  async submit() {
    console.log('doing submit');
    const { kennitala } = this.state;

    this.setState({
      isFetching: true
    });

    let data;

    try {
      const response = await this.context.fetch(
        `https://kjorskra.kjosturett.is/leita/${kennitala}`
      );
      data = await response.json();
    } catch (e) {
      //@TODO handle
      console.error(e);

      this.setState({
        isFetching: false
      });
      return;
    }

    this.setState({
      isFetching: false,
      data
    });

    setTimeout(async () => {
      const options = await this.locationFromAddress(data.kjorstadur);

      this.setState({
        mapOptions: {
          zoom: 13,
          ...options
        }
      });
    }, 400);
  }
  async submitCurrentAddress() {
    console.log('submit');
    const { data, currentAddressInput, mapOptions } = this.state;

    const location = await this.locationFromAddress(currentAddressInput || data.logheimili);

    const position = {
      from: new window.google.maps.LatLng(
        location.center.lat,
        location.center.lng
      ),
      to: new window.google.maps.LatLng(
        mapOptions.center.lat,
        mapOptions.center.lng
      )
    };

    const walkingPromise = this.getDistance({
      ...position,
      mode: 'WALKING'
    });

    const bicyclingPromise = this.getDistance({
      ...position,
      mode: 'BICYCLING'
    });

    const drivingPromise = this.getDistance({
      ...position,
      mode: 'DRIVING'
    });

    const busPromise = this.getBusDistance({
      ...position,
    });

    const [walking, bicycling, driving, bussing] = await Promise.all([
      walkingPromise,
      bicyclingPromise,
      drivingPromise,
      busPromise,
    ]);

    console.log('what is location', location);
    console.log('what is walking', walking);
    console.log('what is bicycling', bicycling);
    console.log('what is driving', driving);
    console.log('what is bussing', bussing);

    this.setState({
      currentAddress: location.center,
      driving: driving,
      walking: walking,
      bicycling: bicycling,
      bussing: bussing,
    });
  }
  render() {
    const {
      kennitala,
      data,
      isFetching,
      mapOptions,
      currentAddress,
      currentAddressInput,
      walking,
      driving,
      bicycling,
      bussing,
    } = this.state;

    return (
      <div className={s.root}>
        {!data && (
          <div className={s.lookupContainer}>
            <input
              value={kennitala}
              type="text"
              placeholder="Settu inn kennitöluna þína"
              className={s.input}
              onChange={e => this.onInputChange('kennitala', e)}
            />
            <div onClick={this.submit} className={s.submit}>
              Fletta upp
            </div>
          </div>
        )}
        {data && (
          <div className={s.results}>
            <div>
              <p>
                Hæ {data.nafn}.<br />
                <b>Kjörstaðurinn</b> þinn er:
              </p>
              <p className={s.kjorstadur}>
                {data.kjorstadur}, {data.sveitafelag}
              </p>
              <p>
                Þú ert í <b>kjördeild</b>{' '}
                <i>{data.kjordeild}</i> og þú greiðir
                atkvæði í <b>kjördæminu</b> <i>{data.kjordaemi}</i>.
              </p>
              {!currentAddress && (
                <div>
                  <h3>Nú þurfum við bara að koma þér á kjörstað! Hvar ert þú núna?</h3>
                  <div className={s.currentAddressContainer}>
                    <input
                      value={currentAddressInput}
                      type="text"
                      placeholder={data.logheimili}
                      className={s.input}
                      onChange={e =>
                        this.onInputChange('currentAddressInput', e)}
                    />
                    <div
                      onClick={this.submitCurrentAddress}
                      className={s.submit}
                    >
                      Áfram
                    </div>
                  </div>
                </div>
              )}
              {currentAddress && (
                <div>
                  <h2>Koma ser a kjorstad:</h2>
                  <ul className={s.itineries}>
                    <Itinery type="walking" {...walking} />
                    <Itinery type="bicycling" {...bicycling} />
                    <Itinery type="driving" {...driving} />
                    <Itinery type="bus" {...bussing} />
                  </ul>
                </div>
              )}
            </div>

            {mapOptions.invalidLocation && <div>INVALIDLOCATION</div>}

            {!mapOptions.invalidLocation && (
              <div className={s.mapContainer}>
                <Map
                  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDJ6iS5zhPH3xJQM6WPlx5YvgHSvgA3Ceo&libraries=geometry,drawing,places"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: '100%', width: '100%' }} />}
                  mapOptions={mapOptions}
                  kjorstadur={data.kjorstadur}
                />
              </div>
            )}
          </div>
        )}
        {isFetching && <div>Næ í gögn</div>}

        <p className={s.disclaimer}>
          Uppflettingar eru gerðar í Kjörskrá. Gögn eru ekki geymd.
        </p>
      </div>
    );
  }
}

export default withStyles(s)(Kjorskra);
