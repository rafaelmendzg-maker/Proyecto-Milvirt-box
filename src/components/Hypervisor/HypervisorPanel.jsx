import React from 'react';
import RadarPartition from '../Radar/RadarPartition';
import OperatorPartition from '../Operator/OperatorPartition';
import CommsPartition from '../Comms/CommsPartition';
import Metrics from './Metrics';

const HypervisorPanel = () => {
  console.log('HypervisorPanel renderizando');
  return (
    <>
      <div className="hypervisor-panel">  <Metrics /> </div>
      <div className="partitions-grid">  
        
        <RadarPartition />
        <OperatorPartition />
        <CommsPartition />
        
      </div>
    </>
  );
};
export default HypervisorPanel;

