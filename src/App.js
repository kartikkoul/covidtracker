import React, { useState, useEffect } from 'react';
import  './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox.js';
import Map from './Map.js';
import Table from './Table.js';
import numeral from 'numeral';
import { sortData, prettyPrintStat } from './util.js'
import LineGraph from './LineGraph.js';
import bimg from './images/brian-mcgowan-7OabDHeImsA-unsplash.jpg'
import 'leaflet/dist/leaflet.css';

// https://disease.sh/v3/covid-19/countries

const App = () => {

  //State is how you declare variables
  const [country, setInputCountry] = useState("worldwide");
  const [countries, setCountries] =useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[])
  useEffect(() => {
    const getCountriesData = async() =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        let sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange =async (event) =>{
    const countryCode =event.target.value;

    console.log('New event occurs...', countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setInputCountry(countryCode);
      setCountryInfo(data);
      if (countryCode === 'worldwide'){
        setMapCenter({lat: 34.80746, lng: -40.4796});
      }
      else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      }
      setMapZoom(4);
    });
   };

   console.log('COUNTRY INFO::', countryInfo);

   const casesToday ={
     width:'100%',
     backgroundImage:'./images/covidattack.png'
   }
  return (
    <div 
       className="app"
       style={{ backgroundImage:`url(${bimg})`}}
     >
      <div className='app_Left'>

        <div className='appheader' >

         <h1>COVID19 TRACKER</h1>
          <FormControl className='app_dropdown'>
            <Select
             variant='outlined'
             onChange={onCountryChange}
             value={country}
             color='white'
             >

             <MenuItem value='worldwide'><strong>Worldwide</strong></MenuItem>
               {
                 countries.map((country) => 
                 <MenuItem value={country.value}><strong>{country.name}</strong></MenuItem>
                 )
               }
            </Select>


          </FormControl>


        </div>
      
        <div className='appstats'>
         <InfoBox
           active={casesType==='cases'}
           className='today'
           casesStyle={casesToday}
           onClick={(event)=>setCasesType('cases')}
           title='Coronavirus Cases' 
           isRed
           cases={prettyPrintStat(countryInfo.todayCases) }
           total={numeral(countryInfo.cases).format('0.0a')}
          />
         <InfoBox
           active={casesType==='recovered'}
           onClick={(event)=>setCasesType('recovered')}
           title='Recovered' 
           isGreen
           cases={prettyPrintStat(countryInfo.todayRecovered) }
           total={numeral(countryInfo.recovered).format('0.0a')}/>
         <InfoBox
           active={casesType==='deaths'}
           onClick={(event)=>setCasesType('deaths')}
           title='Deaths' 
           isOrange
           cases={prettyPrintStat(countryInfo.todayDeaths) }
           total={numeral(countryInfo.deaths).format('0.0a')}
          />


        </div>

        
        <Map 
         countries={mapCountries} 
         casesType={casesType}
         center={mapCenter} 
         zoom={mapZoom}/>

      </div>
    
      <Card className='app_Right'>
        <CardContent>
          <div className='app_info'>
           <h2>Live Cases By Country</h2>
           <Table countries={tableData}/>
           <h2>Worldwide new {casesType}</h2>
           <LineGraph casesType={casesType}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
