import React from 'react';
import Kjorskra from './Kjorskra';
import Layout from '../../components/Layout';

export default ({ params, url }) => {
  let { nidurstada } = params;

  let nidurstadaObj = null;
  let ogImage = null;

  if (nidurstada) {
    try {
      if (process.env.BROWSER) {
        nidurstada = atob(nidurstada);
      } else {
        nidurstada = Buffer.from(nidurstada, 'base64').toString('binary');
      }

      nidurstada = nidurstada.split('|');

      const [
        fornafn,
        kjorstadur,
        kjordeild,
        kjordaemi,
        coordinates
      ] = nidurstada;

      if (coordinates) {
        ogImage = `https://kjosturett.is/og-image-kjorskra/${coordinates
          .split(',')
          .join('%2C')}`;
      }

      nidurstadaObj = {
        fornafn,
        kjorstadur,
        kjordeild,
        kjordaemi
      };
    } catch (e) {}
  }

  const title = nidurstadaObj
    ? `Kjörstaðurinn minn er ${nidurstadaObj.kjorstadur}`
    : 'Hvar á ég að kjósa?';
  return {
    chunks: ['kjorskra'],
    title: `${title} - Kjóstu Rétt`,
    path: url,
    ogImage,
    description:
      'Veist ekki HVAR þú átt að kjósa? Flettu upp þínum kjörstað með einföldu uppflettingartóli. Við finnum einnig út bestu leiðina fyrir þig til að komast á kjörstað!',
    component: (
      <Layout page="kjorskra" title="Hvar á ég að kjósa?">
        <Kjorskra
          nidurstada={nidurstadaObj}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAWfToca-SwGGN9_2MnUHL1V5xSESYoAAk&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
        />
      </Layout>
    )
  };
};
