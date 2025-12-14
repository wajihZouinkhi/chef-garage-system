import { FaCar, FaBus, FaTractor } from 'react-icons/fa';
import { GiElectric } from 'react-icons/gi';

export const vehicleIcons = {
  car: { icon: FaCar, label: 'Car' },
  bus: { icon: FaBus, label: 'Bus' },
  tractor: { icon: FaTractor, label: 'Tractor' },
  generator: { icon: GiElectric, label: 'Generator' }
};

export const getVehicleIcon = (type: string) => {
  return vehicleIcons[type as keyof typeof vehicleIcons] || vehicleIcons.car;
};
