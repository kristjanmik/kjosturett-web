import React from 'react';
import Kjorskra from './Kjorskra';
import Layout from '../../components/Layout';

export default ({ params }) => {
  let { nidurstada } = params;

  let nidurstadaObj = null;

  if (nidurstada) {
    try {
      if (process.env.BROWSER) {
        nidurstada = atob(nidurstada);
      } else {
        //@TODO fix the server side rendering wrong text cuz lame encoding, need iso-8859-1
        nidurstada = Buffer.from('nidurstada', 'base64').toString('utf-8');
      }

      nidurstada = nidurstada.split('|');
    } catch (e) {
      //@TODO polyfil the base64 decoding
      nidurstada = [];
    }

    const [fornafn, kjorstadur, kjordeild, kjordaemi] = nidurstada;

    nidurstadaObj = {
      fornafn,
      kjorstadur,
      kjordeild,
      kjordaemi,
    };
  }

  const title = nidurstadaObj
    ? `Kjörstaðurinn minn er ${nidurstadaObj.kjorstadur}`
    : 'Hvar á ég að kjósa?';
  return {
    chunks: ['kjorskra'],
    title: `${title} - Kjóstu Rétt`,
    path: '/kjorskra',
    description:
      'Veist ekki HVAR þú átt að kjósa? Flettu upp þínum kjörstað með einföldu uppflettingartóli. Við finnum einnig út bestu leiðina fyrir þig til að komast á kjörstað!',
    component: (
      <Layout page="kjorskra" title="Hvar á ég að kjósa?">
        <Kjorskra
          nidurstada={nidurstadaObj}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDJ6iS5zhPH3xJQM6WPlx5YvgHSvgA3Ceo&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
        />
      </Layout>
    ),
  };
};
