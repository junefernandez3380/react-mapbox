import React, {Component} from 'react';
import { connect } from 'react-redux';

class InfoPanel extends Component {
  render() {
    const { mapPoints } = this.props;
    console.log('mapPoints', mapPoints)
    const concreteCount = mapPoints.filter(point => point.properties.material === 'Concrete').length;
    const bitumenCount = mapPoints.filter(point => point.properties.material === 'Bitumen').length;
    const gravelCount = mapPoints.filter(point => point.properties.material === 'Gravel').length;
    const others = mapPoints.length - concreteCount - bitumenCount - gravelCount;
    const zerotofifty = mapPoints.filter(point => point.properties.area_>=0 && point.properties.area_<50).length;
    const fiftytotwohundred = mapPoints.filter(point => point.properties.area_>=50 && point.properties.area_<200).length;
    const biggerthantwohundred = mapPoints.filter(point => point.properties.area_>=200).length;
    return (
      <div className = "control-panel">
        <h3>Info</h3>
        <p>By material</p>
        <span>Concrete: {concreteCount}</span><br/>
        <span>Bitumen: {bitumenCount}</span><br/>
        <span>Gravel: {gravelCount}</span><br/>
        <span>Others: {others}</span><br/>
        <p>By Area</p>
        <span>0 to 50 -  {zerotofifty}</span><br/>
        <span>50 to 200 -  {fiftytotwohundred}</span><br/>
        <span>200 to 565 -  {biggerthantwohundred}</span><br/>
      </div>
    );
  }
}

export default connect(state => ({ mapPoints: state.mapPoints }))(InfoPanel);

