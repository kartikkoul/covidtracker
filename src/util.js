import React from 'react';
import numeral from'numeral';
import {Circle, Popup} from 'react-leaflet';

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 2000,
    },
  };

export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a, b) => (a.cases > b.cases ? -1:1));
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType='cases') => (
    data.map(country => (
        <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.2}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
            Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
        } > 
        <Popup>
            <div className='infoContainer'>
              <div className='infoFlag' style={{ backgroundImage: `url(${country.countryInfo.flag})`}}/>
              <div className='infoName'>{country.country}</div>
              <div className='infoConfirmed'> Cases: {numeral(country.cases).format('0,0')} </div>
              <div className='infoRecovered'> Recovered: {numeral(country.recovered).format('0,0')} </div>
              <div className='infoDeaths'> Deaths: {numeral(country.deaths).format('0,0')} </div>
            </div>
        </Popup>
        </Circle>
    ))
);