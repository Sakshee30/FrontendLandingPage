import { motion } from 'framer-motion';

const CAR_ASSET = '/figma-assets/ziplin-sports-car.png';

export function DrivingMascotCar() {
  return (
    <div className="relative h-full w-full [transform-style:preserve-3d]">
      <div className="absolute bottom-[4%] left-[11%] h-[12%] w-[78%] rounded-[50%] bg-[#081c45]/25 blur-md" />

      <motion.img
        src={CAR_ASSET}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain [backface-visibility:hidden]"
      />

      <motion.img
        src={CAR_ASSET}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain [backface-visibility:hidden]"
        style={{ rotateY: 180, scaleX: -1 }}
      />
    </div>
  );
}
