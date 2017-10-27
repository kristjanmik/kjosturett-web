// @flow

import React, { PureComponent, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Kjorskra.scss';
import walkingIcon from './walking.png';
import drivingIcon from './driving.png';
import bicyclingIcon from './bicycling.png';
import busIcon from './bus.png';
import busData from './bus.json';
import Autocomplete from './Autocomplete';
import OpeningHours from './OpeningHours';
import history from '../../history';

import { clean as cleanKennitala, isPerson } from 'kennitala';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

const Map = withGoogleMap(({ mapOptions, kjorstadur }) => {
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
});

const getItineryInfo = ({ duration, distance, type, from, to }) => {
  return {
    walking: {
      text: 'að labba',
      icon: walkingIcon,
      link: `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=walking`,
      linkText: 'Google Maps'
    },
    driving: {
      text: 'að keyra',
      icon: drivingIcon,
      link: `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=driving`,
      linkText: 'Google Maps'
    },
    bicycling: {
      text: 'að hjóla',
      icon: bicyclingIcon,
      link: `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=bicycling`,
      linkText: 'Google Maps'
    },
    bussing: {
      text: 'með strætó',
      icon: busIcon,
      link: `https://straeto.is`,
      linkText: 'Strætó.is'
    }
  }[type];
};

class Itinery extends PureComponent {
  render() {
    const { duration, distance } = this.props;

    const { text, icon, link, linkText } = getItineryInfo(this.props);

    return (
      <li className={cx(!duration ? s.faded : null)}>
        <div className={s.icon} style={{ backgroundImage: `url(${icon})` }} />
        <div>
          <b>{duration ? Math.round(duration / 60) : '...'} mínútur</b>&nbsp;{text}.
          <div>
            Sjá nánar á &nbsp;
            <a href={link} target="_blank">
              {linkText}
            </a>
          </div>
        </div>
      </li>
    );
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
    fetchError: '',
    mapOptions: {
      zoom: 13,
      center: { lat: 65.7, lng: -19.6 }
    },
    currentAddress: null,
    driving: {},
    walking: {},
    bicycling: {},
    bussing: {} //Stupid, but consistency
  };
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.submit = this.submit.bind(this);
    this.submitCurrentAddress = this.submitCurrentAddress.bind(this);
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
    //     }
    //   });
    //
    //   this.setState({
    //     currentAddress: { lat: 64.11, lng: -21.79 }
    //   });
    //
    //   // setTimeout(() => {
    //   this.setState({
    //     walking: { duration: 1500, distance: 1111 },
    //     bicycling: { duration: 1000, distance: 1234 },
    //     driving: { duration: 700, distance: 1357 },
    //     bussing: { duration: 1200, distance: 1200 }
    //   });
    //   // }, 3000);
    // }
  }
  isKennitalaValid() {
    return isPerson(this.state.kennitala);
  }
  async getDistance({ from, to, costing }) {
    const json = {
      locations: [
        { lat: from.lat(), lon: from.lng() },
        { lat: to.lat(), lon: to.lng() }
      ],
      directions_options: { narrative: false },
      costing
    };

    const url = [
      'https://valhalla.mapzen.com/route?api_key=mapzen-pRTGdQw&json=',
      JSON.stringify(json)
    ].join('');

    let response;

    try {
      response = await this.context.fetch(url);
      const data = await response.json();
      const result = data.trip.summary;

      return {
        distance: result.length * 1000,
        duration: result.time
      };
    } catch (error) {
      console.error('Error fetching distance', response && response.status, error);
      return {
        distance: null,
        duration: null
      };
    }
  }
  async getBusDistance({ from, to }) {
    console.log('getBusDistance', from, to);
    const now = new Date();
    const timestamp = `${now.getHours()}:${('0' + now.getMinutes()).substr(
      -2
    )}`;

    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    const url = [
      'https://otp.straeto.is/otp/routers/default/plan?fromPlace=',
      `${from.lat()},${from.lng()}`,
      '&toPlace=',
      `${to.lat()},${to.lng()}`,
      '&time=',
      timestamp,
      '&date=',
      date,
      '&mode=TRANSIT,WALK&arriveBy=false&wheelchair=false&showIntermediateStops=false&numItineraries=1&locale=is'
    ].join('');

    const response = await this.context.fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });
    const data = await response.json();

    if (response.status !== 200 || !data.plan) {
      //@TODO handle bus error
      console.error('Error fetching bus data', response.status, response);
      return {
        distance: null,
        duration: null
      };
    }

    let shortestTrip = data.plan.itineraries[0];

    data.plan.itineraries.forEach(itinery => {
      if (shortestTrip.duration > itinery.duration) shortestTrip = itinery;
    });

    const { duration, legs } = shortestTrip;
    const distance = legs.reduce((sum, leg) => {
      return sum + leg.distance;
    }, 0);

    return {
      distance,
      duration
    };
  }
  async locationFromPlace(place) {
    if (place.geometry) {
      return {
        center: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      };
    }
    return this.locationFromAddress(place.name);
  }
  async locationFromAddress(address) {
    const url = [
      'https://search.mapzen.com/v1/search',
      '?api_key=mapzen-pRTGdQw',
      '&size=1',
      '&layers=venue,address',
      '&boundary.country=is',
      '&text=',
      address
    ].join('');
    const response = await this.context.fetch(url);

    try {
      const data = await response.json();

      const { coordinates } = data.features[0].geometry;

      return {
        center: {
          lat: coordinates[1],
          lng: coordinates[0]
        }
      }
    } catch (e) {
      console.error('Error geocoding address', response.status);
      return {
        invalidLocation: true,
      };
    }
  }
  onAutocompleteMounted = ref => {
    this.autocomplete = ref;
  };
  onInputChange(type, e) {
    this.setState({
      [type]: e.target.value
    });
  }
  async submit(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    console.log('doing submit');
    const { kennitala } = this.state;

    if (!this.isKennitalaValid(kennitala)) {
      console.log('Not a valid kennitala');
      return;
    }

    this.setState({
      isFetching: true,
      fetchError: ''
    });

    let data;

    try {
      const response = await this.context.fetch(
        `https://kjorskra.kjosturett.is/leita/${cleanKennitala(kennitala)}`
      );
      data = await response.json();

      if (!data.success) {
        throw data;
      }
    } catch (e) {
      console.error(e);

      const newState = {
        isFetching: false,
        fetchError: 'Villa kom upp!'
      };

      if (e.success === false && e.message === 'Kennitala not found') {
        newState.fetchError = 'Kennitala fannst ekki!';
      }

      this.setState(newState);
      return;
    }

    this.setState({
      isFetching: false,
      data
    });

    const options = await this.locationFromAddress(`${data.kjorstadur}, ${data.sveitafelag}`);

    this.setState({
      mapOptions: {
        zoom: 13,
        ...options
      }
    });

    const { nafn, kjorstadur, kjordeild, kjordaemi } = data;

    const hash = btoa(
      `${nafn.split(
        ' '
      )[0]}|${kjorstadur}|${kjordeild}|${kjordaemi}|${options.center.lat.toFixed(
        4
      )},${options.center.lng.toFixed(4)}`
    );

    history.replace(`/kjorskra/${encodeURIComponent(hash)}`);
  }
  async submitCurrentAddress(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const { mapOptions } = this.state;
    const lookupPlace = this.autocomplete.getPlace();

    this.setState({
      isFetching: true,
      fetchError: ''
    });

    const location = await this.locationFromPlace(lookupPlace);

    this.setState({
      isFetching: false
    });

    if (location.invalidLocation) {
      this.setState({
        fetchError: 'Heimilisfang fannst ekki!'
      });
      return;
    }

    this.setState({
      currentAddress: location.center
    });

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

    //Look up all the itineries and emit them asynchronous
    this.getDistance({
      ...position,
      costing: 'pedestrian'
    }).then(data => this.setState({ walking: data }));

    this.getDistance({
      ...position,
      costing: 'bicycle'
    }).then(data => this.setState({ bicycling: data }));

    this.getDistance({
      ...position,
      costing: 'auto'
    }).then(data => this.setState({ driving: data }));

    this.getBusDistance({
      ...position
    }).then(data => this.setState({ bussing: data }));
  }
  getItineriesByDistance({ from, to, types }) {
    let itineries = [
      'walking',
      'bicycling',
      'driving',
      'bussing'
    ].map(type => ({
      type,
      data: types[type],
      from,
      to
    }));

    itineries.sort((a, b) => {
      if (a.data.duration > b.data.duration) return 1;
      if (a.data.duration < b.data.duration) return -1;
      return 0;
    });

    return itineries;
  }
  render() {
    const { nidurstada } = this.props;

    const {
      kennitala,
      data,
      isFetching,
      fetchError,
      mapOptions,
      currentAddress,
      walking,
      driving,
      bicycling,
      bussing
    } = this.state;

    return (
      <div className={s.root}>
        <div className={`${s.background} ${data ? s.backgroundgone : null}`} />
        {!data && (
          <div>
            <div className={s.lookupContainer}>
              {nidurstada && (
                <div>
                  <h3 className={s.friendHeading}>
                    <b>{nidurstada.fornafn}</b> er í kjördæminu{' '}
                    <b>{nidurstada.kjordaemi}</b> og kjörstaðurinn er{' '}
                    <b>{nidurstada.kjorstadur}</b>.
                  </h3>
                  <h3>En stóra spurningin er, hvar kýst þú?</h3>
                </div>
              )}
              {!nidurstada && <h3>Finnum út úr því hvar þú átt að kjósa!</h3>}

              <div className={s.lookupWrap}>
                <input
                  autoFocus
                  value={kennitala}
                  type="number"
                  pattern="[\d]*"
                  placeholder="Sláðu inn kennitöluna þína"
                  className={s.input}
                  onChange={e => this.onInputChange('kennitala', e)}
                  onKeyUp={e => {
                    e.keyCode === 13 && this.submit();
                  }}
                />
                <input
                  onClick={this.submit}
                  type="button"
                  disabled={!this.isKennitalaValid(kennitala)}
                  className={s.submit}
                  value="Leita"
                />
              </div>
            </div>
          </div>
        )}
        {data && (
          <div className={s.results}>
            <div className={s.leftResults}>
              <p>
                Hæ {data.nafn.split(' ')[0]}, <b>kjörstaðurinn</b> þinn er:
              </p>
              <p className={s.kjorstadur}>
                {data.kjorstadur}, {data.sveitafelag}
              </p>
              <p className={s.votingInfo}>
                Þú ert í <b>kjördeild</b> <i>{data.kjordeild}</i> og þú greiðir
                atkvæði í <b>kjördæminu</b> <i>{data.kjordaemi}</i>.
              </p>
              <OpeningHours sveitafelag={data.sveitafelag} />
              {!currentAddress && (
                <div className={s.currentAddressBox}>
                  <h3>Nú þurfum við bara að koma þér á kjörstað!</h3>
                  <form onSubmit={this.submitCurrentAddress}>
                    <div className={s.currentAddressContainer}>
                      <Autocomplete
                        ref={this.onAutocompleteMounted}
                        type="text"
                        placeholder="Núverandi heimilisfang"
                        className={s.input}
                      />
                      <button type="submit" className={s.submit}>
                        Áfram
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {currentAddress && (
                <div className={s.itineriesBox}>
                  <h3>Skelltu þér á kjörstað, þú ert aðeins...</h3>
                  <ul className={s.itineries}>
                    {this.getItineriesByDistance({
                      from: currentAddress,
                      to: mapOptions.center,
                      types: {
                        walking,
                        bicycling,
                        driving,
                        bussing
                      }
                    }).map(itinery => (
                      <Itinery
                        key={itinery.type}
                        {...itinery.data}
                        type={itinery.type}
                        from={itinery.from}
                        to={itinery.to}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {mapOptions.invalidLocation && <div>Röng staðsetning</div>}

            {!mapOptions.invalidLocation && (
              <div className={s.mapContainer}>
                <Map
                  containerElement={
                    <div style={{ height: `100%`, width: '100%' }} />
                  }
                  mapElement={<div style={{ height: '100%', width: '100%' }} />}
                  mapOptions={mapOptions}
                  kjorstadur={data.kjorstadur}
                />
              </div>
            )}
          </div>
        )}
        {
          <div className={s.disclaimer}>
            {isFetching && (
              <div className={`${s.errormsg} ${s.fetching}`}>Næ í gögn</div>
            )}
            {fetchError && (
              <div className={`${s.errormsg} ${s.fetchError}`}>
                {fetchError}
              </div>
            )}
            {/* <p>Uppflettingar eru gerðar í Kjörskrá. Gögn eru ekki geymd.</p> */}
          </div>
        }
      </div>
    );
  }
}

export default withScriptjs(withStyles(s)(Kjorskra));
