import React from 'react'
import {Card, CardContent, Typography, CardActionArea} from '@material-ui/core';
import './InfoBox.css'

function InfoBox({ title, cases, total, active, isRed, isGreen, isOrange, casesStyle, ...props}) {
    var cardStyle={
        width: '30%',
        height: '20%',
    }
    
    return (
  
        <Card i
          onClick={props.onClick}
          className={`infoBox ${active && "infoBox--selected"} ${
             isRed && "infoBox--red"
            } ${isGreen &&"infoBox--green"} ${isOrange && 'infoBox--orange'}`} 
          style={cardStyle}
        >
          <CardActionArea>
            <CardContent>
                <Typography color='textSecondary' gutterBottom>
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${isGreen && "infoBox__cases--green"} ${isOrange && 'infoBox__cases--orange'}`}>{cases}</h2>
                <div style={casesStyle} />
                <Typography className='infoBox_total'>{total}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    )
}

export default InfoBox
