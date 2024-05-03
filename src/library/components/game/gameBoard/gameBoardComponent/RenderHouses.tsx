import { RenderHousesProps } from "@library/types/gameboard/GameboardTypes.ts";
import Model from "./Model.tsx";

export function RenderHouses({ houses }: RenderHousesProps) {
    return (
      <>
        {houses.map((house) => (
          <Model
            key={house.cornerIndex}
            modelPath="/assets/house.glb"
            position={[
              house.position[0],
              house.position[1],
              house.position[2] + 10,
            ]}
            scale={[7, 7, 7]}
            rotation={[0, 0, 0]}
            color={house.color || "#FFC0CB"}
          />
        ))}
      </>
    );
  }