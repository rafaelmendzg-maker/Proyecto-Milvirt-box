import React from 'react';
import RadarPartition from '../Radar/RadarPartition';
import OperatorPartition from '../Operator/OperatorPartition';
import CommsPartition from '../Comms/CommsPartition';

const HypervisorPanel = () => {
  console.log('HypervisorPanel renderizando');
  return (
    <>
      <div className="hypervisor-panel">...</div>
      <div className="partitions-grid">
        <RadarPartition />
        <OperatorPartition />
        <CommsPartition />
      </div>
    </>
  );
};
export default HypervisorPanel;

